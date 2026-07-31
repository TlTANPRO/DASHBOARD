// lib/reveal.js — Entry choreography. IntersectionObserver + ease-out-expo stagger.
// Spec: per design-canon-v1 axis-4 motion. Respects prefers-reduced-motion.
// Pattern: any [data-reveal] descendant of a [data-reveal-root] is observed and revealed.

const prefersReduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const STAGGER_STEP = 50; // ms between siblings
const DURATION = 700;    // ms

let io;
function getIO() {
  if (io) return io;
  io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        applyReveal(el);
        io.unobserve(el);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
  );
  return io;
}

function applyReveal(el) {
  const idx = Number(el.dataset.reveal || 0);
  el.style.transition = `opacity var(--duration-slow) var(--ease-out-expo) ${idx * STAGGER_STEP}ms, transform var(--duration-slow) var(--ease-out-expo) ${idx * STAGGER_STEP}ms`;
  el.style.opacity = "1";
  el.style.transform = "translateY(0)";
}

/**
 * reveal(root, opts) — observe all [data-reveal] in root.
 * opts: { stagger: ms, threshold: 0..1 }
 */
export function reveal(root = document.body, opts = {}) {
  if (prefersReduce()) return;
  const observer = getIO();
  const stagger = opts.stagger ?? STAGGER_STEP;
  const items = root.querySelectorAll("[data-reveal]");
  let i = 0;
  for (const el of items) {
    el.dataset.reveal = String(i++);
    el.style.opacity = "0";
    el.style.transform = `translateY(var(--motion-rise, 12px))`;
    observer.observe(el);
  }
  return { count: items.length, stagger };
}

/** markup helper: return props object that opts element into reveal entry. */
export function revealAttr(index = 0) {
  return { dataset: { reveal: String(index) } };
}

/**
 * markForReveal(container, opts) — stamp data-reveal indices on direct top-level children.
 * Useful for views that append many <section> + scorecards to a container.
 * Skips elements with id "divisi-hero" or class "banner" (already positioned/styled).
 * Returns the count stamped.
 */
export function markForReveal(container, opts = {}) {
  if (!container) return 0;
  const skipIds = new Set(opts.skipIds || ["divisi-hero"]);
  const skipClasses = new Set(opts.skipClasses || ["banner"]);
  let i = 0;
  for (const child of container.children) {
    if (skipIds.has(child.id)) continue;
    if ([...child.classList].some(c => skipClasses.has(c))) continue;
    child.dataset.reveal = String(i++);
  }
  return i;
}
