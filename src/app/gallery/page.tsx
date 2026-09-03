import type { Metadata } from "next";
import Image from "next/image";
import CropMarks from "@/components/CropMarks";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { gallery } from "@/data/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photographs from past Slow Light seasons.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Archive 2023 — 2025"
        title="Gallery"
        intro="Photographs from past seasons. No phones on the floor, so most of these were taken by people who were working."
      />

      <section className="gutter pb-24">
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {gallery.map((shot, i) => (
            <Reveal key={shot.src} delay={(i % 3) * 90} className="mb-10 break-inside-avoid">
              <figure className="group">
                <div className={`relative overflow-hidden bg-[#efefef] ${i % 3 === 1 ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
                  <CropMarks />
                  <Image
                    src={shot.src}
                    alt={shot.caption}
                    fill
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
                    className="media-zoom object-cover group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="mt-3 flex gap-3">
                  <span className="text-ink-30">[{String(i + 1).padStart(2, "0")}]</span>
                  <span className="flex flex-1 justify-between gap-4">
                    <span>{shot.caption}</span>
                    <span className="opacity-60">{shot.year}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
