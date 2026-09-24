/** Formatting helpers. Kept dumb and pure so components stay readable. */

/** 01, 02, … 95 — the № column. */
export const pad = (n) => String(n).padStart(2, "0");

/** 2025 → 25 for the compressed year column. */
export const shortYear = (year) => String(year).slice(-2);

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** 2025-05-14 → "May 2025" */
export function monthYear(iso) {
  const d = new Date(iso);
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** 2026-03-12 → "12 Mar 2026" */
export function longDate(iso) {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "Mira Osei" → "MO", for the portrait fallback tile. */
export function initials(name) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

/** Turns a slug into a display label when the taxonomy has no entry. */
export function labelFor(list, slug) {
  const hit = list.find((item) => item.slug === slug);
  if (hit) return hit.label;
  return slug ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "";
}

/**
 * Deterministic 0…n-1 bucket from a string. Used to pick a procedural plate
 * variant so the same media id always renders the same placeholder.
 */
export function hashIndex(str, buckets) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h % buckets;
}
