import { useEffect, useRef, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";

import ArchiveTable from "@/components/ArchiveTable";
import StatBars from "@/components/StatBars";
import HoverMedia from "@/components/HoverMedia";
import Marquee from "@/components/Marquee";
import Media from "@/components/Media";
import RosterList from "@/components/RosterList";
import ProjectSlides from "@/components/ProjectSlides";
import Reveal from "@/components/Reveal";
import Seo from "@/components/Seo";
import { useHoverMedia } from "@/hooks/useHoverMedia";
import { homeQuery } from "@/lib/content";
import { longDate } from "@/lib/format";
import { organizationJsonLd } from "@/lib/jsonld";
import { loadMotion } from "@/lib/motion";

import styles from "./Home.module.css";

export async function loader() {
  return homeQuery();
}

/**
 * Home — wireframe direction 1a, "archive-first", opening with a full-screen
 * project showcase.
 *
 * Showcase slides · S01 hero · S02 marquee · S03 audience by age ·
 * S04 selected archive · S05 team · S06 contact · S07 press · S08 footer
 * wordmark (global).
 */
export function Component() {
  const data = useLoaderData();
  const hover = useHoverMedia();

  /**
   * Shared state between the offering list and the hero: hovering a row
   * swaps its sample into the hero slot. The slot is a fixed size, so the
   * swap never moves the headline.
   */
  const [activeSkill, setActiveSkill] = useState(null);
  const cutoutRef = useRef(null);

  // S01 — cutout parallaxes on scroll, y -12%, scrubbed.
  useEffect(() => {
    const el = cutoutRef.current;
    if (!el) return undefined;

    let cancelled = false;
    let context = null;

    loadMotion().then((motion) => {
      if (!motion || cancelled || !cutoutRef.current) return;
      const { gsap } = motion;
      context = gsap.context(() => {
        gsap.to(el, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      }, el);
    });

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, []);

  const cutout = activeSkill?.sample ?? data.heroCutout;

  return (
    <>
      <Seo jsonLd={organizationJsonLd()} />

      {/* Showcase — full-screen slides, the first thing on the page.
          Swipe / drag / arrow keys move between projects; a click opens the
          case study. */}
      <ProjectSlides projects={data.featured} />

      {/* S01 — hero */}
      <section className={`${styles.hero} u-wrap`}>
        <div className={styles.heroCopy}>
          <h1 className="u-display">{data.site.heroHeadline}</h1>
          <p className={`${styles.heroSub} u-lede`}>{data.site.heroSub}</p>
          <div className={styles.heroActions}>
            <Link to="/work" className="u-tag">
              Project archive <span aria-hidden="true">→</span>
            </Link>
            <span className="u-meta">
              {data.totalProjects} campaigns · {data.site.facts[0].value}{" "}
              {data.site.facts[0].label.toLowerCase()}
            </span>
          </div>
        </div>

        <div className={styles.heroMedia} ref={cutoutRef}>
          <Media
            media={cutout}
            priority
            caption={false}
            sizes="(max-width: 52.125rem) 60vw, 16rem"
          />
          <span className={`${styles.heroMediaLabel} u-meta`}>
            {activeSkill ? activeSkill.name : data.site.handle}
          </span>
        </div>
      </section>

      {/* S02 — marquee band */}
      <div className={styles.marquee}>
        <Marquee items={data.marquee} />
      </div>

      <div className="u-wrap">
        {/* S03 — audience by age */}
        <section className={styles.section} aria-labelledby="s03">
          <div className="u-band">
            <h2 id="s03" className="u-meta">
              Audience by age
            </h2>
            <Link to="/services" className="u-meta">
              Work with me →
            </Link>
          </div>
          <Reveal className={styles.sectionBody} stagger={0.05} selector="li">
            <StatBars items={data.audience} />
          </Reveal>
          {data.audienceNote ? (
            <p className={`${styles.note} u-meta`}>{data.audienceNote}</p>
          ) : null}
        </section>

        {/* S04 — selected archive */}
        <section className={styles.section} aria-labelledby="s04">
          <div className="u-band">
            <h2 id="s04" className="u-meta">
              Selected campaigns
            </h2>
            <Link to="/work" className="u-meta">
              View all →
            </Link>
          </div>
          <div className={styles.sectionBody}>
            <ArchiveTable projects={data.featured} hover={hover} />
          </div>
        </section>

        {/* S05 — team */}
        <section className={styles.section} aria-labelledby="s05">
          <div className="u-band">
            <h2 id="s05" className="u-meta">
              What I offer
            </h2>
            <Link to="/about" className="u-meta">
              About →
            </Link>
          </div>
          <div className={styles.sectionBody}>
            <RosterList
              items={data.skills}
              activeId={activeSkill?._id}
              onActive={setActiveSkill}
            />
            <p className={`${styles.peopleHint} u-meta`}>
              Hover a format — a sample loads into the hero
            </p>
          </div>
        </section>

        {/* S06 contact + S07 press */}
        <div className={styles.split}>
          <section className={styles.section} aria-labelledby="s06">
            <div className="u-band">
              <h2 id="s06" className="u-meta">
                Contact
              </h2>
            </div>
            <div className={styles.sectionBody}>
              <p className="u-prose">{data.site.contactIntro}</p>
              <a href={`mailto:${data.site.emails[0].address}`} className={styles.mailto}>
                {data.site.emails[0].address} <span aria-hidden="true">→</span>
              </a>
            </div>
          </section>

          <section className={styles.section} aria-labelledby="s07">
            <div className="u-band">
              <h2 id="s07" className="u-meta">
                Recent press
              </h2>
              <Link to="/press" className="u-meta">
                All press →
              </Link>
            </div>
            <ul className={styles.sectionBody}>
              {data.press.map((item) => (
                <li key={item._id}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.pressRow}
                  >
                    <span className="u-meta">{longDate(item.date)}</span>
                    <span className={styles.pressTitle}>{item.publication}</span>
                    <span className="u-meta" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <HoverMedia hover={hover} />
    </>
  );
}

export default Component;
