/**
 * Expansor de Google Autocomplete (Cloudflare Pages Function): GET /api/autocomplete?q=seo&hl=es&gl=es&mode=alphabet
 * Pide las sugerencias de la semilla con cada modificador del modo (letras, preguntas o preposiciones) en una sola
 * invocación. El endpoint no es oficial: se cachea un día por semilla para no repetir peticiones a Google.
 */
import { isForeignOrigin } from '../../src/lib/form-guard';
import { FETCH_TIMEOUT_MS, json, LOOP_HEADER } from '../../src/lib/safe-fetch';

type Mode = 'alphabet' | 'questions' | 'prepositions';

const LETTERS = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
const MODIFIERS: Record<Mode, Record<'es' | 'en', { words: string[]; before: boolean }>> = {
  alphabet: { es: { words: [...LETTERS, 'ñ'], before: false }, en: { words: LETTERS, before: false } },
  questions: {
    es: { words: ['qué', 'cómo', 'cuál', 'cuánto', 'cuándo', 'dónde', 'por qué', 'para qué', 'quién', 'es', 'se puede', 'mejor'], before: true },
    en: { words: ['what', 'how', 'which', 'how much', 'when', 'where', 'why', 'who', 'is', 'can', 'does', 'best'], before: true },
  },
  prepositions: {
    es: { words: ['para', 'con', 'sin', 'de', 'en', 'vs', 'o', 'como', 'gratis', 'precio', 'opiniones', 'cerca'], before: false },
    en: { words: ['for', 'with', 'without', 'vs', 'or', 'like', 'near', 'to', 'free', 'price', 'reviews', 'alternatives'], before: false },
  },
};

const LANGS = new Set(['es', 'en', 'pt', 'fr', 'it', 'de', 'ca']);
const COUNTRIES = new Set(['es', 'mx', 'ar', 'co', 'cl', 'pe', 'us', 'gb', 'ie', 'au', 'ca', 'br', 'pt', 'fr', 'it', 'de']);
const CONCURRENCY = 8;
const CACHE_SECONDS = 86_400;

interface Suggestion {
  text: string;
  modifier: string;
}

const suggest = async (query: string, hl: string, gl: string) => {
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&ie=utf-8&oe=utf-8&hl=${hl}&gl=${gl}&q=${encodeURIComponent(query)}`;
  const response = await fetch(url, { headers: { [LOOP_HEADER]: '1', 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (response.status === 429 || response.status === 403) throw new Error('throttled');
  if (!response.ok) throw new Error('upstream');
  const data = await response.json();
  return Array.isArray(data?.[1]) ? (data[1] as unknown[]).filter((item): item is string => typeof item === 'string') : [];
};

export const onRequestGet = async ({ request, waitUntil }: { request: Request; waitUntil: (promise: Promise<unknown>) => void }) => {
  if (request.headers.has(LOOP_HEADER)) return json({ error: 'loop' }, 508);
  if (isForeignOrigin(request)) return json({ error: 'forbidden' }, 403);
  const params = new URL(request.url).searchParams;
  const seed = (params.get('q') ?? '').trim().toLowerCase().replace(/\s+/g, ' ').slice(0, 80);
  const hl = (params.get('hl') ?? 'es').toLowerCase();
  const gl = (params.get('gl') ?? 'es').toLowerCase();
  const mode = (params.get('mode') ?? 'alphabet') as Mode;
  if (!seed || !LANGS.has(hl) || !COUNTRIES.has(gl) || !(mode in MODIFIERS)) return json({ error: 'invalid-params' }, 400);

  // Clave de caché normalizada: la misma semilla en otra mayúscula o con espacios de más reutiliza el resultado
  const cacheKey = new Request(`https://cache.nachomascort.com/autocomplete?q=${encodeURIComponent(seed)}&hl=${hl}&gl=${gl}&mode=${mode}`);
  const cache = (caches as unknown as { default: Cache }).default;
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const { words, before } = MODIFIERS[mode][hl === 'es' ? 'es' : 'en'];
  const queries = [{ query: seed, modifier: '' }, ...words.map((word) => ({ query: before ? `${word} ${seed}` : `${seed} ${word}`, modifier: word }))];
  const seen = new Set<string>();
  const suggestions: Suggestion[] = [];
  let failed = 0;
  let throttled = false;
  let next = 0;
  const worker = async () => {
    while (next < queries.length) {
      const { query, modifier } = queries[next++];
      try {
        for (const text of await suggest(query, hl, gl)) {
          const key = text.toLowerCase();
          if (seen.has(key)) continue;
          seen.add(key);
          suggestions.push({ text, modifier });
        }
      } catch (error) {
        failed++;
        if (error instanceof Error && error.message === 'throttled') throttled = true;
      }
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  if (suggestions.length === 0 && (throttled || failed === queries.length)) return json({ error: throttled ? 'throttled' : 'upstream' }, 503);
  const response = json({ seed, hl, gl, mode, queries: queries.length, failed, suggestions });
  // Solo se cachea si salió entero
  if (failed === 0) {
    const toCache = new Response(response.clone().body, response);
    toCache.headers.set('Cache-Control', `public, max-age=${CACHE_SECONDS}`);
    waitUntil(cache.put(cacheKey, toCache));
  }
  return response;
};
