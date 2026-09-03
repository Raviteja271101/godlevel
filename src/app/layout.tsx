import type { Metadata } from "next";
import { Archivo, Chivo_Mono } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import ViewportMarks from "@/components/ViewportMarks";
import { site } from "@/data/site";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["500", "600", "700"],
});

// The reference sets everything in Chivo Mono — it carries the whole look.
const chivoMono = Chivo_Mono({
  subsets: ["latin"],
  variable: "--font-chivo-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${chivoMono.variable}`}>
      <body className="antialiased">
        {/* Runs at parse time, ahead of the browser restoring a previous
            scroll position — the intro must start at the top of the hero. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if("scrollRestoration" in history){history.scrollRestoration="manual"}`,
          }}
        />

        {/* Without JS nothing should stay hidden behind a reveal. */}
        <noscript>
          <style>{`[data-reveal],.splitwords .word{opacity:1!important;transform:none!important}`}</style>
        </noscript>

        <Preloader />
        <SmoothScroll />
        <Cursor />
        <ViewportMarks />

        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
