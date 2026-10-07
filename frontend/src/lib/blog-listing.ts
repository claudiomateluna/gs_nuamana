/**
 * Blog listing — shared by the server component (/blog first paint) and the
 * client component (infinite scroll). Filter parsing, the article query and the
 * path building live here exactly once: if either side owned its own copy the
 * crawler HTML and the hydrated UI would drift apart.
 *
 * No 'use client' directive — this module must stay importable from both sides.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { resolveArticlePath } from './schema/chains';
import type { CategoriaRow } from './schema/types';

export const POSTS_PER_PAGE = 9;

// Normalizado para coincidir exactamente con los valores en la base de datos
export const UNIDADES = ['manada', 'compania', 'tropa', 'avanzada', 'clan'];
export const AREAS = ['corporalidad', 'creatividad', 'caracter', 'afectividad', 'sociabilidad', 'espiritualidad'];

export interface BlogFilters {
  q: string;
  category: string;
  unidades: string;
  areas: string;
  tag: string;
  metaKey: string;
  metaValue: string;
  objEd: string;
}

export type BlogSearchParams = URLSearchParams | Record<string, string | string[] | undefined>;

function readParam(source: BlogSearchParams, key: string): string {
  if (source instanceof URLSearchParams) return source.get(key) ?? '';
  const value = source[key];
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

/** URL is the single source of truth for the 7 filters (client) → same shape from `await searchParams` (server). */
export function parseBlogFilters(source: BlogSearchParams): BlogFilters {
  return {
    q: readParam(source, 'q'),
    category: readParam(source, 'category') || 'todas',
    unidades: readParam(source, 'unidades'),
    areas: readParam(source, 'areas'),
    tag: readParam(source, 'tag'),
    metaKey: readParam(source, 'meta_key'),
    metaValue: readParam(source, 'meta_value'),
    objEd: readParam(source, 'obj_ed'),
  };
}

export function hasAnyFilter(filters: BlogFilters): boolean {
  return Boolean(
    filters.q ||
      filters.category !== 'todas' ||
      filters.unidades ||
      filters.areas ||
      filters.tag ||
      (filters.metaKey && filters.metaValue) ||
      filters.objEd,
  );
}

/** Stable identity of a filter set — keys in a fixed order, so it never depends on URL param order. */
export function blogFiltersKey(filters: BlogFilters): string {
  return JSON.stringify([
    filters.q,
    filters.category,
    filters.unidades,
    filters.areas,
    filters.tag,
    filters.metaKey,
    filters.metaValue,
    filters.objEd,
  ]);
}

/**
 * /blog is the only indexable URL: the filtered variants return equivalent
 * content, so they canonicalize to /blog and opt out of the index.
 */
export function resolveBlogCanonical(filters: BlogFilters): { canonical: string; index: boolean } {
  return { canonical: '/blog', index: !hasAnyFilter(filters) };
}

export interface BlogArticleRow {
  id: string;
  slug: string;
  titulo: string;
  extracto: string | null;
  imagen_destacada: string | null;
  articulo_categorias: Array<{ categoria_id: number | null; categorias: CategoriaRow | null }> | null;
}

export interface BlogArticle extends BlogArticleRow {
  path: string;
}

export interface BlogCategoriaOption extends CategoriaRow {
  count: number;
}

const LINKED_CATS = 'articulo_categorias(categoria_id, categorias(id, nombre, slug, parent_id))';
const LINKED_CATS_INNER = 'articulo_categorias!inner(categoria_id, categorias(id, nombre, slug, parent_id))';

/** Only the columns the grid renders — `contenido`/`metadata` would bloat the SSR payload for nothing. */
export const BLOG_LISTING_SELECT = `id, slug, titulo, extracto, imagen_destacada, ${LINKED_CATS}`;

export function buildListingQuery(client: SupabaseClient, filters: BlogFilters, pageNum: number) {
  const selectStr = filters.category !== 'todas'
    ? `id, slug, titulo, extracto, imagen_destacada, ${LINKED_CATS_INNER}`
    : BLOG_LISTING_SELECT;

  let query = client
    .from('articulos')
    .select(selectStr)
    .eq('estado', 'publicado')
    .order('created_at', { ascending: false })
    .order('id', { ascending: true });

  if (filters.q) query = query.ilike('titulo', `%${filters.q}%`);
  if (filters.category !== 'todas') query = query.eq('articulo_categorias.categoria_id', parseInt(filters.category));

  if (filters.unidades) query = query.contains('metadata', { unidades: [filters.unidades] });
  if (filters.areas) query = query.contains('metadata', { areas: [filters.areas] });

  if (filters.metaKey && filters.metaValue) {
    // Algunos metadatos son arreglos (objetivos, lugares) y otros son strings (duracion, cantidad)
    query = query.or([
      `metadata->>${filters.metaKey}.eq."${filters.metaValue}"`,
      `metadata->${filters.metaKey}.cs.["${filters.metaValue}"]`,
    ].join(','));
  }

  if (filters.tag) query = query.contains('etiquetas', [filters.tag]);
  if (filters.objEd) query = query.ilike('metadata->>objetivos_educativos', `%${filters.objEd}%`);

  const from = pageNum * POSTS_PER_PAGE;
  // Hard 5s cap: postgrest-js maps the abort into `{ error }` (not a rejection),
  // so fetchListingPage falls back to `rows: null` instead of hanging /blog.
  return query
    .abortSignal(AbortSignal.timeout(5000))
    .range(from, from + POSTS_PER_PAGE - 1);
}

export interface BlogListingPage {
  /** null = the query failed: callers must leave their current list untouched (same contract as the old `if (data)`). */
  rows: BlogArticleRow[] | null;
  hasMore: boolean;
}

export async function fetchListingPage(
  client: SupabaseClient,
  filters: BlogFilters,
  pageNum: number,
): Promise<BlogListingPage> {
  const { data, error } = await buildListingQuery(client, filters, pageNum);
  if (error) return { rows: null, hasMore: false };
  const rows = (data ?? []) as unknown as BlogArticleRow[];
  return { rows, hasMore: rows.length === POSTS_PER_PAGE };
}

export interface BlogListingCategorias {
  /** Filter dropdown: published-only, administrativo excluded, ordered by count (unchanged behaviour). */
  options: BlogCategoriaOption[];
  /** Full `categorias` table — the same walk the article canonical and the sitemap use. */
  allCategorias: CategoriaRow[];
}

export async function fetchListingCategorias(client: SupabaseClient): Promise<BlogListingCategorias | null> {
  const [rawLinksRes, allCatsRes] = await Promise.all([
    client
      .from('articulo_categorias')
      .select('categoria_id, categorias(id, nombre, slug, parent_id), articulos!inner(id, estado)')
      .eq('articulos.estado', 'publicado'),
    client.from('categorias').select('id, nombre, slug, parent_id'),
  ]);

  if (rawLinksRes.error || allCatsRes.error || !rawLinksRes.data || !allCatsRes.data) return null;

  const countsMap: Record<number, number> = {};
  const catMap: Record<number, CategoriaRow> = {};

  rawLinksRes.data.forEach((item: any) => {
    const cid = item.categoria_id;
    if (cid) {
      countsMap[cid] = (countsMap[cid] || 0) + 1;
      if (item.categorias) catMap[cid] = item.categorias;
    }
  });

  const options = Object.values(catMap)
    .map((c) => ({ ...c, count: countsMap[c.id] || 0 }))
    .filter((c) => c.count > 0 && c.slug !== 'administrativo' && c.nombre?.toLowerCase() !== 'administrativo')
    .sort((a, b) => b.count - a.count);

  return {
    options,
    allCategorias: allCatsRes.data as unknown as CategoriaRow[],
  };
}

export function indexCategoriasById(rows: CategoriaRow[]): Map<number, CategoriaRow> {
  return new Map(rows.map((row) => [row.id, row]));
}

/**
 * Deepest linked category over the FULL category table — thin adapter: it only
 * extracts the linked ids, the walk itself is `lib/schema/chains`'
 * `resolveArticlePath` (shared with the sitemap), so the listing can never emit
 * a truncated path.
 */
export function articlePath(row: BlogArticleRow, byId: Map<number, CategoriaRow>): string {
  const linkedCatIds = (row.articulo_categorias ?? [])
    .map((ac) => ac.categorias)
    .filter((c): c is CategoriaRow => Boolean(c))
    .map((cat) => cat.id);
  return resolveArticlePath(row.slug, linkedCatIds, byId);
}

export function attachArticlePaths(rows: BlogArticleRow[], byId: Map<number, CategoriaRow>): BlogArticle[] {
  return rows.map((row) => ({ ...row, path: articlePath(row, byId) }));
}
