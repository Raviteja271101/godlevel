import Link from "next/link";
import ScrambleText from "./ScrambleText";
import { address, contact, footerBlurb, footerColumns, footerCta, site, socials } from "@/data/site";

export default function SiteFooter() {
  return (
    <footer className="hairline bg-night gutter py-14 text-white">
      {/* Centred call to action. */}
      <div className="text-center">
        <p className="font-medium">{footerCta.headline}</p>
        <p className="font-medium">{footerCta.line}</p>
        <Link
          href={footerCta.action.href}
          className="mt-5 inline-block text-scramble transition-opacity hover:opacity-70"
        >
          <ScrambleText text={footerCta.action.label} />
        </Link>
      </div>

      {/* Identity and contact left, explore centred, address and socials right.
          Every link here scrambles on hover, as the header nav does. */}
      <div className="mt-16 grid gap-12 md:grid-cols-3">
        <div className="flex flex-col justify-between gap-12">
          <div>
            <h3>{site.wordmark}</h3>
            <div className="mt-2">
              {footerBlurb.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <div>
            <h3>Contact</h3>
            <p className="mt-2">
              <a href={`mailto:${contact.email}`} className="transition-opacity hover:opacity-60">
                <ScrambleText text={contact.email} />
              </a>
            </p>
            <p>{contact.phone}</p>
          </div>
        </div>

        {footerColumns.map((col) => (
          <div key={col.title} className="md:text-center">
            <h3>{col.title}</h3>
            <ul className="mt-2 space-y-1">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-opacity hover:opacity-60">
                    <ScrambleText text={link.label} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="flex flex-col justify-between gap-12 md:text-right">
          <div>
            <h3>Address</h3>
            {address.map((line) => (
              <p key={line} className="mt-1 first:mt-2">
                {line}
              </p>
            ))}
          </div>

          <div>
            <h3>Follow</h3>
            <ul className="mt-2 space-y-1">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-opacity hover:opacity-60"
                  >
                    <ScrambleText text={s.label} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
