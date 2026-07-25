// lib/auth.js — session + PIN login

const STORAGE_KEY = "dvb2-session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

const OWNER_PICS = ["Pak Ardian", "Bu Nisya"];
const PIN_MAP = {
  "Pak Ardian": "111111",
  "Bu Nisya": "222222",
  Mada: "333333",
  Riza: "444444",
  "Yudi (Sdek)": "555555",
  Rizal: "666666",
  Amir: "777777",
  Novita: "888888",
  Sinta: "999999",
  Reni: "101010",
  Rifki: "202020",
  Reta: "303030",
};

export const Session = {
  pic: null,
  token: null,
  loginAt: null,

  isOwner() {
    return OWNER_PICS.includes(this.pic);
  },

  isLoggedIn() {
    return !!this.pic;
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
    const expected = PIN_MAP[pic];
    if (!expected) throw new Error("PIC tidak dikenal");
    if (pin !== expected) throw new Error("PIN salah");
    this.pic = pic;
    this.token = btoa(`${pic}:${Date.now()}`);
    this.loginAt = Date.now();
    this.save();
    return true;
  },
};

export function getPicList() {
  return Object.keys(PIN_MAP);
}

export function getOwnerPics() {
  return [...OWNER_PICS];
}
