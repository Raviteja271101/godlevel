import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import ScrambleText from "@/components/ScrambleText";
import SpreadWords from "@/components/SpreadWords";
import { contact, site, socials } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Have an idea, a collaboration or a partnership in mind? Get in touch with ${site.name}.`,
};

const intro = [
  "Have an idea?",
  "Want to collaborate?",
  `Interested in partnering with ${site.name}?`,
  "Or simply want to be part of what comes next?",
  "We'd love to hear from you.",
];

/** The reference's link glyph: an arrow leaving a box. */
function OutIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 10 10" className="h-[0.7em] w-[0.7em] shrink-0" fill="none">
      <path d="M4 1H1v8h8V6" stroke="currentColor" />
      <path d="M5.5 1H9v3.5M9 1 4.5 5.5" stroke="currentColor" />
    </svg>
  );
}

/**
 * Contact, laid out like the reference's contact page on the site's
 * 12-column grid: a ▪ tag in column 2, the content from column 7. Details
 * are grouped the reference's way (grey tag, then the link with its
 * out-arrow); the page closes on the tagline spreading across the width.
 */
export default function ContactPage() {
  return (
    <>
      {/* ---- Statement ---- */}
      <section className="gutter pt-[120px] md:pt-[164px]">
        <div className="grid gap-5 lg:grid-cols-12 lg:gap-x-[1.39vw]">
          <p className="eyebrow self-start lg:col-span-4 lg:col-start-2">
            <ScrambleText text="Contact" trigger="view" />
          </p>
          <div className="lg:col-span-5 lg:col-start-7">
            <h1 className="display t-statement mt-4 lg:mt-0">Let&apos;s create something together.</h1>
            <div className="mt-8">
              {intro.map((line) => (
                <p key={line} className="measure max-w-none">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Get in touch: the note left, the grouped details right ---- */}
      <section className="gutter pt-24 md:pt-[140px]">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-[1.39vw]">
          <div className="lg:col-span-4 lg:col-start-2">
            <p className="eyebrow">
              <ScrambleText text="Get in touch" trigger="view" />
            </p>
            <p className="measure mt-[23px]">
              Whether you&apos;re an individual, a brand, a community, or an organisation, there&apos;s
              always room for new ideas, conversations, and possibilities.
            </p>
          </div>

          <div className="space-y-[52px] lg:col-span-5 lg:col-start-7">
            <div>
              <p className="eyebrow opacity-50">General</p>
              <a href={`mailto:${contact.email}`} className="mt-[10px] flex items-center gap-[0.5em]">
                <OutIcon />
                <ScrambleText text={contact.email} />
              </a>
            </div>
            <div>
              <p className="eyebrow opacity-50">Based in</p>
              <p className="mt-[10px]">Mumbai, India</p>
            </div>
            <div>
              <p className="eyebrow opacity-50">Follow the journey</p>
              <ul className="mt-[10px] space-y-[10px]">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" className="flex items-center gap-[0.5em]">
                      <OutIcon />
                      <ScrambleText text={s.label} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Send us a message ---- */}
      <section className="gutter pt-24 md:pt-[140px]">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-[1.39vw]">
          <p className="eyebrow self-start lg:col-span-4 lg:col-start-2">
            <ScrambleText text="Send us a message" trigger="view" />
          </p>
          <div className="lg:col-span-5 lg:col-start-7">
            <ContactForm email={contact.email} />
          </div>
        </div>
      </section>

      {/* ---- Close: the line spreads out across the page as it scrolls in ---- */}
      <section className="gutter py-24 md:py-[160px]">
        <div className="lg:px-[7.8vw]">
          <SpreadWords
            text="Moving from city to city. Bringing people together."
            className="display text-[2rem] leading-none tracking-[-0.03em] sm:text-[2.5rem] lg:text-[3.3vw]"
          />
        </div>
      </section>
    </>
  );
}
