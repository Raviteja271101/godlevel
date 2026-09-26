import Image from "next/image";
import Link from "next/link";
import CropMarks from "./CropMarks";
import type { Product } from "@/data/products";
import { slugify } from "@/lib/slug";

/**
 * Grid tile: the whole card links through to the product detail page, which
 * carries the Add to cart button. Sold-out tiles stay linkable so the detail
 * can still be read but never trigger add-to-cart.
 */
export default function ProductCard({
  product,
  index,
  sizes,
}: {
  product: Product;
  index: number;
  sizes: string;
}) {
  const slug = slugify(product.name);
  return (
    <Link
      href={`/shop/${slug}`}
      className="group block"
      data-cursor-text={product.soldOut ? "Sold out" : "View product"}
    >
      <div className="relative aspect-square overflow-hidden bg-[#efefef]">
        <CropMarks />
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={sizes}
          className={`media-zoom object-cover group-hover:scale-[1.03] ${product.soldOut ? "opacity-45" : ""}`}
        />
        {product.soldOut && (
          <span className="absolute inset-0 grid place-items-center">Sold out</span>
        )}
      </div>

      <div className="mt-3 flex gap-3">
        <span className="text-ink-30">[{String(index + 1).padStart(2, "0")}]</span>
        <span className="flex-1">
          <span className="flex justify-between gap-4">
            <span className="transition-opacity group-hover:opacity-60">{product.name}</span>
            <span>&euro;{product.price}</span>
          </span>
          <span className="block opacity-60">{product.detail}</span>
        </span>
      </div>
    </Link>
  );
}
