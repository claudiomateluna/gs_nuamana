'use client'

import { projectService } from '@/services/projectService'

interface ProyectoPaso7CualesProps {
  actividades: any[]
  addActividad: () => void
  removeActividad: (id: string) => void
  updateActividad: (id: string, field: string, val: string) => void
  articulosActividades: any[]
  setArticulosActividades: (articles: any[]) => void
  miUnidad: any
  themePrimary: string
  themeSecondary: string
}

export default function ProyectoPaso7Cuales({
  actividades,
  addActividad,
  removeActividad,
  updateActividad,
  articulosActividades,
  setArticulosActividades,
  miUnidad,
  themePrimary,
  themeSecondary
}: ProyectoPaso7CualesProps) {

  const handleRefreshArticles = async () => {
    try {
      const articles = await projectService.getArticlesForWizard()
      setArticulosActividades(articles)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 p-2 opacity-60 rounded-[0.8rem]" style={{ backgroundColor: themePrimary }}>
        <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[0.9em] font-bold" style={{ color: themeSecondary }}>7</span>
        <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-white" style={{ color: themeSecondary }}>¿Cuáles Actividades?</h3>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 min-h-[420px] p-1 font-body">
        {/* Left Column (Desktop) / Top Row (Mobile) */}
        <div className="w-full flex items-center justify-center lg:items-end lg:justify-start">
          <img 
            src="/images/proyectos/Cuales2.svg" 
            alt="Ilustración Paso 7" 
            className="block lg:hidden w-full max-h-[160px] object-contain mb-2"
          />
          <img 
            src="/images/proyectos/Cuales.svg" 
            alt="Ilustración Paso 7" 
            className="hidden lg:block w-full max-h-[500px] object-contain"
          />
        </div>

        {/* Right Column (Desktop) / Bottom Row (Mobile) */}
        <div className="w-full space-y-2 bg-zinc-50/30 dark:bg-zinc-900/30 p-1 rounded-[1rem] border border-zinc-150 dark:border-white/5 backdrop-blur-xs shadow-md">
          <div className="flex justify-end p-1">
            <button 
              type="button" 
              onClick={addActividad}
              className="px-3 py-1.5 rounded-xl text-[0.8em] font-black uppercase hover:brightness-110 shadow-sm border-none"
              style={{ backgroundColor: themePrimary, color: themeSecondary }}
            >
              ➕ Agregar Actividad
            </button>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {actividades.map((act, index) => (
              <div key={act.id} className="p-2 bg-white dark:bg-zinc-800 rounded-2xl border dark:border-white/10 space-y-2 relative">
                <button 
                  type="button" 
                  onClick={() => removeActividad(act.id)}
                  className="absolute top-1 right-2 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-950/20 px-2 py-0.5 rounded-xl text-[0.8em] border-none bg-transparent"
                >
                  ✕ Quitar
                </button>
                
                <span className="text-[0.8em] font-black uppercase tracking-wider text-zinc-400">Actividad #{index + 1}</span>
                
                <div className="space-y-1">
                  <label className="text-[0.8em] font-bold uppercase ml-1 p-0.5 rounded-[0.4rem]" style={{ backgroundColor: themePrimary, color: themeSecondary }}>Nombre</label>
                  <input 
                    type="text"
                    value={act.nombre || ''}
                    onChange={e => updateActividad(act.id, 'nombre', e.target.value)}
                    placeholder="Ej: Jornada Reforestación 1"
                    className="w-full p-2 bg-zinc-50 dark:bg-zinc-900 rounded-xl border dark:border-white/10 text-[0.85em] font-bold"
                  />
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[0.8em] font-bold uppercase p-0.5 rounded-[0.4rem]" style={{ backgroundColor: themePrimary, color: themeSecondary }}>Vincular a Ficha (Opcional)</label>
                    <div className="flex gap-2">
                      <a 
                        href={`/blog/crear?categoria=1&unidad=${miUnidad?.nombre || ''}`} 
                        target="_blank" 
                        className="text-[0.8em] font-bold text-blue-600 dark:text-blue-400 hover:underline uppercase flex items-center gap-0.5"
                        title="Redactar una nueva ficha de actividad en una pestaña nueva"
                      >
                        ✍️ Redactar
                      </a>
                      <button
                        type="button"
                        onClick={handleRefreshArticles}
                        className="text-[0.8em] font-bold text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 uppercase flex items-center gap-0.5 border-none bg-transparent"
                        title="Actualizar la lista de fichas disponibles"
                      >
                        🔄 Refrescar
                      </button>
                    </div>
                  </div>
                  <select 
                    value={act.articulo_id || ''}
                    onChange={e => updateActividad(act.id, 'articulo_id', e.target.value)}
                    className="w-full p-2 bg-zinc-50 dark:bg-zinc-900 rounded-xl border dark:border-white/10 text-[0.8em] font-bold uppercase tracking-tight"
                  >
                    <option value="">Ninguno</option>
                    {articulosActividades.map(art => (
                      <option key={art.id} value={art.id}>{art.titulo}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[0.8em] font-bold uppercase ml-1 p-0.5 rounded-[0.4rem]" style={{ backgroundColor: themePrimary, color: themeSecondary }}>Tareas</label>
                  <textarea
                    value={act.descripcion || ''}
                    onChange={e => updateActividad(act.id, 'descripcion', e.target.value)}
                    placeholder="Qué se hará..."
                    className="w-full p-2 bg-zinc-50 dark:bg-zinc-900 rounded-xl border dark:border-white/10 text-[0.85em] font-bold h-16"
                  />
                </div>
              </div>
            ))}

            {actividades.length === 0 && (
              <p className="text-center py-6 text-zinc-400 font-bold italic text-[0.85em]">No has agregado ninguna actividad.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
