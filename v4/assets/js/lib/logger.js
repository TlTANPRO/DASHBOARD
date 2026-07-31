// lib/logger.js — Single-gate logger. Replaces console.error/warn/log.
// Levels: debug < info < warn < error. Gated by DEV (Vite) or ?debug=1 query.

const LEVEL = { debug: 10, info: 20, warn: 30, error: 40 };
const ACTIVE_LEVEL = (() => {
  try {
    const debug = new URLSearchParams(location.search).get("debug");
    if (debug === "1" || debug === "true") return LEVEL.debug;
  } catch {}
  // Dev: Vite import.meta.env.DEV; ESM has no access here, default warn+ in prod
  return LEVEL.warn;
})();

const tag = (level, tagStr) => `[${level.toUpperCase()}] ${tagStr ? `[${tagStr}] ` : ""}`;

function emit(level, scope, args) {
  if (LEVEL[level] < ACTIVE_LEVEL) return;
  const prefix = tag(level, scope);
  switch (level) {
    case "debug": console.debug(prefix, ...args); break;
    case "info":  console.info(prefix, ...args); break;
    case "warn":  console.warn(prefix, ...args); break;
    case "error": console.error(prefix, ...args); break;
  }
}

export function createLogger(scope) {
  return {
    debug: (...a) => emit("debug", scope, a),
    info:  (...a) => emit("info",  scope, a),
    warn:  (...a) => emit("warn",  scope, a),
    error: (...a) => emit("error", scope, a),
  };
}

export const logger = createLogger("app");
