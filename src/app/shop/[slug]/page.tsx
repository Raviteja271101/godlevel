import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ProductCard";
import ScrambleText from "@/components/ScrambleText";
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

/**
 * The reference's product page on its 12-column grid: info blocks in
 * columns 2–3, the 2:3 photograph in 5–8, and the buy block in 10–11. Both
 * side columns stay pinned at the vertical centre of the screen while the
 * photographs scroll. A phone stacks photo, buy block, then info.
 */
export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) notFound();

  const related = products.filter((p) => slugify(p.name) !== slug).slice(0, 5);
  const info = [
    { label: "Materials", body: product.materials },
    { label: "Care", body: product.care },
    { label: "Size & fitting", body: product.fit },
    { label: "Delivery & returns", body: "Ships worldwide within five working days. 30-day returns." },
  ].filter((b): b is { label: string; body: string } => Boolean(b.body));

  return (
    <>
      <section className="gutter pt-[120px] pb-16 lg:pt-0 lg:pb-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-[1.39vw]">
          <div className="order-3 lg:order-none lg:col-span-2 lg:col-start-2 lg:row-start-1">
            <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center">
              <div className="space-y-[18px]">
                {info.map((b) => (
                  <div key={b.label}>
                    <p className="eyebrow opacity-50">{b.label}</p>
                    <p className="measure mt-[10px] max-w-none">{b.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-none lg:col-span-4 lg:col-start-5 lg:row-start-1 lg:pt-[220px]">
            <div className="relative aspect-[2/3] overflow-hidden bg-[#efefef]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 92vw, 30vw"
                className={`object-cover ${product.soldOut ? "opacity-45" : ""}`}
              />
            </div>
          </div>

          <div className="order-2 lg:order-none lg:col-span-2 lg:col-start-10 lg:row-start-1">
            <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="gutter pb-24">
          <div className="flex items-baseline justify-between gap-6">
            <p className="eyebrow">
              <ScrambleText text="You might also like" trigger="view" />
            </p>
            <Link href="/shop" className="arrow-link">
              <ScrambleText text="Explore all" />
            </Link>
          </div>
          <div className="mt-[27px] grid grid-cols-2 gap-x-[10px] gap-y-5 md:grid-cols-3 lg:grid-cols-5 lg:gap-x-[1.39vw]">
            {related.map((r) => (
              <ProductCard
                key={r.name}
                product={r}
                sizes="(max-width: 767px) 46vw, (max-width: 1023px) 31vw, 18vw"
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
