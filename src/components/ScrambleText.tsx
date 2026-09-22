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
  const rafRef = useRef(0);
  const [cells, setCells] = useState<Cell[]>(() => settle(text));

  useEffect(() => setCells(settle(text)), [text]);

  const run = useCallback(() => {
    cancelAnimationFrame(rafRef.current);

    // Time-based (milliseconds), so the sweep lasts the same wall-clock time on
    // any refresh rate. Each character resolves left-to-right, but the whole
    // sweep is packed into a short fixed window — so a long label resolves just
    // as fast as a short one (it used to scale with length, dragging on ~1s),
    // and the whole thing is quick (~180ms) like the reference's hover.
    const chars = text.length;
    const SPREAD = 90; // ms the left-to-right sweep takes, any word length
    const JITTER = 60; // ms of per-character randomness
    const DURATION = SPREAD + JITTER + 30;
    const step = chars > 1 ? SPREAD / (chars - 1) : 0;
    const resolveAt = text.split("").map((_, i) => i * step + Math.random() * JITTER);

    const start = performance.now();
    const tick = (now: number) => {
      const t = (now - start) * speed; // speed > 1 resolves faster
      setCells(
        text.split("").map((char, i) => {
          if (char === " ") return { char, settled: true };
          if (t >= resolveAt[i]) return { char, settled: true };
          return { char: GLYPHS[Math.floor(Math.random() * GLYPHS.length)], settled: false };
        }),
      );
      if (t < DURATION) rafRef.current = requestAnimationFrame(tick);
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
