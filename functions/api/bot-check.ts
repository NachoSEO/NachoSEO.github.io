/**
 * Comprobador de acceso de bots (Cloudflare Pages Function): GET /api/bot-check?url=https://example.com/
 *
 * Para una URL, mira tres cosas por cada bot de buscadores e IA:
 *  1. Si su robots.txt le deja rastrear esa ruta (con las reglas de Google: gana la regla más larga).
 *  2. Qué responde la web cuando la pide con su user-agent, comparado con un navegador normal.
 *  3. Si la página o la cabecera llevan noindex, y si el sitemap del robots.txt se puede leer.
 *
 * Límite honesto: las peticiones salen de Cloudflare, no de las IPs de Google u OpenAI. Si la web
 * verifica bots por IP (lo hacen Cloudflare, Akamai, etc.), un bloqueo aquí puede no afectar al bot real.
 */
import { isForeignOrigin } from '../../src/lib/form-guard';
import { BOTS } from '../../src/data/bots';

const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
const FETCH_TIMEOUT_MS = 8000;
const MAX_REDIRECTS = 3;
// Free plan: 50 subpeticiones y poca CPU por invocación, así que se lee solo el principio de cada respuesta
const MAX_BODY_BYTES = 64 * 1024;
const MAX_ROBOTS_BYTES = 500 * 1024;
const MAX_RULES = 2000;
/** Header que marca las peticiones propias: corta bucles si alguien apunta la herramienta a sí misma */
const LOOP_HEADER = 'X-Bot-Check';

// ---------- robots.txt ----------

interface RobotsGroup {
  agents: string[];
  rules: { allow: boolean; path: string }[];
}

const parseRobots = (text: string) => {
  const groups: RobotsGroup[] = [];
  const sitemaps: string[] = [];
  let current: RobotsGroup | null = null;
  let lastWasAgent = false;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim();
    const separator = line.indexOf(':');
    if (separator === -1) continue;
    const field = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();
    if (field === 'user-agent') {
      if (!current || !lastWasAgent) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
    } else if (field === 'allow' || field === 'disallow') {
      lastWasAgent = false;
      if (current) current.rules.push({ allow: field === 'allow', path: value });
    } else if (field === 'sitemap') {
      if (value) sitemaps.push(value);
    } else {
      lastWasAgent = false;
    }
  }
  return { groups, sitemaps };
};

/** Patrón de robots.txt (con * y $) contra una ruta, en tiempo lineal: con RegExp, `/*a*a*a*aX` se cuelga */
const robotsMatch = (pattern: string, path: string) => {
  const anchored = pattern.endsWith('$');
  const parts = (anchored ? pattern.slice(0, -1) : pattern).split('*');
  if (!path.startsWith(parts[0])) return false;
  let position = parts[0].length;
  for (let index = 1; index < parts.length; index++) {
    if (anchored && index === parts.length - 1) return path.length - position >= parts[index].length && path.endsWith(parts[index]);
    const found = path.indexOf(parts[index], position);
    if (found === -1) return false;
    position = found + parts[index].length;
  }
  return !anchored || position === path.length;
};

/** Como Google: el grupo del token más específico que coincide; si no hay, el de * */
const groupsFor = (groups: RobotsGroup[], token: string) => {
  const matching = groups
    .flatMap((group) => group.agents.filter((agent) => agent !== '*' && token.startsWith(agent)).map((agent) => ({ group, length: agent.length })))
    .sort((a, b) => b.length - a.length);
  if (matching.length > 0) {
    const bestLength = matching[0].length;
    return { groups: matching.filter((match) => match.length === bestLength).map((match) => match.group), matchedAgent: token.slice(0, bestLength) };
  }
  const wildcard = groups.filter((group) => group.agents.includes('*'));
  return { groups: wildcard, matchedAgent: wildcard.length > 0 ? '*' : null };
};

const robotsVerdict = (groups: RobotsGroup[], token: string, pathAndQuery: string) => {
  const { groups: applicable, matchedAgent } = groupsFor(groups, token);
  let best: { allow: boolean; path: string } | null = null;
  let decodedPath = pathAndQuery;
  try {
    decodedPath = decodeURI(pathAndQuery);
  } catch {}
  for (const rule of applicable.flatMap((group) => group.rules).slice(0, MAX_RULES)) {
    if (rule.path === '') continue;
    if (!robotsMatch(rule.path, pathAndQuery) && !robotsMatch(rule.path, decodedPath)) continue;
    // Gana la regla más larga; en empate, la menos restrictiva (allow)
    if (!best || rule.path.length > best.path.length || (rule.path.length === best.path.length && rule.allow)) best = rule;
  }
  return { allowed: best ? best.allow : true, rule: best ? `${best.allow ? 'Allow' : 'Disallow'}: ${best.path}` : null, matchedAgent };
};

// ---------- HTTP ----------

interface FetchResult {
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

const fetchAs = async (url: string, userAgent: string, maxBytes = MAX_BODY_BYTES, maxRedirects = MAX_REDIRECTS): Promise<FetchResult> => {
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

/** Páginas de reto o bloqueo de los WAF más comunes */
const CHALLENGE_SIGNATURES: [RegExp, string][] = [
  [/<title>\s*just a moment\.\.\.\s*<\/title>|cf-chl-|challenges\.cloudflare\.com/i, 'Cloudflare challenge'],
  [/attention required! \| cloudflare|cf-error-details/i, 'Cloudflare block'],
  [/<title>\s*access denied\s*<\/title>[\s\S]{0,2000}reference #/i, 'Akamai'],
  [/captcha-delivery\.com|datadome/i, 'DataDome'],
  [/px-captcha|perimeterx/i, 'HUMAN (PerimeterX)'],
  [/sgcaptcha|\.well-known\/sgcaptcha/i, 'SiteGround captcha'],
  [/incapsula incident id|_incapsula_resource/i, 'Imperva'],
  [/vercel security checkpoint/i, 'Vercel checkpoint'],
  [/<title>\s*(403 forbidden|access denied|blocked)\s*<\/title>/i, 'Block page'],
];

const detectChallenge = (result: FetchResult) => {
  if (result.headers['cf-mitigated'] === 'challenge') return 'Cloudflare challenge';
  const head = result.body.slice(0, 16 * 1024);
  return CHALLENGE_SIGNATURES.find(([pattern]) => pattern.test(head))?.[1] ?? null;
};

const metaRobots = (html: string, token: string) => {
  const headEnd = html.search(/<\/head>/i);
  // [^>]{0,2000} acotado: con [^>]* un <meta sin cerrar dispara backtracking cúbico
  return (html.slice(0, headEnd > 0 ? headEnd : html.length).match(/<meta\b[^>]{0,2000}>/gi) ?? [])
    .filter((tag) => ['robots', token].includes((tag.match(/\bname\s*=\s*["']?([a-z0-9_-]+)/i)?.[1] ?? '').toLowerCase()))
    .map((tag) => tag.match(/\bcontent\s*=\s*["']([^"']*)["']/i)?.[1] ?? '')
    .filter(Boolean);
};

const hasNoindex = (values: string[]) => values.some((value) => /\b(noindex|none)\b/i.test(value));

/** X-Robots-Tag puede ir con prefijo de bot ("googlebot: noindex") */
const xRobotsFor = (header: string | undefined, token: string) =>
  (header ?? '')
    .split(/,(?=\s*[a-z-]+\s*:)/i)
    .map((part) => part.trim())
    .filter((part) => !/^[a-z-]+\s*:/i.test(part) || part.toLowerCase().startsWith(`${token}:`))
    .map((part) => part.replace(/^[a-z-]+\s*:\s*/i, ''));

// ---------- Seguridad: solo webs públicas ----------

// Filtra por el nombre, no por la IP resuelta: un dominio que apunte a una IP privada pasaría.
// Hoy no hay riesgo real (los Workers no llegan a redes privadas ni hay servicios internos), pero
// si algún día esta función tiene acceso a algo interno, hay que resolver el DNS antes de pedir.
const isPublicHost = (hostname: string) => {
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
const isFetchable = (url: URL) =>
  ['http:', 'https:'].includes(url.protocol) && ['', '80', '443'].includes(url.port) && isPublicHost(url.hostname) && !url.username && !url.password;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex', 'X-Content-Type-Options': 'nosniff' },
  });

export const onRequestGet = async ({ request }: { request: Request }) => {
  if (request.headers.has(LOOP_HEADER)) return json({ error: 'loop' }, 508);
  // Solo desde la propia web: sin esto, cualquier sitio podría usar el endpoint desde el navegador de sus visitas
  if (isForeignOrigin(request)) return json({ error: 'forbidden' }, 403);
  const rawUrl = (new URL(request.url).searchParams.get('url') ?? '').trim();
  let target: URL;
  try {
    target = new URL(/^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`);
  } catch {
    return json({ error: 'invalid-url' }, 400);
  }
  if (!isFetchable(target)) {
    return json({ error: 'invalid-url' }, 400);
  }
  target.hash = '';

  // Primero el navegador de referencia: si la URL redirige, los bots piden ya la URL final.
  // Así el total de subpeticiones no pasa de 50 (límite de Cloudflare)
  const browser = await fetchAs(target.href, BROWSER_UA);
  const checkedUrl = new URL(browser.status !== null ? browser.finalUrl : target.href);
  const robotsUrl = new URL('/robots.txt', checkedUrl).href;
  const fetchingBots = BOTS.filter((bot) => bot.userAgent);

  const [robots, ...botResults] = await Promise.all([
    fetchAs(robotsUrl, BROWSER_UA, MAX_ROBOTS_BYTES),
    ...fetchingBots.map((bot) => fetchAs(checkedUrl.href, bot.userAgent!, MAX_BODY_BYTES, 1)),
  ]);

  // robots.txt: 4xx = sin restricciones; 5xx o sin respuesta = Google deja de rastrear
  const robotsStatus = robots.status;
  const robotsUsable = robotsStatus !== null && robotsStatus >= 200 && robotsStatus < 300;
  const robotsUnreachable = robotsStatus === null || robotsStatus >= 500 || robotsStatus === 429;
  const parsedRobots = robotsUsable ? parseRobots(robots.body) : { groups: [], sitemaps: [] };
  const pathAndQuery = `${checkedUrl.pathname}${checkedUrl.search}`;

  const browserChallenge = detectChallenge(browser);
  const browserOk = browser.status !== null && browser.status >= 200 && browser.status < 300 && !browserChallenge;

  const bots = BOTS.map((bot) => {
    const robotsResult = robotsUnreachable
      ? { allowed: false, rule: null, matchedAgent: null, unreachable: true }
      : { ...robotsVerdict(parsedRobots.groups, bot.token, pathAndQuery), unreachable: false };
    const fetchIndex = fetchingBots.indexOf(bot);
    const result = fetchIndex >= 0 ? botResults[fetchIndex] : null;
    const challenge = result ? detectChallenge(result) : null;
    const metaValues = result ? metaRobots(result.body, bot.token) : [];
    const xRobotsValues = result ? xRobotsFor(result.headers['x-robots-tag'], bot.token) : [];
    const httpOk = result ? result.status !== null && result.status >= 200 && result.status < 300 && !challenge : null;
    // Mismo código que el navegador pero mucho menos contenido: posible página distinta para bots
    const thinResponse = Boolean(result && httpOk && browserOk && browser.bytes > 5000 && result.bytes < browser.bytes * 0.3);

    let verdict: 'ok' | 'warning' | 'blocked';
    if (!robotsResult.allowed) verdict = 'blocked';
    else if (result && !httpOk) verdict = browserOk ? 'blocked' : 'warning';
    else if (hasNoindex(metaValues) || hasNoindex(xRobotsValues) || thinResponse) verdict = 'warning';
    else verdict = 'ok';

    return {
      name: bot.name,
      company: bot.company,
      kind: bot.kind,
      robots: robotsResult,
      http: result
        ? {
            status: result.status,
            error: result.error ?? null,
            redirects: result.redirects,
            finalUrl: result.finalUrl,
            bytes: result.bytes,
            ms: result.ms,
            challenge,
            noindex: hasNoindex(metaValues) || hasNoindex(xRobotsValues),
            thinResponse,
          }
        : null,
      verdict,
    };
  });

  // Sitemaps: los del robots.txt (hasta 3) o /sitemap.xml si no declara ninguno
  const declaredSitemaps = parsedRobots.sitemaps.filter((sitemapUrl) => {
    try {
      return isFetchable(new URL(sitemapUrl));
    } catch {
      return false;
    }
  });
  const sitemapUrls = (declaredSitemaps.length > 0 ? declaredSitemaps : [new URL('/sitemap.xml', checkedUrl).href]).slice(0, 3);
  const sitemaps = await Promise.all(
    sitemapUrls.map(async (sitemapUrl) => {
      const result = await fetchAs(sitemapUrl, BOTS[0].userAgent!, 256 * 1024, 1);
      const head = result.body.slice(0, 2048);
      const isXml = /<(urlset|sitemapindex)[\s>]/i.test(result.body);
      return {
        url: sitemapUrl,
        declared: declaredSitemaps.length > 0,
        status: result.status,
        error: result.error ?? null,
        contentType: result.headers['content-type'] ?? null,
        type: /<sitemapindex[\s>]/i.test(result.body) ? 'index' : isXml ? 'urlset' : null,
        valid: result.status === 200 && isXml && !/^\s*<!doctype html|<html[\s>]/i.test(head),
        urls: (result.body.match(/<loc>/gi) ?? []).length,
        truncated: result.bytes > 256 * 1024,
      };
    }),
  );

  return json({
    url: target.href,
    checkedUrl: checkedUrl.href,
    checkedAt: new Date().toISOString(),
    browser: {
      status: browser.status,
      error: browser.error ?? null,
      redirects: browser.redirects,
      finalUrl: browser.finalUrl,
      bytes: browser.bytes,
      ms: browser.ms,
      challenge: browserChallenge,
      server: browser.headers.server ?? null,
      metaRobots: metaRobots(browser.body, 'robots'),
      xRobotsTag: browser.headers['x-robots-tag'] ?? null,
    },
    robotsTxt: { url: robotsUrl, status: robotsStatus, error: robots.error ?? null, unreachable: robotsUnreachable, groups: parsedRobots.groups.length },
    sitemaps,
    bots,
  });
};
