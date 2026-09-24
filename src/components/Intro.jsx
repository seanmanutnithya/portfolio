import { useCallback, useEffect, useRef, useState } from "react";

import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { useScrollLock } from "@/hooks/useScrollLock";
import { trackLoadProgress } from "@/lib/loadProgress";
import { prefersReducedMotion } from "@/lib/motion";

import styles from "./Intro.module.css";

/** Frames in the feed. The last is where it lands; the others loop while loading. */
const FRAME_COUNT = 5;
const FINAL = FRAME_COUNT - 1;
const LOOP = FRAME_COUNT - 1;

/**
 * Shortest loading phase. A fast or cached load still counts up over this
 * long, so the wordmark lands and the feed flicks a few times.
 */
const MIN_MS = 1100;

/** Longest loading phase. Past this the page is revealed as it is, still loading. */
const MAX_MS = 6000;

/** One flick of the feed while loading. */
const FLICK_MS = 380;

/** The landing flick onto the final frame — matches the `.frame` transition. */
const LAND_MS = 340;

/** Counter smoothing: how quickly it catches up with the real figure. */
const EASE_MS = 140;

/** While a big file stalls, the counter creeps (4/s), at most this far ahead of reality. */
const CREEP_PER_MS = 0.004;
const CREEP_AHEAD = 8;

/** Upper bound in case `animationend` never arrives (hidden tab, etc.). */
const SAFETY_MS = MAX_MS + 4000;

/**
 * The feed that swipes past inside the phone. Reversed so the final frame is
 * the first featured campaign — on the home page that is the showcase slide
 * the intro dissolves into.
 */
const featured = projects.filter((p) => p.featured && p.cover?.src);
const frames = Array.from(
  { length: FRAME_COUNT },
  (_, i) => featured[(FRAME_COUNT - 1 - i) % featured.length]?.cover,
).filter(Boolean);

/**
 * How this document was loaded: "navigate", "reload", "back_forward" or
 * "prerender" (Navigation Timing Level 2).
 */
function navigationType() {
  const [entry] = performance.getEntriesByType?.("navigation") ?? [];
  if (entry?.type) return entry.type;

  // Older browsers: the deprecated Level 1 API (1 = reload, 2 = back/forward).
  const legacy = performance.navigation?.type;
  if (legacy === 1) return "reload";
  if (legacy === 2) return "back_forward";
  return "navigate";
}

/**
 * Plays every time the site is *opened* — a typed URL, a bookmark, a link
 * from somewhere else, a new tab — on whichever page that is.
 *
 * A refresh replays it only on the home page (`/`), the front door. A
 * refresh anywhere else doesn't: the visitor is mid-browse, not arriving.
 * Coming back with the browser's back/forward buttons never plays it, and
 * neither does moving between pages inside the site, since the layout never
 * remounts.
 *
 * Never under reduced motion, and never with Data Saver on — a decorative
 * loader is exactly what that visitor asked to be spared. `?intro` in the
 * URL forces it, refresh or not — handy while tweaking the animation or
 * showing it to a client.
 */
function shouldPlay() {
  if (typeof window === "undefined" || prefersReducedMotion() || frames.length === 0) {
    return false;
  }
  if (new URLSearchParams(window.location.search).has("intro")) return true;
  if (navigator.connection?.saveData) return false;

  const type = navigationType();
  if (type === "navigate" || type === "prerender") return true;
  return type === "reload" && window.location.pathname === "/";
}

/**
 * Where the phone should land. If the page has a `[data-intro-target]` on
 * screen (the first showcase slide on the home page), its rectangle is
 * written as custom properties the `expand` keyframes read. Otherwise
 * nothing is set and the phone grows to a full-height 9:16 column.
 */
function measureHandoff(root) {
  const target = document.querySelector("[data-intro-target]");
  if (!root || !target) return;

  const rect = target.getBoundingClientRect();
  const { innerWidth: vw, innerHeight: vh } = window;
  if (rect.width === 0 || rect.bottom <= 0 || rect.top >= vh) return;

  root.style.setProperty("--to-w", `${rect.width}px`);
  root.style.setProperty("--to-h", `${rect.height}px`);
  root.style.setProperty("--to-x", `${rect.left + rect.width / 2 - vw / 2}px`);
  root.style.setProperty("--to-y", `${rect.top + rect.height / 2 - vh / 2}px`);
  root.style.setProperty("--to-r", getComputedStyle(target).borderRadius);
  root.dataset.target = "true";
}

/**
 * Site-open intro and loader — see `shouldPlay()` for exactly when it runs.
 *
 * Three phases:
 *
 * 1. **loading** — a phone-shaped frame flicks through the featured
 *    campaigns like a feed while the wordmark rises in. The counter and the
 *    scrubber along the phone's bottom edge show *real* load progress (see
 *    lib/loadProgress.js), so the phase lasts as long as the visitor's
 *    connection needs: at least MIN_MS, at most MAX_MS.
 * 2. **landing** — at 100 the feed flicks onto its final frame.
 * 3. **out** — the phone expands and the overlay dissolves into the page.
 *    On the home page it morphs onto the first showcase slide (same poster,
 *    same spot), so the handoff is seamless.
 *
 * - The page renders and loads underneath the whole time — the intro covers
 *   it, it never delays it.
 * - Any click, key, wheel or touch skips it.
 * - Decorative, so `aria-hidden`; screen readers go straight to the page.
 */
export function Intro() {
  const [visible, setVisible] = useState(shouldPlay);
  const [phase, setPhase] = useState("loading");
  const [feed, setFeed] = useState({ current: 0, prev: -1 });
  const [leaving, setLeaving] = useState(false);
  const rootRef = useRef(null);
  const counterRef = useRef(null);
  const scrubberRef = useRef(null);
  // Which feed frames have arrived — on a slow connection the feed only
  // flicks between these, rather than into empty frames.
  const loadedRef = useRef(new Set());

  useScrollLock(visible);

  const finish = useCallback(() => setVisible(false), []);
  const skip = useCallback(() => setLeaving(true), []);

  /**
   * Loading. Real progress drives the counter and the scrubber, written
   * straight to the DOM every frame so nothing re-renders.
   */
  useEffect(() => {
    if (!visible || phase !== "loading") return undefined;

    const root = rootRef.current;
    const start = performance.now();
    let last = start;
    let real = 0; // 0–100, measured
    let shown = 0; // 0–100, on screen
    let untrack = () => {};

    // One frame in, so the page's own effects (the showcase starting its
    // video) have run before we look at what is loading.
    const scan = requestAnimationFrame(() => {
      untrack = trackLoadProgress({
        images: root ? root.querySelectorAll("img") : [],
        scope: document.getElementById("main"),
        onProgress: (fraction) => {
          real = fraction * 100;
        },
      });
    });

    let frame = requestAnimationFrame(function tick(now) {
      const dt = Math.min(now - last, 100);
      last = now;
      const elapsed = now - start;

      // The real figure, but paced so a fast load still counts up over
      // MIN_MS instead of snapping to 100 — and forced to 100 at MAX_MS.
      const pace = 100 * (1 - (1 - Math.min(elapsed / MIN_MS, 1)) ** 2);
      const goal = elapsed >= MAX_MS ? 100 : Math.min(real, pace);

      let next = shown + Math.max(0, goal - shown) * (1 - Math.exp(-dt / EASE_MS));
      if (goal < 100) {
        // Stalled on a big file: creep a little past reality so it reads as
        // alive — never as far as 100.
        next = Math.max(next, Math.min(shown + dt * CREEP_PER_MS, goal + CREEP_AHEAD, 99));
        next = Math.min(next, 99);
      } else if (next > 99.5) {
        next = 100;
      }
      shown = next;

      if (counterRef.current) {
        counterRef.current.textContent = String(Math.floor(shown)).padStart(3, "0");
      }
      if (scrubberRef.current) {
        scrubberRef.current.style.transform = `scaleX(${shown / 100})`;
      }

      if (shown >= 100) {
        // Land on the final frame — unless it never arrived (a very slow
        // connection hitting MAX_MS), in which case on any frame that did.
        setFeed((feed) => {
          const loaded = loadedRef.current;
          const land = loaded.has(FINAL)
            ? FINAL
            : loaded.has(feed.current)
              ? feed.current
              : [...loaded][0];
          return land === undefined || land === feed.current
            ? feed
            : { prev: feed.current, current: land };
        });
        setPhase("landing");
        return;
      }
      frame = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(scan);
      cancelAnimationFrame(frame);
      untrack();
    };
  }, [visible, phase]);

  // The feed flicks for as long as loading takes — to the next frame that
  // has actually loaded. If none has yet, it holds where it is.
  useEffect(() => {
    if (!visible || phase !== "loading") return undefined;
    const timer = setInterval(() => {
      setFeed((feed) => {
        for (let step = 1; step < LOOP; step += 1) {
          const next = (feed.current + step) % LOOP;
          if (loadedRef.current.has(next)) return { prev: feed.current, current: next };
        }
        return feed;
      });
    }, FLICK_MS);
    return () => clearInterval(timer);
  }, [visible, phase]);

  // Landing: once the final frame is in place, measure the handoff and go.
  useEffect(() => {
    if (phase !== "landing") return undefined;
    const timer = setTimeout(() => {
      measureHandoff(rootRef.current);
      setPhase("out");
    }, LAND_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  // Any input skips. Listeners are passive — nothing here blocks scrolling.
  useEffect(() => {
    if (!visible) return undefined;

    const events = ["pointerdown", "keydown", "wheel", "touchstart"];
    events.forEach((name) => window.addEventListener(name, skip, { passive: true }));
    const safety = setTimeout(finish, SAFETY_MS);

    return () => {
      events.forEach((name) => window.removeEventListener(name, skip));
      clearTimeout(safety);
    };
  }, [visible, skip, finish]);

  const onAnimationEnd = useCallback(
    (event) => {
      // Children's animations bubble up here too, and the overlay runs more
      // than one; only its fade-out ends the intro. (CSS Modules prefix the
      // keyframe names, hence the substring match.)
      if (event.target !== event.currentTarget) return;
      if (/intro-(out|skip)/.test(event.animationName)) finish();
    },
    [finish],
  );

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className={styles.intro}
      data-phase={phase}
      data-leaving={leaving ? "true" : "false"}
      aria-hidden="true"
      onAnimationEnd={onAnimationEnd}
    >
      <span className={`${styles.handle} u-meta`}>{site.handle}</span>
      <span className={`${styles.role} u-meta`}>{site.role}</span>

      <p className={styles.wordmark}>
        {[...site.wordmark].map((char, i) => (
          <span key={`${char}-${i}`} className={styles.char} style={{ "--i": i }}>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </p>

      <span className={styles.counter} ref={counterRef}>
        000
      </span>
      <span className={`${styles.hint} u-meta`}>Tap or press any key to skip</span>

      <div className={styles.phone}>
        {frames.map((media, i) => (
          <img
            key={`${media.id}-${i}`}
            className={styles.frame}
            data-pos={i === feed.current ? "current" : i === feed.prev ? "prev" : "idle"}
            src={media.src}
            alt=""
            decoding="async"
            // The opening and landing frames are what the visitor sees
            // first and last — fetch those ahead of the rest.
            fetchPriority={i === 0 || i === FINAL ? "high" : "auto"}
            onLoad={() => loadedRef.current.add(i)}
            draggable={false}
          />
        ))}
        <span className={styles.scrubber} ref={scrubberRef} />
      </div>
    </div>
  );
}

export default Intro;
