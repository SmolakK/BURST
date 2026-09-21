/* BURST project site — progressive enhancement only. */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ------------------------------------------------------------ theme -- */
  /* The site is dark by default; only an explicit data-theme="light"
     switches it. A saved choice is applied by the inline script in <head>
     so the page never paints the wrong theme first. */
  var STORE = 'burst-theme';

  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(STORE, next); } catch (e) { /* blocked storage */ }
    });
  }

  /* -------------------------------------------------------- mobile nav -- */
  var navBtn = document.getElementById('navToggle');
  var nav = document.getElementById('nav');

  function isMobile() { return window.matchMedia('(max-width: 860px)').matches; }

  function syncNav(open) {
    if (!nav || !navBtn) return;
    if (!isMobile()) {
      nav.hidden = false;
      navBtn.setAttribute('aria-expanded', 'false');
      return;
    }
    nav.hidden = !open;
    navBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  if (navBtn && nav) {
    syncNav(false);
    navBtn.addEventListener('click', function () {
      syncNav(nav.hidden);
    });
    nav.addEventListener('click', function (ev) {
      if (ev.target.tagName === 'A' && isMobile()) syncNav(false);
    });
    window.addEventListener('resize', function () { syncNav(false); });
  }

  /* ------------------------------------------------ "you are here" mark -- */
  /* Gantt axis spans the project: 2026-09-01 to 2028-09-01 (24 months).
     Date.UTC months are zero-based, so 8 = September. */
  var AXIS_START = Date.UTC(2026, 8, 1);
  var AXIS_END = Date.UTC(2028, 8, 1);
  var AXIS_MONTHS = 24;
  var now = Date.now();

  if (now > AXIS_START && now < AXIS_END) {
    var pct = ((now - AXIS_START) / (AXIS_END - AXIS_START)) * 100;
    Array.prototype.forEach.call(document.querySelectorAll('#gantt .tl-track'), function (track) {
      var mark = document.createElement('div');
      mark.className = 'tl-now';
      mark.style.left = pct.toFixed(2) + '%';
      mark.title = 'Today';
      track.appendChild(mark);
    });

    var label = document.getElementById('nowLabel');
    if (label) {
      var months = Math.floor((now - AXIS_START) / (1000 * 60 * 60 * 24 * 30.44));
      label.textContent = 'Month ' + (months + 1) + ' of ' + AXIS_MONTHS;
    }
  }

  /* ------------------------------------------------------- reveal ------- */
  var targets = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

  Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
})();
