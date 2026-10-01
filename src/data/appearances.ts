/** Docencia, charlas y apariciones en medios. Los títulos de medios van en su idioma original. */

type Localized = { es: string; en: string };

export const teaching: { period: string; school: string; program: Localized; topics: Localized; url: string }[] = [
  {
    period: '2015 — 2024',
    school: 'Universitat Pompeu Fabra',
    program: { es: 'Máster en Buscadores', en: 'Master in Search Engines' },
    topics: { es: 'Link spam y métricas de autoridad', en: 'Link spam and authority metrics' },
    url: 'https://web.archive.org/web/20230130085546/https://www.bsm.upf.edu/es/master-universitario-online-en-buscadores',
  },
  {
    period: '2018 — 2024',
    school: 'Webpositer Academy',
    program: { es: 'Máster SEO', en: 'SEO Master' },
    topics: { es: 'Search Console', en: 'Search Console' },
    url: 'https://www.webpositeracademy.com/master-seo/',
  },
  {
    period: '',
    school: 'BigSEO Academy',
    program: { es: 'Máster SEO', en: 'SEO Master' },
    topics: { es: 'Migraciones web y análisis de logs', en: 'Web migrations and log analysis' },
    url: 'https://romualdfons.com/master-seo-posicionamiento-web/',
  },
  {
    period: '',
    school: 'Wontalia',
    program: { es: 'Cursos online', en: 'Online courses' },
    topics: {
      es: 'Scraper en Python, Google Tag Manager y migraciones web, entre otros',
      en: 'Python scraping, Google Tag Manager and web migrations, among others',
    },
    url: 'https://web.archive.org/web/20200919083321/https://wontalia.com/',
  },
  {
    period: '',
    school: 'Dispara tus visitas',
    program: { es: 'Curso de SEO y monetización de Dean Romero', en: "Dean Romero's SEO and monetisation course" },
    topics: { es: 'Destripando la guía de Quality Raters de Google', en: "Dissecting Google's Quality Raters guidelines" },
    url: 'https://disparatusvisitas.com/',
  },
];

export const talks: { year: string; event: string; title: Localized; url: string }[] = [
  {
    year: '2019',
    event: 'Clinic SEO',
    title: {
      es: 'Procesos, metodologías y automatizaciones SEO en Softonic',
      en: 'SEO processes, methodologies and automations at Softonic',
    },
    url: 'https://speakerdeck.com/nachomascort/procesos-metodologias-y-automatizaciones-seo-en-softonic-clinic-seo',
  },
  {
    year: '2019',
    event: 'SEOnTheBeach',
    title: {
      es: 'Conceptos básicos y aplicaciones prácticas de programación para SEO',
      en: 'Programming for SEO: basic concepts and practical uses',
    },
    url: 'https://www.slideshare.net/NachoMascortSEOSpeci/conceptos-bsicos-y-aplicaciones-prcticas-de-programacin-para-seo',
  },
  {
    year: '2018',
    event: 'Ensalada SEO',
    title: { es: 'Framework SEO para migraciones web exitosas', en: 'An SEO framework for successful web migrations' },
    url: 'https://es.slideshare.net/NachoMascortSEOSpeci/framework-seo-para-migraciones-web-exitosas-ensaladaseo-2018',
  },
  {
    year: '2018',
    event: 'SEOPLUS',
    title: {
      es: 'Scraping avanzado o cómo hacer de internet tu base de datos',
      en: 'Advanced scraping, or how to turn the internet into your database',
    },
    url: 'https://es.slideshare.net/NachoMascortSEOSpeci/scraping-avanzado-o-cmo-hacer-de-internet-tu-base-de-datos-seoplus2018',
  },
];

export type MediaType = 'podcast' | 'video' | 'press' | 'guest-post' | 'interview' | 'mention';

export const mediaTypeLabels: Record<MediaType, Localized> = {
  podcast: { es: 'Podcast', en: 'Podcast' },
  video: { es: 'Vídeo', en: 'Video' },
  press: { es: 'Prensa', en: 'Press' },
  'guest-post': { es: 'Artículo invitado', en: 'Guest post' },
  interview: { es: 'Entrevista', en: 'Interview' },
  mention: { es: 'Mención', en: 'Mention' },
};

/** Idioma del contenido enlazado (por defecto, español) */
export const media: { type: MediaType; outlet: string; title: string; url: string; lang?: 'es' | 'en' }[] = [
  {
    type: 'mention',
    outlet: 'Google Search Central',
    title: 'Search Central Community in 2022',
    lang: 'en',
    url: 'https://developers.google.com/search/blog/2023/03/2022-recap-search-central-community',
  },
  {
    type: 'press',
    outlet: 'El Confidencial',
    title: 'Por qué EEUU (y Google o Amazon) está detrás del ‘gran apagón’ de internet en Irán',
    url: 'https://www.elconfidencial.com/tecnologia/2022-10-08/iran-internet-sanciones-estados-unidos_3502403/',
  },
  {
    type: 'podcast',
    outlet: '10 Links Azules',
    title: '#50 El add-on «definitivo» para Sheets · Categorizando keywords',
    url: 'https://useo.es/10-links-azules/10-links-azules-50/',
  },
  {
    type: 'podcast',
    outlet: '10 Links Azules',
    title: '#13 La última del año',
    url: 'https://useo.es/10-links-azules/10-links-azules-13/',
  },
  {
    type: 'mention',
    outlet: 'Seopatía',
    title: '#96 La URL Inspection API y la Page Experience Update llega a desktop',
    url: 'https://seopatia.estevecastells.com/p/seopatia-96-la-url-inspection-api',
  },
  {
    type: 'video',
    outlet: 'Flat 101',
    title: 'Episodio 13: ¿Se dirige el SEO hacia la automatización?',
    url: 'https://www.flat101.es/video/episodio-13-se-dirige-el-seo-hacia-la-automatizacion/',
  },
  {
    type: 'press',
    outlet: 'Marketing Directo',
    title: '¿Está experimentando el SEO un proceso de automatización?',
    url: 'https://www.marketingdirecto.com/digital-general/digital/esta-experimentando-el-seo-un-proceso-de-automatizacion',
  },
  {
    type: 'press',
    outlet: 'Marketing Directo',
    title: 'Cómo extraer todo su jugo (hasta la última gota) al web scraping',
    url: 'https://www.marketingdirecto.com/digital-general/digital/como-extraer-todo-jugo-hasta-ultima-gota-web-scraping',
  },
  {
    type: 'podcast',
    outlet: 'Conexiones en el búnker',
    title: 'Automatizando en la tercera fase',
    url: 'https://web.archive.org/web/20210119120926/https://www.conexionesbunker.com/automatizando-en-tercera-fase/',
  },
  {
    type: 'podcast',
    outlet: 'HolaSEO',
    title: '#109 Nacho Mascort tiene un script en Python que te despierta y prepara el desayuno',
    url: 'https://open.spotify.com/episode/0BXQrGILB0fI0zpGTEi5W9',
  },
  {
    type: 'guest-post',
    outlet: 'Softonic Engineering (Medium)',
    title: 'Finding SEO opportunities through rising trends & Node.js',
    lang: 'en',
    url: 'https://medium.com/softonic-eng/finding-seo-opportunities-through-rising-trends-node-js-52f483a4d0af',
  },
  {
    type: 'podcast',
    outlet: 'La Máquina del SEO',
    title: '#66 Hacer SEO inhouse en grandes empresas',
    url: 'https://eleven.agency/blog/seo-inhouse-con-nacho-mascort/',
  },
  {
    type: 'podcast',
    outlet: 'La Máquina del SEO',
    title: '#31 Entrevista a Nacho Mascort',
    url: 'https://eleven.agency/blog/entrevista-a-nacho-mascort/',
  },
  {
    type: 'guest-post',
    outlet: 'Blogger3cero',
    title: 'La actualización del algoritmo de Google del 1 de agosto, destripada a fondo',
    url: 'https://web.archive.org/web/20201127224635/https://blogger3cero.com/update-1-de-agosto/',
  },
  {
    type: 'guest-post',
    outlet: 'Blogger3cero',
    title: 'La verdad sobre cómo tener un SEO on page perfecto con múltiples H1 por página',
    url: 'https://web.archive.org/web/20210117071506/https://blogger3cero.com/la-verdad-sobre-como-tener-un-seo-on-page-perfecto-con-multiples-h1-por-pagina/',
  },
  {
    type: 'press',
    outlet: 'Cecarm',
    title: 'SEOnTheBeach 2019. Día 1: la automatización como factor común',
    url: 'https://www.cecarm.com/marketing-online/tendencias/seonthebeach-2019-dia-1-la-automatizacion-como-factor-comun-39669',
  },
  {
    type: 'video',
    outlet: 'Webpositer',
    title: 'SEOPLUS 2018: Scraping avanzado, con Esteve Castells [Grey Hat SEO]',
    url: 'https://www.youtube.com/watch?v=56f9vcI35Xw',
  },
  {
    type: 'video',
    outlet: 'Webpositer Academy',
    title: 'Google Search Console con Nacho Mascort #DoyouSEO',
    url: 'https://www.youtube.com/watch?v=0h8oznjqqQc',
  },
  {
    type: 'press',
    outlet: 'ABC',
    title: 'Alicante reunirá a 1.000 profesionales del marketing digital en el evento SEO más grande de España',
    url: 'https://www.abc.es/espana/comunidad-valenciana/abci-alicante-reunira-1000-profesionales-marketing-digital-evento-mas-grande-espana-201807121049_noticia.html',
  },
  {
    type: 'guest-post',
    outlet: 'Vivir en remoto',
    title: 'Atajos útiles para SEO sin tener que instalar otra extensión de Chrome',
    url: 'https://vivirenremoto.com/atajos-utiles-seo/',
  },
  {
    type: 'podcast',
    outlet: 'CampamentoWeb',
    title: '#29 SEO en Grupo Planeta, casos reales y SEO técnico',
    url: 'https://www.ivoox.com/en/seo-grupo-planeta-casos-reales-seo-audios-mp3_rf_25370122_1.html',
  },
  {
    type: 'interview',
    outlet: 'Mariano Cabrera',
    title: 'Consejos SEO de Nacho Mascort, de Seohacks.es',
    url: 'https://www.marianocabrera.com/consejos-seo-nacho-mascort-seohacks/',
  },
];
