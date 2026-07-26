// lib/cache.js — TTL cache with revalidation

const stores = new Map(); // key -> { data, expires, inflight }

export function cacheTTL(key, ttlSec = 60, fetcher) {
  const now = Date.now();
  const entry = stores.get(key);
  if (entry && entry.expires > now) {
    return Promise.resolve(entry.data);
  }
  // Dedupe in-flight
  if (entry?.inflight) return entry.inflight;
  const inflight = fetcher()
    .then((data) => {
      stores.set(key, { data, expires: now + ttlSec * 1000, inflight: null });
      return data;
    })
    .catch((err) => {
      // Keep stale on error for 30s
      if (entry) {
        stores.set(key, { ...entry, expires: now + 30 * 1000, inflight: null });
      }
      throw err;
    });
  stores.set(key, { ...(entry || {}), inflight });
  return inflight;
}

export function invalidate(key) {
  if (key) stores.delete(key);
  else stores.clear();
}

export function revalidate(key) {
  const entry = stores.get(key);
  if (entry) entry.expires = 0;
}