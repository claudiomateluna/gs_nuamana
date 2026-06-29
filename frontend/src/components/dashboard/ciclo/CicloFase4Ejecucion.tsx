'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { getBitacoraName } from '@/lib/bitacora-utils'
import { projectService } from '@/services/projectService'

interface CicloFase4EjecucionProps {
  perfil: any
  cicloActivo: any
  propuestas: any[]
  unitColor: string
  canManage: boolean
  isDirectivo: boolean
  readOnlyOverride: boolean
  actividadesAsistidas: any[]
  setSelectedPropuesta: (prop: any) => void
  setEvalActividadText: (val: string) => void
  setIsModEvalActividadOpen: (open: boolean) => void
  setIsModAsistenciaOpen: (open: boolean) => void
  setIsModResenaOpen: (open: boolean) => void
  setIsModEvalNNJOpen: (open: boolean) => void
  setBitacoraPreData: (data: any) => void
  setIsModBitacoraOpen: (open: boolean) => void
  setWizardProyecto: (proj: any) => void
  setWizardEsGrupal: (val: boolean) => void
  setIsWizardOpen: (open: boolean) => void
}

export default function CicloFase4Ejecucion({
  perfil,
  cicloActivo,
  propuestas,
  unitColor,
  canManage,
  isDirectivo,
  readOnlyOverride,
  actividadesAsistidas,
  setSelectedPropuesta,
  setEvalActividadText,
  setIsModEvalActividadOpen,
  setIsModAsistenciaOpen,
  setIsModResenaOpen,
  setIsModEvalNNJOpen,
  setBitacoraPreData,
  setIsModBitacoraOpen,
  setWizardProyecto,
  setWizardEsGrupal,
  setIsWizardOpen
}: CicloFase4EjecucionProps) {
  
  const handleProjectWizardOpen = async (titulo: string) => {
    try {
      const existingProj = await projectService.getProjectByTitleAndUnit(titulo, perfil.unidad_id)
      if (existingProj) {
        setWizardProyecto(existingProj)
      } else {
        setWizardProyecto({ titulo })
      }
      setWizardEsGrupal(true)
      setIsWizardOpen(true)
    } catch (err: any) {
      alert('Error al buscar proyecto: ' + err.message)
    }
  }

  const filteredPropuestas = propuestas
    .filter(p => p.seleccionada && p.fecha_programada)
    .sort((a, b) => new Date(b.fecha_programada).getTime() - new Date(a.fecha_programada).getTime())

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1 text-center md:text-left">
        <h3 className="text-2xl font-black font-display uppercase tracking-tight text-clr5 dark:text-clr1">Ejecución de Actividades</h3>
        <p className="text-sm opacity-60 font-medium italic font-body">
          Es hora de vivir la aventura. Registra la historia de cada actividad a medida que ocurre.
        </p>
      </div>

      <div className="grid gap-6">
        {filteredPropuestas.map(p => (
          <div 
            key={p.id} 
            className="p-2 rounded-[1rem] bg-white dark:bg-black/20 border-2 border-zinc-100 dark:border-clr4 shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden group hover:shadow-xl transition-all"
          >
            <div className="w-full md:w-48 shrink-0 flex flex-col items-center justify-center p-2 bg-zinc-50 dark:bg-black/40 rounded-[1rem] border-2 border-dashed border-zinc-200 dark:border-clr4 font-body">
              <span className="text-[0.8em] font-black uppercase opacity-40 mb-1">Fecha Programada</span>
              <span className="text-4xl font-black font-display" style={{ color: unitColor }}>
                {format(new Date(p.fecha_programada), 'dd')}
              </span>
              <span className="text-sm font-bold uppercase mt-1">
                {format(new Date(p.fecha_programada), 'MMM yyyy', { locale: es })}
              </span>
            </div>
            
            <div className="flex-1 flex flex-col justify-between space-y-4 font-body">
              <div className="space-y-2">
                <h4 className="text-2xl font-bold uppercase leading-tight text-clr5 dark:text-clr1">{p.titulo}</h4>
                {p.es_especialidad && p.autor && (
                  <p className="text-[0.8em] font-bold text-purple-650 dark:text-purple-300 uppercase tracking-wider mt-1">
                    Scout: {p.autor.nombres} {p.autor.apellidos}
                  </p>
                )}
                <p className="text-sm italic opacity-70 line-clamp-3">{p.descripcion}</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
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
                  <a 
                    href={`/blog/actividades/${p.articulo.slug}`} 
                    target="_blank" 
                    className="text-sm font-black uppercase tracking-widest underline decoration-2 underline-offset-4 opacity-60 hover:opacity-100 hover:text-clr7 transition-all flex items-center gap-2"
                  >
                    <span>📋</span> Ficha de Actividad
                  </a>
                ) : (
                  <span className="text-sm font-black uppercase tracking-widest opacity-30 flex items-center gap-2">
                    <span>⚠️</span> Sin Ficha
                  </span>
                )}
                
                {[4, 5].includes(perfil?.unidad_id) && (
                  <button
                    onClick={() => handleProjectWizardOpen(p.titulo)}
                    className="text-sm font-black uppercase tracking-widest text-blue-600 hover:opacity-100 hover:text-blue-700 transition-all flex items-center gap-2 border-none bg-transparent"
                  >
                    <span>📋</span> Proyecto {perfil?.unidad_id === 4 ? 'Empresa' : '12 Pasos'}
                  </button>
                )}

                {canManage && cicloActivo.fase_actual === 4 && (
                  <button 
                    onClick={() => {
                      setSelectedPropuesta(p);
                      setEvalActividadText(p.evaluacion || '');
                      setIsModEvalActividadOpen(true);
                    }}
                    className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 transition-all border-none bg-transparent ${
                      p.evaluacion ? 'text-green-600 opacity-100' : 'opacity-60 hover:opacity-100 hover:text-blue-650'
                    }`}
                  >
                    <span>{p.evaluacion ? '✅' : '📝'}</span> {p.evaluacion ? 'Evaluada' : 'Evaluar'}
                  </button>
                )}

                {canManage && cicloActivo.fase_actual === 4 && (
                  <button 
                    onClick={() => {
                      setSelectedPropuesta(p);
                      setIsModAsistenciaOpen(true);
                    }}
                    className="text-sm font-black uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-green-650 transition-all flex items-center gap-2 border-none bg-transparent"
                  >
                    <span>👥</span> Asistencia
                  </button>
                )}

                {!isDirectivo && cicloActivo.fase_actual === 4 && !readOnlyOverride && (
                  <button 
                    onClick={() => {
                      setSelectedPropuesta(p);
                      setIsModResenaOpen(true);
                    }}
                    className="text-sm font-black uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-orange-500 transition-all flex items-center gap-2 border-none bg-transparent"
                  >
                    <span>⭐</span> Calificar
                  </button>
                )}

                {!isDirectivo && cicloActivo.fase_actual === 4 && !readOnlyOverride && actividadesAsistidas.some(a => a.id === p.id) && (
                  <button 
                    onClick={() => {
                      setSelectedPropuesta(p);
                      setIsModEvalNNJOpen(true);
                    }}
                    className="text-sm font-black uppercase tracking-widest text-blue-600 hover:opacity-100 hover:text-blue-700 transition-all flex items-center gap-2 border-none bg-transparent"
                  >
                    <span>🎯</span> Evaluar Objetivos
                  </button>
                )}
              </div>
              
              {cicloActivo.fase_actual === 4 && !readOnlyOverride && (
                <button 
                  onClick={() => {
                    setBitacoraPreData({
                      titulo: `Aventura: ${p.titulo}`,
                      historia: `El día de hoy realizamos la actividad "${p.titulo}". \n\nLo que más nos gustó fue...\nLo que aprendimos fue...`,
                      fecha_suceso: p.fecha_programada,
                      excluir_dirigentes: false
                    })
                    setIsModBitacoraOpen(true)
                  }}
                  className="w-full sm:w-auto px-6 py-4 bg-zinc-900 text-white text-[0.9em] font-black uppercase rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all tracking-widest flex items-center justify-center gap-2 border-none"
                >
                  <span>📸</span> Escribir en {getBitacoraName(perfil?.unidad_id)}
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredPropuestas.length === 0 && (
          <div className="py-20 text-center border-4 border-dashed border-zinc-100 dark:border-clr4 rounded-[3rem] opacity-30">
            <span className="text-5xl block mb-4">🏕️</span>
            <p className="text-xl font-black uppercase">No hay actividades agendadas</p>
            <p className="font-medium italic">Debes planificar actividades en la Fase 3 primero.</p>
          </div>
        )}
        {cicloActivo.fase_actual > 4 && (
           <div className="py-4 text-center opacity-30 text-[0.8em] font-black uppercase tracking-widest border-t border-dashed border-zinc-100 mt-4">
             🔒 Modo Lectura (Ejecución Finalizada)
           </div>
        )}
      </div>
    </div>
  )
}
