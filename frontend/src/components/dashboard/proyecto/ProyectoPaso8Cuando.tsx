'use client'

import { useState } from 'react'
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'

interface ProyectoPaso8CuandoProps {
  actividades: any[]
  updateActividad: (id: string, field: string, val: string) => void
  cicloActividades: any[]
  otrosProyectosActividades: any[]
  themePrimary: string
  themeSecondary: string
}

export default function ProyectoPaso8Cuando({
  actividades,
  updateActividad,
  cicloActividades,
  otrosProyectosActividades,
  themePrimary,
  themeSecondary
}: ProyectoPaso8CuandoProps) {
  const [calendarMonth, setCalendarMonth] = useState(new Date())

  const renderProyectoCalendar = () => {
    const monthStart = startOfMonth(calendarMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })
    
    const days = eachDayOfInterval({ start: startDate, end: endDate })

    return (
      <div className="bg-white dark:bg-zinc-950/20 rounded-3xl p-4 border border-zinc-150 dark:border-white/5 shadow-inner w-full">
        <div className="flex justify-between items-center mb-4">
          <button 
            type="button"
            onClick={() => setCalendarMonth(subMonths(calendarMonth, 1))} 
            className="w-7 h-7 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-[0.9em] font-bold text-zinc-500 border-none bg-transparent"
          >
            ❮
          </button>
          <h5 className="font-black uppercase tracking-wider text-[0.8em] text-zinc-700 dark:text-zinc-300 capitalize">
            {format(calendarMonth, 'MMMM yyyy', { locale: es })}
          </h5>
          <button 
            type="button"
            onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))} 
            className="w-7 h-7 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-[0.9em] font-bold text-zinc-500 border-none bg-transparent"
          >
            ❯
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1.5 mb-1.5">
          {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'].map(d => (
            <div key={d} className="text-center text-[0.8em] font-black uppercase opacity-40 text-zinc-500">{d}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd')
            
            // Actividades del proyecto actual
            const currentActs = actividades.filter(act => act.fecha === dateStr).map(act => ({
              ...act,
              tipoItem: 'actual',
              color: themePrimary,
              label: act.nombre || '(Sin Nombre)'
            }))
            
            // Actividades del ciclo / acuerdos de acta
            const cycleActs = cicloActividades.filter(act => act.fecha === dateStr).map(act => ({
              ...act,
              tipoItem: 'ciclo',
              color: '#16a34a', // Verde
              label: act.titulo
            }))
            
            // Actividades de otros proyectos (individuales o colectivos)
            const otherProjActs = otrosProyectosActividades.filter(act => act.fecha === dateStr).map(act => ({
              ...act,
              tipoItem: 'otro_proyecto',
              color: '#4f46e5', // Indigo
              label: `${act.proyectoTitulo}: ${act.nombre}`
            }))
            
            const allDayItems = [...currentActs, ...cycleActs, ...otherProjActs]
            
            const isCurrentMonth = isSameMonth(day, monthStart)
            const isToday = isSameDay(day, new Date())
            
            let bgClass = ''
            let borderClass = 'border-transparent'
            
            if (allDayItems.length > 0) {
              const hasActual = currentActs.length > 0
              const hasCiclo = cycleActs.length > 0
              const hasOtro = otherProjActs.length > 0
              
              if (hasActual) {
                bgClass = 'bg-red-500/10 dark:bg-red-500/5'
                borderClass = 'border-red-500/30 dark:border-red-500/20'
              } else if (hasCiclo) {
                bgClass = 'bg-green-500/10 dark:bg-green-500/5'
                borderClass = 'border-green-500/30 dark:border-green-500/20'
              } else if (hasOtro) {
                bgClass = 'bg-indigo-500/10 dark:bg-indigo-500/5'
                borderClass = 'border-indigo-500/30 dark:border-indigo-500/20'
              }
            }
            
            return (
              <div 
                key={day.toString()} 
                className={`aspect-square flex flex-col items-center justify-center rounded-xl text-[0.8em] relative group transition-all ${
                  !isCurrentMonth ? 'text-zinc-300 dark:text-zinc-600' : 'font-bold text-zinc-800 dark:text-zinc-200'
                } ${isToday ? 'bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-white/10' : `border ${borderClass} hover:border-zinc-100 dark:hover:border-white/5`} ${bgClass}`}
              >
                <span>{format(day, 'd')}</span>
                {allDayItems.length > 0 && (
                  <div className="absolute bottom-1 flex gap-0.5 justify-center flex-wrap px-0.5 max-w-full">
                    {allDayItems.map((a, i) => (
                      <div 
                        key={i} 
                        className="w-1.5 h-1.5 rounded-full shrink-0" 
                        style={{ backgroundColor: a.color }} 
                      />
                    ))}
                  </div>
                )}
                {allDayItems.length > 0 && (
                  <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-zinc-950 text-white text-[0.8em] rounded-xl shadow-xl z-[100] animate-in fade-in zoom-in duration-200 pointer-events-none text-left">
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-950 rotate-45" />
                    {allDayItems.map((a, idx) => (
                      <div key={idx} className="mb-1.5 last:mb-0 border-l-2 pl-1.5" style={{ borderColor: a.color }}>
                        <span className="text-[0.8em] font-black uppercase tracking-wider block opacity-70">
                          {a.tipoItem === 'actual' ? 'Este Proyecto' : a.tipoItem === 'ciclo' ? 'Ciclo / Acta' : 'Otro Proyecto'}
                        </span>
                        <strong className="block leading-tight text-white">
                          {a.label}
                        </strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Leyenda */}
        <div className="mt-4 pt-3 border-t border-zinc-150 dark:border-white/5 flex flex-wrap gap-x-4 gap-y-1.5 justify-center text-[0.8em] font-black uppercase tracking-wider text-zinc-500">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: themePrimary }} />
            <span>Este Proyecto</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
            <span>Ciclo / Acta Grupal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
            <span>Otros Proyectos</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 p-2 opacity-60 rounded-[0.8rem]" style={{ backgroundColor: themePrimary }}>
        <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[0.9em] font-bold" style={{ color: themeSecondary }}>8</span>
        <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-white" style={{ color: themeSecondary }}>¿Cuándo?</h3>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 min-h-[420px] p-1 font-body">
        {/* Left Column (Desktop) / Top Row (Mobile) */}
        <div className="w-full flex items-center justify-center lg:items-start lg:justify-start">
          <img 
            src="/images/proyectos/Cuando2.svg" 
            alt="Ilustración Paso 8" 
            className="block lg:hidden w-full max-h-[160px] object-contain mb-2"
          />
          <img 
            src="/images/proyectos/Cuando.svg" 
            alt="Ilustración Paso 8" 
            className="hidden lg:block w-full max-h-[500px] object-contain"
          />
        </div>

        {/* Right Column (Desktop) / Bottom Row (Mobile) */}
        <div className="w-full space-y-2 bg-zinc-50/30 dark:bg-zinc-900/30 p-1 rounded-[1rem] border border-zinc-150 dark:border-white/5 backdrop-blur-xs shadow-md">
          {renderProyectoCalendar()}

          <p className="text-[0.8em] text-zinc-500 font-bold p-1 leading-tight mt-2">
            Calendariza las actividades. Se reflejarán en el calendario de la unidad.
          </p>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {actividades.map((act, index) => (
              <div key={act.id} className="p-2 bg-white dark:bg-zinc-800 border dark:border-white/10 rounded-xl flex flex-col gap-2">
                <div>
                  <span className="text-[0.8em] font-black uppercase text-zinc-400">Actividad #{index + 1}</span>
                  <h5 className="font-bold text-[0.85em] text-zinc-850 dark:text-white uppercase leading-none">{act.nombre || '(Sin Nombre)'}</h5>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-[0.8em] font-bold uppercase ml-1 p-0.5 rounded-[0.4rem]" style={{ backgroundColor: themePrimary, color: themeSecondary }}>Fecha</label>
                  <input 
                    type="date" 
                    value={act.fecha || ''}
                    onChange={e => updateActividad(act.id, 'fecha', e.target.value)}
                    className="flex-1 p-2 bg-zinc-50 dark:bg-zinc-900 rounded-xl border dark:border-white/10 text-[0.85em] font-bold text-center"
                  />
                </div>
              </div>
            ))}

            {actividades.length === 0 && (
              <p className="text-center py-6 text-zinc-400 font-bold italic text-[0.85em]">Debes agregar actividades en el Paso 7 antes de calendarizar.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
