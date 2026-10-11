/**
 * Comprobador de acceso de bots (Cloudflare Pages Function): GET /api/bot-check?url=https://example.com/
 *
 * Para una URL, mira tres cosas por cada bot de buscadores e IA:
 *  1. Si su robots.txt le deja rastrear esa ruta, con el parser oficial de Google compilado a WebAssembly.
 *  2. Qué responde la web cuando la pide con su user-agent, comparado con un navegador normal.
 *  3. Si la página o la cabecera llevan noindex, y si el sitemap del robots.txt se puede leer.
 *
 * Límite honesto: las peticiones salen de Cloudflare, no de las IPs de Google u OpenAI. Si la web
 * verifica bots por IP (lo hacen Cloudflare, Akamai, etc.), un bloqueo aquí puede no afectar al bot real.
 */
import { isForeignOrigin } from '../../src/lib/form-guard';
import { hasValidSession, type ToolEnv } from '../../src/lib/tool-session';
import { withQuota, type QuotaEnv } from '../../src/lib/tool-quota';
import { BOTS } from '../../src/data/bots';
import robotsWasm from '../../src/lib/robotstxt/robotstxt.wasm';
import { loadRobotsEngine, RobotsTag, ruleText, sitemapsFrom, type RobotsEngine } from '../../src/lib/robotstxt';
import { BROWSER_UA, fetchAs as rawFetchAs, isFetchable, siteOf, json, LOOP_HEADER, MAX_BODY_BYTES, parseTarget, type FetchResult } from '../../src/lib/safe-fetch';

const MAX_ROBOTS_BYTES = 500 * 1024;
// Peor caso: navegador 4 + robots.txt 4 + 15 bots × 2 + 3 sitemaps × 2 = 44. Se devuelve lo que no se usa
const BOT_CHECK_COST = 45;
let robotsEngine: Promise<RobotsEngine> | undefined;

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

export const onRequestGet = async ({ request, env, waitUntil }: { request: Request; env: ToolEnv & QuotaEnv; waitUntil: (promise: Promise<unknown>) => void }) => {
  if (request.headers.has(LOOP_HEADER)) return json({ error: 'loop' }, 508);
  // Solo desde la propia web: sin esto, cualquier sitio podría usar el endpoint desde el navegador de sus visitas
  if (isForeignOrigin(request)) return json({ error: 'forbidden' }, 403);
  // Sin sesión de Turnstile no se hacen peticiones a otras webs: corta el uso automatizado desde scripts
  if (!(await hasValidSession(request, env))) return json({ error: 'session' }, 401);
  const target = parseTarget(new URL(request.url).searchParams.get('url') ?? '');
  if (!target) return json({ error: 'invalid-url' }, 400);

  const site = siteOf(target.hostname);
  return withQuota({ request, env, waitUntil }, BOT_CHECK_COST, async (meter) => {
    // Cada fetchAs cuenta sus saltos: la cuota refleja las peticiones reales, no una media
    meter.used = 0;
    meter.sites.set(site, 0);
    const fetchAs = async (...args: Parameters<typeof rawFetchAs>) => {
      const result = await rawFetchAs(...args);
      meter.used += result.redirects.length + 1;
      meter.sites.set(site, meter.used);
      return result;
    };
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
    const robotsBody = robotsUsable ? robots.body : '';
    const engine = await (robotsEngine ??= loadRobotsEngine(robotsWasm));
    const robotsReport = engine.report(robotsBody);
    const robotsCounts = {
      rules: robotsReport.lines.filter((parsed) => parsed.tag === RobotsTag.Allow || parsed.tag === RobotsTag.Disallow).length,
      unused: robotsReport.unusedDirectives,
    };

    const browserChallenge = detectChallenge(browser);
    const browserOk = browser.status !== null && browser.status >= 200 && browser.status < 300 && !browserChallenge;

    const bots = BOTS.map((bot) => {
      const robotsResult = robotsUnreachable
        ? { allowed: false, rule: null, matchedAgent: null, unreachable: true }
        : (() => {
            const verdict = engine.check(robotsBody, bot.token, checkedUrl.href);
            return {
              allowed: verdict.allowed,
              rule: ruleText(robotsBody, verdict.line),
              matchedAgent: verdict.specificAgent ? bot.token : verdict.line ? '*' : null,
              unreachable: false,
            };
          })();
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
    const declaredSitemaps = sitemapsFrom(engine, robotsBody).filter((sitemapUrl) => {
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
      robotsTxt: { url: robotsUrl, status: robotsStatus, error: robots.error ?? null, unreachable: robotsUnreachable, ...robotsCounts },
      sitemaps,
      bots,
    });
  }, new Map([[site, BOT_CHECK_COST]]));
};
