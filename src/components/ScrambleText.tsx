"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* The reference's scramble, as measured: a 0.65s power1.out tween in which
   about 60% of the characters scramble, the glyphs are redrawn every 60ms,
   and every character snaps back together at 75% progress. Roughly one in
   seven scrambled glyphs takes the accent colour. */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@";
const DURATION = 650;
const SETTLE_AT = 0.75;
const FRAME_MS = 60;
const SCRAMBLE_SHARE = 0.6;
const ACCENT_SHARE = 0.15;

type Cell = { char: string; accent: boolean };

const settle = (text: string): Cell[] => text.split("").map((char) => ({ char, accent: false }));
const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);
const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/**
 * trigger="hover" binds to the nearest link/button so the whole control is hot;
 * trigger="view" runs once when the text scrolls into place;
 * trigger="mount" runs once as soon as it renders (remount it via key to replay).
 */
export default function ScrambleText({
  text,
  className = "",
  trigger = "hover",
  speed = 1,
}: {
  text: string;
  className?: string;
  trigger?: "hover" | "view" | "mount";
  speed?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef(0);
  /* Cells are stored with the text they were drawn for, so a new text renders
     settled straight away instead of resetting through an effect. */
  const [drawn, setDrawn] = useState(() => ({ text, cells: settle(text) }));
  const cells = drawn.text === text ? drawn.cells : settle(text);
  const setCells = useCallback((next: Cell[]) => setDrawn({ text, cells: next }), [text]);

  const run = useCallback(() => {
    cancelAnimationFrame(rafRef.current);

    const chars = text.split("");
    const candidates = chars.flatMap((c, i) => (c === " " ? [] : [i]));
    const picked = new Set(candidates.filter(() => Math.random() < SCRAMBLE_SHARE));
    if (picked.size === 0 && candidates.length) {
      picked.add(candidates[Math.floor(Math.random() * candidates.length)]);
    }

    const draw = () =>
      setCells(
        chars.map((char, i) =>
          picked.has(i)
            ? { char: randomGlyph(), accent: Math.random() < ACCENT_SHARE }
            : { char, accent: false },
        ),
      );

    const start = performance.now();
    let lastStep = -1;
    const tick = (now: number) => {
      const elapsed = (now - start) * speed;
      const progress = easeOutQuad(Math.min(1, elapsed / DURATION));
      if (progress >= SETTLE_AT) {
        setCells(settle(text));
        return;
      }
      const step = Math.floor(elapsed / FRAME_MS);
      if (step !== lastStep) {
        lastStep = step;
        draw();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [text, speed, setCells]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (trigger === "mount") {
      run();
      return () => cancelAnimationFrame(rafRef.current);
    }

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
        <span key={i} className="scramble-char" data-accent={cell.accent} aria-hidden="true">
          {cell.char}
        </span>
      ))}
    </span>
  );
}
