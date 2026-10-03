/**
 * Article JSON-LD Types
 * Contract between the blog route and the schema builder: the route resolves
 * categories and objectives (it already walks the hierarchy for the canonical
 * URL), the builder only turns them into structured data. Passing the chains
 * instead of raw ids keeps the schema from ever disagreeing with the URL that
 * search engines see as canonical.
 */

import type { ArticuloMetadata, ObjEducacionMeta } from '@/types';

export interface CategoriaRow {
  id: number;
  nombre: string;
  slug: string;
  parent_id: number | null;
}

export type ArticleKind = 'game' | 'howto' | 'biografia' | 'historia' | 'article';

export interface ArticleSchemaInput {
  titulo: string;
  contenido: string | null;
  extracto: string | null;
  imagen_destacada: string | null;
  created_at: string;
  updated_at: string | null;
  etiquetas: string[] | null;
  autor: { nombres: string; apellidos: string } | null;
  metadata: ArticuloMetadata | null;
  /** Chain chosen for canonicalUrl (root → leaf) — feeds mainEntityOfPage/articleSection. */
  chain: CategoriaRow[];
  /** Every reachable chain — feeds about, keywords and the kind detection. */
  chains: CategoriaRow[][];
  /**
   * Objectives from articulo_objetivos_educativos, the table the article page
   * actually renders. Null/empty falls back to the metadata JSONB column.
   */
  objetivosEducativos?: ObjEducacionMeta[] | null;
  canonicalUrl: string;
}
