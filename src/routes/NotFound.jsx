import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

import ArchiveTable from "@/components/ArchiveTable";
import Seo from "@/components/Seo";
import { projects } from "@/content/projects";

import styles from "./NotFound.module.css";

/** Three featured projects, stable for the life of the page. */
function suggestions() {
  const featured = projects.filter((project) => project.featured);
  const pool = featured.length >= 3 ? featured : projects;
  return [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
}

/**
 * The catch-all route *and* the root `errorElement`.
 *
 * `useRouteError()` distinguishes a genuine 404 from a loader that blew up,
 * because "we couldn't find that" and "we broke" need different copy and
 * different affordances.
 *
 * NOTE: this renders a 200 from a static host unless the host is configured
 * to return a real 404 status for unknown paths. See README → Deployment.
 */
export function Component() {
  const error = useRouteError();

  const is404 = !error || (isRouteErrorResponse(error) && error.status === 404);
  const picks = suggestions();

  if (import.meta.env.PROD && error && !is404) {
    // Hook a real reporter in here (Sentry.captureException) when one exists.
    console.error(error);
  }

  return (
    <div className="u-wrap">
      <Seo title={is404 ? "Not found" : "Something broke"} noIndex />

      <header className={styles.head}>
        <h1 className="u-display">
          {is404 ? (
            <>
              Not
              <br />
              Found
            </>
          ) : (
            <>
              Something
              <br />
              Broke
            </>
          )}
        </h1>
        <p className={`${styles.lede} u-prose`}>
          {is404
            ? "That page isn't here. It may have been renamed, or it may never have existed — the campaign archive is the reliable way in."
            : "A page failed to load. Reloading usually settles it; if it doesn't, the archive is still there."}
        </p>

        <div className={styles.actions}>
          {!is404 ? (
            <button type="button" className="u-tag" onClick={() => window.location.reload()}>
              Try again
            </button>
          ) : null}
          <Link to="/" className="u-tag">
            Home
          </Link>
          <Link to="/work" className="u-tag">
            Campaigns
          </Link>
        </div>

        {isRouteErrorResponse(error) ? (
          <p className="u-meta">
            {error.status} {error.statusText}
          </p>
        ) : null}
      </header>

      <section className={styles.suggestions} aria-labelledby="suggested">
        <div className="u-band">
          <h2 id="suggested" className="u-meta">
            Try the archive instead
          </h2>
        </div>
        <ArchiveTable projects={picks} showHeader={false} compact />
      </section>
    </div>
  );
}

export default Component;
