export const site = {
  name: "Godlevel",
  wordmark: "GODLEVEL",
  tagline: "Come as you are.",
  description:
    "We create spaces where people can come together, discover something new, and experience things differently.",
  /* Shown over the hero video; the description above is for search results. */
  intro: "Godlevel is a platform for exploring culture, community, and new experiences.",
  founded: 2017,
  base: "Lisbon — Tbilisi — Reykjavík",
  email: "hello@godlevel.example",
  press: "press@godlevel.example",
} as const;

export const nav = [
  { label: "Events", href: "/events" },
  { label: "Godlevel Collective", href: "/label" },
  { label: "Gallery", href: "/gallery" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
] as const;

/** Nav is laid out as paired columns; Events carries a live count. */
export const navGroups: { label: string; href: string; count?: number }[][] = [
  [
    { label: "Events", href: "/events", count: 6 },
    { label: "Shop", href: "/shop" },
  ],
  [
    { label: "Godlevel Collective", href: "/label" },
    { label: "Gallery", href: "/gallery" },
  ],
  [
    { label: "About", href: "/about" },
    { label: "Tickets", href: "/events" },
  ],
];

export const socials = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "YouTube", href: "https://youtube.com" },
] as const;

export const footerColumns = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Experiences", href: "/events" },
      { label: "Collective", href: "/label" },
      { label: "Partners", href: "/about#press" },
      { label: "Contact", href: "/about#contact" },
    ],
  },
] as const;

/** Centred call to action above the footer columns. */
export const footerCta = {
  headline: "Come find your level.",
  line: "Godlevel is moving. Come be part of it.",
  action: { label: "Join Godlevel", href: "/about" },
} as const;

/** One row per line, broken as drawn in the footer layout. */
export const footerBlurb = [
  "A platform for exploring",
  "culture, community, and",
  "new experiences",
] as const;

export const contact = {
  email: "hello@godlevel.in",
  phone: "+91 XXXXX XXXXX",
} as const;

/** One line per row, as printed in the footer. */
export const address = ["Godlevel", "[Full Address]", "Mumbai, Maharashtra, India"] as const;
