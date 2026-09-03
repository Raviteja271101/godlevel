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
const ACTIVE = "#000000";

/** Keeps the pole from tipping past vertical while dragging. */
const clampLat = (lat: number) => Math.max(-90, Math.min(90, lat));

/** Idle drift, in degrees per frame — about one turn every 100s at 60fps. */
const SPIN = 0.06;

/**
 * Orthographic globe: filled landmasses with country borders, a graticule
 * over the ocean, and one marker per show. The sphere turns to bring the
 * selected city to face the viewer.
 */
export default function Globe({
  events,
  active,
  selected,
  onSelect,
  onInteract,
  onHover,
}: {
  events: Event[];
  active: number;
  /* Index the user actually clicked. Null until then, so the globe opens
     with no target planted on it. */
  selected: number | null;
  onSelect: (index: number) => void;
  /** Fired when the user grabs the globe, so the caller can stop advancing. */
  onInteract?: () => void;
  /* Fires with the point under the cursor, or null when off the sphere. */
  onHover?: (coords: { lat: number; lon: number } | null) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /* Set by the draw effect so pointer handlers can invert screen points. */
  const projRef = useRef<ReturnType<typeof geoOrthographic> | null>(null);
  const [land, setLand] = useState<FeatureCollection | null>(null);

  // Current and target rotation, as d3 expects: [-lon, -lat].
  const rotRef = useRef<[number, number]>([-events[0].coords.lon, -events[0].coords.lat]);
  const targetRef = useRef<[number, number]>([-events[0].coords.lon, -events[0].coords.lat]);
  const hitsRef = useRef<{ x: number; y: number; i: number }[]>([]);

  // Drag state: while the user holds the globe they own the rotation, and on
  // release it keeps spinning briefly before settling.
  const draggingRef = useRef(false);
  const lastPtRef = useRef<{ x: number; y: number } | null>(null);
  const velRef = useRef<[number, number]>([0, 0]);
  const movedRef = useRef(0);

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
    if (!target || draggingRef.current) return;
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
    const fontFamily = getComputedStyle(canvas).fontFamily;

    const projection = geoOrthographic().precision(0.4);
    projRef.current = projection;
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

      if (draggingRef.current) {
        // The pointer is driving; rotRef is updated by the move handler.
      } else if (Math.abs(velRef.current[0]) > 0.02 || Math.abs(velRef.current[1]) > 0.02) {
        // Coast after release, shedding speed each frame.
        rotRef.current = [
          rotRef.current[0] + velRef.current[0],
          clampLat(rotRef.current[1] + velRef.current[1]),
        ];
        velRef.current = [velRef.current[0] * 0.94, velRef.current[1] * 0.94];
        targetRef.current = rotRef.current;
      } else {
        // Idle: drift west continuously so the globe is never still, easing
        // toward the selected city as it goes.
        if (!reduced) {
          targetRef.current = [targetRef.current[0] - SPIN, targetRef.current[1]];
        }
        const [tLon, tLat] = targetRef.current;
        if (reduced) {
          rotRef.current = [tLon, tLat];
        } else {
          rotRef.current = [
            rotRef.current[0] + (tLon - rotRef.current[0]) * 0.05,
            rotRef.current[1] + (tLat - rotRef.current[1]) * 0.05,
          ];
        }
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

        // Only a clicked point is marked out — the auto-advancing selection
        // turns the globe but plants no target.
        const isPicked = i === selected;
        const s = isPicked ? 9 : 6;

        ctx.fillStyle = isPicked ? ACTIVE : MARKER;
        ctx.globalAlpha = isPicked ? 1 : 0.85;
        ctx.fillRect(sx - s / 2, sy - s / 2, s, s);

        if (isPicked) {
          ctx.beginPath();
          ctx.arc(sx, sy, 14, 0, Math.PI * 2);
          ctx.strokeStyle = ACTIVE;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.7;
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      });

      // Below lg the corner readouts are hidden, so the globe labels itself:
      // a black plate beside the active marker, as on the reference.
      const act = hits.find((h) => h.i === selected);
      if (act) {
        const ev = events[act.i];
        const lines = [
          `${ev.city}, ${ev.country}`.toUpperCase(),
          String(new Date(`${ev.date}T12:00:00Z`).getUTCFullYear()),
        ];

        ctx.font = `500 10px ${fontFamily}`;
        ctx.textBaseline = "top";
        const padX = 8;
        const padY = 6;
        const lineH = 15;
        const boxW = Math.max(...lines.map((l) => ctx.measureText(l).width)) + padX * 2;
        const boxH = lineH * lines.length + padY * 2 - 3;

        // Sits to the right of the marker, flipping across when it would
        // otherwise run off the canvas, and stays within the top and bottom.
        const bx = act.x + 12 + boxW > size ? act.x - 12 - boxW : act.x + 12;
        const by = Math.max(2, Math.min(size - boxH - 2, act.y - boxH / 2));

        ctx.fillStyle = ACTIVE;
        ctx.fillRect(bx, by, boxW, boxH);
        ctx.fillStyle = "#ffffff";
        lines.forEach((l, n) => ctx.fillText(l, bx + padX, by + padY + n * lineH));
      }

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
  }, [events, active, selected, land]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    draggingRef.current = true;
    movedRef.current = 0;
    velRef.current = [0, 0];
    lastPtRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
    onInteract?.();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // Report the point under the cursor so the caller can show live
    // coordinates. Null whenever the pointer is off the sphere.
    if (onHover && !draggingRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const r = rect.width / 2;
      if (Math.hypot(px - r, py - r) > r - 2) {
        onHover(null);
      } else {
        const inv = projRef.current?.invert?.([px, py]);
        onHover(inv ? { lon: inv[0], lat: inv[1] } : null);
      }
    }

    if (!draggingRef.current || !lastPtRef.current) return;

    const dx = e.clientX - lastPtRef.current.x;
    const dy = e.clientY - lastPtRef.current.y;
    lastPtRef.current = { x: e.clientX, y: e.clientY };
    movedRef.current += Math.abs(dx) + Math.abs(dy);

    // Degrees per pixel, scaled so a drag across the globe is about a turn.
    const k = 0.32;
    const next: [number, number] = [
      rotRef.current[0] + dx * k,
      clampLat(rotRef.current[1] - dy * k),
    ];
    rotRef.current = next;
    targetRef.current = next;
    velRef.current = [dx * k, -dy * k];
  };

  const endDrag = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    lastPtRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // A drag should not also count as picking a marker.
    if (movedRef.current > 6) return;

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
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => onHover?.(null)}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClick={handleClick}
      aria-hidden="true"
      // pan-y keeps vertical page scrolling working over the globe on touch,
      // while horizontal drags still spin it.
      className="aspect-square w-full cursor-grab touch-pan-y active:cursor-grabbing"
    />
  );
}
