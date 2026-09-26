"use client";

import { useCart } from "./CartProvider";
import type { Product } from "@/data/products";

/**
 * The primary CTA on the product detail page. Adds one of this product to
 * the cart and lets the drawer open itself. Sold-out products render a
 * disabled state so the button keeps its slot in the layout.
 */
export default function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();

  if (product.soldOut) {
    return (
      <button
        type="button"
        disabled
        className="mt-6 block w-full bg-ink px-4 py-3 text-center text-white opacity-40"
      >
        Sold out
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => add(product)}
      className="mt-6 block w-full bg-ink px-4 py-3 text-center text-white transition-opacity hover:opacity-80"
    >
      Add to cart · &euro;{product.price}
    </button>
  );
}
