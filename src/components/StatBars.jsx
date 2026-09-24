import { Link } from "react-router-dom";

import styles from "./StatBars.module.css";

/**
 * A row of labelled bars.
 *
 * Used on the home page for the audience numbers that a brand actually
 * wants to see. Bars are scaled against the largest value rather than the
 * total, so a small channel is still visible instead of a hairline.
 *
 * Each item takes `{ label, value, display?, handle?, url?, slug? }`.
 * An item with a `url` renders as an external link to that profile, one
 * with a `slug` links into the filtered archive, and anything else (an
 * age bracket, say) is plain text.
 */
export function StatBars({ items }) {
  const max = Math.max(...items.map((item) => item.value ?? item.count ?? 0), 1);

  return (
    <ul className={styles.grid}>
      {items.map((item) => {
        const value = item.value ?? item.count ?? 0;
        const body = (
          <>
            <span className={styles.label}>{item.label}</span>
            <span className={styles.track} aria-hidden="true">
              <span className={styles.bar} style={{ width: `${(value / max) * 100}%` }} />
            </span>
            <span className={styles.figure}>{item.display ?? value}</span>
            {item.handle ? <span className={`${styles.handle} u-meta`}>{item.handle}</span> : null}
          </>
        );

        return (
          <li key={item.slug ?? item.label}>
            {item.url ? (
              <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.item}>
                {body}
              </a>
            ) : item.slug ? (
              <Link to={`/work?sector=${item.slug}`} className={styles.item}>
                {body}
              </Link>
            ) : (
              <div className={styles.item}>{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default StatBars;
