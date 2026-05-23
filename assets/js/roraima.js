/* ============================================================
   Patagonia Americas — RORAIMA page interactivity
   Slim: only the three interactive widgets unique to this page.
   The portal's shared scripts handle the rest:
   - nav.js   → fixed-nav scroll state + hero fade
   - i18n.js  → EN/ES toggle
   - reveal.js → .reveal entrance + .stat-count counters
   ============================================================ */
(function () {
  'use strict';
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* ---------- Operating Model (CORE + SPV nodes) ---------- */
  const diagram = document.getElementById('rDiagram');
  if (diagram) {
    const nodes = $$('.r-node', diagram);
    const conns = $$('.r-diagram-svg .conn', diagram);
    const blocks = $$('#rNodeDetail .r-node-detail-block');
    const setNode = (id) => {
      nodes.forEach((n) => {
        const on = n.dataset.node === id;
        n.classList.toggle('active', on);
        n.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      conns.forEach((c) => c.classList.toggle('on', id === 'core' || c.dataset.spv === id));
      blocks.forEach((b) => b.classList.toggle('active', b.dataset.node === id));
    };
    nodes.forEach((n) => {
      const id = n.dataset.node;
      n.addEventListener('mouseenter', () => setNode(id));
      n.addEventListener('click', () => setNode(id));
      n.addEventListener('focus', () => setNode(id));
      n.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setNode(id); }
      });
    });
    setNode('core');
  }

  /* ---------- Sectors (hover/click to expand) ---------- */
  const grid = document.getElementById('rSectorsGrid');
  if (grid) {
    const tiles = $$('.r-sector', grid);
    const blocks = $$('#rSectorPanel .r-sector-block');
    const hint = document.getElementById('rSectorHint');
    const setSector = (id) => {
      tiles.forEach((t) => t.classList.toggle('active', t.dataset.sector === id));
      blocks.forEach((b) => b.classList.toggle('active', b.dataset.sector === id));
      if (hint) hint.classList.toggle('hidden', !!id);
    };
    tiles.forEach((t) => {
      const id = t.dataset.sector;
      t.addEventListener('mouseenter', () => setSector(id));
      t.addEventListener('click', () => setSector(id));
      t.addEventListener('focus', () => setSector(id));
      t.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSector(id); }
      });
    });
    grid.addEventListener('mouseleave', () => setSector(null));
    setSector(null);
  }

  /* ---------- Frontier Coverage (region hover → detail) ---------- */
  const map = document.querySelector('.world-map');
  if (map && document.getElementById('rRegionDetail')) {
    const regions = $$('.region', map);
    const blocks = $$('#rRegionDetail .r-region-block');
    const hint = document.getElementById('rRegionHint');
    const setRegion = (id) => {
      regions.forEach((r) => r.classList.toggle('active', r.dataset.region === id));
      blocks.forEach((b) => b.classList.toggle('active', b.dataset.region === id));
      if (hint) hint.classList.toggle('hidden', !!id);
    };
    regions.forEach((r) => {
      const id = r.dataset.region;
      r.addEventListener('mouseenter', () => setRegion(id));
      r.addEventListener('click', () => setRegion(id));
      r.addEventListener('focus', () => setRegion(id));
    });
    map.addEventListener('mouseleave', () => setRegion(null));
    setRegion(null);
  }
})();
