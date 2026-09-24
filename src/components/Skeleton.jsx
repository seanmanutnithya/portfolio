import styles from "./Skeleton.module.css";

/** Deterministic pseudo-random widths so skeletons don't shimmer at random. */
const widthAt = (i, min = 42, max = 96) => min + ((i * 37) % (max - min));

/** A stack of text bars — the loading state for prose blocks. */
export function SkeletonBars({ count = 3, className = "" }) {
  return (
    <div className={`${styles.stack} ${className}`} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={styles.bar} style={{ width: `${widthAt(i)}%` }} />
      ))}
    </div>
  );
}

/**
 * Archive table loading state. The spec asks for 30 rows on /work and 8 on
 * the home band.
 */
export function SkeletonRows({ count = 30 }) {
  return (
    <div className={styles.rows} role="status" aria-label="Loading projects">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={styles.row}>
          <span className={styles.cell} style={{ width: "1.25rem" }} />
          <span className={styles.cell} style={{ width: `${widthAt(i, 30, 80)}%` }} />
          <span className={styles.cell} style={{ width: "4rem" }} />
          <span className={styles.cell} style={{ width: "3.5rem" }} />
          <span className={styles.cell} style={{ width: "1.5rem" }} />
        </div>
      ))}
    </div>
  );
}

export default SkeletonBars;
