"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";

const DURATION = 1500;

/** Marks the document ready so above-the-fold reveals may start. */
const markLoaded = () => document.documentElement.setAttribute("data-loaded", "");

/**
 * First-visit loader: wordmark, a thin determinate bar and a percentage
 * counter, then the whole panel slides away. Repeat visits in the same
 * session skip straight past it.
 */
export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (sessionStorage.getItem("sl:loaded") || reduced) {
      markLoaded();
      setGone(true);
      return;
    }

    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      // Expo-out, so the count decelerates into 100.
      const eased = 1 - Math.pow(2, -10 * t);
      setProgress(Math.round(eased * 100));

      if (t < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }

      setProgress(100);
      sessionStorage.setItem("sl:loaded", "1");
      setLeaving(true);
      markLoaded();
      window.setTimeout(() => setGone(true), 900);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-night text-white transition-transform duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
      style={{ transform: leaving ? "translateY(-100%)" : "none" }}
    >
      <p className="display t-statement">{site.wordmark}</p>

      <div className="mt-8 h-px w-[170px] bg-white/25">
        <div
          className="h-px bg-white"
          style={{ width: `${progress}%`, transition: "width 120ms linear" }}
        />
      </div>

      <p className="mt-3 tabular-nums opacity-70">{progress}%</p>
    </div>
  );
}
