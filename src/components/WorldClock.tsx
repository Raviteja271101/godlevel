"use client";

import { useEffect, useMemo, useState } from "react";
import Globe from "./Globe";
import { events, formatLat, formatLon } from "@/data/events";
import { site } from "@/data/site";

const ROTATE_MS = 6000;
type Filter = "all" | "upcoming";

/**
 * The globe section: a turning world with a marker per show, plus the
 * selected venue's live local time and coordinates.
 */
export default function WorldClock() {
  const [filter, setFilter] = useState<Filter>("all");
  const [index, setIndex] = useState(0);
  const [now, setNow] = useState<Date | null>(null);
  const [paused, setPaused] = useState(false);

  const shown = useMemo(
    () => (filter === "all" ? events : events.filter((e) => e.status !== "Sold out")),
    [filter],
  );

  useEffect(() => {
    setNow(new Date());
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    if (paused) return;
    const rotate = setInterval(() => setIndex((i) => (i + 1) % shown.length), ROTATE_MS);
    return () => clearInterval(rotate);
  }, [paused, shown.length]);

  // Clamped during render: a filter can shrink the list under the current
  // selection, and the globe reads this before any effect could correct it.
  const safeIndex = Math.min(index, shown.length - 1);
  const place = shown[safeIndex];

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

  const offset = now
    ? new Intl.DateTimeFormat("en-GB", { timeZone: place.tz, timeZoneName: "shortOffset" })
        .formatToParts(now)
        .find((p) => p.type === "timeZoneName")?.value ?? place.tz
    : "";

  const select = (i: number) => {
    setIndex(i);
    setPaused(true);
  };

  const filterLink = (value: Filter, label: string) => (
    <button
      type="button"
      onClick={() => setFilter(value)}
      className={`transition-opacity ${filter === value ? "underline underline-offset-4" : "opacity-50 hover:opacity-100"}`}
    >
      {label}
    </button>
  );

  return (
    <section className="hairline border-b border-hair px-6 py-16 md:px-8 md:py-20">
      <div className="relative mx-auto max-w-[1500px]">
        {/* Globe sits behind the copy on wide screens. */}
        <div className="relative mx-auto w-full max-w-[340px] lg:absolute lg:inset-x-0 lg:top-1/2 lg:max-w-none lg:-translate-y-1/2">
          <div className="mx-auto w-full max-w-[340px] lg:max-w-[554px]">
            <Globe events={shown} active={safeIndex} onSelect={select} />
          </div>
        </div>

        {/* Copy layer */}
        <div className="relative lg:pointer-events-none lg:grid lg:min-h-[620px] lg:grid-rows-[auto_1fr_auto]">
          {/* Top row: headline left, clock right */}
          <div className="lg:flex lg:items-start lg:justify-between lg:gap-8">
            <div className="lg:pointer-events-auto lg:max-w-[26ch]">
              <h2 className="display t-statement">
                Discover the world of {site.name} around the globe
              </h2>
              <div className="mt-4 flex gap-2 lg:mt-6">
                {filterLink("all", "All")}
                <span className="opacity-40">/</span>
                {filterLink("upcoming", "Upcoming")}
              </div>
            </div>

            <div className="mt-8 lg:mt-0 lg:pointer-events-auto lg:text-right">
              <p>
                <span className="opacity-50">Local time:</span>{" "}
                <span className="tabular-nums">{localTime}</span>
              </p>
              <p className="mt-1">
                <span className="opacity-50">Time zone:</span> {offset}
              </p>
            </div>
          </div>

          <div />

          {/* Bottom row: coordinates left, blurb right */}
          <div className="mt-10 lg:mt-0 lg:flex lg:items-end lg:justify-between lg:gap-8">
            <div className="lg:pointer-events-auto">
              <p>
                <span className="opacity-50">Lat:</span> {formatLat(place.coords.lat)}
              </p>
              <p className="mt-1">
                <span className="opacity-50">Lon:</span> {formatLon(place.coords.lon)}
              </p>
              <p className="mt-3">
                {place.code} &mdash; {place.city}, {place.country}
              </p>
            </div>

            <p className="measure mt-8 lg:mt-0 lg:pointer-events-auto lg:text-right">
              {site.name} moves from city to city, taking its shows to places that were never
              built for them. Every location changes the night: a different room, a different
              crowd, the same intent.
            </p>
          </div>
        </div>

        {/* One bar per show, doubling as the selector. */}
        <div className="relative mt-10 flex gap-1 lg:mt-8">
          {shown.map((e, i) => (
            <button
              key={e.code}
              type="button"
              onClick={() => select(i)}
              aria-label={`Show ${e.city}`}
              aria-current={i === safeIndex}
              className={`h-px flex-1 transition-colors duration-500 ${i === safeIndex ? "bg-ink" : "bg-hair"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
