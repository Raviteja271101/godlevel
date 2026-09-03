"use client";

import { useEffect, useRef, useState } from "react";
import { geoDistance, geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection } from "geojson";
import type { Event } from "@/data/events";

/** Natural Earth 110m country outlines, served from /public so it loads async. */
const ATLAS = "/data/countries-110m.json";

const LAND = "#d6d6d6";
const BORDER = "#ffffff";
const GRATICULE = "#e6e6e6";
const LIMB = "#cfcfcf";
const MARKER = "#ff2b29";

/**
 * Orthographic globe: filled landmasses with country borders, a graticule
 * over the ocean, and one marker per show. The sphere turns to bring the
 * selected city to face the viewer.
 */
export default function Globe({
  events,
  active,
  onSelect,
}: {
  events: Event[];
  active: number;
  onSelect: (index: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [land, setLand] = useState<FeatureCollection | null>(null);

  // Current and target rotation, as d3 expects: [-lon, -lat].
  const rotRef = useRef<[number, number]>([-events[0].coords.lon, -events[0].coords.lat]);
  const targetRef = useRef<[number, number]>([-events[0].coords.lon, -events[0].coords.lat]);
  const hitsRef = useRef<{ x: number; y: number; i: number }[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch(ATLAS)
      .then((r) => r.json())
      .then((topo) => {
        if (cancelled) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fc = feature(topo, (topo as any).objects.countries) as unknown as FeatureCollection;
        setLand(fc);
      })
      .catch(() => {
        /* Globe still draws its sphere and markers without the land layer. */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Aim at the active city, unwrapping longitude so it takes the short way.
  useEffect(() => {
    const target = events[active];
    if (!target) return;
    const want: [number, number] = [-target.coords.lon, -target.coords.lat];
    const [curLon] = targetRef.current;
    const shortest = curLon + ((((want[0] - curLon) % 360) + 540) % 360) - 180;
    targetRef.current = [shortest, want[1]];
  }, [active, events]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let size = 0;

    const projection = geoOrthographic().precision(0.4);
    const path = geoPath(projection, ctx);
    const graticule = geoGraticule10();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = canvas.clientWidth;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const R = size / 2 - 2;

      // Ease toward the selected city.
      const [tLon, tLat] = targetRef.current;
      if (reduced) {
        rotRef.current = [tLon, tLat];
      } else {
        rotRef.current = [
          rotRef.current[0] + (tLon - rotRef.current[0]) * 0.05,
          rotRef.current[1] + (tLat - rotRef.current[1]) * 0.05,
        ];
      }
      const rotate = rotRef.current;

      projection
        .scale(R)
        .translate([size / 2, size / 2])
        .rotate(rotate);

      ctx.clearRect(0, 0, size, size);

      // Ocean.
      ctx.beginPath();
      path({ type: "Sphere" });
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // Graticule over the ocean.
      ctx.beginPath();
      path(graticule);
      ctx.lineWidth = 1;
      ctx.strokeStyle = GRATICULE;
      ctx.stroke();

      // Land, with country borders picked out in white.
      if (land) {
        ctx.beginPath();
        path(land);
        ctx.fillStyle = LAND;
        ctx.fill();
        ctx.lineWidth = 0.7;
        ctx.strokeStyle = BORDER;
        ctx.stroke();
      }

      // Limb.
      ctx.beginPath();
      path({ type: "Sphere" });
      ctx.lineWidth = 1;
      ctx.strokeStyle = LIMB;
      ctx.stroke();

      // Markers — only those on the near hemisphere.
      const centre: [number, number] = [-rotate[0], -rotate[1]];
      const hits: { x: number; y: number; i: number }[] = [];

      events.forEach((event, i) => {
        const point: [number, number] = [event.coords.lon, event.coords.lat];
        if (geoDistance(point, centre) > Math.PI / 2) return;

        const xy = projection(point);
        if (!xy) return;
        const [sx, sy] = xy;
        hits.push({ x: sx, y: sy, i });

        const isActive = i === active;
        const s = isActive ? 9 : 6;

        ctx.fillStyle = MARKER;
        ctx.globalAlpha = isActive ? 1 : 0.85;
        ctx.fillRect(sx - s / 2, sy - s / 2, s, s);

        if (isActive) {
          ctx.beginPath();
          ctx.arc(sx, sy, 14, 0, Math.PI * 2);
          ctx.strokeStyle = MARKER;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.7;
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      });

      hitsRef.current = hits;
      raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [events, active, land]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    let best = -1;
    let bestDist = 28;
    hitsRef.current.forEach((h) => {
      const d = Math.hypot(h.x - px, h.y - py);
      if (d < bestDist) {
        bestDist = d;
        best = h.i;
      }
    });
    if (best !== -1) onSelect(best);
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      aria-hidden="true"
      className="aspect-square w-full cursor-pointer"
    />
  );
}
