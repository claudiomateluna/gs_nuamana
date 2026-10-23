'use client'

import React, { useState } from 'react'
import type { CampamentoMenu, CampamentoReceta } from '@/types/campamento-menu'
import type { CalculoMenuResultado } from '@/utils/campamento-menu-calculator'

interface Props {
  menu: CampamentoMenu
  recetas: CampamentoReceta[]
  calculoResultado: CalculoMenuResultado
  onUpdateMenuConfig: (cambios: Partial<CampamentoMenu>) => void
}

export const CampamentoPresupuestoResumen: React.FC<Props> = ({
  menu,
  recetas,
  calculoResultado,
  onUpdateMenuConfig
}) => {
  const [modoImpresion, setModoImpresion] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6 text-[1em]">
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-pclr1 dark:bg-pdclr1 border border-pclr13 dark:border-pdclr13 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[0.8em] uppercase font-semibold text-pclr7 dark:text-pdclr7 tracking-wider">
            Presupuesto Total Estimado
          </span>
          <p className="text-[1.8em] font-black text-[#cb3327] tracking-tight">
            ${calculoResultado.costoTotal.toLocaleString('es-CL')}
          </p>
          <span className="text-[0.8em] text-pclr7 dark:text-pdclr7 block">
            Incluye margen del {menu.margen_seguridad_pct}%
          </span>
        </div>

        <div className="bg-pclr1 dark:bg-pdclr1 border border-pclr13 dark:border-pdclr13 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[0.8em] uppercase font-semibold text-pclr7 dark:text-pdclr7 tracking-wider">
            Costo por Persona (Cuota)
          </span>
          <p className="text-[1.8em] font-black text-pclr4 dark:text-pdclr4 tracking-tight">
            ${calculoResultado.costoPorPersona.toLocaleString('es-CL')}
          </p>
          <span className="text-[0.8em] text-pclr7 dark:text-pdclr7 block">
            Base: {menu.numero_personas} comensales ({menu.dias_totales} días)
          </span>
        </div>

        <div className="bg-pclr1 dark:bg-pdclr1 border border-pclr13 dark:border-pdclr13 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[0.8em] uppercase font-semibold text-pclr7 dark:text-pdclr7 tracking-wider">
            Gasto Promedio por Día
          </span>
          <p className="text-[1.8em] font-black text-pclr4 dark:text-pdclr4 tracking-tight">
            ${calculoResultado.costoPorDia.toLocaleString('es-CL')}
          </p>
          <span className="text-[0.8em] text-pclr7 dark:text-pdclr7 block">
            Promedio 5 comidas diarias
          </span>
        </div>

        <div className="bg-pclr1 dark:bg-pdclr1 border border-pclr13 dark:border-pdclr13 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[0.8em] uppercase font-semibold text-pclr7 dark:text-pdclr7 tracking-wider">
            Panes Frescos Totales
          </span>
          <p className="text-[1.8em] font-black text-amber-600 dark:text-amber-400 tracking-tight">
            {calculoResultado.totalPanesCampamento}{' '}
            <span className="text-[0.8em] font-medium text-pclr7 dark:text-pdclr7">panes</span>
          </p>
          <span className="text-[0.8em] text-pclr7 dark:text-pdclr7 block">
            ${calculoResultado.costoPanTotal.toLocaleString('es-CL')} (Panadería local)
          </span>
        </div>
      </div>

      {/* Ajustes de Parámetros de Campamento */}
      <div className="bg-pclr1 dark:bg-pdclr1 border border-pclr13 dark:border-pdclr13 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-pclr13 dark:border-pdclr13 pb-3">
          <div>
            <h3 className="text-[1.15em] font-semibold text-pclr4 dark:text-pdclr4">
              ⚙️ Parámetros de Escalamiento y Logística
            </h3>
            <p className="text-[0.8em] text-pclr7 dark:text-pdclr7">
              Ajusta comensales, días o margen; las cantidades y empaques se recalcularán automáticamente.
            </p>
          </div>
          <button
            onClick={() => setModoImpresion(!modoImpresion)}
            className="px-4 py-2 border border-[#cb3327] text-[#cb3327] hover:bg-[#cb3327]/10 font-medium rounded-lg text-[0.85em] flex items-center gap-2 transition"
          >
            <span>{modoImpresion ? '🔙 Volver al Panel' : '🖨️ Ficha Imprimible de Cocina'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-[0.85em] font-medium text-pclr4 dark:text-pdclr4 mb-1">
              Comensales (Asistentes)
            </label>
            <input
              type="number"
              min={1}
              max={250}
              value={menu.numero_personas}
              onChange={e => onUpdateMenuConfig({ numero_personas: Math.max(1, Number(e.target.value) || 1) })}
              className="w-full px-3 py-2 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[1em] font-semibold"
            />
          </div>

          <div>
            <label className="block text-[0.85em] font-medium text-pclr4 dark:text-pdclr4 mb-1">
              Días de Campamento
            </label>
            <input
              type="number"
              min={1}
              max={15}
              value={menu.dias_totales}
              onChange={e => onUpdateMenuConfig({ dias_totales: Math.max(1, Number(e.target.value) || 1) })}
              className="w-full px-3 py-2 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[1em] font-semibold"
            />
          </div>

          <div>
            <label className="block text-[0.85em] font-medium text-pclr4 dark:text-pdclr4 mb-1">
              Margen Imprevistos (%)
            </label>
            <input
              type="number"
              min={0}
              max={30}
              value={menu.margen_seguridad_pct}
              onChange={e => onUpdateMenuConfig({ margen_seguridad_pct: Math.max(0, Number(e.target.value) || 0) })}
              className="w-full px-3 py-2 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[1em] font-semibold"
            />
          </div>

          <div>
            <label className="block text-[0.85em] font-medium text-pclr4 dark:text-pdclr4 mb-1">
              Precio Pan Unitario ($)
            </label>
            <input
              type="number"
              min={50}
              max={500}
              step={10}
              value={menu.precio_pan_unitario}
              onChange={e => onUpdateMenuConfig({ precio_pan_unitario: Math.max(1, Number(e.target.value) || 1) })}
              className="w-full px-3 py-2 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[1em] font-semibold"
            />
          </div>

          <div>
            <label className="block text-[0.85em] font-medium text-pclr4 dark:text-pdclr4 mb-1">
              Panes Persona / Día
            </label>
            <input
              type="number"
              min={1}
              max={5}
              value={menu.consumo_pan_diario}
              onChange={e => onUpdateMenuConfig({ consumo_pan_diario: Math.max(1, Number(e.target.value) || 1) })}
              className="w-full px-3 py-2 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[1em] font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Vista Normal: Desglose por Proveedor y Categoría */}
      {!modoImpresion ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Distribución por Proveedor */}
          <div className="bg-pclr1 dark:bg-pdclr1 border border-pclr13 dark:border-pdclr13 rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="font-semibold text-pclr4 dark:text-pdclr4 flex items-center gap-2">
              <span>🏪</span> Distribución del Gasto por Proveedor / Tienda
            </h4>
            <div className="space-y-3">
              {calculoResultado.resumenPorProveedor.map(prov => (
                <div key={prov.proveedor} className="space-y-1">
                  <div className="flex justify-between text-[0.85em]">
                    <span className="font-medium text-pclr4 dark:text-pdclr4">
                      {prov.proveedor}{' '}
                      <span className="text-pclr7 dark:text-pdclr7 font-normal">
                        ({prov.items_cantidad} ítems)
                      </span>
                    </span>
                    <span className="font-bold text-pclr4 dark:text-pdclr4">
                      ${prov.costo_subtotal.toLocaleString('es-CL')}{' '}
                      <span className="text-[0.8em] font-normal text-pclr7 dark:text-pdclr7">
                        ({prov.porcentaje_del_total}%)
                      </span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-pclr3 dark:bg-pdclr3 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#cb3327]"
                      style={{ width: `${Math.min(100, prov.porcentaje_del_total)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Distribución por Categoría */}
          <div className="bg-pclr1 dark:bg-pdclr1 border border-pclr13 dark:border-pdclr13 rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="font-semibold text-pclr4 dark:text-pdclr4 flex items-center gap-2">
              <span>📦</span> Distribución por Categoría de Alimento
            </h4>
            <div className="space-y-3">
              {calculoResultado.resumenPorCategoria.map(cat => (
                <div key={cat.categoria} className="space-y-1">
                  <div className="flex justify-between text-[0.85em]">
                    <span className="font-medium text-pclr4 dark:text-pdclr4">
                      {cat.categoria}{' '}
                      <span className="text-pclr7 dark:text-pdclr7 font-normal">
                        ({cat.items_cantidad} ítems)
                      </span>
                    </span>
                    <span className="font-bold text-pclr4 dark:text-pdclr4">
                      ${cat.costo_subtotal.toLocaleString('es-CL')}{' '}
                      <span className="text-[0.8em] font-normal text-pclr7 dark:text-pdclr7">
                        ({cat.porcentaje_del_total}%)
                      </span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-pclr3 dark:bg-pdclr3 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-600"
                      style={{ width: `${Math.min(100, cat.porcentaje_del_total)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Vista de Ficha Imprimible para la Carpa de Cocina */
        <div className="bg-pclr1 dark:bg-pdclr1 border-2 border-pclr13 dark:border-pdclr13 p-6 rounded-2xl shadow-lg space-y-6 print:border-none print:shadow-none print:p-0">
          <div className="flex items-center justify-between border-b-2 border-pclr13 dark:border-pdclr13 pb-4">
            <div>
              <span className="text-[0.8em] font-bold uppercase tracking-widest text-[#cb3327]">
                GRUPO GUÍA Y SCOUT NUA MANA • INTENDENCIA Y COCINA
              </span>
              <h2 className="text-[1.5em] font-black text-pclr4 dark:text-pdclr4">
                FICHA OFICIAL DE MENÚS Y TURNOS DE COCINA
              </h2>
              <p className="text-[0.85em] text-pclr7 dark:text-pdclr7 font-medium">
                {menu.nombre} • {menu.numero_personas} comensales • {menu.dias_totales} días
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-pclr10 hover:brightness-110 dark:bg-pdclr10 text-pclr12 dark:text-pdclr12 font-bold rounded-xl text-[0.9em] flex items-center gap-2 shadow print:hidden"
            >
              <span>🖨️</span> Imprimir Ficha de Cocina
            </button>
          </div>

          <div className="space-y-4">
            {Array.from({ length: menu.dias_totales }, (_, i) => i + 1).map(d => {
              const bloquesDia = menu.bloques.filter(b => b.numero_dia === d)
              const diaEtiqueta = bloquesDia[0]?.dia_etiqueta || `Día ${d}`

              return (
                <div key={d} className="border border-pclr13 dark:border-pdclr13 rounded-lg p-3 space-y-2 bg-pclr2 dark:bg-pdclr2 print:bg-transparent">
                  <div className="flex items-center justify-between border-b border-pclr13 dark:border-pdclr13 pb-1">
                    <h3 className="font-bold text-[1em] text-pclr4 dark:text-pdclr4">
                      {diaEtiqueta}
                    </h3>
                    <span className="text-[0.8em] text-pclr7 dark:text-pdclr7 font-mono">
                      Pan del día: {menu.numero_personas * menu.consumo_pan_diario} unidades
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-[0.8em]">
                    {bloquesDia.map(b => (
                      <div key={b.id} className="border border-pclr13 dark:border-pdclr13 rounded p-2 bg-pclr1 dark:bg-pdclr1">
                        <div className="flex items-center justify-between font-bold text-pclr4 dark:text-pdclr4 border-b border-pclr13 dark:border-pdclr13 pb-0.5">
                          <span className="capitalize">{b.tiempo_comida.replace('_', ' ')}</span>
                        </div>
                        <p className="font-semibold text-pclr4 dark:text-pdclr4 mt-1 line-clamp-2">
                          {b.platos_texto || 'Menú tradicional'}
                        </p>
                        <p className="text-[0.8em] text-[#cb3327] font-bold mt-1">
                          Turno: {b.responsables?.join(' + ') || 'Sin asignar'}
                        </p>
                        {b.alternativa_dietetica && (
                          <p className="text-[0.8em] text-pclr7 dark:text-pdclr7 mt-0.5">
                            Alt: {b.alternativa_dietetica}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="text-[0.8em] text-pclr7 dark:text-pdclr7 border-t border-pclr13 dark:border-pdclr13 pt-3 flex justify-between">
            <span>Regla de Oro: Lavado riguroso de manos y mesas de cocina antes y después de cada servicio.</span>
            <span>Siempre Listo</span>
          </div>
        </div>
      )}
    </div>
  )
}
