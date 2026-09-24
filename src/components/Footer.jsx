import { Link } from "react-router-dom";

import { site } from "@/content/site";

import styles from "./Footer.module.css";

/**
 * S08 — footer wordmark.
 *
 * The nav is deliberately minimal (Archive / Search / Contact), matching the
 * reference, so the footer carries full site navigation. Every route must be
 * reachable from here.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="u-wrap">
        <p className={`${styles.wordmark} u-display`}>{site.heroHeadline}</p>

        <div className={styles.cols}>
          <nav className={styles.col} aria-label="Footer">
            <span className="u-meta">Pages</span>
            <Link to="/work">Campaigns</Link>
            <Link to="/about">About</Link>
            <Link to="/services">Work with me</Link>
            <Link to="/journal">Journal</Link>
            <Link to="/press">Press</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          <div className={styles.col}>
            <span className="u-meta">Contact</span>
            {site.emails.map((email) => (
              <a key={email.address} href={`mailto:${email.address}`}>
                {email.address}
              </a>
            ))}
          </div>

          <div className={styles.col}>
            <span className="u-meta">Follow</span>
            {site.socials.map((social) => (
              <a key={social.url} href={social.url} target="_blank" rel="noopener noreferrer">
                {social.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>

          <div className={styles.col}>
            <span className="u-meta">Based in</span>
            {site.offices.map((office) => (
              <span key={office.city}>
                {office.city} <span className={styles.tz}>{office.tz}</span>
              </span>
            ))}
          </div>
        </div>

        <div className={styles.base}>
          <span className="u-meta">
            © {site.founded}–{String(year).slice(-2)}, All rights reserved
          </span>
          <span className="u-meta">Built with React &amp; GSAP</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
