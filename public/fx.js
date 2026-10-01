document.documentElement.classList.add('js');

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

for (const el of document.querySelectorAll('.reveal')) {
  revealObserver.observe(el);
}

// Índice del artículo: marca la sección que se está leyendo
const tocLinks = new Map(
  [...document.querySelectorAll('[data-toc-link]')].map((link) => [link.dataset.tocLink, link])
);
if (tocLinks.size > 0) {
  const headings = [...tocLinks.keys()].map((id) => document.getElementById(id)).filter(Boolean);
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
  for (const heading of headings) tocObserver.observe(heading);
}
