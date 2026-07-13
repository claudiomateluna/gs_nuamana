'use client'

import { useEffect, useState, useRef, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import SecondaryHeader from '@/components/SecondaryHeader'

const POSTS_PER_PAGE = 9

// Normalizado para coincidir exactamente con los valores en la base de datos
const UNIDADES = ['manada', 'compania', 'tropa', 'avanzada', 'clan']
const AREAS = ['corporalidad', 'creatividad', 'caracter', 'afectividad', 'sociabilidad', 'espiritualidad']

function BlogContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [articulos, setArticulos] = useState<any[]>([])
  const [allCategorias, setAllCategorias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  
  // Sincronización con URL (Fuente única de verdad para los filtros)
  const search = searchParams.get('q') || ''
  const selCat = searchParams.get('category') || 'todas'
  const selUnidad = searchParams.get('unidades') || ''
  const selArea = searchParams.get('areas') || ''
  const tagFilter = searchParams.get('tag') || ''
  const metaKey = searchParams.get('meta_key') || ''
  const metaValue = searchParams.get('meta_value') || ''
  const objEdFilter = searchParams.get('obj_ed') || ''

  const observer = useRef<IntersectionObserver | null>(null)
  const lastPostRef = useCallback((node: any) => {
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
    
    // Carga perezosa de categorías (solo una vez por sesión de navegación)
    let cats = allCategorias
    if (cats.length === 0) {
      const { data } = await supabase.from('categorias').select('*').order('nombre')
      cats = data || []
      setAllCategorias(cats)
    }
    
    const buildCatPathSlugs = (catId: number): string[] => {
      const cat = cats.find(c => c.id === catId)
      if (!cat) return []
      return cat.parent_id ? [...buildCatPathSlugs(cat.parent_id), cat.slug] : [cat.slug]
    }

    // Usamos inner join si hay categoría para filtrar en una sola consulta
    const selectStr = selCat !== 'todas' 
      ? `*, articulo_categorias!inner(categoria_id, categorias(id, nombre, slug, parent_id))`
      : `*, articulo_categorias(categoria_id, categorias(id, nombre, slug, parent_id))`

    let query = supabase
      .from('articulos')
      .select(selectStr)
      .eq('estado', 'publicado')
      .order('created_at', { ascending: false })
      .order('id', { ascending: true })

    if (search) query = query.ilike('titulo', `%${search}%`)
    if (selCat !== 'todas') query = query.eq('articulo_categorias.categoria_id', parseInt(selCat))

    // Filtros de metadatos JSONB (Lógica híbrida)
    if (selUnidad) query = query.contains('metadata', { unidades: [selUnidad] })
    if (selArea) query = query.contains('metadata', { areas: [selArea] })
    
    if (metaKey && metaValue) {
      // Algunos metadatos son arreglos (objetivos, lugares) y otros son strings (duracion, cantidad)
      // Usamos una consulta combinada: intentamos filtrar como string exacto O como elemento de arreglo
      query = query.or(`metadata->>${metaKey}.eq."${metaValue}",metadata->${metaKey}.cs.["${metaValue}"]`)
    }
    
    if (tagFilter) query = query.contains('etiquetas', [tagFilter])
    if (objEdFilter) query = query.ilike('metadata->>objetivos_educativos', `%${objEdFilter}%`)

    const from = pageNum * POSTS_PER_PAGE
    const to = from + POSTS_PER_PAGE - 1
    const { data } = await query.range(from, to)

    if (data) {
      const processed = data.map(post => {
        const linkedCats = post.articulo_categorias?.map((ac: any) => ac.categorias).filter(Boolean) || []
        // Encontrar la categoría más profunda para construir el breadcrumb
        const sortedCats = [...linkedCats].sort((a, b) => buildCatPathSlugs(b.id).length - buildCatPathSlugs(a.id).length)
        const mainCat = sortedCats[0]
        const path = mainCat ? `${buildCatPathSlugs(mainCat.id).join('/')}/${post.slug}` : `general/${post.slug}`
        return { ...post, path }
      })

      setArticulos(prev => isNewFilter ? processed : [...prev, ...processed])
      setHasMore(data.length === POSTS_PER_PAGE)
    }
    setLoading(false)
  }

  // Reiniciar búsqueda cuando cambian los parámetros de la URL
  useEffect(() => {
    setPage(0)
    fetchArticulos(0, true)
  }, [search, selCat, selUnidad, selArea, tagFilter, metaKey, metaValue, objEdFilter])

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

  const hasAnyFilter = search || selCat !== 'todas' || selUnidad || selArea || tagFilter || (metaKey && metaValue) || objEdFilter

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-clr4 font-body transition-colors">
      <SecondaryHeader />
      
      <main className="max-w-[1080px] mx-auto px-2 py-32">
        <header className="mb-16">
          <h1 className="text-4xl text-clr7 dark:text-dclr7 font-bold font-display uppercase">Bitácora Nua Mana</h1>
          <p className="text-[0.9em] text-clr2 dark:text-dclr8 uppercase tracking-wider">Explora nuestras actividades, técnicas e historia</p>
        </header>

        {/* BARRA DE FILTROS */}
        <div className="bg-clr9 dark:bg-clr5 rounded-3xl border border-zinc-100 dark:border-clr3 p-2 mb-2 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-2">
          <input 
            type="text" placeholder="🔍 Buscar..." 
            className="p-2 rounded-2xl border bg-zinc-50 dark:bg-clr4 text-[1em] focus:outline-clr7 transition-colors border-clr10 dark:border-dclr4 font-bold"
            defaultValue={search} onKeyDown={(e: any) => e.key === 'Enter' && updateURL('q', e.target.value)}
          />
          <select className="p-2 rounded-2xl border bg-zinc-50 dark:bg-clr4 text-[0.8em] focus:outline-clr7 transition-colors border-clr10 dark:border-dclr4 font-bold" value={selCat} onChange={(e) => updateURL('category', e.target.value)}>
            <option value="todas">Todas las Categorías</option>
            {allCategorias.map(c => <option key={c.id} value={c.id.toString()}>{c.nombre}</option>)}
          </select>
          <select className="p-2 rounded-2xl border bg-zinc-50 dark:bg-clr4 text-[0.8em] focus:outline-clr7 transition-colors border-clr10 dark:border-dclr4 font-bold" value={selUnidad} onChange={(e) => updateURL('unidades', e.target.value)}>
            <option value="">Unidad (Todas)</option>
            {UNIDADES.map(u => <option key={u} value={u}>{u === 'compania' ? 'COMPAÑÍA' : u.toUpperCase()}</option>)}
          </select>
          <select className="p-2 rounded-2xl border bg-zinc-50 dark:bg-clr4 text-[0.8em] focus:outline-clr7 transition-colors border-clr10 dark:border-dclr4 font-bold" value={selArea} onChange={(e) => updateURL('areas', e.target.value)}>
            <option value="">Área (Todas)</option>
            {AREAS.map(a => <option key={a} value={a}>{a.toUpperCase()}</option>)}
          </select>
        </div>

        {/* INDICADOR DE FILTROS ACTIVOS */}
        {hasAnyFilter && (
          <div className="flex flex-wrap gap-2 mb-8 px-2 items-center">
            <span className="text-[0.8em] font-bold text-clr2 uppercase tracking-widest mr-2">Filtrando por:</span>
            {tagFilter && <span className="bg-clr7 text-white px-3 py-1 rounded-full text-[0.8em] font-bold flex items-center gap-2 shadow-sm">#{tagFilter} <button onClick={() => updateURL('tag', '')} className="hover:text-clr3">✕</button></span>}
            {metaKey && metaValue && <span className="bg-clr6 text-white px-3 py-1 rounded-full text-[0.8em] font-bold flex items-center gap-2 shadow-sm">{metaKey}: {metaValue} <button onClick={() => { updateURL('meta_key', ''); updateURL('meta_value', '') }} className="hover:text-clr3">✕</button></span>}
            {objEdFilter && <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-[0.8em] font-bold flex items-center gap-2 shadow-sm truncate max-w-[300px]">🎯 {objEdFilter} <button onClick={() => updateURL('obj_ed', '')} className="hover:text-orange-200">✕</button></span>}
            {search && <span className="bg-clr3 text-white px-3 py-1 rounded-full text-[0.8em] font-bold flex items-center gap-2 shadow-sm">búsqueda: {search} <button onClick={() => updateURL('q', '')} className="hover:text-clr3">✕</button></span>}
            <button onClick={() => router.push('/blog')} className="text-[0.8em] font-bold text-clr7 hover:underline uppercase ml-2">Limpiar todo</button>
          </div>
        )}

        {/* GRILLA DE ARTÍCULOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articulos.map((post, index) => {
            const isLast = articulos.length === index + 1
            const mainCatName = post.articulo_categorias?.[0]?.categorias?.nombre || 'General'
            return (
              <Link key={post.id} href={`/blog/${post.path}`} ref={isLast ? lastPostRef : null} className="group bg-white dark:bg-clr5 rounded-[1em] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-zinc-100 dark:border-clr3 flex flex-col h-full">
                <div className="aspect-square relative overflow-hidden block">
                  {post.imagen_destacada ? <img src={post.imagen_destacada} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={post.titulo} /> : <div className="w-full h-full flex items-center justify-center text-zinc-300 opacity-20 text-4xl font-display uppercase italic">Nua Mana</div>}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <span className="text-[0.8em] text-clr7 uppercase font-bold">{mainCatName}</span>
                  <h2 className="text-[1.1em] font-bold font-display leading-tight mb-4 text-clr3 dark:text-dclr8 group-hover:text-clr6 transition-colors uppercase">{post.titulo}</h2>
                  <p className="text-[1em] text-clr5 dark:text-dclr2 line-clamp-3 leading-relaxed font-body mb-6 italic">{post.extracto}</p>
                  <div className="mt-auto flex justify-between items-center"><span className="text-[1em] font-bold uppercase text-clr6 group-hover:translate-x-2 transition-transform duration-300 font-display">Leer más →</span></div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* ESTADOS DE CARGA Y VACÍO */}
        {loading && articulos.length === 0 && (
          <div className="py-20 text-center font-display uppercase italic text-clr2 tracking-widest">Buscando aventuras...</div>
        )}
        {!loading && articulos.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-xl font-display uppercase text-clr2 italic mb-4">No encontramos rastros de esa actividad</p>
            {metaKey && <p className="text-[0.8em] opacity-50 mb-4 uppercase tracking-widest font-bold">Criterio: {metaKey} = {metaValue}</p>}
            <button onClick={() => router.push('/blog')} className="text-clr7 font-bold uppercase border-b-2 border-clr7">Ver todo el contenido</button>
          </div>
        )}
        {loading && articulos.length > 0 && (
          <div className="py-12 text-center text-clr2 italic font-bold uppercase tracking-[0.3em] text-[0.8em]">Cargando más...</div>
        )}
        {!hasMore && articulos.length > 0 && (
          <div className="py-12 text-center text-zinc-300 font-black uppercase tracking-[0.2em] text-[0.8em]">Has llegado al final del camino</div>
        )}
      </main>
    </div>
  )
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-display uppercase italic text-clr2">Cargando bitácora...</div>}>
      <BlogContent />
    </Suspense>
  )
}
