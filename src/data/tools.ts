/** Herramientas gratis: fuente única para /herramientas/, /en/tools/ y llms.txt */
import type { Lang } from '../i18n/ui';

interface ToolCopy {
  href: string;
  title: string;
  tagline: string;
  detail: string;
  /** Línea para llms.txt: qué hace, en una frase */
  summary: string;
}

export const tools: Record<Lang, ToolCopy>[] = [
  {
    es: {
      href: '/herramientas/calculadora-valor-sesion-seo/',
      title: 'Calculadora del valor de una sesión orgánica',
      tagline: 'Cuánto deja cada visita de Google según tu modelo de negocio: ventas, leads o publicidad.',
      detail: 'Valor por sesión, al mes, al año y por cada 1.000 clics más. Para priorizar page types con números.',
      summary: 'calcula cuánto vale cada sesión orgánica según el modelo de negocio (ventas, leads o publicidad).',
    },
    en: {
      href: '/en/tools/organic-session-value-calculator/',
      title: 'Organic session value calculator',
      tagline: 'What each Google visit is worth for your business model: sales, leads or advertising.',
      detail: 'Value per session, per month, per year and per 1,000 extra clicks. Prioritize page types with numbers.',
      summary: 'works out what each organic session is worth for a sales, leads or advertising business model.',
    },
  },
  {
    es: {
      href: '/herramientas/forecast-seo/',
      title: 'Forecast SEO con Search Console',
      tagline: 'Cuántos clics ganas si tus consultas suben de posición y cuántos tendrás en 3, 6 o 12 meses.',
      detail: 'Con tu propia curva de CTR, estacionalidad del último año y todo en tu navegador.',
      summary: 'previsión de tráfico SEO a partir del export de Search Console: escenarios por posición con la curva de CTR propia y proyección con estacionalidad.',
    },
    en: {
      href: '/en/tools/seo-forecast/',
      title: 'SEO forecast from Search Console',
      tagline: 'How many clicks you gain if your queries move up, and how many you will get in 3, 6 or 12 months.',
      detail: "With your own CTR curve, last year's seasonality and everything in your browser.",
      summary: 'SEO traffic forecast from the Search Console export: position scenarios with your own CTR curve and a seasonal projection.',
    },
  },
  {
    es: {
      href: '/herramientas/generador-sitemap/',
      title: 'Generador de sitemap XML',
      tagline: 'Convierte una lista de URLs o un CSV en un sitemap.xml listo para Search Console.',
      detail: 'Índices automáticos a partir de 50.000 URLs, un sitemap por dominio y todo en tu navegador.',
      summary: 'crea un sitemap.xml gratis a partir de una lista de URLs o un CSV, sin enviar los datos a ningún servidor.',
    },
    en: {
      href: '/en/tools/sitemap-generator/',
      title: 'XML Sitemap Generator',
      tagline: 'Turn a list of URLs or a CSV into a sitemap.xml ready for Search Console.',
      detail: 'Automatic indexes past 50,000 URLs, one sitemap per domain, and everything runs in your browser.',
      summary: 'build a sitemap.xml for free from a list of URLs or a CSV; your data never leaves the browser.',
    },
  },
  {
    es: {
      href: '/herramientas/comprobador-bots/',
      title: 'Comprobador de acceso de bots',
      tagline: 'Mira si Googlebot y los bots de ChatGPT, Claude o Perplexity pueden entrar en tu web.',
      detail: 'robots.txt, respuesta HTTP, bloqueos del firewall, noindex y sitemap de 15 bots en una sola pasada.',
      summary: 'comprueba si Googlebot y los bots de IA (ChatGPT, Claude, Perplexity) pueden rastrear una URL: robots.txt, respuesta HTTP, firewall y noindex.',
    },
    en: {
      href: '/en/tools/bot-access-checker/',
      title: 'Bot access checker',
      tagline: 'See whether Googlebot and the ChatGPT, Claude or Perplexity bots can reach your site.',
      detail: 'robots.txt, HTTP response, firewall blocks, noindex and sitemap for 15 bots in one pass.',
      summary: 'checks whether Googlebot and AI bots (ChatGPT, Claude, Perplexity) can crawl a URL: robots.txt, HTTP response, firewall and noindex.',
    },
  },
  {
    es: {
      href: '/herramientas/robots-txt-tester/',
      title: 'Tester de robots.txt con el parser de Google',
      tagline: 'Prueba qué URLs bloquea tu robots.txt para Googlebot, GPTBot, ClaudeBot o PerplexityBot.',
      detail: 'El mismo código que usa Googlebot, con la línea que decide cada caso y las que Google ignora.',
      summary: 'prueba un robots.txt con el parser oficial de Google (el de Googlebot, compilado a WebAssembly) para cualquier URL y user-agent, incluidos los bots de IA.',
    },
    en: {
      href: '/en/tools/robots-txt-tester/',
      title: "robots.txt tester with Google's parser",
      tagline: 'Test which URLs your robots.txt blocks for Googlebot, GPTBot, ClaudeBot or PerplexityBot.',
      detail: 'The same code Googlebot runs, with the line that decides each case and the lines Google ignores.',
      summary: "tests a robots.txt with Google's official parser (Googlebot's, compiled to WebAssembly) for any URL and user-agent, AI bots included.",
    },
  },
  {
    es: {
      href: '/herramientas/comprobador-redirecciones/',
      title: 'Comprobador de redirecciones y códigos HTTP',
      tagline: 'Hasta 100 URLs a la vez: código HTTP, cada salto de sus redirecciones, noindex y canonical.',
      detail: 'Como navegador o como Googlebot. Para migraciones y para limpiar enlaces internos.',
      summary: 'comprueba en bloque el código HTTP y las cadenas de redirecciones de hasta 100 URLs, con noindex y canonical, como navegador o como Googlebot.',
    },
    en: {
      href: '/en/tools/redirect-checker/',
      title: 'Redirect and HTTP status checker',
      tagline: 'Up to 100 URLs at once: HTTP status, every redirect hop, noindex and canonical.',
      detail: 'As a browser or as Googlebot. For migrations and for cleaning up internal links.',
      summary: 'bulk-checks the HTTP status and redirect chains of up to 100 URLs, with noindex and canonical, as a browser or as Googlebot.',
    },
  },
  {
    es: {
      href: '/herramientas/auditor-sitemap/',
      title: 'Auditor de sitemap XML',
      tagline: 'Duplicadas, URLs de otro dominio o bloqueadas por robots.txt, y el estado de una muestra como Googlebot.',
      detail: 'Lee índices y archivos .gz, y encuentra los sitemaps a partir del robots.txt.',
      summary: 'audita un sitemap XML (también índices y .gz): duplicadas, otro dominio, bloqueadas por robots.txt y código HTTP, noindex y canonical de una muestra.',
    },
    en: {
      href: '/en/tools/sitemap-auditor/',
      title: 'XML sitemap auditor',
      tagline: 'Duplicates, URLs on another domain or blocked by robots.txt, and the status of a sample as Googlebot.',
      detail: 'Reads indexes and .gz files, and finds the sitemaps from robots.txt.',
      summary: 'audits an XML sitemap (indexes and .gz too): duplicates, other domains, robots.txt blocks, and HTTP status, noindex and canonical for a sample.',
    },
  },
  {
    es: {
      href: '/herramientas/clusterizador-keywords/',
      title: 'Clusterizador de keywords',
      tagline: 'Agrupa miles de keywords por tema y suma el volumen de cada grupo.',
      detail: 'Une plurales, variantes y palabras en otro orden. Todo en tu navegador, con CSV.',
      summary: 'agrupa listas de keywords por tema en el navegador (plurales, variantes y orden), suma el volumen de cada grupo y exporta a CSV.',
    },
    en: {
      href: '/en/tools/keyword-clusterer/',
      title: 'Keyword clusterer',
      tagline: 'Group thousands of keywords by topic and add up the volume of each group.',
      detail: 'Joins plurals, variants and different word orders. All in your browser, with a CSV.',
      summary: 'groups keyword lists by topic in the browser (plurals, variants and word order), sums each group’s volume and exports a CSV.',
    },
  },
  {
    es: {
      href: '/herramientas/canal-trafico-ia-ga4/',
      title: 'Canal de tráfico de IA en GA4',
      tagline: 'La regex y el grupo de canales para ver juntas las visitas de ChatGPT, Perplexity, Gemini o Claude.',
      detail: 'También el campo calculado de Looker Studio y la consulta para el export de GA4 en BigQuery.',
      summary: 'genera la regex, el grupo de canales de GA4, el campo de Looker Studio y la consulta de BigQuery para medir el tráfico de asistentes de IA.',
    },
    en: {
      href: '/en/tools/ga4-ai-traffic-channel/',
      title: 'AI traffic channel in GA4',
      tagline: 'The regex and channel group to see ChatGPT, Perplexity, Gemini or Claude visits together.',
      detail: 'Plus the Looker Studio calculated field and the query for the GA4 BigQuery export.',
      summary: 'generates the regex, GA4 channel group, Looker Studio field and BigQuery query to measure traffic from AI assistants.',
    },
  },
];

export const toolsFor = (lang: Lang) => tools.map((tool) => tool[lang]);
