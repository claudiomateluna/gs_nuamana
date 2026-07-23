'use client'

import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

/** Parsea fecha "YYYY-MM-DD" como hora local (evita desfase de timezone) */
function parseLocalDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null
  const parts = dateStr.split('-')
  if (parts.length < 3) return null
  const [y, m, d] = parts.map(Number)
  return new Date(y, m - 1, d)
}
import { getBitacoraName } from '@/lib/bitacora-utils'
import { UNIT_IDS } from '@/lib/unit-constants'
import { projectService } from '@/services/projectService'
import { isInactive } from '@/lib/roles'
import { supabase } from '@/lib/supabase'
import type { Perfil, CicloUnidad, CicloPropuesta, BitacoraPreData } from '@/types'
import { toast } from 'sonner';

interface CicloFase4EjecucionProps {
  perfil: Perfil
  cicloActivo: CicloUnidad
  propuestas: CicloPropuesta[]
  unitColor: string
  canManage: boolean
  isDirectivo: boolean
  readOnlyOverride: boolean
  actividadesAsistidas: CicloPropuesta[]
  setSelectedPropuesta: (prop: CicloPropuesta | null) => void
  setEvalActividadText: (val: string) => void
  setIsModEvalActividadOpen: (open: boolean) => void
  setIsModAsistenciaOpen: (open: boolean) => void
  setIsModResenaOpen: (open: boolean) => void
  setIsModEvalNNJOpen: (open: boolean) => void
  setBitacoraPreData: (data: BitacoraPreData) => void
  setIsModBitacoraOpen: (open: boolean) => void
  setWizardProyecto: (proj: Record<string, unknown>) => void
  setWizardEsGrupal: (val: boolean) => void
  setIsWizardOpen: (open: boolean) => void
  onMover: (p: CicloPropuesta) => void
  onNuevaActividad: () => void
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
  setIsWizardOpen,
  onMover,
  onNuevaActividad
}: CicloFase4EjecucionProps) {
  
  const inactive = isInactive(perfil)
  const [publishingId, setPublishingId] = useState<string | null>(null)

  const handlePublishActivity = async (actId: string) => {
    setPublishingId(actId)
    try {
      const { error } = await supabase
        .from('actividades_programadas')
        .update({ estado: 'publicado' })
        .eq('id', actId)
      if (error) throw error
      toast.success('Actividad publicada con éxito.')
      onNuevaActividad()
    } catch (err: unknown) {
      toast.error('Error al publicar: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setPublishingId(null)
    }
  }

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

  const filteredPropuestas = propuestas
    .filter(p => p.seleccionada && p.fecha_programada && parseLocalDate(p.fecha_programada))
    .sort((a, b) => (parseLocalDate(a.fecha_programada)?.getTime() ?? 0) - (parseLocalDate(b.fecha_programada)?.getTime() ?? 0))

  const groupedByDate = useMemo(() => {
    const grouped = filteredPropuestas.reduce<Record<string, CicloPropuesta[]>>((acc, p) => {
      const d = parseLocalDate(p.fecha_programada)
      if (!d) return acc
      const key = format(d, 'yyyy-MM-dd')
      if (!acc[key]) acc[key] = []
      acc[key].push(p)
      return acc
    }, {})
    // Dentro de cada fecha: actividades programadas primero, luego el resto
    for (const key of Object.keys(grouped)) {
      grouped[key].sort((a, b) => {
        if (a.es_actividad_programada && !b.es_actividad_programada) return -1
        if (!a.es_actividad_programada && b.es_actividad_programada) return 1
        return 0
      })
    }
    return grouped
  }, [filteredPropuestas])

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black font-display uppercase tracking-tight text-clr5 dark:text-clr1">Ejecución de Actividades</h3>
            <p className="text-sm opacity-60 font-medium italic font-body">
              Es hora de vivir la aventura. Registra la historia de cada actividad a medida que ocurre.
            </p>
          </div>
          {canManage && cicloActivo.fase_actual === 4 && !inactive && (
            <button 
              onClick={onNuevaActividad}
              className="px-6 py-3 bg-clr7 text-white font-black uppercase rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all text-sm tracking-widest shrink-0"
            >
              🆕 Nueva Actividad
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-8">
        {Object.entries(groupedByDate).map(([dateKey, items]) => {
          const dateObj = parseLocalDate(dateKey) ?? new Date()
          const dayName = format(dateObj, 'EEEE', { locale: es })
          const dayNumber = format(dateObj, 'dd')
          const monthYear = format(dateObj, 'MMM yyyy', { locale: es })

          return (
            <div key={dateKey} className="space-y-3">
              <div className="flex items-center gap-3 px-2">
                <div className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 text-clr1" style={{ backgroundColor: unitColor, border: `2px solid ${unitColor}40` }}>
                  <span className="text-3xl font-black font-display leading-none">{dayNumber}</span>
                  <span className="text-[0.8em] font-bold uppercase leading-none mt-0.5">{monthYear.split(' ')[0]}</span>
                </div>
                <div>
                  <p className="text-lg font-black font-display uppercase text-clr5 dark:text-clr1 capitalize">{dayName}</p>
                  <p className="text-sm opacity-50 font-medium">{monthYear}</p>
                </div>
                <div className="flex-1 border-b-2 border-dashed ml-2" style={{ borderColor: unitColor + '30' }} />
              </div>

              <div className="grid gap-4 ml-0 md:ml-20">
                {items.map(p => (
                  <div 
                    key={p.id} 
                    className="p-4 rounded-[1.5rem] bg-white dark:bg-black/20 border-2 border-zinc-100 dark:border-clr4 shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:shadow-xl transition-all"
                  >
                    <div className="flex flex-col justify-between space-y-4 font-body">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="text-xl font-bold uppercase leading-tight text-clr5 dark:text-clr1">{p.titulo}</h4>
                          {canManage && cicloActivo.fase_actual === 4 && !inactive && (
                            <button 
                              onClick={() => onMover(p)}
                              className="text-xs font-black uppercase tracking-widest opacity-50 hover:opacity-100 hover:text-blue-600 transition-all flex items-center gap-1 border-none bg-transparent shrink-0"
                            >
                              📅 Mover
                            </button>
                          )}
                        </div>
                        {p.es_especialidad && p.autor && (
                          <p className="text-[0.8em] font-bold text-purple-650 dark:text-purple-300 uppercase tracking-wider">
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
                            {canManage && p.actividad_programada_estado === 'borrador' && (
                              <button
                                onClick={() => handlePublishActivity(p.id)}
                                disabled={publishingId === p.id}
                                className="px-3 py-1 rounded-full text-[0.75em] font-extrabold uppercase bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-all"
                              >
                                {publishingId === p.id ? '...' : '📤 Publicar'}
                              </button>
                            )}
                          </div>
                        ) : p.articulo ? (
                          <a 
                            href={`/blog/actividades/${p.articulo.slug}`} 
                            target="_blank" 
                            className="text-sm font-black uppercase tracking-widest underline decoration-2 underline-offset-4 opacity-60 hover:opacity-100 hover:text-clr7 transition-all flex items-center gap-2"
                          >
                            <span>📋</span> Ficha de Actividad
                          </a>
                        ) : p.es_grupal_global && p.fichas_vinculadas && p.fichas_vinculadas.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {p.fichas_vinculadas.map((f: any) => (
                              <a key={f.id} href={`/blog/actividades/${f.slug}`} target="_blank"
                                 className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold hover:bg-blue-200 flex items-center gap-1">
                                📋 {f.titulo}
                              </a>
                            ))}
                          </div>
                        ) : p.es_grupal_global ? (
                          <span className="text-sm font-black uppercase tracking-widest opacity-40 flex items-center gap-2">
                            <span>👥</span> Actividad Grupal
                          </span>
                        ) : (
                          <span className="text-sm font-black uppercase tracking-widest opacity-30 flex items-center gap-2">
                            <span>⚠️</span> Sin Ficha
                          </span>
                        )}
                        
                        {perfil?.unidad_id != null && (perfil.unidad_id === UNIT_IDS.AVANZADA || perfil.unidad_id === UNIT_IDS.CLAN) && (
                          <button
                            onClick={() => handleProjectWizardOpen(p.titulo)}
                            className="text-sm font-black uppercase tracking-widest text-blue-600 hover:opacity-100 hover:text-blue-700 transition-all flex items-center gap-2 border-none bg-transparent"
                          >
                            <span>📋</span> Proyecto {perfil.unidad_id === UNIT_IDS.AVANZADA ? 'Empresa' : '12 Pasos'}
                          </button>
                        )}

                        {canManage && cicloActivo.fase_actual === 4 && !inactive && (
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

                        {!isDirectivo && cicloActivo.fase_actual === 4 && !readOnlyOverride && !inactive && (
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
                      
                      {cicloActivo.fase_actual === 4 && !readOnlyOverride && !inactive && (
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
                          <span>📸</span> Escribir en {getBitacoraName(perfil.unidad_id ?? null)}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {filteredPropuestas.length === 0 && (
          <div className="py-20 text-center border-4 border-dashed border-zinc-100 dark:border-clr4 rounded-[3rem] opacity-30">
            <span className="text-5xl block mb-4">🏕️</span>
            <p className="text-xl font-black uppercase">No hay actividades agendadas</p>
            <p className="font-medium italic">Debes planificar actividades en la Fase 3 primero.</p>
            {canManage && cicloActivo.fase_actual === 4 && !inactive && (
              <button 
                onClick={onNuevaActividad}
                className="mt-6 px-8 py-3 bg-clr7 text-white font-black uppercase rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all text-sm tracking-widest"
              >
                🆕 Crear Primera Actividad
              </button>
            )}
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
