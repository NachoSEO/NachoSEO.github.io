/**
 * <lastmod> del sitemap a partir de git: cada URL toma la fecha del último commit que tocó sus ficheros fuente
 * (la página, su entrada de contenido, los datos y componentes propios que importa). Los cambios globales
 * (layout, estilos, cabecera) no cuentan: si marcaran todas las URLs como cambiadas, Google dejaría de fiarse.
 * Si el repositorio no tiene historial (clon superficial sin posibilidad de completarlo), no se pone lastmod:
 * mejor ninguna fecha que una falsa.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const root = process.cwd();
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim();

/** Historial completo o nada: en un clon superficial todas las fechas serían la del último commit */
const ensureHistory = () => {
  try {
    if (git('rev-parse', '--is-shallow-repository') !== 'true') return true;
    git('fetch', '--unshallow', '--quiet');
    return git('rev-parse', '--is-shallow-repository') !== 'true';
  } catch {
    return false;
  }
};

/** Fecha del último commit de cada fichero de src/, en una sola pasada por el log */
const lastCommitByFile = () => {
  const dates = new Map();
  let current = null;
  for (const line of git('log', '--format=@%cI', '--name-only', '--', 'src').split('\n')) {
    if (line.startsWith('@')) current = line.slice(1);
    else if (line && current && !dates.has(line)) dates.set(line, current);
  }
  return dates;
};

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

const rel = (file) => relative(root, file).split('\\').join('/');

/** Rutas de las entradas de contenido: slug y lang del frontmatter */
const COLLECTIONS = {
  blog: { es: '/blog/', en: '/en/blog/' },
  'case-studies': { es: '/casos/', en: '/en/case-studies/' },
  services: { es: '/servicios/', en: '/en/services/' },
};

const contentSources = () => {
  const routes = new Map();
  const newestByIndex = new Map();
  for (const [collection, prefixes] of Object.entries(COLLECTIONS)) {
    const base = join(root, 'src/content', collection);
    if (!existsSync(base)) continue;
    for (const file of walk(base).filter((path) => path.endsWith('.mdx'))) {
      const frontmatter = readFileSync(file, 'utf8').split('---')[1] ?? '';
      const slug = frontmatter.match(/^slug:\s*['"]?([^'"\n]+)['"]?\s*$/m)?.[1]?.trim();
      const lang = frontmatter.match(/^lang:\s*['"]?(es|en)['"]?\s*$/m)?.[1] ?? (rel(file).includes('/en/') ? 'en' : 'es');
      if (!slug) continue;
      // Un post en carpeta propia cuenta también sus imágenes y componentes
      const isFolder = /\/index\.mdx$/.test(file);
      const files = isFolder ? walk(dirname(file)).map(rel) : [rel(file)];
      const route = `${prefixes[lang]}${slug}/`;
      routes.set(route, files);
      newestByIndex.set(prefixes[lang], [...(newestByIndex.get(prefixes[lang]) ?? []), ...files]);
    }
  }
  return { routes, newestByIndex };
};

/** Ficheros propios que importa una página: datos y componentes de herramientas, estudios y guía (no el layout) */
const OWN_IMPORTS = /^src\/(data|components\/(tools|studies|guide))\//;
const ownImports = (pageFile) => {
  const source = readFileSync(join(root, pageFile), 'utf8');
  const imports = [...source.matchAll(/from\s+['"](\.{1,2}\/[^'"]+)['"]/g)].map((match) => match[1]);
  return imports
    .map((path) => {
      const absolute = resolve(dirname(join(root, pageFile)), path);
      const candidate = [absolute, `${absolute}.ts`, `${absolute}.astro`, `${absolute}.mjs`].find((file) => existsSync(file) && statSync(file).isFile());
      return candidate ? rel(candidate) : null;
    })
    .filter((file) => file && OWN_IMPORTS.test(file));
};

const pageFileFor = (pathname) => {
  const route = pathname.replace(/^\/|\/$/g, '');
  const candidates = route ? [`src/pages/${route}.astro`, `src/pages/${route}/index.astro`] : ['src/pages/index.astro'];
  return candidates.find((file) => existsSync(join(root, file))) ?? null;
};

export const createLastmod = () => {
  if (!ensureHistory()) {
    console.warn('[sitemap-lastmod] sin historial de git: el sitemap sale sin lastmod');
    return () => undefined;
  }
  const dates = lastCommitByFile();
  const { routes, newestByIndex } = contentSources();
  const newest = (files) =>
    files
      .map((file) => dates.get(file))
      .filter(Boolean)
      .sort()
      .at(-1);

  return (url) => {
    const pathname = new URL(url).pathname;
    const files = [];
    const content = routes.get(pathname);
    if (content) files.push(...content);
    const page = pageFileFor(pathname);
    if (page) files.push(page, ...ownImports(page));
    // Índices de colección: cambian cuando cambia cualquiera de sus entradas
    files.push(...(newestByIndex.get(pathname) ?? []));
    return newest(files);
  };
};
