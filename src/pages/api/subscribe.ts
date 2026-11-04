import type { APIRoute } from 'astro';
import { BREVO_API_KEY, BREVO_LIST_ID, BREVO_DOI_TEMPLATE_ID, TURNSTILE_SECRET_KEY } from 'astro:env/server';

export const prerender = false;

const reply = (message: string, status = 200) => Response.json({ message }, { status });

export const POST: APIRoute = async ({ request, url }) => {
  const form = await request.formData();
  if (form.get('website')) return reply('Abonnement enregistré. Merci !'); // champ piège : réservé aux robots

  const email = String(form.get('email') ?? '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply('Adresse e-mail invalide.', 400);
  if (!BREVO_API_KEY || !BREVO_LIST_ID) return reply("L’inscription n’est pas encore configurée.", 503);

  // Contrôle anti-robot Cloudflare Turnstile, actif dès que la clé secrète est renseignée.
  if (TURNSTILE_SECRET_KEY) {
    const token = String(form.get('cf-turnstile-response') ?? '');
    if (!token) return reply('Valide le contrôle anti-robot, puis réessaie.', 400);
    const check = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret: TURNSTILE_SECRET_KEY, response: token, remoteip: request.headers.get('cf-connecting-ip') ?? '' }),
    }).then((r) => r.json() as Promise<{ success: boolean }>, () => null);
    if (!check) return reply('Le contrôle anti-robot est indisponible. Réessaie dans quelques minutes.', 502);
    if (!check.success) return reply('Le contrôle anti-robot a échoué. Recharge la page et réessaie.', 400);
  }

  // Avec un modèle de confirmation, Brevo envoie d’abord un e-mail à valider (double opt-in).
  const doi = BREVO_DOI_TEMPLATE_ID;
  const res = await fetch(`https://api.brevo.com/v3/contacts${doi ? '/doubleOptinConfirmation' : ''}`, {
    method: 'POST',
    headers: { 'api-key': BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(
      doi
        ? { email, includeListIds: [BREVO_LIST_ID], templateId: doi, redirectionUrl: `${url.origin}/merci` }
        : { email, listIds: [BREVO_LIST_ID], updateEnabled: true },
    ),
  }).catch(() => null);

  if (!res?.ok) return reply("L’inscription a échoué. Réessaie dans quelques minutes.", 502);
  return reply(doi ? "Presque terminé : confirme ton adresse avec l’e-mail que tu viens de recevoir." : 'Abonnement enregistré. Merci !');
};
