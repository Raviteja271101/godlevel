export type Product = {
  name: string;
  detail: string;
  price: number;
  image: string;
  soldOut?: boolean;
};

export const products: Product[] = [
  { name: "Halogen Tee", detail: "Heavyweight cotton — Black", price: 45, image: "/media/shop-06.jpg" },
  { name: "Field Hoodie", detail: "Brushed loopback — Black", price: 120, image: "/media/shop-02.jpg" },
  { name: "Six-Panel Cap", detail: "Washed twill — Black", price: 40, image: "/media/shop-03.jpg" },
  { name: "Archive Tote", detail: "16oz canvas — Natural", price: 25, image: "/media/shop-04.jpg" },
  { name: "Core Tee", detail: "Heavyweight cotton — Bone", price: 45, image: "/media/shop-05.jpg" },
  { name: "SL:003 Tour Tee", detail: "Printed in Naxos — Black", price: 55, image: "/media/shop-01.jpg", soldOut: true },
];
