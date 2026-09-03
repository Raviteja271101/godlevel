import type { Metadata } from "next";
import Image from "next/image";
import CropMarks from "@/components/CropMarks";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description: site.description,
};

const stats = [
  { value: "48", label: "Shows staged" },
  { value: "19", label: "Countries" },
  { value: "04", label: "Records pressed" },
  { value: "340", label: "Average capacity" },
];

const sections = [
  {
    id: "radio",
    title: "Slow Light Radio",
    body: "A monthly two-hour broadcast recorded wherever we happen to be. Mostly other peoples records, occasionally a rough mix of something that is not finished yet. Archived in full, free to stream.",
  },
  {
    id: "access",
    title: "Accessibility",
    body: "Several of our venues are historic or semi-derelict, so access varies by site. Every event listing carries a plain-language access note written after a physical survey, and a named contact who will answer questions before you buy.",
  },
  {
    id: "safer",
    title: "Safer spaces",
    body: "Trained welfare staff work every show and are identifiable at all times. Harassment of any kind ends your night. We would rather refund a ticket than host someone who makes the room worse.",
  },
  {
    id: "press",
    title: "Press",
    body: `Logos, artist photography and stage plots are available on request. Write to ${site.press} and tell us what you are working on.`,
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow={`Est. ${site.founded} — ${site.base}`} title="About" intro={site.description} />

      <section className="gutter pb-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden bg-[#efefef]">
              <CropMarks />
              <Image
                src="/media/gal-03.jpg"
                alt="Concrete architecture at a Slow Light venue"
                fill
                sizes="(max-width: 1024px) 92vw, 46vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="space-y-5 lg:pt-8">
              <p className="display text-3xl leading-tight md:text-4xl">The building is half the record.</p>
              <p className="measure">
                We started in {site.founded} with a generator, a borrowed rig and a ferry terminal that
                had been empty for eleven years. The idea was simple and has not changed: find a space
                with a character of its own, and let the music argue with it.
              </p>
              <p className="measure">
                That means every show takes months of permissions, structural surveys and conversations
                with people who have never heard of us. It means capacities stay small. It also means no
                two nights have ever sounded the same, which is the entire point.
              </p>
              <p className="measure">
                The label followed in 2023, almost by accident. Four records in, we press short runs, we
                do not repress, and we pay artists on the day.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="hairline border-y border-hair gutter py-14">
        <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80}>
              <p className="display t-statement">{stat.value}</p>
              <p className="eyebrow mt-2 opacity-60">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="gutter py-16 md:py-24">
        <div className="grid gap-x-12 gap-y-12 md:grid-cols-2">
          {sections.map((section, i) => (
            <Reveal key={section.id} delay={(i % 2) * 90}>
              <article id={section.id} className="hairline scroll-mt-28 pt-5">
                <div className="flex gap-3">
                  <span className="text-ink-30">[{String(i + 1).padStart(2, "0")}]</span>
                  <h2 className="display text-2xl">{section.title}</h2>
                </div>
                <p className="measure mt-3 opacity-60">{section.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="hairline mt-16 flex flex-col gap-5 pt-8 md:flex-row md:items-end md:justify-between">
            <p className="display t-statement max-w-xl">Working on something unusual?</p>
            <a href={`mailto:${site.email}`} className="arrow-link shrink-0">
              {site.email}
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
