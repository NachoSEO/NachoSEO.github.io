/**
 * Descarga un sitemap para el auditor (Cloudflare Pages Function): GET /api/sitemap-fetch?url=https://example.com/sitemap.xml
 * Lo reenvía tal cual (también .gz) y el navegador lo descomprime y lo parsea: aquí no se gasta CPU en sitemaps de 50 MB.
 * Solo deja pasar sitemaps de verdad (<urlset> o <sitemapindex> al principio), para no servir de proxy de cualquier cosa.
 */
import { isForeignOrigin } from '../../src/lib/form-guard';
import { hasValidSession, type ToolEnv } from '../../src/lib/tool-session';
import { withQuota, type QuotaEnv } from '../../src/lib/tool-quota';
import { BOTS } from '../../src/data/bots';
import { FETCH_TIMEOUT_MS, isFetchable, json, LOOP_HEADER, parseTarget } from '../../src/lib/safe-fetch';

// Google acepta 50 MB sin comprimir; comprimido, 20 MB es de sobra
const MAX_BYTES = 20 * 1024 * 1024;
const PEEK_BYTES = 4096;
const MAX_REDIRECTS = 5;
const GOOGLEBOT_UA = BOTS[0].userAgent!;

const isSitemapStart = (text: string) => /<(urlset|sitemapindex)[\s>]/i.test(text);

/** Texto del principio de un gzip: el trozo está cortado, así que se lee hasta que el descompresor se queje */
const gunzipStart = async (bytes: Uint8Array) => {
  const reader = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')).getReader();
  const decoder = new TextDecoder();
  let text = '';
  try {
    while (text.length < PEEK_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
    }
  } catch {
    // Fin inesperado del gzip: lo leído hasta aquí basta
  }
  reader.cancel().catch(() => {});
  return text;
};

export const onRequestGet = async ({ request, env, waitUntil }: { request: Request; env: ToolEnv & QuotaEnv; waitUntil: (promise: Promise<unknown>) => void }) => {
  if (request.headers.has(LOOP_HEADER)) return json({ error: 'loop' }, 508);
  if (isForeignOrigin(request)) return json({ error: 'forbidden' }, 403);
  // Sin sesión de Turnstile no se hacen peticiones a otras webs: corta el uso automatizado desde scripts
  if (!(await hasValidSession(request, env))) return json({ error: 'session' }, 401);
  const target = parseTarget(new URL(request.url).searchParams.get('url') ?? '');
  if (!target) return json({ error: 'invalid-url' }, 400);

  // Una petición por salto de redirección
  return withQuota({ request, env, waitUntil }, MAX_REDIRECTS + 1, async (meter) => {
    let currentUrl = target.href;
    let response: Response | null = null;
    try {
      for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
        if (!isFetchable(new URL(currentUrl))) return json({ error: 'invalid-url' }, 400);
        meter.used = hop + 1;
        response = await fetch(currentUrl, {
          headers: { [LOOP_HEADER]: '1', 'User-Agent': GOOGLEBOT_UA, Accept: 'application/xml,text/xml;q=0.9,*/*;q=0.8' },
          redirect: 'manual',
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS * 2),
        });
        const location = response.headers.get('location');
        if (response.status >= 300 && response.status < 400 && location) {
          response.body?.cancel().catch(() => {});
          currentUrl = new URL(location, currentUrl).href;
          continue;
        }
        break;
      }
    } catch (error) {
      const timedOut = error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError');
      return json({ error: timedOut ? 'timeout' : 'network', url: currentUrl }, 502);
    }
    if (!response || (response.status >= 300 && response.status < 400)) return json({ error: 'too-many-redirects', url: currentUrl }, 502);
    if (!response.ok || !response.body) {
      response.body?.cancel().catch(() => {});
      return json({ error: 'http', status: response.status, url: currentUrl }, 502);
    }
    if (Number(response.headers.get('content-length') ?? 0) > MAX_BYTES) {
      response.body.cancel().catch(() => {});
      return json({ error: 'too-large', url: currentUrl }, 413);
    }

    // Se guardan los primeros KB para comprobar que es un sitemap y luego se reenvían con el resto
    const reader = response.body.getReader();
    const buffered: Uint8Array[] = [];
    let bytes = 0;
    while (bytes < PEEK_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      buffered.push(value);
      bytes += value.byteLength;
    }
    const head = new Uint8Array(bytes);
    buffered.reduce((offset, chunk) => (head.set(chunk, offset), offset + chunk.byteLength), 0);
    const gzip = head[0] === 0x1f && head[1] === 0x8b;
    const start = gzip ? await gunzipStart(head) : new TextDecoder().decode(head);
    if (!isSitemapStart(start)) {
      reader.cancel().catch(() => {});
      return json({ error: 'not-sitemap', url: currentUrl }, 422);
    }

    const capped = new ReadableStream<Uint8Array>({
      start(controller) {
        for (const chunk of buffered) controller.enqueue(chunk);
      },
      async pull(controller) {
        const { done, value } = await reader.read();
        if (done) return controller.close();
        bytes += value.byteLength;
        if (bytes > MAX_BYTES) {
          reader.cancel().catch(() => {});
          controller.error(new Error('too-large'));
        } else controller.enqueue(value);
      },
      cancel: () => reader.cancel(),
    });
    // Contenido de terceros servido desde este dominio: nunca como XML/HTML que el navegador pueda ejecutar si alguien abre la URL
    return new Response(capped, {
      headers: {
        'Content-Type': gzip ? 'application/octet-stream' : 'text/plain; charset=utf-8',
        'Content-Security-Policy': "default-src 'none'; sandbox",
        'Content-Disposition': 'attachment',
        'X-Sitemap-Encoding': gzip ? 'gzip' : 'identity',
        'X-Sitemap-Url': currentUrl,
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  });
};
