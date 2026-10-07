'use client'

import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import SecondaryHeader from '@/components/SecondaryHeader'

import CategoryPromoBanner from '@/components/CategoryPromoBanner'
import {
  AREAS,
  UNIDADES,
  attachArticlePaths,
  blogFiltersKey,
  fetchListingCategorias,
  fetchListingPage,
  hasAnyFilter,
  indexCategoriasById,
  parseBlogFilters,
  type BlogArticle,
  type BlogCategoriaOption,
} from '@/lib/blog-listing'
import type { CategoriaRow } from '@/lib/schema/types'

export interface BlogListingProps {
  initialArticulos: BlogArticle[]
  initialCategorias: BlogCategoriaOption[]
  initialAllCategorias: CategoriaRow[]
  initialHasMore: boolean
  initialFiltersKey: string
  initialLoaded: boolean
}

export default function BlogListing({
  initialArticulos,
  initialCategorias,
  initialAllCategorias,
  initialHasMore,
  initialFiltersKey,
  initialLoaded,
}: BlogListingProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const filters = useMemo(() => parseBlogFilters(searchParams), [searchParams])
  const filtersKey = blogFiltersKey(filters)

  const [articulos, setArticulos] = useState<BlogArticle[]>(initialArticulos)
  const [allCategorias, setAllCategorias] = useState<BlogCategoriaOption[]>(initialCategorias)
  const byIdRef = useRef<Map<number, CategoriaRow>>(indexCategoriasById(initialAllCategorias))
  const [loading, setLoading] = useState(!initialLoaded)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(initialHasMore)

  const observer = useRef<IntersectionObserver | null>(null)
  const lastPostRef = useCallback((node: Element | null) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  const fetchArticulos = async (pageNum: number, isNewFilter: boolean = false) => {
    if (pageNum === 0) {
      setLoading(true)
      if (isNewFilter) setArticulos([])
    }

    // Carga perezosa de categorías activas con conteo (omitiendo las vacías)
    if (allCategorias.length === 0) {
      const categorias = await fetchListingCategorias(supabase)
      if (categorias) {
        setAllCategorias(categorias.options)
        byIdRef.current = indexCategoriasById(categorias.allCategorias)
      }
    }

    const { rows, hasMore: more } = await fetchListingPage(supabase, filters, pageNum)

    if (rows) {
      const processed = attachArticlePaths(rows, byIdRef.current)

      setArticulos(prev => {
        if (isNewFilter) return processed;
        return [...prev, ...processed.filter(p => !prev.some(x => x.id === p.id))];
      })
      setHasMore(more)
    }
    setLoading(false)
  }

  // Reiniciar búsqueda cuando cambian los parámetros de la URL.
  // Mismo filtro que el servidor ya hidrató → la grilla queda como está (sin refetch redundante).
  // Si el servidor no pudo cargar (Supabase caído), las claves coinciden pero hay que reintentar acá.
  useEffect(() => {
    if (initialLoaded && filtersKey === initialFiltersKey) {
      setArticulos(initialArticulos)
      setAllCategorias(initialCategorias)
      byIdRef.current = indexCategoriasById(initialAllCategorias)
      setHasMore(initialHasMore)
      setLoading(false)
      setPage(0)
      return
    }
    setPage(0)
    fetchArticulos(0, true)
  }, [filtersKey])

  // Carga infinita activada por el observador
  useEffect(() => {
    if (page > 0) fetchArticulos(page)
  }, [page])

  const updateURL = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'todas') params.set(key, value)
    else params.delete(key)

    // Al seleccionar una categoría o unidad principal, limpiamos filtros de metadatos específicos
    if (['unidades', 'areas', 'category'].includes(key)) {
      params.delete('meta_key'); params.delete('meta_value'); params.delete('obj_ed')
    }
    router.push(`/blog?${params.toString()}`)
  }

  const showFilterChips = hasAnyFilter(filters)
  const search = filters.q
  const selCat = filters.category
  const selUnidad = filters.unidades
  const selArea = filters.areas
  const tagFilter = filters.tag
  const metaKey = filters.metaKey
  const metaValue = filters.metaValue
  const objEdFilter = filters.objEd

  return (
    <div className="min-h-screen bg-blclr1 dark:bg-bldclr1 font-body transition-colors">
      <SecondaryHeader />

      <main className="max-w-[1080px] mx-auto px-2 py-32">
        <header className="mb-8">
          <h1 className="text-4xl text-blclr4 dark:text-bldclr4 font-bold font-display uppercase">Bitácora Nua Mana</h1>
          <p className="text-[0.9em] text-blclr6 dark:text-bldclr6 uppercase tracking-wider">Explora nuestras actividades, técnicas e historia</p>
        </header>

        {/* BANNER ANUNCIO DE CATEGORÍAS PRINCIPALES CON CONTADORES */}
        <CategoryPromoBanner className="mb-6" />

        {/* BARRA DE FILTROS */}
        <div className="bg-blclr1 dark:bg-bldclr1 rounded-3xl border border-blclr13 dark:border-bldclr13 p-2 mb-2 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-2">
          <input
            type="text" placeholder="🔍 Buscar..."
            className="p-2 rounded-2xl border bg-blclr1 dark:bg-bldclr1 text-[1em] focus:outline-blclr10 transition-colors border-blclr13 dark:border-bldclr13 font-bold"
            defaultValue={search} onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && updateURL('q', e.currentTarget.value)}
          />
          <select className="p-2 rounded-2xl border bg-blclr1 dark:bg-bldclr1 text-[0.8em] focus:outline-blclr10 transition-colors border-blclr13 dark:border-bldclr13 font-bold" value={selCat} onChange={(e) => updateURL('category', e.target.value)}>
            <option value="todas">Todas las Categorías</option>
            {allCategorias.map(c => <option key={c.id} value={c.id.toString()}>{c.nombre} ({c.count})</option>)}
          </select>
          <select className="p-2 rounded-2xl border bg-blclr1 dark:bg-bldclr1 text-[0.8em] focus:outline-blclr10 transition-colors border-blclr13 dark:border-bldclr13 font-bold" value={selUnidad} onChange={(e) => updateURL('unidades', e.target.value)}>
            <option value="">Unidad (Todas)</option>
            {UNIDADES.map(u => <option key={u} value={u}>{u === 'compania' ? 'COMPAÑÍA' : u.toUpperCase()}</option>)}
          </select>
          <select className="p-2 rounded-2xl border bg-blclr1 dark:bg-bldclr1 text-[0.8em] focus:outline-blclr10 transition-colors border-blclr13 dark:border-bldclr13 font-bold" value={selArea} onChange={(e) => updateURL('areas', e.target.value)}>
            <option value="">Área (Todas)</option>
            {AREAS.map(a => <option key={a} value={a}>{a.toUpperCase()}</option>)}
          </select>
        </div>

        {/* INDICADOR DE FILTROS ACTIVOS */}
        {showFilterChips && (
          <div className="flex flex-wrap gap-2 mb-8 px-2 items-center">
            <span className="text-[0.8em] font-bold text-blclr6 dark:text-bldclr6 uppercase tracking-widest mr-2">Filtrando por:</span>
            {tagFilter && <span className="bg-blclr12 text-blclr1 px-3 py-1 rounded-full text-[0.8em] font-bold flex items-center gap-2 shadow-sm">#{tagFilter} <button onClick={() => updateURL('tag', '')} className="hover:text-blclr9">✕</button></span>}
            {metaKey && metaValue && <span className="bg-blclr16 text-blclr1 px-3 py-1 rounded-full text-[0.8em] font-bold flex items-center gap-2 shadow-sm">{metaKey}: {metaValue} <button onClick={() => { updateURL('meta_key', ''); updateURL('meta_value', '') }} className="hover:text-blclr9">✕</button></span>}
            {objEdFilter && <span className="bg-blclr14 text-blclr1 px-3 py-1 rounded-full text-[0.8em] font-bold flex items-center gap-2 shadow-sm truncate max-w-[300px]">🎯 {objEdFilter} <button onClick={() => updateURL('obj_ed', '')} className="hover:text-blclr14">✕</button></span>}
            {search && <span className="bg-blclr10 text-blclr1 px-3 py-1 rounded-full text-[0.8em] font-bold flex items-center gap-2 shadow-sm">búsqueda: {search} <button onClick={() => updateURL('q', '')} className="hover:text-blclr9">✕</button></span>}
            <button onClick={() => router.push('/blog')} className="text-[0.8em] font-bold text-blclr4 dark:text-bldclr4 hover:underline uppercase ml-2">Limpiar todo</button>
          </div>
        )}

        {/* GRILLA DE ARTÍCULOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articulos.map((post, index) => {
            const isLast = articulos.length === index + 1
            const mainCatName = post.articulo_categorias?.[0]?.categorias?.nombre || 'General'
            return (
              <Link key={post.id} href={`/blog/${post.path}`} ref={isLast ? lastPostRef : null} className="group bg-blclr1 dark:bg-bldclr1 rounded-[1em] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-blclr13 dark:border-bldclr13 flex flex-col h-full">
                <div className="aspect-square relative overflow-hidden block">
                  {post.imagen_destacada ? <img src={post.imagen_destacada} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={post.titulo} /> : <div className="w-full h-full flex items-center justify-center text-blclr6 opacity-20 text-4xl font-display uppercase italic">Nua Mana</div>}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <span className="text-[0.8em] text-blclr3 dark:text-bldclr3 uppercase font-bold">{mainCatName}</span>
                  <h2 className="text-[1.1em] font-bold font-display leading-tight mb-4 text-blclr4 dark:text-bldclr4 group-hover:text-blclr10 dark:group-hover:text-bldclr10 transition-colors uppercase">{post.titulo}</h2>
                  <p className="text-[1em] text-blclr9 dark:text-bldclr9 line-clamp-3 leading-relaxed font-body mb-6 italic">{post.extracto}</p>
                  <div className="mt-auto flex justify-between items-center"><span className="text-[1em] font-bold uppercase text-blclr10 dark:text-bldclr10 group-hover:translate-x-2 transition-transform duration-300 font-display">Leer más →</span></div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* ESTADOS DE CARGA Y VACÍO */}
        {loading && articulos.length === 0 && (
          <div className="py-20 text-center font-display uppercase italic text-blclr6 dark:text-bldclr6 tracking-widest">Buscando aventuras...</div>
        )}
        {!loading && articulos.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-xl font-display uppercase text-blclr6 dark:text-bldclr6 italic mb-4">No encontramos rastros de esa actividad</p>
            {metaKey && <p className="text-[0.8em] opacity-50 mb-4 uppercase tracking-widest font-bold">Criterio: {metaKey} = {metaValue}</p>}
            <button onClick={() => router.push('/blog')} className="text-blclr4 dark:text-bldclr4 font-bold uppercase border-b-2 border-blclr4 dark:border-bldclr4">Ver todo el contenido</button>
          </div>
        )}
        {loading && articulos.length > 0 && (
          <div className="py-12 text-center text-blclr6 dark:text-bldclr6 italic font-bold uppercase tracking-[0.3em] text-[0.8em]">Cargando más...</div>
        )}
        {!hasMore && articulos.length > 0 && (
          <div className="py-12 text-center text-blclr6 dark:text-bldclr6 font-black uppercase tracking-[0.2em] text-[0.8em]">Has llegado al final del camino</div>
        )}
      </main>
    </div>
  )
}
