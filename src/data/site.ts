export const site = {
  name: "Slow Light",
  wordmark: "SLOW LIGHT",
  tagline: "Slow down the light.",
  description:
    "An independent record label and events studio staging pioneering electronic music in places that were never built to hold a party.",
  founded: 2017,
  base: "Lisbon — Tbilisi — Reykjavík",
  email: "hello@slowlight.example",
  press: "press@slowlight.example",
} as const;

export const nav = [
  { label: "Events", href: "/events" },
  { label: "Label", href: "/label" },
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
    { label: "Label", href: "/label" },
    { label: "Gallery", href: "/gallery" },
  ],
  [
    { label: "About", href: "/about" },
    { label: "Tickets", href: "/events" },
  ],
];

export const socials = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "SoundCloud", href: "https://soundcloud.com" },
  { label: "Bandcamp", href: "https://bandcamp.com" },
  { label: "YouTube", href: "https://youtube.com" },
] as const;

export const footerColumns = [
  {
    title: "Experience",
    links: [
      { label: "Upcoming events", href: "/events" },
      { label: "Past seasons", href: "/gallery" },
      { label: "Residencies", href: "/label" },
      { label: "Slow Light Radio", href: "/about#radio" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "The label", href: "/label" },
      { label: "Artist roster", href: "/label#roster" },
      { label: "Press kit", href: "/about#press" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Tickets & entry", href: "/events" },
      { label: "Accessibility", href: "/about#access" },
      { label: "Safer spaces", href: "/about#safer" },
      { label: "Shipping & returns", href: "/shop" },
    ],
  },
] as const;
