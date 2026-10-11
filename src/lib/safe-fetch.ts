/** Peticiones a webs de terceros desde las Pages Functions: solo hosts públicos, con tiempo y tamaño acotados */

export const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
export const FETCH_TIMEOUT_MS = 8000;
export const MAX_REDIRECTS = 3;
// Free plan: 50 subpeticiones y poca CPU por invocación, así que se lee solo el principio de cada respuesta
export const MAX_BODY_BYTES = 64 * 1024;
/** Header que marca las peticiones propias: corta bucles si alguien apunta la herramienta a sí misma */
export const LOOP_HEADER = 'X-Bot-Check';


export interface FetchResult {
  status: number | null;
  finalUrl: string;
  redirects: string[];
  headers: Record<string, string>;
  body: string;
  bytes: number;
  ms: number;
  error?: string;
}

const readCapped = async (response: Response, maxBytes: number) => {
  if (!response.body) return { text: '', bytes: 0 };
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  while (bytes < maxBytes) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    bytes += value.byteLength;
  }
  reader.cancel().catch(() => {});
  const merged = new Uint8Array(Math.min(bytes, maxBytes));
  let offset = 0;
  for (const chunk of chunks) {
    const slice = chunk.subarray(0, merged.length - offset);
    merged.set(slice, offset);
    offset += slice.length;
    if (offset >= merged.length) break;
  }
  return { text: new TextDecoder().decode(merged), bytes };
};

const KEPT_HEADERS = ['content-type', 'x-robots-tag', 'server', 'cf-mitigated', 'location', 'retry-after'];

export const fetchAs = async (url: string, userAgent: string, maxBytes = MAX_BODY_BYTES, maxRedirects = MAX_REDIRECTS): Promise<FetchResult> => {
  const started = Date.now();
  const redirects: string[] = [];
  let currentUrl = url;
  try {
    for (let hop = 0; hop <= maxRedirects; hop++) {
      if (!isFetchable(new URL(currentUrl))) {
        return { status: null, finalUrl: currentUrl, redirects, headers: {}, body: '', bytes: 0, ms: Date.now() - started, error: 'blocked-url' };
      }
      const response = await fetch(currentUrl, {
        headers: { [LOOP_HEADER]: '1', 'User-Agent': userAgent, Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', 'Accept-Language': 'en,es;q=0.8' },
        redirect: 'manual',
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
      const headers = Object.fromEntries(KEPT_HEADERS.flatMap((name) => (response.headers.has(name) ? [[name, response.headers.get(name)!]] : [])));
      const location = response.headers.get('location');
      if (response.status >= 300 && response.status < 400 && location && hop < maxRedirects) {
        response.body?.cancel().catch(() => {});
        redirects.push(`${response.status} → ${new URL(location, currentUrl).href}`);
        currentUrl = new URL(location, currentUrl).href;
        continue;
      }
      const { text, bytes } = await readCapped(response, maxBytes);
      return { status: response.status, finalUrl: currentUrl, redirects, headers, body: text, bytes, ms: Date.now() - started };
    }
    return { status: null, finalUrl: currentUrl, redirects, headers: {}, body: '', bytes: 0, ms: Date.now() - started, error: 'too-many-redirects' };
  } catch (error) {
    const timedOut = error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError');
    return { status: null, finalUrl: currentUrl, redirects, headers: {}, body: '', bytes: 0, ms: Date.now() - started, error: timedOut ? 'timeout' : 'network' };
  }
};

// ---------- Seguridad: solo webs públicas ----------

// Filtra por el nombre, no por la IP resuelta: un dominio que apunte a una IP privada pasaría.
// Hoy no hay riesgo real (los Workers no llegan a redes privadas ni hay servicios internos), pero
// si algún día esta función tiene acceso a algo interno, hay que resolver el DNS antes de pedir.
export const isPublicHost = (hostname: string) => {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '').replace(/\.+$/, '');
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal') || !host.includes('.')) return false;
  const ipv4 = host.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (ipv4) {
    const [a, b] = [Number(ipv4[1]), Number(ipv4[2])];
    return !(
      a === 10 || a === 127 || a === 0 || a >= 224 ||
      (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && (b === 168 || b === 0)) ||
      (a === 100 && b >= 64 && b <= 127) || (a === 198 && (b === 18 || b === 19))
    );
  }
  return !host.includes(':');
};

/** Cada URL que se pide (incluidos saltos de redirección y sitemaps del robots.txt) tiene que ser pública */
export const isFetchable = (url: URL) =>
  ['http:', 'https:'].includes(url.protocol) && ['', '80', '443'].includes(url.port) && isPublicHost(url.hostname) && !url.username && !url.password;

export const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex', 'X-Content-Type-Options': 'nosniff' },
  });

/** URL que pide el usuario (con o sin https://), o null si no es una web pública */
export const parseTarget = (raw: string) => {
  const trimmed = raw.trim();
  try {
    const target = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    target.hash = '';
    return isFetchable(target) ? target : null;
  } catch {
    return null;
  }
};

// ---------- Cadenas de redirección, salto a salto ----------

/** Subpeticiones que quedan en esta invocación (el plan gratis permite 50) y cuántas lleva cada host */
export interface FetchBudget {
  remaining: number;
  /** Tope de peticiones a un mismo host por invocación: la herramienta no puede usarse para cargar una web */
  maxPerHost?: number;
  perHost?: Map<string, number>;
}

export interface Hop {
  url: string;
  status: number;
  location: string | null;
}

export interface Trace {
  url: string;
  hops: Hop[];
  finalUrl: string;
  status: number | null;
  error: string | null;
  /** Sin presupuesto para terminar: el cliente tiene que volver a pedirla */
  pending: boolean;
  xRobotsTag: string | null;
  contentType: string | null;
  canonical: string | null;
  metaRobots: string | null;
  metaRefresh: string | null;
}

const MAX_TRACE_HOPS = 10;

/**
 * Web a la que pertenece un host para el tope por destino: las dos últimas partes del nombre, sin punto final.
 * Así a.victima.com, www.victima.com y victima.com. cuentan juntas. Con dominios como .co.uk agrupa de más,
 * y eso solo hace el tope más estricto
 */
const siteOf = (hostname: string) => hostname.toLowerCase().replace(/\.+$/, '').split('.').slice(-2).join('.');
const HEAD_BYTES = 32 * 1024;

const headOf = (html: string) => {
  const end = html.search(/<\/head>/i);
  return html.slice(0, end > 0 ? end : html.length);
};
// [^>]{0,2000} acotado: con [^>]* una etiqueta sin cerrar dispara backtracking
const tagsIn = (html: string, tag: string) => headOf(html).match(new RegExp(`<${tag}\\b[^>]{0,2000}>`, 'gi')) ?? [];
const attribute = (tag: string, name: string) => tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'))?.[2] ?? tag.match(new RegExp(`\\b${name}\\s*=\\s*([^\\s>]+)`, 'i'))?.[1] ?? null;

/** Sigue las redirecciones de una URL pidiendo cada salto por separado, con el user-agent indicado */
export const traceUrl = async (url: string, userAgent: string, budget: FetchBudget): Promise<Trace> => {
  const trace: Trace = { url, hops: [], finalUrl: url, status: null, error: null, pending: false, xRobotsTag: null, contentType: null, canonical: null, metaRobots: null, metaRefresh: null };
  const seen = new Set<string>();
  let currentUrl = url;
  for (let hop = 0; hop < MAX_TRACE_HOPS; hop++) {
    if (budget.remaining <= 0) return { ...trace, pending: true };
    if (seen.has(currentUrl)) return { ...trace, error: 'loop' };
    seen.add(currentUrl);
    let parsed: URL;
    try {
      parsed = new URL(currentUrl);
    } catch {
      return { ...trace, error: 'invalid-url' };
    }
    if (!isFetchable(parsed)) return { ...trace, error: 'blocked-url' };
    if (budget.maxPerHost && budget.perHost) {
      const site = siteOf(parsed.hostname);
      const sent = budget.perHost.get(site) ?? 0;
      if (sent >= budget.maxPerHost) return { ...trace, pending: true };
      budget.perHost.set(site, sent + 1);
    }
    budget.remaining--;
    try {
      const response = await fetch(currentUrl, {
        headers: { [LOOP_HEADER]: '1', 'User-Agent': userAgent, Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', 'Accept-Language': 'en,es;q=0.8' },
        redirect: 'manual',
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
      const location = response.headers.get('location');
      const next = location ? new URL(location, currentUrl).href : null;
      trace.hops.push({ url: currentUrl, status: response.status, location: next });
      if (response.status >= 300 && response.status < 400 && next) {
        response.body?.cancel().catch(() => {});
        currentUrl = next;
        continue;
      }
      const contentType = response.headers.get('content-type');
      const { text } = /html/i.test(contentType ?? '') ? await readCapped(response, HEAD_BYTES) : (response.body?.cancel().catch(() => {}), { text: '' });
      const metaRobots = tagsIn(text, 'meta').filter((tag) => /^(robots|googlebot)$/i.test(attribute(tag, 'name') ?? '')).map((tag) => attribute(tag, 'content')).filter(Boolean);
      const refresh = tagsIn(text, 'meta').find((tag) => /^refresh$/i.test(attribute(tag, 'http-equiv') ?? ''));
      const canonical = tagsIn(text, 'link').find((tag) => /(^|\s)canonical(\s|$)/i.test(attribute(tag, 'rel') ?? ''));
      const canonicalHref = canonical ? attribute(canonical, 'href') : null;
      return {
        ...trace,
        finalUrl: currentUrl,
        status: response.status,
        xRobotsTag: response.headers.get('x-robots-tag'),
        contentType,
        canonical: canonicalHref ? new URL(canonicalHref, currentUrl).href : null,
        metaRobots: metaRobots.length ? metaRobots.join(', ') : null,
        metaRefresh: refresh ? attribute(refresh, 'content') : null,
      };
    } catch (error) {
      const timedOut = error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError');
      return { ...trace, finalUrl: currentUrl, error: timedOut ? 'timeout' : 'network' };
    }
  }
  return { ...trace, finalUrl: currentUrl, error: 'too-many-redirects' };
};
