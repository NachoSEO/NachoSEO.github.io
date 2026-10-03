const TARGET = 'https://nachomascort.com';

/** Posts de seohacks.es recuperados en nachomascort.com/blog/<slug>/ con el mismo slug */
const POSTS = new Set([
  '200-factores-seo-que-posicionan-en-google',
  'accesibilidad-web-seo-parte-1',
  'analisis-pagina-web-seo-on-page',
  'analizando-tecnica-seo-piel-de-cordero',
  'cloaking',
  'contenido-latent-semantic-index',
  'crawl-budget-optimizar-http-304',
  'creando-blog-seo-wordpress',
  'credibilidad-vs-autoridad-eat',
  'ddos',
  'el-dia-a-dia-de-un-seo-en-gifs',
  'guia-quality-raters-google',
  'guia-seo',
  'https-gratis',
  'imagenes-originales',
  'link-building-alex-navarro',
  'que-es-thin-content',
  'relacion-semantica-inversa',
  'seo-tips-gary-illyes',
]);

const PAGES = {
  '': '/',
  'nacho-mascort': '/sobre-mi/',
  author: '/sobre-mi/',
  feed: '/rss.xml',
};

const ARCHIVE = '/blog/seo-hacks/';

function destination(pathname) {
  // Cualquier variante de un post (/slug, /blog/slug, /evolucion-blog/slug, /slug/amp/, /slug/feed/) va a su post
  // Un % mal formado no puede tumbar el Worker: se usa la ruta tal cual
  let decoded = pathname;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {}
  const segments = decoded.split('/').filter(Boolean);
  const post = segments.find((segment) => POSTS.has(segment));
  if (post) return `/blog/${post}/`;
  const first = segments[0] ?? '';
  // hasOwn: /constructor o /__proto__ no deben leer propiedades de Object.prototype
  return Object.hasOwn(PAGES, first) ? PAGES[first] : ARCHIVE;
}

export default {
  fetch(request) {
    const { pathname } = new URL(request.url);
    return Response.redirect(TARGET + destination(pathname), 301);
  },
};
