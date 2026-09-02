export type Release = {
  catalogue: string;
  title: string;
  artist: string;
  format: "LP" | "EP" | '12"' | "Compilation";
  year: number;
  image: string;
  notes: string;
};

export const releases: Release[] = [
  {
    catalogue: "SL-001",
    title: "Halogen Fields",
    artist: "Azimuth",
    format: "LP",
    year: 2026,
    image: "/media/gal-01.jpg",
    notes: "Recorded across three nights in the Tbilisi baths. Nine tracks, no overdubs.",
  },
  {
    catalogue: "SL-002",
    title: "Saltwater Doctrine",
    artist: "Nyla Okonkwo",
    format: "EP",
    year: 2026,
    image: "/media/gal-04.jpg",
    notes: "Four pieces for modular synthesiser and field recordings from the Atlantic shelf.",
  },
  {
    catalogue: "SL-003",
    title: "Concrete Bloom",
    artist: "Velour Crash",
    format: '12"',
    year: 2025,
    image: "/media/gal-03.jpg",
    notes: "Two long-form club tools, cut loud at 45rpm. Repress available.",
  },
  {
    catalogue: "SL-004",
    title: "Night Ferry",
    artist: "Marius Belan",
    format: "LP",
    year: 2025,
    image: "/media/gal-05.jpg",
    notes: "Written entirely on overnight crossings between Tallinn and Helsinki.",
  },
];

export type Artist = {
  name: string;
  role: string;
  based: string;
  image: string;
  bio: string;
};

export const roster: Artist[] = [
  {
    name: "Azimuth",
    role: "Producer / Live",
    based: "Lisbon, PT",
    image: "/media/artist-01.jpg",
    bio: "Builds sets out of long, slow-moving drones that resolve into rhythm somewhere past the fortieth minute.",
  },
  {
    name: "Nyla Okonkwo",
    role: "Composer / DJ",
    based: "Lagos, NG",
    image: "/media/artist-04.jpg",
    bio: "Modular systems and field recordings, arranged with the patience of someone who does not care what time it is.",
  },
  {
    name: "Velour Crash",
    role: "Live A/V",
    based: "Berlin, DE",
    image: "/media/artist-02.jpg",
    bio: "A duo working in strobe and sub-bass. Loud, precise, and over before you expect it.",
  },
  {
    name: "Marius Belan",
    role: "DJ",
    based: "Tallinn, EE",
    image: "/media/artist-03.jpg",
    bio: "Twenty years of records, most of them bought secondhand, all of them played too quietly at first.",
  },
];
