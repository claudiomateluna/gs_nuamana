'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface DashModAsistenciaProps {
  isOpen: boolean
  onClose: () => void
  propuesta: any
  perfil: any
  cicloActivo?: any
  onSuccess?: () => void
}

export default function DashModAsistencia({ isOpen, onClose, propuesta, perfil, cicloActivo, onSuccess }: DashModAsistenciaProps) {
  const [nnjList, setNnjList] = useState<any[]>([])
  const [asistencia, setAsistencia] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Usamos el id de la unidad del ciclo, o si no, el del perfil (por seguridad)
  const targetUnidadId = cicloActivo?.unidad_id || perfil?.unidad_id

  useEffect(() => {
    if (isOpen && targetUnidadId && propuesta?.id) {
      fetchData()
    }
  }, [isOpen, targetUnidadId, propuesta?.id])

  const fetchData = async () => {
    setLoading(true)
    try {
      // 1. Obtener todos los NNJ de la unidad del ciclo (Rol 4 = Beneficiario)
      const { data: users, error: uError } = await supabase
        .from('perfiles')
        .select('id, nombres, apellidos')
        .eq('unidad_id', targetUnidadId)
        .in('rol_id', [9, 10, 11, 12, 13])
        .order('apellidos', { ascending: true })
      
      if (uError) throw uError

      // 2. Obtener asistencia ya guardada para esta actividad
      const { data: saved, error: sError } = await supabase
        .from('asistencia_actividades')
        .select('perfil_id, asistio')
        .eq('propuesta_id', propuesta.id)
      
      if (sError) throw sError

      const attendanceMap: Record<string, boolean> = {}
      users?.forEach(u => {
        const record = saved?.find(s => s.perfil_id === u.id)
        attendanceMap[u.id] = record ? record.asistio : false
      })

      setNnjList(users || [])
      setAsistencia(attendanceMap)
    } catch (err: any) {
      console.error('Error fetching attendance data:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleAsistencia = (id: string) => {
    setAsistencia(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const guardarAsistencia = async () => {
    setSaving(true)
    try {
      const records = nnjList.map(u => ({
        propuesta_id: propuesta.id,
        perfil_id: u.id,
        asistio: asistencia[u.id] || false
      }))

      const { error } = await supabase
        .from('asistencia_actividades')
        .upsert(records, { onConflict: 'propuesta_id,perfil_id' })
      
      if (error) throw error

      alert('Asistencia guardada correctamente.')
      if (onSuccess) onSuccess()
      onClose()
    } catch (err: any) {
      alert('Error al guardar asistencia: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-clr3 w-full max-w-xl rounded-[1rem] shadow-2xl overflow-hidden border-4 border-white dark:border-clr4 animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        <div className="p-2 pb-4 space-y-2 border-b border-zinc-50 dark:border-clr4">
          <span className="text-[1em] font-black uppercase tracking-[0.2em] text-clr7">Registro de Asistencia</span>
          <h3 className="text-2xl font-black uppercase text-clr5 dark:text-white leading-tight">
            {propuesta?.titulo}
          </h3>
          <p className="text-sm opacity-50 font-bold uppercase tracking-widest">
            {propuesta?.fecha_programada}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pt-4 custom-scrollbar">
          {loading ? (
            <div className="py-10 text-center animate-pulse uppercase font-black text-[0.8em] opacity-40">
              Cargando lista de NNJ...
            </div>
          ) : (
            <div className="space-y-2">
              {nnjList.map((nnj) => (
                <div 
                  key={nnj.id}
                  onClick={() => toggleAsistencia(nnj.id)}
                  className={`p-2 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group ${
                    asistencia[nnj.id] 
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900/30' 
                      : 'bg-zinc-50 border-zinc-100 dark:bg-black/20 dark:border-clr4 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                      asistencia[nnj.id] ? 'bg-green-500 text-white' : 'bg-zinc-200 dark:bg-clr4'
                    }`}>
                      {nnj.nombres[0]}{nnj.apellidos[0]}
                    </div>
                    <div>
                      <p className="text-[1em] font-bold uppercase text-clr5 dark:text-clr1">{nnj.nombres} {nnj.apellidos}</p>
                      <p className="text-[0.8em] font-black uppercase opacity-40 tracking-widest">
                        {asistencia[nnj.id] ? 'Presente' : 'Ausente'}
                      </p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    asistencia[nnj.id] ? 'bg-green-500 border-green-500' : 'border-zinc-300 dark:border-clr4'
                  }`}>
                    {asistencia[nnj.id] && <span className="text-white text-xs">✓</span>}
                  </div>
                </div>
              ))}
              {nnjList.length === 0 && (
                <div className="py-10 text-center opacity-30 italic text-sm">
                  No hay NNJ registrados en esta unidad.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 pt-4 border-t border-zinc-50 dark:border-clr4 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-4 text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-all"
          >
            Cerrar
          </button>
          <button 
            onClick={guardarAsistencia}
            disabled={saving || loading}
            className="flex-[2] py-4 bg-zinc-900 text-white text-sm font-black uppercase rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all tracking-widest disabled:opacity-50"
          >
            {saving ? '⌛ Guardando...' : '💾 Guardar Asistencia'}
          </button>
        </div>
      </div>
    </div>
  )
}
