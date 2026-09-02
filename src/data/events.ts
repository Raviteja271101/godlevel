export type Event = {
  code: string;
  city: string;
  country: string;
  venue: string;
  /** ISO date — formatted at render time so the data stays locale-agnostic. */
  date: string;
  /** IANA zone, used by the "Around the World" clock. */
  tz: string;
  coords: { lat: string; lon: string };
  status: "On sale" | "Final release" | "Sold out" | "Announced";
  lineup: string[];
  image: string;
  blurb: string;
};

export const events: Event[] = [
  {
    code: "SL:001",
    city: "Tbilisi",
    country: "Georgia",
    venue: "The Sulphur Baths",
    date: "2026-10-03",
    tz: "Asia/Tbilisi",
    coords: { lat: "41.6938° N", lon: "44.8015° E" },
    status: "Sold out",
    lineup: ["Azimuth", "Nyla Okonkwo", "Marius Belan"],
    image: "/media/event-01.jpg",
    blurb:
      "Twelve hours below street level in a domed brick bathhouse, steam still running. Capacity 340.",
  },
  {
    code: "SL:002",
    city: "Reykjavík",
    country: "Iceland",
    venue: "Geothermal Hall",
    date: "2026-10-24",
    tz: "Atlantic/Reykjavik",
    coords: { lat: "64.1466° N", lon: "21.9426° W" },
    status: "Final release",
    lineup: ["Velour Crash", "Azimuth", "Hlín Sør"],
    image: "/media/event-04.jpg",
    blurb:
      "A decommissioned turbine hall on the edge of the lava field. Sunrise set starts at 09:40.",
  },
  {
    code: "SL:003",
    city: "Agafay",
    country: "Morocco",
    venue: "The Desert Floor",
    date: "2026-11-07",
    tz: "Africa/Casablanca",
    coords: { lat: "31.4013° N", lon: "8.2201° W" },
    status: "On sale",
    lineup: ["Nyla Okonkwo", "Sana Toma", "Marius Belan"],
    image: "/media/event-02.jpg",
    blurb:
      "Forty kilometres of stone desert, one rig, no roof. Shuttles run from Marrakech from 16:00.",
  },
  {
    code: "SL:004",
    city: "Naxos",
    country: "Greece",
    venue: "Marble Quarry",
    date: "2026-11-21",
    tz: "Europe/Athens",
    coords: { lat: "37.1036° N", lon: "25.3766° E" },
    status: "On sale",
    lineup: ["Azimuth", "Velour Crash"],
    image: "/media/event-03.jpg",
    blurb:
      "A working quarry cut into white rock, unused since 1974. Natural reverb, nine seconds long.",
  },
  {
    code: "SL:005",
    city: "Tallinn",
    country: "Estonia",
    venue: "Linnahall Ruins",
    date: "2026-12-12",
    tz: "Europe/Tallinn",
    coords: { lat: "59.4432° N", lon: "24.7453° E" },
    status: "Announced",
    lineup: ["Marius Belan", "Hlín Sør", "Sana Toma"],
    image: "/media/event-06.jpg",
    blurb:
      "Concrete amphitheatre on the Baltic, built for 1980 and abandoned since. Dress for weather.",
  },
  {
    code: "SL:006",
    city: "Valparaíso",
    country: "Chile",
    venue: "Cerro Alegre Rooftops",
    date: "2027-01-16",
    tz: "America/Santiago",
    coords: { lat: "33.0472° S", lon: "71.6127° W" },
    status: "Announced",
    lineup: ["Nyla Okonkwo", "Azimuth", "Velour Crash"],
    image: "/media/event-05.jpg",
    blurb:
      "Six connected rooftops above the port, one sound system per building. Season closer.",
  },
];
