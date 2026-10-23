'use client'

import React, { useState } from 'react'
import type {
  CampamentoPreparacion,
  OtroCostoCampamentoItem
} from '@/types/campamento-preparacion'
import type { CalculoPresupuestoGlobalResultado } from '@/utils/campamento-presupuesto-global'

interface Props {
  campamento: CampamentoPreparacion
  resultado: CalculoPresupuestoGlobalResultado
  onUpdateCampamento: (cambios: Partial<CampamentoPreparacion>) => void
}

export const CampamentoPresupuestoGlobalTab: React.FC<Props> = ({
  campamento,
  resultado,
  onUpdateCampamento
}) => {
  const [nuevoGasto, setNuevoGasto] = useState<Partial<OtroCostoCampamentoItem>>({
    descripcion: '',
    categoria: 'materiales',
    monto_clp: 50000
  })

  const agregarOtroGasto = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoGasto.descripcion?.trim() || !nuevoGasto.monto_clp) return

    const item: OtroCostoCampamentoItem = {
      id: `otr-${Date.now()}`,
      descripcion: nuevoGasto.descripcion.trim(),
      categoria: (nuevoGasto.categoria as any) || 'materiales',
      monto_clp: nuevoGasto.monto_clp
    }

    const nuevosOtros = [...(campamento.otros_costos || []), item]
    onUpdateCampamento({ otros_costos: nuevosOtros })
    setNuevoGasto({ descripcion: '', categoria: 'materiales', monto_clp: 50000 })
  }

  const eliminarOtroGasto = (id: string) => {
    const nuevosOtros = (campamento.otros_costos || []).filter(o => o.id !== id)
    onUpdateCampamento({ otros_costos: nuevosOtros })
  }

  return (
    <div className="space-y-6 text-[1em]">
      {/* KPIs Destacados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 text-center border border-zinc-200 dark:border-zinc-800 rounded-2xl p-2 shadow-sm space-y-1">
          <span className="text-[0.8em] uppercase font-semibold text-zinc-500 tracking-wider">
            Presupuesto Gran Total
          </span>
          <p className="text-[1.8em] font-black text-[#cb3327] tracking-tight">
            ${resultado.granTotal.toLocaleString('es-CL')}
          </p>
          <span className="text-[0.8em] text-zinc-400 block">
            Alimentación + Bus + Terreno + Gastos
          </span>
        </div>

        <div className="bg-white dark:bg-zinc-900 text-center border border-zinc-200 dark:border-zinc-800 rounded-2xl p-2 shadow-sm space-y-1">
          <span className="text-[0.8em] uppercase font-semibold text-zinc-500 tracking-wider">
            Cuota por Participante
          </span>
          <p className="text-[1.8em] font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            ${resultado.cuotaPorPersona.toLocaleString('es-CL')}
          </p>
          <span className="text-[0.8em] text-zinc-400 block">
            Base: {resultado.totalPagantes} pagantes de {resultado.totalAsistentes} totales
          </span>
        </div>

        <div className="bg-white dark:bg-zinc-900 text-center border border-zinc-200 dark:border-zinc-800 rounded-2xl p-2 shadow-sm space-y-1">
          <span className="text-[0.8em] uppercase font-semibold text-zinc-500 tracking-wider">
            Cuota si Todos Pagaran
          </span>
          <p className="text-[1.8em] font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
            ${resultado.cuotaSiTodosPagaran.toLocaleString('es-CL')}
          </p>
          <span className="text-[0.8em] text-zinc-400 block">
            Sin exenciones ({resultado.totalAsistentes} personas)
          </span>
        </div>

        <div className="bg-white dark:bg-zinc-900 text-center border border-zinc-200 dark:border-zinc-800 rounded-2xl p-2 shadow-sm space-y-1">
          <span className="text-[0.8em] uppercase font-semibold text-zinc-500 tracking-wider">
            Aporte Solidario
          </span>
          <p className="text-[1.8em] font-black text-purple-600 dark:text-purple-400 tracking-tight">
            +${resultado.subsidioVoluntariosPorPersona.toLocaleString('es-CL')}
          </p>
          <span className="text-[0.8em] text-zinc-400 block">
            Por beneficiario para cubrir dirigentes, Guiadoras y apoderados
          </span>
        </div>
      </div>

      {/* Panel de Configuración de Cuotas y Voluntariado */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div>
            <h3 className="text-[1.25em] font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span>👥</span> Asistentes y Exención para Voluntarios
            </h3>
            <p className="text-[0.8em] text-zinc-500">
              Configura la cantidad de asistentes por estamento y define si la jefatura y apoderados pagan o son exentos.
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium rounded-xl text-[0.9em] flex items-center gap-2 transition"
          >
            <span>🖨️</span> Imprimir Balance
          </button>
        </div>

        {/* Responsable de Campamento */}
        {campamento.responsable_nombre && (
          <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👤</span>
              <div>
                <span className="text-[0.8em] uppercase font-bold text-amber-800 dark:text-amber-400 block">
                  Responsable a Cargo del Campamento
                </span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 text-[1.05em]">
                  {campamento.responsable_nombre}
                  {campamento.responsable_rol && (
                    <span className="ml-2 text-[0.8em] px-2 py-0.5 rounded-full font-semibold bg-white dark:bg-zinc-800 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                      Rol: {campamento.responsable_rol}
                    </span>
                  )}
                </span>
              </div>
            </div>
            <span className="text-[0.8em] text-zinc-500 italic hidden sm:inline">
              Supervisa tiempos, seguridad y ejecución general
            </span>
          </div>
        )}

        {/* Conteo de asistentes */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-[0.9em] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Lobatos / Scouts / Guías (NNJ)
            </label>
            <input
              type="number"
              min={1}
              value={campamento.asistentes_nnj}
              onChange={e => onUpdateCampamento({ asistentes_nnj: Math.max(0, Number(e.target.value) || 0) })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-[1.2em] font-bold"
            />
          </div>

          <div>
            <label className="block text-[0.9em] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Guiadoras y Dirigentes
            </label>
            <input
              type="number"
              min={0}
              value={campamento.asistentes_jefatura}
              onChange={e => onUpdateCampamento({ asistentes_jefatura: Math.max(0, Number(e.target.value) || 0) })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-[1.2em] font-bold"
            />
          </div>

          <div>
            <label className="block text-[0.9em] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Apoderados de Apoyo / Cocina
            </label>
            <input
              type="number"
              min={0}
              value={campamento.asistentes_apoderados}
              onChange={e => onUpdateCampamento({ asistentes_apoderados: Math.max(0, Number(e.target.value) || 0) })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-[1.2em] font-bold"
            />
          </div>

          <div>
            <label className="block text-[0.9em] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Margen de Imprevistos (%)
            </label>
            <input
              type="number"
              min={0}
              max={25}
              value={campamento.margen_imprevistos_pct}
              onChange={e => onUpdateCampamento({ margen_imprevistos_pct: Math.max(0, Number(e.target.value) || 0) })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-[1.2em] font-bold"
            />
          </div>
        </div>

        {/* Toggles de exención */}
        <div className="bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-xl flex flex-col sm:flex-row gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={campamento.eximir_jefatura}
              onChange={e => onUpdateCampamento({ eximir_jefatura: e.target.checked })}
              className="w-5 h-5 rounded border-zinc-400 text-[#cb3327] focus:ring-[#cb3327]"
            />
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                Eximir a Dirigentes y Guiadoras del pago
              </span>
              <span className="text-[0.8em] text-zinc-500">
                La cuota de jefatura voluntaria se prorratea solidariamente entre los beneficiarios.
              </span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={campamento.eximir_apoderados}
              onChange={e => onUpdateCampamento({ eximir_apoderados: e.target.checked })}
              className="w-5 h-5 rounded border-zinc-400 text-[#cb3327] focus:ring-[#cb3327]"
            />
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                Eximir a Apoderados de Apoyo (Cocina)
              </span>
              <span className="text-[0.8em] text-zinc-500">
                Los apoderados que apoyan en intendencia y cocina asisten con costo $0.
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Desglose de Gastos y Porcentajes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="font-bold text-[1.2em] text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span>📊</span> Distribución del Presupuesto
          </h4>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[0.9em] mb-1">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  🥪 Alimentación y Menú
                </span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  ${resultado.costoAlimentacion.toLocaleString('es-CL')} ({resultado.porcentajeAlimentacion}%)
                </span>
              </div>
              <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500" style={{ width: `${resultado.porcentajeAlimentacion}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[0.9em] mb-1">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  🚌 Transporte / Buses
                  {resultado.busAdjudicado && (
                    <span className="text-[0.8em] text-zinc-400 font-normal ml-1">
                      ({resultado.busAdjudicado.empresa_nombre})
                    </span>
                  )}
                </span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  ${resultado.costoTransporte.toLocaleString('es-CL')} ({resultado.porcentajeTransporte}%)
                </span>
              </div>
              <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: `${resultado.porcentajeTransporte}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[0.9em] mb-1">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  🏕️ Terreno y Estadía
                  {resultado.lugarAdjudicado && (
                    <span className="text-[0.8em] text-zinc-400 font-normal ml-1">
                      ({resultado.lugarAdjudicado.nombre_lugar})
                    </span>
                  )}
                </span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  ${resultado.costoEstadia.toLocaleString('es-CL')} ({resultado.porcentajeEstadia}%)
                </span>
              </div>
              <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600" style={{ width: `${resultado.porcentajeEstadia}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[0.9em] mb-1">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  🛠️ Otros Gastos e Imprevistos ({campamento.margen_imprevistos_pct}%)
                </span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  ${(resultado.costoOtros + resultado.montoImprevistos).toLocaleString('es-CL')} ({resultado.porcentajeOtros}%)
                </span>
              </div>
              <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600" style={{ width: `${resultado.porcentajeOtros}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Otros Gastos Misceláneos */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="font-bold text-[1.2em] text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span>🛠️</span> Otros Gastos y Materiales de Campamento
            </h4>

            {campamento.otros_costos && campamento.otros_costos.length > 0 ? (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-48 overflow-y-auto">
                {campamento.otros_costos.map(o => (
                  <div key={o.id} className="py-2 flex items-center justify-between text-[0.9em]">
                    <div>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">{o.descripcion}</span>
                      <span className="text-[0.8em] text-zinc-400 block uppercase">{o.categoria}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        ${o.monto_clp.toLocaleString('es-CL')}
                      </span>
                      <button
                        onClick={() => eliminarOtroGasto(o.id)}
                        className="text-red-500 hover:text-red-700 text-[0.9em]"
                        title="Eliminar gasto"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[0.8em] text-zinc-400 italic">No hay otros gastos registrados aún.</p>
            )}
          </div>

          {/* Formulario rápido para agregar otro gasto */}
          <form onSubmit={agregarOtroGasto} className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
            <div className="grid grid-cols-12 gap-2">
              <input
                type="text"
                required
                placeholder="Gasto (ej: Leña, Botiquín, Gas)"
                value={nuevoGasto.descripcion || ''}
                onChange={e => setNuevoGasto({ ...nuevoGasto, descripcion: e.target.value })}
                className="col-span-6 px-2.5 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-[0.9em]"
              />
              <input
                type="number"
                min={1}
                required
                placeholder="Monto CLP"
                value={nuevoGasto.monto_clp || ''}
                onChange={e => setNuevoGasto({ ...nuevoGasto, monto_clp: Number(e.target.value) || 0 })}
                className="col-span-4 px-2.5 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-[0.9em]"
              />
              <button
                type="submit"
                className="col-span-2 bg-[#cb3327] hover:bg-[#b02920] text-white rounded-lg text-[0.8em] font-bold"
              >
                +
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

