/** Generación de sitemaps XML en el navegador (protocolo sitemaps.org 0.9) */

export const MAX_URLS_PER_SITEMAP = 50_000;
export const MAX_BYTES_PER_SITEMAP = 50 * 1024 * 1024;

export interface ParsedUrls {
  valid: string[];
  invalid: string[];
  duplicates: number;
}

export interface SitemapFile {
  name: string;
  content: string;
  urlCount: number;
}

export interface SitemapGroup {
  key: string;
  urlCount: number;
  files: SitemapFile[];
}

export interface BuildOptions {
  baseName: string;
  lastmod?: string;
}

const XML_HEAD = '<?xml version="1.0" encoding="UTF-8"?>';
const XMLNS = 'http://www.sitemaps.org/schemas/sitemap/0.9';

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Una URL por línea (también vale separadas por espacios o tabuladores) */
export function parseUrls(text: string): ParsedUrls {
  const seen = new Set<string>();
  const invalid: string[] = [];
  let duplicates = 0;

  const candidates = text.split(/\s+/).filter(Boolean);

  for (const candidate of candidates) {
    const normalized = normalizeUrl(candidate);
    if (!normalized) {
      invalid.push(candidate);
    } else if (seen.has(normalized)) {
      duplicates += 1;
    } else {
      seen.add(normalized);
    }
  }

  return { valid: [...seen], invalid, duplicates };
}

/** Devuelve la URL absoluta normalizada (host en punycode, caracteres codificados) o null si no es http(s) */
function normalizeUrl(candidate: string): string | null {
  if (!/^https?:\/\//i.test(candidate)) return null;
  try {
    const url = new URL(candidate);
    return url.hostname.includes('.') || url.hostname === 'localhost' ? url.href : null;
  } catch {
    return null;
  }
}

/** Separa una línea CSV respetando los campos entre comillas */
function splitCsvLine(line: string, delimiter: string): string[] {
  const cells: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' && quoted && line[i + 1] === '"') {
      cell += '"';
      i++;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === delimiter && !quoted) {
      cells.push(cell);
      cell = '';
    } else {
      cell += char;
    }
  }
  cells.push(cell);
  return cells.map((value) => value.trim());
}

/** Extrae la columna de URLs de un CSV (exportaciones de Screaming Frog, Search Console…) */
export function extractCsvUrls(text: string): string {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  const sample = lines.slice(0, 20).join('\n');
  const delimiter = [',', ';', '\t'].reduce((best, candidate) =>
    sample.split(candidate).length > sample.split(best).length ? candidate : best
  );
  const rows = lines.map((line) => splitCsvLine(line, delimiter));
  const isUrl = (value = '') => /^https?:\/\//i.test(value);
  const firstUrlRow = rows.find((row) => row.some((cell) => isUrl(cell)));
  if (!firstUrlRow) return text;

  const column = firstUrlRow.findIndex((cell) => isUrl(cell));
  return rows
    .map((row) => row[column] ?? '')
    .filter((value, index) => index > 0 || isUrl(value))
    .join('\n');
}

/** Agrupa por la parte del host que captura la RegExp (por defecto, el host completo) */
export function groupByHost(urls: string[], pattern: string): Map<string, string[]> {
  let regexp: RegExp;
  try {
    regexp = new RegExp(pattern || '.*');
  } catch {
    throw new Error('invalid-regexp');
  }

  const groups = new Map<string, string[]>();
  for (const url of urls) {
    const { host } = new URL(url);
    const key = host.match(regexp)?.[0] || host;
    const bucket = groups.get(key);
    if (bucket) bucket.push(url);
    else groups.set(key, [url]);
  }
  return groups;
}

function urlEntry(url: string, lastmod?: string): string {
  const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
  return `  <url>\n    <loc>${escapeXml(url)}</loc>${lastmodTag}\n  </url>`;
}

function urlset(entries: string[]): string {
  return `${XML_HEAD}\n<urlset xmlns="${XMLNS}">\n${entries.join('\n')}\n</urlset>\n`;
}

/** Reparte las entradas respetando a la vez el límite de URLs y el de tamaño por fichero */
function chunkEntries(entries: string[]): string[][] {
  const overhead = urlset([]).length;
  const chunks: string[][] = [];
  let current: string[] = [];
  let currentBytes = overhead;

  for (const entry of entries) {
    // Las URLs normalizadas son ASCII, así que la longitud coincide con los bytes
    const entryBytes = entry.length + 1;
    if (current.length > 0 && (current.length >= MAX_URLS_PER_SITEMAP || currentBytes + entryBytes > MAX_BYTES_PER_SITEMAP)) {
      chunks.push(current);
      current = [];
      currentBytes = overhead;
    }
    current.push(entry);
    currentBytes += entryBytes;
  }
  if (current.length > 0) chunks.push(current);
  return chunks;
}

export function buildSitemaps(urls: string[], { baseName, lastmod }: BuildOptions): SitemapFile[] {
  const chunks = chunkEntries(urls.map((url) => urlEntry(url, lastmod)));

  if (chunks.length === 1) {
    return [{ name: `${baseName}.xml`, content: urlset(chunks[0]), urlCount: urls.length }];
  }

  const sitemaps = chunks.map((entries, index) => ({
    name: `${baseName}-${index + 1}.xml`,
    content: urlset(entries),
    urlCount: entries.length,
  }));

  // El índice apunta a la raíz del primer origen del grupo, donde se espera que se suban los ficheros
  const { origin } = new URL(urls[0]);
  const indexEntries = sitemaps.map(({ name }) => {
    const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
    return `  <sitemap>\n    <loc>${escapeXml(`${origin}/${name}`)}</loc>${lastmodTag}\n  </sitemap>`;
  });
  const index = {
    name: `${baseName}-index.xml`,
    content: `${XML_HEAD}\n<sitemapindex xmlns="${XMLNS}">\n${indexEntries.join('\n')}\n</sitemapindex>\n`,
    urlCount: 0,
  };

  return [index, ...sitemaps];
}

export function generateSitemapGroups(urls: string[], pattern: string, options: BuildOptions): SitemapGroup[] {
  return [...groupByHost(urls, pattern)].map(([key, groupUrls]) => ({
    key,
    urlCount: groupUrls.length,
    files: buildSitemaps(groupUrls, options),
  }));
}

/** Nombre de carpeta/fichero seguro a partir de la clave del grupo o del nombre que escribe el usuario */
export function safeFileName(value: string, fallback: string): string {
  const cleaned = value.trim().replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^[-.]+|[-.]+$/g, '');
  return cleaned || fallback;
}
