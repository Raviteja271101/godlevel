"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { usePathname } from "next/navigation";
import type { Product } from "@/data/products";
import { slugify } from "@/lib/slug";

export type CartItem = {
  id: string;
  name: string;
  detail: string;
  price: number;
  image: string;
  qty: number;
  /** Chosen size, when the product comes in sizes. Part of the line's id. */
  size?: string;
};

type CartState = {
  items: CartItem[];
  open: boolean;
  count: number;
  subtotal: number;
  add: (product: Product, size?: string) => void;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

const CartCtx = createContext<CartState | null>(null);
const STORAGE_KEY = "gl:cart";

/* Module-scoped store. Kept outside React because the state has to survive
   provider re-mounts (route transitions) and because useSyncExternalStore
   wants a subscribe/getSnapshot pair, not React state. Persistence rides
   along on every mutation. */
type Listener = () => void;
const listeners = new Set<Listener>();
let cartItems: CartItem[] = [];
let hydrated = false;

const readStorage = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
};

const writeStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
};

const setCartItems = (next: CartItem[]) => {
  cartItems = next;
  if (hydrated) writeStorage(next);
  listeners.forEach((l) => l());
};

const hydrateOnce = () => {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  const stored = readStorage();
  if (stored.length) {
    cartItems = stored;
    listeners.forEach((l) => l());
  }
};

const subscribe = (l: Listener) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

const getSnapshot = () => cartItems;
const getServerSnapshot = () => cartItems;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  /* Remembers the route the drawer was opened on, so navigating anywhere else
     closes it — the page transition swallows link clicks before any of their
     own handlers run, so the drawer cannot rely on those to close itself. */
  const pathname = usePathname();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn !== null && openOn === pathname;
  const setOpen = (next: boolean | ((was: boolean) => boolean)) =>
    setOpenOn((prev) => {
      const was = prev !== null && prev === pathname;
      return (typeof next === "function" ? next(was) : next) ? pathname : null;
    });

  /* Read storage once on the client. Runs as a side-effect (not during
     render) and does not call setState — it mutates the module store, which
     notifies the useSyncExternalStore subscription on its own. */
  useEffect(() => {
    hydrateOnce();
  }, []);

  /* Lock the page while the drawer is up. The same trick the mobile menu
     uses: overflow:hidden on body plus a flag on <html> that SmoothScroll
     watches, so Lenis stops moving the page too. */
  useEffect(() => {
    const root = document.documentElement;
    document.body.style.overflow = open ? "hidden" : "";
    root.toggleAttribute("data-cart-open", open);
    return () => {
      document.body.style.overflow = "";
      root.removeAttribute("data-cart-open");
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenOn(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const value = useMemo<CartState>(() => {
    const count = items.reduce((n, it) => n + it.qty, 0);
    const subtotal = items.reduce((s, it) => s + it.qty * it.price, 0);
    /* The generic path — anything with an id, price and image can be a
       cart line, so event tickets and merchandise share the same drawer. */
    const addItem: CartState["addItem"] = (item, qty = 1) => {
      const i = cartItems.findIndex((it) => it.id === item.id);
      if (i >= 0) {
        const next = cartItems.slice();
        next[i] = { ...next[i], qty: next[i].qty + qty };
        setCartItems(next);
      } else {
        setCartItems([...cartItems, { ...item, qty }]);
      }
      setOpen(true);
    };
    return {
      items,
      open,
      count,
      subtotal,
      add: (product, size) =>
        addItem({
          id: size ? `${slugify(product.name)}-${slugify(size)}` : slugify(product.name),
          name: product.name,
          detail: product.detail,
          price: product.price,
          image: product.image,
          size,
        }),
      addItem,
      remove: (id) => setCartItems(cartItems.filter((it) => it.id !== id)),
      setQty: (id, qty) =>
        setCartItems(
          qty <= 0
            ? cartItems.filter((it) => it.id !== id)
            : cartItems.map((it) => (it.id === id ? { ...it, qty } : it)),
        ),
      clear: () => setCartItems([]),
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      toggleCart: () => setOpen((v) => !v),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- setOpen only reads pathname
  }, [items, open, pathname]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
