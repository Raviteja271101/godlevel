"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CropMarks from "./CropMarks";
import { partners, partnersCopy } from "@/data/partners";

/**
 * Partner tiers, using the same reel as the events page: a centred column of
 * cards with rails pinned either side. Whichever card crosses the centre of
 * the screen is drawn at full size; the rest sit smaller and lighter.
 *
 * On a phone the rails have nowhere to go, so the label leads, the cards
 * follow, and the closing line sits underneath.
 */
export default function PartnersReel() {
  const [active, setActive] = useState(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const i = slideRefs.current.indexOf(entry.target as HTMLDivElement);
            if (i !== -1) setActive(i);
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );

    slideRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const closing = (
    <>
      <p className="measure lg:max-w-[30ch]">{partnersCopy.line}</p>
      <Link href="/about" className="arrow-link mt-4 inline-block text-[color:var(--color-scramble)]">
        {partnersCopy.cta}
      </Link>
    </>
  );

  return (
    <section className="hairline border-b border-hair">
      <div className="relative">
        {/* ---- Rails: desktop only ---- */}
        <div className="pointer-events-none sticky top-0 z-20 hidden h-[100svh] lg:block">
          <div className="absolute inset-x-0 top-0 flex h-full items-start justify-between gap-8 px-10 pt-24 xl:px-16 2xl:px-[clamp(4rem,10vw,13rem)]">
            <p className="eyebrow pointer-events-auto">{partnersCopy.eyebrow}</p>

            {/* Sits low on the right, as in the layout. */}
            <div className="pointer-events-auto mt-auto mb-24 text-right">{closing}</div>
          </div>
        </div>

        {/* ---- Mobile label ---- */}
        <p className="eyebrow gutter block pt-16 pb-6 lg:hidden">{partnersCopy.eyebrow}</p>

        {/* ---- The reel ---- */}
        <div className="lg:-mt-[100svh]">
          {partners.map((partner, i) => {
            const isActive = i === active;
            return (
              <div
                key={partner.tier}
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
                className="grid place-items-center gutter pb-10 lg:h-[70svh] lg:px-0 lg:pb-0"
              >
                <div
                  className={`relative grid aspect-square place-items-center border transition-all duration-500 ${
                    isActive
                      ? "w-[min(64vw,320px)] border-2 border-ink opacity-100"
                      : "w-[min(42vw,200px)] border-hair opacity-45"
                  }`}
                >
                  {isActive && <CropMarks className="-m-2" />}
                  <span
                    className={`px-4 text-center transition-all duration-500 ${
                      isActive ? "text-[1.35em]" : "text-[0.85em]"
                    }`}
                  >
                    {partner.tier}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ---- Mobile closing line ---- */}
        <div className="gutter pb-16 lg:hidden">{closing}</div>
      </div>
    </section>
  );
}
