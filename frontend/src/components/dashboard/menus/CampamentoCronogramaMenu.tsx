'use client'

import React, { useState, useRef, useEffect } from 'react'
import type {
  CampamentoMenuBloque,
  CampamentoReceta,
  CampamentoPlantillaComida,
  ResponsableCocinaTipo,
  TiempoComidaTipo
} from '@/types/campamento-menu'
import { distribuirRecetasEnSlots } from '@/types/campamento-menu'
import { RecetaMultiBuscador } from './RecetaMultiBuscador'

interface Props {
  bloques: CampamentoMenuBloque[]
  diasTotales: number
  recetas: CampamentoReceta[]
  plantillas: CampamentoPlantillaComida[]
  onUpdateBloque: (bloqueActualizado: CampamentoMenuBloque) => void
  onUpdateAllBloques?: (nuevosBloques: CampamentoMenuBloque[]) => void
  onOpenRecetasModal: () => void
  onOpenPlantillasModal: () => void
}

const UNIDADES_DISPONIBLES: ResponsableCocinaTipo[] = [
  'Manada',
  'Compañía',
  'Tropa',
  'Avanzada',
  'Clan',
  'Dirigentes y Guiadoras',
  'Apoderados',
  'Viaje (COCAVI)'
]

const TIEMPO_INFO: Record<TiempoComidaTipo, { icono: string; label: string; color: string }> = {
  desayuno: { icono: '🌅', label: 'Desayuno', color: 'bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800/40' },
  almuerzo: { icono: '🍲', label: 'Almuerzo', color: 'bg-orange-50 dark:bg-orange-950/20 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800/40' },
  bano_fruta: { icono: '🍎', label: 'Baños y Fruta', color: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800/40' },
  once: { icono: '☕', label: 'Once', color: 'bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800/40' },
  cena: { icono: '🥣', label: 'Cena', color: 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800/40' }
}

export const CampamentoCronogramaMenu: React.FC<Props> = ({
  bloques,
  diasTotales,
  recetas,
  plantillas,
  onUpdateBloque,
  onUpdateAllBloques,
  onOpenRecetasModal,
  onOpenPlantillasModal
}) => {
  const [bloqueEditando, setBloqueEditando] = useState<CampamentoMenuBloque | null>(null)
  const [diaSeleccionado, setDiaSeleccionado] = useState<number | 'todos'>('todos')
  const [modalAgregarDia, setModalAgregarDia] = useState<number | null>(null)
  const [nuevoNombreComida, setNuevoNombreComida] = useState('')
  const [nuevoTipoComida, setNuevoTipoComida] = useState<TiempoComidaTipo>('once')

  // Refs y estado para la barra de desplazamiento horizontal superior sincronizada
  const topScrollRef = useRef<HTMLDivElement>(null)
  const mainScrollRef = useRef<HTMLDivElement>(null)
  const isSyncingTop = useRef(false)
  const isSyncingMain = useRef(false)
  const [contentWidth, setContentWidth] = useState<number>(0)

  // Agrupar bloques por día
  const diasArray = Array.from({ length: diasTotales }, (_, i) => i + 1)

  // Medir ancho real del contenido de los días para la barra superior
  useEffect(() => {
    const el = mainScrollRef.current
    if (!el) return

    const updateWidth = () => {
      if (mainScrollRef.current) {
        setContentWidth(mainScrollRef.current.scrollWidth)
      }
    }

    updateWidth()

    let observer: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        updateWidth()
      })
      observer.observe(el)
    }

    return () => {
      if (observer) observer.disconnect()
    }
  }, [bloques, diasArray, diaSeleccionado])

  // Sincronizar scroll superior con el principal inferior
  const handleTopScroll = () => {
    if (isSyncingTop.current) {
      isSyncingTop.current = false
      return
    }
    if (topScrollRef.current && mainScrollRef.current) {
      isSyncingMain.current = true
      mainScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft
    }
  }

  // Sincronizar scroll principal con el superior
  const handleMainScroll = () => {
    if (isSyncingMain.current) {
      isSyncingMain.current = false
      return
    }
    if (topScrollRef.current && mainScrollRef.current) {
      isSyncingTop.current = true
      topScrollRef.current.scrollLeft = mainScrollRef.current.scrollLeft
    }
  }

  // Desplazamiento horizontal rápido por botones
  const scrollHorizontally = (direccion: 'izq' | 'der') => {
    const contenedor = mainScrollRef.current
    if (!contenedor) return
    const delta = direccion === 'izq' ? -340 : 340
    contenedor.scrollBy({ left: delta, behavior: 'smooth' })
  }

  const toggleResponsable = (unidad: ResponsableCocinaTipo) => {
    if (!bloqueEditando) return
    const actuales = bloqueEditando.responsables || []
    const existe = actuales.includes(unidad)
    const nuevos = existe
      ? actuales.filter(u => u !== unidad)
      : [...actuales, unidad]
    setBloqueEditando({ ...bloqueEditando, responsables: nuevos })
  }

  // Cargar una plantilla completa y autocompletar todos los inputs
  const aplicarPlantillaAlBloque = (plantillaId: string | undefined) => {
    if (!bloqueEditando) return

    if (!plantillaId) {
      setBloqueEditando({
        ...bloqueEditando,
        plantilla_id: undefined,
        bebidas_ids: [],
        plato_principal_ids: [],
        agregados_ids: [],
        alternativas_ids: [],
        ensaladas_ids: [],
        postres_ids: [],
        sopas_ids: [],
        recetas_ids: [],
        platos_texto: ''
      })
      return
    }

    const plantilla = plantillas.find(p => p.id === plantillaId)
    if (!plantilla) return

    const slots = distribuirRecetasEnSlots(
      plantilla.recetas_ids || [],
      recetas,
      plantilla
    )

    setBloqueEditando({
      ...bloqueEditando,
      plantilla_id: plantilla.id,
      bebidas_ids: slots.bebidas_ids,
      plato_principal_ids: slots.plato_principal_ids,
      agregados_ids: slots.agregados_ids,
      alternativas_ids: slots.alternativas_ids,
      ensaladas_ids: slots.ensaladas_ids,
      postres_ids: slots.postres_ids,
      sopas_ids: slots.sopas_ids,
      recetas_ids: slots.recetas_ids,
      platos_texto: plantilla.nombre
    })
  }

  // Guardar cambios del modal
  const guardarCambiosBloque = () => {
    if (!bloqueEditando) return

    // Consolidar de forma estricta únicamente los IDs de los slots activos (evita recetas fantasma)
    const consolidado = Array.from(
      new Set([
        ...(bloqueEditando.bebidas_ids || []),
        ...(bloqueEditando.plato_principal_ids || []),
        ...(bloqueEditando.agregados_ids || []),
        ...(bloqueEditando.alternativas_ids || []),
        ...(bloqueEditando.ensaladas_ids || []),
        ...(bloqueEditando.postres_ids || []),
        ...(bloqueEditando.sopas_ids || [])
      ])
    )

    onUpdateBloque({
      ...bloqueEditando,
      plantilla_id: consolidado.length === 0 ? undefined : bloqueEditando.plantilla_id,
      recetas_ids: consolidado
    })
    setBloqueEditando(null)
  }

  // Reordenar comidas hacia arriba o abajo dentro de un día
  const moverComida = (bloque: CampamentoMenuBloque, direccion: 'arriba' | 'abajo') => {
    if (!onUpdateAllBloques) return
    const bloquesDia = bloques
      .filter(b => b.numero_dia === bloque.numero_dia)
      .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))

    const idx = bloquesDia.findIndex(b => b.id === bloque.id)
    if (idx < 0) return
    if (direccion === 'arriba' && idx === 0) return
    if (direccion === 'abajo' && idx === bloquesDia.length - 1) return

    const targetIdx = direccion === 'arriba' ? idx - 1 : idx + 1
    const bloqueActual = bloquesDia[idx]
    const bloqueObjetivo = bloquesDia[targetIdx]

    // Intercambiar orden
    const ordenTemp = bloqueActual.orden ?? idx + 1
    const nuevoOrdenObjetivo = bloqueObjetivo.orden ?? targetIdx + 1

    const bloquesActualizados = bloques.map(b => {
      if (b.id === bloqueActual.id) return { ...b, orden: nuevoOrdenObjetivo }
      if (b.id === bloqueObjetivo.id) return { ...b, orden: ordenTemp }
      return b
    })

    onUpdateAllBloques(bloquesActualizados)
  }

  // Agregar una nueva comida personalizada al día
  const handleAgregarComidaAlDia = () => {
    if (!modalAgregarDia || !onUpdateAllBloques) return
    const nombre = nuevoNombreComida.trim() || 'Colación Extra'
    const bloquesDia = bloques.filter(b => b.numero_dia === modalAgregarDia)
    const maxOrden = bloquesDia.reduce((max, b) => Math.max(max, b.orden ?? 0), 0)

    const nuevoBloque: CampamentoMenuBloque = {
      id: `menu-custom-${modalAgregarDia}-${Date.now()}`,
      menu_id: bloques[0]?.menu_id || 'menu-camp',
      numero_dia: modalAgregarDia,
      orden: maxOrden + 1,
      dia_etiqueta: `Día ${modalAgregarDia}`,
      tiempo_comida: nuevoTipoComida,
      es_personalizado: true,
      nombre_personalizado: nombre,
      responsables: [],
      bebidas_ids: [],
      plato_principal_ids: [],
      agregados_ids: [],
      alternativas_ids: [],
      ensaladas_ids: [],
      postres_ids: [],
      sopas_ids: [],
      recetas_ids: [],
      platos_texto: nombre,
      notas: ''
    }

    onUpdateAllBloques([...bloques, nuevoBloque])
    setModalAgregarDia(null)
    setNuevoNombreComida('')
  }

  // Eliminar comida del día
  const handleEliminarComida = (bloque: CampamentoMenuBloque, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (!onUpdateAllBloques) return
    const nombre = bloque.nombre_personalizado || TIEMPO_INFO[bloque.tiempo_comida]?.label || 'esta comida'
    if (confirm(`¿Eliminar "${nombre}" del Día ${bloque.numero_dia}?`)) {
      onUpdateAllBloques(bloques.filter(b => b.id !== bloque.id))
      if (bloqueEditando && bloqueEditando.id === bloque.id) {
        setBloqueEditando(null)
      }
    }
  }

  return (
    <div className="space-y-6 text-[1em]">
      {/* Selector de Día / Filtro y Acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-pclr1 dark:bg-pdclr1 p-4 rounded-xl border border-pclr13 dark:border-pdclr13 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-pclr4 dark:text-pdclr4">Mostrar Día:</span>
          <button
            onClick={() => setDiaSeleccionado('todos')}
            className={`px-3 py-1.5 rounded-lg text-[0.85em] font-medium transition ${
              diaSeleccionado === 'todos'
                ? 'bg-[#cb3327] text-white shadow-sm'
                : 'bg-pclr3 dark:bg-pdclr3 text-pclr7 dark:text-pdclr7 hover:bg-pclr3 dark:hover:bg-pdclr3'
            }`}
          >
            Vista Completa ({diasTotales} Días)
          </button>
          {diasArray.map(d => (
            <button
              key={d}
              onClick={() => setDiaSeleccionado(d)}
              className={`px-3 py-1.5 rounded-lg text-[0.85em] font-medium transition ${
                diaSeleccionado === d
                  ? 'bg-[#cb3327] text-white shadow-sm'
                  : 'bg-pclr3 dark:bg-pdclr3 text-pclr7 dark:text-pdclr7 hover:bg-pclr3 dark:hover:bg-pdclr3'
              }`}
            >
              Día {d}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPlantillasModal}
            className="px-3.5 py-1.5 bg-[#cb3327] hover:bg-[#b02920] text-white font-medium rounded-lg text-[0.85em] transition flex items-center gap-1.5 shadow-xs"
          >
            <span>🍱</span> Plantillas de Menú ({plantillas.length})
          </button>
          <button
            onClick={onOpenRecetasModal}
            className="px-3.5 py-1.5 border border-pclr13 dark:border-pdclr13 hover:bg-pclr3 dark:hover:bg-pdclr3 text-pclr4 dark:text-pdclr4 font-medium rounded-lg text-[0.85em] transition flex items-center gap-1.5"
          >
            <span>📖</span> Recetas Atómicas ({recetas.length})
          </button>
        </div>
      </div>

      {/* Barra de Desplazamiento Horizontal Superior Sincronizada */}
      {diaSeleccionado === 'todos' && diasArray.length > 1 && (
        <div className="bg-pclr1 dark:bg-pdclr1 border border-pclr13 dark:border-pdclr13 rounded-xl p-2.5 shadow-xs flex items-center gap-3">
          <button
            type="button"
            onClick={() => scrollHorizontally('izq')}
            title="Desplazar a la izquierda"
            className="p-1.5 rounded-lg border border-pclr13 dark:border-pdclr13 bg-pclr2 dark:bg-pdclr2 hover:bg-pclr3 dark:hover:bg-pdclr3 text-pclr4 dark:text-pdclr4 transition text-[0.85em] flex items-center justify-center shrink-0"
          >
            ◀
          </button>

          <div
            ref={topScrollRef}
            onScroll={handleTopScroll}
            className="flex-1 overflow-x-auto overflow-y-hidden py-1 scrollbar-thin scrollbar-thumb-pclr7 dark:scrollbar-thumb-pdclr7"
          >
            <div style={{ width: contentWidth > 0 ? `${contentWidth}px` : '100%', height: '1px' }} />
          </div>

          <button
            type="button"
            onClick={() => scrollHorizontally('der')}
            title="Desplazar a la derecha"
            className="p-1.5 rounded-lg border border-pclr13 dark:border-pdclr13 bg-pclr2 dark:bg-pdclr2 hover:bg-pclr3 dark:hover:bg-pdclr3 text-pclr4 dark:text-pdclr4 transition text-[0.85em] flex items-center justify-center shrink-0"
          >
            ▶
          </button>
        </div>
      )}

      {/* Columnas de Días en Vertical con Desplazamiento Horizontal */}
      <div
        ref={mainScrollRef}
        onScroll={handleMainScroll}
        className="overflow-x-auto pb-4 pt-1 -mx-2 px-2 scrollbar-thin scrollbar-thumb-pclr7 dark:scrollbar-thumb-pdclr7"
      >
        <div className="flex gap-2 items-start min-w-max">
          {diasArray
            .filter(d => diaSeleccionado === 'todos' || diaSeleccionado === d)
            .map(d => {
              const bloquesDia = bloques
                .filter(b => b.numero_dia === d)
                .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))

              const diaEtiqueta = bloquesDia[0]?.dia_etiqueta || `Día ${d}`

              return (
                <div
                  key={d}
                  className="w-72 sm:w-80 shrink-0 bg-pclr1 dark:bg-pdclr1 border border-pclr13 dark:border-pdclr13 rounded-2xl p-2 shadow-sm flex flex-col gap-3"
                >
                  {/* Cabecera de la Columna del Día */}
                  <div className="border-b border-pclr13 dark:border-pdclr13 pb-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-full bg-[#cb3327] text-white font-bold flex items-center justify-center text-[0.9em] shrink-0">
                          {d}
                        </span>
                        <div>
                          <h3 className="text-[1.1em] font-bold text-pclr4 dark:text-pdclr4 line-clamp-1">
                            {diaEtiqueta}
                          </h3>
                          <span className="text-[0.8em] text-pclr7 dark:text-pdclr7">
                            {bloquesDia.length} {bloquesDia.length === 1 ? 'comida' : 'comidas'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setModalAgregarDia(d)}
                      className="w-full py-1.5 bg-pclr3 dark:bg-pdclr3 hover:bg-pclr3 dark:bg-pdclr3 dark:hover:bg-pdclr3 text-pclr4 dark:text-pdclr4 rounded-lg text-[0.85em] font-medium transition flex items-center justify-center gap-1.5 border border-dashed border-pclr13 dark:border-pdclr13"
                    >
                      <span>➕</span> Agregar Comida al Día
                    </button>
                  </div>

                  {/* Lista Vertical de Comidas del Día */}
                  {bloquesDia.length === 0 ? (
                    <div className="p-6 text-center bg-pclr2 dark:bg-pdclr2/30 rounded-xl border border-dashed border-pclr13 dark:border-pdclr13">
                      <p className="text-pclr7 dark:text-pdclr7 text-[0.85em]">
                        No hay comidas programadas para este día. Puedes agregar una con el botón superior.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                    {bloquesDia.map((bloque, index) => {
                      const info = TIEMPO_INFO[bloque.tiempo_comida] || TIEMPO_INFO['almuerzo']
                      const plantillaAsignada = bloque.plantilla_id
                        ? plantillas.find(p => p.id === bloque.plantilla_id)
                        : undefined

                      // Resolver recetas asignadas en slots y recetas_ids
                      const idsRecetas = Array.from(
                        new Set([
                          ...(bloque.bebidas_ids || []),
                          ...(bloque.plato_principal_ids || []),
                          ...(bloque.agregados_ids || []),
                          ...(bloque.alternativas_ids || []),
                          ...(bloque.ensaladas_ids || []),
                          ...(bloque.postres_ids || []),
                          ...(bloque.sopas_ids || []),
                          ...(bloque.recetas_ids || [])
                        ])
                      )

                      const recetasAsignadas = idsRecetas
                        .map(id => recetas.find(r => r.id === id))
                        .filter(Boolean) as CampamentoReceta[]

                      const tituloComida = bloque.nombre_personalizado || info.label

                      return (
                        <div
                          key={bloque.id}
                          className={`rounded-xl border p-3 flex flex-col justify-between transition hover:shadow-md cursor-pointer relative group ${info.color}`}
                          onClick={() => setBloqueEditando(bloque)}
                        >
                          <div className="space-y-2">
                            {/* Cabecera de la tarjeta con reordenamiento y eliminación */}
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-semibold flex items-center gap-1.5 text-[0.95em]">
                                <span>{info.icono}</span>
                                <span className="line-clamp-1">{tituloComida}</span>
                              </span>

                              <div className="flex items-center gap-0.5" onClick={e => e.stopPropagation()}>
                                {/* Botones de mover comida arriba/abajo */}
                                <button
                                  type="button"
                                  disabled={index === 0}
                                  onClick={() => moverComida(bloque, 'arriba')}
                                  title="Mover antes"
                                  className="w-5 h-5 rounded flex items-center justify-center text-[0.8em] text-pclr7 dark:text-pdclr7 hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  disabled={index === bloquesDia.length - 1}
                                  onClick={() => moverComida(bloque, 'abajo')}
                                  title="Mover después"
                                  className="w-5 h-5 rounded flex items-center justify-center text-[0.8em] text-pclr7 dark:text-pdclr7 hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                  ↓
                                </button>

                                {/* Botón eliminar cualquier comida del día */}
                                <button
                                  type="button"
                                  onClick={e => handleEliminarComida(bloque, e)}
                                  title={`Eliminar ${tituloComida} del Día ${bloque.numero_dia}`}
                                  className="w-5 h-5 rounded flex items-center justify-center text-[0.85em] text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>

                          {/* Turno Cocina */}
                          <div>
                            <span className="text-[0.8em] uppercase tracking-wider font-semibold opacity-70 block">
                              Turno:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {bloque.responsables && bloque.responsables.length > 0 ? (
                                bloque.responsables.map(resp => (
                                  <span
                                    key={resp}
                                    className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[0.8em] font-medium"
                                  >
                                    {resp}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[0.8em] italic opacity-60">Sin asignar</span>
                              )}
                            </div>
                          </div>

                          {/* Plantilla Asignada si existe */}
                          {plantillaAsignada && (
                            <div>
                              <span className="inline-block px-1.5 py-0.5 rounded bg-[#cb3327]/15 text-[#cb3327] dark:text-rose-300 text-[0.8em] font-semibold">
                                🍱 {plantillaAsignada.nombre}
                              </span>
                            </div>
                          )}

                          {/* Resumen de Slots / Platos con Nombres Literales */}
                          <div className="pt-1 border-t border-black/10 dark:border-white/10 space-y-1">
                            {recetasAsignadas.length > 0 ? (
                              <div className="text-[0.8em] opacity-90 space-y-0.5">
                                {bloque.bebidas_ids && bloque.bebidas_ids.length > 0 && (
                                  <p className="line-clamp-1">
                                    <span className="font-semibold text-pclr4 dark:text-pdclr4">Bebida o Liquido:</span>{' '}
                                    {bloque.bebidas_ids.map(id => recetas.find(r => r.id === id)?.nombre).filter(Boolean).join(', ')}
                                  </p>
                                )}
                                {bloque.plato_principal_ids && bloque.plato_principal_ids.length > 0 && (
                                  <p className="line-clamp-1 font-semibold">
                                    <span className="font-semibold text-pclr4 dark:text-pdclr4">Plato Principal:</span>{' '}
                                    {bloque.plato_principal_ids.map(id => recetas.find(r => r.id === id)?.nombre).filter(Boolean).join(', ')}
                                  </p>
                                )}
                                {bloque.agregados_ids && bloque.agregados_ids.length > 0 && (
                                  <p className="line-clamp-1">
                                    <span className="font-semibold text-pclr4 dark:text-pdclr4">Agregado:</span>{' '}
                                    {bloque.agregados_ids.map(id => recetas.find(r => r.id === id)?.nombre).filter(Boolean).join(', ')}
                                  </p>
                                )}
                                {bloque.alternativas_ids && bloque.alternativas_ids.length > 0 && (
                                  <p className="line-clamp-1">
                                    <span className="font-semibold text-pclr4 dark:text-pdclr4">Alternativa:</span>{' '}
                                    {bloque.alternativas_ids.map(id => recetas.find(r => r.id === id)?.nombre).filter(Boolean).join(', ')}
                                  </p>
                                )}
                                {bloque.ensaladas_ids && bloque.ensaladas_ids.length > 0 && (
                                  <p className="line-clamp-1">
                                    <span className="font-semibold text-pclr4 dark:text-pdclr4">Ensalada:</span>{' '}
                                    {bloque.ensaladas_ids.map(id => recetas.find(r => r.id === id)?.nombre).filter(Boolean).join(', ')}
                                  </p>
                                )}
                                {bloque.postres_ids && bloque.postres_ids.length > 0 && (
                                  <p className="line-clamp-1">
                                    <span className="font-semibold text-pclr4 dark:text-pdclr4">Postre:</span>{' '}
                                    {bloque.postres_ids.map(id => recetas.find(r => r.id === id)?.nombre).filter(Boolean).join(', ')}
                                  </p>
                                )}
                                {bloque.sopas_ids && bloque.sopas_ids.length > 0 && (
                                  <p className="line-clamp-1">
                                    <span className="font-semibold text-pclr4 dark:text-pdclr4">Sopa:</span>{' '}
                                    {bloque.sopas_ids.map(id => recetas.find(r => r.id === id)?.nombre).filter(Boolean).join(', ')}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p className="font-semibold text-[0.85em] leading-snug line-clamp-2">
                                {bloque.platos_texto || 'Sin especificar'}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mt-2 pt-1 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[0.8em]">
                          <span className="opacity-70">
                            {recetasAsignadas.length} {recetasAsignadas.length === 1 ? 'receta' : 'recetas'}
                          </span>
                          <span className="font-medium text-[#cb3327] dark:text-rose-300">
                            Editar ✏️
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal / Drawer de Edición de Comida */}
      {bloqueEditando && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-pclr1 dark:bg-pdclr1 border border-pclr13 dark:border-pdclr13 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-pclr13 dark:border-pdclr13 bg-pclr2 dark:bg-pdclr2">
              <div>
                <h3 className="text-[1.25em] font-bold text-pclr4 dark:text-pdclr4 flex items-center gap-2">
                  <span>{TIEMPO_INFO[bloqueEditando.tiempo_comida]?.icono || '🍲'}</span>
                  Editar {bloqueEditando.nombre_personalizado || TIEMPO_INFO[bloqueEditando.tiempo_comida]?.label} - {bloqueEditando.dia_etiqueta}
                </h3>
                <p className="text-[0.85em] text-pclr7 dark:text-pdclr7">
                  Selecciona una plantilla para autocompletar o configura cada slot con el buscador dinámico.
                </p>
              </div>
              <button
                onClick={() => setBloqueEditando(null)}
                className="text-pclr7 dark:text-pdclr7 hover:text-pclr4 dark:hover:text-pdclr4 dark:hover:text-pdclr4 text-[1.2em] p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Sección Plantilla de Menú */}
              <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <label className="text-[0.95em] font-bold text-pclr4 dark:text-pdclr4 flex items-center gap-1.5">
                      <span>🍱</span> Cargar desde Plantilla de Menú
                    </label>
                    <p className="text-[0.85em] text-pclr7 dark:text-pdclr7">
                      Al seleccionar una plantilla, se precargan de golpe todos los slots culinarios de la comida.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenPlantillasModal}
                    className="text-[#cb3327] hover:underline text-[0.85em] font-medium"
                  >
                    + Gestionar Plantillas
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => aplicarPlantillaAlBloque(undefined)}
                    className={`px-3 py-1.5 rounded-lg text-[0.85em] font-medium transition border ${
                      !bloqueEditando.plantilla_id
                        ? 'bg-pclr10 dark:bg-pdclr10 text-pclr12 dark:text-pdclr12 border-transparent'
                        : 'bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 border-pclr13 dark:border-pdclr13 hover:bg-pclr2 dark:bg-pdclr2'
                    }`}
                  >
                    (Personalizado / Sin plantilla)
                  </button>
                  {plantillas
                    .filter(p => p.tipo_comida === bloqueEditando.tiempo_comida || bloqueEditando.es_personalizado)
                    .map(plt => {
                      const seleccionada = bloqueEditando.plantilla_id === plt.id
                      return (
                        <button
                          key={plt.id}
                          type="button"
                          onClick={() => aplicarPlantillaAlBloque(plt.id)}
                          className={`px-3 py-1.5 rounded-lg text-[0.85em] font-medium transition border ${
                            seleccionada
                              ? 'bg-[#cb3327] text-white border-[#b02920] shadow-xs'
                              : 'bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 border-pclr13 dark:border-pdclr13 hover:bg-pclr2 dark:bg-pdclr2'
                          }`}
                        >
                          {seleccionada ? '✓ ' : '🍱 '}{plt.nombre}
                        </button>
                      )
                    })}
                </div>
              </div>

              {/* Sección Turnos */}
              <div className="bg-pclr2 dark:bg-pdclr2 border border-pclr13 dark:border-pdclr13 rounded-xl p-4 space-y-2">
                <label className="text-[0.95em] font-bold text-pclr4 dark:text-pdclr4 block">
                  👥 Turnos
                </label>
                <p className="text-[0.85em] text-pclr7 dark:text-pdclr7 mb-2">
                  Selecciona la o las unidades responsables de preparar y servir esta comida:
                </p>
                <div className="flex flex-wrap gap-2">
                  {UNIDADES_DISPONIBLES.map(u => {
                    const seleccionado = bloqueEditando.responsables?.includes(u)
                    return (
                      <button
                        key={u}
                        type="button"
                        onClick={() => toggleResponsable(u)}
                        className={`px-3 py-1.5 rounded-lg text-[0.85em] font-medium transition ${
                          seleccionado
                            ? 'bg-[#cb3327] text-white shadow-sm'
                            : 'bg-pclr1 dark:bg-pdclr1 text-pclr4 dark:text-pdclr4 border border-pclr13 dark:border-pdclr13 hover:bg-pclr3 dark:hover:bg-pdclr3'
                        }`}
                      >
                        {seleccionado ? '✓ ' : '+ '}{u}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Slots Culinarios Estructurados con Nombres Literales */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-pclr13 dark:border-pdclr13 pb-2 flex-wrap gap-2">
                  <div>
                    <h4 className="text-[1.05em] font-bold text-pclr4 dark:text-pdclr4">
                      Composición del Menú
                    </h4>
                    <p className="text-[0.8em] font-normal text-pclr7 dark:text-pdclr7">
                      Búsqueda dinámica entre recetas por categorías
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBloqueEditando({
                      ...bloqueEditando,
                      plantilla_id: undefined,
                      bebidas_ids: [],
                      plato_principal_ids: [],
                      agregados_ids: [],
                      alternativas_ids: [],
                      ensaladas_ids: [],
                      postres_ids: [],
                      sopas_ids: [],
                      recetas_ids: [],
                      platos_texto: ''
                    })}
                    className="text-rose-600 hover:text-rose-700 dark:text-rose-400 text-[0.85em] font-medium px-2 py-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/30 transition flex items-center gap-1"
                    title="Quitar todas las recetas de esta comida"
                  >
                    <span>🗑️</span> Vaciar Recetas
                  </button>
                </div>

                {/* Slot 1: Bebida o Liquido */}
                <RecetaMultiBuscador
                  label="Bebida o Liquido"
                  subtitulo="Recetas categorizadas como Bebida o Liquido (ej: Leche, Leche con Chocolate, Té, Jugo, Bebida Carbonada, Agua, etc.)"
                  placeholder="Buscar Leche, Leche con Chocolate, Té, Jugo, Bebida Carbonada, Agua..."
                  recetasDisponibles={recetas}
                  categoriasPermitidas={['Bebida', 'Liquido']}
                  seleccionadosIds={bloqueEditando.bebidas_ids || []}
                  onChange={nuevosIds => setBloqueEditando({ ...bloqueEditando, bebidas_ids: nuevosIds, plantilla_id: undefined })}
                  onCrearReceta={onOpenRecetasModal}
                />

                {/* Slot 2: Plato Principal */}
                <RecetaMultiBuscador
                  label="Plato Principal"
                  subtitulo="Recetas categorizadas como Plato Principal o Agregado"
                  placeholder="Buscar Plato Principal o Agregado..."
                  recetasDisponibles={recetas}
                  categoriasPermitidas={['Plato Principal', 'Agregado']}
                  seleccionadosIds={bloqueEditando.plato_principal_ids || []}
                  onChange={nuevosIds => setBloqueEditando({ ...bloqueEditando, plato_principal_ids: nuevosIds, plantilla_id: undefined })}
                  onCrearReceta={onOpenRecetasModal}
                />

                {/* Slot 3: Agregado */}
                <RecetaMultiBuscador
                  label="Agregado"
                  subtitulo="Recetas categorizadas como Agregado o Agregado para Pan"
                  placeholder="Buscar Agregado o Agregado para Pan..."
                  recetasDisponibles={recetas}
                  categoriasPermitidas={['Agregado', 'Agregado para Pan']}
                  seleccionadosIds={bloqueEditando.agregados_ids || []}
                  onChange={nuevosIds => setBloqueEditando({ ...bloqueEditando, agregados_ids: nuevosIds, plantilla_id: undefined })}
                  onCrearReceta={onOpenRecetasModal}
                />

                {/* Slot 4: Alternativa */}
                <RecetaMultiBuscador
                  label="Alternativa"
                  subtitulo="Recetas categorizadas como Alternativa, Plato Principal, Agregado o Agregado para Pan"
                  placeholder="Buscar Alternativa, Plato Principal, Agregado o Agregado para Pan..."
                  recetasDisponibles={recetas}
                  categoriasPermitidas={['Alternativa', 'Plato Principal', 'Agregado', 'Agregado para Pan']}
                  seleccionadosIds={bloqueEditando.alternativas_ids || []}
                  onChange={nuevosIds => setBloqueEditando({ ...bloqueEditando, alternativas_ids: nuevosIds, plantilla_id: undefined })}
                  onCrearReceta={onOpenRecetasModal}
                />

                {/* Slot 5: Ensalada */}
                <RecetaMultiBuscador
                  label="Ensalada"
                  subtitulo="Recetas categorizadas como Ensalada o Fruta"
                  placeholder="Buscar Ensalada o Fruta..."
                  recetasDisponibles={recetas}
                  categoriasPermitidas={['Ensalada', 'Fruta']}
                  seleccionadosIds={bloqueEditando.ensaladas_ids || []}
                  onChange={nuevosIds => setBloqueEditando({ ...bloqueEditando, ensaladas_ids: nuevosIds, plantilla_id: undefined })}
                  onCrearReceta={onOpenRecetasModal}
                />

                {/* Slot 6: Postre (Almuerzo, Cena, Fruta o Comida Personalizada) */}
                {(bloqueEditando.tiempo_comida === 'almuerzo' ||
                  bloqueEditando.tiempo_comida === 'cena' ||
                  bloqueEditando.tiempo_comida === 'bano_fruta' ||
                  bloqueEditando.es_personalizado) && (
                  <RecetaMultiBuscador
                    label="Postre"
                    subtitulo="Recetas categorizadas como Fruta o Postre"
                    placeholder="Buscar Fruta o Postre..."
                    recetasDisponibles={recetas}
                    categoriasPermitidas={['Fruta', 'Postre']}
                    seleccionadosIds={bloqueEditando.postres_ids || []}
                    onChange={nuevosIds => setBloqueEditando({ ...bloqueEditando, postres_ids: nuevosIds, plantilla_id: undefined })}
                    onCrearReceta={onOpenRecetasModal}
                  />
                )}

                {/* Slot 7: Sopa (Cena o Comida Personalizada) */}
                {(bloqueEditando.tiempo_comida === 'cena' || bloqueEditando.es_personalizado) && (
                  <RecetaMultiBuscador
                    label="Sopa"
                    subtitulo="Recetas categorizadas como Sopa"
                    placeholder="Buscar Sopa..."
                    recetasDisponibles={recetas}
                    categoriasPermitidas={['Sopa']}
                    seleccionadosIds={bloqueEditando.sopas_ids || []}
                    onChange={nuevosIds => setBloqueEditando({ ...bloqueEditando, sopas_ids: nuevosIds, plantilla_id: undefined })}
                    onCrearReceta={onOpenRecetasModal}
                  />
                )}
              </div>

              {/* Nombre descriptivo y notas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-pclr13 dark:border-pdclr13">
                <div className="sm:col-span-2">
                  <label className="block text-[0.9em] font-medium text-pclr4 dark:text-pdclr4 mb-1">
                    Descripción o Nombre del Menú para este Bloque
                  </label>
                  <input
                    type="text"
                    value={bloqueEditando.platos_texto || ''}
                    onChange={e => setBloqueEditando({ ...bloqueEditando, platos_texto: e.target.value })}
                    placeholder="Ej: Tallarines con salsa y ensalada mixta"
                    className="w-full px-3 py-2 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 text-[1em]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[0.9em] font-medium text-pclr4 dark:text-pdclr4 mb-1">
                    Notas de Logística o Seguridad
                  </label>
                  <textarea
                    rows={2}
                    value={bloqueEditando.notas || ''}
                    onChange={e => setBloqueEditando({ ...bloqueEditando, notas: e.target.value })}
                    placeholder="Ej: Dejar hervida el agua antes de la actividad / Sanitización de manos..."
                    className="w-full px-3 py-2 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[0.9em]"
                  />
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-pclr13 dark:border-pdclr13 bg-pclr2 dark:bg-pdclr2">
              <button
                type="button"
                onClick={() => handleEliminarComida(bloqueEditando)}
                className="px-3.5 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg text-[0.9em] font-medium transition flex items-center gap-1.5"
              >
                <span>🗑️</span> Eliminar Comida
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setBloqueEditando(null)}
                  className="px-4 py-2 border border-pclr13 dark:border-pdclr13 rounded-lg text-pclr4 dark:text-pdclr4 hover:bg-pclr3 dark:hover:bg-pdclr3 transition text-[0.9em]"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={guardarCambiosBloque}
                  className="px-5 py-2 bg-[#cb3327] hover:bg-[#b02920] text-white font-medium rounded-lg shadow-sm transition text-[0.9em]"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Agregar Comida al Día */}
      {modalAgregarDia !== null && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-pclr1 dark:bg-pdclr1 border border-pclr13 dark:border-pdclr13 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-6 space-y-4 text-[1em]">
            <h3 className="text-[1.2em] font-bold text-pclr4 dark:text-pdclr4">
              ➕ Agregar Comida Programada al Día {modalAgregarDia}
            </h3>
            <p className="text-[0.85em] text-pclr7 dark:text-pdclr7">
              Podrás moverla y posicionarla libremente entre las comidas fijas con las flechas ↑ y ↓.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[0.9em] font-medium text-pclr4 dark:text-pdclr4 mb-1">
                  Nombre de la Comida *
                </label>
                <input
                  type="text"
                  required
                  value={nuevoNombreComida}
                  onChange={e => setNuevoNombreComida(e.target.value)}
                  placeholder="Ej: Colación Media Mañana / Snack de Fogón"
                  className="w-full px-3 py-2 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[1em]"
                />
              </div>

              <div>
                <label className="block text-[0.9em] font-medium text-pclr4 dark:text-pdclr4 mb-1">
                  Tipo Base de Horario
                </label>
                <select
                  value={nuevoTipoComida}
                  onChange={e => setNuevoTipoComida(e.target.value as TiempoComidaTipo)}
                  className="w-full px-3 py-2 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[1em]"
                >
                  <option value="desayuno">🌅 Desayuno</option>
                  <option value="almuerzo">🍲 Almuerzo</option>
                  <option value="bano_fruta">🍎 Baños y Fruta</option>
                  <option value="once">☕ Once</option>
                  <option value="cena">🥣 Cena</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-pclr13 dark:border-pdclr13">
              <button
                type="button"
                onClick={() => setModalAgregarDia(null)}
                className="px-4 py-2 border border-pclr13 dark:border-pdclr13 rounded-lg text-pclr4 dark:text-pdclr4 hover:bg-pclr3 dark:hover:bg-pdclr3 transition text-[0.9em]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAgregarComidaAlDia}
                className="px-5 py-2 bg-[#cb3327] hover:bg-[#b02920] text-white font-medium rounded-lg shadow-sm transition text-[0.9em]"
              >
                Agregar Comida
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
