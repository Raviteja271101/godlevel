"use client";

import { useState } from "react";
import CropMarks from "./CropMarks";
import ProductCard from "./ProductCard";
import ScrambleText from "./ScrambleText";
import type { Product } from "@/data/products";

const SIZES = ["XS", "S", "M", "L", "XL"];

/**
 * The reference's shop: a small ▪ label with AVAILABLE SIZE + at the right,
 * over a five-column grid (two on a phone). The size filter keeps products
 * offered in that size; tapping the chosen size again clears it.
 */
export default function ShopGrid({ label, products }: { label: string; products: Product[] }) {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<string | null>(null);
  const shown = size ? products.filter((p) => p.sizes?.includes(size)) : products;

  return (
    <>
      <div className="flex items-start justify-between gap-6">
        <p className="eyebrow">
          <ScrambleText text={label} trigger="view" />
        </p>
        <div className="text-right">
          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
            <ScrambleText text={`Available size ${open ? "−" : "+"}`} />
          </button>
          {open && (
            <div className="mt-3 flex justify-end gap-[9px]">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize((cur) => (cur === s ? null : s))}
                  aria-pressed={size === s}
                  className="relative grid h-[30px] w-[30px] place-items-center"
                >
                  {size === s && <CropMarks className="m-px" />}
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-[27px] grid grid-cols-2 gap-x-[10px] gap-y-5 md:grid-cols-3 md:gap-y-12 lg:grid-cols-5 lg:gap-x-[1.39vw] lg:gap-y-[6.65vw]">
        {shown.map((product) => (
          <ProductCard
            key={product.name}
            product={product}
            sizes="(max-width: 767px) 46vw, (max-width: 1023px) 31vw, 18vw"
          />
        ))}
      </div>
      {shown.length === 0 && <p className="mt-10 opacity-50">Nothing in that size right now.</p>}
    </>
  );
}
