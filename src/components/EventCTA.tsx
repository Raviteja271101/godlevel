"use client";

import { useCart } from "./CartProvider";
import { formatDate } from "./EventCard";
import ScrambleText from "./ScrambleText";
import type { Event } from "@/data/events";
import { site } from "@/data/site";

const DEFAULT_TICKET_PRICE = 45;

/**
 * The Add-to-calendar / Tickets pair pinned bottom-right for the length of
 * an event page. Tickets drops a single ticket for this event straight into
 * the cart and lets the drawer open itself, so both flows share one drawer.
 */
export default function EventCTA({ event }: { event: Event }) {
  const { addItem } = useCart();
  const soldOut = event.status === "Sold out";
  const price = event.ticketPrice ?? DEFAULT_TICKET_PRICE;
  const title = event.name ?? `${site.wordmark} ${event.city}`;

  const day = event.date.replace(/-/g, "");
  const calendarHref =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(`Godlevel ${event.city}`)}` +
    `&dates=${day}/${day}` +
    `&location=${encodeURIComponent(`${event.venue}, ${event.city}, ${event.country}`)}` +
    `&details=${encodeURIComponent(event.blurb)}`;

  const addTicket = () =>
    addItem({
      id: `ticket-${event.slug}`,
      name: `${title} · Ticket`,
      detail: `${event.city} · ${formatDate(event.date)}`,
      price,
      image: event.image,
    });

  return (
    /* The reference's pair: 41px tall, 37px off the corner, labels that
       scramble on hover rather than fade. */
    <div className="fixed right-6 bottom-6 z-[58] flex gap-1.5 md:right-[37px] md:bottom-[37px] md:gap-2">
      <a
        href={calendarHref}
        target="_blank"
        rel="noreferrer"
        className="rounded-[2px] bg-ink px-3 py-2.5 text-white md:px-4 md:py-[13.3px]"
      >
        <ScrambleText text="Add to calendar +" />
      </a>

      {soldOut ? (
        <span className="rounded-[2px] bg-ink-30 px-3 py-2.5 text-white md:px-4 md:py-[13.3px]">Sold out</span>
      ) : (
        <button
          type="button"
          onClick={addTicket}
          className="arrow-link rounded-[2px] bg-bubble px-3 py-2.5 text-white md:px-4 md:py-[13.3px]"
        >
          <ScrambleText text="Tickets" />
        </button>
      )}
    </div>
  );
}
