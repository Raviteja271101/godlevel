"use client";

import { useEffect, useRef } from "react";
import type { Event } from "@/data/events";

const DEG = Math.PI / 180;

type Vec = { x: number; y: number; z: number };

/**
 * Lat/lon to a unit-sphere point, spun by `rot` degrees about the poles and
 * tipped by `tilt` degrees about the X axis. Setting tilt to a city's own
 * latitude brings that city to the centre of the visible disc.
 */
function project(lat: number, lon: number, rot: number, tilt: number): Vec {
  const phi = lat * DEG;
  const lambda = (lon + rot) * DEG;
  const t = tilt * DEG;

  const x = Math.cos(phi) * Math.sin(lambda);
  const yRaw = Math.sin(phi);
  const zRaw = Math.cos(phi) * Math.cos(lambda);

  const y = yRaw * Math.cos(t) - zRaw * Math.sin(t);
  const z = yRaw * Math.sin(t) + zRaw * Math.cos(t);

  return { x, y, z };
}

/**
 * A wireframe globe carrying one marker per show. The sphere turns to bring
 * the selected city to the front; markers on the far side fade out.
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
  const rotRef = useRef(-events[0].coords.lon);
  const targetRef = useRef(-events[0].coords.lon);
  const tiltRef = useRef(events[0].coords.lat);
  const tiltTargetRef = useRef(events[0].coords.lat);
  const hitsRef = useRef<{ x: number; y: number; i: number }[]>([]);

  // Aim at the active city; unwrap so it always takes the short way round.
  useEffect(() => {
    const want = -events[active].coords.lon;
    const current = targetRef.current;
    targetRef.current = current + ((((want - current) % 360) + 540) % 360) - 180;
    tiltTargetRef.current = events[active].coords.lat;
  }, [active, events]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let size = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = canvas.clientWidth;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const ink = () =>
      getComputedStyle(document.documentElement).getPropertyValue("--color-ink").trim() || "#000";

    const draw = () => {
      const R = size * 0.42;
      const cx = size / 2;
      const cy = size / 2;
      const colour = ink();

      // Ease the spin toward the selected city.
      if (reduced) {
        rotRef.current = targetRef.current;
        tiltRef.current = tiltTargetRef.current;
      } else {
        rotRef.current += (targetRef.current - rotRef.current) * 0.045;
        tiltRef.current += (tiltTargetRef.current - tiltRef.current) * 0.045;
      }
      const rot = rotRef.current;
      const tilt = tiltRef.current;

      ctx.clearRect(0, 0, size, size);

      // --- Graticule ---------------------------------------------------
      ctx.lineWidth = 1;

      // Latitude rings.
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let started = false;
        for (let lon = 0; lon <= 360; lon += 3) {
          const p = project(lat, lon, rot, tilt);
          if (p.z < 0) {
            started = false;
            continue;
          }
          const sx = cx + p.x * R;
          const sy = cy - p.y * R;
          if (!started) {
            ctx.moveTo(sx, sy);
            started = true;
          } else ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = colour;
        ctx.globalAlpha = 0.22;
        ctx.stroke();
      }

      // Meridians.
      for (let lon = 0; lon < 360; lon += 30) {
        ctx.beginPath();
        let started = false;
        for (let lat = -90; lat <= 90; lat += 3) {
          const p = project(lat, lon, rot, tilt);
          if (p.z < 0) {
            started = false;
            continue;
          }
          const sx = cx + p.x * R;
          const sy = cy - p.y * R;
          if (!started) {
            ctx.moveTo(sx, sy);
            started = true;
          } else ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = colour;
        ctx.globalAlpha = 0.22;
        ctx.stroke();
      }

      // Limb.
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = colour;
      ctx.globalAlpha = 0.45;
      ctx.stroke();

      // --- Markers -----------------------------------------------------
      const hits: { x: number; y: number; i: number }[] = [];

      events.forEach((event, i) => {
        const p = project(event.coords.lat, event.coords.lon, rot, tilt);
        const sx = cx + p.x * R;
        const sy = cy - p.y * R;
        const front = p.z >= 0;
        const isActive = i === active;

        if (front) hits.push({ x: sx, y: sy, i });

        // Depth fade: markers dim as they turn away.
        ctx.globalAlpha = front ? (isActive ? 1 : 0.6) : 0.1;
        ctx.fillStyle = colour;

        const s = isActive ? 7 : 4.5;
        ctx.fillRect(sx - s / 2, sy - s / 2, s, s);

        if (isActive && front) {
          ctx.beginPath();
          ctx.arc(sx, sy, 11, 0, Math.PI * 2);
          ctx.strokeStyle = colour;
          ctx.globalAlpha = 0.9;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Leader line out to the rim.
          ctx.beginPath();
          ctx.moveTo(sx + 11, sy);
          ctx.lineTo(cx + R + 14, sy);
          ctx.globalAlpha = 0.3;
          ctx.stroke();
        }
      });

      hitsRef.current = hits;
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [events, active]);

  // Click the nearest front-facing marker.
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    let best = -1;
    let bestDist = 26;
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
