/**
 * Category Hierarchy Walking
 * The blog route, the breadcrumbs and the JSON-LD builder must walk the tree
 * exactly the same way, otherwise the canonical URL and the schema can
 * contradict each other. One depth cap and one cycle guard live here so a
 * corrupted parent_id can never hang a request.
 */

import type { CategoriaRow } from './types';

/**
 * Hard cap on hierarchy depth: a broken parent_id (a cycle, or an orphan chain
 * longer than expected) stops here instead of looping forever.
 */
export const MAX_CATEGORY_DEPTH = 10;

/** Walk parent_id up to the root → root-to-leaf chain (depth capped, cycle-safe). */
export function categoryChain(catId: number, byId: Map<number, CategoriaRow>): CategoriaRow[] {
  const chain: CategoriaRow[] = [];
  let current = byId.get(catId);
  while (current && chain.length < MAX_CATEGORY_DEPTH && !chain.some((c) => c.id === current!.id)) {
    chain.unshift(current);
    current = current.parent_id != null ? byId.get(current.parent_id) : undefined;
  }
  return chain;
}

/**
 * The chain a canonical URL is built from: the DEEPEST one — the same the app
 * uses for breadcrumbs. First wins on ties, so the result never depends on
 * iteration luck.
 */
export function deepestChain(chains: CategoriaRow[][]): CategoriaRow[] {
  return chains.reduce<CategoriaRow[]>((best, chain) => (chain.length > best.length ? chain : best), []);
}

/** 'actividades/juegos' — stable sort key so about[]/keywords never depend on DB row order. */
export function chainPath(chain: CategoriaRow[]): string {
  return chain.map((cat) => cat.slug).join('/');
}

/**
 * Canonical article path ('actividades/dinamicas/mi-slug') — THE walk. Every
 * consumer (blog listing, sitemap, article canonical) must build the URL from
 * here or the crawler HTML and the indexed URL drift apart.
 *
 * @param linkedCatIds ids from `articulo_categorias`; ids missing from `byId`
 * contribute no chain (they are skipped, they never fail the resolution).
 * @returns the deepest linked chain + `/${slug}`, or `general/${slug}` when no
 * linked category resolves. `general/` and the fallback order are a contract.
 */
export function resolveArticlePath(
  slug: string,
  linkedCatIds: number[],
  byId: Map<number, CategoriaRow>,
): string {
  const chains = linkedCatIds
    .map((id) => categoryChain(id, byId))
    .filter((candidate) => candidate.length > 0);
  const chain = deepestChain(chains);
  return chain.length ? `${chainPath(chain)}/${slug}` : `general/${slug}`;
}
