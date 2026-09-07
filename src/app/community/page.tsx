import type { Metadata } from "next";
import CropMarks from "@/components/CropMarks";
import Reveal from "@/components/Reveal";
import CommunityWays from "@/components/CommunityWays";
import { initiative, video, ways, cta } from "@/data/community";

export const metadata: Metadata = {
  title: "Community",
  description:
    "The Godlevel Foundation — creating opportunities for underprivileged communities through learning, mentorship, and access to new experiences.",
};

export default function CommunityPage() {
  return (
    <>
      {/* About the Initiative: label on the left, copy on the right — the same
          standfirst arrangement as the about page. */}
      <section className="gutter pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="lg:px-12 xl:px-20">
          <div className="grid gap-5 lg:grid-cols-12">
            <Reveal className="self-start lg:col-span-4">
              <p className="eyebrow">{initiative.label}</p>
            </Reveal>

            <Reveal delay={120} className="lg:col-span-7 lg:col-start-5">
              <div className="space-y-4">
                {initiative.body.map((para) => (
                  <p key={para} className="measure max-w-none">
                    {para}
                  </p>
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <a href={initiative.action.href} className="arrow-link">
                  {initiative.action.label}
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Video: a framed 3:2 media block, corner marks and an 8px inset — the
          same size and frame as the reference foundation page (≈890px, 3:2,
          no border line, four-corner crop marks). Centred, not full-bleed. */}
      <section className="gutter pb-16 md:pb-24">
        <Reveal>
          <div className="relative mx-auto aspect-[3/2] w-full max-w-[890px] bg-[#efefef]">
            <CropMarks />
            <video
              className="absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)] object-cover"
              src={video.src}
              poster={video.poster}
              controls
              playsInline
              preload="metadata"
              aria-label={video.caption}
            />
          </div>
        </Reveal>
      </section>

      {/* How you can be a part of it. */}
      <section className="hairline border-t border-hair gutter py-16 md:py-24">
        <div className="lg:px-12 xl:px-20">
          <div className="max-w-3xl">
            <Reveal>
              <h2 className="display t-statement">{ways.heading}</h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="measure mt-6">{ways.intro}</p>
            </Reveal>
          </div>

          <Reveal className="mt-12 md:mt-16">
            <CommunityWays items={ways.items} />
          </Reveal>
        </div>
      </section>

      {/* Closing call to action. */}
      <section className="gutter py-20 md:py-28">
        <Reveal className="lg:px-12 xl:px-20">
          <div className="hairline flex flex-col gap-6 pt-10 md:flex-row md:items-end md:justify-between">
            <p className="display t-statement max-w-2xl">{cta.headline}</p>
            <a href={cta.action.href} className="arrow-link shrink-0">
              {cta.action.label}
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
