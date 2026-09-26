export type Product = {
  name: string;
  detail: string;
  price: number;
  image: string;
  soldOut?: boolean;
  /** Offered sizes; omitted for one-size items. */
  sizes?: string[];
  /** Detail-page info blocks. Placeholder copy until the real specs arrive. */
  materials?: string;
  care?: string;
  fit?: string;
};

const APPAREL = ["XS", "S", "M", "L", "XL"];
const TEE_CARE = "Machine wash cold inside out. Lay flat to dry. Do not iron directly on printed graphics.";

export const products: Product[] = [
  {
    name: "Halogen Tee",
    detail: "Heavyweight cotton — Black",
    price: 45,
    image: "/media/shop-06.jpg",
    sizes: APPAREL,
    materials: "Heavyweight cotton jersey.",
    care: TEE_CARE,
    fit: "Boxy, relaxed fit. True to size.",
  },
  {
    name: "Field Hoodie",
    detail: "Brushed loopback — Black",
    price: 120,
    image: "/media/shop-02.jpg",
    sizes: APPAREL,
    materials: "Brushed cotton loopback.",
    care: "Machine wash cold inside out. Tumble dry low.",
    fit: "Oversized fit. Size down for a closer cut.",
  },
  {
    name: "Six-Panel Cap",
    detail: "Washed twill — Black",
    price: 40,
    image: "/media/shop-03.jpg",
    materials: "Washed cotton twill.",
    care: "Spot clean only.",
    fit: "One size, adjustable strap.",
  },
  {
    name: "Archive Tote",
    detail: "16oz canvas — Natural",
    price: 25,
    image: "/media/shop-04.jpg",
    materials: "16oz cotton canvas.",
    care: "Spot clean only.",
    fit: "One size.",
  },
  {
    name: "Core Tee",
    detail: "Heavyweight cotton — Bone",
    price: 45,
    image: "/media/shop-05.jpg",
    sizes: APPAREL,
    materials: "Heavyweight cotton jersey.",
    care: TEE_CARE,
    fit: "Boxy, relaxed fit. True to size.",
  },
  {
    name: "SL:003 Tour Tee",
    detail: "Printed in Naxos — Black",
    price: 55,
    image: "/media/shop-01.jpg",
    soldOut: true,
    sizes: APPAREL,
    materials: "Heavyweight cotton jersey.",
    care: TEE_CARE,
    fit: "Boxy, relaxed fit. True to size.",
  },
];
