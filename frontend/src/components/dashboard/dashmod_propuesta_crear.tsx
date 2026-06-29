'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface DashModPropuestaCrearProps {
  isOpen: boolean
  onClose: () => void
  perfil: any
  cicloId: string
  onSuccess: () => void
}

export default function DashModPropuestaCrear({ isOpen, onClose, perfil, cicloId, onSuccess }: DashModPropuestaCrearProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.titulo) return alert('El título es obligatorio.')

    setLoading(true)
    try {
      const { data, error } = await supabase.from('ciclo_propuestas').insert([{
        ...formData,
        ciclo_id: cicloId,
        autor_id: perfil.id
      }]).select().single()

      if (error) throw error
      
      console.log('Propuesta creada:', data)
      onSuccess()
      onClose()
      setFormData({ titulo: '', descripcion: '' })
    } catch (err: any) {
      alert('Error al guardar la idea: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[130] flex items-center justify-center p-2 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-clr5 w-full max-w-lg rounded-[2rem] p-4 shadow-2xl">
        <h2 className="text-2xl font-black font-display uppercase text-clr7 tracking-tighter mb-6">
          💡 Proponer Actividad
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[1em] font-black uppercase opacity-60 ml-4 tracking-widest">¿Qué quieres hacer?</label>
            <input 
              required
              type="text" 
              value={formData.titulo}
              onChange={e => setFormData({...formData, titulo: e.target.value})}
              placeholder="Ej: Gran Juego de Rastreo..."
              className="w-full p-4 rounded-2xl border dark:border-clr4 bg-zinc-50 dark:bg-clr3 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[1em] font-black uppercase opacity-60 ml-4 tracking-widest">Descripción / Idea</label>
            <textarea 
              value={formData.descripcion}
              onChange={e => setFormData({...formData, descripcion: e.target.value})}
              placeholder="Cuéntanos un poco más de tu idea..."
              className="w-full p-4 rounded-2xl border dark:border-clr4 bg-zinc-50 dark:bg-clr3 font-bold h-32"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-4 bg-clr7 text-white font-black font-display uppercase rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all tracking-widest"
            >
              {loading ? '⌛ Enviando...' : '📤 Subir Idea'}
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
