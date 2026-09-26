"use client";

import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";

/**
 * The reference's floating cart trigger: fixed bottom-right, dark pill with
 * the ▪ CART (N ITEMS) label. Hides itself while the drawer is open — the
 * drawer draws its own copy in the same visual style at its top.
 *
 * Also hides on routes that already own the corner with their own ticket /
 * checkout CTA — event detail pages carry the Tickets button which adds
 * straight to the cart, so a second pill in the same corner is redundant.
 */
export default function CartPill() {
  const { count, open, openCart } = useCart();
  const pathname = usePathname();
  const hideForRoute = /^\/events\/[^/]+/.test(pathname ?? "");

  if (hideForRoute) return null;

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
      hidden={open}
      className="fixed right-4 bottom-4 z-40 bg-night px-4 py-2 text-white shadow-[0_6px_20px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-90 md:right-8 md:bottom-8"
    >
      <span className="eyebrow">
        CART ({count} ITEM{count === 1 ? "" : "S"})
      </span>
    </button>
  );
}
