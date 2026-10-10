import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', (entry) => entry.data.lang === 'en' && !entry.data.unlisted);
  return rss({
    title: 'Nacho Mascort — Growth, AI & SEO',
    description:
      'Articles on growth, AI applied to marketing, SEO and automation, written from real execution.',
    site: context.site!,
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: `/en/blog/${post.data.slug}/`,
      })),
    customData: '<language>en</language>',
  });
}
