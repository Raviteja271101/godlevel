import type { Metadata } from "next";
import EventsReel from "@/components/EventsReel";
import { events } from "@/data/events";

export const metadata: Metadata = {
  title: "Events",
  description: "Every upcoming Slow Light show.",
};

export default function EventsPage() {
  return (
    <section>
      <EventsReel events={events} />
    </section>
  );
}
