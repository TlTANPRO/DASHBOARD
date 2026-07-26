// lib/saved-views.js — Saved views per user (localStorage)
const KEY = "dvb2-saved-views";

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function save(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {}
}

export function getViews(route) {
  const all = load();
  return all[route] || [];
}

export function saveView(route, name, config) {
  const all = load();
  if (!all[route]) all[route] = [];
  // Replace if same name
  const idx = all[route].findIndex((v) => v.name === name);
  if (idx >= 0) {
    all[route][idx] = { name, config, updatedAt: new Date().toISOString() };
  } else {
    all[route].push({ name, config, createdAt: new Date().toISOString() });
  }
  save(all);
}

export function deleteView(route, name) {
  const all = load();
  if (!all[route]) return;
  all[route] = all[route].filter((v) => v.name !== name);
  save(all);
}

export function applyView(route, name) {
  const views = getViews(route);
  return views.find((v) => v.name === name)?.config || null;
}
