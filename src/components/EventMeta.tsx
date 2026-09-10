"use client";

import { useEffect, useRef } from "react";

/**
 * The single Date / Time / Location bar for an event page.
 *
 * It is `position: fixed` on purpose — the page-transition wrapper
 * (`.page-enter`) animates opacity and so isolates blend groups, which traps
 * `mix-blend-difference` for anything nested inside it (sticky/absolute alike).
 * A fixed element escapes that group and blends against the whole page, exactly
 * like the site header does — white over the dark hero, black over the pale copy.
 *
 * Scroll drives two things, written straight to the node (no re-render):
 *  - `top`: the bar rests on the hero's centre line, then glides up and pins
 *    just under the header.
 *  - `opacity`: it fades out once the copy proper arrives, so it never sits on
 *    top of the lower content.
 */
export default function EventMeta({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      const vh = window.innerHeight;
      const y = window.scrollY;
      const base = 76; // pinned position, just below the header

      // Glide: from ~42vh below the header down to the pinned spot, reached by
      // the time the page has scrolled ~42vh.
      const rest = vh * 0.42;
      const t = Math.min(1, y / (vh * 0.42));
      el.style.top = `${base + (1 - t) * rest}px`;

      // Fade: hold through the hero, then fade as the copy scrolls up.
      const fadeStart = vh * 0.95;
      const fadeEnd = vh * 1.15;
      const opacity =
        y <= fadeStart ? 1 : Math.max(0, 1 - (y - fadeStart) / (fadeEnd - fadeStart));
      el.style.opacity = String(opacity);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-x-0 z-40 hidden gap-6 gutter text-white mix-blend-difference sm:grid sm:grid-cols-12"
    >
      {children}
    </div>
  );
}
