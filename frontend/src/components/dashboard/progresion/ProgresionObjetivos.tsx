'use client'

import React, { useMemo } from 'react'
import RadarChartLazy from './RadarChartLazy'
import { getEvalLabel, EVAL_SCALE } from '@/lib/progression-utils'
import { ProgresionArea } from '@/types'
import type { ProgresionObjetivo as ProgresionObjetivoBase } from '@/types'
import type { Perfil } from '@/types'

type ProgresionObjetivo = ProgresionObjetivoBase & { texto_terminal?: string; texto_infantil?: string }

interface AvanceDefault {
  objetivo_id: string
  estado?: string | null
  valor?: number | null
  valor_dirigente?: number | null
  valor_apoderado?: number | null
}

interface ProgresionObjetivosProps {
  areas: ProgresionArea[]
  objetivosDefault: ProgresionObjetivo[]
  avanceDefault: AvanceDefault[]
  searchQuery: string
  setSearchQuery: (q: string) => void
  expandedAreas: number[]
  setExpandedAreas: (ids: number[]) => void
  isMounted: boolean
  getRadarData: () => { subject: string; Autoevaluacion: number; Dirigente: number; Apoderado: number; fullMark: number }[]
  termObj: string
  themePrimary: string
  themeSecondary: string
  perfil: Perfil
  isOwner: boolean
  isParent: boolean
  isLeader: boolean
  inactive: boolean
  handleLeaderValidateDefault: (objId: string, estado: string) => void
  handleSelfEvalValue: (objId: string, val: number) => void
  handleLeaderEvalValue: (objId: string, val: number) => void
  handleParentEvalValue: (objId: string, val: number) => void
  isManada: boolean
  isCompania: boolean
  isTropa: boolean
  isAvanzada: boolean
  isClan: boolean
}

const ProgresionObjetivos = React.memo(function ProgresionObjetivos({
  areas,
  objetivosDefault,
  avanceDefault,
  searchQuery,
  setSearchQuery,
  expandedAreas,
  setExpandedAreas,
  isMounted,
  getRadarData,
  termObj,
  themePrimary,
  themeSecondary,
  perfil,
  isOwner,
  isParent,
  isLeader,
  inactive,
  handleLeaderValidateDefault,
  handleSelfEvalValue,
  handleLeaderEvalValue,
  handleParentEvalValue,
  isManada,
  isCompania,
  isTropa,
  isAvanzada,
  isClan,
}: ProgresionObjetivosProps) {
  const unitFolder = isManada ? 'manada' : isCompania ? 'compania' : isTropa ? 'tropa' : isAvanzada ? 'avanzada' : isClan ? 'clan' : 'generico'

  return (
    <div className="space-y-6 bg-zinc-50 dark:bg-white/5 p-2 rounded-[1rem] border border-zinc-200 dark:border-white/5 shadow-xl">
      <div>
        <h3 className="font-bold uppercase text-[1.5em] text-zinc-900 dark:text-white">
          🎯 Objetivos Educativos de la Unidad
        </h3>
        <p className="text-[0.9em] font-bold text-zinc-400 mt-1">
          Revisa y evalúa tus objetivos organizados por áreas de desarrollo.
        </p>
      </div>

      {/* Gráfico de Radar de Progresión (1 a 8) */}
      {isMounted && areas.length > 0 && (() => {
        const radarData = getRadarData()
        const hasEvaluations = avanceDefault.some(a =>
          (a.valor !== null && a.valor !== undefined) ||
          (a.valor_dirigente !== null && a.valor_dirigente !== undefined) ||
          (a.valor_apoderado !== null && a.valor_apoderado !== undefined)
        )

        return (
          <div className="bg-white dark:bg-zinc-900/40 p-2 rounded-[1rem] border dark:border-white/5 shadow-sm flex flex-col items-center">
            <span className="text-[1.25em] font-black uppercase tracking-widest text-zinc-400 mb-2 block text-center">
              📊 Radar de Desarrollo
            </span>
            {!hasEvaluations ? (
              <p className="text-[0.9em] font-bold text-zinc-400 italic py-10 text-center">
                Comienza a evaluar tus objetivos para ver tu progreso en el radar.
              </p>
            ) : (
              <div className="w-full h-64 md:h-80 max-w-md">
                <RadarChartLazy data={radarData} themePrimary={themePrimary} />
              </div>
            )}
          </div>
        )
      })()}

      {/* Buscador de Progresión */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <svg className="w-5 h-5 opacity-70 text-zinc-500 dark:text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Buscar en mis ${termObj}... (ej. nudos, servicio, comunidad)`}
          className="w-full py-3.5 pl-14 pr-4 rounded-2xl border bg-white dark:bg-zinc-800 outline-none transition-all font-bold text-[0.95em] text-zinc-800 dark:text-white placeholder:text-zinc-400"
          style={{ borderColor: themePrimary }}
        />
      </div>

      {/* Áreas de Desarrollo */}
      <div className="grid grid-cols-1 gap-2">
        {areas.map(area => {
          let areaObjs = objetivosDefault.filter(o => o.area_id === area.id)

          if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase()
            areaObjs = areaObjs.filter(o => (o.texto_terminal || o.texto_infantil || '').toLowerCase().includes(query))
          }

          const baseAreaObjs = objetivosDefault.filter(o => o.area_id === area.id)
          const totalAvance = avanceDefault.filter(a => a.estado === 'logrado' && baseAreaObjs.some(o => o.id === a.objetivo_id))
          const percentage = baseAreaObjs.length > 0 ? (totalAvance.length / baseAreaObjs.length) * 100 : 0

          if (searchQuery.trim() !== '' && areaObjs.length === 0) return null

          const isExpanded = expandedAreas.includes(area.id) || searchQuery.trim() !== ''

          const toggleArea = () => {
            if (searchQuery.trim() !== '') return
            if (expandedAreas.includes(area.id)) {
              setExpandedAreas(expandedAreas.filter(id => id !== area.id))
            } else {
              setExpandedAreas([...expandedAreas, area.id])
            }
          }

          return (
            <div key={area.id} className="space-y-2">
              <div onClick={toggleArea} className="flex items-center justify-between border-b-4 pb-2 cursor-pointer hover:opacity-80 transition-opacity" style={{ borderColor: `${themePrimary}44` }}>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md overflow-hidden shrink-0 bg-white dark:bg-zinc-800" style={{ backgroundColor: `${themePrimary}` }}>
                    <img
                      src={`/images/progresion/${unitFolder}/area_${area.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}.png`}
                      alt={area.nombre}
                      className="w-full h-full object-cover"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => e.currentTarget.style.display='none'}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 p-1 rounded-2xl" style={{ backgroundColor: themePrimary }}>
                      <h3 className="font-bold uppercase text-[1.4em] tracking-tighter leading-none" style={{ color: themeSecondary }}>{area.nombre}</h3>
                    </div>
                    <p className="text-[0.8em] font-bold mt-[-1px] px-2 dark:text-zinc-400">{totalAvance.length} / {baseAreaObjs.length} {termObj}</p>
                  </div>
                </div>
                <div className="px-4 py-2 rounded-2xl shadow-md text-white font-bold text-[1.2em]" style={{ backgroundColor: themePrimary }}>
                  {Math.round(percentage)}%
                </div>
              </div>

              {isExpanded && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-in slide-in-from-top-4 duration-300 pt-2">
                  {areaObjs.map(obj => {
                    const dataAvance = avanceDefault.find(a => a.objetivo_id === obj.id)
                    const val = dataAvance?.valor
                    const valDirigente = dataAvance?.valor_dirigente
                    const valApoderado = dataAvance?.valor_apoderado
                    const isLogrado = dataAvance?.estado === 'logrado'
                    const isEnProceso = dataAvance?.estado === 'en_proceso'

                    return (
                      <div key={obj.id} className={`p-2 rounded-2xl border-2 flex flex-col justify-between shadow-md ${
                        isLogrado ? 'bg-white dark:bg-zinc-800' : isEnProceso ? 'bg-blue-50/20' : 'bg-white dark:bg-zinc-800/10'
                      }`} style={{ borderColor: isLogrado ? '#22c55e' : isEnProceso ? '#60a5fa' : themePrimary }}>
                        <div className="space-y-2">
                          <p className="font-bold text-[0.9em] text-zinc-700 dark:text-zinc-300 leading-tight text-center">{obj.texto_terminal || obj.texto_infantil}</p>

                          {/* Información de la Evaluación 360º */}
                          <div className="space-y-2">
                            {/* Estado de Validación */}
                            <div className="flex items-center gap-1.5 pb-1 border-b border-zinc-100 dark:border-white/5">
                              <span className="text-[0.8em] font-black uppercase text-zinc-400 block text-center">
                                Validación:
                              </span>
                              {isLogrado ? (
                                <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-[0.8em] font-black uppercase tracking-wider">
                                  🏆 Logrado
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[0.8em] font-black uppercase tracking-wider">
                                  ⏳ En Proceso
                                </span>
                              )}
                            </div>

                            {/* Tabla de Evaluaciones */}
                            <div className="space-y-1">
                              <span className="text-[0.9em] font-black uppercase text-zinc-400 block">
                                Evaluación:
                              </span>
                              <div className="border border-zinc-150 dark:border-white/5 rounded-2xl overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/50">
                                <div className="grid grid-cols-3 border-b border-zinc-150 dark:border-white/5 text-[0.8em] font-black uppercase text-zinc-500 bg-zinc-100/50 dark:bg-zinc-900 text-center py-1.5 leading-none">
                                  <div>Propia</div>
                                  <div>Apoderada (o)</div>
                                  <div>Dirigente</div>
                                </div>
                                <div className="grid grid-cols-3 text-center py-1 items-center">
                                  <div className="flex justify-center" title={val !== undefined && val !== null ? `Propia: ${getEvalLabel(val, perfil.unidad_id ?? 0)}` : 'Sin evaluación'}>
                                    {val !== undefined && val !== null ? (
                                      <span className="w-6 h-6 rounded-full flex items-center justify-center font-black text-white text-[0.8em] shadow-sm" style={{ backgroundColor: themePrimary }}>
                                        {val}
                                      </span>
                                    ) : (
                                      <span className="text-[0.8em] text-zinc-400 italic font-medium">-</span>
                                    )}
                                  </div>
                                  <div className="flex justify-center border-l border-r border-zinc-150 dark:border-white/5" title={valApoderado !== undefined && valApoderado !== null ? `Apoderado: ${getEvalLabel(valApoderado, perfil.unidad_id ?? 0)}` : 'Sin evaluación'}>
                                    {valApoderado !== undefined && valApoderado !== null ? (
                                      <span className="w-6 h-6 rounded-full flex items-center justify-center font-black text-white text-[0.8em] bg-yellow-600 shadow-sm">
                                        {valApoderado}
                                      </span>
                                    ) : (
                                      <span className="text-[0.8em] text-zinc-400 italic font-medium">-</span>
                                    )}
                                  </div>
                                  <div className="flex justify-center" title={valDirigente !== undefined && valDirigente !== null ? `Dirigente: ${getEvalLabel(valDirigente, perfil.unidad_id ?? 0)}` : 'Sin evaluación'}>
                                    {valDirigente !== undefined && valDirigente !== null ? (
                                      <span className="w-6 h-6 rounded-full flex items-center justify-center font-black text-white text-[0.8em] bg-green-600 shadow-sm">
                                        {valDirigente}
                                      </span>
                                    ) : (
                                      <span className="text-[0.8em] text-zinc-400 italic font-medium">-</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 justify-end items-center mt-2 pt-2 border-t border-zinc-100 dark:border-white/5">
                          {isOwner && !inactive && (
                            <button
                              type="button"
                              onClick={() => {
                                handleSelfEvalValue(obj.id, val || 0)
                              }}
                              className="px-3 py-1.5 bg-blue-600 hover:brightness-110 text-white rounded-lg text-[0.8em] font-bold uppercase transition-all shadow-sm"
                              style={{ backgroundColor: themePrimary, color: themeSecondary }}
                            >
                              {val !== undefined && val !== null ? '✏️ Corregir Autoevaluación' : '✨ Autoevaluar'}
                            </button>
                          )}

                          {isParent && (
                            <button
                              type="button"
                              onClick={() => {
                                handleParentEvalValue(obj.id, valApoderado || 0)
                              }}
                              className="px-3 py-1.5 bg-yellow-600 hover:brightness-110 text-white rounded-lg text-[0.9em] font-bold uppercase transition-all shadow-sm"
                              style={{ backgroundColor: themePrimary, borderColor: themePrimary, color: themeSecondary }}
                            >
                              {valApoderado !== undefined && valApoderado !== null ? '✏️ Nota Apoderado' : '✨ Evaluar'}
                            </button>
                          )}

                          {isLeader && (
                            <div className="flex gap-2 w-full justify-end flex-wrap">
                              <button
                                type="button"
                                onClick={() => {
                                  handleLeaderEvalValue(obj.id, valDirigente || 0)
                                }}
                                className="px-3 py-1.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-[0.9em] font-bold uppercase transition-all"
                                style={{ backgroundColor: themePrimary, borderColor: themePrimary, color: themeSecondary }}
                              >
                                {valDirigente !== undefined && valDirigente !== null ? '✏️ Nota Dirigente' : '✅ Evaluar'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleLeaderValidateDefault(obj.id, dataAvance?.estado || 'en_proceso')}
                                className={`px-3 py-1.5 rounded-lg text-[0.8em] font-bold uppercase transition-all border ${
                                  isLogrado
                                    ? 'bg-red-50 hover:bg-red-100 text-red-655 border-red-200 dark:bg-red-955/20 dark:text-red-400'
                                    : 'bg-green-600 hover:brightness-110 text-white border-green-700'
                                }`}
                                style={{ backgroundColor: themePrimary, borderColor: themePrimary, color: themeSecondary }}
                              >
                                {isLogrado ? '🔓 Deshacer Logro' : '🏆 Marcar Logrado'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
})

export default ProgresionObjetivos
