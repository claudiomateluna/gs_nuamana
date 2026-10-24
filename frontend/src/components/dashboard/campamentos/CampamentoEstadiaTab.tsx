'use client'

import React, { useState } from 'react'
import type { CotizacionLugarItem } from '@/types/campamento-preparacion'

interface Props {
  cotizaciones: CotizacionLugarItem[]
  lugarAdjudicadoId?: string
  totalAsistentes: number
  diasTotales: number
  onUpdateCotizaciones: (cotizaciones: CotizacionLugarItem[], adjudicadoId?: string) => void
}

export const CampamentoEstadiaTab: React.FC<Props> = ({
  cotizaciones,
  lugarAdjudicadoId,
  totalAsistentes,
  diasTotales,
  onUpdateCotizaciones
}) => {
  const [editandoLugar, setEditandoLugar] = useState<CotizacionLugarItem | null>(null)

  const adjudicarLugar = (id: string) => {
    const actualizadas = cotizaciones.map(l => ({
      ...l,
      adjudicada: l.id === id
    }))
    onUpdateCotizaciones(actualizadas, id)
  }

  const guardarLugar = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editandoLugar) return

    // Calcular monto total estimado
    let montoTotal = editandoLugar.valor_unitario_clp
    if (editandoLugar.modalidad_cobro === 'por_persona_dia') {
      montoTotal = totalAsistentes * Math.max(1, diasTotales) * editandoLugar.valor_unitario_clp
    }

    const lugarListo: CotizacionLugarItem = {
      ...editandoLugar,
      monto_total_calculado_clp: montoTotal
    }

    const index = cotizaciones.findIndex(l => l.id === lugarListo.id)
    let nuevas: CotizacionLugarItem[]
    if (index >= 0) {
      nuevas = [...cotizaciones]
      nuevas[index] = lugarListo
    } else {
      nuevas = [...cotizaciones, lugarListo]
    }

    onUpdateCotizaciones(nuevas, lugarListo.adjudicada ? lugarListo.id : lugarAdjudicadoId)
    setEditandoLugar(null)
  }

  const eliminarLugar = (id: string) => {
    if (confirm('¿Eliminar esta cotización de terreno?')) {
      const nuevas = cotizaciones.filter(l => l.id !== id)
      const nuevoAdjudicadoId = lugarAdjudicadoId === id ? undefined : lugarAdjudicadoId
      onUpdateCotizaciones(nuevas, nuevoAdjudicadoId)
    }
  }

  return (
    <div className="space-y-6 text-[1em]">
      <div className="flex justify-between items-center border-b border-pclr13 dark:border-pdclr13 pb-3 flex-wrap gap-2">
        <div>
          <h3 className="text-[1.2em] font-semibold text-pclr4 dark:text-pdclr4 flex items-center gap-2">
            <span>🏕️</span> Cotizaciones de Terrenos y Sitios de Campamento
          </h3>
          <p className="text-[0.8em] text-pclr7 dark:text-pdclr7">
            Compara recintos, tarifas por persona o globales y requisitos sanitarios de campamento.
          </p>
        </div>

        <button
          onClick={() =>
            setEditandoLugar({
              id: `lug-${Date.now()}`,
              nombre_lugar: '',
              comuna_region: '',
              contacto_nombre: '',
              telefono: '',
              modalidad_cobro: 'por_persona_dia',
              valor_unitario_clp: 2500,
              monto_total_calculado_clp: 0,
              tiene_agua_potable: true,
              tiene_banos_letrinas: true,
              tiene_luz_electrica: false,
              cercania_posta_km: 5,
              adjudicada: cotizaciones.length === 0
            })
          }
          className="px-4 py-2 bg-pclr10 dark:bg-pdclr10 text-pclr12 dark:text-pdclr12 rounded-xl font-medium text-[0.9em] transition hover:opacity-90"
        >
          + Nueva Cotización de Terreno
        </button>
      </div>

      {cotizaciones.length === 0 ? (
        <div className="bg-pclr1 dark:bg-pdclr1 border border-dashed border-pclr13 dark:border-pdclr13 rounded-2xl p-12 text-center space-y-3">
          <span className="text-4xl">🏕️</span>
          <h4 className="font-semibold text-pclr4 dark:text-pdclr4 text-[1.2em]">
            No hay cotizaciones de terreno ingresadas
          </h4>
          <p className="text-pclr7 dark:text-pdclr7 max-w-md mx-auto text-[0.9em]">
            Agrega las opciones de campings, fundos o recintos scouts cotizados para seleccionar el definitivo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cotizaciones.map(l => {
            const esAdjudicado = l.id === lugarAdjudicadoId || l.adjudicada
            const costoTotalCalculado =
              l.modalidad_cobro === 'por_persona_dia'
                ? totalAsistentes * Math.max(1, diasTotales) * l.valor_unitario_clp
                : l.valor_unitario_clp

            return (
              <div
                key={l.id}
                className={`border-2 rounded-2xl p-5 bg-pclr1 dark:bg-pdclr1 transition flex flex-col justify-between ${
                  esAdjudicado
                    ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10 shadow-md ring-2 ring-emerald-400/20'
                    : 'border-pclr13 dark:border-pdclr13 hover:border-pclr13 dark:hover:border-pdclr13'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-[1.2em] text-pclr4 dark:text-pdclr4">
                          {l.nombre_lugar || 'Lugar Sin Nombre'}
                        </h4>
                        {esAdjudicado && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[0.8em] uppercase tracking-wider">
                            ✓ Terreno Adjudicado
                          </span>
                        )}
                      </div>
                      <p className="text-[0.8em] text-pclr7 dark:text-pdclr7">
                        📍 {l.comuna_region || 'Ubicación no especificada'}
                      </p>
                      {(l.contacto_nombre || l.telefono) && (
                        <p className="text-[0.8em] text-pclr7 dark:text-pdclr7">
                          Contacto: {l.contacto_nombre} {l.telefono ? `(${l.telefono})` : ''}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditandoLugar(l)}
                        className="p-1.5 hover:bg-pclr3 dark:hover:bg-pdclr3 rounded text-pclr7 dark:text-pdclr7 text-[0.9em]"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => eliminarLugar(l.id)}
                        className="p-1.5 hover:bg-pclr3 dark:hover:bg-pdclr3 rounded text-red-500 text-[0.9em]"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Resumen de costos */}
                  <div className="grid grid-cols-2 gap-2 bg-pclr2 dark:bg-pdclr2 p-3 rounded-xl text-center">
                    <div>
                      <span className="text-[0.8em] uppercase text-pclr7 dark:text-pdclr7 font-semibold block">Modalidad</span>
                      <span className="font-bold text-[0.9em] text-pclr4 dark:text-pdclr4">
                        {l.modalidad_cobro === 'por_persona_dia'
                          ? `$${l.valor_unitario_clp.toLocaleString('es-CL')} / persona / día`
                          : 'Tarifa Global Fija'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[0.8em] uppercase text-pclr7 dark:text-pdclr7 font-semibold block">
                        Costo Total ({diasTotales} días, {totalAsistentes} asis.)
                      </span>
                      <span className="font-black text-[1.25em] text-[#cb3327]">
                        ${costoTotalCalculado.toLocaleString('es-CL')}
                      </span>
                    </div>
                  </div>

                  {/* Factibilidad técnica e higiene */}
                  <div className="flex flex-wrap gap-2 text-[0.8em]">
                    <span className={`px-2 py-0.5 rounded-full ${l.tiene_agua_potable ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300' : 'bg-red-100 text-red-700'}`}>
                      {l.tiene_agua_potable ? '💧 Agua Potable' : '⚠️ Sin Agua Potable'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full ${l.tiene_banos_letrinas ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' : 'bg-red-100 text-red-700'}`}>
                      {l.tiene_banos_letrinas ? '🚻 Baños / Letrinas' : '⚠️ Sin Baños'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full ${l.tiene_luz_electrica ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300' : 'bg-pclr3 dark:bg-pdclr3 text-pclr7 dark:text-pdclr7'}`}>
                      {l.tiene_luz_electrica ? '⚡ Luz Eléctrica' : 'Sin Luz (Rústico)'}
                    </span>
                    {l.cercania_posta_km !== undefined && (
                      <span className="px-2 py-0.5 rounded-full bg-pclr3 dark:bg-pdclr3 text-pclr7 dark:text-pdclr7">
                        🏥 Posta a {l.cercania_posta_km} km
                      </span>
                    )}
                  </div>

                  {l.observaciones && (
                    <p className="text-[0.8em] text-pclr7 dark:text-pdclr7 italic">"{l.observaciones}"</p>
                  )}
                </div>

                <div className="pt-4 border-t border-pclr13 dark:border-pdclr13 mt-3">
                  {esAdjudicado ? (
                    <div className="text-center py-2 bg-emerald-600 text-white font-bold rounded-xl text-[0.9em] flex items-center justify-center gap-2">
                      <span>✓</span> Terreno Definitivo Seleccionado
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => adjudicarLugar(l.id)}
                      className="w-full py-2 bg-pclr3 dark:bg-pdclr3 hover:bg-emerald-600 hover:text-white text-pclr4 dark:text-pdclr4 font-semibold rounded-xl text-[0.9em] transition flex items-center justify-center gap-2"
                    >
                      <span>⭐</span> Marcar como Terreno Definitivo
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal de Edición de Terreno */}
      {editandoLugar && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-pclr1 dark:bg-pdclr1 border border-pclr13 dark:border-pdclr13 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-pclr13 dark:border-pdclr13 flex justify-between items-center bg-pclr2 dark:bg-pdclr2">
              <h3 className="font-bold text-[1.2em] text-pclr4 dark:text-pdclr4">
                {editandoLugar.id.includes('lug-') ? 'Nueva Cotización de Terreno' : 'Editar Terreno'}
              </h3>
              <button onClick={() => setEditandoLugar(null)} className="text-pclr7 dark:text-pdclr7 hover:text-pclr4 dark:hover:text-pdclr4">
                ✕
              </button>
            </div>

            <form onSubmit={guardarLugar} className="p-6 space-y-4">
              <div>
                <label className="block text-[0.9em] font-medium text-pclr4 dark:text-pdclr4 mb-1">
                  Nombre del Recinto / Fundo / Camping
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Camping Los Coigües, Fundo Pellines"
                  value={editandoLugar.nombre_lugar}
                  onChange={e => setEditandoLugar({ ...editandoLugar, nombre_lugar: e.target.value })}
                  className="w-full px-3 py-2 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[0.95em]"
                />
              </div>

              <div>
                <label className="block text-[0.9em] font-medium text-pclr4 dark:text-pdclr4 mb-1">
                  Comuna y Región
                </label>
                <input
                  type="text"
                  placeholder="Ej: Coñaripe, Panguipulli, Región de Los Ríos"
                  value={editandoLugar.comuna_region}
                  onChange={e => setEditandoLugar({ ...editandoLugar, comuna_region: e.target.value })}
                  className="w-full px-3 py-2 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[0.95em]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[0.9em] font-medium text-pclr4 dark:text-pdclr4 mb-1">
                    Modalidad de Cobro
                  </label>
                  <select
                    value={editandoLugar.modalidad_cobro}
                    onChange={e => setEditandoLugar({ ...editandoLugar, modalidad_cobro: e.target.value as any })}
                    className="w-full px-3 py-2 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[0.9em]"
                  >
                    <option value="por_persona_dia">Por persona por día</option>
                    <option value="global_fijo">Tarifa global cerrada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[0.9em] font-medium text-pclr4 dark:text-pdclr4 mb-1">
                    {editandoLugar.modalidad_cobro === 'por_persona_dia' ? 'Tarifa ($ / pers / día)' : 'Monto Global ($)'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editandoLugar.valor_unitario_clp}
                    onChange={e => setEditandoLugar({ ...editandoLugar, valor_unitario_clp: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[0.95em] font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[0.9em] font-medium text-pclr4 dark:text-pdclr4 mb-1">
                    Contacto / Administrador
                  </label>
                  <input
                    type="text"
                    value={editandoLugar.contacto_nombre || ''}
                    onChange={e => setEditandoLugar({ ...editandoLugar, contacto_nombre: e.target.value })}
                    className="w-full px-3 py-2 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[0.9em]"
                  />
                </div>
                <div>
                  <label className="block text-[0.9em] font-medium text-pclr4 dark:text-pdclr4 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={editandoLugar.telefono || ''}
                    onChange={e => setEditandoLugar({ ...editandoLugar, telefono: e.target.value })}
                    className="w-full px-3 py-2 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[0.9em]"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-[0.9em] text-pclr4 dark:text-pdclr4">
                  <input
                    type="checkbox"
                    checked={editandoLugar.tiene_agua_potable}
                    onChange={e => setEditandoLugar({ ...editandoLugar, tiene_agua_potable: e.target.checked })}
                    className="rounded text-[#cb3327]"
                  />
                  <span>Tiene agua potable certificada</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[0.9em] text-pclr4 dark:text-pdclr4">
                  <input
                    type="checkbox"
                    checked={editandoLugar.tiene_banos_letrinas}
                    onChange={e => setEditandoLugar({ ...editandoLugar, tiene_banos_letrinas: e.target.checked })}
                    className="rounded text-[#cb3327]"
                  />
                  <span>Tiene baños o letrinas habilitadas</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[0.9em] text-pclr4 dark:text-pdclr4">
                  <input
                    type="checkbox"
                    checked={editandoLugar.tiene_luz_electrica}
                    onChange={e => setEditandoLugar({ ...editandoLugar, tiene_luz_electrica: e.target.checked })}
                    className="rounded text-[#cb3327]"
                  />
                  <span>Tiene electricidad o generador</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-pclr13 dark:border-pdclr13">
                <button
                  type="button"
                  onClick={() => setEditandoLugar(null)}
                  className="px-4 py-2 border border-pclr13 dark:border-pdclr13 rounded-lg text-pclr4 dark:text-pdclr4 text-[0.9em]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#cb3327] hover:bg-[#b02920] text-white font-medium rounded-lg text-[0.9em] shadow-sm transition"
                >
                  Guardar Terreno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

