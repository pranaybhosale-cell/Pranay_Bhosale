/* Interaction layer: smooth scroll, 3D certificate coverflow, section dots. Runs after script.js. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // The hero glass panel was never revealed by the old observer list.
  $('.hero-panel')?.classList.add('is-visible');

  // 1. Inertia scrolling (desktop pointers only; touch keeps native momentum).
  const initLenis = () => {
    if (!window.Lenis || reduce || !fine) return;
    const lenis = new Lenis({ lerp: .09, wheelMultiplier: .95, smoothWheel: true });
    document.documentElement.classList.add('lenis');
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const h = a.getAttribute('href'); if (h.length < 2) return; const el = $(h); if (!el) return; e.preventDefault(); lenis.scrollTo(el, { offset: -90, duration: 1.3 }); history.replaceState(null, '', h); }));
    $$('dialog').forEach(d => { d.setAttribute('data-lenis-prevent', ''); d.addEventListener('close', () => lenis.start()); });
    window.__lenis = lenis;
  };
  if (!reduce && fine) { const s = document.createElement('script'); s.src = 'assets/vendor/lenis.1.1.18.min.js'; s.onload = initLenis; document.head.append(s); }

  // 2. Certificate coverflow.
  const grid = $('.certificate-grid');
  const cards = grid ? $$('.certificate-card', grid) : [];
  if (grid && cards.length > 2) {
    grid.classList.add('coverflow');
    cards.forEach(c => { c.classList.remove('reveal', 'tilt'); c.removeAttribute('data-tilt'); c.style.removeProperty('--rx'); c.style.removeProperty('--ry'); });
    const stage = document.createElement('div'); stage.className = 'cf-stage'; cards.forEach(c => stage.append(c)); grid.append(stage);
    const mk = (cls, label, txt) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'cf-btn ' + cls; b.setAttribute('aria-label', label); b.textContent = txt; return b; };
    const prev = mk('cf-prev', 'Previous certificate', '‹'), next = mk('cf-next', 'Next certificate', '›');
    const dots = document.createElement('div'); dots.className = 'cf-dots';
    const status = document.createElement('p'); status.className = 'cf-status'; status.setAttribute('aria-live', 'polite');
    cards.forEach((c, i) => { const d = document.createElement('button'); d.type = 'button'; d.setAttribute('aria-label', 'Show certificate ' + (i + 1)); d.addEventListener('click', () => go(i)); dots.append(d); });
    grid.append(prev, next, dots, status);
    let cur = 0, pos = 0, dragging = false, startX = 0, startPos = 0, moved = 0, raf = 0;
    const W = () => Math.min(400, stage.clientWidth * .78);
    const render = () => {
      const w = W(); const step = w * (innerWidth < 700 ? .62 : .56);
      cards.forEach((c, i) => {
        const o = i - pos, a = Math.abs(o);
        c.style.width = w + 'px';
        c.style.transform = `translate3d(calc(-50% + ${o * step}px),0,${-a * 130}px) rotateY(${Math.max(-1, Math.min(1, o)) * -42}deg) scale(${1 - Math.min(a, 3) * .05})`;
        c.style.opacity = a > 2.6 ? 0 : 1 - Math.min(a, 2.6) * .2;
        c.style.zIndex = String(100 - Math.round(a * 10));
        c.style.pointerEvents = a > 2.6 ? 'none' : '';
        c.tabIndex = Math.round(pos) === i ? 0 : -1;
        c.classList.toggle('is-center', Math.round(pos) === i);
      });
    };
    const settle = () => { cancelAnimationFrame(raf); const tick = () => { pos += (cur - pos) * .14; render(); if (Math.abs(cur - pos) > .002) raf = requestAnimationFrame(tick); else { pos = cur; render(); } }; raf = requestAnimationFrame(tick); };
    const go = i => { cur = Math.max(0, Math.min(cards.length - 1, i)); [...dots.children].forEach((d, k) => d.classList.toggle('on', k === cur)); const b = $('b', cards[cur]); status.textContent = b ? `${cur + 1} of ${cards.length}: ${b.textContent}` : ''; settle(); };
    prev.addEventListener('click', () => go(cur - 1)); next.addEventListener('click', () => go(cur + 1));
    grid.addEventListener('keydown', e => { if (e.target.closest('dialog')) return; if (e.key === 'ArrowLeft') { go(cur - 1); } else if (e.key === 'ArrowRight') { go(cur + 1); } });
    stage.addEventListener('pointerdown', e => { dragging = true; moved = 0; startX = e.clientX; startPos = pos; cancelAnimationFrame(raf); });
    addEventListener('pointermove', e => { if (!dragging) return; const dx = e.clientX - startX; moved = Math.max(moved, Math.abs(dx)); if (moved > 6) { pos = Math.max(0, Math.min(cards.length - 1, startPos - dx / (W() * .56))); stage.classList.add('is-dragging'); render(); } });
    addEventListener('pointerup', () => { if (!dragging) return; dragging = false; stage.classList.remove('is-dragging'); go(Math.round(pos)); });
    // Capture clicks before the lightbox handler: drags never open it, and side cards centre first.
    stage.addEventListener('click', e => { const c = e.target.closest('.certificate-card'); if (!c) return; const i = cards.indexOf(c); if (moved > 6) { e.stopPropagation(); e.preventDefault(); moved = 0; return; } if (i !== cur) { e.stopPropagation(); e.preventDefault(); go(i); } }, true);
    const fit = () => { stage.style.height = Math.round(W() * .86 + 150) + 'px'; render(); };
    addEventListener('resize', fit, { passive: true }); fit(); go(0);
  }

  // 3. Section dots (visual shortcut; the main nav stays the accessible path).
  const sections = [['home', 'Home'], ['about', 'About'], ['skills', 'Learning'], ['work', 'Projects'], ['certificates', 'Certificates'], ['journey', 'Journey'], ['contact', 'Contact']].filter(([id]) => document.getElementById(id));
  const rail = document.createElement('nav'); rail.className = 'dots'; rail.setAttribute('aria-label', 'Sections');
  sections.forEach(([id, label]) => { const a = document.createElement('a'); a.href = '#' + id; a.dataset.label = label; a.setAttribute('aria-label', label); rail.append(a); });
  document.body.append(rail);
  if ('IntersectionObserver' in window) { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) $$('a', rail).forEach((a, i) => a.classList.toggle('on', sections[i][0] === e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' }); sections.forEach(([id]) => io.observe(document.getElementById(id))); }
})();
