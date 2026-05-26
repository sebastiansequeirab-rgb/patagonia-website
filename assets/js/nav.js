/* ============================================================
   Patagonia Americas — Scroll-aware navigation + hero parallax
   - Nav fades to glass background after 40px scroll.
   - Hero content fades + lifts as the user scrolls past it
     (smoothstep curve over 70% of viewport height).
   - Scrollspy updates the active nav link for in-page anchors.
   ============================================================ */
(function () {
  const nav = document.getElementById('nav');

  const heroContent = document.querySelector('.hero-content');
  const heroOverlay = document.querySelector('.hero-overlay');
  const scrollCue   = document.querySelector('.scroll-cue');

  const navLinks = nav
    ? Array.from(nav.querySelectorAll('.nav-links a[href^="#"]'))
    : [];
  const navSections = navLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  let ticking = false;

  const update = () => {
    const y = window.scrollY;

    if (nav) {
      if (y > 40) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }

    // Hero fade + parallax (smoothstep over the first 70% of viewport height).
    // Skipped on mobile — the effect feels glitchy on iOS Safari momentum scroll
    // and the mobile.css flatten pass freezes .hero-content visually anyway.
    const vh = window.innerHeight;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) {
      const t = Math.min(y / (vh * 0.7), 1);
      const eased = t * t * (3 - 2 * t);

      if (heroContent) {
        heroContent.style.opacity = String(1 - eased);
        heroContent.style.transform = `translateY(${eased * -36}px)`;
      }
      if (scrollCue) {
        scrollCue.style.opacity = String(Math.max(0, 1 - eased * 1.8));
      }
      if (heroOverlay) {
        heroOverlay.style.opacity = String(1 - eased * 0.7);
      }
    }

    if (navSections.length) {
      const mid = y + vh * 0.35;
      let activeIdx = -1;
      navSections.forEach((s, i) => {
        if (s && s.offsetTop <= mid) activeIdx = i;
      });
      navLinks.forEach((a, i) => a.classList.toggle('active', i === activeIdx));
    }

    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );

  // Fire once so first paint reflects current scroll position
  update();
})();
