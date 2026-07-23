'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { isDirectivo, isNNJConAgenda, canSeeAllTabs, hasRole, isAdmin, Rol, isInactive } from '@/lib/roles'
import DashModProyectoWizard from './proyecto/mod_proyecto_wizard'
import DashModFirmaDigital from './progresion/mod_progresion_firma'
import RadarChartLazy from './progresion/RadarChartLazy'
import { getObjetivoTerm, EVAL_SCALE, getEvalLabel } from '@/lib/progression-utils'
import { UNIT_IDS } from '@/lib/unit-constants'
import { parseJsonField } from '@/utils/format-utils'
import dynamic from 'next/dynamic'
import { uploadToStorage } from '@/lib/storage-utils'
import { db, ProgresionAvanceOffline } from '@/lib/db'
import { outboxService } from '@/lib/outbox-service'
import { Perfil as PerfilBase, ProgresionObjetivo as ProgresionObjetivoBase, ProgresionAvance as ProgresionAvanceBase, ProgresionEtapa as ProgresionEtapaBase, ProgresionArea } from '@/types'
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error-utils';
import { useCeremonias } from '@/hooks/useCeremonias';
import { useClanProgresion } from '@/hooks/useClanProgresion';
import { useAvanzadaProgresion } from '@/hooks/useAvanzadaProgresion';
import { useDefaultProgresion } from '@/hooks/useDefaultProgresion';
import type { CeremoniaConJoins as CeremoniaConJoinsType } from '@/types/progresion';

type Perfil = PerfilBase & { edad?: number }
type ProgresionObjetivo = ProgresionObjetivoBase & { texto_terminal?: string; texto_infantil?: string }
type ProgresionAvance = ProgresionAvanceBase & { valor_dirigente?: number | null }
type ProgresionEtapa = ProgresionEtapaBase & { imagen_url?: string }

const DashmodProgresionEspecialidadWizard = dynamic(
  () => import('./progresion/mod_progresion_especialidad_wizard'),
  { ssr: false }
)
const DashmodProgresionEspecialidadDetalle = dynamic(
  () => import('./progresion/mod_progresion_especialidad'),
  { ssr: false }
)

import ProgresionCeremonias from './progresion/ProgresionCeremonias'
import ProgresionEspecialidades from './progresion/ProgresionEspecialidades'
import ProgresionObjetivos from './progresion/ProgresionObjetivos'

import type {
  EspecialidadActividad,
  EspecialidadDefinicion,
  EspecialidadPersonal,
  AgendaPersonal,
  ProyectoObjetivoConJoins,
  SolicitudCompetenciaConJoins,
  CeremoniaConJoins,
  PresupuestoItem,
  FinanciamientoItem,
  ProjectActivity,
  RadarSnapshotItem,
  NotificationPayload,
  SheetParticipant,
  Proyecto,
  ProgresionUnidadProps,
} from '@/types/progresion'
import {
  getFieldLabel,
  getFieldColor,
  getFieldBgColor,
  getFieldTextColor,
  getFieldLogoPath,
  getFieldEmoji,
  getSpecialtyInsigniaPath,
} from '@/lib/field-helpers'
import { useEspecialidades } from '@/hooks/useEspecialidades'

const DashmodProgresion = React.memo(function DashmodProgresion({ perfil, userPerfil }: ProgresionUnidadProps) {
  // --- Estados Comunes ---
  const [loading, setLoading] = useState(true)
  const [areas, setAreas] = useState<ProgresionArea[]>([])
  const [specialtiesLoaded, setSpecialtiesLoaded] = useState(false)

  // Roles (must be before hooks that depend on them)
  const isOwner = userPerfil.id === perfil.id
  const isParent = userPerfil.id === perfil.apoderado_id
  const isLeader = isDirectivo(userPerfil) && (isAdmin(userPerfil) || userPerfil.unidad_id === perfil.unidad_id)
  const inactive = isInactive(userPerfil)

  // Lógica de Unidad y Tema
  const unitName = perfil.unidades?.nombre?.toLowerCase() || ''
  const isManada = unitName.includes('manada')
  const isCompania = unitName.includes('compañía') || unitName.includes('compania')
  const isTropa = unitName.includes('tropa')
  const isAvanzada = perfil.unidad_id === UNIT_IDS.AVANZADA
  const isClan = perfil.unidad_id === UNIT_IDS.CLAN

  const termObj = isManada ? 'huellas' : isCompania || isTropa ? 'desafíos' : 'objetivos'
  const termObjSingular = isManada ? 'huella' : isCompania || isTropa ? 'desafío' : 'objetivo'

  // Colores de la Unidad
  const dbColors = (typeof perfil.unidades?.colores === 'object' ? perfil.unidades?.colores : {}) as Record<string, string>
  const themePrimary = dbColors.primario || '#cb3327'
  const themeSecondary = dbColors.secundario || '#ffffff'
  const themeTextDark = dbColors.textoDark || '#1b1b1b'
  const colorHighlight = themePrimary

  // --- Default Progression (must be before Clan/Avanzada hooks that depend on fetchDefaultProgresion) ---
  const def = useDefaultProgresion({ perfil, userPerfil, isOwner, isParent, isLeader })

  // --- Clan Progression ---
  const clan = useClanProgresion({ perfil, userPerfil, isOwner, isLeader, fetchDefaultProgresion: def.fetchDefaultProgresion })

  // --- Avanzada Progression ---
  const avz = useAvanzadaProgresion({ perfil, userPerfil, isOwner, isLeader })

  // --- Especialidades (Hook) ---
  const esp = useEspecialidades({ perfil, userPerfil })

  // --- Estados de Ceremonias (Hitos y Celebraciones) ---
  const cer = useCeremonias({ perfil, userPerfil, isLeader, getRadarData: () => getRadarData(), fetchDefaultProgresion: def.fetchDefaultProgresion });

  // Destructure hook return values for render functions
  const {
    agenda, setAgenda, agendaObjetivos, clanProyectos, todosObjetivosClan,
    showAddGoalModal, setShowAddGoalModal, selectedObjId, setSelectedObjId,
    metaPersonalText, setMetaPersonalText, evidenceText, setEvidenceText,
    evidenceUrl, setEvidenceUrl, leaderReviewText: _clanLeaderReviewText,
    setLeaderReviewText: _setClanLeaderReviewText, activeMetaIdForEvidence,
    setActiveMetaIdForEvidence, activeMetaIdForReview: _clanActiveMetaIdForReview,
    setActiveMetaIdForReview: _setClanActiveMetaIdForReview,
    fetchClanProgresion, handleUpdateAgendaField, handleUpdateAgendaEtapa,
    handleSaveGoalMeta, handleRegisterGoalEvidence, handleLeaderReviewGoal,
    handleDeleteGoal,
  } = clan

  const {
    competencias, avanzadaProyectos, showCompetenciaModal, setShowCompetenciaModal,
    selectedCompetenciaArea, setSelectedCompetenciaArea, justificacionNnj,
    setJustificacionNnj, evidenciaCompUrl, setEvidenciaCompUrl, compProyectoId,
    setCompProyectoId, editingSolicitudId, setEditingSolicitudId,
    showDirectCompetenciaModal, setShowDirectCompetenciaModal,
    selectedDirectCompetenciaArea, setSelectedDirectCompetenciaArea,
    directLeaderReviewText, setDirectLeaderReviewText, directCompProyectoId,
    setDirectCompProyectoId, leaderReviewText,
    setLeaderReviewText, activeMetaIdForReview,
    setActiveMetaIdForReview,
    fetchAvanzadaProgresion, handleRequestCompetencia,
    handleLeaderReviewCompetencia, handleDirectDeliverCompetencia,
    handleDeleteCompetencia,
  } = avz

  const {
    objetivosDefault, avanceDefault, todasEtapas, etapaActual,
    comentando, setComentando, tempComentario, setTempComentario,
    searchQuery, setSearchQuery, expandedAreas, setExpandedAreas,
    isMounted, fetchDefaultProgresion,
    handleSetEtapaDefault, handleSelfEvalDefault, handleSelfEvalValue,
    handleParentEvalValue, handleParentCommentDefault,
    handleLeaderValidateDefault, handleLeaderEvalValue,
  } = def

  // --- Memoized computed data ---
  const completedSpecialties = useMemo(
    () => esp.especialidadesPersonales.filter(ep => ep.estado === 'completado'),
    [esp.especialidadesPersonales]
  )

  const filteredCatalog = useMemo(() => {
    return esp.definicionesEspecialidades.filter(def => {
      const matchesSearch = def.nombre.toLowerCase().includes(esp.searchCatQuery.toLowerCase()) ||
        (def.descripcion && def.descripcion.toLowerCase().includes(esp.searchCatQuery.toLowerCase()))
      const matchesField = esp.selectedFieldFilter === 'todos' || def.campo_interes === esp.selectedFieldFilter
      return matchesSearch && matchesField
    })
  }, [esp.definicionesEspecialidades, esp.searchCatQuery, esp.selectedFieldFilter])

  // --- Estados del Wizard de Proyectos de 12 Pasos ---
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [wizardProyecto, setWizardProyecto] = useState<Proyecto | null>(null)
  const [wizardEsGrupal, setWizardEsGrupal] = useState(true)
  const [selectedProjectSheet, setSelectedProjectSheet] = useState<Proyecto | null>(null)
  const [sheetParticipants, setSheetParticipants] = useState<SheetParticipant[]>([])
  const [wizardInitialStep, setWizardInitialStep] = useState<number>(1)

  // --- Estados de Evaluación de Objetivos en Escala 1 a 8 ---
  const [showObjEvalModal, setShowObjEvalModal] = useState(false)
  const [activeObjForEval, setActiveObjForEval] = useState<ProgresionObjetivo | null>(null)
  const [tempEvalValue, setTempEvalValue] = useState<number | null>(null)

  // --- Estados de Formulario de Evidencia/Evaluación de Meta ---


const fetchInitialData = useCallback(async () => {
    setLoading(true)
    try {
      const { data: areasData } = await supabase.from('progresion_areas').select('*').order('id')
      setAreas((areasData as ProgresionArea[]) || [])

      if (isClan) {
        await Promise.all([
          cer.fetchCeremonias(),
          clan.fetchClanProgresion(),
          def.fetchDefaultProgresion()
        ])
      } else if (isAvanzada) {
        await Promise.all([
          cer.fetchCeremonias(),
          avz.fetchAvanzadaProgresion(),
          def.fetchDefaultProgresion()
        ])
      } else {
        await Promise.all([
          cer.fetchCeremonias(),
          def.fetchDefaultProgresion()
        ])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [isClan, isAvanzada, cer.fetchCeremonias, clan.fetchClanProgresion, avz.fetchAvanzadaProgresion, def.fetchDefaultProgresion])

  // Fetch data when perfil changes (e.g., Dirigente selects a different NNJ)
  useEffect(() => {
    fetchInitialData()
  }, [perfil, fetchInitialData])

  // Lazy-load specialties when user switches to especialidades sub-tab
  useEffect(() => {
    if (esp.subTab === 'especialidades' && !specialtiesLoaded) {
      esp.fetchEspecialidades().then(() => setSpecialtiesLoaded(true))
    }
  }, [esp.subTab, specialtiesLoaded, esp.fetchEspecialidades])

  // Reset specialtiesLoaded when perfil changes
  useEffect(() => {
    setSpecialtiesLoaded(false)
  }, [perfil.id])

  // ==========================================
  // RENDER - CLAN (CAMINANTES)
  // ==========================================
  const renderAgendaNotInitializedCard = () => {
    const isBeneficiaryRole = isNNJConAgenda(perfil)

    return (
      <div className="p-8 rounded-[2.5rem] bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-xl text-center space-y-4">
        <span className="text-4xl">📓</span>
        <h3 className="text-xl font-bold uppercase text-zinc-900 dark:text-white">Agenda de Vida no Inicializada</h3>
        <p className="text-[0.9em] font-bold text-zinc-500 max-w-md mx-auto leading-relaxed">
          {!isBeneficiaryRole
            ? 'Los dirigentes y administradores no poseen una Agenda Personal de Vida.'
            : isOwner 
              ? 'Para comenzar a trazar tu camino simbólico, metas personales y pre-proyecto en tu unidad, debes inicializar tu Agenda de Vida.'
              : 'El beneficiario aún no ha inicializado su Agenda de Vida en la plataforma.'}
        </p>
        {isOwner && isBeneficiaryRole && (
          <button
            onClick={async () => {
              setLoading(true)
              try {
                const { data: newAgenda, error: createErr } = await supabase
                  .from('agendas_personales')
                  .insert([{ perfil_id: perfil.id, etapa_progresion: 'ninguna' }])
                  .select()
                  .single()
                
                if (createErr) {
                  toast.error('Error al inicializar la agenda: ' + createErr.message)
                } else {
                  setAgenda(newAgenda)
                  if (isClan) fetchClanProgresion()
                  else if (isAvanzada) fetchAvanzadaProgresion()
                }
              } catch (err: unknown) {
                toast.error('Error: ' + (err as Error).message)
              } finally {
                setLoading(false)
              }
            }}
            className="px-6 py-3 rounded-2xl text-[0.9em] font-bold uppercase tracking-wider text-white shadow-xl hover:scale-102 transition-all mx-auto block"
            style={{ backgroundColor: colorHighlight }}
          >
            🚀 Inicializar mi Agenda de Vida
          </button>
        )}
      </div>
    )
  }

  const renderPreProyectoSection = () => {
    if (!agenda) return null

    return (
      <div className="p-2 rounded-[1rem] bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 shadow-xl space-y-6">
        <div>
          <h3 className="font-bold uppercase text-[1.5em] text-zinc-900 dark:text-white">
            🎯 Mi Pre-Proyecto de Vida
          </h3>
          <p className="text-[1em] font-bold text-zinc-400 mt-1">
            Reflexiona sobre estas 4 preguntas clave para planificar tu ruta en la unidad.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Pregunta 1 */}
          <div className="p-2 rounded-md bg-white dark:bg-zinc-900/40 border border-zinc-150 dark:border-white/5 flex flex-col">
            <span className="text-[1em] p-1 rounded-md font-bold uppercase tracking-widest mb-2 block" style={{ backgroundColor: themePrimary, color: themeSecondary }}>¿Quién quiero ser?</span>
            <textarea
              disabled={!isOwner}
              value={agenda.quien_soy || ''}
              onChange={e => setAgenda({ ...agenda, quien_soy: e.target.value })}
              onBlur={e => handleUpdateAgendaField('quien_soy', e.target.value)}
              placeholder="Describe tu identidad ideal, tus valores and tu carácter..."
              className="flex-1 w-full p-2 rounded-md bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-white/5 font-bold min-h-[120px] outline-none text-[0.9em]"
            />
          </div>

          {/* Pregunta 2 */}
          <div className="p-2 rounded-md bg-white dark:bg-zinc-900/40 border border-zinc-150 dark:border-white/5 flex flex-col">
            <span className="text-[1em] p-1 rounded-md font-bold uppercase tracking-widest mb-2 block" style={{ backgroundColor: themePrimary, color: themeSecondary }}>¿Qué quiero para mi vida?</span>
            <textarea
              disabled={!isOwner}
              value={agenda.vision_futuro || ''}
              onChange={e => setAgenda({ ...agenda, vision_futuro: e.target.value })}
              onBlur={e => handleUpdateAgendaField('vision_futuro', e.target.value)}
              placeholder="Tus metas a mediano y largo plazo en lo personal, familiar y social..."
              className="flex-1 w-full p-2 rounded-md bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-white/5 font-bold min-h-[120px] outline-none text-[0.9em]"
            />
          </div>

          {/* Pregunta 3 */}
          <div className="p-2 rounded-md bg-white dark:bg-zinc-900/40 border border-zinc-150 dark:border-white/5 flex flex-col">
            <span className="text-[1em] p-1 rounded-md font-bold uppercase tracking-widest mb-2 block" style={{ backgroundColor: themePrimary, color: themeSecondary }}>¿Cómo me visualizo en el futuro?</span>
            <textarea
              disabled={!isOwner}
              value={agenda.como_me_visualizo || ''}
              onChange={e => setAgenda({ ...agenda, como_me_visualizo: e.target.value })}
              onBlur={e => handleUpdateAgendaField('como_me_visualizo', e.target.value)}
              placeholder="¿Dónde te ves viviendo, en qué trabajando, qué haciendo en unos años?..."
              className="flex-1 w-full p-2 rounded-md bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-white/5 font-bold min-h-[120px] outline-none text-[0.9em]"
            />
          </div>

          {/* Pregunta 4 */}
          <div className="p-2 rounded-md bg-white dark:bg-zinc-900/40 border border-zinc-150 dark:border-white/5 flex flex-col">
            <span className="text-[1em] p-1 rounded-md font-bold uppercase tracking-widest mb-2 block" style={{ backgroundColor: themePrimary, color: themeSecondary }}>¿Qué hago hoy para cumplir mis sueños y lograr ser la persona que imagino ser?</span>
            <textarea
              disabled={!isOwner}
              value={agenda.que_hago_hoy || ''}
              onChange={e => setAgenda({ ...agenda, que_hago_hoy: e.target.value })}
              onBlur={e => handleUpdateAgendaField('que_hago_hoy', e.target.value)}
              placeholder="Tus acciones, hábitos y estudios del día a día..."
              className="flex-1 w-full p-2 rounded-md bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-white/5 font-bold min-h-[120px] outline-none text-[0.9em]"
            />
          </div>
        </div>

        {isClan && (
          <div className="p-2 rounded-md bg-white dark:bg-zinc-900/40 border border-zinc-150 dark:border-white/5 flex flex-col">
            <span className="text-[1em] p-1 rounded-md font-bold uppercase tracking-widest mb-2 block" style={{ backgroundColor: themePrimary, color: themeSecondary }}>Mi Compromiso con el Clan y la Promesa</span>
            <textarea
              disabled={!isOwner}
              value={agenda.compromiso_texto || ''}
              onChange={e => setAgenda({ ...agenda, compromiso_texto: e.target.value })}
              onBlur={e => handleUpdateAgendaField('compromiso_texto', e.target.value)}
              placeholder="Escribe tu compromiso personal con el Clan, la Ley y la Promesa..."
              className="w-full p-2 rounded-md bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-white/5 font-bold min-h-[100px] outline-none text-[0.9em]"
            />
          </div>
        )}
      </div>
    )
  }

  const renderProyectosSection = (proyectos: Proyecto[]) => {
    return (
      <div className="space-y-2">
        <div className="border-b pb-4 border-zinc-200 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold uppercase text-[1.5em] text-zinc-900 dark:text-white">Mis Proyectos</h3>
            <p className="text-[0.9em] font-bold text-zinc-400 mt-1">Elabora y gestiona tus proyectos individuales (personales) o de unidad (colectivos).</p>
          </div>
          
          {isOwner && (
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => { setWizardProyecto(null); setWizardEsGrupal(false); setWizardInitialStep(1); setIsWizardOpen(true); }}
                className="p-2 rounded-xl text-[0.8em] font-bold uppercase tracking-wider text-white shadow-md hover:scale-102 transition-all"
                style={{ backgroundColor: colorHighlight }}
              >
                🚀 Iniciar Proyecto Personal
              </button>
              <button 
                onClick={() => { setWizardProyecto(null); setWizardEsGrupal(true); setWizardInitialStep(1); setIsWizardOpen(true); }}
                className="p-2 rounded-xl text-[0.8em] font-bold uppercase tracking-wider text-white shadow-md hover:scale-102 transition-all bg-indigo-900"
              >
                👥 Iniciar Proyecto Colectivo
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {proyectos.map(p => (
            <div key={p.id} className="p-2 bg-zinc-50 dark:bg-white/5 border dark:border-white/10 rounded-[1rem] flex flex-col justify-between relative shadow-md">
              <div>
                <div className="flex justify-between items-start">
                  <span className={`px-3 py-1 rounded-full text-[0.8em] font-bold uppercase tracking-wider text-white ${
                    p.es_grupal ? 'bg-indigo-600' : 'bg-teal-600'
                  }`}>
                    {p.es_grupal ? 'Colectivo' : 'Individual'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[0.8em] font-bold uppercase ${
                    p.fase === 'completado' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {p.fase}
                  </span>
                </div>
                
                <h4 className="font-bold uppercase text-[1.2em] text-zinc-900 dark:text-white mt-3 mb-1">
                  {p.titulo}
                </h4>
                
                {isClan && p.campo_prioritario && (
                  <span className="text-[0.8em] font-bold uppercase p-1 rounded-[1rem]" style={{ backgroundColor: themePrimary, color: themeSecondary }}>
                    📍 {p.campo_prioritario}
                  </span>
                )}
                {isAvanzada && p.competencias_asociadas && parseJsonField(p.competencias_asociadas, []).length > 0 && (
                  <span className="text-[0.8em] font-bold uppercase block truncate p-1 rounded-[1rem]" style={{ backgroundColor: themePrimary, color: themeSecondary }}>
                    🎓 {parseJsonField(p.competencias_asociadas, []).join(', ').replace(/_/g, ' ')}
                  </span>
                )}
              </div>

              <div className="mt-6 flex gap-2">
                <button 
                  onClick={() => { setSelectedProjectSheet(p); loadSheetParticipants(p.id); }}
                  className="flex-1 py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-xl text-[0.8em] font-bold uppercase tracking-tight"
                >
                  📋 Ver Ficha
                </button>
                {isOwner && p.fase !== 'completado' && (
                  <button 
                    onClick={() => { setWizardProyecto(p); setWizardEsGrupal(p.es_grupal ?? false); setWizardInitialStep(1); setIsWizardOpen(true); }}
                    className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl text-[0.8em]"
                  >
                    ✏️
                  </button>
                )}
              </div>
            </div>
          ))}
          {proyectos.length === 0 && (
            <p className="col-span-full text-center py-10 text-zinc-400 font-bold italic">No has iniciado ningún proyecto aún.</p>
          )}
        </div>
      </div>
    )
  }

  const renderProgressionHeader = () => {
    const unitLogoUrl = perfil.unidades?.logo_unidad_url
    const completedSpecialties = esp.especialidadesPersonales.filter(ep => ep.estado === 'completado')

    return (
      <div className="relative overflow-hidden p-6 rounded-[2.5rem] shadow-2xl border-2 flex flex-col gap-6 transition-all" style={{ backgroundColor: themePrimary, borderColor: themeSecondary }}>
        {/* Background Unit Logo Watermark */}
        {unitLogoUrl && (
          <img 
            src={unitLogoUrl} 
            alt="" 
            className="absolute right-[-2rem] bottom-[-2rem] w-64 h-64 opacity-15 pointer-events-none select-none object-contain"
          />
        )}
        
        {/* Top Info section */}
        <div className="flex flex-col md:flex-row items-center gap-6 w-full relative z-10">
          {/* Insignia de Etapa */}
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 overflow-hidden shrink-0" style={{ borderColor: themeSecondary }}>
            {etapaActual?.imagen_url ? (
              <img src={etapaActual.imagen_url} alt={etapaActual.nombre} className="w-full h-full object-cover" onError={(e: React.SyntheticEvent<HTMLImageElement>) => e.currentTarget.style.display='none'} />
            ) : (
              <span className="text-5xl">✨</span>
            )}
          </div>
          
          <div className="text-center md:text-left flex-1 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[1em] font-bold uppercase leading-none opacity-80" style={{ color: themeSecondary }}>Etapa de Progresión</span>
                <h2 className="text-[2.8em] font-bold uppercase tracking-tighter leading-none mb-1" style={{ color: themeSecondary }}>
                  {etapaActual?.nombre || 'Explorador'}
                </h2>
                <p className="text-[1.1em] font-bold opacity-90 uppercase leading-none mb-2" style={{ color: themeSecondary }}>
                  {perfil.nombres} {perfil.apellidos}
                </p>
                <div className="inline-block px-4 py-1 rounded-full text-[0.8em] font-bold uppercase tracking-widest" style={{ backgroundColor: themeSecondary, color: themePrimary }}>
                  {etapaActual?.rango_edad || (isAvanzada ? '15 a 17 años' : isClan ? '17 a 20 años' : 'Progresión')}
                </div>
              </div>
              
              {isLeader && (
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-3xl border-2 border-white/30 shadow-lg shrink-0 z-20">
                  <label className="block text-[0.8em] font-bold uppercase mb-2 ml-1 drop-shadow-md" style={{ color: themeSecondary }}>Asignar Etapa</label>
                  <select 
                    value={etapaActual?.id || ''} 
                    onChange={(e) => handleSetEtapaDefault(e.target.value)}
                    className="bg-white/90 font-bold text-[0.9em] p-2 rounded-xl outline-none cursor-pointer uppercase tracking-tight w-full shadow-inner min-w-[150px]"
                    style={{ color: themeTextDark }}
                  >
                    <option value="">Seleccionar...</option>
                    {todasEtapas.map(e => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom completed specialties grid */}
        {completedSpecialties.length > 0 && (
          <div className="relative z-10 pt-4 border-t border-white/20 w-full">
            <span className="text-[1.25em] font-bold uppercase tracking-widest block mb-1 text-center md:text-center" style={{ color: themeSecondary }}>
              🎖️ Especialidades Obtenidas
            </span>
            <div className="flex flex-wrap justify-center md:justify-center gap-2">
              {completedSpecialties.map(ep => {
                const name = ep.nombre_personalizado || ep.especialidades_definiciones?.nombre || 'Especialidad'
                const bgColor = getFieldBgColor(ep.campo_interes)
                const borderColor = getFieldColor(ep.campo_interes)
                const textColor = getFieldTextColor(ep.campo_interes)
                const logoPath = getFieldLogoPath(ep.campo_interes)
                return (
                  <div 
                    key={ep.id}
                    className="flex flex-col items-center p-2 rounded-[1rem] border transition-all hover:scale-105 shadow-md w-28 shrink-0 relative overflow-hidden"
                    style={{
                      backgroundColor: bgColor,
                      borderColor: borderColor,
                    }}
                  >
                    <div className="absolute top-1 right-1 w-4 h-4 bg-white/80 dark:bg-black/40 rounded-full flex items-center justify-center p-0.5 shadow-sm">
                      <img 
                        src={logoPath} 
                        alt="" 
                        className="w-full h-full object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <img 
                      src={getSpecialtyInsigniaPath(name)} 
                      alt={name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/especialidades/generico.svg'
                      }}
                      className="w-16 h-16 object-contain drop-shadow-md"
                      loading="lazy"
                      decoding="async"
                    />
                    <span 
                      className="text-[0.8em] font-extrabold text-center uppercase tracking-tight mt-1.5 truncate w-full"
                      style={{ color: textColor }}
                      title={name}
                    >
                      {name}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Ceremonias / Acciones de Dirigente */}
        {isLeader && (
          <div className="relative z-10 pt-4 border-t border-white/20 w-full flex flex-col gap-2">
            <span className="text-[1.1em] font-extrabold uppercase tracking-widest block text-center" style={{ color: themeSecondary }}>
              👑 Acciones de Ceremonia e Hitos
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => cer.setActiveCeremonyType('etapa')}
                className="p-2 active:scale-95 text-[1em] font-bold uppercase rounded-xl tracking-wider transition-all border border-white/25 cursor-pointer"
                style={{ backgroundColor: themeSecondary, color: themePrimary }}
              >
                🎖️ Entregar Insignia
              </button>
              <button
                onClick={() => cer.setActiveCeremonyType('promesa')}
                className="p-2 active:scale-95 text-[1em] font-bold uppercase rounded-xl tracking-wider transition-all border border-white/25 cursor-pointer"
                style={{ backgroundColor: themeSecondary, color: themePrimary }}
              >
                🕯️ Promesa
              </button>
              <button
                onClick={() => cer.setActiveCeremonyType('paso')}
                className="p-2 active:scale-95 text-[1em] font-bold uppercase rounded-xl tracking-wider transition-all border border-white/25 cursor-pointer"
                style={{ backgroundColor: themeSecondary, color: themePrimary }}
              >
                👣 Paso de Unidad
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderSubTabBar = () => {
    const labelProgreso = isOwner ? 'Mi Progreso' : `Progreso de ${perfil.nombres}`
    const labelEspecialidades = esp.especialidadesSupervisadas.length > 0
      ? 'Tutorías y Supervisiones'
      : (isOwner ? 'Mis Especialidades' : `Especialidades de ${perfil.nombres}`)
    const labelCeremonias = 'Ceremonias e Hitos'

    return (
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 dark:border-white/10 pb-2">
        <button
          onClick={() => esp.setSubTab('progreso')}
          className={`pb-2 px-4 font-bold uppercase text-[0.85em] md:text-[0.95em] border-b-2 transition-all rounded-t-lg ${
            esp.subTab === 'progreso'
              ? 'font-extrabold'
              : 'border-transparent text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300'
          }`}
          style={esp.subTab === 'progreso' ? { backgroundColor: themePrimary, borderColor: themeSecondary, color: themeSecondary } : {}}
        >
          {labelProgreso} {isManada ? '🐾' : isCompania || isTropa ? '⚔️' : '📈'}
        </button>
        <button
          onClick={() => esp.setSubTab('especialidades')}
          className={`pb-2 px-4 font-bold uppercase text-[0.85em] md:text-[0.95em] border-b-2 transition-all rounded-t-lg ${
            esp.subTab === 'especialidades'
              ? 'font-extrabold'
              : 'border-transparent text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300'
          }`}
          style={esp.subTab === 'especialidades' ? { backgroundColor: themePrimary, borderColor: themeSecondary, color: themeSecondary } : {}}
        >
          {labelEspecialidades} 🎖️
        </button>
        <button
          onClick={() => esp.setSubTab('ceremonias')}
          className={`pb-2 px-4 font-bold uppercase text-[0.85em] md:text-[0.95em] border-b-2 transition-all rounded-t-lg ${
            esp.subTab === 'ceremonias'
              ? 'font-extrabold'
              : 'border-transparent text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300'
          }`}
          style={esp.subTab === 'ceremonias' ? { backgroundColor: themePrimary, borderColor: themeSecondary, color: themeSecondary } : {}}
        >
          {labelCeremonias} 🏆
        </button>
      </div>
    )
  }

  const getRoleLabel = (rolId: number) => {
    const roles: Record<number, string> = {
      1: 'Admin', 2: 'Dirigente', 3: 'Guiadora', 8: 'Apoderado', 
      9: 'Lobato', 10: 'Guía', 11: 'Scout', 12: 'Pionero', 13: 'Caminante'
    };
    return roles[rolId] || 'Miembro';
  };

  const renderCeremoniasSection = () => {
    return (
      <ProgresionCeremonias
        ceremonias={cer.ceremonias}
        userPerfil={userPerfil}
        themePrimary={themePrimary}
        themeSecondary={themeSecondary}
        inlineMessageTexts={cer.inlineMessageTexts}
        setInlineMessageTexts={cer.setInlineMessageTexts}
        handleSaveInlineMessage={cer.handleSaveInlineMessage}
        handleViewReport={cer.handleViewReport}
      />
    )
  }

  const renderEspecialidadesSection = () => {
    return (
      <ProgresionEspecialidades
        perfil={perfil}
        userPerfil={userPerfil}
        themePrimary={themePrimary}
        themeSecondary={themeSecondary}
        isOwner={isOwner}
        inactive={inactive}
        definicionesEspecialidades={esp.definicionesEspecialidades}
        especialidadesPersonales={esp.especialidadesPersonales}
        especialidadesSupervisadas={esp.especialidadesSupervisadas}
        loadingEspecialidades={esp.loadingEspecialidades}
        searchCatQuery={esp.searchCatQuery}
        setSearchCatQuery={esp.setSearchCatQuery}
        selectedFieldFilter={esp.selectedFieldFilter}
        setSelectedFieldFilter={esp.setSelectedFieldFilter}
        showSpecialtyWizard={esp.showSpecialtyWizard}
        setShowSpecialtyWizard={esp.setShowSpecialtyWizard}
        activeEspecialidad={esp.activeEspecialidad}
        setActiveEspecialidad={esp.setActiveEspecialidad}
        availableMonitors={esp.availableMonitors}
        availableActivityArticles={esp.availableActivityArticles}
        fetchEspecialidades={esp.fetchEspecialidades}
        refreshActiveSpecialty={esp.refreshActiveSpecialty}
        fetchAvailableMonitors={esp.fetchAvailableMonitors}
        resetWizard={esp.resetWizard}
        setWizardStep={esp.setWizardStep}
        setWSelectedField={esp.setWSelectedField}
        setWSelectedDefId={esp.setWSelectedDefId}
        setWCustomName={esp.setWCustomName}
        subTab={esp.subTab}
      />
    )
  }

  const renderEspecialidadesSectionOnlyTutorias = () => {
    return (
      <ProgresionEspecialidades
        perfil={perfil}
        userPerfil={userPerfil}
        themePrimary={themePrimary}
        themeSecondary={themeSecondary}
        isOwner={isOwner}
        inactive={inactive}
        definicionesEspecialidades={esp.definicionesEspecialidades}
        especialidadesPersonales={esp.especialidadesPersonales}
        especialidadesSupervisadas={esp.especialidadesSupervisadas}
        loadingEspecialidades={esp.loadingEspecialidades}
        searchCatQuery={esp.searchCatQuery}
        setSearchCatQuery={esp.setSearchCatQuery}
        selectedFieldFilter={esp.selectedFieldFilter}
        setSelectedFieldFilter={esp.setSelectedFieldFilter}
        showSpecialtyWizard={esp.showSpecialtyWizard}
        setShowSpecialtyWizard={esp.setShowSpecialtyWizard}
        activeEspecialidad={esp.activeEspecialidad}
        setActiveEspecialidad={esp.setActiveEspecialidad}
        availableMonitors={esp.availableMonitors}
        availableActivityArticles={esp.availableActivityArticles}
        fetchEspecialidades={esp.fetchEspecialidades}
        refreshActiveSpecialty={esp.refreshActiveSpecialty}
        fetchAvailableMonitors={esp.fetchAvailableMonitors}
        resetWizard={esp.resetWizard}
        setWizardStep={esp.setWizardStep}
        setWSelectedField={esp.setWSelectedField}
        setWSelectedDefId={esp.setWSelectedDefId}
        setWCustomName={esp.setWCustomName}
        subTab="especialidades"
      />
    )
  }

  const renderCaminanteProgression = () => {

    return (
      <div className="space-y-12 animate-in fade-in duration-500 pb-20">
        {renderProgressionHeader()}

        {renderSubTabBar()}

        {esp.subTab === 'ceremonias' ? (
          renderCeremoniasSection()
        ) : esp.especialidadesSupervisadas.length > 0 && esp.subTab === 'especialidades' ? (
          renderEspecialidadesSectionOnlyTutorias()
        ) : esp.subTab === 'especialidades' ? (
          renderEspecialidadesSection()
        ) : (
          <>
            {!agenda ? (
              renderAgendaNotInitializedCard()
            ) : (
              <>
            {/* Camino Simbólico - Insignias */}
            <div className="p-6 rounded-[2.5rem] bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 shadow-xl">
              <span className="text-[0.8em] font-bold uppercase tracking-widest block mb-6 text-center md:text-left" style={{ color: themePrimary }}>Camino Simbólico del Caminante</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* FUEGO */}
                <div 
                  className={`p-6 rounded-3xl border-2 flex flex-col items-center text-center transition-all ${
                    agenda.etapa_progresion === 'fuego' || agenda.etapa_progresion === 'antorcha' || agenda.etapa_progresion === 'partida'
                      ? 'shadow-lg' 
                      : 'bg-white dark:bg-zinc-800/40 border-zinc-200 opacity-60'
                  }`}
                  style={
                    agenda.etapa_progresion === 'fuego' || agenda.etapa_progresion === 'antorcha' || agenda.etapa_progresion === 'partida'
                      ? { borderColor: themePrimary, backgroundColor: `${themePrimary}20` }
                      : {}
                  }
                >
                  <img 
                    src="/images/progresion/clan/etapa_fuego.png" 
                    alt="Insignia Fuego" 
                    className={`w-20 h-20 object-contain mb-3 transition-all duration-300 ${
                      ['fuego', 'antorcha', 'partida'].includes(agenda.etapa_progresion || '') ? 'grayscale-0' : 'grayscale opacity-40'
                    }`}
                  />
                  <h4 className="font-bold uppercase text-[1.2em]">Insignia Fuego</h4>
                  <p className="text-[0.8em] font-bold text-zinc-400 mt-1">
                    {agenda.fecha_fuego ? `Recibida el ${agenda.fecha_fuego}` : 'No iniciada'}
                  </p>
                  {isLeader && agenda.etapa_progresion === 'ninguna' && (
                    <button 
                      onClick={() => handleUpdateAgendaEtapa('fuego')}
                      className="mt-4 px-4 py-2 text-white rounded-xl text-[0.8em] font-bold uppercase"
                      style={{ backgroundColor: themePrimary }}
                    >
                      Entregar Fuego
                    </button>
                  )}
                </div>

                {/* ANTORCHA */}
                <div className={`p-6 rounded-3xl border-2 flex flex-col items-center text-center transition-all ${
                  agenda.etapa_progresion === 'antorcha' || agenda.etapa_progresion === 'partida'
                    ? 'bg-orange-50/20 border-orange-500 shadow-lg' 
                    : 'bg-white dark:bg-zinc-800/40 border-zinc-200 opacity-60'
                }`}>
                  <img 
                    src="/images/progresion/clan/etapa_antorcha.png" 
                    alt="Insignia Antorcha" 
                    className={`w-20 h-20 object-contain mb-3 transition-all duration-300 ${
                      ['antorcha', 'partida'].includes(agenda.etapa_progresion || '') ? 'grayscale-0' : 'grayscale opacity-40'
                    }`}
                  />
                  <h4 className="font-bold uppercase text-[1.2em]">Insignia Antorcha</h4>
                  <p className="text-[0.8em] font-bold text-zinc-400 mt-1">
                    {agenda.fecha_antorcha ? `Recibida el ${agenda.fecha_antorcha}` : 'No iniciada'}
                  </p>
                  {isLeader && agenda.etapa_progresion === 'fuego' && (
                    <button 
                      onClick={() => handleUpdateAgendaEtapa('antorcha')}
                      className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-xl text-[0.8em] font-bold uppercase"
                    >
                      Entregar Antorcha
                    </button>
                  )}
                </div>

                {/* LA PARTIDA */}
                <div className={`p-6 rounded-3xl border-2 flex flex-col items-center text-center transition-all ${
                  agenda.etapa_progresion === 'partida'
                    ? 'bg-blue-50/20 border-blue-500 shadow-lg' 
                    : 'bg-white dark:bg-zinc-800/40 border-zinc-200 opacity-60'
                }`}>
                  <img 
                    src="/images/progresion/clan/etapa_partida.png" 
                    alt="La Partida" 
                    className={`w-20 h-20 object-contain mb-3 transition-all duration-300 ${
                      agenda.etapa_progresion === 'partida' ? 'grayscale-0' : 'grayscale opacity-40'
                    }`}
                  />
                  <h4 className="font-bold uppercase text-[1.2em]">La Partida</h4>
                  <p className="text-[0.8em] font-bold text-zinc-400 mt-1">
                    {agenda.fecha_partida ? `Remando su propia canoa el ${agenda.fecha_partida}` : 'No iniciada'}
                  </p>
                  {isLeader && agenda.etapa_progresion === 'antorcha' && (
                    <button 
                      onClick={() => handleUpdateAgendaEtapa('partida')}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-xl text-[0.8em] font-bold uppercase"
                    >
                      Otorgar Partida
                    </button>
                  )}
                </div>

              </div>
            </div>

            {/* Pre-proyecto (4 Preguntas) */}
            {renderPreProyectoSection()}
          </>
        )}

        {/* Mis Proyectos (12 Pasos) */}
        {renderProyectosSection(clanProyectos)}

        {agenda && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4 border-zinc-200 dark:border-white/10">
              <div>
                <h3 className="font-bold uppercase text-[1.5em] text-zinc-900 dark:text-white">Mis Metas de Progresión</h3>
                <p className="text-[0.8em] font-bold text-zinc-400 mt-1">Crea tus objetivos a 6 meses basados en la propuesta terminal.</p>
              </div>
              {isOwner && !inactive && (
                <button 
                  onClick={() => setShowAddGoalModal(true)}
                  className="px-4 py-2.5 rounded-2xl text-[0.8em] font-bold uppercase tracking-wider text-white shadow-xl hover:scale-102 transition-all"
                  style={{ backgroundColor: colorHighlight }}
                >
                  ➕ Añadir Meta
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agendaObjetivos.map(meta => {
                const areaColor = meta.progresion_objetivos?.progresion_areas?.color || '#6b7280'
                const areaName = meta.progresion_objetivos?.progresion_areas?.nombre || 'Corporalidad'
                const isAlcanzada = meta.estado === 'alcanzado'
                const isEnProceso = meta.estado === 'en_proceso'

                return (
                  <div 
                    key={meta.id} 
                    className={`p-6 rounded-[2rem] border-2 shadow-md relative flex flex-col justify-between ${
                      isAlcanzada ? 'bg-white dark:bg-zinc-850/40 border-green-400' : isEnProceso ? 'bg-blue-50/20 border-blue-400' : 'bg-white dark:bg-zinc-850/20 border-zinc-200'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span 
                          className="px-3 py-1 rounded-full text-[0.8em] font-bold uppercase tracking-wider text-white" 
                          style={{ backgroundColor: areaColor }}
                        >
                          {areaName}
                        </span>
                        
                        <span className={`text-[0.8em] font-bold uppercase ${
                          isAlcanzada ? 'text-green-500' : isEnProceso ? 'text-blue-500' : 'text-zinc-400'
                        }`}>
                          ● {isAlcanzada ? 'Alcanzada' : isEnProceso ? 'En Evaluación' : 'Pendiente'}
                        </span>
                      </div>

                      <p className="font-bold text-[0.95em] text-zinc-900 dark:text-white mb-2">
                        {meta.progresion_objetivos?.texto_terminal}
                      </p>

                      <div className="mt-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border dark:border-white/5">
                        <span className="text-[0.8em] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Mi Meta Personal:</span>
                        <p className="text-[0.85em] font-bold text-zinc-700 dark:text-zinc-300 italic">
                          "{meta.meta_personal}"
                        </p>
                      </div>

                      {meta.evidencia_texto && (
                        <div className="mt-3 p-3 bg-green-50/20 dark:bg-green-950/10 rounded-xl border border-green-200/50 text-[0.8em] font-bold text-zinc-650 dark:text-zinc-350">
                          <span className="text-[0.8em] font-bold uppercase text-green-500 block mb-1">Evidencia Enviada:</span>
                          "{meta.evidencia_texto}"
                          {meta.evidencia_url && (
                            <a href={meta.evidencia_url} target="_blank" rel="noopener noreferrer" className="block text-blue-500 mt-1 font-bold underline">
                              🔗 Ver evidencia externa
                            </a>
                          )}
                        </div>
                      )}

                      {meta.evaluacion_lider && (
                        <div className="mt-3 p-3 bg-amber-50/20 dark:bg-amber-950/10 rounded-xl border border-amber-200/50 text-[0.8em] font-bold text-amber-700 dark:text-amber-200">
                          <span className="text-[0.8em] font-bold uppercase text-amber-500 block mb-1">Evaluación del Dirigente:</span>
                          "{meta.evaluacion_lider}"
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex gap-2 justify-end">
                      {isOwner && !isAlcanzada && !isEnProceso && !inactive && (
                        <button
                          onClick={() => setActiveMetaIdForEvidence(meta.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[0.8em] font-bold uppercase tracking-tight"
                        >
                          Enviar Evidencia
                        </button>
                      )}

                      {isLeader && !isAlcanzada && (
                        <button
                          onClick={() => {
                            setActiveMetaIdForReview(meta.id);
                            setLeaderReviewText('');
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-xl text-[0.8em] font-bold uppercase tracking-tight"
                        >
                          Evaluar Meta
                        </button>
                      )}

                      {isOwner && !isAlcanzada && (
                        <button
                          onClick={() => handleDeleteGoal(meta.id)}
                          className="px-3 py-2 bg-red-55 text-red-600 hover:bg-red-100 rounded-xl text-[0.8em] font-bold"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {activeMetaIdForEvidence === meta.id && (
                      <div className="absolute inset-0 bg-white dark:bg-zinc-900 rounded-[2rem] p-6 z-20 flex flex-col justify-between border-2 border-blue-400">
                        <div className="space-y-4">
                          <span className="text-[0.8em] font-bold uppercase tracking-widest text-blue-500 block">Reportar Evidencia</span>
                          
                          <div className="space-y-1">
                            <label className="text-[0.8em] font-bold uppercase tracking-wider text-zinc-400">¿Qué hiciste para lograrlo? (Mínimo 150 caracteres)</label>
                            <textarea 
                              value={evidenceText}
                              onChange={e => setEvidenceText(e.target.value)}
                              placeholder="Detalla de forma madura y seria cómo cumpliste esta meta..."
                              className="w-full p-3 rounded-xl border dark:border-white/10 bg-zinc-50 dark:bg-zinc-800 text-[0.85em] font-bold h-24"
                            />
                            <span className={`text-[0.8em] font-bold block text-right ${evidenceText.length >= 150 ? 'text-green-500' : 'text-red-500'}`}>
                              {evidenceText.length} / 150 caracteres
                            </span>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[0.8em] font-bold uppercase tracking-wider text-zinc-400">Enlace de Evidencia</label>
                            <input 
                              type="url"
                              value={evidenceUrl}
                              onChange={e => setEvidenceUrl(e.target.value)}
                              placeholder="https://drive.google.com/..."
                              className="w-full p-3 rounded-xl border dark:border-white/10 bg-zinc-50 dark:bg-zinc-800 text-[0.85em] font-bold"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end mt-4">
                          <button 
                            onClick={() => { setActiveMetaIdForEvidence(null); setEvidenceText(''); setEvidenceUrl(''); }}
                            className="px-4 py-2 text-[0.8em] font-bold uppercase text-zinc-500"
                          >
                            Cancelar
                          </button>
                          <button 
                            onClick={() => handleRegisterGoalEvidence(meta.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[0.8em] font-bold uppercase"
                          >
                            Enviar
                          </button>
                        </div>
                      </div>
                    )}

                    {activeMetaIdForReview === meta.id && (
                      <div className="absolute inset-0 bg-white dark:bg-zinc-900 rounded-[2rem] p-6 z-20 flex flex-col justify-between border-2 border-green-500">
                        <div className="space-y-4">
                          <span className="text-[0.8em] font-bold uppercase tracking-widest text-green-600 block">Evaluar Meta Personal</span>
                          <p className="text-[0.85em] font-bold text-zinc-650 dark:text-zinc-350 leading-tight">
                            <strong>Meta:</strong> "{meta.meta_personal}"
                          </p>
                          
                          <div className="space-y-1">
                            <label className="text-[0.8em] font-bold uppercase tracking-wider text-zinc-400">Comentario Pedagógico / Retroalimentación</label>
                            <textarea 
                              value={leaderReviewText}
                              onChange={e => setLeaderReviewText(e.target.value)}
                              placeholder="Escribe la evaluación pedagógica..."
                              className="w-full p-3 rounded-xl border dark:border-white/10 bg-zinc-50 dark:bg-zinc-800 text-[0.85em] font-bold h-24"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end mt-4">
                          <button 
                            onClick={() => { setActiveMetaIdForReview(null); setLeaderReviewText(''); }}
                            className="px-4 py-2 text-[0.8em] font-bold uppercase text-zinc-500"
                          >
                            Cancelar
                          </button>
                          <button 
                            onClick={() => handleLeaderReviewGoal(meta.id, false)}
                            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-[0.8em] font-bold uppercase"
                          >
                            Pedir Cambios
                          </button>
                          <button 
                            onClick={() => handleLeaderReviewGoal(meta.id, true)}
                            className="px-4 py-2 bg-green-600 hover:brightness-110 text-white rounded-xl text-[0.8em] font-bold uppercase"
                          >
                            Marcar Logrado
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
              {agendaObjetivos.length === 0 && (
                <p className="col-span-full text-center py-6 text-zinc-400 font-bold italic">No has agregado metas personales.</p>
              )}
            </div>
          </div>
        )}

        {/* Acordeón de Objetivos Educativos Terminales de la Unidad */}
        {renderObjetivosEducativosSection()}

        {/* Modal: Añadir Meta */}
        {showAddGoalModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[140] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-xl rounded-[2rem] p-6 shadow-2xl space-y-6">
              <h4 className="text-xl font-bold uppercase tracking-tight text-zinc-900 dark:text-white">
                ➕ Añadir Meta a mi Agenda de Vida
              </h4>
              
              <div className="space-y-1">
                <label className="text-[0.8em] font-bold uppercase tracking-wider text-zinc-400 block ml-2">Selecciona un Objetivo Educativo</label>
                <select
                  value={selectedObjId}
                  onChange={e => setSelectedObjId(e.target.value)}
                  className="w-full p-4 rounded-2xl border dark:border-white/10 bg-zinc-50 dark:bg-zinc-800 text-[0.9em] font-bold"
                >
                  <option value="">Seleccione un objetivo...</option>
                  {todosObjetivosClan
                    .filter(obj => !agendaObjetivos.some(meta => meta.objetivo_id === obj.id))
                    .map(obj => (
                      <option key={obj.id} value={obj.id}>
                        [{obj.progresion_areas?.nombre || 'General'}] {obj.texto_terminal}
                      </option>
                    ))
                  }
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[0.8em] font-bold uppercase tracking-wider text-zinc-400 block ml-2">Mi Meta Personal (Cómo planeo lograrlo)</label>
                <textarea 
                  value={metaPersonalText}
                  onChange={e => setMetaPersonalText(e.target.value)}
                  placeholder="Escribe aquí tu meta personal en base al objetivo seleccionado..."
                  className="w-full p-4 rounded-2xl border dark:border-white/10 bg-zinc-50 dark:bg-zinc-800 text-[0.9em] font-bold h-32"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button 
                  onClick={handleSaveGoalMeta}
                  className="flex-1 py-4 text-white font-bold uppercase rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all"
                  style={{ backgroundColor: colorHighlight }}
                >
                  Guardar Meta
                </button>
                <button 
                  onClick={() => { setShowAddGoalModal(false); setSelectedObjId(''); setMetaPersonalText(''); }}
                  className="px-6 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-2xl font-bold uppercase"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
        </>)}

      </div>
    )
  }

  // ==========================================
  // RENDER - AVANZADA (PIONEROS)
  // ==========================================
  const renderPioneroProgression = () => {

    return (
      <div className="space-y-12 animate-in fade-in duration-500 pb-20">
        {renderProgressionHeader()}

        {renderSubTabBar()}

        {esp.subTab === 'ceremonias' ? (
          renderCeremoniasSection()
        ) : esp.especialidadesSupervisadas.length > 0 && esp.subTab === 'especialidades' ? (
          renderEspecialidadesSectionOnlyTutorias()
        ) : esp.subTab === 'especialidades' ? (
          renderEspecialidadesSection()
        ) : (
          <>
            {/* Mis Competencias (7 Rumbos) */}
            <div className="space-y-2">
          <div className="flex justify-between items-center border-b pb-4 border-zinc-200 dark:border-white/10">
            <div>
              <h3 className="font-bold uppercase text-[1.5em] text-zinc-900 dark:text-white">Mis Competencias</h3>
              <p className="text-[0.9em] font-bold text-zinc-400">Los rumbos de competencia adquiridos en las aventuras con tu comunidad.</p>
            </div>
            {isOwner && canSeeAllTabs(perfil) && !inactive && (
              <button 
                onClick={() => {
                  setEditingSolicitudId(null);
                  setSelectedCompetenciaArea('');
                  setJustificacionNnj('');
                  setEvidenciaCompUrl('');
                  setCompProyectoId('');
                  setShowCompetenciaModal(true);
                }}
                className="p-2 rounded-2xl text-[0.8em] font-bold uppercase tracking-wider text-white shadow-xl hover:scale-102 transition-all"
                style={{ backgroundColor: themePrimary, color: themeSecondary }}
              >
                🎓 Solicitar Competencia
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
            {['cultura', 'actividad_fisica', 'trabajo_equipo', 'innovacion', 'comunicacion', 'ciudadania', 'medioambiente'].map(area => {
              const areaRows = competencias.filter(c => c.area_competencia === area)
              const isAprobada = areaRows.some(c => c.estado === 'aprobada')
              const isPendiente = areaRows.some(c => c.estado === 'pendiente')
              const isCambio = areaRows.some(c => c.estado === 'solicitud_cambio')
              const isRechazada = areaRows.some(c => c.estado === 'rechazada')
              
              const detailsMap: Record<string, { image: string; label: string }> = {
                cultura: { image: '/images/competencias/Cultura.svg', label: 'Cultura' },
                actividad_fisica: { image: '/images/competencias/ActividadFisica.svg', label: 'Actividad Física' },
                trabajo_equipo: { image: '/images/competencias/TrabajoEnEquipo.svg', label: 'Trabajo en Equipo' },
                innovacion: { image: '/images/competencias/Innovacion.svg', label: 'Innovación' },
                comunicacion: { image: '/images/competencias/Comunicacion.svg', label: 'Comunicación' },
                ciudadania: { image: '/images/competencias/Ciudadania.svg', label: 'Ciudadanía' },
                medioambiente: { image: '/images/competencias/MedioAmbiente.svg', label: 'Medioambiente' }
              }

              const areaDetails = detailsMap[area]

              return (
                <div 
                  key={area} 
                  className={`p-2 rounded-[1rem] border-2 flex flex-col items-center justify-between text-center shadow-md relative transition-all ${
                    isAprobada 
                      ? 'scale-102' 
                      : isPendiente 
                        ? 'bg-blue-50/10 border-blue-400 dark:border-blue-500/50' 
                        : isCambio
                          ? 'bg-amber-50/10 border-amber-400 dark:border-amber-500/50'
                          : isRechazada
                            ? 'bg-red-50/10 border-red-400 dark:border-red-500/50'
                            : 'bg-zinc-50 dark:bg-zinc-800/20 border-zinc-200 dark:border-white/5 grayscale opacity-45'
                  }`}
                  style={isAprobada ? { borderColor: themePrimary, backgroundColor: `${themePrimary}10` } : {}}
                >
                  <div className="flex flex-col items-center w-full">
                    {areaDetails.image ? (
                      <img 
                        src={areaDetails.image} 
                        alt="" 
                        className="w-30 h-30 mb-2 object-contain"
                      />
                    ) : (
                      <span className="text-4xl mb-2">✨</span>
                    )}
                    <h5 className="font-bold uppercase text-[1em] leading-tight mt-1 text-zinc-900 dark:text-white">
                      {areaDetails.label}
                    </h5>
                  </div>

                  <span className={`text-[0.9em] font-bold uppercase mt-2 ${
                    isAprobada 
                      ? 'text-green-500' 
                      : isPendiente 
                        ? 'text-blue-500' 
                        : isCambio 
                          ? 'text-amber-500' 
                          : isRechazada
                            ? 'text-red-500'
                            : 'text-zinc-400'
                  }`}>
                    {isAprobada ? 'Aprobada' : isPendiente ? 'Pendiente' : isCambio ? 'Cambio Solicitado' : isRechazada ? 'Rechazada' : 'Inactiva'}
                  </span>

                  {/* Botones de acción visibles dentro de la tarjeta */}
                  <div className="mt-3 w-full z-10">
                    {isAprobada ? (
                      <button
                        onClick={() => {
                          const approvedRow = areaRows.find(c => c.estado === 'aprobada')
                          if (approvedRow) {
                            setActiveMetaIdForReview(approvedRow.id)
                          }
                        }}
                        className="w-full py-1 text-[0.9em] font-bold uppercase rounded-lg border border-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-500/20 transition-colors"
                      >
                        🔎 Detalles
                      </button>
                    ) : isPendiente ? (
                      isLeader ? (
                        <button
                          onClick={() => {
                            const pendingRow = areaRows.find(c => c.estado === 'pendiente')
                            if (pendingRow) {
                              setActiveMetaIdForReview(pendingRow.id)
                              setLeaderReviewText('')
                            }
                          }}
                          className="w-full py-1 text-[0.9em] font-bold uppercase rounded-lg bg-blue-600 hover:bg-blue-750 text-white shadow-sm transition-colors"
                        >
                          ✅ Resolver
                        </button>
                      ) : (
                        <div className="w-full flex gap-1 justify-center items-center">
                          <span className="flex-1 text-[0.9em] font-bold text-zinc-400 block py-1 uppercase tracking-tight">⏳ En Espera</span>
                          {isOwner && (
                            <button
                              onClick={() => {
                                const pendingRow = areaRows.find(c => c.estado === 'pendiente')
                                if (pendingRow) handleDeleteCompetencia(pendingRow.id)
                              }}
                              className="px-2 py-1 text-[0.9em] font-bold uppercase rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                              title="Retirar solicitud"
                            >
                              ❌
                            </button>
                          )}
                        </div>
                      )
                    ) : isCambio ? (
                      isOwner ? (
                        <div className="w-full flex gap-1 justify-center items-center">
                          <button
                            onClick={() => {
                              const activeRow = areaRows.find(c => c.estado === 'solicitud_cambio')
                              if (activeRow) {
                                setEditingSolicitudId(activeRow.id)
                                setSelectedCompetenciaArea(activeRow.area_competencia)
                                setJustificacionNnj(activeRow.justificacion_nnj || '')
                                setEvidenciaCompUrl(activeRow.evidencia_url || '')
                                setCompProyectoId(activeRow.proyecto_id || '')
                                setShowCompetenciaModal(true)
                              }
                            }}
                            className="flex-1 py-1 text-[0.9em] font-bold uppercase rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-colors"
                          >
                            ✏️ Corregir
                          </button>
                          <button
                            onClick={() => {
                              const activeRow = areaRows.find(c => c.estado === 'solicitud_cambio')
                              if (activeRow) handleDeleteCompetencia(activeRow.id)
                            }}
                            className="px-2 py-1 text-[0.9em] font-bold uppercase rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                            title="Retirar solicitud"
                          >
                            ❌
                          </button>
                        </div>
                      ) : isLeader ? (
                        <button
                          onClick={() => {
                            const activeRow = areaRows.find(c => c.estado === 'solicitud_cambio')
                            if (activeRow) {
                              setActiveMetaIdForReview(activeRow.id)
                              setLeaderReviewText(activeRow.evaluacion_lider || '')
                            }
                          }}
                          className="w-full py-1 text-[0.9em] font-bold uppercase rounded-lg bg-zinc-200 hover:bg-zinc-350 dark:bg-zinc-770 dark:hover:bg-zinc-650 text-zinc-700 dark:text-zinc-300 transition-colors"
                        >
                          🔍 Resolver
                        </button>
                      ) : (
                        <span className="text-[0.9em] font-bold text-amber-500 block py-1 uppercase tracking-tight">⏳ Pendiente</span>
                      )
                    ) : isRechazada ? (
                      <div className="w-full flex gap-1 justify-center items-center">
                        <button
                          onClick={() => {
                            const rejectedRow = areaRows.find(c => c.estado === 'rechazada')
                            if (rejectedRow) {
                              setActiveMetaIdForReview(rejectedRow.id)
                            }
                          }}
                          className="flex-1 py-1 text-[0.9em] font-bold uppercase rounded-lg border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          🔎 Detalles
                        </button>
                        {isOwner && (
                          <button
                            onClick={() => {
                              const rejectedRow = areaRows.find(c => c.estado === 'rechazada')
                              if (rejectedRow) handleDeleteCompetencia(rejectedRow.id)
                            }}
                            className="px-2.5 py-1 text-[0.9em] font-bold uppercase rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors"
                            title="Eliminar solicitud rechazada"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    ) : (
                      // Inactiva
                      isLeader ? (
                        <button
                          onClick={() => {
                            setSelectedDirectCompetenciaArea(area)
                            setDirectLeaderReviewText('')
                            setDirectCompProyectoId('')
                            setShowDirectCompetenciaModal(true)
                          }}
                          className="w-full py-1 text-[0.9em] font-bold uppercase rounded-lg bg-green-600 hover:bg-green-700 text-white shadow-sm transition-colors"
                        >
                          ➕ Entregar
                        </button>
                      ) : isOwner ? (
                        <button
                          onClick={() => {
                            setEditingSolicitudId(null)
                            setSelectedCompetenciaArea(area)
                            setJustificacionNnj('')
                            setEvidenciaCompUrl('')
                            setCompProyectoId('')
                            setShowCompetenciaModal(true)
                          }}
                          className="w-full py-1 text-[0.9em] font-bold uppercase rounded-lg bg-zinc-200 hover:bg-[#4a3f8c] dark:bg-zinc-700 dark:hover:bg-[#4a3f8c] text-zinc-700 dark:text-zinc-300 transition-colors"
                        >
                          🚀 Solicitar
                        </button>
                      ) : null
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Detalle de Solicitudes de Competencia (Bitácora) */}
        {competencias.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-bold uppercase text-[1.2em] text-zinc-900 dark:text-white border-b pb-2 border-zinc-100 dark:border-white/5">
              Historial de Solicitudes de Competencia
            </h4>
            
            <div className="space-y-4">
              {competencias.map(c => (
                <div key={c.id} className="p-6 bg-zinc-50 dark:bg-white/5 border dark:border-white/5 rounded-3xl flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-white text-[0.8em] font-bold uppercase" style={{ backgroundColor: themePrimary }}>
                        {c.area_competencia.replace('_', ' ')}
                      </span>
                      <span className={`text-[0.8em] font-bold uppercase ${
                        c.estado === 'aprobada' ? 'text-green-500' : c.estado === 'solicitud_cambio' ? 'text-amber-500' : c.estado === 'rechazada' ? 'text-red-500' : 'text-blue-500'
                      }`}>
                        ● {c.estado === 'solicitud_cambio' ? 'cambios solicitados' : c.estado}
                      </span>
                    </div>

                    {c.proyectos && (
                      <p className="text-[0.8em] font-bold text-zinc-400">
                        Proyecto de Respaldo: <span className="text-zinc-900 dark:text-white">{c.proyectos.titulo}</span>
                      </p>
                    )}

                    <div className="p-3 bg-white dark:bg-zinc-800 rounded-xl text-[0.85em] font-bold">
                      <span className="text-[0.8em] font-bold uppercase text-zinc-400 block mb-1">Justificación del Pionero:</span>
                      "{c.justificacion_nnj}"
                    </div>

                    {c.evaluacion_lider && (
                      <div className="p-3 bg-amber-50/20 dark:bg-amber-950/10 rounded-xl text-[0.85em] font-bold text-amber-700 dark:text-amber-200">
                        <span className="text-[0.8em] font-bold uppercase text-amber-500 block mb-1">Aprobación de la Reunión de Coordinadores:</span>
                        "{c.evaluacion_lider}"
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 md:justify-center">
                    {/* Dirigente resolviendo solicitudes */}
                    {isLeader && (c.estado === 'pendiente' || c.estado === 'solicitud_cambio') && (
                      <button
                        onClick={() => setActiveMetaIdForReview(c.id)}
                        className="px-4 py-2.5 bg-green-600 text-white rounded-xl text-[0.8em] font-bold uppercase tracking-tight hover:brightness-110"
                      >
                        Resolver Solicitud
                      </button>
                    )}

                    {/* Ver detalles (Aprobadas o Rechazadas) */}
                    {(c.estado === 'aprobada' || c.estado === 'rechazada') && (
                      <button
                        onClick={() => setActiveMetaIdForReview(c.id)}
                        className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-350 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl text-[0.8em] font-bold uppercase tracking-tight"
                      >
                        🔎 Ver Detalles
                      </button>
                    )}

                    {/* Retirar o eliminar solicitud por el dueño */}
                    {isOwner && (
                      c.estado === 'pendiente' ? (
                        <button
                          onClick={() => handleDeleteCompetencia(c.id)}
                          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-650 rounded-xl text-[0.8em] font-bold uppercase tracking-tight"
                        >
                          ❌ Retirar Solicitud
                        </button>
                      ) : c.estado === 'solicitud_cambio' ? (
                        <div className="flex flex-col gap-2 w-full">
                          <button
                            onClick={() => {
                              setEditingSolicitudId(c.id)
                              setSelectedCompetenciaArea(c.area_competencia)
                              setJustificacionNnj(c.justificacion_nnj || '')
                              setEvidenciaCompUrl(c.evidencia_url || '')
                              setCompProyectoId(c.proyecto_id || '')
                              setShowCompetenciaModal(true)
                            }}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[0.8em] font-bold uppercase tracking-tight text-center"
                          >
                            ✏️ Corregir
                          </button>
                          <button
                            onClick={() => handleDeleteCompetencia(c.id)}
                            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-655 rounded-xl text-[0.8em] font-bold uppercase tracking-tight text-center"
                          >
                            ❌ Retirar
                          </button>
                        </div>
                      ) : c.estado === 'rechazada' ? (
                        <button
                          onClick={() => handleDeleteCompetencia(c.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[0.8em] font-bold uppercase tracking-tight"
                        >
                          🗑️ Eliminar Registro
                        </button>
                      ) : null
                    )}
                  </div>

                  {/* Formulario de Aprobación de Competencia */}
                  {activeMetaIdForReview === c.id && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[150] flex items-center justify-center p-4">
                      <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[2rem] p-6 shadow-2xl space-y-6">
                        <h4 className="text-xl font-bold uppercase tracking-tight text-zinc-900 dark:text-white">
                          🎓 Resolver Competencia ({c.area_competencia.replace('_', ' ')})
                        </h4>

                        {/* Detalle de la solicitud para que el dirigente lo revise */}
                        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-white/5 space-y-3 text-[0.85em] text-left">
                          <span className="text-[0.8em] font-black uppercase text-zinc-400 block">Detalles de la Solicitud</span>
                          
                          <div>
                            <strong className="text-zinc-500 block uppercase text-[0.8em] mb-1">Autoevaluación del Joven:</strong>
                            <p className="text-zinc-800 dark:text-zinc-200 italic font-bold leading-relaxed whitespace-pre-line bg-white dark:bg-zinc-900 p-2.5 rounded-xl border dark:border-white/5">
                              "{c.justificacion_nnj}"
                            </p>
                          </div>

                          {c.proyectos && (
                            <div>
                              <strong className="text-zinc-500 block uppercase text-[0.8em] mb-0.5">Proyecto de Respaldo:</strong>
                              <span className="font-bold text-zinc-800 dark:text-zinc-200">
                                📁 {c.proyectos.titulo}
                              </span>
                            </div>
                          )}

                          {c.evidencia_url && (
                            <div>
                              <strong className="text-zinc-500 block uppercase text-[0.8em] mb-0.5">Evidencia Externa:</strong>
                              <a 
                                href={c.evidencia_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-500 hover:text-blue-600 underline font-bold inline-flex items-center gap-1"
                              >
                                🔗 Ver portafolio/evidencia
                              </a>
                            </div>
                          )}
                        </div>
                        
                        {c.estado === 'aprobada' || c.estado === 'rechazada' ? (
                          <div className="space-y-4">
                            {c.evaluacion_lider && (
                              <div className="p-3.5 bg-zinc-55 dark:bg-zinc-800 rounded-xl border dark:border-white/5 text-[0.9em]">
                                <strong className="text-zinc-550 block uppercase text-[0.8em] mb-1">Fundamentos del Consejo:</strong>
                                <p className="text-zinc-800 dark:text-zinc-200 italic font-bold">
                                  "{c.evaluacion_lider}"
                                </p>
                              </div>
                            )}
                            <div className="flex justify-end pt-2">
                              <button 
                                onClick={() => setActiveMetaIdForReview(null)}
                                className="px-6 py-3 bg-zinc-150 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-2xl font-bold uppercase text-[0.8em]"
                              >
                                Cerrar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="space-y-1">
                              <label className="text-[0.8em] font-bold uppercase tracking-wider text-zinc-400 block ml-2">Comentarios del Consejo / Resolución</label>
                              <textarea 
                                value={leaderReviewText}
                                onChange={e => setLeaderReviewText(e.target.value)}
                                placeholder="Escribe la justificación pedagógica del Consejo..."
                                className="w-full p-4 rounded-2xl border dark:border-white/10 bg-zinc-50 dark:bg-zinc-800 text-[0.9em] font-bold h-32"
                              />
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2 justify-end">
                              <button 
                                onClick={() => { setActiveMetaIdForReview(null); setLeaderReviewText(''); }}
                                className="px-4 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-2xl font-bold uppercase text-[0.8em]"
                              >
                                Cancelar
                              </button>
                              <button 
                                onClick={() => handleLeaderReviewCompetencia(c.id, 'pedir_cambios')}
                                className="px-4 py-3 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-2xl font-bold uppercase text-[0.8em]"
                              >
                                Pedir Cambios
                              </button>
                              <button 
                                onClick={() => {
                                  if (confirm('¿Estás seguro de que deseas RECHAZAR esta solicitud?')) {
                                    handleLeaderReviewCompetencia(c.id, 'rechazar');
                                  }
                                }}
                                className="px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-2xl font-bold uppercase text-[0.8em]"
                              >
                                Rechazar
                              </button>
                              <button 
                                onClick={() => handleLeaderReviewCompetencia(c.id, 'aprobar')}
                                className="flex-1 px-4 py-3 bg-green-600 text-white font-bold uppercase rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all text-[0.8em]"
                              >
                                Aprobar
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pre-proyecto (4 Preguntas) */}
        {!agenda ? (
          renderAgendaNotInitializedCard()
        ) : (
          renderPreProyectoSection()
        )}

        {/* Mis Proyectos (12 Pasos) */}
        {renderProyectosSection(avanzadaProyectos)}

        {/* Acordeón de Objetivos Educativos Terminales de la Unidad */}
        {renderObjetivosEducativosSection()}

        {/* Modal: Solicitar Competencia */}
        {showCompetenciaModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[140] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-xl rounded-[2rem] p-6 shadow-2xl space-y-6">
              <h4 className="text-xl font-bold uppercase tracking-tight text-zinc-900 dark:text-white">
                {editingSolicitudId ? '✏️ Corregir Solicitud de Competencia' : '🎓 Solicitar Competencia (Rumbo)'}
              </h4>
              
              {editingSolicitudId && (() => {
                const activeSolicitud = competencias.find(c => c.id === editingSolicitudId);
                return activeSolicitud?.evaluacion_lider ? (
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl text-[0.85em] text-amber-800 dark:text-amber-200 space-y-1">
                    <span className="font-extrabold uppercase text-[0.8em] tracking-wider block text-amber-600 dark:text-amber-400">⚠️ Observaciones del Dirigente:</span>
                    <p className="italic font-bold">"{activeSolicitud.evaluacion_lider}"</p>
                  </div>
                ) : null;
              })()}
              
              <div className="space-y-1">
                <label className="text-[0.8em] font-bold uppercase tracking-wider text-zinc-400 block ml-2">Área de Competencia</label>
                <select
                  value={selectedCompetenciaArea}
                  onChange={e => setSelectedCompetenciaArea(e.target.value)}
                  className="w-full p-4 rounded-2xl border dark:border-white/10 bg-zinc-50 dark:bg-zinc-800 text-[0.9em] font-bold uppercase tracking-tight"
                  disabled={!!editingSolicitudId}
                >
                  <option value="">Seleccione rumbo...</option>
                  {['cultura', 'actividad_fisica', 'trabajo_equipo', 'innovacion', 'comunicacion', 'ciudadania', 'medioambiente']
                    .filter(area => {
                      if (editingSolicitudId) return true; // Si está editando, mostrar la seleccionada
                      const areaRows = competencias.filter(c => c.area_competencia === area)
                      const isAprobada = areaRows.some(c => c.estado === 'aprobada')
                      const isPendiente = areaRows.some(c => c.estado === 'pendiente')
                      return !isAprobada && !isPendiente
                    })
                    .map(area => (
                      <option key={area} value={area}>
                        {area === 'cultura' ? '🎭 Cultura' :
                         area === 'actividad_fisica' ? '🏃 Actividad Física' :
                         area === 'trabajo_equipo' ? '🤝 Trabajo en Equipo' :
                         area === 'innovacion' ? '🚀 Innovación' :
                         area === 'comunicacion' ? '📣 Comunicación' :
                         area === 'ciudadania' ? '🗳️ Ciudadanía' :
                         '🌿 Medioambiente'}
                      </option>
                    ))
                  }
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[0.8em] font-bold uppercase tracking-wider text-zinc-400 block ml-2">Proyecto de la Avanzada (Opcional)</label>
                <select
                  value={compProyectoId}
                  onChange={e => setCompProyectoId(e.target.value)}
                  className="w-full p-4 rounded-2xl border dark:border-white/10 bg-zinc-50 dark:bg-zinc-800 text-[0.9em] font-bold"
                >
                  <option value="">Seleccione proyecto...</option>
                  {avanzadaProyectos.map(p => (
                    <option key={p.id} value={p.id}>{p.titulo}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[0.8em] font-bold uppercase tracking-wider text-zinc-400 block ml-2">Mi Autoevaluación (Mínimo 150 caracteres)</label>
                <textarea 
                  value={justificacionNnj}
                  onChange={e => setJustificacionNnj(e.target.value)}
                  placeholder="Detalla de forma madura y seria qué rol desempeñaste, qué aprendiste..."
                  className="w-full p-4 rounded-2xl border dark:border-white/10 bg-zinc-50 dark:bg-zinc-800 text-[0.9em] font-bold h-32"
                />
                <span className={`text-[0.8em] font-bold block text-right ${justificacionNnj.length >= 150 ? 'text-green-500' : 'text-red-500'}`}>
                  {justificacionNnj.length} / 150 caracteres
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-[0.8em] font-bold uppercase tracking-wider text-zinc-400 block ml-2">Enlace a portafolio digital o evidencias</label>
                <input 
                  type="url"
                  value={evidenciaCompUrl}
                  onChange={e => setEvidenciaCompUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full p-4 rounded-2xl border dark:border-white/10 bg-zinc-50 dark:bg-zinc-800 text-[0.9em] font-bold"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button 
                  onClick={handleRequestCompetencia}
                  className="flex-1 py-4 text-white font-bold uppercase rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all"
                  style={{ backgroundColor: colorHighlight }}
                >
                  Enviar Solicitud
                </button>
                <button 
                  onClick={() => { setShowCompetenciaModal(false); setSelectedCompetenciaArea(''); setJustificacionNnj(''); setEvidenciaCompUrl(''); setCompProyectoId(''); }}
                  className="px-6 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-2xl font-bold uppercase"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Entregar Competencia Directamente (Líder) */}
        {showDirectCompetenciaModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[140] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-xl rounded-[2rem] p-6 shadow-2xl space-y-6">
              <h4 className="text-xl font-bold uppercase tracking-tight text-zinc-900 dark:text-white">
                🎓 Entregar Competencia Directamente ({selectedDirectCompetenciaArea.replace('_', ' ')})
              </h4>
              
              <div className="space-y-1">
                <label className="text-[0.8em] font-bold uppercase tracking-wider text-zinc-400 block ml-2">Proyecto de Respaldo (Opcional)</label>
                <select
                  value={directCompProyectoId}
                  onChange={e => setDirectCompProyectoId(e.target.value)}
                  className="w-full p-4 rounded-2xl border dark:border-white/10 bg-zinc-50 dark:bg-zinc-800 text-[0.9em] font-bold"
                >
                  <option value="">Seleccione proyecto...</option>
                  {avanzadaProyectos.map(p => (
                    <option key={p.id} value={p.id}>{p.titulo}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[0.8em] font-bold uppercase tracking-wider text-zinc-400 block ml-2">Fundamentos de la Reunión de Coordinadores (Obligatorio)</label>
                <textarea 
                  value={directLeaderReviewText}
                  onChange={e => setDirectLeaderReviewText(e.target.value)}
                  placeholder="Detalla los motivos acordados en la Reunión de Coordinadores..."
                  className="w-full p-4 rounded-2xl border dark:border-white/10 bg-zinc-50 dark:bg-zinc-800 text-[0.9em] font-bold h-32"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button 
                  onClick={handleDirectDeliverCompetencia}
                  className="flex-1 py-4 text-white font-bold uppercase rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all"
                  style={{ backgroundColor: colorHighlight }}
                >
                  Entregar Competencia
                </button>
                <button 
                  onClick={() => { setShowDirectCompetenciaModal(false); setSelectedDirectCompetenciaArea(''); setDirectLeaderReviewText(''); setDirectCompProyectoId(''); }}
                  className="px-6 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-2xl font-bold uppercase"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
        </>)}

      </div>
    )
  }

  // ==========================================
  // RENDER - DEFAULT (LOBATOS / SCOUTS / GUIAS)
  // ==========================================
  const renderDefaultProgression = () => {
    return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-20">
        {renderProgressionHeader()}
        {renderSubTabBar()}

        {esp.subTab === 'ceremonias' ? (
          renderCeremoniasSection()
        ) : esp.subTab === 'especialidades' ? (
          renderEspecialidadesSection()
        ) : (
          renderObjetivosEducativosSection()
        )}
      </div>
    )
  }

  const refreshSelectedProjectSheet = useCallback(async (projectId: string) => {
    const { data, error } = await supabase
      .from('proyectos')
      .select('*')
      .eq('id', projectId)
      .single()
    if (!error && data) {
      setSelectedProjectSheet(data)
      await loadSheetParticipants(projectId)
    }
  }, [])

  const loadSheetParticipants = useCallback(async (projectId: string) => {
    const { data, error } = await supabase
      .from('proyecto_participantes')
      .select('*, perfiles(nombres, apellidos)')
      .eq('proyecto_id', projectId)
    if (!error && data) {
      setSheetParticipants(data)
    } else {
      setSheetParticipants([])
    }
  }, [])

  const handleDeleteProyecto = async () => {
    if (!selectedProjectSheet) return
    const p = selectedProjectSheet
    const isConfirm = window.confirm(`¿Estás seguro de que deseas eliminar el proyecto "${p.titulo}"? Esta acción no se puede deshacer.`)
    if (!isConfirm) return

    const { error } = await supabase
      .from('proyectos')
      .delete()
      .eq('id', p.id)

    if (error) {
      toast.error('Error al eliminar el proyecto: ' + error.message)
    } else {
      setSelectedProjectSheet(null)
      try {
        await fetchInitialData()
      } catch (err) {
        toast.error('Error al actualizar: ' + getErrorMessage(err))
      }
    }
  }

  const getRadarData = useCallback(() => {
    return areas.map(area => {
      const areaObjs = objetivosDefault.filter(o => o.area_id === area.id);
      const areaAvances = avanceDefault.filter(a => areaObjs.some(o => o.id === a.objetivo_id));

      // 1. Autoevaluación
      const selfEvals = areaAvances.filter(a => a.valor !== null && a.valor !== undefined);
      const selfSum = selfEvals.reduce((acc, curr) => acc + (curr.valor || 0), 0);
      const selfAvg = selfEvals.length > 0 ? parseFloat((selfSum / selfEvals.length).toFixed(1)) : 0;

      // 2. Dirigente
      const leaderEvals = areaAvances.filter(a => a.valor_dirigente !== null && a.valor_dirigente !== undefined);
      const leaderSum = leaderEvals.reduce((acc, curr) => acc + (curr.valor_dirigente || 0), 0);
      const leaderAvg = leaderEvals.length > 0 ? parseFloat((leaderSum / leaderEvals.length).toFixed(1)) : 0;

      // 3. Apoderado
      const parentEvals = areaAvances.filter(a => a.valor_apoderado !== null && a.valor_apoderado !== undefined);
      const parentSum = parentEvals.reduce((acc, curr) => acc + (curr.valor_apoderado || 0), 0);
      const parentAvg = parentEvals.length > 0 ? parseFloat((parentSum / parentEvals.length).toFixed(1)) : 0;

      return {
        subject: area.nombre.split(' ')[0], // Corporalidad, Creatividad, etc.
        Autoevaluacion: selfAvg,
        Dirigente: leaderAvg,
        Apoderado: parentAvg,
        fullMark: 8
      };
    });
  }, [areas, objetivosDefault, avanceDefault]);

  const renderObjetivosEducativosSection = () => {
    return (
      <ProgresionObjetivos
        areas={areas}
        objetivosDefault={objetivosDefault}
        avanceDefault={avanceDefault}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        expandedAreas={expandedAreas}
        setExpandedAreas={setExpandedAreas}
        isMounted={isMounted}
        getRadarData={getRadarData}
        termObj={termObj}
        themePrimary={themePrimary}
        themeSecondary={themeSecondary}
        perfil={perfil}
        isOwner={isOwner}
        isParent={isParent}
        isLeader={isLeader}
        inactive={inactive}
        handleLeaderValidateDefault={handleLeaderValidateDefault}
        handleSelfEvalValue={handleSelfEvalValue}
        handleLeaderEvalValue={handleLeaderEvalValue}
        handleParentEvalValue={handleParentEvalValue}
        isManada={isManada}
        isCompania={isCompania}
        isTropa={isTropa}
        isAvanzada={isAvanzada}
        isClan={isClan}
      />
    )
  }

  const renderProjectSheet = () => {
    if (!selectedProjectSheet) return null

    const p = selectedProjectSheet
    const acts = parseJsonField(p.paso7_cuales_actividades, [])
    const partsManual = parseJsonField(p.participantes_manuales, [])
    const presItems = parseJsonField(p.paso10_cuanto_presupuesto, [])
    const finItems = parseJsonField(p.paso11_con_que_financiamiento, [])
    const evals = parseJsonField(p.paso12_como_lo_hicimos, {})
    const comps = parseJsonField(p.competencias_asociadas, [])

    const totalGastos = presItems.filter((i: PresupuestoItem) => i.tipo === 'gasto').reduce((acc: number, curr: PresupuestoItem) => acc + (curr.cantidad * curr.costo_unitario), 0)
    const totalIngresos = presItems.filter((i: PresupuestoItem) => i.tipo === 'ingreso').reduce((acc: number, curr: PresupuestoItem) => acc + (curr.cantidad * curr.costo_unitario), 0)
    const balance = totalIngresos - totalGastos

    return (
      <div className="space-y-2 animate-in fade-in duration-500 pb-20">
        
        {/* Cabecera Presentación Proyecto */}
        <div className="relative overflow-hidden p-2 rounded-[1rem] shadow-2xl border-2 flex flex-col md:flex-row items-center gap-2 transition-all" style={{ backgroundColor: themePrimary, borderColor: themeSecondary }}>
          {/* Background Unit Logo Watermark */}
          {perfil.unidades?.logo_unidad_url && (
            <img 
              src={perfil.unidades.logo_unidad_url} 
              alt="" 
              className="absolute right-[-2rem] bottom-[-2rem] w-64 h-64 opacity-15 pointer-events-none select-none object-contain"
            />
          )}

          {/* Text & Button Area */}
          <div className="relative z-10 text-center md:text-left flex-1 w-full">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-2">
              <span className="p-2 rounded-full text-[0.8em] font-bold uppercase tracking-widest text-white bg-white/20">
                {p.es_grupal ? 'Proyecto Colectivo' : 'Proyecto Individual'}
              </span>
              <span className="p-2 rounded-full border text-[0.8em] font-bold uppercase tracking-widest text-white border-white/30 bg-black/20">
                Fase: {p.fase}
              </span>
            </div>

            <h2 className="text-[2.2em] font-bold uppercase tracking-tighter leading-none mb-2" style={{ color: themeSecondary }}>
              {p.titulo}
            </h2>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[0.85em] font-bold opacity-90 mb-4" style={{ color: themeSecondary }}>
              {p.campo_prioritario && (
                <span>📍 Campo Prioritario: <strong className="uppercase">{p.campo_prioritario}</strong></span>
              )}
              {comps.length > 0 && (
                <span>🎓 Competencias: <strong className="uppercase">{comps.join(', ')}</strong></span>
              )}
            </div>

            {/* Botones de acción de la Cabecera */}
            <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-2">
              <button 
                onClick={() => setSelectedProjectSheet(null)}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold uppercase tracking-wider text-[0.8em] transition-all border"
                style={{ borderColor: themeSecondary }}
              >
                ← Volver a Progresión
              </button>
              
              {isOwner && p.fase !== 'completado' && (
                <button 
                  onClick={() => { 
                    setWizardProyecto(p); 
                    setWizardEsGrupal(p.es_grupal ?? false); 
                    setWizardInitialStep(1);
                    setIsWizardOpen(true); 
                  }}
                  className="p-2 bg-white hover:bg-zinc-100 rounded-xl font-bold uppercase tracking-wider text-[0.8em] transition-all shadow-lg"
                  style={{ color: themeTextDark }}
                >
                  ✏️ Editar Formulación
                </button>
              )}

              {(isOwner || isLeader) && p.fase !== 'completado' && (
                <button 
                  onClick={() => { 
                    setWizardProyecto(p); 
                    setWizardEsGrupal(p.es_grupal ?? false); 
                    setWizardInitialStep(12);
                    setIsWizardOpen(true); 
                  }}
                  className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold uppercase tracking-wider text-[0.8em] transition-all shadow-lg"
                >
                  🏁 Evaluar y Concluir (Paso 12)
                </button>
              )}

              {/* Botón de eliminar */}
              {(userPerfil.id === p.perfil_id || isLeader) && (
                <button 
                  onClick={handleDeleteProyecto}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold uppercase tracking-wider text-[0.8em] transition-all border border-red-700/50 shadow-lg flex items-center gap-1.5"
                >
                  🗑️ Eliminar Proyecto
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Desglose de los 11/12 Pasos */}
        <div className="grid grid-cols-1 gap-2">
          
          {/* Paso 1: Qué Haremos */}
          <div className="p-2 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[1rem] shadow-sm space-y-2">
            <h4 className="font-bold uppercase text-[1.1em] text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-200 dark:border-white/5">
              <span className="w-6 h-6 rounded-full text-white text-[1em] flex items-center justify-center font-bold" style={{ backgroundColor: themePrimary }}>1</span>
              ¿Qué Haremos?
            </h4>
            <p className="text-[1em] font-bold text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {p.paso1_que_haremos || 'No detallado.'}
            </p>
          </div>

          {/* Paso 2: Por Qué */}
          <div className="p-2 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[1rem] shadow-sm space-y-4">
            <h4 className="font-bold uppercase text-[1.1em] text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-200 dark:border-white/5">
              <span className="w-6 h-6 rounded-full text-white text-[1em] flex items-center justify-center font-bold" style={{ backgroundColor: themePrimary }}>2</span>
              ¿Por Qué?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="p-2 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-white/5">
                <span className="text-[1em] font-bold uppercase block mb-1" style={{ color: themePrimary }}>Diagnóstico Inicial:</span>
                <p className="text-[1em] font-bold text-zinc-700 dark:text-zinc-300">
                  {p.paso2_por_que_diagnostico || 'No detallado.'}
                </p>
              </div>
              <div className="p-2 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-white/5">
                <span className="text-[1em] font-bold uppercase block mb-1" style={{ color: themePrimary }}>Justificación y Fundamentos:</span>
                <p className="text-[1em] font-bold text-zinc-700 dark:text-zinc-300">
                  {p.paso2_por_que_justificacion || 'No detallado.'}
                </p>
              </div>
            </div>
          </div>

          {/* Paso 3: Para Qué */}
          <div className="p-2 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[1rem] shadow-sm space-y-4">
            <h4 className="font-bold uppercase text-[1.1em] text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-200 dark:border-white/5">
              <span className="w-6 h-6 rounded-full text-white text-[1em] flex items-center justify-center font-bold" style={{ backgroundColor: themePrimary }}>3</span>
              ¿Para Qué?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="p-2 rounded-[1rem] bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-white/5">
                <span className="text-[1em] font-bold uppercase block mb-1" style={{ color: themePrimary }}>Objetivo General:</span>
                <p className="text-[1em] font-bold text-zinc-700 dark:text-zinc-300">
                  {p.paso3_para_que_general || 'No detallado.'}
                </p>
              </div>
              <div className="p-2 rounded-[1rem] bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-white/5">
                <span className="text-[1em] font-bold uppercase block mb-1" style={{ color: themePrimary }}>Objetivos Específicos:</span>
                <p className="text-[1em] font-bold text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
                  {p.paso3_para_que_especificos || 'No detallado.'}
                </p>
              </div>
            </div>
          </div>

          {/* Pasos 4, 5, 6 en Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="p-2 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[1rem] shadow-sm space-y-2">
              <h4 className="font-bold uppercase text-[1.1em] text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-200 dark:border-white/5">
                <span className="w-6 h-6 rounded-full text-white text-[0.8em] flex items-center justify-center font-bold" style={{ backgroundColor: themePrimary }}>4</span>
                ¿Para Quiénes?
              </h4>
              <p className="text-[0.85em] font-bold text-zinc-700 dark:text-zinc-300">
                {p.paso4_para_quienes || 'No detallado.'}
              </p>
            </div>

            <div className="p-2 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[1rem] shadow-sm space-y-2">
              <h4 className="font-bold uppercase text-[1.1em] text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-200 dark:border-white/5">
                <span className="w-6 h-6 rounded-full text-white text-[0.8em] flex items-center justify-center font-bold" style={{ backgroundColor: themePrimary }}>5</span>
                ¿Dónde?
              </h4>
              <p className="text-[0.85em] font-bold text-zinc-700 dark:text-zinc-300">
                {p.paso5_donde || 'No detallado.'}
              </p>
            </div>

            <div className="p-2 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[1rem] shadow-sm space-y-2">
              <h4 className="font-bold uppercase text-[1.1em] text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-200 dark:border-white/5">
                <span className="w-6 h-6 rounded-full text-white text-[0.8em] flex items-center justify-center font-bold" style={{ backgroundColor: themePrimary }}>6</span>
                ¿Cómo lo haremos?
              </h4>
              <p className="text-[0.85em] font-bold text-zinc-700 dark:text-zinc-300">
                {p.paso6_como_lo_haremos || 'No detallado.'}
              </p>
            </div>
          </div>

          {/* Paso 7 & 8: Actividades y Cronograma */}
          <div className="p-2 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[1rem] shadow-sm space-y-2">
            <h4 className="font-bold uppercase text-[1.1em] text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-200 dark:border-white/5">
              <span className="w-12 h-6 rounded-full text-white text-[0.8em] flex items-center justify-center font-bold" style={{ backgroundColor: themePrimary }}>7 & 8</span>
              ¿Cuáles Actividades? y ¿Cuándo?
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {acts.map((act: ProjectActivity, idx: number) => (
                <div key={act.id} className="p-4 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-white/5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[0.8em] font-bold uppercase tracking-wider text-zinc-400">Actividad #{idx + 1}</span>
                      {act.fecha && (
                        <span className="px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/20 text-[0.8em] font-bold uppercase" style={{ backgroundColor: themePrimary, color: themeSecondary }}>
                          📅 {act.fecha}
                        </span>
                      )}
                    </div>
                    <h5 className="font-bold uppercase text-[1em] text-zinc-800 dark:text-white mb-1">{act.nombre || '(Sin Nombre)'}</h5>
                    <p className="text-[0.8em] font-bold text-zinc-650 dark:text-zinc-400">{act.descripcion || 'Sin descripción.'}</p>
                  </div>
                  
                  {act.articulo_id && (
                    <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-white/5 flex items-center gap-1.5 text-[0.8em] font-bold text-blue-500">
                      <span>🔗 Vinculada a Ficha de Actividad</span>
                    </div>
                  )}
                </div>
              ))}
              {acts.length === 0 && (
                <p className="col-span-full text-center py-6 text-zinc-400 font-bold italic">No hay actividades planificadas.</p>
              )}
            </div>
          </div>

          {/* Paso 9: Quiénes lo haremos */}
          <div className="p-2 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[1rem] shadow-sm space-y-4">
            <h4 className="font-bold uppercase text-[1.1em] text-zinc-900 dark:text-white flex items-center gap-2 border-b pb-2 border-zinc-200 dark:border-white/5">
              <span className="w-6 h-6 rounded-full text-white text-[0.8em] flex items-center justify-center font-bold" style={{ backgroundColor: themePrimary }}>9</span>
              ¿Quiénes lo Haremos?
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              
              {/* Participantes Internos */}
              {sheetParticipants.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[0.8em] font-bold uppercase text-zinc-400 block ml-1">
                    {p.es_grupal ? 'Equipo del Grupo Scout' : 'Responsable / Participantes'}
                  </span>
                  <div className="rounded-2xl border border-zinc-100 dark:border-white/5 divide-y divide-zinc-100 dark:divide-white/5 max-h-[200px] overflow-y-auto pr-2" style={{ backgroundColor: themePrimary, color: themeSecondary }}>
                    {sheetParticipants.map((pReg: SheetParticipant) => (
                      <div key={pReg.perfil_id} className="p-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-[1em] font-bold">
                        <div className="space-y-0.5">
                          <span>{pReg.perfiles ? `${pReg.perfiles.nombres} ${pReg.perfiles.apellidos}` : 'Cargando...'}</span>
                          {pReg.tarea_asignada && (
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {pReg.tarea_asignada.split(',').map((t: string, idx: number) => (
                                <span key={idx} className="px-2 py-0.5 rounded-full text-[0.8em] font-black uppercase tracking-wider" style={{ backgroundColor: themeSecondary, color: themePrimary }}>
                                  {t.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-700 text-[0.8em] font-bold uppercase text-zinc-500 dark:text-zinc-300 self-start sm:self-auto shrink-0">
                          {pReg.rol_en_proyecto}
                        </span>
                      </div>
                    ))}
                    {sheetParticipants.length === 0 && (
                      <p className="p-3 text-center text-zinc-400 font-bold italic">No hay miembros del grupo asignados.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Colaboradores Externos */}
              <div className="space-y-2">
                <span className="text-[0.8em] font-bold uppercase text-zinc-400 block ml-1">Colaboradores Externos / Contactos</span>
                <div className="rounded-2xl border border-zinc-100 dark:border-white/5 divide-y divide-zinc-100 dark:divide-white/5 max-h-[200px] overflow-y-auto pr-2" style={{ backgroundColor: themePrimary, color: themeSecondary }}>
                  {partsManual.map((pMan: { nombre?: string; tarea_asignada?: string; telefono?: string; email?: string }, idx: number) => (
                    <div key={idx} className="p-3 flex flex-col gap-1 text-[0.85em] font-bold text-zinc-700 dark:text-zinc-200">
                      <div className="flex justify-between items-start gap-2">
                        <span>{pMan.nombre || '(Sin Nombre)'}</span>
                        {pMan.tarea_asignada && (
                          <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
                            {pMan.tarea_asignada.split(',').map((t: string, idx: number) => (
                              <span key={idx} className="px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-950/40 text-green-650 dark:text-green-400 text-[0.8em] font-black uppercase tracking-wider">
                                {t.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-4 text-[0.8em] text-zinc-450">
                        {pMan.telefono && <span>📞 {pMan.telefono}</span>}
                        {pMan.email && <span>✉️ {pMan.email}</span>}
                      </div>
                    </div>
                  ))}
                  {partsManual.length === 0 && (
                    <p className="p-3 text-center text-zinc-400 font-bold italic">No hay colaboradores externos agregados.</p>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Paso 10: ¿Cuánto? */}
          <div className="p-2 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[1rem] shadow-sm space-y-2">
            <h4 className="font-bold uppercase text-[1.1em] text-zinc-900 dark:text-white flex items-center gap-2 border-b pb-2 border-zinc-200 dark:border-white/5">
              <span className="w-6 h-6 rounded-full text-white text-[0.8em] flex items-center justify-center font-bold" style={{ backgroundColor: themePrimary }}>10</span>
              ¿Cuánto Presupuesto? (Desglose de Materiales)
            </h4>
            
            <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[0.85em] font-bold text-zinc-700 dark:text-zinc-200">
                  <thead>
                    <tr className="bg-zinc-100 dark:bg-zinc-900 text-zinc-500 uppercase text-[0.9em]">
                      <th className="p-3">Ítem / Material</th>
                      <th className="p-3 text-center">Tipo</th>
                      <th className="p-3 text-center">Fuente</th>
                      <th className="p-3">Actividad</th>
                      <th className="p-3 text-center">Cant.</th>
                      <th className="p-3 text-right">Unitario</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
                    {presItems.map((item: PresupuestoItem, idx: number) => (
                      <tr key={idx}>
                        <td className="p-3">{item.descripcion || 'Sin descripción'}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[0.9em] uppercase ${item.tipo === 'ingreso' ? 'bg-green-150 text-green-700' : 'bg-red-150 text-red-700'}`}>
                            {item.tipo}
                          </span>
                        </td>
                        <td className="p-3 text-center uppercase text-[0.8em]">{item.fuente}</td>
                        <td className="p-3">{item.actividad_nombre || '--'}</td>
                        <td className="p-3 text-center">{item.cantidad}</td>
                        <td className="p-3 text-right">${item.costo_unitario.toLocaleString()}</td>
                        <td className="p-3 text-right font-bold">${(item.cantidad * item.costo_unitario).toLocaleString()}</td>
                      </tr>
                    ))}
                    {presItems.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-2 text-center text-zinc-400 italic">No hay ítems presupuestados.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Balances */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-white/5 flex flex-col justify-between">
                <span className="text-[0.8em] font-bold uppercase text-zinc-400">Total Ingresos</span>
                <span className="text-xl font-bold text-green-500">${totalIngresos.toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-white/5 flex flex-col justify-between">
                <span className="text-[0.8em] font-bold uppercase text-zinc-400">Total Gastos</span>
                <span className="text-xl font-bold text-red-500">${totalGastos.toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-white/5 flex flex-col justify-between">
                <span className="text-[0.8em] font-bold uppercase text-zinc-400">Balance Estimado</span>
                <span className={`text-xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${balance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Paso 11: ¿Con Qué? */}
          <div className="p-2 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[1rem] shadow-sm space-y-2">
            <h4 className="font-bold uppercase text-[1.1em] text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-200 dark:border-white/5">
              <span className="w-6 h-6 rounded-full text-white text-[0.8em] flex items-center justify-center font-bold" style={{ backgroundColor: themePrimary }}>11</span>
              ¿Con qué Financiamiento?
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {finItems.map((item: FinanciamientoItem, idx: number) => (
                <div key={idx} className="p-4 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-white/5 flex flex-col justify-between">
                  <div>
                    <span className="text-[0.8em] font-bold uppercase text-zinc-400 block mb-1">Financiamiento #{idx + 1}</span>
                    <h5 className="font-bold uppercase text-[1em] text-zinc-850 dark:text-white mb-1">{item.nombre || '(Sin Nombre)'}</h5>
                    <div className="space-y-1 text-[0.8em] font-bold text-zinc-650 dark:text-zinc-400 mt-2">
                      <p>📍 Lugar: {item.lugar || '--'}</p>
                      <p>🛠️ Recursos: {item.recursos || '--'}</p>
                    </div>
                  </div>
                  {item.fecha && (
                    <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-white/5 text-[0.8em] font-bold text-red-650 uppercase">
                      📅 Fecha Estimada: {item.fecha}
                    </div>
                  )}
                </div>
              ))}
              {finItems.length === 0 && (
                <p className="col-span-full text-center py-6 text-zinc-400 font-bold italic">No hay actividades de financiamiento agregadas.</p>
              )}
            </div>
          </div>

          {/* Paso 12: ¿Cómo lo hicimos? (Evaluación) */}
          {(p.fase === 'completado' || Object.keys(evals).length > 0) && (
            <div className="p-2 bg-green-50/10 dark:bg-green-950/5 border-2 border-green-500/30 rounded-[1rem] shadow-sm space-y-2">
              <h4 className="font-bold uppercase text-[1.1em] text-green-700 dark:text-green-400 flex items-center gap-2 border-b border-green-500/20">
                <span className="w-6 h-6 rounded-full bg-green-600 text-white text-[0.8em] flex items-center justify-center font-bold">12</span>
                ¿Cómo lo hicimos? (Evaluación de Actividades)
              </h4>
              
              <div className="space-y-4">
                {Object.entries(evals).map(([name, comment], idx: number) => (
                  <div key={idx} className="p-4 bg-white dark:bg-zinc-900/60 rounded-[1rem] border border-zinc-150 dark:border-white/5 space-y-1">
                    <span className="text-[0.8em] font-bold uppercase" style={{ color: themePrimary }}>{name}</span>
                    <p className="text-[0.85em] font-bold text-zinc-700 dark:text-zinc-300 italic">
                      "{String(comment) || 'Sin comentarios.'}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    )
  }

  // --- Render General ---
  return (
    <div className="space-y-4">
      {/* Carga del Wizard de Proyectos */}
      <DashModProyectoWizard 
        isOpen={isWizardOpen}
        onClose={() => { 
          setIsWizardOpen(false); 
          setWizardProyecto(null); 
          if (selectedProjectSheet) {
            refreshSelectedProjectSheet(selectedProjectSheet.id)
          }
        }}
        perfil={perfil}
        proyecto={wizardProyecto}
        esGrupal={wizardEsGrupal}
        initialStep={wizardInitialStep}
        onSuccess={() => {
          if (isClan) fetchClanProgresion()
          else if (isAvanzada) fetchAvanzadaProgresion()
        }}
      />

      {/* Modal de Evaluación de Objetivo (1 a 8) */}
      {showObjEvalModal && activeObjForEval && (() => {
        const objText = activeObjForEval.texto_terminal || activeObjForEval.texto_infantil;
        const areaId = activeObjForEval.area_id;
        const areaObj = areas.find(a => a.id === areaId);
        const areaName = areaObj ? areaObj.nombre : 'Área de Desarrollo';

        const handleSaveEval = async () => {
          if (tempEvalValue === null) {
            toast.warning('Por favor, selecciona una calificación del 1 al 8.');
            return;
          }
          if (isOwner) {
            await handleSelfEvalValue(activeObjForEval.id, tempEvalValue);
          } else if (isLeader) {
            await handleLeaderEvalValue(activeObjForEval.id, tempEvalValue);
          } else if (isParent) {
            await handleParentEvalValue(activeObjForEval.id, tempEvalValue);
          }
          setShowObjEvalModal(false);
          setActiveObjForEval(null);
          setTempEvalValue(null);
        };

        return (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-2 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white dark:bg-clr3 w-full max-w-2xl rounded-[1rem] shadow-2xl overflow-hidden border-4 border-white dark:border-clr4 animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
              
              <div className="p-4 pb-3 space-y-2 border-b border-zinc-100 dark:border-clr4">
                <span className="text-[0.8em] font-black uppercase tracking-wider text-clr7 block">
                  {isOwner ? 'Autoevaluación de Objetivo' : isParent ? 'Evaluación de Apoderado' : `Evaluando a ${perfil.nombres}`}
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-300 rounded-full text-[0.8em] font-bold uppercase">
                    {areaName}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight mt-1">
                  {objText}
                </h3>
                <p className="text-[0.8em] text-zinc-500 italic">
                  {isOwner 
                    ? `Selecciona el nivel que mejor represente tu desarrollo en esta ${termObjSingular}.`
                    : `Evalúa el desarrollo de esta ${termObjSingular} para el beneficiario.`}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar">
                <div className="grid grid-cols-1 gap-2">
                  {EVAL_SCALE.map((step) => {
                    const label = step.label.replace(/{term}/g, termObjSingular);
                    const isSelected = tempEvalValue === step.value;
                    
                    return (
                      <button
                        key={step.value}
                        type="button"
                        onClick={() => setTempEvalValue(step.value)}
                        className={`p-3 text-left text-[0.9em] rounded-xl border-2 transition-all flex items-center gap-3 ${
                          isSelected 
                            ? 'bg-clr7 border-clr7 text-white shadow-md scale-[1.01]' 
                            : 'bg-white dark:bg-zinc-800 border-zinc-150 dark:border-transparent opacity-85 hover:opacity-100 hover:border-clr7/40'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center font-black shrink-0 text-[0.9em] ${
                          isSelected ? 'bg-white text-clr7' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-650 dark:text-zinc-350'
                        }`}>
                          {step.value}
                        </span>
                        <span className="font-bold leading-snug">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 border-t border-zinc-100 dark:border-clr4 flex gap-3 bg-zinc-50/50 dark:bg-black/10 shrink-0">
                <button 
                  type="button"
                  onClick={() => {
                    setShowObjEvalModal(false);
                    setActiveObjForEval(null);
                    setTempEvalValue(null);
                  }}
                  className="flex-1 py-3 text-[0.8em] font-black uppercase tracking-wider text-zinc-455 hover:text-red-500 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="button"
                  onClick={handleSaveEval}
                  disabled={tempEvalValue === null}
                  className="flex-[2] py-3 bg-clr7 text-white text-[0.8em] font-black uppercase rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all tracking-wider disabled:opacity-50"
                >
                  🚀 Guardar Evaluación
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal de Crear Ceremonia */}
      {cer.activeCeremonyType && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border dark:border-white/10 w-full max-w-lg rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-zinc-100 dark:border-white/5 flex justify-between items-center bg-zinc-50 dark:bg-black/10">
              <h3 className="font-extrabold uppercase text-[1.25em] text-zinc-955 dark:text-white">
                {cer.activeCeremonyType === 'etapa' ? '🎖️ Entregar Insignia Etapa' : cer.activeCeremonyType === 'promesa' ? '🕯️ Registrar Promesa' : '👣 Registrar Paso'}
              </h3>
              <button 
                onClick={() => cer.setActiveCeremonyType(null)} 
                className="text-zinc-450 hover:text-zinc-650 dark:hover:text-white font-black text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-[0.9em]">
              {cer.activeCeremonyType === 'etapa' ? (
                <div>
                  <label className="block font-extrabold uppercase text-zinc-450 mb-1">Nombre de la Etapa</label>
                  <select
                    value={cer.cNombreHito}
                    onChange={(e) => cer.setCNombreHito(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-clr3 border dark:border-white/10 p-3 rounded-xl font-bold uppercase tracking-tight text-zinc-800 dark:text-white cursor-pointer"
                  >
                    <option value="">Selecciona etapa...</option>
                    {cer.getStageOptionsForDropdown().map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block font-extrabold uppercase text-zinc-450 mb-1">Nombre del Hito</label>
                  <input
                    type="text"
                    value={cer.cNombreHito}
                    disabled
                    className="w-full bg-zinc-100 dark:bg-black/40 border dark:border-white/10 p-3 rounded-xl font-bold uppercase text-zinc-500"
                  />
                </div>
              )}

              <div>
                <label className="block font-extrabold uppercase text-zinc-450 mb-1">Campamento (Opcional)</label>
                <input
                  type="text"
                  value={cer.cCampamento}
                  onChange={(e) => cer.setCCampamento(e.target.value)}
                  placeholder="Ej: Campamento de Verano Picarquín"
                  className="w-full bg-zinc-50 dark:bg-black/20 border dark:border-white/10 p-3 rounded-xl font-bold text-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-extrabold uppercase text-zinc-450 mb-1">Lugar (Opcional)</label>
                <input
                  type="text"
                  value={cer.cLugar}
                  onChange={(e) => cer.setCLugar(e.target.value)}
                  placeholder="Ej: Local de Grupo o Picarquín"
                  className="w-full bg-zinc-50 dark:bg-black/20 border dark:border-white/10 p-3 rounded-xl font-bold text-zinc-805 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-extrabold uppercase text-zinc-450 mb-1">Fecha</label>
                <input
                  type="date"
                  value={cer.cFecha}
                  onChange={(e) => cer.setCFecha(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-black/20 border dark:border-white/10 p-3 rounded-xl font-bold text-zinc-800 dark:text-white cursor-pointer"
                />
              </div>

              {cer.activeCeremonyType === 'promesa' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-extrabold uppercase text-zinc-455 mb-1">Padrino</label>
                    <select
                      value={cer.cPadrinoId}
                      onChange={(e) => cer.setCPadrinoId(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-black/20 border dark:border-white/10 p-3 rounded-xl font-bold text-zinc-800 dark:text-white cursor-pointer"
                    >
                      <option value="">Ninguno...</option>
                      {cer.availablePadrinos.map(p => (
                        <option key={p.id} value={p.id}>{p.nombres} {p.apellidos}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-extrabold uppercase text-zinc-455 mb-1">Madrina</label>
                    <select
                      value={cer.cMadrinaId}
                      onChange={(e) => cer.setCMadrinaId(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-black/20 border dark:border-white/10 p-3 rounded-xl font-bold text-zinc-800 dark:text-white cursor-pointer"
                    >
                      <option value="">Ninguna...</option>
                      {cer.availablePadrinos.map(p => (
                        <option key={p.id} value={p.id}>{p.nombres} {p.apellidos}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-extrabold uppercase text-zinc-450 mb-1">Fotografía del Momento</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => cer.setCFotoFile(e.target.files?.[0] || null)}
                  className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[0.8em] file:font-black file:uppercase file:bg-zinc-100 dark:file:bg-black/40 file:text-zinc-700 dark:file:text-white hover:file:bg-zinc-200 cursor-pointer font-bold text-zinc-500"
                />
              </div>

              {cer.activeCeremonyType === 'paso' && (
                <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-bold text-[0.85em]">
                  💡 Al confirmar el paso, se cambiará automáticamente al beneficiario a su siguiente unidad y rol en la base de datos, y se enviará una notificación a sus pares para que dejen sus despedidas.
                </div>
              )}
            </div>

            <div className="p-4 border-t border-zinc-100 dark:border-white/5 flex gap-3 bg-zinc-50/50 dark:bg-black/10 shrink-0">
              <button 
                type="button"
                onClick={() => cer.setActiveCeremonyType(null)} 
                disabled={cer.cLoading}
                className="flex-1 py-3 text-[0.8em] font-black uppercase tracking-wider text-zinc-455 hover:text-red-500 transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={cer.handleSaveCeremonia}
                disabled={cer.cLoading || (cer.activeCeremonyType === 'etapa' && !cer.cNombreHito)}
                className="flex-[2] py-3 bg-clr7 text-white text-[0.8em] font-black uppercase rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all tracking-wider disabled:opacity-50 cursor-pointer"
              >
                {cer.cLoading ? 'Guardando...' : '🏆 Registrar Ceremonia'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para dejar Mensaje (por url de notificación) */}
      {cer.activeCeremonyForMessage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border dark:border-white/10 w-full max-w-md rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-zinc-100 dark:border-white/5 flex justify-between items-center bg-zinc-50 dark:bg-black/10">
              <h3 className="font-extrabold uppercase text-[1.1em] text-zinc-950 dark:text-white">
                💬 Escribir Mensaje Scout
              </h3>
              <button 
                onClick={cer.handleCloseMessageModal} 
                className="text-zinc-455 hover:text-zinc-650 dark:hover:text-white font-black text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-[0.9em]">
              <p className="font-bold text-zinc-650 dark:text-zinc-350">
                Deja tus palabras para <span className="text-zinc-950 dark:text-white uppercase font-extrabold">{cer.activeCeremonyForMessage.perfil?.nombres} {cer.activeCeremonyForMessage.perfil?.apellidos}</span> en su ceremonia de <span className="text-clr7 font-extrabold uppercase">{cer.activeCeremonyForMessage.nombre_hito}</span>:
              </p>
              <textarea
                value={cer.farewellMessageText}
                onChange={(e) => cer.setFarewellMessageText(e.target.value)}
                placeholder="Escribe tus mejores deseos, anécdotas o felicitaciones aquí..."
                rows={4}
                className="w-full bg-zinc-50 dark:bg-black/20 border dark:border-white/10 p-3 rounded-xl font-bold text-zinc-805 dark:text-white placeholder-zinc-450"
              />
            </div>

            <div className="p-4 border-t border-zinc-100 dark:border-white/5 flex gap-3 bg-zinc-50/50 dark:bg-black/10 shrink-0">
              <button 
                type="button"
                onClick={cer.handleCloseMessageModal}
                className="flex-1 py-3 text-[0.8em] font-black uppercase tracking-wider text-zinc-450 hover:text-red-500 transition-all"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={cer.handleSaveCeremonyMessage}
                disabled={!cer.farewellMessageText.trim()}
                className="flex-[2] py-3 bg-clr7 text-white text-[0.8em] font-black uppercase rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all tracking-wider disabled:opacity-50 cursor-pointer"
              >
                🚀 Enviar Mensaje
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Informe de Paso (Transition report) */}
      {cer.viewingReportCeremony && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border dark:border-white/10 w-full max-w-xl rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-zinc-100 dark:border-white/5 flex justify-between items-center bg-zinc-50 dark:bg-black/10">
              <div>
                <h3 className="font-extrabold uppercase text-[1.25em] text-zinc-950 dark:text-white leading-none">
                  📄 Informe de Hitos y Logros de Paso
                </h3>
                <p className="text-[0.8em] font-bold text-zinc-400 uppercase mt-1">
                  Beneficiario: {perfil.nombres} {perfil.apellidos}
                </p>
              </div>
              <button 
                onClick={() => cer.setViewingReportCeremony(null)} 
                className="text-zinc-450 hover:text-zinc-650 dark:hover:text-white font-black text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-[0.9em]">
              <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-850 dark:text-indigo-400 font-bold uppercase text-[0.8em] flex justify-between">
                <span>Unidad de Origen: {cer.viewingReportCeremony.unidad_origen?.nombre || 'Origen'}</span>
                <span>➡️</span>
                <span>Unidad de Destino: {cer.viewingReportCeremony.unidad_destino?.nombre || 'Destino'}</span>
              </div>

              {/* Radar snapshot briefing */}
              <div>
                <h4 className="font-extrabold uppercase text-zinc-450 border-b pb-2 mb-3">📊 Nivel de Desarrollo Alcanzado</h4>
                {cer.viewingReportCeremony.radar_snapshot && Array.isArray(cer.viewingReportCeremony.radar_snapshot) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {cer.viewingReportCeremony.radar_snapshot.map((item: RadarSnapshotItem) => {
                      const score = item.Dirigente || item.Autoevaluacion || 0;
                      return (
                        <div key={item.subject} className="p-3 bg-zinc-50 dark:bg-black/10 rounded-xl border dark:border-white/5 flex justify-between items-center">
                          <span className="font-bold text-[0.9em]">{item.subject}</span>
                          <span className="font-black text-indigo-650 dark:text-indigo-400 text-[1em]">{score} / 8</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-zinc-400 italic">No hay snapshot de radar grabado para esta ceremonia.</p>
                )}
              </div>

              {/* Achieved objectives */}
              <div>
                <h4 className="font-extrabold uppercase text-zinc-450 border-b pb-2 mb-3">🎯 Objetivos y Desafíos Completados</h4>
                {(() => {
                  const achieved = cer.reportObjectives.filter(obj => {
                    const av = cer.reportAvances.find(a => a.objetivo_id === obj.id);
                    return av && (av.valor_dirigente != null && av.valor_dirigente >= 6 || av.estado === 'logrado');
                  });
                  return achieved.length > 0 ? (
                    <ul className="space-y-2">
                      {achieved.map(obj => (
                        <li key={obj.id} className="p-3 bg-zinc-50 dark:bg-black/10 rounded-xl border dark:border-white/5 text-[0.85em] font-medium leading-relaxed">
                          ✅ {obj.texto_terminal}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-zinc-400 italic">No se registraron objetivos completados en esta etapa.</p>
                  );
                })()}
              </div>
            </div>

            <div className="p-4 border-t border-zinc-100 dark:border-white/5 flex bg-zinc-50/50 dark:bg-black/10 shrink-0">
              <button 
                type="button"
                onClick={() => cer.setViewingReportCeremony(null)} 
                className="w-full py-3 bg-zinc-800 text-white text-[0.8em] font-black uppercase rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all tracking-wider cursor-pointer"
              >
                Cerrar Informe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Captura de Firma Digital (Especialidades) */}
      <DashModFirmaDigital
        isOpen={esp.showSignatureModal}
        onClose={() => { esp.setShowSignatureModal(false); esp.setSigModalType(null); }}
        title={esp.sigModalType === 'monitor' ? '✍️ Firma del Monitor' : '✍️ Firma del Dirigente'}
        description={esp.sigModalType === 'monitor' 
          ? 'Dibuja tu firma a continuación para autorizar la aprobación técnica de esta especialidad.' 
          : 'Dibuja tu firma a continuación para confirmar la finalización y agendamiento de esta especialidad.'}
        onConfirm={async (signature) => {
          const targetId = esp.sigModalTargetId;
          const modalType = esp.sigModalType;
          // Cerrar modal
          esp.setShowSignatureModal(false);
          esp.setSigModalType(null);
          
          // Ejecutar la acción respectiva
          if (modalType === 'monitor') {
            await esp.handleMonitorApproveSpecialty(targetId, signature);
          } else {
            const ep = esp.especialidadesPersonales.find((item: EspecialidadPersonal) => item.id === targetId);
            if (ep) {
              await esp.handleFinalizeSpecialty(ep, signature);
            }
          }
        }}
      />

      {loading ? (
        <div className="p-10 text-center opacity-50 uppercase tracking-widest text-[0.8em]">Cargando Progresión Personal...</div>
      ) : selectedProjectSheet ? (
        renderProjectSheet()
      ) : isClan ? (
        renderCaminanteProgression()
      ) : isAvanzada ? (
        renderPioneroProgression()
      ) : (
        renderDefaultProgression()
      )}
    </div>
  )
});

export default DashmodProgresion;
