// components/progress.js — top progress bar for fetch events

let bar = null;

export function initProgress() {
  if (bar) return bar;
  bar = document.createElement("div");
  bar.className = "top-progress";
  bar.setAttribute("role", "progressbar");
  bar.setAttribute("aria-label", "Loading");
  bar.innerHTML = '<div class="top-progress-bar"></div>';
  document.body.appendChild(bar);
  return bar;
}

let active = 0;

export function progressStart() {
  initProgress();
  active++;
  bar.classList.add("active");
}

export function progressEnd() {
  active = Math.max(0, active - 1);
  if (active === 0) {
    bar.classList.remove("active");
  }
}

export async function withProgress(fn) {
  progressStart();
  try {
    return await fn();
  } finally {
    progressEnd();
  }
}