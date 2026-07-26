// lib/push.js — Notifikasi push untuk overdue + approval
import { API } from "./api.js";
import { Session } from "./auth.js";

let intervalId = null;
let lastCheck = null;
const SEEN_KEY = "dvb2-push-seen";

function getSeen() {
  try { return JSON.parse(localStorage.getItem(SEEN_KEY) || "[]"); }
  catch { return []; }
}
function setSeen(arr) {
  try { localStorage.setItem(SEEN_KEY, JSON.stringify(arr)); } catch {}
}

// Request browser permission
export async function requestPushPermission() {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

// Check overdue + pending approval
export async function checkAndNotify() {
  if (!Session.isLoggedIn()) return;
  try {
    const [jd, imp] = await Promise.all([
      API.listJobdesk(true).catch(() => []),
      API.listImprovisasi(true).catch(() => []),
    ]);
    const today = new Date(new Date().toDateString());

    // Overdue jobdesk
    const overdue = jd.filter(j =>
      j.Tanggal && j.Status !== "Done" && new Date(j.Tanggal) < today
    );

    // Pending approval (untuk Owner)
    const pending = jd.filter(j => j.Status === "Pending Approval");

    const seen = getSeen();
    const newNotifications = [];

    if (Session.isOwner() && pending.length > 0) {
      const k = `pending-${pending.length}-${pending[0].id}`;
      if (!seen.includes(k)) {
        newNotifications.push({
          key: k,
          title: `📋 ${pending.length} Jobdesk butuh approval`,
          body: pending.slice(0, 3).map(p => `• ${p.Aktivitas || p["Jobdesk ID"]}`).join("\n"),
          tag: "approval",
        });
      }
    }

    if (overdue.length > 0) {
      const k = `overdue-${overdue.length}-${overdue[0].id}`;
      if (!seen.includes(k)) {
        newNotifications.push({
          key: k,
          title: `⚠ ${overdue.length} Jobdesk overdue`,
          body: overdue.slice(0, 3).map(o => `• ${o.Aktivitas || o["Jobdesk ID"]} (${o.PIC})`).join("\n"),
          tag: "overdue",
        });
      }
    }

    if (newNotifications.length > 0) {
      // Browser notification
      if (Notification.permission === "granted") {
        for (const n of newNotifications) {
          try {
            new Notification(n.title, {
              body: n.body,
              tag: n.tag,
              icon: "/DASHBOARD/v2/favicon.ico",
            });
          } catch (e) { /* silent fail */ }
        }
      }
      // In-page toast via custom event
      window.dispatchEvent(new CustomEvent("dvb2-notification", {
        detail: { notifications: newNotifications },
      }));
      // Mark as seen
      const newSeen = [...seen, ...newNotifications.map(n => n.key)].slice(-50);
      setSeen(newSeen);
    }
    lastCheck = new Date();
  } catch (e) {
    // silent fail
  }
}

// Start polling (every 5 minutes)
export function startPolling() {
  if (intervalId) return;
  // Initial check
  checkAndNotify();
  intervalId = setInterval(checkAndNotify, 5 * 60 * 1000);
}

export function stopPolling() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

export function getLastCheck() {
  return lastCheck;
}
