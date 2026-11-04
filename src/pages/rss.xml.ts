import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../lib/posts';
import { site } from '../site';

export async function GET(context: APIContext) {
  return rss({
    title: site.name,
    description: site.about,
    site: context.site!,
    customData: '<language>fr</language>',
    items: (await getPosts('fr')).map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: `/articles/${p.id}`,
    })),
  });
}
