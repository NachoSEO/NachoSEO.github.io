/** Estudio "A quién recomienda la IA como consultor SEO en España". Datos del geo-tracker propio (proyecto 1).
    Una edición por mes; las cifras de cada edición no se tocan una vez publicadas. */

export type StudyPerson = {
  name: string;
  /** Respuestas SEO (de answers.seo) y GEO (de answers.geo) que nombran a la persona, como mucho una vez por respuesta */
  seo: number;
  geo: number;
  /** Las mismas menciones repartidas por plataforma */
  chatgpt: number;
  aiMode: number;
  aio: number;
  /** Búsquedas que lanza la IA con su nombre o su dominio antes de responder */
  fanouts: number;
  /** Orden medio en que se le nombra dentro de la respuesta (1 = primera persona nombrada) */
  avgPosition: number;
};

export const consultantsStudy = {
  edition: 'Octubre de 2026',
  published: '2026-10-10',
  dateRange: { from: '6 de octubre', to: '10 de octubre de 2026' },
  answers: { total: 768, seo: 384, geo: 192, empty: 35, fanouts: 616 },
  surfaces: { chatgpt: 288, aiMode: 288, aio: 192 },
  entities: {
    seo: [
      'Consultor SEO',
      'Consultor SEO por ciudad',
      'SEO freelance',
      'SEO internacional',
      'Auditoría SEO',
      'SEO técnico y migraciones',
      'Precio de un consultor SEO',
      'Core updates y caídas de tráfico',
    ],
    geo: ['Qué es GEO / SEO para IA', 'Consultor GEO', 'Aparecer en ChatGPT', 'Medir la visibilidad en IA'],
  },
  people: [
    { name: "Aleyda Solís", seo: 99, geo: 12, chatgpt: 39, aiMode: 69, aio: 3, fanouts: 9, avgPosition: 2.2 },
    { name: "Natzir Turrado", seo: 70, geo: 1, chatgpt: 34, aiMode: 34, aio: 3, fanouts: 2, avgPosition: 2.9 },
    { name: "Luis M. Villanueva", seo: 36, geo: 3, chatgpt: 8, aiMode: 31, aio: 0, fanouts: 8, avgPosition: 7.0 },
    { name: "Fernando Maciá", seo: 30, geo: 5, chatgpt: 26, aiMode: 9, aio: 0, fanouts: 14, avgPosition: 6.1 },
    { name: "Juan González Villa", seo: 29, geo: 0, chatgpt: 13, aiMode: 16, aio: 0, fanouts: 1, avgPosition: 4.9 },
    { name: "Lino Uruñuela", seo: 15, geo: 12, chatgpt: 16, aiMode: 11, aio: 0, fanouts: 1, avgPosition: 6.1 },
    { name: "Romuald Fons", seo: 23, geo: 4, chatgpt: 3, aiMode: 18, aio: 6, fanouts: 0, avgPosition: 6.3 },
    { name: "MJ Cachón", seo: 23, geo: 3, chatgpt: 21, aiMode: 5, aio: 0, fanouts: 12, avgPosition: 6.0 },
    { name: "Iñaki Huerta", seo: 25, geo: 0, chatgpt: 1, aiMode: 24, aio: 0, fanouts: 1, avgPosition: 4.2 },
    { name: "Cristofer Cruz", seo: 21, geo: 0, chatgpt: 21, aiMode: 0, aio: 0, fanouts: 0, avgPosition: 5.3 },
    { name: "Esteve Castells", seo: 18, geo: 1, chatgpt: 1, aiMode: 18, aio: 0, fanouts: 0, avgPosition: 3.5 },
    { name: "Mònica Cabaní", seo: 16, geo: 0, chatgpt: 0, aiMode: 16, aio: 0, fanouts: 0, avgPosition: 5.8 },
    { name: "Dean Romero", seo: 15, geo: 0, chatgpt: 4, aiMode: 11, aio: 0, fanouts: 5, avgPosition: 6.4 },
    { name: "Sico de Andrés", seo: 13, geo: 2, chatgpt: 2, aiMode: 13, aio: 0, fanouts: 2, avgPosition: 7.1 },
    { name: "Emilio Rodríguez García", seo: 13, geo: 0, chatgpt: 13, aiMode: 0, aio: 0, fanouts: 0, avgPosition: 3.6 },
    { name: "David Viejo", seo: 12, geo: 0, chatgpt: 2, aiMode: 10, aio: 0, fanouts: 0, avgPosition: 5.8 },
    { name: "Víctor López", seo: 12, geo: 0, chatgpt: 3, aiMode: 9, aio: 0, fanouts: 0, avgPosition: 3.3 },
    { name: "Alejandro Tamargo", seo: 12, geo: 0, chatgpt: 3, aiMode: 9, aio: 0, fanouts: 0, avgPosition: 3.8 },
    { name: "Sergio Lepone", seo: 11, geo: 0, chatgpt: 9, aiMode: 2, aio: 0, fanouts: 0, avgPosition: 3.7 },
    { name: "Chus Naharro", seo: 11, geo: 0, chatgpt: 0, aiMode: 11, aio: 0, fanouts: 0, avgPosition: 5.5 },
  ] satisfies StudyPerson[],
  /** Personas que solo aparecen en respuestas GEO */
  geoOnly: [
    { name: 'José Alvargonzález', geo: 6 },
    { name: 'Javier Santos Criado (Javadex)', geo: 6 },
    { name: 'Sergio Gómez', geo: 5 },
    { name: 'Antonio Díaz', geo: 4 },
  ],
  /** Agencias y marcas nombradas en respuestas GEO */
  geoBrands: [
    { name: 'BigSEO', count: 27 },
    { name: 'iSocialWeb', count: 23 },
    { name: 'Citora', count: 14 },
    { name: 'Human Level', count: 14 },
    { name: 'Profound', count: 14 },
    { name: 'Rodanet', count: 11 },
  ],
  /** Respuestas que citan cada dominio (una vez por respuesta) */
  citedDomains: {
    seo: [
      { domain: 'natzir.com', count: 62 },
      { domain: 'aleydasolis.com', count: 47 },
      { domain: 'whitepress.com', count: 39 },
      { domain: 'developers.google.com', count: 36 },
      { domain: 'youtube.com', count: 35 },
      { domain: 'sortlist.es', count: 28 },
      { domain: 'cristofercruz.net', count: 24 },
      { domain: 'emirodgar.com', count: 22 },
      { domain: 'monicacabani.com', count: 22 },
      { domain: 'malt.es', count: 20 },
    ],
    geo: [
      { domain: 'youtube.com', count: 70 },
      { domain: 'developers.google.com', count: 36 },
      { domain: 'help.openai.com', count: 26 },
      { domain: 'bigseo.com', count: 25 },
      { domain: 'arxiv.org', count: 18 },
      { domain: 'isocialweb.agency', count: 18 },
      { domain: 'iebschool.com', count: 16 },
      { domain: 'ahrefs.com', count: 14 },
      { domain: 'citora.es', count: 14 },
      { domain: 'semrush.com', count: 11 },
    ],
  },
  /** El autor del estudio, fuera del ranking: misma métrica, sin redondear a su favor.
      fanouts null = no medido en esta edición */
  author: {
    name: 'Nacho Mascort',
    seo: 1,
    geo: 0,
    chatgpt: 1,
    aiMode: 0,
    aio: 0,
    fanouts: null,
    avgPosition: 11,
    /** Menciones en todas las respuestas, también growth y control */
    mentionsAll: 2,
    detail: 'Core updates (posición 11) y growth/CMO (posición 8), las dos en ChatGPT el 6 de octubre',
  },
};

/** Evolución del autor edición a edición. Se añade una fila al publicar cada edición y no se reescriben las anteriores. */
export const authorHistory: {
  edition: string;
  answers: number;
  mentionsSeoGeo: number;
  mentionsAll: number;
  platforms: string;
  note: string;
}[] = [
  {
    edition: 'Octubre de 2026 (punto de partida)',
    answers: 768,
    mentionsSeoGeo: 1,
    mentionsAll: 2,
    platforms: 'ChatGPT',
    note: 'Antes de publicar la guía GEO, este estudio y los cambios de Sobre mí.',
  },
];
