/**
 * Cliente de /api/url-status y /api/sitemap-fetch para el comprobador de redirecciones y el auditor de sitemap.
 * El WAF de Cloudflare deja 5 llamadas a /api/* cada 10 s por IP: aquí se hacen 4 como mucho.
 */
import type { Trace } from './safe-fetch';
import { toCsv } from './csv';

export type { Trace };

const WINDOW_MS = 10_000;
const CALLS_PER_WINDOW = 4;
const BATCH_SIZE = 20;
const MAX_ATTEMPTS = 4;
const recentCalls: number[] = [];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Espera lo justo para no pasar de CALLS_PER_WINDOW llamadas en la ventana */
const paced = async <T>(call: () => Promise<Response>, parse: (response: Response) => Promise<T>): Promise<T> => {
  for (let attempt = 0; ; attempt++) {
    while (recentCalls.length && Date.now() - recentCalls[0] > WINDOW_MS) recentCalls.shift();
    if (recentCalls.length >= CALLS_PER_WINDOW) {
      await sleep(WINDOW_MS - (Date.now() - recentCalls[0]) + 50);
      continue;
    }
    recentCalls.push(Date.now());
    const response = await call();
    if (response.status === 429 && attempt < MAX_ATTEMPTS) {
      await sleep(WINDOW_MS);
      continue;
    }
    return parse(response);
  }
};

export const checkUrls = async (
  urls: string[],
  agent: string,
  onProgress: (done: number, total: number, results: Trace[]) => void,
  isCancelled: () => boolean = () => false
) => {
  const results: Trace[] = [];
  let queue = [...urls];
  let attempts = 0;
  while (queue.length && !isCancelled()) {
    const batch = queue.slice(0, BATCH_SIZE);
    const data = await paced(
      () => fetch('/api/url-status', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ urls: batch, agent }) }),
      async (response) => (response.ok ? ((await response.json()) as { results: Trace[] }) : null)
    );
    if (!data) throw new Error('api');
    const done = data.results.filter((trace) => !trace.pending);
    const pending = data.results.filter((trace) => trace.pending).map((trace) => trace.url);
    // Si una llamada no termina ninguna URL, algo va mal (cadenas eternas): se corta a los pocos intentos
    attempts = done.length ? 0 : attempts + 1;
    if (attempts >= MAX_ATTEMPTS) throw new Error('stuck');
    results.push(...done);
    queue = [...pending, ...queue.slice(batch.length)];
    onProgress(results.length, urls.length, results);
  }
  return results;
};

// ---------- Problemas de cada URL ----------

export type TraceIssue = 'error' | 'client-error' | 'server-error' | 'chain' | 'temporary' | 'loop' | 'meta-refresh' | 'noindex' | 'canonical' | 'downgrade';

export const traceIssues = (trace: Trace): TraceIssue[] => {
  const issues: TraceIssue[] = [];
  const redirects = trace.hops.filter((hop) => hop.status >= 300 && hop.status < 400);
  if (trace.error === 'loop') issues.push('loop');
  else if (trace.error) issues.push('error');
  if (trace.status !== null && trace.status >= 400 && trace.status < 500) issues.push('client-error');
  if (trace.status !== null && trace.status >= 500) issues.push('server-error');
  if (redirects.length > 1) issues.push('chain');
  if (redirects.some((hop) => hop.status === 302 || hop.status === 303 || hop.status === 307)) issues.push('temporary');
  if (trace.hops.some((hop) => hop.url.startsWith('https:') && hop.location?.startsWith('http:'))) issues.push('downgrade');
  if (trace.metaRefresh) issues.push('meta-refresh');
  if (/noindex|none/i.test(`${trace.xRobotsTag ?? ''} ${trace.metaRobots ?? ''}`)) issues.push('noindex');
  if (trace.canonical && trace.status === 200 && trace.canonical.replace(/#.*$/, '') !== trace.finalUrl.replace(/#.*$/, '')) issues.push('canonical');
  return issues;
};

export const traceTone = (trace: Trace): 'ok' | 'warning' | 'blocked' => {
  const issues = traceIssues(trace);
  if (issues.some((issue) => ['error', 'loop', 'client-error', 'server-error'].includes(issue))) return 'blocked';
  return issues.length ? 'warning' : 'ok';
};

export const tracesToCsv = (traces: Trace[]) =>
  toCsv(
    ['url', 'final_status', 'chain', 'final_url', 'issues', 'canonical', 'x_robots_tag', 'meta_robots', 'error'],
    traces.map((trace) => [
      trace.url,
      trace.status,
      trace.hops.map((hop) => hop.status).join(' > '),
      trace.finalUrl,
      traceIssues(trace).join(' '),
      trace.canonical,
      trace.xRobotsTag,
      trace.metaRobots,
      trace.error,
    ])
  );

// ---------- Sitemaps ----------

export interface SitemapFile {
  url: string;
  type: 'urlset' | 'index' | null;
  urls: number;
  error: string | null;
}

export interface SitemapUrl {
  loc: string;
  lastmod: string | null;
  sitemap: string;
}

const MAX_SITEMAP_FILES = 50;
const MAX_SITEMAP_URLS = 200_000;

const fetchSitemapText = async (url: string) => {
  const response = await paced(
    () => fetch(`/api/sitemap-fetch?url=${encodeURIComponent(url)}`),
    async (response) => response
  );
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error === 'http' ? `http-${data.status}` : (data.error ?? 'api'));
  }
  const stream = response.headers.get('x-sitemap-encoding') === 'gzip' ? response.body!.pipeThrough(new DecompressionStream('gzip')) : response.body!;
  return new Response(stream).text();
};

/** Lee un sitemap y, si es un índice, sus sitemaps hijos (hasta MAX_SITEMAP_FILES) */
export const readSitemapTree = async (rootUrl: string, onProgress: (files: SitemapFile[], urls: number) => void) => {
  const files: SitemapFile[] = [];
  const urls: SitemapUrl[] = [];
  const queue = [rootUrl];
  const seen = new Set<string>();
  while (queue.length && files.length < MAX_SITEMAP_FILES && urls.length < MAX_SITEMAP_URLS) {
    const url = queue.shift()!;
    if (seen.has(url)) continue;
    seen.add(url);
    const file: SitemapFile = { url, type: null, urls: 0, error: null };
    files.push(file);
    try {
      const doc = new DOMParser().parseFromString(await fetchSitemapText(url), 'application/xml');
      if (doc.querySelector('parsererror')) throw new Error('invalid-xml');
      const root = doc.documentElement.localName;
      if (root === 'sitemapindex') {
        file.type = 'index';
        const children = [...doc.getElementsByTagNameNS('*', 'sitemap')].map((node) => node.getElementsByTagNameNS('*', 'loc')[0]?.textContent?.trim()).filter((loc): loc is string => Boolean(loc));
        file.urls = children.length;
        queue.push(...children);
      } else if (root === 'urlset') {
        file.type = 'urlset';
        for (const node of doc.getElementsByTagNameNS('*', 'url')) {
          const loc = node.getElementsByTagNameNS('*', 'loc')[0]?.textContent?.trim();
          if (!loc) continue;
          urls.push({ loc, lastmod: node.getElementsByTagNameNS('*', 'lastmod')[0]?.textContent?.trim() || null, sitemap: url });
          file.urls++;
          if (urls.length >= MAX_SITEMAP_URLS) break;
        }
      } else throw new Error('not-sitemap');
    } catch (error) {
      file.error = error instanceof Error ? error.message : 'api';
    }
    onProgress(files, urls.length);
  }
  return { files, urls, skippedFiles: queue.filter((url) => !seen.has(url)).length, truncated: urls.length >= MAX_SITEMAP_URLS };
};

/** Muestra aleatoria (Fisher-Yates) para no comprobar siempre las primeras URLs del sitemap */
export const sample = <T>(items: T[], size: number) => {
  if (items.length <= size) return [...items];
  const pool = [...items];
  for (let index = pool.length - 1; index > 0; index--) {
    const swap = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[swap]] = [pool[swap], pool[index]];
  }
  return pool.slice(0, size);
};
