"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A bubble that trails the pointer and shows the contextual label from the
 * nearest [data-cursor-text] element. Fine pointers only — never on touch.
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = ref.current;
    if (!el) return;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { ...pos };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const host = (e.target as HTMLElement)?.closest?.("[data-cursor-text]");
      setLabel(host ? host.getAttribute("data-cursor-text") || "" : "");
    };

    const loop = () => {
      // Trails slightly behind the pointer.
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      el.style.translate = `${pos.x}px ${pos.y}px`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="cursor-bubble" data-active={label !== ""} aria-hidden="true">
      {label}
    </div>
  );
}
