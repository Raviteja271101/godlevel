import Image from "next/image";
import Link from "next/link";
import CropMarks from "./CropMarks";
import type { Event } from "@/data/events";
import { site } from "@/data/site";

export function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`)
    .toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
    .toUpperCase();
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
    <Link href="/events" className="group block" data-cursor-text="Info & tickets">
      <div className="relative aspect-[16/11] overflow-hidden bg-[#efefef]">
        <CropMarks />
        <Image
          src={event.image}
          alt={`${event.venue}, ${event.city}`}
          fill
          sizes={sizes}
          className="media-zoom object-cover group-hover:scale-[1.03]"
        />
      </div>

      <div className="mt-3 flex gap-3">
        <span className="text-ink-30">[{String(index + 1).padStart(2, "0")}]</span>
        <span>
          <span className="block transition-opacity group-hover:opacity-60">
            {site.wordmark} {event.city}
          </span>
          <span className="block opacity-60">{formatDate(event.date)}</span>
        </span>
      </div>
    </Link>
  );
}
