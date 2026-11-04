export function comparePosts(a: { id: string; data: { order?: number; date: Date } }, b: { id: string; data: { order?: number; date: Date } }) {
  const rank = (value?: number) => value && value > 0 ? value : Number.MAX_SAFE_INTEGER;
  return rank(a.data.order) - rank(b.data.order) || +b.data.date - +a.data.date || a.id.localeCompare(b.id);
}
