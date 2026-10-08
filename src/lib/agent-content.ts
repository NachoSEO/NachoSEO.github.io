/**
 * Versiones en Markdown de cada página para LLMs y agentes.
 * Todo sale del contenido real (colecciones y src/data), así que no hay nada que mantener a mano:
 * alimenta los .md por página, llms.txt y llms-full.txt.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { media, mediaTypeLabels, talks, teaching } from '../data/appearances';
import { caseBrands } from '../data/case-brands';
import { pricingPage } from '../data/pricing';
import { aboutPage, bio, projects, timeline } from '../data/profile';
import { localizedRoute, formatDate } from '../i18n/utils';
import type { Lang } from '../i18n/ui';
import { site } from '../site';

export const SITE_URL = 'https://nachomascort.com';

export interface AgentDoc {
  /** Ruta HTML de la página, p. ej. /sobre-mi/ */
  path: string;
  /** Ruta de su versión Markdown, p. ej. /sobre-mi.md */
  mdPath: string;
  lang: Lang;
  title: string;
  /** Resumen de una línea para llms.txt */
  summary: string;
  /** Post del archivo de SEO Hacks (2015–2017) */
  archived?: boolean;
  markdown: string;
}

export const mdPathFor = (path: string) => (path === '/' ? '/index.md' : `${path.replace(/\/$/, '')}.md`);

const abs = (path: string) => new URL(path, SITE_URL).href;
const byOrder = <T extends { data: { order: number } }>(a: T, b: T) => a.data.order - b.data.order;
const byDateDesc = (a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>) =>
  b.data.pubDate.valueOf() - a.data.pubDate.valueOf();

/** El componente <Tldr items={[...]} /> pasa a ser una lista en Markdown */
function tldrToMarkdown(_match: string, rawItems: string): string {
  const items = [...rawItems.matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((item) => item[1].replace(/<[^>]+>/g, ''));
  return `**TL;DR**\n\n${items.map((item) => `- ${item}`).join('\n')}`;
}

/** Quita sintaxis de MDX que no aporta fuera de la web: imágenes relativas, imports y componentes */
function cleanMdx(body = ''): string {
  return body
    .replace(/^import .*$/gm, '')
    .replace(/<Tldr\s+items=\{\[([\s\S]*?)\]\}\s*\/>/g, tldrToMarkdown)
    .replace(/<[A-Z]\w*(?:\s[^<>]*?)?\/>/g, '')
    .replace(/!\[([^\]]*)\]\(\.\/[^)]+\)/g, (_match, alt: string) => (alt ? `[Imagen: ${alt}]` : ''))
    .replace(/\]\(\//g, `](${SITE_URL}/`)
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function frontmatter(doc: { title: string; path: string; lang: Lang; summary: string }): string {
  return [
    `# ${doc.title}`,
    '',
    `> ${doc.summary}`,
    '',
    `URL: ${abs(doc.path)} · ${doc.lang === 'es' ? 'Idioma: español' : 'Language: English'}`,
  ].join('\n');
}

const booking = (lang: Lang) =>
  lang === 'es'
    ? `## Contacto\n\n- Reservar una llamada de 30 minutos: ${site.calUrl}\n- Email: ${site.email}\n- LinkedIn: ${site.social.linkedin}`
    : `## Contact\n\n- Book a 30-minute call: ${site.calUrl}\n- Email: ${site.email}\n- LinkedIn: ${site.social.linkedin}`;

const bioMarkdown = (lang: Lang) =>
  bio[lang]
    .map((paragraph) => paragraph.map((segment) => (segment.strong ? `**${segment.text.trim()}**` : segment.text)).join(''))
    .join('\n\n');

let cachedDocs: Promise<AgentDoc[]> | undefined;

/** Se calcula una vez por build: lo usan los .md, llms.txt, llms-full.txt y el <link> de cada página */
export function getAgentDocs(): Promise<AgentDoc[]> {
  cachedDocs ??= buildAgentDocs();
  return cachedDocs;
}

async function buildAgentDocs(): Promise<AgentDoc[]> {
  const [services, cases, posts] = await Promise.all([
    getCollection('services'),
    getCollection('caseStudies'),
    getCollection('blog'),
  ]);
  const docs: AgentDoc[] = [];
  const langs: Lang[] = ['es', 'en'];

  for (const lang of langs) {
    const es = lang === 'es';
    const langServices = services.filter((entry) => entry.data.lang === lang).sort(byOrder);
    const langCases = cases.filter((entry) => entry.data.lang === lang).sort(byOrder);
    const servicesBase = localizedRoute('services', lang);
    const casesBase = localizedRoute('cases', lang);
    const blogBase = localizedRoute('blog', lang);

    const serviceLines = langServices.map(
      (entry) => `- [${entry.data.title}](${abs(`${servicesBase}${entry.data.slug}/`)}): ${entry.data.tagline}`
    );
    const caseLines = langCases.map((entry) => {
      const [metric] = entry.data.metrics;
      return `- [${entry.data.title}](${abs(`${casesBase}${entry.data.slug}/`)})${metric ? `: ${metric.value} ${metric.label}` : ''}`;
    });

    // Home
    const homePath = localizedRoute('home', lang);
    const homeSummary = es
      ? 'Consultoría de SEO, GEO e IA que genera negocio. Nacho Mascort, Barcelona.'
      : 'SEO, GEO & AI consulting that drives revenue. Nacho Mascort, Barcelona.';
    docs.push({
      path: homePath,
      mdPath: mdPathFor(homePath),
      lang,
      title: 'Nacho Mascort',
      summary: homeSummary,
      markdown: [
        frontmatter({ title: 'Nacho Mascort', path: homePath, lang, summary: homeSummary }),
        bioMarkdown(lang),
        `## ${es ? 'Servicios' : 'Services'}\n\n${serviceLines.join('\n')}`,
        `## ${es ? 'Casos' : 'Case studies'}\n\n${caseLines.join('\n')}`,
        booking(lang),
      ].join('\n\n'),
    });

    // Sobre mí
    const aboutPath = localizedRoute('about', lang);
    const aboutTitle = aboutPage[lang].title;
    docs.push({
      path: aboutPath,
      mdPath: mdPathFor(aboutPath),
      lang,
      title: aboutTitle,
      summary: aboutPage[lang].description,
      markdown: [
        frontmatter({ title: aboutTitle, path: aboutPath, lang, summary: aboutPage[lang].description }),
        bioMarkdown(lang),
        `## ${es ? 'Trayectoria' : 'Track record'}\n\n${timeline[lang]
          .map(
            (item) =>
              `### ${item.role} (${item.period})\n\n${item.detail}${item.results ? `\n\n${item.results.map((result) => `- ${result}`).join('\n')}` : ''}`
          )
          .join('\n\n')}`,
        `## ${es ? 'Proyectos' : 'Projects'}\n\n${projects[lang].map((project) => `- [${project.name}](${project.url}): ${project.detail}`).join('\n')}`,
        `## ${es ? 'Docencia' : 'Teaching'}\n\n${teaching
          .map((item) => `- ${item.program[lang]}, ${item.school}${item.period ? ` (${item.period})` : ''}: ${item.topics[lang]}. ${item.url}`)
          .join('\n')}`,
        `## ${es ? 'Charlas' : 'Talks'}\n\n${talks.map((talk) => `- ${talk.event} ${talk.year}: ${talk.title[lang]}. ${es ? 'Slides' : 'Slides'}: ${talk.url}`).join('\n')}`,
        `## ${es ? 'Podcasts, medios y artículos' : 'Podcasts, press and articles'}\n\n${media
          .map((item) => `- ${mediaTypeLabels[item.type][lang]} · ${item.outlet}: [${item.title}](${item.url})`)
          .join('\n')}`,
        booking(lang),
      ].join('\n\n'),
    });

    // Contacto
    const contactPath = localizedRoute('contact', lang);
    const contactTitle = es ? 'Contacto' : 'Contact';
    const contactSummary = es
      ? 'Reserva una llamada de 30 minutos con Nacho Mascort para hablar de SEO, GEO, IA o growth.'
      : 'Book a 30-minute call with Nacho Mascort to talk about SEO, GEO, AI or growth.';
    docs.push({
      path: contactPath,
      mdPath: mdPathFor(contactPath),
      lang,
      title: contactTitle,
      summary: contactSummary,
      markdown: [frontmatter({ title: contactTitle, path: contactPath, lang, summary: contactSummary }), booking(lang)].join('\n\n'),
    });

    // Servicios
    const servicesTitle = es ? 'Consultoría SEO técnica' : 'Growth, AI and SEO services';
    const servicesSummary = es
      ? 'Consultoría SEO técnica para webs grandes, auditoría, migraciones, SEO internacional, recuperar tráfico tras un core update y GEO. También growth, sistemas de IA y formación.'
      : 'SEO and GEO consulting, fractional Head of Growth, AI systems and training.';
    docs.push({
      path: servicesBase,
      mdPath: mdPathFor(servicesBase),
      lang,
      title: servicesTitle,
      summary: servicesSummary,
      markdown: [frontmatter({ title: servicesTitle, path: servicesBase, lang, summary: servicesSummary }), serviceLines.join('\n'), booking(lang)].join('\n\n'),
    });

    if (es) {
      docs.push({
        path: pricingPage.path,
        mdPath: mdPathFor(pricingPage.path),
        lang,
        title: pricingPage.title,
        summary: pricingPage.description,
        markdown: [
          frontmatter({ title: pricingPage.title, path: pricingPage.path, lang, summary: pricingPage.description }),
          pricingPage.lede,
          `## Cómo trabajo y cuánto dura cada proyecto\n\n${pricingPage.formats.map((format) => `- **[${format.name}](${abs(format.href)})** (${format.duration}): ${format.detail}`).join('\n')}`,
          `## Qué sube y qué baja el precio\n\n${pricingPage.drivers.map((driver) => `- **${driver.title}**: ${driver.detail}`).join('\n')}`,
          `## Qué pedir a cualquier presupuesto SEO\n\n${pricingPage.checklist.map((item) => `- ${item}`).join('\n')}\n\nSeñales para desconfiar:\n\n${pricingPage.redFlags.map((item) => `- ${item}`).join('\n')}`,
          `## FAQ\n\n${pricingPage.faq.map((item) => `### ${item.question}\n\n${item.answer}`).join('\n\n')}`,
          `Formulario de presupuesto: ${abs(`${pricingPage.path}#presupuesto`)}`,
          booking(lang),
        ].join('\n\n'),
      });
    }

    for (const entry of langServices) {
      const { data } = entry;
      const path = `${servicesBase}${data.slug}/`;
      const casesForService = data.page.proofCases
        .map((proof) => {
          const caseEntry = langCases.find((item) => item.data.translationKey === proof.caseKey);
          return caseEntry ? `- [${caseEntry.data.title}](${abs(`${casesBase}${caseEntry.data.slug}/`)}): ${proof.summary}` : '';
        })
        .filter(Boolean);
      docs.push({
        path,
        mdPath: mdPathFor(path),
        lang,
        title: data.title,
        summary: data.description,
        markdown: [
          frontmatter({ title: data.title, path, lang, summary: data.tagline }),
          data.page.heroProof,
          `## ${es ? 'Para quién es' : "Who it's for"}\n\n${data.page.fit.yes.map((item) => `- ${item}`).join('\n')}\n\n${es ? 'No es para ti si:' : "It's not for you if:"}\n\n${data.page.fit.no.map((item) => `- ${item}`).join('\n')}`,
          `## ${data.page.pov.title}\n\n${data.page.pov.paragraphs.join('\n\n')}`,
          data.page.checks
            ? `## ${es ? 'Qué miro' : 'What I look at'}\n\n${data.page.checks.map((check) => `- **${check.title}**: ${check.detail}`).join('\n')}`
            : '',
          data.page.example
            ? `## ${data.page.example.title}\n\n${data.page.example.intro}${data.page.example.items.length ? `\n\n${data.page.example.items.map((item) => `- ${item}`).join('\n')}` : ''}${data.page.example.note ? `\n\n${data.page.example.note}` : ''}${data.page.example.link ? `\n\n[${data.page.example.link.text}](${abs(data.page.example.link.href)})` : ''}`
            : '',
          `## ${es ? 'Cómo trabajamos' : 'How we work'}\n\n${data.page.process.map((step, index) => `${index + 1}. **${step.title}** (${step.when}): ${step.detail}`).join('\n')}`,
          `## ${es ? 'Qué te llevas' : 'What you get'}\n\n${data.deliverables.map((item) => `- **${item.title}**: ${item.detail}`).join('\n')}`,
          casesForService.length ? `## ${es ? 'Resultados' : 'Results'}\n\n${casesForService.join('\n')}` : '',
          `## ${es ? 'Formatos y precio' : 'Formats and pricing'}\n\n${data.page.formats.map((format) => `- **${format.name}**: ${format.detail}`).join('\n')}\n\n${data.page.pricing}${data.page.availability ? `\n\n${data.page.availability}` : ''}`,
          data.page.related.length
            ? `## ${es ? 'Para leer antes de hablar' : 'Worth reading first'}\n\n${data.page.related.map((item) => `- [${item.title}](${abs(item.href)}): ${item.note}`).join('\n')}`
            : '',
          `## FAQ\n\n${data.faq.map((item) => `### ${item.question}\n\n${item.answer}`).join('\n\n')}`,
          booking(lang),
        ]
          .filter(Boolean)
          .join('\n\n'),
      });
    }

    // Casos
    const casesTitle = es ? 'Casos con cifras reales' : 'Case studies with real numbers';
    const casesSummary = es
      ? 'Proyectos de Nacho Mascort con el punto de partida, lo que hizo y el resultado medido.'
      : "Nacho Mascort's projects with the starting point, what he did and the measured result.";
    docs.push({
      path: casesBase,
      mdPath: mdPathFor(casesBase),
      lang,
      title: casesTitle,
      summary: casesSummary,
      markdown: [frontmatter({ title: casesTitle, path: casesBase, lang, summary: casesSummary }), caseLines.join('\n')].join('\n\n'),
    });

    for (const entry of langCases) {
      const path = `${casesBase}${entry.data.slug}/`;
      const brand = caseBrands[entry.data.translationKey]?.brand;
      const company = brand ? (brand.kind === 'image' ? brand.alt : brand.text) : '';
      docs.push({
        path,
        mdPath: mdPathFor(path),
        lang,
        title: entry.data.title,
        summary: entry.data.description,
        markdown: [
          frontmatter({ title: entry.data.title, path, lang, summary: entry.data.description }),
          company ? `${es ? 'Empresa' : 'Company'}: ${company}` : '',
          `## ${es ? 'Cifras' : 'Key numbers'}\n\n${entry.data.metrics.map((metric) => `- **${metric.value}** ${metric.label}`).join('\n')}`,
          cleanMdx(entry.body),
        ]
          .filter(Boolean)
          .join('\n\n'),
      });
    }

    // Blog
    const langPosts = posts.filter((post) => post.data.lang === lang).sort(byDateDesc);
    const current = langPosts.filter((post) => post.data.category !== 'seohacks');
    const archive = langPosts.filter((post) => post.data.category === 'seohacks');
    const postLine = (post: CollectionEntry<'blog'>) =>
      `- [${post.data.title}](${abs(`${blogBase}${post.data.slug}/`)}) (${formatDate(post.data.pubDate, lang)}): ${post.data.description}`;
    const blogTitle = 'Blog';
    const blogSummary = es
      ? 'Artículos sobre growth, IA aplicada, SEO y GEO, más el archivo de SEO Hacks (2015–2017).'
      : 'Articles on growth, applied AI, SEO and GEO.';
    docs.push({
      path: blogBase,
      mdPath: mdPathFor(blogBase),
      lang,
      title: blogTitle,
      summary: blogSummary,
      markdown: [
        frontmatter({ title: blogTitle, path: blogBase, lang, summary: blogSummary }),
        current.map(postLine).join('\n'),
        archive.length ? `## SEO Hacks (${es ? 'archivo' : 'archive'} 2015–2017)\n\n${abs('/blog/seo-hacks/')}` : '',
      ]
        .filter(Boolean)
        .join('\n\n'),
    });

    if (archive.length) {
      const archivePath = '/blog/seo-hacks/';
      const archiveSummary =
        'Artículos de SEO Hacks, el blog que Nacho Mascort escribió entre 2015 y 2017, conservados como archivo. Parte de la información puede estar desactualizada.';
      docs.push({
        path: archivePath,
        mdPath: mdPathFor(archivePath),
        lang,
        title: 'SEO Hacks',
        summary: archiveSummary,
        markdown: [frontmatter({ title: 'SEO Hacks', path: archivePath, lang, summary: archiveSummary }), archive.map(postLine).join('\n')].join('\n\n'),
      });
    }

    for (const post of langPosts) {
      const path = `${blogBase}${post.data.slug}/`;
      const isArchive = post.data.category === 'seohacks';
      docs.push({
        path,
        mdPath: mdPathFor(path),
        lang,
        title: post.data.title,
        summary: post.data.description,
        archived: isArchive,
        markdown: [
          frontmatter({ title: post.data.title, path, lang, summary: post.data.description }),
          `${es ? 'Autor' : 'Author'}: Nacho Mascort · ${es ? 'Publicado' : 'Published'}: ${formatDate(post.data.pubDate, lang)}`,
          isArchive
            ? '> Artículo recuperado de SEO Hacks (2015–2017) y conservado como archivo. Faltan algunas imágenes y parte de la información puede estar obsoleta; ten en cuenta la fecha de publicación.'
            : '',
          cleanMdx(post.body),
          post.data.citations.length > 0
            ? [
                `## ${es ? 'Referencias' : 'References'}`,
                '',
                ...post.data.citations.map(
                  (source, index) =>
                    `${index + 1}. ${source.author ? `${source.author}. ` : ''}[${source.title}](${source.url})${source.publisher ? `. ${source.publisher}` : ''}${source.date ? ` (${source.date})` : ''}`
                ),
              ].join('\n')
            : '',
        ]
          .filter(Boolean)
          .join('\n\n'),
      });
    }
  }

  return docs;
}
