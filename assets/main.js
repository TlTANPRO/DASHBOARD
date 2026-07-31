// Syahfalah OS · 31 Jul 2026
// Counter animation + reveal-on-scroll + smooth anchor scroll.
// No hash change in URL (per requirement: clean /DASHBOARD/ URL).

(function () {
  'use strict';

  // === Counter animation (subtle, 800ms ease-out-cubic) ===
  const animateCounter = (el) => {
    const target = Number(el.getAttribute('data-counter')) || 0;
    const duration = 800;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased).toString();
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target.toString();
    };
    requestAnimationFrame(step);
  };

  // === Reveal on scroll ===
  const reveals = document.querySelectorAll('.section, .counter');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        if (el.matches('.counter')) animateCounter(el);
        io.unobserve(el);
      });
    }, { threshold: 0.15 });
    reveals.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      el.style.transition = 'opacity 400ms ease-out, transform 400ms ease-out';
      io.observe(el);
    });
  } else {
    document.querySelectorAll('[data-counter]').forEach(animateCounter);
  }

  // === Smooth anchor scroll (NO hash change in URL) ===
  document.querySelectorAll('[data-scroll]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = a.getAttribute('data-scroll');
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // === Anchor click handler for skip-link (#main) — no hash change ===
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    if (a.hasAttribute('data-scroll')) return;
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // === Console signal ===
  console.info('[Syahfalah OS] SSOT: PROGRAM KERJA-1.docx · 12 PIC · 6 divisi · pre-implementation review');
})();