'use client'

import React, { useState, useEffect } from 'react'
import type { ItemCompraConsolidado } from '@/types/campamento-menu'

interface Props {
  isOpen: boolean
  onClose: () => void
  item: ItemCompraConsolidado | null
  proveedoresDisponibles: string[]
  onSave: (data: {
    ingredienteNombre: string
    url: string
    modalidad: 'online' | 'presencial'
    precio: number
    proveedor: string
  }) => void
}

export const CampamentoCompraDetalleModal: React.FC<Props> = ({
  isOpen,
  onClose,
  item,
  proveedoresDisponibles,
  onSave
}) => {
  const [modalidad, setModalidad] = useState<'online' | 'presencial'>('presencial')
  const [url, setUrl] = useState('')
  const [precio, setPrecio] = useState(0)
  const [proveedor, setProveedor] = useState('')

  useEffect(() => {
    if (item) {
      setModalidad(item.modalidad_compra || (item.url_compra ? 'online' : 'presencial'))
      setUrl(item.url_compra || '')
      setPrecio(item.precio_unitario_envase || 0)
      setProveedor(item.proveedor || '')
    }
  }, [item])

  if (!isOpen || !item) return null

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ingredienteNombre: item.ingrediente_nombre,
      url: url.trim(),
      modalidad,
      precio,
      proveedor
    })
    onClose()
  }

  const handleModalidadChange = (nuevaMod: 'online' | 'presencial') => {
    setModalidad(nuevaMod)
    if (nuevaMod === 'online' && !url) {
      // Si el proveedor seleccionado tiene una URL o dominio típico, se puede sugerir o dejar listo
    }
  }

  const esUrlValida = (texto: string) => {
    try {
      const u = new URL(texto.startsWith('http') ? texto : `https://${texto}`)
      return u.protocol === 'http:' || u.protocol === 'https:'
    } catch {
      return false
    }
  }

  const urlParaProbar = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto text-[1em]">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40">
          <div>
            <h3 className="text-[1.2em] font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span>🛒</span> Detalle de Compra y Proveedor
            </h3>
            <p className="text-[0.85em] text-zinc-500 line-clamp-1">
              {item.ingrediente_nombre} • {item.categoria}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-[1.2em] p-1"
          >
            ✕
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleGuardar} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Selector de Modalidad: Presencial vs Online */}
          <div className="space-y-1.5">
            <label className="text-[0.9em] font-semibold text-zinc-700 dark:text-zinc-300 block">
              Modalidad de Adquisición
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleModalidadChange('presencial')}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
                  modalidad === 'presencial'
                    ? 'border-[#cb3327] bg-rose-50/50 dark:bg-rose-950/20 text-[#cb3327] dark:text-rose-300 shadow-2xs'
                    : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50'
                }`}
              >
                <span className="text-[1.4em]">🏪</span>
                <div>
                  <span className="font-semibold block text-[0.9em]">Compra Presencial</span>
                  <span className="text-[0.8em] opacity-80 block">Local físico o feria</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleModalidadChange('online')}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
                  modalidad === 'online'
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 shadow-2xs'
                    : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50'
                }`}
              >
                <span className="text-[1.4em]">🌐</span>
                <div>
                  <span className="font-semibold block text-[0.9em]">Compra Online</span>
                  <span className="text-[0.8em] opacity-80 block">E-commerce / Despacho</span>
                </div>
              </button>
            </div>
          </div>

          {/* Campo URL del Producto / Cotización */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[0.9em] font-semibold text-zinc-700 dark:text-zinc-300">
                URL del Producto o Precio de Referencia
              </label>
              {url && esUrlValida(url) && (
                <a
                  href={urlParaProbar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-[0.8em] font-medium flex items-center gap-1 hover:underline"
                >
                  <span>Probar enlace</span>
                  <span>↗</span>
                </a>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={e => {
                  setUrl(e.target.value)
                  if (e.target.value.trim() && modalidad === 'presencial') {
                    setModalidad('online')
                  }
                }}
                placeholder="https://www.lider.cl/... o https://acuenta.cl/..."
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-[0.9em] focus:border-[#cb3327] focus:ring-1 focus:ring-[#cb3327] outline-hidden"
              />
              {url && (
                <button
                  type="button"
                  onClick={() => setUrl('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-[0.85em]"
                  title="Limpiar URL"
                >
                  ✕
                </button>
              )}
            </div>
            <p className="text-[0.8em] text-zinc-500">
              Guarda el enlace directo a la tienda online donde se comprará este producto o como respaldo documental de la cotización.
            </p>
          </div>

          {/* Proveedor y Precio en 2 columnas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[0.9em] font-semibold text-zinc-700 dark:text-zinc-300 block">
                Proveedor / Tienda Asignada
              </label>
              <select
                value={proveedor}
                onChange={e => setProveedor(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-[0.9em] focus:border-[#cb3327] outline-hidden"
              >
                {proveedoresDisponibles.map(p => (
                  <option key={p} value={p}>
                    🏪 {p}
                  </option>
                ))}
                {!proveedoresDisponibles.includes(proveedor) && proveedor && (
                  <option value={proveedor}>
                    🏪 {proveedor}
                  </option>
                )}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[0.9em] font-semibold text-zinc-700 dark:text-zinc-300 block">
                Precio Unitario por Envase ($ CLP)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[0.9em] text-zinc-400 font-bold">$</span>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={precio}
                  onChange={e => setPrecio(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full pl-7 pr-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-[0.9em] font-bold focus:border-[#cb3327] outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Resumen del cálculo para este insumo */}
          <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3.5 space-y-2">
            <h4 className="text-[0.85em] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
              Cálculo de Demanda y Costo Total
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[0.85em]">
              <div>
                <span className="text-zinc-500 block">Requerimiento</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {item.cantidad_requerida_neta} {item.unidad_medida}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block">Formato Envase</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                  {item.formato_envase}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block">A Comprar</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {item.envases_a_comprar} {item.envases_a_comprar === 1 ? 'envase' : 'envases'}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block">Total Estimado</span>
                <span className="font-bold text-[#cb3327]">
                  ${(item.envases_a_comprar * precio).toLocaleString('es-CL')}
                </span>
              </div>
            </div>

            {/* Comidas donde se usará */}
            {item.detalles_uso && item.detalles_uso.length > 0 && (
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700/60 text-[0.8em] text-zinc-500 space-y-0.5">
                <span className="font-medium text-zinc-600 dark:text-zinc-400 block">
                  Uso en el cronograma:
                </span>
                {item.detalles_uso.map((u, i) => (
                  <p key={i}>• {u}</p>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-[0.9em]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#cb3327] hover:bg-[#b02920] text-white font-medium rounded-lg shadow-sm transition text-[0.9em]"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
