export async function initStats() {
  const article = document.querySelector<HTMLElement>('#article-stats');
  const en = document.documentElement.lang === 'en';
  let id: string;
  try {
    id = localStorage.getItem('carnet-visitor') || crypto.randomUUID();
    localStorage.setItem('carnet-visitor', id);
  } catch { return; }

  const button = document.querySelector<HTMLButtonElement>('#article-like');
  async function update(action: string) {
    const response = await fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, id, slug: article?.dataset.slug ?? '' }),
    });
    if (!response.ok) throw Error();
    const { visitors, views, likes, liked } = await response.json();
    const footer = document.getElementById('visitor-count')!;
    footer.textContent = visitors + (en ? (visitors === 1 ? ' visitor' : ' visitors') : (visitors === 1 ? ' visiteur' : ' visiteurs'));
    footer.hidden = false;
    if (article && button) {
      document.getElementById('view-count')!.textContent = views + (en ? (views === 1 ? ' view' : ' views') : (views === 1 ? ' vue' : ' vues'));
      document.getElementById('like-count')!.textContent = String(likes);
      button.setAttribute('aria-pressed', String(liked));
      article.hidden = false;
    }
  }
  try { await update(article ? 'view' : 'visit'); } catch { return; }
  button?.addEventListener('click', async () => {
    button.disabled = true;
    const status = document.getElementById('stats-error')!;
    status.textContent = '';
    try { await update(button.getAttribute('aria-pressed') === 'true' ? 'unlike' : 'like'); }
    catch { status.textContent = en ? 'Please try again.' : 'Réessaie dans un instant.'; }
    finally { button.disabled = false; }
  });
}
