/**
 * pressItem[] - mirrors the Sanity `pressItem` document.
 *
 * `type` drives the press/awards toggle: here it separates being written
 * about from being recognised. `linkedProject` is optional and renders as a
 * chip that deep-links to the campaign.
 *
 * PLACEHOLDER: publications and awards are invented, and every URL points at
 * example.com. Replace with real coverage or delete the entries.
 */

export const press = [
  {
    _id: "press-01",
    date: "2026-05-14",
    publication: "Creator Weekly",
    title: "The ramen series that turned taste tests into appointment viewing",
    url: "https://example.com/creator-weekly",
    type: "press",
    linkedProject: { slug: "slurp-test", title: "The Slurp Test" },
  },
  {
    _id: "press-02",
    date: "2026-03-02",
    publication: "The Scroll",
    title: "Why the best skincare ads do not look like ads",
    url: "https://example.com/the-scroll",
    type: "press",
    linkedProject: { slug: "glow-up-mornings", title: "Glow Up Mornings" },
  },
  {
    _id: "award-01",
    date: "2026-04-02",
    publication: "Loop Awards",
    title: "Finalist - Beauty",
    url: "https://example.com/loop-awards",
    type: "award",
    linkedProject: { slug: "glow-up-mornings", title: "Glow Up Mornings" },
  },
  {
    _id: "press-03",
    date: "2025-09-19",
    publication: "Shortform Review",
    title: "How one original sound became eleven thousand videos",
    url: "https://example.com/shortform-review",
    type: "press",
    linkedProject: { slug: "roll-call", title: "Roll Call" },
  },
  {
    _id: "press-04",
    date: "2025-06-08",
    publication: "Feed Notes",
    title: "What brands get wrong about TikTok Shop creators",
    url: "https://example.com/feed-notes",
    type: "press",
    linkedProject: { slug: "after-dark", title: "After Dark" },
  },
  {
    _id: "award-02",
    date: "2024-11-11",
    publication: "Vertical Video Awards",
    title: "Best Skit Series",
    url: "https://example.com/vertical-video-awards",
    type: "award",
    linkedProject: { slug: "the-intern", title: "The Intern" },
  },
  {
    _id: "press-05",
    date: "2024-04-18",
    publication: "Creator Weekly",
    title: "Thirty mornings, thirty posts, no filter",
    url: "https://example.com/creator-weekly-5am",
    type: "press",
    linkedProject: { slug: "5am-club", title: "5AM Club" },
  },
];
