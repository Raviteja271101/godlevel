"use client";

import Image from "next/image";
import { useState } from "react";
import CarouselMarks from "./CarouselMarks";
import CropMarks from "./CropMarks";

export type Slide = { label: string; src: string; body: string };

/**
 * A three-up picture slider: thumbnails down the left, the chosen frame in
 * the middle under a label, its copy to the right, and prev/next beneath.
 *
 * Below lg there is no room for three columns, so the slider gives way to the
 * pictures stacked in a column — the reference drops its slider on a phone the
 * same way rather than shrinking it.
 */
export default function AboutSlider({ slides }: { slides: Slide[] }) {
  const [active, setActive] = useState(0);
  const go = (n: number) => setActive((i) => (i + n + slides.length) % slides.length);
  const current = slides[active];

  return (
    <section className="gutter py-16 md:py-24">
      {/* ---- Phone: the same treatment, stacked. Not a bare picture list —
             each one keeps its label, frame and copy, as the reference does,
             since there is no room for the three-column arrangement. ---- */}
      <div className="flex flex-col gap-[38px] lg:hidden">
        {slides.map((slide, i) => (
          <div key={slide.src}>
            <p className="inline-block bg-[#333] px-4 py-2 text-white">
              <span className="eyebrow">
                {slide.label}{" "}
                <span className="opacity-60">
                  ({i + 1} of {slides.length})
                </span>
              </span>
            </p>

            <div className="relative aspect-[435/363]">
              <CropMarks />
              <figure className="absolute inset-2 overflow-hidden bg-[#efefef]">
                <Image
                  src={slide.src}
                  alt={slide.label}
                  fill
                  sizes="92vw"
                  className="object-cover"
                />
              </figure>
            </div>

            <p className="measure mt-5 max-w-none">{slide.body}</p>
          </div>
        ))}
      </div>

      {/* ---- lg and up: thumbnails, framed centre, copy ---- */}
      <div className="relative hidden min-h-[470px] lg:block">
        {/* Thumbnails, pinned left. */}
        <div className="absolute top-1/2 left-[7.9vw] flex -translate-y-1/2 flex-col gap-2.5">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={slide.label}
              aria-current={i === active}
              className="relative block h-[78px] w-[94px] overflow-hidden bg-[#efefef]"
            >
              {i === active && <CropMarks className="-m-1" />}
              <Image
                src={slide.src}
                alt=""
                fill
                sizes="94px"
                className={`object-cover transition-opacity ${
                  i === active ? "opacity-100" : "opacity-50 hover:opacity-80"
                }`}
              />
            </button>
          ))}
        </div>

        {/* The chosen frame, centred. The label sits in a band above the
            framed box, not inside it: marks and hairline belong to the box,
            which is 33px shorter than the whole, and the photo is inset 7px
            within that so the frame reads clear of the picture. */}
        <div className="relative mx-auto h-[396px] w-[435px]">
          <p className="absolute top-0 left-0 bg-[#333] px-4 py-2 text-white">
            <span className="eyebrow">
              {current.label} <span className="opacity-60">({active + 1} of {slides.length})</span>
            </span>
          </p>

          <div className="absolute inset-x-0 top-[33px] bottom-0">
            <CropMarks />
            <figure className="absolute inset-2 overflow-hidden bg-[#efefef]">
              <Image
                src={current.src}
                alt={current.label}
                fill
                sizes="419px"
                className="object-cover"
              />
            </figure>
          </div>
        </div>

        {/* Copy, pinned right. */}
        <p className="measure absolute top-1/2 right-[7.9vw] max-w-[26ch] -translate-y-1/2">
          {current.body}
        </p>

        {/* Prev / next, centred below. */}
        <div className="mt-[120px] flex items-center justify-center gap-4">
          <button type="button" onClick={() => go(-1)} className="transition-opacity hover:opacity-60">
            &lsaquo; Prev
          </button>
          <CarouselMarks count={slides.length} active={active} />
          <button type="button" onClick={() => go(1)} className="transition-opacity hover:opacity-60">
            Next &rsaquo;
          </button>
        </div>
      </div>
    </section>
  );
}
