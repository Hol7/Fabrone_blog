import type { APIRoute } from 'astro';
import { getPosts } from '../../lib/posts';

export const prerender = false;
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;

// One atomic update returns the totals and this browser's current reaction.
const script = `
redis.call('PFADD', KEYS[1], ARGV[1])
if ARGV[2] == 'view' then redis.call('INCR', KEYS[2]) end
if ARGV[2] == 'like' then redis.call('SADD', KEYS[3], ARGV[1]) end
if ARGV[2] == 'unlike' then redis.call('SREM', KEYS[3], ARGV[1]) end
return {redis.call('PFCOUNT', KEYS[1]), tonumber(redis.call('GET', KEYS[2]) or '0'), redis.call('SCARD', KEYS[3]), redis.call('SISMEMBER', KEYS[3], ARGV[1])}
`;
const localVisitors = new Set<string>();
const localPosts = new Map<string, { views: number; likes: Set<string> }>();
function localCounts(id: string, slug: string, action: string) {
  localVisitors.add(id);
  const post = localPosts.get(slug) ?? { views: 0, likes: new Set<string>() };
  if (action === 'view') post.views++;
  if (action === 'like') post.likes.add(id);
  if (action === 'unlike') post.likes.delete(id);
  if (slug) localPosts.set(slug, post);
  return [localVisitors.size, post.views, post.likes.size, Number(post.likes.has(id))];
}

export const POST: APIRoute = async ({ request, url }) => {
  if (request.headers.get('origin') !== url.origin || !request.headers.get('content-type')?.startsWith('application/json')) return new Response(null, { status: 403 });
  const data = await request.json().catch(() => null);
  if (!data || !uuid.test(data.id) || typeof data.slug !== 'string') return new Response(null, { status: 400 });
  const { id, slug, action } = data;
  if (slug ? !['view', 'like', 'unlike'].includes(action) || !(await getPosts()).some(p => p.id === slug) : action !== 'visit') return new Response(null, { status: 400 });

  let counts: number[];
  if (import.meta.env.DEV) {
    counts = localCounts(id, slug, action);
  } else {
    const endpoint = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
    if (!endpoint || !token) return new Response(null, { status: 503 });
    const key = 'carnet:article:' + slug;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify(['EVAL', script, 3, 'carnet:visitors', key + ':views', key + ':likes', id, action]),
      });
      const { result } = await response.json();
      if (!response.ok || !Array.isArray(result) || result.length !== 4) throw Error();
      counts = result;
    } catch {
      return new Response(null, { status: 503 });
    }
  }
  const [visitors, views, likes, liked] = counts;
  return Response.json({ visitors, views, likes, liked: Boolean(liked) }, { headers: { 'Cache-Control': 'no-store' } });
};
