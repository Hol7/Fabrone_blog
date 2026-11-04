import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root = new URL('../.vercel/output/static/', import.meta.url);
const files = await readdir(root, { recursive: true });
const assets = files.filter((file) => /\.(css|woff2)$/.test(file)).map((file) => `/${file}`);
const home = await readFile(new URL('index.html', root), 'utf8');
const scripts = [...home.matchAll(/src="(\/_astro\/[^"?]+\.js)"/g)].map((match) => match[1]);
const precache = ['/', ...files.filter((file) => file.startsWith('images/avatars/') && file.endsWith('.svg')).map((file) => '/' + file), '/offline', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png', ...assets, ...scripts];
const template = await readFile(new URL('sw-template.js', import.meta.url), 'utf8');
// Toute modification du build renouvelle le cache (y compris le contenu des articles).
const digest = createHash('sha256').update(template);
for (const file of files.filter((file) => file !== 'sw.js' && /\.(html|css|js|json|webmanifest)$/.test(file)).sort()) digest.update(await readFile(new URL(file, root)));
const worker = template.replace('__VERSION__', digest.digest('hex').slice(0, 12)).replace('__PRECACHE__', JSON.stringify(precache));
await writeFile(new URL('sw.js', root), worker);
console.log(`PWA : manifeste, icônes et service worker générés (${precache.length} ressources essentielles).`);
