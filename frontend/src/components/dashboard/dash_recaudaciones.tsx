'use client'

import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import DashModRecaudacionCrear from './dashmod_recaudacion_crear'
import DashModRecaudacionComprobante from './dashmod_recaudacion_comprobante'
import DashModRecaudacionCerrar from './dashmod_recaudacion_cerrar'

interface DashRecaudacionesProps {
  perfil: any
  unidades: any[]
  canAction: boolean // roles <= 5 (admin, dirigentes, guiadoras, directiva)
  onSuccess?: () => void
}

export default function DashRecaudaciones({ perfil, unidades = [], canAction, onSuccess }: DashRecaudacionesProps) {
  // 1. Estados principales
  const [recaudaciones, setRecaudaciones] = useState<any[]>([])
  const [comprobantes, setComprobantes] = useState<any[]>([])
  const [descuentos, setDescuentos] = useState<any[]>([])
  const [miembros, setMiembros] = useState<any[]>([])
  const [compUsuarios, setCompUsuarios] = useState<any[]>([])
  
  const [loading, setLoading] = useState(false)
  const [selectedUnidadFilter, setSelectedUnidadFilter] = useState('todas')
  const [viewingDetailId, setViewingDetailId] = useState<string | null>(null)

  // Estados de modales
  const [isCrearOpen, setIsCrearOpen] = useState(false)
  const [selectedRecaudacion, setSelectedRecaudacion] = useState<any>(null)
  const [isComprobanteOpen, setIsComprobanteOpen] = useState(false)
  const [isCerrarOpen, setIsCerrarOpen] = useState(false)

  // Estados de edición rápida
  const [editingDeadlineId, setEditingDeadlineId] = useState<string | null>(null)
  const [editingDeadlineVal, setEditingDeadlineVal] = useState('')
  const [editingGastoId, setEditingGastoId] = useState<string | null>(null)
  const [editingGastoVal, setEditingGastoVal] = useState<number | ''>('')
  
  // Estado para descuento manual
  const [editingDiscountUserId, setEditingDiscountUserId] = useState<string | null>(null)
  const [editingDiscountVal, setEditingDiscountVal] = useState<number | ''>('')
  const [editingDiscountMotivo, setEditingDiscountMotivo] = useState('')

  // 2. Fetch de datos
  const fetchData = async () => {
    setLoading(true)
    try {
      // 2.1 Cargar recaudaciones
      const { data: recs, error: recsErr } = await supabase
        .from('tesoreria_recaudaciones')
        .select('*, creado_por:perfiles!tesoreria_recaudaciones_creado_por_fkey(nombres, apellidos)')
        .order('created_at', { ascending: false })
      if (recsErr) throw recsErr
      setRecaudaciones(recs || [])

      // 2.2 Cargar comprobantes
      const { data: comps, error: compsErr } = await supabase
        .from('tesoreria_recaudaciones_comprobantes')
        .select('*, hecho_por:perfiles!tesoreria_recaudaciones_comprobantes_hecho_por_fkey(nombres, apellidos)')
      if (compsErr) throw compsErr
      setComprobantes(comps || [])

      // 2.3 Cargar mapeo de comprobantes a usuarios
      const { data: cUsers, error: cUsersErr } = await supabase
        .from('tesoreria_recaudaciones_comprobantes_usuarios')
        .select('*')
      if (cUsersErr) throw cUsersErr
      setCompUsuarios(cUsers || [])

      // 2.4 Cargar descuentos
      const { data: descs, error: descsErr } = await supabase
        .from('tesoreria_recaudaciones_descuentos')
        .select('*')
      if (descsErr) throw descsErr
      setDescuentos(descs || [])

      // 2.5 Cargar perfiles (miembros)
      const { data: miemb, error: miembErr } = await supabase
        .from('perfiles')
        .select('id, nombres, apellidos, rol_id, unidad_id')
        .eq('estado', 'activo')
      if (miembErr) throw miembErr
      setMiembros(miemb || [])

    } catch (err: any) {
      console.error('Error al cargar datos de recaudaciones:', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // 3. Procesamiento en memoria de totales e información por recaudación
  const processedRecaudaciones = useMemo(() => {
    return recaudaciones.map(r => {
      // Comprobantes validados para esta recaudación
      const validatedComps = comprobantes.filter(c => c.recaudacion_id === r.id && c.estado === 'validado')
      const totalRecaudado = validatedComps.reduce((acc, curr) => acc + (curr.monto || 0), 0)

      // Comprobantes pendientes
      const pendingComps = comprobantes.filter(c => c.recaudacion_id === r.id && c.estado === 'pendiente')

      // Total de descuentos aplicados
      const recDescuentos = descuentos.filter(d => d.recaudacion_id === r.id)
      const totalDescuentos = recDescuentos.reduce((acc, curr) => acc + (curr.descuento || 0), 0)

      return {
        ...r,
        totalRecaudado,
        totalDescuentos,
        comprobantesPendientesCount: pendingComps.length
      }
    })
  }, [recaudaciones, comprobantes, descuentos])

  // Filtrar recaudaciones por unidad
  const filteredRecaudaciones = useMemo(() => {
    if (selectedUnidadFilter === 'todas') return processedRecaudaciones
    return processedRecaudaciones.filter(r => r.unidad === selectedUnidadFilter)
  }, [processedRecaudaciones, selectedUnidadFilter])

  // Detalle de la recaudación actualmente seleccionada
  const activeRecaudacionDetail = useMemo(() => {
    if (!viewingDetailId) return null
    return processedRecaudaciones.find(r => r.id === viewingDetailId) || null
  }, [processedRecaudaciones, viewingDetailId])

  // Lista de miembros filtrados por la unidad de la recaudación para el panel de detalles
  const miembrosDeRecaudacion = useMemo(() => {
    if (!activeRecaudacionDetail) return []
    const uName = activeRecaudacionDetail.unidad

    return miembros.filter(m => {
      if (uName === 'Grupal') return m.rol_id >= 9 && m.rol_id <= 13 // NNJ de cualquier unidad
      
      let targetUnidadId = 0
      if (uName === 'Manada') targetUnidadId = 1
      else if (uName === 'Compañía') targetUnidadId = 2
      else if (uName === 'Tropa') targetUnidadId = 3
      else if (uName === 'Avanzada') targetUnidadId = 4
      else if (uName === 'Clan') targetUnidadId = 5

      return m.unidad_id === targetUnidadId && m.rol_id >= 9 && m.rol_id <= 13
    }).sort((a, b) => `${a.nombres} ${a.apellidos}`.localeCompare(`${b.nombres} ${b.apellidos}`))
  }, [activeRecaudacionDetail, miembros])

  // 4. Acciones administrativas
  const handleUpdateDeadline = async (id: string) => {
    if (!editingDeadlineVal) return
    try {
      const { error } = await supabase
        .from('tesoreria_recaudaciones')
        .update({ plazo_maximo: editingDeadlineVal })
        .eq('id', id)

      if (error) throw error

      setEditingDeadlineId(null)
      fetchData()
    } catch (err: any) {
      alert('Error al modificar fecha: ' + err.message)
    }
  }

  const handleUpdateGasto = async (id: string) => {
    const val = editingGastoVal === '' ? null : parseInt(editingGastoVal.toString())
    try {
      const { error } = await supabase
        .from('tesoreria_recaudaciones')
        .update({ monto_gastado: val })
        .eq('id', id)

      if (error) throw error

      // También actualizar en el libro contable de movimientos (Egreso de gastos asociado)
      // Buscamos si existe un egreso con la descripción del evento y lo actualizamos, o creamos
      const { data: rec } = await supabase.from('tesoreria_recaudaciones').select('nombre').eq('id', id).single()
      const descBusqueda = `GASTOS ASOCIADOS EVENTO: ${rec?.nombre}`
      
      const { data: mov } = await supabase
        .from('tesoreria_movimientos')
        .select('id')
        .eq('descripcion', descBusqueda)
        .limit(1)

      if (mov && mov.length > 0) {
        if (val === null || val === 0) {
          await supabase.from('tesoreria_movimientos').delete().eq('id', mov[0].id)
        } else {
          await supabase.from('tesoreria_movimientos').update({ monto_egreso: val }).eq('id', mov[0].id)
        }
      } else if (val !== null && val > 0) {
        // Si no existía, lo insertamos con código genérico E-3.2 (Gastos por salidas)
        await supabase.from('tesoreria_movimientos').insert({
          dia: new Date().getDate(),
          mes: new Date().getMonth() + 1,
          anio: new Date().getFullYear(),
          fecha_completa: new Date().toISOString().split('T')[0],
          tipo_documento: 'E',
          descripcion: descBusqueda,
          item_id: 47, // E-3.2
          monto_ingreso: 0,
          monto_egreso: val,
          registrado_por: perfil.id
        })
      }

      setEditingGastoId(null)
      fetchData()
      alert('Gasto actualizado exitosamente en recaudación y contabilidad.')
    } catch (err: any) {
      alert('Error al modificar gasto: ' + err.message)
    }
  }

  // Generar URL firmada para ver el comprobante privado de forma segura
  const handleVerAdjunto = async (imagenUrl: string) => {
    try {
      const parts = imagenUrl.split('comprobantes_recaudacion/')
      if (parts.length < 2) {
        window.open(imagenUrl, '_blank')
        return
      }
      const filePath = parts[1]

      const { data, error } = await supabase.storage
        .from('comprobantes_recaudacion')
        .createSignedUrl(filePath, 60)

      if (error) throw error

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank')
      }
    } catch (err: any) {
      alert('Error al generar enlace seguro: ' + err.message)
    }
  }

  // Validación de comprobante
  const handleValidateComprobante = async (compId: string, accept: boolean, correctedMonto?: number, motivoRechazo?: string) => {
    try {
      const payload: any = {
        estado: accept ? 'validado' : 'rechazado',
        validado_por: perfil.id
      }
      if (correctedMonto !== undefined && correctedMonto > 0) {
        payload.monto = correctedMonto
      }
      if (!accept && motivoRechazo) {
        payload.motivo_rechazo = motivoRechazo
      }

      const { error } = await supabase
        .from('tesoreria_recaudaciones_comprobantes')
        .update(payload)
        .eq('id', compId)

      if (error) throw error

      fetchData()
      alert(accept ? 'Comprobante aprobado.' : 'Comprobante rechazado.')
    } catch (err: any) {
      alert('Error al validar comprobante: ' + err.message)
    }
  }

  // Asignar descuento manual por NNJ
  const handleSaveDiscount = async (userId: string) => {
    if (!viewingDetailId) return
    const descVal = editingDiscountVal === '' ? 0 : parseInt(editingDiscountVal.toString())
    try {
      if (descVal <= 0) {
        // Eliminar si es 0
        await supabase
          .from('tesoreria_recaudaciones_descuentos')
          .delete()
          .eq('recaudacion_id', viewingDetailId)
          .eq('usuario_id', userId)
      } else {
        // Upsert
        const { error } = await supabase
          .from('tesoreria_recaudaciones_descuentos')
          .upsert({
            recaudacion_id: viewingDetailId,
            usuario_id: userId,
            descuento: descVal,
            motivo: editingDiscountMotivo.trim() || 'Descuento fondos grupo',
            registrado_por: perfil.id
          }, { onConflict: 'recaudacion_id,usuario_id' })

        if (error) throw error
      }

      setEditingDiscountUserId(null)
      setEditingDiscountVal('')
      setEditingDiscountMotivo('')
      fetchData()
      alert('Descuento actualizado con éxito.')
    } catch (err: any) {
      alert('Error al asignar descuento: ' + err.message)
    }
  }

  // Determina si una recaudación aplica para la unidad actual del usuario (si es NNJ o Dirigente de unidad)
  const userUnidadName = useMemo(() => {
    if (!perfil || !perfil.unidad_id) return null
    const uni = unidades.find(u => u.id === perfil.unidad_id)
    return uni ? uni.nombre : null
  }, [perfil, unidades])

  const userCanUploadFor = (rec: any) => {
    if (rec.estado !== 'abierta') return false
    if (rec.unidad === 'Grupal') return true
    return rec.unidad === userUnidadName
  };

  return (
    <div className="space-y-6 text-[1em]">
      {/* Cabecera */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black font-display uppercase text-clr5 dark:text-clr1 font-bold">Gestión de Recaudaciones</h2>
          <p className="text-[0.8em] font-bold opacity-40 uppercase tracking-widest mt-1">
            Campañas de financiamiento, colectas y cuotas
          </p>
        </div>
        {canAction && (
          <button
            onClick={() => setIsCrearOpen(true)}
            className="px-5 py-2.5 bg-clr6 text-white uppercase rounded-xl text-[0.85em] font-bold tracking-widest shadow-lg hover:brightness-110 transition-all"
          >
            ➕ Crear Recaudación
          </button>
        )}
      </div>

      {/* Selector de filtros de unidad */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide bg-white dark:bg-clr5 p-2 rounded-2xl border dark:border-clr4">
        <button
          onClick={() => setSelectedUnidadFilter('todas')}
          className={`px-4 py-2 rounded-xl text-[0.8em] font-bold uppercase transition-all whitespace-nowrap ${
            selectedUnidadFilter === 'todas' ? 'bg-clr5 text-white' : 'opacity-40 hover:opacity-100'
          }`}
        >
          Todas
        </button>
        {['Grupal', 'Manada', 'Compañía', 'Tropa', 'Avanzada', 'Clan'].map(u => (
          <button
            key={u}
            onClick={() => setSelectedUnidadFilter(u)}
            className={`px-4 py-2 rounded-xl text-[0.8em] font-bold uppercase transition-all whitespace-nowrap ${
              selectedUnidadFilter === u ? 'bg-clr5 text-white' : 'opacity-40 hover:opacity-100'
            }`}
          >
            {u}
          </button>
        ))}
      </div>

      {/* Listado de Recaudaciones */}
      {loading && recaudaciones.length === 0 ? (
        <p className="text-center p-12 opacity-50 font-bold uppercase text-[0.85em]">Cargando recaudaciones...</p>
      ) : filteredRecaudaciones.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed rounded-[2.5rem] opacity-40">
          <p className="italic uppercase tracking-widest text-[0.8em]">No hay recaudaciones registradas en esta unidad.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecaudaciones.map(r => {
            const isAbierta = r.estado === 'abierta'
            const isCreator = r.creado_por === perfil.id
            const canEditDeadline = canAction || isCreator

            return (
              <div
                key={r.id}
                className={`bg-white dark:bg-black/10 rounded-[2rem] border p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all ${
                  viewingDetailId === r.id ? 'border-clr6 ring-2 ring-clr6/20' : 'dark:border-clr4'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className={`text-[0.75em] px-2.5 py-0.5 rounded-full font-black uppercase ${
                      isAbierta ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-white/60'
                    }`}>
                      {isAbierta ? 'Abierta' : 'Completada'}
                    </span>
                    <span className="text-[0.75em] bg-clr5 text-white px-2.5 py-0.5 rounded-full font-black uppercase">
                      {r.unidad}
                    </span>
                  </div>

                  <h3 className="text-lg font-black font-display uppercase tracking-tight text-clr2 dark:text-white">
                    {r.nombre}
                  </h3>

                  <div className="space-y-1 text-[0.85em] opacity-80 font-semibold">
                    <p>📅 Inicio: {new Date(r.fecha_inicio).toLocaleDateString('es-CL')}</p>
                    
                    {/* Plazo máximo (editable si corresponde) */}
                    <div className="flex items-center gap-2">
                      <span>⌛ Plazo:</span>
                      {editingDeadlineId === r.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="date"
                            value={editingDeadlineVal}
                            onChange={e => setEditingDeadlineVal(e.target.value)}
                            className="p-1 rounded bg-zinc-100 dark:bg-clr3 border text-[0.9em] font-bold text-center"
                          />
                          <button onClick={() => handleUpdateDeadline(r.id)} className="text-green-600 hover:scale-110">✔</button>
                          <button onClick={() => setEditingDeadlineId(null)} className="text-red-600 hover:scale-110">✕</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-clr7">
                            {new Date(r.plazo_maximo).toLocaleDateString('es-CL')}
                          </span>
                          {isAbierta && canEditDeadline && (
                            <button
                              onClick={() => {
                                setEditingDeadlineId(r.id)
                                setEditingDeadlineVal(r.plazo_maximo)
                              }}
                              className="text-[0.8em] opacity-50 hover:opacity-100"
                              title="Editar fecha de plazo"
                            >
                              ✏️
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Totales */}
                  <div className="pt-3 border-t border-dashed dark:border-clr4 grid grid-cols-2 gap-2 text-center">
                    <div className="bg-zinc-50 dark:bg-black/25 p-2 rounded-xl">
                      <p className="text-[0.7em] font-bold uppercase opacity-50">Recaudado</p>
                      <p className="font-black text-green-600 text-[1.1em]">${r.totalRecaudado.toLocaleString('es-CL')}</p>
                    </div>
                    <div className="bg-zinc-50 dark:bg-black/25 p-2 rounded-xl">
                      <p className="text-[0.7em] font-bold uppercase opacity-50">Descuentos</p>
                      <p className="font-black text-amber-600 text-[1.1em]">${r.totalDescuentos.toLocaleString('es-CL')}</p>
                    </div>
                  </div>

                  {/* Gasto de la recaudación (editable si está completada) */}
                  {!isAbierta && (
                    <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 p-3 rounded-xl flex items-center justify-between text-[0.85em] font-bold">
                      <span className="text-red-700 dark:text-red-400">💸 Gasto Evento:</span>
                      {editingGastoId === r.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editingGastoVal}
                            onChange={e => setEditingGastoVal(e.target.value === '' ? '' : parseInt(e.target.value))}
                            className="w-20 p-1 rounded bg-white dark:bg-clr3 border text-[0.9em] font-black text-center"
                          />
                          <button onClick={() => handleUpdateGasto(r.id)} className="text-green-600 hover:scale-110">✔</button>
                          <button onClick={() => setEditingGastoId(null)} className="text-red-600 hover:scale-110">✕</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-red-600 dark:text-red-400">
                            ${(r.monto_gastado || 0).toLocaleString('es-CL')}
                          </span>
                          {canAction && (
                            <button
                              onClick={() => {
                                setEditingGastoId(r.id)
                                setEditingGastoVal(r.monto_gastado || 0)
                              }}
                              className="text-[0.8em] opacity-50 hover:opacity-100"
                              title="Editar gasto del evento"
                            >
                              ✏️
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Contador de pendientes para admins */}
                  {canAction && isAbierta && r.comprobantesPendientesCount > 0 && (
                    <div className="bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 p-2.5 rounded-xl text-[0.8em] font-bold uppercase text-center animate-pulse">
                      ⚠️ {r.comprobantesPendientesCount} comprobantes por validar
                    </div>
                  )}
                </div>

                {/* Acciones principales */}
                <div className="mt-5 pt-4 border-t dark:border-clr4 flex flex-col gap-2">
                  {/* Botón de carga de comprobantes para miembros de la unidad */}
                  {isAbierta && userCanUploadFor(r) && (
                    <button
                      onClick={() => {
                        setSelectedRecaudacion(r)
                        setIsComprobanteOpen(true)
                      }}
                      className="w-full py-2.5 bg-clr5 hover:bg-clr6 text-white rounded-xl text-[0.8em] font-bold uppercase tracking-wider transition-all"
                    >
                      ✉️ Enviar comprobante
                    </button>
                  )}

                  {/* Acciones de administración */}
                  {canAction && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          // Si ya lo estamos viendo, deseleccionamos
                          setViewingDetailId(viewingDetailId === r.id ? null : r.id)
                        }}
                        className={`flex-1 py-2 rounded-xl text-[0.75em] font-bold uppercase border transition-all ${
                          viewingDetailId === r.id
                            ? 'bg-clr2 text-white border-clr2'
                            : 'bg-transparent text-clr2 hover:bg-zinc-50 dark:text-white/80 dark:hover:bg-white/5 border-clr2 dark:border-white/20'
                        }`}
                      >
                        🔎 Ver Detalle
                      </button>

                      {isAbierta && (
                        <button
                          onClick={() => {
                            setSelectedRecaudacion(r)
                            setIsCerrarOpen(true)
                          }}
                          className="py-2 px-3 bg-clr7 text-white rounded-xl text-[0.75em] font-bold uppercase hover:brightness-110 transition-all flex items-center gap-1"
                        >
                          🔒 Cerrar
                        </button>
                      )}
                    </div>
                  )}

                  {/* Mis Comprobantes Enviados */}
                  {(() => {
                    const userComps = comprobantes.filter(c => c.recaudacion_id === r.id && c.hecho_por === perfil.id)
                    if (userComps.length === 0) return null
                    return (
                      <div className="mt-4 pt-3 border-t border-dashed dark:border-clr4 space-y-2 text-left">
                        <p className="text-[0.75em] font-black uppercase text-clr6">📄 Mis Comprobantes:</p>
                        <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                          {userComps.map(c => {
                            let statusColor = 'text-amber-600 bg-amber-50 dark:bg-amber-950/20'
                            let statusText = 'Pendiente'
                            if (c.estado === 'validado') {
                              statusColor = 'text-green-600 bg-green-50 dark:bg-green-950/20'
                              statusText = 'Aprobado'
                            } else if (c.estado === 'rechazado') {
                              statusColor = 'text-red-600 bg-red-50 dark:bg-red-950/20'
                              statusText = 'Rechazado'
                            }

                            return (
                              <div key={c.id} className="p-2 rounded-xl bg-zinc-50 dark:bg-black/25 text-[0.8em] space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="font-bold opacity-60">{new Date(c.fecha).toLocaleDateString('es-CL')}</span>
                                  <span className="font-black text-green-600">${c.monto.toLocaleString('es-CL')}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className={`text-[0.75em] px-2 py-0.5 rounded-md font-bold ${statusColor}`}>
                                    {statusText}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleVerAdjunto(c.imagen_url)}
                                    className="text-[0.75em] text-clr5 hover:underline font-bold"
                                  >
                                    Ver Comprobante
                                  </button>
                                </div>
                                {c.estado === 'rechazado' && c.motivo_rechazo && (
                                  <p className="text-[0.75em] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/25 p-1.5 rounded-md font-semibold border border-red-100 dark:border-red-950/50">
                                    ❌ Motivo: {c.motivo_rechazo}
                                  </p>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Panel Detallado de Recaudación Seleccionada */}
      {canAction && activeRecaudacionDetail && (
        <div className="bg-white dark:bg-black/10 rounded-[2.5rem] border dark:border-clr4 p-6 md:p-8 space-y-6 shadow-sm animate-in slide-in-from-bottom duration-500">
          <div className="flex justify-between items-center border-b dark:border-clr4 pb-4">
            <div>
              <h3 className="text-xl font-black font-display uppercase text-clr6">
                Detalle de Recaudación: {activeRecaudacionDetail.nombre}
              </h3>
              <p className="text-[0.8em] font-bold opacity-40 uppercase tracking-widest mt-0.5">
                Estado: {activeRecaudacionDetail.estado === 'abierta' ? 'Abierta (Recibiendo comprobantes)' : 'Completada'}
              </p>
            </div>
            <button
              onClick={() => setViewingDetailId(null)}
              className="text-clr2 hover:text-black dark:text-white/60 dark:hover:text-white font-bold text-[1.1em] border-2 px-3 py-1 rounded-xl"
            >
              Cerrar Detalle
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Sección A: Validación de comprobantes pendientes de este evento */}
            <div className="space-y-4">
              <h4 className="font-black font-display uppercase text-[0.9em] tracking-wider text-clr7 border-b pb-2 dark:border-clr4">
                📁 Comprobantes Cargados
              </h4>
              
              {comprobantes.filter(c => c.recaudacion_id === viewingDetailId).length === 0 ? (
                <p className="text-center py-8 opacity-45 text-[0.8em] uppercase font-bold">No se han subido comprobantes aún.</p>
              ) : (
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {comprobantes
                    .filter(c => c.recaudacion_id === viewingDetailId)
                    .map(c => {
                      const coveredUsers = compUsuarios
                        .filter(cu => cu.comprobante_id === c.id)
                        .map(cu => {
                          const m = miembros.find(mb => mb.id === cu.usuario_id)
                          return m ? `${m.nombres} ${m.apellidos}` : 'Usuario desconocido'
                        })

                      const isPend = c.estado === 'pendiente'

                      return (
                        <div key={c.id} className="border dark:border-clr4 bg-zinc-50 dark:bg-black/20 p-4 rounded-2xl flex flex-col justify-between gap-3 text-[0.85em]">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold">📤 Subido por: {c.hecho_por?.nombres} {c.hecho_por?.apellidos}</p>
                              <p className="text-[0.8em] opacity-50">Fecha: {new Date(c.fecha).toLocaleDateString('es-CL')}</p>
                            </div>
                            <span className={`text-[0.7em] px-2 py-0.5 rounded-full font-black uppercase ${
                              isPend ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' :
                              c.estado === 'validado' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                              'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                              {c.estado}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <p className="font-semibold text-zinc-600 dark:text-zinc-400 text-[0.9em]">👥 Cubre a:</p>
                            <p className="font-bold text-[0.95em] pl-1 text-clr6">{coveredUsers.join(', ')}</p>
                          </div>

                          <div className="flex justify-between items-center bg-white dark:bg-clr3 border dark:border-clr4 p-2.5 rounded-xl">
                            <span className="font-bold opacity-60">Monto:</span>
                            <span className="font-black text-green-600 text-[1.1em]">${c.monto.toLocaleString('es-CL')}</span>
                          </div>

                          <div className="flex gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() => handleVerAdjunto(c.imagen_url)}
                              className="px-3 py-1.5 bg-zinc-200 dark:bg-clr3 dark:border-white/10 dark:border rounded-xl text-[0.8em] font-bold uppercase hover:brightness-105 transition-all text-center text-zinc-800 dark:text-zinc-200"
                            >
                              📄 Ver Adjunto
                            </button>
                            {isPend && activeRecaudacionDetail.estado === 'abierta' && (
                              <>
                                <button
                                  onClick={() => {
                                    const corregido = prompt('¿Desea corregir el monto? Ingrese el monto definitivo o deje vacío para aceptar el cargado:', c.monto.toString())
                                    if (corregido === null) return;
                                    const montoFinal = corregido === '' ? undefined : parseInt(corregido)
                                    handleValidateComprobante(c.id, true, montoFinal)
                                  }}
                                  className="px-3 py-1.5 bg-green-600 text-white rounded-xl text-[0.8em] font-bold uppercase hover:brightness-105 transition-all"
                                >
                                  Aprobar
                                </button>
                                <button
                                  onClick={() => {
                                    const motivo = prompt('Por favor ingrese el motivo del rechazo del comprobante:')
                                    if (motivo === null) return // Cancelado
                                    if (motivo.trim() === '') {
                                      alert('Debe ingresar un motivo para poder rechazar el comprobante.')
                                      return
                                    }
                                    handleValidateComprobante(c.id, false, undefined, motivo.trim())
                                  }}
                                  className="px-3 py-1.5 bg-red-600 text-white rounded-xl text-[0.8em] font-bold uppercase hover:brightness-105 transition-all"
                                >
                                  Rechazar
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </div>

            {/* Sección B: Listado de NNJ / Participantes (Ver pagos y Asignar descuentos) */}
            <div className="space-y-4">
              <h4 className="font-black font-display uppercase text-[0.9em] tracking-wider text-clr6 border-b pb-2 dark:border-clr4">
                👤 Control de Participantes (NNJ)
              </h4>

              {miembrosDeRecaudacion.length === 0 ? (
                <p className="text-center py-8 opacity-45 text-[0.8em] uppercase font-bold">No hay NNJ cargados en esta unidad.</p>
              ) : (
                <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                  {miembrosDeRecaudacion.map(m => {
                    // Obtener descuentos de este NNJ
                    const desc = descuentos.find(d => d.recaudacion_id === viewingDetailId && d.usuario_id === m.id)
                    const descuentoVal = desc ? desc.descuento : 0

                    // Obtener total pagado validado por este NNJ
                    // Buscamos comprobantes validados que cubran a este NNJ (usando compUsuarios)
                    const userCompIds = compUsuarios.filter(cu => cu.usuario_id === m.id).map(cu => cu.comprobante_id)
                    const userComps = comprobantes.filter(c => c.recaudacion_id === viewingDetailId && userCompIds.includes(c.id))
                    
                    const pagadoVal = userComps
                      .filter(c => c.estado === 'validado')
                      .reduce((acc, curr) => acc + (curr.monto || 0), 0)

                    const pendVal = userComps
                      .filter(c => c.estado === 'pendiente')
                      .reduce((acc, curr) => acc + (curr.monto || 0), 0)

                    return (
                      <div key={m.id} className="border dark:border-clr4 p-3 rounded-2xl bg-zinc-50 dark:bg-black/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-[0.85em]">
                        <div>
                          <p className="font-black">{m.nombres} {m.apellidos}</p>
                          <div className="flex flex-wrap gap-1.5 mt-1 text-[0.8em] font-bold">
                            <span className="text-green-600 bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded-md">
                              Pagado: ${pagadoVal.toLocaleString('es-CL')}
                            </span>
                            {pendVal > 0 && (
                              <span className="text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-md animate-pulse">
                                Pendiente: ${pendVal.toLocaleString('es-CL')}
                              </span>
                            )}
                            {descuentoVal > 0 && (
                              <span className="text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-md">
                                Descuento: -${descuentoVal.toLocaleString('es-CL')}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Descuentos (solo si la recaudación está abierta) */}
                        {activeRecaudacionDetail.estado === 'abierta' && (
                          <div className="w-full md:w-auto">
                            {editingDiscountUserId === m.id ? (
                              <div className="flex flex-col gap-2 p-2 border rounded-xl bg-white dark:bg-clr3 max-w-[240px]">
                                <input
                                  type="number"
                                  placeholder="Monto descuento..."
                                  value={editingDiscountVal}
                                  onChange={e => setEditingDiscountVal(e.target.value === '' ? '' : parseInt(e.target.value))}
                                  className="p-1.5 rounded bg-zinc-100 dark:bg-clr5 font-bold text-[0.9em]"
                                />
                                <input
                                  type="text"
                                  placeholder="Motivo..."
                                  value={editingDiscountMotivo}
                                  onChange={e => setEditingDiscountMotivo(e.target.value)}
                                  className="p-1.5 rounded bg-zinc-100 dark:bg-clr5 font-bold text-[0.9em]"
                                />
                                <div className="flex gap-2 justify-end">
                                  <button onClick={() => handleSaveDiscount(m.id)} className="px-3 py-1 bg-clr6 text-white rounded-md text-[0.8em] font-bold">✔</button>
                                  <button onClick={() => setEditingDiscountUserId(null)} className="px-3 py-1 bg-clr2 text-white rounded-md text-[0.8em] font-bold">✕</button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingDiscountUserId(m.id)
                                  setEditingDiscountVal(descuentoVal || '')
                                  setEditingDiscountMotivo(desc ? desc.motivo : '')
                                }}
                                className="w-full md:w-auto px-3 py-1.5 border border-amber-500 text-amber-500 rounded-xl font-bold uppercase hover:bg-amber-500/5 transition-all text-center text-[0.8em]"
                              >
                                💸 Descuento
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Modales */}
      <DashModRecaudacionCrear
        isOpen={isCrearOpen}
        onClose={() => setIsCrearOpen(false)}
        onSuccess={fetchData}
        perfil={perfil}
      />

      <DashModRecaudacionComprobante
        isOpen={isComprobanteOpen}
        onClose={() => setIsComprobanteOpen(false)}
        onSuccess={fetchData}
        recaudacion={selectedRecaudacion}
        perfil={perfil}
      />

      <DashModRecaudacionCerrar
        isOpen={isCerrarOpen}
        onClose={() => setIsCerrarOpen(false)}
        onSuccess={fetchData}
        recaudacion={selectedRecaudacion}
        perfil={perfil}
      />
    </div>
  )
}
