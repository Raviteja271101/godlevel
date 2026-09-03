"use client";

import { useEffect, useState } from "react";

const DURATION = 1500;

/** Hero box size at 0% and at 100%, before it expands out to full bleed. */
const SCALE_FROM = 0.12;
const SCALE_TO = 0.44;

/** Marks the document ready so above-the-fold reveals may start. */
const markLoaded = () => document.documentElement.setAttribute("data-loaded", "");

/**
 * First-visit loader. The hero video carries the animation — it opens as a
 * small centred box and grows with the count, then expands to full bleed once
 * this panel clears. Repeat visits in the same session skip straight past it.
 */
export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    /* A late restore can still fire as images grow the page, so hold the top
       while the intro runs. An anchored URL keeps its target. */
    const pinTop = () => {
      if (!window.location.hash) window.scrollTo(0, 0);
    };
    pinTop();
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
      root.style.setProperty("--load-scale", String(SCALE_FROM + eased * (SCALE_TO - SCALE_FROM)));

      if (t < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }

      setProgress(100);
      sessionStorage.setItem("sl:loaded", "1");
      setLeaving(true);
      // Dropping data-loaded in releases the scale, so the box grows to full.
      markLoaded();
      pinTop();
      window.setTimeout(() => setGone(true), 900);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (gone) return null;

  return (
    /* Transparent: the hero sits above this and supplies the pale ground, so
       only the readout is drawn here. */
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[102] flex flex-col items-center justify-end pb-[16vh] text-ink transition-opacity duration-500"
      style={{ opacity: leaving ? 0 : 1 }}
    >
      <p className="tabular-nums font-medium">{progress}%</p>

      <div className="mt-3 h-px w-[170px] bg-ink/25">
        <div
          className="h-px bg-ink"
          style={{ width: `${progress}%`, transition: "width 120ms linear" }}
        />
      </div>
    </div>
  );
}
