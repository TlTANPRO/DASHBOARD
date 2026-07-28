// shell/sidebar.js — Mobile drawer toggle + active state sync.

export function init() {
  const sidebar = document.getElementById("sidebar");
  const hamburger = document.getElementById("hamburger");
  hamburger?.addEventListener("click", () => {
    const open = sidebar.classList.toggle("is-open");
    hamburger.setAttribute("aria-expanded", String(open));
  });

  // Close drawer when nav link clicked (mobile)
  sidebar.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      if (window.innerWidth <= 1024) {
        sidebar.classList.remove("is-open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });
  });

  // Swipe gestures: swipe right from edge = open, swipe left = close
  let touchStartX = null;
  document.addEventListener("touchstart", (e) => {
    if (e.touches[0].clientX < 24) touchStartX = e.touches[0].clientX;
  }, { passive: true });
  document.addEventListener("touchend", (e) => {
    if (touchStartX == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (dx > 50) {
      sidebar.classList.add("is-open");
      hamburger.setAttribute("aria-expanded", "true");
    } else if (dx < -50 && sidebar.classList.contains("is-open")) {
      sidebar.classList.remove("is-open");
      hamburger.setAttribute("aria-expanded", "false");
    }
    touchStartX = null;
  });
}

export function setActive(divisi) {
  document.querySelectorAll("#divisi-tabs a").forEach(a => {
    const isActive = a.dataset.divisi === divisi;
    a.toggleAttribute("aria-current", isActive);
    if (isActive) a.setAttribute("aria-current", "true");
    else a.removeAttribute("aria-current");
  });
  document.querySelectorAll(".tabbar__btn").forEach(b => {
    b.toggleAttribute("aria-current", b.dataset.divisi === divisi);
  });
}
