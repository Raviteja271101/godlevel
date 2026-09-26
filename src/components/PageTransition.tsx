"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/data/site";

type Phase = "idle" | "cover" | "reveal";

const COVER_MS = 600;
const HOLD_MS = 500;
const REVEAL_MS = 800;
const GIVE_UP_MS = 4000;

/**
 * The reference's route change: an internal link click raises a black panel
 * over the page (0.6s), and only then navigates. Once the new route has
 * rendered the panel holds for 0.5s showing the tagline, then slides away
 * upward (0.8s). Back/forward navigations are left instant.
 *
 * Clicks are caught on window in the capture phase and stopped there, so
 * Next's own Link handler (delegated at the document) never sees them and
 * cannot navigate early.
 */
export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const pending = useRef(false);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  const reveal = useCallback(() => {
    clearTimers();
    timers.current.push(
      window.setTimeout(() => setPhase("reveal"), HOLD_MS),
      window.setTimeout(() => setPhase("idle"), HOLD_MS + REVEAL_MS),
    );
  }, [clearTimers]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !a.href || a.target === "_blank" || a.hasAttribute("download")) return;

      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      e.preventDefault();
      e.stopPropagation();
      if (pending.current) return;

      pending.current = true;
      clearTimers();
      setPhase("cover");
      timers.current.push(
        window.setTimeout(() => router.push(url.pathname + url.search + url.hash), COVER_MS),
        // If the route never changes (a failed fetch), do not leave the page covered.
        window.setTimeout(() => {
          if (!pending.current) return;
          pending.current = false;
          reveal();
        }, COVER_MS + GIVE_UP_MS),
      );
    };

    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [router, clearTimers, reveal]);

  // The new route has committed under the panel: hold, then reveal.
  useEffect(() => {
    if (!pending.current) return;
    pending.current = false;
    reveal();
  }, [pathname, reveal]);

  useEffect(() => clearTimers, [clearTimers]);

  return (
    <div className="page-transition" data-phase={phase} aria-hidden="true">
      <span className="eyebrow text-white">{site.tagline}</span>
    </div>
  );
}
