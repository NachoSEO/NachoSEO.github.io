/** Perfil: fuente única para "Sobre mí", sus versiones en Markdown, llms.txt y los datos estructurados */
import type { Lang } from '../i18n/ui';

export type BioSegment = { text: string; strong?: boolean };
export type TimelineItem = { period: string; role: string; detail: string; results?: string[] };
export type Project = { name: string; url: string; detail: string };

export const aboutPage: Record<Lang, { title: string; description: string }> = {
  es: { title: "Hago crecer negocios online", description: "Hago crecer negocios online. Me contrataron ex ingenieros de Google Search y monté desde cero equipos de SEO, GEO, CRM y afiliación." },
  en: { title: "I grow online businesses", description: "I grow online businesses. Former Google Search engineers hired me, and I built SEO, GEO, CRM and affiliate teams from scratch." },
};

/** Párrafos de la bio; los fragmentos con strong van en negrita */
export const bio: Record<Lang, BioSegment[][]> = {
  es: [
    [
      { text: "Cuando un equipo de ex ingenieros de Google Search necesitó hacer crecer su proyecto, me llamaron a mí.", strong: true },
      { text: " Conocen el algoritmo por dentro y aun así sabían que entender Google y convertirlo en negocio son cosas distintas." },
    ],
    [
      { text: "Empecé en 2014 en agencias, con clientes como Kids&Us, IESE, Naturgy, Familia Torres o Brompton. En Grupo Planeta llevé el SEO de Casa del Libro, Lonely Planet, Planeta DeAgostini y EAE Business School." },
    ],
    [
      { text: "En Softonic dirigí el SEO de un portfolio con más de 1.000 millones de usuarios al año, con Softonic, download.com y CNET. Allí monté un programa de contenido que pasó de " },
      { text: "0 a 20 millones de sesiones orgánicas al mes en dos años", strong: true },
      { text: ". Después, en Cliqpod, llevé word.tips y Router Network: dupliqué el tráfico de word.tips, con picos de 2 millones de visitas al día." },
    ],
    [
      { text: "Hoy dirijo el marketing orgánico y la IA de Reverse Tech. Allí monté desde cero los equipos de SEO, GEO, YouTube, CRM, afiliación y redes sociales, y llevé el canal orgánico de " },
      { text: "0 a más de 2 M$ de margen", strong: true },
      { text: ". También construí una fábrica de anuncios con IA que pasó de 200 a más de 3.000 creatividades por semana." },
    ],
    [
      { text: "Y hoy el negocio también se juega fuera de Google. Cada vez más clientes preguntan primero a ChatGPT, Perplexity o los AI Overviews, y esas respuestas citan a quien tiene autoridad. Por eso trabajo el GEO junto al SEO: para que tu marca sea la que recomiendan." },
    ],
    [
      { text: "Lo que monto son sistemas: procesos, automatización y equipos que siguen produciendo cuando yo ya no estoy." },
    ],
    [
      { text: "Vivo en Barcelona y trabajo en remoto con empresas de todo el mundo, en español y en inglés." },
    ],
  ],
  en: [
    [
      { text: "When a team of former Google Search engineers needed to grow their project, they called me.", strong: true },
      { text: " They know the algorithm from the inside, and they still knew that understanding Google and turning it into revenue are different things." },
    ],
    [
      { text: "I started in 2014 at agencies, with clients like Kids&Us, IESE, Naturgy, Familia Torres and Brompton. At Grupo Planeta I ran SEO for Casa del Libro, Lonely Planet, Planeta DeAgostini and EAE Business School." },
    ],
    [
      { text: "At Softonic I led SEO for a portfolio with over 1 billion users a year, including Softonic, download.com and CNET. There I built a content program that went from " },
      { text: "0 to 20 million monthly organic sessions in two years", strong: true },
      { text: ". Then, at Cliqpod, I ran word.tips and Router Network: I doubled traffic at word.tips, with peaks of 2 million visits a day." },
    ],
    [
      { text: "Today I lead organic marketing and AI at Reverse Tech. I built the SEO, GEO, YouTube, CRM, affiliate and social teams from scratch and took organic from " },
      { text: "$0 to over $2M in margin", strong: true },
      { text: ". I also built an AI ad factory that went from 200 to over 3,000 creatives a week." },
    ],
    [
      { text: "And business is now also won outside Google. More and more customers ask ChatGPT, Perplexity or AI Overviews first, and those answers cite whoever has authority. That's why I work on GEO alongside SEO: so your brand is the one they recommend." },
    ],
    [
      { text: "What I build are systems: processes, automation and teams that keep producing once I'm gone." },
    ],
    [
      { text: "I live in Barcelona and work remotely with companies all over the world, in Spanish and English." },
    ],
  ],
};

export const timeline: Record<Lang, TimelineItem[]> = {
  es: [
  {
    period: '2026 — hoy',
    role: 'Head of AI (Marketing Automation) · Reverse Tech',
    detail:
      'Sistemas agénticos ejecutando marketing en producción 24/7. Fábrica de anuncios con IA: de 200 a 3.000+ creatividades por semana, publicadas en Meta y Google por API.',
  },
  {
    period: '2025 — hoy',
    role: 'Head of Organic Marketing · Reverse Tech',
    detail:
      'Me contrataron para construir y dirigir desde cero toda el área orgánica: SEO, YouTube, web, email, redes sociales y afiliación, a lo largo de todo el ciclo de vida del cliente.',
    results: [
      'El canal orgánico pasó de 0 a más de 2 M$ de margen.',
      'Una web nueva pasó de 0 visitas desde Google a más de 60.000 visitas orgánicas al mes, con más de 200.000 $ al año en ingresos.',
      'YouTube: de 5.000 a 92.000 suscriptores. El mejor vídeo de la historia del canal tenía 20.000 visitas; hoy tenemos vídeos de 1,3 M, 500.000 y 400.000 visitas en EE. UU. en el vertical de fitness.',
      'Redes sociales y atención al cliente: de responder en días a responder en minutos, en todos los canales y a todos los comentarios.',
      'Contraté y dirigí un equipo de 8 personas, además de freelances y responsables de otras áreas.',
    ],
  },
  {
    period: '2024 — 2025',
    role: 'Head of SEO · Cliqpod',
    detail:
      'Dirección SEO de word.tips y Router Network. En word.tips dupliqué el tráfico orgánico, con picos de 2M de visitas diarias y ~60M al mes, 100 % orgánico.',
  },
  {
    period: '2019 — 2024',
    role: 'SEO Specialist → Product Owner → SEO Manager · Softonic',
    detail:
      'Portfolio de 6 webs (Softonic, download.com, CNET…) con 1.000M+ usuarios/año y un equipo de 3 especialistas. Programa de contenido con modelos propios, antes de ChatGPT: de 0 a 20M sesiones/mes en dos años; catálogo de 100k a 1M+ páginas. +40 % YoY (2024 vs 2023).',
  },
  {
    period: '2017 — 2019',
    role: 'SEO Manager · Grupo Planeta',
    detail:
      'SEO de Casa del Libro, Lonely Planet, Planeta DeAgostini y EAE Business School, entre otras marcas del grupo: scripts internos, dashboards automatizados y framework de migraciones.',
  },
  {
    period: '2014 — 2017',
    role: 'Agencias · SUMA, Tesubi y SEO Coaching',
    detail: 'SEO, SEM y dirección de proyectos para clientes como Kids&Us, IESE, Familia Torres, Brompton o Naturgy (entonces Gas Natural Fenosa).',
  },
],
  en: [
  {
    period: '2026 — now',
    role: 'Head of AI (Marketing Automation) · Reverse Tech',
    detail:
      'Agentic systems executing marketing in production 24/7. AI ad factory: from 200 to 3,000+ creatives per week, shipped to Meta and Google via API.',
  },
  {
    period: '2025 — now',
    role: 'Head of Organic Marketing · Reverse Tech',
    detail:
      'Hired to build and lead the whole organic area from scratch: SEO, YouTube, web, email, social media and affiliates, across the full customer lifecycle.',
    results: [
      'Organic went from $0 to over $2M in margin.',
      'A new website went from 0 visits from Google to over 60,000 organic visits a month, bringing in over $200k a year in revenue.',
      "YouTube: from 5,000 to 92,000 subscribers. The channel's best video ever had 20,000 views; we now have videos with 1.3M, 500K and 400K views in the US, in the fitness vertical.",
      'Social media and customer support: from replying in days to replying in minutes, on every channel and to every comment.',
      'Hired and managed a team of 8, plus freelancers and stakeholders from other areas.',
    ],
  },
  {
    period: '2024 — 2025',
    role: 'Head of SEO · Cliqpod',
    detail:
      'SEO leadership for word.tips and Router Network. I doubled organic traffic at word.tips, with peaks of 2M daily visits and ~60M/mo, 100% organic.',
  },
  {
    period: '2019 — 2024',
    role: 'SEO Specialist → Product Owner → SEO Manager · Softonic',
    detail:
      'Portfolio of 6 sites (Softonic, download.com, CNET…) with 1B+ annual users and a team of 3 specialists. Content program with our own models, before ChatGPT: from 0 to 20M sessions/mo in two years; catalog from 100k to 1M+ pages. +40% YoY (2024 vs 2023).',
  },
  {
    period: '2017 — 2019',
    role: 'SEO Manager · Grupo Planeta',
    detail:
      'SEO for Casa del Libro, Lonely Planet, Planeta DeAgostini and EAE Business School, among other group brands: internal scripts, automated dashboards and a migration framework.',
  },
  {
    period: '2014 — 2017',
    role: 'Agencies · SUMA, Tesubi and SEO Coaching',
    detail: 'SEO, SEM and project leadership for clients like Kids&Us, IESE, Familia Torres, Brompton and Naturgy (then Gas Natural Fenosa).',
  },
],
};

export const projects: Record<Lang, Project[]> = {
  es: [
  {
    name: 'Gradual',
    url: 'https://gradual.pro',
    detail:
      'Mi agencia de IA. Automatizamos procesos de empresas con agentes y sistemas propios, por fases y con el código y los datos en manos del cliente.',
  },
  {
    name: 'Claudegram',
    url: 'https://github.com/NachoSEO/claudegram',
    detail:
      'Bot open source que conecta Telegram con un agente real de Claude Code, con capa de voz. 147★ y 55 forks en GitHub.',
  },
  {
    name: 'Unlimited Sheets',
    url: 'https://unlimitedsheets.com',
    detail: 'Add-on de Google Sheets construido y lanzado en solitario como producto.',
  },
  {
    name: 'seo-scraper',
    url: 'https://github.com/NachoSEO/seo-scraper',
    detail: 'Scraper open source en Node.js para extraer elementos SEO de cualquier web a escala.',
  },
  {
    name: 'google-autocomplete-extractor',
    url: 'https://github.com/NachoSEO/google-autocomplete-extractor',
    detail:
      'Extrae sugerencias de Google interceptando los endpoints del front-end, sin parsear el DOM.',
  },
  {
    name: 'Sitemap Generator',
    url: 'https://sitemapgenerator.xyz/',
    detail: 'Generador de sitemaps XML gratuito.',
  },
  {
    name: 'Programación práctica para SEO',
    url: 'https://nachomascort.gumroad.com/l/programacion-seo',
    detail: 'Mi curso para aprender a programar aplicado al día a día del SEO.',
  },
],
  en: [
  {
    name: 'Gradual',
    url: 'https://gradual.pro',
    detail:
      'My AI agency. We automate business processes with agents and custom systems, in phases, with the code and data owned by the client.',
  },
  {
    name: 'Claudegram',
    url: 'https://github.com/NachoSEO/claudegram',
    detail:
      'Open-source bot bridging Telegram to a real Claude Code agent, with a voice layer. 147★ and 55 forks on GitHub.',
  },
  {
    name: 'Unlimited Sheets',
    url: 'https://unlimitedsheets.com',
    detail: 'Google Sheets add-on, built and shipped solo as a live product.',
  },
  {
    name: 'seo-scraper',
    url: 'https://github.com/NachoSEO/seo-scraper',
    detail: 'Open-source Node.js scraper to extract SEO elements from any site at scale.',
  },
  {
    name: 'google-autocomplete-extractor',
    url: 'https://github.com/NachoSEO/google-autocomplete-extractor',
    detail: "Extracts Google suggestions by intercepting the front-end's endpoints, no DOM parsing.",
  },
  {
    name: 'Sitemap Generator',
    url: 'https://sitemapgenerator.xyz/',
    detail: 'Free XML sitemap generator.',
  },
  {
    name: 'Programación práctica para SEO',
    url: 'https://nachomascort.gumroad.com/l/programacion-seo',
    detail: 'My course (in Spanish) on practical programming for SEO work.',
  },
],
};
