/**
 * Clustering léxico de keywords en el navegador: sin modelos ni servidor.
 * Cada keyword se reduce a su conjunto de raíces (sin tildes, stopwords ni plurales) y se agrupa con la cabeza
 * del primer grupo que se le parezca lo suficiente (similitud de Jaccard).
 */

const STOPWORDS = new Set(
  (
    'a al ante con contra de del desde el en entre es hacia hasta la las le lo los mas mi o para pero por que se sin sobre su sus tu un una uno unos unas y ya como cual cuál ' +
    'a an and are as at be by for from how i in is it of on or the to vs what when where which who why with your you'
  ).split(' ')
);

const stripAccents = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Plurales y poco más: suficiente para juntar "zapatilla"/"zapatillas" o "shoe"/"shoes" sin destrozar palabras */
const stem = (word: string) => {
  if (word.length > 5 && word.endsWith('es') && !/[aeiou]es$/.test(word.slice(-3))) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
};

export const keywordTokens = (keyword: string) => {
  const words = stripAccents(keyword.toLowerCase()).split(/[^a-z0-9ñ]+/).filter(Boolean);
  const meaningful = words.filter((word) => !STOPWORDS.has(word));
  return [...new Set((meaningful.length ? meaningful : words).map(stem))].sort();
};

const jaccard = (a: string[], b: string[]) => {
  if (!a.length || !b.length) return 0;
  const setB = new Set(b);
  const shared = a.filter((token) => setB.has(token)).length;
  return shared / (a.length + b.length - shared);
};

export interface KeywordInput {
  keyword: string;
  volume: number | null;
}

export interface Cluster {
  name: string;
  keywords: KeywordInput[];
  volume: number;
}

/** "keyword" o "keyword,volumen" (también con tabulador o punto y coma) */
export const parseKeywords = (text: string): KeywordInput[] => {
  const seen = new Set<string>();
  return text
    .split('\n')
    .map((line) => {
      const match = line.match(/^(.*?)[\t;,]\s*([\d.,\s]+)\s*$/);
      const keyword = (match ? match[1] : line).trim().replace(/^"|"$/g, '');
      const volume = match ? Number(match[2].replace(/[.,\s]/g, '')) : null;
      return { keyword, volume: Number.isFinite(volume) ? volume : null };
    })
    .filter((item) => {
      const key = item.keyword.toLowerCase();
      if (!item.keyword || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

/** Una palabra que sale en más de la mitad de la lista (la semilla, casi siempre) no sirve para separar temas */
const COMMON_SHARE = 0.5;
const MIN_ITEMS_FOR_COMMON = 10;

export const clusterKeywords = (items: KeywordInput[], threshold: number): Cluster[] => {
  const allTokens = items.map((item) => keywordTokens(item.keyword));
  const frequency = new Map<string, number>();
  for (const tokens of allTokens) for (const token of tokens) frequency.set(token, (frequency.get(token) ?? 0) + 1);
  const isCommon = (token: string) => items.length >= MIN_ITEMS_FOR_COMMON && frequency.get(token)! / items.length > COMMON_SHARE;

  // Primero las keywords con las mismas raíces en cualquier orden ("descargar adobe" = "adobe descargar")
  const exact = new Map<string, { tokens: string[]; items: KeywordInput[] }>();
  for (const [index, item] of items.entries()) {
    const distinctive = allTokens[index].filter((token) => !isCommon(token));
    const tokens = distinctive.length ? distinctive : allTokens[index];
    const key = tokens.join(' ');
    const group = exact.get(key) ?? { tokens, items: [] };
    group.items.push(item);
    exact.set(key, group);
  }
  const groupVolume = (group: { items: KeywordInput[] }) => group.items.reduce((sum, item) => sum + (item.volume ?? 0), 0);
  // Los grupos grandes, con más volumen y más cortos hacen de cabeza: son los temas más generales
  const groups = [...exact.values()].sort(
    (a, b) => groupVolume(b) - groupVolume(a) || b.items.length - a.items.length || a.tokens.length - b.tokens.length
  );

  const clusters: { head: string[]; items: KeywordInput[] }[] = [];
  for (const group of groups) {
    const target = clusters.find((cluster) => jaccard(cluster.head, group.tokens) >= threshold);
    if (target) target.items.push(...group.items);
    else clusters.push({ head: group.tokens, items: [...group.items] });
  }

  return clusters
    .map((cluster) => {
      const keywords = [...cluster.items].sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0) || a.keyword.length - b.keyword.length);
      return { name: keywords[0].keyword, keywords, volume: keywords.reduce((sum, item) => sum + (item.volume ?? 0), 0) };
    })
    .sort((a, b) => b.volume - a.volume || b.keywords.length - a.keywords.length);
};
