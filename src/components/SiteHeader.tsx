"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import CropMarks from "./CropMarks";
import ScrambleText from "./ScrambleText";
import { navGroups, site, socials } from "@/data/site";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const root = document.documentElement;
    document.body.style.overflow = open ? "hidden" : "";
    /* overflow alone will not hold: Lenis turns wheel and touch into scripted
       scrolls, which move the page regardless. SmoothScroll watches this flag
       and pauses itself while the panel is up. */
    root.toggleAttribute("data-menu-open", open);
    return () => {
      document.body.style.overflow = "";
      root.removeAttribute("data-menu-open");
    };
  }, [open]);

  return (
    <>
      {/* `position: fixed` always opens a stacking context, so the blend has to
          live on the header itself — on a child it would only ever difference
          against the header's own empty backdrop, never the page beneath. */}
      <header className="site-header pointer-events-none fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
        <div className="flex items-start justify-between gutter py-5">
          <Link href="/" className="pointer-events-auto display text-2xl leading-none md:text-3xl">
            <ScrambleText text={site.wordmark} />
          </Link>

          {/* Paired columns, as on the reference. */}
          <nav className="pointer-events-auto hidden gap-x-14 lg:flex">
            {navGroups.map((group, i) => (
              <ul key={i} className="space-y-1">
                {group.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="eyebrow transition-opacity hover:opacity-60">
                      <ScrambleText text={item.count ? `${item.label} [${item.count}]` : item.label} />
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </nav>
        </div>
      </header>

      {/* Toggle. Kept outside the blended layer: differenced, the solid ink
          pill would invert to paper and vanish against a light page. Hidden
          while the panel is open, which draws its own row. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label="Open menu"
        className={`fixed right-6 top-5 z-50 rounded-[2px] bg-[#333] px-4 py-3 text-white md:right-8 lg:hidden ${
          open ? "hidden" : ""
        }`}
      >
        <span className="eyebrow">Menu</span>
      </button>

      {/* Above the header, so the wordmark does not show through the panel. */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* Dim ground behind the panel; tapping it closes. */}
        <button
          type="button"
          aria-hidden="true"
          tabIndex={-1}
          onClick={() => setOpen(false)}
          className="absolute inset-0 w-full bg-[#00000080]"
        />

        {/* The panel is a box held off the viewport edge, framed at its four
            corners — matching the insets the persistent frame already uses. */}
        <div className="absolute inset-5 flex flex-col bg-paper p-5">
          {/* The bracket lines are drawn at -1px, so they land just outside
             the box: invisible as ink on the dimmed ground, and invisible as
             paper flush against the panel. A 2px nudge puts them on the white
             edge itself, where they read as the border of the box. */}
          <CropMarks className="m-0.5" />
          {/* Label left, close right. */}
          <div className="flex items-center justify-between">
            <span className="rounded-[2px] bg-[#333] px-4 py-3 text-white">
              <span className="eyebrow">Menu</span>
            </span>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="rounded-[2px] bg-[#333] px-4 py-2 leading-none text-white"
            >
              <span aria-hidden="true" className="block text-[1.5rem]">&times;</span>
            </button>
          </div>

          {/* Reference spaces this list by gap rather than per-item padding. */}
          <nav className="hairline mt-5 flex flex-col gap-5 pt-5">
            {navGroups.flat().map((item) => (
              <Link key={item.label} href={item.href} className="eyebrow text-[1.2rem]">
                <ScrambleText text={item.count ? `${item.label} [${item.count}]` : item.label} />
              </Link>
            ))}
          </nav>

          <div className="hairline mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="eyebrow transition-opacity hover:opacity-60"
              >
                {s.label} &#8599;
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
