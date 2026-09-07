import Link from "next/link";
import ScrambleText from "./ScrambleText";
import { address, contact, footerBlurb, footerColumns, footerCta, site, socials } from "@/data/site";

export default function SiteFooter() {
  const explore = footerColumns[0];

  const exploreLinks = (
    <ul className="mt-3 space-y-2">
      {explore.links.map((link) => (
        <li key={link.label}>
          <Link href={link.href} className="transition-opacity hover:opacity-60">
            <ScrambleText text={link.label} />
          </Link>
        </li>
      ))}
    </ul>
  );

  const socialLinks = (
    <ul className="mt-3 space-y-2">
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
  );

  const email = (
    <a href={`mailto:${contact.email}`} className="transition-opacity hover:opacity-60">
      <ScrambleText text={contact.email} />
    </a>
  );

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

      {/* ---- Phone ----
          Stacked in a single column this ran long and read as a list of
          headings. Three columns are kept at this width instead — links out to
          the left, the wordmark centred, socials out to the right — with
          contact paired against address beneath, and the standfirst last. */}
      <div className="mt-14 md:hidden">
        <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-4">
          <div>
            <h3 className="opacity-60">{explore.title}</h3>
            {exploreLinks}
          </div>

          <h3 className="px-2 text-center">{site.wordmark}</h3>

          <div className="text-right">
            <h3 className="opacity-60">Follow</h3>
            {socialLinks}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4">
          <div>
            <h3 className="opacity-60">Contact</h3>
            <p className="mt-3">{email}</p>
            <p>{contact.phone}</p>
          </div>

          <div className="text-right">
            <h3 className="opacity-60">Address</h3>
            {address.map((line) => (
              <p key={line} className="mt-1 first:mt-3">
                {line}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-12">
          {footerBlurb.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>

      {/* ---- Tablet and up ----
          Identity and contact left, explore centred, address and socials
          right. Every link scrambles on hover, as the header nav does. */}
      <div className="mt-16 hidden gap-12 md:grid md:grid-cols-3">
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
            <p className="mt-2">{email}</p>
            <p>{contact.phone}</p>
          </div>
        </div>

        <div className="md:text-center">
          <h3>{explore.title}</h3>
          {exploreLinks}
        </div>

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
            {socialLinks}
          </div>
        </div>
      </div>
    </footer>
  );
}
