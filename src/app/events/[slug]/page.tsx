import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CropMarks from "@/components/CropMarks";
import { formatDate } from "@/components/EventCard";
import EventCTA from "@/components/EventCTA";
import LineupRail from "@/components/LineupRail";
import Reveal from "@/components/Reveal";
import SplitWords from "@/components/SplitWords";
import { resolveLineup } from "@/data/artists";
import { events, getEvent } from "@/data/events";
import { site } from "@/data/site";

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return { title: "Event not found" };
  return {
    title: `${site.name} ${event.city}`,
    description: event.blurb,
  };
}

/** DATE / TIME / LOCATION, shown in the hero and again in the sticky bar. */
function Meta({ event, tone = "dark" }: { event: ReturnType<typeof getEvent>; tone?: "dark" | "light" }) {
  if (!event) return null;
  const muted = tone === "dark" ? "opacity-70" : "opacity-60";
  return (
    <>
      <div>
        <p className={`eyebrow ${muted}`}>Date</p>
        <p className="mt-1">{formatDate(event.date)}</p>
      </div>
      <div>
        <p className={`eyebrow ${muted}`}>Time</p>
        <p className="mt-1">{event.time}</p>
      </div>
      <div>
        <p className={`eyebrow ${muted}`}>Location</p>
        <p className="mt-1">
          {event.city}, {event.country}
        </p>
      </div>
    </>
  );
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  const lineup = resolveLineup(event.lineup);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-night text-white">
        <Image
          src={event.image}
          alt={`${event.venue}, ${event.city}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        {/* Meta row, sitting on the vertical centre line. */}
        <div className="absolute inset-x-6 top-1/2 grid -translate-y-1/2 grid-cols-1 gap-6 sm:grid-cols-3 md:inset-x-8">
          <Meta event={event} />
        </div>

        <div className="absolute inset-x-6 bottom-6 md:inset-x-8 md:bottom-8">
          <p className="eyebrow opacity-70">{event.code}</p>
          <h1 className="display mt-3 max-w-[14ch] text-[13vw] leading-[0.86] md:text-[7vw] lg:text-[5.5rem]">
            <SplitWords text={`${site.wordmark} ${event.city}`} stagger={60} />
          </h1>
        </div>
      </section>

      {/* ---------- Sticky meta ---------- */}
      {/* Pinned just under the fixed header so the two never collide. */}
      <div className="sticky top-[68px] z-40 border-b border-hair bg-paper">
        <div className="grid grid-cols-1 gap-4 px-6 py-4 sm:grid-cols-3 md:px-8">
          <Meta event={event} tone="light" />
        </div>
      </div>

      {/* ---------- Description + artwork ---------- */}
      <section className="px-6 py-16 md:px-8 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="space-y-6">
              {event.paragraphs.map((para) => (
                <p key={para} className="measure">
                  {para}
                </p>
              ))}
              <p className="measure opacity-60">
                {event.venue}. {event.coords.lat} / {event.coords.lon}
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <figure className="relative aspect-[4/3] overflow-hidden bg-[#efefef]">
              <CropMarks />
              <Image
                src={event.artwork}
                alt={`Poster artwork for ${site.name} ${event.city}`}
                fill
                sizes="(max-width: 1024px) 92vw, 46vw"
                className="object-cover"
              />
              <figcaption className="absolute right-2 bottom-2 rounded-[2px] bg-ink/85 px-3 py-2 text-white backdrop-blur-sm">
                Artwork by {event.artworkBy}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ---------- Line-up ---------- */}
      <section id="tickets" className="border-t border-hair px-6 py-16 md:px-8 md:py-24">
        <Reveal>
          <p className="eyebrow">Line-up</p>
        </Reveal>
        <Reveal delay={100}>
          <div className="mt-8">
            <LineupRail artists={lineup} />
          </div>
        </Reveal>
      </section>

      {/* ---------- Other shows ---------- */}
      <section className="border-t border-hair px-6 py-16 md:px-8 md:py-20">
        <div className="flex items-baseline justify-between gap-6">
          <p className="eyebrow">More shows</p>
          <Link href="/events" className="arrow-link">
            All events
          </Link>
        </div>

        <ul className="mt-8 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {events
            .filter((e) => e.slug !== event.slug)
            .slice(0, 3)
            .map((e, i) => (
              <li key={e.slug}>
                <Link href={`/events/${e.slug}`} className="group flex gap-3" data-cursor-text="Info & tickets">
                  <span className="text-ink-30">[{String(i + 1).padStart(2, "0")}]</span>
                  <span>
                    <span className="block transition-opacity group-hover:opacity-60">
                      {site.wordmark} {e.city}
                    </span>
                    <span className="block opacity-60">{formatDate(e.date)}</span>
                  </span>
                </Link>
              </li>
            ))}
        </ul>
      </section>

      <EventCTA event={event} />
    </>
  );
}
