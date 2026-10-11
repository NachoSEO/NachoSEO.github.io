import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

type TranslatableCollection = 'blog' | 'services' | 'caseStudies';

/** getStaticPaths de las fichas en un idioma, con el slug de su traducción (por translationKey) para el hreflang */
export async function translatedPaths<C extends TranslatableCollection>(collection: C, lang: Lang) {
  const entries = (await getCollection(collection)) as CollectionEntry<TranslatableCollection>[];
  const translationSlugs = new Map(
    entries.filter((entry) => entry.data.lang !== lang).map((entry) => [entry.data.translationKey, entry.data.slug])
  );
  return entries
    .filter((entry) => entry.data.lang === lang)
    .map((entry) => ({
      params: { slug: entry.data.slug },
      props: { entry: entry as CollectionEntry<C>, translationSlug: translationSlugs.get(entry.data.translationKey) },
    }));
}
