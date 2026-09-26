import Image from "next/image";
import Link from "next/link";
import ScrambleText from "./ScrambleText";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/price";
import { slugify } from "@/lib/slug";

/**
 * Shop tile, as on the reference: a 2:3 photo with 2px corners; under it a
 * hairline + at the left edge and the name and price stacked beside it. On
 * hover the + folds into a − and the description opens beneath (0.4s). The
 * whole tile links through to the product page, where the size is chosen.
 */
export default function ProductCard({
  product,
  sizes,
}: {
  product: Product;
  /** Kept for callers that still pass a position; the reference shows none. */
  index?: number;
  sizes: string;
}) {
  return (
    <Link
      href={`/shop/${slugify(product.name)}`}
      className="group block"
      data-cursor-text={product.soldOut ? "Sold out" : "Shop now"}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-[2px] bg-[#efefef]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={sizes}
          className={`object-cover ${product.soldOut ? "opacity-45" : ""}`}
        />
        {product.soldOut && (
          <span className="absolute inset-0 grid place-items-center">Sold out</span>
        )}
      </div>

      <div className="relative mt-4 md:pl-[39px]">
        <span aria-hidden="true" className="product-plus absolute top-[0.3em] left-0 hidden md:block">
          <span />
          <span />
        </span>
        <p className="font-medium">
          <ScrambleText text={product.name} trigger="view" />
        </p>
        <p className="mt-1">{formatPrice(product.price)}</p>
        <div className="product-desc">
          <div className="overflow-hidden">
            <p className="pt-5 opacity-50">{product.detail}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
