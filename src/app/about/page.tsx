import type { Metadata } from "next";
import Image from "next/image";
import CropMarks from "@/components/CropMarks";
import CardCarousel from "@/components/CardCarousel";
import AboutSlider from "@/components/AboutSlider";
import ImageMarquee from "@/components/ImageMarquee";
import Hero from "@/components/Hero";
import { gallery } from "@/data/gallery";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description: site.description,
};

/* Placeholder: our own still and an existing line, pending the real group
   photograph and copy. */
const founders = {
  label: "Founders",
  src: "/media/gal-06.jpg",
  alt: `The people behind ${site.name}`,
  body: site.description,
};

/* Eight cards, as asked. Drawn from the gallery for now — products.ts only
   holds six entries, so it could not fill the row. Swap the source here when
   the real content arrives. */
const cards = gallery.map((shot) => ({
  src: shot.src,
  title: shot.caption,
  note: String(shot.year),
}));
const slides = [
  {
    label: "Performances",
    src: "/media/gal-01.jpg",
    body: `Experience performances that bring music, movement and culture to life. From powerful live moments to unexpected collaborations, every performance adds a new energy to the festival. Discover artists and performers who bring their own worlds to the ${site.name} stage. Expect the unexpected.`,
  },
  {
    label: "Brand stalls",
    src: "/media/gal-04.jpg",
    body: `Discover brands that become part of the ${site.name} experience. Explore interactive activations, products, challenges and experiences created especially for the festival audience. Connect with brands beyond the usual advertisements and engage with them in real time. Don't just see the brands — experience them.`,
  },
  {
    label: "Competitions",
    src: "/media/gal-03.jpg",
    body: "Experience the energy of competition as talented athletes and performers take centre stage. Watch individuals push their limits, showcase their skills and represent their communities. From intense battles to unforgettable moments, every competition brings something different. This is where talent, passion and performance come alive.",
  },
  {
    label: "VIP lounge",
    src: "/media/gal-05.jpg",
    body: `Step into a space designed for a more exclusive ${site.name} experience. The VIP Lounge offers a place to relax, connect and enjoy the festival from a different perspective. Meet artists, athletes, creators and special guests throughout the experience. More comfort, more access and more unforgettable moments.`,
  },
  {
    label: "Photobooths",
    src: "/media/gal-08.jpg",
    body: `Capture the moments you don't want to forget. ${site.name} photobooths bring creativity, culture and the energy of the festival into every picture. Come with your friends, meet new people and take home a memory from the experience. Because some moments deserve more than just a memory.`,
  },
];
const intro = {
  label: `About ${site.name}`,
  heading: ["More than a festival.", "A movement in motion."],
  body: [
    [
      `${site.name} started with Breaking.`,
      "But it was never meant to stay in one place.",
      `Today, ${site.name} brings together people from different disciplines, backgrounds and communities, connected by the way they express themselves.`,
    ],
    ["Athletes. Artists. Performers. Creators."],
    [
      "From the dance floor to the streets, from the court to the track, different worlds arrive with different stories, skills and styles.",
    ],
    [
      "And for a few days, they exist in the same space.",
      "Not to fit into one category.",
      "But to experience something bigger than their own.",
      `${site.name} is where competition meets culture.`,
    ],
  ],
};

export default function AboutPage() {
  return (
    <>
      {/* Same opening as the home page: the video carries the loader intro
          when this page is the first one landed on. */}
      <Hero bare />

      {/* Standfirst: label left, statement and copy right. Each string is its
          own line, so the short ones break where they are written and the long
          ones wrap and justify on their own. */}
      <section className="gutter py-16 md:py-36">
        <div className="grid gap-5 lg:grid-cols-12">
          <p className="eyebrow self-start lg:col-span-4 lg:col-start-2">{intro.label}</p>

          <div className="lg:col-span-6 lg:col-start-7">
            {/* Left-aligned: justified, a line of three short words stretches
                right across the column and the gaps swallow the type. */}
            <h2 className="display t-statement">
              {intro.heading.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>

            {/* Body stays near the reference measure; the statement above needs
                the wider column to hold its two lines. */}
            <div className="lg:max-w-[34rem]">
            {intro.body.map((group, i) => (
              <div key={group[0]} className={i === 0 ? "mt-8" : "mt-4"}>
                {group.map((line) => (
                  <p key={line} className="measure max-w-none">
                    {line}
                  </p>
                ))}
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      <ImageMarquee />

      <AboutSlider slides={slides} />

      {/* Group picture: full bleed behind a label and a framed note, both held
          to the top-left. Positions are the reference's, measured at 1440 and
          375 — the note sits a little further in on a wide screen. */}
      <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden">
        <Image
          src={founders.src}
          alt={founders.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute top-[45px] left-5 w-[215px] lg:top-[66px] lg:left-[71px] lg:w-[224px]">
          <p className="inline-block bg-[#333] px-4 py-2 text-white">
            <span className="eyebrow">{founders.label}</span>
          </p>

          <div className="relative bg-paper p-4">
            <CropMarks />
            <p className="measure max-w-none">{founders.body}</p>
          </div>
        </div>
      </section>

      <CardCarousel cards={cards} />
    </>
  );
}
