"use client";

import { useEffect, useRef } from "react";

/**
 * Writes the hero's scroll progress (0 as it starts leaving, 1 once it has
 * gone) to --hero-p on the enclosing .hero, which .hero-drift turns into the
 * reference's parallax: the footage sinks 20% of the hero's height over one
 * hero-height of scroll, i.e. it moves at 0.8× the page.
 */
export default function HeroParallax() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const hero = ref.current?.closest<HTMLElement>(".hero");
    if (!hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      const r = hero.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / r.height));
      hero.style.setProperty("--hero-p", p.toFixed(4));
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

  return <span ref={ref} hidden />;
}
