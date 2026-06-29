'use client'

interface ProyectoPaso12ComoLoHicimosProps {
  actividades: any[]
  financiamientoItems: any[]
  evaluacionesAct: Record<string, string>
  setEvaluacionesAct: (val: Record<string, string>) => void
  themePrimary: string
  themeSecondary: string
}

export default function ProyectoPaso12ComoLoHicimos({
  actividades,
  financiamientoItems,
  evaluacionesAct,
  setEvaluacionesAct,
  themePrimary,
  themeSecondary
}: ProyectoPaso12ComoLoHicimosProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 p-2 opacity-60 rounded-[0.8rem]" style={{ backgroundColor: themePrimary }}>
        <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[0.9em] font-bold" style={{ color: themeSecondary }}>12</span>
        <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-white" style={{ color: themeSecondary }}>¿Cómo lo hicimos?</h3>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 min-h-[420px] p-1 font-body">
        {/* Left Column (Desktop) / Top Row (Mobile) */}
        <div className="w-full flex items-center justify-center lg:items-end lg:justify-start">
          <img 
            src="/images/proyectos/ComoLoHicimos2.svg" 
            alt="Ilustración Paso 12" 
            className="block lg:hidden w-full max-h-[160px] object-contain mb-2"
          />
          <img 
            src="/images/proyectos/ComoLoHicimos.svg" 
            alt="Ilustración Paso 12" 
            className="hidden lg:block w-full max-h-[500px] object-contain"
          />
        </div>

        {/* Right Column (Desktop) / Bottom Row (Mobile) */}
        <div className="w-full space-y-2 bg-zinc-50/30 dark:bg-zinc-900/30 p-1 rounded-[1rem] border border-zinc-150 dark:border-white/5 backdrop-blur-xs shadow-md">
          <p className="text-[0.9em] text-zinc-500 font-bold p-1 leading-tight">
            Escribe la co-evaluación del grupo o del Caminante para cada una de las actividades del proyecto.
          </p>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {/* Actividades del paso 7 */}
            {actividades.map((act, index) => (
              <div key={act.id} className="p-2 bg-white dark:bg-zinc-800 border dark:border-white/10 rounded-2xl space-y-2">
                <span className="text-[0.9em] font-black uppercase text-zinc-400">Actividad #{index + 1} del Paso 7</span>
                <h5 className="font-bold text-[0.9em] uppercase text-zinc-850 dark:text-white leading-none">{act.nombre || '(Sin Nombre)'}</h5>
                <textarea 
                  value={evaluacionesAct[act.nombre] || ''}
                  onChange={e => setEvaluacionesAct({ ...evaluacionesAct, [act.nombre]: e.target.value })}
                  placeholder="¿Se cumplieron los objetivos? ¿Qué falló? ¿Qué aprendimos?..."
                  className="w-full p-2 rounded-2xl border-2 border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800 font-bold h-20 text-[0.9em]"
                />
              </div>
            ))}

            {/* Actividades del paso 11 */}
            {financiamientoItems.map((item, index) => (
              <div key={index} className="p-2 bg-white dark:bg-zinc-800 border dark:border-white/10 rounded-2xl space-y-2">
                <span className="text-[0.9em] font-black uppercase text-zinc-400">Actividad de Financiamiento #{index + 1} del Paso 11</span>
                <h5 className="font-bold text-[0.9em] uppercase text-zinc-850 dark:text-white leading-none">{item.nombre || '(Sin Nombre)'}</h5>
                <textarea 
                  value={evaluacionesAct[item.nombre] || ''}
                  onChange={e => setEvaluacionesAct({ ...evaluacionesAct, [item.nombre]: e.target.value })}
                  placeholder="¿Logramos recaudar los fondos estimados? ¿Cuáles fueron las dificultades?..."
                  className="w-full p-2 rounded-2xl border-2 border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800 font-bold h-20 text-[0.9em]"
                />
              </div>
            ))}

            {actividades.length === 0 && financiamientoItems.length === 0 && (
              <p className="text-center py-6 text-zinc-400 font-bold italic text-[0.85em]">No hay actividades de planificación para evaluar en este paso.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
