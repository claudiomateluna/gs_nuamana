'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Articulo {
  id: string
  titulo: string
  slug: string
  extracto?: string | null
  metadata?: { objetivos_educativos?: { unidad: string }[] } | null
}

interface SelectorFichasActividadProps {
  selectedIds: string[]
  onChange: (ids: string[]) => void
  unidadNombre?: string
}

export default function SelectorFichasActividad({ selectedIds, onChange, unidadNombre }: SelectorFichasActividadProps) {
  const [articulos, setArticulos] = useState<Articulo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchActividades()
  }, [])

  const fetchActividades = async () => {
    setLoading(true)
    try {
      const { data: relaciones } = await supabase
        .from('articulo_categorias')
        .select('articulo_id')
        .eq('categoria_id', 1)

      if (relaciones && relaciones.length > 0) {
        const articleIds = relaciones.map(r => r.articulo_id)
        const { data: articulosData } = await supabase
          .from('articulos')
          .select('id, titulo, slug, extracto, metadata')
          .in('id', articleIds)
          .order('titulo')

        // Filtrar por unidad si se especifica
        let filtered = (articulosData || []) as Articulo[]
        if (unidadNombre) {
          const normalize = (s: string) => s?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim() || ''
          const unitNorm = normalize(unidadNombre)
          filtered = filtered.filter(a => {
            const objs = (a.metadata as Record<string, unknown>)?.objetivos_educativos as { unidad: string }[] | undefined
            if (!objs || objs.length === 0) return false
            return objs.some(o => normalize(o.unidad) === unitNorm)
          })
        }

        setArticulos(filtered)
      }
    } catch (err) {
      console.warn('Error fetching actividades:', err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = articulos.filter(a =>
    a.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const allVisibleSelected = filtered.length > 0 && filtered.every(a => selectedIds.includes(a.id))

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(i => i !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  const handleSelectAll = () => {
    const visibleIds = filtered.map(a => a.id)
    const merged = Array.from(new Set([...selectedIds, ...visibleIds]))
    onChange(merged)
  }

  const handleClear = () => {
    const visibleIds = new Set(filtered.map(a => a.id))
    onChange(selectedIds.filter(id => !visibleIds.has(id)))
  }

  if (loading) {
    return <p className="text-sm text-zinc-500">Cargando actividades...</p>
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <input
          type="text"
          placeholder="Buscar por titulo..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-clr6"
        />
        <span className="text-xs text-zinc-500 whitespace-nowrap">
          {selectedIds.length} seleccionada{selectedIds.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSelectAll}
          disabled={allVisibleSelected || filtered.length === 0}
          className="text-xs px-3 py-1 rounded-lg bg-clr6/10 text-clr6 font-bold hover:bg-clr6/20 disabled:opacity-40 transition-all"
        >
          Seleccionar todo
        </button>
        <button
          type="button"
          onClick={handleClear}
          disabled={filtered.every(a => !selectedIds.includes(a.id))}
          className="text-xs px-3 py-1 rounded-lg bg-red-500/10 text-red-500 font-bold hover:bg-red-500/20 disabled:opacity-40 transition-all"
        >
          Limpiar
        </button>
      </div>

      <div className="max-h-60 overflow-y-auto space-y-1 border border-zinc-200 dark:border-zinc-700 rounded-xl p-2">
        {filtered.length === 0 ? (
          <p className="text-sm text-zinc-400 text-center py-4">
            {articulos.length === 0 ? 'No hay actividades disponibles' : 'Sin resultados'}
          </p>
        ) : (
          filtered.map(articulo => (
            <label
              key={articulo.id}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-all"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(articulo.id)}
                onChange={() => handleToggle(articulo.id)}
                className="mt-0.5 accent-clr6"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{articulo.titulo}</p>
                {articulo.extracto && (
                  <p className="text-xs text-zinc-500 truncate">{articulo.extracto}</p>
                )}
              </div>
            </label>
          ))
        )}
      </div>
    </div>
  )
}
