import Image from "next/image";
import Link from "next/link";
import CropMarks from "./CropMarks";
import ScrambleText from "./ScrambleText";
import type { Event } from "@/data/events";
import { site } from "@/data/site";

export function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`)
    .toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
    .toUpperCase();
}

/** "12 & 13 DECEMBER 2026" for a run spanning two days of the same month. */
export function formatDateRange(iso: string, isoEnd?: string) {
  if (!isoEnd) return formatDate(iso);

  const start = new Date(`${iso}T12:00:00Z`);
  const end = new Date(`${isoEnd}T12:00:00Z`);
  const sameMonth =
    start.getUTCFullYear() === end.getUTCFullYear() && start.getUTCMonth() === end.getUTCMonth();

  return sameMonth
    ? `${start.getUTCDate()} & ${formatDate(isoEnd)}`
    : `${formatDate(iso)} — ${formatDate(isoEnd)}`;
}

export default function EventCard({
  event,
  index,
  sizes,
}: {
  event: Event;
  index: number;
  sizes: string;
}) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group mx-auto block w-full max-w-[28em]"
      data-cursor-text="Info & tickets"
    >
      {/* The marks frame the outer box and the image sits inset within it, so
          they read against the page rather than over the photograph. */}
      <div className="relative flex aspect-[4/3] items-center justify-center">
        <CropMarks />
        <div className="relative h-[calc(100%-1em)] w-[calc(100%-1em)] overflow-hidden bg-[#efefef]">
          <Image
            src={event.image}
            alt={`${event.venue}, ${event.city}`}
            fill
            sizes={sizes}
            className="object-cover"
          />
        </div>
      </div>

      {/* The count sits clear of the text column, which is indented past it.
          Hover scrambles both lines — no zoom, no fade, as on the reference. */}
      <div className="relative mt-[0.625em] flex w-full items-start justify-between">
        <span className="absolute top-0 left-0 text-ink-30">
          [{String(index + 1).padStart(2, "0")}]
        </span>
        <span className="ml-[2.5em] flex flex-col gap-[0.375em]">
          <span className="block font-medium">
            <ScrambleText text={event.name ?? `${site.wordmark} ${event.city}`} />
          </span>
          <span className="block">
            <ScrambleText text={formatDateRange(event.date, event.dateEnd)} />
          </span>
        </span>
      </div>
    </Link>
  );
}
