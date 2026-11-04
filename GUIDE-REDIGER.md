# Écrire avec Keystatic

Keystatic est le tableau de bord de ton blog. Il enregistre les articles dans `src/content/posts` et les fichiers envoyés dans `public`. Il ne nécessite pas de compte Sanity.

## Premier article

1. Lance `npm run dev` dans le projet, puis ouvre `http://localhost:4321/keystatic`.
2. Dans **Articles**, clique **Add**.
3. Remplis **Titre**, **Résumé**, **Date**, **Rubrique**. Le **Slug** est l’adresse courte de l’article ; évite de le changer après publication.
4. Coche **Brouillon** pendant que tu écris.
5. Rédige dans **Contenu**. La barre d’outils et la touche `/` permettent d’ajouter titres, listes, images, citations, tableaux et blocs de code.
6. Clique **Create** (nouvel article) ou **Save** (article existant).
7. Ouvre `/articles/ton-slug` sur ton site local pour voir le rendu.
8. Décoche **Brouillon**, enregistre puis déploie pour le rendre public.

Les brouillons sont visibles uniquement dans le serveur de développement. Ils ne sont pas générés dans le site de production.

## Essayer tous les formats

Ouvre l’article **Mon atelier : images, GIF, audio, vidéo et code** dans Keystatic. Il est déjà rempli et reste en brouillon. Aperçu local : `/articles/exemples-multimedia`.

| Tu veux ajouter… | Dans Keystatic |
| --- | --- |
| Une image ou un GIF animé | Dans Contenu : Image, choisir le fichier, saisir la description |
| Une image de couverture | Champ Image de couverture : URL complète ou chemin d’une image déjà dans public ; pour téléverser une image, utiliser Image dans Contenu |
| Un MP3 | Audio : Choose file |
| Une vidéo MP4/WebM | Fichier vidéo : Choose file |
| Une vidéo YouTube/Vimeo publique | Vidéo : coller l’URL ; laisser Fichier vidéo vide |
| Du code | Dans Contenu : Code block ; choisir le langage puis coller le code |
| Un graphique en barres | Titre du graphique, puis ajouter des lignes Libellé + Valeur |
| Un autre graphique/schéma | Exporter en PNG/SVG et insérer comme une image |
| Un lien GitHub | Ajouter un lien dans le texte ; cela n’affiche pas automatiquement le code du dépôt |
| Un emoji | Le saisir/coller directement dans le texte |

Le fichier audio, la vidéo et le graphique renseignés dans le formulaire ont une position fixe dans l’article. Pour composer librement plusieurs lecteurs au milieu du texte, le MDX permet des composants ; leur édition visuelle nécessite une configuration complémentaire. Les images, GIF, liens, tableaux et blocs de code peuvent déjà être placés librement depuis l’éditeur.

Les longs fichiers vidéo/audio alourdissent le dépôt : pour ces contenus, privilégie un lien vers un hébergement spécialisé. Une vidéo privée ou interdite à l’intégration peut ne pas être lisible dans le blog.

## Profil

Dans Keystatic, ouvre **Mon profil** : nom, sous-titre, présentation, GitHub, LinkedIn et e-mail public. Les liens renseignés apparaissent dans l’en-tête et dans À propos. Les champs vides ne créent pas de faux liens.

## En ligne

En local, les changements sont écrits sur ton ordinateur. En production, le projet utilise le stockage GitHub de Keystatic : il faut configurer ton dépôt et l’application GitHub, puis relier le déploiement Vercel. Voir README. Enregistrer un article ne crée pas une campagne Brevo automatiquement.

## PWA

`npm run build` produit le manifeste, les icônes et le service worker. `npm run preview` permet de tester la version de production. Le service worker n’est pas activé par `npm run dev` pour éviter de conserver des brouillons dans le cache. La production doit être en HTTPS ; localhost est autorisé pour les essais.

La page `/installer` explique l’installation. Les articles consultés sont enregistrés pour la lecture hors connexion. Les vidéos, l’audio, les contenus externes, l’éditeur et les API ne sont pas disponibles hors ligne. Il n’y a pas de notification push.

## Supprimer et réordonner

- Ouvre un article dans Keystatic, puis **Delete entry…** (sur un petit écran, dans le menu `…`). Cette action supprime l’article ; conserve une sauvegarde ou un historique Git si tu veux pouvoir le récupérer. Pour simplement le masquer, coche **Brouillon**.
- Le champ **Position dans la liste** contrôle l’ordre du blog : `1`, `2`, `3`… Les articles à `0` viennent ensuite, du plus récent au plus ancien. Cela ne change pas nécessairement le tri visuel du tableau de bord Keystatic.

## Français et anglais

Un article peut être uniquement français, uniquement anglais, ou avoir les deux versions. Le texte n’est pas traduit automatiquement.

1. Rédige la version française, choisis **Français** dans **Langue de l’article**.
2. Mets par exemple `mon-premier-voyage` dans **Identifiant de traduction**.
3. Crée un autre article avec un titre et un contenu en anglais, choisis **English**, puis remets exactement `mon-premier-voyage` dans **Identifiant de traduction**.
4. Chaque version a son propre slug (adresse) et son propre statut de brouillon.
5. Quand les deux versions sont accessibles, le lien de langue apparaît au-dessus du titre. Un brouillon n’est jamais proposé sur le site publié.

Deux brouillons d’exemple, `exemple-bilingue-fr` et `exemple-bilingue-en`, montrent ce fonctionnement. Les articles anglais sont regroupés dans `/en/articles`, les français dans `/articles`. Une seule version par langue est autorisée pour chaque identifiant de traduction.

Si tu n’écris qu’en français, laisse l’identifiant vide. Tu peux me confier la traduction d’un article avant de l’ajouter, mais aucune API de traduction automatique ni aucun service payant n’a été activé.

## Sécurité de l’éditeur

En local, l’éditeur agit sur tes fichiers. En production, il est désactivé par défaut, API comprise. L’activation en ligne exige une configuration GitHub complète : voir README. Un visiteur anonyme ne peut pas écrire en connaissant simplement l’URL. Le parcours OAuth reste à vérifier avec tes vrais identifiants avant de réactiver l’admin public.
