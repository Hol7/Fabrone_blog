import { getCollection, type CollectionEntry } from 'astro:content';
import { comparePosts } from './post-order';
export type Post = CollectionEntry<'posts'>;
export type Language = 'fr' | 'en';
export async function getPosts(language?: Language) {
  const posts = await getCollection('posts', (p) => (import.meta.env.DEV || !p.data.draft) && (!language || p.data.language === language));
  const translations = new Set<string>();
  for (const post of posts) {
    const key = post.data.translationKey?.trim();
    if (!key) continue;
    const pair = `${key}:${post.data.language}`;
    if (translations.has(pair)) throw new Error(`Traduction en double : ${pair}. Utilise un identifiant unique par paire FR/EN.`);
    translations.add(pair);
  }
  return posts.sort(comparePosts);
}
export const fmtDate = (d: Date, language: Language = 'fr') => d.toLocaleDateString(language === 'en' ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const readingTime = (p: Post) => Math.max(1, Math.round((p.body ?? '').split(/\s+/).length / 220));
export const photo = (url: string, width: number) => url.includes('images.unsplash.com') ? `${url.split('?')[0]}?w=${width}&q=70&auto=format&fit=crop` : url;
