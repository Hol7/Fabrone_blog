const CACHE = 'fabrone-__VERSION__';
const PRECACHE = __PRECACHE__;
const LIMIT = 100;
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
});
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key.startsWith('fabrone-') && key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});
async function store(request, response) {
  if (!response.ok || response.type === 'opaque' || response.redirected) return;
  try {
    const cache = await caches.open(CACHE);
    await cache.put(request, response.clone());
    const optional = (await cache.keys()).filter((key) => !PRECACHE.includes(new URL(key.url).pathname));
    for (const key of optional.slice(0, Math.max(0, optional.length - LIMIT))) await cache.delete(key);
  } catch { /* Quota atteint : la navigation reste possible. */ }
}
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.search || request.headers.has('range')) return;
  // L'administration, les API et les médias volumineux ne sont jamais mis en cache.
  if (/^\/(keystatic|api|audio|videos)(\/|$)/.test(url.pathname)) return;
  const page = request.mode === 'navigate';
  const asset = /^\/(_astro|fonts|icons|images)\//.test(url.pathname);
  if (!page && !asset) return;
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (!page && cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok) await store(request, response);
      if (page && response.status >= 500 && cached) return cached;
      return response;
    } catch {
      return cached || (page ? await caches.match('/offline') : Response.error());
    }
  })());
});
