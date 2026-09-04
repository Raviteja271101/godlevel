"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Inertial scrolling for the whole document. Disabled for reduced-motion users. */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
touchMultiplier: 1.6,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // Let in-page anchors keep working.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement)?.closest?.('a[href^="#"]');
      const id = link?.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -100 });
    };
    document.addEventListener("click", onClick);

    /* The mobile menu sets data-menu-open on <html>. Pause here while it is
       up: body overflow stops the user scrolling, but not Lenis, which drives
       the page with scripted scrolls of its own. */
    const syncMenu = () => {
      if (document.documentElement.hasAttribute("data-menu-open")) lenis.stop();
      else lenis.start();
    };
    syncMenu();
    const menuWatch = new MutationObserver(syncMenu);
    menuWatch.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-menu-open"],
    });

    return () => {
      menuWatch.disconnect();
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return null;
}
