"use client";

import { useEffect, useRef, useState } from "react";
import ScrambleText from "./ScrambleText";

const FOLLOW_MS = 400;
/* GSAP's power3 is a quartic curve (power1 = quad, power2 = cubic, ...). */
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
/* GSAP starts a retargeted tween from its last tick, one frame before the
   move; measured on the reference, the follow runs exactly that far ahead. */
const HEAD_START_MS = 1000 / 60;

type Mode = "" | "active" | "active-edge";

/**
 * The reference's cursor (its initDynamicTextCursor, rebuilt without GSAP):
 *  - The wrapper rides the pointer (centred across, hanging below) via a 0.4s power3.out tween
 *    that is retargeted on every move (GSAP's quickTo).
 *  - Once per frame after a move — and after every scroll, so cards passing
 *    under a still pointer count — it checks what is under the pointer
 *    (elementFromPoint → [data-cursor-text]). That check alone decides the
 *    state: "active", or "active-edge" when the bubble would cross the right
 *    edge of the window, which slides it to the pointer's left.
 *  - The bubble scales and fades in from its centre over 0.1s, and the label
 *    scrambles in (0.65s).
 * Nothing is measured inside the follow loop, so it never forces a layout.
 *
 * Which input is in use is decided from the events themselves rather than
 * from a media query. A laptop with a touchscreen reports its primary
 * pointer as coarse with no hover, even while a trackpad is driving it, so
 * gating on `(pointer: fine)` switched the bubble off on exactly the
 * machines it should have run on. Touch events are ignored; the first mouse
 * or pen movement wakes it.
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [mode, setMode] = useState<Mode>("");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;

    const pos = { x: 0, y: 0 };
    const from = { x: 0, y: 0 };
    const to = { x: 0, y: 0 };
    let startedAt = 0;
    let raf = 0;
    let checkRaf = 0;
    let awake = false;
    let host: Element | null = null;
    let currentMode: Mode = "";

    const loop = () => {
      /* Same clock as onMove, and never below 0: a rAF timestamp can predate
         the move that restarted the tween, and a negative t through the ease
         sends the bubble backwards. */
      const t = Math.min(1, Math.max(0, (performance.now() - startedAt) / FOLLOW_MS));
      const k = easeOutQuart(t);
      pos.x = from.x + (to.x - from.x) * k;
      pos.y = from.y + (to.y - from.y) * k;
      // Centred on the pointer across, hanging just below it, as on the reference.
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translateX(-50%)`;
      raf = requestAnimationFrame(loop);
    };

    // What sits under the pointer, and whether the bubble would clip the edge.
    const check = () => {
      checkRaf = 0;
      const under = document.elementFromPoint(to.x, to.y)?.closest("[data-cursor-text]") ?? null;
      const edge = el.getBoundingClientRect().right >= window.innerWidth;
      const next: Mode = under ? (edge ? "active-edge" : "active") : "";
      if (next !== currentMode) {
        currentMode = next;
        setMode(next);
      }
      if (under !== host) {
        host = under;
        // Keep the old label while the bubble scales away.
        if (under) setLabel(under.getAttribute("data-cursor-text") || "");
      }
    };
    const scheduleCheck = () => {
      if (!checkRaf) checkRaf = requestAnimationFrame(check);
    };

    const onMove = (e: PointerEvent) => {
      // A finger should never summon it.
      if (e.pointerType === "touch") return;

      if (!awake) {
        awake = true;
        root.setAttribute("data-cursor-ready", "");
        // Start where the pointer is, so it does not fly in from the corner.
        pos.x = e.clientX;
        pos.y = e.clientY;
        raf = requestAnimationFrame(loop);
      }

      // Retarget from wherever the bubble is now, as quickTo does.
      from.x = pos.x;
      from.y = pos.y;
      to.x = e.clientX;
      to.y = e.clientY;
      startedAt = performance.now() - HEAD_START_MS;
      scheduleCheck();
    };

    const onScroll = () => {
      if (awake) scheduleCheck();
    };

    // Hide it again if the user switches to touch mid-session.
    const onTouch = () => {
      if (!awake) return;
      awake = false;
      root.removeAttribute("data-cursor-ready");
      cancelAnimationFrame(raf);
      host = null;
      currentMode = "";
      setMode("");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onTouch);
      root.removeAttribute("data-cursor-ready");
      cancelAnimationFrame(raf);
      cancelAnimationFrame(checkRaf);
    };
  }, []);

  return (
    <div ref={ref} className="cursor-anchor" data-cursor={mode} aria-hidden="true">
      <div className="cursor-bubble">
        <ScrambleText key={label} text={label} trigger="mount" />
        <svg viewBox="0 0 7 8" fill="none" className="cursor-icon">
          <path
            d="M7 5.25C5.90447 4.73684 4.86585 3.94737 3.86992 2.86842L3.04472 2.86842C3.51423 3.80263 3.96951 4.51316 4.41057 4.97368L1.01016 4.97368L1.01016 4.41556e-08L0 0L0 5.90789L4.41057 5.90789C3.96951 6.36842 3.51423 7.07895 3.04472 8L3.86992 8C4.86585 6.92105 5.90447 6.13158 7 5.63158V5.25Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
}
