export function parseVideo(value: string): { kind: 'embed' | 'file'; src: string } | null {
  if (/^\/videos\/[a-zA-Z0-9_./%-]+\.(mp4|webm)$/i.test(value) && !value.includes('..')) return { kind: 'file', src: value };
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return null;
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    if (['youtube.com', 'm.youtube.com', 'youtu.be'].includes(host)) {
      const id = host === 'youtu.be' ? url.pathname.slice(1) : url.pathname === '/watch' ? url.searchParams.get('v') : /^\/(?:embed|shorts)\/([^/]+)\/?$/.exec(url.pathname)?.[1];
      return id && /^[\w-]{11}$/.test(id) ? { kind: 'embed', src: `https://www.youtube-nocookie.com/embed/${id}` } : null;
    }
    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const id = /^\/(?:video\/)?(\d+)\/?$/.exec(url.pathname)?.[1];
      return id ? { kind: 'embed', src: `https://player.vimeo.com/video/${id}` } : null;
    }
    return /\.(mp4|webm)$/i.test(url.pathname) ? { kind: 'file', src: url.href } : null;
  } catch { return null; }
}
