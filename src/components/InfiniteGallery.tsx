"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import CropMarks from "./CropMarks";
import { artworks, type Artwork } from "@/data/artworks";

/* Canvas geometry, measured off the reference's infinite grid.
   Cells are 374 square; the still sits 218×123 (16:9) near the top of its
   cell, leaving the airy whitespace that makes the sheet read as scattered. */
const CELL_W = 374;
const CELL_H = 374;
const IMG_W = 218;
const IMG_H = 123;
const PAD_TOP = 50;
const RADIUS = 4;

const IMG_LEFT = (CELL_W - IMG_W) / 2;

/* Idle drift: the sheet keeps moving toward wherever the pointer sits, faster
   the further it is from centre. Measured off the reference at ~0.0006px per
   frame per px of offset (about 18px/s out at a corner). */
const IDLE_FACTOR = 0.0006;

/* The detail card the reference opens on click: a fixed 320px card, 20px
   padding, 20px gap. */
const CARD_W = 320;
const CARD_H_EST = 500;

type Tile = { key: string; x: number; y: number; art: Artwork };
type Rect = { left: number; top: number; width: number; height: number };
type Selection = { art: Artwork; rect: Rect };

/**
 * A pannable, endlessly wrapping contact-sheet of stills.
 *
 * One block of tiles is sized to more than cover the viewport, then painted
 * four times at the block's own width and height. The whole layer is dragged
 * around and its translation wrapped into a single block span, so whichever
 * way it is thrown there is always a copy filling the gap and the seam never
 * arrives. The transform is written straight to the node each frame, so a
 * drag never re-renders React.
 *
 * Clicking a still opens the reference's detail card: the grid dims to a wash
 * of white behind it, the clicked frame stays lit, and the piece's title,
 * credit and note sit beside it.
 */
export default function InfiniteGallery() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  const [tiles, setTiles] = useState<Tile[]>([]);
  const [world, setWorld] = useState({ w: 0, h: 0 });
  const [selected, setSelected] = useState<Selection | null>(null);

  // Live pan state kept out of React so dragging never triggers a render.
  const off = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });
  const drag = useRef({ active: false, moved: 0, lastX: 0, lastY: 0, captured: false });
  const worldRef = useRef({ w: 0, h: 0 });
  // Latest pointer position for the idle drift; active is false on touch or
  // once the pointer leaves the sheet, which parks the drift.
  const pointer = useRef({ x: 0, y: 0, active: false });
  const openRef = useRef(false); // a card is open — freeze the sheet
  const reducedRef = useRef(false);

  // Build the block once the viewport is measured, and rebuild on resize.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const build = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      // One extra cell each way so a wrapped copy always overlaps the seam.
      const cols = Math.ceil(w / CELL_W) + 1;
      const rows = Math.ceil(h / CELL_H) + 1;

      const next: Tile[] = [];
      const n = artworks.length;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Deterministic scatter so neighbours differ and every piece shows.
          const art = artworks[(c * 3 + r * 7 + (r % 2) * 5) % n];
          next.push({ key: `${r}-${c}`, x: c * CELL_W, y: r * CELL_H, art });
        }
      }
      worldRef.current = { w: cols * CELL_W, h: rows * CELL_H };
      setWorld({ w: cols * CELL_W, h: rows * CELL_H });
      setTiles(next);
    };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The animation loop: apply momentum when not dragging and paint the layer.
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    let raf = 0;

    const frame = () => {
      const d = drag.current;
      if (!d.active) {
        // Momentum from the last throw, decaying.
        off.current.x += vel.current.x;
        off.current.y += vel.current.y;
        vel.current.x *= 0.92;
        vel.current.y *= 0.92;
        if (Math.abs(vel.current.x) < 0.05) vel.current.x = 0;
        if (Math.abs(vel.current.y) < 0.05) vel.current.y = 0;

        // Continuous drift toward the pointer, unless a card is open.
        const p = pointer.current;
        if (p.active && !openRef.current && !reducedRef.current) {
          off.current.x += (p.x - window.innerWidth / 2) * IDLE_FACTOR;
          off.current.y += (p.y - window.innerHeight / 2) * IDLE_FACTOR;
        }
      }
      const { w, h } = worldRef.current;
      if (w > 0 && h > 0) {
        const mx = ((off.current.x % w) + w) % w;
        const my = ((off.current.y % h) + h) % h;
        layer.style.transform = `translate3d(${mx - w}px, ${my - h}px, 0)`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Keep the loop's read-only flags in step with React state / preferences.
  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  useEffect(() => {
    openRef.current = selected !== null;
  }, [selected]);

  // Close the card on Escape.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  // Pointer dragging with throw. Pointer capture keeps the gesture even when
  // the cursor leaves the element mid-drag.
  const onPointerDown = (e: React.PointerEvent) => {
    if (selected) return; // no panning while a card is open
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const d = drag.current;
    d.active = true;
    d.moved = 0;
    d.captured = false;
    d.lastX = e.clientX;
    d.lastY = e.clientY;
    vel.current.x = 0;
    vel.current.y = 0;
    // Capture is deferred to the first real move: capturing here would make
    // the browser retarget a plain click to the viewport, so a still click
    // would never reach the frame it was meant to pick.
  };

  const onPointerMove = (e: React.PointerEvent) => {
    // Feed the idle drift on every move, not only while dragging.
    if (e.pointerType !== "touch") {
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
      pointer.current.active = true;
    }
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.lastX;
    const dy = e.clientY - d.lastY;
    d.lastX = e.clientX;
    d.lastY = e.clientY;
    d.moved += Math.abs(dx) + Math.abs(dy);
    if (!d.captured && d.moved > 6) {
      d.captured = true;
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {}
      viewportRef.current?.setAttribute("data-dragging", "true");
    }
    off.current.x += dx;
    off.current.y += dy;
    vel.current.x = dx;
    vel.current.y = dy;
  };

  const endDrag = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    if (d.captured) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      d.captured = false;
    }
    viewportRef.current?.removeAttribute("data-dragging");
  };

  // A click that followed real movement is a drag, not a pick.
  const openFromTile = (art: Artwork) => (e: React.MouseEvent) => {
    if (drag.current.moved > 6) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setSelected({ art, rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height } });
  };

  const copies = [
    { x: 0, y: 0 },
    { x: world.w, y: 0 },
    { x: 0, y: world.h },
    { x: world.w, y: world.h },
  ];

  return (
    <div
      ref={viewportRef}
      className="infinite-gallery relative h-[100svh] w-full touch-none overflow-hidden bg-paper select-none [cursor:grab] data-[dragging]:[cursor:grabbing]"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={() => {
        pointer.current.active = false;
      }}
    >
      <div ref={layerRef} className="absolute left-0 top-0 will-change-transform">
        {world.w > 0 &&
          copies.map((copy, ci) => (
            <div
              key={ci}
              className="absolute left-0 top-0"
              style={{ width: world.w, height: world.h, transform: `translate3d(${copy.x}px, ${copy.y}px, 0)` }}
            >
              {tiles.map((t) => (
                <figure
                  key={`${ci}-${t.key}`}
                  className="absolute m-0"
                  style={{ left: t.x, top: t.y, width: CELL_W, height: CELL_H }}
                >
                  <div
                    data-cursor-text="more info"
                    onClick={openFromTile(t.art)}
                    className="absolute overflow-hidden bg-[#efefef]"
                    style={{ left: IMG_LEFT, top: PAD_TOP, width: IMG_W, height: IMG_H, borderRadius: RADIUS }}
                  >
                    {/* Plain img: the same 14 stills tile the whole canvas, so
                        the optimizer would only get in the way here. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.art.src} alt="" draggable={false} className="h-full w-full object-cover" />
                  </div>
                </figure>
              ))}
            </div>
          ))}
      </div>

      {selected && <DetailCard selection={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

/** The reference's click-through: dimmed grid, lit frame, and the piece's card. */
function DetailCard({ selection, onClose }: { selection: Selection; onClose: () => void }) {
  const { art, rect } = selection;

  // Anchor the card next to the picked frame, clamped fully on-screen.
  const pos = useMemo(() => {
    if (typeof window === "undefined") return null;
    const gap = 16;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let left = rect.left + rect.width + gap;
    if (left + CARD_W + gap > vw) left = rect.left - CARD_W - gap; // flip to the left
    left = Math.max(gap, Math.min(left, vw - CARD_W - gap));
    const top = Math.max(gap, Math.min(rect.top, vh - CARD_H_EST - gap));
    return { left, top };
  }, [rect]);

  return (
    <div className="fixed inset-0 z-50" aria-modal="true" role="dialog">
      {/* Wash the grid out to near-white, but let the picked frame stay lit. */}
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-paper/75"
      />

      {/* The frame the pointer picked, kept vivid above the wash. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={art.src}
        alt=""
        className="pointer-events-none absolute object-cover"
        style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height, borderRadius: RADIUS }}
      />

      {/* The detail card. */}
      <div
        className="absolute w-80"
        style={{ left: pos?.left ?? rect.left, top: pos?.top ?? rect.top, visibility: pos ? "visible" : "hidden" }}
      >
        {/* Header: title chip + close, both black with white ink. */}
        <div className="mb-2 flex items-stretch gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2 bg-night px-3 py-2 text-paper">
            <span aria-hidden className="inline-block h-[6px] w-[6px] shrink-0 bg-paper" />
            <span className="truncate">{art.title}</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex aspect-square items-center justify-center bg-night px-3 text-paper transition-opacity hover:opacity-70"
          >
            ✕
          </button>
        </div>

        {/* Body: crop-marked white card — image, credit pill, justified note. */}
        <div className="relative border border-hair bg-paper p-5">
          <CropMarks />

          <div className="relative overflow-hidden">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#efefef]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={art.src} alt={art.title} className="h-full w-full object-cover" />
            </div>
            {/* Credit pill over the image's foot. */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-night px-2 py-1 text-paper">
              <span aria-hidden>↗</span>
              <span className="text-ink-30">by</span>
              <span className="underline underline-offset-2">{art.artist}</span>
            </div>
          </div>

          <p className="mt-5 text-justify leading-[1.2] text-ink">{art.description}</p>
        </div>
      </div>
    </div>
  );
}
