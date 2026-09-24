import { useEffect, useRef } from "react";

import { loadMotion } from "@/lib/motion";

/**
 * Scroll-triggered stagger-in for a group of siblings.
 *
 * Deliberately a `gsap.from()`: the content is fully visible before the
 * motion layer loads, so the page is correct without JS and merely less
 * animated. The alternative (hiding in CSS, revealing in JS) breaks the page
 * for anyone the bundle never reaches.
 *
 * Renders a plain wrapper and does nothing at all under reduced motion.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className = "",
  selector,
  stagger = 0.04,
  y = 18,
  start = "top 85%",
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let cancelled = false;
    let context = null;

    loadMotion().then((motion) => {
      if (!motion || cancelled || !ref.current) return;
      const { gsap } = motion;

      /**
       * Anything already on screen when the motion layer loads is left
       * alone.
       *
       * A `start: "top 85%"` trigger would otherwise hide content sitting
       * between 85% and 100% of the viewport — visible to the reader, but
       * at opacity 0 until they scroll. Content that is already in view has
       * nothing to animate in from.
       */
      if (el.getBoundingClientRect().top < window.innerHeight) return;

      context = gsap.context(() => {
        const targets = selector ? el.querySelectorAll(selector) : el.children;
        if (!targets || targets.length === 0) return;

        gsap.from(targets, {
          opacity: 0,
          y,
          duration: 0.5,
          ease: "power3.out",
          stagger,
          scrollTrigger: { trigger: el, start, once: true },
        });
      }, el);
    });

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, [selector, stagger, y, start]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}

export default Reveal;
