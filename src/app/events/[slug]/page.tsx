import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CropMarks from "@/components/CropMarks";
import { formatDate } from "@/components/EventCard";
import EventCTA from "@/components/EventCTA";
import EventMeta from "@/components/EventMeta";
import Reveal from "@/components/Reveal";
import SplitWords from "@/components/SplitWords";
import { events, formatLat, formatLon, getEvent } from "@/data/events";
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

/** DATE / TIME / LOCATION for the hero meta bar. Laid out on the 12-column
    grid so it sits inside the content column (inset one column, Location
    right-aligned to the same edge as the copy) — matching the reference. */
function Meta({ event, tone = "dark" }: { event: ReturnType<typeof getEvent>; tone?: "dark" | "light" }) {
  if (!event) return null;
  const muted = tone === "dark" ? "opacity-70" : "opacity-60";
  return (
    <>
      <div className="sm:col-span-3 sm:col-start-2">
        <p className={`eyebrow ${muted}`}>Date</p>
        <p className="mt-1">{formatDate(event.date)}</p>
      </div>
      <div className="sm:col-span-2 sm:col-start-7">
        <p className={`eyebrow ${muted}`}>Time</p>
        <p className="mt-1">{event.time}</p>
      </div>
      <div className="sm:col-span-3 sm:col-start-9 sm:text-right">
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

  return (
    <>
      {/* Paper backdrop for the region the fixed meta bar overlays. The page
          transition (.page-enter) isolates blend groups, so the bar's
          mix-blend-difference needs a real white surface *inside* that group to
          flip against over the copy (→ black); the hero's own black ground keeps
          it white over the image. Paper matches the body, so there is no seam. */}
      <div className="bg-paper">
      {/* ---------- Hero image + title ---------- */}
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

          {/* Title, anchored to the bottom of the first viewport. Inset one
              column (like the reference) so it aligns with the body copy and the
              meta rather than hugging the gutter. */}
          <div className="absolute inset-x-0 bottom-28 z-10 gutter md:bottom-8">
            <div className="lg:grid lg:grid-cols-12">
              <div className="lg:col-span-10 lg:col-start-2">
                <p className="eyebrow opacity-70">{event.code}</p>
                <h1 className="display t-statement mt-3 max-w-[14ch]">
                  <SplitWords text={`${site.wordmark} ${event.city}`} stagger={60} />
                </h1>
              </div>
            </div>
          </div>
        </section>

      {/* The single Date / Time / Location bar. Fixed (like the nav) so its
          mix-blend escapes the page-transition group and blends against the
          whole page: white over the dark hero, black over the pale copy. It
          glides from the hero centre to just under the header, then fades. */}
      <EventMeta>
        <Meta event={event} tone="light" />
      </EventMeta>

      {/* ---------- Description + artwork ---------- */}
      <section className="gutter pt-24 pb-16 md:pt-28 md:pb-24">
        {/* 12-column grid so the copy is inset a column from the gutter — the
            reference indents its body text rather than letting it hug the edge. */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-5 lg:col-start-2">
            <div className="space-y-6">
              {event.paragraphs.map((para) => (
                <p key={para} className="measure max-w-none">
                  {para}
                </p>
              ))}
              <p className="measure max-w-none opacity-60">
                {event.venue}. {formatLat(event.coords.lat)} / {formatLon(event.coords.lon)}
              </p>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-5 lg:col-start-8">
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
      </div>

      {/* ---------- Other shows ---------- */}
      {/* Carries the #tickets anchor (the pinned Tickets button scrolls here);
          each card links through to that show's info & tickets. */}
      <section id="tickets" className="scroll-mt-24 border-t border-hair gutter py-16 md:py-20">
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
