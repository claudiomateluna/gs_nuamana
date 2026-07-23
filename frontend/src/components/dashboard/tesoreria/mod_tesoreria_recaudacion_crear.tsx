'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Perfil } from '@/types'
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error-utils';

interface DashModRecaudacionCrearProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  perfil: Perfil
}

export default function DashModRecaudacionCrear({ isOpen, onClose, onSuccess, perfil }: DashModRecaudacionCrearProps) {
  const [saving, setSaving] = useState(false)
  const [nombre, setNombre] = useState('')
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0])
  const [plazoMaximo, setPlazoMaximo] = useState('')
  const [unidad, setUnidad] = useState('Grupal')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre || !fechaInicio || !plazoMaximo || !unidad) {
      toast.warning('Por favor complete todos los campos.')
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase.from('tesoreria_recaudaciones').insert({
        nombre: nombre.trim(),
        fecha_inicio: fechaInicio,
        plazo_maximo: plazoMaximo,
        unidad: unidad,
        creado_por: perfil.id,
        estado: 'abierta'
      })

      if (error) throw error

      onSuccess()
      onClose()
      setNombre('')
      setPlazoMaximo('')
      setUnidad('Grupal')
    } catch (err: unknown) {
      toast.error('Error al crear recaudación: ' + getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-2 md:p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-clr5 w-full max-w-lg rounded-[2.5rem] p-6 md:p-10 shadow-2xl border-4 border-clr10 dark:border-clr4 overflow-y-auto max-h-[95vh]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black font-display uppercase text-clr6 tracking-tighter">
            Crear Nueva Recaudación
          </h2>
          <button onClick={onClose} className="text-clr2 hover:text-black dark:text-white/60 dark:hover:text-white font-bold text-[1.2em]">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-[1em]">
          <div className="space-y-1">
            <label className="text-[0.8em] font-bold uppercase opacity-60">Nombre de la Recaudación</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-clr3 font-bold"
              placeholder="Ej: Rifa Pro-Campamento, Entradas Bingo..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[0.8em] font-bold uppercase opacity-60">Fecha de Inicio</label>
              <input
                type="date"
                required
                value={fechaInicio}
                onChange={e => setFechaInicio(e.target.value)}
                className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-clr3 font-bold text-center"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[0.8em] font-bold uppercase opacity-60">Plazo Máximo de Pago</label>
              <input
                type="date"
                required
                value={plazoMaximo}
                onChange={e => setPlazoMaximo(e.target.value)}
                className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-clr3 font-bold text-center"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[0.8em] font-bold uppercase opacity-60">Unidad de la Recaudación</label>
            <select
              value={unidad}
              onChange={e => setUnidad(e.target.value)}
              className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-clr3 font-bold uppercase"
            >
              <option value="Grupal">⚜️ Grupal (Todo el Grupo)</option>
              <option value="Manada">🐾 Manada</option>
              <option value="Compañía">🌸 Compañía</option>
              <option value="Tropa">🏕️ Tropa</option>
              <option value="Avanzada">⛰️ Avanzada</option>
              <option value="Clan">🔥 Clan</option>
            </select>
            <p className="text-[0.75em] opacity-40 font-semibold uppercase mt-1 pl-1">
              Indica a qué unidades les aparecerá la recaudación para subir comprobantes.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t dark:border-clr4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-clr2 text-clr2 rounded-xl text-[0.85em] font-bold uppercase hover:bg-zinc-50 dark:hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-clr6 text-white rounded-xl text-[0.85em] font-bold uppercase hover:brightness-110 shadow-lg transition-all disabled:opacity-50"
            >
              {saving ? 'Creando...' : 'Crear Recaudación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
