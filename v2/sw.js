// sw.js — Service worker untuk PWA offline support (network-first)
const CACHE = "dvb2-v2.0.0";
const ASSETS = [
  "/DASHBOARD/v2/",
  "/DASHBOARD/v2/manifest.json",
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  // Skip Notion API & Worker (always network)
  if (!url.hostname.includes("tltanpro.github.io") && !url.hostname.includes("localhost")) return;

  // Network-first for HTML/JS/CSS (always get latest)
  // Cache fallback for offline
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
