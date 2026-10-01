(() => {
  const nav = document.querySelector('.main-nav');
  const toggle = document.querySelector('.menu-toggle');
  const anchorLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];

  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  anchorLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  const sections = [...document.querySelectorAll('main section[id]')];
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      anchorLinks.forEach(a => a.classList.remove('active'));
      const active = anchorLinks.find(a => a.getAttribute('href') === `#${entry.target.id}`);
      active?.classList.add('active');
    });
  }, { rootMargin: '-42% 0px -48% 0px', threshold: 0 });

  sections.forEach(section => sectionObserver.observe(section));
})();
