import { createPortal } from "react-dom";

import Media from "@/components/Media";

import styles from "./HoverMedia.module.css";

/**
 * The cursor-follow preview for archive rows.
 *
 * Portalled to `<body>` so it is never clipped by a row's overflow or
 * stacking context. Renders nothing at all when previews are disabled
 * (< 1024px, coarse pointer, or reduced motion) — the markup does not exist
 * rather than being hidden.
 *
 * @param {{ hover: ReturnType<typeof import('@/hooks/useHoverMedia').useHoverMedia> }} props
 */
export function HoverMedia({ hover }) {
  if (!hover?.enabled || !hover.active) return null;

  const { active, showVideo, elementRef } = hover;
  const video = active.hoverVideo;

  return createPortal(
    <div className={styles.preview} ref={elementRef} aria-hidden="true">
      <div className={styles.inner}>
        <Media media={active.cover} priority />

        {/* The mp4 only mounts after the 200ms dwell, and only if the
            project actually has one on file. */}
        {showVideo && video?.url ? (
          <video
            className={styles.video}
            src={video.url}
            poster={video.posterUrl}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
          />
        ) : null}

        <span className={styles.label}>
          {active.client} · {active.year}
        </span>
      </div>
    </div>,
    document.body,
  );
}

export default HoverMedia;
