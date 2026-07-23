'use client'

import { useState } from 'react'
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import { projectService } from '@/services/projectService'
import { UNIT_IDS } from '@/lib/unit-constants'
import type { Perfil, CicloUnidad, CicloPropuesta } from '@/types'
import { toast } from 'sonner';

/** Parsea fecha "YYYY-MM-DD" como hora local (evita desfase de timezone) */
function parseLocalDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null
  const parts = dateStr.split('-')
  if (parts.length < 3) return null
  const [y, m, d] = parts.map(Number)
  return new Date(y, m - 1, d)
}

interface CicloFase3PlaneacionProps {
  perfil: Perfil
  cicloActivo: CicloUnidad
  propuestas: CicloPropuesta[]
  votos: Array<{ propuesta_id: string; perfil_id: string; cantidad: number }>
  canManage: boolean
  unitColor: string
  setSelectedPropuesta: (prop: CicloPropuesta | null) => void
  setIsModAgendarOpen: (open: boolean) => void
  setIsModVincularArticuloOpen: (open: boolean) => void
  setWizardProyecto: (proj: Record<string, unknown>) => void
  setWizardEsGrupal: (val: boolean) => void
  setIsWizardOpen: (open: boolean) => void
  onUnscheduleProposal: (propId: string) => Promise<void>
}

export default function CicloFase3Planeacion({
  perfil,
  cicloActivo,
  propuestas,
  votos,
  canManage,
  unitColor,
  setSelectedPropuesta,
  setIsModAgendarOpen,
  setIsModVincularArticuloOpen,
  setWizardProyecto,
  setWizardEsGrupal,
  setIsWizardOpen,
  onUnscheduleProposal
}: CicloFase3PlaneacionProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const handleProjectWizardOpen = async (titulo: string) => {
    if (perfil.unidad_id == null) return
    try {
      const existingProj = await projectService.getProjectByTitleAndUnit(titulo, perfil.unidad_id)
      if (existingProj) {
        setWizardProyecto(existingProj)
      } else {
        setWizardProyecto({ titulo })
      }
      setWizardEsGrupal(true)
      setIsWizardOpen(true)
    } catch (err: unknown) {
      toast.error('Error al buscar proyecto: ' + (err instanceof Error ? err.message : String(err)))
    }
  }

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })
    
    const days = eachDayOfInterval({ start: startDate, end: endDate })

    return (
      <div className="bg-white dark:bg-black/20 rounded-3xl p-6 border border-zinc-100 dark:border-clr4 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-6">
          <button 
            type="button"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} 
            className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-clr4 rounded-full transition-colors font-black"
          >
            ❮
          </button>
          <h5 className="font-black uppercase tracking-widest text-[1em] capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </h5>
          <button 
            type="button"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} 
            className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-clr4 rounded-full transition-colors font-black"
          >
            ❯
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'].map(d => (
            <div key={d} className="text-center text-[0.8em] font-black uppercase opacity-40">{d}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd')
            const allActivities = propuestas.filter(p => p.seleccionada && p.fecha_programada === dateStr)
            const isCurrentMonth = isSameMonth(day, monthStart)
            const isToday = isSameDay(day, new Date())
            const hasGrupal = allActivities.some(p => p.es_grupal_global)
            
            return (
              <div 
                key={day.toString()} 
                className={`aspect-square flex flex-col items-center justify-center rounded-2xl text-[0.8em] relative group transition-all ${
                  !isCurrentMonth ? 'text-zinc-300 dark:text-zinc-600' : 'font-bold'
                } ${
                  isToday ? 'bg-zinc-100 dark:bg-clr4 border-2 border-zinc-200 dark:border-clr3' : 'border-2 border-transparent hover:border-zinc-100 dark:hover:border-clr4'
                } ${
                  allActivities.length > 0 ? 'cursor-pointer hover:scale-110 shadow-sm' : ''
                } ${hasGrupal ? 'ring-2 ring-red-500/50 bg-red-50/30' : ''}`}
              >
                <span>{format(day, 'd')}</span>
                {allActivities.length > 0 && (
                  <div className="absolute bottom-1.5 flex gap-1">
                    {allActivities.map(a => (
                      <div 
                        key={a.id} 
                        className="w-1.5 h-1.5 rounded-full" 
                        style={{ backgroundColor: a.es_especialidad ? '#a855f7' : unitColor }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const proposalsPending = propuestas.filter(p => p.preseleccionada && !p.seleccionada)
  const proposalsScheduled = propuestas.filter(p => p.seleccionada && p.fecha_programada)

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1 text-center md:text-left">
        <h3 className="text-2xl font-black font-display uppercase tracking-tight text-clr5 dark:text-clr1">Organización y Diseño</h3>
        <p className="text-sm opacity-80 font-medium italic font-body">
          Las actividades más votadas deben ser planificadas y agendadas en el calendario.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PANEL IZQUIERDO: Resultados del Juego Democrático */}
        <div className="space-y-6">
          <h4 className="text-[1em] font-bold opacity-40 font-body">Resultados de Votación (Pendientes)</h4>
          <div className="grid gap-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {proposalsPending
              .sort((a, b) => {
                const votosA = votos.filter(v => v.propuesta_id === a.id).length
                const votosB = votos.filter(v => v.propuesta_id === b.id).length
                return votosB - votosA
              })
              .map((p, index) => {
                const totalVotos = votos.filter(v => v.propuesta_id === p.id).reduce((acc, v) => acc + (v.cantidad || 0), 0)
                return (
                  <div key={p.id} className="p-2 rounded-3xl bg-white dark:bg-black/20 border border-zinc-100 dark:border-clr4 shadow-sm flex items-center justify-between gap-4 font-body">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-inner shrink-0" style={{ backgroundColor: unitColor }}>
                        {index + 1}º
                      </div>
                      <div>
                        <h5 className="font-bold text-[1em] uppercase leading-tight text-clr5 dark:text-clr1">{p.titulo}</h5>
                        <p className="text-[0.8em] opacity-60 font-black mt-1">{totalVotos} Voto{totalVotos !== 1 && 's'}</p>
                      </div>
                    </div>
                    {canManage && cicloActivo.fase_actual === 3 && (
                      <button 
                        onClick={() => { setSelectedPropuesta(p); setIsModAgendarOpen(true); }}
                        className="p-2 bg-clr7 text-white text-[0.9em] font-bold uppercase rounded-xl hover:scale-105 transition-all shadow-md shrink-0 border-none"
                      >
                        Agendar
                      </button>
                    )}
                  </div>
                )
              })}
            {proposalsPending.length === 0 && (
              <div className="py-10 text-center border-2 border-dashed rounded-3xl opacity-30">
                <p className="text-[0.8em] font-black uppercase font-body">No hay propuestas pendientes de agendar.</p>
              </div>
            )}
          </div>
        </div>

        {/* PANEL DERECHO: Calendario de Actividades Planificadas */}
        <div className="space-y-2">
          {renderCalendar()}
          
          <h4 className="text-[1em] font-black uppercase tracking-widest opacity-40 font-body">Calendario Detallado del Ciclo</h4>
          <div className="grid gap-2">
            {proposalsScheduled
              .sort((a, b) => (parseLocalDate(a.fecha_programada)?.getTime() ?? 0) - (parseLocalDate(b.fecha_programada)?.getTime() ?? 0))
              .map(p => {
                const isGrupalFromActa = p.es_grupal_global && p.fichas_vinculadas && p.fichas_vinculadas.length > 0
                return (
                <div key={p.id} className={`p-4 rounded-3xl border-2 shadow-sm flex flex-col gap-4 relative overflow-hidden group font-body ${
                  p.es_grupal_global 
                    ? 'border-clr8/30' 
                    : 'bg-white dark:bg-black/20 border-green-500/20'
                }`} style={p.es_grupal_global ? {
                  background: 'linear-gradient(to right, var(--clr7, #1e3a5f), var(--clr4, #4a7c59))',
                  color: 'var(--clr8, #ffffff)'
                } : undefined}>
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <span className="text-6xl">📅</span>
                  </div>
                  
                  <div className="flex justify-between items-start z-10">
                    <div>
                      <span className={`text-[0.9em] font-bold uppercase ${p.es_grupal_global ? 'opacity-80' : 'text-clr2'}`}>
                        {parseLocalDate(p.fecha_programada)?.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' }) || '—'}
                      </span>
                      <h5 className={`font-bold text-lg uppercase leading-none mt-1 ${p.es_grupal_global ? '' : 'text-clr5 dark:text-clr1'}`}>{p.titulo}</h5>
                      {p.fichas_vinculadas && p.fichas_vinculadas.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {p.fichas_vinculadas.map((f: any) => (
                            <a key={f.id} href={`/blog/actividades/${f.slug}`} target="_blank"
                               className={`px-2 py-0.5 rounded-full text-[0.7em] font-bold ${
                                 p.es_grupal_global ? 'bg-white/20 hover:bg-white/30' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                               }`}>
                              📋 {f.titulo}
                            </a>
                          ))}
                        </div>
                      )}
                      {p.es_especialidad && p.autor && (
                        <p className="text-[0.8em] font-semibold text-purple-650 dark:text-purple-300 mt-1.5 uppercase tracking-wider">
                          Scout: {p.autor.nombres} {p.autor.apellidos}
                        </p>
                      )}
                      {p.es_grupal_global && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 rounded-full text-[0.7em] font-bold uppercase">👥 Actividad Grupal</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between z-10 border-t border-white/10 pt-4">
                    {p.es_actividad_programada ? (
                      <div className="flex items-center gap-2">
                        <span 
                          className="px-2.5 py-0.5 rounded-full text-[0.8em] font-extrabold uppercase shadow-sm border text-white"
                          style={{ backgroundColor: p.es_especialidad ? '#a855f7' : unitColor }}
                        >
                          {p.es_especialidad ? '🎖️ Especialidad' : '📅 Unidad'}
                        </span>
                      </div>
                    ) : p.articulo ? (
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-[0.8em] font-bold uppercase">Planificada</span>
                        <a href={`/blog/actividades/${p.articulo.slug}`} target="_blank" className="text-[1em] font-bold underline hover:text-clr7 transition-colors">
                          Ver Ficha
                        </a>
                      </div>
                    ) : p.es_grupal_global ? (
                      /* Actividad grupal de acta — sin botones de edición */
                      <div className="flex items-center gap-2">
                        {p.fichas_vinculadas && p.fichas_vinculadas.length > 0 ? (
                          <span className="px-2 py-1 bg-white/20 rounded-md text-[0.8em] font-bold uppercase">✅ Vinculada</span>
                        ) : (
                          <span className="px-2 py-1 bg-white/10 rounded-md text-[0.8em] font-bold uppercase opacity-60">Sin ficha</span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-[0.8em] font-bold uppercase animate-pulse">Falta Ficha</span>
                        {canManage && cicloActivo.fase_actual === 3 && (
                          <button onClick={() => { setSelectedPropuesta(p); setIsModVincularArticuloOpen(true); }} className="text-[0.9em] font-bold text-clr6 hover:underline uppercase border-none bg-transparent">
                            Vincular
                          </button>
                        )}
                      </div>
                    )}
                    
                    <div className="flex gap-4 items-center">
                      {perfil?.unidad_id != null && (perfil.unidad_id === UNIT_IDS.AVANZADA || perfil.unidad_id === UNIT_IDS.CLAN) && !p.es_grupal_global && (
                        <button
                          onClick={() => handleProjectWizardOpen(p.titulo)}
                          className="text-[0.8em] font-black uppercase text-blue-600 hover:text-blue-700 transition-colors border-none bg-transparent"
                        >
                          📋 Proyecto {perfil.unidad_id === UNIT_IDS.AVANZADA ? 'Empresa' : '12 Pasos'}
                        </button>
                      )}

                      {canManage && cicloActivo.fase_actual === 3 && !p.es_actividad_programada && !p.es_grupal_global && (
                        <button 
                          onClick={() => onUnscheduleProposal(p.id)}
                          className="text-[0.8em] opacity-60 hover:opacity-100 hover:text-red-500 transition-colors uppercase font-bold border-none bg-transparent"
                        >
                          Desagendar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                )
              })}
            {proposalsScheduled.length === 0 && (
              <div className="py-20 text-center border-2 border-dashed border-green-500/30 rounded-[2rem] opacity-60 bg-green-50/10">
                <span className="text-4xl block mb-2">🗓️</span>
                <p className="text-[0.8em] font-black uppercase tracking-widest text-green-700 dark:text-green-400">Aún no hay actividades agendadas</p>
              </div>
            )}
          </div>
        </div>
        {cicloActivo.fase_actual > 3 && (
           <div className="col-span-full py-4 text-center opacity-30 text-[0.8em] font-black uppercase tracking-widest border-t border-dashed border-zinc-100 mt-4">
             🔒 Modo Lectura (Calendario Cerrado)
           </div>
        )}
      </div>
    </div>
  )
}
