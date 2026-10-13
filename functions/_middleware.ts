/**
 * Negociación de Markdown para agentes: si la petición pide `Accept: text/markdown` y la página tiene versión .md
 * (/ruta/ → /ruta.md, / → /index.md), se sirve esa versión. Si no, la página HTML de siempre. `Vary: Accept` en
 * ambos casos para que ninguna caché mezcle las dos. public/_routes.json deja fuera los recursos estáticos, así que
 * esto solo se ejecuta en páginas y en /api.
 */
interface Env {
  ASSETS: { fetch: (request: Request | URL | string) => Promise<Response> };
}

const wantsMarkdown = (accept: string) => /(^|,)\s*text\/markdown/i.test(accept);

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request } = context;
  const url = new URL(request.url);
  if ((request.method === 'GET' || request.method === 'HEAD') && url.pathname.endsWith('/') && !url.pathname.startsWith('/api/') && wantsMarkdown(request.headers.get('accept') ?? '')) {
    const mdPath = url.pathname === '/' ? '/index.md' : `${url.pathname.slice(0, -1)}.md`;
    const markdown = await context.env.ASSETS.fetch(new URL(mdPath, url.origin));
    if (markdown.ok) {
      const headers = new Headers(markdown.headers);
      headers.set('Content-Type', 'text/markdown; charset=utf-8');
      headers.set('Vary', 'Accept');
      headers.set('Content-Location', mdPath);
      return new Response(request.method === 'HEAD' ? null : markdown.body, { status: 200, headers });
    }
  }
  const response = await context.next();
  if (!url.pathname.startsWith('/api/') && (response.headers.get('content-type') ?? '').includes('text/html')) {
    const headers = new Headers(response.headers);
    headers.set('Vary', 'Accept');
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }
  return response;
};
