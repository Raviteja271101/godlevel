import Image from "next/image";
import Link from "next/link";
import CropMarks from "@/components/CropMarks";
import EventCard from "@/components/EventCard";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import ScrambleText from "@/components/ScrambleText";
import SplitWords from "@/components/SplitWords";
import WorldClock from "@/components/WorldClock";
import { events } from "@/data/events";
import { products } from "@/data/products";
import { releases } from "@/data/releases";
import { site } from "@/data/site";

const GRID_SIZES = "(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* ---------- Statement ----------
          Statement on the left, set justified in a narrow measure; supporting
          copy and the link sit off to the right. The section takes the same
          deeper side inset as the globe. */}
      <section className="gutter py-16 md:py-24">
        <div className="lg:px-[7.8vw]">
          <div className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-0">
            <div className="lg:w-[38%]">
              <Reveal>
                <p className="eyebrow">
                  <ScrambleText text={`About ${site.name}`} trigger="view" />
                </p>
              </Reveal>
              <Reveal delay={100}>
                <p className="display mt-6 text-justify text-[2rem] leading-none sm:text-[2.5rem] lg:text-[2.65em]">
                  <SplitWords text="We put pioneering music in rooms that were built for something else entirely, and we take our time about it." stagger={26} />
                </p>
              </Reveal>
            </div>

            <div className="lg:w-[40%]">
              <Reveal delay={160}>
                <p className="measure lg:max-w-none">
                  Every show is site-specific. We spend months negotiating with the owners of
                  unusual buildings, then build a night around whatever we find inside. Nothing
                  is templated, the running order is decided on the day, and the last set always
                  outlasts the schedule.
                </p>
                <Link href="/about" className="arrow-link mt-8 inline-block">
                  More about us
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <Marquee items={["Six shows, six countries", "Season 09 on sale", "SL-004 out on vinyl", "Slow Light Radio"]} />

      {/* ---------- Upcoming events ---------- */}
      <section className="gutter py-16 md:py-24">
        <Reveal>
          <div className="flex items-baseline justify-between gap-6">
            <p className="eyebrow">
              <ScrambleText text="Upcoming events" trigger="view" />
            </p>
            <Link href="/events" className="arrow-link">
              Explore all
            </Link>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {events.slice(0, 3).map((event, i) => (
            <Reveal key={event.code} delay={i * 90}>
              <EventCard event={event} index={i} sizes={GRID_SIZES} />
            </Reveal>
          ))}
        </div>
      </section>

      <WorldClock />

      {/* ---------- Label ---------- */}
      <section className="gutter py-16 md:py-24">
        <Reveal>
          <div className="flex items-baseline justify-between gap-6">
            <p className="eyebrow">
              <ScrambleText text="Recordings" trigger="view" />
            </p>
            <Link href="/label" className="arrow-link">
              Full catalogue
            </Link>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {releases.map((release, i) => (
            <Reveal key={release.catalogue} delay={i * 80}>
              <Link href="/label" className="group block" data-cursor-text="Listen">
                <div className="relative aspect-square overflow-hidden bg-[#efefef]">
                  <CropMarks />
                  <Image
                    src={release.image}
                    alt={`${release.title} by ${release.artist}`}
                    fill
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 23vw"
                    className="media-zoom object-cover grayscale group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                </div>
                <div className="mt-3 flex gap-3">
                  <span className="text-ink-30">[{release.catalogue}]</span>
                  <span>
                    <span className="block transition-opacity group-hover:opacity-60">{release.title}</span>
                    <span className="block opacity-60">{release.artist}</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Shop ---------- */}
      <section className="hairline border-t border-hair gutter py-16 md:py-24">
        <Reveal>
          <div className="flex items-baseline justify-between gap-6">
            <p className="eyebrow">
              <ScrambleText text="Merchandise" trigger="view" />
            </p>
            <Link href="/shop" className="arrow-link">
              Everything
            </Link>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product, i) => (
            <Reveal key={product.name} delay={i * 80}>
              <ProductCard product={product} index={i} sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 23vw" />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
