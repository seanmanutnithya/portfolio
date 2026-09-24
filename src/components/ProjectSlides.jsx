import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { disciplines as disciplineList } from "@/content/site";
import { labelFor, pad } from "@/lib/format";

import styles from "./ProjectSlides.module.css";

/** A drag past this fraction of the viewport advances a slide. */
const DRAG_THRESHOLD = 0.12;

/** Same idea for a touch swipe that has to wrap around the ends. */
const SWIPE_PX = 40;

/**
 * Full-screen project showcase — the first thing on the home page.
 *
 * One project per viewport. Advance by swipe, mouse drag, arrow keys or the
 * prev/next buttons; a click opens that project's case study. The reel
 * **loops**: past the last slide it returns to the first, and backwards from
 * the first it jumps to the last.
 *
 * Vertical scrolling is deliberately left alone. This sits on top of a long
 * page, so a wheel or a vertical swipe must carry the visitor down to the
 * rest of the site rather than being captured by the reel.
 *
 * The media is vertical (9:16, it is TikTok). On a phone it fills the screen;
 * on anything wider it sits in a phone-shaped frame over a blurred copy of
 * its own poster, so nothing is cropped to a sliver.
 *
 * Built on a native scroll container with `scroll-snap`, so momentum and
 * accessibility come from the browser. The pointer handlers add only
 * mouse-drag, which native scrolling does not provide.
 */
export function ProjectSlides({ projects, filterQuery = "" }) {
  const reduced = useReducedMotion();
  const railRef = useRef(null);
  const videoRefs = useRef([]);

  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);

  const dragRef = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const touchRef = useRef({ startX: 0, atStart: false, atEnd: false });

  const count = projects.length;

  /**
   * Scrolls to a slide, wrapping at both ends.
   *
   * A wrap is a jump of more than one slide, so it is made instantly —
   * smooth-scrolling the full width of the reel to get back to the start
   * reads as a glitch, not a transition.
   */
  const goTo = useCallback(
    (next) => {
      const rail = railRef.current;
      if (!rail || count === 0) return;

      const wrapped = ((next % count) + count) % count;
      const isWrap = Math.abs(wrapped - indexRef.current) > 1;

      rail.scrollTo({
        left: wrapped * rail.clientWidth,
        behavior: reduced || isWrap ? "auto" : "smooth",
      });
    },
    [count, reduced],
  );

  const onScroll = useCallback(() => {
    const rail = railRef.current;
    if (!rail || rail.clientWidth === 0) return;
    const next = Math.round(rail.scrollLeft / rail.clientWidth);
    indexRef.current = next;
    setIndex(next);
  }, []);

  /* ---------------------------------------------------------------------
     Video — only the slide on screen is allowed to play, and nothing is
     downloaded until it is (preload="none" + play on activation).
  --------------------------------------------------------------------- */
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === index && !reduced) {
        const attempt = video.play();
        // Autoplay can still be refused (iOS low-power); the poster stands in.
        if (attempt?.catch) attempt.catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [index, reduced]);

  /* ---------------------------------------------------------------------
     Mouse drag
  --------------------------------------------------------------------- */

  const onPointerDown = useCallback((event) => {
    // Touch scrolls natively, and better than anything written by hand.
    if (event.pointerType === "touch") return;

    const rail = railRef.current;
    dragRef.current = {
      active: true,
      captured: false,
      startX: event.clientX,
      startScroll: rail.scrollLeft,
      moved: false,
    };
  }, []);

  const onPointerMove = useCallback((event) => {
    const drag = dragRef.current;
    if (!drag.active) return;

    const dx = event.clientX - drag.startX;
    if (!drag.moved && Math.abs(dx) <= 4) return;

    /**
     * Pointer capture is taken here rather than on pointerdown, and only
     * once the pointer has actually moved.
     *
     * Capturing on pointerdown retargets the click that follows to this
     * container, so the slide's own <a> never receives it and clicking a
     * slide silently does nothing. Capturing late means a plain click stays
     * a plain click, while a real drag still gets the events it needs.
     */
    if (!drag.moved) {
      drag.moved = true;
      drag.captured = true;
      railRef.current.style.scrollSnapType = "none";
      railRef.current.setPointerCapture(event.pointerId);
    }

    railRef.current.scrollLeft = drag.startScroll - dx;
  }, []);

  const endDrag = useCallback(
    (event) => {
      const rail = railRef.current;
      const drag = dragRef.current;
      if (!rail || !drag.active) return;
      drag.active = false;

      // Nothing moved — this was a click, so leave it alone.
      if (!drag.captured) return;

      if (rail.hasPointerCapture?.(event.pointerId)) rail.releasePointerCapture(event.pointerId);
      rail.style.scrollSnapType = "";

      /**
       * Settle by intent, not by distance. Requiring a half-viewport drag to
       * change slide — which is what letting scroll-snap decide would mean —
       * feels broken on a full-screen reel.
       */
      const dx = event.clientX - drag.startX;
      const step = Math.abs(dx) > rail.clientWidth * DRAG_THRESHOLD ? (dx < 0 ? 1 : -1) : 0;
      goTo(indexRef.current + step);
    },
    [goTo],
  );

  /** A drag that ends on a slide must not also count as a click through. */
  const onClickCapture = useCallback((event) => {
    if (dragRef.current.moved) {
      event.preventDefault();
      event.stopPropagation();
    }
    dragRef.current.moved = false;
  }, []);

  /* ---------------------------------------------------------------------
     Touch — native scrolling handles the middle; these handlers only add
     the wrap at either end, which native scrolling cannot do.
  --------------------------------------------------------------------- */

  const onTouchStart = useCallback((event) => {
    const rail = railRef.current;
    touchRef.current = {
      startX: event.touches[0].clientX,
      atStart: rail.scrollLeft <= 1,
      atEnd: rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 1,
    };
  }, []);

  const onTouchEnd = useCallback(
    (event) => {
      const touch = touchRef.current;
      const endX = event.changedTouches[0].clientX;
      const dx = endX - touch.startX;

      if (touch.atEnd && dx < -SWIPE_PX) goTo(0);
      else if (touch.atStart && dx > SWIPE_PX) goTo(count - 1);
    },
    [count, goTo],
  );

  const onKeyDown = useCallback(
    (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(indexRef.current + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(indexRef.current - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goTo(count - 1);
      }
    },
    [count, goTo],
  );

  if (count === 0) return null;

  return (
    <section className={styles.stage} aria-roledescription="carousel" aria-label="Project showcase">
      <div
        className={styles.rail}
        ref={railRef}
        tabIndex={0}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClickCapture={onClickCapture}
      >
        {projects.map((project, i) => (
          <Link
            key={project._id}
            to={`/work/${project.slug}${filterQuery}`}
            className={styles.slide}
            aria-roledescription="slide"
            aria-label={`${project.title} — ${project.client}, ${project.year}. Slide ${i + 1} of ${count}.`}
            draggable={false}
          >
            {project.cover?.src ? (
              <img
                className={styles.backdrop}
                src={project.cover.src}
                alt=""
                aria-hidden="true"
                draggable={false}
                loading={i < 2 ? "eager" : "lazy"}
                decoding="async"
              />
            ) : null}

            {/* The first slide's frame is where the site-open <Intro> hands
                off: its phone morphs into exactly this rectangle. */}
            <span className={styles.phone} data-intro-target={i === 0 ? "" : undefined}>
              {project.video ? (
                <video
                  className={styles.media}
                  ref={(node) => {
                    videoRefs.current[i] = node;
                  }}
                  poster={project.cover?.src}
                  muted
                  loop
                  playsInline
                  // Nothing downloads until this slide becomes active.
                  preload="none"
                  aria-hidden="true"
                  tabIndex={-1}
                >
                  <source src={project.video.src} type="video/mp4" />
                </video>
              ) : project.cover?.src ? (
                <img
                  className={styles.media}
                  src={project.cover.src}
                  srcSet={project.cover.srcSet}
                  sizes="(max-width: 52.125rem) 100vw, 26rem"
                  alt=""
                  draggable={false}
                  loading={i < 2 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  decoding="async"
                />
              ) : (
                <span className={styles.fallback} aria-hidden="true" />
              )}
            </span>

            <span className={styles.scrim} aria-hidden="true" />

            <span className={styles.caption}>
              <span className={`${styles.index} u-meta`}>
                {pad(i + 1)} / {pad(count)}
                {project.video ? <span className={styles.badge}>Video</span> : null}
              </span>
              <span className={styles.title}>{project.title}</span>
              <span className={styles.meta}>
                <span className="u-meta">
                  {project.client} · {project.year}
                </span>
                <span className={styles.tags}>
                  {project.disciplines.slice(0, 3).map((slug) => (
                    <span key={slug} className="u-tag">
                      {labelFor(disciplineList, slug)}
                    </span>
                  ))}
                </span>
              </span>
              <span className={styles.cta}>
                View project <span aria-hidden="true">→</span>
              </span>
            </span>
          </Link>
        ))}
      </div>

      {/* Outside the rail, so dragging never lands on them. Never disabled —
          the reel wraps. */}
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => goTo(index - 1)}
          aria-label="Previous project"
        >
          ←
        </button>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => goTo(index + 1)}
          aria-label="Next project"
        >
          →
        </button>
      </div>

      <p className={`${styles.live} u-meta`} role="status" aria-live="polite">
        {projects[index]?.title} — {index + 1} of {count}
      </p>

      <div className={styles.progress} aria-hidden="true">
        <span
          className={styles.progressBar}
          style={{ transform: `scaleX(${(index + 1) / count})` }}
        />
      </div>

      <span className={`${styles.hint} u-meta`} aria-hidden="true">
        Swipe, drag or ← → · scroll down for more
      </span>
    </section>
  );
}

export default ProjectSlides;
