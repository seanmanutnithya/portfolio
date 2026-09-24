import { hashIndex } from "@/lib/format";

import styles from "./Media.module.css";

const VARIANTS = 6;

/**
 * The single media primitive.
 *
 * With `media.src` it renders a real image (lazy below the fold, LQIP
 * blur-up via `media.lqip`). Without one it renders a deterministic
 * procedural plate — the same id always produces the same plate, so the
 * layout reads as designed rather than broken while the archive is empty.
 *
 * Dropping real URLs into the content files is the whole migration; no
 * component changes.
 *
 * @param {object} props
 * @param {{ id: string, src: string|null, alt: string, ratio?: string, lqip?: string }} props.media
 * @param {boolean} [props.priority] Skip lazy-loading — hero media only.
 * @param {'image'|'video'} [props.kind]
 * @param {boolean} [props.caption] Set false where the page draws its own
 *   label over the slot, so the two don't stack.
 * @param {string} [props.ratio] Overrides `media.ratio` — used where tiles
 *   must share one shape regardless of the source image.
 * @param {string} [props.sizes] Always pass this when the slot is smaller
 *   than the viewport, or the browser assumes 100vw and picks the largest
 *   candidate in the srcset.
 */
export function Media({
  media,
  priority = false,
  kind = "image",
  className = "",
  sizes,
  caption = true,
  ratio: ratioOverride,
}) {
  if (!media) return null;

  // An override lets a grid normalise mixed source ratios to one tile shape.
  const ratio = ratioOverride ?? media.ratio ?? "4/3";
  const style = { "--ratio": ratio.replace("/", " / ") };

  if (media.src) {
    return (
      <figure className={`${styles.frame} ${className}`} style={style}>
        <img
          className={styles.img}
          src={media.src}
          srcSet={media.srcSet}
          sizes={sizes}
          alt={media.alt ?? ""}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          style={media.lqip ? { backgroundImage: `url(${media.lqip})` } : undefined}
        />
      </figure>
    );
  }

  const variant = hashIndex(media.id ?? media.alt ?? "plate", VARIANTS);

  return (
    <figure
      className={`${styles.frame} ${styles.plate} ${className}`}
      style={style}
      data-variant={variant}
      role="img"
      aria-label={media.alt ?? "Placeholder"}
    >
      <span className={styles.grain} aria-hidden="true" />
      <span className={styles.mark} aria-hidden="true">
        {kind === "video" ? "▶" : "✦"}
      </span>
      {caption ? (
        <span className={styles.caption} aria-hidden="true">
          <span className={styles.captionKind}>{kind === "video" ? "MP4" : "IMG"}</span>
          <span className={styles.captionAlt}>{media.alt}</span>
        </span>
      ) : null}
    </figure>
  );
}

export default Media;
