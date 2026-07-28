// tests/run.mjs — V4 dashboard integrity tests (no deps, pure Node).
// Asserts critical invariants for PWA fix and the renamed partials module.
// Run: node tests/run.mjs   (or `npm test` after package.json update)

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

let pass = 0, fail = 0;
const failures = [];

function test(name, fn) {
  try {
    const result = fn();
    if (result === true || result === undefined) {
      pass++;
      console.log(`  ✓ ${name}`);
    } else {
      fail++;
      failures.push({ name, error: result });
      console.log(`  ✗ ${name}: ${result}`);
    }
  } catch (e) {
    fail++;
    failures.push({ name, error: e.message });
    console.log(`  ✗ ${name}: ${e.message}`);
  }
}

function read(rel) {
  return readFileSync(join(ROOT, rel), "utf8");
}

function grep(content, needle) {
  return content.includes(needle);
}

function listJs(dir) {
  const out = [];
  function walk(d) {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (name === "node_modules" || name === "tests" || name === ".git") continue;
      if (name.startsWith(".")) continue;
      const s = statSync(p);
      if (s.isDirectory()) walk(p);
      else if (name.endsWith(".js") && !name.includes("__check") && !name.endsWith(".bak.js")) out.push(p);
    }
  }
  walk(join(ROOT, dir));
  return out;
}

console.log("V4 Dashboard Integrity Tests");
console.log("=".repeat(60));

// Group 1: Critical patches (pwa.js + sw.js)
console.log("\n[1] pwa.js (M11/M12 PWA fix)");
const pwa = read("assets/js/pwa.js");
test("UPDATE_DISMISS_KEY constant", () => grep(pwa, 'UPDATE_DISMISS_KEY = "pwa-update-dismissed-at"'));
test("UPDATE_DISMISS_HOURS = 1", () => grep(pwa, "UPDATE_DISMISS_HOURS = 1"));
test("dismissedRecent 1h check", () => grep(pwa, "UPDATE_DISMISS_HOURS * 3600_000"));
test("suppressed log message", () => grep(pwa, "update suppressed (dismissed recently)"));
test("dismiss writes localStorage", () => {
  const matches = pwa.match(/localStorage\.setItem\(UPDATE_DISMISS_KEY/g) || [];
  return matches.length === 2 ? true : `expected 2 occurrences, got ${matches.length}`;
});
test("confirm handler always reloads", () => {
  // M12 fix: removed early return when updateWaitingWorker is null
  return !grep(pwa, "if (!updateWaitingWorker) {") ? true : "early return still present";
});
test("bootTime variable defined", () => grep(pwa, "let bootTime = Date.now()"));
test("30s grace threshold", () => grep(pwa, "30_000"));
test("10s install delay", () => grep(pwa, "10_000"));

console.log("\n[2] sw.js (M11 SW addAll fix)");
const sw = read("sw.js");
test("VERSION = v4.0.2", () => grep(sw, 'const VERSION = "v4.0.2"'));
test("partials.js in ASSETS (not _partials)", () => {
  if (grep(sw, "./assets/js/views/_partials.js")) return "_partials.js still in ASSETS";
  if (!grep(sw, "./assets/js/views/partials.js")) return "partials.js missing from ASSETS";
  return true;
});
test("no icon-512.svg (was 404)", () => !grep(sw, "./assets/img/icon-512.svg"));
test("icon-192.svg in ASSETS", () => grep(sw, "./assets/img/icon-192.svg"));
test("per-asset fetch (M11)", () => grep(sw, 'fetch(url, { cache: "no-cache" })'));
test("install catch+log", () => grep(sw, 'console.error("[sw] install failed"'));

console.log("\n[3] partials.js exists + content");
test("partials.js exists", () => existsSync(join(ROOT, "assets/js/views/partials.js")));
test("_partials.js orphan removed", () => !existsSync(join(ROOT, "assets/js/views/_partials.js")));
test(".bak files cleaned", () => {
  const d = join(ROOT, "assets/js");
  function has(dir) {
    for (const n of readdirSync(dir)) {
      if (n.endsWith(".bak.js") || n.endsWith(".__check.mjs")) return true;
      const p = join(dir, n);
      if (statSync(p).isDirectory() && has(p)) return true;
    }
    return false;
  }
  return !has(d) ? true : ".bak or __check file present";
});
test("no stale _partials references", () => {
  const files = listJs("assets/js");
  for (const f of files) {
    if (f.endsWith("_partials.js")) continue;
    const txt = readFileSync(f, "utf8");
    if (txt.includes("_partials")) {
      return `stale ref in ${f.replace(ROOT, "").slice(1)}`;
    }
  }
  return true;
});

console.log("\n[4] index.html a11y (DevTools warnings fix)");
const html = read("index.html");
test("topbar-search has hidden attr", () => /id="topbar-search"[^>]*\bhidden\b/.test(html) || /\bhidden\b[^>]*id="topbar-search"/.test(html));
test("global-search has name attr", () => grep(html, 'name="global-search"'));
test("login-pic has name attr", () => grep(html, 'name="login-pic"'));
test("login-pin has name attr", () => grep(html, 'name="login-pin"'));
test("cmdk-input has name attr (in partials)", () => {
  const p = read("assets/js/views/partials.js");
  return grep(p, 'name="cmdk-input"');
});

console.log("\n[4b] CSS [hidden] override (M12 fix)");
const css = read("assets/css/components.css");
test(".search-palette[hidden] display:none", () => /\.search-palette\[hidden\]\s*\{\s*display:\s*none/.test(css));
test(".pwa-prompt[hidden] display:none", () => /\.pwa-prompt\[hidden\]\s*\{\s*display:\s*none/.test(css));
test(".topbar__search[hidden] display:none", () => /\.topbar__search\[hidden\]\s*\{\s*display:\s*none/.test(css));

console.log("\n[5] All JS files parse (node --check as ESM)");
const jsFiles = listJs("assets/js");
let parseOK = 0, parseFail = 0;
for (const f of jsFiles) {
  try {
    execFileSync("node", ["--check", f], { stdio: "pipe", cwd: ROOT });
    parseOK++;
  } catch (e) {
    parseFail++;
    console.log(`  ✗ ${f.replace(ROOT, "").slice(1)}: ${e.stderr?.toString().slice(0, 150) || e.message}`);
  }
}
test(`All ${jsFiles.length} JS files parse`, () => parseFail === 0 ? true : `${parseFail} files failed`);

console.log("\n[6] Form fields without name attr (DevTools warning fix)");
test("0 form fields without name attr", () => {
  const matches = html.match(/<(input|select|textarea)\b[^>]*>/gi) || [];
  const noName = matches.filter(m => !/name=/.test(m));
  return noName.length === 0 ? true : `${noName.length} form fields without name: ${noName[0]?.slice(0, 80)}`;
});

console.log("\n[7] Schema map (V4-isolated)");
const schema = JSON.parse(read("data/schema-map.json"));
test("schema-map stack = V4-isolated", () => schema._meta?.stack === "V4-isolated");
test("schema-map has 9 DBs", () => Object.keys(schema.databases || {}).length === 9);
test("9 V4 DBs with fresh UUIDs", () => {
  const ids = Object.values(schema.databases).map(d => d.id);
  const uniquePrefixes = new Set(ids.map(id => id.split("-")[4]?.slice(0, 8)));
  return uniquePrefixes.size === 9 ? true : `duplicate UUIDs detected: ${[...uniquePrefixes].join(",")}`;
});

console.log("\n" + "=".repeat(60));
console.log(`Result: ${pass} passed, ${fail} failed`);
if (failures.length) {
  console.log("\nFailures:");
  for (const f of failures) console.log(`  - ${f.name}: ${f.error}`);
}
process.exit(fail === 0 ? 0 : 1);
