/**
 * siteSettings — mirrors the Sanity `siteSettings` document.
 *
 * This build is targeted at a **TikTok creator** who needs a portfolio and
 * media kit: brand campaigns, audience numbers, the formats they offer, and
 * a way for brands to get in touch.
 *
 * EVERY STRING HERE IS PLACEHOLDER. Swap in the real name, handle, audience
 * figures and bio — nothing else in the codebase hardcodes an identity.
 * Links point at platform home pages rather than a made-up handle, so a
 * placeholder never sends a visitor to a stranger's account.
 */

import { poster } from "@/content/media";

export const site = {
  name: "Juno Reyes",
  wordmark: "JUNO REYES",
  shortMark: "J.R.",
  handle: "@junoreyes",
  role: "TikTok Creator",

  heroHeadline: "Short videos people actually finish",

  heroSub:
    "Beauty, food and everyday-life creator on TikTok. I partner with a small number of brands each year and make every video myself — filmed, cut and posted from my own account, where the audience already trusts it.",

  /** Hero portrait. */
  heroCutout: poster("street-walk", "Juno Reyes walking towards the camera"),

  /** Marquee band. */
  marquee: [
    "GRWM",
    "Tutorials",
    "Reviews",
    "Trends",
    "Fit checks",
    "TikTok Shop",
    "LIVE",
    "Spark Ads",
  ],

  /** Profile link — shown in the footer and on /contact. */
  tiktokUrl: "https://www.tiktok.com/",

  /**
   * Audience by age — the split brands ask for first. From TikTok
   * Analytics → Viewers. `value` drives the bar widths; `display` is what
   * the visitor reads.
   */
  audience: [
    { label: "13–17", value: 6, display: "6%" },
    { label: "18–24", value: 44, display: "44%" },
    { label: "25–34", value: 33, display: "33%" },
    { label: "35–44", value: 12, display: "12%" },
    { label: "45+", value: 5, display: "5%" },
  ],

  /** Where the audience numbers come from, shown under the bars. */
  audienceNote: "TikTok Analytics · last 60 days · 71% women · top markets US, UK, CA",

  /** Headline numbers on /about and the home hero. First one leads. */
  facts: [
    { label: "Followers", value: "1.2M" },
    { label: "Likes", value: "48.6M" },
    { label: "Avg. views", value: "410K" },
    { label: "Engagement", value: "8.7%" },
  ],

  emails: [
    { label: "Brand partnerships", address: "partnerships@example.com" },
    { label: "Management", address: "talent@example.com" },
  ],

  offices: [
    { city: "Los Angeles", address: "Based in Los Angeles\nAvailable worldwide", tz: "PT" },
  ],

  socials: [
    { label: "TikTok", url: "https://www.tiktok.com/" },
    { label: "Instagram", url: "https://www.instagram.com/" },
    { label: "YouTube", url: "https://www.youtube.com/" },
  ],

  contactIntro:
    "I work with a handful of brands a year, and I only take on things I would post about anyway. Tell me what you are launching, the timing, the budget range and whether it needs TikTok Shop — I will be straight with you about whether it is a fit.",

  aboutHeadline: "I started posting to fill ten minutes, and never stopped",

  aboutBody: [
    "My first TikTok was a skincare routine filmed on a phone propped against a mug in 2021. People asked what the serum was, then brands started asking whether I would talk about theirs.",
    "I still make everything myself. I film it, cut it, write the hook and post it — which means what you see in a pitch is what actually goes out, and why I only take a few partnerships at a time.",
    "Most of it is short: get-ready-with-me, honest reviews, a trend if it fits. The rest is TikTok Shop videos and a weekly LIVE, where the numbers are sales rather than views.",
  ],

  /** Names on /about. Placeholder brands — list only real partners. */
  clients: [
    "Dewlab Skincare",
    "Nori Noodle Co.",
    "Glide Skates",
    "Lumen Apparel",
    "Petal Lab",
    "Whisker & Co.",
    "Solstice Swim",
    "Veil & Co.",
    "Forge Fitness",
    "Tidewater Resorts",
  ],

  defaultSeo: {
    title: "Juno Reyes — TikTok Creator",
    description:
      "Beauty, food and lifestyle creator on TikTok. 1.2M followers. Brand campaigns across sponsored posts, series, TikTok Shop, Spark Ads and LIVE.",
  },

  founded: 2021,
};

/**
 * Format taxonomy — the `Format` column, the filter dropdown and the tags on
 * each campaign. Edit this when the creator's content is different.
 */
export const disciplines = [
  { slug: "grwm", label: "GRWM" },
  { slug: "tutorial", label: "Tutorial" },
  { slug: "review", label: "Review" },
  { slug: "trend", label: "Trend & dance" },
  { slug: "fit-check", label: "Fit check" },
  { slug: "haul", label: "Haul" },
  { slug: "day-in-life", label: "Day in the life" },
  { slug: "skit", label: "Skit" },
  { slug: "travel", label: "Travel" },
];

/** Campaign-type taxonomy — the archive filter chips on /work. */
export const sectors = [
  { slug: "sponsored", label: "Sponsored post" },
  { slug: "series", label: "Branded series" },
  { slug: "shop", label: "TikTok Shop" },
  { slug: "spark", label: "Spark Ads / UGC" },
  { slug: "live", label: "LIVE" },
];
