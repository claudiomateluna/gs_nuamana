'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { getObjetivoTerm, EVAL_SCALE } from '@/lib/progression-utils'
import { UNIT_IDS } from '@/lib/unit-constants'
import { differenceInYears } from 'date-fns'
import type { Perfil, CicloPropuesta } from '@/types'
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error-utils';

interface DashModEvaluarObjetivoProps {
  isOpen: boolean
  onClose: () => void
  perfil: Perfil
  propuesta: CicloPropuesta
  perfilNNJ?: Perfil
  onSuccess?: () => void
}

export default function DashModEvaluarObjetivo({ isOpen, onClose, perfil, propuesta, perfilNNJ, onSuccess }: DashModEvaluarObjetivoProps) {
  const [objetivos, setObjetivos] = useState<{ id: string; texto: string; area: string; unidad: string }[]>([])
  const [respuestas, setRespuestas] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // El sujeto de la evaluación (el NNJ)
  const targetNNJ = perfilNNJ || perfil
  const term = getObjetivoTerm(targetNNJ?.unidad_id || 0)

  const fetchObjetivos = useCallback(async () => {
    setLoading(true)
    try {
      // 1. Determinar la etapa y el rango etáreo del NNJ
      let etapaRango = null
      let etapaUnidadId = null

      if (targetNNJ.progresion_etapa_id) {
        const { data: stageData } = await supabase
          .from('progresion_etapas')
          .select('rango_edad, unidad_id')
          .eq('id', targetNNJ.progresion_etapa_id)
          .maybeSingle()
        if (stageData) {
          etapaRango = stageData.rango_edad
          etapaUnidadId = stageData.unidad_id
        }
      } else if (targetNNJ.unidad_id && targetNNJ.fecha_nacimiento) {
        // Fallback robusto basado en edad y unidad si no hay etapa asignada
        const birthDate = new Date(targetNNJ.fecha_nacimiento)
        const age = differenceInYears(new Date(), birthDate)
        etapaUnidadId = targetNNJ.unidad_id

        if (targetNNJ.unidad_id === UNIT_IDS.MANADA) {
          etapaRango = age >= 9 ? "Infancia Tardía" : "Infancia Media"
        } else if (targetNNJ.unidad_id === UNIT_IDS.COMPANIA || targetNNJ.unidad_id === UNIT_IDS.TROPA) {
          etapaRango = age >= 13 ? "13 a 15 años" : "11 a 13 años"
        } else if (targetNNJ.unidad_id === UNIT_IDS.AVANZADA) {
          etapaRango = "15 a 17 años"
        } else if (targetNNJ.unidad_id === UNIT_IDS.CLAN) {
          etapaRango = "17 a 20 años"
        }
      }

      // 2. Los objetivos vienen en el metadata del artículo vinculado a la propuesta
      // Para actividades grupales de actas, buscar en acta_acuerdo_fichas en vez de ciclo_propuestas
      let rawObjs: { id: string; texto: string; area: string; unidad: string }[] = []

      if (propuesta.es_grupal_global) {
        // Actividad grupal de acta — buscar fichas vinculadas al acuerdo
        const { data: fichasData } = await supabase
          .from('acta_acuerdo_fichas')
          .select('articulo:articulos(metadata)')
          .eq('acuerdo_id', propuesta.id)
        
        if (fichasData) {
          for (const ficha of fichasData) {
            const metadata = (ficha as Record<string, unknown>)?.articulo as Record<string, unknown> | null
            const objs = metadata?.metadata as Record<string, unknown> | null
            const educativos = objs?.objetivos_educativos as { id: string; texto: string; area: string; unidad: string }[] | undefined
            if (educativos) rawObjs.push(...educativos)
          }
        }
      } else {
        // Propuesta normal del ciclo
        const { data, error } = await supabase
          .from('ciclo_propuestas')
          .select('articulo:articulos(metadata)')
          .eq('id', propuesta.id)
          .single()
        
        if (error) throw error

        const objs = (data as Record<string, unknown> | null)?.articulo as Record<string, unknown> | null
        const educativos = (objs?.metadata as Record<string, unknown> | null)?.objetivos_educativos as { id: string; texto: string; area: string; unidad: string }[] | undefined
        rawObjs = educativos || []
      }

      // 3. Consultar los objetivos detallados de la DB para obtener rango_edad y unidad_id real
      let filteredObjs = rawObjs
      if (rawObjs.length > 0 && etapaRango) {
        const { data: dbObjs } = await supabase
          .from('progresion_objetivos')
          .select('id, rango_edad, unidad_id')
          .in('id', rawObjs.map((o) => o.id))

        if (dbObjs) {
          filteredObjs = rawObjs.filter((o) => {
            const dbObj = dbObjs.find((d) => d.id === o.id)
            if (!dbObj) return false
            return dbObj.unidad_id === etapaUnidadId && dbObj.rango_edad === etapaRango
          })
        }
      }
      setObjetivos(filteredObjs)

      // 4. Buscar si ya existen respuestas previas de ESTE evaluador para ESTE NNJ
      const { data: existing } = await supabase
        .from('evaluacion_objetivos')
        .select('objetivo_texto, valor')
        .eq('perfil_id', targetNNJ.id)
        .eq('evaluador_id', perfil.id)
        .eq('propuesta_id', propuesta.id)

      const map: Record<string, number> = {}
      existing?.forEach(e => {
        map[e.objetivo_texto] = e.valor
      })
      setRespuestas(map)

    } catch (err: unknown) {
      console.error('Error fetching objetivos:', getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [isOpen, propuesta?.id, targetNNJ.id, targetNNJ.progresion_etapa_id, targetNNJ.unidad_id, targetNNJ.fecha_nacimiento, perfil.id])

  useEffect(() => {
    if (isOpen && propuesta?.id) {
      fetchObjetivos()
    }
  }, [isOpen, propuesta?.id, fetchObjetivos])

  const handleSelect = (objTexto: string, area: string, valor: number) => {
    setRespuestas(prev => ({ ...prev, [objTexto]: valor }))
  }

  const guardarEvaluacion = async () => {
    if (objetivos.some(o => !respuestas[o.texto])) {
      toast.warning(`Por favor, evalúa todos los ${term}s antes de guardar.`)
      return
    }

    setSaving(true)
    try {
      const records = objetivos.map(o => ({
        perfil_id: targetNNJ.id,
        evaluador_id: perfil.id,
        propuesta_id: propuesta.id,
        area: o.area,
        objetivo_texto: o.texto,
        valor: respuestas[o.texto]
      }))

      const { error } = await supabase
        .from('evaluacion_objetivos')
        .upsert(records, { onConflict: 'perfil_id,evaluador_id,propuesta_id,objetivo_texto' })
      
      if (error) throw error

      toast.success('¡La evaluación ha sido guardada!')
      if (onSuccess) onSuccess()
      onClose()
    } catch (err: unknown) {
      toast.error('Error al guardar: ' + getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-2 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-clr3 w-full max-w-2xl rounded-[1rem] shadow-2xl overflow-hidden border-4 border-white dark:border-clr4 animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        
        <div className="p-2 pb-2 space-y-2 border-b border-zinc-50 dark:border-clr4">
          <span className="text-[1em] font-bold uppercase text-clr7">
            {perfil.id === targetNNJ.id ? 'Autoevaluación' : `Evaluando a ${targetNNJ.nombres}`}
          </span>
          <h3 className="text-2xl font-black uppercase text-clr5 dark:text-white leading-tight">
            {propuesta?.titulo}
          </h3>
          <p className="text-sm italic opacity-60">
            {perfil.id === targetNNJ.id 
              ? `Evalúa cuánto sientes que desarrollaste cada ${term} en esta actividad.`
              : `Evalúa el desarrollo de cada ${term} observado en el NNJ.`}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-2 pt-4 space-y-4 custom-scrollbar">
          {loading ? (
            <div className="py-20 text-center animate-pulse uppercase font-black text-[0.8em] opacity-40 tracking-widest">
              Identificando {term}s...
            </div>
          ) : (
            <>
              {objetivos.map((obj, idx) => (
                <div key={idx} className="space-y-2 p-2 bg-zinc-50 dark:bg-black/20 rounded-[1rem] border border-zinc-100 dark:border-clr4">
                  <div className="flex justify-between items-start gap-4">
                    <span className="px-2 py-1 bg-white dark:bg-clr4 rounded-full text-[1.2em] font-bold uppercase border border-zinc-100 dark:border-white/10 text-clr7">
                      {obj.area}
                    </span>
                  </div>
                  <h4 className="text-[1.2em] font-bold dark:text-white">
                    {obj.texto}
                  </h4>

                  <div className="grid grid-cols-1 gap-2 pt-1">
                    {EVAL_SCALE.map((step) => {
                      const label = step.label.replace(/{term}/g, term)
                      const isSelected = respuestas[obj.texto] === step.value
                      
                      return (
                        <button
                          key={step.value}
                          onClick={() => handleSelect(obj.texto, obj.area, step.value)}
                          className={`p-2 text-left text-[1em] rounded-xl border-2 transition-all flex items-center gap-2 ${
                            isSelected 
                              ? 'bg-clr7 border-clr7 text-white shadow-lg scale-[1.02]' 
                              : 'bg-white dark:bg-clr4 border-zinc-100 dark:border-transparent opacity-70 hover:opacity-100 hover:border-clr7/30'
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black ${
                            isSelected ? 'bg-white text-clr7' : 'bg-zinc-100 dark:bg-clr3'
                          }`}>
                            {step.value}
                          </span>
                          <span className="font-medium">{label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
              {objetivos.length === 0 && (
                <div className="py-20 text-center opacity-40 italic">
                  Esta actividad no tiene {term}s educativos vinculados.
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-8 pt-4 border-t border-zinc-50 dark:border-clr4 flex gap-4 bg-zinc-50/50 dark:bg-black/10">
          <button 
            onClick={onClose}
            className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-all"
          >
            Después
          </button>
          <button 
            onClick={guardarEvaluacion}
            disabled={saving || loading || objetivos.length === 0}
            className="flex-[2] py-4 bg-clr7 text-white text-xs font-black uppercase rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all tracking-widest disabled:opacity-50 disabled:grayscale"
          >
            {saving ? '⌛ Guardando...' : '🚀 Finalizar Evaluación'}
          </button>
        </div>
      </div>
    </div>
  )
}
