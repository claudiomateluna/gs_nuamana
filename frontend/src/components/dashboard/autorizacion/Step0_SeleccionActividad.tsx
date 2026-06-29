'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface StepProps {
  formData: any
  setFormData: (data: any) => void
  perfil: any
  setActividadSelected: (actividad: any) => void
  actividadSelected: any
}

export default function Step0_SeleccionActividad({ perfil, setActividadSelected, actividadSelected }: StepProps) {
  const [actividades, setActividades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const titleStyle = "text-[1.2em] font-black text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8 border-b-2 border-clr7 pb-2";

  useEffect(() => {
    async function fetchActividades() {
      const today = new Date().toISOString();
      
      // Buscamos actividades que correspondan a la unidad del usuario o generales
      // Y que la fecha de inicio sea hoy o en el futuro
      const query = supabase
        .from('actividades_programadas')
        .select('*')
        .gte('fecha_inicio', today)
        .order('fecha_inicio', { ascending: true });

      // Si el perfil tiene unidad, filtramos por ella o nulos
      if (perfil.unidad_id) {
        query.or(`unidad_id.eq.${perfil.unidad_id},unidad_id.is.null`);
      }

      const { data, error } = await query;

      if (!error && data) {
        setActividades(data)
      }
      setLoading(false)
    }
    fetchActividades()
  }, [perfil.unidad_id])

  return (
    <div className="animate-in fade-in duration-500 p-4">
      <h3 className={titleStyle}>Selección de Actividad</h3>
      <p className="text-[1em] text-clr2 font-bold mb-4 italic text-center">Selecciona la actividad para la cual deseas generar la autorización digital:</p>

      {loading ? (
        <div className="py-20 text-center animate-pulse text-clr2 font-black uppercase text-[1em] tracking-widest">Buscando actividades disponibles...</div>
      ) : actividades.length === 0 ? (
        <div className="py-20 text-center bg-zinc-50 dark:bg-black/10 rounded-[2.5rem] border-2 border-dashed border-clr10 dark:border-clr4">
          <p className="text-clr7 font-black uppercase text-sm">No se encontraron actividades programadas para tu unidad.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 max-w-xl mx-auto pb-4">
          {actividades.map((act) => (
            <button
              key={act.id}
              onClick={() => setActividadSelected(act)}
              className={`p-4 rounded-[1rem] border-2 text-left transition-all duration-300 flex justify-between items-center group shadow-sm ${actividadSelected?.id === act.id ? 'border-clr7 bg-clr7 text-white shadow-xl scale-[1.03]' : 'border-zinc-100 dark:border-clr4 bg-white dark:bg-clr3 hover:border-clr7/30'}`}
            >
              <div className="space-y-2">
                <div className={`text-[0.9em] uppercase tracking-widest ${actividadSelected?.id === act.id ? 'text-white/70' : 'text-clr7'}`}>
                  {act.unidad_id ? `Actividad de Unidad` : 'Actividad Grupal'}
                </div>
                <div className="text-[1.2em] font-bold uppercase tracking-tight leading-tight">{act.nombre}</div>
                <div className={`text-[0.95em] font-bold ${actividadSelected?.id === act.id ? 'text-white/90' : 'text-clr2'}`}>
                  {act.fecha_inicio ? format(new Date(act.fecha_inicio), "eeee dd 'de' MMMM", { locale: es }) : 'Fecha pendiente'} • {act.lugar || 'Lugar por definir'}
                </div>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${actividadSelected?.id === act.id ? 'bg-white border-white text-clr7' : 'border-zinc-100 dark:border-clr4 group-hover:border-clr7 group-hover:text-clr7'}`}>
                {actividadSelected?.id === act.id ? <span className="text-xl font-black">✓</span> : <span className="text-xl">→</span>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
