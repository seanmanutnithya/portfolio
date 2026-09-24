/**
 * What the creator offers a brand.
 *
 * Replaces the studio "team roster" of the original build — a personal
 * portfolio has no staff list, but the same row-plus-hover-media pattern is
 * a good way to show an offering without a wall of prose.
 *
 * Shape (`name` / `role` / `sample`) is what <RosterList> and <MediaSlot>
 * expect. Hovering a row loads its sample into the slot — on the home page,
 * straight into the hero.
 */

import { poster } from "@/content/media";

export const skills = [
  {
    _id: "offer-sponsored",
    name: "Sponsored TikTok",
    role: "15-60s - posted from my account - 2 revisions",
    sample: poster("glow-skincare", "Sponsored TikTok sample"),
    order: 1,
  },
  {
    _id: "offer-series",
    name: "Branded series",
    role: "3-10 parts - built to follow",
    sample: poster("ramen-camera", "Branded series sample"),
    order: 2,
  },
  {
    _id: "offer-shop",
    name: "TikTok Shop video",
    role: "Affiliate or flat fee + commission",
    sample: poster("neon-sign", "TikTok Shop video sample"),
    order: 3,
  },
  {
    _id: "offer-spark",
    name: "Spark Ads licensing",
    role: "Boost my post from your ad account",
    sample: poster("cat-chat", "Spark Ads sample"),
    order: 4,
  },
  {
    _id: "offer-ugc",
    name: "UGC package",
    role: "Unbranded, runs from your account",
    sample: poster("bridal-mirror", "UGC package sample"),
    order: 5,
  },
  {
    _id: "offer-trend",
    name: "Trend & sound launch",
    role: "Original sound + challenge",
    sample: poster("roller-retro", "Trend launch sample"),
    order: 6,
  },
  {
    _id: "offer-live",
    name: "Shoppable LIVE",
    role: "45-60 min - pinned products",
    sample: poster("mask-sheet", "Shoppable LIVE sample"),
    order: 7,
  },
  {
    // No sample on file - exercises the initials-tile fallback.
    _id: "offer-ambassador",
    name: "Ambassadorship",
    role: "6-12 month retainer",
    sample: null,
    order: 8,
  },
];
