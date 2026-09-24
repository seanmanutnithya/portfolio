import { useEffect, useMemo, useRef, useState } from "react";

const DEBOUNCE_MS = 120;

const FUSE_OPTIONS = {
  includeMatches: true,
  threshold: 0.34,
  ignoreLocation: true,
  minMatchCharLength: 2,
  keys: [
    { name: "title", weight: 3 },
    { name: "client", weight: 2 },
    { name: "disciplines", weight: 1.5 },
    { name: "excerpt", weight: 1 },
  ],
};

/**
 * Client-side search over the prebuilt index.
 *
 * Fuse and the index are both dynamically imported the first time the
 * overlay opens, so neither is in the entry chunk. Until they resolve the
 * overlay is still usable — it shows the suggested tags.
 */
export function useSearch(query, active) {
  const [fuse, setFuse] = useState(null);
  const [debounced, setDebounced] = useState(query);
  const timerRef = useRef(null);

  // Load the engine + index on first open, once.
  useEffect(() => {
    if (!active || fuse) return undefined;

    let cancelled = false;
    Promise.all([import("fuse.js"), import("@/lib/content")]).then(([fuseMod, content]) => {
      if (cancelled) return;
      const Fuse = fuseMod.default;
      setFuse(new Fuse(content.buildSearchIndex(), FUSE_OPTIONS));
    });

    return () => {
      cancelled = true;
    };
  }, [active, fuse]);

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebounced(query), DEBOUNCE_MS);
    return () => clearTimeout(timerRef.current);
  }, [query]);

  const results = useMemo(() => {
    const term = debounced.trim();
    if (!fuse || term.length < 2) return [];
    return fuse.search(term, { limit: 12 }).map((hit) => hit.item);
  }, [fuse, debounced]);

  /** Grouped in a fixed order so the list does not reshuffle as you type. */
  const groups = useMemo(() => {
    const order = ["project", "journal", "press"];
    return order
      .map((type) => ({ type, items: results.filter((item) => item.type === type) }))
      .filter((group) => group.items.length > 0);
  }, [results]);

  /** Flat list backing ↑↓ navigation across group boundaries. */
  const flat = useMemo(() => groups.flatMap((group) => group.items), [groups]);

  return { groups, flat, ready: Boolean(fuse), term: debounced.trim() };
}

/**
 * Splits `text` around the first case-insensitive occurrence of `term` so the
 * match can be marked. Returns `[before, match, after]`.
 */
export function highlight(text, term) {
  if (!term) return [text, "", ""];
  const index = text.toLowerCase().indexOf(term.toLowerCase());
  if (index === -1) return [text, "", ""];
  return [
    text.slice(0, index),
    text.slice(index, index + term.length),
    text.slice(index + term.length),
  ];
}
