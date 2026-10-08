// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { writeFile } from 'node:fs/promises';
import tailwindcss from '@tailwindcss/vite';

/** Rutas antiguas del Hexo de 2023 → destinos nuevos. Fuente única: genera el _redirects de Cloudflare Pages (301 reales)
    y los stubs meta-refresh de respaldo, que quedan fuera del sitemap. */
export const legacyRedirects = {
  // Primera URL del briefing, ya enviada a clientes
  '/briefing/': '/presupuesto/',
  '/about/': '/sobre-mi/',
  '/scraping-content-hijacking-the-endpoint-calls-in-the-front-end/':
    '/en/blog/scraping-google-autocomplete-endpoints/',
  '/tags/': '/blog/',
  '/tags/Scraping/': '/blog/',
  '/archives/': '/blog/',
  '/archives/2023/': '/blog/',
  '/archives/2023/01/': '/blog/',
  // Fase 1 de la arquitectura (oct 2026): la consultoría SEO/GEO se dividió en servicios técnicos
  '/servicios/consultoria-seo-geo/': '/servicios/consultoria-seo-tecnica/',
};

const redirectTargetsBySource = new Set(Object.keys(legacyRedirects));

/** Escribe dist/_redirects a partir de legacyRedirects para que Cloudflare Pages responda con 301 */
const cloudflareRedirects = {
  name: 'cloudflare-redirects',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const lines = Object.entries(legacyRedirects).map(([from, to]) => `${from} ${to} 301`);
      await writeFile(new URL('_redirects', dir), `${lines.join('\n')}\n`);
    },
  },
};

export default defineConfig({
  site: 'https://nachomascort.com',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-ES', en: 'en' },
      },
      filter: (page) => {
        const path = new URL(page).pathname;
        return !redirectTargetsBySource.has(path) && !/^\/(en\/thanks|gracias|contacto\/(gracias|error)|en\/contact\/(thanks|error)|presupuesto\/(gracias|error)|en\/quote\/(thanks|error))\//.test(path);
      },
    }),
    cloudflareRedirects,
  ],
  // assetsInlineLimit: 0 → los <script> de componentes salen como módulos
  // externos same-origin (la CSP no permite scripts inline)
  vite: { plugins: [tailwindcss()], build: { assetsInlineLimit: 0 } },
  // Tema de código con contraste AA (github-dark falla WCAG en comentarios)
  markdown: { shikiConfig: { theme: 'github-dark-default' } },
  redirects: legacyRedirects,
  // CSS siempre en archivo externo (la CSP de public/_headers solo permite estilos inline en atributos)
  build: { inlineStylesheets: 'never' },
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
