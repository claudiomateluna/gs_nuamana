'use client'

import React, { useState, useRef, useEffect } from 'react'
import type { CampamentoReceta, CategoriaPlatoReceta } from '@/types/campamento-menu'
import { normalizarCategoriaPlato, obtenerCategoriasReceta } from '@/types/campamento-menu'

interface Props {
  label: string
  subtitulo?: string
  icono?: string
  recetasDisponibles: CampamentoReceta[]
  categoriasPermitidas: CategoriaPlatoReceta[]
  seleccionadosIds: string[]
  onChange: (nuevosIds: string[]) => void
  onCrearReceta?: () => void
  placeholder?: string
}

export const RecetaMultiBuscador: React.FC<Props> = ({
  label,
  subtitulo,
  icono,
  recetasDisponibles,
  categoriasPermitidas,
  seleccionadosIds = [],
  onChange,
  onCrearReceta,
  placeholder = 'Buscar y agregar receta...'
}) => {
  const [busqueda, setBusqueda] = useState('')
  const [abierto, setAbierto] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setAbierto(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filtrar recetas según las categorías permitidas del slot
  const recetasFiltradasPorCategoria = recetasDisponibles.filter(r => {
    const rCats = obtenerCategoriasReceta(r)
    if (rCats.length === 0) return false
    return rCats.some(rCat => {
      return categoriasPermitidas.some(catPermitida => {
        const pCat = normalizarCategoriaPlato(catPermitida)
        if (rCat === pCat) return true
        if (rCat === 'Bebida o Liquido' && (pCat === 'Bebida' || pCat === 'Liquido')) return true
        return false
      })
    })
  })

  // Filtrar recetas por texto de búsqueda
  const recetasCoincidentes = recetasFiltradasPorCategoria.filter(r => {
    if (!busqueda.trim()) return true
    const q = busqueda.toLowerCase().trim()
    return (
      r.nombre.toLowerCase().includes(q) ||
      r.ingredientes?.some(i => i.ingrediente_nombre.toLowerCase().includes(q))
    )
  })

  // Recetas actualmente seleccionadas
  const recetasSeleccionadas = seleccionadosIds
    .map(id => recetasDisponibles.find(r => r.id === id))
    .filter(Boolean) as CampamentoReceta[]

  const toggleReceta = (id: string) => {
    if (seleccionadosIds.includes(id)) {
      onChange(seleccionadosIds.filter(item => item !== id))
    } else {
      onChange([...seleccionadosIds, id])
    }
  }

  const removerReceta = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(seleccionadosIds.filter(item => item !== id))
  }

  return (
    <div ref={containerRef} className="space-y-1.5 text-[1em]">
      {/* Cabecera del Slot con Nombre Literal y Clasificación Visible */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <label className="text-[0.9em] font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
            {icono && <span>{icono}</span>}
            <span>{label}</span>
            {recetasSeleccionadas.length > 0 && (
              <span className="text-[0.8em] font-normal px-2 py-0.2 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                {recetasSeleccionadas.length}
              </span>
            )}
          </label>
          {subtitulo && (
            <p className="text-[0.8em] text-zinc-500 dark:text-zinc-400 mt-0.5">
              {subtitulo}
            </p>
          )}
        </div>
        {onCrearReceta && (
          <button
            type="button"
            onClick={onCrearReceta}
            className="text-[0.8em] text-[#cb3327] hover:underline font-medium whitespace-nowrap"
          >
            + Nueva
          </button>
        )}
      </div>

      {/* Chips de Recetas Seleccionadas */}
      {recetasSeleccionadas.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          {recetasSeleccionadas.map(rec => (
            <span
              key={rec.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/50 text-[0.85em] font-medium shadow-2xs"
            >
              <span>{rec.nombre}</span>
              <button
                type="button"
                onClick={e => removerReceta(rec.id, e)}
                className="ml-1 w-4 h-4 rounded-full flex items-center justify-center hover:bg-amber-200 dark:hover:bg-amber-800 text-[0.8em] transition"
                title="Quitar receta"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Buscador Dinámico */}
      <div className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={busqueda}
            onFocus={() => setAbierto(true)}
            onChange={e => {
              setBusqueda(e.target.value)
              if (!abierto) setAbierto(true)
            }}
            placeholder={placeholder}
            className="w-full px-3 py-2 text-[0.95em] border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-[#cb3327]/30 focus:border-[#cb3327] transition"
          />
          {busqueda && (
            <button
              type="button"
              onClick={() => setBusqueda('')}
              className="absolute right-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-[0.9em]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Dropdown de Opciones */}
        {abierto && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl z-50 max-h-56 overflow-y-auto p-1.5 space-y-1">
            {recetasCoincidentes.length > 0 ? (
              recetasCoincidentes.map(rec => {
                const seleccionada = seleccionadosIds.includes(rec.id)
                const rCats = obtenerCategoriasReceta(rec)
                const catLabel = rCats.length > 0 ? rCats.join(' · ') : rec.tipo_comida

                return (
                  <button
                    key={rec.id}
                    type="button"
                    onClick={() => toggleReceta(rec.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-[0.85em] transition ${
                      seleccionada
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-100 font-medium'
                        : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{rec.nombre}</span>
                        {catLabel && (
                          <span className="px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[0.8em]">
                            {catLabel}
                          </span>
                        )}
                      </div>
                      <p className="text-[0.8em] text-zinc-500 line-clamp-1">
                        {rec.ingredientes?.map(i => i.ingrediente_nombre).join(', ')}
                      </p>
                    </div>

                    <span className="text-[1.1em] ml-2">
                      {seleccionada ? '✓' : '+'}
                    </span>
                  </button>
                )
              })
            ) : (
              <div className="p-3 text-center text-zinc-500 text-[0.85em]">
                No hay recetas que coincidan con la búsqueda.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
