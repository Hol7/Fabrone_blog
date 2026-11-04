// Transforme une image seule dans un paragraphe en <figure> + <figcaption>, avec le titre markdown comme légende :
// ![description](lien "Légende")
type Node = { type: string; tagName?: string; properties?: Record<string, unknown>; children?: Node[]; value?: string };

const walk = (node: Node, fn: (n: Node) => void) => {
  fn(node);
  node.children?.forEach((child) => walk(child, fn));
};

export default function figures() {
  return (tree: Node) =>
    walk(tree, (n) => {
      const img = n.tagName === 'p' && n.children?.length === 1 ? n.children[0] : null;
      const caption = img?.tagName === 'img' ? (img.properties?.title as string | undefined) : undefined;
      if (!img || !caption) return;
      delete img.properties!.title;
      n.tagName = 'figure';
      n.children = [img, { type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: caption }] }];
    });
}
