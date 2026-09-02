"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CropMarks from "./CropMarks";
import { formatDate } from "./EventCard";
import type { Event } from "@/data/events";
import { site } from "@/data/site";

/** Two-letter country code chip, standing in for the reference's flag icons. */
const CODES: Record<string, string> = {
  Georgia: "GE",
  Iceland: "IS",
  Morocco: "MA",
  Greece: "GR",
  Estonia: "EE",
  Chile: "CL",
};

const code = (country: string) => CODES[country] ?? country.slice(0, 2).toUpperCase();

/**
 * Desktop: a centred vertical reel with index rails pinned either side.
 * Mobile: the rails have nowhere to go, so they drop away and each slide
 * becomes a full-width card carrying its own caption row.
 */
export default function EventsReel({ events }: { events: Event[] }) {
  const [active, setActive] = useState(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Fires as each slide crosses the vertical centre of the viewport.
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

  const jumpTo = (i: number) => {
    slideRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const rowTone = (i: number) => (i === active ? "opacity-100" : "opacity-30 hover:opacity-60");

  return (
    <div className="relative">
      {/* ---- Index rails: desktop only, pinned to the centre line ---- */}
      <div className="pointer-events-none sticky top-0 z-20 hidden h-[100svh] lg:block">
        {/* Edge inset grows with the viewport, but stays tight enough at
            mid widths that the rails never reach the centred image. */}
        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between gap-8 px-10 xl:px-16 2xl:px-[clamp(4rem,10vw,13rem)]">
          {/* Titles */}
          <div className="pointer-events-auto">
            <p className="eyebrow mb-4">Upcoming events</p>
            <ul>
              {events.map((event, i) => (
                <li key={event.slug}>
                  <button
                    type="button"
                    onClick={() => jumpTo(i)}
                    aria-current={i === active}
                    className={`flex items-center gap-3 py-1 text-left transition-opacity ${rowTone(i)}`}
                  >
                    <span className="text-ink-30">[{i + 1}]</span>
                    <span className="border border-current px-1 leading-none opacity-70">
                      {code(event.country)}
                    </span>
                    <span>
                      {site.wordmark} {event.city}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Dates */}
          <div className="pointer-events-auto text-right">
            <p className="eyebrow mb-4 justify-end">Date</p>
            <ul>
              {events.map((event, i) => (
                <li key={event.slug}>
                  <button
                    type="button"
                    onClick={() => jumpTo(i)}
                    className={`block w-full py-1 text-right transition-opacity ${rowTone(i)}`}
                  >
                    {formatDate(event.date)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ---- Mobile heading, standing in for the rails ---- */}
      <div className="flex items-baseline justify-between gap-4 px-6 pt-28 pb-6 lg:hidden">
        <p className="eyebrow">Upcoming events</p>
        <p className="opacity-50">[{events.length}]</p>
      </div>

      {/* ---- The reel ---- */}
      <div className="lg:-mt-[100svh]">
        {events.map((event, i) => (
          <div
            key={event.slug}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className="grid place-items-center px-6 pb-14 lg:h-[100svh] lg:px-0 lg:pb-0"
          >
            <Link
              href={`/events/${event.slug}`}
              data-cursor-text={event.status === "Sold out" ? "Sold out" : "Info & tickets"}
              className="group block w-full lg:w-[min(62vw,440px)]"
            >
              <div
                className={`relative aspect-[4/3] overflow-hidden bg-[#efefef] transition-opacity duration-500 ${
                  i === active ? "opacity-100" : "opacity-35"
                }`}
              >
                {/* Marks appear only on the slide holding the centre line. */}
                {i === active && <CropMarks className="-m-2" />}
                <Image
                  src={event.image}
                  alt={`${event.venue}, ${event.city}`}
                  fill
                  sizes="(max-width: 1024px) 88vw, 440px"
                  className="media-zoom object-cover group-hover:scale-[1.03]"
                />
              </div>

              {/* Caption row — mobile only; desktop reads this off the rails. */}
              <div
                className={`mt-3 flex items-baseline justify-between gap-4 transition-opacity duration-500 lg:hidden ${
                  i === active ? "opacity-100" : "opacity-40"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-ink-30">[{String(i + 1).padStart(2, "0")}]</span>
                  <span className="border border-current px-1 leading-none opacity-70">
                    {code(event.country)}
                  </span>
                  <span>{event.city}</span>
                </span>
                <span className="shrink-0 opacity-70">{formatDate(event.date)}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
