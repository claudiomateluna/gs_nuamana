'use client'

import React, { useMemo } from 'react'
import {
  getFieldLabel,
  getFieldColor,
  getFieldBgColor,
  getFieldTextColor,
  getFieldLogoPath,
  getSpecialtyInsigniaPath,
} from '@/lib/field-helpers'
import { isNNJConAgenda, canSeeAllTabs } from '@/lib/roles'
import DashmodProgresionEspecialidadWizard from './mod_progresion_especialidad_wizard'
import DashmodProgresionEspecialidadDetalle from './mod_progresion_especialidad'
import type {
  EspecialidadActividad,
  EspecialidadDefinicion,
  EspecialidadPersonal,
} from '@/types/progresion'
import type { Perfil } from '@/types'
import type { Articulo } from '@/types'

interface ProgresionEspecialidadesProps {
  perfil: Perfil
  userPerfil: Perfil
  themePrimary: string
  themeSecondary: string
  isOwner: boolean
  inactive: boolean
  definicionesEspecialidades: EspecialidadDefinicion[]
  especialidadesPersonales: EspecialidadPersonal[]
  especialidadesSupervisadas: EspecialidadPersonal[]
  loadingEspecialidades: boolean
  searchCatQuery: string
  setSearchCatQuery: (q: string) => void
  selectedFieldFilter: string
  setSelectedFieldFilter: (f: string) => void
  showSpecialtyWizard: boolean
  setShowSpecialtyWizard: (v: boolean) => void
  activeEspecialidad: EspecialidadPersonal | null
  setActiveEspecialidad: (ep: EspecialidadPersonal | null) => void
  availableMonitors: Pick<Perfil, 'id' | 'nombres' | 'apellidos'>[]
  availableActivityArticles: Articulo[]
  fetchEspecialidades: () => Promise<void>
  refreshActiveSpecialty: (id: string) => Promise<void>
  fetchAvailableMonitors: () => Promise<void>
  resetWizard: () => void
  setWizardStep: (step: number) => void
  setWSelectedField: (field: string) => void
  setWSelectedDefId: (id: string) => void
  setWCustomName: (name: string) => void
  subTab: 'progreso' | 'especialidades' | 'ceremonias'
}

function getPhaseLabel(fase: string) {
  switch (fase) {
    case 'exploracion': return 'Exploración 🔍'
    case 'planificacion': return 'Planificación 📋'
    case 'desarrollo': return 'Desarrollo 🛠️'
    case 'reconocimiento': return 'Reconocimiento 🎖️'
    default: return fase
  }
}

const ProgresionEspecialidades = React.memo(function ProgresionEspecialidades({
  perfil,
  userPerfil,
  themePrimary,
  themeSecondary,
  isOwner,
  inactive,
  definicionesEspecialidades,
  especialidadesPersonales,
  especialidadesSupervisadas,
  loadingEspecialidades,
  searchCatQuery,
  setSearchCatQuery,
  selectedFieldFilter,
  setSelectedFieldFilter,
  showSpecialtyWizard,
  setShowSpecialtyWizard,
  activeEspecialidad,
  setActiveEspecialidad,
  availableMonitors,
  availableActivityArticles,
  fetchEspecialidades,
  refreshActiveSpecialty,
  fetchAvailableMonitors,
  resetWizard,
  setWizardStep,
  setWSelectedField,
  setWSelectedDefId,
  setWCustomName,
  subTab,
}: ProgresionEspecialidadesProps) {
  const filteredCatalog = useMemo(() => {
    return definicionesEspecialidades.filter(def => {
      const matchesSearch = def.nombre.toLowerCase().includes(searchCatQuery.toLowerCase()) ||
        (def.descripcion && def.descripcion.toLowerCase().includes(searchCatQuery.toLowerCase()))
      const matchesField = selectedFieldFilter === 'todos' || def.campo_interes === selectedFieldFilter
      return matchesSearch && matchesField
    })
  }, [definicionesEspecialidades, searchCatQuery, selectedFieldFilter])

  const personalSpecialtyProgress = useMemo(() => {
    return especialidadesPersonales.map(ep => {
      const acts = ep.especialidades_actividades || []
      const completedCount = acts.filter((a: EspecialidadActividad) => a.completada).length
      const totalCount = acts.length
      const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
      return { ep, completedCount, totalCount, pct }
    })
  }, [especialidadesPersonales])

  const supervisedSpecialtyProgress = useMemo(() => {
    return especialidadesSupervisadas.map(ep => {
      const acts = ep.especialidades_actividades || []
      const completedCount = acts.filter((a: EspecialidadActividad) => a.completada).length
      const totalCount = acts.length
      const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
      const specialistName = ep.perfil ? `${ep.perfil.nombres} ${ep.perfil.apellidos}` : 'Miembro'
      return { ep, completedCount, totalCount, pct, specialistName }
    })
  }, [especialidadesSupervisadas])

  const handleCatalogClick = (def: EspecialidadDefinicion) => {
    if (isOwner && !isNNJConAgenda(perfil)) {
      resetWizard()
      setWSelectedField(def.campo_interes || '')
      setWSelectedDefId(def.id)
      setWCustomName('')
      setShowSpecialtyWizard(true)
      setWizardStep(2)
    }
  }

  const handleWizardClose = () => setShowSpecialtyWizard(false)

  const handleWizardSaveSuccess = async (newSpec: EspecialidadPersonal | null) => {
    setShowSpecialtyWizard(false)
    await Promise.all([
      fetchEspecialidades(),
      ...(newSpec && newSpec.fase === 'planificacion' ? [refreshActiveSpecialty(newSpec.id)] : [])
    ])
  }

  const handleDetailClose = () => setActiveEspecialidad(null)

  const handleDetailRefresh = async () => {
    await Promise.all([
      fetchEspecialidades(),
      ...(activeEspecialidad ? [refreshActiveSpecialty(activeEspecialidad.id)] : [])
    ])
  }

  if (subTab === 'especialidades' && especialidadesSupervisadas.length > 0) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {activeEspecialidad && (
          <DashmodProgresionEspecialidadDetalle
            especialidad={activeEspecialidad as any}
            userPerfil={userPerfil}
            perfil={perfil}
            availableMonitors={availableMonitors as Perfil[]}
            availableActivityArticles={availableActivityArticles}
            onClose={handleDetailClose}
            onRefreshParent={handleDetailRefresh}
            onFetchAvailableMonitors={fetchAvailableMonitors}
          />
        )}

        <div className="space-y-4">
          <div className="border-b pb-4 border-zinc-200 dark:border-white/10 flex justify-between items-center">
            <div>
              <h3 className="font-bold uppercase text-[1.5em] text-zinc-900 dark:text-white flex items-center gap-2">
                🎓 Panel de Tutorías y Supervisiones
              </h3>
              <p className="text-[0.9em] font-bold text-zinc-400">
                Especialidades de otros miembros del grupo que estás guiando y supervisando como monitor o tutor.
              </p>
            </div>
          </div>

          {supervisedSpecialtyProgress.length === 0 ? (
            <div className="p-8 rounded-[2rem] bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-center">
              <span className="text-4xl mb-2 block">🎓</span>
              <h4 className="font-bold text-[1.1em] text-zinc-800 dark:text-zinc-200">No tienes especialidades asignadas para supervisar</h4>
              <p className="text-[0.9em] text-zinc-500 dark:text-zinc-450 mt-1 max-w-md mx-auto">
                Cuando los beneficiarios te seleccionen como monitor en sus especialidades, aparecerán aquí para que puedas revisar y aprobar sus tareas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supervisedSpecialtyProgress.map(({ ep, completedCount, totalCount, pct, specialistName }) => {
                const color = getFieldColor(ep.campo_interes)
                const name = ep.nombre_personalizado || ep.especialidades_definiciones?.nombre || 'Especialidad'

                return (
                  <div
                    key={ep.id}
                    onClick={() => setActiveEspecialidad(ep)}
                    className="p-6 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 hover:border-zinc-350 dark:hover:border-zinc-700 shadow-lg cursor-pointer hover:shadow-xl transition-all relative overflow-hidden group border-l-[6px]"
                    style={{ borderLeftColor: color }}
                  >
                    <div className="flex gap-4 items-start mb-3">
                      <img
                        src={getSpecialtyInsigniaPath(name)}
                        alt={name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/especialidades/generico.svg'
                        }}
                        className="w-16 h-16 object-contain shadow-md rounded-2xl bg-zinc-50 dark:bg-zinc-800 p-1.5 border dark:border-white/10 shrink-0"
                        loading="lazy"
                        decoding="async"
                        style={{ contentVisibility: 'auto' }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span
                            className="px-2.5 py-0.5 rounded-full text-[0.8em] font-extrabold uppercase shadow-sm flex items-center gap-1 border shrink-0 animate-in fade-in duration-250"
                            style={{
                              backgroundColor: getFieldBgColor(ep.campo_interes),
                              color: getFieldTextColor(ep.campo_interes),
                              borderColor: color
                            }}
                          >
                            <img src={getFieldLogoPath(ep.campo_interes)} alt="" className="w-3.5 h-3.5 object-contain" loading="lazy" decoding="async" />
                            {getFieldLabel(ep.campo_interes)}
                          </span>
                          <span className="text-[0.8em] font-bold text-zinc-500 uppercase bg-zinc-100 dark:bg-zinc-850 px-2 py-0.5 rounded-full">
                            {getPhaseLabel(ep.fase)}
                          </span>
                        </div>
                        <h4 className="font-bold text-[1.2em] text-zinc-900 dark:text-white uppercase leading-tight group-hover:text-zinc-650 dark:group-hover:text-zinc-300 truncate">
                          {name}
                        </h4>
                        <p className="text-[0.8em] font-bold text-zinc-550 dark:text-zinc-400 mt-1">
                          👤 {specialistName}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-[0.8em] font-bold">
                        <span className="text-zinc-400">Progreso Actividades</span>
                        <span style={{ color }}>{completedCount}/{totalCount} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>

                    {/* Quick status badges */}
                    <div className="mt-4 pt-3 border-t border-zinc-150 dark:border-zinc-850 flex justify-between items-center text-[0.8em] font-bold text-zinc-400">
                      <span>Iniciada {ep.fecha_inicio}</span>
                      {ep.estado === 'completado' ? (
                        <span className="text-green-500 uppercase">Completada 🎉</span>
                      ) : (
                        (ep.especialidades_actividades || []).some((a: EspecialidadActividad) => !a.completada && a.evidencia_texto) && (
                          <span className="text-blue-500 animate-pulse uppercase font-extrabold">Pendiente Aprobación 🔔</span>
                        )
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Sección Tutorías y Supervisiones (si soy monitor de alguna especialidad) */}
      {especialidadesSupervisadas.length > 0 && (
        <div className="space-y-4">
          <div className="border-b pb-4 border-zinc-200 dark:border-white/10 flex justify-between items-center">
            <div>
              <h3 className="font-bold uppercase text-[1.5em] text-zinc-900 dark:text-white flex items-center gap-2">
                🎓 Tutorías y Supervisiones
              </h3>
              <p className="text-[0.9em] font-bold text-zinc-400">
                Especialidades de otros miembros del grupo que estás guiando y supervisando.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supervisedSpecialtyProgress.map(({ ep, completedCount, totalCount, pct, specialistName }) => {
              const color = getFieldColor(ep.campo_interes)
              const name = ep.nombre_personalizado || ep.especialidades_definiciones?.nombre || 'Especialidad'

              return (
                <div
                  key={ep.id}
                  onClick={() => setActiveEspecialidad(ep)}
                  className="p-6 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 hover:border-zinc-350 dark:hover:border-zinc-700 shadow-lg cursor-pointer hover:shadow-xl transition-all relative overflow-hidden group border-l-[6px]"
                  style={{ borderLeftColor: color }}
                >
                  <div className="flex gap-4 items-start mb-3">
                    <img
                      src={getSpecialtyInsigniaPath(name)}
                      alt={name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/especialidades/generico.svg'
                      }}
                      className="w-16 h-16 object-contain shadow-md rounded-2xl bg-zinc-50 dark:bg-zinc-800 p-1.5 border dark:border-white/10 shrink-0"
                      loading="lazy"
                      decoding="async"
                      style={{ contentVisibility: 'auto' }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[0.8em] font-extrabold uppercase shadow-sm flex items-center gap-1 border shrink-0 animate-in fade-in duration-250"
                          style={{
                            backgroundColor: getFieldBgColor(ep.campo_interes),
                            color: getFieldTextColor(ep.campo_interes),
                            borderColor: color
                          }}
                        >
                          <img src={getFieldLogoPath(ep.campo_interes)} alt="" className="w-3.5 h-3.5 object-contain" loading="lazy" decoding="async" />
                          {getFieldLabel(ep.campo_interes)}
                        </span>
                        <span className="text-[0.8em] font-bold text-zinc-500 uppercase bg-zinc-100 dark:bg-zinc-850 px-2 py-0.5 rounded-full">
                          {getPhaseLabel(ep.fase)}
                        </span>
                      </div>
                      <h4 className="font-bold text-[1.2em] text-zinc-900 dark:text-white uppercase leading-tight group-hover:text-zinc-650 dark:group-hover:text-zinc-300 truncate">
                        {name}
                      </h4>
                      <p className="text-[0.8em] font-bold text-zinc-550 dark:text-zinc-400 mt-1">
                        👤 {specialistName}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[0.8em] font-bold">
                      <span className="text-zinc-400">Progreso Actividades</span>
                      <span style={{ color }}>{completedCount}/{totalCount} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>

                  {/* Quick status badges */}
                  <div className="mt-4 pt-3 border-t border-zinc-150 dark:border-zinc-850 flex justify-between items-center text-[0.8em] font-bold text-zinc-400">
                    <span>Iniciada {ep.fecha_inicio}</span>
                    {ep.estado === 'completado' ? (
                      <span className="text-green-500 uppercase">Completada 🎉</span>
                    ) : (
                      (ep.especialidades_actividades || []).some((a: EspecialidadActividad) => !a.completada && a.evidencia_texto) && (
                        <span className="text-blue-500 animate-pulse uppercase font-extrabold">Pendiente Aprobación 🔔</span>
                      )
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Sección Especialidades Activas / En Desarrollo */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-4 border-zinc-200 dark:border-white/10">
          <div>
            <h3 className="font-bold uppercase text-[1.5em] text-zinc-900 dark:text-white">Especialidades en Desarrollo</h3>
            <p className="text-[0.9em] font-bold text-zinc-400">Tus proyectos personales y especialidades activas.</p>
          </div>
          {isOwner && canSeeAllTabs(perfil) && !isNNJConAgenda(perfil) && !inactive && (
            <button
              onClick={() => {
                resetWizard()
                setShowSpecialtyWizard(true)
                setWizardStep(1)
              }}
              className="px-4 py-2.5 rounded-2xl text-[0.8em] font-bold uppercase tracking-wider text-white shadow-xl hover:scale-102 transition-all"
              style={{ backgroundColor: themePrimary, color: themeSecondary }}
            >
              🎖️ Nueva Especialidad
            </button>
          )}
        </div>

        {loadingEspecialidades ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" style={{ borderColor: themePrimary }}></div>
          </div>
        ) : personalSpecialtyProgress.length === 0 ? (
          <div className="p-2 rounded-[1rem] bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-center">
            <span className="text-4xl mb-2 block">✨</span>
            <h4 className="font-bold text-[1.1em] text-zinc-800 dark:text-zinc-200">¡Aún no tienes especialidades activas!</h4>
            <p className="text-[0.9em] text-zinc-500 dark:text-zinc-450 mt-1 max-w-md mx-auto">
              Explora el catálogo abajo para elegir un campo de interés y proponer tu primera especialidad.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalSpecialtyProgress.map(({ ep, completedCount, totalCount, pct }) => {
              const color = getFieldColor(ep.campo_interes)
              const name = ep.nombre_personalizado || ep.especialidades_definiciones?.nombre || 'Especialidad'

              return (
                <div
                  key={ep.id}
                  onClick={() => setActiveEspecialidad(ep)}
                  className="p-6 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 hover:border-zinc-350 dark:hover:border-zinc-700 shadow-lg cursor-pointer hover:shadow-xl transition-all relative overflow-hidden group border-l-[6px]"
                  style={{ borderLeftColor: color, contentVisibility: 'auto' } as React.CSSProperties}
                >
                  <div className="flex gap-4 items-start mb-3">
                    <img
                      src={getSpecialtyInsigniaPath(name)}
                      alt={name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/especialidades/generico.svg'
                      }}
                      className="w-16 h-16 object-contain shadow-md rounded-2xl bg-zinc-50 dark:bg-zinc-800 p-1.5 border dark:border-white/10 shrink-0"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[0.8em] font-extrabold uppercase shadow-sm flex items-center gap-1 border shrink-0 animate-in fade-in duration-250"
                          style={{
                            backgroundColor: getFieldBgColor(ep.campo_interes),
                            color: getFieldTextColor(ep.campo_interes),
                            borderColor: color
                          }}
                        >
                          <img src={getFieldLogoPath(ep.campo_interes)} alt="" className="w-3.5 h-3.5 object-contain" loading="lazy" decoding="async" />
                          {getFieldLabel(ep.campo_interes)}
                        </span>
                        <span className="text-[0.8em] font-bold text-zinc-500 uppercase bg-zinc-100 dark:bg-zinc-850 px-2 py-0.5 rounded-full">
                          {getPhaseLabel(ep.fase)}
                        </span>
                        {ep.estado === 'pausado' && (
                          <span className="text-[0.8em] font-extrabold text-amber-500 bg-amber-100/50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full border border-amber-300/30">
                            Pausada ⏸️
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-[1.2em] text-zinc-900 dark:text-white uppercase leading-tight group-hover:text-zinc-650 dark:group-hover:text-zinc-300 truncate">
                        {name}
                      </h4>
                      {ep.monitor_nombre && (
                        <p className="text-[0.8em] font-semibold text-zinc-500 dark:text-zinc-400 mt-1">
                          Monitor: {ep.monitor_nombre}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[0.8em] font-bold">
                      <span className="text-zinc-400">Progreso Actividades</span>
                      <span style={{ color }}>{completedCount}/{totalCount} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>

                  {/* Quick status badges */}
                  <div className="mt-4 pt-3 border-t border-zinc-150 dark:border-zinc-850 flex justify-between items-center text-[0.8em] font-bold text-zinc-400">
                    <span>Iniciada {ep.fecha_inicio}</span>
                    {ep.estado === 'completado' && (
                      <span className="text-green-500 uppercase">Completada 🎉</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Catálogo de Especialidades */}
      {canSeeAllTabs(perfil) && (
        <div className="space-y-6 pt-6">
          <div className="border-b pb-4 border-zinc-200 dark:border-white/10">
            <h3 className="font-bold uppercase text-[1.5em] text-zinc-900 dark:text-white">Catálogo de Especialidades</h3>
            <p className="text-[0.9em] font-bold text-zinc-400">Explora las especialidades sugeridas oficiales para tu unidad.</p>
          </div>

          {/* Buscador y Filtros */}
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchCatQuery}
                onChange={e => setSearchCatQuery(e.target.value)}
                placeholder="Buscar especialidad..."
                className="w-full p-4 pl-12 rounded-2xl border dark:border-white/10 bg-zinc-50 dark:bg-zinc-800 text-[0.9em] font-bold"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-zinc-400">🔍</span>
            </div>

            <select
              value={selectedFieldFilter}
              onChange={e => setSelectedFieldFilter(e.target.value)}
              className="p-4 rounded-2xl border dark:border-white/10 bg-zinc-50 dark:bg-zinc-800 text-[0.9em] font-bold min-w-[200px]"
            >
              <option value="todos">Todos los campos</option>
              <option value="arte_expresion">🎨 Arte y Expresión</option>
              <option value="deportes">⚽ Deportes</option>
              <option value="ciencia_tecnologia">🔬 Ciencia y Tecnología</option>
              <option value="aire_libre">⛺ Aire Libre / Naturaleza</option>
              <option value="espiritual">🧘 Vida Espiritual</option>
              <option value="servicio_comunidad">🤝 Servicio y Comunidad</option>
            </select>
          </div>

          {/* Grid de Catálogo */}
          {filteredCatalog.length === 0 ? (
            <p className="text-center py-10 text-zinc-400 font-bold italic">No se encontraron especialidades que coincidan con los filtros.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCatalog.map(def => {
                const color = getFieldColor(def.campo_interes || '')

                return (
                  <div
                    key={def.id}
                    className="p-2 rounded-[1rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 hover:border-zinc-350 dark:hover:border-zinc-700 shadow-md hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between group border-l-[6px]"
                    style={{ borderLeftColor: color, contentVisibility: 'auto' } as React.CSSProperties}
                    onClick={() => handleCatalogClick(def)}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span
                          className="p-1 rounded-full text-[0.9em] font-extrabold uppercase shadow-sm flex items-center gap-1 border shrink-0"
                          style={{
                            backgroundColor: getFieldBgColor(def.campo_interes || ''),
                            color: getFieldTextColor(def.campo_interes || ''),
                            borderColor: color
                          }}
                        >
                          <img src={getFieldLogoPath(def.campo_interes || '')} alt="" className="w-3.5 h-3.5 object-contain" loading="lazy" decoding="async" />
                          {getFieldLabel(def.campo_interes || '')}
                        </span>
                        <div className="w-17 h-17 flex items-center justify-center shadow-inner shrink-0">
                          <img src={getFieldLogoPath(def.campo_interes || '')} alt="" className="w-full h-full object-contain" loading="lazy" decoding="async" />
                        </div>
                      </div>

                      <div className="flex gap-2 items-center mb-3">
                        <img
                          src={getSpecialtyInsigniaPath(def.nombre)}
                          alt={def.nombre}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/especialidades/generico.svg'
                          }}
                          className="w-24 h-24 object-contain shrink-0"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[1.25em] text-zinc-900 dark:text-white uppercase leading-tight mb-2 group-hover:text-zinc-650 dark:group-hover:text-zinc-300 truncate">
                            {def.nombre}
                          </h4>
                          <p className="text-[0.9em] font-medium text-zinc-550 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                            {def.descripcion}
                          </p>
                        </div>
                      </div>
                    </div>

                    {isOwner && !isNNJConAgenda(perfil) && (
                      <div className="mt-4 pt-3 border-t border-zinc-150 dark:border-zinc-850 flex justify-end">
                        <span
                          className="text-[0.8em] font-bold uppercase tracking-wider transition-all group-hover:translate-x-1"
                          style={{ color }}
                        >
                          Postular →
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
      <DashmodProgresionEspecialidadWizard
        isOpen={showSpecialtyWizard}
        onClose={handleWizardClose}
        perfil={perfil}
        definiciones={definicionesEspecialidades.map(d => ({ ...d, campo_interes: d.campo_interes ?? '' }))}
        onSaveSuccess={handleWizardSaveSuccess}
      />
      {activeEspecialidad && (
        <DashmodProgresionEspecialidadDetalle
          especialidad={activeEspecialidad as any}
          userPerfil={userPerfil}
          perfil={perfil}
          availableMonitors={availableMonitors as Perfil[]}
          availableActivityArticles={availableActivityArticles}
          onClose={handleDetailClose}
          onRefreshParent={handleDetailRefresh}
          onFetchAvailableMonitors={fetchAvailableMonitors}
        />
      )}
    </div>
  )
})

export default ProgresionEspecialidades
