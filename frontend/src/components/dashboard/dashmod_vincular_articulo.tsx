'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface DashModVincularArticuloProps {
  isOpen: boolean
  onClose: () => void
  propuestaId: string
  onSuccess: () => void
}

export default function DashModVincularArticulo({ isOpen, onClose, propuestaId, onSuccess }: DashModVincularArticuloProps) {
  const [actividades, setActividades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedArticuloId, setSelectedArticuloId] = useState<string | null>(null)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedArea, setSelectedArea] = useState('')

  const AREAS = ['Corporalidad', 'Creatividad', 'Carácter', 'Afectividad', 'Sociabilidad', 'Espiritualidad']

  useEffect(() => {
    if (isOpen) fetchActividades()
  }, [isOpen])

  const fetchActividades = async () => {
    setLoading(true)
    try {
      // Obtener el ID de la categoría "Actividades" (ID 1)
      const { data: relaciones } = await supabase
        .from('articulo_categorias')
        .select('articulo_id')
        .eq('categoria_id', 1) 
        
      if (relaciones && relaciones.length > 0) {
        const articleIds = relaciones.map(r => r.articulo_id)
        
        const { data: arts } = await supabase
          .from('articulos')
          .select('id, titulo, extracto, imagen_destacada, metadata')
          .in('id', articleIds)
          .eq('estado', 'publicado')
          .order('created_at', { ascending: false })
          
        setActividades(arts || [])
      } else {
        setActividades([])
      }
    } catch (err) {
      console.error('Error fetching actividades:', err)
    } finally {
      setLoading(false)
    }
  }

  const normalizeStr = (str: string) => {
    if (!str) return ''
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
  }

  const filteredActividades = actividades.filter(art => {
    const matchSearch = art.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       (art.extracto && art.extracto.toLowerCase().includes(searchTerm.toLowerCase()))
    
    // Extraer áreas de los objetivos educativos anidados
    const objs = art.metadata?.objetivos_educativos || []
    const areasDeObjetivos = objs.map((o: any) => typeof o.area === 'object' ? o.area?.nombre : o.area)
    
    // Arreglo unificado de áreas (incluyendo soporte para esquemas legacy en la raíz de metadata)
    const areasArray = [
      ...areasDeObjetivos,
      ...(Array.isArray(art.metadata?.areas) ? art.metadata.areas : [art.metadata?.areas]),
      ...(Array.isArray(art.metadata?.areas_desarrollo) ? art.metadata.areas_desarrollo : [art.metadata?.areas_desarrollo])
    ].filter(Boolean)

    // Normalizar la comparación para ignorar mayúsculas y acentos
    const normalizedSelectedArea = normalizeStr(selectedArea)
    const matchArea = !selectedArea || areasArray.some(a => normalizeStr(a) === normalizedSelectedArea)
    
    return matchSearch && matchArea
  })

  const handleVincular = async () => {
    if (!selectedArticuloId) return alert('Selecciona una actividad de la lista.')
    
    setSaving(true)
    try {
      const { error } = await supabase
        .from('ciclo_propuestas')
        .update({ articulo_id: selectedArticuloId })
        .eq('id', propuestaId)
        
      if (error) throw error
      onSuccess()
      onClose()
    } catch (err: any) {
      alert('Error al vincular: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[130] flex items-center justify-center p-2 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-clr5 w-full max-w-4xl rounded-[1rem] p-2 md:p-2 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-start mb-8 border-b dark:border-clr4 pb-4">
          <div>
            <h2 className="text-3xl font-black font-display uppercase text-clr6 tracking-tighter">
              📝 Vincular Ficha de Planificación
            </h2>
            <p className="text-sm opacity-60 font-medium italic mt-2">
              Asocia esta propuesta a una Ficha de Actividad existente en el sistema.
            </p>
          </div>
          <button onClick={onClose} className="text-2xl opacity-40 hover:opacity-100 transition-all">✕</button>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
            <p className="text-sm font-bold text-blue-800 dark:text-blue-300">
              ¿Aún no has diseñado la actividad?
            </p>
            <a 
              href="/blog/crear" 
              target="_blank"
              className="px-6 py-2 bg-blue-600 text-white text-xs font-black uppercase rounded-xl hover:bg-blue-700 transition-all shadow-md tracking-widest"
            >
              ✍️ Redactar Nueva Ficha
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-zinc-50 dark:bg-black/20 p-2 rounded-[1rem] border border-zinc-100 dark:border-clr4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="🔍 Buscar por nombre..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-4 rounded-xl border bg-white dark:bg-clr3 font-bold text-sm focus:ring-2 ring-clr6 outline-none transition-all"
              />
            </div>
            <div className="relative">
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full p-3 rounded-xl border bg-white dark:bg-clr3 font-black text-[1em] uppercase tracking-widest focus:ring-2 ring-clr6 outline-none transition-all"
              >
                <option value="">Todas las Áreas</option>
                {AREAS.map(a => <option key={a} value={a}>{a.toUpperCase()}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-2 text-center animate-pulse uppercase tracking-widest text-[0.8em]">Buscando actividades en la biblioteca...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredActividades.length > 0 ? (
                filteredActividades.map(art => (
                  <div 
                    key={art.id}
                    onClick={() => setSelectedArticuloId(art.id)}
                    className={`p-2 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                      selectedArticuloId === art.id 
                        ? 'border-clr6 bg-clr6/5 shadow-md scale-[1.02]' 
                        : 'border-zinc-100 dark:border-clr4 bg-zinc-50 dark:bg-black/10 hover:border-clr6/30'
                    }`}
                  >
                    <div className="flex gap-2">
                      {art.imagen_destacada ? (
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                          <img src={art.imagen_destacada} className="w-full h-full object-cover" alt={art.titulo} />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-zinc-200 dark:bg-clr4 flex items-center justify-center shrink-0">
                          <span className="text-2xl">📋</span>
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold uppercase text-[1em] leading-tight text-clr5 dark:text-clr1">{art.titulo}</h4>
                        <p className="text-[0.8em] opacity-60 italic line-clamp-2 mt-1">{art.extracto}</p>
                      </div>
                    </div>
                    {selectedArticuloId === art.id && (
                      <div className="text-center mt-2">
                        <span className="px-3 py-1 bg-clr6 text-white text-[9px] font-black uppercase rounded-full tracking-widest shadow-sm">
                          Seleccionada
                        </span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-20 text-center border-4 border-dashed rounded-[2rem] opacity-30">
                  <span className="text-5xl block mb-4">📚</span>
                  <p className="text-xl font-black uppercase">No hay actividades publicadas</p>
                  <p className="font-medium italic">Debes crear una Ficha de Actividad en el módulo de Artículos.</p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4 pt-6 border-t dark:border-clr4">
            <button 
              type="button" 
              onClick={handleVincular}
              disabled={saving || !selectedArticuloId}
              className="flex-1 py-5 bg-clr6 text-white font-black font-display uppercase rounded-[1.5rem] shadow-xl hover:brightness-110 active:scale-95 transition-all tracking-widest disabled:opacity-50"
            >
              {saving ? '⌛ Guardando...' : '🔗 Vincular Ficha'}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="px-8 py-5 bg-zinc-100 dark:bg-clr4 text-clr2 rounded-[1.5rem] font-bold uppercase tracking-widest"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
