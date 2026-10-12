/** Estudio "A quién recomienda la IA como consultor SEO en España".
    Edición actual: LLM Pulse (proyecto 3944), cinco plataformas. La primera medición (6-10 oct, geo-tracker propio,
    tres plataformas) se conserva tal cual en `firstMeasurement`: las cifras publicadas no se reescriben. */

/** Fila de la primera medición (geo-tracker): tres plataformas */
export type TrackerPerson = {
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

/** Primera medición, publicada el 10 de octubre de 2026. No se toca. */
export const firstMeasurement = {
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
  ] satisfies TrackerPerson[],
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

/** Fila de la medición con LLM Pulse: cinco plataformas */
export type StudyPerson = TrackerPerson & { perplexity: number; gemini: number };

/** Medición actual: LLM Pulse, una respuesta por pregunta y plataforma. Las 36 preguntas SEO y GEO son las mismas,
    con la misma redacción, que en la primera medición. */
export const consultantsStudy = {
  edition: 'Octubre de 2026 (2.ª medición)',
  published: '2026-10-10',
  updated: '2026-10-12',
  tool: 'LLM Pulse',
  dateRange: { from: '12 de octubre', to: '12 de octubre de 2026' },
  /** empty = respuestas que no nombran a ninguna persona */
  answers: { total: 179, seo: 119, geo: 60, empty: 71, fanouts: 108 },
  surfaces: { chatgpt: 36, aiMode: 36, aio: 35, perplexity: 36, gemini: 36 },
  /** Respuestas que nombran al menos a una persona, por plataforma */
  surfacesWithPeople: { chatgpt: 24, aiMode: 22, aio: 23, perplexity: 15, gemini: 24 },
  entities: firstMeasurement.entities,
  people: [
    { name: "Aleyda Solís", seo: 45, geo: 7, chatgpt: 8, aiMode: 10, aio: 14, perplexity: 8, gemini: 12, fanouts: 2, avgPosition: 1.6 },
    { name: "Natzir Turrado", seo: 37, geo: 1, chatgpt: 6, aiMode: 5, aio: 9, perplexity: 3, gemini: 15, fanouts: 0, avgPosition: 1.7 },
    { name: "Lino Uruñuela", seo: 18, geo: 8, chatgpt: 1, aiMode: 4, aio: 14, perplexity: 1, gemini: 6, fanouts: 0, avgPosition: 2.5 },
    { name: "MJ Cachón", seo: 20, geo: 6, chatgpt: 4, aiMode: 1, aio: 2, perplexity: 4, gemini: 15, fanouts: 0, avgPosition: 3.2 },
    { name: "Fernando Maciá", seo: 21, geo: 4, chatgpt: 7, aiMode: 2, aio: 3, perplexity: 0, gemini: 13, fanouts: 0, avgPosition: 3.4 },
    { name: "Juan González Villa", seo: 22, geo: 1, chatgpt: 3, aiMode: 3, aio: 8, perplexity: 2, gemini: 7, fanouts: 0, avgPosition: 3.7 },
    { name: "Luis M. Villanueva", seo: 10, geo: 3, chatgpt: 1, aiMode: 4, aio: 1, perplexity: 1, gemini: 6, fanouts: 0, avgPosition: 3.6 },
    { name: "Iñaki Huerta", seo: 12, geo: 1, chatgpt: 0, aiMode: 5, aio: 2, perplexity: 3, gemini: 3, fanouts: 0, avgPosition: 3.8 },
    { name: "David Viejo", seo: 12, geo: 0, chatgpt: 0, aiMode: 2, aio: 5, perplexity: 2, gemini: 3, fanouts: 0, avgPosition: 3.4 },
    { name: "Romuald Fons", seo: 9, geo: 3, chatgpt: 1, aiMode: 6, aio: 3, perplexity: 0, gemini: 2, fanouts: 0, avgPosition: 3.4 },
    { name: "Álvaro Peña", seo: 5, geo: 4, chatgpt: 0, aiMode: 0, aio: 4, perplexity: 0, gemini: 5, fanouts: 0, avgPosition: 3.7 },
    { name: "David Ayala", seo: 3, geo: 2, chatgpt: 1, aiMode: 0, aio: 2, perplexity: 1, gemini: 1, fanouts: 0, avgPosition: 4.4 },
    { name: "Cristofer Cruz", seo: 5, geo: 0, chatgpt: 5, aiMode: 0, aio: 0, perplexity: 0, gemini: 0, fanouts: 0, avgPosition: 3.2 },
    { name: "Daniel Pinillos", seo: 4, geo: 1, chatgpt: 1, aiMode: 2, aio: 1, perplexity: 0, gemini: 1, fanouts: 0, avgPosition: 3.4 },
    { name: "Sico de Andrés", seo: 4, geo: 0, chatgpt: 0, aiMode: 2, aio: 2, perplexity: 0, gemini: 0, fanouts: 0, avgPosition: 4.5 },
    { name: "Lakil Essady", seo: 3, geo: 1, chatgpt: 0, aiMode: 0, aio: 0, perplexity: 0, gemini: 4, fanouts: 0, avgPosition: 4.2 },
    { name: "Víctor López", seo: 4, geo: 0, chatgpt: 1, aiMode: 2, aio: 1, perplexity: 0, gemini: 0, fanouts: 0, avgPosition: 3.2 },
    { name: "Alejandro Tamargo", seo: 4, geo: 0, chatgpt: 2, aiMode: 2, aio: 0, perplexity: 0, gemini: 0, fanouts: 0, avgPosition: 2.8 },
    { name: "Víctor Pérez Vas", seo: 4, geo: 0, chatgpt: 0, aiMode: 0, aio: 0, perplexity: 0, gemini: 4, fanouts: 0, avgPosition: 4.0 },
    { name: "Sergio Lepone", seo: 3, geo: 1, chatgpt: 0, aiMode: 1, aio: 0, perplexity: 3, gemini: 0, fanouts: 0, avgPosition: 1.0 }
  ] satisfies StudyPerson[],
  /** Personas que solo aparecen en respuestas GEO (2 o más) */
  geoOnly: [
    { name: 'Sebastián Álvarez', geo: 3 },
    { name: 'José Alvargonzález', geo: 2 },
  ],
  /** Agencias, consultoras y herramientas nombradas en respuestas GEO */
  geoBrands: [
    { name: 'iSocialWeb', count: 10 },
    { name: 'Human Level', count: 6 },
    { name: 'Ahrefs', count: 6 },
    { name: 'BigSEO', count: 5 },
    { name: 'Orainti', count: 5 },
    { name: 'Profound', count: 5 },
  ],
  /** Respuestas que citan cada dominio registrable (una vez por respuesta; developers.google.com cuenta como google.com) */
  citedDomains: {
    seo: [
      { domain: 'natzir.com', count: 35 },
      { domain: 'davidviejo.com', count: 20 },
      { domain: 'soymanugomez.com', count: 16 },
      { domain: 'whitepress.com', count: 15 },
      { domain: 'xaviercastellnou.es', count: 14 },
      { domain: 'mecagoenlos.com', count: 14 },
      { domain: 'jonathanva.com', count: 10 },
      { domain: 'alejandrotamargo.com', count: 10 },
      { domain: 'peterlead.com', count: 9 },
      { domain: 'monicacabani.com', count: 9 },
    ],
    geo: [
      { domain: 'openai.com', count: 11 },
      { domain: 'youtube.com', count: 9 },
      { domain: 'crecerank.com', count: 9 },
      { domain: 'google.com', count: 8 },
      { domain: 'isocialweb.agency', count: 7 },
      { domain: 'bigseo.com', count: 5 },
      { domain: 'mecagoenlos.com', count: 5 },
      { domain: 'semrush.com', count: 5 },
      { domain: 'josealvargonzalez.es', count: 5 },
      { domain: 'c6n.eu', count: 4 },
    ],
  },
  /** El autor del estudio, fuera del ranking: misma métrica, sin redondear a su favor */
  author: {
    name: 'Nacho Mascort',
    seo: 2,
    geo: 0,
    chatgpt: 0,
    aiMode: 0,
    aio: 0,
    perplexity: 0,
    gemini: 2,
    fanouts: 0 as number | null,
    avgPosition: 3.5,
    /** Menciones en todas las respuestas sin su nombre en la pregunta (335), también growth, IA y control */
    mentionsAll: 2,
    answersAll: 335,
    detail: 'Dos preguntas de auditoría SEO (posiciones 3 y 4), las dos en Gemini el 12 de octubre',
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
  {
    edition: 'Octubre de 2026 (2.ª medición, LLM Pulse)',
    answers: 335,
    mentionsSeoGeo: 2,
    mentionsAll: 2,
    platforms: 'Gemini',
    note: 'Cambio a LLM Pulse: cinco plataformas y una respuesta por pregunta. Las dos menciones, en auditoría SEO.',
  },
];
