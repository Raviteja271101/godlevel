import Image from "next/image";
import Link from "next/link";
import CropMarks from "@/components/CropMarks";
import Hero from "@/components/Hero";
import CardRail from "@/components/CardRail";
import EventCard from "@/components/EventCard";
import PartnersReel from "@/components/PartnersReel";
// import ProductCard from "@/components/ProductCard"; // restore with the shop section
import Reveal from "@/components/Reveal";
import ScrambleText from "@/components/ScrambleText";
import SplitWords from "@/components/SplitWords";
import SpreadWords from "@/components/SpreadWords";
import WorldClock from "@/components/WorldClock";
import { events } from "@/data/events";
// import { products } from "@/data/products"; // restore with the shop section
import { releases } from "@/data/releases";
import { site } from "@/data/site";

/* Two blocks. Lines inside a block sit directly under one another; only the
   break between the blocks gets space. */
const aboutCopy = [
  [
    "We create spaces where people can come together, discover something new, and experience things differently.",
    "The goal isn't simply to create events.",
    "It's to create moments.",
    "Moments that bring people together.",
    "Moments that stay with you.",
    "Something you experience with your friends.",
    "Or someone you meet for the first time.",
  ],
  [
    "Godlevel is built around curiosity, connection, and the idea that everyone should have a place to belong.",
    "Come as you are.",
    "Leave with something more.",
  ],
];

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
                <SpreadWords
                  text="An experience where people, culture and curiosity come together"
                  className="display mt-6 text-[2rem] leading-none sm:text-[2.5rem] lg:text-[2.65em]"
                />
              </Reveal>
            </div>

            <div className="lg:w-[40%]">
              <Reveal delay={160}>
                <div className="space-y-6">
                  {aboutCopy.map((block, i) => (
                    <p key={i} className="measure lg:max-w-none">
                      {block.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </p>
                  ))}
                </div>
                <Link href="/about" className="arrow-link mt-8 inline-block">
                  More about us
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <PartnersReel />

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

        <Reveal>
          <div className="card-list mt-8">
            <CardRail label="Upcoming events" columns={3}>
              {events.slice(0, 3).map((event, i) => (
                <EventCard key={event.code} event={event} index={i} sizes={GRID_SIZES} />
              ))}
            </CardRail>
          </div>
        </Reveal>
      </section>

      <WorldClock />

      {/* ---------- Godlevel Collective ---------- */}
      <section className="gutter py-16 md:py-24">
        <Reveal>
          <p className="eyebrow">
            <ScrambleText text="Godlevel Collective" trigger="view" />
          </p>
          <p className="measure mt-3">
            A collective of people pushing their craft, culture, and communities forward.
          </p>
        </Reveal>

        <div className="mt-8">
          <CardRail label="Godlevel Collective" columns={4}>
            {releases.map((release) => (
              <Link key={release.catalogue} href="/label" className="group block" data-cursor-text="Listen">
                <div className="relative aspect-square overflow-hidden bg-[#efefef]">
                  <CropMarks />
                  <Image
                    src={release.image}
                    alt={`${release.title} by ${release.artist}`}
                    fill
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 23vw"
                    className="media-zoom object-cover group-hover:scale-[1.03]"
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
            ))}
          </CardRail>
        </div>

        {/* Sits under the cards, right-aligned. */}
        <Reveal>
          <div className="mt-8 flex justify-end">
            <Link href="/label" className="arrow-link">
              Join the collective
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ---------- Shop ----------
      Commented out on request. To restore, uncomment this block along with
      the ProductCard and products imports at the top of the file.

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
      */}
    </>
  );
}
