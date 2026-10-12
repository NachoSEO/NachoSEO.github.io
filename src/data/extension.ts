/** Extensión de Chrome SEO & GEO Inspector: datos comunes de la landing, la bienvenida, la desinstalación y la privacidad */
import type { Lang } from '../i18n/ui';

/** URL de la ficha en la Chrome Web Store. Mientras sea null, la landing dice "muy pronto" */
export const EXTENSION_STORE_URL: string | null = null;

export const extensionPaths: Record<Lang, { landing: string; welcome: string; uninstalled: string; privacy: string }> = {
  es: {
    landing: '/herramientas/extension-seo-geo/',
    welcome: '/herramientas/extension-seo-geo/bienvenida/',
    uninstalled: '/herramientas/extension-seo-geo/desinstalada/',
    privacy: '/herramientas/extension-seo-geo/privacidad/',
  },
  en: {
    landing: '/en/tools/seo-geo-extension/',
    welcome: '/en/tools/seo-geo-extension/welcome/',
    uninstalled: '/en/tools/seo-geo-extension/uninstalled/',
    privacy: '/en/tools/seo-geo-extension/privacy/',
  },
};

export const extensionFeatures: Record<Lang, { title: string; detail: string }[]> = {
  es: [
    {
      title: 'Semáforo de indexabilidad',
      detail: 'Código de estado, meta robots, X-Robots-Tag, canonical y robots.txt en un vistazo, y un aviso si el JavaScript cambia alguno de ellos.',
    },
    {
      title: 'Redirecciones salto a salto',
      detail: 'Cada redirección con su código, también las de JavaScript y meta refresh. Distingue las internas del navegador (HSTS) de las del servidor.',
    },
    {
      title: 'robots.txt con el parser de Google',
      detail: 'El mismo código que usa Googlebot, compilado a WebAssembly, con la línea exacta que bloquea o permite la URL.',
    },
    {
      title: 'Bots de IA',
      detail: 'Qué pueden rastrear GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended y el resto, separados en entrenamiento, búsqueda y navegación.',
    },
    {
      title: 'Navega como un bot',
      detail: 'Cambia el user-agent de una pestaña a Googlebot, Bingbot, GPTBot, ClaudeBot, PerplexityBot y el resto, para ver qué les sirve la web.',
    },
    {
      title: 'Metadatos completos',
      detail: 'Title y description con su longitud, canonical, robots, Open Graph, Twitter, idioma y tipos de schema.',
    },
    {
      title: 'Headings anidados',
      detail: 'La estructura de H1 a H6 con sangría, con avisos de saltos de nivel, encabezados vacíos y ocultos.',
    },
    {
      title: 'Enlaces nofollow, sponsored y ugc',
      detail: 'Un punto de color sobre cada enlace según su rel, con leyenda, para ver de un vistazo cómo enlaza una página.',
    },
    {
      title: 'Con JavaScript y sin JavaScript',
      detail: 'Compara el HTML que sirve el servidor con el DOM renderizado y te deja ver la página con el JavaScript desactivado.',
    },
    {
      title: 'Hreflang con reciprocidad',
      detail: 'Códigos válidos, x-default y autorreferencia, y comprueba que cada versión enlaza de vuelta a las demás.',
    },
    {
      title: 'Entidades en las SERPs',
      detail: 'Las entidades del Knowledge Graph (kgmid) que aparecen en los resultados de Google.',
    },
    {
      title: 'Volúmenes en Google y Trends',
      detail: 'Volumen y CPC en las SERPs y en Google Trends con tu propia cuenta de DataForSEO. Pagas solo lo que consultas.',
    },
  ],
  en: [
    {
      title: 'Indexability traffic light',
      detail: 'Status code, meta robots, X-Robots-Tag, canonical and robots.txt at a glance, plus a warning when JavaScript changes any of them.',
    },
    {
      title: 'Redirects, hop by hop',
      detail: 'Every redirect with its status code, including JavaScript and meta refresh ones. It tells the browser’s internal redirects (HSTS) apart from the server’s.',
    },
    {
      title: 'robots.txt with Google’s parser',
      detail: 'The same code Googlebot runs, compiled to WebAssembly, with the exact line that blocks or allows the URL.',
    },
    {
      title: 'AI bots',
      detail: 'What GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended and the rest can crawl, split into training, search and browsing.',
    },
    {
      title: 'Browse as a bot',
      detail: 'Switch one tab’s user-agent to Googlebot, Bingbot, GPTBot, ClaudeBot, PerplexityBot and the rest, to see what the site serves them.',
    },
    {
      title: 'Full metadata',
      detail: 'Title and description with their length, canonical, robots, Open Graph, Twitter, language and schema types.',
    },
    {
      title: 'Nested headings',
      detail: 'The H1 to H6 outline, indented, with warnings for skipped levels, empty headings and hidden ones.',
    },
    {
      title: 'Nofollow, sponsored and ugc links',
      detail: 'A colored dot on every link by its rel, with a legend, so you can see how a page links at a glance.',
    },
    {
      title: 'With and without JavaScript',
      detail: 'Compares the HTML the server sends with the rendered DOM, and lets you view the page with JavaScript turned off.',
    },
    {
      title: 'Hreflang with reciprocity',
      detail: 'Valid codes, x-default and self-reference, and it checks that every version links back to the others.',
    },
    {
      title: 'Entities in SERPs',
      detail: 'The Knowledge Graph entities (kgmid) that show up in Google’s results.',
    },
    {
      title: 'Volumes in Google and Trends',
      detail: 'Volume and CPC in SERPs and in Google Trends with your own DataForSEO account. You only pay for what you look up.',
    },
  ],
};

/** Motivos de desinstalación (el valor viaja al endpoint y al email) */
export const uninstallReasons: Record<Lang, { value: string; label: string }[]> = {
  es: [
    { value: 'not-using', label: 'No la uso' },
    { value: 'missing-feature', label: 'Le falta algo que necesito' },
    { value: 'broken', label: 'No funciona bien' },
    { value: 'permissions', label: 'Pide demasiados permisos' },
    { value: 'other-extension', label: 'Uso otra extensión' },
    { value: 'other', label: 'Otro motivo' },
  ],
  en: [
    { value: 'not-using', label: 'I don’t use it' },
    { value: 'missing-feature', label: 'It’s missing something I need' },
    { value: 'broken', label: 'It doesn’t work well' },
    { value: 'permissions', label: 'It asks for too many permissions' },
    { value: 'other-extension', label: 'I use another extension' },
    { value: 'other', label: 'Something else' },
  ],
};
