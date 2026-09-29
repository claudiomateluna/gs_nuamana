import type { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';

export const metadata: Metadata = {
  title: 'Blog de Actividades y Recursos | Nua Mana',
  description: 'Explora bitácoras, dinámicas, juegos, técnicas scout e historias del Grupo Guía y Scout Nua Mana. Recursos educativos para todas las unidades.',
  openGraph: {
    title: 'Blog de Actividades y Recursos | Nua Mana',
    description: 'Explora bitácoras, dinámicas, juegos, técnicas scout e historias del Grupo Guía y Scout Nua Mana. Recursos educativos para todas las unidades.',
    url: 'https://nuamana.cl/blog',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@gruponuamana',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': 'https://nuamana.cl/blog#blog',
    'name': 'Blog de Actividades y Recursos Nua Mana',
    'url': 'https://nuamana.cl/blog',
    'description': 'Bitácoras, dinámicas, juegos, técnicas scout e historias del Grupo Guía y Scout Nua Mana.',
    'publisher': { '@id': 'https://nuamana.cl/#organization' },
    'inLanguage': 'es',
  };

  return (
    <>
      <JsonLd data={blogJsonLd} />
      {children}
    </>
  );
}
