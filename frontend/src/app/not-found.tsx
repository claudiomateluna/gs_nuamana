'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendedArticles, setRecommendedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar artículos recomendados desde la base de datos
  useEffect(() => {
    async function fetchRecommendations() {
      try {
        // 1. Obtener todas las categorías para construir la ruta jerárquica
        const { data: catsData } = await supabase.from('categorias').select('*');
        const cats = catsData || [];

        const buildCatPathSlugs = (catId: number): string[] => {
          const cat = cats.find(c => c.id === catId);
          if (!cat) return [];
          return cat.parent_id ? [...buildCatPathSlugs(cat.parent_id), cat.slug] : [cat.slug];
        };

        // 2. Obtener los 3 artículos publicados más recientes
        const { data: articlesData } = await supabase
          .from('articulos')
          .select('*, articulo_categorias(categoria_id, categorias(*))')
          .eq('estado', 'publicado')
          .order('created_at', { ascending: false })
          .limit(3);

        if (articlesData) {
          const processed = articlesData.map(post => {
            const linkedCats = post.articulo_categorias?.map((ac: any) => ac.categorias).filter(Boolean) || [];
            const sortedCats = [...linkedCats].sort((a, b) => buildCatPathSlugs(b.id).length - buildCatPathSlugs(a.id).length);
            const mainCat = sortedCats[0];
            const path = mainCat ? `${buildCatPathSlugs(mainCat.id).join('/')}/${post.slug}` : `general/${post.slug}`;
            return { ...post, path };
          });
          setRecommendedArticles(processed);
        }
      } catch (error) {
        console.error('Error fetching recommendations for 404:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/blog?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-zinc-950 text-white overflow-hidden font-sans">
      <Header />

      {/* Imagen de fondo de pantalla completo */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/paginasFijas/pag_404.jpg"
          alt="Fondo 404 Nua Mana"
          className="w-full h-full object-cover object-center md:object-right opacity-60 md:opacity-80"
        />
        {/* Degradado oscuro para integrar el lado izquierdo con la imagen */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent md:block hidden" />
        <div className="absolute inset-0 bg-zinc-950/80 md:hidden block" />
      </div>

      {/* Contenido principal alineado a la izquierda */}
      <main className="relative z-10 flex-grow flex items-center px-6 sm:px-12 md:px-24 py-20 max-w-6xl w-full mx-auto">
        <div className="max-w-xl w-full bg-zinc-950/80 md:bg-zinc-950/50 backdrop-blur-lg md:backdrop-blur-md p-8 md:p-10 rounded-[2rem] border border-white/10 space-y-8 shadow-2xl animate-in fade-in slide-in-from-left-8 duration-500">
          <div className="space-y-3">
            <span className="text-[1em] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-red-650/20 text-red-500 border border-red-500/20 inline-block text-red-555">
              Aventura Perdida
            </span>
            <h1 className="text-[3.5em] md:text-[5em] font-extrabold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-red-500">
              404
            </h1>
            <h2 className="text-[1.5em] md:text-[1.8em] font-black uppercase tracking-tight text-zinc-100">
              Te saliste del sendero
            </h2>
            <p className="text-[0.98em] text-zinc-400 leading-relaxed max-w-md">
              La página que buscás no existe o fue movida a otra ruta. Pero no te preocupes, en el escultismo siempre encontramos el camino de regreso.
            </p>
          </div>

          {/* Buscador de Artículos */}
          <form onSubmit={handleSearch} className="space-y-3">
            <label htmlFor="search-input" className="block text-[0.85em] font-bold uppercase tracking-wider text-zinc-400">
              Buscador de Artículos
            </label>
            <div className="relative flex items-center">
              <input
                id="search-input"
                type="text"
                placeholder="Ej. campamentos, técnicas, fogón..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-5 pr-12 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-[0.95em] transition-all"
              />
              <button
                type="submit"
                aria-label="Buscar"
                className="absolute right-3 p-2 rounded-xl text-white hover:bg-red-700 transition-colors"
                style={{ backgroundColor: '#cb3327' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Recomendaciones dinámicas */}
          <div className="space-y-4 pt-2">
            <h3 className="text-[0.85em] font-black uppercase tracking-widest text-zinc-400 border-b border-white/10 pb-2">
              Te recomendamos leer
            </h3>
            
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-14 rounded-2xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : recommendedArticles.length > 0 ? (
              <div className="space-y-3">
                {recommendedArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/blog/${article.path}`}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all group"
                  >
                    <div className="space-y-1">
                      <span className="text-[0.75em] font-extrabold uppercase tracking-wide text-red-500">
                        {article.articulo_categorias?.[0]?.categorias?.nombre || 'General'}
                      </span>
                      <h4 className="text-[0.92em] font-bold text-zinc-100 group-hover:text-white transition-colors line-clamp-1">
                        {article.titulo}
                      </h4>
                    </div>
                    <svg className="w-5 h-5 text-zinc-500 group-hover:text-red-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-[0.88em] text-zinc-500 italic">No hay artículos recomendados disponibles.</p>
            )}
          </div>

          <div className="pt-2 flex gap-4">
            <Link
              href="/"
              className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-[0.88em] font-bold tracking-wide transition-all text-center flex-grow sm:flex-grow-0"
            >
              Volver al Inicio
            </Link>
            <Link
              href="/blog"
              className="px-5 py-3 rounded-2xl text-[0.88em] font-bold tracking-wide transition-all text-center flex-grow sm:flex-grow-0 text-white"
              style={{ backgroundColor: '#cb3327' }}
            >
              Ir al Blog
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative z-10 w-full text-center py-6 text-[0.8em] text-zinc-500 border-t border-white/5 bg-zinc-950/60 backdrop-blur-md">
        © {new Date().getFullYear()} Guías y Scouts Nua Mana. Todos los derechos reservados.
      </footer>
    </div>
  );
}
