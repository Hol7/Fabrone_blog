import { site } from '../site';
export const GET = () => new Response(JSON.stringify({
  id: '/', name: `${site.name} — le carnet`, short_name: site.name,
  description: site.about, lang: 'fr', start_url: '/', scope: '/', display: 'standalone',
  background_color: '#141414', theme_color: '#141414',
  icons: [192, 512].map((size) => ({ src: `/icons/icon-${size}.png`, sizes: `${size}x${size}`, type: 'image/png', purpose: 'any maskable' })),
}), { headers: { 'Content-Type': 'application/manifest+json' } });
