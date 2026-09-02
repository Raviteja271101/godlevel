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

// Roster and artist records live in artists.ts (shared with event line-ups).
export { roster, artists, resolveLineup } from "./artists";
export type { Artist } from "./artists";
