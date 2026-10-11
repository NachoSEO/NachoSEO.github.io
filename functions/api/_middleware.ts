/**
 * Solo responde la API en el dominio de producción (y en local). Las URLs de *.pages.dev, incluido
 * nachomascort.pages.dev y las de cada despliegue, no pasan por las reglas del WAF de la zona nachomascort.com:
 * sin esto, cualquiera podría usar las herramientas y los formularios por ahí saltándose el rate limit.
 * Vive en functions/api para no invocar Functions en cada página estática.
 */
const ALLOWED_HOSTS = new Set(['nachomascort.com', 'localhost', '127.0.0.1']);

export const onRequest = async ({ request, next }: { request: Request; next: () => Promise<Response> }) => {
  if (!ALLOWED_HOSTS.has(new URL(request.url).hostname)) {
    return new Response('Not found', { status: 404, headers: { 'X-Robots-Tag': 'noindex', 'Cache-Control': 'no-store' } });
  }
  return next();
};
