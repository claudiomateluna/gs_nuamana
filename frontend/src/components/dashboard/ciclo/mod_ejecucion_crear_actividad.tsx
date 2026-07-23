'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { ArticuloMetadata } from '@/types'
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error-utils';

interface DashModCrearActividadFase4Props {
  isOpen: boolean
  onClose: () => void
  cicloId: string
  perfilId: string
  unidadNombre?: string
  onSuccess: () => void
}

interface ActividadListItem {
  id: string
  titulo: string
  extracto?: string | null
  imagen_destacada?: string | null
  metadata?: ArticuloMetadata | null
}

export default function DashModCrearActividadFase4({ isOpen, onClose, cicloId, perfilId, unidadNombre, onSuccess }: DashModCrearActividadFase4Props) {
  const [loading, setLoading] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fecha, setFecha] = useState('')

  const [actividades, setActividades] = useState<ActividadListItem[]>([])
  const [loadingArticulos, setLoadingArticulos] = useState(true)
  const [selectedArticuloId, setSelectedArticuloId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (isOpen) fetchActividades()
  }, [isOpen])

  const fetchActividades = async () => {
    setLoadingArticulos(true)
    try {
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
        
        let result = (arts || []) as ActividadListItem[]
        
        if (unidadNombre && result.length > 0) {
          const normalize = (s: string) => s?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim() || ''
          const unitNorm = normalize(unidadNombre)
          result = result.filter(a => {
            const objs = (a.metadata as Record<string, unknown>)?.objetivos_educativos as { unidad: string }[] | undefined
            if (!objs || objs.length === 0) return false
            return objs.some(o => normalize(o.unidad) === unitNorm)
          })
        }
        
        setActividades(result)
      } else {
        setActividades([])
      }
    } catch (err) {
      console.error('Error fetching actividades:', err)
    } finally {
      setLoadingArticulos(false)
    }
  }

  const normalizeStr = (str: string) => {
    if (!str) return ''
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  }

  const filteredActividades = actividades.filter(art => {
    const matchSearch = art.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       (art.extracto && art.extracto.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchSearch
  })

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titulo) { toast.warning('El título es obligatorio.'); return; }
    if (!fecha) { toast.warning('Debes seleccionar una fecha.'); return; }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('ciclo_propuestas')
        .insert({
          titulo,
          descripcion,
          ciclo_id: cicloId,
          autor_id: perfilId,
          seleccionada: true,
          fecha_programada: fecha,
          articulo_id: selectedArticuloId || null
        })

      if (error) throw error
      toast.success('Actividad creada correctamente')
      onSuccess()
      onClose()
      setTitulo('')
      setDescripcion('')
      setFecha('')
      setSelectedArticuloId(null)
    } catch (err: unknown) {
      toast.error('Error al crear actividad: ' + getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[130] flex items-center justify-center p-2 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-clr5 w-full max-w-2xl rounded-[2rem] p-4 md:p-4 shadow-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-black font-display uppercase text-clr7 tracking-tighter mb-6">
          🆕 Nueva Actividad
        </h2>

        <form onSubmit={handleCrear} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[1em] font-black uppercase opacity-60 ml-4 tracking-widest">Título</label>
            <input 
              required
              type="text" 
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              placeholder="Ej: Gran Juego de Rastreo..."
              className="w-full p-4 rounded-2xl border dark:border-clr4 bg-zinc-50 dark:bg-clr3 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[1em] font-black uppercase opacity-60 ml-4 tracking-widest">Descripción</label>
            <textarea 
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              placeholder="Describe brevemente la actividad..."
              className="w-full p-4 rounded-2xl border dark:border-clr4 bg-zinc-50 dark:bg-clr3 font-bold h-24"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[1em] font-black uppercase opacity-60 ml-4 tracking-widest">Fecha de Ejecución</label>
            <input 
              required
              type="date" 
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              className="w-full p-4 rounded-2xl border dark:border-clr4 bg-zinc-50 dark:bg-clr3 font-bold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[1em] font-black uppercase opacity-60 ml-4 tracking-widest">Vincular Ficha (opcional)</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="🔍 Buscar ficha de actividad..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-4 rounded-xl border bg-zinc-50 dark:bg-clr3 font-bold text-sm focus:ring-2 ring-clr6 outline-none transition-all"
              />
            </div>
            
            {loadingArticulos ? (
              <div className="py-4 text-center animate-pulse uppercase tracking-widest text-[0.8em]">Buscando actividades...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredActividades.length > 0 ? (
                  filteredActividades.map(art => (
                    <div 
                      key={art.id}
                      onClick={() => setSelectedArticuloId(selectedArticuloId === art.id ? null : art.id)}
                      className={`p-2 rounded-2xl border-2 cursor-pointer transition-all flex gap-2 items-center ${
                        selectedArticuloId === art.id 
                          ? 'border-clr6 bg-clr6/5 shadow-md scale-[1.02]' 
                          : 'border-zinc-100 dark:border-clr4 bg-zinc-50 dark:bg-black/10 hover:border-clr6/30'
                      }`}
                    >
                      {art.imagen_destacada ? (
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                          <img src={art.imagen_destacada} className="w-full h-full object-cover" alt={art.titulo} />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-zinc-200 dark:bg-clr4 flex items-center justify-center shrink-0">
                          <span className="text-xl">📋</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold uppercase text-[0.85em] leading-tight text-clr5 dark:text-clr1 truncate">{art.titulo}</h4>
                        <p className="text-[0.75em] opacity-60 italic line-clamp-1">{art.extracto}</p>
                      </div>
                      {selectedArticuloId === art.id && (
                        <span className="px-2 py-0.5 bg-clr6 text-white text-[8px] font-black uppercase rounded-full tracking-widest shrink-0">
                          ✓
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 py-8 text-center opacity-30">
                    <p className="text-sm font-black uppercase">No hay fichas disponibles</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-4 bg-clr7 text-white font-black font-display uppercase rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all tracking-widest"
            >
              {loading ? '⌛ Creando...' : '✨ Crear Actividad'}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-4 bg-zinc-100 dark:bg-clr4 text-clr2 rounded-2xl font-bold uppercase"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
