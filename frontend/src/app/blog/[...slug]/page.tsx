import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { JsonLd } from '@/components/json-ld';
import BlogArticleClient from './BlogArticleClient';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugStr = slug.join('/');

  const { data: articulo } = await supabase
    .from('articulos')
    .select('titulo, extracto, imagen_destacada')
    .eq('slug', slugStr)
    .single();

  if (!articulo) {
    return { title: 'Artículo no encontrado | Nua Mana' };
  }

  return {
    title: `${articulo.titulo} | Nua Mana`,
    description: articulo.extracto || '',
    openGraph: {
      title: articulo.titulo,
      description: articulo.extracto || '',
      images: articulo.imagen_destacada ? [{ url: articulo.imagen_destacada, width: 1200, height: 630 }] : undefined,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const slugStr = slug.join('/');

  const { data: articulo } = await supabase
    .from('articulos')
    .select('titulo, extracto, imagen_destacada, created_at, updated_at, autor:perfiles(nombres, apellidos), etiquetas, articulo_categorias(categorias(nombre))')
    .eq('slug', slugStr)
    .single() as { data: {
      titulo: string;
      extracto: string | null;
      imagen_destacada: string | null;
      created_at: string;
      updated_at: string | null;
      autor: { nombres: string; apellidos: string } | null;
      etiquetas: string[] | null;
      articulo_categorias: Array<{ categorias: { nombre: string }[] }> | null;
    } | null };

  const articleJsonLd = articulo ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': articulo.titulo,
    'description': articulo.extracto || '',
    'image': articulo.imagen_destacada
      ? {
          '@type': 'ImageObject',
          'url': articulo.imagen_destacada,
          'width': 1200,
          'height': 630,
        }
      : undefined,
    'datePublished': articulo.created_at,
    'dateModified': articulo.updated_at || articulo.created_at,
    'author': articulo.autor
      ? { '@type': 'Person', 'name': `${articulo.autor.nombres} ${articulo.autor.apellidos}` }
      : { '@id': 'https://nuamana.cl/#organization' },
    'publisher': { '@id': 'https://nuamana.cl/#organization' },
    'mainEntityOfPage': { '@type': 'WebPage', '@id': `https://nuamana.cl/blog/${slugStr}` },
    'articleSection': articulo.articulo_categorias?.[0]?.categorias?.[0]?.nombre || undefined,
    'keywords': articulo.etiquetas?.join(', ') || undefined,
    'isFamilyFriendly': true,
    'inLanguage': 'es',
  } : null;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': 'https://nuamana.cl' },
      { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': 'https://nuamana.cl/blog' },
      { '@type': 'ListItem', 'position': 3, 'name': articulo?.titulo || slugStr },
    ],
  };

  return (
    <>
      {articleJsonLd && <JsonLd data={articleJsonLd} />}
      <JsonLd data={breadcrumbJsonLd} />
      <BlogArticleClient slug={slugStr} />
    </>
  );
}
