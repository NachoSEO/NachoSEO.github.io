export const languages = { es: 'Español', en: 'English' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'es';

/* Rutas canónicas por idioma para cada sección del sitio */
export const routes = {
  home: { es: '/', en: '/en/' },
  services: { es: '/servicios/', en: '/en/services/' },
  about: { es: '/sobre-mi/', en: '/en/about/' },
  cases: { es: '/casos/', en: '/en/case-studies/' },
  blog: { es: '/blog/', en: '/en/blog/' },
  contact: { es: '/contacto/', en: '/en/contact/' },
} as const;

export type RouteKey = keyof typeof routes;

export const ui = {
  es: {
    'site.name': 'Nacho Mascort',
    'site.tagline': 'Growth · IA · SEO',
    'nav.services': 'Servicios',
    'nav.about': 'Sobre mí',
    'nav.cases': 'Casos',
    'nav.blog': 'Blog',
    'nav.contact': 'Contacto',
    'cta.book': 'Agenda una llamada',
    'a11y.skip': 'Saltar al contenido',
    'a11y.theme': 'Cambiar tema',
    'a11y.switchLang': 'Read in English',
    'footer.role': 'Head of AI & Organic Marketing',
    'footer.location': 'Barcelona · trabajo en remoto con todo el mundo',
    'notFound.title': 'Página no encontrada',
    'notFound.body': 'Esta URL no existe. Prueba desde el inicio.',
    'notFound.cta': 'Ir al inicio',
  },
  en: {
    'site.name': 'Nacho Mascort',
    'site.tagline': 'Growth · AI · SEO',
    'nav.services': 'Services',
    'nav.about': 'About',
    'nav.cases': 'Case studies',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'cta.book': 'Book a call',
    'a11y.skip': 'Skip to content',
    'a11y.theme': 'Toggle theme',
    'a11y.switchLang': 'Leer en español',
    'footer.role': 'Head of AI & Organic Marketing',
    'footer.location': 'Barcelona · working remotely worldwide',
    'notFound.title': 'Page not found',
    'notFound.body': "This URL doesn't exist. Start from the homepage.",
    'notFound.cta': 'Go home',
  },
} as const;

export type UiKey = keyof (typeof ui)['es'];
