'use client'

import React, { useState } from 'react'
import { DEFAULT_PROVEEDORES } from '@/lib/campamento-menu-presets'

interface Props {
  isOpen: boolean
  onClose: () => void
  proveedores: string[]
  proveedoresUrls?: Record<string, string>
  conteoPorProveedor?: Record<string, number>
  onCrearProveedor: (nombre: string, url?: string) => void
  onEditarProveedor: (viejoNombre: string, nuevoNombre: string, url?: string) => void
  onEliminarProveedor: (nombre: string, reasignarA: string) => void
  onRestaurarProveedoresPorDefecto: () => void
}

export const CampamentoProveedoresModal: React.FC<Props> = ({
  isOpen,
  onClose,
  proveedores,
  proveedoresUrls = {},
  conteoPorProveedor = {},
  onCrearProveedor,
  onEditarProveedor,
  onEliminarProveedor,
  onRestaurarProveedoresPorDefecto
}) => {
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [nuevaUrl, setNuevaUrl] = useState('')
  const [proveedorEditando, setProveedorEditando] = useState<string | null>(null)
  const [editNombre, setEditNombre] = useState('')
  const [editUrl, setEditUrl] = useState('')
  const [proveedorAEliminar, setProveedorAEliminar] = useState<string | null>(null)
  const [proveedorReemplazo, setProveedorReemplazo] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!isOpen) return null

  const handleCrear = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    const limpio = nuevoNombre.trim()
    if (!limpio) return

    if (proveedores.some(p => p.toLowerCase() === limpio.toLowerCase())) {
      setErrorMsg('Ya existe un proveedor con ese nombre.')
      return
    }

    onCrearProveedor(limpio, nuevaUrl.trim() || undefined)
    setNuevoNombre('')
    setNuevaUrl('')
  }

  const iniciarEdicion = (p: string) => {
    setProveedorEditando(p)
    setEditNombre(p)
    setEditUrl(proveedoresUrls[p] || '')
    setErrorMsg(null)
  }

  const guardarEdicion = () => {
    if (!proveedorEditando) return
    const limpio = editNombre.trim()
    if (!limpio) {
      setProveedorEditando(null)
      return
    }

    if (limpio !== proveedorEditando && proveedores.some(p => p.toLowerCase() === limpio.toLowerCase())) {
      setErrorMsg('Ya existe otro proveedor con ese nombre.')
      return
    }

    onEditarProveedor(proveedorEditando, limpio, editUrl.trim() || undefined)
    setProveedorEditando(null)
    setEditNombre('')
    setEditUrl('')
  }

  const iniciarEliminacion = (p: string) => {
    setProveedorAEliminar(p)
    // Elegir automáticamente el primer proveedor distinto para sugerir reasignación
    const otro = proveedores.find(item => item !== p) || 'Super Bodega aCuenta'
    setProveedorReemplazo(otro)
    setErrorMsg(null)
  }

  const confirmarEliminacion = () => {
    if (!proveedorAEliminar) return
    if (!proveedorReemplazo || proveedorReemplazo === proveedorAEliminar) {
      setErrorMsg('Selecciona un proveedor válido para reasignar los productos asociados.')
      return
    }

    onEliminarProveedor(proveedorAEliminar, proveedorReemplazo)
    setProveedorAEliminar(null)
    setProveedorReemplazo('')
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-pclr1 dark:bg-pdclr1 border border-pclr13 dark:border-pdclr13 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-pclr13 dark:border-pdclr13 bg-pclr2 dark:bg-pdclr2">
          <div>
            <h3 className="text-[1.25em] font-bold text-pclr4 dark:text-pdclr4 flex items-center gap-2">
              <span>🏪</span> Gestión de Proveedores y Comercios
            </h3>
            <p className="text-[0.85em] text-pclr7 dark:text-pdclr7">
              Administra los locales, supermercados, ferias y mayoristas donde cotizas y compras insumos.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-pclr7 dark:text-pdclr7 hover:text-pclr4 dark:hover:text-pdclr4 dark:hover:text-pdclr4 text-[1.2em] p-1"
          >
            ✕
          </button>
        </div>

        {/* Contenido principal */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[1em]">
          {/* Mensaje de error si aplica */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-xl text-rose-700 dark:text-rose-300 text-[0.85em]">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Formulario Agregar Nuevo Proveedor */}
          <form onSubmit={handleCrear} className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={nuevoNombre}
                onChange={e => setNuevoNombre(e.target.value)}
                placeholder="Nombre del proveedor o local (ej: Mayorista Alvi, Líder, Feria...)"
                className="flex-1 px-3.5 py-2 text-[0.9em] border border-pclr13 dark:border-pdclr13 rounded-xl bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 focus:border-pclr8 dark:focus:border-pdclr8 outline-hidden shadow-2xs"
              />
              <input
                type="text"
                value={nuevaUrl}
                onChange={e => setNuevaUrl(e.target.value)}
                placeholder="URL sitio web (opcional: https://...)"
                className="sm:w-60 px-3.5 py-2 text-[0.85em] border border-pclr13 dark:border-pdclr13 rounded-xl bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 focus:border-pclr8 dark:focus:border-pdclr8 outline-hidden shadow-2xs"
              />
              <button
                type="submit"
                disabled={!nuevoNombre.trim()}
                className="px-4 py-2 bg-[#cb3327] hover:bg-[#b02920] disabled:opacity-50 text-white font-medium rounded-xl text-[0.9em] transition shadow-xs whitespace-nowrap"
              >
                + Agregar
              </button>
            </div>
          </form>

          {/* Listado de Proveedores */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[0.85em] font-bold text-pclr7 dark:text-pdclr7 px-1">
              <span>Proveedor ({proveedores.length})</span>
              <span>Productos Asignados / Acciones</span>
            </div>

            <div className="divide-y divide-pclr13 dark:divide-pdclr13 border border-pclr13 dark:border-pdclr13 rounded-xl overflow-hidden bg-pclr1 dark:bg-pdclr1/60">
              {proveedores.map(p => {
                const count = conteoPorProveedor[p] || 0
                const esEditando = proveedorEditando === p
                const webUrl = proveedoresUrls[p]

                return (
                  <div
                    key={p}
                    className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-pclr2 dark:bg-pdclr2/60 dark:hover:bg-pdclr3/40 transition"
                  >
                    {esEditando ? (
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editNombre}
                          onChange={e => setEditNombre(e.target.value)}
                          placeholder="Nombre del proveedor"
                          className="flex-1 px-3 py-1.5 text-[0.9em] border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 focus:border-pclr8 dark:focus:border-pdclr8 outline-hidden"
                          autoFocus
                        />
                        <input
                          type="text"
                          value={editUrl}
                          onChange={e => setEditUrl(e.target.value)}
                          placeholder="URL sitio web (https://...)"
                          className="sm:w-56 px-3 py-1.5 text-[0.85em] border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 focus:border-pclr8 dark:focus:border-pdclr8 outline-hidden"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={guardarEdicion}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[0.85em] font-medium"
                          >
                            Guardar
                          </button>
                          <button
                            type="button"
                            onClick={() => setProveedorEditando(null)}
                            className="px-3 py-1.5 bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 rounded-lg text-[0.85em]"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-[1.1em]">🏪</span>
                          <span className="font-semibold text-pclr4 dark:text-pdclr4 text-[0.95em]">
                            {p}
                          </span>
                          {webUrl && (
                            <a
                              href={webUrl.startsWith('http') ? webUrl : `https://${webUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-0.5 rounded text-[0.75em] font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 flex items-center gap-1 transition"
                              title={`Visitar ${webUrl}`}
                            >
                              <span>🌐</span>
                              <span>Sitio web</span>
                              <span>↗</span>
                            </a>
                          )}
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <span className="px-2 py-0.5 rounded-full bg-pclr3 dark:bg-pdclr3 text-pclr7 dark:text-pdclr7 text-[0.8em]">
                            {count} {count === 1 ? 'ítem' : 'ítems'}
                          </span>

                          <button
                            type="button"
                            onClick={() => iniciarEdicion(p)}
                            title="Editar nombre y URL"
                            className="px-2 py-1 text-[0.8em] font-medium text-pclr7 dark:text-pdclr7 hover:text-pclr4 dark:hover:text-pdclr4 dark:hover:text-pdclr4 hover:bg-pclr3 dark:hover:bg-pdclr3 rounded transition"
                          >
                            ✏️ Editar
                          </button>

                          <button
                            type="button"
                            disabled={proveedores.length <= 1}
                            onClick={() => iniciarEliminacion(p)}
                            title={proveedores.length <= 1 ? 'Debe quedar al menos un proveedor' : 'Eliminar proveedor'}
                            className="px-2 py-1 text-[0.8em] font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition disabled:opacity-30 disabled:hover:bg-transparent"
                          >
                            🗑️
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sub-modal / Confirmación de Eliminación con Reasignación */}
          {proveedorAEliminar && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl space-y-3">
              <h4 className="font-bold text-[0.95em] text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <span>⚠️</span> Confirmar eliminación de &quot;{proveedorAEliminar}&quot;
              </h4>
              <p className="text-[0.85em] text-amber-800 dark:text-amber-300">
                Este proveedor tiene <strong>{conteoPorProveedor[proveedorAEliminar] || 0}</strong> productos cotizados. Elige a qué comercio reasignarlos automáticamente:
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <select
                  value={proveedorReemplazo}
                  onChange={e => setProveedorReemplazo(e.target.value)}
                  className="w-full sm:flex-1 px-3 py-1.5 text-[0.9em] border border-amber-300 dark:border-amber-700 rounded-lg bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 outline-hidden"
                >
                  {proveedores
                    .filter(p => p !== proveedorAEliminar)
                    .map(p => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                </select>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={confirmarEliminacion}
                    className="flex-1 sm:flex-none px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[0.85em] font-medium transition"
                  >
                    Eliminar y Reasignar
                  </button>
                  <button
                    type="button"
                    onClick={() => setProveedorAEliminar(null)}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 rounded-lg text-[0.85em]"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-pclr13 dark:border-pdclr13 bg-pclr2 dark:bg-pdclr2 flex items-center justify-between flex-wrap gap-2">
          <button
            type="button"
            onClick={onRestaurarProveedoresPorDefecto}
            className="text-[0.8em] text-pclr7 dark:text-pdclr7 hover:text-pclr4 dark:text-pdclr4 dark:hover:text-pdclr4 underline"
          >
            ↺ Restaurar lista estándar chilena ({DEFAULT_PROVEEDORES.length} proveedores)
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-pclr10 hover:brightness-110 dark:bg-pdclr10 text-pclr12 dark:text-pdclr12 font-semibold rounded-xl text-[0.85em] transition shadow-xs ml-auto"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
