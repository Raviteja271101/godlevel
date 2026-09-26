import Image from "next/image";
import Link from "next/link";
import CropMarks from "./CropMarks";
import HeroParallax from "./HeroParallax";
import { formatDate } from "./EventCard";
import { events } from "@/data/events";
import { site } from "@/data/site";

/**
 * The video opening. `bare` strips everything laid over the footage — the
 * centred wordmark and both bottom captions — leaving the film alone, which
 * is what the interior pages want. The loader intro still applies either way.
 *
 * Structure follows the reference's intro: a centred box that is resized (not
 * scaled) from nothing to full bleed, holding its own corner marks and the
 * video inset by 0.625em; the wordmark is a separate layer that scales in.
 */
export default function Hero({ bare = false }: { bare?: boolean }) {
  const next = events[0];

  return (
    <section className="hero relative isolate h-[100svh] min-h-[620px] w-full overflow-hidden bg-night text-white">
      <HeroParallax />

      <div className="hero-box">
        <CropMarks className="hero-box-marks m-px" />
        <div className="hero-inset">
          <div className="relative h-full w-full overflow-hidden">
            {/* 120% tall and parked 20% high, so the parallax drift (0.8× the
                scroll) never uncovers an edge. */}
            <div className="hero-drift absolute inset-x-0 bottom-0 h-[120%]">
              <video
                autoPlay
                muted
                loop
                playsInline
                poster="/media/hero-poster.jpg"
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src="/media/hero.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="absolute inset-0 bg-black/30" />
          </div>
        </div>
      </div>

      {/* Centred wordmark, itself framed. Marks and type blend as one group. */}
      {!bare && (
        <div className="hero-logo pointer-events-none absolute inset-0 grid place-items-center">
          <div className="relative px-10 py-7 mix-blend-difference">
            <CropMarks />
            <p className="display text-center text-[2.5rem] leading-[0.85] md:text-[3.25rem] lg:text-[3.5rem]">
              {site.wordmark}
            </p>
          </div>
        </div>
      )}

      {!bare && (
        <>
          {/* Bottom-left descriptor, on the page gutter as on the reference. */}
          <div className="hero-aside hero-edge absolute left-0 w-[208px] max-w-[70vw]">
            <p className="eyebrow text-[rgb(128,128,128)]">{site.tagline}</p>
            <p className="measure mt-[19px] text-white">{site.intro}</p>
          </div>

          {/* Bottom-right "next up" card: a frosted dark tag, as on the reference. */}
          <Link
            href={`/events/${next.slug}`}
            data-cursor-text="Info & tickets"
            className="hero-aside hero-edge group absolute right-0 hidden items-center gap-4 rounded-[2px] bg-black/20 py-[5px] pr-[10px] pl-[5px] backdrop-blur-[20px] md:flex"
          >
            <div className="relative h-[79px] w-[104px] overflow-hidden">
              <CropMarks />
              <Image
                src={next.image}
                alt={`${next.venue}, ${next.city}`}
                fill
                sizes="104px"
                className="media-zoom object-cover group-hover:scale-105"
              />
            </div>
            <div>
              <p className="eyebrow text-[rgb(128,128,128)]">Next up</p>
              <p className="mt-1">{next.city}</p>
              <p className="opacity-70">{formatDate(next.date)}</p>
            </div>
          </Link>
        </>
      )}
    </section>
  );
}
