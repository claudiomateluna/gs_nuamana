'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import DashCiclo from './dash_ciclo'

interface DashCicloHistorialProps {
  perfil: any
}

export default function DashCicloHistorial({ perfil }: DashCicloHistorialProps) {
  const [ciclos, setCiclos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [cicloSeleccionado, setCicloSeleccionado] = useState<any>(null)

  const fetchCiclos = async () => {
    if (!perfil) return
    setLoading(true)
    try {
      let query = supabase
        .from('ciclos_unidad')
        .select('*, unidades(nombre, colores)')
        .eq('estado', 'cerrado')

      if (perfil.rol_id !== 1) {
        // Si no es Admin, filtrar por su unidad
        if (perfil.unidad_id) {
          query = query.eq('unidad_id', perfil.unidad_id)
        } else {
          // Si no tiene unidad y no es admin, no ve nada
          setCiclos([])
          setLoading(false)
          return
        }
      }

      const { data, error } = await query.order('fecha_fin', { ascending: false })
      
      if (error) throw error
      setCiclos(data || [])
    } catch (err: any) {
      console.error('Error fetching historial:', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCiclos()
  }, [perfil?.unidad_id, perfil?.rol_id])

  const handleEliminarCiclo = async (e: React.MouseEvent, c: any) => {
    e.stopPropagation()
    const confirmMessage = `¿Seguro que deseas eliminar el ciclo "${c.nombre}"? Se borrarán de forma permanente todas las propuestas, votos y asistencias asociadas. Esta acción es irreversible.`
    if (!confirm(confirmMessage)) return

    try {
      const { error } = await supabase
        .from('ciclos_unidad')
        .delete()
        .eq('id', c.id)

      if (error) throw error

      alert('Ciclo histórico eliminado correctamente.')
      if (cicloSeleccionado?.id === c.id) {
        setCicloSeleccionado(null)
      }
      fetchCiclos()
    } catch (err: any) {
      alert('Error al eliminar el ciclo: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="p-20 text-center animate-pulse uppercase font-medium text-[0.8em] tracking-widest text-clr2">
        Cargando Memoria Scout...
      </div>
    )
  }

  if (cicloSeleccionado) {
    const canDelete = perfil?.rol_id === 1 || cicloSeleccionado.creado_por === perfil?.id

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <button 
            onClick={() => setCicloSeleccionado(null)}
            className="flex items-center gap-2 text-[0.8em] font-bold uppercase tracking-widest text-clr7 hover:scale-105 transition-all"
          >
            ❮ Volver al Historial
          </button>
          {canDelete && (
            <button
              onClick={(e) => handleEliminarCiclo(e, cicloSeleccionado)}
              className="px-5 py-2.5 bg-red-50 hover:bg-red-650 text-red-650 hover:text-white dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-900 rounded-xl transition-all shadow-sm text-[0.8em] font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              🗑️ Eliminar este Ciclo
            </button>
          )}
        </div>
        
        <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-2xl border-2 border-amber-200 dark:border-amber-900/30 text-center">
          <p className="text-[0.8em] font-medium uppercase text-amber-700 dark:text-amber-400 tracking-tighter">
            📜 Estás viendo un Ciclo Histórico (Solo Lectura)
          </p>
        </div>
        
        <DashCiclo perfil={perfil} cicloIdOverride={cicloSeleccionado.id} />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      <div className="text-center space-y-2">
        <span className="text-[0.8em] font-bold uppercase tracking-[0.3em] text-clr7">Memoria Institucional</span>
        <h2 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tighter leading-none text-clr5 dark:text-white">
          Historial de Ciclos
        </h2>
        <p className="text-sm italic opacity-60 font-medium max-w-xl mx-auto">
          Explora las aventuras pasadas, los objetivos logrados y el crecimiento de la unidad a través del tiempo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {ciclos.map((c) => {
          const canDelete = perfil?.rol_id === 1 || c.creado_por === perfil?.id
          const uColor = c.unidades?.colores?.primario || '#cb3327'
          return (
            <div 
              key={c.id} 
              onClick={() => setCicloSeleccionado(c)}
              className="group cursor-pointer bg-white dark:bg-black/20 rounded-[2.5rem] border-2 border-zinc-100 dark:border-clr4 p-8 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden flex flex-col justify-between min-h-[250px]"
              style={{ borderColor: 'transparent' }} // Let hover handle it or keep it subtle
            >
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-all">
                <span className="text-8xl">📜</span>
              </div>

              <div className="space-y-4 relative z-10 flex-1">
                <div className="space-y-1">
                  <span className="text-[0.8em] font-medium uppercase opacity-40 tracking-widest">
                    {c.unidades?.nombre} • {c.fecha_inicio ? format(new Date(c.fecha_inicio), 'MMMM yyyy', { locale: es }) : 'Sin fecha'}
                  </span>
                  <h3 className="text-xl font-bold uppercase text-clr5 dark:text-white leading-tight group-hover:text-clr7 transition-colors">
                    {c.nombre}
                  </h3>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-black/40 rounded-2xl border-l-4" style={{ borderLeftColor: uColor }}>
                  <p className="text-[0.9em] italic opacity-80 line-clamp-2">"{c.enfasis}"</p>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-100 dark:border-clr4 flex justify-between items-center relative z-10 mt-4">
                <span className="text-[0.8em] font-bold uppercase text-clr6">Finalizado</span>
                <div className="flex items-center gap-3">
                  {canDelete && (
                    <button
                      onClick={(e) => handleEliminarCiclo(e, c)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-650 text-red-650 hover:text-white dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-900 rounded-lg transition-all text-[0.8em] font-bold"
                      title="Eliminar ciclo del historial"
                    >
                      🗑️ Borrar
                    </button>
                  )}
                  <span className="text-[0.8em] font-medium uppercase opacity-35 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Ver ➜
                  </span>
                </div>
              </div>
            </div>
          )
        })}

        {ciclos.length === 0 && (
          <div className="col-span-full py-24 text-center border-4 border-dashed rounded-[3rem] opacity-30 space-y-4">
            <span className="text-5xl block">📭</span>
            <p className="font-bold uppercase tracking-widest text-[0.9em]">Aún no hay ciclos cerrados en el historial.</p>
          </div>
        )}
      </div>
    </div>
  )
}
