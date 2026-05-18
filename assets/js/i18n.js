/* ============================================================
   Patagonia Americas — Bilingual EN/ES toggle
   Spec §18 cross-cutting: must not regress. The visibility swap
   is CSS-driven via html[data-lang]; this file persists the
   choice and wires the button group(s).
   ============================================================ */
(function () {
  const STORAGE_KEY = 'pa-lang';

  const setLang = (l) => {
    if (l !== 'en' && l !== 'es') l = 'en';
    document.documentElement.setAttribute('data-lang', l);
    document.documentElement.setAttribute('lang', l);
    document.querySelectorAll('.lang-toggle button').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.setLang === l);
    });
    try { localStorage.setItem(STORAGE_KEY, l); } catch (_) { /* ignore */ }
  };

  let saved = 'en';
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'es' || v === 'en') saved = v;
  } catch (_) { /* ignore */ }

  setLang(saved);

  document.querySelectorAll('[data-set-lang]').forEach((btn) => {
    btn.addEventListener('click', () => setLang(btn.dataset.setLang));
  });
})();
