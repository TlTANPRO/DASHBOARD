// store.js — Pub/sub for app state. No window globals (M5 fix).

const listeners = new Map(); // key -> Set<fn>

export function subscribe(key, fn) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key).add(fn);
  return () => listeners.get(key).delete(fn);
}

export function publish(key, value) {
  listeners.get(key)?.forEach(fn => {
    try { fn(value); } catch (e) { console.error(`[store] listener for ${key} threw`, e); }
  });
}

export function clear(key) {
  listeners.delete(key);
}

export function clearAll() {
  listeners.clear();
}
