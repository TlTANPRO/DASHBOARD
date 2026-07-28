// router.js — Hash router. Supports #/{divisi} + #/{divisi}/{section}.

import { publish } from "./store.js";

const routes = new Map();

export function register(path, handler) {
  routes.set(path, handler);
}

export function navigate(path) {
  if (location.hash === "#" + path) {
    handleRoute();
    return;
  }
  location.hash = "#" + path;
}

export function currentPath() {
  return location.hash.replace(/^#/, "") || "/owner";
}

function parsePath(path) {
  const parts = path.replace(/^\//, "").split("/").filter(Boolean);
  return { divisi: parts[0] || "owner", section: parts[1] || null };
}

export async function handleRoute() {
  const path = currentPath();
  const parsed = parsePath(path);
  publish("route:changed", parsed);
  const handler = routes.get("/" + parsed.divisi) || routes.get("/*");
  if (handler) {
    try {
      await handler(parsed);
    } catch (e) {
      console.error("[router] handler failed", e);
      publish("route:error", { error: e, path: parsed });
    }
  }
}

export function start() {
  window.addEventListener("hashchange", handleRoute);
  if (!location.hash) location.hash = "#/owner";
  handleRoute();
}
