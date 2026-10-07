import type { MetadataRoute } from 'next'
import { getAllContentMetadata } from '@/lib/content-service'
import { supabase } from '@/lib/supabase'
import { resolveArticlePath } from '@/lib/schema/chains'
import type { CategoriaRow } from '@/lib/schema/types'

/**
 * Sitemap metadata route.
 *
 * Built block by block, each with its own try/catch so a partial failure only
 * costs that block: static routes are always emitted, content pages come from
 * the same content service the /acerca-de and /lo-que-hacemos listings use, and
 * published articles are resolved through lib/schema/chains — the exact walk the
 * blog listing and the article page use for the canonical URL (deepest linked
 * category, root -> leaf). If Supabase is down the article block logs a warning
 * and the sitemap still ships the static routes, so `next build` never fails.
 */

const SITE_URL = 'https://nuamana.cl';

/**
 * Revalidate in the background every hour so newly published articles reach
 * Google without waiting for a deploy. Publishing happens client-side (see
 * blog/crear), so there is no server action to revalidatePath from; this ISR
 * window is what keeps the index fresh between pushes to main.
 */
export const revalidate = 3600;

/** Hand-maintained public routes — no I/O, so they survive any outage. */
const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: `${SITE_URL}/`, priority: 1, changeFrequency: 'daily' },
  { url: `${SITE_URL}/blog`, priority: 0.9, changeFrequency: 'daily' },
  { url: `${SITE_URL}/acerca-de`, priority: 0.7, changeFrequency: 'monthly' },
  { url: `${SITE_URL}/lo-que-hacemos`, priority: 0.7, changeFrequency: 'monthly' },
  { url: `${SITE_URL}/unidad/manada`, priority: 0.6, changeFrequency: 'monthly' },
  { url: `${SITE_URL}/unidad/compania`, priority: 0.6, changeFrequency: 'monthly' },
  { url: `${SITE_URL}/unidad/tropa`, priority: 0.6, changeFrequency: 'monthly' },
  { url: `${SITE_URL}/unidad/avanzada`, priority: 0.6, changeFrequency: 'monthly' },
  { url: `${SITE_URL}/unidad/clan`, priority: 0.6, changeFrequency: 'monthly' },
];

/** Content folders served by readContentFile/getAllContentMetadata. */
const CONTENT_FOLDERS = ['acerca-de', 'lo-que-hacemos'] as const;

interface ArticleRow {
  slug: string | null;
  updated_at: string | null;
  created_at: string | null;
  articulo_categorias: Array<{ categoria_id: number | null }> | null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Block 1 — static routes: no I/O, always present.
  try {
    entries.push(...STATIC_ROUTES);
  } catch (err) {
    console.warn('[sitemap] static routes failed:', err);
  }

  // Block 2 — /acerca-de/[slug] and /lo-que-hacemos/[slug]: the content service
  // already falls back from the DB to the filesystem and returns [] on failure.
  try {
    for (const folder of CONTENT_FOLDERS) {
      const items = await getAllContentMetadata(folder);
      if (items.length === 0) {
        console.warn(`[sitemap] no content pages found for "${folder}"`);
        continue;
      }
      for (const item of items) {
        if (!item.slug) continue;
        entries.push({
          url: `${SITE_URL}/${folder}/${item.slug}`,
          changeFrequency: 'monthly',
          priority: 0.5,
        });
      }
    }
  } catch (err) {
    console.warn('[sitemap] content pages skipped:', err);
  }

  // Block 3 — published articles. The URL path must be byte-identical to the
  // one the blog listing and the article page build: deepest linked category,
  // walked root -> leaf over the full category table.
  try {
    const signal = AbortSignal.timeout(5000);
    const [articlesRes, categoriesRes] = await Promise.all([
      supabase
        .from('articulos')
        .select('slug, updated_at, created_at, articulo_categorias(categoria_id)')
        .eq('estado', 'publicado')
        .abortSignal(signal),
      supabase.from('categorias').select('id, nombre, slug, parent_id').abortSignal(signal),
    ]);

    if (articlesRes.error) {
      throw new Error(`articulos: ${articlesRes.error.message}`);
    }
    if (categoriesRes.error) {
      throw new Error(`categorias: ${categoriesRes.error.message}`);
    }

    const articulos = (articlesRes.data ?? []) as unknown as ArticleRow[];
    if (articulos.length === 0) {
      console.warn('[sitemap] no published articles found');
    }

    const byId = new Map<number, CategoriaRow>(
      ((categoriesRes.data ?? []) as unknown as CategoriaRow[]).map((cat) => [cat.id, cat]),
    );

    for (const articulo of articulos) {
      if (!articulo.slug) {
        console.warn('[sitemap] published article without slug skipped');
        continue;
      }

      const path = resolveArticlePath(
        articulo.slug,
        (articulo.articulo_categorias ?? [])
          .filter((link): link is { categoria_id: number } => link.categoria_id != null)
          .map((link) => link.categoria_id),
        byId,
      );

      const entry: MetadataRoute.Sitemap[number] = {
        url: `${SITE_URL}/blog/${path}`,
        changeFrequency: 'weekly',
        priority: 0.7,
      };
      const stamp = articulo.updated_at ?? articulo.created_at;
      if (stamp) {
        const lastModified = new Date(stamp);
        if (!Number.isNaN(lastModified.getTime())) {
          entry.lastModified = lastModified;
        }
      }
      entries.push(entry);
    }
  } catch (err) {
    console.warn('[sitemap] articles skipped, keeping static routes only:', err);
  }

  return entries;
}
