// auth.js — PIN 0000 default + per-PIC override + PBKDF2 + RBAC + 8h session.
// M7 fix: 4-digit PIN maxlength. 3-attempt lockout.
// Phase 1: local-only auth (no Worker). Phase 2: switch to /auth/login endpoint.

import { subscribe, publish } from "./store.js";
import { fetchData } from "./ssot.js";

const SESSION_KEY = "syahfalah-session";
const PINS_KEY = "syahfalah-pin-overrides";
const LOCKOUT_KEY = "syahfalah-lockout";
const MAX_ATTEMPTS = 3;
const LOCKOUT_MS = 5 * 60 * 1000; // 5 min
const SESSION_MS = 8 * 60 * 60 * 1000; // 8h

let cache = {
  people: [],
  pins: {}, // { PIC: { hash, salt, algo } }
  currentUser: null,
  lockoutUntil: null,
  attempts: 0,
};

/** PBKDF2-SHA256 hash + per-PIC random salt. Returns "pbkdf2$<saltHex>$<hashHex>". */
async function pbkdf2Hash(plain, saltHex) {
  const enc = new TextEncoder();
  const salt = saltHex ? hexToBytes(saltHex) : crypto.getRandomValues(new Uint8Array(16));
  const km = await crypto.subtle.importKey("raw", enc.encode(plain), "PBKDF2", false, ["deriveBits"]);
  const derived = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    km,
    256
  );
  return {
    salt: saltHex || bytesToHex(salt),
    hash: bytesToHex(new Uint8Array(derived)),
  };
}

function hexToBytes(hex) {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) out[i / 2] = parseInt(hex.substr(i, 2), 16);
  return out;
}

function bytesToHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function pbkdf2Verify(plain, saltHex, expectedHex) {
  const { hash } = await pbkdf2Hash(plain, saltHex);
  return hash === expectedHex;
}

export async function init() {
  // Load people from ssot (bundled JSON)
  const peopleData = await fetchData("people.json");
  cache.people = peopleData.people || [];

  // Init PINs. Default = 0000 with per-PIC random salt.
  const overrides = JSON.parse(localStorage.getItem(PINS_KEY) || "{}");
  for (const p of cache.people) {
    if (overrides[p.nama]) {
      cache.pins[p.nama] = overrides[p.nama];
    } else {
      const { salt, hash } = await pbkdf2Hash(p.pin_default);
      cache.pins[p.nama] = { algo: "pbkdf2", salt, hash };
    }
  }
  // Save defaults so we don't re-hash on next boot
  localStorage.setItem(PINS_KEY, JSON.stringify(cache.pins));

  // Restore session if not expired
  restoreSession();
  // Restore lockout
  const lockout = JSON.parse(sessionStorage.getItem(LOCKOUT_KEY) || "null");
  if (lockout && Date.now() < lockout.until) {
    cache.lockoutUntil = lockout.until;
  }
}

function restoreSession() {
  const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
  if (session && Date.now() < session.expiresAt) {
    cache.currentUser = session.user;
    publish("auth:changed", cache.currentUser);
  } else if (session) {
    sessionStorage.removeItem(SESSION_KEY);
  }
}

export function getCurrentUser() { return cache.currentUser; }
export function getLockoutRemaining() {
  if (!cache.lockoutUntil) return 0;
  const remaining = cache.lockoutUntil - Date.now();
  return remaining > 0 ? remaining : 0;
}
export function getPeople() { return cache.people; }
export function isLockedOut() { return getLockoutRemaining() > 0; }

/** Get PIC list for login dropdown. */
export function getLoginList() {
  return cache.people.map(p => ({
    value: p.nama,
    label: p.nama,
    divisi: p.divisi,
    role: p.role,
    is_owner: p.is_owner,
  }));
}

/** Verify PIN for a given PIC. Returns { ok, reason }. */
export async function login(pic, pin) {
  if (isLockedOut()) {
    return { ok: false, reason: `locked-out:${Math.ceil(getLockoutRemaining() / 60000)}m` };
  }
  if (!cache.pins[pic]) return { ok: false, reason: "unknown-pic" };
  if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
    incrementAttempts();
    return { ok: false, reason: "invalid-pin-format" };
  }

  const stored = cache.pins[pic];
  const valid = await pbkdf2Verify(pin, stored.salt, stored.hash);
  if (!valid) {
    incrementAttempts();
    return { ok: false, reason: "wrong-pin" };
  }

  // Success
  cache.attempts = 0;
  const user = cache.people.find(p => p.nama === pic);
  const session = {
    user,
    issuedAt: Date.now(),
    expiresAt: Date.now() + SESSION_MS,
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  cache.currentUser = user;
  publish("auth:changed", user);
  return { ok: true, user };
}

function incrementAttempts() {
  cache.attempts++;
  if (cache.attempts >= MAX_ATTEMPTS) {
    cache.lockoutUntil = Date.now() + LOCKOUT_MS;
    sessionStorage.setItem(LOCKOUT_KEY, JSON.stringify({ until: cache.lockoutUntil }));
    cache.attempts = 0; // reset counter for next lockout cycle
  }
}

export function logout() {
  cache.currentUser = null;
  sessionStorage.removeItem(SESSION_KEY);
  publish("auth:changed", null);
}

/** Owner-only: override PIN for a specific PIC. */
export async function overridePin(pic, newPin) {
  if (!cache.currentUser?.is_owner) {
    throw new Error("forbidden: owner only");
  }
  if (!/^\d{4}$/.test(newPin)) throw new Error("invalid-pin-format");
  const { salt, hash } = await pbkdf2Hash(newPin);
  cache.pins[pic] = { algo: "pbkdf2", salt, hash };
  const overrides = JSON.parse(localStorage.getItem(PINS_KEY) || "{}");
  overrides[pic] = cache.pins[pic];
  localStorage.setItem(PINS_KEY, JSON.stringify(overrides));
  publish("auth:pin-changed", pic);
  return { ok: true };
}

/** RBAC: can current user access this divisi? */
export function canAccess(divisi) {
  if (!cache.currentUser) return false;
  if (cache.currentUser.is_owner) return true; // Owner sees all
  return cache.currentUser.divisi === divisi;
}

/** Format lockout time remaining as MM:SS. */
export function formatLockoutRemaining() {
  const ms = getLockoutRemaining();
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Subscribe to lockout ticking — UI can poll this for countdown
export function getLockoutDisplay() {
  if (!isLockedOut()) return null;
  const ms = getLockoutRemaining();
  return {
    seconds: Math.ceil(ms / 1000),
    display: formatLockoutRemaining(),
  };
}
