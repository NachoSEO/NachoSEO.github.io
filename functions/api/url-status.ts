/**
 * Códigos HTTP y cadenas de redirección en bloque (Cloudflare Pages Function): POST /api/url-status
 * Cuerpo: { urls: string[], agent?: 'Googlebot' } (sin agent, como navegador). Las URLs que no caben en el
 * presupuesto de subpeticiones vuelven con pending: true y el navegador las pide en la siguiente llamada.
 */
import { isForeignOrigin } from '../../src/lib/form-guard';
import { hasValidSession, type ToolEnv } from '../../src/lib/tool-session';
import { withQuota, type QuotaEnv } from '../../src/lib/tool-quota';
import { BOTS } from '../../src/data/bots';
import { BROWSER_UA, json, LOOP_HEADER, parseTarget, siteOf, traceUrl, type FetchBudget, type Trace } from '../../src/lib/safe-fetch';

const MAX_URLS = 20;
// 50 subpeticiones en el plan gratis, con margen
const SUBREQUEST_BUDGET = 45;
const CONCURRENCY = 6;
// Como mucho 10 peticiones a la misma web por llamada; el resto vuelve como pending
const MAX_PER_HOST = 10;

export const onRequestPost = async ({ request, env, waitUntil }: { request: Request; env: ToolEnv & QuotaEnv; waitUntil: (promise: Promise<unknown>) => void }) => {
  if (request.headers.has(LOOP_HEADER)) return json({ error: 'loop' }, 508);
  if (isForeignOrigin(request)) return json({ error: 'forbidden' }, 403);
  // Sin sesión de Turnstile no se hacen peticiones a otras webs: corta el uso automatizado desde scripts
  if (!(await hasValidSession(request, env))) return json({ error: 'session' }, 401);
  let payload: { urls?: unknown; agent?: unknown };
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'invalid-body' }, 400);
  }
  if (!Array.isArray(payload.urls) || payload.urls.length === 0 || payload.urls.length > MAX_URLS) return json({ error: 'invalid-body' }, 400);
  // Solo navegador o Googlebot: hacerse pasar por bots de IA contra webs ajenas no aporta lo bastante para el riesgo
  const bot = payload.agent === 'Googlebot' ? BOTS.find((candidate) => candidate.name === 'Googlebot') : undefined;
  const userAgent = bot?.userAgent ?? BROWSER_UA;

  const inputs = payload.urls.map((raw) => (typeof raw === 'string' ? raw.slice(0, 2048) : ''));
  // Cada web de destino del lote reserva su tope por llamada en la cuota compartida por web
  const sites = new Map(
    inputs.flatMap((raw) => {
      const target = parseTarget(raw);
      return target ? [[siteOf(target.hostname), MAX_PER_HOST] as [string, number]] : [];
    })
  );
  return withQuota({ request, env, waitUntil }, SUBREQUEST_BUDGET, async (meter) => {
    const budget: FetchBudget = { remaining: SUBREQUEST_BUDGET, maxPerHost: MAX_PER_HOST, perHost: new Map() };
    const results: Trace[] = new Array(inputs.length);
    let next = 0;
    const worker = async () => {
      while (next < inputs.length) {
        const index = next++;
        const target = parseTarget(inputs[index]);
        results[index] = target
          ? { ...(await traceUrl(target.href, userAgent, budget)), url: inputs[index] }
          : { url: inputs[index], hops: [], finalUrl: inputs[index], status: null, error: 'invalid-url', pending: false, xRobotsTag: null, contentType: null, canonical: null, metaRobots: null, metaRefresh: null };
      }
    };
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    meter.used = SUBREQUEST_BUDGET - budget.remaining;
    meter.sites = new Map([...sites.keys()].map((site) => [site, budget.perHost!.get(site) ?? 0]));
    return json({ agent: bot?.name ?? 'browser', results });
  }, sites);
};
