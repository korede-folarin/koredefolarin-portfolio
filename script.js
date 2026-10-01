(() => {
  const header = document.getElementById('siteHeader');
  const nav = document.querySelector('.main-nav');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];

  menuToggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  navLinks.forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  const sections = [...document.querySelectorAll('main section[id]')];
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(a => a.classList.remove('active'));
      const match = navLinks.find(a => a.getAttribute('href') === `#${entry.target.id}`);
      match?.classList.add('active');
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => sectionObserver.observe(s));

  // Subtle premium parallax on the home visual only.
  const frame = document.querySelector('.parallax-frame');
  const artImg = frame?.querySelector('img');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (frame && artImg && !reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    frame.addEventListener('pointermove', e => {
      const r = frame.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      artImg.style.transform = `scale(1.018) translate(${x * -8}px, ${y * -6}px)`;
    });
    frame.addEventListener('pointerleave', () => {
      artImg.style.transform = '';
    });
  }
})();
