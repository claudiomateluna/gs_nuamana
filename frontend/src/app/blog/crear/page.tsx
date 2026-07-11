'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { supabase } from '@/lib/supabase'
import dynamic from 'next/dynamic'
import 'suneditor/dist/css/suneditor.min.css'
import SecondaryHeader from '@/components/SecondaryHeader'
import { uploadToStorage } from '@/lib/storage-utils'
import { processArticleImage } from '@/lib/image-utils'

const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false })

const DURACIONES = [
  '05 minutos', '10 minutos', '15 minutos', '20 minutos', '25 minutos', '30 minutos', 
  '35 minutos', '40 minutos', '45 minutos', '50 minutos', '55 minutos', '60 minutos', 
  '90 minutos', '120 minutos', '180 minutos', 'todo el día'
]

const PARTICIPANTES = [
  'individual', '02 participantes', '04 participantes', '06 participantes', '08 participantes', 
  '10 participantes', '12 participantes', '16 participantes', '24 participantes', '32 participantes'
]

const LUGARES_TREE = [
  { name: 'Exterior', children: [{ name: 'Campo Abierto', children: ['Bosque', 'Cerro', 'Río', 'Montaña'] }, { name: 'Campo Delimitado', children: ['Cancha', 'Piscina'] }] },
  { name: 'Interior', children: ['Bus', 'Gimnacio', 'Sala', 'Salón'] }
]

const UNIT_MAP: Record<string, number> = { 'manada': 1, 'compañía': 2, 'tropa': 3, 'avanzada': 4, 'clan': 5 }
const AREA_MAP: Record<string, number> = { 'corporalidad': 1, 'creatividad': 2, 'carácter': 3, 'afectividad': 4, 'sociabilidad': 5, 'espiritualidad': 6 }

export default function CrearArticuloPage() {
  const [categorias, setCategorias] = useState<any[]>([])
  const [sugerencias, setSugerencias] = useState({ objetivos: [] as string[], materiales: [] as string[], lugares: [] as string[], paises: [] as string[], etiquetas: [] as string[] })
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url')
  const [mounted, setMounted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Estados para Objetivos Educativos
  const [objsDisponibles, setObjsDisponibles] = useState<any[]>([])
  const [selectedObjsEd, setSelectedObjsEd] = useState<any[]>([])
  const [searchObj, setSearchObj] = useState('')
  const [fetchingObjs, setFetchingObjs] = useState(false)
  
  const { register, handleSubmit, watch, setValue, getValues } = useForm({
    defaultValues: {
      titulo: '', contenido: '', extracto: '', imagen_destacada: '',
      categorias_ids: [] as string[], etiquetas_input: '',
      unidades: [] as string[], areas: [] as string[], lugares: [] as string[],
      justificacion_areas: '',
      materiales: '', objetivos_input: '', participantes: PARTICIPANTES[1],
      duracion: DURACIONES[5], cantidad: PARTICIPANTES[1],
      variaciones: '', recomendaciones: '',
      lugar_nacimiento: '', pais_nacimiento: '', fecha_nacimiento: '', fecha_defuncion: '',
      lugar_hecho: '', pais_hecho: '', ano_hecho: ''
    }
  })
  
  const selectedCatIds = watch('categorias_ids') || []
  const selectedUnits = watch('unidades') || []
  const selectedAreas = watch('areas') || []
  const contenido = watch('contenido') || ''
  const currentImage = watch('imagen_destacada')

  // Efecto para cargar objetivos educativos dinámicamente
  useEffect(() => {
    const fetchObjs = async () => {
      if (selectedUnits.length === 0 || selectedAreas.length === 0) {
        setObjsDisponibles([]);
        return;
      }

      setFetchingObjs(true)
      const unitIds = selectedUnits.map(u => UNIT_MAP[u.toLowerCase()]).filter(id => id)
      const areaIds = selectedAreas.map(a => AREA_MAP[a.toLowerCase()]).filter(id => id)

      try {
        const { data, error } = await supabase
          .from('progresion_objetivos')
          .select('*, area:progresion_areas(nombre), unidad:unidades(nombre, colores)')
          .in('unidad_id', unitIds)
          .in('area_id', areaIds)
          .order('unidad_id', { ascending: true })
          .order('area_id', { ascending: true })
        
        if (error) throw error
        setObjsDisponibles(data || [])
      } catch (err) {
        console.error('Error fetching objectives:', err)
      } finally {
        setFetchingObjs(false)
      }
    }
    fetchObjs()
  }, [selectedUnits, selectedAreas])

  useEffect(() => {
    setMounted(true)
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return; }

      const { data: cats } = await supabase.from('categorias').select('*').order('nombre')
      setCategorias(cats || [])

      const params = new URLSearchParams(window.location.search)
      const preSelectedCat = params.get('categoria')
      if (preSelectedCat) {
        setValue('categorias_ids', [preSelectedCat])
      }
      const preSelectedUnidad = params.get('unidad')
      if (preSelectedUnidad) {
        setValue('unidades', [preSelectedUnidad.toLowerCase()])
      }

      const { data: arts } = await supabase.from('articulos').select('metadata, etiquetas')
      const s = { objetivos: new Set<string>(), materiales: new Set<string>(), lugares: new Set<string>(), paises: new Set<string>(), etiquetas: new Set<string>() }
      
      arts?.forEach(a => {
        const m = a.metadata || {}
        const rawObjs = m.objetivos;
        if (rawObjs) {
          if (Array.isArray(rawObjs)) rawObjs.forEach((o: string) => { if(o) s.objetivos.add(o.trim()) })
          else if (typeof rawObjs === 'string') rawObjs.split(',').forEach((o: string) => { if(o) s.objetivos.add(o.trim()) })
        }
        a.etiquetas?.forEach((t: string) => { if(t) s.etiquetas.add(t.trim()) })
        const rawMats = m.materiales;
        if (rawMats) {
          if (Array.isArray(rawMats)) rawMats.forEach((mat: string) => s.materiales.add(mat.trim()))
          else if (typeof rawMats === 'string') rawMats.split(',').forEach((mat: string) => s.materiales.add(mat.trim()))
        }
        if (m.lugar_nacimiento) s.lugares.add(String(m.lugar_nacimiento))
        if (m.lugar_hecho) s.lugares.add(String(m.lugar_hecho))
        if (m.pais_nacimiento) s.paises.add(String(m.pais_nacimiento))
        if (m.pais_hecho) s.paises.add(String(m.pais_hecho))
      })

      setSugerencias({
        objetivos: Array.from(s.objetivos).sort(),
        materiales: Array.from(s.materiales).sort(),
        lugares: Array.from(s.lugares).sort(),
        paises: Array.from(s.paises).sort(),
        etiquetas: Array.from(s.etiquetas).sort()
      })
      setLoading(false)
    }
    checkAuth()
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const title = getValues('titulo') || 'Artículo'
      const selectedCatIds = getValues('categorias_ids') || []

      const getPrimaryCategoryName = (selectedIds: string[], allCats: any[]): string => {
        const ids = selectedIds.map(id => parseInt(id))
        const filteredCats = allCats.filter(c => {
          if (!ids.includes(c.id)) return false
          
          let current = c
          while (current?.parent_id) {
            const parent = allCats.find(p => p.id === current.parent_id)
            if (!parent) break
            current = parent
          }
          const rootName = current?.nombre?.toLowerCase() || ''
          return !['áreas de desarrollo', 'unidades', 'lugar de la actividad', 'duración de la actividad', 'cantidad de participantes'].includes(rootName)
        })

        const subCats = filteredCats.filter(c => c.parent_id !== null)
        if (subCats.length > 0) return subCats[0].nombre
        if (filteredCats.length > 0) return filteredCats[0].nombre
        return 'Scout'
      }

      const categoryName = getPrimaryCategoryName(selectedCatIds, categorias)

      const processedFile = await processArticleImage(file, title, categoryName)

      const publicUrl = await uploadToStorage(processedFile, 'articulos', 'blog')
      setValue('imagen_destacada', publicUrl)
    } catch (err: any) {
      alert('Error al subir imagen: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleCatChange = (catId: number, isChecked: boolean) => {
    let currentIds = [...getValues('categorias_ids')]
    if (isChecked) {
      const addWithParents = (id: number) => {
        if (!currentIds.includes(id.toString())) {
          currentIds.push(id.toString())
          const cat = categorias.find(c => c.id === id)
          if (cat?.parent_id) addWithParents(cat.parent_id)
        }
      }
      addWithParents(catId)
    } else {
      currentIds = currentIds.filter(id => id !== catId.toString())
    }
    setValue('categorias_ids', currentIds)
  }

  const toggleObjEd = (obj: any) => {
    if (selectedObjsEd.find(o => o.id === obj.id)) {
      setSelectedObjsEd(selectedObjsEd.filter(o => o.id !== obj.id))
    } else {
      setSelectedObjsEd([...selectedObjsEd, { ...obj, como_se_cumple: '' }])
    }
  }

  const handleComoSeCumpleChange = (id: string, text: string) => {
    setSelectedObjsEd(prev => prev.map(o => o.id === id ? { ...o, como_se_cumple: text } : o))
  }

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Sesión expirada")
      const { data: perfil } = await supabase.from('perfiles').select('rol_id').eq('id', user.id).single()
      const puedePublicarDirecto = [1, 2, 3].includes(perfil?.rol_id || 0)
      const estadoFinal = puedePublicarDirecto ? 'publicado' : 'borrador'

      const { titulo, contenido, extracto, categorias_ids, etiquetas_input, objetivos_input, materiales, imagen_destacada, ...metas } = data
      const contenidoFinal = (contenido || '').replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ').trim();
      const textoLimpio = contenidoFinal.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
      const extractoAuto = extracto || (textoLimpio.substring(0, 160).trim() + (textoLimpio.length > 160 ? '...' : ''))
      
      const tags = etiquetas_input ? etiquetas_input.split(',').map((s: string) => s.trim()).filter((s: string) => s) : []
      const finalObjetivos = objetivos_input ? objetivos_input.split(',').map((s: string) => s.trim()).filter((s: string) => s) : []
      const finalMateriales = materiales ? materiales.split(',').map((s: string) => s.trim()).filter((s: string) => s) : []

      const metadataFinal = { 
        ...metas, 
        objetivos: finalObjetivos, 
        materiales: finalMateriales,
        objetivos_educativos: selectedObjsEd.map(o => ({ 
          id: o.id, 
          texto: o.texto_infantil, 
          unidad: o.unidad.nombre, 
          area: o.area.nombre,
          como_se_cumple: o.como_se_cumple || null
        }))
      }
      
      const slug = titulo.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')

      const { data: art, error } = await supabase.from('articulos').insert([{
        titulo, slug, contenido: contenidoFinal, extracto: extractoAuto, 
        metadata: metadataFinal, etiquetas: tags, imagen_destacada, 
        estado: estadoFinal, autor_id: user.id
      }]).select().single()

      if (error) throw error

      if (categorias_ids.length > 0) {
        const relations = categorias_ids.map((id: string) => ({ articulo_id: art.id, categoria_id: parseInt(id) }))
        await supabase.from('articulo_categorias').insert(relations)
      }

      // Guardar objetivos educativos en la tabla relacional
      if (selectedObjsEd.length > 0) {
        const objRelations = selectedObjsEd.map(o => ({
          articulo_id: art.id,
          objetivo_id: o.id,
          como_se_cumple: o.como_se_cumple || null
        }))
        const { error: relErr } = await supabase.from('articulo_objetivos_educativos').insert(objRelations)
        if (relErr) {
          console.error("Error al guardar objetivos educativos en tabla relacional:", relErr)
        }
      }

      if (puedePublicarDirecto) alert('¡Artículo publicado con éxito!');
      else alert('¡Recibido! Tu artículo ha sido enviado a revisión por la directiva.');
      window.location.href = '/blog'
    } catch (e: any) { alert('Error: ' + e.message) } finally { setLoading(false) }
  }

  if (!mounted || loading) return <div className="p-20 text-center font-body text-clr2 italic tracking-widest text-[0.8em] uppercase">Preparando el taller...</div>

  const hasAncestor = (catId: number, slug: string): boolean => {
    const cat = categorias.find(c => c.id === catId)
    if (!cat) return false
    if (cat.slug === slug) return true
    if (cat.parent_id) return hasAncestor(cat.parent_id, slug)
    return false
  }

  const isActividad = selectedCatIds.some(id => hasAncestor(parseInt(id), 'actividades'))
  const isBiografia = selectedCatIds.some(id => hasAncestor(parseInt(id), 'biografias'))
  const isHistoriaScout = selectedCatIds.some(id => hasAncestor(parseInt(id), 'historia-scout') || hasAncestor(parseInt(id), 'historias-scouts'))

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-clr4 font-body transition-colors">
      <SecondaryHeader />
      <main className="max-w-[1080px] mx-auto px-4 py-32">
        <div className="bg-white dark:bg-clr5 rounded-[1rem] p-4 shadow-2xl border border-clr10 dark:border-clr4 animate-in fade-in zoom-in duration-700">
          <h1 className="text-3xl font-black text-clr7 mb-8 uppercase tracking-tighter font-display border-b border-zinc-100 dark:border-clr4 pb-4">Nueva Entrada</h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3 space-y-4">
              <input {...register('titulo')} className="w-full text-3xl font-bold border-b border-zinc-100 dark:border-clr4 focus:border-clr7 outline-none py-2 font-display bg-transparent" placeholder="Título del artículo..." required />

              {isActividad && (
                <div className="p-4 bg-blue-50/50 dark:bg-black/20 rounded-3xl border border-blue-100 dark:border-blue-900/30 space-y-2">
                  <h2 className="text-blue-700 dark:text-blue-300 font-black text-[1em] uppercase tracking-widest font-display">Ficha de Actividad</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="space-y-2">
                      <label className="text-[1em] uppercase opacity-60 tracking-widest">Unidades</label>
                      <div className="space-y-1">
                        {['manada', 'compañía', 'tropa', 'avanzada', 'clan'].map(u => (
                          <label key={u} className="flex items-center gap-2 text-[1em] cursor-pointer capitalize font-bold"><input type="checkbox" value={u} {...register('unidades')} className="w-4 h-4 rounded text-blue-600" /> {u}</label>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[1em] uppercase opacity-60 tracking-widest">Áreas</label>
                      <div className="space-y-1">
                        {['afectividad', 'carácter', 'corporalidad', 'creatividad', 'espiritualidad', 'sociabilidad'].map(a => (
                          <label key={a} className="flex items-center gap-2 text-[1em] cursor-pointer capitalize font-bold"><input type="checkbox" value={a} {...register('areas')} className="w-4 h-4 rounded text-blue-600" /> {a}</label>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[1em] uppercase opacity-60 tracking-widest">Lugar</label>
                      <div className="h-[250px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {LUGARES_TREE.map(p => (
                          <div key={p.name} className="space-y-2">
                            <label className="flex items-center gap-2 text-[1em] font-black text-blue-700 dark:text-blue-300 uppercase cursor-pointer"><input type="checkbox" value={p.name} {...register('lugares')} className="w-4 h-4 rounded" /> {p.name}</label>
                            <div className="ml-2 space-y-2 border-l-2 border-blue-100 dark:border-blue-900/30 pl-3">
                              {p.children.map((c: any) => typeof c === 'string' ? (
                                <label key={c} className="flex items-center gap-2 text-[0.9em] cursor-pointer font-bold"><input type="checkbox" value={c} {...register('lugares')} className="w-3.5 h-3.5 rounded" /> {c}</label>
                              ) : (
                                <div key={c.name} className="space-y-1">
                                  <label className="flex items-center gap-2 text-[0.9em] font-bold text-blue-500 uppercase cursor-pointer"><input type="checkbox" value={c.name} {...register('lugares')} className="w-3.5 h-3.5 rounded" /> {c.name}</label>
                                  <div className="ml-4 grid grid-cols-1 gap-1">
                                    {c.children.map((s: string) => (<label key={s} className="flex items-center gap-2 text-[1em] cursor-pointer"><input type="checkbox" value={s} {...register('lugares')} className="w-3 h-3 rounded" /> {s}</label>))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-1 md:col-span-3 space-y-1 pt-2">
                      <label className="text-[0.9em] uppercase opacity-60 block font-bold tracking-wider">Justificación de Selección de Áreas (Opcional)</label>
                      <textarea {...register('justificacion_areas')} placeholder="Explica por qué esta actividad aporta a las áreas de desarrollo seleccionadas..." className="w-full p-4 rounded-2xl border h-20 text-sm bg-white dark:bg-black/20 font-bold focus:border-clr7 outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-blue-100 dark:border-blue-900/30">
                    <div className="col-span-2">
                      <label className="text-[1em] uppercase opacity-60 block mb-1">Objetivos (separados por coma)</label>
                      <input {...register('objetivos_input')} list="objs-list" placeholder="Liderazgo, Trabajo en equipo..." className="w-full p-4 rounded-2xl border bg-white dark:bg-black/20 text-sm font-bold" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[1em] uppercase opacity-60 block mb-1">Materiales necesarios (separados por coma)</label>
                      <input {...register('materiales')} list="mats-list" placeholder="Cuerdas, Pañolines..." className="w-full p-4 rounded-2xl border bg-white dark:bg-black/20 text-sm font-bold" />
                    </div>
                    <div><label className="text-[1em] uppercase opacity-60 block mb-1">Duración</label><select {...register('duracion')} className="w-full p-4 rounded-2xl border bg-white dark:bg-black/20 text-sm font-bold">{DURACIONES.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                    <div><label className="text-[1em] uppercase opacity-60 block mb-1">Participantes</label><select {...register('cantidad')} className="w-full p-4 rounded-2xl border bg-white dark:bg-black/20 text-sm font-bold">{PARTICIPANTES.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                    <div className="col-span-2"><textarea {...register('variaciones')} placeholder="Variaciones..." className="w-full p-4 rounded-2xl border h-24 text-sm bg-white dark:bg-black/20 font-bold" /></div>
                    <div className="col-span-2"><textarea {...register('recomendaciones')} placeholder="Recomendaciones..." className="w-full p-4 rounded-2xl border h-24 text-sm bg-white dark:bg-black/20 font-bold" /></div>
                  </div>

                  {/* SECCIÓN DE OBJETIVOS EDUCATIVOS DINÁMICOS */}
                  <div className="mt-4 pt-4 border-t border-blue-100 dark:border-blue-900/30 space-y-6">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <h2 className="text-blue-700 dark:text-blue-300 font-black text-[1em] uppercase tracking-widest font-display">Objetivos Educativos del Programa</h2>
                        <p className="text-[0.9em] text-zinc-400 uppercase font-bold italic">Selecciona los objetivos que se trabajan en esta actividad</p>
                      </div>
                      {selectedObjsEd.length > 0 && (
                        <span className="px-3 py-1 bg-clr7 text-white text-[0.9em] font-black rounded-full shadow-md animate-bounce">
                          {selectedObjsEd.length} SELECCIONADOS
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <input 
                        type="text" 
                        value={searchObj}
                        onChange={e => setSearchObj(e.target.value)}
                        placeholder="🔍 Buscar en los objetivos desplegados..."
                        className="w-full p-4 pl-4 rounded-2xl border bg-white dark:bg-black/20 text-[1em] font-bold focus:ring-2 ring-blue-500 transition-all outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {fetchingObjs ? (
                        <div className="col-span-2 py-10 text-center animate-pulse text-xs font-black uppercase opacity-40">Consultando manuales...</div>
                      ) : objsDisponibles.length > 0 ? (
                        Object.entries(
                          objsDisponibles
                            .filter(o => o.texto_infantil.toLowerCase().includes(searchObj.toLowerCase()) || o.area.nombre.toLowerCase().includes(searchObj.toLowerCase()))
                            .reduce((acc: any, obj: any) => {
                              const term = obj.texto_terminal || 'Objetivos Específicos'
                              if (!acc[term]) acc[term] = []
                              acc[term].push(obj)
                              return acc
                            }, {})
                        ).map(([terminal, objs]: [string, any], idx) => (
                          <div key={idx} className="col-span-1 md:col-span-2 flex flex-col gap-3 mt-4 first:mt-0">
                            <h4 className="font-bold text-[0.9em] text-clr5 dark:text-clr2 leading-relaxed border-b border-zinc-200 dark:border-zinc-800 pb-2 uppercase tracking-widest">
                              🎯 {terminal}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {objs.map((obj: any) => {
                                const isSelected = selectedObjsEd.find((s: any) => s.id === obj.id)
                                const unitColor = obj.unidad?.colores?.primario || '#ccc'
                                return (
                                  <div
                                    key={obj.id}
                                    onClick={() => toggleObjEd(obj)}
                                    style={{ borderLeftColor: unitColor }}
                                    className={`p-4 rounded-2xl border-2 border-l-4 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 flex flex-col gap-2 ${isSelected ? 'bg-zinc-50 dark:bg-clr4 border-clr7' : 'bg-white dark:bg-black/10 border-zinc-100 dark:border-clr4 opacity-80 hover:opacity-100'}`}
                                  >
                                    <div className="flex justify-between items-center relative">
                                      <span className="text-[0.9em] font-black uppercase px-2 py-0.5 rounded-md text-white shadow-sm" style={{ backgroundColor: unitColor }}>{obj.unidad.nombre}</span>
                                      <div className="flex items-center gap-2">
                                        {obj.texto_terminal && (
                                          <div className="relative group/tooltip flex items-center justify-center" onClick={(e) => { e.stopPropagation(); alert('🎯 OBJETIVO TERMINAL:\n\n' + obj.texto_terminal); }}>
                                            <span className="text-xl cursor-help opacity-50 hover:opacity-100 transition-opacity" title="Ver Objetivo Terminal (Clic en móvil)">🎯</span>
                                            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:group-hover/tooltip:block w-80 max-w-[90vw] p-6 bg-zinc-900 text-white text-[0.9em] font-bold rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[9999] animate-in fade-in zoom-in duration-200 pointer-events-none text-center border border-zinc-800 flex flex-col items-center gap-3">
                                              <div className="flex flex-col items-center gap-1">
                                                <span className="text-clr7 uppercase tracking-widest block opacity-90 text-[0.8em] font-black">🎯 Objetivo Terminal</span>
                                              </div>
                                              <p className="leading-relaxed">{obj.texto_terminal}</p>
                                            </div>
                                          </div>
                                        )}
                                        <span className="text-[0.9em] font-black uppercase text-zinc-400">{obj.area.nombre}</span>
                                      </div>
                                    </div>
                                    <div className="text-center space-y-2 mt-2">
                                      <p className="text-[1em] leading-relaxed font-bold dark:text-clr1 italic">"{obj.texto_infantil}"</p>
                                      {obj.rango_edad && (
                                        <span className="inline-block px-3 py-1 rounded-full text-[0.8em] font-black uppercase tracking-widest bg-zinc-100 dark:bg-black/30 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-clr4">
                                          {obj.rango_edad}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 py-10 text-center border-2 border-dashed rounded-3xl opacity-30">
                          <p className="text-[0.8em] font-black uppercase">Selecciona al menos una Unidad y una Área para ver los objetivos.</p>
                        </div>
                      )}
                    </div>

                    {selectedObjsEd.length > 0 && (
                      <div className="flex flex-col gap-4 pt-4 border-t border-blue-100 dark:border-blue-900/30">
                        <h4 className="font-bold text-[0.9em] text-blue-700 dark:text-blue-300 uppercase tracking-widest">
                          ✍️ Detalles de Objetivos Seleccionados
                        </h4>
                        <div className="grid grid-cols-1 gap-4">
                          {selectedObjsEd.map(o => (
                            <div key={o.id} className="p-4 bg-zinc-50 dark:bg-black/20 rounded-2xl border border-zinc-200 dark:border-clr4 flex flex-col gap-3 relative">
                              <button 
                                type="button" 
                                onClick={() => toggleObjEd(o)} 
                                className="absolute right-4 top-4 text-red-500 hover:text-red-700 text-lg font-bold"
                                title="Quitar Objetivo"
                              >
                                ✕
                              </button>
                              <div className="flex items-center gap-2">
                                <span className="text-[0.8em] font-black uppercase px-2 py-0.5 rounded text-white" style={{ backgroundColor: o.unidad.colores.primario || '#ccc' }}>
                                  {o.unidad.nombre}
                                </span>
                                <span className="text-[0.8em] font-black text-zinc-400 uppercase">
                                  {o.area.nombre}
                                </span>
                              </div>
                              <p className="font-bold text-[1em] italic leading-relaxed text-zinc-800 dark:text-clr1">
                                "{o.texto_infantil}"
                              </p>
                              <div className="space-y-1">
                                <label className="text-[0.8em] font-black uppercase opacity-60 block">¿Cómo se cumple en esta actividad? (Opcional)</label>
                                <textarea 
                                  value={o.como_se_cumple || ''}
                                  onChange={e => handleComoSeCumpleChange(o.id, e.target.value)}
                                  placeholder="Describe de qué forma esta dinámica ayuda a cumplir este objetivo educativo..." 
                                  className="w-full p-3 rounded-xl border text-sm bg-white dark:bg-black/30 outline-none focus:border-clr7 font-bold h-16"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(isBiografia || isHistoriaScout) && (
                <div className="p-4 bg-red-50/50 dark:bg-black/20 rounded-3xl border border-red-100 dark:border-red-900/30 space-y-2">
                  <h2 className="text-red-700 dark:text-red-300 font-black text-xs uppercase tracking-widest font-display">{isBiografia ? 'Ficha Biográfica' : 'Ficha Histórica'}</h2>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {isBiografia ? (
                      <>
                        <div className="space-y-1"><label className="text-[0.9em] font-black uppercase opacity-40">Lugar de Nacimiento</label><input {...register('lugar_nacimiento')} list="places-list" className="w-full p-4 rounded-2xl border bg-white dark:bg-black/20 font-bold" /></div>
                        <div className="space-y-1"><label className="text-[0.9em] font-black uppercase opacity-40">País de Nacimiento</label><input {...register('pais_nacimiento')} list="paises-list" className="w-full p-4 rounded-2xl border bg-white dark:bg-black/20 font-bold" /></div>
                        <div className="space-y-1"><label className="text-[0.9em] font-black uppercase opacity-40">Fecha Nacimiento</label><input type="date" {...register('fecha_nacimiento')} className="w-full p-4 rounded-2xl border bg-white dark:bg-black/20 font-bold" /></div>
                        <div className="space-y-1"><label className="text-[0.9em] font-black uppercase opacity-40">Fecha Defunción</label><input type="date" {...register('fecha_defuncion')} className="w-full p-4 rounded-2xl border bg-white dark:bg-black/20 font-bold" /></div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-1"><label className="text-[0.9em] font-black uppercase opacity-40">Lugar del hecho</label><input {...register('lugar_hecho')} list="places-list" className="w-full p-4 rounded-2xl border bg-white dark:bg-black/20 font-bold" /></div>
                        <div className="space-y-1"><label className="text-[0.9em] font-black uppercase opacity-40">País del hecho</label><input {...register('pais_hecho')} list="paises-list" className="w-full p-4 rounded-2xl border bg-white dark:bg-black/20 font-bold" /></div>
                        <div className="space-y-1"><label className="text-[0.9em] font-black uppercase opacity-40">Año del hecho</label><input type="number" {...register('ano_hecho')} placeholder="YYYY" className="w-full p-4 rounded-2xl border bg-white dark:bg-black/20 font-bold" /></div>
                      </>
                    )}
                  </div>
                </div>
              )}

              <SunEditor setContents={contenido} onChange={(val) => setValue('contenido', val, { shouldDirty: true })} setOptions={{ height: '600', buttonList: [['undo', 'redo'], ['formatBlock', 'font', 'fontSize'], ['bold', 'underline', 'italic', 'strike'], ['fontColor', 'hiliteColor'], ['outdent', 'indent'], ['align', 'list', 'lineHeight'], ['table', 'link', 'image'], ['fullScreen', 'codeView'], ['preview']], defaultStyle: "font-family: var(--font-body); font-size: 1.1rem; line-height: 2;" }} />
            </div>

            <div className="space-y-4">
              <div className="p-2 bg-zinc-50 dark:bg-black/20 rounded-2xl border border-zinc-100 dark:border-clr4">
                <h3 className="text-[0.9em] font-black text-zinc-400 uppercase mb-4 tracking-widest font-display">Imagen Destacada</h3>
                <div className="flex bg-white dark:bg-black/40 p-1 rounded-xl mb-4 border dark:border-clr4">
                  <button type="button" onClick={() => setImageMode('url')} className={`flex-1 py-2 text-[1em] font-black uppercase rounded-lg transition-all ${imageMode === 'url' ? 'bg-clr7 text-white shadow-md' : 'opacity-40'}`}>🔗 URL</button>
                  <button type="button" onClick={() => setImageMode('upload')} className={`flex-1 py-2 text-[1em] font-black uppercase rounded-lg transition-all ${imageMode === 'upload' ? 'bg-clr7 text-white shadow-md' : 'opacity-40'}`}>📸 Subir</button>
                </div>
                {imageMode === 'url' ? (
                  <input {...register('imagen_destacada')} className="w-full p-3 rounded-xl border text-sm mb-4 bg-white dark:bg-black/20" placeholder="https://..." />
                ) : (
                  <div className="space-y-4 mb-4">
                    <button type="button" disabled={uploading} onClick={() => fileInputRef.current?.click()} className={`w-full py-4 border-2 border-dashed border-clr2 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white transition-all ${uploading ? 'animate-pulse opacity-50' : ''}`}>
                      <span className="text-3xl">{uploading ? '⏳' : '📤'}</span>
                      <span className="text-[0.9em] font-black uppercase text-clr2">{uploading ? 'Subiendo...' : 'Seleccionar Archivo'}</span>
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                    {currentImage && (
                      <button type="button" onClick={() => setValue('imagen_destacada', '')} className="text-[0.8em] font-black text-red-500 uppercase tracking-widest hover:underline block mx-auto">✕ Eliminar foto subida</button>
                    )}
                  </div>
                )}
                {currentImage && (
                  <div className="relative rounded-2x1 overflow-hidden shadow-lg border-2 border-white dark:border-clr4 animate-in fade-in zoom-in duration-300">
                    <img src={currentImage} className="w-full h-auto object-cover max-h-48" alt="Preview" />
                  </div>
                )}
              </div>

              <div className="p-2 bg-zinc-50 dark:bg-black/20 rounded-2xl border border-zinc-100 dark:border-clr4">
                <h3 className="text-[1em] font-black text-zinc-400 uppercase mb-6 tracking-widest font-display">Categorías</h3>
                <div className="space-y-4">
                  {categorias.filter(c => !c.parent_id && !['áreas de desarrollo', 'unidades', 'lugar de la actividad', 'duración de la actividad', 'cantidad de participantes'].includes(c.nombre.toLowerCase())).map(parent => (
                    <div key={parent.id} className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-[0.9em] dark:text-clr1"><input type="checkbox" checked={selectedCatIds.includes(parent.id.toString())} onChange={(e) => handleCatChange(parent.id, e.target.checked)} className="w-4 h-4 rounded text-clr7" /> {parent.nombre}</label>
                      <div className="ml-2 space-y-2 border-l-2 border-zinc-200 dark:border-clr4 pl-4">
                        {categorias.filter(c => c.parent_id === parent.id).map(child => (
                          <div key={child.id} className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer text-[0.9em] text-zinc-600 dark:text-clr2 hover:text-black dark:hover:text-white font-bold transition-colors"><input type="checkbox" checked={selectedCatIds.includes(child.id.toString())} onChange={(e) => handleCatChange(child.id, e.target.checked)} className="w-3.5 h-3.5 rounded text-clr7" /> {child.nombre}</label>
                            <div className="ml-2 space-y-1 border-l border-zinc-100 dark:border-clr4 pl-3">
                              {categorias.filter(c => c.parent_id === child.id).map(grandChild => (
                                <label key={grandChild.id} className="flex items-center gap-2 cursor-pointer text-[0.9em] text-zinc-400 hover:text-black transition-colors italic"><input type="checkbox" checked={selectedCatIds.includes(grandChild.id.toString())} onChange={(e) => handleCatChange(grandChild.id, e.target.checked)} className="w-3.5 h-3.5 rounded text-clr7" /> {grandChild.nombre}</label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-2 bg-zinc-50 dark:bg-black/20 rounded-2xl border border-zinc-100 dark:border-clr4">
                <h3 className="text-[1em] font-black text-zinc-400 uppercase mb-2 tracking-widest font-display">Etiquetas</h3>
                <input {...register('etiquetas_input')} list="tags-list" className="w-full p-3 rounded-xl border text-sm bg-white dark:bg-black/20" />
              </div>

              <button type="submit" disabled={loading} className="btn-save w-full py-6 bg-clr7 text-white font-black uppercase rounded-2xl shadow-2xl hover:brightness-110 active:scale-95 transition-all tracking-widest font-display text-sm">
                {loading ? '⌛ Creando...' : '🚀 Publicar Artículo'}
              </button>
            </div>
          </form>

          <datalist id="tags-list">{sugerencias.etiquetas.map(t => <option key={t} value={t} />)}</datalist>
          <datalist id="objs-list">{sugerencias.objetivos.map(o => <option key={o} value={o} />)}</datalist>
          <datalist id="mats-list">{sugerencias.materiales.map(m => <option key={m} value={m} />)}</datalist>
          <datalist id="places-list">{sugerencias.lugares.map(l => <option key={l} value={l} />)}</datalist>
          <datalist id="paises-list">{sugerencias.paises.map(p => <option key={p} value={p} />)}</datalist>
        </div>
      </main>
    </div>
  )
}
