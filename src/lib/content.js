/**
 * The content client.
 *
 * Every function here is a stand-in for a GROQ query against Sanity. They are
 * async and return plain serialisable objects, so swapping the bodies for
 * `sanityClient.fetch(...)` is the entire migration — no route, loader or
 * component changes.
 *
 * See README → "Content model (Sanity)" for the target schema.
 */

import { journal } from "@/content/journal";
import { skills } from "@/content/skills";
import { press } from "@/content/press";
import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { poster } from "@/content/media";
import { disciplines, sectors, site } from "@/content/site";

const IS_PROD = import.meta.env.PROD;

/** Simulates network latency in dev so loading states are actually visible. */
const settle = (value) => Promise.resolve(value);

/** Newest first, then by explicit `order`. */
const byRecency = (a, b) => b.year - a.year || a.order - b.order;

const listProjects = () => [...projects].sort(byRecency);

const publishedPosts = () =>
  journal
    .filter((post) => !(IS_PROD && post.draft))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

/* -------------------------------------------------------------------------
   Site-wide
------------------------------------------------------------------------- */

export function getSiteSettings() {
  return settle(site);
}

export function getTaxonomies() {
  return settle({ disciplines, sectors });
}

/* -------------------------------------------------------------------------
   Home — homeQuery()
------------------------------------------------------------------------- */

export function homeQuery() {
  const all = listProjects();
  const featured = all.filter((p) => p.featured).slice(0, 8);

  return settle({
    site,
    heroCutout: site.heroCutout,
    marquee: site.marquee,
    platforms: sectors.map((sector) => ({
      ...sector,
      count: all.filter((p) => p.sector === sector.slug).length,
    })),
    // The band is specced at 8 rows. Featured collaborations lead; the rest
    // is padded from the archive so it is never short.
    featured: [...featured, ...all.filter((p) => !featured.includes(p))].slice(0, 8),
    // Media-kit numbers, straight from siteSettings.
    audience: site.audience,
    audienceNote: site.audienceNote,
    skills: [...skills].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)),
    press: press
      .filter((item) => item.type === "press")
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3),
    totalProjects: all.length,
  });
}

/* -------------------------------------------------------------------------
   Work — allProjects()
------------------------------------------------------------------------- */

export function allProjects() {
  return settle({
    projects: listProjects(),
    disciplines,
    sectors,
  });
}

/**
 * Pure filter/sort applied on the client against the loader result.
 * The URL is the single source of truth — see hooks/useFilterParams.
 */
export function filterProjects(list, { sector, discipline, client, year, sort } = {}) {
  let out = list;

  if (sector) out = out.filter((p) => p.sector === sector);
  if (discipline) out = out.filter((p) => p.disciplines.includes(discipline));
  if (client) out = out.filter((p) => p.client === client);
  if (year) out = out.filter((p) => String(p.year) === String(year));

  if (sort === "az") {
    out = [...out].sort((a, b) => a.title.localeCompare(b.title));
  } else {
    out = [...out].sort(byRecency);
  }

  return out;
}

/* -------------------------------------------------------------------------
   Project detail — projectBySlug()
------------------------------------------------------------------------- */

/**
 * Resolves next/prev against the *filtered* order the visitor arrived with,
 * falling back to the full archive when they landed cold.
 *
 * @param {string} slug
 * @param {{ sector?: string, discipline?: string, sort?: string }} [context]
 */
export function projectBySlug(slug, context = {}) {
  const project = projects.find((p) => p.slug === slug);
  if (!project) return settle(null);

  const ordered = filterProjects(listProjects(), context);
  const scope = ordered.some((p) => p.slug === slug) ? ordered : listProjects();
  const index = scope.findIndex((p) => p.slug === slug);

  const at = (i) => {
    const item = scope[(i + scope.length) % scope.length];
    return item && item.slug !== slug ? { slug: item.slug, title: item.title } : null;
  };

  return settle({
    ...project,
    next: at(index + 1),
    prev: at(index - 1),
  });
}

/* -------------------------------------------------------------------------
   About / services / press / journal
------------------------------------------------------------------------- */

export function aboutQuery() {
  return settle({
    headline: site.aboutHeadline,
    body: site.aboutBody,
    clients: site.clients,
    studioImages: [
      poster("ramen-chopsticks", "Behind the scenes, filming a taste test"),
      poster("glow-patches", "Behind the scenes, a GRWM take"),
      poster("dance-lipstick", "Behind the scenes, learning the routine"),
      poster("street-walk", "Behind the scenes, walking a location"),
      poster("gym-squats", "Behind the scenes, a 5am start"),
    ],
    skills: [...skills].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)),
    facts: site.facts,
    founded: site.founded,
  });
}

export function servicesQuery() {
  return settle({
    services: services.map((service) => ({
      ...service,
      related: service.relatedSlugs
        .map((slug) => projects.find((p) => p.slug === slug))
        .filter(Boolean)
        .map((p) => ({ slug: p.slug, title: p.title, year: p.year, client: p.client })),
    })),
  });
}

/** Grouped by year, descending. Empty groups are never produced. */
export function pressQuery() {
  const sorted = [...press].sort((a, b) => new Date(b.date) - new Date(a.date));

  const group = (type) => {
    const items = sorted.filter((item) => item.type === type);
    const years = [...new Set(items.map((item) => new Date(item.date).getFullYear()))];
    return years.map((year) => ({
      year,
      items: items.filter((item) => new Date(item.date).getFullYear() === year),
    }));
  };

  return settle({ press: group("press"), award: group("award") });
}

export function journalQuery() {
  return settle({ posts: publishedPosts() });
}

export function journalPostBySlug(slug) {
  const posts = publishedPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return settle(null);

  return settle({
    ...posts[index],
    next: posts[index + 1] ? { slug: posts[index + 1].slug, title: posts[index + 1].title } : null,
  });
}

/* -------------------------------------------------------------------------
   Search index
------------------------------------------------------------------------- */

/**
 * The spec builds `search.json` at build time and ships it as a static asset
 * under 80kb. Built here from the same modules instead — it is the same
 * shape, and it is lazy-imported alongside Fuse so neither lands in the
 * entry chunk.
 */
export function buildSearchIndex() {
  const projectDocs = projects.map((p) => ({
    type: "project",
    title: p.title,
    slug: p.slug,
    href: `/work/${p.slug}`,
    client: p.client,
    year: p.year,
    disciplines: p.disciplines,
    excerpt: p.intro,
  }));

  const journalDocs = publishedPosts().map((post) => ({
    type: "journal",
    title: post.title,
    slug: post.slug,
    href: `/journal/${post.slug}`,
    client: post.author,
    year: new Date(post.date).getFullYear(),
    disciplines: [post.category],
    excerpt: post.excerpt,
  }));

  const pressDocs = press.map((item) => ({
    type: "press",
    title: item.title,
    slug: item._id,
    href: item.url,
    external: true,
    client: item.publication,
    year: new Date(item.date).getFullYear(),
    disciplines: [item.type === "award" ? "Award" : "Press"],
    excerpt: `${item.publication} — ${item.title}`,
  }));

  return [...projectDocs, ...journalDocs, ...pressDocs];
}

/** Chips shown when the query is empty. */
export function suggestedTags() {
  return ["GRWM", "TikTok Shop", "Review", "LIVE", "2025"];
}
