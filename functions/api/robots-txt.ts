/**
 * Descarga el robots.txt de una web para el tester (Cloudflare Pages Function): GET /api/robots-txt?url=https://example.com/
 * El análisis lo hace el navegador con el parser oficial de Google; aquí solo se pide el archivo.
 */
import { isForeignOrigin } from '../../src/lib/form-guard';
import { BROWSER_UA, fetchAs, json, LOOP_HEADER, parseTarget } from '../../src/lib/safe-fetch';

// Google lee los primeros 500 KiB y sigue hasta 5 redirecciones
const GOOGLE_MAX_BYTES = 500 * 1024;
const GOOGLE_MAX_REDIRECTS = 5;

export const onRequestGet = async ({ request }: { request: Request }) => {
  if (request.headers.has(LOOP_HEADER)) return json({ error: 'loop' }, 508);
  if (isForeignOrigin(request)) return json({ error: 'forbidden' }, 403);
  const target = parseTarget(new URL(request.url).searchParams.get('url') ?? '');
  if (!target) return json({ error: 'invalid-url' }, 400);

  const robotsUrl = new URL('/robots.txt', target).href;
  const result = await fetchAs(robotsUrl, BROWSER_UA, GOOGLE_MAX_BYTES, GOOGLE_MAX_REDIRECTS);
  // Solo se devuelve un robots.txt: si una redirección lleva a otra cosa (HTML, JSON…), el cuerpo no sale.
  // Sin esto, un robots.txt que redirija a cualquier URL convertiría el endpoint en un proxy abierto
  const contentType = result.headers['content-type'] ?? '';
  const isRobots = new URL(result.finalUrl).pathname.endsWith('/robots.txt') || /^text\/plain\b/i.test(contentType);
  const ok = result.status !== null && result.status >= 200 && result.status < 300;
  return json({
    url: robotsUrl,
    finalUrl: result.finalUrl,
    status: result.status,
    error: result.error ?? null,
    redirects: result.redirects,
    contentType: contentType || null,
    body: ok && isRobots && !/^\s*</.test(result.body) ? result.body : '',
    notRobots: ok && (!isRobots || /^\s*</.test(result.body)),
    truncated: result.bytes > GOOGLE_MAX_BYTES,
  });
};
