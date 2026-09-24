/**
 * Journal posts.
 *
 * DEVIATION FROM SPEC: the handoff sheet calls for MDX compiled through
 * `import.meta.glob`. These are structured block arrays instead, rendered by
 * the same <Blocks> switch map the collaboration bodies use - one renderer
 * instead of two, and no MDX toolchain.
 *
 * The frontmatter shape is unchanged, so moving to MDX later is a matter of
 * swapping the loader in lib/content.js; `draft: true` is filtered out in
 * production either way.
 */

export const journal = [
  {
    slug: "what-i-charge-and-why",
    title: "What I charge, and why",
    date: "2026-03-12",
    category: "Working",
    excerpt:
      "Brands ask for a rate card. I do not have one, and this is the honest explanation of what actually drives a number.",
    author: "Juno Reyes",
    readingMinutes: 7,
    draft: false,
    cover: { id: "journal-01", src: null, alt: "Notebook", ratio: "16/9" },
    blocks: [
      {
        _type: "text",
        text: "The first question in almost every email is some version of what do you charge. The honest answer is that it depends on four things, and follower count is the least important of them.",
      },
      {
        _type: "text",
        text: "Usage is the big one. A TikTok that lives on my profile for a month is a different piece of work from the same TikTok licensed as a Spark Ad across four markets for a year. Same edit, same day of shooting, very different number - because the second one is advertising and the first one is a post.",
      },
      {
        _type: "pullquote",
        text: "You are not buying a video. You are buying the right to put it in front of people who did not choose to follow me.",
      },
      {
        _type: "text",
        text: "Then exclusivity, then turnaround, then how much of it I have to make alone. A shoot day with a producer costs you more and costs me less. A shoot day where I am also the driver costs you less and costs me a weekend.",
      },
      { _type: "projectLink", slug: "the-fitting" },
    ],
  },
  {
    slug: "the-analytics-that-matter",
    title: "The three numbers I actually look at",
    date: "2026-02-02",
    category: "Notes",
    excerpt:
      "Reach is vanity, engagement is contested, and saves quietly predict everything.",
    author: "Juno Reyes",
    readingMinutes: 5,
    draft: false,
    cover: { id: "journal-02", src: null, alt: "Analytics screen", ratio: "16/9" },
    blocks: [
      {
        _type: "text",
        text: "Saves, watch-through rate, and replies. That is the whole list. Everything else on the dashboard is a description of how the algorithm felt that week.",
      },
      {
        _type: "pullquote",
        text: "A save is someone deciding they will need this later. Nothing else on the platform is that honest.",
      },
      {
        _type: "text",
        text: "When a brand asks me to forecast a campaign, these are the three I forecast. I have been wrong about reach by an order of magnitude and within ten percent on saves, consistently, for four years.",
      },
      { _type: "projectLink", slug: "glow-up-mornings" },
    ],
  },
  {
    slug: "saying-no-to-good-money",
    title: "Saying no to good money",
    date: "2025-12-19",
    category: "Working",
    excerpt:
      "Two partnerships I turned down last year, what they were worth, and why the audience would have noticed.",
    author: "Juno Reyes",
    readingMinutes: 6,
    draft: false,
    cover: { id: "journal-03", src: null, alt: "Desk", ratio: "16/9" },
    blocks: [
      {
        _type: "text",
        text: "The audience knows. Not immediately, and not consciously, but they know. A post that does not sound like you gets scrolled past at a rate you can see in the data the next morning.",
      },
      {
        _type: "text",
        text: "Both of the briefs I turned down last year were fine products from fine companies. They just were not things I would have mentioned unprompted, and that is the only test I have found that works.",
      },
    ],
  },
  {
    slug: "draft-on-gear",
    title: "Unfinished thoughts on gear",
    date: "2026-04-01",
    category: "Notes",
    excerpt: "A draft. Should not appear in a production build.",
    author: "Juno Reyes",
    readingMinutes: 2,
    draft: true,
    cover: null,
    blocks: [{ _type: "text", text: "Still writing this one." }],
  },
];
