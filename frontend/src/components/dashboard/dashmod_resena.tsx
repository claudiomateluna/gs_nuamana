'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface DashModResenaProps {
  isOpen: boolean
  onClose: () => void
  propuesta: any
  perfil: any
  onSuccess?: () => void
}

export default function DashModResena({ isOpen, onClose, propuesta, perfil, onSuccess }: DashModResenaProps) {
  const [calificacion, setCalificacion] = useState(7)
  const [comentario, setComentario] = useState('')
  const [esAnonimo, setEsAnonimo] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const articuloId = propuesta?.articulo?.id || propuesta?.articulo_id

  useEffect(() => {
    if (isOpen && articuloId && perfil?.id) {
      fetchResena()
    }
  }, [isOpen, articuloId, perfil?.id])

  const fetchResena = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('articulo_resenas')
        .select('*')
        .eq('articulo_id', articuloId)
        .eq('perfil_id', perfil.id)
        .maybeSingle()
      
      if (data) {
        setCalificacion(data.calificacion)
        setComentario(data.comentario || '')
        setEsAnonimo(data.es_anonimo || false)
      } else {
        setCalificacion(7)
        setComentario('')
        setEsAnonimo(false)
      }
    } catch (err: any) {
      console.error('Error fetching resena:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!articuloId) return alert('Esta actividad no tiene una ficha vinculada para calificar.')
    setSaving(true)
    try {
      // 1. Calcular EDAD exacta al momento de la reseña
      let age = null
      if (perfil?.fecha_nacimiento) {
        const birthDate = new Date(perfil.fecha_nacimiento)
        const today = new Date()
        age = today.getFullYear() - birthDate.getFullYear()
        const m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
      }

      // 2. Determinar el NOMBRE DE UNIDAD / ROL SCOUT (Snapshot)
      const unit = perfil?.unidades || {}
      const unitNameRaw = (unit.nombre || '').toLowerCase()
      const isFem = perfil?.sexo === 'femenina'
      
      let unitLabel = 'Scout'
      if (unitNameRaw.includes('manada')) unitLabel = isFem ? 'Lobata' : 'Lobato'
      else if (unitNameRaw.includes('compañía') || unitNameRaw.includes('compania')) unitLabel = 'Guía'
      else if (unitNameRaw.includes('tropa')) unitLabel = 'Scout'
      else if (unitNameRaw.includes('avanzada')) unitLabel = isFem ? 'Pionera' : 'Pionero'
      else if (unitNameRaw.includes('clan')) unitLabel = 'Caminante'

      // 3. Capturar Color y Logo de la Unidad (Snapshot)
      const unitColor = unit.colores?.primario || '#cb3327'
      const unitLogo = unit.logo_unidad_url || null

      const { error } = await supabase
        .from('articulo_resenas')
        .upsert({
          articulo_id: articuloId,
          perfil_id: perfil.id,
          calificacion,
          comentario,
          es_anonimo: esAnonimo,
          edad_resena: age,
          unidad_resena: unitLabel,
          unidad_color_resena: unitColor,
          unidad_logo_resena: unitLogo
        }, { onConflict: 'articulo_id,perfil_id' })
      
      if (error) throw error

      alert('¡Gracias por tu reseña! Ayudará a otros scouts a conocer esta actividad.')
      if (onSuccess) onSuccess()
      onClose()
    } catch (err: any) {
      alert('Error al guardar: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-clr3 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-white dark:border-clr4 animate-in zoom-in duration-300">
        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-5xl block mb-2">⭐</span>
            <h2 className="text-2xl font-black uppercase text-clr5 dark:text-white">Calificar Actividad</h2>
            <p className="text-[0.9em] text-zinc-500 dark:text-zinc-400 italic">Tu opinión aparecerá en la ficha pública</p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <label className="text-[0.8em] font-black uppercase tracking-widest opacity-60 text-center">¿Qué nota le pones?</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <button
                    key={num}
                    onClick={() => setCalificacion(num)}
                    className={`w-10 h-10 rounded-xl font-black transition-all flex items-center justify-center text-lg ${
                      calificacion >= num 
                        ? 'bg-orange-500 text-white shadow-lg scale-110' 
                        : 'bg-zinc-100 text-zinc-400 dark:bg-black/20'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <span className="text-[0.9em] font-bold text-orange-600 uppercase mt-1">
                {calificacion === 7 ? '¡Increíble!' : calificacion >= 5 ? 'Muy buena' : calificacion >= 4 ? 'Normal' : 'Se puede mejorar'}
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-[0.8em] font-black uppercase tracking-widest opacity-60">Tu Comentario (Opcional)</label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Cuéntanos qué fue lo que más te gustó de esta actividad..."
                className="w-full p-4 rounded-2xl border bg-zinc-50 dark:bg-black/20 font-bold min-h-[120px] text-[1em]"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer group p-2 bg-zinc-50 dark:bg-black/20 rounded-xl border border-zinc-100 dark:border-clr4">
              <input 
                type="checkbox" 
                checked={esAnonimo} 
                onChange={(e) => setEsAnonimo(e.target.checked)}
                className="w-5 h-5 accent-orange-500"
              />
              <span className="text-sm font-bold uppercase tracking-wide opacity-80 group-hover:opacity-100 transition-opacity">Publicar de forma anónima</span>
            </label>
          </div>

          <div className="flex gap-4 pt-4 border-t border-zinc-100 dark:border-clr4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-zinc-100 dark:bg-black/20 font-black uppercase rounded-2xl tracking-widest text-[0.9em]"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loading}
              className="flex-[2] py-4 bg-orange-600 text-white font-black uppercase rounded-2xl tracking-widest text-[0.9em] shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
            >
              {saving ? 'Guardando...' : '💾 Publicar Reseña'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
