import type { APIRoute } from 'astro';
import { aboutPage } from '../data/profile';
import { getAgentDocs, SITE_URL } from '../lib/agent-content';
import { site } from '../site';

/** Índice para LLMs (https://llmstxt.org), generado a partir del contenido en cada build */
export const GET: APIRoute = async () => {
  const docs = await getAgentDocs();
  const link = (doc: (typeof docs)[number]) => `- [${doc.title}](${SITE_URL}${doc.mdPath}): ${doc.summary}`;
  const section = (title: string, filter: (doc: (typeof docs)[number]) => boolean) => {
    const items = docs.filter(filter);
    return items.length ? `## ${title}\n\n${items.map(link).join('\n')}` : '';
  };
  const isUnder = (prefix: string) => (doc: (typeof docs)[number]) => doc.path.startsWith(prefix) && doc.path !== prefix;

  const body = [
    '# Nacho Mascort',
    `> ${aboutPage.en.description} Consultant in SEO, GEO and AI based in Barcelona; former Head of SEO at Cliqpod (word.tips) and SEO Manager at Softonic; today Head of Organic Marketing and Head of AI at Reverse Tech and founder of the AI agency Gradual (https://gradual.pro).`,
    'The site is bilingual: Spanish (default, at /) and English (at /en/). Every page has a Markdown version at the same URL ending in .md (for example /sobre-mi.md). The full content is in llms-full.txt.',
    `- Book a 30-minute call: ${site.calUrl}\n- Email: ${site.email}\n- Full content: ${SITE_URL}/llms-full.txt`,
    section('Main pages', (doc) => ['/', '/en/', '/sobre-mi/', '/en/about/', '/contacto/', '/en/contact/'].includes(doc.path)),
    section('Services', (doc) => isUnder('/servicios/')(doc) || isUnder('/en/services/')(doc)),
    section('Case studies', (doc) => isUnder('/casos/')(doc) || isUnder('/en/case-studies/')(doc)),
    section('Blog', (doc) => (isUnder('/blog/')(doc) || isUnder('/en/blog/')(doc)) && !doc.archived && doc.path !== '/blog/seo-hacks/'),
    [
      '## Free tools',
      '',
      `- [Generador de sitemap XML](${SITE_URL}/herramientas/generador-sitemap/): crea un sitemap.xml gratis a partir de una lista de URLs o un CSV, sin enviar los datos a ningún servidor.`,
      `- [XML sitemap generator](${SITE_URL}/en/tools/sitemap-generator/): build a sitemap.xml for free from a list of URLs or a CSV; your data never leaves the browser.`,
    ].join('\n'),
    section('Optional', (doc) => ['/servicios/', '/en/services/', '/casos/', '/en/case-studies/', '/blog/', '/en/blog/', '/blog/seo-hacks/'].includes(doc.path)),
  ]
    .filter(Boolean)
    .join('\n\n');

  return new Response(`${body}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
