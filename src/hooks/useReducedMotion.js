import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const read = (query) => {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(query).matches;
};

/**
 * Live-updating reduced-motion preference. Components read this to decide
 * whether to render a motion-dependent affordance at all (hover video,
 * marquee), rather than rendering it and then disabling it.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(QUERY).matches;
  });

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia(QUERY);
    const onChange = (event) => setReduced(event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/**
 * Matches an arbitrary media query. Used for the >=1024px gate on hover
 * previews — a pointer check alone lets hybrid laptops through.
 */
export function useMediaQuery(query) {
  const [state, setState] = useState(() => ({ query, matches: read(query) }));

  // Adjusting state during render when the query prop changes — cheaper and
  // flash-free compared with resyncing from an effect after the fact.
  if (state.query !== query) {
    setState({ query, matches: read(query) });
  }

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia(query);
    const onChange = (event) => setState({ query, matches: event.matches });
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return state.matches;
}

/** True only where a cursor-follow preview makes sense. */
export function useCanHoverPreview() {
  const reduced = useReducedMotion();
  const wide = useMediaQuery("(min-width: 64rem)");
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  return wide && fine && !reduced;
}
