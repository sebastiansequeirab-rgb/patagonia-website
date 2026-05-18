/* ============================================================
   Patagonia Americas — Reveal + stat-counter observer
   Spec §3 motion: all entrance animations fade-in + 16px translate-up,
   staggered ~80ms, triggered by IntersectionObserver at 15% visibility.
   Stat counters animate from 0 to data-target with easeOutCubic.
   Both honor prefers-reduced-motion.
   ============================================================ */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  function animateCount(el) {
    const target = parseFloat(el.dataset.target || '0');
    const duration = parseFloat(el.dataset.duration || '1600');
    if (reduceMotion || duration < 50) {
      el.textContent = String(Math.round(target));
      return;
    }
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const v = target * easeOutCubic(t);
      el.textContent = String(Math.round(v));
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = String(Math.round(target));
    };
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e, i) => {
        if (!e.isIntersecting) return;
        setTimeout(() => e.target.classList.add('in'), i * 80);
        const counts = e.target.querySelectorAll('.stat-count');
        if (counts.length) {
          counts.forEach(animateCount);
          e.target.classList.add('counted');
        }
        io.unobserve(e.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -70px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  /* The TradingView ticker stays live regardless of prefers-reduced-motion.
     The .ticker-fallback list remains in the markup as a graceful degradation
     if the iframe itself fails to load — see components.css. */
})();
