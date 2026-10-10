// Imagen para compartir (og:image) de cada página, al estilo de la portada: foto recortada, etiqueta de sección y el H1
// de la página con sus acentos de color. Se genera al final del build a partir del HTML ya construido, así que cualquier
// página nueva tiene la suya sin tocar nada. Solo se pintan las páginas cuyo og:image apunta a /og/ (ver ogImagePathFor);
// si una no tiene H1, se copia la imagen genérica para que el enlace nunca dé 404.
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import sharp from 'sharp';
import { ogImagePathFor } from '../lib/og-path.mjs';

const WIDTH = 1200;
const HEIGHT = 630;
const COLORS = { bg: '#14333f', backdrop: '#1f4a5a', ink: '#ffffff', accent: '#f0154f', eyebrow: '#ff6b8e', muted: '#b9c6cb' };

/** Etiqueta encima del título según la sección de la URL */
const eyebrowFor = (path, lang) => {
  const section = path.replace(/^\/en\//, '/').split('/')[1] || '';
  const isIndex = path.replace(/^\/en\//, '/').split('/').filter(Boolean).length === 1;
  const labels = {
    servicios: isIndex ? ['Servicios', 'Services'] : ['Servicio', 'Service'],
    services: isIndex ? ['Servicios', 'Services'] : ['Servicio', 'Service'],
    casos: ['Caso de éxito', 'Case study'],
    'case-studies': ['Caso de éxito', 'Case study'],
    blog: ['Blog', 'Blog'],
    estudios: ['Estudio', 'Study'],
    'guia-geo': ['Guía GEO', 'GEO guide'],
    herramientas: ['Herramienta gratis', 'Free tool'],
    tools: ['Herramienta gratis', 'Free tool'],
    skills: ['Skills para IA', 'AI skills'],
    'sobre-mi': ['Sobre mí', 'About'],
    about: ['Sobre mí', 'About'],
  };
  const pair = labels[section];
  return pair ? pair[lang === 'en' ? 1 : 0] : 'Nacho Mascort';
};

const decodeEntities = (text) =>
  text
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');

/** Trozos del H1 con su acento: los <span class="accent"> de la página salen en rojo también en la imagen */
const headlineParts = (h1Html) =>
  h1Html
    .split(/(<span[^>]*class="[^"]*\baccent\b[^"]*"[^>]*>[\s\S]*?<\/span>)/)
    .map((chunk) => ({
      accent: /^<span[^>]*\baccent\b/.test(chunk),
      text: decodeEntities(chunk.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' '),
    }))
    .filter((part) => part.text.trim());

const fontSizeFor = (length) => (length <= 45 ? 72 : length <= 70 ? 62 : length <= 100 ? 52 : 44);

const element = (type, style, children) => ({ type, props: { style, children } });

const template = ({ eyebrow, parts, portrait }) => {
  const length = parts.reduce((total, part) => total + part.text.length, 0);
  const words = parts.flatMap((part) =>
    part.text
      .trim()
      .split(' ')
      .map((word) => element('span', { color: part.accent ? COLORS.accent : COLORS.ink, marginRight: '0.24em' }, word)),
  );
  return element(
    'div',
    { width: WIDTH, height: HEIGHT, display: 'flex', position: 'relative', background: COLORS.bg, fontFamily: 'Geist' },
    [
      element('div', {
        position: 'absolute',
        left: 760,
        top: 260,
        width: 520,
        height: 520,
        borderRadius: 9999,
        background: COLORS.backdrop,
      }),
      { type: 'img', props: { src: portrait, width: 470, height: 560, style: { position: 'absolute', left: 735, top: 70 } } },
      element('div', { display: 'flex', flexDirection: 'column', position: 'absolute', left: 72, top: 92, width: 640 }, [
        element(
          'div',
          { display: 'flex', fontSize: 22, fontWeight: 700, letterSpacing: 2, color: COLORS.eyebrow, fontFamily: 'Instrument Sans' },
          eyebrow.toUpperCase(),
        ),
        element(
          'div',
          {
            display: 'flex',
            flexWrap: 'wrap',
            marginTop: 28,
            fontFamily: 'Instrument Sans',
            fontWeight: 600,
            fontSize: fontSizeFor(length),
            lineHeight: 1.08,
            letterSpacing: -1.5,
          },
          words,
        ),
      ]),
      element('div', { position: 'absolute', left: 72, bottom: 64, fontSize: 24, fontWeight: 500, color: COLORS.muted }, 'nachomascort.com'),
    ],
  );
};

const htmlFiles = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries.filter((entry) => entry.isFile() && entry.name.endsWith('.html')).map((entry) => `${entry.parentPath}/${entry.name}`);
};

export default function ogImages() {
  return {
    name: 'og-images',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(new URL('../', import.meta.url));
        const font = (file) => readFile(`${root}assets/og/${file}`);
        const fonts = [
          { name: 'Instrument Sans', data: await font('instrument-sans-latin-600-normal.woff'), weight: 600 },
          { name: 'Instrument Sans', data: await font('instrument-sans-latin-700-normal.woff'), weight: 700 },
          { name: 'Geist', data: await font('geist-latin-500-normal.woff'), weight: 500 },
        ];
        const portraitPng = await sharp(`${root}assets/img/nacho-hero.webp`).resize({ width: 940 }).png().toBuffer();
        const portrait = `data:image/png;base64,${portraitPng.toString('base64')}`;

        const outDir = fileURLToPath(dir);
        let count = 0;
        for (const file of await htmlFiles(outDir)) {
          const html = await readFile(file, 'utf8');
          const ogImage = html.match(/<meta property="og:image" content="https?:\/\/[^/"]+(\/og\/[^"]+\.png)"/)?.[1];
          const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1];
          if (!ogImage) continue;
          const target = `${outDir}${ogImage.slice(1)}`;
          await mkdir(dirname(target), { recursive: true });
          if (!h1) {
            await writeFile(target, await readFile(`${outDir}og-fallback.png`));
            continue;
          }
          const path = html.match(/<link rel="canonical" href="https?:\/\/[^/"]+([^"]*)"/)?.[1] ?? '/';
          const lang = html.match(/<html lang="([a-z]+)"/)?.[1] ?? 'es';
          const svg = await satori(template({ eyebrow: eyebrowFor(path, lang), parts: headlineParts(h1), portrait }), {
            width: WIDTH,
            height: HEIGHT,
            fonts,
          });
          await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(target);
          count += 1;
        }
        logger.info(`${count} imágenes para compartir generadas en /og/`);
      },
    },
  };
}
