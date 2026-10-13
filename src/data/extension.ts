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
  | 'popup-hreflang'
  | 'popup-fanout'
  | 'serp-volumenes'
  | 'trends-volumenes'
  | 'popup-resumen-elmundo'
  | 'pagina-blog'
  | 'pagina-elmundo';

export interface ExtensionBlock {
  /** Ancla de la sección (la usa el índice de funciones) */
  id?: string;
  title: string;
  /** Párrafos; admiten enlaces como [texto](url) */
  detail: string[];
  shots: { shot: ExtensionShot; alt: string; caption: string; wide?: boolean }[];
}

export interface ExtensionLandingCopy {
  /** Índice de todas las funciones, arriba de la página. `section` = id de la sección donde se explica */
  overview: { group: string; items: { name: string; detail: string; section?: string }[] }[];
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
    overview: [
      {
        group: 'Indexación y rastreo',
        items: [
          { name: 'Semáforo de indexabilidad', detail: 'Estado, meta robots, X-Robots-Tag y canonical.', section: 'resumen' },
          { name: 'Redirecciones salto a salto', detail: 'También JavaScript, meta refresh y HSTS.', section: 'resumen' },
          { name: 'robots.txt con el parser de Google', detail: 'Con la línea que decide cada bot.', section: 'robots' },
          { name: 'Icono de dos mitades', detail: 'Indexación y rastreo mientras navegas.', section: 'icono' },
        ],
      },
      {
        group: 'Bots e IA',
        items: [
          { name: 'Bots de IA', detail: 'GPTBot, ClaudeBot, PerplexityBot y el resto.', section: 'robots' },
          { name: 'Navegar como un bot', detail: 'Con su user-agent o uno tuyo.', section: 'robots' },
          { name: 'Fan-out de la IA', detail: 'Las búsquedas de ChatGPT, Claude y Perplexity.', section: 'fanout' },
          { name: 'Con y sin JavaScript', detail: 'Lado a lado y con el diff completo.', section: 'javascript' },
        ],
      },
      {
        group: 'Contenido y rendimiento',
        items: [
          { name: 'Core Web Vitals', detail: 'Con el elemento culpable marcado.', section: 'vitals' },
          { name: 'Schema legible', detail: 'Cada entidad en árbol, para copiar.', section: 'schema' },
          { name: 'Metadatos y headings', detail: 'Title, description, Open Graph y H1 a H6.' },
          { name: 'Enlaces', detail: 'Tabla completa, rel y CSV.', section: 'enlaces' },
        ],
      },
      {
        group: 'Internacional y SERPs',
        items: [
          { name: 'Hreflang con reciprocidad', detail: 'Códigos, x-default y enlaces de vuelta.', section: 'hreflang' },
          { name: 'Entidades en las SERPs', detail: 'Los kgmid del Knowledge Graph.', section: 'serps' },
          { name: 'Entidades del top 10', detail: 'Qué tratan los 10 primeros resultados.', section: 'serps' },
          { name: 'Volúmenes en Google y Trends', detail: 'Con tu cuenta de DataForSEO.', section: 'serps' },
        ],
      },
    ],
    heroAlt: 'Resumen de la extensión: página indexable, HTTP 200, sin meta robots ni X-Robots-Tag, canonical a sí misma y permitida en robots.txt',
    differentiators: [
      {
        id: 'robots',
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
        id: 'javascript',
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
        id: 'fanout',
        title: 'Las búsquedas que lanza la IA antes de responder',
        detail: [
          'Mientras usas Claude o Perplexity, la extensión recoge las búsquedas web que lanza el modelo para responderte (el query fan-out), agrupadas por pregunta, para copiarlas o exportarlas a CSV. Con ChatGPT funciona si tienes la sesión iniciada.',
          'Se leen de las respuestas que ya recibe tu navegador: no se envía nada a ningún sitio. Gemini y AI Mode de Google no muestran sus búsquedas, así que no se pueden capturar.',
        ],
        shots: [
          {
            shot: 'popup-fanout',
            alt: 'Pestaña Fan-out con las dos búsquedas web que lanzó Claude para responder qué consultores de GEO recomienda en España',
            caption: 'Las dos búsquedas reales que lanzó Claude el 12 de octubre de 2026 para responder «¿Qué consultores de GEO recomiendas en España?».',
          },
        ],
      },
      {
        id: 'icono',
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
        id: 'resumen',
        title: 'Indexabilidad y redirecciones en un clic',
        detail: [
          'Código de estado, meta robots, X-Robots-Tag, canonical y robots.txt en una pantalla, con cada redirección salto a salto (también las de JavaScript y meta refresh, y las internas del navegador por HSTS).',
        ],
        shots: [],
      },
      {
        id: 'js-aviso',
        title: 'Aviso cuando el JavaScript cambia lo importante',
        detail: ['Compara title, description, canonical, robots, H1, headings, enlaces y palabras entre el HTML del servidor y la página renderizada, y marca lo que cambia.'],
        shots: [{ shot: 'popup-js', alt: 'Pestaña JS vs HTML de elmundo.es: headings, enlaces y palabras distintos entre el HTML del servidor y el renderizado', caption: 'En elmundo.es el JavaScript añade headings, enlaces y texto.' }],
      },
      {
        id: 'vitals',
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
        id: 'schema',
        title: 'Schema que se lee',
        detail: ['Cada entidad del JSON-LD como un árbol, con su tipo destacado y un botón para copiarla. Avisa del JSON roto y del schema que solo aparece con JavaScript, y abre la Prueba de resultados enriquecidos con la URL puesta.'],
        shots: [{ shot: 'popup-schema', alt: 'Pestaña Schema con las entidades WebSite y Person en forma de árbol y botones de copiar', caption: 'Cada entidad del @graph en su tarjeta, lista para copiar.' }],
      },
      {
        id: 'enlaces',
        title: 'Todos los enlaces, adónde apuntan y con qué rel',
        detail: ['Una tabla con todos los enlaces de la página, filtrable por interno o externo y por rel (nofollow, sponsored, ugc), y exportable a CSV. Sobre la propia página, un punto de color en cada enlace según su rel.'],
        shots: [{ shot: 'enlaces', alt: 'Tabla de enlaces de elmundo.es con texto, URL, tipo y rel', caption: 'Los 465 enlaces de la portada de elmundo.es, filtrables y exportables.', wide: true }],
      },
      {
        id: 'serps',
        title: 'Entidades y volúmenes en Google y Trends',
        detail: [
          'En cada búsqueda de Google, un recuadro con las entidades del Knowledge Graph que aparecen en la SERP, con su kgmid y su enlace a Wikidata. Con tu cuenta de DataForSEO suma el volumen mensual, el CPC y la tendencia de 12 meses de la búsqueda y de sus relacionadas. En Google Trends, el volumen de los términos que comparas y, al pasar el ratón por la gráfica, las búsquedas reales de cada mes.',
          'Pagas a DataForSEO solo lo que consultas y cada volumen se guarda 30 días. Con una clave de la API Natural Language de Google, además, saca las entidades que tratan los 10 primeros resultados.',
        ],
        shots: [
          { shot: 'serp-volumenes', alt: 'Búsqueda de softonic en Google con el recuadro de la extensión: la entidad Softonic con su kgmid y el volumen de la búsqueda y de sus relacionadas', caption: 'softonic: 14.800 búsquedas al mes en España, y el volumen de cada búsqueda relacionada.', wide: true },
          { shot: 'trends-volumenes', alt: 'Google Trends comparando softonic y uptodown: el tooltip de la semana del 29 de marzo añade 18.100 y 14.800 búsquedas en abril de 2026, y el recuadro de la extensión da el volumen mensual de cada término', caption: 'Trends enseña el interés de 0 a 100; la extensión añade cuántas búsquedas son, mes a mes, en el propio tooltip.', wide: true },
        ],
      },
      {
        id: 'hreflang',
        title: 'Hreflang con reciprocidad',
        detail: ['Valida los códigos, avisa si falta la autorreferencia o el x-default y comprueba que cada versión enlaza de vuelta a las demás.'],
        shots: [{ shot: 'popup-hreflang', alt: 'Pestaña Hreflang con las versiones es, en y x-default, todas con estado 200 y enlace de vuelta', caption: 'Tres versiones, las tres responden 200 y se enlazan entre sí.' }],
      },
    ],
    basics: [
      { title: 'Metadatos completos', detail: 'Title y description con su longitud, canonical, robots, Open Graph, Twitter e idioma.' },
      { title: 'Headings anidados', detail: 'De H1 a H6 con sangría, con avisos de saltos de nivel, vacíos y ocultos.' },
    ],
    changelog: [{ version: '0.1.0', date: '12 de octubre de 2026', notes: 'Primera versión: todo lo de esta página.' }],
  },
  en: {
    overview: [
      {
        group: 'Indexing and crawling',
        items: [
          { name: 'Indexability lights', detail: 'Status, meta robots, X-Robots-Tag and canonical.', section: 'resumen' },
          { name: 'Redirects hop by hop', detail: 'JavaScript, meta refresh and HSTS too.', section: 'resumen' },
          { name: 'robots.txt with Google’s parser', detail: 'With the line that decides each bot.', section: 'robots' },
          { name: 'Two-half icon', detail: 'Indexing and crawling as you browse.', section: 'icono' },
        ],
      },
      {
        group: 'Bots and AI',
        items: [
          { name: 'AI bots', detail: 'GPTBot, ClaudeBot, PerplexityBot and the rest.', section: 'robots' },
          { name: 'Browse as a bot', detail: 'With its user agent or your own.', section: 'robots' },
          { name: 'AI fan-out', detail: 'The searches ChatGPT, Claude and Perplexity run.', section: 'fanout' },
          { name: 'With and without JavaScript', detail: 'Side by side and with the full diff.', section: 'javascript' },
        ],
      },
      {
        group: 'Content and performance',
        items: [
          { name: 'Core Web Vitals', detail: 'With the culprit element marked.', section: 'vitals' },
          { name: 'Readable schema', detail: 'Every entity as a tree, ready to copy.', section: 'schema' },
          { name: 'Metadata and headings', detail: 'Title, description, Open Graph and H1 to H6.' },
          { name: 'Links', detail: 'Full table, rel and CSV.', section: 'enlaces' },
        ],
      },
      {
        group: 'International and SERPs',
        items: [
          { name: 'Hreflang with reciprocity', detail: 'Codes, x-default and links back.', section: 'hreflang' },
          { name: 'Entities in SERPs', detail: 'The Knowledge Graph kgmids.', section: 'serps' },
          { name: 'Top 10 entities', detail: 'What the top 10 results cover.', section: 'serps' },
          { name: 'Volumes in Google and Trends', detail: 'With your DataForSEO account.', section: 'serps' },
        ],
      },
    ],
    heroAlt: 'Extension summary: indexable page, HTTP 200, no meta robots or X-Robots-Tag, self-referencing canonical, allowed in robots.txt',
    differentiators: [
      {
        id: 'robots',
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
        id: 'javascript',
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
        id: 'fanout',
        title: 'The searches AI runs before it answers',
        detail: [
          'While you use Claude or Perplexity, the extension collects the web searches the model runs to answer you (the query fan-out), grouped by question, to copy or export to CSV. With ChatGPT it works when you are signed in.',
          'They are read from the responses your browser already receives: nothing is sent anywhere. Gemini and Google AI Mode don’t show their searches, so they can’t be captured.',
        ],
        shots: [
          {
            shot: 'popup-fanout',
            alt: 'Fan-out tab with the two web searches Claude ran to answer which GEO consultants it recommends in Spain',
            caption: 'The two real searches Claude ran on October 12, 2026 to answer “Which GEO consultants do you recommend in Spain?”.',
          },
        ],
      },
      {
        id: 'icono',
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
        id: 'resumen',
        title: 'Indexability and redirects in one click',
        detail: ['Status code, meta robots, X-Robots-Tag, canonical and robots.txt on one screen, with every redirect hop by hop (JavaScript and meta refresh ones too, and the browser’s internal HSTS redirects).'],
        shots: [],
      },
      {
        id: 'js-aviso',
        title: 'A warning when JavaScript changes what matters',
        detail: ['Compares title, description, canonical, robots, H1, headings, links and word count between the server HTML and the rendered page, and flags what changes.'],
        shots: [{ shot: 'popup-js', alt: 'JS vs HTML tab on elmundo.es: headings, links and words differ between server HTML and rendered page', caption: 'On elmundo.es, JavaScript adds headings, links and text.' }],
      },
      {
        id: 'vitals',
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
        id: 'schema',
        title: 'Schema you can read',
        detail: ['Every JSON-LD entity as a tree, with its type highlighted and a button to copy it. It flags broken JSON and schema that only shows up with JavaScript, and opens the Rich Results Test with the URL filled in.'],
        shots: [{ shot: 'popup-schema', alt: 'Schema tab with the WebSite and Person entities as trees and copy buttons', caption: 'Each @graph entity in its own card, ready to copy.' }],
      },
      {
        id: 'enlaces',
        title: 'Every link, where it points and its rel',
        detail: ['A table with every link on the page, filterable by internal or external and by rel (nofollow, sponsored, ugc), and exportable to CSV. On the page itself, a colored dot on each link by its rel.'],
        shots: [{ shot: 'enlaces', alt: 'Links table for elmundo.es with text, URL, type and rel', caption: 'The 465 links on the elmundo.es homepage, filterable and exportable.', wide: true }],
      },
      {
        id: 'serps',
        title: 'Entities and volumes in Google and Trends',
        detail: [
          'On every Google search, a box with the Knowledge Graph entities that show up in the SERP, with their kgmid and a link to Wikidata. With your DataForSEO account it adds the monthly volume, CPC and 12-month trend of the search and its related searches. On Google Trends, the volume of the terms you compare and, when you hover over the chart, the real searches for each month.',
          'You pay DataForSEO only for what you look up, and each volume is cached for 30 days. With a Google Natural Language API key, it also extracts the entities the top 10 results cover.',
        ],
        shots: [
          { shot: 'serp-volumenes', alt: 'Google search for softonic with the extension box: the Softonic entity with its kgmid and the volume of the search and its related searches', caption: 'softonic: 14,800 searches a month in Spain, plus the volume of every related search.', wide: true },
          { shot: 'trends-volumenes', alt: 'Google Trends comparing softonic and uptodown: the tooltip for the week of March 29 adds 18,100 and 14,800 searches in April 2026, and the extension box shows each term’s monthly volume', caption: 'Trends shows interest from 0 to 100; the extension adds how many searches that is, month by month, right in the tooltip.', wide: true },
        ],
      },
      {
        id: 'hreflang',
        title: 'Hreflang with reciprocity',
        detail: ['Validates the codes, flags a missing self-reference or x-default and checks that every version links back to the others.'],
        shots: [{ shot: 'popup-hreflang', alt: 'Hreflang tab with es, en and x-default versions, all 200 and linking back', caption: 'Three versions, all answer 200 and link to each other.' }],
      },
    ],
    basics: [
      { title: 'Full metadata', detail: 'Title and description with their length, canonical, robots, Open Graph, Twitter and language.' },
      { title: 'Nested headings', detail: 'H1 to H6, indented, with warnings for skipped levels, empty and hidden headings.' },
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
