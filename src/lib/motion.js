/**
 * Motion loader.
 *
 * GSAP and ScrollTrigger are dynamically imported so they stay out of the
 * entry chunk (perf budget: 180kb gz initial). Every caller must be prepared
 * for the import to resolve after paint — animations enhance a page that is
 * already correct without them.
 *
 * Nothing here animates when `prefers-reduced-motion: reduce` is set. That is
 * enforced at the call site *and* here, because it is a QA gate.
 */

export const DUR = {
  fast: 0.12,
  base: 0.32,
  slow: 0.6,
};

export const EASE = "power3.out";

/** Media query is re-read on every call — users can change it mid-session. */
export function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

let motionPromise = null;

/**
 * Resolves `{ gsap, ScrollTrigger }` with the plugin registered exactly once.
 * Returns `null` under reduced motion so callers can bail in one line.
 */
export function loadMotion() {
  if (prefersReducedMotion()) return Promise.resolve(null);

  if (!motionPromise) {
    motionPromise = Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([gsapMod, stMod]) => {
        const gsap = gsapMod.gsap ?? gsapMod.default;
        const ScrollTrigger = stMod.ScrollTrigger ?? stMod.default;
        gsap.registerPlugin(ScrollTrigger);
        return { gsap, ScrollTrigger };
      },
    );
  }

  return motionPromise;
}

/**
 * Refreshes ScrollTrigger without forcing the import — a no-op if the motion
 * layer was never loaded (reduced motion, or a route that never animated).
 */
export function refreshMotion() {
  if (!motionPromise) return;
  motionPromise.then((m) => m?.ScrollTrigger.refresh());
}

/**
 * Splits a string into word spans for stagger-in headlines.
 *
 * DEVIATION: the spec lists GSAP SplitText. This does the one thing we
 * actually need from it, without the plugin.
 */
export function splitWords(text) {
  return String(text).split(/(\s+)/).filter(Boolean);
}
