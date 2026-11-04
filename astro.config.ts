import { defineConfig, envField } from 'astro/config';
import { loadEnv } from 'vite';
import { editorEnabled } from './scripts/editor-policy.mjs';
import vercel from '@astrojs/vercel';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';
import { site } from './src/site';
import { unified } from '@astrojs/markdown-remark';
import figures from './src/lib/figures';

const secret = (field: typeof envField.string | typeof envField.number) =>
  field({ context: 'server', access: 'secret', optional: true });

// En développement, le site tourne sous Node (l'admin Keystatic écrit alors dans tes fichiers).
// Le build de production produit les fichiers et fonctions attendus par Vercel.
const dev = process.argv.includes('dev');
const configEnv = { ...loadEnv(dev ? 'development' : 'production', process.cwd(), ''), ...process.env };
const admin = editorEnabled({ dev, env: configEnv, repo: site.repo });

export default defineConfig({
  site: site.url,
  output: 'static', // les pages sont générées à l'avance ; seuls l'admin et l'inscription tournent à la demande
  build: { format: 'file' },
  adapter: dev ? undefined : vercel(),
  integrations: [react(), mdx(), sitemap(), ...(admin ? [keystatic()] : [])],
  server: { host: "127.0.0.1" },
  markdown: {
    processor: unified({ rehypePlugins: [figures] }),
    shikiConfig: { themes: { light: 'vitesse-light', dark: 'vitesse-dark' }, defaultColor: false },
  },
  env: {
    schema: {
      BREVO_API_KEY: secret(envField.string),
      BREVO_LIST_ID: secret(envField.number),
      BREVO_DOI_TEMPLATE_ID: secret(envField.number),
      TURNSTILE_SECRET_KEY: secret(envField.string),
      TURNSTILE_SITE_KEY: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },
});
