"use client";

import { useEffect, useMemo, useState } from "react";
import Globe from "./Globe";
import { events, formatLat, formatLon } from "@/data/events";
import { site } from "@/data/site";

const ROTATE_MS = 6000;
type Filter = "all" | "upcoming";

/**
 * The globe section.
 *
 * Desktop stacks three layers over one another — the globe in the middle,
 * copy across the top and bottom — so the headline runs over the sphere.
 * A phone has no room for that, so the same pieces fall into one column:
 * headline, filter, globe, standfirst. The time and coordinate readouts
 * drop away there, as on the reference.
 */
export default function WorldClock() {
  const [filter, setFilter] = useState<Filter>("all");
  const [index, setIndex] = useState(0);
  const [now, setNow] = useState<Date | null>(null);
  const [paused, setPaused] = useState(false);
  /* Point under the cursor, driving the live coordinate readout. */
  const [hover, setHover] = useState<{ lat: number; lon: number } | null>(null);

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
    <section className="hairline border-b border-hair gutter py-16 md:py-20">
      <div className="relative mx-auto flex max-w-[1500px] flex-col lg:block lg:min-h-[620px]">
        {/* ---- Globe: in column on a phone, centred behind the copy above lg ---- */}
        <div className="order-2 w-full lg:absolute lg:inset-0 lg:order-none lg:grid lg:place-items-center">
          <div className="mx-auto w-full lg:max-w-[554px]">
            <Globe
              events={shown}
              active={safeIndex}
              onSelect={select}
              onInteract={() => setPaused(true)}
              onHover={setHover}
            />
          </div>
        </div>

        {/* ---- Top copy: headline and filter, clock to the right ---- */}
        <div className="order-1 lg:pointer-events-none lg:absolute lg:inset-x-0 lg:top-0 lg:order-none lg:flex lg:justify-between lg:gap-8 lg:px-[7.8vw]">
          <div className="lg:max-w-[34rem]">
            {/* Broken by hand so the three lines fall where they should, not
                wherever the column happens to end. */}
            <h2 className="display t-statement">
              {[`Discover the`, `World of ${site.name}`, `Around the globe`].map((line) => (
                <span key={line} className="block whitespace-nowrap">
                  {line}
                </span>
              ))}
            </h2>
            <div className="mt-5 flex gap-2 lg:pointer-events-auto lg:mt-6">
              {filterLink("all", "All")}
              <span className="opacity-40">/</span>
              {filterLink("upcoming", "Upcoming")}
            </div>
          </div>

          {/* Readouts are desktop-only; a phone drops them. */}
          <div className="hidden lg:block lg:text-right">
            <p>
              <span className="opacity-50">Local time:</span>{" "}
              <span className="tabular-nums">{localTime}</span>
            </p>
            <p className="mt-1">
              <span className="opacity-50">Time zone:</span> {offset}
            </p>
          </div>
        </div>

        {/* ---- Bottom copy: coordinates left, standfirst right ---- */}
        <div className="order-3 mt-10 lg:pointer-events-none lg:absolute lg:inset-x-0 lg:bottom-0 lg:order-none lg:mt-0 lg:flex lg:items-end lg:justify-between lg:gap-8 lg:px-[7.8vw]">
          <div className="hidden lg:block">
            <p>
              <span className="opacity-50">Lat:</span> {formatLat((hover ?? place.coords).lat)}
            </p>
            <p className="mt-1">
              <span className="opacity-50">Lon:</span> {formatLon((hover ?? place.coords).lon)}
            </p>
          </div>

          <p className="measure lg:text-right">
            Moving from city to city, every destination brings a different energy, a
            different perspective, and a new story to the experience.
          </p>
        </div>
      </div>
    </section>
  );
}
