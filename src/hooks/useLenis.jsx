import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { loadMotion, prefersReducedMotion } from "@/lib/motion";

const LenisContext = createContext(null);

/**
 * Smooth scroll provider.
 *
 * Lenis is dynamically imported and driven by `gsap.ticker` — one RAF loop
 * for the whole app, not two — and pushes every scroll into
 * `ScrollTrigger.update()`.
 *
 * Under reduced motion no instance is ever created; the page uses native
 * scrolling and every consumer falls back to `window.scrollTo`.
 */
export function LenisProvider({ children }) {
  const [lenis, setLenis] = useState(null);
  const lenisRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    let cancelled = false;
    let instance = null;
    let teardown = null;

    (async () => {
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;

      instance = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
      lenisRef.current = instance;
      setLenis(instance);

      const motion = await loadMotion();
      if (cancelled) return;

      if (motion) {
        const { gsap, ScrollTrigger } = motion;
        const onScroll = () => ScrollTrigger.update();
        const tick = (time) => instance.raf(time * 1000);

        instance.on("scroll", onScroll);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        teardown = () => {
          instance.off("scroll", onScroll);
          gsap.ticker.remove(tick);
        };
      } else {
        let frame = requestAnimationFrame(function raf(time) {
          instance.raf(time);
          frame = requestAnimationFrame(raf);
        });
        teardown = () => cancelAnimationFrame(frame);
      }
    })();

    return () => {
      cancelled = true;
      teardown?.();
      instance?.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  /** Works with or without a Lenis instance. */
  const scrollTo = useCallback((target, options = {}) => {
    const current = lenisRef.current;
    if (current) {
      current.scrollTo(target, options);
      return;
    }
    if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: options.immediate ? "auto" : "smooth" });
      return;
    }
    const el = typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: options.immediate ? "auto" : "smooth", block: "start" });
  }, []);

  const stop = useCallback(() => lenisRef.current?.stop(), []);
  const start = useCallback(() => lenisRef.current?.start(), []);

  const value = useMemo(() => ({ lenis, scrollTo, stop, start }), [lenis, scrollTo, stop, start]);

  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>;
}

export function useLenis() {
  const context = useContext(LenisContext);
  if (!context) {
    throw new Error("useLenis must be used inside <LenisProvider>");
  }
  return context;
}
