import { useCallback, useEffect, useRef, useState } from "react";

import { useCanHoverPreview } from "@/hooks/useReducedMotion";
import { loadMotion } from "@/lib/motion";

const DWELL_MS = 200;

/**
 * Cursor-following preview for archive rows.
 *
 * - Disabled entirely below 1024px, on coarse pointers, and under
 *   reduced motion — the hook reports `enabled: false` and the caller skips
 *   rendering the preview element at all.
 * - The poster shows immediately; the video only starts loading after a
 *   200ms dwell, so skimming the list never pulls media.
 * - Position is driven by `gsap.quickTo` when GSAP is available, and by a
 *   direct transform write otherwise.
 */
export function useHoverMedia() {
  const enabled = useCanHoverPreview();

  const [active, setActive] = useState(null); // { id, cover, hoverVideo }
  const [showVideo, setShowVideo] = useState(false);

  const elementRef = useRef(null);
  const quickRef = useRef(null);
  const dwellRef = useRef(null);
  const pointRef = useRef({ x: 0, y: 0 });

  // Build the quickTo setters once the element exists.
  useEffect(() => {
    if (!enabled || !elementRef.current) return undefined;

    let cancelled = false;
    loadMotion().then((motion) => {
      if (cancelled || !motion || !elementRef.current) return;
      const { gsap } = motion;
      quickRef.current = {
        x: gsap.quickTo(elementRef.current, "x", { duration: 0.45, ease: "power3.out" }),
        y: gsap.quickTo(elementRef.current, "y", { duration: 0.45, ease: "power3.out" }),
      };
    });

    return () => {
      cancelled = true;
      quickRef.current = null;
    };
  }, [enabled, active]);

  const move = useCallback(
    (event) => {
      if (!enabled) return;
      const x = event.clientX + 24;
      const y = event.clientY - 40;
      pointRef.current = { x, y };

      if (quickRef.current) {
        quickRef.current.x(x);
        quickRef.current.y(y);
      } else if (elementRef.current) {
        elementRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    },
    [enabled],
  );

  const enter = useCallback(
    (item, event) => {
      if (!enabled) return;
      setActive(item);
      setShowVideo(false);
      if (event) move(event);

      clearTimeout(dwellRef.current);
      if (item?.hoverVideo) {
        dwellRef.current = setTimeout(() => setShowVideo(true), DWELL_MS);
      }
    },
    [enabled, move],
  );

  const leave = useCallback(() => {
    clearTimeout(dwellRef.current);
    setActive(null);
    setShowVideo(false);
  }, []);

  useEffect(() => () => clearTimeout(dwellRef.current), []);

  return { enabled, active, showVideo, elementRef, enter, leave, move };
}
