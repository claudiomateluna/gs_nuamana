'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Perfil } from '@/types'
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error-utils';

interface DashModCicloCrearProps {
  isOpen: boolean
  onClose: () => void
  perfil: Perfil
  onSuccess: () => void
}

export default function DashModCicloCrear({ isOpen, onClose, perfil, onSuccess }: DashModCicloCrearProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    enfasis: '',
    diagnostico: '',
    fecha_fin: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.from('ciclos_unidad').insert([{
        ...formData,
        unidad_id: perfil.unidad_id,
        creado_por: perfil.id,
        fase_actual: 1
      }])

      if (error) throw error
      onSuccess()
      onClose()
    } catch (err: unknown) {
      toast.error('Error: ' + getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[130] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-clr5 w-full max-w-2xl rounded-[2rem] p-2 md:p-4 shadow-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-3xl font-black font-display uppercase text-clr6 tracking-tighter mb-8 border-b pb-4">
          ✨ Iniciar Nuevo Ciclo
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 text-[1em]">
          <div className="space-y-1">
            <label className="text-[1em] font-black uppercase opacity-70 ml-4 tracking-widest">Nombre del Ciclo</label>
            <input 
              required
              type="text" 
              value={formData.nombre}
              onChange={e => setFormData({...formData, nombre: e.target.value})}
              placeholder="Ej: Ciclo de Aventura Otoño 2026"
              className="w-full p-4 rounded-2xl border dark:border-clr4 bg-zinc-50 dark:bg-clr3 font-bold text-lg"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[1em] font-black uppercase opacity-70 ml-4 tracking-widest text-clr7">Énfasis del Ciclo (La Frase Motiva)</label>
            <input 
              required
              type="text" 
              value={formData.enfasis}
              onChange={e => setFormData({...formData, enfasis: e.target.value})}
              placeholder="Ej: ¡Tras la huella de Akela!"
              className="w-full p-4 rounded-2xl border-2 border-clr7 bg-clr7/5 font-bold italic text-xl"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[1em] font-black uppercase opacity-70 ml-4 tracking-widest">Diagnóstico de la Unidad</label>
            <textarea 
              required
              value={formData.diagnostico}
              onChange={e => setFormData({...formData, diagnostico: e.target.value})}
              placeholder="¿Cómo está la unidad hoy? ¿Qué desafíos técnicos o espirituales tenemos?"
              className="w-full p-6 rounded-[2rem] border dark:border-clr4 bg-zinc-50 dark:bg-clr3 font-bold min-h-[150px] leading-relaxed italic"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[1em] font-black uppercase opacity-70 ml-4 tracking-widest">Fecha estimada de término</label>
            <input 
              type="date" 
              value={formData.fecha_fin}
              onChange={e => setFormData({...formData, fecha_fin: e.target.value})}
              className="w-full p-4 rounded-2xl border dark:border-clr4 bg-zinc-50 dark:bg-clr3 font-bold"
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-5 bg-clr6 text-white font-black font-display uppercase rounded-[1.5rem] shadow-xl hover:brightness-110 active:scale-95 transition-all tracking-widest"
            >
              {loading ? '⌛ Iniciando...' : '🚀 Lanzar Ciclo de Programa'}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="px-8 py-5 bg-zinc-100 dark:bg-clr4 text-clr2 rounded-[1.5rem] font-bold uppercase tracking-widest"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
