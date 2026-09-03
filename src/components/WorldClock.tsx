"use client";

import { useEffect, useState } from "react";
import Globe from "./Globe";
import { events, formatLat, formatLon } from "@/data/events";

const ROTATE_MS = 6000;

/** Cycles the upcoming venues, showing each one's real local time. */
export default function WorldClock() {
  const [index, setIndex] = useState(0);
  const [now, setNow] = useState<Date | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setNow(new Date());
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    if (paused) return;
    const rotate = setInterval(() => setIndex((i) => (i + 1) % events.length), ROTATE_MS);
    return () => clearInterval(rotate);
  }, [paused]);

  const place = events[index];

  // Rendered blank on the server so local time never mismatches the client.
  const localTime = now
    ? new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: place.tz,
      }).format(now)
    : "--:--:--";

  const select = (i: number) => {
    setIndex(i);
    setPaused(true);
  };

  return (
    <section className="hairline border-b border-hair px-6 py-16 md:px-8 md:py-24">
      <p className="eyebrow">Around the world</p>

      <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        {/* Globe */}
        <div className="order-2 mx-auto w-full max-w-[440px] lg:order-1">
          <Globe events={events} active={index} onSelect={select} />
        </div>

        {/* Readout */}
        <div className="order-1 lg:order-2">
          <h2 className="display t-statement">{place.city}</h2>
          <p className="measure mt-4">
            {place.venue}, {place.country}. {place.blurb}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5">
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
              <dd className="mt-1">{formatLat(place.coords.lat)}</dd>
            </div>
            <div>
              <dt className="opacity-60">Longitude</dt>
              <dd className="mt-1">{formatLon(place.coords.lon)}</dd>
            </div>
          </dl>

          {/* One bar per show; also the manual control. */}
          <div className="mt-8 flex gap-1">
            {events.map((e, i) => (
              <button
                key={e.code}
                type="button"
                onClick={() => select(i)}
                aria-label={`Show ${e.city}`}
                aria-current={i === index}
                className={`h-px flex-1 transition-colors duration-500 ${i === index ? "bg-ink" : "bg-hair"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
