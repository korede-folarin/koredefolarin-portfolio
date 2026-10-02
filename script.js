(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.getElementById('siteHeader');
  const nav = document.getElementById('mainNav');
  const toggle = document.querySelector('.menu-toggle');

  /* ---------- mobile menu ---------- */
  const setMenu = (open) => {
    if (!nav || !toggle) return;
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle?.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  window.matchMedia('(min-width: 961px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  /* ---------- header state ---------- */
  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('visible'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- active section in nav (home page only) ---------- */
  const anchorLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
  if (anchorLinks.length && 'IntersectionObserver' in window) {
    const ids = anchorLinks.map(a => a.getAttribute('href').slice(1));
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
    const so = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        anchorLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => so.observe(s));
  }

  /* ---------- subtle hero parallax ---------- */
  const heroImg = document.querySelector('.hero-media img');
  if (heroImg && !reduceMotion) {
    const desktop = window.matchMedia('(min-width: 961px)');
    let ticking = false;
    const update = () => {
      ticking = false;
      if (!desktop.matches) { heroImg.style.transform = ''; return; }
      const y = Math.min(window.scrollY, window.innerHeight);
      heroImg.style.transform = `translate3d(0, ${y * 0.12}px, 0) scale(1.04)`;
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    desktop.addEventListener('change', update);
    update();
  }

  /* ---------- about: read my story ---------- */
  const storyBtn = document.querySelector('.story-toggle');
  const story = document.getElementById('story');
  if (storyBtn && story) {
    storyBtn.addEventListener('click', () => {
      const open = storyBtn.getAttribute('aria-expanded') !== 'true';
      storyBtn.setAttribute('aria-expanded', String(open));
      story.setAttribute('aria-hidden', String(!open));
      story.classList.toggle('open', open);
      story.style.maxHeight = open ? `${story.scrollHeight}px` : '0px';
      storyBtn.querySelector('.label').textContent = open ? 'Show Less' : 'Read My Story';
    });
    window.addEventListener('resize', () => {
      if (story.classList.contains('open')) story.style.maxHeight = `${story.scrollHeight}px`;
    });
  }
})();
