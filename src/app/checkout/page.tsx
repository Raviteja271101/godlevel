import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order.",
};

/* Placeholder step. The cart drawer lands here from its CHECKOUT button,
   so the flow feels complete — payments will be wired to this route when
   the backend is picked (Stripe Checkout, Shopify Buy SDK, etc.). */
export default function CheckoutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Checkout"
        title="Almost there."
        intro="Payments will be wired in shortly. Your cart is saved on this device — reopen it from the pill at the bottom of any page."
      />
      <section className="gutter pb-24">
        <p className="opacity-60">Coming soon.</p>
      </section>
    </>
  );
}
