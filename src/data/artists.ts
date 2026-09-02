export type Artist = {
  name: string;
  role: string;
  based: string;
  image: string;
  bio: string;
  links: { label: string; href: string }[];
  /** Signed to the label, as opposed to a guest booking. */
  signed?: boolean;
};

const social = (name: string) => [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Spotify", href: "https://spotify.com" },
  { label: "SoundCloud", href: `https://soundcloud.com/search?q=${encodeURIComponent(name)}` },
];

export const artists: Artist[] = [
  {
    name: "Azimuth",
    role: "Producer / Live",
    based: "Lisbon, PT",
    image: "/media/artist-01.jpg",
    bio: "Builds sets out of long, slow-moving drones that resolve into rhythm somewhere past the fortieth minute.",
    links: social("Azimuth"),
    signed: true,
  },
  {
    name: "Nyla Okonkwo",
    role: "Composer / DJ",
    based: "Lagos, NG",
    image: "/media/artist-04.jpg",
    bio: "Modular systems and field recordings, arranged with the patience of someone who does not care what time it is.",
    links: social("Nyla Okonkwo"),
    signed: true,
  },
  {
    name: "Velour Crash",
    role: "Live A/V",
    based: "Berlin, DE",
    image: "/media/artist-02.jpg",
    bio: "A duo working in strobe and sub-bass. Loud, precise, and over before you expect it.",
    links: social("Velour Crash"),
    signed: true,
  },
  {
    name: "Marius Belan",
    role: "DJ",
    based: "Tallinn, EE",
    image: "/media/artist-03.jpg",
    bio: "Twenty years of records, most of them bought secondhand, all of them played too quietly at first.",
    links: social("Marius Belan"),
    signed: true,
  },
  {
    name: "Hlin Sor",
    role: "Live",
    based: "Reykjavik, IS",
    image: "/media/artist-05.jpg",
    bio: "Hardware-only sets built on a single battered synth and whatever the room does to it.",
    links: social("Hlin Sor"),
  },
  {
    name: "Sana Toma",
    role: "DJ",
    based: "Marrakech, MA",
    image: "/media/artist-06.jpg",
    bio: "Long, unhurried sets that treat the first two hours as an introduction.",
    links: social("Sana Toma"),
  },
];

const byName = new Map(artists.map((a) => [a.name, a]));

/** Resolves a line-up of names to full artist records, skipping unknowns. */
export const resolveLineup = (names: string[]): Artist[] =>
  names.map((n) => byName.get(n)).filter((a): a is Artist => Boolean(a));

export const roster = artists.filter((a) => a.signed);
