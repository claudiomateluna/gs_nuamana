'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import DashCiclo from './sp_ciclo_activo'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface DashCiclosOtrosProps {
  perfil: any
}

export default function DashCiclosOtros({ perfil }: DashCiclosOtrosProps) {
  const [ciclos, setCiclos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCicloId, setSelectedCicloId] = useState<string | null>(null)

  useEffect(() => {
    const fetchCiclos = async () => {
      setLoading(true)
      try {
        let query = supabase
          .from('ciclos_unidad')
          .select('id, nombre, fase_actual, diagnostico, enfasis, created_at, unidades(id, nombre, colores)')
          .eq('estado', 'activo')

        if (perfil?.unidad_id) {
          query = query.neq('unidad_id', perfil.unidad_id)
        }

        const { data, error } = await query.order('created_at', { ascending: false })

        if (error) throw error
        setCiclos(data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (perfil) {
      fetchCiclos()
    }
  }, [perfil])

  if (selectedCicloId) {
    return (
      <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
        <button 
          onClick={() => setSelectedCicloId(null)}
          className="flex items-center gap-2 px-6 py-3 bg-zinc-100 dark:bg-black/20 text-clr2 font-black uppercase rounded-2xl hover:bg-zinc-200 transition-all tracking-widest text-xs"
        >
          <span>❮</span> Volver a Otros Ciclos
        </button>
        <DashCiclo perfil={perfil} cicloIdOverride={selectedCicloId} readOnlyOverride={true} />
      </div>
    )
  }

  if (loading) {
    return <div className="p-20 text-center animate-pulse uppercase tracking-widest text-[0.8em]">Buscando Ciclos en otras Ramas...</div>
  }

  if (ciclos.length === 0) {
    return (
      <div className="py-20 text-center border-4 border-dashed border-zinc-100 dark:border-clr4 rounded-[2rem] space-y-4 opacity-40">
        <span className="text-6xl block">🏕️</span>
        <h3 className="text-xl font-black uppercase tracking-widest">No hay otros ciclos activos</h3>
        <p className="font-medium italic">Las demás unidades aún no han iniciado su aventura.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
      {ciclos.map(ciclo => {
        const unitColor = ciclo.unidades?.colores?.primario || '#cb3327'
        return (
          <div 
            key={ciclo.id}
            onClick={() => setSelectedCicloId(ciclo.id)}
            className="group cursor-pointer p-6 rounded-[2rem] bg-white dark:bg-black/20 border-2 border-zinc-100 dark:border-clr4 shadow-sm hover:shadow-xl hover:border-transparent transition-all overflow-hidden relative flex flex-col justify-between min-h-[220px]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-bl-[100%] transition-all group-hover:scale-110" style={{ backgroundColor: unitColor }} />
            
            <div className="space-y-2 relative z-10">
              <span 
                className="px-3 py-1 text-[1em] font-black uppercase rounded-md tracking-widest text-white"
                style={{ backgroundColor: unitColor }}
              >
                {ciclo.unidades?.nombre} • Fase {ciclo.fase_actual}
              </span>
              <h4 className="text-2xl font-black font-display uppercase tracking-tight text-clr5 dark:text-clr1 group-hover:text-clr7 transition-colors">
                {ciclo.nombre}
              </h4>
              <p className="text-normal opacity-60 italic font-medium line-clamp-3">
                "{ciclo.enfasis || ciclo.diagnostico}"
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-50 dark:border-clr4 flex justify-between items-center relative z-10">
              <span className="text-[0.9em] font-bold uppercase tracking-widest opacity-40">
                Iniciado en {format(new Date(ciclo.created_at), 'MMMM yyyy', { locale: es })}
              </span>
              <span 
                className="text-[0.9em] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform"
                style={{ color: unitColor }}
              >
                Ver Ciclo ❯
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
