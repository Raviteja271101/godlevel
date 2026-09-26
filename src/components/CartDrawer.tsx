"use client";

import Image from "next/image";
import Link from "next/link";
import CropMarks from "./CropMarks";
import ScrambleText from "./ScrambleText";
import { useCart } from "./CartProvider";
import { formatPrice as currency } from "@/lib/price";

/**
 * The cart, as on the reference: a floating panel held ~20px off the top,
 * right and bottom edges, crop marks on its corners, over a light (20%)
 * backdrop. It appears and disappears instantly — no slide.
 *  - Header: the #333 ▪ CART (N ITEMS) tag and a square × close.
 *  - Lines: 2:3 thumbnail, name, size, price, a boxed − n + stepper and a
 *    round remove button.
 *  - Footer: SUBTOTAL, the VAT note and a red full-width CHECKOUT.
 */
export default function CartDrawer() {
  const { items, open, count, subtotal, remove, setQty, closeCart } = useCart();

  return (
    <>
      <div
        aria-hidden
        onClick={closeCart}
        className={`fixed inset-0 z-40 bg-black/20 ${open ? "" : "hidden"}`}
      />

      <aside
        role="dialog"
        aria-label="Cart"
        aria-modal="true"
        className={`fixed top-5 right-[19px] bottom-5 z-50 w-[calc(100vw-38px)] md:w-[347px] flex-col bg-paper p-5 text-ink ${
          open ? "flex" : "hidden"
        }`}
      >
        <CropMarks />

        <div className="flex items-center justify-between">
          <span className="rounded-[2px] bg-[#333] p-[10px] text-white">
            <span className="eyebrow">
              Cart <span className="opacity-50">({count} items)</span>
            </span>
          </span>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="grid h-7 w-7 place-items-center rounded-[2px] bg-[#333] leading-none text-white"
          >
            &times;
          </button>
        </div>

        <ul className="hairline mt-5 flex-1 overflow-y-auto pt-5">
          {items.length === 0 ? (
            <li className="opacity-50">Your cart is empty.</li>
          ) : (
            items.map((it) => (
              <li key={it.id} className="flex gap-4 pb-5">
                <div className="relative aspect-[2/3] w-[74px] shrink-0 overflow-hidden bg-[#efefef]">
                  <Image src={it.image} alt={it.name} fill sizes="74px" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="font-medium">{it.name}</p>
                      {it.size && <p className="mt-2 opacity-50">Size: {it.size}</p>}
                      <p className="mt-2">{currency(it.qty * it.price)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(it.id)}
                      aria-label={`Remove ${it.name}`}
                      className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ink/15 text-[10px] leading-none text-white"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="mt-4 flex w-fit items-center border border-hair">
                    <button
                      type="button"
                      onClick={() => setQty(it.id, it.qty - 1)}
                      aria-label="Decrease quantity"
                      className="px-3 py-2 leading-none"
                    >
                      -
                    </button>
                    <span className="min-w-[1.5ch] text-center tabular-nums">{it.qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(it.id, it.qty + 1)}
                      aria-label="Increase quantity"
                      className="px-3 py-2 leading-none"
                    >
                      +
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>

        <div className="hairline pt-6">
          <div className="flex justify-between font-medium">
            <span>Subtotal</span>
            <span>{currency(subtotal)}</span>
          </div>
          <p className="mt-4 opacity-50">Shipping and VAT calculated at checkout</p>
          {items.length === 0 ? (
            <span className="mt-6 block rounded-[2px] bg-bubble px-4 py-[14px] text-center text-white opacity-40">
              Checkout
            </span>
          ) : (
            <Link
              href="/checkout"
              className="mt-6 block rounded-[2px] bg-bubble px-4 py-[14px] text-center text-white"
            >
              <ScrambleText text="Checkout" />
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
