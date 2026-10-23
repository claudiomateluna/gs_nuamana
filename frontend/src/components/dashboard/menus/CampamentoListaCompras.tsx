'use client'

import React, { useState } from 'react'
import type { ItemCompraConsolidado, CategoriaInsumo } from '@/types/campamento-menu'
import type { CalculoMenuResultado } from '@/utils/campamento-menu-calculator'
import { exportarListaComprasCSV } from '@/utils/campamento-menu-calculator'
import { CampamentoCompraDetalleModal } from './CampamentoCompraDetalleModal'

interface Props {
  calculoResultado: CalculoMenuResultado
  nombreMenu: string
  proveedoresDisponibles?: string[]
  proveedoresUrls?: Record<string, string>
  preciosPersonalizados?: Record<string, number>
  urlsPersonalizadas?: Record<string, string>
  modalidadesCompra?: Record<string, 'online' | 'presencial'>
  onUpdatePrecioItem?: (ingredienteNombre: string, nuevoPrecio: number) => void
  onUpdateProveedorItem?: (ingredienteNombre: string, nuevoProveedor: string) => void
  onUpdateUrlItem?: (ingredienteNombre: string, nuevaUrl: string) => void
  onUpdateModalidadItem?: (ingredienteNombre: string, modalidad: 'online' | 'presencial') => void
  onOpenProveedoresModal?: () => void
  onRestaurarPrecios?: () => void
  onToggleComprado?: (index: number) => void
}

export const CampamentoListaCompras: React.FC<Props> = ({
  calculoResultado,
  nombreMenu,
  proveedoresDisponibles = [],
  proveedoresUrls = {},
  preciosPersonalizados,
  urlsPersonalizadas,
  modalidadesCompra,
  onUpdatePrecioItem,
  onUpdateProveedorItem,
  onUpdateUrlItem,
  onUpdateModalidadItem,
  onOpenProveedoresModal,
  onRestaurarPrecios
}) => {
  const [agrupacion, setAgrupacion] = useState<'proveedor' | 'categoria'>('proveedor')
  const [busqueda, setBusqueda] = useState('')
  const [comprados, setComprados] = useState<Record<string, boolean>>({})
  const [itemModalDetalle, setItemModalDetalle] = useState<ItemCompraConsolidado | null>(null)

  const tienePreciosPersonalizados = Object.keys(preciosPersonalizados || {}).length > 0

  const toggleCheck = (key: string) => {
    setComprados(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const items = calculoResultado.itemsConsolidados.filter(it => {
    if (!busqueda) return true
    const term = busqueda.toLowerCase()
    return (
      it.ingrediente_nombre.toLowerCase().includes(term) ||
      it.proveedor.toLowerCase().includes(term) ||
      it.categoria.toLowerCase().includes(term)
    )
  })

  // Progreso de compras
  const totalItems = calculoResultado.itemsConsolidados.length
  const itemsCompradosCount = calculoResultado.itemsConsolidados.filter(
    it => comprados[`${it.proveedor}-${it.ingrediente_nombre}`]
  ).length
  const pctComprado = totalItems > 0 ? Math.round((itemsCompradosCount / totalItems) * 100) : 0

  const handleDescargarCSV = () => {
    const csvContent = exportarListaComprasCSV(calculoResultado, nombreMenu)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Lista_Compras_${nombreMenu.replace(/\s+/g, '_')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Agrupaciones
  const grupos = agrupacion === 'proveedor'
    ? Array.from(new Set(items.map(it => it.proveedor)))
    : Array.from(new Set(items.map(it => it.categoria)))

  return (
    <div className="space-y-6 text-[1em]">
      {/* Barra superior de controles */}
      <div className="bg-pclr1 dark:bg-pdclr1 p-5 rounded-2xl border border-pclr13 dark:border-pdclr13 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h3 className="text-[1.2em] font-semibold text-pclr4 dark:text-pdclr4 flex items-center gap-2">
              <span>🛒</span> Lista de Compras y Abastecimiento
            </h3>
            <p className="text-[0.85em] text-pclr7 dark:text-pdclr7">
              Desglose consolidado por empaques comerciales con precios de referencia chilenos. Podés ajustar directamente los precios cotizados de cada insumo.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {onOpenProveedoresModal && (
              <button
                type="button"
                onClick={onOpenProveedoresModal}
                className="px-3.5 py-2 border border-pclr13 dark:border-pdclr13 hover:bg-pclr3 dark:hover:bg-pdclr3 text-pclr4 dark:text-pdclr4 font-medium rounded-lg text-[0.85em] flex items-center gap-1.5 transition shadow-2xs"
                title="Administrar proveedores, locales y ferias"
              >
                <span>🏪</span> Proveedores
              </button>
            )}

            {tienePreciosPersonalizados && onRestaurarPrecios && (
              <button
                type="button"
                onClick={onRestaurarPrecios}
                className="px-3.5 py-2 border border-pclr13 dark:border-pdclr13 hover:bg-pclr3 dark:hover:bg-pdclr3 text-pclr4 dark:text-pdclr4 font-medium rounded-lg text-[0.85em] flex items-center gap-1.5 transition shadow-2xs"
                title="Restaurar todos los precios a los valores estándar de referencia"
              >
                <span>🔄</span> Restaurar Precios Estándar
              </button>
            )}

            <button
              onClick={handleDescargarCSV}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-[0.85em] flex items-center gap-2 transition shadow-sm"
              title="Descargar archivo CSV compatible con Excel"
            >
              <span>📊</span> Exportar a Excel (.csv)
            </button>
          </div>
        </div>

        {/* Barra de progreso de abastecimiento */}
        <div className="space-y-1.5 pt-2 border-t border-pclr13 dark:border-pdclr13">
          <div className="flex justify-between text-[0.8em] font-medium text-pclr7 dark:text-pdclr7">
            <span>Progreso de Compras ({itemsCompradosCount} de {totalItems} ítems listos)</span>
            <span>{pctComprado}%</span>
          </div>
          <div className="w-full h-2.5 bg-pclr3 dark:bg-pdclr3 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${pctComprado}%` }}
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className="text-[0.85em] font-semibold text-pclr7 dark:text-pdclr7">Agrupar por:</span>
            <div className="inline-flex rounded-lg border border-pclr13 dark:border-pdclr13 p-0.5 bg-pclr3 dark:bg-pdclr3">
              <button
                onClick={() => setAgrupacion('proveedor')}
                className={`px-3 py-1 rounded-md text-[0.8em] font-medium transition ${
                  agrupacion === 'proveedor'
                    ? 'bg-pclr1 dark:bg-pdclr1 text-pclr4 dark:text-pdclr4 shadow-xs'
                    : 'text-pclr7 dark:text-pdclr7'
                }`}
              >
                🏪 Tienda / Proveedor
              </button>
              <button
                onClick={() => setAgrupacion('categoria')}
                className={`px-3 py-1 rounded-md text-[0.8em] font-medium transition ${
                  agrupacion === 'categoria'
                    ? 'bg-pclr1 dark:bg-pdclr1 text-pclr4 dark:text-pdclr4 shadow-xs'
                    : 'text-pclr7 dark:text-pdclr7'
                }`}
              >
                📦 Categoría de Alimento
              </button>
            </div>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Filtrar producto o tienda..."
              className="w-full px-3 py-1.5 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[0.85em]"
            />
          </div>
        </div>
      </div>

      {/* Listado de Grupos y Productos */}
      <div className="space-y-6">
        {grupos.map(grupo => {
          const itemsGrupo = items.filter(it => (agrupacion === 'proveedor' ? it.proveedor === grupo : it.categoria === grupo))
          const subtotalGrupo = itemsGrupo.reduce((sum, it) => sum + it.costo_total, 0)

          return (
            <div
              key={grupo}
              className="bg-pclr1 dark:bg-pdclr1 border border-pclr13 dark:border-pdclr13 rounded-2xl overflow-hidden shadow-sm"
            >
              {/* Header de Grupo */}
              <div className="px-5 py-3.5 bg-pclr2 dark:bg-pdclr2 border-b border-pclr13 dark:border-pdclr13 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div>
                    <h4 className="font-bold text-[1.05em] text-pclr4 dark:text-pdclr4 flex items-center gap-2">
                      <span>{agrupacion === 'proveedor' ? `🏪 ${grupo}` : `📦 ${grupo}`}</span>
                      {agrupacion === 'proveedor' && proveedoresUrls[grupo] && (
                        <a
                          href={proveedoresUrls[grupo].startsWith('http') ? proveedoresUrls[grupo] : `https://${proveedoresUrls[grupo]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 rounded text-[0.75em] font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 flex items-center gap-1 transition"
                          title={`Abrir sitio web oficial de ${grupo}`}
                        >
                          <span>🌐 Visitar tienda</span>
                          <span>↗</span>
                        </a>
                      )}
                    </h4>
                    <span className="text-[0.8em] text-pclr7 dark:text-pdclr7">
                      {itemsGrupo.length} {itemsGrupo.length === 1 ? 'producto a comprar' : 'productos a comprar'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[0.8em] text-pclr7 dark:text-pdclr7 block">Subtotal</span>
                  <span className="font-bold text-[1em] text-[#cb3327]">
                    ${subtotalGrupo.toLocaleString('es-CL')}
                  </span>
                </div>
              </div>

              {/* Tabla de Productos */}
              <div className="divide-y divide-pclr13 dark:divide-pdclr13">
                {itemsGrupo.map(it => {
                  const itemKey = `${it.proveedor}-${it.ingrediente_nombre}`
                  const estaComprado = !!comprados[itemKey]

                  return (
                    <div
                      key={itemKey}
                      className={`p-4 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        estaComprado
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 opacity-70'
                          : 'hover:bg-pclr3/40 dark:hover:bg-pdclr3/40'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={estaComprado}
                          onChange={() => toggleCheck(itemKey)}
                          className="mt-1 w-4 h-4 rounded border-pclr13 dark:border-pdclr13 bg-pclr3 dark:bg-pdclr3 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`font-semibold text-pclr4 dark:text-pdclr4 text-[1em] ${
                                estaComprado ? 'line-through text-pclr7 dark:text-pdclr7' : ''
                              }`}
                            >
                              {it.ingrediente_nombre}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-pclr3 dark:bg-pdclr3 text-pclr7 dark:text-pdclr7 text-[0.8em]">
                              {it.categoria}
                            </span>

                            {/* Badge Modalidad: Presencial vs Online */}
                            <button
                              type="button"
                              onClick={() => setItemModalDetalle(it)}
                              className={`px-2 py-0.5 rounded text-[0.78em] font-medium flex items-center gap-1 transition ${
                                it.modalidad_compra === 'online' || it.url_compra
                                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                  : 'bg-pclr3 dark:bg-pdclr3 text-pclr7 dark:text-pdclr7 dark:bg-pdclr3 text-pclr7 dark:text-pdclr7 border border-pclr13 dark:border-pdclr13'
                              }`}
                              title="Click para cambiar modalidad o ver detalles de compra"
                            >
                              <span>{it.modalidad_compra === 'online' || it.url_compra ? '🌐 Online' : '🏪 Presencial'}</span>
                            </button>

                            {/* Enlace directo a la tienda o botón para agregar URL */}
                            {it.url_compra ? (
                              <div className="flex items-center gap-1">
                                <a
                                  href={it.url_compra.startsWith('http') ? it.url_compra : `https://${it.url_compra}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={e => e.stopPropagation()}
                                  className="px-2 py-0.5 rounded text-[0.78em] font-medium bg-sky-50 hover:bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:hover:bg-sky-900/40 dark:text-sky-300 border border-sky-200 dark:border-sky-800 flex items-center gap-1 transition shadow-2xs"
                                  title={`Abrir página de compra: ${it.url_compra}`}
                                >
                                  <span>🔗</span>
                                  <span className="hidden sm:inline">Ver producto</span>
                                  <span>↗</span>
                                </a>
                                <button
                                  type="button"
                                  onClick={() => setItemModalDetalle(it)}
                                  className="text-pclr7 dark:text-pdclr7 hover:text-pclr4 dark:hover:text-pdclr4 dark:hover:text-pdclr4 p-0.5 rounded hover:bg-pclr3 dark:hover:bg-pdclr3 text-[0.8em]"
                                  title="Editar URL o cotización"
                                >
                                  ✏️
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setItemModalDetalle(it)}
                                className="px-2 py-0.5 rounded text-[0.78em] font-medium text-pclr7 dark:text-pdclr7 hover:text-pclr4 dark:text-pdclr4 dark:hover:text-pdclr4 border border-dashed border-pclr13 dark:border-pdclr13 hover:border-pclr13 dark:border-pdclr13 flex items-center gap-1 transition"
                                title="Agregar URL hacia la página del producto donde se comprará"
                              >
                                <span>+</span>
                                <span>URL</span>
                              </button>
                            )}

                            {onUpdateProveedorItem && proveedoresDisponibles.length > 0 ? (
                              <select
                                value={it.proveedor}
                                onChange={e => onUpdateProveedorItem(it.ingrediente_nombre, e.target.value)}
                                className="px-2 py-0.5 rounded border border-pclr13 dark:border-pdclr13 bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 text-[0.8em] font-medium outline-hidden hover:border-[#cb3327] cursor-pointer"
                                title="Cambiar proveedor asignado a este producto"
                              >
                                {proveedoresDisponibles.map(prov => (
                                  <option key={prov} value={prov}>
                                    🏪 {prov}
                                  </option>
                                ))}
                                {!proveedoresDisponibles.includes(it.proveedor) && (
                                  <option value={it.proveedor}>
                                    🏪 {it.proveedor}
                                  </option>
                                )}
                              </select>
                            ) : (
                              agrupacion !== 'proveedor' && (
                                <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 text-[0.8em]">
                                  {it.proveedor}
                                </span>
                              )
                            )}
                          </div>

                          <p className="text-[0.85em] text-pclr7 dark:text-pdclr7">
                            Requerimiento neto:{' '}
                            <strong className="text-pclr4 dark:text-pdclr4">
                              {it.cantidad_requerida_neta} {it.unidad_medida}
                            </strong>{' '}
                            • Formato envase: {it.formato_envase}
                          </p>

                          {/* Detalle de uso por día y comida */}
                          {it.detalles_uso && it.detalles_uso.length > 0 && (
                            <div className="text-[0.8em] text-pclr7 dark:text-pdclr7 pt-0.5 space-y-0.5">
                              {it.detalles_uso.map((u, i) => (
                                <p key={i}>• {u}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Cantidad a comprar y costos manipulables */}
                      <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-pclr13 dark:border-pdclr13 pl-7 sm:pl-0 space-y-2">
                        <div className="sm:text-right">
                          <span className="text-[0.8em] text-pclr7 dark:text-pdclr7 block">Comprar</span>
                          <span className="font-bold text-[1.1em] text-pclr4 dark:text-pdclr4">
                            {it.envases_a_comprar}{' '}
                            <span className="text-[0.85em] font-normal text-pclr7 dark:text-pdclr7">
                              {it.envases_a_comprar === 1 ? 'envase' : 'envases'}
                            </span>
                          </span>
                        </div>

                        <div className="sm:text-right space-y-1">
                          <div className="flex items-center sm:justify-end gap-1.5">
                            <span className="text-[0.8em] text-pclr7 dark:text-pdclr7 whitespace-nowrap">Precio c/u:</span>
                            <div className="relative inline-flex items-center">
                              <span className="absolute left-2 text-[0.85em] text-pclr7 dark:text-pdclr7 font-bold">$</span>
                              <input
                                type="number"
                                min={0}
                                step={50}
                                value={it.precio_unitario_envase}
                                onChange={e => {
                                  const val = Math.max(0, parseInt(e.target.value, 10) || 0)
                                  onUpdatePrecioItem?.(it.ingrediente_nombre, val)
                                }}
                                className="w-24 pl-5 pr-2 py-0.5 text-right font-bold text-[0.85em] border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 focus:border-pclr8 dark:focus:border-pdclr8 focus:ring-1 focus:ring-[#cb3327] outline-hidden shadow-2xs"
                                title="Editar precio del envase cotizado en mercado local"
                              />
                            </div>
                          </div>

                          <div className="flex items-center sm:justify-end gap-1.5">
                            <span className="text-[0.8em] text-pclr7 dark:text-pdclr7">Total:</span>
                            <span className="font-bold text-[1.05em] text-[#cb3327]">
                              ${it.costo_total.toLocaleString('es-CL')}
                            </span>
                          </div>

                          {it.precio_modificado && (
                            <span className="text-[0.75em] text-amber-600 dark:text-amber-400 block font-medium">
                              ✏️ Precio personalizado
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal de Detalle de Compra, Modalidad y URL */}
      <CampamentoCompraDetalleModal
        isOpen={!!itemModalDetalle}
        onClose={() => setItemModalDetalle(null)}
        item={itemModalDetalle}
        proveedoresDisponibles={proveedoresDisponibles}
        onSave={data => {
          onUpdateUrlItem?.(data.ingredienteNombre, data.url)
          onUpdateModalidadItem?.(data.ingredienteNombre, data.modalidad)
          onUpdatePrecioItem?.(data.ingredienteNombre, data.precio)
          onUpdateProveedorItem?.(data.ingredienteNombre, data.proveedor)
        }}
      />
    </div>
  )
}
