// ============================================================
// Mobile hamburger nav — used at viewports ≤768px.
// Aditive to the desktop nav; reads nothing from nav.js.
// ============================================================

(function () {
  const burger = document.getElementById('navBurger');
  const panel  = document.getElementById('navPanel');
  const back   = document.getElementById('navBackdrop');
  if (!burger || !panel) return;

  const root = document.documentElement;
  const desktopMQ = window.matchMedia('(min-width: 769px)');

  function open() {
    root.classList.add('nav-open');
    burger.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
    if (back) back.setAttribute('aria-hidden', 'false');
    // Focus the first link in the panel for keyboard users.
    requestAnimationFrame(() => {
      const first = panel.querySelector('.nav-panel-link');
      if (first) first.focus();
    });
  }

  function close({ returnFocus = false } = {}) {
    root.classList.remove('nav-open');
    burger.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
    if (back) back.setAttribute('aria-hidden', 'true');
    if (returnFocus) burger.focus();
  }

  burger.addEventListener('click', () => {
    if (root.classList.contains('nav-open')) close({ returnFocus: true });
    else open();
  });

  // Close on any link click.
  panel.querySelectorAll('.nav-panel-link').forEach(a => {
    a.addEventListener('click', () => close());
  });

  // Backdrop click closes.
  if (back) back.addEventListener('click', () => close({ returnFocus: true }));

  // Explicit close button inside the panel.
  const closeBtn = document.getElementById('navPanelClose');
  if (closeBtn) closeBtn.addEventListener('click', () => close({ returnFocus: true }));

  // Escape closes.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.classList.contains('nav-open')) {
      close({ returnFocus: true });
    }
  });

  // If the viewport grows past mobile while the panel is open, close it.
  const onMQ = (e) => { if (e.matches && root.classList.contains('nav-open')) close(); };
  if (desktopMQ.addEventListener) desktopMQ.addEventListener('change', onMQ);
  else desktopMQ.addListener(onMQ);
})();
