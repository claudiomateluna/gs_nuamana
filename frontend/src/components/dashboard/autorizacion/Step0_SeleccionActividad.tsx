'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { parseFechaLocal } from '@/lib/validation-utils'
import type { Step0Props, ActividadData } from '@/types/autorizacion'

export default function Step0_SeleccionActividad({ perfil, setActividadSelected, actividadSelected }: Step0Props) {
  const [actividades, setActividades] = useState<ActividadData[]>([])
  const [loading, setLoading] = useState(true)

  const titleStyle = "text-[1.2em] font-black text-clr4 dark:text-dclr4 uppercase tracking-tighter mb-8 border-b-2 border-clr4 pb-2";

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
      <p className="text-[1em] text-clr3 font-bold mb-4 italic text-center">Selecciona la actividad para la cual deseas generar la autorización digital:</p>

      {loading ? (
        <div className="py-20 text-center animate-pulse text-clr3 font-black uppercase text-[1em] tracking-widest">Buscando actividades disponibles...</div>
      ) : actividades.length === 0 ? (
        <div className="py-20 text-center bg-clr7 dark:bg-dclr7 rounded-[2.5rem] border-2 border-dashed border-clr7 dark:border-dclr7">
          <p className="text-clr4 font-black uppercase text-sm">No se encontraron actividades programadas para tu unidad.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 max-w-xl mx-auto pb-4">
          {actividades.map((act) => (
            <button
              key={act.id}
              onClick={() => setActividadSelected(act)}
              className={`p-4 rounded-[1rem] border-2 text-left transition-all duration-300 flex justify-between items-center group shadow-sm ${actividadSelected?.id === act.id ? 'border-clr4 bg-clr4 text-clr1 shadow-xl scale-[1.03]' : 'border-clr7 dark:border-dclr7 bg-clr1 dark:bg-dclr7 hover:border-clr4'}`}
            >
              <div className="space-y-2">
                <div className={`text-[0.9em] uppercase tracking-widest ${actividadSelected?.id === act.id ? 'text-clr1' : 'text-clr4'}`}>
                  {act.unidad_id ? `Actividad de Unidad` : 'Actividad Grupal'}
                </div>
                <div className="text-[1.2em] font-bold uppercase tracking-tight leading-tight">{act.nombre}</div>
                <div className={`text-[0.95em] font-bold ${actividadSelected?.id === act.id ? 'text-clr1' : 'text-clr3'}`}>
                  {act.fecha_inicio && parseFechaLocal(act.fecha_inicio) ? format(parseFechaLocal(act.fecha_inicio)!, "eeee dd 'de' MMMM", { locale: es }) : 'Fecha pendiente'} • {act.lugar || 'Lugar por definir'}
                </div>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${actividadSelected?.id === act.id ? 'bg-clr1 border-clr1 text-clr4' : 'border-clr7 dark:border-dclr7 group-hover:border-clr4 group-hover:text-clr4'}`}>
                {actividadSelected?.id === act.id ? <span className="text-xl font-black">✓</span> : <span className="text-xl">→</span>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
