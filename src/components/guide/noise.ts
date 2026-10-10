/** Ruido de muestreo para el simulador del capítulo 15: semanas medidas con una visibilidad real fija. */

/** Generador pseudoaleatorio con semilla, para que el build pinte siempre la misma simulación inicial */
export const seededRandom = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
  return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
};

/** Porcentaje de respuestas que te mencionan en una semana de n respuestas, si la visibilidad real es p */
export const sampleWeek = (p: number, n: number, random: () => number) => {
  let hits = 0;
  for (let index = 0; index < n; index += 1) if (random() < p) hits += 1;
  return hits / n;
};

/** Margen de error al 95 % de una proporción p medida sobre n respuestas */
export const marginOfError = (p: number, n: number) => 1.96 * Math.sqrt((p * (1 - p)) / n);

export const simulateWeeks = (p: number, n: number, weeks: number, random: () => number) =>
  Array.from({ length: weeks }, () => sampleWeek(p, n, random));
