'use client'

interface CicloFase1LluviaProps {
  perfil: any
  cicloActivo: any
  propuestas: any[]
  readOnlyOverride: boolean
  canManage: boolean
  unitColor: string
  setIsModPropuestaOpen: (open: boolean) => void
  togglePreseleccion: (propId: string, valor: boolean) => void
  eliminarPropuesta: (propId: string) => void
}

export default function CicloFase1Lluvia({
  perfil,
  cicloActivo,
  propuestas,
  readOnlyOverride,
  canManage,
  unitColor,
  setIsModPropuestaOpen,
  togglePreseleccion,
  eliminarPropuesta
}: CicloFase1LluviaProps) {
  const filteredPropuestas = propuestas.filter(p => !p.es_actividad_programada)

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h3 className="text-2xl font-black font-display uppercase tracking-tight text-clr5 dark:text-clr1">Lluvia de Ideas</h3>
          <p className="text-[1rem] opacity-60 font-medium italic">¡Todos pueden proponer actividades para este ciclo!</p>
        </div>
        {cicloActivo.fase_actual === 1 && !readOnlyOverride && (
          <button 
            onClick={() => setIsModPropuestaOpen(true)}
            className="p-2 text-white font-bold uppercase rounded-2xl shadow-lg text-shadow-lg hover:scale-105 active:scale-95 transition-all text-base tracking-widest"
            style={{ backgroundColor: unitColor }}
          >
            💡 Proponer Idea
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPropuestas.map(p => (
          <div 
            key={p.id} 
            className={`p-4 rounded-[1.5rem] bg-white dark:bg-black/20 border-2 transition-all shadow-sm flex flex-col justify-between gap-4 relative overflow-hidden ${
              p.preseleccionada || p.es_grupal_global ? "shadow-lg border-opacity-100" : "opacity-90 border-zinc-100 dark:border-clr4"
            }`} 
            style={{ 
              borderColor: (p.preseleccionada || p.es_grupal_global) ? unitColor : undefined, 
              borderWidth: (p.preseleccionada || p.es_grupal_global) ? "3px" : "2px" 
            }}
          >
            {(cicloActivo?.unidades?.logo_unidad_url || perfil.unidades?.logo_unidad_url) && (
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] pointer-events-none">
                <img 
                  src={cicloActivo?.unidades?.logo_unidad_url || perfil.unidades?.logo_unidad_url} 
                  alt="" 
                  className="w-24 h-24 object-contain grayscale" 
                />
              </div>
            )}
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-[0.8em] font-black uppercase opacity-60 tracking-widest">
                  {p.es_grupal_global ? '📢 Acuerdo de Grupo' : `Idea de ${p.autor?.nombres}`}
                </span>
                {(p.preseleccionada || p.es_grupal_global) && (
                  <span className="px-2 py-0.5 bg-clr6 text-white text-[1em] font-black rounded-md uppercase shadow-sm">
                    {p.es_grupal_global ? 'Confirmada' : 'Preseleccionada'}
                  </span>
                )}
              </div>
              <h4 className="text-xl font-bold uppercase leading-tight text-clr5 dark:text-clr1">{p.titulo}</h4>
              <p className="text-[0.98em] italic opacity-80 line-clamp-3">{p.descripcion}</p>
            </div>
            
            {canManage && cicloActivo.fase_actual === 1 && !p.es_grupal_global && (
              <div className="pt-4 border-t border-zinc-50 dark:border-clr4 flex justify-between items-center">
                <span className="text-[0.9em] font-black uppercase text-clr2">Gestión Admin</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => togglePreseleccion(p.id, !p.preseleccionada)}
                    className={`px-4 py-2 rounded-xl text-[0.9em] font-bold text-shadow-lg uppercase transition-all shadow-sm ${
                      p.preseleccionada ? 'bg-zinc-100 text-clr2 hover:bg-zinc-200' : 'text-white hover:brightness-110'
                    }`}
                    style={{ backgroundColor: p.preseleccionada ? undefined : unitColor }}
                  >
                    {p.preseleccionada ? 'Quitar' : 'Preseleccionar'}
                  </button>
                  <button 
                    onClick={() => eliminarPropuesta(p.id)}
                    className="px-3 py-2 rounded-xl text-[0.9em] font-black uppercase bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    title="Eliminar propuesta"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            )}
            {p.es_grupal_global && (
              <div className="pt-2 text-center opacity-40">
                 <span className="text-[9px] font-black uppercase tracking-tighter italic">Se gestiona desde Actas de Consejo</span>
              </div>
            )}
          </div>
        ))}
        
        {filteredPropuestas.length === 0 && (
          <div className="col-span-full py-20 text-center border-4 border-dashed rounded-[2rem] opacity-20">
            <span className="text-5xl block mb-4">🌪️</span>
            <p className="text-xl font-black uppercase">¡El muro está vacío!</p>
            <p className="font-medium italic">Sé el primero en lanzar una idea.</p>
          </div>
        )}
        {cicloActivo.fase_actual !== 1 && (
           <div className="col-span-full py-4 text-center opacity-30 text-[0.8em] font-black uppercase tracking-widest border-t border-dashed border-zinc-100 mt-4">
             🔒 Modo Lectura (Fase Finalizada)
           </div>
        )}
      </div>
    </div>
  )
}
