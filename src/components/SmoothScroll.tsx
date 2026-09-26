"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Inertial scrolling for the whole document. Disabled for reduced-motion users. */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* The reference's settings: Lenis defaults (lerp 0.1, touch multiplier 1)
       rather than a fixed-duration tween, which is what gives its scroll the
       lighter, more responsive feel. */
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      anchors: { offset: -100 },
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    /* The mobile menu sets data-menu-open on <html>; the cart drawer sets
       data-cart-open. Pause here while either is up: body overflow stops the
       user scrolling, but not Lenis, which drives the page with scripted
       scrolls of its own. */
    const syncPanels = () => {
      const root = document.documentElement;
      if (root.hasAttribute("data-menu-open") || root.hasAttribute("data-cart-open"))
        lenis.stop();
      else lenis.start();
    };
    syncPanels();
    const menuWatch = new MutationObserver(syncPanels);
    menuWatch.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-menu-open", "data-cart-open"],
    });

    return () => {
      menuWatch.disconnect();
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
