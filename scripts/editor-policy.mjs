// Un build public ne fournit aucun éditeur tant que l'authentification n'est pas configurée.
export function editorEnabled({ dev, env, repo }) {
  if (dev) return true;
  if (env.KEYSTATIC_ADMIN_ENABLED !== 'true') return false;
  if (!repo || repo.includes('TON-COMPTE')) throw new Error('Keystatic : renseigne le dépôt GitHub réel dans src/site.ts.');
  for (const name of ['KEYSTATIC_GITHUB_CLIENT_ID', 'KEYSTATIC_GITHUB_CLIENT_SECRET', 'KEYSTATIC_SECRET', 'PUBLIC_KEYSTATIC_GITHUB_APP_SLUG']) {
    if (!env[name]?.trim()) throw new Error(`Keystatic : ${name} est requis pour activer l’éditeur en production.`);
  }
  if (env.KEYSTATIC_SECRET.length < 32) throw new Error('Keystatic : KEYSTATIC_SECRET doit contenir au moins 32 caractères.');
  if (env.PUBLIC_KEYSTATIC_STORAGE === 'local') throw new Error('Keystatic : le stockage local est interdit en production.');
  return true;
}
