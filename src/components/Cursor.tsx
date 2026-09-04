"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A bubble that trails the pointer and shows the contextual label from the
 * nearest [data-cursor-text] element.
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

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = ref.current;
    if (!el) return;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { ...pos };
    let raf = 0;
    let awake = false;

    const loop = () => {
      // Trails slightly behind the pointer.
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      el.style.translate = `${pos.x}px ${pos.y}px`;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      // A finger should never summon it.
      if (e.pointerType === "touch") return;

      if (!awake) {
        awake = true;
        // Start where the pointer is, so it does not fly in from the middle.
        pos.x = target.x = e.clientX;
        pos.y = target.y = e.clientY;
        raf = requestAnimationFrame(loop);
      }

      target.x = e.clientX;
      target.y = e.clientY;

      const host = (e.target as HTMLElement)?.closest?.("[data-cursor-text]");
      setLabel(host ? host.getAttribute("data-cursor-text") || "" : "");
    };

    // Hide it again if the user switches to touch mid-session.
    const onTouch = () => {
      if (!awake) return;
      awake = false;
      cancelAnimationFrame(raf);
      setLabel("");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchstart", onTouch);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="cursor-bubble" data-active={label !== ""} aria-hidden="true">
      {label}
    </div>
  );
}
