import { Link } from "react-router-dom";

import Media from "@/components/Media";
import MediaScroller from "@/components/MediaScroller";
import { projects } from "@/content/projects";

import styles from "./Blocks.module.css";

/**
 * The body renderer, shared by project case studies and journal posts.
 *
 * A switch map over `_type`. An unknown type renders nothing and does not
 * throw — the CMS is allowed to be ahead of the front end, which is the
 * whole point of a block model.
 */
export function Blocks({ blocks }) {
  if (!blocks?.length) return null;

  return (
    <div className={styles.body}>
      {blocks.map((block, index) => {
        const key = `${block._type}-${index}`;

        switch (block._type) {
          case "text":
            return (
              <p key={key} className={`${styles.text} u-prose`}>
                {block.text}
              </p>
            );

          case "image":
            return (
              <figure key={key} className={styles.figure}>
                <Media media={block.media} />
                {block.caption ? (
                  <figcaption className="u-meta">{block.caption}</figcaption>
                ) : null}
              </figure>
            );

          case "video":
            return (
              <figure key={key} className={styles.figure}>
                {block.media?.src ? (
                  <video
                    className={styles.video}
                    src={block.media.src}
                    poster={block.media.poster}
                    controls
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <Media media={block.media} kind="video" />
                )}
                {block.caption ? (
                  <figcaption className="u-meta">{block.caption}</figcaption>
                ) : null}
              </figure>
            );

          case "tiktok":
            // A live post through TikTok's embed player. `videoId` is the
            // number at the end of the post URL (…/video/<videoId>).
            if (!block.videoId) return null;
            return (
              <figure key={key} className={styles.figure}>
                <div className={styles.tiktok}>
                  <iframe
                    src={`https://www.tiktok.com/player/v1/${block.videoId}`}
                    title={block.title ?? "TikTok video"}
                    allow="fullscreen; encrypted-media"
                    loading="lazy"
                  />
                </div>
                {block.caption ? (
                  <figcaption className="u-meta">{block.caption}</figcaption>
                ) : null}
              </figure>
            );

          case "duo":
            return (
              <div key={key} className={styles.duo}>
                {block.media.map((media) => (
                  <Media key={media.id} media={media} />
                ))}
              </div>
            );

          case "scroller":
            return (
              <div key={key} className={styles.scroller}>
                <span className="u-meta">Drag or scroll →</span>
                <MediaScroller items={block.media} label="Project media" />
              </div>
            );

          case "pullquote":
            return (
              <blockquote key={key} className={styles.quote}>
                {block.text}
              </blockquote>
            );

          case "projectLink": {
            const project = projects.find((p) => p.slug === block.slug);
            if (!project) return null;
            return (
              <Link key={key} to={`/work/${project.slug}`} className={styles.projectLink}>
                <span className="u-meta">Related project</span>
                <span className={styles.projectLinkTitle}>{project.title}</span>
                <span className="u-meta">
                  {project.client} · {project.year} <span aria-hidden="true">→</span>
                </span>
              </Link>
            );
          }

          default:
            // Unknown block type — ignored silently, by design.
            return null;
        }
      })}
    </div>
  );
}

export default Blocks;
