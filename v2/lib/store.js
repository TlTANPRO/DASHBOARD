// lib/store.js — minimal pubsub state store

export function createStore(initial = {}) {
  const state = { ...initial };
  const listeners = new Map(); // key -> Set<fn>

  return {
    get(key) {
      return state[key];
    },
    set(key, value) {
      const prev = state[key];
      state[key] = value;
      if (prev !== value) {
        (listeners.get(key) || []).forEach((fn) => fn(value, prev));
        (listeners.get("*") || []).forEach((fn) => fn(key, value, prev));
      }
    },
    update(key, updater) {
      this.set(key, updater(state[key]));
    },
    subscribe(key, fn) {
      if (!listeners.has(key)) listeners.set(key, new Set());
      listeners.get(key).add(fn);
      return () => listeners.get(key).delete(fn);
    },
    snapshot() {
      return { ...state };
    },
  };
}
