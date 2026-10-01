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

// Tilt 3D: solo punteros finos con hover y sin reduced-motion
if (
  matchMedia('(hover: hover) and (pointer: fine)').matches &&
  matchMedia('(prefers-reduced-motion: no-preference)').matches
) {
  for (const el of document.querySelectorAll('.tilt')) {
    const max = parseFloat(el.dataset.tiltMax || '6');
    let raf = 0;
    el.addEventListener('pointermove', (event) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const rect = el.getBoundingClientRect();
        const ry = ((event.clientX - rect.left) / rect.width - 0.5) * 2 * max;
        const rx = ((event.clientY - rect.top) / rect.height - 0.5) * -2 * max;
        el.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
        el.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
      });
    });
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    });
  }
}
