"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ScrambleText from "./ScrambleText";
import { navGroups, site, socials } from "@/data/site";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
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

      {/* Kept outside the blended layer: differenced, the solid ink pill would
          invert to paper and disappear against a light page. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="fixed right-6 top-5 z-50 rounded-[2px] bg-ink px-4 py-3 text-white md:right-8 lg:hidden"
      >
        <span className="eyebrow">{open ? "Close" : "Menu"}</span>
      </button>

      <div
        className={`fixed inset-0 z-40 bg-paper transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-full flex-col justify-between gutter pt-24 pb-10">
          <nav className="flex flex-col">
            {navGroups.flat().map((item, i) => (
              <Link key={item.label} href={item.href} className="hairline flex items-baseline gap-4 py-4">
                <span className="text-ink-30">[{String(i + 1).padStart(2, "0")}]</span>
                <span className="display text-4xl">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="eyebrow">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
