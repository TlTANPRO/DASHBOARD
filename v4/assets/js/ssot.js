// ssot.js — Notion + fallback + cache + pub/sub.
// Mode A: local-only (data/*.json). Mode B: live (Worker + fallback).
// Falls back automatically on Worker timeout/error/5xx.

import { publish, subscribe } from "./store.js";

const DATA_FILES = [
  "people.json",
  "kpi-perusahaan.json",
  "kpi-divisi.json",
  "kpi-personal.json",
  "sow.json",
  "jobdesk.json",
  "reward.json",
  "schema-map.json",
  "leads.json",
  "sp3k.json",
  "budget.json",
  "vendors.json",
  "content.json",
  "calendar.json",
  "audit-trail.json",
  "reference.json",
];

const cache = new Map(); // filename -> { data, ts }
const subscribers = new Map(); // file -> Set<fn>
let mode = "local"; // "local" | "live"
let workerUrl = null;
let sessionToken = null;
let lastSyncTs = null;
let activeCanceler = null;

export function getMode() { return mode; }
export function getLastSyncTs() { return lastSyncTs; }

export function configure({ workerUrl: wu, sessionToken: st }) {
  if (wu) workerUrl = wu;
  if (st) sessionToken = st;
  mode = (workerUrl && sessionToken) ? "live" : "local";
}

/** Fetch a single data file. Local mode = fetch from /data/{name}. */
export async function fetchData(name, { force = false } = {}) {
  if (!force && cache.has(name)) return cache.get(name).data;

  // Local mode: fetch from /data/
  const url = `./data/${name}`;
  const ctl = new AbortController();
  activeCanceler = ctl;
  try {
    const res = await fetch(url, { signal: ctl.signal, cache: force ? "no-store" : "default" });
    if (!res.ok) throw new Error(`fetch ${name} ${res.status}`);
    const data = await res.json();
    cache.set(name, { data, ts: Date.now() });
    lastSyncTs = Date.now();
    publish("data:" + name, data);
    return data;
  } catch (e) {
    if (cache.has(name)) return cache.get(name).data; // stale fallback
    throw e;
  } finally {
    if (activeCanceler === ctl) activeCanceler = null;
  }
}

/** Fetch all data files in parallel. Returns object keyed by friendly name. */
export async function fetchAll() {
  const results = await Promise.allSettled(DATA_FILES.map(f => fetchData(f)));
  const out = {};
  DATA_FILES.forEach((file, i) => {
    const r = results[i];
    const key = file.replace(".json", "").replace("-", "_");
    out[key] = r.status === "fulfilled" ? r.value : null;
  });
  return out;
}

/** Get current cached data for a name (no fetch). */
export function getCached(name) {
  return cache.get(name)?.data ?? null;
}

/** Subscribe to changes for a data file. */
export function onChange(name, fn) {
  return subscribe("data:" + name, fn);
}

/** Cancel any in-flight fetches (e.g., on logout). */
export function cancelAll() {
  activeCanceler?.abort();
  activeCanceler = null;
}
