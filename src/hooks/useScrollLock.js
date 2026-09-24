import { useEffect } from "react";

import { useLenis } from "@/hooks/useLenis";

/**
 * Locks body scroll while an overlay is open — the search overlay and the
 * mobile menu both use it.
 *
 * Stops Lenis as well as the body, otherwise the smooth-scroll loop keeps
 * running underneath the overlay. Compensates for the scrollbar so the page
 * behind does not shift by its width on open.
 */
export function useScrollLock(locked) {
  const { stop, start } = useLenis();

  useEffect(() => {
    if (!locked) return undefined;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    stop();

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
      start();
    };
  }, [locked, stop, start]);
}

/**
 * Traps focus inside a container and restores it to the trigger on close.
 * Required by the search overlay's `aria-modal` contract.
 */
export function useFocusTrap(containerRef, active) {
  useEffect(() => {
    if (!active || !containerRef.current) return undefined;

    const container = containerRef.current;
    const previouslyFocused = document.activeElement;

    const focusable = () =>
      [
        ...container.querySelectorAll(
          'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
        ),
      ].filter((el) => el.offsetParent !== null);

    const onKeyDown = (event) => {
      if (event.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    container.addEventListener("keydown", onKeyDown);
    return () => {
      container.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [containerRef, active]);
}
