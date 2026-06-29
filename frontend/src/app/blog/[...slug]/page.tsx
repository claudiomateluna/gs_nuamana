'use client'

import { useEffect, useState, use, useRef, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import SecondaryHeader from '@/components/SecondaryHeader'

const POSTS_PER_PAGE = 9

const ICON_URLS = {
  categoria: "https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/icono_category.svg",  
  unidad: "https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/icono_unidades.svg",     
  area: "https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/icono_area.svg",
  lugar: "https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/icono_lugar.svg",
  duracion: "https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/icono_duracion.svg",   
  cantidad: "https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/icono_participantes.svg",
  objetivos: "https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/icono_objetivos.svg", 
  pais: "https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/icono_pais.svg",
  nacimiento: "https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/icono_nacimiento.svg",
  defuncion: "https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/icono_fdefuncion.svg",
  calendario: "https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/iconos_Calendario.svg",
  variacion: "https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/icono_variacion.svg", 
  recomendacion: "https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/icono_recomendacion.svg",
  etiquetas: "https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/icono_categoriaa.svg" 
}

const UNIDADES = ['manada', 'compania', 'tropa', 'avanzada', 'clan']
const AREAS = ['corporalidad', 'creatividad', 'caracter', 'afectividad', 'sociabilidad', 'espiritualidad']      

const Icon = ({ url, className = "w-4 h-4" }: { url: string, className?: string }) => (
  <img src={url} alt="icon" className={`${className} inline-block dark:invert-[0.9]`} />
)

function BlogCatchAllContent({ params }: { params: { slug: string[] } }) {
  const searchParams = useSearchParams()
  const { slug: slugArray } = params
  const lastSlug = slugArray[slugArray.length - 1]
  const currentPath = slugArray.join('/')

  const [articulo, setArticulo] = useState<any>(null)
  const [categoria, setCategoria] = useState<any>(null)
  const [postsCategoria, setPostsCategoria] = useState<any[]>([])
  const [pathCategorias, setPathCategorias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error404, setError404] = useState(false)

  // Infinite Scroll & Filtros
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [search, setSearch] = useState('')
  const [selUnidad, setSelUnidad] = useState('')
  const [selArea, setSelArea] = useState('')

  const observer = useRef<IntersectionObserver | null>(null)
  const lastPostRef = useCallback((node: any) => {
    if (loading || loadingMore) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, loadingMore, hasMore])

  const fetchData = async (pageNum: number = 0, isNewFilter: boolean = false) => {
    if (pageNum === 0) setLoading(true)
    else setLoadingMore(true)

    const { data: allCats } = await supabase.from('categorias').select('*')

    const buildCatPathSlugs = (catId: number): string[] => {
      const cat = allCats?.find(c => c.id === catId)
      if (!cat) return []
      return cat.parent_id ? [...buildCatPathSlugs(cat.parent_id), cat.slug] : [cat.slug]
    }

    const buildFullPath = (catId: number): any[] => {
      const c = allCats?.find(x => x.id === catId); if (!c) return [];
      return c.parent_id ? [...buildFullPath(c.parent_id), c] : [c]
    }

    // 1. INTENTAR BUSCAR COMO ARTÍCULO
    if (pageNum === 0) {
      const { data: art } = await supabase
        .from('articulos')
        .select(`*, articulo_categorias(categoria_id, categorias(id, nombre, slug, parent_id)), articulo_resenas(*, perfiles(nombres, apellidos, fecha_nacimiento, unidades(nombre)))`)
        .eq('slug', lastSlug)
        .maybeSingle()

      if (art) {
        const linkedCats = art.articulo_categorias?.map((ac: any) => ac.categorias).filter(Boolean) || []       
        const allPossiblePaths = linkedCats.map((c: any) => [...buildCatPathSlugs(c.id), art.slug].join('/'))   

        if (allPossiblePaths.includes(currentPath)) {
          if (art.metadata?.objetivos_educativos?.length > 0) {
            const ids = art.metadata.objetivos_educativos.map((o: any) => o.id)
            const { data: fullObjs } = await supabase
              .from('progresion_objetivos')
              .select('id, texto_terminal, rango_edad, unidad:unidades(colores)')
              .in('id', ids)
            
            if (fullObjs) {
              art.metadata.objetivos_educativos = art.metadata.objetivos_educativos.map((o: any) => {
                const full = fullObjs.find((f: any) => f.id === o.id) as any
                return full ? { ...o, texto_terminal: full.texto_terminal, rango_edad: full.rango_edad, color: full.unidad?.colores?.primario } : o
              })
            }
          }
          setArticulo(art)
          const sortedCats = [...linkedCats].sort((a, b) => buildCatPathSlugs(b.id).length - buildCatPathSlugs(a.id).length)
          const matchingCat = sortedCats.find((c: any) => currentPath.startsWith(buildCatPathSlugs(c.id).join('/')))

          if (matchingCat) {
            setPathCategorias(buildFullPath(matchingCat.id))
          }
          setLoading(false)
          return
        }
      }
    }

    // 2. INTENTAR BUSCAR COMO CATEGORÍA
    const cat = allCats?.find(c => c.slug === lastSlug)
    if (cat) {
      const expectedCatPath = buildCatPathSlugs(cat.id).join('/')
      if (currentPath === expectedCatPath) {
        setCategoria(cat)
        const getDescendants = (parentId: number): number[] => {
          const children = allCats?.filter(c => c.parent_id === parentId).map(c => c.id) || []
          let descendants = [...children]; children.forEach(id => descendants = [...descendants, ...getDescendants(id)])
          return descendants
        }
        const allIds = [cat.id, ...getDescendants(cat.id)]

        let query = supabase
          .from('articulos')
          .select(`*, articulo_categorias!inner(categoria_id)`, { count: 'exact' })
          .in('articulo_categorias.categoria_id', allIds)
          .eq('estado', 'publicado')
          .order('created_at', { ascending: false })

        if (search) query = query.ilike('titulo', `%${search}%`)
        if (selUnidad) query = query.contains('metadata', { unidades: [selUnidad] })
        if (selArea) query = query.contains('metadata', { areas: [selArea] })

        const from = pageNum * POSTS_PER_PAGE
        const { data: arts } = await query.range(from, from + POSTS_PER_PAGE - 1)

        if (arts) {
          const processedArts = arts.map(post => {
            const fullPath = `/blog/${currentPath}/${post.slug}`
            return { ...post, fullPath }
          })
          setPostsCategoria(prev => isNewFilter ? processedArts : [...prev, ...processedArts])
          setHasMore(arts.length === POSTS_PER_PAGE)
        }

        if (pageNum === 0) {
          setPathCategorias(buildFullPath(cat.id))
        }
        setLoading(false)
        setLoadingMore(false)
        return
      }
    }

    setError404(true)
    setLoading(false)
    setLoadingMore(false)
  }

  // Leer parámetros de URL para filtros internos
  useEffect(() => {
    const s = searchParams.get('q')
    const u = searchParams.get('unidades')
    const a = searchParams.get('areas')
    if (s) setSearch(s)
    if (u) setSelUnidad(u)
    if (a) setSelArea(a)
  }, [searchParams])

  useEffect(() => { fetchData(0, true) }, [lastSlug, currentPath, search, selUnidad, selArea])

  useEffect(() => {
    if (page > 0) fetchData(page)
  }, [page])

  if (loading) return <div className="p-20 text-center font-body text-clr2 italic tracking-widest text-[0.8em] uppercase">Explorando...</div>
  if (error404) return <div className="p-20 text-center font-body text-clr2 font-black uppercase tracking-tighter text-2xl text-clr7">404: Ruta no válida</div>

  const Breadcrumbs = () => (
    <nav className="text-[1em] uppercase text-clr5 dark:text-dclr2 mb-8 flex gap-2 items-center flex-wrap">     
      <Link href="/blog" className="hover:text-clr7">Bitácora</Link>
      {pathCategorias.map((cat, i) => (
        <span key={cat.id} className="flex gap-2 items-center">
          <span className="text-clr5 dark:text-dclr2">●</span>
          <Link href={`/blog/${pathCategorias.slice(0, i+1).map(c => c.slug).join('/')}`} className="hover:text-clr7 opacity-70">{cat.nombre}</Link>
        </span>
      ))}
    </nav>
  )

  if (categoria) {
    const isActividades = currentPath.includes('actividades')
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-clr4 font-body">
        <SecondaryHeader />
        <main className="max-w-[1080px] mx-auto px-2 py-32">
          <Breadcrumbs />
          <header className="mb-12"><h1 className="text-[1em] font-bold font-display uppercase text-clr4 dark:text-dclr2">{categoria.nombre}</h1></header>

          <div className="bg-white dark:bg-clr5 p-2 rounded-3xl shadow-sm mb-12 grid grid-cols-1 md:grid-cols-3 gap-4 border border-zinc-100 dark:border-clr3">
            <input
              type="text" placeholder="🔍 Buscar en esta sección..."
              className="p-3 rounded-2xl border bg-zinc-50 dark:bg-clr5 font-bold text-[0.8em]"
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
            {isActividades && (
              <>
                <select className="p-3 rounded-2xl border bg-zinc-50 dark:bg-clr5 font-bold text-[0.8em]" value={selUnidad} onChange={(e) => setSelUnidad(e.target.value)}>
                  <option value="">Unidad (Todas)</option>
                  {UNIDADES.map(u => <option key={u} value={u}>{u.toUpperCase()}</option>)}
                </select>
                <select className="p-3 rounded-2xl border bg-zinc-50 dark:bg-clr5 font-bold text-[0.8em]" value={selArea} onChange={(e) => setSelArea(e.target.value)}>
                  <option value="">Área (Todas)</option>
                  {AREAS.map(a => <option key={a} value={a}>{a.toUpperCase()}</option>)}
                </select>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {postsCategoria.map((post: any, index: number) => {
              const isLast = postsCategoria.length === index + 1
              return (
                <Link
                  key={post.id}
                  href={post.fullPath}
                  ref={isLast ? lastPostRef : null}
                  className="group bg-white dark:bg-clr5 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-zinc-100 dark:border-clr3 flex flex-col h-full"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-clr5">
                    {post.imagen_destacada ? <img src={post.imagen_destacada} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt={post.titulo} /> : <div className="w-full h-full flex items-center justify-center text-zinc-300 opacity-20"><Icon url={ICON_URLS.categoria} className="w-12 h-12" /></div>}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="text-xl font-bold font-display leading-tight mb-3 group-hover:text-clr7 transition-colors uppercase dark:text-dclr2">{post.titulo}</h2>
                    <p className="text-[0.8em] text-zinc-500 dark:text-dclr2 line-clamp-3 leading-relaxed font-body">{post.extracto}</p>
                  </div>
                </Link>
              )
            })}
          </div>

          {loadingMore && (
            <div className="py-12 text-center text-clr2 italic font-bold uppercase tracking-[0.3em] text-[0.8em]">Cargando más...</div>
          )}
        </main>
      </div>
    )
  }

  if (articulo) {
    const metadata = articulo.metadata || {}
    const contenidoLimpio = (articulo.contenido || '').replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ').replace(/&shy;/g, '').replace(/\u00AD/g, '').replace(/\u200B/g, '')

    const RowMeta = ({ label, value, iconUrl, metaKey }: { label: string, value: any, iconUrl: string, metaKey?: string }) => {
      if (!value || (Array.isArray(value) && value.length === 0)) return null
      const items = Array.isArray(value) ? value : [value]
      return (
        <div className="flex gap-2 items-center py-0.5">
          <div className="flex items-center gap-2 min-w-[190px] shrink-0">
            <Icon url={iconUrl} />
            <span className="font-bold text-clr6 uppercase text-[0.9em] font-display">{label}:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {items.map((it, i) => (
              <span key={i} className="text-[1em] text-clr4 dark:text-dclr2 capitalize">
                {metaKey ? <Link href={`/blog?meta_key=${metaKey}&meta_value=${it}`} className="hover:text-clr7">{it}</Link> : it}
                {i < items.length - 1 && <span className="text-clr2">, </span>}
              </span>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-white dark:bg-clr4 text-clr4 dark:text-clr1 font-body pb-20">
        <SecondaryHeader />
        <main className="max-w-[1080px] mx-auto px-6 py-32">
          <Breadcrumbs />
          <header className="flex flex-col lg:flex-row gap-12 lg:items-center mb-16">
            <div className="w-full lg:w-[30%] shrink-0">
              {articulo.imagen_destacada ? <img src={articulo.imagen_destacada} alt={articulo.titulo} className="w-full h-auto aspect-square object-cover rounded-[2rem] shadow-2xl border-2 border-clr10 dark:border-zinc-800" /> : <div className="w-full aspect-square bg-clr9 dark:bg-zinc-900 rounded-[2rem] border-2 border-dashed border-clr10" />}
            </div>
            <div className="w-full lg:w-[70%]">
              <div className="flex items-center gap-2 mb-2">
                <Icon url={ICON_URLS.categoria} />
                <span className="text-[0.8em] text-clr7 uppercase tracking-wider font-display">Categorías: {articulo.articulo_categorias?.map((c: any) => c.categorias.nombre).join(', ')}</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-display font-bold leading-none text-clr4 dark:text-dclr2 uppercase my-0 py-0">{articulo.titulo}</h1>
              <div className="mt-6 space-y-0.5">
                <RowMeta label="Unidad" value={metadata.unidades} iconUrl={ICON_URLS.unidad} metaKey="unidades" />
                <RowMeta label="Área de Desarrollo" value={metadata.areas || metadata.areas_desarrollo} iconUrl={ICON_URLS.area} metaKey="areas" />
                <RowMeta label="Lugar" value={metadata.lugares || metadata.lugar} iconUrl={ICON_URLS.lugar} metaKey="lugares" />
                <RowMeta label="Duración" value={metadata.duracion} iconUrl={ICON_URLS.duracion} metaKey="duracion" />
                <RowMeta label="Cantidad" value={metadata.cantidad} iconUrl={ICON_URLS.cantidad} metaKey="cantidad" />
                <RowMeta label="Objetivos" value={metadata.objetivos} iconUrl={ICON_URLS.objetivos} metaKey="objetivos" />
                <RowMeta label="Lugar de Nacimiento" value={metadata.lugar_nacimiento} iconUrl={ICON_URLS.lugar} metaKey="lugar_nacimiento" />
                <RowMeta label="País de Nacimiento" value={metadata.pais_nacimiento} iconUrl={ICON_URLS.pais} metaKey="pais_nacimiento" />
                <RowMeta label="Fecha Nacimiento" value={metadata.fecha_nacimiento} iconUrl={ICON_URLS.calendario} />
                <RowMeta label="Lugar del Hecho" value={metadata.lugar_hecho} iconUrl={ICON_URLS.lugar} metaKey="lugar_hecho" />
                <RowMeta label="País del Hecho" value={metadata.pais_hecho} iconUrl={ICON_URLS.pais} metaKey="pais_hecho" />
                <RowMeta label="Año del Hecho" value={metadata.ano_hecho} iconUrl={ICON_URLS.calendario} metaKey="ano_hecho" />
              </div>
            </div>
          </header>
          <article className="blog-content dark:text-dclr2 w-full mb-10 text-[1.125rem]"><div dangerouslySetInnerHTML={{ __html: contenidoLimpio }} /></article>
          <section className="space-y-12">

            {metadata.objetivos_educativos && metadata.objetivos_educativos.length > 0 && (
              <div className="p-2 bg-zinc-50 dark:bg-black/20 rounded-[1rem] shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🎯</span>
                  <h3 className="text-xl font-display font-bold text-clr5 dark:text-white uppercase my-0">Objetivos Educativos</h3>
                </div>
                <div className="flex flex-col gap-2">
                  {Object.entries(
                    [...metadata.objetivos_educativos].sort((a: any, b: any) => {
                      const uMap: any = { 'Manada': 1, 'Compañía': 2, 'Tropa': 3, 'Avanzada': 4, 'Clan': 5 };
                      return (uMap[a.unidad] || 99) - (uMap[b.unidad] || 99);
                    }).reduce((acc: any, obj: any) => {
                    const term = obj.texto_terminal || 'Objetivos Específicos'
                    if (!acc[term]) acc[term] = []
                    acc[term].push(obj)
                    return acc
                  }, {})).map(([terminal, objs]: [string, any], idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                      <div className="p-4 border border-clr3 rounded-[1em]">
                        <h3 className="text-clr7 uppercase mb-[-4px]">🎯 Objetivo Terminal:</h3>
                        <div className="font-bold text-[1em] text-clr5 dark:text-clr2 leading-relaxed pb-2">
                          {terminal}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {objs.map((o: any, i: number) => (
                          <Link href={`/blog?obj_ed=${encodeURIComponent(o.texto)}`} key={i} className="group flex flex-col gap-1 p-3 bg-white dark:bg-black/40 rounded-xl shadow-sm border border-zinc-100 dark:border-clr4 hover:shadow-md transition-all cursor-pointer relative overflow-hidden pl-5">
                            <div className="absolute left-0 top-0 bottom-0 w-2" style={{ backgroundColor: o.color || '#ccc' }} />
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[0.8em] font-black uppercase tracking-widest" style={{ color: o.color || '#ccc' }}>{o.unidad}</span><span>•</span>
                              <span className="text-[0.8em] font-black uppercase text-zinc-400">{o.area}</span><span>•</span>
                              {o.rango_edad && <span className="text-[0.8em] font-black uppercase px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500">{o.rango_edad}</span>}
                              <span className="text-[0.8em] font-black uppercase text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">Filtrar →</span>
                            </div>
                            <p className="font-bold text-[1em] text-clr4 dark:text-white italic group-hover:opacity-70 transition-opacity">"{o.texto}"</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {metadata.variaciones && <div className="p-10 bg-clr9 dark:bg-zinc-900 rounded-[2.5rem] border-l-[12px] border-clr7 shadow-sm"><div className="flex items-center gap-3 mb-4"><Icon url={ICON_URLS.variacion} className="w-8 h-8" /><h3 className="text-2xl font-display font-bold text-clr7 uppercase my-0">Variaciones</h3></div><div className="italic opacity-90 blog-content">{metadata.variaciones}</div></div>}
            {metadata.recomendaciones && <div className="p-10 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] border-l-[12px] border-blue-600 shadow-sm"><div className="flex items-center gap-3 mb-4"><Icon url={ICON_URLS.recomendacion} className="w-8 h-8" /><h3 className="text-2xl font-display font-bold text-blue-600 uppercase my-0">Recomendaciones</h3></div><div className="blog-content">{metadata.recomendaciones}</div></div>}
            
            {/* SECCIÓN DE RESEÑAS SCOUTS */}
            {articulo.articulo_resenas && articulo.articulo_resenas.length > 0 && (
              <div className="p-2 bg-zinc-50 dark:bg-black/20 rounded-[2rem] border-2 border-zinc-100 dark:border-clr4 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-1">
                    <span className="text-3xl">⭐</span>
                    <h3 className="text-xl font-display font-bold text-clr5 dark:text-white uppercase my-0">Reseñas de la Actividad</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-black text-clr6">
                      {(articulo.articulo_resenas.reduce((acc: number, r: any) => acc + r.calificacion, 0) / articulo.articulo_resenas.length).toFixed(1)}
                    </span>
                    <span className="text-[0.8em] font-black uppercase opacity-40 leading-tight leading-none">Nota<br/>Media</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {articulo.articulo_resenas.map((res: any) => {
                    const profile = res.perfiles || {};
                    // Usamos los datos históricos capturados en la reseña
                    const unitLabel = res.unidad_resena || 'Scout';
                    const age = res.edad_resena || 0;
                    const uColor = res.unidad_color_resena || '#cb3327';
                    const uLogo = res.unidad_logo_resena;
                    
                    const displayName = res.es_anonimo ? 'ANÓNIMO' : `${profile.nombres} ${profile.apellidos}`;

                    return (
                      <div key={res.id} className="p-2 bg-white dark:bg-black/40 rounded-[1rem] border-2 shadow-sm flex flex-col gap-5 transition-all hover:shadow-2xl relative overflow-hidden group" style={{ borderColor: `${uColor}30` }}>
                        
                        {/* Fondo decorativo con logo de la unidad (Snapshot) */}
                        {uLogo && (
                          <div className="absolute -right-8 -bottom-8 opacity-[0.2] group-hover:opacity-[0.8] transition-all duration-500 pointer-events-none group-hover:scale-110 group-hover:-rotate-12">
                            <img src={uLogo} alt="" className="w-56 h-56 object-contain" />
                          </div>
                        )}

                        <div className="flex flex-col relative z-10 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                          <div className="text-[1em] font-bold text-center tracking-widest" style={{ color: res.es_anonimo ? '#666' : uColor }}>
                            {displayName.toUpperCase()}
                          </div>
                          <div className="flex items-center gap-3 flex-wrap justify-center">  
                            <div className="flex items-center gap-2 text-[0.8em] opacity-80 tracking-widest uppercase mt-[-6px]">
                              <span>{unitLabel}</span><span>•</span>
                              {age > 0 && <span>{age} AÑOS</span>}<span>•</span>
                              <span>
                                {format(new Date(res.created_at), 'dd/MM/yy')}
                              </span>
                            </div>
                          </div>
                              <div className="flex gap-1.5 items-center justify-center">
                                {[1, 2, 3, 4, 5, 6, 7].map(n => (
                                  <span key={n} className={`text-2xl transition-all ${res.calificacion >= n ? 'text-orange-500 drop-shadow-sm' : 'text-zinc-100'}`} style={{ color: uColor}}>★</span>
                                ))}
                                <span className="text-[1em] font-black px-1 py-1 rounded-full border shadow-inner" style={{ color: uColor, borderColor: `${uColor}80`, backgroundColor: `${uColor}10` }}>
                                  NOTA {res.calificacion}
                                </span>
                              </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                          
                          
                          {res.comentario && (
                            <div className="relative mt-2">
                              <p className="text-[1.05em] italic opacity-95 leading-relaxed dark:text-clr1 font-medium bg-zinc-50/50 dark:bg-black/30 p-6 rounded-[1.5rem] border-l-[8px] shadow-sm" style={{ borderLeftColor: uColor }}>
                                "{res.comentario}"
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {articulo.etiquetas?.length > 0 && <footer className="pt-12 border-t border-clr10 dark:border-zinc-800 flex flex-wrap gap-3 items-center"><div className="flex items-center gap-2 mr-4"><Icon url={ICON_URLS.etiquetas} className="w-5 h-5" /><span className="text-[0.8em] font-bold text-clr2 uppercase tracking-widest">Etiquetas:</span></div>{articulo.etiquetas.map((t: string) => (<Link key={t} href={`/blog?tag=${t}`} className="px-5 py-2 bg-clr10 dark:bg-zinc-800 rounded-full text-sm font-bold text-clr4 dark:text-clr1 hover:bg-clr7 hover:text-white transition-all shadow-sm">#{t}</Link>))}</footer>}
          </section>
        </main>
      </div>
    )
  }

  return null
}

export default function BlogCatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = use(params)
  return (
    <Suspense fallback={<div className="p-20 text-center font-display uppercase italic text-clr2">Explorando...</div>}>
      <BlogCatchAllContent params={resolvedParams} />
    </Suspense>
  )
}

