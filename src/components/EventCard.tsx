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
      className="group block w-full"
      data-cursor-text="Info & tickets"
    >
      {/* As on the reference: the image fills the card at rest; on hover it
          draws in 8px on every side (0.6s expo out) and the corner marks fade
          in around it (0.8s). */}
      <div className="relative aspect-[4/3]">
        <CropMarks className="event-card-marks" />
        <div className="event-card-media absolute overflow-hidden bg-[#efefef]">
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
        <span className="absolute top-0 left-0">
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
