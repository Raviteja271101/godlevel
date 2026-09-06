import type { Metadata } from "next";
import Image from "next/image";
import CropMarks from "@/components/CropMarks";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import CommunityWays from "@/components/CommunityWays";
import { header, initiative, video, ways, cta } from "@/data/community";

export const metadata: Metadata = {
  title: "Community",
  description:
    "The Godlevel Foundation — creating opportunities for underprivileged communities through learning, mentorship, and access to new experiences.",
};

export default function CommunityPage() {
  return (
    <>
      <PageHeader eyebrow={header.eyebrow} title={header.title} intro={header.intro} />

      {/* About the Initiative: label + framed still on the left, copy on the
          right, as the reference lays it out. */}
      <section className="gutter pb-16 md:pb-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden bg-[#efefef]">
              <CropMarks />
              <Image
                src={initiative.image.src}
                alt={initiative.image.alt}
                fill
                sizes="(max-width: 1024px) 92vw, 46vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="lg:pt-8">
              <p className="eyebrow">{initiative.label}</p>
              <div className="mt-6 space-y-4">
                {initiative.body.map((para) => (
                  <p key={para} className="measure">
                    {para}
                  </p>
                ))}
              </div>
              <a href={initiative.action.href} className="arrow-link mt-8 inline-block">
                {initiative.action.label}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Video: a full-width framed media block. */}
      <section className="gutter pb-16 md:pb-24">
        <Reveal>
          <div className="relative aspect-video overflow-hidden bg-[#efefef]">
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
        <div className="grid gap-5 lg:grid-cols-12">
          <div className="lg:col-span-6 lg:col-start-1">
            <Reveal>
              <h2 className="display t-statement">{ways.heading}</h2>
            </Reveal>
          </div>
          <div className="lg:col-span-5 lg:col-start-7">
            <Reveal delay={100}>
              <p className="measure">{ways.intro}</p>
            </Reveal>
          </div>
        </div>

        <Reveal className="mt-12 md:mt-16">
          <CommunityWays items={ways.items} />
        </Reveal>
      </section>

      {/* Closing call to action. */}
      <section className="gutter py-20 md:py-28">
        <Reveal>
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
