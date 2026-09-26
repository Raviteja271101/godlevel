"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";

const currency = (n: number) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(n);

/**
 * Right-slide cart drawer, matching the noartmusic reference:
 *  - Overlay dims the page and closes on click.
 *  - Header carries the same ▪ CART (N ITEMS) tag as the pill trigger,
 *    plus a plain × close.
 *  - Middle scrolls the line items (empty state shows a short line).
 *  - Sticky footer: SUBTOTAL row, small VAT note, red CHECKOUT.
 *
 * The panel translates rather than mounting/unmounting, so the animation
 * runs both ways and the item list keeps its scroll position between opens.
 */
export default function CartDrawer() {
  const { items, open, count, subtotal, remove, setQty, closeCart } = useCart();

  return (
    <>
      <div
        aria-hidden
        onClick={closeCart}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-label="Cart"
        aria-modal="true"
        aria-hidden={!open}
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-[360px] flex-col bg-paper text-ink shadow-[-10px_0_30px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between p-4">
          <span className="bg-night px-3 py-2 text-white">
            <span className="eyebrow">
              CART ({count} ITEM{count === 1 ? "" : "S"})
            </span>
          </span>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="bg-night px-3 py-2 leading-none text-white transition-opacity hover:opacity-70"
          >
            ×
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto border-y border-hair">
          {items.length === 0 ? (
            <li className="p-6 opacity-60">Your cart is empty.</li>
          ) : (
            items.map((it) => (
              <li key={it.id} className="flex gap-3 border-b border-hair p-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-[#efefef]">
                  <Image
                    src={it.image}
                    alt={it.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">{it.name}</span>
                    <button
                      type="button"
                      onClick={() => remove(it.id)}
                      aria-label={`Remove ${it.name}`}
                      className="leading-none transition-opacity hover:opacity-60"
                    >
                      ×
                    </button>
                  </div>
                  <span className="opacity-60">{it.detail}</span>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center border border-hair">
                      <button
                        type="button"
                        onClick={() => setQty(it.id, it.qty - 1)}
                        aria-label="Decrease quantity"
                        className="px-2 py-1 leading-none transition-opacity hover:opacity-60"
                      >
                        −
                      </button>
                      <span className="min-w-[1.5ch] text-center">{it.qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(it.id, it.qty + 1)}
                        aria-label="Increase quantity"
                        className="px-2 py-1 leading-none transition-opacity hover:opacity-60"
                      >
                        +
                      </button>
                    </div>
                    <span>{currency(it.qty * it.price)}</span>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>

        <div className="p-4">
          <div className="flex justify-between">
            <span>SUBTOTAL</span>
            <span>{currency(subtotal)}</span>
          </div>
          <p className="mt-2 opacity-60">SHIPPING AND VAT CALCULATED AT CHECKOUT</p>
          {items.length === 0 ? (
            <button
              type="button"
              disabled
              className="mt-4 block w-full bg-[#e53935] px-4 py-3 text-center text-white opacity-40"
            >
              CHECKOUT
            </button>
          ) : (
            <Link
              href="/checkout"
              onClick={closeCart}
              className="mt-4 block w-full bg-[#e53935] px-4 py-3 text-center text-white transition-opacity hover:opacity-90"
            >
              CHECKOUT
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
