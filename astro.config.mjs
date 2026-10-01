// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/** Rutas antiguas del Hexo de 2023 → destinos nuevos (stubs meta-refresh, excluidos del sitemap) */
export const legacyRedirects = {
  '/about/': '/sobre-mi/',
  '/scraping-content-hijacking-the-endpoint-calls-in-the-front-end/':
    '/en/blog/scraping-google-autocomplete-endpoints/',
  '/tags/': '/blog/',
  '/tags/Scraping/': '/blog/',
  '/archives/': '/blog/',
  '/archives/2023/': '/blog/',
  '/archives/2023/01/': '/blog/',
};

const redirectTargetsBySource = new Set(Object.keys(legacyRedirects));

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
        return !redirectTargetsBySource.has(path);
      },
    }),
  ],
  // assetsInlineLimit: 0 → los <script> de componentes salen como módulos
  // externos same-origin (la CSP no permite scripts inline)
  vite: { plugins: [tailwindcss()], build: { assetsInlineLimit: 0 } },
  // Tema de código con contraste AA (github-dark falla WCAG en comentarios)
  markdown: { shikiConfig: { theme: 'github-dark-default' } },
  redirects: legacyRedirects,
  // CSS siempre en archivo externo para poder servir una CSP sin 'unsafe-inline'
  build: { inlineStylesheets: 'never' },
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
