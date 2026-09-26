"use client";

import { useState } from "react";
import CropMarks from "./CropMarks";
import ScrambleText from "./ScrambleText";
import { useCart } from "./CartProvider";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/price";

/**
 * The buy block on the product page, as on the reference: name and price,
 * the size choices (the chosen one framed in crop marks), a red 41px
 * ADD TO CART + that scrambles on hover, and the shipping note. The first
 * size starts selected so the button always has something to add.
 */
export default function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();
  const [size, setSize] = useState(product.sizes?.[0]);

  return (
    <div>
      <h1 className="font-medium">{product.name}</h1>
      <p className="mt-[10px]">{formatPrice(product.price)}</p>

      {product.sizes && (
        <div className="mt-[26px] flex gap-[9px]" role="radiogroup" aria-label="Size">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={size === s}
              onClick={() => setSize(s)}
              className="relative grid h-[30px] w-[30px] place-items-center"
            >
              {size === s && <CropMarks className="m-px" />}
              {s}
            </button>
          ))}
        </div>
      )}

      {product.soldOut ? (
        <span className="mt-5 block rounded-[2px] bg-ink-30 py-[13.3px] text-center text-white">
          Sold out
        </span>
      ) : (
        <button
          type="button"
          onClick={() => add(product, size)}
          className="mt-5 block w-full rounded-[2px] bg-bubble py-[13.3px] text-center text-white"
        >
          <ScrambleText text="Add to cart +" />
        </button>
      )}

      <p className="mt-[27px] text-[0.85em] opacity-50">Free shipping for orders above &euro;100</p>
    </div>
  );
}
