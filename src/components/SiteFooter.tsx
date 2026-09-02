import Link from "next/link";
import Newsletter from "./Newsletter";
import { footerColumns, site, socials } from "@/data/site";

export default function SiteFooter() {
  return (
    <footer className="hairline bg-night px-6 py-14 text-white md:px-8 md:py-20">
      <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <p className="display text-4xl md:text-6xl">{site.tagline}</p>
          <div className="mt-10">
            <Newsletter />
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="opacity-60">[{col.title.toUpperCase()}]</h3>
              <ul className="mt-4 space-y-1">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="transition-opacity hover:opacity-60">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-4 border-t border-white/20 pt-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="transition-opacity hover:opacity-60">
              {s.label}
            </a>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 opacity-60">
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <p>
            &copy; {site.founded}&ndash;{new Date().getFullYear()} {site.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
