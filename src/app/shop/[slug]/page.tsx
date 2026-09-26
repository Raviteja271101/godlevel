import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CropMarks from "@/components/CropMarks";
import AddToCartButton from "@/components/AddToCartButton";
import { products } from "@/data/products";
import { slugify } from "@/lib/slug";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return products.map((p) => ({ slug: slugify(p.name) }));
}

const findProduct = (slug: string) => products.find((p) => slugify(p.name) === slug);

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) return { title: "Shop" };
  return {
    title: product.name,
    description: product.detail,
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) notFound();

  const related = products.filter((p) => slugify(p.name) !== slug).slice(0, 3);

  return (
    <>
      <section className="gutter pt-24 pb-16 md:pt-28 md:pb-24">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7 lg:col-start-1">
            <div className="relative aspect-square overflow-hidden bg-[#efefef]">
              <CropMarks />
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 92vw, 55vw"
                className="object-cover"
              />
              {product.soldOut && (
                <span className="absolute inset-0 grid place-items-center bg-black/25 text-white">
                  Sold out
                </span>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <p className="eyebrow opacity-60">Merchandise</p>
            <h1 className="display t-statement mt-4">{product.name}</h1>
            <p className="mt-3 opacity-60">{product.detail}</p>
            <p className="mt-6 text-lg">&euro;{product.price}</p>

            <AddToCartButton product={product} />

            <p className="hairline mt-10 pt-4 opacity-60">
              Free shipping over &euro;100 &nbsp;/&nbsp; 30-day returns &nbsp;/&nbsp; All prices include VAT
            </p>

            <Link href="/shop" className="mt-10 inline-block arrow-link opacity-60 transition-opacity hover:opacity-100">
              Back to shop
            </Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="gutter border-t border-hair pt-16 pb-24">
          <p className="eyebrow">More from the shop</p>
          <ul className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r, i) => (
              <li key={r.name}>
                <Link
                  href={`/shop/${slugify(r.name)}`}
                  className="group block"
                  data-cursor-text="View product"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#efefef]">
                    <CropMarks />
                    <Image
                      src={r.image}
                      alt={r.name}
                      fill
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
                      className="media-zoom object-cover group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-3 flex gap-3">
                    <span className="text-ink-30">[{String(i + 1).padStart(2, "0")}]</span>
                    <span className="flex-1">
                      <span className="flex justify-between gap-4">
                        <span className="transition-opacity group-hover:opacity-60">{r.name}</span>
                        <span>&euro;{r.price}</span>
                      </span>
                      <span className="block opacity-60">{r.detail}</span>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
