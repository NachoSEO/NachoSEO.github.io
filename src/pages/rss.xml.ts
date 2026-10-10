import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', (entry) => entry.data.lang === 'es' && !entry.data.unlisted);
  return rss({
    title: 'Nacho Mascort — Growth, IA y SEO',
    description:
      'Artículos sobre growth, IA aplicada a marketing, SEO y automatización, escritos desde la ejecución real.',
    site: context.site!,
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: `/blog/${post.data.slug}/`,
      })),
    customData: '<language>es-ES</language>',
  });
}
