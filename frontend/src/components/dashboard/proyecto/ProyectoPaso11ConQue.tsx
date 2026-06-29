'use client'

interface ProyectoPaso11ConQueProps {
  financiamientoItems: any[]
  addFinanciamiento: () => void
  removeFinanciamiento: (idx: number) => void
  updateFinanciamiento: (idx: number, field: string, val: string) => void
  themePrimary: string
  themeSecondary: string
}

export default function ProyectoPaso11ConQue({
  financiamientoItems,
  addFinanciamiento,
  removeFinanciamiento,
  updateFinanciamiento,
  themePrimary,
  themeSecondary
}: ProyectoPaso11ConQueProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 p-2 opacity-60 rounded-[0.8rem]" style={{ backgroundColor: themePrimary }}>
        <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[0.9em] font-bold" style={{ color: themeSecondary }}>11</span>
        <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-white" style={{ color: themeSecondary }}>¿Con Qué?</h3>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 min-h-[420px] p-1 font-body">
        {/* Left Column (Desktop) / Top Row (Mobile) */}
        <div className="w-full flex items-center justify-center lg:items-end lg:justify-start">
          <img 
            src="/images/proyectos/ConQue2.svg" 
            alt="Ilustración Paso 11" 
            className="block lg:hidden w-full max-h-[160px] object-contain mb-2"
          />
          <img 
            src="/images/proyectos/ConQue.svg" 
            alt="Ilustración Paso 11" 
            className="hidden lg:block w-full max-h-[500px] object-contain"
          />
        </div>

        {/* Right Column (Desktop) / Bottom Row (Mobile) */}
        <div className="w-full space-y-2 bg-zinc-50/30 dark:bg-zinc-900/30 p-1 rounded-[1rem] border border-zinc-150 dark:border-white/5 backdrop-blur-xs shadow-md">
          <div className="flex justify-end p-1">
            <button 
              type="button" 
              onClick={addFinanciamiento}
              className="px-3 py-1.5 rounded-xl text-[0.8em] font-black uppercase hover:brightness-110 shadow-sm border-none bg-transparent"
              style={{ backgroundColor: themePrimary, color: themeSecondary }}
            >
              ➕ Actividad Económica
            </button>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {financiamientoItems.map((item, idx) => (
              <div key={idx} className="p-2 bg-white dark:bg-zinc-800 border dark:border-white/10 rounded-2xl space-y-2 relative">
                <button 
                  type="button" 
                  onClick={() => removeFinanciamiento(idx)}
                  className="absolute top-1 right-2 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-950/20 px-2 py-0.5 rounded-xl text-[0.8em] border-none bg-transparent"
                >
                  ✕ Quitar
                </button>
                
                <span className="text-[0.8em] font-black uppercase tracking-wider text-zinc-400">Financiamiento #{idx + 1}</span>
                
                <div className="space-y-1">
                  <label className="text-[0.8em] md:text-[0.9em] font-bold uppercase ml-1 p-1 rounded-[0.6rem] text-center" style={{ backgroundColor: themePrimary, color: themeSecondary }}>Actividad Económica</label>
                  <input 
                    type="text" 
                    value={item.nombre || ''}
                    onChange={e => updateFinanciamiento(idx, 'nombre', e.target.value)}
                    placeholder="Ej: Rifas, Venta de Completos..."
                    className="w-full p-2 rounded-2xl border-2 border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800 font-bold text-[0.9em]"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[0.8em] md:text-[0.9em] font-bold uppercase ml-1 p-1 rounded-[0.6rem] text-center" style={{ backgroundColor: themePrimary, color: themeSecondary }}>Lugar</label>
                  <input 
                    type="text" 
                    value={item.lugar || ''}
                    onChange={e => updateFinanciamiento(idx, 'lugar', e.target.value)}
                    placeholder="Ej: Patio del Colegio..."
                    className="w-full p-2 rounded-2xl border-2 border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800 font-bold text-[0.9em]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[0.8em] md:text-[0.9em] font-bold uppercase ml-1 p-1 rounded-[0.6rem] text-center" style={{ backgroundColor: themePrimary, color: themeSecondary }}>Recursos Necesarios</label>
                  <input 
                    type="text" 
                    value={item.recursos || ''}
                    onChange={e => updateFinanciamiento(idx, 'recursos', e.target.value)}
                    placeholder="Ej: Ingredientes, Folletos..."
                    className="w-full p-2 rounded-2xl border-2 border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800 font-bold text-[0.9em]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[0.8em] md:text-[0.9em] font-bold uppercase ml-1 p-1 rounded-[0.6rem] text-center" style={{ backgroundColor: themePrimary, color: themeSecondary }}>Fecha Estimada</label>
                  <input 
                    type="date" 
                    value={item.fecha || ''}
                    onChange={e => updateFinanciamiento(idx, 'fecha', e.target.value)}
                    className="w-full p-2 rounded-2xl border-2 border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800 font-bold text-[0.9em] text-center"
                  />
                </div>
              </div>
            ))}

            {financiamientoItems.length === 0 && (
              <p className="text-center py-6 text-zinc-400 font-bold italic text-[0.85em]">No has agregado ninguna actividad económica para financiamiento.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
