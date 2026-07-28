// sw.js — Service worker. M8 fix: hash-based cache name (no stale bundles).
// M9 fix: relative paths only (works under any subpath / GitHub Pages repo).
// M10 fix: NO auto-reload — pwa.js shows user-initiated toast.
// v4.0.2 — drop _partials.js (renamed to partials.js), drop missing icon-512.svg, drop non-existent assets

const VERSION = "v4.0.2";                     // bump on deploy to force refresh
const CACHE_NAME = `titan-dashboard-${VERSION}`;
const ASSETS = [
  "./",
  "./index.html",
  "./404.html",
  "./manifest.json",
  "./assets/css/tokens.css",
  "./assets/css/base.css",
  "./assets/css/shell.css",
  "./assets/css/components.css",
  "./assets/js/main.js",
  "./assets/js/theme.js",
  "./assets/js/store.js",
  "./assets/js/ssot.js",
  "./assets/js/auth.js",
  "./assets/js/router.js",
  "./assets/js/poller.js",
  "./assets/js/pwa.js",
  "./assets/js/lib/format.js",
  "./assets/js/lib/export.js",
  "./assets/js/charts/index.js",
  "./assets/js/views/partials.js",
  "./assets/js/views/owner.js",
  "./assets/js/views/legal.js",
  "./assets/js/views/marketing.js",
  "./assets/js/views/admin.js",
  "./assets/js/views/proyek.js",
  "./assets/js/views/media.js",
  "./assets/js/shell/sidebar.js",
  "./assets/js/shell/topbar.js",
  "./assets/img/icon-192.svg",
  "./data/people.json",
  "./data/kpi-perusahaan.json",
  "./data/kpi-divisi.json",
  "./data/kpi-personal.json",
  "./data/sow.json",
  "./data/jobdesk.json",
  "./data/reward.json",
  "./data/schema-map.json",
];

// Install: precache all assets. M11 fix: filter missing files (avoid addAll throwing on 404).
self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all(
      ASSETS.map((url) =>
        fetch(url, { cache: "no-cache" })
          .then((res) => (res.ok ? res : null))
          .catch(() => null)
      )
    ).then((responses) => {
      const valid = responses.filter(Boolean);
      const skipped = responses.length - valid.length;
      if (skipped > 0) console.warn("[sw] skipped", skipped, "missing assets");
      return caches.open(CACHE_NAME).then((cache) =>
        Promise.all(
          responses.map((res, i) => (res ? cache.put(ASSETS[i], res) : null))
        )
      );
    }).then(() => self.skipWaiting()).catch((e) => {
      console.error("[sw] install failed", e);
    })
  );
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first for assets, network-first for /api/*
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Network-first for Worker API (need fresh Notion data)
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(req).then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(req, clone)).catch(() => {});
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(req, clone)).catch(() => {});
        return res;
      }).catch(() => caches.match("./index.html"));
    })
  );
});

// M10 fix: listen for SKIP_WAITING from pwa.js
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});
