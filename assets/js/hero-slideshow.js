/* ============================================================
   Patagonia Americas — Hero cross-fading slideshow
   6 frames, 8s each. Pauses on hover and on visibilitychange.
   Honors prefers-reduced-motion (no auto-advance).
   ============================================================ */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots   = Array.from(document.querySelectorAll('.hero-dot'));
  const hero   = document.querySelector('.hero');
  if (!slides.length || !dots.length) return;

  let idx = 0;
  let timer = null;

  const show = (next) => {
    if (next === idx) return;
    slides[idx].classList.remove('is-active');
    dots[idx].classList.remove('is-active');
    idx = next;
    slides[idx].classList.add('is-active');
    dots[idx].classList.add('is-active');
  };

  const advance = () => show((idx + 1) % slides.length);

  const stop = () => {
    if (timer) { clearInterval(timer); timer = null; }
  };
  const start = () => {
    if (reduceMotion) return;
    stop();
    // 3s per slide — quicker, more animated pacing.
    timer = setInterval(advance, 3000);
  };

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      show(i);
      start();
    });
  });

  if (hero) {
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  start();
})();
