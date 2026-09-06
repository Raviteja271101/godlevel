"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import CropMarks from "./CropMarks";
import { gallery } from "@/data/gallery";

/** Drift per frame, in pixels at 60fps. */
const SPEED = 0.6;
/** Must match the gap class on the track below. */
const GAP_PX = 16;

/**
 * An endless row of stills that drifts on its own and can be dragged.
 *
 * The list is rendered twice and the offset wraps at the width of one copy,
 * so the seam never arrives. Dragging scrubs it and throws it, and the wrap
 * works in both directions, so it keeps looping however far it is pushed.
 */
export default function ImageMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const velRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const step = () => {
      /* One copy plus its trailing gap — not scrollWidth/2, which would be
         short by half a gap each lap and drift the seam into view. */
      const lap = (track.scrollWidth + GAP_PX) / 2;

      if (lap > 0) {
        if (!draggingRef.current) {
          offsetRef.current += (reduced ? 0 : SPEED) + velRef.current;
          velRef.current *= 0.94;
        }
        if (offsetRef.current >= lap) offsetRef.current -= lap;
        if (offsetRef.current < 0) offsetRef.current += lap;
        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    lastXRef.current = e.clientX;
    velRef.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    offsetRef.current -= dx;
    velRef.current = -dx;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const run = [...gallery, ...gallery];

  return (
    <section className="overflow-hidden py-12 md:py-20">
      <div
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        /* pan-y keeps the page scrollable vertically over the rail on touch,
           while horizontal drags still move it. */
        className="cursor-grab touch-pan-y select-none active:cursor-grabbing"
      >
        <div ref={trackRef} className="flex w-max gap-4 will-change-transform">
          {run.map((shot, i) => (
            <figure
              key={`${shot.src}-${i}`}
              className="w-[215px] shrink-0 md:w-[295px] lg:w-[448px]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#efefef]">
                <CropMarks />
                <Image
                  src={shot.src}
                  alt={shot.caption}
                  fill
                  sizes="(max-width: 768px) 215px, (max-width: 1024px) 295px, 448px"
                  className="object-cover"
                  draggable={false}
                />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
