import type { Metadata } from "next";
import InfiniteGallery from "@/components/InfiniteGallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A pannable contact-sheet of pieces staged across past seasons.",
};

export default function GalleryPage() {
  return <InfiniteGallery />;
}
