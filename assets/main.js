// Syahfalah OS · boot + router
// Loads SPA state, dispatches route.

(function () {
  'use strict';

  // Nav toggle (mobile)
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.sidenav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.getAttribute('aria-expanded') === 'true';
      nav.setAttribute('aria-expanded', open ? 'false' : 'true');
      navToggle.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  }

  // Router
  Router.add('/home', Views.home);
  Router.add('/jobdesk', Views.jobdesk);
  Router.add('/audit', Views.audit);
  Router.add('/pic/:id', Views.pic);

  // Intercept nav clicks
  document.querySelectorAll('[data-route]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      Router.navigate(a.getAttribute('data-route'));
    });
  });

  // Boot
  Router.dispatch();

  console.info('[Syahfalah OS] SPA v1 · localStorage demo mode');
})();
