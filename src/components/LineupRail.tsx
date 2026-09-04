"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import CarouselMarks from "./CarouselMarks";
import CropMarks from "./CropMarks";
import type { Artist } from "@/data/artists";

/**
 * Line-up rail: the focused card is full strength and shows its links,
 * the rest sit washed back. Stepped with the prev/next controls.
 */
export default function LineupRail({ artists }: { artists: Artist[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const go = useCallback(
    (dir: 1 | -1) => {
      setActive((current) => {
        const next = Math.min(artists.length - 1, Math.max(0, current + dir));
        const rail = railRef.current;
        const card = rail?.children[next] as HTMLElement | undefined;
        if (rail && card) {
          rail.scrollTo({ left: card.offsetLeft - rail.offsetLeft, behavior: "smooth" });
        }
        return next;
      });
    },
    [artists.length],
  );

  // Keep the focused card in sync when the rail is scrolled or swiped directly.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const onScroll = () => {
      const cards = [...rail.children] as HTMLElement[];
      const mid = rail.scrollLeft + rail.clientWidth / 2;
      let closest = 0;
      let best = Infinity;
      cards.forEach((c, i) => {
        const centre = c.offsetLeft - rail.offsetLeft + c.clientWidth / 2;
        const d = Math.abs(centre - mid);
        if (d < best) {
          best = d;
          closest = i;
        }
      });
      setActive(closest);
    };
    rail.addEventListener("scroll", onScroll, { passive: true });
    return () => rail.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div>
      <div ref={railRef} className="no-bar flex snap-x snap-mandatory gap-6 overflow-x-auto" role="list">
        {artists.map((artist, i) => {
          const isActive = i === active;
          return (
            <article
              key={artist.name}
              role="listitem"
              onMouseEnter={() => setActive(i)}
              className="w-[74vw] shrink-0 snap-center sm:w-[44vw] lg:w-[27vw]"
            >
              {/* Name chip, sitting above the frame. */}
              <span
                className={`inline-block rounded-[2px] px-3 py-2 transition-colors ${
                  isActive ? "bg-ink text-white" : "bg-transparent text-ink-30"
                }`}
              >
                <span className="eyebrow">{artist.name}</span>
              </span>

              <div className="relative mt-2 aspect-[3/4] overflow-hidden bg-[#efefef]">
                <CropMarks />
                <Image
                  src={artist.image}
                  alt={artist.name}
                  fill
                  sizes="(max-width: 640px) 74vw, (max-width: 1024px) 44vw, 27vw"
                  className={`media-zoom object-cover ${isActive ? "opacity-100" : "opacity-25"}`}
                />

                {/* Links reveal on the focused card only. */}
                <div
                  className={`absolute inset-x-2 bottom-2 flex flex-wrap gap-1 transition-opacity duration-500 ${
                    isActive ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                >
                  {artist.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-[2px] bg-ink/85 px-2 py-1.5 text-white backdrop-blur-sm transition-opacity hover:opacity-80"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              <p className="mt-2 opacity-60">
                {artist.role} &middot; {artist.based}
              </p>
            </article>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={active === 0}
          className="transition-opacity hover:opacity-60 disabled:opacity-25"
        >
          &lt; Prev
        </button>

        {/* Position indicator — one mark per artist. */}
        <CarouselMarks count={artists.length} active={active} />

        <button
          type="button"
          onClick={() => go(1)}
          disabled={active === artists.length - 1}
          className="transition-opacity hover:opacity-60 disabled:opacity-25"
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
}
