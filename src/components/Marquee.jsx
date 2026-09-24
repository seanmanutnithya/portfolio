import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { loadMotion } from "@/lib/motion";

import styles from "./Marquee.module.css";

/**
 * S02 — the marquee band.
 *
 * Infinite x-scroll, direction flips with scroll velocity, pauses on hover.
 * Under reduced motion it renders as a static, non-clipped band of the same
 * type, which is still useful content rather than a disabled feature.
 */
export function Marquee({ items, separator = "✦", speed = 28 }) {
  const reduced = useReducedMotion();
  const trackRef = useRef(null);
  const tweenRef = useRef(null);

  useEffect(() => {
    if (reduced) return undefined;
    const track = trackRef.current;
    if (!track) return undefined;

    let cancelled = false;
    let context = null;

    loadMotion().then((motion) => {
      if (!motion || cancelled || !trackRef.current) return;
      const { gsap, ScrollTrigger } = motion;

      context = gsap.context(() => {
        const tween = gsap.to(track, {
          xPercent: -50,
          ease: "none",
          duration: speed,
          repeat: -1,
        });
        tweenRef.current = tween;

        // Flip direction to match the way the page is moving.
        ScrollTrigger.create({
          trigger: track,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const direction = self.direction === -1 ? -1 : 1;
            gsap.to(tween, { timeScale: direction, duration: 0.25, overwrite: true });
          },
        });
      }, track);
    });

    return () => {
      cancelled = true;
      tweenRef.current = null;
      context?.revert();
    };
  }, [reduced, speed]);

  const pause = () => tweenRef.current?.pause();
  const resume = () => tweenRef.current?.play();

  const sequence = (
    <>
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className={styles.item}>
          {item}
          <span className={styles.sep} aria-hidden="true">
            {separator}
          </span>
        </span>
      ))}
    </>
  );

  return (
    <div
      className={styles.band}
      data-static={reduced ? "true" : "false"}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
    >
      <div className={styles.track} ref={trackRef}>
        {sequence}
        {/* Second pass makes the -50% loop seamless. Hidden from AT. */}
        <span aria-hidden="true" className={styles.clone}>
          {sequence}
        </span>
      </div>
    </div>
  );
}

export default Marquee;
