# Creator Portfolio

A dark-canvas personal portfolio and media kit for a **creator / influencer**: a full-screen
project showcase, a filterable archive of brand collaborations with performance stats,
audience numbers, an offering page, a global ⌘K search overlay and editorial content.

Built from `Portfolio Showcase Wireframes.dc.html` (direction **1a**, the archive-first home),
with **specialoffer.inc** as the reference for structure and tone.

> **Re-targeting.** The build started as a nine-person design studio and was re-pointed at a
> solo creator. The architecture did not change — only the content files and the labels. If the
> client is a graphic designer, a photographer or a musician instead, the content files in
> `src/content/` are all you touch.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to dist/
npm run preview   # serve the build locally
npm run lint      # oxlint
```

Requires Node 20.19+ or 22.12+ (Vite 8).

---

## Contents

- [What's built](#whats-built)
- [Making it yours](#making-it-yours)
- [Project structure](#project-structure)
- [Architecture](#architecture)
- [Design tokens](#design-tokens)
- [Responsive rules](#responsive-rules)
- [Deviations from the wireframe spec](#deviations-from-the-wireframe-spec)
- [Performance](#performance)
- [Accessibility](#accessibility)
- [Deployment](#deployment)
- [Not done yet](#not-done-yet)

---

## What's built

Every route in the wireframe exists and renders. Verified in a headless browser: all ten
routes load with zero console errors, and search, filtering, the accordion, hover previews and
the mobile menu all work.

| Route                        | Wireframe       | What it does                                                                                                                                                                                                                                                                 |
| ---------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                          | `1a` + showcase | **Full-screen looping showcase** (see below) · hero with parallaxing portrait · marquee · **audience bars** (Instagram / TikTok / YouTube / newsletter) · 8-row collaborations band · offering list (hover swaps a sample into the hero) · contact · press · footer wordmark |
| `/work`                      | `1d`            | Platform chips, format select, A–Z/year sort, list/grid toggle — all in the URL. Cursor-follow hover preview. Infinite scroll **plus** a real Load-more button. Empty state with clear-filters.                                                                              |
| `/work/:slug`                | `1e`            | Full-bleed hero, sticky meta rail (brand / format / scope / usage), **performance stats**, block-rendered body, next/prev that walks the _filtered_ order you arrived with                                                                                                   |
| `/about`                     | `1f`            | Bio, headline numbers, draggable behind-the-scenes scroller, offering list with a fixed 180×240 sample slot, brand list                                                                                                                                                      |
| `/services`                  | `1g`            | "Work with me" — sticky index + accordion with GSAP-animated heights; `/services#ugc` opens and scrolls to that panel; every panel links to real collaborations                                                                                                              |
| `/press`                     | `1h`            | Press/recognition toggle, grouped by year, external rows with `rel="noopener noreferrer"`, optional linked-collaboration chips                                                                                                                                               |
| `/journal`, `/journal/:slug` | `1i`            | Index + article at a 62–68ch measure, `draft: true` hidden in production                                                                                                                                                                                                     |
| `/contact`                   | `1j`            | Mailto-first. Inquiry form is behind `VITE_ENABLE_FORM`, off by default.                                                                                                                                                                                                     |
| ⌘K overlay                   | `1k`            | Fuse.js over a generated index, `?q=` mirrored to the URL, ↑↓ + Enter, focus trap, scroll lock                                                                                                                                                                               |
| `*`                          | `1l`            | Doubles as the root `errorElement`; distinguishes a 404 from a crashed loader                                                                                                                                                                                                |

### The home showcase

The first thing on the home page is a full-screen reel of the featured projects.

- **Advance it** by touch swipe, mouse drag, `←` / `→`, or the on-screen buttons.
- **It loops.** Past the last slide it returns to the first; backwards from the first it jumps
  to the last. The buttons are never disabled.
- **Click a slide** to open that project's case study.
- **Three projects play video** instead of a still (Slow Morning, Watchlist, Morning Miles),
  marked with a `FILM` badge. Only the slide on screen plays, and nothing downloads until it
  does (`preload="none"` + play on activation).
- **Vertical scrolling is left alone.** A wheel or a vertical swipe carries you down to the
  rest of the page rather than being captured by the reel.

`/work` is untouched by this — it remains the list/grid archive, and `?view=grid` is the same
grid it always was.

**Placeholder content.** The creator is called "Juno Reyes" and every collaboration, brand and
number is invented. Nothing is branded as the reference site. Replace it as described below.

**Sample imagery.** Photographs come from the Unsplash CDN and the three showcase clips from
Pexels, both hotlinked via [src/content/media.js](src/content/media.js). They are scaffolding,
not a shipping choice — Unsplash asks that production apps use their API and credit the
photographer. Any media object left without a `src` falls back to a procedural plate (six
variants, hashed from the media id), so an empty archive still reads as designed.

## Making it yours

### 1. The palette — one file

All six colours live in `@theme` at the top of [src/styles/tokens.css](src/styles/tokens.css).
Nothing else in the codebase contains a hex value; components only ever reference the semantic
aliases (`--ink`, `--accent`, …), which are derived from these.

```css
@theme {
  --color-bg: #0f0e0c; /* dark canvas   */
  --color-ink: #f2f0eb; /* primary type  */
  --color-mute: #8b8377; /* meta type     */
  --color-line: #2a2620; /* hairlines     */
  --color-accent: #e0491b; /* vermilion     */
  --color-paper: #e9e5db; /* inverted      */
}
```

> **The Pinterest palette you linked is behind a login, so I could not read it.** These are the
> wireframe's own tokens — a warm charcoal with a vermilion accent, already close to the
> specialoffer idiom. Paste your six hexes over these and the whole site re-skins, including the
> procedural plates, which are built from the same tokens. If you keep a light `--color-bg`,
> also flip `color-scheme: dark` to `light` a few lines below.

### 2. The content

Plain files in [src/content/](src/content/), each shaped exactly like its Sanity document:

| File          | Holds                                                                                                      |
| ------------- | ---------------------------------------------------------------------------------------------------------- |
| `site.js`     | Name, handle, headline, bio, **audience numbers**, headline stats, emails, socials, brand list, taxonomies |
| `projects.js` | The collaborations archive — the only file that needs real work                                            |
| `skills.js`   | What the creator offers a brand (formats, turnaround)                                                      |
| `press.js`    | Press and recognition                                                                                      |
| `services.js` | The five "work with me" panels                                                                             |
| `journal.js`  | Posts, as block arrays                                                                                     |
| `media.js`    | Where the sample photos and videos come from                                                               |

**Two taxonomies drive the filters**, both in `site.js`:

- `sectors` — platforms (Instagram, TikTok, YouTube, Offline). The chips on `/work`.
- `disciplines` — formats (short form, long form, UGC, brand film, hosting…). The `Format`
  column and the dropdown.

Swap those two arrays and the whole archive re-categorises. For a graphic designer they would
be client type and design discipline; for a photographer, genre and deliverable.

### 3. Real images

Every media object in `projects.js` is built by one helper, so swapping sample imagery for
real work is a single edit in [src/content/media.js](src/content/media.js) — or, per item,
by writing the object out longhand:

```js
cover: { id: "slow-morning-cover", src: "/media/slow-morning.jpg", alt: "…", ratio: "4/3" }
```

[`Media`](src/components/Media.jsx) handles `srcSet`, `sizes`, `lqip` blur-up and lazy-loading
below the fold. A `src` of `null` renders the procedural plate instead.

Showcase video is opt-in per project:

```js
showcaseVideo: { src: "/media/slow-morning.mp4" }
```

### 4. Going to a CMS

Every loader calls a function in [src/lib/content.js](src/lib/content.js) — `homeQuery()`,
`allProjects()`, `projectBySlug()` and so on. They are already `async` and return plain
serialisable objects. Swapping their bodies for `sanityClient.fetch(groq…)` is the entire
migration; no route or component changes. The target schema is below.

<details>
<summary>Sanity content model</summary>

```
project       title slug client year sector disciplines[] cover hoverVideo
              showcaseVideo intro stats[] blocks[] credits[] featured order seo
skill         name role sample order
pressItem     date publication title url type linkedProject→project
service       n title body images[] related[]→project
siteSettings  emails[] offices[] socials[] defaultSeo marquee[] heroCutout
```

</details>

## Project structure

```
src/
  main.jsx              router, route-level code splitting
  layouts/RootLayout    Lenis → Nav → ScrollRestoration → Outlet → Footer → SearchOverlay
  routes/               one file per route, each exporting { loader, Component }
  components/           Nav · Footer · SearchOverlay · ProjectSlides · ArchiveTable
                        HoverMedia · Marquee · MediaScroller · RosterList · StatBars
                        Media · Blocks · Reveal · Skeleton · Seo
  hooks/                useLenis · useReducedMotion · useHoverMedia · useFilterParams
                        useScrollLock · useSearch
  lib/                  content.js (the query layer) · motion.js · format.js · jsonld.js
  content/              site · projects · skills · press · services · journal · media
  styles/               tokens.css · globals.css
```

Styling follows the spec's split: **Tailwind** for layout and spacing, **CSS Modules** for
type, motion and anything with an exact column template. Shared type classes (`u-display`,
`u-meta`, `u-prose`, `u-tag`) live in `globals.css`.

Import alias `@/` → `src/`, declared in both `vite.config.js` and `jsconfig.json`.

## Architecture

**The URL is the only filter state.** `useFilterParams` reads and writes
`?sector=&discipline=&client=&year=&sort=&view=`. There is no local filter state anywhere, so
every view is shareable and the back button behaves. Filters are carried onto project links,
which is how next/prev on a case study walks the same order you were just looking at.

**Motion is optional, always.** GSAP, ScrollTrigger and Lenis are behind dynamic imports and
resolve after paint. Under `prefers-reduced-motion` they are _never loaded at all_ —
`loadMotion()` resolves `null` and every caller bails in one line. The page is correct before
any of it arrives, which is why `Reveal` uses `gsap.from()` and skips anything already on
screen rather than hiding content in CSS and revealing it in JS.

**One RAF loop.** Lenis is driven by `gsap.ticker`, and pushes into `ScrollTrigger.update()`.

**Scroll on navigation.** New navigations jump to the top; `POP` (the back button) is left to
`<ScrollRestoration>`, so returning to `/work` restores your place in the list.

## Design tokens

| Role        | Value                                                  |
| ----------- | ------------------------------------------------------ |
| Display     | `clamp(44px, 9.2vw, 168px)` / `0.9` / `-0.03em`        |
| H2          | `clamp(28px, 3.4vw, 56px)`                             |
| Body        | `16px / 1.45`                                          |
| Meta        | `11px` mono, uppercase, `0.07em`                       |
| Grid        | gutters 20 / 28 / 40 · max width 1680                  |
| Nav         | 44px, fixed, `mix-blend-mode: difference`, never grows |
| Sticky rail | `top: 72px`                                            |
| Focus       | 2px accent outline, offset 2                           |

Type is Space Grotesk + Space Mono from Google Fonts.

## Responsive rules

Mobile-first. Breakpoints **sm 640 · md 834 · lg 1024 · xl 1440**.

- Archive rows collapse to thumbnail + stacked meta below 834px.
- Hover previews are off below 1024px, on coarse pointers, and under reduced motion — the
  markup is not rendered at all rather than hidden.
- The project meta rail un-sticks and stacks under the title below 1024px.
- Mobile menu is full-screen with body scroll locked and 48px minimum hit targets.

## Deviations from the wireframe spec

| Spec says                                                        | Built as                                                          | Why                                                        |
| ---------------------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------- |
| Sanity + GROQ                                                    | Local content modules behind the same async query layer           | Runs with no credentials; migration is one file            |
| MDX journal via `import.meta.glob`                               | Block arrays through the same `<Blocks>` renderer                 | One body renderer instead of two, no MDX toolchain         |
| `search.json` built at build time                                | Index generated from the content modules, lazy-imported with Fuse | Same shape, same payload, nothing extra in the entry chunk |
| React Router 6.4                                                 | React Router 7                                                    | Same data-router API; 6.4's successor                      |
| React 18 / Vite 5                                                | React 19 / Vite 8                                                 | What the repo was scaffolded with                          |
| GSAP SplitText                                                   | `splitWords()` in `lib/motion.js`                                 | Does the one thing needed without the plugin               |
| ScrollTrigger drives the services active index                   | IntersectionObserver                                              | Keeps working under reduced motion, where GSAP never loads |
| "Discipline" used for both the filter chips and the table column | Split into `sector` and `disciplines[]`                           | They are different axes; the wireframe conflates them      |
| Clients as logo wall _or_ set list (open question)               | Set list                                                          | No asset pipeline, no logo permissions                     |

## Performance

From `npm run build`:

- **Initial JS ≈ 111 kB gzip** across the two entry chunks, against the spec's 180 kB budget.
- GSAP (27 kB gz), ScrollTrigger (18 kB gz), Lenis (5 kB gz) and Fuse (9 kB gz) are separate
  chunks fetched on demand.
- Every route is its own chunk; only the home route is eager.

Not yet measured: Lighthouse. The spec gates handoff at ≥ 95 perf/a11y on `/`, `/work` and
`/work/:slug` — worth running once real images are in, since they are the variable that
matters.

## Accessibility

- Every archive row is a single real `<a>` spanning the row, 44px minimum.
- Search overlay: `role="dialog"`, `aria-modal`, focus trap, ESC, `aria-activedescendant` on a
  roving `listbox`, body scroll locked.
- Offering rows respond to focus as well as hover, so the sample swap is keyboard-reachable.
- Collapsed accordion panels use `inert`, so their content is never focusable.
- Skip link, visible focus ring everywhere, `prefers-reduced-motion` honoured throughout.
- `mute` is only used at 11px bold, per the contrast gate.

## Deployment

Static SPA — `npm run build`, serve `dist/`.

**The host must return a real 404 status** for unknown paths, not a 200 SPA shell. On Vercel or
Netlify that means a rewrite to `index.html` with an explicit 404 status for unmatched routes;
otherwise every typo'd URL is a soft 404 to search engines.

Environment variables:

```
VITE_ENABLE_FORM=false     # phase-2 inquiry form
VITE_FORM_ENDPOINT=        # if unset, the form composes a mailto instead
```

## Not done yet

1. **Real content** — the creator ("Juno Reyes"), every collaboration, every audience number
   and every stat is invented. Replace `src/content/` wholesale.
2. **The sample imagery does not match the copy.** Photos are assigned by hashing a media id,
   so a reel campaign for a skincare brand is illustrated with whatever Unsplash photo that
   hash landed on. It reads as placeholder, because it is. Curating a set that matches the
   copy — and the warm charcoal palette — is worth doing before this is shown to anyone.
3. **Your palette** — see the note above; the pin was unreadable.
4. **`index.html` still carries the studio's `<title>` and meta description** ("New Format,
   Inc. — Art direction & design"). Per-route titles come from `<Seo>`, but the static shell —
   what crawlers and link previews see first — needs updating to the creator.
5. **Lighthouse pass** — worth doing once real media is in.
6. **The `1b` / `1c` home directions** were not built; `1a` matches the reference.
7. **Shared-element hero transition** (archive row → project hero, FLIP). The route transition
   is the 320ms fade; the FLIP handoff is not wired.
8. **Hover-preview video on `/work`.** The cursor-follow preview loads a poster and has the
   full dwell-then-play code path, but every `hoverVideo.url` is still `null`. (The _home
   showcase_ videos do play — that is a separate field, `showcaseVideo`.)
9. **No tests.** Verified by driving a headless browser, not by a committed suite.
