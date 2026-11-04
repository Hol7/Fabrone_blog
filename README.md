# Carnet

Blog en Astro, avec l'admin Keystatic, hébergé sur Cloudflare, newsletter par Brevo.
Les pages sont générées à l'avance : rapide, sans base de données, rien à maintenir.

## En local

```bash
npm install
npm run dev
```

- Le site : http://localhost:4321
- L'admin : http://localhost:4321/keystatic. En local, il enregistre directement dans `src/content/posts` et `public/`.

Le projet contient 7 articles d'exemple (programmation, cybersécurité, voyage, audio). Garde `bienvenue`, réécris-le à ta voix, et supprime les autres quand tu as les tiens : supprime leur fichier dans `src/content/posts`, ou depuis l'admin.

## Écrire un article

Dans l'admin, Articles, Add :

- **Titre, résumé, date, rubrique.** Le résumé s'affiche sous le titre et dans les listes.
- **Image de couverture (lien).** Colle le lien direct d'une image en ligne. Pour Unsplash, c'est le lien qui commence par `https://images.unsplash.com/photo-…` (clic droit sur la photo, copier l'adresse de l'image). Le site demande lui-même la bonne taille.
- **Description de l'image et crédit.** La description est lue par les lecteurs d'écran ; le crédit s'affiche sous la photo.
- **Audio.** Choisis un fichier mp3 : un lecteur s'affiche sous le titre.
- **Brouillon.** Coché, l'article n'apparaît qu'en local.
- **Contenu.** Titres, listes, citations, code. Le bouton image envoie un fichier dans le dépôt. Pour une image en ligne dans le texte, écris `![description](lien "Légende")`.

Les titres de niveau 2 forment le sommaire de l'article.

Une image en ligne peut disparaître si son propriétaire la retire. Pour les images qui comptent, télécharge-les dans `public/images/posts` et pointe vers `/images/posts/nom.jpg`.

## Personnaliser

- `src/site.ts` : nom, domaine (`url`), dépôt GitHub (`repo`), rubriques, liens comme ton YouTube.
- Haut de `src/styles/global.css` : couleurs et polices.

## Newsletter (Brevo)

1. Dans Brevo, crée une liste de contacts et note son numéro.
2. Crée une clé API (SMTP et API, puis Clés API).
3. Copie `.env.example` en `.env` et remplis `BREVO_API_KEY` et `BREVO_LIST_ID`.

Pour que chaque abonné confirme son adresse par e-mail (recommandé), crée dans Brevo un modèle de confirmation (double opt-in) et mets son numéro dans `BREVO_DOI_TEMPLATE_ID`. Tes abonnés se consultent dans Brevo, rubrique Contacts.

### Anti-robot (Turnstile)

Sans protection, quelqu'un peut inscrire l'adresse d'une autre personne en boucle et lui faire envoyer des e-mails de confirmation. Turnstile l'empêche.

1. Dans Cloudflare, rubrique Turnstile, ajoute un widget pour ton domaine.
2. Mets la clé du site dans `TURNSTILE_SITE_KEY` et la clé secrète dans `TURNSTILE_SECRET_KEY`.

`TURNSTILE_SITE_KEY` est lue au moment du build : sur Cloudflare, ajoute-la aussi dans les variables de build, pas seulement dans celles du Worker. Sans ces deux clés, le contrôle est désactivé.

## Déployer sur Cloudflare

1. Mets le projet sur GitHub, puis renseigne `repo` et `url` dans `src/site.ts`.
2. Dans Cloudflare : Workers et Pages, Create, puis importe le dépôt. Commande de build : `npm run build`. Commande de déploiement : `npx wrangler deploy`.
3. Ajoute les variables (Brevo et Turnstile) dans les réglages du Worker.

### Admin en production : fermé par défaut

Le build n’inclut ni `/keystatic` ni `/api/keystatic/*` tant que `KEYSTATIC_ADMIN_ENABLED` n’est pas `true`. Ces URL renvoient alors 404. Tu peux continuer à rédiger en local et déployer le site.

Pour activer volontairement l’éditeur en ligne :

1. Configure le vrai dépôt dans `src/site.ts`.
2. Lance en local `PUBLIC_KEYSTATIC_STORAGE=github npm run dev` et ouvre `/keystatic` pour configurer l’application GitHub.
3. Ajoute dans l’app GitHub le callback `https://ton-domaine/api/keystatic/github/oauth/callback`.
4. Configure `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` (au moins 32 caractères) et `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` dans l’environnement de build et dans le Worker.
5. Ajoute `KEYSTATIC_ADMIN_ENABLED=true` au build, puis reconstruis/déploie. Une configuration incomplète fait échouer le build.
6. Vérifie avant utilisation réelle : visite anonyme, compte sans droit d’écriture, puis ton compte autorisé. L’authentification réelle ne peut être testée qu’une fois ton application GitHub configurée.

Connaître l’URL n’accorde aucun droit d’écriture. Le mode GitHub exige une connexion à un compte avec accès en écriture au dépôt. Ne publie jamais le serveur `npm run dev` sur Internet : le mode local écrit sur ton ordinateur sans écran de connexion. Il écoute par défaut sur `127.0.0.1`.

Référence : https://keystatic.com/docs/github-mode

## Statistiques

Active Web Analytics pour ton domaine dans Cloudflare. Elles comptent les visites ; la liste des abonnés se lit dans Brevo.

## Version Fabrone

Le thème reprend le fond charbon, les accents orange et la colonne centrée de Fabrone.
Le nom, la présentation, le domaine et le dépôt se règlent dans `src/site.ts`.
Les articles de démonstration sont conservés : remplace-les par tes textes avant publication.

### Ajouter une vidéo
Dans `/keystatic`, renseigne le champ **Vidéo** avec un lien YouTube, Vimeo public, ou un lien HTTPS direct MP4/WebM. Le lecteur apparaît dans l’article. Le champ est facultatif.
Pour placer plusieurs vidéos au milieu du texte en éditant le MDX, importe `Video` depuis `../../components/Video.astro`, puis ajoute `<Video url="https://…" title="Description" />`.

### Où mettre les clés
Copie `.env.example` en `.env`, à la racine du projet, près de `package.json`. Renseigne `BREVO_API_KEY` et `BREVO_LIST_ID`. `BREVO_DOI_TEMPLATE_ID` est facultatif. Redémarre le serveur après modification. Aucune clé Sanity n’est nécessaire.
En production, configure ces mêmes secrets dans le Worker Cloudflare ; le fichier `.env` reste sur ton ordinateur.
L’inscription à la newsletter ajoute les contacts à Brevo ; elle n’envoie pas automatiquement tes nouveaux articles. Les campagnes se préparent dans Brevo.

## Écrire, médias et profil

Consulte `GUIDE-REDIGER.md`. Un brouillon `exemples-multimedia` montre image, GIF, code, audio, vidéo, graphique, lien et emoji. Dans Keystatic, **Mon profil** permet de modifier la présentation et les liens.

## PWA

Le build génère le service worker après Astro. Utilise `npm run build` (et non `astro build` seul), puis `npm run preview` pour tester la production. La page `/installer` explique l’installation et les limites hors connexion. Le service worker est désactivé en développement.
