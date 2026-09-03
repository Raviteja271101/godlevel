"use client";

import { Fragment, useEffect, useRef } from "react";

/**
 * Justified text whose words spread apart as it scrolls into view.
 *
 * The end state is ordinary justified text. The start state is the same
 * text set ranged left, which packs the words tightly. Measuring both gives
 * each word the distance it has to travel, and scroll progress interpolates
 * between them — so the line appears to stretch out to fill its measure.
 *
 * Justification only stretches full lines, so the last line of a paragraph
 * has nothing to travel and simply stays put, as it should.
 */
export default function SpreadWords({
  text,
  className = "",
  as: Tag = "p",
}: {
  text: string;
  className?: string;
  as?: "p" | "h1" | "h2" | "h3" | "div";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>(".spread-word"));
    if (!spans.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // Leave it justified and still.

    let offsets: number[] = [];
    let raf = 0;

    /** Distance each word must travel from packed to justified. */
    const measure = () => {
      spans.forEach((s) => {
        s.style.transform = "none";
      });

      el.style.textAlign = "justify";
      const justified = spans.map((s) => s.getBoundingClientRect().left);

      el.style.textAlign = "left";
      const packed = spans.map((s) => s.getBoundingClientRect().left);

      el.style.textAlign = "justify";
      offsets = spans.map((s, i) => packed[i] - justified[i]);
    };

    const apply = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      // Fully packed as it comes up from the bottom, fully spread by the
      // time the block has risen into the upper half of the screen.
      const from = vh * 0.95;
      const to = vh * 0.35;
      const p = Math.max(0, Math.min(1, (from - rect.top) / (from - to)));

      spans.forEach((s, i) => {
        const dx = offsets[i] * (1 - p);
        s.style.transform = dx ? `translateX(${dx.toFixed(2)}px)` : "none";
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };

    const onResize = () => {
      measure();
      apply();
    };

    // Wait for webfonts, or every measurement is taken against a fallback.
    const start = () => {
      measure();
      apply();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
    };

    if (document.fonts?.ready) document.fonts.ready.then(start);
    else start();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [text]);

  const words = text.split(" ");

  return (
    // @ts-expect-error — Tag is a constrained union of intrinsic elements.
    <Tag ref={ref} className={`text-justify ${className}`}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="spread-word">{word}</span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </Tag>
  );
}
