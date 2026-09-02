"use client";

import { useEffect, useState } from "react";
import { events } from "@/data/events";

/** Cycles the upcoming venues, showing each one's real local time. */
export default function WorldClock() {
  const [index, setIndex] = useState(0);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const tick = setInterval(() => setNow(new Date()), 1000);
    const rotate = setInterval(() => setIndex((i) => (i + 1) % events.length), 5000);
    return () => {
      clearInterval(tick);
      clearInterval(rotate);
    };
  }, []);

  const place = events[index];

  const localTime = now
    ? new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: place.tz,
      }).format(now)
    : "--:--:--";

  return (
    <section className="hairline border-b border-hair px-6 py-16 md:px-8 md:py-24">
      <p className="eyebrow">Around the world</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <div>
          <h2 className="display text-[2rem] leading-[0.9] sm:text-[2.5rem] md:text-[8vw] md:leading-[0.85] lg:text-[6.5rem]">{place.city}</h2>
          <p className="measure mt-5">
            {place.venue}, {place.country}. {place.blurb}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <dt className="opacity-60">Local time</dt>
            <dd className="mt-1 tabular-nums">{localTime}</dd>
          </div>
          <div>
            <dt className="opacity-60">Show</dt>
            <dd className="mt-1">{place.code}</dd>
          </div>
          <div>
            <dt className="opacity-60">Latitude</dt>
            <dd className="mt-1">{place.coords.lat}</dd>
          </div>
          <div>
            <dt className="opacity-60">Longitude</dt>
            <dd className="mt-1">{place.coords.lon}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-10 flex gap-1">
        {events.map((e, i) => (
          <button
            key={e.code}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show ${e.city}`}
            className={`h-px flex-1 transition-colors duration-500 ${i === index ? "bg-ink" : "bg-hair"}`}
          />
        ))}
      </div>
    </section>
  );
}
