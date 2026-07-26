// lib/auth.js — session + PIN login via worker

const STORAGE_KEY = "dvb2-session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

const OWNER_PICS = ["Pak Ardian", "Bu Nisya"];

export const Session = {
  pic: null,
  token: null,
  loginAt: null,

  isOwner() {
    return OWNER_PICS.includes(this.pic);
  },

  isLoggedIn() {
    return !!this.pic && !!this.token;
  },

  save() {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ pic: this.pic, token: this.token, loginAt: this.loginAt })
    );
  },

  load() {
    const s = sessionStorage.getItem(STORAGE_KEY);
    if (!s) return false;
    try {
      const d = JSON.parse(s);
      if (Date.now() - d.loginAt > SESSION_TTL_MS) {
        sessionStorage.removeItem(STORAGE_KEY);
        return false;
      }
      this.pic = d.pic;
      this.token = d.token;
      this.loginAt = d.loginAt;
      return true;
    } catch {
      return false;
    }
  },

  clear() {
    this.pic = null;
    this.token = null;
    this.loginAt = null;
    sessionStorage.removeItem(STORAGE_KEY);
  },

  async login(pic, pin) {
    const worker = window.DASHBOARD_CONFIG?.workerBase;
    if (!worker) throw new Error("Worker URL not configured");

    // Try worker login first (live mode)
    if (window.DASHBOARD_CONFIG?.mode === "live") {
      try {
        const res = await fetch(`${worker}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pic, pin }),
        });
        if (res.ok) {
          const data = await res.json();
          this.pic = data.pic || pic;
          this.token = data.token || `fallback-${pic}-${Date.now()}`;
          this.loginAt = Date.now();
          this.save();
          return true;
        }
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Login gagal (${res.status})`);
      } catch (e) {
        if (e.message.includes("PIN")) throw e;
        // Network/auth issue - fallback to local PIN check
      }
    }

    // Fallback: local PIN check (demo mode / offline)
    const localOK = await localLogin(pic, pin);
    if (localOK) {
      this.pic = pic;
      this.token = `local-${pic}-${Date.now()}`;
      this.loginAt = Date.now();
      this.save();
      return true;
    }
    throw new Error("PIN salah");
  },
};

// Local fallback PIN (demo mode) - 4-digit PINs from pins-assignment.txt
const LOCAL_PINS = {
  "Pak Ardian": "6079",
  "Bu Nisya": "3644",
  Mada: "1634",
  Riza: "5960",
  "Yudi (Sdek)": "9243",
  Rizal: "9908",
  Amir: "5049",
  Novita: "4635",
  Sinta: "1116",
  Reni: "9808",
  Rifki: "9064",
  Reta: "3318",
};

async function localLogin(pic, pin) {
  return LOCAL_PINS[pic] === pin;
}

export function getPicList() {
  return Object.keys(LOCAL_PINS);
}

export function getOwnerPics() {
  return [...OWNER_PICS];
}

export function getLocalPin(pic) {
  return LOCAL_PINS[pic];
}
