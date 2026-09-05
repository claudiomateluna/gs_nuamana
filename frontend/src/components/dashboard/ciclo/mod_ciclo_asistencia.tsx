'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getRoleIds } from '@/lib/roles'
import type { Perfil, CicloPropuesta, CicloUnidad } from '@/types'
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error-utils';

interface DashModAsistenciaProps {
  isOpen: boolean
  onClose: () => void
  propuesta: CicloPropuesta
  perfil: Perfil
  cicloActivo?: CicloUnidad | null
  onSuccess?: () => void
}

interface NnjListItem {
  id: string
  nombres: string
  apellidos: string
}

export default function DashModAsistencia({ isOpen, onClose, propuesta, perfil, cicloActivo, onSuccess }: DashModAsistenciaProps) {
  const [nnjList, setNnjList] = useState<NnjListItem[]>([])
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
        .in('rol_id', getRoleIds('nnj'))
        .neq('estado', 'inactivo')
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
    } catch (err: unknown) {
      console.error('Error fetching attendance data:', getErrorMessage(err))
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

      toast.success('Asistencia guardada correctamente.')
      if (onSuccess) onSuccess()
      onClose()
    } catch (err: unknown) {
      toast.error('Error al guardar asistencia: ' + getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-pclr2 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-pclr1 dark:bg-pdclr1 w-full max-w-xl rounded-[1rem] shadow-2xl overflow-hidden border-4 border-pclr1 dark:border-pdclr1 animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        <div className="p-2 pb-4 space-y-2 border-b border-pclr13 dark:border-pdclr13">
          <span className="text-[1em] font-black uppercase tracking-[0.2em] text-pclr4">Registro de Asistencia</span>
          <h3 className="text-2xl font-black uppercase text-pclr4 dark:text-pdclr4 leading-tight">
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
                      ? 'bg-pclr6 border-pclr6 dark:bg-pdclr6 dark:border-pdclr6' 
                      : 'bg-pclr3 border-pclr13 dark:bg-pdclr3 dark:border-pdclr13 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                      asistencia[nnj.id] ? 'bg-pclr6 text-pclr12' : 'bg-pclr3 dark:bg-pdclr3'
                    }`}>
                      {nnj.nombres[0]}{nnj.apellidos[0]}
                    </div>
                    <div>
                      <p className="text-[1em] font-bold uppercase text-pclr4 dark:text-pdclr4">{nnj.nombres} {nnj.apellidos}</p>
                      <p className="text-[0.8em] font-black uppercase opacity-40 tracking-widest">
                        {asistencia[nnj.id] ? 'Presente' : 'Ausente'}
                      </p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    asistencia[nnj.id] ? 'bg-pclr6 border-pclr6' : 'border-pclr13 dark:border-pdclr13'
                  }`}>
                    {asistencia[nnj.id] && <span className="text-pclr12 text-xs">âœ“</span>}
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

        <div className="p-4 pt-4 border-t border-pclr13 dark:border-pdclr13 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-4 text-sm font-black uppercase tracking-widest text-pclr7 hover:text-pclr4 transition-all"
          >
            Cerrar
          </button>
          <button 
            onClick={guardarAsistencia}
            disabled={saving || loading}
            className="flex-[2] py-4 bg-pclr2 text-pclr12 text-sm font-black uppercase rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all tracking-widest disabled:opacity-50"
          >
            {saving ? 'âŒ› Guardando...' : 'ðŸ’¾ Guardar Asistencia'}
          </button>
        </div>
      </div>
    </div>
  )
}
