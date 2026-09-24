/**
 * Load-progress tracker for the intro.
 *
 * Reports how much of the first screen has actually loaded, so the intro's
 * counter and scrubber follow the visitor's real connection instead of a
 * timer. What counts:
 *
 * - the images passed in (the intro's own feed frames)
 * - every <img> inside `scope` that is on screen right now
 * - every <video> inside `scope` that is on screen and will actually load
 *   (playing, autoplay, or preload other than "none")
 * - web fonts (`document.fonts.ready`)
 * - the window `load` event — stylesheets, scripts, anything else in flight
 *
 * Off-screen and lazy media are left out: they would hold the intro for
 * things the visitor can't see yet.
 *
 * Progress is weighted — a video counts double — and a video reports partial
 * progress through its readyState, so the heaviest file on the page doesn't
 * sit at 0 until it is suddenly done.
 *
 * @param {object} options
 * @param {Iterable<HTMLImageElement>} [options.images]
 * @param {ParentNode|null} [options.scope]
 * @param {(fraction: number) => void} options.onProgress  0–1, only ever rises
 * @returns {() => void} stops tracking
 */
export function trackLoadProgress({ images = [], scope = null, onProgress }) {
  const tasks = [];
  const cleanups = [];
  let stopped = false;

  const report = () => {
    if (stopped) return;
    const total = tasks.reduce((sum, t) => sum + t.weight, 0);
    const done = tasks.reduce((sum, t) => sum + t.weight * t.value, 0);
    onProgress(total === 0 ? 1 : done / total);
  };

  /** Registers a task and returns its setter. Values only ever go up. */
  const task = (weight) => {
    const entry = { weight, value: 0 };
    tasks.push(entry);
    return (value) => {
      const next = Math.min(1, value);
      if (next <= entry.value) return;
      entry.value = next;
      report();
    };
  };

  const listen = (target, events, handler) => {
    events.forEach((name) => target.addEventListener(name, handler));
    cleanups.push(() => events.forEach((name) => target.removeEventListener(name, handler)));
  };

  /* ---- Images ---------------------------------------------------------- */

  const trackImage = (img) => {
    const set = task(1);
    // `complete` is also true for a broken image — that's done too.
    if (img.complete) set(1);
    else listen(img, ["load", "error"], () => set(1));
  };

  /* ---- Videos ---------------------------------------------------------- */

  // By readyState: nothing, metadata, first frame, enough to play, enough to finish.
  const VIDEO_STEPS = [0, 0.3, 0.6, 1, 1];

  const trackVideo = (video) => {
    const set = task(2);
    const update = () => set(video.error ? 1 : (VIDEO_STEPS[video.readyState] ?? 1));
    update();
    listen(video, ["loadedmetadata", "loadeddata", "canplay", "canplaythrough", "error"], update);
    // A failing <source> reports on itself, not on the video.
    video.querySelectorAll("source").forEach((source) => listen(source, ["error"], () => set(1)));
  };

  const onScreen = (el) => {
    const r = el.getBoundingClientRect();
    return (
      r.width > 0 &&
      r.height > 0 &&
      r.bottom > 0 &&
      r.right > 0 &&
      r.top < window.innerHeight &&
      r.left < window.innerWidth
    );
  };

  const willLoad = (video) => !video.paused || video.autoplay || video.preload !== "none";

  [...images].forEach(trackImage);

  if (scope) {
    scope.querySelectorAll("img").forEach((img) => onScreen(img) && trackImage(img));
    scope
      .querySelectorAll("video")
      .forEach((video) => onScreen(video) && willLoad(video) && trackVideo(video));
  }

  /* ---- Fonts and the rest of the page ----------------------------------- */

  if (document.fonts?.ready) {
    const set = task(1);
    document.fonts.ready.then(() => set(1), () => set(1));
  }

  {
    const set = task(1);
    if (document.readyState === "complete") set(1);
    else listen(window, ["load"], () => set(1));
  }

  report();

  return () => {
    stopped = true;
    cleanups.forEach((fn) => fn());
  };
}
