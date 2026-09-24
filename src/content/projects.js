/**
 * project[] - mirrors the Sanity `project` document.
 *
 * For this build a "project" is a **TikTok brand campaign**. `stats` carries
 * the numbers a brand actually asks for (views, saves, watch-through, GMV),
 * and `credits` is used for deliverables, usage rights and where it ran.
 *
 * `video` is the post itself: it plays in the home showcase (featured
 * projects) and in the case-study hero. `hoverVideo` drives the cursor-follow
 * preview on /work. `tiktokUrl` links out to the live post - null until
 * there is a real one.
 *
 * EVERY BRAND, NUMBER AND POST HERE IS PLACEHOLDER. The brands are invented
 * on purpose: pairing a real brand with made-up numbers claims a partnership
 * that never happened.
 */

import { clip, hoverClip, poster } from "@/content/media";

export const projects = [
  {
    _id: "c-glow-up-mornings",
    slug: "glow-up-mornings",
    title: "Glow Up Mornings",
    client: "Dewlab Skincare",
    year: 2026,
    sector: "sponsored",
    disciplines: ["grwm", "tutorial"],
    featured: true,
    order: 1,
    cover: poster("glow-skincare", "Applying face cream in a towel robe"),
    video: clip("glow-skincare"),
    hoverVideo: hoverClip("glow-skincare"),
    tiktokUrl: null,
    intro:
      "A three-part get-ready-with-me built around one serum. No voiceover script - I talked through the routine the way I actually do it, and the product sat where it sits every morning.",
    stats: [
      { label: "Views", value: "3.8M" },
      { label: "Likes", value: "412K" },
      { label: "Saves", value: "96K" },
      { label: "Watch-through", value: "41%" },
    ],
    blocks: [
      {
        _type: "text",
        text: "Saves were the number we planned around. A GRWM that gets saved is one people come back to the next morning, which is the only moment a skincare brand really wants to be in.",
      },
      { _type: "video", media: clip("glow-patches"), caption: "Part two - the under-eye step" },
      {
        _type: "pullquote",
        text: "Nine in ten comments asked what the serum was. That is the brief working.",
      },
    ],
    credits: [
      { role: "Deliverables", names: ["3 x TikTok, 45-60s"] },
      { role: "Posted from", names: ["@junoreyes"] },
      { role: "Usage", names: ["90 days Spark Ads"] },
    ],
    awards: ["Loop Awards - Finalist, Beauty"],
  },
  {
    _id: "c-slurp-test",
    slug: "slurp-test",
    title: "The Slurp Test",
    client: "Nori Noodle Co.",
    year: 2026,
    sector: "series",
    disciplines: ["review", "skit"],
    featured: true,
    order: 2,
    cover: poster("ramen-camera", "Posing to the phone camera over a bowl of ramen"),
    video: clip("ramen-camera"),
    hoverVideo: hoverClip("ramen-camera"),
    tiktokUrl: null,
    intro:
      "An eight-part taste-test series ranking instant ramen, with the sponsor's range in the line-up and no guarantee of first place. It came second twice, which is exactly why people believed it when it won.",
    stats: [
      { label: "Series views", value: "6.2M" },
      { label: "Comments", value: "21K" },
      { label: "Follows driven", value: "34K" },
      { label: "Episodes", value: "8" },
    ],
    blocks: [
      {
        _type: "text",
        text: "Each episode ended on a score and a question - what should I test next - so the comments wrote the following week's brief.",
      },
      { _type: "video", media: clip("ramen-chopsticks"), caption: "Episode five - the spice round" },
    ],
    credits: [
      { role: "Deliverables", names: ["8 x TikTok series"] },
      { role: "Posted from", names: ["@junoreyes"] },
      { role: "Usage", names: ["Organic only"] },
    ],
    awards: [],
  },
  {
    _id: "c-roll-call",
    slug: "roll-call",
    title: "Roll Call",
    client: "Glide Skates",
    year: 2025,
    sector: "sponsored",
    disciplines: ["trend", "tutorial"],
    featured: true,
    order: 3,
    cover: poster("roller-retro", "Dancing on roller skates in a retro outfit"),
    video: clip("roller-retro"),
    hoverVideo: hoverClip("roller-retro"),
    tiktokUrl: null,
    intro:
      "A dance challenge on skates, built on an original sound so every duet and stitch credited back to the campaign. The easy version was learnable in an afternoon; the hard version is why people kept watching.",
    stats: [
      { label: "Views", value: "9.1M" },
      { label: "Likes", value: "1.1M" },
      { label: "Videos with sound", value: "11.8K" },
      { label: "Shares", value: "88K" },
    ],
    blocks: [
      {
        _type: "text",
        text: "The launch video was the hard version. The tutorial went up two hours later, and that second post drove most of the creations.",
      },
      { _type: "video", media: clip("dance-lipstick"), caption: "The follow-up tutorial" },
    ],
    credits: [
      { role: "Deliverables", names: ["1 x launch", "1 x tutorial", "Original sound"] },
      { role: "Posted from", names: ["@junoreyes"] },
      { role: "Usage", names: ["6 months, brand channels"] },
    ],
    awards: [],
  },
  {
    _id: "c-after-dark",
    slug: "after-dark",
    title: "After Dark",
    client: "Lumen Apparel",
    year: 2025,
    sector: "shop",
    disciplines: ["fit-check", "haul"],
    featured: true,
    order: 4,
    cover: poster("neon-sign", "Standing in front of a neon sign at night"),
    video: clip("neon-sign"),
    hoverVideo: hoverClip("neon-sign"),
    tiktokUrl: null,
    intro:
      "A night-out fit check shot in one evening across four locations, with every piece tagged in TikTok Shop. The outfit changes land on the beat, so the video loops cleanly and the shop tags stay on screen longer.",
    stats: [
      { label: "Views", value: "2.7M" },
      { label: "GMV", value: "$184K" },
      { label: "Units sold", value: "3,900" },
      { label: "Product CTR", value: "4.6%" },
    ],
    blocks: [
      {
        _type: "text",
        text: "Shop videos live or die in the first second, so the best look opens the video instead of closing it.",
      },
      {
        _type: "duo",
        media: [
          poster("neon-sign", "Look one - under the neon"),
          poster("street-walk", "Look three - walking to camera"),
        ],
      },
    ],
    credits: [
      { role: "Deliverables", names: ["2 x Shop video", "1 x LIVE"] },
      { role: "Posted from", names: ["@junoreyes"] },
      { role: "Commission", names: ["Affiliate + flat fee"] },
    ],
    awards: [],
  },
  {
    _id: "c-mask-monday",
    slug: "mask-monday",
    title: "Mask Monday",
    client: "Petal Lab",
    year: 2025,
    sector: "live",
    disciplines: ["tutorial", "grwm"],
    featured: true,
    order: 5,
    cover: poster("mask-sheet", "Placing a sheet face mask"),
    video: clip("mask-sheet"),
    hoverVideo: hoverClip("mask-sheet"),
    tiktokUrl: null,
    intro:
      "A weekly shoppable LIVE: an hour of face masks, questions from chat, and a pinned product for the length of each mask. Low production on purpose - one ring light, one mirror, one mask at a time.",
    stats: [
      { label: "Peak viewers", value: "14.2K" },
      { label: "Avg. watch", value: "11 min" },
      { label: "LIVE GMV", value: "$52K" },
      { label: "Sessions", value: "6" },
    ],
    blocks: [
      {
        _type: "text",
        text: "The clip that went out before each session did the real work - it told people what time to come back.",
      },
    ],
    credits: [
      { role: "Deliverables", names: ["6 x 60 min LIVE", "6 x teaser"] },
      { role: "Posted from", names: ["@junoreyes"] },
      { role: "Commission", names: ["LIVE affiliate"] },
    ],
    awards: [],
  },
  {
    _id: "c-the-intern",
    slug: "the-intern",
    title: "The Intern",
    client: "Whisker & Co.",
    year: 2024,
    sector: "sponsored",
    disciplines: ["skit"],
    featured: true,
    order: 6,
    cover: poster("cat-chat", "Talking to a cat on the sofa"),
    video: clip("cat-chat"),
    hoverVideo: hoverClip("cat-chat"),
    tiktokUrl: null,
    intro:
      "A running skit where my cat is the worst intern at a content agency. The pet food appeared once per episode, as a bribe, and the comments started asking about it before we ever named it.",
    stats: [
      { label: "Views", value: "12.6M" },
      { label: "Likes", value: "2.3M" },
      { label: "Shares", value: "310K" },
      { label: "Comments", value: "48K" },
    ],
    blocks: [
      {
        _type: "text",
        text: "Shares were the story here. A skit gets sent to a friend; a product demo does not.",
      },
    ],
    credits: [
      { role: "Deliverables", names: ["4 x skit"] },
      { role: "Posted from", names: ["@junoreyes"] },
      { role: "Usage", names: ["Organic + 60 days Spark Ads"] },
    ],
    awards: ["Vertical Video Awards - Best Skit Series"],
  },
  {
    _id: "c-pool-day",
    slug: "pool-day-haul",
    title: "Pool Day Haul",
    client: "Solstice Swim",
    year: 2025,
    sector: "shop",
    disciplines: ["haul", "fit-check"],
    featured: false,
    order: 7,
    cover: poster("pool-sunglasses", "Sitting in a pool wearing sunglasses"),
    video: clip("pool-sunglasses"),
    hoverVideo: hoverClip("pool-sunglasses"),
    tiktokUrl: null,
    intro:
      "A try-on haul of the summer range, filmed poolside in natural light so the colours read the way they do in person. Returns on the tagged pieces came in well under the brand's average.",
    stats: [
      { label: "Views", value: "1.9M" },
      { label: "GMV", value: "$96K" },
      { label: "Units sold", value: "2,300" },
      { label: "Saves", value: "41K" },
    ],
    blocks: [
      {
        _type: "text",
        text: "Honest sizing notes on screen for every piece. It costs a few sales and saves a lot of returns.",
      },
    ],
    credits: [
      { role: "Deliverables", names: ["1 x Shop haul", "3 x cutdown"] },
      { role: "Posted from", names: ["@junoreyes"] },
      { role: "Commission", names: ["Affiliate"] },
    ],
    awards: [],
  },
  {
    _id: "c-the-fitting",
    slug: "the-fitting",
    title: "The Fitting",
    client: "Veil & Co.",
    year: 2024,
    sector: "spark",
    disciplines: ["fit-check", "day-in-life"],
    featured: false,
    order: 8,
    cover: poster("bridal-mirror", "Trying on a wedding dress in front of a mirror"),
    video: clip("bridal-mirror"),
    hoverVideo: hoverClip("bridal-mirror"),
    tiktokUrl: null,
    intro:
      "Creator-style content for a bridal boutique to run as Spark Ads - a fitting day told as a story rather than a catalogue. It never went out on my account; the brand ran it from theirs.",
    stats: [
      { label: "Paid reach", value: "5.4M" },
      { label: "CTR", value: "3.1%" },
      { label: "CPA vs. benchmark", value: "-38%" },
      { label: "Assets", value: "8" },
    ],
    blocks: [
      {
        _type: "text",
        text: "Eight cuts of the same day, each with a different first line, so the ad account could find out which hook worked instead of guessing.",
      },
    ],
    credits: [
      { role: "Deliverables", names: ["8 x Spark Ads asset"] },
      { role: "Posted from", names: ["Brand account"] },
      { role: "Usage", names: ["6 months paid"] },
    ],
    awards: [],
  },
  {
    _id: "c-5am-club",
    slug: "5am-club",
    title: "5AM Club",
    client: "Forge Fitness",
    year: 2024,
    sector: "series",
    disciplines: ["day-in-life", "tutorial"],
    featured: false,
    order: 9,
    cover: poster("gym-squats", "Squats with dumbbells at the gym"),
    video: clip("gym-squats"),
    hoverVideo: hoverClip("gym-squats"),
    tiktokUrl: null,
    intro:
      "Thirty days of 5am workouts, posted the same morning each time. The unedited consistency was the campaign - nobody can fake thirty early starts.",
    stats: [
      { label: "Views", value: "4.4M" },
      { label: "Follows driven", value: "22K" },
      { label: "Watch-through", value: "37%" },
      { label: "Episodes", value: "30" },
    ],
    blocks: [
      {
        _type: "text",
        text: "Day one got a fraction of the views of day thirty. Series build; the brand agreed up front to judge it on the last week, not the first.",
      },
    ],
    credits: [
      { role: "Deliverables", names: ["30 x TikTok"] },
      { role: "Posted from", names: ["@junoreyes"] },
      { role: "Usage", names: ["Organic + gym screens"] },
    ],
    awards: [],
  },
  {
    _id: "c-beach-reset",
    slug: "beach-reset",
    title: "Beach Reset",
    client: "Tidewater Resorts",
    year: 2024,
    sector: "spark",
    disciplines: ["travel", "day-in-life"],
    featured: false,
    order: 10,
    cover: poster("beach-walk", "Walking along the beach"),
    video: clip("beach-walk"),
    hoverVideo: hoverClip("beach-walk"),
    tiktokUrl: null,
    intro:
      "A slow, no-voiceover day at a coastal resort, shot as twelve short assets the brand ran as paid media through the off-season.",
    stats: [
      { label: "Paid reach", value: "3.2M" },
      { label: "CTR", value: "2.4%" },
      { label: "Bookings attributed", value: "280" },
      { label: "Assets", value: "12" },
    ],
    blocks: [
      {
        _type: "text",
        text: "The quietest videos tested best. People scrolling at 11pm in February are not looking for energy; they are looking for a beach.",
      },
    ],
    credits: [
      { role: "Deliverables", names: ["12 x Spark Ads asset"] },
      { role: "Posted from", names: ["Brand account"] },
      { role: "Usage", names: ["9 months paid"] },
    ],
    awards: [],
  },
];
