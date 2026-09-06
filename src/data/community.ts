import { contact } from "./site";

/** The Godlevel Foundation / Community page. Copy is the source of truth —
    the components read from here, nothing is hardcoded in the page. */

export const header = {
  eyebrow: "Godlevel Foundation",
  title: "Godlevel Initiative",
  intro:
    "An initiative creating opportunities for underprivileged communities — through learning, mentorship, and access to new experiences.",
} as const;

export const initiative = {
  label: "About the Initiative",
  image: {
    src: "/media/gal-06.jpg",
    alt: "The Godlevel Foundation at work in the community",
  },
  body: [
    "The Godlevel Foundation is an initiative focused on creating opportunities for underprivileged communities through learning, mentorship, and access to new experiences.",
    "We believe that talent can come from anywhere. By creating spaces to learn, grow, and explore, we aim to give individuals the opportunity to discover their potential and take their passion further.",
    "Through workshops, training, and community-led initiatives, Godlevel Foundation works towards making opportunities more accessible to those who may not otherwise have them.",
  ],
  action: { label: "Submit an Opportunity", href: `mailto:${contact.email}` },
} as const;

export const video = {
  src: "/media/hero.mp4",
  poster: "/media/hero-poster.jpg",
  caption: "The initiative in motion",
} as const;

export const ways = {
  heading: "How you can be a part of it",
  intro:
    "Creating opportunities takes a community. Whether you're an individual, organisation, educator, or someone with something valuable to share, there are many ways to become part of the initiative.",
  items: [
    {
      label: "Partner with us",
      body: "Organisations and communities can collaborate with the Godlevel Foundation to create meaningful opportunities, programmes, and experiences for those who need them.",
    },
    {
      label: "Share what you have",
      body: "Everyone has something to offer. A skill, knowledge, time, resources, or an opportunity. If there's something you can teach, contribute, donate, or share with underprivileged communities, we'd love to hear from you.",
    },
    {
      label: "Create an opportunity",
      body: "Know of an opportunity that could make a difference? Whether it's a workshop, mentorship, learning programme, resource, or experience, help us connect it with someone who could benefit from it.",
    },
  ],
} as const;

export const cta = {
  headline: "Make a difference with what you have.",
  action: { label: "Get in touch", href: `mailto:${contact.email}` },
} as const;
