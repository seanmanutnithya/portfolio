import Media from "@/components/Media";
import { initials } from "@/lib/format";

import styles from "./RosterList.module.css";

/**
 * The fixed media slot — 180×240, always that size.
 *
 * Because the slot never changes size and lives outside the list, hovering a
 * row can never reflow the list. An item with no sample on file gets an
 * initials tile rather than an empty box.
 */
export function MediaSlot({ item, idleLabel = "Hover an item", className = "" }) {
  return (
    <div className={`${styles.slot} ${className}`} aria-hidden="true">
      {item ? (
        <div key={item._id} className={styles.slotInner}>
          {item.sample ? (
            <Media media={item.sample} caption={false} sizes="180px" ratio="3/4" />
          ) : (
            <div className={styles.initials}>{initials(item.name)}</div>
          )}
          <span className={`${styles.slotName} u-meta`}>{item.role}</span>
        </div>
      ) : (
        <div className={styles.slotIdle}>
          <span className="u-meta">{idleLabel}</span>
        </div>
      )}
    </div>
  );
}

/**
 * A two-column list of name/detail rows, each of which can load a sample
 * into a <MediaSlot>. Used for the skill set on the home page and /about.
 *
 * Rows report hover *and* focus, so the media swap is reachable by keyboard
 * and not only by mouse.
 *
 * @param {object} props
 * @param {Array} props.items
 * @param {(item: object|null) => void} [props.onActive] Lifts the active row
 *   so a parent can render its sample somewhere else — the home route swaps
 *   it into the hero slot.
 */
export function RosterList({ items, onActive, activeId }) {
  const set = (item) => () => onActive?.(item);

  return (
    <ul className={styles.grid}>
      {items.map((item) => (
        <li key={item._id}>
          <button
            type="button"
            className={styles.row}
            data-active={activeId === item._id ? "true" : "false"}
            onMouseEnter={set(item)}
            onMouseLeave={set(null)}
            onFocus={set(item)}
            onBlur={set(null)}
          >
            <span className={styles.name}>{item.name}</span>
            <span className={`${styles.role} u-meta`}>{item.role}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default RosterList;
