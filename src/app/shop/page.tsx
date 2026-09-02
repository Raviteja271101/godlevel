import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop",
  description: "Slow Light merchandise, printed in small runs alongside each season.",
};

export default function ShopPage() {
  return (
    <>
      <PageHeader
        eyebrow="Season 09 merchandise"
        title="Shop"
        intro="Printed in small runs alongside each season. Once a run is gone we do not reprint it. Ships worldwide within five working days."
      />

      <section className="px-6 pb-24 md:px-8">
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <Reveal key={product.name} delay={(i % 3) * 80}>
              <ProductCard product={product} index={i} sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw" />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="hairline mt-16 pt-6 opacity-60">
            Free shipping over &euro;100 &nbsp;/&nbsp; 30-day returns &nbsp;/&nbsp; All prices include VAT
          </p>
        </Reveal>
      </section>
    </>
  );
}
