/** Shared with the cart and the product detail route so the same string
    identifies a product on the URL and as a cart line item. */
export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
