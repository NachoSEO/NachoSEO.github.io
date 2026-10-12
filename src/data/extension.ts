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

/** Versión publicada y fecha de la última actualización (se muestran en la landing) */
export const extensionVersion = { number: '0.1.0', updated: { es: '12 de octubre de 2026', en: 'October 12, 2026' } };

/** Capturas reales de la extensión: src/assets/img/extension/<lang>/<shot>.png */
export type ExtensionShot =
  | 'popup-resumen'
  | 'popup-bots'
  | 'comparar-vista'
  | 'comparar-codigo'
  | 'popup-js'
  | 'icono-estados'
  | 'popup-vitals'
  | 'vitals-pagina'
  | 'popup-schema'
  | 'enlaces'
  | 'popup-hreflang';

export interface ExtensionBlock {
  title: string;
  /** Párrafos; admiten enlaces como [texto](url) */
  detail: string[];
  shots: { shot: ExtensionShot; alt: string; caption: string; wide?: boolean }[];
}

export interface ExtensionLandingCopy {
  /** Texto alternativo de la captura de la cabecera (el resumen del popup) */
  heroAlt: string;
  differentiators: ExtensionBlock[];
  diagnostics: ExtensionBlock[];
  basics: { title: string; detail: string }[];
  changelog: { version: string; date: string; notes: string }[];
}

const ROBOTSTXT_REPO = 'https://github.com/google/robotstxt';
const GOOGLE_EXTENDED = 'https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers#google-extended';

export const extensionLanding: Record<Lang, ExtensionLandingCopy> = {
  es: {
    heroAlt: 'Resumen de la extensión: página indexable, HTTP 200, sin meta robots ni X-Robots-Tag, canonical a sí misma y permitida en robots.txt',
    differentiators: [
      {
        title: 'robots.txt leído con el parser de Google, línea a línea',
        detail: [
          `La extensión lee el robots.txt con [el parser que Google publica como código abierto](${ROBOTSTXT_REPO}), el de producción de Googlebot, compilado a WebAssembly. Para cada bot te dice si puede rastrear la URL y qué línea lo decide.`,
          `Lo hace para Googlebot y para los bots de IA de buscadores y asistentes: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot y el resto. Google-Extended no rastrea: es [un token que decide si Gemini puede entrenar con tu web](${GOOGLE_EXTENDED}), y aparece en la lista para que veas si lo bloqueas.`,
          'Además puedes navegar una pestaña como cualquiera de esos bots, o con un user-agent tuyo. Cambia el user-agent, no la IP: sirve para ver si la web sirve otra cosa según quién pregunta, no para pasar por el bot real.',
        ],
        shots: [
          {
            shot: 'popup-bots',
            alt: 'Pestaña Bots de la extensión en elmundo.es: GPTBot, OAI-SearchBot, ChatGPT-User y PerplexityBot bloqueados con la línea exacta del robots.txt, y los bots de Anthropic permitidos',
            caption: 'elmundo.es bloquea a los tres bots de OpenAI y a PerplexityBot (con la línea de cada bloqueo) y deja pasar a los de Anthropic.',
          },
        ],
      },
      {
        title: 'La página con JavaScript y sin JavaScript, lado a lado',
        detail: [
          'Muchos bots de IA no ejecutan JavaScript: ven el HTML que sirve el servidor. Un botón abre una pestaña con las dos versiones de la página una al lado de la otra, y otra vista con el diff completo del HTML contra el DOM renderizado.',
          'El resumen te dice qué enlaces, headings y bloques de texto solo existen con JavaScript, que es lo que un bot que no renderiza se pierde.',
        ],
        shots: [
          {
            shot: 'comparar-vista',
            alt: 'Comparativa de elmundo.es con JavaScript a la izquierda y sin JavaScript a la derecha',
            caption: 'elmundo.es sin JavaScript pierde los juegos y el muro de pago: es lo que ve un bot que no renderiza.',
            wide: true,
          },
          {
            shot: 'comparar-codigo',
            alt: 'Resumen y diff de código de elmundo.es: enlaces y headings que solo existen con JavaScript',
            caption: 'El diff marca en verde lo que añade el JavaScript y en rojo lo que quita, con el resumen de enlaces y headings arriba.',
            wide: true,
          },
        ],
      },
      {
        title: 'Un icono que separa indexación y rastreo',
        detail: [
          'El icono de la barra tiene dos mitades. La izquierda es la indexación: roja si hay noindex (en la meta o en la cabecera X-Robots-Tag) o un error, ámbar si la canonical apunta a otra URL. La derecha es el rastreo: roja si el robots.txt bloquea a Googlebot.',
          'Navegando ves de un vistazo qué falla. El número solo aparece si hay redirección o error.',
        ],
        shots: [
          {
            shot: 'icono-estados',
            alt: 'Cuatro estados del icono de la extensión: indexable y rastreable, noindex o error, bloqueada en robots.txt, canonical a otra URL con redirección 301',
            caption: 'Dos verdes, todo bien. Si una mitad cambia de color, ya sabes si el problema es de indexación o de rastreo.',
          },
        ],
      },
    ],
    diagnostics: [
      {
        title: 'Indexabilidad y redirecciones en un clic',
        detail: [
          'Código de estado, meta robots, X-Robots-Tag, canonical y robots.txt en una pantalla, con cada redirección salto a salto (también las de JavaScript y meta refresh, y las internas del navegador por HSTS).',
        ],
        shots: [],
      },
      {
        title: 'Aviso cuando el JavaScript cambia lo importante',
        detail: ['Compara title, description, canonical, robots, H1, headings, enlaces y palabras entre el HTML del servidor y la página renderizada, y marca lo que cambia.'],
        shots: [{ shot: 'popup-js', alt: 'Pestaña JS vs HTML de elmundo.es: headings, enlaces y palabras distintos entre el HTML del servidor y el renderizado', caption: 'En elmundo.es el JavaScript añade headings, enlaces y texto.' }],
      },
      {
        title: 'Core Web Vitals con el culpable marcado',
        detail: [
          'LCP, CLS, INP, FCP y TTFB de tu visita, con las fases del LCP para saber si el problema es el servidor, la carga del recurso o el pintado. Un botón recuadra sobre la página el elemento del LCP, los que se desplazan y la interacción más lenta.',
          'Son datos de tu visita en tu navegador, no de usuarios reales (CrUX).',
        ],
        shots: [
          { shot: 'popup-vitals', alt: 'Pestaña Vitals con LCP, CLS, INP, FCP y TTFB y las fases del LCP', caption: 'Las métricas de tu visita y de qué se compone el LCP.' },
          { shot: 'vitals-pagina', alt: 'Página de elmundo.es con el elemento del LCP y el bloque que causa el CLS recuadrados', caption: 'El elemento del LCP y el bloque que causa el CLS, recuadrados sobre la página.', wide: true },
        ],
      },
      {
        title: 'Schema que se lee',
        detail: ['Cada entidad del JSON-LD como un árbol, con su tipo destacado y un botón para copiarla. Avisa del JSON roto y del schema que solo aparece con JavaScript, y abre la Prueba de resultados enriquecidos con la URL puesta.'],
        shots: [{ shot: 'popup-schema', alt: 'Pestaña Schema con las entidades WebSite y Person en forma de árbol y botones de copiar', caption: 'Cada entidad del @graph en su tarjeta, lista para copiar.' }],
      },
      {
        title: 'Todos los enlaces, adónde apuntan y con qué rel',
        detail: ['Una tabla con todos los enlaces de la página, filtrable por interno o externo y por rel (nofollow, sponsored, ugc), y exportable a CSV. Sobre la propia página, un punto de color en cada enlace según su rel.'],
        shots: [{ shot: 'enlaces', alt: 'Tabla de enlaces de elmundo.es con texto, URL, tipo y rel', caption: 'Los 465 enlaces de la portada de elmundo.es, filtrables y exportables.', wide: true }],
      },
      {
        title: 'Hreflang con reciprocidad',
        detail: ['Valida los códigos, avisa si falta la autorreferencia o el x-default y comprueba que cada versión enlaza de vuelta a las demás.'],
        shots: [{ shot: 'popup-hreflang', alt: 'Pestaña Hreflang con las versiones es, en y x-default, todas con estado 200 y enlace de vuelta', caption: 'Tres versiones, las tres responden 200 y se enlazan entre sí.' }],
      },
    ],
    basics: [
      { title: 'Metadatos completos', detail: 'Title y description con su longitud, canonical, robots, Open Graph, Twitter e idioma.' },
      { title: 'Headings anidados', detail: 'De H1 a H6 con sangría, con avisos de saltos de nivel, vacíos y ocultos.' },
      { title: 'Entidades en las SERPs', detail: 'Las entidades del Knowledge Graph (kgmid) que aparecen en los resultados de Google.' },
      { title: 'Volúmenes en Google y Trends', detail: 'Volumen y CPC con tu propia cuenta de DataForSEO. Pagas solo lo que consultas.' },
    ],
    changelog: [{ version: '0.1.0', date: '12 de octubre de 2026', notes: 'Primera versión: todo lo de esta página.' }],
  },
  en: {
    heroAlt: 'Extension summary: indexable page, HTTP 200, no meta robots or X-Robots-Tag, self-referencing canonical, allowed in robots.txt',
    differentiators: [
      {
        title: 'robots.txt read with Google’s parser, line by line',
        detail: [
          `The extension reads robots.txt with [the parser Google publishes as open source](${ROBOTSTXT_REPO}), Googlebot’s production code, compiled to WebAssembly. For each bot it tells you whether it can crawl the URL and which line decides it.`,
          `It does this for Googlebot and for the AI search and assistant bots: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot and the rest. Google-Extended doesn’t crawl: it is [a token that decides whether Gemini can train on your site](${GOOGLE_EXTENDED}), and it is listed so you can see if you block it.`,
          'You can also browse a tab as any of those bots, or with your own user agent. It changes the user agent, not the IP: it shows whether the site serves something different depending on who asks, not how it treats the real bot.',
        ],
        shots: [
          {
            shot: 'popup-bots',
            alt: 'Bots tab on elmundo.es: GPTBot, OAI-SearchBot, ChatGPT-User and PerplexityBot blocked with the exact robots.txt line, Anthropic bots allowed',
            caption: 'elmundo.es blocks OpenAI’s three bots and PerplexityBot (with the line of each block) and lets Anthropic’s through.',
          },
        ],
      },
      {
        title: 'The page with and without JavaScript, side by side',
        detail: [
          'Many AI bots don’t run JavaScript: they see the HTML the server sends. One button opens a tab with both versions of the page side by side, and another view with the full diff of the server HTML against the rendered DOM.',
          'The summary tells you which links, headings and text blocks only exist with JavaScript, which is what a bot that doesn’t render misses.',
        ],
        shots: [
          { shot: 'comparar-vista', alt: 'elmundo.es with JavaScript on the left and without JavaScript on the right', caption: 'Without JavaScript, elmundo.es loses its games and paywall: that is what a bot that doesn’t render sees.', wide: true },
          { shot: 'comparar-codigo', alt: 'Summary and code diff for elmundo.es: links and headings that only exist with JavaScript', caption: 'The diff marks what JavaScript adds in green and what it removes in red, with links and headings summarized on top.', wide: true },
        ],
      },
      {
        title: 'An icon that splits indexing from crawling',
        detail: [
          'The toolbar icon has two halves. The left one is indexing: red if there is a noindex (in the meta tag or the X-Robots-Tag header) or an error, amber if the canonical points to another URL. The right one is crawling: red if robots.txt blocks Googlebot.',
          'You see what’s wrong as you browse. The number only shows up when there is a redirect or an error.',
        ],
        shots: [{ shot: 'icono-estados', alt: 'Four states of the extension icon: indexable and crawlable, noindex or error, blocked in robots.txt, canonical to another URL with a 301 redirect', caption: 'Two greens, all good. When a half changes color, you know whether the problem is indexing or crawling.' }],
      },
    ],
    diagnostics: [
      {
        title: 'Indexability and redirects in one click',
        detail: ['Status code, meta robots, X-Robots-Tag, canonical and robots.txt on one screen, with every redirect hop by hop (JavaScript and meta refresh ones too, and the browser’s internal HSTS redirects).'],
        shots: [],
      },
      {
        title: 'A warning when JavaScript changes what matters',
        detail: ['Compares title, description, canonical, robots, H1, headings, links and word count between the server HTML and the rendered page, and flags what changes.'],
        shots: [{ shot: 'popup-js', alt: 'JS vs HTML tab on elmundo.es: headings, links and words differ between server HTML and rendered page', caption: 'On elmundo.es, JavaScript adds headings, links and text.' }],
      },
      {
        title: 'Core Web Vitals with the culprit marked',
        detail: [
          'LCP, CLS, INP, FCP and TTFB for your visit, with the LCP phases so you know whether the problem is the server, the resource load or the paint. One button boxes the LCP element, the shifting elements and the slowest interaction on the page.',
          'This is data from your visit in your browser, not from real users (CrUX).',
        ],
        shots: [
          { shot: 'popup-vitals', alt: 'Vitals tab with LCP, CLS, INP, FCP and TTFB and the LCP phases', caption: 'Your visit’s metrics and what the LCP is made of.' },
          { shot: 'vitals-pagina', alt: 'elmundo.es with the LCP element and the block causing CLS boxed', caption: 'The LCP element and the block causing CLS, boxed on the page.', wide: true },
        ],
      },
      {
        title: 'Schema you can read',
        detail: ['Every JSON-LD entity as a tree, with its type highlighted and a button to copy it. It flags broken JSON and schema that only shows up with JavaScript, and opens the Rich Results Test with the URL filled in.'],
        shots: [{ shot: 'popup-schema', alt: 'Schema tab with the WebSite and Person entities as trees and copy buttons', caption: 'Each @graph entity in its own card, ready to copy.' }],
      },
      {
        title: 'Every link, where it points and its rel',
        detail: ['A table with every link on the page, filterable by internal or external and by rel (nofollow, sponsored, ugc), and exportable to CSV. On the page itself, a colored dot on each link by its rel.'],
        shots: [{ shot: 'enlaces', alt: 'Links table for elmundo.es with text, URL, type and rel', caption: 'The 465 links on the elmundo.es homepage, filterable and exportable.', wide: true }],
      },
      {
        title: 'Hreflang with reciprocity',
        detail: ['Validates the codes, flags a missing self-reference or x-default and checks that every version links back to the others.'],
        shots: [{ shot: 'popup-hreflang', alt: 'Hreflang tab with es, en and x-default versions, all 200 and linking back', caption: 'Three versions, all answer 200 and link to each other.' }],
      },
    ],
    basics: [
      { title: 'Full metadata', detail: 'Title and description with their length, canonical, robots, Open Graph, Twitter and language.' },
      { title: 'Nested headings', detail: 'H1 to H6, indented, with warnings for skipped levels, empty and hidden headings.' },
      { title: 'Entities in SERPs', detail: 'The Knowledge Graph entities (kgmid) that show up in Google’s results.' },
      { title: 'Volumes in Google and Trends', detail: 'Volume and CPC with your own DataForSEO account. You only pay for what you look up.' },
    ],
    changelog: [{ version: '0.1.0', date: 'October 12, 2026', notes: 'First version: everything on this page.' }],
  },
};

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
