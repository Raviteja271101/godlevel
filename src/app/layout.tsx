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
  /* The parse-time script below stamps data-intro and data-loaded on <html>
     before React hydrates, which is the whole point of it, so the server HTML
     will not match. suppressHydrationWarning covers this element's own
     attributes only, not the tree beneath it. */
  return (
    <html lang="en" suppressHydrationWarning className={`${archivo.variable} ${chivoMono.variable}`}>
      <body className="antialiased">
        {/* Runs at parse time, doing three things a React effect cannot,
            since one only fires once hydration is done: stop the browser
            restoring a previous scroll position, start the intro on the
            first painted frame, and set the flag that ends it.

            The intro is gated rather than started here because a CSS
            animation otherwise begins the moment the stylesheet applies —
            on a cold load that is before the video has painted, so the box
            would already be part-grown by the time anyone saw it. The 1500
            below must stay in step with --load-duration in globals.css. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'if("scrollRestoration" in history){history.scrollRestoration="manual"}' +
              'var d=document.documentElement;' +
              'function end(){try{sessionStorage.setItem("sl:loaded","1")}catch(e){}' +
              'd.setAttribute("data-loaded","");if(!location.hash){scrollTo(0,0)}}' +
              'try{' +
              'if(sessionStorage.getItem("sl:loaded")||matchMedia("(prefers-reduced-motion: reduce)").matches){' +
              'd.setAttribute("data-loaded","")}else{' +
              'if(!location.hash){scrollTo(0,0)}' +
              'var go=function(){d.setAttribute("data-intro","");setTimeout(end,1500)};' +
              'var kick=function(){requestAnimationFrame(function(){requestAnimationFrame(go)})};' +
              'if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",kick)}else{kick()}' +
              '}}catch(e){d.setAttribute("data-loaded","")}',
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
