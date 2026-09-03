export type Event = {
  slug: string;
  code: string;
  city: string;
  country: string;
  venue: string;
  /** ISO date — formatted at render time so the data stays locale-agnostic. */
  date: string;
  /** Doors to close, as shown on the detail page. */
  time: string;
  /** IANA zone, used by the "Around the World" clock. */
  tz: string;
  /** Signed decimal degrees; display strings are derived from these. */
  coords: { lat: number; lon: number };
  status: "On sale" | "Final release" | "Sold out" | "Announced";
  lineup: string[];
  image: string;
  /** Poster artwork shown beside the description. */
  artwork: string;
  artworkBy: string;
  blurb: string;
  /** Body copy on the detail page, one string per paragraph. */
  paragraphs: string[];
};

export const events: Event[] = [
  {
    slug: "slow-light-tbilisi",
    code: "SL:001",
    city: "Tbilisi",
    country: "Georgia",
    venue: "The Sulphur Baths",
    date: "2026-10-03",
    time: "22:00 - 10:00",
    tz: "Asia/Tbilisi",
    coords: { lat: 41.6938, lon: 44.8015 },
    status: "Sold out",
    lineup: ["Azimuth", "Nyla Okonkwo", "Marius Belan"],
    image: "/media/event-01.jpg",
    artwork: "/media/gal-01.jpg",
    artworkBy: "Studio Kviri",
    blurb:
      "Twelve hours below street level in a domed brick bathhouse, steam still running. Capacity 340.",
    paragraphs: [
      "Twelve hours below street level, in a domed brick bathhouse that has been running hot since the seventeenth century.",
      "The steam stays on. Bring less than you think you need.",
      "Capacity is 340 and this one is gone.",
    ],
  },
  {
    slug: "slow-light-reykjavik",
    code: "SL:002",
    city: "Reykjavík",
    country: "Iceland",
    venue: "Geothermal Hall",
    date: "2026-10-24",
    time: "20:00 - 11:00",
    tz: "Atlantic/Reykjavik",
    coords: { lat: 64.1466, lon: -21.9426 },
    status: "Final release",
    lineup: ["Velour Crash", "Azimuth", "Hlin Sor"],
    image: "/media/event-04.jpg",
    artwork: "/media/gal-04.jpg",
    artworkBy: "Halla Prent",
    blurb:
      "A decommissioned turbine hall on the edge of the lava field. Sunrise set starts at 09:40.",
    paragraphs: [
      "A decommissioned turbine hall on the edge of the lava field, unheated and enormous.",
      "The sunrise set starts at 09:40 and runs until the room gets too bright to continue.",
      "Final release of tickets now on sale.",
    ],
  },
  {
    slug: "slow-light-agafay",
    code: "SL:003",
    city: "Agafay",
    country: "Morocco",
    venue: "The Desert Floor",
    date: "2026-11-07",
    time: "18:00 - 06:00",
    tz: "Africa/Casablanca",
    coords: { lat: 31.4013, lon: -8.2201 },
    status: "On sale",
    lineup: ["Nyla Okonkwo", "Sana Toma", "Marius Belan"],
    image: "/media/event-02.jpg",
    artwork: "/media/gal-06.jpg",
    artworkBy: "Atlas Press Works",
    blurb:
      "Forty kilometres of stone desert, one rig, no roof. Shuttles run from Marrakech from 16:00.",
    paragraphs: [
      "Forty kilometres of stone desert, one rig, and no roof over any of it.",
      "Shuttles run from Marrakech from 16:00. There is no other way in, and no way out until morning.",
      "Dress for cold. It drops further than people expect.",
    ],
  },
  {
    slug: "slow-light-naxos",
    code: "SL:004",
    city: "Naxos",
    country: "Greece",
    venue: "Marble Quarry",
    date: "2026-11-21",
    time: "21:00 - 07:00",
    tz: "Europe/Athens",
    coords: { lat: 37.1036, lon: 25.3766 },
    status: "On sale",
    lineup: ["Azimuth", "Velour Crash"],
    image: "/media/event-03.jpg",
    artwork: "/media/gal-03.jpg",
    artworkBy: "Marbleworks",
    blurb:
      "A working quarry cut into white rock, unused since 1974. Natural reverb, nine seconds long.",
    paragraphs: [
      "A quarry cut into white rock, unworked since 1974 and left exactly as it was.",
      "The natural reverb runs to nine seconds. Both acts have written for it specifically.",
      "Two performances, no support, one long night.",
    ],
  },
  {
    slug: "slow-light-tallinn",
    code: "SL:005",
    city: "Tallinn",
    country: "Estonia",
    venue: "Linnahall Ruins",
    date: "2026-12-12",
    time: "22:00 - 08:00",
    tz: "Europe/Tallinn",
    coords: { lat: 59.4432, lon: 24.7453 },
    status: "Announced",
    lineup: ["Marius Belan", "Hlin Sor", "Sana Toma"],
    image: "/media/event-06.jpg",
    artwork: "/media/gal-07.jpg",
    artworkBy: "Kordon Studio",
    blurb:
      "Concrete amphitheatre on the Baltic, built for 1980 and abandoned since. Dress for weather.",
    paragraphs: [
      "A concrete amphitheatre on the Baltic, built for 1980 and left to the sea ever since.",
      "Half of it is open to the sky. Dress for whatever December decides to do.",
      "Line-up and exact entrance to be confirmed closer to the date.",
    ],
  },
  {
    slug: "slow-light-valparaiso",
    code: "SL:006",
    city: "Valparaíso",
    country: "Chile",
    venue: "Cerro Alegre Rooftops",
    date: "2027-01-16",
    time: "19:00 - 05:00",
    tz: "America/Santiago",
    coords: { lat: -33.0472, lon: -71.6127 },
    status: "Announced",
    lineup: ["Nyla Okonkwo", "Azimuth", "Velour Crash"],
    image: "/media/event-05.jpg",
    artwork: "/media/gal-05.jpg",
    artworkBy: "Taller Cerro",
    blurb:
      "Six connected rooftops above the port, one sound system per building. Season closer.",
    paragraphs: [
      "Six connected rooftops above the port, each with its own sound system and its own room.",
      "You move between them across the roofs. Nobody has ever heard the same night twice.",
      "The season closer.",
    ],
  },
];

/** 41.6938 -> "41.6938° N" */
export const formatLat = (lat: number) =>
  `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}`;

/** -21.9426 -> "21.9426° W" */
export const formatLon = (lon: number) =>
  `${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? "E" : "W"}`;

const bySlug = new Map(events.map((e) => [e.slug, e]));
export const getEvent = (slug: string) => bySlug.get(slug);
