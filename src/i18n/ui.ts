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
  tools: { es: '/herramientas/', en: '/en/tools/' },
  skills: { es: '/skills/', en: '/en/skills/' },
  qualitySkill: { es: '/skills/google-quality-audit/', en: '/en/skills/google-quality-audit/' },
  sitemapGenerator: { es: '/herramientas/generador-sitemap/', en: '/en/tools/sitemap-generator/' },
  botChecker: { es: '/herramientas/comprobador-bots/', en: '/en/tools/bot-access-checker/' },
  rss: { es: '/rss.xml', en: '/en/rss.xml' },
  privacy: { es: '/privacidad/', en: '/en/privacy/' },
  legal: { es: '/aviso-legal/', en: '/en/legal-notice/' },
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
    'nav.course': 'Curso',
    'nav.skills': 'Skills',
    'nav.contact': 'Contacto',
    'nav.tools': 'Herramientas',
    'tools.sitemapGenerator': 'Generador de sitemap XML',
    'tools.botChecker': 'Comprobador de bots',
    'cta.book': 'Agenda una llamada',
    'cta.call30': 'Reserva una llamada de 30 min',
    'a11y.skip': 'Saltar al contenido',
    'a11y.switchLang': 'Read in English',
    'a11y.menu': 'Abrir menú',
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
    'nav.course': 'Course',
    'nav.skills': 'Skills',
    'nav.contact': 'Contact',
    'nav.tools': 'Tools',
    'tools.sitemapGenerator': 'XML Sitemap Generator',
    'tools.botChecker': 'Bot access checker',
    'cta.book': 'Book a call',
    'cta.call30': 'Book a 30-min call',
    'a11y.skip': 'Skip to content',
    'a11y.switchLang': 'Leer en español',
    'a11y.menu': 'Open menu',
    'footer.role': 'Head of AI & Organic Marketing',
    'footer.location': 'Barcelona · working remotely worldwide',
    'notFound.title': 'Page not found',
    'notFound.body': "This URL doesn't exist. Start from the homepage.",
    'notFound.cta': 'Go home',
  },
} as const;

export type UiKey = keyof (typeof ui)['es'];
