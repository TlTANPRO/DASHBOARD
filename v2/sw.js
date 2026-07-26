// sw.js — Service worker untuk PWA offline support
const CACHE = "dvb2-v1.0.0";
const ASSETS = [
  "/DASHBOARD/v2/",
  "/DASHBOARD/v2/manifest.json",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
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
  // Skip Notion API & Worker
  const url = new URL(e.request.url);
  if (url.hostname !== "tltanpro.github.io" && !url.hostname.includes("localhost")) return;

  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetched = fetch(e.request).then((res) => {
        const copy = res.clone();
        if (res.ok) caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      }).catch(() => cached);
      return cached || fetched;
    })
  );
});
