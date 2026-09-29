import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { JsonLd } from '@/components/json-ld';
import BlogArticleClient from './BlogArticleClient';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

// ---------------------------------------------------------------------------
// Category hierarchy → canonical article URL
// ---------------------------------------------------------------------------

interface CategoriaRow {
  id: number;
  nombre: string;
  slug: string;
  parent_id: number | null;
}

/** All categories indexed by id (small table — one fetch powers the whole walk). */
async function loadCategorias(): Promise<Map<number, CategoriaRow>> {
  const { data } = await supabase.from('categorias').select('id, nombre, slug, parent_id');
  return new Map(((data ?? []) as CategoriaRow[]).map((c) => [c.id, c]));
}

/** Walk parent_id up to the root → root-to-leaf chain (depth capped at 10). */
function categoryChain(catId: number, byId: Map<number, CategoriaRow>): CategoriaRow[] {
  const chain: CategoriaRow[] = [];
  let actual = byId.get(catId);
  while (actual && chain.length < 10 && !chain.some((c) => c.id === actual!.id)) {
    chain.unshift(actual);
    actual = actual.parent_id != null ? byId.get(actual.parent_id) : undefined;
  }
  return chain;
}

/**
 * An article is reachable through every category path it belongs to
 * (/blog/actividades/<slug> and /blog/actividades/dinamicas/<slug>), plus any
 * legacy or bogus variant. Search engines need exactly ONE URL per article,
 * so canonical always resolves to the DEEPEST chain — the one the app uses
 * for breadcrumbs — and every other variant consolidates into it.
 */
function deepestChain(chains: CategoriaRow[][]): CategoriaRow[] {
  return chains.reduce<CategoriaRow[]>((best, chain) => (chain.length > best.length ? chain : best), []);
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
// Page (Article + Breadcrumb JSON-LD)
// ---------------------------------------------------------------------------

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  // The actual article slug is always the last segment of the catch-all path
  const articleSlug = slug[slug.length - 1];

  const { data: articulo } = await supabase
    .from('articulos')
    .select('titulo, extracto, imagen_destacada, created_at, updated_at, autor:perfiles(nombres, apellidos), etiquetas, articulo_categorias(categoria_id, categorias(id, nombre, slug, parent_id))')
    .eq('slug', articleSlug)
    .single() as { data: {
      titulo: string;
      extracto: string | null;
      imagen_destacada: string | null;
      created_at: string;
      updated_at: string | null;
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

  const articleJsonLd = articulo ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': articulo.titulo,
    'description': articulo.extracto || '',
    'image': articulo.imagen_destacada
      ? {
          '@type': 'ImageObject',
          // Schema.org requires an absolute URL — resolve relative uploads
          'url': articulo.imagen_destacada.startsWith('http')
            ? articulo.imagen_destacada
            : `https://nuamana.cl${articulo.imagen_destacada}`,
          'width': 1200,
          'height': 630,
        }
      : undefined,
    'datePublished': articulo.created_at,
    'dateModified': articulo.updated_at || articulo.created_at,
    'author': articulo.autor
      ? { '@type': 'Person', 'name': `${articulo.autor.nombres} ${articulo.autor.apellidos}` }
      : { '@id': 'https://nuamana.cl/#organization' },
    'publisher': {
      '@id': 'https://nuamana.cl/#organization',
      '@type': 'Organization',
      'name': 'Guías y Scouts Nua Mana',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://nuamana.cl/images/logos/logo-nuamana.webp',
        'width': 512,
        'height': 512,
      },
    },
    'mainEntityOfPage': { '@type': 'WebPage', '@id': canonicalUrl },
    'articleSection': articulo.articulo_categorias?.[0]?.categorias?.nombre || undefined,
    'keywords': articulo.etiquetas?.join(', ') || undefined,
    'isFamilyFriendly': true,
    'inLanguage': 'es',
  } : null;

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
