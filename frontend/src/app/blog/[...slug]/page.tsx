import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { JsonLd } from '@/components/json-ld';
import { buildArticleGraph } from '@/lib/schema/build-article';
import { categoryChain, deepestChain } from '@/lib/schema/chains';
import {
  EDU_OBJECTIVES_SELECT,
  mapEduObjectives,
  type EduObjectiveRow,
} from '@/lib/schema/educational-objectives';
import type { CategoriaRow } from '@/lib/schema/types';
import type { ArticuloMetadata, ObjEducacionMeta } from '@/types';
import BlogArticleClient from './BlogArticleClient';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

// ---------------------------------------------------------------------------
// Category hierarchy → canonical article URL
// ---------------------------------------------------------------------------

/** All categories indexed by id (small table — one fetch powers the whole walk). */
async function loadCategorias(): Promise<Map<number, CategoriaRow>> {
  const { data } = await supabase.from('categorias').select('id, nombre, slug, parent_id');
  return new Map(((data ?? []) as CategoriaRow[]).map((c) => [c.id, c]));
}

function articleUrl(chain: CategoriaRow[], articleSlug: string): string {
  const segments = [...chain.map((c) => c.slug), articleSlug].join('/');
  return `https://nuamana.cl/blog/${segments}`;
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  // The actual article slug is always the last segment of the catch-all path
  const articleSlug = slug[slug.length - 1];

  const { data: articulo } = await supabase
    .from('articulos')
    .select('titulo, extracto, imagen_destacada, articulo_categorias(categoria_id)')
    .eq('slug', articleSlug)
    .single();

  if (!articulo) {
    return { title: 'Artículo no encontrado | Nua Mana' };
  }

  // Canonical comes from the DB hierarchy — never from untrusted URL segments
  const byId = await loadCategorias();
  const chains = ((articulo.articulo_categorias ?? []) as Array<{ categoria_id: number }>)
    .map((ac) => categoryChain(ac.categoria_id, byId))
    .filter((chain) => chain.length > 0);
  const chain = deepestChain(chains);
  const canonicalUrl = chain.length
    ? articleUrl(chain, articleSlug)
    : `https://nuamana.cl/blog/${slug.join('/')}`;

  return {
    title: `${articulo.titulo} | Nua Mana`,
    description: articulo.extracto || '',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: articulo.titulo,
      description: articulo.extracto || '',
      url: canonicalUrl,
      images: articulo.imagen_destacada ? [{ url: articulo.imagen_destacada, width: 1200, height: 630 }] : undefined,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@gruponuamana',
      creator: '@gruponuamana',
    },
  };
}

// ---------------------------------------------------------------------------
// Educational objectives (the same source the article page renders)
// ---------------------------------------------------------------------------

/**
 * Objectives come from the relational table joined against progresion_objetivos
 * — that is what BlogArticleClient shows. The metadata JSONB is only a fallback
 * for articles with no relational rows, so the schema never claims objectives
 * the reader cannot see. Failures degrade to the fallback, never to a 500.
 */
async function loadEduObjectives(articuloId: string): Promise<ObjEducacionMeta[]> {
  try {
    const { data, error } = (await supabase
      .from('articulo_objetivos_educativos')
      .select(EDU_OBJECTIVES_SELECT)
      .eq('articulo_id', articuloId)) as unknown as {
      data: EduObjectiveRow[] | null;
      error: { message: string } | null;
    };
    if (error) {
      console.error('[blog-jsonld]', error);
      return [];
    }
    return mapEduObjectives(data);
  } catch (err) {
    console.error('[blog-jsonld]', err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Page (Article + Breadcrumb JSON-LD)
// ---------------------------------------------------------------------------

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  // The actual article slug is always the last segment of the catch-all path
  const articleSlug = slug[slug.length - 1];

  const { data: articulo } = await supabase
    .from('articulos')
    .select('id, titulo, contenido, extracto, imagen_destacada, created_at, updated_at, metadata, autor:perfiles(nombres, apellidos), etiquetas, articulo_categorias(categoria_id, categorias(id, nombre, slug, parent_id))')
    .eq('slug', articleSlug)
    .single() as { data: {
      id: string;
      titulo: string;
      contenido: string | null;
      extracto: string | null;
      imagen_destacada: string | null;
      created_at: string;
      updated_at: string | null;
      metadata: ArticuloMetadata | null;
      autor: { nombres: string; apellidos: string } | null;
      etiquetas: string[] | null;
      articulo_categorias: Array<{ categoria_id: number; categorias: { id: number; nombre: string; slug: string; parent_id: number } | null }> | null;
    } | null };

  // Resolve the article's real category chain → canonical URL + breadcrumb
  const byId = await loadCategorias();
  const chains = (articulo?.articulo_categorias ?? [])
    .map((ac) => categoryChain(ac.categoria_id, byId))
    .filter((chain) => chain.length > 0);
  const chain = deepestChain(chains);
  const canonicalUrl = chain.length
    ? articleUrl(chain, articleSlug)
    : `https://nuamana.cl/blog/${slug.join('/')}`;

  // JSON-LD is cosmetic: any failure must degrade to "no JSON-LD", never to a 500.
  let articleJsonLd: Record<string, unknown> | null = null;
  if (articulo) {
    try {
      const objetivosEducativos = await loadEduObjectives(articulo.id);
      articleJsonLd = buildArticleGraph({
        titulo: articulo.titulo,
        contenido: articulo.contenido,
        extracto: articulo.extracto,
        imagen_destacada: articulo.imagen_destacada,
        created_at: articulo.created_at,
        updated_at: articulo.updated_at,
        etiquetas: articulo.etiquetas,
        autor: articulo.autor,
        metadata: articulo.metadata,
        objetivosEducativos: objetivosEducativos.length ? objetivosEducativos : null,
        chain,
        chains,
        canonicalUrl,
      });
    } catch (err) {
      console.error('[blog-jsonld]', err);
      articleJsonLd = null;
    }
  }


  // Breadcrumb mirrors the DB hierarchy — names and URLs always consistent
  const breadcrumbItems: Array<Record<string, unknown>> = [
    { '@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': 'https://nuamana.cl' },
    { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': 'https://nuamana.cl/blog' },
    ...chain.map((cat, i) => ({
      '@type': 'ListItem',
      'position': 3 + i,
      'name': cat.nombre,
      'item': `https://nuamana.cl/blog/${chain.slice(0, i + 1).map((c) => c.slug).join('/')}`,
    })),
    {
      '@type': 'ListItem',
      'position': 3 + chain.length,
      'name': articulo?.titulo || articleSlug,
      'item': canonicalUrl,
    },
  ];

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbItems,
  };

  return (
    <>
      {articleJsonLd && <JsonLd data={articleJsonLd} />}
      <JsonLd data={breadcrumbJsonLd} />
      <BlogArticleClient slugPath={slug.join('/')} />
    </>
  );
}
