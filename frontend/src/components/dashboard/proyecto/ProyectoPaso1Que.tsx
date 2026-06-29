'use client'

interface ProyectoPaso1QueProps {
  formData: any
  setFormData: (data: any) => void
  competenciasAsociadas: string[]
  setCompetenciasAsociadas: (comps: string[]) => void
  perfil: any
  themePrimary: string
  themeSecondary: string
}

export default function ProyectoPaso1Que({
  formData,
  setFormData,
  competenciasAsociadas,
  setCompetenciasAsociadas,
  perfil,
  themePrimary,
  themeSecondary
}: ProyectoPaso1QueProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 p-2 opacity-60 rounded-[0.8rem]" style={{ backgroundColor: themePrimary }}>
        <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[0.9em] font-bold" style={{ color: themeSecondary }}>1</span>
        <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-white" style={{ color: themeSecondary }}>¿Qué Haremos?</h3>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 min-h-[420px] p-1 font-body">
        {/* Left Column (Desktop) / Top Row (Mobile) */}
        <div className="w-full flex items-center justify-center lg:items-end lg:justify-start">
          <img 
            src="/images/proyectos/QueHaremos2.svg" 
            alt="Ilustración Paso 1" 
            className="block lg:hidden w-full max-h-[160px] object-contain mb-2"
          />
          <img 
            src="/images/proyectos/QueHaremos.svg" 
            alt="Ilustración Paso 1" 
            className="hidden lg:block w-full max-h-[500px] object-contain"
          />
        </div>

        {/* Right Column (Desktop) / Bottom Row (Mobile) */}
        <div className="w-full space-y-2 bg-zinc-50/30 dark:bg-zinc-900/30 p-1 rounded-[1rem] border border-zinc-150 dark:border-white/5 backdrop-blur-xs shadow-md">
          <div className="space-y-1">
            <label className="text-[0.8em] md:text-[0.9em] font-bold uppercase ml-1 p-1 rounded-[0.6rem] text-center" style={{ backgroundColor: themePrimary, color: themeSecondary }}>Nombre del Proyecto</label>
            <input 
              type="text" 
              value={formData.titulo || ''}
              onChange={e => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Ej: Misión Reforestación"
              className="w-full p-2 rounded-2xl border-2 border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800 font-bold text-[0.9em]"
            />
          </div>

          {perfil.unidad_id === 5 && (
            <div className="space-y-1">
              <label className="text-[0.8em] md:text-[0.9em] font-bold uppercase text-zinc-500 ml-1 p-1 rounded-[0.6rem]" style={{ backgroundColor: themePrimary }}>Campo de Acción</label>
              <select 
                value={formData.campo_prioritario || ''}
                onChange={e => setFormData({ ...formData, campo_prioritario: e.target.value })}
                className="w-full p-1 rounded-2xl border-2 border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800 font-bold uppercase tracking-tight text-[0.8em]"
              >
                <option value="">Seleccionar campo de acción...</option>
                <option value="servicio">Servicio Comunitario</option>
                <option value="naturaleza">Naturaleza y Ecología</option>
                <option value="trabajo">Trabajo y Vocación</option>
                <option value="viaje">Viaje y Exploración</option>
              </select>
            </div>
          )}
          
          {perfil.unidad_id === 4 && (
            <div className="space-y-1">
              <label className="text-[0.8em] md:text-[0.9em] font-bold uppercase text-zinc-500 ml-1 p-1 rounded-[0.6rem]" style={{ backgroundColor: themePrimary, color: themeSecondary }}>Competencias</label>
              <select 
                value=""
                onChange={e => {
                  const val = e.target.value
                  if (val && !competenciasAsociadas.includes(val)) {
                    setCompetenciasAsociadas([...competenciasAsociadas, val])
                  }
                }}
                className="w-full p-2 rounded-2xl border-2 border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800 font-bold uppercase tracking-tight text-[0.8em]"
              >
                <option value="">Seleccionar competencia...</option>
                <option value="cultura">🎭 Cultura</option>
                <option value="actividad_fisica">🏃 Actividad Física</option>
                <option value="trabajo_equipo">🤝 Trabajo en Equipo</option>
                <option value="innovacion">🚀 Innovación</option>
                <option value="comunicacion">📣 Comunicación</option>
                <option value="ciudadania">🗳️ Ciudadanía</option>
                <option value="medioambiente">🌿 Medioambiente</option>
              </select>

              {/* Mostrar tags seleccionados */}
              {competenciasAsociadas.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 ml-2">
                  {competenciasAsociadas.map(comp => (
                    <span 
                      key={comp}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.8em] font-black uppercase text-white shadow-sm"
                      style={{ backgroundColor: themePrimary }}
                    >
                      {comp.replace('_', ' ')}
                      <button 
                        type="button" 
                        onClick={() => setCompetenciasAsociadas(competenciasAsociadas.filter(c => c !== comp))}
                        className="w-4 h-4 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-[0.8em] font-bold"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[0.8em] md:text-[0.9em] font-black uppercase tracking-wider text-zinc-400 ml-1 p-1 rounded-[0.6rem]" style={{ backgroundColor: themePrimary, color: themeSecondary }}>Describe tu Proyecto</label>
            <textarea 
              value={formData.paso1_que_haremos || ''}
              onChange={e => setFormData({ ...formData, paso1_que_haremos: e.target.value })}
              placeholder="Describe de forma simple y soñadora el cambio..."
              className="w-full p-2 rounded-2xl border-2 border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800 font-bold h-28 text-[0.9em]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
