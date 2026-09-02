"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/*+-<>";

type Cell = { char: string; settled: boolean };

const settle = (text: string): Cell[] => text.split("").map((char) => ({ char, settled: true }));

/**
 * Randomises each character then resolves it left-to-right.
 * Unresolved characters flash the accent colour (see .scramble-char in globals.css).
 *
 * trigger="hover" binds to the nearest link/button so the whole control is hot;
 * trigger="view" runs once when the text scrolls into place.
 */
export default function ScrambleText({
  text,
  className = "",
  trigger = "hover",
  speed = 1,
}: {
  text: string;
  className?: string;
  trigger?: "hover" | "view";
  speed?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const frameRef = useRef(0);
  const rafRef = useRef(0);
  const [cells, setCells] = useState<Cell[]>(() => settle(text));

  useEffect(() => setCells(settle(text)), [text]);

  const run = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    frameRef.current = 0;

    // Each character gets its own resolve point, so the word unscrambles in order.
    const resolveAt = text.split("").map((_, i) => i * 2.2 + Math.random() * 12);
    const total = Math.max(...resolveAt) + 8;

    const tick = () => {
      const f = (frameRef.current += speed);
      setCells(
        text.split("").map((char, i) => {
          if (char === " ") return { char, settled: true };
          if (f >= resolveAt[i]) return { char, settled: true };
          return { char: GLYPHS[Math.floor(Math.random() * GLYPHS.length)], settled: false };
        }),
      );
      if (f < total) rafRef.current = requestAnimationFrame(tick);
      else setCells(settle(text));
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [text, speed]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (trigger === "view") {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            run();
            observer.unobserve(el);
          }
        },
        { rootMargin: "0px 0px -10% 0px" },
      );
      observer.observe(el);
      return () => observer.disconnect();
    }

    // Bind to the enclosing control so hovering anywhere on it fires the effect.
    const host = el.closest("a, button") ?? el;
    host.addEventListener("mouseenter", run);
    return () => {
      host.removeEventListener("mouseenter", run);
      cancelAnimationFrame(rafRef.current);
    };
  }, [trigger, run]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {cells.map((cell, i) => (
        <span key={i} className="scramble-char" data-scrambling={!cell.settled} aria-hidden="true">
          {cell.char}
        </span>
      ))}
    </span>
  );
}
