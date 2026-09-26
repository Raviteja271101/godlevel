"use client";

import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";

/**
 * The reference's floating cart trigger: fixed bottom-right, #333 tag with
 * the ▪ CART (N ITEMS) label. Hides itself while the drawer is open — the
 * drawer draws its own copy in the same visual style at its top.
 *
 * As on the reference it only lives in the shop (and checkout). Elsewhere
 * the drawer still opens itself whenever something is added, e.g. a ticket.
 */
export default function CartPill() {
  const { count, open, openCart } = useCart();
  const pathname = usePathname() ?? "";
  const inShop = /^\/(shop|checkout)(\/|$)/.test(pathname);

  if (!inShop) return null;

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
      hidden={open}
      className="fixed right-[19px] bottom-[19px] z-40 rounded-[2px] bg-[#333] p-[10px] text-white"
    >
      <span className="eyebrow">
        Cart <span className="opacity-50">({count} item{count === 1 ? "" : "s"})</span>
      </span>
    </button>
  );
}
