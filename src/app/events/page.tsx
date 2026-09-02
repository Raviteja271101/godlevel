import type { Metadata } from "next";
import Image from "next/image";
import CropMarks from "@/components/CropMarks";
import { formatDate } from "@/components/EventCard";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { events } from "@/data/events";

export const metadata: Metadata = {
  title: "Events",
  description: "Every upcoming Slow Light show.",
};

export default function EventsPage() {
  return (
    <>
      <PageHeader
        eyebrow={`Season 09 — ${events.length} shows`}
        title="Events"
        intro="Each show is built for the room it happens in. Capacities are small, line-ups are announced late, and tickets are sold in releases rather than all at once."
      />

      <section className="px-6 pb-24 md:px-8">
        <ul className="hairline">
          {events.map((event, i) => (
            <li key={event.code}>
              <Reveal>
                <article
                  className="group grid gap-4 border-b border-hair py-6 md:grid-cols-[52px_140px_1fr_auto] md:items-center md:gap-8"
                  data-cursor-text={event.status === "Sold out" ? "Sold out" : "Info & tickets"}
                >
                  <span className="text-ink-30">[{String(i + 1).padStart(2, "0")}]</span>

                  <div className="relative aspect-[16/11] overflow-hidden bg-[#efefef]">
                    <CropMarks />
                    <Image
                      src={event.image}
                      alt={`${event.venue}, ${event.city}`}
                      fill
                      sizes="(max-width: 768px) 92vw, 140px"
                      className="media-zoom object-cover group-hover:scale-[1.04]"
                    />
                  </div>

                  <div>
                    <h2 className="display text-3xl md:text-4xl">
                      {event.city}
                      <span className="text-ink-30">, {event.country}</span>
                    </h2>
                    <p className="mt-1">{event.venue}</p>
                    <p className="measure mt-2 opacity-60">{event.blurb}</p>
                    <p className="mt-2 opacity-60">{event.lineup.join("  ·  ")}</p>
                  </div>

                  <div className="md:text-right">
                    <p>{formatDate(event.date)}</p>
                    <p className="mt-1 opacity-60">{event.status}</p>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
