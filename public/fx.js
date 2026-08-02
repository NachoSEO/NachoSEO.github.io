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
  { threshold: 0.12, rootMargin: '0px 0px -48px' }
);

for (const el of document.querySelectorAll('.reveal')) {
  revealObserver.observe(el);
}
