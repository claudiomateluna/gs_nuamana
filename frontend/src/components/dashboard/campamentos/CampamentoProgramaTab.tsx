'use client'

import React, { useState, useRef, useEffect } from 'react'
import type {
  CampamentoProgramaData,
  MomentoGrupalItem,
  ActividadUnidadItem,
  RamaUnidadTipo
} from '@/types/campamento-programa'
import {
  generarMomentosGrupalesPredeterminados,
  obtenerCronogramaCombinadoUnidad
} from '@/utils/campamento-programa-presets'

interface Props {
  programa?: CampamentoProgramaData
  diasTotales: number
  onUpdatePrograma: (nuevoPrograma: CampamentoProgramaData) => void
}

const RAMAS_DISPONIBLES: { id: RamaUnidadTipo; label: string; emoji: string }[] = [
  { id: 'Manada', label: 'Manada (Lobatos y Golondrinas)', emoji: '🐺' },
  { id: 'Compañía', label: 'Compañía (Guías)', emoji: '🌸' },
  { id: 'Tropa', label: 'Tropa (Scouts)', emoji: '⚜️' },
  { id: 'Avanzada', label: 'Avanzada (Pioneros)', emoji: '🔥' },
  { id: 'Clan', label: 'Clan (Caminantes)', emoji: '🏔️' }
]

export const CampamentoProgramaTab: React.FC<Props> = ({
  programa = { momentos_grupales: [], actividades_unidades: [] },
  diasTotales,
  onUpdatePrograma
}) => {
  const [subTab, setSubTab] = useState<'grupales' | 'unidades'>('grupales')
  const [diaSeleccionado, setDiaSeleccionado] = useState<number | 'todos'>('todos')
  const [ramaSeleccionada, setRamaSeleccionada] = useState<RamaUnidadTipo>('Tropa')

  // Refs y estado para la barra de desplazamiento horizontal superior sincronizada
  const topScrollRef = useRef<HTMLDivElement>(null)
  const mainScrollRef = useRef<HTMLDivElement>(null)
  const isSyncingTop = useRef(false)
  const isSyncingMain = useRef(false)
  const [contentWidth, setContentWidth] = useState<number>(0)

  // Modales
  const [editandoMomento, setEditandoMomento] = useState<MomentoGrupalItem | null>(null)
  const [diasSeleccionadosMomento, setDiasSeleccionadosMomento] = useState<number[]>([1])

  const [editandoActividad, setEditandoActividad] = useState<ActividadUnidadItem | null>(null)
  const [diasSeleccionadosActividad, setDiasSeleccionadosActividad] = useState<number[]>([1])

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
  }, [programa, diasArray, diaSeleccionado, subTab, ramaSeleccionada])

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

  // Cargar plantilla tradicional
  const handleCargarPlantilla = () => {
    if (confirm('¿Cargar la plantilla tradicional de Momentos Grupales (Inauguración, Izamiento diario, Gran Juego, Fogón y Clausura)?')) {
      const pred = generarMomentosGrupalesPredeterminados(diasTotales)
      onUpdatePrograma({
        ...programa,
        momentos_grupales: pred
      })
    }
  }

  // Apertura de modal para Momento Grupal
  const abrirNuevoMomento = (dia: number) => {
    setDiasSeleccionadosMomento([dia])
    setEditandoMomento({
      id: `mg-${Date.now()}`,
      dia_numero: dia,
      hora_inicio: '10:00',
      hora_fin: '11:30',
      es_dia_completo: false,
      titulo: '',
      descripcion: '',
      responsable: 'Jefatura de Grupo',
      lugar_recinto: 'Explanada central'
    })
  }

  const abrirEditarMomento = (mg: MomentoGrupalItem) => {
    setDiasSeleccionadosMomento([mg.dia_numero])
    setEditandoMomento(mg)
  }

  // Guardar momento grupal (soporta replicación en múltiples días o días específicos)
  const handleGuardarMomento = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editandoMomento) return

    const esNuevo = !(programa.momentos_grupales || []).some(m => m.id === editandoMomento.id)
    const diasFinales = diasSeleccionadosMomento.length > 0 ? diasSeleccionadosMomento : [editandoMomento.dia_numero]

    if (esNuevo) {
      const nuevosMomentos: MomentoGrupalItem[] = diasFinales.map((dia, idx) => ({
        ...editandoMomento,
        id: `mg-${Date.now()}-${dia}-${idx}`,
        dia_numero: dia
      }))

      onUpdatePrograma({
        ...programa,
        momentos_grupales: [...(programa.momentos_grupales || []), ...nuevosMomentos]
      })
    } else {
      const diaPrincipal = diasFinales[0]
      const momentoActualizado: MomentoGrupalItem = {
        ...editandoMomento,
        dia_numero: diaPrincipal
      }

      const otrosDias = diasFinales.filter(d => d !== diaPrincipal)
      const momentosReplicados: MomentoGrupalItem[] = otrosDias.map((dia, idx) => ({
        ...editandoMomento,
        id: `mg-${Date.now()}-${dia}-${idx}`,
        dia_numero: dia
      }))

      const listaActualizada = (programa.momentos_grupales || []).map(m =>
        m.id === editandoMomento.id ? momentoActualizado : m
      )

      onUpdatePrograma({
        ...programa,
        momentos_grupales: [...listaActualizada, ...momentosReplicados]
      })
    }

    setEditandoMomento(null)
  }

  const handleEliminarMomento = (id: string) => {
    if (confirm('¿Eliminar este momento grupal? Se retirará también de los cronogramas de todas las unidades.')) {
      const filtrados = (programa.momentos_grupales || []).filter(m => m.id !== id)
      onUpdatePrograma({ ...programa, momentos_grupales: filtrados })
    }
  }

  // Apertura de modal para Actividad de Unidad
  const abrirNuevaActividad = (dia: number) => {
    setDiasSeleccionadosActividad([dia])
    setEditandoActividad({
      id: `act-${Date.now()}`,
      unidad_nombre: ramaSeleccionada,
      dia_numero: dia,
      hora_inicio: '10:30',
      hora_fin: '12:30',
      titulo: '',
      descripcion: '',
      objetivo_progresion: 'Corporalidad / Técnicas Scouts',
      responsable: `Jefatura de ${ramaSeleccionada}`
    })
  }

  const abrirEditarActividad = (act: ActividadUnidadItem) => {
    setDiasSeleccionadosActividad([act.dia_numero])
    setEditandoActividad(act)
  }

  // Guardar actividad de unidad (soporta replicación en múltiples días)
  const handleGuardarActividad = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editandoActividad) return

    const esNueva = !(programa.actividades_unidades || []).some(a => a.id === editandoActividad.id)
    const diasFinales = diasSeleccionadosActividad.length > 0 ? diasSeleccionadosActividad : [editandoActividad.dia_numero]

    if (esNueva) {
      const nuevasActividades: ActividadUnidadItem[] = diasFinales.map((dia, idx) => ({
        ...editandoActividad,
        id: `act-${Date.now()}-${dia}-${idx}`,
        dia_numero: dia
      }))

      onUpdatePrograma({
        ...programa,
        actividades_unidades: [...(programa.actividades_unidades || []), ...nuevasActividades]
      })
    } else {
      const diaPrincipal = diasFinales[0]
      const actividadActualizada: ActividadUnidadItem = {
        ...editandoActividad,
        dia_numero: diaPrincipal
      }

      const otrosDias = diasFinales.filter(d => d !== diaPrincipal)
      const actividadesReplicadas: ActividadUnidadItem[] = otrosDias.map((dia, idx) => ({
        ...editandoActividad,
        id: `act-${Date.now()}-${dia}-${idx}`,
        dia_numero: dia
      }))

      const listaActualizada = (programa.actividades_unidades || []).map(a =>
        a.id === editandoActividad.id ? actividadActualizada : a
      )

      onUpdatePrograma({
        ...programa,
        actividades_unidades: [...listaActualizada, ...actividadesReplicadas]
      })
    }

    setEditandoActividad(null)
  }

  const handleEliminarActividad = (id: string) => {
    if (confirm('¿Eliminar esta actividad de unidad?')) {
      const filtradas = (programa.actividades_unidades || []).filter(a => a.id !== id)
      onUpdatePrograma({ ...programa, actividades_unidades: filtradas })
    }
  }

  const diaActualParaNuevo = diaSeleccionado === 'todos' ? 1 : diaSeleccionado

  return (
    <div className="space-y-6 text-[1em]">
      {/* Subnavegación: Momentos Grupales vs Tiempos de Unidad */}
      <div className="flex border-b border-pclr13 dark:border-pdclr13 pb-2 justify-between items-center flex-wrap gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setSubTab('grupales')}
            className={`px-4 py-2 font-semibold text-[0.9em] rounded-xl transition flex items-center gap-2 ${
              subTab === 'grupales'
                ? 'bg-[#cb3327] text-white shadow-sm'
                : 'bg-pclr3 dark:bg-pdclr3 text-pclr7 dark:text-pdclr7 hover:bg-pclr3 dark:hover:bg-pdclr3'
            }`}
          >
            <span>🌟</span> Momentos Grupales ({programa.momentos_grupales?.length || 0})
          </button>

          <button
            onClick={() => setSubTab('unidades')}
            className={`px-4 py-2 font-semibold text-[0.9em] rounded-xl transition flex items-center gap-2 ${
              subTab === 'unidades'
                ? 'bg-[#cb3327] text-white shadow-sm'
                : 'bg-pclr3 dark:bg-pdclr3 text-pclr7 dark:text-pdclr7 hover:bg-pclr3 dark:hover:bg-pdclr3'
            }`}
          >
            <span>🏕️</span> Tiempos de Unidad (Por Rama)
          </button>
        </div>

        {subTab === 'grupales' ? (
          <div className="flex gap-2">
            <button
              onClick={handleCargarPlantilla}
              className="px-3 py-1.5 border border-pclr13 dark:border-pdclr13 hover:bg-pclr3 dark:hover:bg-pdclr3 rounded-xl font-medium text-[0.8em] transition"
            >
              ⚡ Cargar Plantilla Tradicional
            </button>
            <button
              onClick={() => abrirNuevoMomento(diaActualParaNuevo)}
              className="px-4 py-1.5 bg-[#cb3327] hover:bg-[#b02920] text-white rounded-xl font-medium text-[0.8em] shadow-sm transition"
            >
              + Nuevo Momento Grupal
            </button>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <button
              onClick={() => abrirNuevaActividad(diaActualParaNuevo)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[0.8em] font-bold shadow-xs transition"
            >
              + Agregar Actividad de {ramaSeleccionada}
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 border border-pclr13 dark:border-pdclr13 hover:bg-pclr3 dark:hover:bg-pdclr3 rounded-xl font-medium text-[0.8em] flex items-center gap-1.5 transition print:hidden"
            >
              <span>🖨️</span> Imprimir Cronograma
            </button>
          </div>
        )}
      </div>

      {/* Selector de Rama (solo visible en Tiempos de Unidad) */}
      {subTab === 'unidades' && (
        <div className="bg-pclr1 dark:bg-pdclr1 p-3 rounded-xl border border-pclr13 dark:border-pdclr13 flex items-center justify-between flex-wrap gap-2 shadow-xs">
          <span className="text-[0.9em] font-bold text-pclr4 dark:text-pdclr4">
            Rama / Sección:
          </span>
          <div className="flex gap-1.5 flex-wrap">
            {RAMAS_DISPONIBLES.map(r => (
              <button
                key={r.id}
                onClick={() => setRamaSeleccionada(r.id)}
                className={`px-3 py-1.5 rounded-xl text-[0.8em] font-bold transition flex items-center gap-1.5 ${
                  ramaSeleccionada === r.id
                    ? 'bg-[#cb3327] text-white shadow-xs'
                    : 'bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 hover:bg-pclr3 dark:hover:bg-pdclr3'
                }`}
              >
                <span>{r.emoji}</span>
                <span>{r.id}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selector de Día / Filtro Horizontal */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-pclr1 dark:bg-pdclr1 p-3 rounded-xl border border-pclr13 dark:border-pdclr13 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-pclr4 dark:text-pdclr4 text-[0.85em]">
            Mostrar Día:
          </span>
          <button
            onClick={() => setDiaSeleccionado('todos')}
            className={`px-3 py-1 rounded-lg text-[0.85em] font-medium transition ${
              diaSeleccionado === 'todos'
                ? 'bg-[#cb3327] text-white shadow-xs'
                : 'bg-pclr3 dark:bg-pdclr3 text-pclr7 dark:text-pdclr7 hover:bg-pclr3 dark:hover:bg-pdclr3'
            }`}
          >
            Vista Completa ({diasTotales} Días)
          </button>
          {diasArray.map(d => (
            <button
              key={d}
              onClick={() => setDiaSeleccionado(d)}
              className={`px-3 py-1 rounded-lg text-[0.85em] font-medium transition ${
                diaSeleccionado === d
                  ? 'bg-[#cb3327] text-white shadow-xs'
                  : 'bg-pclr3 dark:bg-pdclr3 text-pclr7 dark:text-pdclr7 hover:bg-pclr3 dark:hover:bg-pdclr3'
              }`}
            >
              Día {d}
            </button>
          ))}
        </div>

        <span className="text-[0.8em] text-pclr7 dark:text-pdclr7">
          {subTab === 'grupales'
            ? 'Momentos para todo el grupo simultáneo'
            : `Hitos grupales 🔒 fijos + actividades de ${ramaSeleccionada}`}
        </span>
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

      {/* VISTA EN COLUMNAS POR DÍA CON SCROLL HORIZONTAL */}
      <div
        ref={mainScrollRef}
        onScroll={handleMainScroll}
        className="overflow-x-auto pb-4 pt-1 -mx-2 px-2 scrollbar-thin scrollbar-thumb-pclr7 dark:scrollbar-thumb-pdclr7"
      >
        <div className="flex gap-3 items-start min-w-max">
          {diasArray
            .filter(d => diaSeleccionado === 'todos' || diaSeleccionado === d)
            .map(d => {
              if (subTab === 'grupales') {
                const momentosDia = (programa.momentos_grupales || [])
                  .filter(m => m.dia_numero === d)
                  .sort((a, b) => {
                    if (a.es_dia_completo && !b.es_dia_completo) return -1
                    if (!a.es_dia_completo && b.es_dia_completo) return 1
                    return a.hora_inicio.localeCompare(b.hora_inicio)
                  })

                return (
                  <div
                    key={d}
                    className="w-72 sm:w-80 shrink-0 bg-pclr1 dark:bg-pdclr1 border border-pclr13 dark:border-pdclr13 rounded-2xl p-3 shadow-sm flex flex-col gap-3"
                  >
                    {/* Cabecera del Día */}
                    <div className="border-b border-pclr13 dark:border-pdclr13 pb-2.5 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-[#cb3327] text-white font-bold flex items-center justify-center text-[0.85em] shrink-0">
                            {d}
                          </span>
                          <div>
                            <h3 className="text-[1.05em] font-bold text-pclr4 dark:text-pdclr4">
                              Día {d}
                            </h3>
                            <span className="text-[0.75em] text-pclr7 dark:text-pdclr7">
                              {momentosDia.length} {momentosDia.length === 1 ? 'momento grupal' : 'momentos grupales'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => abrirNuevoMomento(d)}
                        className="w-full py-1.5 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/30 dark:hover:bg-purple-900/40 text-purple-800 dark:text-purple-200 rounded-lg text-[0.8em] font-medium transition flex items-center justify-center gap-1.5 border border-dashed border-purple-300 dark:border-purple-800"
                      >
                        <span>➕</span> Agregar Momento Grupal
                      </button>
                    </div>

                    {/* Lista Vertical de Momentos del Día */}
                    <div className="flex flex-col gap-2.5">
                      {momentosDia.length === 0 ? (
                        <div className="p-4 text-center border border-dashed border-pclr13 dark:border-pdclr13 rounded-xl text-pclr7 dark:text-pdclr7 text-[0.8em]">
                          Sin momentos grupales para el Día {d}
                        </div>
                      ) : (
                        momentosDia.map(mg => (
                          <div
                            key={mg.id}
                            className="border-2 border-purple-200 dark:border-purple-900/60 bg-purple-50/30 dark:bg-purple-950/20 rounded-xl p-3 flex flex-col justify-between gap-2 shadow-xs hover:border-purple-300 transition"
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between gap-1.5">
                                <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white font-bold text-[0.75em]">
                                  {mg.es_dia_completo ? 'Día Completo' : `${mg.hora_inicio} - ${mg.hora_fin}`}
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-[0.7em] font-semibold">
                                  🌟 Grupal
                                </span>
                              </div>

                              <h4 className="font-bold text-[0.95em] text-pclr4 dark:text-pdclr4 leading-snug">
                                {mg.titulo}
                              </h4>

                              {mg.descripcion && (
                                <p className="text-[0.8em] text-pclr7 dark:text-pdclr7 line-clamp-2" title={mg.descripcion}>
                                  {mg.descripcion}
                                </p>
                              )}

                              <div className="space-y-0.5 text-[0.75em] text-pclr7 dark:text-pdclr7 pt-0.5">
                                <div className="line-clamp-1">👤 <strong>{mg.responsable}</strong></div>
                                {mg.lugar_recinto && <div className="line-clamp-1">📍 {mg.lugar_recinto}</div>}
                                {mg.materiales && <div className="line-clamp-1">📦 {mg.materiales}</div>}
                              </div>
                            </div>

                            <div className="flex justify-end gap-1.5 pt-1 border-t border-purple-200/50 dark:border-purple-900/30">
                              <button
                                onClick={() => abrirEditarMomento(mg)}
                                className="px-2 py-1 bg-pclr3 dark:bg-pdclr3 border border-pclr13 dark:border-pdclr13 rounded-md text-pclr4 dark:text-pdclr4 text-[0.75em] font-medium hover:bg-pclr2 dark:bg-pdclr2"
                              >
                                ✏️ Editar
                              </button>
                              <button
                                onClick={() => handleEliminarMomento(mg.id)}
                                className="px-2 py-1 bg-pclr3 dark:bg-pdclr3 border border-pclr13 dark:border-pdclr13 rounded-md text-red-500 text-[0.75em] hover:bg-red-50"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )
              } else {
                // subTab === 'unidades'
                const itemsDia = obtenerCronogramaCombinadoUnidad(programa, ramaSeleccionada, d)

                return (
                  <div
                    key={d}
                    className="w-72 sm:w-80 shrink-0 bg-pclr1 dark:bg-pdclr1 border border-pclr13 dark:border-pdclr13 rounded-2xl p-3 shadow-sm flex flex-col gap-3"
                  >
                    {/* Cabecera del Día */}
                    <div className="border-b border-pclr13 dark:border-pdclr13 pb-2.5 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-[#cb3327] text-white font-bold flex items-center justify-center text-[0.85em] shrink-0">
                            {d}
                          </span>
                          <div>
                            <h3 className="text-[1.05em] font-bold text-pclr4 dark:text-pdclr4">
                              Día {d}
                            </h3>
                            <span className="text-[0.75em] text-pclr7 dark:text-pdclr7">
                              {itemsDia.length} {itemsDia.length === 1 ? 'actividad/hito' : 'actividades e hitos'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => abrirNuevaActividad(d)}
                        className="w-full py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 rounded-lg text-[0.8em] font-medium transition flex items-center justify-center gap-1.5 border border-dashed border-emerald-300 dark:border-emerald-700"
                      >
                        <span>➕</span> Agregar Actividad de {ramaSeleccionada}
                      </button>
                    </div>

                    {/* Lista Vertical de Actividades e Hitos del Día */}
                    <div className="flex flex-col gap-2.5">
                      {itemsDia.length === 0 ? (
                        <div className="p-4 text-center border border-dashed border-pclr13 dark:border-pdclr13 rounded-xl text-pclr7 dark:text-pdclr7 text-[0.8em]">
                          Sin actividades ni hitos para el Día {d}
                        </div>
                      ) : (
                        itemsDia.map(item => {
                          const esHitoGrupal = item.tipo === 'momento_grupal'

                          return (
                            <div
                              key={item.id}
                              className={`p-3 rounded-xl border flex flex-col justify-between gap-2 shadow-xs transition ${
                                esHitoGrupal
                                  ? 'bg-purple-50/40 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800/80'
                                  : 'bg-pclr1 dark:bg-pdclr1 border-pclr13 dark:border-pdclr13 hover:border-emerald-300'
                              }`}
                            >
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between gap-1.5">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[0.75em] font-bold ${
                                      esHitoGrupal
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200'
                                    }`}
                                  >
                                    {item.es_dia_completo ? 'Día Completo' : `${item.hora_inicio} - ${item.hora_fin}`}
                                  </span>

                                  {esHitoGrupal ? (
                                    <span className="px-1.5 py-0.5 rounded-full bg-purple-200 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 text-[0.7em] font-black uppercase tracking-wider flex items-center gap-0.5">
                                      🔒 Grupal
                                    </span>
                                  ) : (
                                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-[0.7em] font-semibold">
                                      {ramaSeleccionada}
                                    </span>
                                  )}
                                </div>

                                <h4 className="font-bold text-pclr4 dark:text-pdclr4 text-[0.95em] leading-snug">
                                  {item.titulo}
                                </h4>

                                {item.descripcion && (
                                  <p className="text-[0.8em] text-pclr7 dark:text-pdclr7 line-clamp-2" title={item.descripcion}>
                                    {item.descripcion}
                                  </p>
                                )}

                                <div className="space-y-0.5 text-[0.75em] text-pclr7 dark:text-pdclr7 pt-0.5">
                                  {item.responsable && <div className="line-clamp-1">👤 <strong>{item.responsable}</strong></div>}
                                  {item.objetivo_progresion && (
                                    <div className="line-clamp-1">🎯 <strong>{item.objetivo_progresion}</strong></div>
                                  )}
                                  {item.materiales && <div className="line-clamp-1">📦 {item.materiales}</div>}
                                </div>
                              </div>

                              <div className="flex justify-end gap-1.5 pt-1 border-t border-pclr13 dark:border-pdclr13">
                                {esHitoGrupal ? (
                                  <span className="text-[0.75em] text-purple-600 dark:text-purple-400 font-semibold italic">
                                    🔒 Fijado por Jefatura
                                  </span>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => {
                                        const actOriginal = (programa.actividades_unidades || []).find(a => a.id === item.id)
                                        if (actOriginal) abrirEditarActividad(actOriginal)
                                      }}
                                      className="px-2 py-1 bg-pclr3 dark:bg-pdclr3 rounded-md text-pclr4 dark:text-pdclr4 text-[0.75em] hover:bg-pclr3 dark:hover:bg-pdclr3"
                                    >
                                      ✏️ Editar
                                    </button>
                                    <button
                                      onClick={() => handleEliminarActividad(item.id)}
                                      className="px-2 py-1 bg-pclr3 dark:bg-pdclr3 rounded-md text-red-500 text-[0.75em] hover:bg-red-50"
                                    >
                                      🗑️
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                )
              }
            })}
        </div>
      </div>

      {/* MODAL: EDITAR / CREAR MOMENTO GRUPAL */}
      {editandoMomento && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-pclr1 dark:bg-pdclr1 border border-pclr13 dark:border-pdclr13 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-pclr13 dark:border-pdclr13 pb-3">
              <h3 className="font-bold text-[1.2em] text-pclr4 dark:text-pdclr4">
                {!(programa.momentos_grupales || []).some(m => m.id === editandoMomento.id)
                  ? '🌟 Nuevo Momento Grupal'
                  : '✏️ Editar Momento Grupal'}
              </h3>
              <button onClick={() => setEditandoMomento(null)} className="text-pclr7 dark:text-pdclr7 hover:text-pclr4 dark:hover:text-pdclr4 transition">✕</button>
            </div>

            <form onSubmit={handleGuardarMomento} className="space-y-3.5">
              {/* Selector de Días / Frecuencia */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <label className="block text-[0.9em] font-semibold text-pclr4 dark:text-pdclr4">
                    Días en que se realizará:
                  </label>
                  <span className="text-[0.75em] text-pclr7 dark:text-pdclr7 font-medium">
                    {diasSeleccionadosMomento.length === diasTotales
                      ? 'Todos los días'
                      : `${diasSeleccionadosMomento.length} ${diasSeleccionadosMomento.length === 1 ? 'día marcado' : 'días marcados'}`}
                  </span>
                </div>

                {/* Atajos de frecuencia */}
                <div className="flex gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setDiasSeleccionadosMomento([...diasArray])}
                    className={`px-2.5 py-1 rounded-lg text-[0.75em] font-bold transition border ${
                      diasSeleccionadosMomento.length === diasTotales
                        ? 'bg-pclr10 dark:bg-pdclr10 text-pclr12 dark:text-pdclr12 border-transparent shadow-xs'
                        : 'bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 border-pclr13 dark:border-pdclr13 hover:bg-pclr3 dark:hover:bg-pdclr3'
                    }`}
                  >
                    📅 Todos los Días
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiasSeleccionadosMomento(diasArray.filter(d => d % 2 !== 0))}
                    className="px-2.5 py-1 rounded-lg text-[0.75em] font-bold bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 border border-pclr13 dark:border-pdclr13 hover:bg-pclr3 dark:hover:bg-pdclr3 transition"
                  >
                    ⚡ Día por medio (Impares)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiasSeleccionadosMomento(diasArray.filter(d => d % 2 === 0))}
                    className="px-2.5 py-1 rounded-lg text-[0.75em] font-bold bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 border border-pclr13 dark:border-pdclr13 hover:bg-pclr3 dark:hover:bg-pdclr3 transition"
                  >
                    ⚡ Día por medio (Pares)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiasSeleccionadosMomento([editandoMomento.dia_numero])}
                    className="px-2.5 py-1 rounded-lg text-[0.75em] font-bold bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 border border-pclr13 dark:border-pdclr13 hover:bg-pclr3 dark:hover:bg-pdclr3 transition"
                  >
                    🎯 Solo Día {editandoMomento.dia_numero}
                  </button>
                </div>

                {/* Badges de selección de días específicos */}
                <div className="flex gap-1.5 flex-wrap p-2.5 bg-pclr2 dark:bg-pdclr2 rounded-xl border border-pclr13 dark:border-pdclr13/80">
                  {diasArray.map(d => {
                    const marcado = diasSeleccionadosMomento.includes(d)
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          if (marcado) {
                            if (diasSeleccionadosMomento.length > 1) {
                              setDiasSeleccionadosMomento(diasSeleccionadosMomento.filter(x => x !== d))
                            }
                          } else {
                            setDiasSeleccionadosMomento([...diasSeleccionadosMomento, d].sort((a, b) => a - b))
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[0.8em] font-bold transition flex items-center gap-1.5 border ${
                          marcado
                            ? 'bg-[#cb3327] text-white border-[#cb3327] shadow-xs'
                            : 'bg-pclr3 dark:bg-pdclr3 text-pclr7 dark:text-pdclr7 border-pclr13 dark:border-pdclr13 hover:border-pclr13 dark:border-pdclr13'
                        }`}
                      >
                        <span>{marcado ? '✓' : '+'}</span>
                        <span>Día {d}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[0.9em] font-semibold text-pclr7 dark:text-pdclr7 mb-1">Título del Hito Grupal</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Gran Juego Grupal, Fogón de Campamento, Izamiento"
                  value={editandoMomento.titulo}
                  onChange={e => setEditandoMomento({ ...editandoMomento, titulo: e.target.value })}
                  className="w-full px-3 py-1.5 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[0.9em]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="es_dia_completo"
                  checked={editandoMomento.es_dia_completo}
                  onChange={e => setEditandoMomento({ ...editandoMomento, es_dia_completo: e.target.checked })}
                  className="rounded text-[#cb3327]"
                />
                <label htmlFor="es_dia_completo" className="text-[0.9em] font-medium text-pclr4 dark:text-pdclr4 cursor-pointer">
                  Abarca toda la jornada (Día Completo)
                </label>
              </div>

              {!editandoMomento.es_dia_completo && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[0.9em] font-semibold text-pclr7 dark:text-pdclr7 mb-1">Hora Inicio</label>
                    <input
                      type="time"
                      value={editandoMomento.hora_inicio}
                      onChange={e => setEditandoMomento({ ...editandoMomento, hora_inicio: e.target.value })}
                      className="w-full px-3 py-1.5 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[0.9em]"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.9em] font-semibold text-pclr7 dark:text-pdclr7 mb-1">Hora Fin</label>
                    <input
                      type="time"
                      value={editandoMomento.hora_fin}
                      onChange={e => setEditandoMomento({ ...editandoMomento, hora_fin: e.target.value })}
                      className="w-full px-3 py-1.5 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[0.9em]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[0.9em] font-semibold text-pclr7 dark:text-pdclr7 mb-1">Responsable</label>
                <input
                  type="text"
                  placeholder="Ej: Jefatura de Grupo, Tropa, Clan"
                  value={editandoMomento.responsable}
                  onChange={e => setEditandoMomento({ ...editandoMomento, responsable: e.target.value })}
                  className="w-full px-3 py-1.5 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[0.9em]"
                />
              </div>

              <div>
                <label className="block text-[0.9em] font-semibold text-pclr7 dark:text-pdclr7 mb-1">Lugar en el Recinto</label>
                <input
                  type="text"
                  placeholder="Ej: Explanada de honor, Círculo de fuego"
                  value={editandoMomento.lugar_recinto || ''}
                  onChange={e => setEditandoMomento({ ...editandoMomento, lugar_recinto: e.target.value })}
                  className="w-full px-3 py-1.5 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[0.9em]"
                />
              </div>

              <div>
                <label className="block text-[0.9em] font-semibold text-pclr7 dark:text-pdclr7 mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={editandoMomento.descripcion || ''}
                  onChange={e => setEditandoMomento({ ...editandoMomento, descripcion: e.target.value })}
                  className="w-full px-3 py-1.5 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[0.9em]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-pclr13 dark:border-pdclr13">
                <button
                  type="button"
                  onClick={() => setEditandoMomento(null)}
                  className="px-4 py-1.5 border border-pclr13 dark:border-pdclr13 rounded-lg text-pclr7 dark:text-pdclr7 text-[0.9em]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#cb3327] hover:bg-[#b02920] text-white rounded-lg font-bold text-[0.9em] transition"
                >
                  {diasSeleccionadosMomento.length > 1
                    ? `Guardar en ${diasSeleccionadosMomento.length} Días`
                    : 'Guardar Momento Grupal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR / CREAR ACTIVIDAD DE UNIDAD */}
      {editandoActividad && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-pclr1 dark:bg-pdclr1 border border-pclr13 dark:border-pdclr13 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-pclr13 dark:border-pdclr13 pb-3">
              <h3 className="font-bold text-[1.2em] text-pclr4 dark:text-pdclr4">
                {!(programa.actividades_unidades || []).some(a => a.id === editandoActividad.id)
                  ? `🏕️ Nueva Actividad de ${ramaSeleccionada}`
                  : '✏️ Editar Actividad'}
              </h3>
              <button onClick={() => setEditandoActividad(null)} className="text-pclr7 dark:text-pdclr7 hover:text-pclr4 dark:hover:text-pdclr4 transition">✕</button>
            </div>

            <form onSubmit={handleGuardarActividad} className="space-y-3.5">
              {/* Selector de Rama */}
              <div>
                <label className="block text-[0.9em] font-semibold text-pclr7 dark:text-pdclr7 mb-1">Rama / Sección</label>
                <select
                  value={editandoActividad.unidad_nombre}
                  onChange={e => setEditandoActividad({ ...editandoActividad, unidad_nombre: e.target.value as RamaUnidadTipo })}
                  className="w-full px-3 py-1.5 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[0.9em]"
                >
                  {RAMAS_DISPONIBLES.map(r => (
                    <option key={r.id} value={r.id}>{r.emoji} {r.id}</option>
                  ))}
                </select>
              </div>

              {/* Selector de Días / Frecuencia para Actividad */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <label className="block text-[0.9em] font-semibold text-pclr4 dark:text-pdclr4">
                    Días en que se realizará:
                  </label>
                  <span className="text-[0.75em] text-pclr7 dark:text-pdclr7 font-medium">
                    {diasSeleccionadosActividad.length === diasTotales
                      ? 'Todos los días'
                      : `${diasSeleccionadosActividad.length} ${diasSeleccionadosActividad.length === 1 ? 'día marcado' : 'días marcados'}`}
                  </span>
                </div>

                {/* Atajos de frecuencia */}
                <div className="flex gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setDiasSeleccionadosActividad([...diasArray])}
                    className={`px-2.5 py-1 rounded-lg text-[0.75em] font-bold transition border ${
                      diasSeleccionadosActividad.length === diasTotales
                        ? 'bg-pclr10 dark:bg-pdclr10 text-pclr12 dark:text-pdclr12 border-transparent shadow-xs'
                        : 'bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 border-pclr13 dark:border-pdclr13 hover:bg-pclr3 dark:hover:bg-pdclr3'
                    }`}
                  >
                    📅 Todos los Días
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiasSeleccionadosActividad(diasArray.filter(d => d % 2 !== 0))}
                    className="px-2.5 py-1 rounded-lg text-[0.75em] font-bold bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 border border-pclr13 dark:border-pdclr13 hover:bg-pclr3 dark:hover:bg-pdclr3 transition"
                  >
                    ⚡ Día por medio (Impares)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiasSeleccionadosActividad(diasArray.filter(d => d % 2 === 0))}
                    className="px-2.5 py-1 rounded-lg text-[0.75em] font-bold bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 border border-pclr13 dark:border-pdclr13 hover:bg-pclr3 dark:hover:bg-pdclr3 transition"
                  >
                    ⚡ Día por medio (Pares)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiasSeleccionadosActividad([editandoActividad.dia_numero])}
                    className="px-2.5 py-1 rounded-lg text-[0.75em] font-bold bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 border border-pclr13 dark:border-pdclr13 hover:bg-pclr3 dark:hover:bg-pdclr3 transition"
                  >
                    🎯 Solo Día {editandoActividad.dia_numero}
                  </button>
                </div>

                {/* Badges de selección de días específicos */}
                <div className="flex gap-1.5 flex-wrap p-2.5 bg-pclr2 dark:bg-pdclr2 rounded-xl border border-pclr13 dark:border-pdclr13/80">
                  {diasArray.map(d => {
                    const marcado = diasSeleccionadosActividad.includes(d)
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          if (marcado) {
                            if (diasSeleccionadosActividad.length > 1) {
                              setDiasSeleccionadosActividad(diasSeleccionadosActividad.filter(x => x !== d))
                            }
                          } else {
                            setDiasSeleccionadosActividad([...diasSeleccionadosActividad, d].sort((a, b) => a - b))
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[0.8em] font-bold transition flex items-center gap-1.5 border ${
                          marcado
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-pclr3 dark:bg-pdclr3 text-pclr7 dark:text-pdclr7 border-pclr13 dark:border-pdclr13 hover:border-pclr13 dark:border-pdclr13'
                        }`}
                      >
                        <span>{marcado ? '✓' : '+'}</span>
                        <span>Día {d}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[0.9em] font-semibold text-pclr7 dark:text-pdclr7 mb-1">Título de la Actividad</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Construcción de Rincón, Taller de Cabuyería, Caza"
                  value={editandoActividad.titulo}
                  onChange={e => setEditandoActividad({ ...editandoActividad, titulo: e.target.value })}
                  className="w-full px-3 py-1.5 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[0.9em]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[0.9em] font-semibold text-pclr7 dark:text-pdclr7 mb-1">Hora Inicio</label>
                  <input
                    type="time"
                    value={editandoActividad.hora_inicio}
                    onChange={e => setEditandoActividad({ ...editandoActividad, hora_inicio: e.target.value })}
                    className="w-full px-3 py-1.5 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[0.9em]"
                  />
                </div>
                <div>
                  <label className="block text-[0.9em] font-semibold text-pclr7 dark:text-pdclr7 mb-1">Hora Fin</label>
                  <input
                    type="time"
                    value={editandoActividad.hora_fin}
                    onChange={e => setEditandoActividad({ ...editandoActividad, hora_fin: e.target.value })}
                    className="w-full px-3 py-1.5 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[0.9em]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[0.9em] font-semibold text-pclr7 dark:text-pdclr7 mb-1">Objetivo / Área de Progresión</label>
                <input
                  type="text"
                  placeholder="Ej: Corporalidad, Creatividad, Carácter, Afectividad"
                  value={editandoActividad.objetivo_progresion || ''}
                  onChange={e => setEditandoActividad({ ...editandoActividad, objetivo_progresion: e.target.value })}
                  className="w-full px-3 py-1.5 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[0.9em]"
                />
              </div>

              <div>
                <label className="block text-[0.9em] font-semibold text-pclr7 dark:text-pdclr7 mb-1">Responsable</label>
                <input
                  type="text"
                  placeholder={`Ej: Jefe de ${editandoActividad.unidad_nombre}`}
                  value={editandoActividad.responsable}
                  onChange={e => setEditandoActividad({ ...editandoActividad, responsable: e.target.value })}
                  className="w-full px-3 py-1.5 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[0.9em]"
                />
              </div>

              <div>
                <label className="block text-[0.9em] font-semibold text-pclr7 dark:text-pdclr7 mb-1">Materiales</label>
                <input
                  type="text"
                  placeholder="Ej: Colihues, lanas, cuerdas, tiza"
                  value={editandoActividad.materiales || ''}
                  onChange={e => setEditandoActividad({ ...editandoActividad, materiales: e.target.value })}
                  className="w-full px-3 py-1.5 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[0.9em]"
                />
              </div>

              <div>
                <label className="block text-[0.9em] font-semibold text-pclr7 dark:text-pdclr7 mb-1">Descripción / Reglas</label>
                <textarea
                  rows={2}
                  value={editandoActividad.descripcion || ''}
                  onChange={e => setEditandoActividad({ ...editandoActividad, descripcion: e.target.value })}
                  className="w-full px-3 py-1.5 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[0.9em]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-pclr13 dark:border-pdclr13">
                <button
                  type="button"
                  onClick={() => setEditandoActividad(null)}
                  className="px-4 py-1.5 border border-pclr13 dark:border-pdclr13 rounded-lg text-pclr7 dark:text-pdclr7 text-[0.9em]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[0.9em] transition"
                >
                  {diasSeleccionadosActividad.length > 1
                    ? `Guardar en ${diasSeleccionadosActividad.length} Días`
                    : 'Guardar Actividad'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}


