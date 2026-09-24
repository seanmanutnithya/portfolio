/**
 * service[] - local JSON, no CMS.
 *
 * For a creator portfolio these are the ways a brand can work with them.
 * `relatedSlugs` must resolve to real campaigns, so no panel is a dead end.
 */

import { poster } from "@/content/media";

export const services = [
  {
    id: "sponsored",
    n: "01",
    title: "Sponsored TikToks",
    body: "Written, filmed, cut and posted by me, from my own account, because that is what the audience responds to. Two rounds of feedback are included; a third usually means we disagreed about the brief rather than the edit.",
    images: [
      poster("glow-skincare", "Sponsored TikTok still"),
      poster("cat-chat", "Sponsored TikTok still"),
    ],
    relatedSlugs: ["glow-up-mornings", "roll-call", "the-intern"],
  },
  {
    id: "series",
    n: "02",
    title: "Branded series",
    body: "Three to ten episodes with a reason to come back for the next one. Series are slower to start and far better at building follows - judge them on the last week, not the first.",
    images: [
      poster("ramen-camera", "Series still"),
      poster("gym-squats", "Series still"),
    ],
    relatedSlugs: ["slurp-test", "5am-club"],
  },
  {
    id: "shop",
    n: "03",
    title: "TikTok Shop",
    body: "Shop videos and shoppable LIVEs with your products tagged, paid as affiliate commission, a flat fee, or both. Here the number that matters is GMV, and I will report it.",
    images: [
      poster("neon-sign", "TikTok Shop still"),
      poster("pool-sunglasses", "TikTok Shop still"),
    ],
    relatedSlugs: ["after-dark", "pool-day-haul", "mask-monday"],
  },
  {
    id: "ugc",
    n: "04",
    title: "Spark Ads & UGC",
    body: "Either license one of my posts to run as a Spark Ad from your account, or have me shoot unbranded content that never goes out on mine. Several hooks per asset, so your ad account can test instead of guess. Fastest turnaround of anything I do.",
    images: [
      poster("bridal-mirror", "UGC still"),
      poster("beach-walk", "UGC still"),
    ],
    relatedSlugs: ["the-fitting", "beach-reset"],
  },
  {
    id: "ambassador",
    n: "05",
    title: "Ambassadorship",
    body: "A six to twelve month retainer: an agreed number of posts, first refusal on category exclusivity, and a say in the product roadmap where that makes sense. I take on one of these at a time.",
    images: [
      poster("mask-sheet", "Ambassadorship still"),
      poster("glow-patches", "Ambassadorship still"),
    ],
    relatedSlugs: ["glow-up-mornings", "mask-monday"],
  },
];
