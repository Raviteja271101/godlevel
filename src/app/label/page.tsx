import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import CardCarousel from "@/components/CardCarousel";
import { gallery } from "@/data/gallery";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Godlevel Collective",
  description: "The Godlevel Collective.",
};

const intro = {
  label: "About the Collective",
  body: [
    [
      `The ${site.name} Collective brings together people who are exceptional at what they do.`,
    ],
    [
      "From breakers and runners to calisthenics athletes, creators, and communities, the Collective is made up of individuals who are pushing their craft forward in their own way.",
    ],
    [
      "Each person brings something different.",
      "A different skill.",
      "A different perspective.",
      "A different energy.",
    ],
    [
      "Together, they become part of something bigger.",
      `The ${site.name} Collective moves with us from city to city, bringing people, communities, and new ideas together.`,
    ],
  ],
  action: { label: "Become part of the Collective", href: "/community" },
};

/* Meet-the-Collective carousel: same card shape and interaction as the About
   page — rectangular cards, drift, drag, prev/next — sourced from the
   gallery so the images sit correctly in a 4:3 frame. */
const cards = gallery.map((shot) => ({
  src: shot.src,
  title: shot.caption,
  note: String(shot.year),
}));

export default function LabelPage() {
  return (
    <>
      {/* Same opening as the about page: the video carries the loader intro
          when this page is the first one landed on. */}
      <Hero bare />

      {/* Standfirst: label left, copy right. Each string is its own line, so
          the short ones break where they are written and the long ones wrap
          and justify on their own. No statement heading here — this page
          opens straight into the copy. */}
      <section className="gutter py-16 md:py-36">
        <div className="grid gap-5 lg:grid-cols-12">
          <p className="eyebrow self-start lg:col-span-4 lg:col-start-2">{intro.label}</p>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="lg:max-w-[34rem]">
              {intro.body.map((group, i) => (
                <div key={group[0]} className={i === 0 ? "" : "mt-4"}>
                  {group.map((line) => (
                    <p key={line} className="measure max-w-none">
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            {/* Sits outside the copy block so it aligns to the right edge of
                the column rather than the narrower measure. */}
            <div className="mt-10 text-right">
              <Link
                href={intro.action.href}
                className="arrow-link inline-block text-scramble transition-opacity hover:opacity-70"
              >
                {intro.action.label}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="gutter">
        <p className="eyebrow">Meet the Collective</p>
      </div>
      <CardCarousel cards={cards} />
    </>
  );
}
