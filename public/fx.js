document.documentElement.classList.add('js');

// Aparición discreta de bloques al entrar en pantalla (solo en páginas que la usan)
const revealTargets = document.querySelectorAll('.reveal');
if (revealTargets.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -32px' }
  );
  for (const el of revealTargets) revealObserver.observe(el);
}

// Carrusel de logos: se pausa cuando no está en pantalla para no gastar batería
const marqueeObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) entry.target.classList.toggle('is-offscreen', !entry.isIntersecting);
});
for (const logoMarquee of document.querySelectorAll('.logo-marquee')) marqueeObserver.observe(logoMarquee);

// Índice del artículo: marca la sección que se está leyendo
const tocLinks = new Map(
  [...document.querySelectorAll('[data-toc-link]')].map((link) => [link.dataset.tocLink, link])
);
if (tocLinks.size > 0) {
  const setActive = (id) => {
    for (const [key, link] of tocLinks) link.classList.toggle('is-active', key === id);
  };
  const tocObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting);
      if (visible.length > 0) setActive(visible[0].target.id);
    },
    { rootMargin: '0px 0px -70% 0px' }
  );
  for (const id of tocLinks.keys()) {
    const heading = document.getElementById(id);
    if (heading) tocObserver.observe(heading);
  }
}

// Menú móvil: abre/cierra el panel, se cierra con Escape o al elegir un enlace
const menuToggle = document.querySelector('[data-menu-toggle]');
const mobileMenu = menuToggle && document.getElementById(menuToggle.getAttribute('aria-controls'));
if (menuToggle && mobileMenu) {
  const setMenu = (open) => {
    menuToggle.setAttribute('aria-expanded', String(open));
    mobileMenu.classList.toggle('is-open', open);
  };
  menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  mobileMenu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuToggle.focus();
    }
  });
}

// Desplegables del menú de escritorio: se abren al pasar el ratón (CSS) o con el botón; Escape y clic fuera los cierran
const dropToggles = [...document.querySelectorAll('[data-drop-toggle]')];
if (dropToggles.length) {
  const closeAll = (except) => {
    for (const toggle of dropToggles) {
      if (toggle !== except) toggle.setAttribute('aria-expanded', 'false');
    }
  };
  for (const toggle of dropToggles) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      closeAll(toggle);
      toggle.setAttribute('aria-expanded', String(open));
    });
  }
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav-drop')) closeAll();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const open = dropToggles.find((toggle) => toggle.getAttribute('aria-expanded') === 'true');
    if (open) {
      closeAll();
      open.focus();
    }
  });
}
