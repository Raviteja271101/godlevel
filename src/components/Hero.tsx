import Image from "next/image";
import Link from "next/link";
import CropMarks from "./CropMarks";
import { formatDate } from "./EventCard";
import { events } from "@/data/events";
import { site } from "@/data/site";

export default function Hero() {
  const next = events[0];

  return (
    <section className="hero relative isolate h-[100svh] min-h-[620px] w-full overflow-hidden bg-night text-white">
      {/* Video, scrim and wordmark scale as one box: the loader opens with it
          small and centred, then it grows out to full bleed. */}
      <div className="hero-media absolute inset-0">
        {/* Frame lives outside this scaled box; see .hero-frame below. */}
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
        <div className="absolute inset-0 bg-black/30" />

        {/* Centred wordmark, itself framed. Marks and type blend as one group. */}
        <div className="absolute inset-0 grid place-items-center">
          <div className="relative px-10 py-7 mix-blend-difference">
            <CropMarks />
            <p className="display text-center text-[2.5rem] leading-[0.85] md:text-[3.25rem] lg:text-[3.5rem]">
              {site.wordmark}
            </p>
          </div>
        </div>
      </div>

      {/* Corner frame for the loading box. Kept out of .hero-media so the
          brackets stay hairline-thin instead of scaling with it. */}
      <div className="hero-frame">
        <CropMarks />
      </div>

      {/* Bottom-left descriptor. */}
      <div className="hero-aside absolute bottom-6 left-6 max-w-[34ch] md:bottom-8 md:left-8">
        <p className="eyebrow opacity-70">{site.tagline}</p>
        <p className="measure mt-3 text-white">{site.intro}</p>
      </div>

      {/* Bottom-right "next up" card. */}
      <Link
        href={`/events/${next.slug}`}
        data-cursor-text="Info & tickets"
        className="hero-aside group absolute right-6 bottom-6 hidden items-center gap-4 md:right-8 md:bottom-8 md:flex"
      >
        <div className="relative h-[74px] w-[104px] overflow-hidden">
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
          <p className="eyebrow opacity-70">Next up</p>
          <p className="mt-1">{next.city}</p>
          <p className="opacity-70">{formatDate(next.date)}</p>
        </div>
      </Link>
    </section>
  );
}
