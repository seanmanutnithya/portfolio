# Demo

`Link : https://juno-reyes.sean-manutnithya-cs.workers.dev/`

# Creator Portfolio

A dark-canvas portfolio and media kit for a **TikTok creator**: a full-screen vertical-video
showcase, a filterable archive of brand campaigns with performance stats (views, saves,
GMV…), audience by age, an offering page, a global ⌘K search overlay and editorial content.

Built from `Portfolio Showcase Wireframes.dc.html` (direction **1a**, the archive-first home),
with **specialoffer.inc** as the reference for structure and tone.

> **Re-targeting.** The build started as a nine-person design studio and was re-pointed at a
> solo TikTok creator. The architecture did not change — only the content files and the labels. If the
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

| Route                        | Wireframe       | What it does                                                                                                                                                                                                                  |
| ---------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                          | `1a` + showcase | **Full-screen looping showcase** (see below) · hero with parallaxing portrait · marquee · **audience by age** · 8-row campaigns band · offering list (hover swaps a sample into the hero) · contact · press · footer wordmark |
| `/work`                      | `1d`            | Campaign-type chips, format select, A–Z/year sort, list/grid toggle — all in the URL. Cursor-follow hover preview. Infinite scroll **plus** a real Load-more button. Empty state with clear-filters.                          |
| `/work/:slug`                | `1e`            | The post playing in a 9:16 frame, sticky meta rail (brand / campaign / format / scope), **performance stats**, block-rendered body, next/prev that walks the _filtered_ order you arrived with                                |
| `/about`                     | `1f`            | Bio, headline numbers, draggable behind-the-scenes scroller, offering list with a fixed 180×240 sample slot, brand list                                                                                                       |
| `/services`                  | `1g`            | "Work with me" — sticky index + accordion with GSAP-animated heights; `/services#ugc` opens and scrolls to that panel; every panel links to real campaigns                                                                    |
| `/press`                     | `1h`            | Press/recognition toggle, grouped by year, external rows with `rel="noopener noreferrer"`, optional linked-campaign chips                                                                                                     |
| `/journal`, `/journal/:slug` | `1i`            | Index + article at a 62–68ch measure, `draft: true` hidden in production                                                                                                                                                      |
| `/contact`                   | `1j`            | Mailto-first. Inquiry form is behind `VITE_ENABLE_FORM`, off by default.                                                                                                                                                      |
| ⌘K overlay                   | `1k`            | Fuse.js over a generated index, `?q=` mirrored to the URL, ↑↓ + Enter, focus trap, scroll lock                                                                                                                                |
| `*`                          | `1l`            | Doubles as the root `errorElement`; distinguishes a 404 from a crashed loader                                                                                                                                                 |

### The home showcase

The first thing on the home page is a full-screen reel of the featured campaigns. The video is
vertical: on a phone it fills the screen, and on anything wider it sits in a phone-shaped frame
over a blurred copy of its own poster.

- **Advance it** by touch swipe, mouse drag, `←` / `→`, or the on-screen buttons.
- **It loops.** Past the last slide it returns to the first; backwards from the first it jumps
  to the last. The buttons are never disabled.
- **Click a slide** to open that project's case study.
- **Every slide plays its video.** Only the slide on screen plays, and nothing downloads until
  it does (`preload="none"` + play on activation).
- **Vertical scrolling is left alone.** A wheel or a vertical swipe carries you down to the
  rest of the page rather than being captured by the reel.

`/work` is untouched by this — it remains the list/grid archive, and `?view=grid` is the same
grid it always was.

### The intro

An intro plays whenever the site is opened, over whichever page the visitor lands on
([src/components/Intro.jsx](src/components/Intro.jsx)). It doubles as the loader, so how long
it lasts depends on the visitor's connection:

1. **Loading.** A phone frame flicks through five featured posters like a feed, and the
   wordmark rises in. The counter and the bar along the phone's bottom edge show **real load
   progress** for the first screen (see below). This phase lasts at least 1.1 s and at most
   6 s.
2. **Landing.** At 100 the feed flicks onto its final frame.
3. **Out.** The phone expands:
   - **On the home page** it morphs into the exact position of the first showcase slide. That
     slide shows the same poster, so the intro dissolves into the page without a cut.
   - **Anywhere else** it grows to a full-height 9:16 column and fades out.

Measured in headless Chrome with the cache disabled, on the home page at desktop size:

| Connection  | Blank before the intro (JS download) | Intro on screen                                                  |
| ----------- | ------------------------------------ | ---------------------------------------------------------------- |
| No throttle | 0.6 s                                | 2.7 s — counts up over the 1.1 s minimum                         |
| Fast 3G     | 0.9 s                                | 6.0 s — follows real progress; everything loaded when it lets go |
| Slow 3G     | 3.2 s                                | 8.4 s — hits the 6 s cap, then races to 100                      |

**What counts as loaded**, in [src/lib/loadProgress.js](src/lib/loadProgress.js): the intro's
own frames, every image on screen in `<main>`, every on-screen video that will actually load
(playing, autoplay, or preloading), web fonts, and the window `load` event. Off-screen and lazy
media are ignored. A video counts double and reports partial progress through its readyState,
so the heaviest file doesn't sit at 0 until it's suddenly done.

**How the counter behaves.** It eases toward the real figure and never goes backwards. On a
fast or cached load it's paced to count up over the 1.1 s minimum instead of snapping to 100.
While a large file stalls, it creeps up to 8 points past reality, so it reads as alive, but
never reaches 100 until loading is done or the 6 s cap is hit.

**On a slow connection:**

- The feed only flicks to frames that have actually downloaded, and holds otherwise.
- The first and final frames are fetched at high priority.
- A skeleton shimmer shows inside the phone until a frame arrives.
- It lands on the final frame only if that frame loaded.

**When it plays:**

- **Every time the site is opened**: a typed URL, a bookmark, a link from another site, a new
  tab.
- **A refresh replays it only on the home page** (`/`). A refresh on any other page doesn't,
  since the visitor is mid-browse rather than arriving.
- **Not when the visitor comes back** with the browser's back/forward buttons, or moves between
  pages inside the site. The check uses the browser's Navigation Timing API
  (`performance.getEntriesByType("navigation")`), so nothing is stored.
- **Never under `prefers-reduced-motion`, or with Data Saver on.** It isn't rendered at all.
- **`?intro` forces it**, even on a refresh, which is handy while tweaking the animation or
  showing it to a client.

**Also:**

- **Skippable.** Any click, key, wheel or touch fades it out in 0.3 s.
- **Doesn't delay the page.** The page renders and loads underneath the whole time. The intro
  starts on first paint without waiting for the GSAP chunk, and adds about 2 kB gzipped to the
  entry bundle.
- **Decorative.** It's `aria-hidden`, so screen readers go straight to the page.

The phases and their CSS timings are documented at the top of
[src/components/Intro.module.css](src/components/Intro.module.css). The limits (`MIN_MS`,
`MAX_MS`) and the feed speed are constants at the top of `Intro.jsx`.

**Placeholder content.** The creator is called "Juno Reyes", and every campaign, brand,
publication and number is invented. The brands are fictional on purpose: a real brand next to
made-up stats claims a partnership that never happened. Emails use `example.com` and social
links point at platform home pages, so no placeholder sends a visitor to a stranger.

**Sample media.** Fourteen vertical clips (360p, 0.6–1.5 MB) and their 720×1280 poster frames
from [Mixkit](https://mixkit.co/free-stock-video/discover/vertical/) are downloaded into
[public/media/](public/media/), not hotlinked. Mixkit's licence allows commercial use without
attribution. Helpers in [src/content/media.js](src/content/media.js) turn a file stem into a
media object: `poster(name, alt)`, `clip(name)`, `hoverClip(name)`. Any media object left
without a `src` falls back to a procedural plate (six variants, hashed from the media id).

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

| File          | Holds                                                                                                     |
| ------------- | --------------------------------------------------------------------------------------------------------- |
| `site.js`     | Name, handle, headline, bio, **audience by age**, headline stats, emails, socials, brand list, taxonomies |
| `projects.js` | The campaign archive — the only file that needs real work                                                 |
| `skills.js`   | What the creator offers a brand (formats, turnaround)                                                     |
| `press.js`    | Press and recognition                                                                                     |
| `services.js` | The five "work with me" panels                                                                            |
| `journal.js`  | Posts, as block arrays                                                                                    |
| `media.js`    | `poster()` / `clip()` / `hoverClip()` helpers over `public/media/`                                        |

**Two taxonomies drive the filters**, both in `site.js`:

- `sectors` — campaign types (Sponsored post, Branded series, TikTok Shop, Spark Ads / UGC,
  LIVE). The chips on `/work`.
- `disciplines` — formats (GRWM, tutorial, review, trend & dance, fit check, haul…). The
  `Format` column and the dropdown.

Swap those two arrays and the whole archive re-categorises. For a graphic designer they would
be client type and design discipline; for a photographer, genre and deliverable.

### 3. Real videos

Every project has a `cover` (poster), a `video` (the post) and a `hoverVideo` (the `/work`
preview), all built from one file stem:

```js
cover: poster("glow-skincare", "Applying face cream in a towel robe"),
video: clip("glow-skincare"),
hoverVideo: hoverClip("glow-skincare"),
tiktokUrl: "https://www.tiktok.com/@handle/video/7xxxxxxxxxxxxxxxxxx",
```

To use the creator's real work, export each TikTok **without the watermark** (from drafts or
the original camera file), encode it to about 720p H.264 with no audio and under 2.5 MB, and
save it as `public/media/<name>.mp4`. Grab a frame as `<name>.jpg` for the poster. Setting
`tiktokUrl` adds a "Watch on TikTok" link to the case study.

To embed the live post instead, add a `tiktok` block to the body. It renders TikTok's official
embed player:

```js
{ _type: "tiktok", videoId: "7xxxxxxxxxxxxxxxxxx", caption: "The launch post" }
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
              video tiktokUrl intro stats[] blocks[] credits[] featured order seo
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
  components/           Nav · Footer · SearchOverlay · Intro · ProjectSlides · ArchiveTable
                        HoverMedia · Marquee · MediaScroller · RosterList · StatBars
                        Media · Blocks · Reveal · Skeleton · Seo
  hooks/                useLenis · useReducedMotion · useHoverMedia · useFilterParams
                        useScrollLock · useSearch
  lib/                  content.js (the query layer) · motion.js · loadProgress.js
                        format.js · jsonld.js
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

1. **Real content.** The creator ("Juno Reyes"), every campaign, brand, audience number and
   press item is invented. Replace `src/content/` wholesale, and swap `public/media/` for the
   creator's own exports.
2. **Your palette.** See the note above; the pin was unreadable.
3. **Lighthouse pass.** Worth doing once real media is in.
4. **The `1b` / `1c` home directions** were not built; `1a` matches the reference.
5. **Shared-element hero transition** (archive row → project hero, FLIP). The route transition
   is the 320ms fade; the FLIP handoff is not wired.
6. **The `tiktok` embed block is untested against a live post.** Every placeholder has
   `tiktokUrl: null` and no `tiktok` block, since there are no real video ids to point at.
7. **No tests.** Verified by driving a headless browser, not by a committed suite.
