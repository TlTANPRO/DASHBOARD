// poller.js — Visibility-pause polling. Local mode = no-op (SW cache handles offline).

import { fetchAll, getMode } from "./ssot.js";

const POLL_INTERVAL = 60_000; // 60s

let timer = null;
let paused = false;

export function startPolling() {
  if (timer) return;
  if (getMode() !== "live") return; // local mode: static
  scheduleNext();
  document.addEventListener("visibilitychange", onVisibilityChange);
}

export function stopPolling() {
  if (timer) clearTimeout(timer);
  timer = null;
  document.removeEventListener("visibilitychange", onVisibilityChange);
}

function scheduleNext() {
  timer = setTimeout(async () => {
    if (paused || document.hidden) {
      scheduleNext();
      return;
    }
    try {
      await fetchAll();
    } catch (e) {
      console.warn("[poller] fetch failed", e);
    }
    scheduleNext();
  }, POLL_INTERVAL);
}

function onVisibilityChange() {
  if (document.hidden) {
    paused = true;
  } else {
    paused = false;
  }
}
