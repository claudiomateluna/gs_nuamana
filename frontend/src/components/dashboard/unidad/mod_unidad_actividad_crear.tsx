'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Perfil, Unidad } from '@/types'
import { toast } from 'sonner';

interface EditingActividad {
  id: string
  tipo: string
  nombre: string
  lugar: string
  fecha_inicio: string
  fecha_fin: string
}

interface DashModActividadCrearProps {
  isOpen: boolean
  onClose: () => void
  perfil: Pick<Perfil, 'id' | 'unidad_id'>
  unidades: Unidad[]
  onSuccess: () => void
  editingActividad?: EditingActividad | null
}

export default function DashModActividadCrear({ isOpen, onClose, perfil, unidades, onSuccess, editingActividad }: DashModActividadCrearProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    tipo: editingActividad?.tipo || 'Salida',
    nombre: editingActividad?.nombre || '',
    lugar: editingActividad?.lugar || '',
    fecha_inicio: editingActividad?.fecha_inicio || '',
    fecha_fin: editingActividad?.fecha_fin || '',
    nivel: 'unidad' // 'unidad' o 'grupo'
  })

  if (!isOpen) return null

  const isEditing = !!editingActividad?.id

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isEditing) {
        const { error } = await supabase.from('actividades_programadas').update({
          tipo: form.tipo,
          nombre: form.nombre,
          lugar: form.lugar,
          fecha_inicio: form.fecha_inicio,
          fecha_fin: form.fecha_fin,
        }).eq('id', editingActividad.id)
        if (error) throw error
        toast.success('¡Actividad actualizada exitosamente!')
      } else {
        const { error } = await supabase.from('actividades_programadas').insert({
          tipo: form.tipo,
          nombre: form.nombre,
          lugar: form.lugar,
          fecha_inicio: form.fecha_inicio,
          fecha_fin: form.fecha_fin,
          unidad_id: form.nivel === 'unidad' ? perfil.unidad_id : null,
          creado_por: perfil.id,
          estado: 'borrador'
        })
        if (error) throw error
        toast.success('¡Actividad programada exitosamente!')
      }
      onSuccess()
      onClose()
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : 'Error') }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-2 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-clr5 w-full max-w-lg rounded-[2rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-black font-display uppercase text-clr6 mb-6 border-b pb-2 tracking-tighter">{isEditing ? 'Editar Actividad' : 'Programar Salida / Campamento'}</h2>
        
        <form onSubmit={handleSave} className="space-y-4 text-[1em]">
          <div className="grid grid-cols-2 gap-4">
            {editingActividad?.tipo === 'Especialidad' ? (
              <div className="space-y-1">
                <label className="text-[0.8em] font-black uppercase opacity-40">Tipo</label>
                <div className="w-full p-3 dark:bg-clr5 rounded-xl border font-bold uppercase bg-zinc-50 text-clr6">
                  🎓 Especialidad
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-[0.8em] font-black uppercase opacity-40">Tipo</label>
                <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})} className="w-full p-3 dark:bg-clr5 rounded-xl border font-bold uppercase">
                  <option value="Salida">🚶 Salida</option>
                  <option value="Campamento">⛺ Campamento</option>
                  <option value="Especialidad">🎓 Especialidad</option>
                </select>
              </div>
            )}
            {!isEditing && (
              <div className="space-y-1">
                <label className="text-[0.8em] font-black uppercase opacity-40">Nivel</label>
                <select value={form.nivel} onChange={e => setForm({...form, nivel: e.target.value})} className="w-full p-3 dark:bg-clr5 rounded-xl border font-bold uppercase">
                  <option value="unidad">🛡️ Solo Mi Unidad</option>
                  <option value="grupo">⚜️ Todo el Grupo</option>
                </select>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[0.8em] font-black uppercase opacity-40">Nombre de la Actividad</label>
            <input required type="text" placeholder="Ej: Salida al Cajón del Maipo" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="w-full p-3 rounded-xl border font-bold" />
          </div>

          <div className="space-y-1">
            <label className="text-[0.8em] font-black uppercase opacity-40">Lugar Exacto</label>
            <input required type="text" placeholder="Ej: San Alfonso, Melipilla..." value={form.lugar} onChange={e => setForm({...form, lugar: e.target.value})} className="w-full p-3 rounded-xl border font-bold" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[0.8em] font-black uppercase opacity-40">Inicia</label>
              <input required type="date" value={form.fecha_inicio} onChange={e => setForm({...form, fecha_inicio: e.target.value})} className="w-full p-3 rounded-xl border font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-[0.8em] font-black uppercase opacity-40">Finaliza</label>
              <input required type="date" value={form.fecha_fin} onChange={e => setForm({...form, fecha_fin: e.target.value})} className="w-full p-3 rounded-xl border font-bold" />
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t mt-6">
            <button type="submit" disabled={loading} className="flex-1 py-4 bg-clr6 text-white font-black uppercase rounded-2xl shadow-xl hover:brightness-110 transition-all font-inika tracking-widest">
              {loading ? '⌛ Guardando...' : isEditing ? '💾 Actualizar Actividad' : '💾 Crear Actividad'}
            </button>
            <button type="button" onClick={onClose} className="px-8 py-4 bg-zinc-100 text-clr2 font-bold uppercase rounded-2xl">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
