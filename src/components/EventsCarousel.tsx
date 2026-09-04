"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import EventCard from "./EventCard";

/* The marks are drawn as one SVG on a whole-pixel grid.
   As plain elements they sat at fractional offsets, so a 2px line smeared
   across five device pixels rather than landing on four — and the amount it
   smeared changed as the row reflowed around whichever mark was wider,
   which made the current mark look fatter in some slots than others.
   Integer coordinates plus crispEdges renders every mark identically. */
const SLOT = 6; // distance between marks
const BOX_H = 12; // tallest mark, and the height of the row

const RESTING_W = 1;
const RESTING_H = 8;
const CURRENT_W = 2;
const CURRENT_H = 12;
import type { Event } from "@/data/events";

/**
 * Upcoming events as a swipeable rail.
 *
 * On a phone a card takes about 82% of the width so the next one shows at
 * the edge, which is what invites the swipe. From tablet up three sit
 * across the row and the rail stops scrolling, so it reads as a grid.
 *
 * Built on native scroll-snap rather than a slider library: the browser
 * handles the touch physics, and it degrades to a plain scroller if the
 * script never runs.
 */
export default function EventsCarousel({
  events,
  sizes,
}: {
  events: Event[];
  sizes: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [active, setActive] = useState(0);

  const sync = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    setAtStart(rail.scrollLeft < 8);
    setAtEnd(rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8);

    // Whichever card sits nearest the middle of the rail is the current one.
    // Compared in viewport coordinates: offsetLeft is measured from the
    // offset parent, which is not the scroller, so mixing it with scrollLeft
    // put the reading out by a card at the end of the rail.
    const railBox = rail.getBoundingClientRect();
    const middle = railBox.left + railBox.width / 2;
    let nearest = 0;
    let best = Infinity;
    Array.from(rail.children).forEach((child, i) => {
      const box = child.getBoundingClientRect();
      const d = Math.abs(box.left + box.width / 2 - middle);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    setActive(nearest);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [sync]);

  const step = (dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const first = rail.firstElementChild as HTMLElement | null;
    // One card plus the gap between them.
    const distance = first ? first.clientWidth + 20 : rail.clientWidth * 0.8;
    rail.scrollBy({ left: dir * distance, behavior: "smooth" });
  };

  const btn =
    "transition-opacity hover:opacity-60 disabled:pointer-events-none disabled:opacity-25";

  return (
    <div>
      <div
        ref={railRef}
        onScroll={sync}
        role="region"
        aria-label="Upcoming events"
        className="no-bar -mx-[2px] flex snap-x snap-mandatory gap-5 overflow-x-auto px-[2px] md:overflow-visible"
      >
        {events.map((event, i) => (
          <div
            key={event.code}
            className="w-[82%] shrink-0 snap-start md:w-[calc((100%-2.5rem)/3)]"
          >
            <EventCard event={event} index={i} sizes={sizes} />
          </div>
        ))}
      </div>

      {/* Controls: only useful while the rail actually scrolls. */}
      <div className="mt-8 flex items-center justify-center gap-6 md:hidden">
        <button type="button" onClick={() => step(-1)} disabled={atStart} className={btn}>
          &lt; Prev
        </button>

        <svg
          aria-hidden="true"
          width={(events.length - 1) * SLOT + CURRENT_W}
          height={BOX_H}
          viewBox={`0 0 ${(events.length - 1) * SLOT + CURRENT_W} ${BOX_H}`}
          shapeRendering="crispEdges"
          className="shrink-0 overflow-visible"
        >
          {events.map((e, i) => {
            const isActive = i === active;
            const w = isActive ? CURRENT_W : RESTING_W;
            const h = isActive ? CURRENT_H : RESTING_H;
            return (
              <rect
                key={e.code}
                data-active={isActive}
                x={i * SLOT}
                y={BOX_H - h}
                width={w}
                height={h}
                fill="currentColor"
                opacity={isActive ? 1 : 0.4}
              />
            );
          })}
        </svg>

        <button type="button" onClick={() => step(1)} disabled={atEnd} className={btn}>
          Next &gt;
        </button>
      </div>
    </div>
  );
}
