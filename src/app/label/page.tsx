import type { Metadata } from "next";
import Image from "next/image";
import CropMarks from "@/components/CropMarks";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { releases, roster } from "@/data/releases";

export const metadata: Metadata = {
  title: "Label",
  description: "The Godlevel catalogue and artist roster.",
};

export default function LabelPage() {
  return (
    <>
      <PageHeader
        eyebrow="Catalogue & roster"
        title="The Label"
        intro="Records made on location and pressed in short runs. We record the shows we put on, and release what survives the edit."
      />

      <section className="gutter pb-20">
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {releases.map((release, i) => (
            <Reveal key={release.catalogue} delay={i * 80}>
              <article className="group" data-cursor-text="Listen">
                <div className="relative aspect-square overflow-hidden bg-[#efefef]">
                  <CropMarks />
                  <Image
                    src={release.image}
                    alt={`${release.title} by ${release.artist}`}
                    fill
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 23vw"
                    className="media-zoom object-cover grayscale group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                </div>
                <div className="mt-3 flex gap-3">
                  <span className="text-ink-30">[{release.catalogue}]</span>
                  <span>
                    <span className="block">{release.title}</span>
                    <span className="block opacity-60">{release.artist}</span>
                  </span>
                </div>
                <p className="measure mt-3 opacity-60">{release.notes}</p>
                <p className="hairline mt-3 pt-2 opacity-60">
                  {release.format} &middot; {release.year}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="roster" className="hairline scroll-mt-24 border-t border-hair gutter py-16 md:py-24">
        <Reveal>
          <p className="eyebrow">Artists</p>
          <h2 className="display t-statement mt-4">Roster</h2>
        </Reveal>

        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {roster.map((artist, i) => (
            <Reveal key={artist.name} delay={i * 80}>
              <article className="group">
                <div className="relative aspect-[3/4] overflow-hidden bg-[#efefef]">
                  <CropMarks />
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    fill
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 23vw"
                    className="media-zoom object-cover grayscale group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                </div>
                <div className="mt-3 flex gap-3">
                  <span className="text-ink-30">[{String(i + 1).padStart(2, "0")}]</span>
                  <span>
                    <span className="block">{artist.name}</span>
                    <span className="block opacity-60">
                      {artist.role} &middot; {artist.based}
                    </span>
                  </span>
                </div>
                <p className="measure mt-3 opacity-60">{artist.bio}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
