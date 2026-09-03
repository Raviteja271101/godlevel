# Godlevel

A dark, cinematic site for a fictional independent record label and events studio —
built as a structural counterpart to sites like noartmusic.com, with entirely original
branding, copy and media.

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS v4 · TypeScript.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build — all routes prerender to static HTML
npm start
```

## Routes

| Route      | What it is                                                        |
| ---------- | ----------------------------------------------------------------- |
| `/`        | Video hero, about statement, events carousel, live world clock, label grid, shop carousel |
| `/events`  | Full season listing with status, line-up and ticket state          |
| `/label`   | Release catalogue + artist roster                                  |
| `/gallery` | Masonry photo archive                                              |
| `/shop`    | Merchandise grid                                                   |
| `/about`   | Story, stats, and policy sections (radio, access, safer spaces, press) |

## Changing the content

All copy and content lives in `src/data/` — nothing is hardcoded in the components.
Edit these and the whole site follows:

- `site.ts` — brand name, tagline, description, nav, footer columns, socials
- `events.ts` — shows: city, venue, date, IANA timezone, coordinates, line-up, status
- `releases.ts` — the catalogue and the artist roster
- `products.ts` — shop items
- `gallery.ts` — archive photographs and captions

Dates are stored as ISO strings and formatted at render time.
The "Around the World" clock reads the `tz` field of each event and shows that
venue's **real** current local time via `Intl.DateTimeFormat`.

## Changing the media

Everything sits in `public/media/`, referenced by path from the data files.
Drop in replacements using the same filenames and nothing else needs to change.

- `hero.mp4` + `hero-poster.jpg` — the looping hero video and its poster frame
- `event-0*.jpg`, `gal-0*.jpg`, `artist-0*.jpg`, `shop-0*.jpg`

Current placeholders are free-license stock photography and video from Pexels,
transcoded locally. **Swap them for your own before going live** and check the
licence terms for anything you keep.

## Motion

Modelled on the interaction language of sites like noartmusic.com, reimplemented
from scratch. Only Lenis is a dependency — the rest is small hand-rolled code
rather than pulling in GSAP.

| Effect | Component | Behaviour |
| --- | --- | --- |
| Preloader | `Preloader.tsx` | Wordmark, 170px progress bar and a percentage counter easing to 100 over 1.5s, then the panel slides up. Once per session. |
| Page transition | `app/template.tsx` | A black panel wipes upward and the content lifts in on every route change. |
| Text scramble | `ScrambleText.tsx` | Characters randomise then resolve left-to-right over ~200ms, flashing the accent colour. `trigger="hover"` binds to the enclosing link; `trigger="view"` fires once on scroll. |
| Word reveal | `SplitWords.tsx` | Headlines split into inline-block words that rise in sequence. |
| Custom cursor | `Cursor.tsx` | A bubble trails the pointer and shows the label from the nearest `data-cursor-text` element ("Info & tickets", "Shop now"). |
| Smooth scroll | `SmoothScroll.tsx` | Lenis inertial scrolling, with in-page anchors routed through it. |
| Card hover | `.media-zoom` | Images scale to 1.05 on `0.6s cubic-bezier(.16,1,.3,1)`. |

Shared easing is the expo-out curve `cubic-bezier(0.16, 1, 0.3, 1)`.

**Accessibility.** Every effect is disabled under `prefers-reduced-motion`, the
cursor bubble only runs for fine pointers, scrambling text keeps a stable
`aria-label`, and a `<noscript>` rule guarantees nothing stays hidden behind a
reveal if JS fails.

Nothing above the fold animates until the preloader hands over — that handoff is
the `data-loaded` attribute on `<html>`.

## Design system

Tokens live once in `src/app/globals.css` under Tailwind v4's `@theme`.
The visual language follows the reference site's measured values:

- **Type** — everything is Chivo Mono, uppercase, 1.2 line-height, stepping 14px /
  16px / 18px at the 768px and 992px breakpoints.
  Statement headings use `.t-statement` — 2em, going 3em from 992px up, so the
  page tops out at 28 / 32 / 54px as the reference does.
  Large statements use Archivo 600 with -0.028em tracking and 1.0 leading.
- **Colour** — white ground (`paper`), black ink, `hair` hairlines, plus
  inverted `night` sections. `scramble` cyan and `bubble` red are accents.
- **`.eyebrow`** — prefixes a filled square via `::before`: ▪ UPCOMING EVENTS
- **`.arrow-link`** — appends a corner arrow: EXPLORE ALL ↳
- **`.measure`** — justified uppercase mono paragraph, 44ch wide
- **`CropMarks`** — four corner registration brackets framing any box

Cards are captioned `[01]  NAME` with the date on a second line.

### What could not be matched

Three things are deliberately not reproduced, because they belong to the
reference site rather than to a design convention:

- its hand-drawn logotype
- its commissioned per-event illustrations
- Neue Haas Grotesk, its heading face, which is commercially licensed
  (Archivo stands in)

Pixel-identical output is also not achievable while the copy differs — different
words wrap differently. What matches is the system: fonts, sizes, tracking,
colour, framing and spacing.

The previous dark/Archivo design is kept in `.design-v1-backup/` if you want it back.

## Notes

- Scroll reveals, the menu, the carousels and the clock are the only client
  components; everything else is a server component.
- Motion is disabled automatically under `prefers-reduced-motion`.
- The newsletter form has **no backend** — wire `src/components/Newsletter.tsx`
  up to your provider. The ticket buttons are likewise presentational.
