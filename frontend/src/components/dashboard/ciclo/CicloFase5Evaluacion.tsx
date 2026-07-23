'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { getObjetivoTerm } from '@/lib/progression-utils'
import RadarProgresion from '../progresion/radar_progresion'
import type { Perfil, CicloUnidad, CicloPropuesta, ObjetivoMetadata } from '@/types'

/** Parsea fecha "YYYY-MM-DD" como hora local (evita desfase de timezone) */
function parseLocalDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null
  const parts = dateStr.split('-')
  if (parts.length < 3) return null
  const [y, m, d] = parts.map(Number)
  return new Date(y, m - 1, d)
}

interface CicloFase5EvaluacionProps {
  perfil: Perfil
  cicloActivo: CicloUnidad
  propuestas: CicloPropuesta[]
  votos: Array<{ propuesta_id: string; perfil_id: string; cantidad: number }>
  objetivosTrabajados: ObjetivoMetadata[]
  unitColor: string
  canManage: boolean
  isDirectivo: boolean
  readOnlyOverride: boolean
  actividadesAsistidas: CicloPropuesta[]
  nnjEvaluables: Array<{ id: string; nombres: string; apellidos: string; unidad_id?: number | null; actividades: CicloPropuesta[] }>
  evaluacionGeneral: string
  setEvaluacionGeneral: (val: string) => void
  evaluacionEnfasis: string
  setEvaluacionEnfasis: (val: string) => void
  setSelectedPropuesta: (prop: CicloPropuesta | null) => void
  setIsModEvalNNJOpen: (open: boolean) => void
  setSelectedNNJ: (nnj: { id: string; nombres: string; apellidos: string; unidad_id?: number | null; actividades: CicloPropuesta[] } | null) => void
  setIsModRadarOpen: (open: boolean) => void
  cerrarCiclo: () => void
  guardarEvaluacion: () => void
}

export default function CicloFase5Evaluacion({
  perfil,
  cicloActivo,
  propuestas,
  votos,
  objetivosTrabajados,
  unitColor,
  canManage,
  isDirectivo,
  readOnlyOverride,
  actividadesAsistidas,
  nnjEvaluables,
  evaluacionGeneral,
  setEvaluacionGeneral,
  evaluacionEnfasis,
  setEvaluacionEnfasis,
  setSelectedPropuesta,
  setIsModEvalNNJOpen,
  setSelectedNNJ,
  setIsModRadarOpen,
  cerrarCiclo,
  guardarEvaluacion
}: CicloFase5EvaluacionProps) {

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 font-body">
      
      {/* VISTA NNJ: Autoevaluación Personal */}
      {!isDirectivo && !readOnlyOverride && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-2xl font-black font-display uppercase tracking-tight text-clr5 dark:text-clr1">Mi Progresión Personal</h3>
            <p className="text-[1em] opacity-80 font-medium italic">
              Evalúa tu desarrollo en las actividades a las que fuiste en este ciclo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {actividadesAsistidas.map(act => (
              <div key={act.id} className="p-2 bg-white dark:bg-black/20 rounded-[1rem] border-2 border-zinc-100 dark:border-clr4 flex items-center justify-between gap-4 group hover:border-clr7 transition-all">
                <div className="flex-1">
                  <span className="text-[0.8em] font-black uppercase opacity-40 tracking-widest leading-none block mb-[-4px]">
                    {act.fecha_programada && parseLocalDate(act.fecha_programada) && format(parseLocalDate(act.fecha_programada)!, 'dd MMMM', { locale: es })}
                  </span>
                  <h4 className="font-bold uppercase text-clr5 dark:text-clr1 line-clamp-1">{act.titulo}</h4>
                </div>
                {cicloActivo.fase_actual === 5 && (
                  <button 
                    onClick={() => {
                      setSelectedPropuesta(act)
                      setIsModEvalNNJOpen(true)
                    }}
                    className="px-2 py-1 bg-zinc-900 text-white text-[0.8em] font-black uppercase rounded-[0.6rem] shadow-lg hover:scale-105 active:scale-95 transition-all tracking-widest border-none"
                  >
                    Evaluar {getObjetivoTerm(perfil.unidad_id ?? 1)}s
                  </button>
                )}
              </div>
            ))}
            {actividadesAsistidas.length === 0 && (
              <div className="col-span-full py-20 text-center border-4 border-dashed rounded-[1rem] opacity-30">
                <p className="font-black uppercase text-sm">No registras asistencias en este ciclo aún.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VISTA DIRIGENTE: Evaluación de NNJ */}
      {canManage && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h4 className="text-[1em] font-black uppercase tracking-widest" style={{ color: unitColor }}>Progresión Personal de los NNJ</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {nnjEvaluables.map(nnj => (
              <div key={nnj.id} className="p-2 bg-white dark:bg-black/20 rounded-[1rem] border-2 border-zinc-100 dark:border-clr4 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-clr4 flex items-center justify-center font-black text-xs">
                    {nnj.nombres[0]}{nnj.apellidos[0]}
                  </div>
                  <div className="flex-1">
                    <h5 className="text-[1em] font-bold uppercase text-clr5 dark:text-clr1 leading-none" style={{ color: unitColor }}>{nnj.nombres}</h5>
                    <p className="text-[0.9em] leading-none">{nnj.apellidos}</p>
                    <p className="text-[0.8em] opacity-80">
                      {nnj.actividades.length} Actividades asistidas
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[0.9em] font-bold uppercase opacity-40 tracking-widest">Evaluar actividades:</p>
                  <div className="flex flex-wrap gap-2">
                    {nnj.actividades.map((act: CicloPropuesta) => (
                      <button 
                        key={act.id}
                        type="button"
                        onClick={() => {
                          if (cicloActivo.fase_actual !== 5) return;
                          setSelectedPropuesta(act)
                          setSelectedNNJ(nnj)
                          setIsModEvalNNJOpen(true)
                        }}
                        className={`px-2 py-2 rounded-xl text-[0.9em] font-bold transition-all border ${
                          cicloActivo.fase_actual === 5 
                            ? 'bg-zinc-50 dark:bg-clr4 hover:bg-clr7 hover:text-white border-zinc-100 dark:border-transparent' 
                            : 'bg-zinc-100 opacity-50 cursor-not-allowed border-transparent'
                        }`}
                        title={cicloActivo.fase_actual === 5 ? `Evaluar ${act.titulo}` : 'Solo disponible en Fase 5'}
                      >
                        {act.titulo.substring(0, 15)}...
                      </button>
                    ))}
                    {nnj.actividades.length === 0 && (
                      <p className="text-[1em] italic text-clr7">Sin asistencias registradas.</p>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setSelectedNNJ(nnj);
                    setIsModRadarOpen(true);
                  }}
                  className="w-full py-2 bg-zinc-900 text-white text-[0.9em] font-bold uppercase rounded-xl shadow-md hover:scale-105 transition-all tracking-widest flex items-center justify-center gap-2 border-none"
                >
                  <span>📊</span> Ver Radar de Progresión
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISTA NNJ: Mi Radar */}
      {!isDirectivo && !readOnlyOverride && actividadesAsistidas.length > 0 && (
        <div className="space-y-4 bg-white dark:bg-black/20 p-2 rounded-[1rem] border border-zinc-100 dark:border-clr4 shadow-sm">
          <h4 className="font-bold uppercase tracking-widest text-center" style={{ color: unitColor }}>Mi Radar de Desarrollo 360º</h4>
          <RadarProgresion perfilId={perfil.id} unidadColor={unitColor} />
        </div>
      )}

      {/* VISTA DIRIGENTE: Evaluación del Ciclo */}
      {canManage && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pt-8 border-t border-zinc-50 dark:border-clr4">
          <div className="space-y-1">
            <h3 className="text-2xl font-black font-display uppercase tracking-tight text-clr5 dark:text-clr1" style={{ color: unitColor }}>Evaluación del Ciclo</h3>
            <p className="text-[1em] opacity-60 font-medium italic">
              Revisión de los objetivos alcanzados y cierre pedagógico.
            </p>
          </div>
          {canManage && cicloActivo.fase_actual === 5 && !readOnlyOverride && (
            <button 
              onClick={cerrarCiclo}
              className="px-3 py-3 bg-red-600 text-white font-black uppercase rounded-2xl shadow-lg hover:bg-red-700 transition-all text-[1em] flex items-center gap-2 border-none"
            >
              <span>🔒</span> Cerrar Ciclo Oficialmente
            </button>
          )}
        </div>
      )}

      {/* SECCIÓN DE EVALUACIONES POR ACTIVIDAD (INSUMO) */}
      <div className="space-y-2 bg-white dark:bg-clr3/20 p-2 rounded-[1rem]">
        <h4 className="text-[1em] font-bold uppercase text-shadow-lg" style={{ color: unitColor }}>Evaluaciones de Actividades Ejecutadas</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {propuestas.filter(p => p.seleccionada && !p.es_actividad_programada).map(p => (
            <div key={p.id} className="p-2 rounded-[0.6rem] bg-zinc-50 dark:bg-black/20 border-2 border-dashed border-zinc-100 dark:border-clr4">
              <div className="flex justify-between items-start mb-2">
                <h5 className="text-[1em] font-bold uppercase text-clr5 dark:text-clr1">{p.titulo}</h5>
                {p.evaluacion ? (
                  <span className="text-[16px]">✅</span>
                ) : (
                  <span className="text-[16px] animate-pulse">⌛</span>
                )}
              </div>
              <p className="text-[0.8em] italic leading-relaxed">
                {p.evaluacion || 'Sin evaluación registrada aún.'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN DE EVALUACIÓN CUALITATIVA */}
      <div className="bg-white dark:bg-black/20 p-2 rounded-[1rem] border border-zinc-100 dark:border-clr4 shadow-sm space-y-6">
        <h4 className="text-[1em] font-black uppercase tracking-widest text-shadow-lg" style={{ color: unitColor }}>Evaluación Cualitativa</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="space-y-2">
            <label className="text-[1em] font-bold uppercase opacity-80" style={{ color: unitColor }}>
              Evaluación del Énfasis
            </label>
            <p className="text-[0.8em] font-bold opacity-40 uppercase tracking-widest italic mb-2">
              ¿Se logró el objetivo de: "{cicloActivo.enfasis}"?
            </p>
            {canManage && cicloActivo.fase_actual === 5 ? (
              <textarea 
                value={evaluacionEnfasis}
                onChange={e => setEvaluacionEnfasis(e.target.value)}
                placeholder="Redacta cómo el énfasis se vivió en las actividades..."
                className="w-full p-4 rounded-2xl border dark:border-clr4 bg-zinc-50 dark:bg-clr3 font-body text-sm min-h-[150px]"
              />
            ) : (
              <p className="p-4 rounded-2xl border dark:border-clr4 bg-zinc-50 dark:bg-clr3 font-body text-sm min-h-[150px] italic opacity-80 whitespace-pre-wrap">
                {evaluacionEnfasis || 'Los dirigentes aún no redactan esta evaluación.'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[1em] font-bold uppercase opacity-80" style={{ color: unitColor }}>
              Evaluación General del Ciclo
            </label>
            <p className="text-[0.8em] font-bold opacity-40 uppercase tracking-widest italic mb-2">
              Conclusiones de la unidad y pasos a seguir.
            </p>
            {canManage && cicloActivo.fase_actual === 5 ? (
              <textarea 
                value={evaluacionGeneral}
                onChange={e => setEvaluacionGeneral(e.target.value)}
                placeholder="Redacta el consenso del Consejo de Unidad..."
                className="w-full p-4 rounded-2xl border dark:border-clr4 bg-zinc-50 dark:bg-clr3 font-body text-sm min-h-[150px]"
              />
            ) : (
              <p className="p-4 rounded-2xl border dark:border-clr4 bg-zinc-50 dark:bg-clr3 font-body text-sm min-h-[150px] italic opacity-80 whitespace-pre-wrap">
                {evaluacionGeneral || 'Los dirigentes aún no redactan esta evaluación.'}
              </p>
            )}
          </div>
        </div>

        {canManage && cicloActivo.fase_actual === 5 && (
          <div className="flex justify-end pt-4">
            <button 
              onClick={guardarEvaluacion}
              style={{ backgroundColor: unitColor }} 
              className="px-6 py-3 text-white font-black uppercase rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all text-xs tracking-widest border-none text-shadow-lg"
            >
              Guardar Evaluaciones Cualitativas
            </button>
          </div>
        )}
      </div>

      {/* SECCIÓN DE RESUMEN ESTADÍSTICO Y OBJETIVOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-8 border-t border-zinc-50 dark:border-clr4">
        {/* Resumen de Actividades */}
        <div className="lg:col-span-1 space-y-2 bg-white dark:bg-black/20 p-2 rounded-[1rem] border border-zinc-100 dark:border-clr4 shadow-sm">
          <h4 className="font-bold uppercase text-shadow-lg" style={{ color: unitColor }}>Resumen Estadístico</h4>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-clr4 rounded-2xl">
              <span className="text-sm font-bold uppercase opacity-60">Ideas Propuestas</span>
              <span className="text-2xl font-black" style={{ color: unitColor }}>{propuestas.filter(p => !p.es_actividad_programada).length}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-clr4 rounded-2xl">
              <span className="text-sm font-bold uppercase opacity-60">Votos Emitidos</span>
              <span className="text-2xl font-black" style={{ color: unitColor }}>{votos.length}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-clr4 rounded-2xl">
              <span className="text-sm font-bold uppercase opacity-60">Actividades Ejecutadas</span>
              <span className="text-2xl font-black" style={{ color: unitColor }}>{propuestas.filter(p => p.seleccionada && !p.es_actividad_programada).length}</span>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-100 dark:border-clr4">
            <p className="text-[1em] font-black uppercase opacity-40 mb-2">Diagnóstico Inicial:</p>
            <p className="text-[0.9em] italic leading-relaxed">"{cicloActivo.diagnostico}"</p>
          </div>
        </div>

        {/* Objetivos Educativos Trabajados */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-2 bg-white dark:bg-clr3/20 rounded-[1rem]">
            <h4 className="font-bold uppercase text-shadow-lg" style={{ color: unitColor }}>Objetivos Educativos Trabajados</h4>
          </div>

          {objetivosTrabajados.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {Object.entries(
                objetivosTrabajados.reduce((acc: Record<string, ObjetivoMetadata[]>, obj: ObjetivoMetadata) => {
                  if (!acc[obj.area]) acc[obj.area] = []
                  acc[obj.area].push(obj)
                  return acc
                }, {})
              ).map(([area, objs]: [string, ObjetivoMetadata[]]) => (
                <div key={area} className="p-2 rounded-[1rem] bg-white dark:bg-black/20 border-2 border-zinc-100 dark:border-clr4 shadow-sm space-y-4 font-body">
                  <div className="flex justify-between items-center border-b border-zinc-50 dark:border-clr4 pb-2">
                    <span className="text-sm font-black uppercase tracking-widest" style={{ color: unitColor }}>{area}</span>
                    <span className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-clr4 flex items-center justify-center text-sm font-black">{objs.length}</span>
                  </div>
                  <div className="space-y-3">
                    {Array.from(new Set(objs.map((o: ObjetivoMetadata) => o.texto))).map((textoStr: string, idx) => (
                      <p key={idx} className="text-[1em] leading-relaxed flex gap-2">
                        <span className="mt-0.5" style={{ color: unitColor }}>•</span> {textoStr}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border-4 border-dashed border-zinc-100 dark:border-clr4 rounded-[3rem] opacity-30 bg-zinc-50 dark:bg-black/10">
              <span className="text-5xl block mb-4">📊</span>
              <p className="text-xl font-black uppercase">Sin objetivos registrados</p>
              <p className="font-medium italic">No se vincularon fichas técnicas a las actividades de este ciclo.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
