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
  'evolucion-blog/creando-blog-seo-wordpress': '/blog/creando-blog-seo-wordpress/',
};

const ARCHIVE = '/blog/seo-hacks/';

function destination(pathname) {
  // /slug, /slug/, /slug/amp/ y /slug/feed/ apuntan al mismo post
  const path = pathname.replace(/^\/+|\/+$/g, '').replace(/\/(amp|feed)$/, '');
  if (path in PAGES) return PAGES[path];
  if (POSTS.has(path)) return `/blog/${path}/`;
  return ARCHIVE;
}

export default {
  fetch(request) {
    const { pathname } = new URL(request.url);
    return Response.redirect(TARGET + destination(pathname), 301);
  },
};
