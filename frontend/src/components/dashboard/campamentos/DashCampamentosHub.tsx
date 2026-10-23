'use client'

import React, { useState, useEffect, useMemo } from 'react'
import type {
  CampamentoPreparacion,
  CotizacionBusItem,
  CotizacionLugarItem,
  InspeccionBusData
} from '@/types/campamento-preparacion'
import {
  calcularPresupuestoGlobal,
  formatearFechaDDMMYYYY
} from '@/utils/campamento-presupuesto-global'
import { db } from '@/lib/db'
import { supabase } from '@/lib/supabase'
import { useDashboardContext } from '@/contexts/DashboardContext'
import { isAdmin } from '@/lib/roles'
import { CampamentoPresupuestoGlobalTab } from './CampamentoPresupuestoGlobalTab'
import { CampamentoTransporteTab } from './CampamentoTransporteTab'
import { CampamentoEstadiaTab } from './CampamentoEstadiaTab'
import { CampamentoProgramaTab } from './CampamentoProgramaTab'
import { DashCampamentoMenuManager } from '../menus/DashCampamentoMenuManager'
import { generarMomentosGrupalesPredeterminados } from '@/utils/campamento-programa-presets'
import { generarMenuEnBlanco } from '@/lib/campamento-menu-presets'

export interface JefaturaResponsable {
  id: string
  nombre_completo: string
  rol_nombre: 'Dirigente' | 'Guiadora'
}

export const FALLBACK_JEFATURAS: JefaturaResponsable[] = [
  { id: 'jef-rodrigo', nombre_completo: 'Rodrigo Silva', rol_nombre: 'Dirigente' },
  { id: 'jef-mariana', nombre_completo: 'Mariana Fuentes', rol_nombre: 'Guiadora' },
  { id: 'jef-claudio', nombre_completo: 'Claudio Morales', rol_nombre: 'Dirigente' }
]

export const DashCampamentosHub: React.FC = () => {
  const { perfil } = useDashboardContext()
  const esAdmin = !!perfil && isAdmin(perfil)

  const [campamentos, setCampamentos] = useState<CampamentoPreparacion[]>([])
  const [selectedCampId, setSelectedCampId] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'presupuesto' | 'menu' | 'transporte' | 'estadia' | 'programa'>('presupuesto')
  const [guardadoStatus, setGuardadoStatus] = useState<string | null>(null)
  const [costoAlimentacion, setCostoAlimentacion] = useState<number>(0)

  // Estado para el modal de Nuevo Campamento
  const [modalNuevoCampAbierto, setModalNuevoCampAbierto] = useState(false)
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [nuevoTipo, setNuevoTipo] = useState<'verano' | 'primavera' | 'invierno' | 'salida_corta'>('verano')
  const [nuevoLugar, setNuevoLugar] = useState('')
  const [nuevoFechaInicio, setNuevoFechaInicio] = useState(() => new Date().toISOString().split('T')[0])
  const [nuevoFechaFin, setNuevoFechaFin] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 3)
    return d.toISOString().split('T')[0]
  })
  const [nuevoNnj, setNuevoNnj] = useState(35)
  const [nuevoJefatura, setNuevoJefatura] = useState(6)
  const [nuevoApoderados, setNuevoApoderados] = useState(3)

  // Jefaturas disponibles para Responsable de Campamento (Dirigente o Guiadora)
  const [jefaturasDisponibles, setJefaturasDisponibles] = useState<JefaturaResponsable[]>([])
  const [nuevoResponsableId, setNuevoResponsableId] = useState<string>('')
  const [nuevoResponsableNombre, setNuevoResponsableNombre] = useState<string>('')
  const [nuevoResponsableRol, setNuevoResponsableRol] = useState<'Dirigente' | 'Guiadora'>('Dirigente')

  // Inferencia reactiva de días totales
  const diasInferidos = useMemo(() => {
    if (!nuevoFechaInicio || !nuevoFechaFin) return 1
    const ini = new Date(nuevoFechaInicio)
    const fin = new Date(nuevoFechaFin)
    const diffMs = fin.getTime() - ini.getTime()
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1
    return diffDias > 0 ? diffDias : 1
  }, [nuevoFechaInicio, nuevoFechaFin])

  // Cargar campamentos desde Dexie Offline (sin precargar datos ficticios en producción)
  useEffect(() => {
    async function initCampamentos() {
      try {
        const guardados = await db.campamento_preparaciones.toArray()
        if (guardados && guardados.length > 0) {
          setCampamentos(guardados)
          setSelectedCampId(guardados[0].id)
        } else {
          setCampamentos([])
          setSelectedCampId('')
        }
      } catch (err) {
        console.warn('Error inicializando campamentos en Dexie:', err)
        setCampamentos([])
        setSelectedCampId('')
      }
    }

    initCampamentos()
  }, [])

  // Cargar lista de Dirigentes y Guiadoras elegibles como Responsable de Campamento
  useEffect(() => {
    async function cargarJefaturas() {
      try {
        // 1. Intentar cargar perfiles online desde Supabase
        const { data, error } = await supabase
          .from('perfiles')
          .select('id, nombres, apellidos, rol_id, roles(name)')
          .in('rol_id', [2, 3])
          .order('nombres')

        if (!error && data && data.length > 0) {
          const list: JefaturaResponsable[] = data.map((p: any) => ({
            id: p.id,
            nombre_completo: `${p.nombres || ''} ${p.apellidos || ''}`.trim() || 'Sin nombre',
            rol_nombre: p.rol_id === 3 ? 'Guiadora' : 'Dirigente'
          }))
          setJefaturasDisponibles(list)
          return
        }

        // 2. Si falla o estamos offline, consultar Dexie
        const perfilesLocales = await db.perfiles.filter(p => p.rol_id === 2 || p.rol_id === 3).toArray()
        if (perfilesLocales.length > 0) {
          const list: JefaturaResponsable[] = perfilesLocales.map(p => ({
            id: p.id,
            nombre_completo: `${p.nombres || ''} ${p.apellidos || ''}`.trim() || 'Sin nombre',
            rol_nombre: p.rol_id === 3 ? 'Guiadora' : 'Dirigente'
          }))
          setJefaturasDisponibles(list)
          return
        }

        // 3. Fallback inteligente con usuario actual si es dirigente/guiadora o lista predeterminada
        if (perfil && (perfil.rol_id === 2 || perfil.rol_id === 3)) {
          const miJefatura: JefaturaResponsable = {
            id: perfil.id,
            nombre_completo: `${perfil.nombres || ''} ${perfil.apellidos || ''}`.trim() || 'Mi Perfil',
            rol_nombre: perfil.rol_id === 3 ? 'Guiadora' : 'Dirigente'
          }
          setJefaturasDisponibles([miJefatura, ...FALLBACK_JEFATURAS.filter(f => f.id !== perfil.id)])
        } else {
          setJefaturasDisponibles(FALLBACK_JEFATURAS)
        }
      } catch (e) {
        console.warn('Error cargando dirigentes/guiadoras:', e)
        setJefaturasDisponibles(FALLBACK_JEFATURAS)
      }
    }

    cargarJefaturas()
  }, [perfil])

  const campamentoActivo = useMemo(() => {
    return campamentos.find(c => c.id === selectedCampId) || campamentos[0] || null
  }, [campamentos, selectedCampId])

  // Obtener costo de alimentación desde el menú guardado
  useEffect(() => {
    async function cargarCostoMenu() {
      if (!campamentoActivo?.menu_id) {
        setCostoAlimentacion(0)
        return
      }
      try {
        const menuGuardado = await db.campamento_menus.get(campamentoActivo.menu_id)
        if (menuGuardado?.costo_total_estimado) {
          setCostoAlimentacion(menuGuardado.costo_total_estimado)
        } else {
          setCostoAlimentacion(0)
        }
      } catch (e) {
        console.warn('Error leyendo menú de campamento:', e)
        setCostoAlimentacion(0)
      }
    }
    cargarCostoMenu()
  }, [campamentoActivo])

  // Cálculo presupuestario consolidado en tiempo real
  const resultadoPresupuesto = useMemo(() => {
    if (!campamentoActivo) return null
    return calcularPresupuestoGlobal(campamentoActivo, costoAlimentacion)
  }, [campamentoActivo, costoAlimentacion])

  // Persistir cambios en Dexie
  const persistirCampamento = async (actualizado: CampamentoPreparacion) => {
    try {
      const listo = {
        ...actualizado,
        updated_at: new Date().toISOString()
      }
      const nuevas = campamentos.map(c => (c.id === listo.id ? listo : c))
      setCampamentos(nuevas)
      await db.campamento_preparaciones.put(listo)
      setGuardadoStatus('Guardado offline ✓')
      setTimeout(() => setGuardadoStatus(null), 2500)
    } catch (err) {
      console.error('Error guardando campamento en Dexie:', err)
    }
  }

  const handleUpdateCampamento = (cambios: Partial<CampamentoPreparacion>) => {
    if (!campamentoActivo) return
    persistirCampamento({
      ...campamentoActivo,
      ...cambios
    })
  }

  const abrirModalNuevoCampamento = () => {
    setNuevoNombre('')
    setNuevoTipo('verano')
    setNuevoLugar('')
    const hoy = new Date().toISOString().split('T')[0]
    const fin = new Date()
    fin.setDate(fin.getDate() + 3)
    setNuevoFechaInicio(hoy)
    setNuevoFechaFin(fin.toISOString().split('T')[0])
    setNuevoNnj(35)
    setNuevoJefatura(6)
    setNuevoApoderados(3)

    // Preseleccionar Responsable por defecto (prioriza al usuario actual si es dirigente/guiadora)
    const list = jefaturasDisponibles.length > 0 ? jefaturasDisponibles : FALLBACK_JEFATURAS
    const miJefatura = list.find(j => j.id === perfil?.id)
    const inicial = miJefatura || list[0]
    if (inicial) {
      setNuevoResponsableId(inicial.id)
      setNuevoResponsableNombre(inicial.nombre_completo)
      setNuevoResponsableRol(inicial.rol_nombre)
    }

    setModalNuevoCampAbierto(true)
  }

  const handleConfirmarNuevoCampamento = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoNombre.trim()) return

    const nuevoCampId = `camp-${Date.now()}`
    const nuevoMenuId = `menu-${nuevoCampId}`

    // 1. Crear Campamento completamente en blanco
    const nuevo: CampamentoPreparacion = {
      id: nuevoCampId,
      nombre: nuevoNombre.trim(),
      tipo_campamento: nuevoTipo,
      lugar_nombre: nuevoLugar.trim() || 'Por definir',
      fecha_inicio: nuevoFechaInicio,
      fecha_fin: nuevoFechaFin,
      dias_totales: diasInferidos,
      responsable_id: nuevoResponsableId || undefined,
      responsable_nombre: nuevoResponsableNombre || 'Sin asignar',
      responsable_rol: nuevoResponsableRol,
      asistentes_nnj: Number(nuevoNnj) || 0,
      asistentes_jefatura: Number(nuevoJefatura) || 0,
      asistentes_apoderados: Number(nuevoApoderados) || 0,
      eximir_jefatura: true,
      eximir_apoderados: true,
      margen_imprevistos_pct: 5,
      menu_id: nuevoMenuId,
      cotizaciones_bus: [],
      cotizaciones_lugar: [],
      otros_costos: [],
      programa: {
        momentos_grupales: [],
        actividades_unidades: []
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // 2. Crear Menú en blanco exclusivo con la grilla de días inferida
    const menuLimpio = generarMenuEnBlanco(nuevoMenuId, diasInferidos, nuevoNnj + nuevoJefatura + nuevoApoderados)
    menuLimpio.actividad_id = nuevoCampId
    menuLimpio.actividad_nombre = nuevo.nombre

    await db.campamento_menus.put(menuLimpio)
    await db.campamento_preparaciones.put(nuevo)

    const lista = [nuevo, ...campamentos]
    setCampamentos(lista)
    setSelectedCampId(nuevo.id)
    setCostoAlimentacion(0)
    setModalNuevoCampAbierto(false)
    setGuardadoStatus('¡Nuevo campamento en blanco creado! ✓')
    setTimeout(() => setGuardadoStatus(null), 3000)
  }

  // Actualizar cotizaciones de bus
  const handleUpdateBuses = (cotizaciones: CotizacionBusItem[], adjudicadoId?: string) => {
    if (!campamentoActivo) return
    persistirCampamento({
      ...campamentoActivo,
      cotizaciones_bus: cotizaciones,
      bus_adjudicado_id: adjudicadoId
    })
  }

  const handleUpdateInspeccion = (inspeccion: InspeccionBusData) => {
    if (!campamentoActivo) return
    persistirCampamento({
      ...campamentoActivo,
      inspeccion_bus: inspeccion
    })
  }

  // Actualizar cotizaciones de lugar
  const handleUpdateLugares = (cotizaciones: CotizacionLugarItem[], adjudicadoId?: string) => {
    if (!campamentoActivo) return
    persistirCampamento({
      ...campamentoActivo,
      cotizaciones_lugar: cotizaciones,
      lugar_adjudicado_id: adjudicadoId
    })
  }

  // Eliminar campamento completo (exclusivo para usuarios con rol Admin)
  const handleEliminarCampamento = async (campId: string) => {
    if (!esAdmin) {
      alert('Solo los usuarios con rol Administrador tienen permisos para eliminar campamentos.')
      return
    }

    const campAEliminar = campamentos.find(c => c.id === campId)
    if (!campAEliminar) return

    const confirmacion = window.confirm(
      `¿Estás seguro de eliminar permanentemente el campamento "${campAEliminar.nombre}"?\n\nEsta acción borrará también su menú asociado, presupuestos, cotizaciones y programa.`
    )
    if (!confirmacion) return

    try {
      // 1. Eliminar campamento de Dexie
      await db.campamento_preparaciones.delete(campId)

      // 2. Eliminar menú asociado si existe
      if (campAEliminar.menu_id) {
        await db.campamento_menus.delete(campAEliminar.menu_id)
      }
      // Eliminar también posibles variantes de clave
      await db.campamento_menus.delete(`menu-${campId}`)

      // 3. Actualizar estado
      const filtrados = campamentos.filter(c => c.id !== campId)
      setCampamentos(filtrados)

      if (filtrados.length > 0) {
        setSelectedCampId(filtrados[0].id)
      } else {
        setSelectedCampId('')
      }

      setGuardadoStatus('Campamento eliminado ✓')
      setTimeout(() => setGuardadoStatus(null), 3000)
    } catch (err) {
      console.error('Error al eliminar campamento:', err)
      alert('Hubo un error al eliminar el campamento.')
    }
  }

  return (
    <div className="space-y-6 text-[1em] animate-in fade-in duration-500 w-full min-w-0 max-w-full">
      {/* Barra de Encabezado Superior del Módulo */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-2 sm:p-4 shadow-sm space-y-4 w-full min-w-0 max-w-full overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏕️</span>
          <h2 className="text-2xl font-black font-display uppercase tracking-tight text-zinc-900 dark:text-zinc-100">
            Preparación de Campamentos
          </h2>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 min-w-0">
          <div className="space-y-1 min-w-0 max-w-xl">
            <p className="text-[0.9em] text-zinc-500 font-medium">
              Gestión centralizada de presupuestos, menús específicos, cotizaciones de buses con inspección técnica y terrenos.
            </p>
          </div>

          {/* Selector de Campamento y Acciones */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full md:w-auto shrink-0">
            {guardadoStatus && (
              <span className="self-start sm:self-auto text-[0.85em] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 shrink-0">
                {guardadoStatus}
              </span>
            )}

            {/* Listado / Selector de Campamentos (solo si existen campamentos) */}
            {campamentos.length > 0 && campamentoActivo && (
              <select
                value={campamentoActivo.id}
                onChange={e => setSelectedCampId(e.target.value)}
                className="w-full sm:w-auto sm:max-w-[240px] md:max-w-[280px] lg:max-w-[340px] truncate px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold text-[1em] shrink-0"
                title={campamentoActivo.nombre}
              >
                {campamentos.map(c => (
                  <option key={c.id} value={c.id} className="truncate">
                    {c.nombre} ({c.dias_totales} {c.dias_totales === 1 ? 'día' : 'días'})
                  </option>
                ))}
              </select>
            )}

            {/* Botones de Acción */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              {esAdmin && campamentoActivo && (
                <button
                  type="button"
                  onClick={() => handleEliminarCampamento(campamentoActivo.id)}
                  title="Eliminar este campamento (Exclusivo Administrador)"
                  className="px-3 py-2 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl text-[0.9em] font-semibold transition flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>🗑️</span>
                  <span>Eliminar</span>
                </button>
              )}

              <button
                onClick={abrirModalNuevoCampamento}
                className="flex-1 sm:flex-initial px-4 py-2 bg-[#cb3327] hover:bg-[#b02920] text-white font-bold rounded-xl text-[0.95em] shadow-sm transition flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <span>➕</span> Nuevo Campamento
              </button>
            </div>
          </div>
        </div>

        {/* Pestañas de Navegación del Campamento Activo (solo si hay campamento seleccionado) */}
        {campamentoActivo && (
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 pt-2 gap-2 overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('presupuesto')}
              className={`pb-3 px-4 font-semibold text-[1em] border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'presupuesto'
                  ? 'border-[#cb3327] text-[#cb3327]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <span>📊</span> Presupuesto
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`pb-2 px-2 font-semibold text-[1em] border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'menu'
                  ? 'border-[#cb3327] text-[#cb3327]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <span>🍲</span> Alimentación
            </button>

            <button
              onClick={() => setActiveTab('transporte')}
              className={`pb-2 px-2 font-semibold text-[1em] border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'transporte'
                  ? 'border-[#cb3327] text-[#cb3327]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <span>🚌</span> Transporte ({campamentoActivo.cotizaciones_bus?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab('estadia')}
              className={`pb-2 px-2 font-semibold text-[1em] border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'estadia'
                  ? 'border-[#cb3327] text-[#cb3327]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <span>🏕️</span> Lugar ({campamentoActivo.cotizaciones_lugar?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab('programa')}
              className={`pb-2 px-2 font-semibold text-[1em] border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'programa'
                  ? 'border-[#cb3327] text-[#cb3327]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <span>🎯</span> Cronogramas
            </button>
          </div>
        )}
      </div>

      {/* Estado vacío cuando no hay campamentos registrados aún */}
      {!campamentoActivo ? (
        <div className="bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-10 sm:p-14 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 text-[#cb3327] rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">
            🏕️
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-black font-display uppercase tracking-tight text-zinc-900 dark:text-zinc-100">
              No hay campamentos registrados aún
            </h3>
            <p className="text-[0.9em] text-zinc-500 max-w-md mx-auto">
              Comienza planificando un nuevo campamento desde cero. Podrás gestionar presupuesto global, menús por día, cotizaciones de buses e inspección técnica, terreno y cronogramas.
            </p>
          </div>
          <button
            type="button"
            onClick={abrirModalNuevoCampamento}
            className="px-5 py-2.5 bg-[#cb3327] hover:bg-[#b02920] text-white font-bold rounded-xl text-[0.95em] shadow-sm transition inline-flex items-center gap-2"
          >
            <span>➕</span> Planificar Primer Campamento
          </button>
        </div>
      ) : (
        <>
          {/* Tarjeta de Resumen General del Campamento Activo */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-[0.95em] w-full min-w-0 max-w-full">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="font-extrabold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <span>📍</span> {campamentoActivo.lugar_nombre || 'Lugar por definir'}
              </span>
              <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">•</span>
              <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                <span>📅</span> {formatearFechaDDMMYYYY(campamentoActivo.fecha_inicio)} al {formatearFechaDDMMYYYY(campamentoActivo.fecha_fin)} ({campamentoActivo.dias_totales} {campamentoActivo.dias_totales === 1 ? 'día' : 'días'})
              </span>
            </div>

            {/* Badge del Responsable de Campamento */}
            <div className="flex items-center gap-2.5 bg-zinc-50 dark:bg-zinc-800/80 px-3.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700">
              <span className="text-xl">👤</span>
              <div className="leading-tight">
                <span className="block text-[0.8em] uppercase font-bold text-zinc-500 dark:text-zinc-400">
                  Responsable de Campamento
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 text-[1.05em]">
                    {campamentoActivo.responsable_nombre || 'Sin asignar'}
                  </span>
                  {campamentoActivo.responsable_rol && (
                    <span className="text-[0.8em] px-2 py-0.5 rounded-full font-semibold bg-red-100 dark:bg-red-950/60 text-[#cb3327] dark:text-red-400 border border-red-200 dark:border-red-900/60">
                      {campamentoActivo.responsable_rol}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contenido según la pestaña activa */}
          {activeTab === 'presupuesto' && resultadoPresupuesto && (
            <CampamentoPresupuestoGlobalTab
              campamento={campamentoActivo}
              resultado={resultadoPresupuesto}
              onUpdateCampamento={handleUpdateCampamento}
            />
          )}

          {activeTab === 'menu' && resultadoPresupuesto && (
            <DashCampamentoMenuManager
              actividadIdInicial={campamentoActivo.id}
              diasCampamento={campamentoActivo.dias_totales}
              personasCampamento={resultadoPresupuesto.totalAsistentes}
            />
          )}

          {activeTab === 'transporte' && resultadoPresupuesto && (
            <CampamentoTransporteTab
              cotizaciones={campamentoActivo.cotizaciones_bus || []}
              busAdjudicadoId={campamentoActivo.bus_adjudicado_id}
              inspeccion={campamentoActivo.inspeccion_bus}
              totalAsistentes={resultadoPresupuesto.totalAsistentes}
              onUpdateCotizaciones={handleUpdateBuses}
              onUpdateInspeccion={handleUpdateInspeccion}
            />
          )}

          {activeTab === 'estadia' && resultadoPresupuesto && (
            <CampamentoEstadiaTab
              cotizaciones={campamentoActivo.cotizaciones_lugar || []}
              lugarAdjudicadoId={campamentoActivo.lugar_adjudicado_id}
              totalAsistentes={resultadoPresupuesto.totalAsistentes}
              diasTotales={campamentoActivo.dias_totales}
              onUpdateCotizaciones={handleUpdateLugares}
            />
          )}

          {activeTab === 'programa' && (
            <CampamentoProgramaTab
              programa={campamentoActivo.programa || { momentos_grupales: generarMomentosGrupalesPredeterminados(campamentoActivo.dias_totales), actividades_unidades: [] }}
              diasTotales={campamentoActivo.dias_totales}
              onUpdatePrograma={(nuevoPrograma) => handleUpdateCampamento({ programa: nuevoPrograma })}
            />
          )}
        </>
      )}

      {/* MODAL: Planificar Nuevo Campamento en Blanco */}
      {modalNuevoCampAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏕️</span>
                <h3 className="text-lg font-bold font-display text-zinc-900 dark:text-zinc-100">
                  Planificar Nuevo Campamento
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalNuevoCampAbierto(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmarNuevoCampamento} className="space-y-4 text-[1em]">
              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Nombre del Campamento *
                </label>
                <input
                  type="text"
                  required
                  value={nuevoNombre}
                  onChange={e => setNuevoNombre(e.target.value)}
                  placeholder="Ej: Campamento de Verano 2026 - Lago Ranco"
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 font-semibold"
                />
              </div>

              {/* Responsable de Campamento (exclusivo Dirigente o Guiadora) */}
              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Responsable de Campamento *
                </label>
                <p className="text-[0.8em] text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Encargado de que todo el campamento salga correctamente en sus tiempos y formas planificados (rol Dirigente o Guiadora).
                </p>
                <select
                  required
                  value={nuevoResponsableId}
                  onChange={e => {
                    const selId = e.target.value
                    setNuevoResponsableId(selId)
                    const lista = jefaturasDisponibles.length > 0 ? jefaturasDisponibles : FALLBACK_JEFATURAS
                    const found = lista.find(j => j.id === selId)
                    if (found) {
                      setNuevoResponsableNombre(found.nombre_completo)
                      setNuevoResponsableRol(found.rol_nombre)
                    }
                  }}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 font-semibold text-[1em]"
                >
                  <option value="" disabled>-- Selecciona un Dirigente o Guiadora --</option>
                  {(jefaturasDisponibles.length > 0 ? jefaturasDisponibles : FALLBACK_JEFATURAS).map(j => (
                    <option key={j.id} value={j.id}>
                      {j.nombre_completo} ({j.rol_nombre})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Tipo de Campamento
                  </label>
                  <select
                    value={nuevoTipo}
                    onChange={e => setNuevoTipo(e.target.value as any)}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800"
                  >
                    <option value="verano">☀️ Verano</option>
                    <option value="primavera">🌸 Primavera</option>
                    <option value="invierno">❄️ Invierno</option>
                    <option value="salida_corta">⛺ Salida Corta</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Lugar / Destino Tentativo
                  </label>
                  <input
                    type="text"
                    value={nuevoLugar}
                    onChange={e => setNuevoLugar(e.target.value)}
                    placeholder="Ej: Camping Los Notros, Ranco"
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800"
                  />
                </div>
              </div>

              {/* Fechas e Inferencia de Días */}
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Fecha de Inicio *
                    </label>
                    <input
                      type="date"
                      required
                      value={nuevoFechaInicio}
                      onChange={e => setNuevoFechaInicio(e.target.value)}
                      className="w-full px-3 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Fecha de Término *
                    </label>
                    <input
                      type="date"
                      required
                      min={nuevoFechaInicio}
                      value={nuevoFechaFin}
                      onChange={e => setNuevoFechaFin(e.target.value)}
                      className="w-full px-3 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between px-3 py-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                  <span className="text-[0.85em] font-semibold text-emerald-800 dark:text-emerald-200">
                    Duración calculada:
                  </span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-300 text-[1.05em]">
                    📅 {diasInferidos} {diasInferidos === 1 ? 'Día' : 'Días de Campamento'}
                  </span>
                </div>
              </div>

              {/* Estimación de Comensales */}
              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Asistencia Estimada (Comensales)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[0.8em] text-zinc-500 block mb-0.5">NNJ</span>
                    <input
                      type="number"
                      min="0"
                      value={nuevoNnj}
                      onChange={e => setNuevoNnj(Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[0.8em] text-zinc-500 block mb-0.5">Jefatura</span>
                    <input
                      type="number"
                      min="0"
                      value={nuevoJefatura}
                      onChange={e => setNuevoJefatura(Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[0.8em] text-zinc-500 block mb-0.5">Apoderados</span>
                    <input
                      type="number"
                      min="0"
                      value={nuevoApoderados}
                      onChange={e => setNuevoApoderados(Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 font-bold"
                    />
                  </div>
                </div>
              </div>

              <p className="text-[0.8em] text-zinc-500 italic">
                ℹ️ Toda la información (presupuesto, cotizaciones de buses, terrenos, momentos grupales y menú) se creará en blanco lista para planificar desde cero.
              </p>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setModalNuevoCampAbierto(false)}
                  className="px-4 py-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#cb3327] hover:bg-[#b02920] text-white font-bold rounded-xl shadow-sm transition"
                >
                  Comenzar Planificación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
