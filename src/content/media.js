/**
 * Sample media.
 *
 * Vertical (9:16) clips and their poster frames from Mixkit, downloaded into
 * `public/media/` so nothing is hotlinked. Mixkit's free licence allows
 * commercial use without attribution; the clips must not be redistributed
 * as stock on their own.
 *
 * Every file is `public/media/<name>.mp4` + `public/media/<name>.jpg`
 * (720×1280 poster). Clips are the 360p renditions, 0.6–1.5MB each, inside
 * the 2.5MB budget for a looping clip.
 *
 * TO REPLACE WITH REAL WORK: export the creator's own TikToks (without the
 * watermark — from the drafts or the original camera files), drop them into
 * `public/media/` under the same names, or add new names and point the
 * content files at them. Nothing else changes.
 */

const BASE = "/media";

/**
 * A still — a poster frame, used for covers, thumbnails and samples.
 *
 * @param {string} name   file stem in public/media/
 * @param {string} alt
 * @param {string} [ratio]
 */
export function poster(name, alt, ratio = "9/16") {
  return { id: name, src: `${BASE}/${name}.jpg`, alt, ratio };
}

/**
 * A clip — the shape the showcase, the case-study hero and the `video`
 * block all read.
 *
 * @param {string} name   file stem in public/media/
 */
export function clip(name) {
  return { src: `${BASE}/${name}.mp4`, poster: `${BASE}/${name}.jpg` };
}

/** The cursor-follow preview on /work — same clip, same poster. */
export function hoverClip(name) {
  return { url: `${BASE}/${name}.mp4`, posterUrl: `${BASE}/${name}.jpg` };
}
