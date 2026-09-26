import type { Metadata } from "next";
import ShopGrid from "@/components/ShopGrid";
import { products } from "@/data/products";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Shop",
  description: "Godlevel merchandise, printed in small runs alongside each season.",
};

/* As on the reference, the shop opens straight onto the grid under a small
   label — no page header. */
export default function ShopPage() {
  return (
    <section className="gutter pt-[120px] pb-24 md:pt-[164px]">
      <ShopGrid label={`${site.name} shop`} products={products} />

      <p className="hairline mt-16 pt-6 opacity-60">
        Free shipping over &euro;100 &nbsp;/&nbsp; 30-day returns &nbsp;/&nbsp; All prices include VAT
      </p>
    </section>
  );
}
