/** Orden y agrupación comunes de las colecciones de contenido */
export const byOrder = <T extends { data: { order: number } }>(a: T, b: T) => a.data.order - b.data.order;

export const byDateDesc = <T extends { data: { pubDate: Date } }>(a: T, b: T) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf();

/** Servicios de SEO técnico y GEO (order 1–6): van en el menú, el pie y la home; growth, IA y formación, aparte */
export const isCoreService = (service: { data: { order: number } }) => service.data.order <= 6;
