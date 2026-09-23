# Studio Portfolio — Wireframes & Build Spec

A Vite + React front end for a studio/creative portfolio site: a fixed-nav, smooth-scrolled
archive site with a filterable project index, per-project case studies, a global ⌘K search
overlay, and a small amount of CMS-backed editorial content.

The design is not finished in code yet. The **source of truth today is the wireframe file** at
the repo root:

```
Portfolio Showcase Wireframes.dc.html
```

It contains 14 annotated screens — three competing home directions, eight routes, a responsive
set, and a full dev handoff sheet. Everything in this README is transcribed from that file so
the spec survives outside the viewer.

---

## Contents

- [Current state](#current-state)
- [Reading the wireframes](#reading-the-wireframes)
- [Screen index](#screen-index)
- [Pick a home direction](#pick-a-home-direction-blocking)
- [Target stack](#target-stack)
- [Project structure](#project-structure)
- [Shell & motion](#shell--motion)
- [Design tokens](#design-tokens)
- [Responsive rules](#responsive-rules)
- [Route contracts](#route-contracts)
- [Content model](#content-model-sanity)
- [Performance budget](#performance-budget)
- [Accessibility & QA gates](#accessibility--qa-gates)
- [Getting started](#getting-started)
- [Build order](#build-order)
- [Open decisions](#open-decisions)

---

## Current state

This repo is still a **bare `create-vite` React scaffold**. `src/App.jsx` renders an empty
`<div>`; none of the screens below exist yet.

What is actually installed, versus what the handoff sheet specifies:

| Area    | Spec (wireframe `1n`)                                         | Repo today                                 |
| ------- | ------------------------------------------------------------- | ------------------------------------------ |
| Build   | Vite 5                                                        | Vite 8                                     |
| React   | 18                                                            | 19                                         |
| Routing | `react-router-dom` 6.4 data router                            | not installed                              |
| Styling | Tailwind (layout) + CSS Modules (type/motion)                 | plain CSS — `src/index.css`, `src/App.css` |
| Motion  | `gsap` 3 + ScrollTrigger + SplitText, `@studio-freight/lenis` | not installed                              |
| Content | `@sanity/client` + GROQ, MDX, local JSON                      | not installed                              |
| Search  | `fuse.js`                                                     | not installed                              |
| Icons   | —                                                             | `lucide`                                   |
| Lint    | —                                                             | `oxlint`                                   |

**Known gaps to clear before the first commit of real work:**

1. `vite.config.js` uses `path.resolve(...)` for the `@` alias but never imports `path`, so
   `npm run dev` and `npm run build` both fail with `ReferenceError: path is not defined`.
   Add `import path from "node:path"`.
2. `jsConfig.json` should be `jsconfig.json` (lowercase) for editors to pick up the `@/*` path
   mapping.
3. React 19 and Vite 8 are both newer than the spec assumed. Nothing here depends on React 18
   specifically, but re-verify the GSAP/Lenis wiring and `ScrollRestoration` against React
   Router's current release when you add them.
4. `lucide` is the framework-agnostic package; `lucide-react` is the one a React app wants.

## Reading the wireframes

Open `Portfolio Showcase Wireframes.dc.html` in the design-console viewer it was authored in.
It loads a sibling `./support.js` runtime that is **not** in this repo — the raw file will not
render standalone in a browser without it.

Inside the viewer:

- Screens sit on one **horizontal rail**. The mouse wheel scrolls it sideways, the `←` / `→`
  buttons step one viewport, and each card scrolls vertically on its own.
- Every screen has a deep link: `#1a` … `#1n`.
- Three toggles drive the render:

| Prop          | Options             | Default | Effect                                                         |
| ------------- | ------------------- | ------- | -------------------------------------------------------------- |
| `annotations` | on / off            | on      | The handwritten orange implementation notes                    |
| `theme`       | Paper / Dark canvas | Paper   | Wireframe chrome only — the _site_ palette is dark, see tokens |
| `specDetail`  | Full / Summary      | Full    | Summary hides the Data/States/Motion rows on the handoff sheet |

The annotations are the important part: they carry the interaction spec — scrub values, fade
durations, breakpoint cut-offs — that the boxes alone don't communicate.

## Screen index

| ID   | Screen                         | Route                        | Notes                                                      |
| ---- | ------------------------------ | ---------------------------- | ---------------------------------------------------------- |
| `1a` | Home — archive-first           | `/`                          | 8 anchored sections, long scroll, closest to the reference |
| `1b` | Home — reel-first              | `/`                          | Full-bleed video hero, 5 sections, media-led               |
| `1c` | Home — index _is_ the homepage | `/`                          | No hero; 60/40 split, list + sticky preview pane           |
| `1d` | Work index                     | `/work`                      | Dense archive table, filter state in the URL               |
| `1e` | Project detail                 | `/work/:slug`                | Case study, sticky meta rail, block-based body             |
| `1f` | About / team                   | `/about`                     | Manifesto, studio scroller, people grid                    |
| `1g` | Services                       | `/services`                  | Sticky index + accordion                                   |
| `1h` | Press & awards                 | `/press`                     | Table grouped by year, press/awards toggle                 |
| `1i` | Journal                        | `/journal`, `/journal/:slug` | MDX index + article                                        |
| `1j` | Contact                        | `/contact`                   | Mailto-first; inquiry form is phase 2                      |
| `1k` | Search overlay                 | global portal, not a route   | ⌘K, mirrors `?q=` to the URL                               |
| `1l` | 404 / error                    | `*`                          | Also the root `errorElement`                               |
| `1m` | Responsive set                 | —                            | Mobile 390 (home, menu, archive) + tablet 834 detail       |
| `1n` | Dev handoff sheet              | —                            | The build spec this README transcribes                     |

## Pick a home direction (blocking)

`1a`, `1b` and `1c` are alternatives, not a sequence. One has to be chosen before sprint 3
starts — each implies a different hero component and a very different amount of media
production.

|              | `1a` Archive-first                    | `1b` Reel-first                               | `1c` Index-as-home            |
| ------------ | ------------------------------------- | --------------------------------------------- | ----------------------------- |
| Hero         | Big type + parallaxing cutout PNG     | `100svh` autoplay reel, snaps between 3 films | None — straight into the list |
| Sections     | 8 (`S00`–`S08`)                       | 5                                             | 1 + sticky preview            |
| Asset burden | Low — one cutout, per-row hover loops | **High** — 3 finished films + posters         | Low                           |
| LCP risk     | Low                                   | High (video hero)                             | Lowest                        |
| Reads as     | An archive with a front page          | A reel with an archive behind it              | A working index               |

Section breakdown of `1a`, for reference: `S00` fixed nav · `S01` hero · `S02` marquee band ·
`S03` discipline counters · `S04` selected archive (8 rows) · `S05` team · `S06` contact ·
`S07` recent press · `S08` footer wordmark.

Two details worth pulling out of the annotations: in `1a` the nav is `position: fixed` with
`mix-blend-mode: difference` over media and a height of 44px that never grows; in `1c` the list
is virtualised across 95 rows and keyboard-navigable with ↑↓, and the sticky preview pane
crossfades to the hovered _or focused_ row, cycling a reel when idle.

## Target stack

```
Vite 5 · React 18 · JS + JSDoc (no TypeScript)
react-router-dom 6.4 data router
Tailwind      → layout & spacing utilities only
CSS Modules   → type, motion, canvas work
gsap 3 + ScrollTrigger + SplitText
@studio-freight/lenis
@sanity/client + GROQ          (primary content)
Contentful                     (press feed, optional)
MDX + local JSON               (journal, static copy)
fuse.js                        (client-side search)
vite-plugin-sitemap · deploy to Vercel or Netlify
```

GSAP plugins and Fuse are **lazy-imported** — they must not land in the initial bundle.

## Project structure

```
src/
  main.jsx              router + providers
  routes/               one file per route
  layouts/RootLayout.jsx
  components/           Nav · SearchOverlay · ArchiveTable · HoverMedia
                        Marquee · MediaScroller · PeopleGrid · Footer
  lib/                  sanity.js · queries.js · motion.js
  hooks/                useLenis · useReducedMotion · useHoverMedia · useFilterParams
  styles/               tokens.css · globals.css
content/
  journal/*.mdx
  site.json
```

## Shell & motion

`RootLayout` composition order:

```
Lenis provider → Nav → ScrollRestoration → Outlet → Footer → SearchOverlay (portal)
```

- **Lenis** — `lerp: 0.1`, `wheelMultiplier: 1`. Wire `lenis.on('scroll', ScrollTrigger.update)`
  and let `gsap.ticker` drive the RAF loop; don't run two loops.
- **Route change** — `lenis.scrollTo(0, { immediate: true })`, then `ScrollTrigger.refresh()`.
- **Page transition** — 320ms opacity/clip. No shared-layout transitions anywhere except the
  archive-row → project-hero handoff (FLIP).
- **`prefers-reduced-motion`** — kill the marquee, the hover video and every scrub; keep plain
  fades. This is a hard gate, not a nice-to-have. See [QA gates](#accessibility--qa-gates).

## Design tokens

```css
--bg: #0f0e0c; /* dark canvas */
--ink: #f2f0eb;
--mute: #8b8377;
--line: #2a2620;
--accent: #e0491b;
```

| Role    | Value                                              |
| ------- | -------------------------------------------------- |
| Display | `clamp(44px, 9.2vw, 168px)` / `0.9` / `-0.03em`    |
| H2      | `clamp(28px, 3.4vw, 56px)`                         |
| Body    | `16px / 1.45`                                      |
| Meta    | `11px` mono, uppercase, `0.07em`                   |
| Grid    | 12 columns · gutters 20 / 28 / 40 · max width 1680 |
| Radius  | 0–3px                                              |
| Focus   | 2px accent outline, offset 2                       |

Two web fonts total, both `woff2`, `font-display: swap`, and only the display face preloaded.
The wireframe itself renders in Space Grotesk + Space Mono; confirm the shipping typefaces
before licensing anything.

## Responsive rules

Mobile-first. Breakpoints: **sm 640 · md 834 · lg 1024 · xl 1440**.

- **Mobile 390** — one column, 20px gutters. The display clamp bottoms out at 44px.
- **Mobile menu** — full-screen, body scroll-locked, 48px minimum hit targets.
- **Mobile archive** — no cursor-follow preview; the thumbnail moves inline beside the row, and
  filters become a bottom sheet.
- **Below 1024** — the project-detail meta rail un-sticks and stacks under the title.
- Hover-media previews are disabled below 1024px entirely.

## Route contracts

### `/` — Home

- **File** `routes/Home.jsx` · loader `homeQuery()`
- **Parts** `Hero` · `Marquee` · `DisciplineStats` · `ArchiveTable(limit 8)` · `PeopleGrid` ·
  `ContactBlock` · `PressList(3)` · `FooterWordmark`
- **Data** `{ heroHeadline, heroSub, cutout: { url, alt }, marquee: string[],
disciplines: [{ label, count, slug }], featured: Project[8], people: Person[],
press: PressItem[3] }`
- **States** skeleton bars while the loader is pending · empty `featured` hides the archive
  section · video failure falls back to the poster
- **Motion** hero cutout `y: -12%` scrub · infinite-x marquee that flips direction with scroll
  velocity and pauses on hover · rows stagger in at 40ms · hovering a team name swaps that
  portrait into the hero cutout slot with no layout shift
- **SEO** title + OG from `siteSettings` · JSON-LD `Organization`

### `/work` — Work index

- **File** `routes/Work.jsx` · loader `allProjects()` · `useSearchParams`
- **Parts** `FilterBar` · `ViewToggle(list|grid)` · `ArchiveTable` · `HoverMedia` · `LoadMore`
- **Data** `Project: { _id, slug, title, client, year: number, disciplines: string[],
cover: { url, w, h, lqip }, hoverVideo?: { url, poster }, order: number, featured: boolean }`
- **The URL is the only filter state** — `?discipline=&year=&client=&sort=year|az&view=list`.
  Shareable, SSR-safe, restores scroll on back. No local filter state, ever.
- **States** 0 results → "no projects match" plus a clear-filters action · loading → 30 skeleton
  rows
- **Motion** hover: poster → video after 200ms, cursor-follow via `gsap.quickTo`; off below
  1024px and under reduced-motion
- **Paging** `IntersectionObserver` infinite scroll **plus** a real "Load 30 more" button, for
  keyboard users and for SEO

### `/work/:slug` — Project detail

- **File** `routes/Project.jsx` · loader `projectBySlug(params.slug)`, 404 on null
- **Parts** `ProjectHero` · `MetaRail` (sticky) · `PortableBody` · `MediaScroller` ·
  `CreditsList` · `NextProject`
- **Data** `ProjectFull: Project & { intro: PortableText,
blocks: [{ _type: 'image'|'video'|'duo'|'text'|'scroller', … }],
credits: [{ role, names: string[] }], awards: string[],
next: { slug, title }, prev: { slug, title } }`
- **States** unknown slug → 404 route · `blocks[]` renders through a switch map and ignores
  unknown `_type` silently
- **Motion** hero arrives as a shared element (FLIP) from the archive row · scroller takes drag
  and wheel-x · rail is `position: sticky; top: 72px` and releases before the credits block
- **Perf** LQIP blur-up · `loading="lazy"` below the fold · `preload="metadata"` on video, with
  playback gated by IntersectionObserver
- **Next/prev** derive from the _filtered_ order the visitor arrived with, not the global order

### `/about` — About / team

- **File** `routes/About.jsx` · loader `aboutQuery()`
- **Parts** `Manifesto` · `StudioScroller` · `PeopleGrid` · `PortraitSlot` · `ClientList`
- **Data** `Person: { _id, name, role, portrait: { url, lqip }, order }` ·
  `about: { headline, body: PortableText, studioImages: Img[], clients: string[] }`
- **States** missing portrait → initials tile · sorted by `order`, then name
- **Motion** portrait crossfades over 120ms into a fixed **180×240** slot — the list must never
  reflow

### `/services` — Capabilities

- **File** `routes/Services.jsx` · content from `content/services.json`, no CMS
- **Parts** `StickyIndex` · `ServiceAccordion` · `RelatedProjects`
- **Data** `Service: { id, n: '01', title, body, images: Img[2], relatedSlugs: string[] }`
- **States** first panel open by default · `/services#identity` opens and scrolls to that panel
- **Motion** ScrollTrigger sets the active index · accordion height animated by GSAP, **not**
  CSS `max-height` · anchor clicks scroll through Lenis
- Every panel links out to 2–3 filtered archive rows — no orphan content

### `/press` — Press & awards

- **File** `routes/Press.jsx` · loader `pressQuery()`, grouped by year descending
- **Parts** `TypeToggle(press|awards)` · `YearGroup` · `PressRow`
- **Data** `PressItem: { _id, date: ISO, publication, title, url, type: 'press'|'award',
linkedProject?: { slug, title } }`
- **States** external links get `rel="noopener noreferrer" target="_blank"` · empty year groups
  are never rendered
- **Motion** hover underline wipe only — no scroll animation on this route

### `/journal`, `/journal/:slug` — Writing

- **File** `routes/Journal.jsx` + `routes/JournalPost.jsx` · MDX via `import.meta.glob`
- **Parts** `PostList` · `PostHeader` · `MDXProvider(Figure, Pullquote, ProjectLink)` · `ShareRow`
- **Frontmatter** `{ title, date: ISO, category, excerpt, cover?, author,
readingMinutes: number, draft: boolean }`
- **States** `draft: true` hidden in production · unknown slug → 404 · measure 62–68ch
- **SEO** JSON-LD `Article` · `og:image` falls back to the cover, then the site default

### `/contact` — Contact

- **File** `routes/Contact.jsx` · content from `content/site.json`
- **Parts** `ContactIntro` · `EmailList` · `OfficeList` · `SocialRow` · `InquiryForm` (flagged)
- **Data** `contact: { intro, emails: [{ label, address }], offices: [{ city, address, tz }],
socials: [{ label, url }] }`
- **Ship mailto-first.** The form sits behind `VITE_ENABLE_FORM` as phase 2: honeypot plus one
  request per 30s, no captcha, `aria-live` on the result, states
  `idle → submitting → success | error`

### `SearchOverlay` — global, portal-rendered

- **File** `components/SearchOverlay.jsx` · `useSearch()` · opens on ⌘K / Ctrl-K / nav click
- **Parts** `Input` · `ResultGroup(projects|journal|press)` · `SuggestedTags`
- **Index** `search.json`, built at build time, under 80kb:
  `[{ type, title, slug, client, year, disciplines, excerpt }]` — Fuse keys `title^3`,
  `client^2`, `disciplines`, `excerpt`
- **States** empty query → recent + suggested · 0 results → nearest-match tags · 120ms debounce
- **URL** mirrors `?q=`
- **A11y** `role="dialog"` + `aria-modal` · focus trap · ESC closes · ↑↓ roving tabindex · body
  scroll lock

### `*` — 404 / error boundary

- **File** `routes/NotFound.jsx` — also the `RootLayout` `errorElement`
- **Parts** `BigType` · `SuggestedProjects(3 random featured)` · `QuickLinks`
- **States** `useRouteError()` switches between 404 copy and "something broke" + retry · logs to
  Sentry in production
- **The host must return a real 404 status**, not a 200 SPA shell

## Content model (Sanity)

```
project       title slug client year disciplines[] cover hoverVideo
              intro blocks[] credits[] awards[] featured order seo
person        name role portrait order
pressItem     date publication title url type linkedProject→project
service       n title body images[] related[]→project
siteSettings  emails[] offices[] socials[] defaultSeo marquee[] heroCutout
```

Preview runs at `/preview` through the Sanity presentation tool; the draft perspective is gated
behind a token.

## Performance budget

| Metric     | Budget          |
| ---------- | --------------- |
| LCP (4G)   | < 2.0s          |
| CLS        | < 0.05          |
| TBT        | < 200ms         |
| Initial JS | ≤ 180kb gzipped |

- **Images** — Sanity CDN, `?w=` srcset at 640 / 1024 / 1600 / 2400, `format=webp`, LQIP blur-up.
- **Video** — h264 + webm, hover loops ≤ 2.5MB, `muted playsinline`, IntersectionObserver-gated.
- **Fonts** — 2 × woff2, `font-display: swap`, preload the display face only.
- **JS** — route-level code splitting via `React.lazy`; GSAP plugins and Fuse lazy-imported.

## Accessibility & QA gates

- Every archive row is a real `<a>`; the whole row is the hit area, 44px minimum.
- Visible focus ring everywhere; tab order follows the DOM.
- Contrast ≥ 4.5:1 on ink/bg. The mute colour is only allowed at ≥ 11px bold.
- `prefers-reduced-motion` honoured on the marquee, every scrub, hover video, and page
  transitions.
- Test matrix: **Safari 17** (Lenis quirks), **iOS low-power** (autoplay disabled), **Firefox**.
- **Handoff gate:** Lighthouse ≥ 95 performance _and_ accessibility on `/`, `/work` and
  `/work/:slug`.

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
```

> Fix the `path` import in `vite.config.js` first — see [Known gaps](#current-state) — or the
> dev server will not boot.

| Script            | Does                                                            |
| ----------------- | --------------------------------------------------------------- |
| `npm run dev`     | Vite dev server with HMR                                        |
| `npm run build`   | Production build to `dist/`                                     |
| `npm run preview` | Serve the built output                                          |
| `npm run lint`    | Oxlint — `react/rules-of-hooks`, `react/only-export-components` |

Import alias: `@/` → `src/`, declared in both `vite.config.js` and `jsconfig.json`.

Environment variables, as they come online:

```
VITE_SANITY_PROJECT_ID=
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=
VITE_ENABLE_FORM=false
```

## Build order

Four suggested sprints, from handoff sheet section 08:

- [ ] **S1 — shell.** Router, `RootLayout`, Lenis, tokens, `Nav`, `Footer`, 404, Sanity client
      and the `project` schema.
- [ ] **S2 — archive.** `/work` table, filters in the URL, hover media, the `/work/:slug` block
      renderer, next/prev.
- [ ] **S3 — the rest.** Home sections (once a direction is chosen), about, services, press,
      journal MDX, `search.json` + overlay.
- [ ] **S4 — polish.** GSAP scrub passes, page transitions, perf budget, a11y sweep, CMS
      preview, sitemap.

## Open decisions

1. **Which home direction** — `1a`, `1b` or `1c`. Blocks S3 and the media budget.
2. **Clients section on `/about`** — logo wall or plain set list. Marked "decide w/ client" in
   the wireframe.
3. **Press source** — Sanity `pressItem`, or the optional Contentful feed.
4. **Inquiry form** — whether phase 2 happens at all, or mailto ships permanently.
5. **Typefaces** — Space Grotesk + Space Mono are stand-ins in the wireframe.
6. **Real content** — every name, client and project in the wireframe is placeholder
   ("Special Offer, Inc.", "Client A", "Hyperbloom"). The archive is specced for ~95 projects;
   confirm the real count, since it drives the virtualised-list decision in `1c`.
