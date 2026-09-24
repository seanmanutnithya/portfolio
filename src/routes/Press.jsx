import { Link, useLoaderData, useSearchParams } from "react-router-dom";

import Seo from "@/components/Seo";
import { pressQuery } from "@/lib/content";
import { monthYear } from "@/lib/format";

import styles from "./Press.module.css";

export async function loader() {
  return pressQuery();
}

/** /press — press and awards, grouped by year. */
export function Component() {
  const data = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();

  const type = searchParams.get("type") === "award" ? "award" : "press";
  const groups = data[type];

  const setType = (next) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (next === "press") params.delete("type");
        else params.set("type", next);
        return params;
      },
      { replace: true, preventScrollReset: true },
    );
  };

  return (
    <div className="u-wrap">
      <Seo title="Press" description="Selected press coverage and recognition." />

      <header className={styles.head}>
        <h1 className="u-display">Press</h1>
        <div className={styles.toggle} role="group" aria-label="Filter by type">
          <button
            type="button"
            className="u-tag"
            data-active={type === "press"}
            onClick={() => setType("press")}
          >
            Press
          </button>
          <button
            type="button"
            className="u-tag"
            data-active={type === "award"}
            onClick={() => setType("award")}
          >
            Recognition
          </button>
        </div>
      </header>

      {groups.length === 0 ? (
        <p className={styles.empty}>Nothing filed here yet.</p>
      ) : (
        groups.map((group) => (
          <section key={group.year} className={styles.group}>
            <h2 className={styles.year}>{group.year}</h2>
            <ul>
              {group.items.map((item) => (
                <li key={item._id} className={styles.row}>
                  {/* Plain external anchor — the whole row is the hit area. */}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    <span className={`${styles.date} u-meta`}>{monthYear(item.date)}</span>
                    <span className={styles.title}>
                      <span className={styles.publication}>{item.publication}</span>
                      <span className={styles.separator} aria-hidden="true">
                        —
                      </span>
                      {item.title}
                    </span>
                    <span className={`${styles.view} u-meta`} aria-hidden="true">
                      View ↗
                    </span>
                  </a>

                  {/* Sits outside the anchor: a link inside a link is invalid. */}
                  {item.linkedProject ? (
                    <Link
                      to={`/work/${item.linkedProject.slug}`}
                      className={`${styles.chip} u-tag`}
                    >
                      {item.linkedProject.title}
                    </Link>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

export default Component;
