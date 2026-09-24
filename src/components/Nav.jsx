import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import { useScrollLock } from "@/hooks/useScrollLock";
import { site } from "@/content/site";

import styles from "./Nav.module.css";

const LINKS = [
  { to: "/work", label: "Work", short: "Work" },
  { to: "/about", label: "About", short: "About" },
  { to: "/services", label: "Work with me", short: "Work with me" },
  { to: "/journal", label: "Journal", short: "Journal" },
  { to: "/press", label: "Press", short: "Press" },
  { to: "/contact", label: "Contact", short: "Contact" },
];

/** Desktop shows a deliberately short set; the rest live in the menu. */
const PRIMARY = ["/work", "/contact"];

/**
 * S00 — the persistent nav.
 *
 * `position: fixed`, 44px tall, and it never grows. `mix-blend-mode:
 * difference` keeps it legible over both the dark canvas and any full-bleed
 * media it passes over.
 */
export function Nav({ onOpenSearch }) {
  const location = useLocation();

  /**
   * The menu is tied to the route it was opened on, so any navigation
   * closes it as a matter of derivation rather than an effect that fires a
   * second render after the page has already changed.
   */
  const [menuState, setMenuState] = useState({ open: false, path: location.pathname });
  const menuOpen = menuState.open && menuState.path === location.pathname;

  const setMenuOpen = (next) =>
    setMenuState((current) => ({
      open: typeof next === "function" ? next(current.open) : next,
      path: location.pathname,
    }));

  useScrollLock(menuOpen);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event) => {
      // Sets state directly rather than through setMenuOpen so the effect
      // has no dependency on a function recreated every render.
      if (event.key === "Escape") setMenuState((current) => ({ ...current, open: false }));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <>
      <header className={styles.nav} data-open={menuOpen ? "true" : "false"}>
        <div className={styles.inner}>
          <Link to="/" className={styles.brand}>
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.brandFull}>{site.wordmark}</span>
            <span className={styles.brandShort} aria-hidden="true">
              {site.shortMark}
            </span>
          </Link>

          <nav className={styles.links} aria-label="Primary">
            {LINKS.filter((link) => PRIMARY.includes(link.to)).map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `${styles.link} u-meta${isActive ? ` ${styles.active}` : ""}`}
              >
                {link.label}
              </NavLink>
            ))}

            <button type="button" className={`${styles.link} u-meta`} onClick={onOpenSearch}>
              Search <span aria-hidden="true">⌕</span>
            </button>

            <button
              type="button"
              className={styles.burger}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="u-sr">{menuOpen ? "Close menu" : "Open menu"}</span>
              <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Full-screen, body scroll-locked, 48px minimum hit targets. */}
      <div id="site-menu" className={styles.menu} data-open={menuOpen ? "true" : "false"} hidden={!menuOpen}>
        <nav className={styles.menuLinks} aria-label="All pages">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `${styles.menuLink}${isActive ? ` ${styles.menuLinkActive}` : ""}`
              }
            >
              {link.short}
            </NavLink>
          ))}
        </nav>

        <div className={styles.menuFoot}>
          <button
            type="button"
            className={styles.menuSearch}
            onClick={() => {
              setMenuOpen(false);
              onOpenSearch();
            }}
          >
            <span className="u-meta">Search</span>
            <span aria-hidden="true">⌕</span>
          </button>
          <a href={`mailto:${site.emails[0].address}`} className="u-meta">
            {site.emails[0].address}
          </a>
        </div>
      </div>
    </>
  );
}

export default Nav;
