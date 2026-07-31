// Syahfalah OS V6 stub · 31 Jul 2026
// Counter animation + reveal-on-scroll. No deps.

(function () {
  'use strict';

  // Counter animation (subtle, 1s)
  const counters = document.querySelectorAll('[data-counter]');
  const animate = (el) => {
    const target = Number(el.getAttribute('data-counter')) || 0;
    const duration = 800;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out-cubic
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased).toString();
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target.toString();
    };
    requestAnimationFrame(step);
  };

  // Reveal on scroll (IntersectionObserver)
  const reveals = document.querySelectorAll('.section, .counter');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        if (el.matches('.counter')) animate(el);
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
    // No IO support: render static
    counters.forEach(animate);
  }

  // Console signal for ops review
  console.info('[V6 stub] SSOT: PROGRAM KERJA-1.docx · 12 PIC · 6 divisi · pre-implementation review');
})();