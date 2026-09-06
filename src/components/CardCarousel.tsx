"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import CarouselMarks from "./CarouselMarks";
import CropMarks from "./CropMarks";

export type Card = { src: string; title: string; note: string };

/** The gap between cards, as measured on the reference. */
const GAP_PX = 20;
/** Drift per frame in pixels, at 60fps — about a card every five seconds. */
const SPEED = 1.5;
/** How long the drift stays out of the way after a deliberate move. */
const RESUME_MS = 2000;

/**
 * A row of cards that drifts on its own, can be dragged, and still answers to
 * prev/next.
 *
 * The list is rendered twice and the scroll position wraps at the width of one
 * copy, so the drift never reaches an end and the seam never arrives.
 *
 * Deliberately no scroll snapping. It fights both the drift and the drag,
 * pulling the rail back on every frame, which is what made dragging feel
 * rough. Native overflow scrolling is kept, so a phone swipe still gets the
 * browser's own momentum.
 */
export default function CardCarousel({ cards }: { cards: Card[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  /* Drift is suspended while the pointer is down, while it rests over the
     rail, and for a moment after any deliberate move. */
  const holdRef = useRef(false);
  const idleUntilRef = useRef(0);
  const dragRef = useRef({ on: false, startX: 0, startLeft: 0 });

  const run = [...cards, ...cards];

  /** Width of one copy of the list, including its trailing gap. */
  const lap = useCallback(() => {
    const rail = railRef.current;
    return rail ? (rail.scrollWidth + GAP_PX) / 2 : 0;
  }, []);

  const step = useCallback(() => {
    const first = railRef.current?.firstElementChild as HTMLElement | null;
    return first ? first.getBoundingClientRect().width + GAP_PX : 1;
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const frame = () => {
      const one = lap();

      if (one > 0) {
        const idle = !holdRef.current && Date.now() > idleUntilRef.current;
        if (idle && !reduced) rail.scrollLeft += SPEED;

        /* Wrap both ways, so a backwards drag keeps looping too. */
        if (rail.scrollLeft >= one) rail.scrollLeft -= one;
        else if (rail.scrollLeft < 0) rail.scrollLeft += one;

        setActive(Math.round(rail.scrollLeft / step()) % cards.length);
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [cards.length, lap, step]);

  const go = (n: number) => {
    const rail = railRef.current;
    if (!rail) return;
    idleUntilRef.current = Date.now() + RESUME_MS;
    rail.scrollBy({ left: n * step(), behavior: "smooth" });
  };

  /* Mouse drag. Touch is left to the browser, which already gives a swipe
     momentum; duplicating it here would fight that. */
  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail || e.pointerType !== "mouse") return;
    dragRef.current = { on: true, startX: e.clientX, startLeft: rail.scrollLeft };
    holdRef.current = true;
    rail.setPointerCapture(e.pointerId);
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail || !dragRef.current.on) return;
    rail.scrollLeft = dragRef.current.startLeft - (e.clientX - dragRef.current.startX);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail || !dragRef.current.on) return;
    dragRef.current.on = false;
    holdRef.current = false;
    idleUntilRef.current = Date.now() + RESUME_MS;
    if (rail.hasPointerCapture(e.pointerId)) rail.releasePointerCapture(e.pointerId);
  };

  return (
    <section className="py-16 md:py-24">
      <div
        ref={railRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onMouseEnter={() => (holdRef.current = true)}
        onMouseLeave={() => (holdRef.current = false)}
        onWheel={() => (idleUntilRef.current = Date.now() + RESUME_MS)}
        className="no-bar gutter flex cursor-grab gap-5 overflow-x-auto select-none active:cursor-grabbing"
      >
        {run.map((card, i) => (
          <article
            key={`${card.src}-${i}`}
            className="w-[278px] shrink-0 lg:w-[435px]"
            aria-hidden={i >= cards.length}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-[#efefef]">
              <CropMarks />
              <Image
                src={card.src}
                alt={card.title}
                fill
                sizes="(max-width: 1024px) 278px, 435px"
                className="object-cover"
                draggable={false}
              />
            </div>

            <div className="mt-3 flex gap-3">
              <span className="text-ink-30">
                [{String((i % cards.length) + 1).padStart(2, "0")}]
              </span>
              <span>
                <span className="block">{card.title}</span>
                <span className="block opacity-60">{card.note}</span>
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          className="transition-opacity hover:opacity-60"
        >
          &lsaquo; Prev
        </button>
        <CarouselMarks count={cards.length} active={active} />
        <button
          type="button"
          onClick={() => go(1)}
          className="transition-opacity hover:opacity-60"
        >
          Next &rsaquo;
        </button>
      </div>
    </section>
  );
}
