"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CarouselMarks from "./CarouselMarks";

const GAP_PX = 20;

/**
 * A row of cards that becomes swipeable on a phone.
 *
 * A card takes about 82% of the width so the next one shows at the edge,
 * which is what invites the swipe — the same proportion the reference uses,
 * 288px of a 350px rail. From tablet up the cards share the row and the rail
 * stops scrolling, so it reads as a grid.
 *
 * Built on native scroll-snap rather than a slider library: the browser
 * handles the touch physics, and with no script it degrades to a plain
 * scroller.
 */
export default function CardRail({
  label,
  columns,
  slide = false,
  children,
}: {
  label: string;
  /** How many cards share the row from tablet up. */
  columns: number;
  /** Keep it a slider at every width: the reference's events row, 435px
      cards at 1440 running off the right edge, Prev/Next always shown. */
  slide?: boolean;
  children: React.ReactNode[];
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
    // offset parent, not the scroller, so mixing it with scrollLeft puts the
    // reading out by a card at the end of the rail.
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
    const distance = first ? first.clientWidth + GAP_PX : rail.clientWidth * 0.8;
    rail.scrollBy({ left: dir * distance, behavior: "smooth" });
  };

  const btn = "transition-opacity hover:opacity-60 disabled:pointer-events-none disabled:opacity-25";
  const cardWidth = `calc((100% - ${(columns - 1) * GAP_PX}px) / ${columns})`;

  return (
    <div>
      <div
        ref={railRef}
        onScroll={sync}
        role="region"
        aria-label={label}
        className={
          slide
            ? "no-bar -ml-[2px] flex snap-x snap-mandatory gap-5 overflow-x-auto pl-[2px] mr-[calc(max(20px,2.78vw)*-1)] pr-[max(20px,2.78vw)]"
            : "no-bar -mx-[2px] flex snap-x snap-mandatory gap-5 overflow-x-auto px-[2px] md:overflow-visible"
        }
      >
        {children.map((child, i) => (
          <div
            key={i}
            className={
              slide
                ? "w-[82%] shrink-0 snap-start md:w-[46%] lg:w-[30.2vw]"
                : "w-[82%] shrink-0 snap-start md:w-[var(--card-w)]"
            }
            style={slide ? undefined : ({ "--card-w": cardWidth } as React.CSSProperties)}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Only useful while the rail actually scrolls. */}
      <div
        className={`flex items-center justify-center gap-6 ${slide ? "mt-[46px]" : "mt-8 md:hidden"}`}
      >
        <button type="button" onClick={() => step(-1)} disabled={atStart} className={btn}>
          &lsaquo; Prev
        </button>
        <CarouselMarks count={children.length} active={active} />
        <button type="button" onClick={() => step(1)} disabled={atEnd} className={btn}>
          Next &rsaquo;
        </button>
      </div>
    </div>
  );
}
