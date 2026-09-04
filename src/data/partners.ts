export type Partner = {
  /** Tier name shown on the card. */
  tier: string;
  /** Larger, heavier card — the headline tier. */
  featured?: boolean;
};

export const partners: Partner[] = [
  { tier: "Powered By Partner" },
  { tier: "Presenting Partner", featured: true },
  { tier: "Energy Partner" },
];

export const partnersCopy = {
  eyebrow: "Godlevel Partners",
  line: "The energy that brings every experience to life.",
  cta: "Join the movement.",
};
