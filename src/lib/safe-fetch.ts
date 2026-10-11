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
