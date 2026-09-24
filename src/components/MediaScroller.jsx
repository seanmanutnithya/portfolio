import { useCallback, useEffect, useRef } from "react";

import Media from "@/components/Media";

import styles from "./MediaScroller.module.css";

/**
 * Full-bleed horizontal media scroller.
 *
 * Takes drag, wheel-x, and — because it is a real scroll container with
 * focusable children — keyboard and trackpad for free. Vertical wheel is
 * translated to horizontal only while the rail has somewhere left to go, so
 * reaching the end hands the scroll back to the page instead of trapping it.
 */
export function MediaScroller({ items, kind = "image", label = "Media" }) {
  const railRef = useRef(null);
  const dragRef = useRef({ active: false, startX: 0, startScroll: 0, moved: false });

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;

    const onWheel = (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

      const atStart = rail.scrollLeft <= 0;
      const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 1;
      if ((event.deltaY < 0 && atStart) || (event.deltaY > 0 && atEnd)) return;

      event.preventDefault();
      rail.scrollLeft += event.deltaY;
    };

    rail.addEventListener("wheel", onWheel, { passive: false });
    return () => rail.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = useCallback((event) => {
    if (event.pointerType === "touch") return; // native touch scrolling is better
    const rail = railRef.current;
    dragRef.current = {
      active: true,
      startX: event.clientX,
      startScroll: rail.scrollLeft,
      moved: false,
    };
    rail.setPointerCapture(event.pointerId);
  }, []);

  const onPointerMove = useCallback((event) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    const dx = event.clientX - drag.startX;
    if (Math.abs(dx) > 3) drag.moved = true;
    railRef.current.scrollLeft = drag.startScroll - dx;
  }, []);

  const endDrag = useCallback((event) => {
    const rail = railRef.current;
    if (rail?.hasPointerCapture?.(event.pointerId)) rail.releasePointerCapture(event.pointerId);
    dragRef.current.active = false;
  }, []);

  // Suppress the click that follows a drag so dragging never opens a link.
  const onClickCapture = useCallback((event) => {
    if (dragRef.current.moved) {
      event.preventDefault();
      event.stopPropagation();
      dragRef.current.moved = false;
    }
  }, []);

  return (
    <div
      className={styles.rail}
      ref={railRef}
      role="group"
      aria-label={label}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={onClickCapture}
    >
      {items.map((item, index) => (
        <div key={item.id ?? index} className={styles.cell} data-ratio={item.ratio}>
          <Media media={item} kind={kind} />
        </div>
      ))}
    </div>
  );
}

export default MediaScroller;
