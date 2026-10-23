'use client'

import React, { useState } from 'react'
import type {
  CotizacionBusItem,
  InspeccionBusData,
  EvaluacionPuntoBus
} from '@/types/campamento-preparacion'
import {
  PUNTOS_CHECKLIST_OFICIAL,
  crearInspeccionOficialVacia,
  descargarPdfChecklistBus
} from '@/utils/pdf-checklist-bus'

interface Props {
  cotizaciones: CotizacionBusItem[]
  busAdjudicadoId?: string
  inspeccion?: InspeccionBusData
  totalAsistentes: number
  onUpdateCotizaciones: (nuevas: CotizacionBusItem[], adjudicadoId?: string) => void
  onUpdateInspeccion: (nuevaInspeccion: InspeccionBusData) => void
}

export const CampamentoTransporteTab: React.FC<Props> = ({
  cotizaciones = [],
  busAdjudicadoId,
  inspeccion,
  totalAsistentes,
  onUpdateCotizaciones,
  onUpdateInspeccion
}) => {
  // Estado para modal de cotización
  const [modalCotizacionAbierto, setModalCotizacionAbierto] = useState(false)
  const [cotizacionEditando, setCotizacionEditando] = useState<CotizacionBusItem | null>(null)

  // Estado para modal de inspección técnica oficial (PDF)
  const [modalInspeccionAbierto, setModalInspeccionAbierto] = useState(false)
  const [inspeccionTemp, setInspeccionTemp] = useState<InspeccionBusData | null>(null)
  const [descargandoPdf, setDescargandoPdf] = useState(false)
  const [filtroTextoPunto, setFiltroTextoPunto] = useState('')

  // Formulario rápido de cotización
  const handleAbrirModalNuevaCot = () => {
    setCotizacionEditando({
      id: `bus-cot-${Date.now()}`,
      empresa_nombre: '',
      contacto_nombre: '',
      telefono: '',
      email: '',
      capacidad_asientos: 45,
      monto_total_clp: 0,
      incluye_peajes: true,
      incluye_combustible: true,
      incluye_viatico_chofer: true,
      observaciones: '',
      adjudicada: cotizaciones.length === 0
    })
    setModalCotizacionAbierto(true)
  }

  const handleEditarCotizacion = (cot: CotizacionBusItem) => {
    setCotizacionEditando({ ...cot })
    setModalCotizacionAbierto(true)
  }

  const handleGuardarCotizacion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!cotizacionEditando || !cotizacionEditando.empresa_nombre.trim()) return

    const index = cotizaciones.findIndex(c => c.id === cotizacionEditando.id)
    let nuevas: CotizacionBusItem[]
    if (index >= 0) {
      nuevas = [...cotizaciones]
      nuevas[index] = cotizacionEditando
    } else {
      nuevas = [...cotizaciones, cotizacionEditando]
    }

    const nuevoAdjudicadoId = cotizacionEditando.adjudicada ? cotizacionEditando.id : busAdjudicadoId
    onUpdateCotizaciones(nuevas, nuevoAdjudicadoId)
    setModalCotizacionAbierto(false)
    setCotizacionEditando(null)
  }

  const handleEliminarCotizacion = (id: string) => {
    if (confirm('¿Eliminar esta cotización de bus?')) {
      const nuevas = cotizaciones.filter(c => c.id !== id)
      const nuevoAdjudicadoId = busAdjudicadoId === id ? undefined : busAdjudicadoId
      onUpdateCotizaciones(nuevas, nuevoAdjudicadoId)
    }
  }

  const handleSeleccionarAdjudicada = (id: string) => {
    const nuevoAdjudicadoId = busAdjudicadoId === id ? undefined : id
    const actualizadas = cotizaciones.map(c => ({
      ...c,
      adjudicada: c.id === nuevoAdjudicadoId
    }))
    onUpdateCotizaciones(actualizadas, nuevoAdjudicadoId)
  }

  // Manejo de Inspección Técnica Oficial
  const handleAbrirInspeccion = (bus?: CotizacionBusItem) => {
    if (inspeccion && inspeccion.puntos && inspeccion.puntos.length > 0) {
      setInspeccionTemp({ ...inspeccion })
    } else {
      const nueva = crearInspeccionOficialVacia(bus?.id, bus?.empresa_nombre)
      if (totalAsistentes > 0) {
        nueva.numero_pasajeros = totalAsistentes
      }
      setInspeccionTemp(nueva)
    }
    setModalInspeccionAbierto(true)
  }

  const handleCambiarPunto = (puntoId: string, estado: EvaluacionPuntoBus, observaciones?: string) => {
    if (!inspeccionTemp) return
    const nuevosPuntos = inspeccionTemp.puntos.map(p => {
      if (p.id === puntoId) {
        return {
          ...p,
          estado,
          observaciones: observaciones !== undefined ? observaciones : p.observaciones
        }
      }
      return p
    })
    setInspeccionTemp({ ...inspeccionTemp, puntos: nuevosPuntos })
  }

  const handleGuardarInspeccion = () => {
    if (!inspeccionTemp) return
    onUpdateInspeccion(inspeccionTemp)
    setModalInspeccionAbierto(false)
  }

  const handleDescargarPdf = async () => {
    if (!inspeccionTemp) return
    try {
      setDescargandoPdf(true)
      await descargarPdfChecklistBus(inspeccionTemp)
    } catch (err) {
      console.error('Error al descargar PDF oficial de checklist:', err)
      alert('Hubo un error al generar el PDF del checklist. Asegúrate de tener conexión o de que la plantilla esté disponible.')
    } finally {
      setDescargandoPdf(false)
    }
  }

  const handleAgregarFoto = () => {
    if (!inspeccionTemp) return
    const url = prompt('Ingresa la URL o identificador de la foto de inspección (ej: neumáticos, estado general):')
    if (!url?.trim()) return
    const etiqueta = prompt('Etiqueta o descripción de la fotografía:', 'Evidencia técnica') || 'Foto'
    const nuevaFoto = {
      id: `foto-${Date.now()}`,
      etiqueta: etiqueta.trim(),
      foto_url: url.trim(),
      fecha: new Date().toISOString()
    }
    setInspeccionTemp({
      ...inspeccionTemp,
      fotos: [...(inspeccionTemp.fotos || []), nuevaFoto]
    })
  }

  const handleEliminarFoto = (id: string) => {
    if (!inspeccionTemp) return
    setInspeccionTemp({
      ...inspeccionTemp,
      fotos: inspeccionTemp.fotos.filter(f => f.id !== id)
    })
  }

  const puntosFiltrados = (inspeccionTemp?.puntos || []).filter(p => {
    if (!filtroTextoPunto.trim()) return true
    return p.label.toLowerCase().includes(filtroTextoPunto.toLowerCase())
  })

  const puntosBienCount = inspeccion?.puntos?.filter(p => p.estado === 'bien').length || 0
  const puntosMalCount = inspeccion?.puntos?.filter(p => p.estado === 'mal').length || 0

  return (
    <div className="space-y-6">
      {/* Resumen Superior y Botones de Acción */}
      <div className="bg-pclr1 dark:bg-pdclr1 border border-pclr13 dark:border-pdclr13 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold font-display text-pclr4 dark:text-pdclr4 flex items-center gap-2">
              <span>🚌</span> Cotizaciones y Checklist de Transporte
            </h3>
            <p className="text-[0.9em] text-pclr7 dark:text-pdclr7">
              Registra diferentes propuestas de buses, selecciona la opción definitiva e inspecciona técnicamente la máquina antes del viaje con la <strong>Ficha Oficial descargable en PDF</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAbrirInspeccion()}
              className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 font-bold rounded-xl text-[0.9em] flex items-center gap-1.5 transition"
            >
              <span>📋</span> {inspeccion ? 'Ver / Editar Inspección' : 'Realizar Inspección Técnica'}
            </button>
            <button
              onClick={handleAbrirModalNuevaCot}
              className="px-4 py-2 bg-[#cb3327] hover:bg-[#b02920] text-white font-bold rounded-xl text-[0.9em] flex items-center gap-1.5 shadow-sm transition"
            >
              <span>➕</span> Nueva Cotización
            </button>
          </div>
        </div>

        {/* Resumen del Estado de la Inspección Técnica */}
        {inspeccion && (
          <div className="mt-4 p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[0.9em]">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📑</span>
              <div>
                <p className="font-bold text-pclr4 dark:text-pdclr4">
                  Ficha Oficial de Inspección: <span className="uppercase text-blue-600">{inspeccion.patente || 'Sin Patente'}</span> ({inspeccion.empresa || 'Empresa no asignada'})
                </p>
                <p className="text-pclr7 dark:text-pdclr7 text-[0.9em]">
                  Estado: <strong className="text-emerald-600">{puntosBienCount} conformes</strong> | <strong className="text-red-600">{puntosMalCount} observaciones</strong> | {inspeccion.fotos?.length || 0} fotos registradas
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  try {
                    await descargarPdfChecklistBus(inspeccion)
                  } catch (e) {
                    console.error(e)
                    alert('Error al descargar el PDF oficial')
                  }
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[0.8em] flex items-center gap-1 transition"
              >
                <span>📥</span> Descargar PDF Oficial
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Listado de Cotizaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cotizaciones.map(cot => {
          const esAdjudicada = cot.id === busAdjudicadoId
          const costoPorAsiento = cot.capacidad_asientos > 0 ? Math.round(cot.monto_total_clp / cot.capacidad_asientos) : 0

          return (
            <div
              key={cot.id}
              className={`bg-pclr1 dark:bg-pdclr1 border-2 rounded-2xl p-5 shadow-sm transition flex flex-col justify-between ${
                esAdjudicada
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                  : 'border-pclr13 dark:border-pdclr13 hover:border-pclr13 dark:hover:border-pdclr13'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[0.8em] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-pclr3 dark:bg-pdclr3 text-pclr7 dark:text-pdclr7">
                      Capacidad {cot.capacidad_asientos} Asientos
                    </span>
                    <h4 className="text-lg font-bold font-display text-pclr4 dark:text-pdclr4 mt-1">
                      {cot.empresa_nombre}
                    </h4>
                  </div>
                  <button
                    onClick={() => handleSeleccionarAdjudicada(cot.id)}
                    className={`px-2.5 py-1 rounded-full text-[0.8em] font-bold transition flex items-center gap-1 ${
                      esAdjudicada
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-pclr3 dark:bg-pdclr3 text-pclr7 dark:text-pdclr7 hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
                  >
                    {esAdjudicada ? '✓ Seleccionada' : 'Elegir'}
                  </button>
                </div>

                {/* Precios */}
                <div className="p-3 rounded-xl bg-pclr2 dark:bg-pdclr2 border border-pclr13 dark:border-pdclr13">
                  <p className="text-[0.8em] text-pclr7 dark:text-pdclr7 uppercase font-bold">Costo Cotizado Total</p>
                  <p className="text-2xl font-black text-[#cb3327]">
                    ${cot.monto_total_clp.toLocaleString('es-CL')}
                  </p>
                  <p className="text-[0.8em] text-pclr7 dark:text-pdclr7 mt-0.5">
                    ~${costoPorAsiento.toLocaleString('es-CL')} por asiento
                  </p>
                </div>

                {/* Condiciones incluidas */}
                <div className="flex flex-wrap gap-1.5 text-[0.8em]">
                  <span className={`px-2 py-0.5 rounded-md font-medium ${cot.incluye_peajes ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-pclr3 dark:bg-pdclr3 text-pclr7 dark:text-pdclr7 dark:bg-pdclr3'}`}>
                    {cot.incluye_peajes ? '✓ Peajes' : '✗ Sin peajes'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md font-medium ${cot.incluye_combustible ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-pclr3 dark:bg-pdclr3 text-pclr7 dark:text-pdclr7 dark:bg-pdclr3'}`}>
                    {cot.incluye_combustible ? '✓ Combustible' : '✗ Sin combustible'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md font-medium ${cot.incluye_viatico_chofer ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-pclr3 dark:bg-pdclr3 text-pclr7 dark:text-pdclr7 dark:bg-pdclr3'}`}>
                    {cot.incluye_viatico_chofer ? '✓ Viático Chofer' : '✗ Sin viático'}
                  </span>
                </div>

                {/* Contacto */}
                {(cot.contacto_nombre || cot.telefono) && (
                  <div className="text-[0.8em] text-pclr7 dark:text-pdclr7 pt-1 border-t border-pclr13 dark:border-pdclr13">
                    <p className="font-semibold">{cot.contacto_nombre}</p>
                    {cot.telefono && <p className="text-pclr7 dark:text-pdclr7">{cot.telefono}</p>}
                  </div>
                )}
              </div>

              {/* Botones de acción */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-pclr13 dark:border-pdclr13">
                <button
                  onClick={() => handleAbrirInspeccion(cot)}
                  className="text-[0.8em] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>📋</span> Inspeccionar
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditarCotizacion(cot)}
                    className="text-[0.8em] font-medium text-pclr7 dark:text-pdclr7 hover:text-pclr4 dark:hover:text-pdclr4 text-pclr7 dark:text-pdclr7 dark:hover:text-pdclr4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminarCotizacion(cot.id)}
                    className="text-[0.8em] font-medium text-red-600 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        {cotizaciones.length === 0 && (
          <div className="col-span-full p-8 text-center border-2 border-dashed border-pclr13 dark:border-pdclr13 rounded-2xl bg-pclr2 dark:bg-pdclr2/50">
            <span className="text-4xl block mb-2">🚌</span>
            <p className="font-bold text-pclr4 dark:text-pdclr4">No hay cotizaciones de transporte registradas</p>
            <p className="text-[0.9em] text-pclr7 dark:text-pdclr7 mt-1">Registra las opciones de bus que estés cotizando para comparar y definir la elegida.</p>
          </div>
        )}
      </div>

      {/* MODAL: Cotización de Bus */}
      {modalCotizacionAbierto && cotizacionEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-pclr1 dark:bg-pdclr1 border border-pclr13 dark:border-pdclr13 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <h4 className="text-lg font-bold font-display text-pclr4 dark:text-pdclr4">
              {cotizaciones.some(c => c.id === cotizacionEditando.id) ? 'Editar Cotización' : 'Nueva Cotización de Bus'}
            </h4>

            <form onSubmit={handleGuardarCotizacion} className="space-y-4 text-[1em]">
              <div>
                <label className="block font-bold text-pclr4 dark:text-pdclr4 mb-1">Empresa de Buses *</label>
                <input
                  type="text"
                  required
                  value={cotizacionEditando.empresa_nombre}
                  onChange={e => setCotizacionEditando({ ...cotizacionEditando, empresa_nombre: e.target.value })}
                  placeholder="Ej: Buses Pullman del Sur / Transportes Cordillera"
                  className="w-full px-3 py-2 border border-pclr13 dark:border-pdclr13 rounded-xl bg-pclr3 dark:bg-pdclr3"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-pclr4 dark:text-pdclr4 mb-1">Contacto</label>
                  <input
                    type="text"
                    value={cotizacionEditando.contacto_nombre || ''}
                    onChange={e => setCotizacionEditando({ ...cotizacionEditando, contacto_nombre: e.target.value })}
                    placeholder="Ej: Carlos Miranda"
                    className="w-full px-3 py-2 border border-pclr13 dark:border-pdclr13 rounded-xl bg-pclr3 dark:bg-pdclr3"
                  />
                </div>
                <div>
                  <label className="block font-bold text-pclr4 dark:text-pdclr4 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={cotizacionEditando.telefono || ''}
                    onChange={e => setCotizacionEditando({ ...cotizacionEditando, telefono: e.target.value })}
                    placeholder="+56 9 8765 4321"
                    className="w-full px-3 py-2 border border-pclr13 dark:border-pdclr13 rounded-xl bg-pclr3 dark:bg-pdclr3"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-pclr4 dark:text-pdclr4 mb-1">Capacidad (Asientos) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={cotizacionEditando.capacidad_asientos}
                    onChange={e => setCotizacionEditando({ ...cotizacionEditando, capacidad_asientos: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-pclr13 dark:border-pdclr13 rounded-xl bg-pclr3 dark:bg-pdclr3"
                  />
                </div>
                <div>
                  <label className="block font-bold text-pclr4 dark:text-pdclr4 mb-1">Costo Total ($ CLP) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={cotizacionEditando.monto_total_clp}
                    onChange={e => setCotizacionEditando({ ...cotizacionEditando, monto_total_clp: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-pclr13 dark:border-pdclr13 rounded-xl bg-pclr3 dark:bg-pdclr3 font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div className="space-y-2 p-3 rounded-xl bg-pclr2 dark:bg-pdclr2 border border-pclr13 dark:border-pdclr13">
                <p className="font-bold text-pclr4 dark:text-pdclr4">Incluido en el costo:</p>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cotizacionEditando.incluye_peajes}
                      onChange={e => setCotizacionEditando({ ...cotizacionEditando, incluye_peajes: e.target.checked })}
                      className="rounded text-[#cb3327] focus:ring-[#cb3327]"
                    />
                    <span>Peajes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cotizacionEditando.incluye_combustible}
                      onChange={e => setCotizacionEditando({ ...cotizacionEditando, incluye_combustible: e.target.checked })}
                      className="rounded text-[#cb3327] focus:ring-[#cb3327]"
                    />
                    <span>Combustible</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cotizacionEditando.incluye_viatico_chofer}
                      onChange={e => setCotizacionEditando({ ...cotizacionEditando, incluye_viatico_chofer: e.target.checked })}
                      className="rounded text-[#cb3327] focus:ring-[#cb3327]"
                    />
                    <span>Viático Chofer</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-pclr4 dark:text-pdclr4 mb-1">Observaciones</label>
                <textarea
                  rows={2}
                  value={cotizacionEditando.observaciones || ''}
                  onChange={e => setCotizacionEditando({ ...cotizacionEditando, observaciones: e.target.value })}
                  placeholder="Detalles de horarios, requisitos especiales, año del bus..."
                  className="w-full px-3 py-2 border border-pclr13 dark:border-pdclr13 rounded-xl bg-pclr3 dark:bg-pdclr3"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-pclr13 dark:border-pdclr13">
                <button
                  type="button"
                  onClick={() => setModalCotizacionAbierto(false)}
                  className="px-4 py-2 text-pclr7 dark:text-pdclr7 hover:text-pclr4 dark:text-pdclr4 dark:hover:text-pdclr4 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#cb3327] hover:bg-[#b02920] text-white font-bold rounded-xl shadow-sm transition"
                >
                  Guardar Cotización
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Inspección Técnica Oficial (PDF 23 PUNTOS) */}
      {modalInspeccionAbierto && inspeccionTemp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-pclr1 dark:bg-pdclr1 border border-pclr13 dark:border-pdclr13 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl my-auto overflow-hidden">
            {/* Header del Modal */}
            <div className="p-4 md:p-5 bg-pclr2 dark:bg-pdclr2 text-pclr4 dark:text-pdclr4 flex justify-between items-center gap-4 border-b border-pclr13 dark:border-pdclr13 shrink-0">
              <div>
                <h4 className="text-lg font-bold font-display flex items-center gap-2">
                  <span>📋</span> Ficha Oficial de Inspección Técnica de Buses
                </h4>
                <p className="text-[0.85em] text-pclr7 dark:text-pdclr7">
                  Protocolo oficial 1:1 con la Ficha de Seguridad Nua Mana ({PUNTOS_CHECKLIST_OFICIAL.length} puntos de control)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDescargarPdf}
                  disabled={descargandoPdf}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white font-bold rounded-lg text-[0.85em] flex items-center gap-1.5 transition"
                >
                  <span>📥</span> {descargandoPdf ? 'Generando...' : 'Descargar PDF Oficial'}
                </button>
                <button
                  onClick={() => setModalInspeccionAbierto(false)}
                  className="text-pclr7 dark:text-pdclr7 hover:text-white p-1 text-lg"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Cuerpo del Modal con Scroll */}
            <div className="p-5 overflow-y-auto space-y-6 flex-1 text-[1em]">
              {/* Sección 1: Datos de Conductor, Empresa y Vehículo */}
              <div className="p-4 rounded-xl border border-pclr13 dark:border-pdclr13 bg-pclr2 dark:bg-pdclr2 space-y-3">
                <h5 className="font-bold text-pclr4 dark:text-pdclr4 uppercase tracking-wider text-[0.9em] flex items-center gap-1.5">
                  <span>🚐</span> Datos del Bus y Conductores
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-pclr7 dark:text-pdclr7 font-semibold mb-0.5">Patente Bus *</label>
                    <input
                      type="text"
                      placeholder="Ej: ABCD-12"
                      value={inspeccionTemp.patente}
                      onChange={e => setInspeccionTemp({ ...inspeccionTemp, patente: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-1.5 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 font-bold uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-pclr7 dark:text-pdclr7 font-semibold mb-0.5">Empresa</label>
                    <input
                      type="text"
                      value={inspeccionTemp.empresa}
                      onChange={e => setInspeccionTemp({ ...inspeccionTemp, empresa: e.target.value })}
                      className="w-full px-3 py-1.5 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3"
                    />
                  </div>
                  <div>
                    <label className="block text-pclr7 dark:text-pdclr7 font-semibold mb-0.5">N° Pasajeros</label>
                    <input
                      type="number"
                      value={inspeccionTemp.numero_pasajeros || 45}
                      onChange={e => setInspeccionTemp({ ...inspeccionTemp, numero_pasajeros: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-2.5 rounded-lg border border-pclr13 dark:border-pdclr13 bg-pclr3 dark:bg-pdclr3 space-y-2">
                    <p className="font-bold text-pclr4 dark:text-pdclr4">1er Conductor</p>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Nombre completo"
                        value={inspeccionTemp.nombre_chofer_1}
                        onChange={e => setInspeccionTemp({ ...inspeccionTemp, nombre_chofer_1: e.target.value })}
                        className="px-2.5 py-1 text-[0.9em] border border-pclr13 dark:border-pdclr13 rounded bg-pclr2 dark:bg-pdclr2"
                      />
                      <input
                        type="text"
                        placeholder="RUN (ej: 12.345.678-9)"
                        value={inspeccionTemp.rut_chofer_1}
                        onChange={e => setInspeccionTemp({ ...inspeccionTemp, rut_chofer_1: e.target.value })}
                        className="px-2.5 py-1 text-[0.9em] border border-pclr13 dark:border-pdclr13 rounded bg-pclr2 dark:bg-pdclr2 font-mono"
                      />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg border border-pclr13 dark:border-pdclr13 bg-pclr3 dark:bg-pdclr3 space-y-2">
                    <p className="font-bold text-pclr4 dark:text-pdclr4">2do Conductor (opcional)</p>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Nombre completo"
                        value={inspeccionTemp.nombre_chofer_2 || ''}
                        onChange={e => setInspeccionTemp({ ...inspeccionTemp, nombre_chofer_2: e.target.value })}
                        className="px-2.5 py-1 text-[0.9em] border border-pclr13 dark:border-pdclr13 rounded bg-pclr2 dark:bg-pdclr2"
                      />
                      <input
                        type="text"
                        placeholder="RUN"
                        value={inspeccionTemp.rut_chofer_2 || ''}
                        onChange={e => setInspeccionTemp({ ...inspeccionTemp, rut_chofer_2: e.target.value })}
                        className="px-2.5 py-1 text-[0.9em] border border-pclr13 dark:border-pdclr13 rounded bg-pclr2 dark:bg-pdclr2 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Documentación Obligatoria */}
                <div className="pt-2 border-t border-pclr13 dark:border-pdclr13 flex flex-wrap gap-4">
                  <label className="flex items-center gap-1.5 font-semibold text-pclr4 dark:text-pdclr4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inspeccionTemp.permiso_circulacion}
                      onChange={e => setInspeccionTemp({ ...inspeccionTemp, permiso_circulacion: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-600"
                    />
                    <span>Permiso de Circulación al día</span>
                  </label>
                  <label className="flex items-center gap-1.5 font-semibold text-pclr4 dark:text-pdclr4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inspeccionTemp.revision_tecnica}
                      onChange={e => setInspeccionTemp({ ...inspeccionTemp, revision_tecnica: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-600"
                    />
                    <span>Revisión Técnica al día</span>
                  </label>
                  <label className="flex items-center gap-1.5 font-semibold text-pclr4 dark:text-pdclr4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inspeccionTemp.seguro_obligatorio}
                      onChange={e => setInspeccionTemp({ ...inspeccionTemp, seguro_obligatorio: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-600"
                    />
                    <span>Seguro Obligatorio (SOAP) al día</span>
                  </label>
                </div>
              </div>

              {/* Sección 2: 23 Puntos de Control Oficial */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h5 className="font-bold text-pclr4 dark:text-pdclr4 uppercase tracking-wider text-[0.9em] flex items-center gap-1.5">
                    <span>🔍</span> Lista de 23 Puntos de Seguridad
                  </h5>
                  <input
                    type="text"
                    placeholder="Filtrar punto..."
                    value={filtroTextoPunto}
                    onChange={e => setFiltroTextoPunto(e.target.value)}
                    className="px-2.5 py-1 text-[0.9em] border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3"
                  />
                </div>

                <div className="border border-pclr13 dark:border-pdclr13 rounded-xl divide-y divide-pclr13 dark:divide-pdclr13 bg-pclr1 dark:bg-pdclr1 overflow-hidden">
                  {puntosFiltrados.map((p, idx) => {
                    const isBien = p.estado === 'bien'
                    const isMal = p.estado === 'mal'

                    return (
                      <div
                        key={p.id}
                        className={`p-3 space-y-2 transition ${
                          isMal ? 'bg-red-50/40 dark:bg-red-950/20' : isBien ? 'bg-emerald-50/20 dark:bg-emerald-950/10' : ''
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-pclr7 dark:text-pdclr7 w-6 text-right">#{idx + 1}</span>
                            <span className="font-semibold text-pclr4 dark:text-pdclr4">{p.label}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleCambiarPunto(p.id, 'bien')}
                              className={`px-3 py-1 rounded-lg font-bold text-[0.8em] transition flex items-center gap-1 ${
                                isBien
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'bg-pclr3 dark:bg-pdclr3 text-pclr7 dark:text-pdclr7 hover:bg-emerald-50 hover:text-emerald-600'
                              }`}
                            >
                              ✓ Bien
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCambiarPunto(p.id, 'mal')}
                              className={`px-3 py-1 rounded-lg font-bold text-[0.8em] transition flex items-center gap-1 ${
                                isMal
                                  ? 'bg-red-600 text-white shadow-sm'
                                  : 'bg-pclr3 dark:bg-pdclr3 text-pclr7 dark:text-pdclr7 hover:bg-red-50 hover:text-red-600'
                              }`}
                            >
                              ✗ Mal
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCambiarPunto(p.id, 'pendiente')}
                              className={`px-2.5 py-1 rounded-lg font-medium text-[0.8em] transition ${
                                p.estado === 'pendiente'
                                  ? 'bg-pclr10 dark:bg-pdclr10 text-pclr12 dark:text-pdclr12'
                                  : 'text-pclr7 dark:text-pdclr7 hover:text-pclr4 dark:hover:text-pdclr4'
                              }`}
                            >
                              Pendiente
                            </button>
                          </div>
                        </div>

                        {/* Observación por punto */}
                        <input
                          type="text"
                          placeholder="Observaciones de este punto (opcional)..."
                          value={p.observaciones || ''}
                          onChange={e => handleCambiarPunto(p.id, p.estado, e.target.value)}
                          className="w-full px-2.5 py-1 text-[0.8em] border border-pclr13 dark:border-pdclr13 rounded bg-pclr2 dark:bg-pdclr2"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Sección 3: Fotos de Evidencia */}
              <div className="p-4 rounded-xl border border-pclr13 dark:border-pdclr13 bg-pclr2 dark:bg-pdclr2 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-pclr4 dark:text-pdclr4 uppercase tracking-wider text-[0.9em] flex items-center gap-1.5">
                    <span>📷</span> Fotografías de Evidencia
                  </h5>
                  <button
                    type="button"
                    onClick={handleAgregarFoto}
                    className="px-2.5 py-1 bg-pclr3 dark:bg-pdclr3 border border-pclr13 dark:border-pdclr13 rounded-lg text-[0.8em] font-bold text-pclr4 dark:text-pdclr4 hover:bg-pclr2 dark:bg-pdclr2"
                  >
                    + Agregar Foto
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {(inspeccionTemp.fotos || []).map(f => (
                    <div key={f.id} className="relative group border border-pclr13 dark:border-pdclr13 rounded-lg overflow-hidden bg-pclr3 dark:bg-pdclr3 p-2">
                      <p className="text-[0.8em] font-semibold truncate text-pclr4 dark:text-pdclr4 mb-1">{f.etiqueta}</p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.foto_url} alt={f.etiqueta} className="w-full h-24 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => handleEliminarFoto(f.id)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-[0.8em] opacity-0 group-hover:opacity-100 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {(!inspeccionTemp.fotos || inspeccionTemp.fotos.length === 0) && (
                    <p className="col-span-full text-pclr7 dark:text-pdclr7 italic text-[0.8em]">
                      No se han adjuntado fotos de inspección técnica.
                    </p>
                  )}
                </div>
              </div>

              {/* Observaciones Generales */}
              <div>
                <label className="block font-bold text-pclr4 dark:text-pdclr4 mb-1">
                  Observaciones Generales de la Inspección
                </label>
                <textarea
                  rows={2}
                  value={inspeccionTemp.observaciones_generales || ''}
                  onChange={e => setInspeccionTemp({ ...inspeccionTemp, observaciones_generales: e.target.value })}
                  placeholder="Detallar condiciones especiales, estado de neumáticos en mm, etc."
                  className="w-full px-3 py-2 border border-pclr13 dark:border-pdclr13 rounded-xl bg-pclr3 dark:bg-pdclr3"
                />
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-4 bg-pclr2 dark:bg-pdclr2/80 border-t border-pclr13 dark:border-pdclr13 flex justify-between items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleDescargarPdf}
                disabled={descargandoPdf}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white font-bold rounded-xl text-[0.8em] flex items-center gap-1.5 transition"
              >
                <span>📥</span> {descargandoPdf ? 'Generando...' : 'Descargar PDF Oficial'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModalInspeccionAbierto(false)}
                  className="px-4 py-2 text-pclr7 dark:text-pdclr7 hover:text-pclr4 dark:text-pdclr4 dark:hover:text-pdclr4 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleGuardarInspeccion}
                  className="px-5 py-2 bg-[#cb3327] hover:bg-[#b02920] text-white font-bold rounded-xl shadow-sm transition"
                >
                  Guardar Inspección
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

