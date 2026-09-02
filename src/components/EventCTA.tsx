import type { Event } from "@/data/events";

/**
 * The ticket / calendar pair that stays pinned to the bottom-right of the
 * event page for its whole length.
 */
export default function EventCTA({ event }: { event: Event }) {
  const soldOut = event.status === "Sold out";

  // A Google Calendar template link, built from the event date.
  const day = event.date.replace(/-/g, "");
  const calendarHref =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(`Slow Light ${event.city}`)}` +
    `&dates=${day}/${day}` +
    `&location=${encodeURIComponent(`${event.venue}, ${event.city}, ${event.country}`)}` +
    `&details=${encodeURIComponent(event.blurb)}`;

  return (
    <div className="fixed right-6 bottom-6 z-[58] flex gap-2 md:right-8 md:bottom-8">
      <a
        href={calendarHref}
        target="_blank"
        rel="noreferrer"
        className="rounded-[2px] bg-ink px-4 py-3 text-white transition-opacity hover:opacity-80"
      >
        Add to calendar +
      </a>

      {soldOut ? (
        <span className="rounded-[2px] bg-ink-30 px-4 py-3 text-white">Sold out</span>
      ) : (
        <a
          href="#tickets"
          className="arrow-link rounded-[2px] bg-bubble px-4 py-3 text-white transition-opacity hover:opacity-80"
        >
          Tickets
        </a>
      )}
    </div>
  );
}
