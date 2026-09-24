import { Link, useLoaderData, useLocation } from "react-router-dom";

import Blocks from "@/components/Blocks";
import Media from "@/components/Media";
import Seo from "@/components/Seo";
import { disciplines as disciplineList, sectors as sectorList } from "@/content/site";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { projectBySlug } from "@/lib/content";
import { labelFor } from "@/lib/format";

import styles from "./Project.module.css";

/**
 * The filter context travels in the query string, so next/prev walks the
 * same order the visitor was looking at on /work.
 */
export async function loader({ params, request }) {
  const url = new URL(request.url);
  const context = {
    sector: url.searchParams.get("sector") ?? "",
    discipline: url.searchParams.get("discipline") ?? "",
    sort: url.searchParams.get("sort") ?? "year",
  };

  const project = await projectBySlug(params.slug, context);
  if (!project) {
    throw new Response("Project not found", { status: 404, statusText: "Not Found" });
  }
  return project;
}

/** /work/:slug — the case study. */
export function Component() {
  const project = useLoaderData();
  // Carried onto every outbound link so the filtered order survives a hop.
  const { search: query } = useLocation();
  const reduced = useReducedMotion();

  return (
    <article>
      <Seo title={project.title} description={project.intro} />

      {/* Hero — pulled under the fixed nav. The post itself plays in a 9:16
          frame over a blurred copy of its poster. */}
      <header className={styles.hero}>
        {project.cover?.src ? (
          <img className={styles.heroBackdrop} src={project.cover.src} alt="" aria-hidden="true" />
        ) : null}

        <div className={`${styles.heroInner} u-wrap`}>
          <div className={styles.heroCopy}>
            <span className="u-meta">
              {labelFor(sectorList, project.sector)} · {project.client}
            </span>
            <h1 className={`${styles.title} u-display`}>{project.title}</h1>
            {project.tiktokUrl ? (
              <a
                href={project.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="u-tag"
              >
                Watch on TikTok <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </div>

          <div className={styles.phone}>
            {project.video ? (
              <video
                // New element per project, so next/prev swaps the source.
                key={project.slug}
                className={styles.phoneVideo}
                src={project.video.src}
                poster={project.video.poster ?? project.cover?.src}
                muted
                loop
                playsInline
                autoPlay={!reduced}
                controls={reduced}
                preload="metadata"
              />
            ) : (
              <Media media={project.cover} priority ratio="9/16" sizes="22rem" />
            )}
          </div>
        </div>
      </header>

      <div className={`${styles.layout} u-wrap`}>
        {/* Sticky meta rail — un-sticks and stacks below 1024px */}
        <aside className={styles.rail}>
          <div className={styles.railInner}>
            <div className={styles.metaBlock}>
              <span className="u-meta">Brand</span>
              <span className={styles.metaValue}>{project.client}</span>
            </div>
            <div className={styles.metaBlock}>
              <span className="u-meta">Campaign</span>
              <Link to={`/work?sector=${project.sector}`} className={styles.metaValue}>
                {labelFor(sectorList, project.sector)}
              </Link>
            </div>
            <div className={styles.metaBlock}>
              <span className="u-meta">Year</span>
              <span className={styles.metaValue}>{project.year}</span>
            </div>
            <div className={styles.metaBlock}>
              <span className="u-meta">Format</span>
              <div className={styles.tags}>
                {project.disciplines.map((slug) => (
                  <Link key={slug} to={`/work?discipline=${slug}`} className="u-tag">
                    {labelFor(disciplineList, slug)}
                  </Link>
                ))}
              </div>
            </div>

            {project.credits.length > 0 ? (
              <div className={styles.metaBlock}>
                <span className="u-meta">Scope</span>
                <dl className={styles.credits}>
                  {project.credits.map((credit) => (
                    <div key={credit.role} className={styles.credit}>
                      <dt className="u-meta">{credit.role}</dt>
                      <dd className={styles.creditNames}>{credit.names.join(", ")}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            {project.awards.length > 0 ? (
              <div className={styles.metaBlock}>
                <span className="u-meta">Awards</span>
                <ul className={styles.awards}>
                  {project.awards.map((award) => (
                    <li key={award}>{award}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </aside>

        <div className={styles.body}>
          <p className={`${styles.intro} u-lede`}>{project.intro}</p>

          {/* Performance — the numbers a brand opens the page for. */}
          {project.stats?.length ? (
            <dl className={styles.stats}>
              {project.stats.map((stat) => (
                <div key={stat.label} className={styles.stat}>
                  <dt className="u-meta">{stat.label}</dt>
                  <dd className={styles.statValue}>{stat.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          <Blocks blocks={project.blocks} />
        </div>
      </div>

      {/* Next / prev — same order the visitor arrived with */}
      <nav className={`${styles.next} u-wrap`} aria-label="Project navigation">
        <div className={styles.nextInner}>
          {project.next ? (
            <Link to={`/work/${project.next.slug}${query}`} className={styles.nextLink}>
              <span className="u-meta">Next campaign</span>
              <span className={styles.nextTitle}>
                {project.next.title} <span aria-hidden="true">→</span>
              </span>
            </Link>
          ) : (
            <span />
          )}

          <Link to={`/work${query}`} className="u-tag">
            All campaigns
          </Link>
        </div>

        {project.prev ? (
          <Link to={`/work/${project.prev.slug}${query}`} className={`${styles.prev} u-meta`}>
            ← Previous: {project.prev.title}
          </Link>
        ) : null}
      </nav>
    </article>
  );
}

export default Component;
