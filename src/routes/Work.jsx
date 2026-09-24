import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLoaderData, useNavigation } from "react-router-dom";

import ArchiveTable from "@/components/ArchiveTable";
import HoverMedia from "@/components/HoverMedia";
import Media from "@/components/Media";
import Seo from "@/components/Seo";
import { SkeletonRows } from "@/components/Skeleton";
import { useFilterParams } from "@/hooks/useFilterParams";
import { useHoverMedia } from "@/hooks/useHoverMedia";
import { allProjects, filterProjects } from "@/lib/content";
import { labelFor, shortYear } from "@/lib/format";

import styles from "./Work.module.css";

const PAGE_SIZE = 8;

export async function loader() {
  return allProjects();
}

/** /work — the dense archive. Filter state lives in the URL, nowhere else. */
export function Component() {
  const { projects, disciplines, sectors } = useLoaderData();
  const { filters, toggleFilter, setFilter, clearFilters, activeCount, filterQuery } =
    useFilterParams();
  const navigation = useNavigation();
  const hover = useHoverMedia();

  const sentinelRef = useRef(null);

  const results = useMemo(() => filterProjects(projects, filters), [projects, filters]);

  /**
   * How many rows are showing, scoped to the current filter set.
   *
   * Keying the count to a filter signature means a filter change resets
   * paging by derivation — no effect, no extra render, and no flash of the
   * previous page length.
   */
  const filterKey = `${filters.sector}|${filters.discipline}|${filters.client}|${filters.year}|${filters.sort}`;
  const [page, setPage] = useState({ key: filterKey, visible: PAGE_SIZE });
  const visible = page.key === filterKey ? page.visible : PAGE_SIZE;
  const showMore = () =>
    setPage({ key: filterKey, visible: Math.min(visible + PAGE_SIZE, results.length) });

  const shown = results.slice(0, visible);
  const hasMore = visible < results.length;

  // Infinite scroll. The button below is the real control — this just saves
  // the mouse user a click.
  useEffect(() => {
    if (!hasMore) return undefined;
    const node = sentinelRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          showMore();
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- showMore is derived from these
  }, [hasMore, visible, filterKey, results.length]);

  const isLoading = navigation.state === "loading";

  return (
    <div className="u-wrap">
      <Seo
        title="Campaigns"
        description="Every TikTok brand campaign, filterable by campaign type, format and year."
      />

      <header className={styles.head}>
        <h1 className="u-display">Campaigns</h1>
        <p className={`${styles.count} u-meta`}>
          {results.length} {results.length === 1 ? "result" : "results"}
          {activeCount > 0 ? ` · ${activeCount} filter${activeCount === 1 ? "" : "s"}` : ""}
        </p>
      </header>

      {/* Filter bar — every control writes to the URL */}
      <div className={styles.bar}>
        <div className={styles.chips}>
          <button
            type="button"
            className="u-tag"
            data-active={!filters.sector}
            onClick={() => setFilter("sector", "")}
          >
            All
          </button>
          {sectors.map((sector) => (
            <button
              key={sector.slug}
              type="button"
              className="u-tag"
              data-active={filters.sector === sector.slug}
              onClick={() => toggleFilter("sector", sector.slug)}
            >
              {sector.label}
            </button>
          ))}
        </div>

        <div className={styles.controls}>
          <label className={styles.select}>
            <span className="u-sr">Filter by format</span>
            <select
              value={filters.discipline}
              onChange={(event) => setFilter("discipline", event.target.value)}
              className="u-tag"
            >
              <option value="">All formats</option>
              {disciplines.map((discipline) => (
                <option key={discipline.slug} value={discipline.slug}>
                  {discipline.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="u-tag"
            onClick={() => setFilter("sort", filters.sort === "az" ? "year" : "az")}
          >
            {filters.sort === "az" ? "A–Z" : "Year ↓"}
          </button>

          <div className={styles.toggle} role="group" aria-label="View">
            <button
              type="button"
              className="u-tag"
              data-active={filters.view !== "grid"}
              onClick={() => setFilter("view", "list")}
            >
              <span className="u-sr">List view</span>
              <span aria-hidden="true">☰</span>
            </button>
            <button
              type="button"
              className="u-tag"
              data-active={filters.view === "grid"}
              onClick={() => setFilter("view", "grid")}
            >
              <span className="u-sr">Grid view</span>
              <span aria-hidden="true">▦</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <SkeletonRows count={12} />
      ) : results.length === 0 ? (
        <div className={styles.empty}>
          <p className="u-h3">Nothing matches those filters.</p>
          <p className="u-prose">
            Try a different campaign type, or clear everything and start from the full archive.
          </p>
          <button type="button" className="u-tag" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      ) : filters.view === "grid" ? (
        <ul className={styles.grid}>
          {shown.map((project) => (
            <li key={project._id}>
              <Link to={`/work/${project.slug}${filterQuery}`} className={styles.card}>
                {/* One tile shape for every card, whatever the cover's own
                    ratio — otherwise titles sit at a different height in
                    each column and the row reads as broken. 9:16 so the grid
                    reads like a TikTok profile. */}
                <Media
                  media={project.cover}
                  ratio="9/16"
                  sizes="(max-width: 52.125rem) 50vw, (max-width: 64rem) 33vw, 25vw"
                />
                <span className={styles.cardTitle}>{project.title}</span>
                <span className="u-meta">
                  {labelFor(disciplines, project.disciplines[0])} · {shortYear(project.year)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <ArchiveTable projects={shown} hover={hover} filterQuery={filterQuery} />
      )}

      {/* Paging — the button is the control, the sentinel is the shortcut */}
      {hasMore ? (
        <div className={styles.more}>
          <span ref={sentinelRef} aria-hidden="true" />
          <button
            type="button"
            className="u-tag"
            onClick={showMore}
          >
            Load {Math.min(PAGE_SIZE, results.length - visible)} more
          </button>
        </div>
      ) : results.length > PAGE_SIZE ? (
        <p className={`${styles.more} u-meta`}>End of archive</p>
      ) : null}

      <HoverMedia hover={hover} />
    </div>
  );
}

export default Component;
