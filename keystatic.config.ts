import { config, collection, singleton, fields } from '@keystatic/core';
import { site, rubriques } from './src/site';

// En local, l'admin écrit directement dans les fichiers. En production, il passe par GitHub.
// Pour créer l'app GitHub : PUBLIC_KEYSTATIC_STORAGE=github npm run dev (voir README).
const github = import.meta.env.PROD || import.meta.env.PUBLIC_KEYSTATIC_STORAGE === 'github';

export default config({
  storage: github ? { kind: 'github', repo: site.repo } : { kind: 'local' },
  ui: { brand: { name: site.name } },
  singletons: {
    profile: singleton({
      label: 'Mon profil', path: 'src/data/profile', format: { data: 'json' },
      schema: {
        name: fields.text({ label: 'Nom public', validation: { isRequired: true } }),
        subtitle: fields.text({ label: 'Courte présentation' }),
        subtitleEn: fields.text({ label: 'Courte présentation en anglais' }),
        bioEn: fields.text({ label: 'À propos en anglais', multiline: true }),
        bio: fields.text({ label: 'À propos', multiline: true, description: 'Sépare les paragraphes par une ligne vide.' }),
        github: fields.url({ label: 'Lien GitHub' }),
        linkedin: fields.url({ label: 'Lien LinkedIn' }),
        email: fields.text({ label: 'Adresse e-mail publique' }),
      },
    }),
  },
  collections: {
    posts: collection({
      label: 'Articles',
      path: 'src/content/posts/*',
      slugField: 'title',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Titre' } }),
        description: fields.text({ label: 'Résumé', multiline: true, validation: { isRequired: true } }),
        date: fields.date({ label: 'Date', defaultValue: { kind: 'today' }, validation: { isRequired: true } }),
        language: fields.select({ label: 'Langue de l’article', options: [{ label: 'Français', value: 'fr' }, { label: 'English', value: 'en' }], defaultValue: 'fr' }),
        translationKey: fields.text({ label: 'Identifiant de traduction (facultatif)', description: 'Même identifiant dans les versions FR et EN, par exemple mon-voyage. Une version par langue. Aucun texte n’est traduit automatiquement.' }),
        order: fields.integer({ label: 'Position dans la liste', defaultValue: 0, validation: { min: 0 }, description: '1 en premier, 2 ensuite… 0 garde le classement par date après les articles positionnés.' }),
        category: fields.select({
          label: 'Rubrique',
          options: Object.entries(rubriques).map(([value, label]) => ({ value, label })),
          defaultValue: 'dev',
        }),
        coverFile: fields.image({ label: 'Photo de l’article', description: 'Miniature dans les listes et couverture dans l’article. Prioritaire sur le lien ci-dessous.', directory: 'public/images/posts', publicPath: '/images/posts/' }),
        cover: fields.text({ label: 'Image de couverture (lien)', description: 'URL HTTPS ou chemin local, par exemple /images/posts/photo.jpg.' }),
        coverAlt: fields.text({ label: "Description de l'image" }),
        credit: fields.text({ label: 'Crédit photo (ex. Prénom Nom, Unsplash)' }),
        audio: fields.file({ label: 'Audio (facultatif)', directory: 'public/audio', publicPath: '/audio/' }),
        video: fields.url({ label: 'Vidéo (facultatif)', description: 'Lien YouTube, Vimeo ou lien direct vers un fichier MP4/WebM.' }),
        videoFile: fields.file({ label: 'Fichier vidéo (facultatif)', directory: 'public/videos', publicPath: '/videos/', description: 'MP4 ou WebM. Prioritaire sur le lien vidéo. Pour de longues vidéos, préfère un hébergement externe.' }),
        chartTitle: fields.text({ label: 'Titre du graphique (facultatif)' }),
        chart: fields.array(fields.object({
          label: fields.text({ label: 'Libellé', validation: { isRequired: true } }),
          value: fields.number({ label: 'Valeur', validation: { isRequired: true, min: 0 } }),
        }), { label: 'Graphique en barres', itemLabel: (props) => props.fields.label.value || 'Nouvelle valeur' }),
        draft: fields.checkbox({ label: 'Brouillon (non publié)', defaultValue: false }),
        content: fields.mdx({
          label: 'Contenu',
          options: { image: { directory: 'public/images/posts', publicPath: '/images/posts/' } },
        }),
      },
    }),
  },
});
