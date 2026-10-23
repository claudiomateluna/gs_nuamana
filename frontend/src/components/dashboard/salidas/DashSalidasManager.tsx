'use client'

import { useState, useMemo } from 'react'
import type { Perfil, ActividadProgramada, AutorizacionActividad } from '@/types'
import { isDirectivo } from '@/lib/roles'
import { exportarSalidaAutorizacionesExcel, type AsistenteSalidaData } from '@/utils/excel-export'

interface DashSalidasManagerProps {
  perfil: Perfil
  actividades: ActividadProgramada[]
  autorizaciones: AutorizacionActividad[]
  miembros: Perfil[]
  isOffline?: boolean
  onVerAutorizacion: (auth: AutorizacionActividad, profile: Perfil) => void
  onCrearSalida?: () => void
  onPlanificarMenu?: (actividadId: string) => void
}

export default function DashSalidasManager({
  perfil,
  actividades,
  autorizaciones,
  miembros,
  isOffline = false,
  onVerAutorizacion,
  onCrearSalida,
  onPlanificarMenu
}: DashSalidasManagerProps) {
  const [tabFiltro, setTabFiltro] = useState<'activas' | 'historial'>('activas')
  const [selectedActId, setSelectedActId] = useState<string | null>(null)
  const [busquedaSalida, setBusquedaSalida] = useState('')
  const [busquedaParticipante, setBusquedaParticipante] = useState('')

  // Mapa rápido de perfiles por id
  const perfilesMap = useMemo(() => {
    const map = new Map<string, Perfil>()
    for (const m of miembros) {
      map.set(m.id, m)
    }
    return map
  }, [miembros])

  // Agrupar autorizaciones por actividad_id
  const authsPorActividad = useMemo(() => {
    const map = new Map<string, AutorizacionActividad[]>()
    for (const a of autorizaciones) {
      if (!a.actividad_id) continue
      const list = map.get(a.actividad_id) || []
      list.push(a)
      map.set(a.actividad_id, list)
    }
    return map
  }, [autorizaciones])

  // Separar actividades activas / futuras vs historial / pasadas
  const { activas, pasadas } = useMemo(() => {
    const hoyStr = new Date().toISOString().split('T')[0]
    const listActivas: ActividadProgramada[] = []
    const listPasadas: ActividadProgramada[] = []

    for (const act of actividades) {
      const fechaComparar = act.fecha_fin || act.fecha_inicio
      if (fechaComparar && fechaComparar < hoyStr) {
        listPasadas.push(act)
      } else {
        listActivas.push(act)
      }
    }

    return {
      activas: listActivas.sort((a, b) => (a.fecha_inicio || '').localeCompare(b.fecha_inicio || '')),
      pasadas: listPasadas.sort((a, b) => (b.fecha_inicio || '').localeCompare(a.fecha_inicio || ''))
    }
  }, [actividades])

  // Lista filtrada según pestaña y búsqueda
  const actividadesMostradas = useMemo(() => {
    const base = tabFiltro === 'activas' ? activas : pasadas
    if (!busquedaSalida.trim()) return base
    const query = busquedaSalida.toLowerCase()
    return base.filter(a => 
      (a.nombre || '').toLowerCase().includes(query) ||
      (a.lugar || '').toLowerCase().includes(query) ||
      (a.tipo || '').toLowerCase().includes(query)
    )
  }, [tabFiltro, activas, pasadas, busquedaSalida])

  // Actividad seleccionada actualmente
  const actividadSeleccionada = useMemo(() => {
    if (!selectedActId) {
      return actividadesMostradas[0] || null
    }
    return actividades.find(a => a.id === selectedActId) || actividadesMostradas[0] || null
  }, [selectedActId, actividadesMostradas, actividades])

  // Asistentes autorizados de la actividad seleccionada
  const asistentesSalida = useMemo(() => {
    if (!actividadSeleccionada) return []
    const auths = authsPorActividad.get(actividadSeleccionada.id) || []

    const list: AsistenteSalidaData[] = []
    for (const auth of auths) {
      const p = perfilesMap.get(auth.perfil_id)
      if (p) {
        list.push({
          perfil: p,
          autorizacion: {
            fecha_firma: auth.fecha_firma,
            nombre_firmante: auth.nombre_firmante,
            rut_firmante: auth.rut_firmante,
            estado: auth.estado
          },
          authOriginal: auth
        })
      } else {
        // Si el perfil no está en la lista de la unidad actual (por ejemplo participante de otra unidad),
        // sintetizar perfil a partir de los datos guardados en la autorización
        const perfilSintetico: Perfil = {
          id: auth.perfil_id || `auth-${auth.id}`,
          nombres: auth.nombre_firmante ? `Participante (${auth.nombre_firmante})` : 'Participante',
          apellidos: '',
          rut: auth.rut_firmante || '',
          unidad_id: null,
          rol_id: null,
          unidades: { nombre: 'Grupo Scout' } as any
        }
        list.push({
          perfil: perfilSintetico,
          autorizacion: {
            fecha_firma: auth.fecha_firma,
            nombre_firmante: auth.nombre_firmante,
            rut_firmante: auth.rut_firmante,
            estado: auth.estado
          },
          authOriginal: auth
        })
      }
    }

    return list.sort((a, b) => (a.perfil.nombres || '').localeCompare(b.perfil.nombres || ''))
  }, [actividadSeleccionada, authsPorActividad, perfilesMap])

  // Asistentes filtrados por buscador
  const asistentesFiltrados = useMemo(() => {
    if (!busquedaParticipante.trim()) return asistentesSalida
    const query = busquedaParticipante.toLowerCase()
    return asistentesSalida.filter(a =>
      `${a.perfil.nombres || ''} ${a.perfil.apellidos || ''}`.toLowerCase().includes(query) ||
      (a.perfil.rut || '').toLowerCase().includes(query) ||
      (a.autorizacion.nombre_firmante || '').toLowerCase().includes(query)
    )
  }, [asistentesSalida, busquedaParticipante])

  const formatearRangoFechas = (inicio?: string | null, fin?: string | null) => {
    if (!inicio) return 'Sin fecha'
    try {
      const dInicio = new Date(inicio + 'T00:00:00')
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
      const strInicio = dInicio.toLocaleDateString('es-CL', options)
      if (!fin || fin === inicio) return strInicio
      const dFin = new Date(fin + 'T00:00:00')
      const strFin = dFin.toLocaleDateString('es-CL', options)
      return `${strInicio} al ${strFin}`
    } catch {
      return `${inicio} ${fin ? `- ${fin}` : ''}`
    }
  }

  const handleDescargarExcel = () => {
    if (!actividadSeleccionada || asistentesSalida.length === 0) return
    exportarSalidaAutorizacionesExcel(
      {
        nombre: actividadSeleccionada.nombre,
        tipo: actividadSeleccionada.tipo,
        lugar: actividadSeleccionada.lugar,
        fecha_inicio: actividadSeleccionada.fecha_inicio || '',
        fecha_fin: actividadSeleccionada.fecha_fin,
        unidades: actividadSeleccionada.unidades
      },
      asistentesSalida
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner de estado offline si aplica */}
      {isOffline && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-3 text-amber-700 dark:text-amber-400 text-[0.85em] font-bold">
          <span className="text-lg">📡</span>
          <span>Modo Sin Conexión: Visualizando salidas y autorizaciones almacenadas localmente en este dispositivo.</span>
        </div>
      )}

      {/* Encabezado con pestañas de filtro */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-pclr13 dark:border-pdclr13 pb-4">
        <div>
          <h2 className="text-2xl font-bold font-display uppercase text-pclr4 dark:text-pdclr4">
            Gestor de Salidas y Autorizaciones
          </h2>
          <p className="text-[0.85em] text-pclr7 dark:text-pdclr7 font-bold">
            Revisión de nóminas autorizadas, consulta de expedientes legales firmados y descargas oficiales.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onCrearSalida && isDirectivo(perfil) && (
            <button
              type="button"
              onClick={onCrearSalida}
              className="px-4 py-2 bg-pclr10 dark:bg-pdclr10 text-pclr12 dark:text-pdclr12 rounded-xl text-[0.8em] font-black uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              + Nueva Salida
            </button>
          )}

          <div className="flex bg-pclr3 dark:bg-pdclr3 p-1 rounded-2xl border border-pclr13 dark:border-pdclr13">
            <button
              type="button"
              onClick={() => { setTabFiltro('activas'); setSelectedActId(null) }}
              className={`px-4 py-2 rounded-xl text-[0.8em] font-black uppercase transition-all cursor-pointer ${
                tabFiltro === 'activas'
                  ? 'bg-pclr8 dark:bg-pdclr8 text-pclr12 dark:text-pdclr12 shadow-sm'
                  : 'text-pclr7 dark:text-pdclr7 hover:text-pclr4 dark:hover:text-pdclr4'
              }`}
            >
              Activas ({activas.length})
            </button>
            <button
              type="button"
              onClick={() => { setTabFiltro('historial'); setSelectedActId(null) }}
              className={`px-4 py-2 rounded-xl text-[0.8em] font-black uppercase transition-all cursor-pointer ${
                tabFiltro === 'historial'
                  ? 'bg-pclr8 dark:bg-pdclr8 text-pclr12 dark:text-pdclr12 shadow-sm'
                  : 'text-pclr7 dark:text-pdclr7 hover:text-pclr4 dark:hover:text-pdclr4'
              }`}
            >
              Historial ({pasadas.length})
            </button>
          </div>
        </div>
      </div>

      {/* Contenedor principal: Barra lateral de salidas y panel de detalle */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Columna Izquierda: Listado de Salidas (4 columnas en LG) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar salida o lugar..."
              value={busquedaSalida}
              onChange={(e) => setBusquedaSalida(e.target.value)}
              className="w-full p-2.5 pl-9 bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 border border-pclr13 dark:border-pdclr13 rounded-xl text-[0.85em] font-bold outline-none focus:border-pclr8"
            />
            <span className="absolute left-3 top-2.5 text-pclr7 dark:text-pdclr7 text-sm">🔍</span>
            {busquedaSalida && (
              <button
                type="button"
                onClick={() => setBusquedaSalida('')}
                className="absolute right-3 top-2.5 text-pclr7 dark:text-pdclr7 hover:text-pclr4 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {actividadesMostradas.length === 0 ? (
              <div className="p-8 text-center bg-pclr3 dark:bg-pdclr3 rounded-2xl border border-dashed border-pclr13 dark:border-pdclr13">
                <p className="text-[0.85em] font-bold text-pclr7 dark:text-pdclr7 uppercase tracking-wider">
                  No hay salidas {tabFiltro === 'activas' ? 'activas' : 'en el historial'}
                </p>
              </div>
            ) : (
              actividadesMostradas.map((act) => {
                const isSelected = actividadSeleccionada?.id === act.id
                const totalFirmas = (authsPorActividad.get(act.id) || []).length

                return (
                  <div
                    key={act.id}
                    onClick={() => setSelectedActId(act.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-pclr1 dark:bg-pdclr1 border-pclr8 dark:border-pdclr8 shadow-md ring-2 ring-pclr8/20'
                        : 'bg-pclr3 dark:bg-pdclr3 border-pclr13 dark:border-pdclr13 hover:border-pclr8/50'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <span className="text-[0.7em] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-pclr10/10 text-pclr10 dark:text-pdclr10 border border-pclr10/20">
                        {act.tipo || 'Salida'}
                      </span>
                      <span className="text-[0.75em] font-mono font-bold text-pclr6 dark:text-pdclr6 bg-pclr6/10 px-2 py-0.5 rounded-full">
                        {totalFirmas} {totalFirmas === 1 ? 'firma' : 'firmas'}
                      </span>
                    </div>

                    <h3 className="font-bold text-[0.95em] text-pclr4 dark:text-pdclr4 uppercase tracking-tight line-clamp-1">
                      {act.nombre}
                    </h3>

                    <p className="text-[0.78em] font-bold text-pclr7 dark:text-pdclr7 mt-0.5">
                      📍 {act.lugar || 'Lugar por definir'}
                    </p>

                    <p className="text-[0.75em] font-medium text-pclr7 dark:text-pdclr7 opacity-80 mt-1">
                      📅 {formatearRangoFechas(act.fecha_inicio, act.fecha_fin)}
                    </p>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Columna Derecha: Detalle de Salida y Lista de Asistentes (8 columnas en LG) */}
        <div className="lg:col-span-8 space-y-4">
          {actividadSeleccionada ? (
            <div className="bg-pclr3 dark:bg-pdclr3 rounded-3xl p-5 border border-pclr13 dark:border-pdclr13 space-y-5">
              
              {/* Tarjeta de Encabezado de la Salida */}
              <div className="bg-pclr1 dark:bg-pdclr1 rounded-2xl p-4 border border-pclr13 dark:border-pdclr13 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[0.72em] font-black uppercase bg-pclr8 dark:bg-pdclr8 text-pclr12 dark:text-pdclr12">
                      {actividadSeleccionada.tipo}
                    </span>
                    <span className="text-[0.75em] font-bold uppercase tracking-wider text-pclr7 dark:text-pdclr7">
                      {actividadSeleccionada.unidades?.nombre || 'Todas las Unidades'}
                    </span>
                  </div>
                  <h3 className="text-xl font-black font-display uppercase text-pclr4 dark:text-pdclr4 tracking-tight">
                    {actividadSeleccionada.nombre}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-[0.8em] font-bold text-pclr7 dark:text-pdclr7">
                    <span>📍 {actividadSeleccionada.lugar}</span>
                    <span>•</span>
                    <span>📅 {formatearRangoFechas(actividadSeleccionada.fecha_inicio, actividadSeleccionada.fecha_fin)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  {onPlanificarMenu && (
                    <button
                      type="button"
                      onClick={() => onPlanificarMenu(actividadSeleccionada.id)}
                      className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[0.82em] font-black uppercase tracking-wider active:scale-95 transition-all shadow-md cursor-pointer"
                      title="Planificar menú, cronograma y lista de compras para esta salida"
                    >
                      <span>🍲</span>
                      <span>Menú y Compras</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleDescargarExcel}
                    disabled={asistentesSalida.length === 0}
                    className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-pclr6 dark:bg-pdclr6 text-pclr12 dark:text-pdclr12 rounded-xl text-[0.82em] font-black uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    title="Descargar nómina de participantes autorizados con datos médicos en Excel"
                  >
                    <span>📥</span>
                    <span>Descargar Excel ({asistentesSalida.length})</span>
                  </button>
                </div>
              </div>

              {/* Barra de Búsqueda y Métricas de Participantes */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 border-b border-pclr13 dark:border-pdclr13 pb-3">
                <div className="text-[0.85em] font-black uppercase text-pclr4 dark:text-pdclr4 tracking-wider">
                  Participantes Autorizados ({asistentesFiltrados.length})
                </div>

                <div className="w-full sm:w-64 relative">
                  <input
                    type="text"
                    placeholder="Filtrar participante o RUT..."
                    value={busquedaParticipante}
                    onChange={(e) => setBusquedaParticipante(e.target.value)}
                    className="w-full p-2 pl-8 bg-pclr1 dark:bg-pdclr1 text-pclr4 dark:text-pdclr4 border border-pclr13 dark:border-pdclr13 rounded-xl text-[0.8em] font-bold outline-none focus:border-pclr8"
                  />
                  <span className="absolute left-2.5 top-2 text-pclr7 dark:text-pdclr7 text-xs">🔍</span>
                </div>
              </div>

              {/* Lista o Grilla de Participantes Autorizados */}
              {asistentesFiltrados.length === 0 ? (
                <div className="p-12 text-center bg-pclr1 dark:bg-pdclr1 rounded-2xl border border-dashed border-pclr13 dark:border-pdclr13 space-y-2">
                  <div className="text-3xl">📋</div>
                  <h4 className="font-bold uppercase text-[0.9em] text-pclr4 dark:text-pdclr4">
                    {asistentesSalida.length === 0
                      ? 'Sin autorizaciones firmadas aún'
                      : 'No se encontraron participantes que coincidan con la búsqueda'}
                  </h4>
                  <p className="text-[0.8em] text-pclr7 dark:text-pdclr7 max-w-sm mx-auto font-medium">
                    {asistentesSalida.length === 0
                      ? 'Cuando los apoderados o miembros completen el formulario de autorización digital, aparecerán automáticamente en esta lista.'
                      : 'Prueba modificando el texto del filtro.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {asistentesFiltrados.map((asistente) => {
                    const { perfil: p, autorizacion: auth } = asistente
                    const tieneAlertaSalud = Boolean(
                      p.alergias || p.tiene_alergias || p.antecedentes_medicos || p.comentarios_salud || p.enfermedades_cronicas
                    )
                    
                    // Encontrar el registro de autorización original
                    const authOriginal = autorizaciones.find(
                      a => a.actividad_id === actividadSeleccionada.id && a.perfil_id === p.id
                    ) || ({
                      id: `${actividadSeleccionada.id}-${p.id}`,
                      perfil_id: p.id,
                      actividad_id: actividadSeleccionada.id,
                      actividad_nombre: actividadSeleccionada.nombre,
                      lugar: actividadSeleccionada.lugar,
                      fecha_inicio: actividadSeleccionada.fecha_inicio,
                      fecha_fin: actividadSeleccionada.fecha_fin,
                      nombre_firmante: auth.nombre_firmante || 'Firmante',
                      rut_firmante: auth.rut_firmante || '',
                      fecha_firma: auth.fecha_firma || new Date().toISOString(),
                      firmado: true,
                      estado: auth.estado || 'Vigente'
                    } as AutorizacionActividad)

                    return (
                      <div
                        key={p.id}
                        className="bg-pclr1 dark:bg-pdclr1 rounded-2xl p-3.5 border border-pclr13 dark:border-pdclr13 hover:border-pclr8 dark:hover:border-pdclr8 transition-all flex flex-col justify-between gap-3 shadow-sm"
                      >
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <span className="text-[0.7em] font-black uppercase px-2 py-0.5 rounded-md bg-pclr6/10 text-pclr6 dark:text-pdclr6 border border-pclr6/20">
                              ✓ Autorizado
                            </span>
                            {tieneAlertaSalud && (
                              <span
                                className="text-[0.7em] font-black uppercase px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                                title="Registra información de salud o alergias"
                              >
                                ⚠️ Ficha Médica
                              </span>
                            )}
                          </div>

                          <h4 className="font-bold text-[0.95em] text-pclr4 dark:text-pdclr4 uppercase tracking-tight">
                            {p.nombres} {p.apellidos}
                          </h4>

                          <div className="text-[0.78em] text-pclr7 dark:text-pdclr7 space-y-0.5 mt-1 font-bold">
                            <p>RUT: <span className="font-mono text-pclr4 dark:text-pdclr4">{p.rut || 'S/I'}</span></p>
                            <p>Unidad: <span className="text-pclr4 dark:text-pdclr4">{p.unidades?.nombre || 'General'}</span></p>
                            <p>Firmado por: <span className="text-pclr4 dark:text-pdclr4">{auth.nombre_firmante || 'Apoderado'}</span></p>
                            {auth.fecha_firma && (
                              <p className="opacity-75 font-normal">
                                Fecha: {new Date(auth.fecha_firma).toLocaleString('es-CL')}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-pclr13 dark:border-pdclr13 flex gap-2">
                          <button
                            type="button"
                            onClick={() => onVerAutorizacion(asistente.authOriginal || authOriginal, p)}
                            className="w-full py-2 bg-pclr10 dark:bg-pdclr10 text-pclr12 dark:text-pdclr12 rounded-xl text-[0.8em] font-black uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-sm cursor-pointer"
                          >
                            📄 Ver Autorización Firmada
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

            </div>
          ) : (
            <div className="p-16 text-center bg-pclr3 dark:bg-pdclr3 rounded-3xl border border-dashed border-pclr13 dark:border-pdclr13 space-y-3">
              <div className="text-4xl">🏕️</div>
              <h3 className="text-lg font-black uppercase text-pclr4 dark:text-pdclr4 font-display">
                Selecciona una salida para ver su detalle
              </h3>
              <p className="text-[0.85em] text-pclr7 dark:text-pdclr7 max-w-md mx-auto font-medium">
                Elige cualquiera de las salidas activas o del historial en la columna izquierda para inspeccionar sus asistentes y descargar la nómina oficial.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
