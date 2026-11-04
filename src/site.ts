import profile from './data/profile.json';
// Identité et liens modifiables dans Keystatic > Mon profil.
export const site = {
  name: profile.name,
  subtitle: profile.subtitle,
  bio: profile.bio,
  subtitleEn: profile.subtitleEn,
  bioEn: profile.bioEn,
  url: 'https://carnet.example.com', // ton domaine final
  repo: 'TON-COMPTE/carnet' as `${string}/${string}`, // dépôt GitHub, utilisé par l’admin en production
  about: "Programmation, cybersécurité et carnets de route. J’écris ce que j’apprends.",
  links: [
    { label: 'GitHub', href: profile.github },
    { label: 'LinkedIn', href: profile.linkedin },
    { label: 'E-mail', href: profile.email ? `mailto:${profile.email}` : '' },
  ].filter((link) => /^(https:\/\/|mailto:)/.test(link.href)),
};

export const rubriques = {
  dev: 'Programmation',
  cyber: 'Cybersécurité',
  vie: 'Vie et voyages',
};
