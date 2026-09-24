import { Link } from "react-router-dom";

import Media from "@/components/Media";
import { disciplines as disciplineList } from "@/content/site";
import { labelFor, pad, shortYear } from "@/lib/format";

import styles from "./ArchiveTable.module.css";

/**
 * The archive table — used on the home band, /work and the 404 suggestions.
 *
 * Every row is a single real `<a>` spanning the full width, minimum 44px
 * tall, so the whole row is one hit area and one tab stop. The visual grid
 * is CSS on the anchor, not a `<table>`, because the row collapses to a
 * thumbnail + stacked meta below 834px.
 *
 * @param {object} props
 * @param {Array} props.projects
 * @param {string} [props.filterQuery] Appended to each href so the detail
 *   route can resolve next/prev against the order the visitor is seeing.
 * @param {object} [props.hover] The `useHoverMedia()` return value. Omit to
 *   disable previews for this table entirely.
 */
export function ArchiveTable({
  projects,
  filterQuery = "",
  hover,
  showHeader = true,
  numbered = true,
  compact = false,
}) {
  const previewEnabled = Boolean(hover?.enabled);

  return (
    <div
      className={styles.table}
      data-compact={compact ? "true" : "false"}
      data-numbered={numbered ? "true" : "false"}
    >
      {showHeader ? (
        <div className={`${styles.head} u-meta`} aria-hidden="true">
          {numbered ? <span>№</span> : null}
          <span>Project</span>
          <span className={`${styles.client} ${styles.hideSm}`}>Brand</span>
          <span className={`${styles.discipline} ${styles.hideSm}`}>Format</span>
          <span className={styles.year}>Yr</span>
        </div>
      ) : null}

      <ul className={styles.list}>
        {projects.map((project, index) => (
          <li key={project._id}>
            <Link
              to={`/work/${project.slug}${filterQuery}`}
              className={styles.row}
              onMouseEnter={
                previewEnabled ? (event) => hover.enter(project, event) : undefined
              }
              onMouseMove={previewEnabled ? hover.move : undefined}
              onMouseLeave={previewEnabled ? hover.leave : undefined}
            >
              {numbered ? (
                <span className={`${styles.num} u-meta`} aria-hidden="true">
                  {pad(index + 1)}
                </span>
              ) : null}

              {/* Inline thumbnail — mobile only. The desktop preview is the
                  cursor-follow element instead. */}
              <span className={styles.thumb} aria-hidden="true">
                <Media media={project.cover} sizes="46px" />
              </span>

              <span className={styles.title}>{project.title}</span>

              <span className={`${styles.client} ${styles.hideSm} u-meta`}>{project.client}</span>

              <span className={`${styles.discipline} ${styles.hideSm} u-meta`}>
                {labelFor(disciplineList, project.disciplines[0])}
              </span>

              <span className={`${styles.metaSm} u-meta`} aria-hidden="true">
                {labelFor(disciplineList, project.disciplines[0])} · {shortYear(project.year)}
              </span>

              <span className={`${styles.year} u-meta`}>
                <span className="u-sr">{project.year}</span>
                <span aria-hidden="true">{shortYear(project.year)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ArchiveTable;
