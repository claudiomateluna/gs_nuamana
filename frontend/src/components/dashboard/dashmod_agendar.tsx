'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface DashModAgendarProps {
  isOpen: boolean
  onClose: () => void
  propuesta: any
  onSuccess: () => void
}

export default function DashModAgendar({ isOpen, onClose, propuesta, onSuccess }: DashModAgendarProps) {
  const [loading, setLoading] = useState(false)
  const [fecha, setFecha] = useState('')

  const handleAgendar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fecha) return alert('Debes seleccionar una fecha para la actividad.')

    setLoading(true)
    try {
      const { error } = await supabase
        .from('ciclo_propuestas')
        .update({ seleccionada: true, fecha_programada: fecha })
        .eq('id', propuesta.id)

      if (error) throw error
      onSuccess()
      onClose()
    } catch (err: any) {
      alert('Error al agendar: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !propuesta) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[130] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-clr5 w-full max-w-lg rounded-[3rem] p-8 shadow-2xl">
        <h2 className="text-2xl font-black font-display uppercase text-clr7 tracking-tighter mb-2">
          📅 Agendar Actividad
        </h2>
        <p className="text-sm opacity-60 font-medium italic mb-6">
          Aprobar y calendarizar la propuesta: <strong>"{propuesta.titulo}"</strong>
        </p>

        <form onSubmit={handleAgendar} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[0.8em] font-black uppercase opacity-40 ml-4 tracking-widest">¿Cuándo se realizará?</label>
            <input 
              required
              type="date" 
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              className="w-full p-4 rounded-2xl border dark:border-clr4 bg-zinc-50 dark:bg-clr3 font-bold"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-4 bg-clr7 text-white font-black font-display uppercase rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all tracking-widest"
            >
              {loading ? '⌛ Guardando...' : '✅ Aprobar y Agendar'}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-4 bg-zinc-100 dark:bg-clr4 text-clr2 rounded-2xl font-bold uppercase"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
