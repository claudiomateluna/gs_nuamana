'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import DashModProyectoWizard from './dashmod_proyecto_wizard'
import DashModFirmaDigital from './dashmod_firma_digital'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts'
import { getObjetivoTerm, EVAL_SCALE, getEvalLabel } from '@/lib/progression-utils'
import { generateSpecialtyCertificate } from '@/lib/pdf-service'
import dynamic from 'next/dynamic'
import { uploadToStorage } from '@/lib/storage-utils'

const DashmodProgresionEspecialidadWizard = dynamic(
  () => import('./dashmod_progresion_especialidad_wizard'),
  { ssr: false }
)
const DashmodProgresionEspecialidadDetalle = dynamic(
  () => import('./dashmod_progresion_especialidad_detalle'),
  { ssr: false }
)

interface ProgresionUnidadProps {
  perfil: any // El perfil del Beneficiario (NNJ)
  userPerfil: any // El perfil del usuario que está mirando
}

const parseJsonField = (field: any, defaultValue: any) => {
  if (!field) return defaultValue
  if (typeof field === 'string') {
    try {
      return JSON.parse(field)
    } catch (e) {
      return defaultValue
    }
  }
  return field
}

export default function DashmodProgresion({ perfil, userPerfil }: ProgresionUnidadProps) {
  // --- Estados Comunes ---
  const [loading, setLoading] = useState(true)
  const [areas, setAreas] = useState<any[]>([])

  // --- Estados de Ceremonias (Hitos y Celebraciones) ---
  const [ceremonias, setCeremonias] = useState<any[]>([])
  const [activeCeremonyType, setActiveCeremonyType] = useState<'etapa' | 'promesa' | 'paso' | null>(null)
  const [cNombreHito, setCNombreHito] = useState('')
  const [cCampamento, setCCampamento] = useState('')
  const [cLugar, setCLugar] = useState('')
  const [cFecha, setCFecha] = useState(new Date().toISOString().split('T')[0])
  const [cFotoFile, setCFotoFile] = useState<File | null>(null)
  const [cPadrinoId, setCPadrinoId] = useState('')
  const [cMadrinaId, setCMadrinaId] = useState('')
  const [cLoading, setCLoading] = useState(false)
  const [availablePadrinos, setAvailablePadrinos] = useState<any[]>([])
  const [activeCeremonyForMessage, setActiveCeremonyForMessage] = useState<any>(null)
  const [farewellMessageText, setFarewellMessageText] = useState('')
  const [viewingReportCeremony, setViewingReportCeremony] = useState<any>(null)
  const [reportObjectives, setReportObjectives] = useState<any[]>([])
  const [reportAvances, setReportAvances] = useState<any[]>([])
  const [inlineMessageTexts, setInlineMessageTexts] = useState<Record<string, string>>({})
  
  // --- Estados de Lobatos / Guías / Scouts (Default) ---
  const [objetivosDefault, setObjetivosDefault] = useState<any[]>([])
  const [avanceDefault, setAvanceDefault] = useState<any[]>([])
  const [todasEtapas, setTodasEtapas] = useState<any[]>([])
  const [etapaActual, setEtapaActual] = useState<any>(null)
  const [comentando, setComentando] = useState<string | null>(null)
  const [tempComentario, setTempComentario] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedAreas, setExpandedAreas] = useState<number[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // --- Estados de Caminantes (Clan) ---
  const [agenda, setAgenda] = useState<any>(null)
  const [agendaObjetivos, setAgendaObjetivos] = useState<any[]>([])
  const [clanProyectos, setClanProyectos] = useState<any[]>([])
  const [todosObjetivosClan, setTodosObjetivosClan] = useState<any[]>([])
  const [showAddGoalModal, setShowAddGoalModal] = useState(false)
  const [selectedObjId, setSelectedObjId] = useState('')
  const [metaPersonalText, setMetaPersonalText] = useState('')
  
  // --- Estados de Pioneros (Avanzada) ---
  const [competencias, setCompetencias] = useState<any[]>([])
  const [avanzadaProyectos, setAvanzadaProyectos] = useState<any[]>([])
  const [showCompetenciaModal, setShowCompetenciaModal] = useState(false)
  const [selectedCompetenciaArea, setSelectedCompetenciaArea] = useState('')
  const [justificacionNnj, setJustificacionNnj] = useState('')
  const [evidenciaCompUrl, setEvidenciaCompUrl] = useState('')
  const [compProyectoId, setCompProyectoId] = useState('')
  const [editingSolicitudId, setEditingSolicitudId] = useState<string | null>(null)

  // --- Estados de entrega directa de competencia por líder ---
  const [showDirectCompetenciaModal, setShowDirectCompetenciaModal] = useState(false)
  const [selectedDirectCompetenciaArea, setSelectedDirectCompetenciaArea] = useState('')
  const [directLeaderReviewText, setDirectLeaderReviewText] = useState('')
  const [directCompProyectoId, setDirectCompProyectoId] = useState('')

  // --- Estados del Wizard de Proyectos de 12 Pasos ---
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [wizardProyecto, setWizardProyecto] = useState<any>(null)
  const [wizardEsGrupal, setWizardEsGrupal] = useState(true)
  const [selectedProjectSheet, setSelectedProjectSheet] = useState<any>(null)
  const [sheetParticipants, setSheetParticipants] = useState<any[]>([])
  const [wizardInitialStep, setWizardInitialStep] = useState<number>(1)

  // --- Estados de Evaluación de Objetivos en Escala 1 a 8 ---
  const [showObjEvalModal, setShowObjEvalModal] = useState(false)
  const [activeObjForEval, setActiveObjForEval] = useState<any>(null)
  const [tempEvalValue, setTempEvalValue] = useState<number | null>(null)

  // --- Estados de Formulario de Evidencia/Evaluación de Meta ---
  const [activeMetaIdForEvidence, setActiveMetaIdForEvidence] = useState<string | null>(null)
  const [evidenceText, setEvidenceText] = useState('')
  const [evidenceUrl, setEvidenceUrl] = useState('')
  const [leaderReviewText, setLeaderReviewText] = useState('')
  const [activeMetaIdForReview, setActiveMetaIdForReview] = useState<string | null>(null)

  // --- Estados de Especialidades (Fase 2 y 3) ---
  const [subTab, setSubTab] = useState<'progreso' | 'especialidades' | 'ceremonias'>('progreso')
  const [especialidadesPersonales, setEspecialidadesPersonales] = useState<any[]>([])
  const [definicionesEspecialidades, setDefinicionesEspecialidades] = useState<any[]>([])
  const [loadingEspecialidades, setLoadingEspecialidades] = useState(true)
  const [activeEspecialidad, setActiveEspecialidad] = useState<any>(null)
  
  // Para el buscador del catálogo
  const [searchCatQuery, setSearchCatQuery] = useState('')
  const [selectedFieldFilter, setSelectedFieldFilter] = useState<string>('todos')
  const [showSpecialtyWizard, setShowSpecialtyWizard] = useState(false)
  const [wizardStep, setWizardStep] = useState(1)

  // Formulario del Wizard de Especialidades
  const [wSelectedField, setWSelectedField] = useState<string>('arte_expresion')
  const [wSelectedDefId, setWSelectedDefId] = useState<string>('')
  const [wCustomName, setWCustomName] = useState<string>('')
  const [wMetaGeneral, setWMetaGeneral] = useState<string>('')
  const [wDiagnostico, setWDiagnostico] = useState<string>('')
  const [wMonitorName, setWMonitorName] = useState<string>('')
  const [wActivities, setWActivities] = useState<any[]>([])
  const [wNewActivityText, setWNewActivityText] = useState<string>('')
  const [wNewActivityDetalles, setWNewActivityDetalles] = useState<string>('')
  const [wMonitorPerfilId, setWMonitorPerfilId] = useState<string>('')
  const [wIsMonitorInterno, setWIsMonitorInterno] = useState<boolean>(true)
  const [wMonitorSearchText, setWMonitorSearchText] = useState<string>('')
  const [showMonitorDropdown, setShowMonitorDropdown] = useState<boolean>(false)
  const [availableMonitors, setAvailableMonitors] = useState<any[]>([])
  const [especialidadesSupervisadas, setEspecialidadesSupervisadas] = useState<any[]>([])
 
  // Estados de detalle y evidencia de actividades
  const [submittingEvidenceActId, setSubmittingEvidenceActId] = useState<string | null>(null)
  const [actEvidenceText, setActEvidenceText] = useState<string>('')
  const [actEvidenceUrl, setActEvidenceUrl] = useState<string>('')
  const [reviewingActId, setReviewingActId] = useState<string | null>(null)
  const [actReviewComment, setActReviewComment] = useState<string>('')
  const [newDetailActText, setNewDetailActText] = useState<string>('')
  const [newDetailActDetalles, setNewDetailActDetalles] = useState<string>('')
  const [wNewActivityFechaLimite, setWNewActivityFechaLimite] = useState<string>('')
  const [wNewActivityFechaActividad, setWNewActivityFechaActividad] = useState<string>('')
  const [wNewActivityRequiresCalendar, setWNewActivityRequiresCalendar] = useState<boolean>(false)
  const [wNewActivityArticleId, setWNewActivityArticleId] = useState<string>('')
  const [wNewActivityLugar, setWNewActivityLugar] = useState<string>('Local Scout')
  const [availableActivityArticles, setAvailableActivityArticles] = useState<any[]>([])
  const [actAutoevaluacionText, setActAutoevaluacionText] = useState<string>('')
  const [finalSpecEvaluation, setFinalSpecEvaluation] = useState<string>('')
  const [goalChecked, setGoalChecked] = useState<boolean>(false)
  const [deliveryDate, setDeliveryDate] = useState<string>('')
  const [feedbackComment, setFeedbackComment] = useState<string>('')
  const [showFeedbackInput, setShowFeedbackInput] = useState<boolean>(false)
  const [newActivityArticleTitle, setNewActivityArticleTitle] = useState<string>('')
  const [taskDates, setTaskDates] = useState<Record<string, string>>({})

  // --- Estados de Firmas para Especialidades ---
  const [showSignatureModal, setShowSignatureModal] = useState(false)
  const [sigModalType, setSigModalType] = useState<'monitor' | 'leader' | null>(null)
  const [sigModalTargetId, setSigModalTargetId] = useState<string>('')
  const prevActiveSpecIdRef = useRef<string | null>(null)

  // Roles
  const isOwner = userPerfil.id === perfil.id
  const isParent = userPerfil.id === perfil.apoderado_id
  const isLeader = [1, 2, 3].includes(userPerfil.rol_id) && (userPerfil.rol_id === 1 || userPerfil.unidad_id === perfil.unidad_id)

  // Lógica de Unidad y Tema
  const unitName = perfil.unidades?.nombre?.toLowerCase() || ''
  const isManada = unitName.includes('manada')
  const isCompania = unitName.includes('compañía') || unitName.includes('compania')
  const isTropa = unitName.includes('tropa')
  const isAvanzada = perfil.unidad_id === 4 // Avanzada
  const isClan = perfil.unidad_id === 5 // Clan

  const termObj = isManada ? 'huellas' : isCompania || isTropa ? 'desafíos' : 'objetivos'
  const termObjSingular = isManada ? 'huella' : isCompania || isTropa ? 'desafío' : 'objetivo'

  // Colores de la Unidad
  const dbColors = perfil.unidades?.colores || {}
  const themePrimary = dbColors.primario || '#cb3327' // Rojo institucional
  const themeSecondary = dbColors.secundario || '#ffffff'
  const themeTextDark = dbColors.textoDark || '#1b1b1b'
  const colorHighlight = themePrimary

  // --- Especialidades Helpers & Fetching (Fase 2) ---
  const getFieldLabel = (field: string) => {
    switch (field) {
      case 'arte_expresion': return 'Arte y Cultura'
      case 'deportes': return 'Deportes y Juegos'
      case 'ciencia_tecnologia': return 'Ciencia y Tecnología'
      case 'aire_libre': return 'Vida al Aire Libre'
      case 'espiritual': return 'Vida Espiritual'
      case 'servicio_comunidad': return 'Servicio y Comunidad'
      default: return field
    }
  }

  const getFieldColor = (field: string) => {
    switch (field) {
      case 'arte_expresion': return '#dd0061'
      case 'deportes': return '#b78913'
      case 'ciencia_tecnologia': return '#261d4e'
      case 'aire_libre': return '#29397d'
      case 'espiritual': return '#0093c4'
      case 'servicio_comunidad': return '#00a946'
      default: return '#1b1b1b'
    }
  }

  const getFieldBgColor = (field: string) => {
    switch (field) {
      case 'arte_expresion': return '#fe3075'
      case 'deportes': return '#d9d306'
      case 'ciencia_tecnologia': return '#a479b0'
      case 'aire_libre': return '#00aef5'
      case 'espiritual': return '#dbebf3'
      case 'servicio_comunidad': return '#7bc02c'
      default: return '#f3f4f6'
    }
  }

  const getFieldTextColor = (field: string) => {
    switch (field) {
      case 'arte_expresion': return '#ffffff'
      case 'deportes': return '#1b1b1b'
      case 'ciencia_tecnologia': return '#ffffff'
      case 'aire_libre': return '#ffffff'
      case 'espiritual': return '#1b1b1b'
      case 'servicio_comunidad': return '#ffffff'
      default: return '#1b1b1b'
    }
  }

  const getFieldLogoPath = (field: string) => {
    switch (field) {
      case 'arte_expresion': return '/images/especialidades/arte_expresion.svg'
      case 'deportes': return '/images/especialidades/deportes.svg'
      case 'ciencia_tecnologia': return '/images/especialidades/ciencia_tecnologia.svg'
      case 'aire_libre': return '/images/especialidades/aire_libre.svg'
      case 'espiritual': return '/images/especialidades/espiritual.svg'
      case 'servicio_comunidad': return '/images/especialidades/servicio_comunidad.svg'
      default: return '/images/especialidades/generico.svg'
    }
  }

  const getFieldEmoji = (field: string) => {
    switch (field) {
      case 'arte_expresion': return '🎨'
      case 'deportes': return '⚽'
      case 'ciencia_tecnologia': return '🔬'
      case 'aire_libre': return '⛺'
      case 'espiritual': return '🧘'
      case 'servicio_comunidad': return '🤝'
      default: return '🎖️'
    }
  }

  const getSpecialtyInsigniaPath = (name: string) => {
    if (!name) return '/images/especialidades/generico.svg'
    const normalized = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
    return `/images/especialidades/${normalized}.svg`
  }

  const fetchEspecialidades = async () => {
    setLoadingEspecialidades(true)
    try {
      // 1. Obtener especialidades personales del NNJ
      const { data: persData, error: persErr } = await supabase
        .from('especialidades_personales')
        .select(`
          *,
          especialidades_definiciones (
            nombre,
            descripcion,
            campo_interes,
            imagen_sugerida_url
          ),
          especialidades_actividades (
            id,
            descripcion,
            detalles,
            completada,
            fecha_completado,
            evidencia_texto,
            evidencia_url,
            comentario_monitor,
            fecha_limite,
            articulo_id,
            actividad_programada_id,
            autoevaluacion,
            articulos (
              id,
              titulo,
              slug
            ),
            actividades_programadas (
              id,
              nombre,
              fecha_inicio
            )
          )
        `)
        .eq('perfil_id', perfil.id)
        .order('created_at', { ascending: false })

      if (persErr) throw persErr
      setEspecialidadesPersonales(persData || [])

      // 2. Obtener definiciones para el catálogo
      let targetUnidadId = perfil.unidad_id || 3
      // Si la unidad es Avanzada (4) o Clan (5), usamos tropa (3) como catálogo base
      if (targetUnidadId > 3) {
        targetUnidadId = 3
      }

      const { data: defsData, error: defsErr } = await supabase
        .from('especialidades_definiciones')
        .select('*')
        .eq('unidad_id', targetUnidadId)
        .order('nombre')

      if (defsErr) throw defsErr
      setDefinicionesEspecialidades(defsData || [])

      // 3. Obtener especialidades donde soy el monitor
      const { data: superData, error: superErr } = await supabase
        .from('especialidades_personales')
        .select(`
          *,
          perfil:perfiles!especialidades_personales_perfil_id_fkey (
            nombres,
            apellidos,
            rut,
            unidad_id
          ),
          especialidades_definiciones (
            nombre,
            descripcion,
            campo_interes
          ),
          especialidades_actividades (
            id,
            descripcion,
            detalles,
            completada,
            fecha_completado,
            evidencia_texto,
            evidencia_url,
            comentario_monitor,
            fecha_limite,
            articulo_id,
            actividad_programada_id,
            autoevaluacion,
            articulos (
              id,
              titulo,
              slug
            ),
            actividades_programadas (
              id,
              nombre,
              fecha_inicio
            )
          )
        `)
        .eq('monitor_perfil_id', userPerfil.id)
        .order('created_at', { ascending: false })

      if (!superErr && superData) {
        setEspecialidadesSupervisadas(superData)
      } else if (superErr) {
        console.error('Error al cargar especialidades supervisadas:', superErr)
      }

      // 4. Obtener todos los perfiles registrados para seleccionar monitor interno
      const { data: profs, error: profsErr } = await supabase
        .from('perfiles')
        .select('id, nombres, apellidos, rut')
        .order('nombres')
      if (!profsErr && profs) {
        setAvailableMonitors(profs)
      }

      // 5. Obtener todos los artículos clasificados como Actividades (categoría 1)
      const { data: actRels } = await supabase
        .from('articulo_categorias')
        .select('articulo_id')
        .eq('categoria_id', 1)

      if (actRels && actRels.length > 0) {
        const artIds = actRels.map(r => r.articulo_id)
        const { data: arts } = await supabase
          .from('articulos')
          .select('id, titulo')
          .in('id', artIds)
          .eq('estado', 'publicado')
          .order('titulo')
        setAvailableActivityArticles(arts || [])
      } else {
        setAvailableActivityArticles([])
      }
    } catch (err) {
      console.error('Error al cargar especialidades:', err)
    } finally {
      setLoadingEspecialidades(false)
    }
  }

  const resetWizard = () => {
    setWSelectedField('arte_expresion')
    setWSelectedDefId('')
    setWCustomName('')
    setWMetaGeneral('')
    setWDiagnostico('')
    setWMonitorName('')
    setWMonitorPerfilId('')
    setWIsMonitorInterno(true)
    setWMonitorSearchText('')
    setShowMonitorDropdown(false)
    setWActivities([])
    setWNewActivityText('')
    setWNewActivityDetalles('')
  }

  const refreshActiveSpecialty = async (epId: string) => {
    const { data: updatedSpec } = await supabase
      .from('especialidades_personales')
      .select(`
        *,
        especialidades_definiciones (
          nombre,
          descripcion,
          campo_interes,
          imagen_sugerida_url
        ),
        especialidades_actividades (
          id,
          descripcion,
          detalles,
          completada,
          fecha_completado,
          evidencia_texto,
          evidencia_url,
          comentario_monitor,
          fecha_limite,
          articulo_id,
          actividad_programada_id,
          autoevaluacion,
          articulos (
            id,
            titulo,
            slug
          ),
          actividades_programadas (
            id,
            nombre,
            fecha_inicio
          )
        )
      `)
      .eq('id', epId)
      .single()
    if (updatedSpec) setActiveEspecialidad(updatedSpec)
  }

  const handleSaveSpecialty = async (targetPhase = 'exploracion') => {
    if (!wDiagnostico.trim()) {
      alert('Por favor ingresa la exploración de tu especialidad.')
      return
    }
    if (!wSelectedDefId && !wCustomName.trim()) {
      alert('Por favor selecciona una especialidad del catálogo o define una personalizada.')
      return
    }

    try {
      // 1. Insert especialidad_personal
      const payload: any = {
        perfil_id: perfil.id,
        campo_interes: wSelectedField,
        fase: targetPhase,
        meta_general: '',
        diagnostico_previo: wDiagnostico,
        monitor_nombre: '',
        monitor_perfil_id: null,
        estado: 'activo'
      }

      if (wSelectedDefId) {
        payload.definicion_id = wSelectedDefId
      } else {
        payload.nombre_personalizado = wCustomName
      }

      const { data: specData, error: specErr } = await supabase
        .from('especialidades_personales')
        .insert([payload])
        .select()
        .single()

      if (specErr) throw specErr

      alert(targetPhase === 'planificacion' 
        ? 'Especialidad creada y lista para iniciar su planificación.' 
        : 'Exploración de especialidad guardada para más adelante.'
      )
      // Reset form states
      setShowSpecialtyWizard(false)
      setWSelectedDefId('')
      setWCustomName('')
      setWMetaGeneral('')
      setWDiagnostico('')
      setWMonitorName('')
      setWMonitorPerfilId('')
      setWIsMonitorInterno(true)
      setWMonitorSearchText('')
      setShowMonitorDropdown(false)
      setWActivities([])
      setWNewActivityText('')
      setWNewActivityDetalles('')
      
      // Refresh list
      await fetchEspecialidades()
      
      // If advancing directly, select it
      if (targetPhase === 'planificacion' && specData) {
        await refreshActiveSpecialty(specData.id)
      }
    } catch (err: any) {
      console.error(err)
      alert('Error al guardar la especialidad: ' + err.message)
    }
  }

  const handleUpdateSpecialtyInfo = async (epId: string) => {
    if (!wMetaGeneral.trim()) {
      alert('Por favor ingresa una meta general.')
      return
    }
    if (!wMonitorName.trim()) {
      alert('Por favor selecciona o escribe un monitor/acompañante.')
      return
    }

    const { error } = await supabase
      .from('especialidades_personales')
      .update({
        meta_general: wMetaGeneral,
        monitor_nombre: wMonitorName,
        monitor_perfil_id: wMonitorPerfilId || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', epId)

    if (error) {
      alert('Error al actualizar especialidad: ' + error.message)
    } else {
      // Also save the task due dates
      try {
        const promises = Object.entries(taskDates).map(([actId, dateVal]) => {
          return supabase
            .from('especialidades_actividades')
            .update({ fecha_limite: dateVal ? dateVal : null })
            .eq('id', actId)
        })
        await Promise.all(promises)
      } catch (errTask) {
        console.error('Error saving task dates:', errTask)
      }

      // Send notification to monitor
      const specName = activeEspecialidad?.nombre_personalizado || activeEspecialidad?.especialidades_definiciones?.nombre || 'Especialidad'
      if (wMonitorPerfilId) {
        await supabase.from('notificaciones').insert([{
          perfil_id: wMonitorPerfilId,
          mensaje: `${perfil.nombres} ha completado la planificación de la especialidad "${specName}". Revisa para aprobar su planificación e iniciar desarrollo.`,
          tipo: 'especialidad',
          link_url: '/dashboard'
        }])
      }

      alert('Información de especialidad guardada.')
      await fetchEspecialidades()
      await refreshActiveSpecialty(epId)
    }
  }

  const handlePauseSpecialty = async (epId: string) => {
    const isConfirm = window.confirm('¿Estás seguro de que deseas pausar esta especialidad? Las fechas de las tareas planificadas se reiniciarán.')
    if (!isConfirm) return

    const { error } = await supabase
      .from('especialidades_personales')
      .update({
        estado: 'pausado',
        updated_at: new Date().toISOString()
      })
      .eq('id', epId)

    if (error) {
      alert('Error al pausar especialidad: ' + error.message)
      return
    }

    const { error: actErr } = await supabase
      .from('especialidades_actividades')
      .update({
        fecha_limite: null
      })
      .eq('especialidad_personal_id', epId)

    if (actErr) {
      console.error('Error al borrar fechas de actividades:', actErr)
    }

    alert('Especialidad pausada y fechas de tareas reiniciadas.')
    await fetchEspecialidades()
    await refreshActiveSpecialty(epId)
  }

  const handleResumeSpecialty = async (epId: string) => {
    const { error } = await supabase
      .from('especialidades_personales')
      .update({
        fase: 'planificacion',
        estado: 'activo',
        updated_at: new Date().toISOString()
      })
      .eq('id', epId)

    if (error) {
      alert('Error al retomar especialidad: ' + error.message)
    } else {
      alert('La especialidad se ha retomado en fase de Planificación.')
      await fetchEspecialidades()
      await refreshActiveSpecialty(epId)
    }
  }

  const handleAdvanceSpecialtyPhase = async (epId: string, nextPhase: string) => {
    const { error } = await supabase
      .from('especialidades_personales')
      .update({ fase: nextPhase, updated_at: new Date().toISOString() })
      .eq('id', epId)
    
    if (error) {
      alert('Error al actualizar fase: ' + error.message)
    } else {
      alert(`Especialidad avanzada a la fase de ${nextPhase === 'planificacion' ? 'Planificación' : nextPhase === 'desarrollo' ? 'Desarrollo' : 'Evaluación y Reconocimiento'}.`)
      await fetchEspecialidades()
      await refreshActiveSpecialty(epId)
    }
  }

  const handleSubmitActivityEvidence = async (actId: string) => {
    if (!actEvidenceText.trim()) {
      alert('Por favor describe la evidencia de lo realizado.')
      return
    }

    try {
      const { error } = await supabase
        .from('especialidades_actividades')
        .update({
          evidencia_texto: actEvidenceText.trim(),
          evidencia_url: actEvidenceUrl.trim(),
          autoevaluacion: actAutoevaluacionText.trim(),
          comentario_monitor: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', actId)

      if (error) throw error

      // Notify monitor
      const specName = activeEspecialidad?.nombre_personalizado || activeEspecialidad?.especialidades_definiciones?.nombre || 'Especialidad'
      if (activeEspecialidad?.monitor_perfil_id) {
        await supabase.from('notificaciones').insert([{
          perfil_id: activeEspecialidad.monitor_perfil_id,
          mensaje: `${perfil.nombres} ha entregado evidencia para la tarea "${activeEspecialidad.especialidades_actividades?.find((a: any) => a.id === actId)?.descripcion || 'de especialidad'}" de "${specName}". Revisa para validar.`,
          tipo: 'especialidad',
          link_url: '/dashboard'
        }])
      }

      alert('Evidencia y autoevaluación registradas con éxito. Se ha notificado a tu monitor.')
      setSubmittingEvidenceActId(null)
      setActEvidenceText('')
      setActEvidenceUrl('')
      setActAutoevaluacionText('')
      
      await fetchEspecialidades()
      if (activeEspecialidad) {
        await refreshActiveSpecialty(activeEspecialidad.id)
      }
    } catch (err: any) {
      console.error(err)
      alert('Error al registrar evidencia: ' + err.message)
    }
  }

  const handleApproveActivity = async (actId: string) => {
    const { error } = await supabase
      .from('especialidades_actividades')
      .update({
        completada: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', actId)

    if (error) {
      alert('Error al aprobar tarea: ' + error.message)
    } else {
      if (activeEspecialidad) {
        const specName = activeEspecialidad.nombre_personalizado || activeEspecialidad.especialidades_definiciones?.nombre || 'Especialidad'
        const actDesc = activeEspecialidad.especialidades_actividades?.find((a: any) => a.id === actId)?.descripcion || 'Tarea'
        
        await supabase.from('notificaciones').insert([{
          perfil_id: activeEspecialidad.perfil_id,
          mensaje: `Tu monitor ha aprobado la tarea "${actDesc}" de tu especialidad "${specName}".`,
          tipo: 'especialidad',
          link_url: '/dashboard'
        }])
      }

      alert('Tarea aprobada con éxito.')
      await fetchEspecialidades()
      if (activeEspecialidad) {
        await refreshActiveSpecialty(activeEspecialidad.id)
      }
    }
  }

  const handleReviewActivity = async (actId: string) => {
    const { error } = await supabase
      .from('especialidades_actividades')
      .update({
        comentario_monitor: actReviewComment,
        updated_at: new Date().toISOString()
      })
      .eq('id', actId)

    if (error) {
      alert('Error al guardar comentario: ' + error.message)
    } else {
      if (activeEspecialidad) {
        const specName = activeEspecialidad.nombre_personalizado || activeEspecialidad.especialidades_definiciones?.nombre || 'Especialidad'
        const actDesc = activeEspecialidad.especialidades_actividades?.find((a: any) => a.id === actId)?.descripcion || 'Tarea'
        
        await supabase.from('notificaciones').insert([{
          perfil_id: activeEspecialidad.perfil_id,
          mensaje: `Tu monitor ha dejado una corrección/comentario en la tarea "${actDesc}" de tu especialidad "${specName}": "${actReviewComment.slice(0, 60)}${actReviewComment.length > 60 ? '...' : ''}"`,
          tipo: 'especialidad',
          link_url: '/dashboard'
        }])
      }

      setReviewingActId(null)
      setActReviewComment('')
      await fetchEspecialidades()
      if (activeEspecialidad) {
        await refreshActiveSpecialty(activeEspecialidad.id)
      }
    }
  }

  const handleAddActivityToExisting = async (epId: string) => {
    if (!newDetailActText.trim()) {
      alert('Por favor ingresa un título para la tarea.')
      return
    }

    try {
      let finalArtId: string | null = null
      let finalActProgId: string | null = null

      if (wNewActivityRequiresCalendar) {
        if (!wNewActivityFechaActividad) {
          alert('Por favor selecciona la fecha de la actividad con la unidad.')
          return
        }

        if (newActivityArticleTitle.trim()) {
          const title = newActivityArticleTitle.trim()
          const slug = `actividad-${title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-${Date.now()}`
          
          const { data: newArt, error: artErr } = await supabase
            .from('articulos')
            .insert([{
              autor_id: userPerfil.id,
              titulo: title,
              slug: slug,
              contenido: `Actividad de especialidad para: ${newDetailActText}`,
              estado: 'publicado'
            }])
            .select()
            .single()

          if (artErr) throw artErr
          finalArtId = newArt.id

          const { error: catErr } = await supabase
            .from('articulo_categorias')
            .insert([{
              articulo_id: newArt.id,
              categoria_id: 1
            }])
          if (catErr) console.error('Error inserting category:', catErr)
        } else if (wNewActivityArticleId) {
          finalArtId = wNewActivityArticleId
        }

        const { data: newActProg, error: actProgErr } = await supabase
          .from('actividades_programadas')
          .insert([{
            tipo: 'Especialidad',
            nombre: newDetailActText.trim(),
            lugar: wNewActivityLugar || 'Local Scout',
            fecha_inicio: wNewActivityFechaActividad,
            fecha_fin: wNewActivityFechaActividad,
            unidad_id: perfil.unidad_id,
            creado_por: userPerfil.id
          }])
          .select()
          .single()

        if (actProgErr) throw actProgErr
        finalActProgId = newActProg.id
      }

      const { error: insertErr } = await supabase
        .from('especialidades_actividades')
        .insert([{
          especialidad_personal_id: epId,
          descripcion: newDetailActText.trim(),
          detalles: newDetailActDetalles.trim(),
          fecha_limite: wNewActivityFechaLimite ? wNewActivityFechaLimite : null,
          articulo_id: finalArtId,
          actividad_programada_id: finalActProgId,
          completada: false
        }])

      if (insertErr) throw insertErr

      alert('Tarea agregada con éxito.')
      
      setNewDetailActText('')
      setNewDetailActDetalles('')
      setWNewActivityFechaLimite('')
      setWNewActivityFechaActividad('')
      setWNewActivityRequiresCalendar(false)
      setWNewActivityArticleId('')
      setWNewActivityLugar('Local Scout')
      setNewActivityArticleTitle('')

      await fetchEspecialidades()
      await refreshActiveSpecialty(epId)
    } catch (err: any) {
      console.error(err)
      alert('Error al agregar tarea: ' + err.message)
    }
  }

  const handleDeleteActivity = async (actId: string) => {
    const isConfirm = window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')
    if (!isConfirm) return

    const { error } = await supabase
      .from('especialidades_actividades')
      .delete()
      .eq('id', actId)

    if (error) {
      alert('Error al eliminar actividad: ' + error.message)
    } else {
      await fetchEspecialidades()
      if (activeEspecialidad) {
        await refreshActiveSpecialty(activeEspecialidad.id)
      }
    }
  }

  const handleDeleteSpecialty = async (epId: string) => {
    const isConfirm = window.confirm('¿Estás seguro de que deseas eliminar esta especialidad? Esta acción no se puede deshacer.')
    if (!isConfirm) return

    const { error } = await supabase
      .from('especialidades_personales')
      .delete()
      .eq('id', epId)

    if (error) {
      alert('Error al eliminar: ' + error.message)
    } else {
      setActiveEspecialidad(null)
      await fetchEspecialidades()
    }
  }

  const handleFinalizeSpecialty = async (ep: any, signatureB64?: string) => {
    if (!deliveryDate) {
      alert('Por favor selecciona una fecha de entrega para la insignia.')
      return
    }

    if (!signatureB64) {
      setSigModalType('leader');
      setSigModalTargetId(ep.id);
      setShowSignatureModal(true);
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0]
      
      // 1. Actualizar especialidad personal
      const { error: specErr } = await supabase
        .from('especialidades_personales')
        .update({
          estado: 'completado',
          fecha_fin: today,
          fecha_entrega: deliveryDate,
          firma_dirigente_b64: signatureB64,
          updated_at: new Date().toISOString()
        })
        .eq('id', ep.id)

      if (specErr) throw specErr

      // 2. Insertar en progresion_hitos
      const specName = ep.nombre_personalizado || ep.especialidades_definiciones?.nombre || 'Especialidad'
      const hitoName = `${getFieldLabel(ep.campo_interes)} - ${specName}`
      
      const { error: hitoErr } = await supabase
        .from('progresion_hitos')
        .insert([{
          perfil_id: ep.perfil_id,
          nombre_hito: hitoName,
          fecha_entrega: deliveryDate,
          tipo: 'especialidad',
          entregado_por: userPerfil.id
        }])

      if (hitoErr) throw hitoErr

      // 3. Enviar notificación al usuario
      await supabase.from('notificaciones').insert([{
        perfil_id: ep.perfil_id,
        mensaje: `¡Felicitaciones! Tu insignia de la especialidad "${specName}" será entregada en el próximo campamento o salida el ${deliveryDate}.`,
        tipo: 'especialidad',
        link_url: '/dashboard'
      }])

      alert('¡Especialidad aprobada y entrega agendada con éxito!')

      // 4. Generar Certificado PDF
      const updatedEp = { 
        ...ep, 
        fase: 'reconocimiento', 
        estado: 'completado', 
        fecha_fin: today, 
        fecha_entrega: deliveryDate,
        firma_dirigente_b64: signatureB64 
      }
      await generateSpecialtyCertificate(ep.perfil || perfil, updatedEp)

      // Refresh list
      await fetchEspecialidades()
      setActiveEspecialidad(null)
    } catch (err: any) {
      console.error(err)
      alert('Error al finalizar especialidad: ' + err.message)
    }
  }

  const handleMonitorApproveSpecialty = async (epId: string, signatureB64?: string) => {
    if (!signatureB64) {
      setSigModalType('monitor');
      setSigModalTargetId(epId);
      setShowSignatureModal(true);
      return;
    }

    try {
      const { error } = await supabase
        .from('especialidades_personales')
        .update({
          aprobado_monitor: true,
          firma_monitor_b64: signatureB64,
          updated_at: new Date().toISOString()
        })
        .eq('id', epId)

      if (error) throw error

      const specName = activeEspecialidad?.nombre_personalizado || activeEspecialidad?.especialidades_definiciones?.nombre || 'Especialidad'
      
      // Notify NNJ
      await supabase.from('notificaciones').insert([{
        perfil_id: activeEspecialidad.perfil_id,
        mensaje: `¡Tu monitor ha aprobado tu especialidad "${specName}"! Esperando que los dirigentes agenden la fecha de entrega de tu insignia.`,
        tipo: 'especialidad',
        link_url: '/dashboard'
      }])

      // Notify unit leaders
      const targetUnitId = activeEspecialidad.perfil?.unidad_id || perfil.unidad_id
      const { data: leaders } = await supabase
        .from('perfiles')
        .select('id')
        .in('rol_id', [1, 2, 3])
        .eq('unidad_id', targetUnitId)

      if (leaders && leaders.length > 0) {
        const notifPromises = leaders.map(leader => {
          return supabase.from('notificaciones').insert([{
            perfil_id: leader.id,
            mensaje: `El monitor de ${activeEspecialidad.perfil?.nombres || 'un miembro'} ha aprobado su especialidad "${specName}". Agenda la fecha de entrega de la insignia.`,
            tipo: 'especialidad',
            link_url: '/dashboard'
          }])
        })
        await Promise.all(notifPromises)
      }

      alert('Especialidad aprobada por monitor con éxito.')
      await fetchEspecialidades()
      await refreshActiveSpecialty(epId)
    } catch (err: any) {
      console.error(err)
      alert('Error al aprobar especialidad: ' + err.message)
    }
  }

  const handleMonitorFeedbackSpecialty = async (epId: string) => {
    if (!feedbackComment.trim()) {
      alert('Por favor escribe un comentario de retroalimentación.')
      return
    }

    try {
      // Return to development phase, approved_monitor = false
      const { error } = await supabase
        .from('especialidades_personales')
        .update({
          fase: 'desarrollo',
          aprobado_monitor: false,
          comentario_monitor: feedbackComment.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', epId)

      if (error) throw error

      const specName = activeEspecialidad?.nombre_personalizado || activeEspecialidad?.especialidades_definiciones?.nombre || 'Especialidad'

      // Notify NNJ with feedback
      await supabase.from('notificaciones').insert([{
        perfil_id: activeEspecialidad.perfil_id,
        mensaje: `Tu monitor ha dejado comentarios de mejora en tu especialidad "${specName}": "${feedbackComment}". La especialidad ha retornado a fase de Desarrollo.`,
        tipo: 'especialidad',
        link_url: '/dashboard'
      }])

      alert('Comentarios enviados. La especialidad ha retornado a Desarrollo.')
      setFeedbackComment('')
      setShowFeedbackInput(false)
      await fetchEspecialidades()
      await refreshActiveSpecialty(epId)
    } catch (err: any) {
      console.error(err)
      alert('Error al enviar retroalimentación: ' + err.message)
    }
  }

  const handleRequestRecognition = async (epId: string) => {
    if (!finalSpecEvaluation.trim()) {
      alert('Por favor ingresa tu evaluación final de la especialidad.')
      return
    }
    if (!goalChecked) {
      alert('Por favor confirma que has cumplido tu objetivo general.')
      return
    }

    try {
      const { error } = await supabase
        .from('especialidades_personales')
        .update({
          evaluacion_final: finalSpecEvaluation.trim(),
          objetivo_cumplido: true,
          fase: 'reconocimiento',
          aprobado_monitor: false,
          comentario_monitor: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', epId)

      if (error) throw error

      const specName = activeEspecialidad?.nombre_personalizado || activeEspecialidad?.especialidades_definiciones?.nombre || 'Especialidad'

      // Notify monitor
      if (activeEspecialidad?.monitor_perfil_id) {
        await supabase.from('notificaciones').insert([{
          perfil_id: activeEspecialidad.monitor_perfil_id,
          mensaje: `${perfil.nombres} ha completado su evaluación final y solicitado el reconocimiento para la especialidad "${specName}". Revisa para validar.`,
          tipo: 'especialidad',
          link_url: '/dashboard'
        }])
      }

      alert('Evaluación guardada y reconocimiento solicitado con éxito.')
      await fetchEspecialidades()
      await refreshActiveSpecialty(epId)
    } catch (err: any) {
      console.error(err)
      alert('Error al solicitar reconocimiento: ' + err.message)
    }
  }

  const handleApproveSpecialtyPlanning = async (epId: string) => {
    const isConfirm = window.confirm('¿Deseas aprobar la planificación de esta especialidad e iniciar la fase de desarrollo?')
    if (!isConfirm) return

    const { error } = await supabase
      .from('especialidades_personales')
      .update({
        fase: 'desarrollo',
        updated_at: new Date().toISOString()
      })
      .eq('id', epId)

    if (error) {
      alert('Error al aprobar planificación: ' + error.message)
    } else {
      alert('Planificación aprobada. La especialidad ahora se encuentra en fase de Desarrollo.')
      await fetchEspecialidades()
      await refreshActiveSpecialty(epId)
    }
  }


  useEffect(() => {
    fetchInitialData()
  }, [perfil])

  useEffect(() => {
    if (activeEspecialidad) {
      const isDifferent = prevActiveSpecIdRef.current !== activeEspecialidad.id
      prevActiveSpecIdRef.current = activeEspecialidad.id

      const dates: Record<string, string> = {}
      activeEspecialidad.especialidades_actividades?.forEach((act: any) => {
        dates[act.id] = act.fecha_limite || ''
      })
      setTaskDates(dates)

      if (isDifferent) {
        setWMetaGeneral(activeEspecialidad.meta_general || '')
        setWMonitorName(activeEspecialidad.monitor_nombre || '')
        setWMonitorPerfilId(activeEspecialidad.monitor_perfil_id || '')
        setWIsMonitorInterno(!!activeEspecialidad.monitor_perfil_id || !activeEspecialidad.monitor_nombre)
        setWMonitorSearchText(activeEspecialidad.monitor_nombre || '')
        setFinalSpecEvaluation(activeEspecialidad.evaluacion_final || '')
        setGoalChecked(activeEspecialidad.objetivo_cumplido || false)
        setDeliveryDate(activeEspecialidad.fecha_entrega || '')
      }
    } else {
      prevActiveSpecIdRef.current = null
      setTaskDates({})
      setWMetaGeneral('')
      setWMonitorName('')
      setWMonitorPerfilId('')
      setWIsMonitorInterno(true)
      setWMonitorSearchText('')
      setFinalSpecEvaluation('')
      setGoalChecked(false)
      setDeliveryDate('')
    }
  }, [activeEspecialidad])



  // --- Efectos y Helpers de Ceremonias ---
  useEffect(() => {
    if (activeCeremonyType === 'promesa') {
      setCNombreHito('Promesa');
      fetchAvailablePadrinos();
    } else if (activeCeremonyType === 'paso') {
      if (perfil.unidad_id === 1) {
        setCNombreHito(perfil.sexo?.toLowerCase() === 'femenino' || perfil.sexo?.toLowerCase() === 'femenina' || perfil.sexo?.toLowerCase() === 'f' ? 'Paso a Compañía' : 'Paso a Tropa');
      } else if (perfil.unidad_id === 2 || perfil.unidad_id === 3) {
        setCNombreHito('Paso a Avanzada');
      } else if (perfil.unidad_id === 4) {
        setCNombreHito('Paso a Clan');
      } else if (perfil.unidad_id === 5) {
        setCNombreHito('Egreso');
      }
    } else {
      setCNombreHito('');
    }
  }, [activeCeremonyType, perfil]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const openCeremonyIdParam = params.get('openCeremonyId');
      if (openCeremonyIdParam) {
        supabase
          .from('ceremonias')
          .select('*, perfil:perfil_id(nombres, apellidos)')
          .eq('id', openCeremonyIdParam)
          .single()
          .then(({ data, error }) => {
            if (!error && data) {
              setActiveCeremonyForMessage(data);
            }
          });
      }
    }
  }, []);

  const handleCloseMessageModal = () => {
    setActiveCeremonyForMessage(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('openCeremonyId');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const fetchCeremonias = async () => {
    const { data, error } = await supabase
      .from('ceremonias')
      .select(`
        *,
        padrino:padrino_id(id, nombres, apellidos),
        madrina:madrina_id(id, nombres, apellidos),
        unidad_origen:unidad_origen_id(nombre),
        unidad_destino:unidad_destino_id(nombre),
        mensajes:ceremonia_mensajes(
          *,
          remitente:remitente_id(id, nombres, apellidos, rol_id)
        )
      `)
      .eq('perfil_id', perfil.id)
      .order('fecha', { ascending: false });
    if (!error) {
      setCeremonias(data || []);
    }
  };

  const fetchAvailablePadrinos = async () => {
    const { data, error } = await supabase
      .from('perfiles')
      .select('id, nombres, apellidos, rol_id')
      .order('nombres');
    if (!error) {
      setAvailablePadrinos(data || []);
    }
  };

  const handleUploadPhoto = async (file: File): Promise<string | null> => {
    try {
      const publicUrl = await uploadToStorage(file, 'ceremonias', '', {
        fileNamePrefix: `${perfil.id}_ceremonia`
      })
      return publicUrl
    } catch (err: any) {
      alert('Error al subir la fotografía: ' + err.message)
      return null
    }
  };

  const handleSaveCeremonia = async () => {
    if (!isLeader) return;
    setCLoading(true);
    try {
      let finalFotoUrl = '';
      if (cFotoFile) {
        const uploadedUrl = await handleUploadPhoto(cFotoFile);
        if (uploadedUrl) finalFotoUrl = uploadedUrl;
      }

      const radarData = getRadarData();

      const payload: any = {
        perfil_id: perfil.id,
        tipo: activeCeremonyType,
        nombre_hito: cNombreHito,
        campamento: cCampamento || '',
        lugar: cLugar || '',
        fecha: cFecha || new Date().toISOString().split('T')[0],
        foto_url: finalFotoUrl || null,
        radar_snapshot: radarData,
      };

      const rawNotifications: any[] = [];

      if (activeCeremonyType === 'promesa') {
        payload.padrino_id = cPadrinoId || null;
        payload.madrina_id = cMadrinaId || null;

        if (cPadrinoId) {
          rawNotifications.push({
            perfil_id: cPadrinoId,
            mensaje: `Ceremonia de Promesa: Deja tu bendición/mensaje especial para tu ahijado(a) ${perfil.nombres}`,
            tipo: 'ceremonia_promesa',
            link_url: 'TEMPLATE_ID'
          });
        }
        if (cMadrinaId) {
          rawNotifications.push({
            perfil_id: cMadrinaId,
            mensaje: `Ceremonia de Promesa: Deja tu bendición/mensaje especial para tu ahijado(a) ${perfil.nombres}`,
            tipo: 'ceremonia_promesa',
            link_url: 'TEMPLATE_ID'
          });
        }

        const { data: partners } = await supabase
          .from('perfiles')
          .select('id')
          .eq('unidad_id', perfil.unidad_id)
          .in('rol_id', [1, 2, 3, 9, 10, 11, 12, 13])
          .neq('id', perfil.id);

        if (partners && partners.length > 0) {
          partners.forEach(p => {
            rawNotifications.push({
              perfil_id: p.id,
              mensaje: `¡Promesa Scout! Deja tus bendiciones/mensajes para ${perfil.nombres} por su Ceremonia de Promesa`,
              tipo: 'ceremonia_promesa',
              link_url: 'TEMPLATE_ID'
            });
          });
        }
      }

      if (activeCeremonyType === 'paso') {
        let destUnidadId = perfil.unidad_id;
        let destRolId = perfil.rol_id;
        let destEtapaId: number | null = null;

        if (perfil.unidad_id === 1) { // Manada
          if (perfil.sexo?.toLowerCase() === 'femenino' || perfil.sexo?.toLowerCase() === 'femenina' || perfil.sexo?.toLowerCase() === 'f') {
            destUnidadId = 2; // Compañía
            destRolId = 10; // Guía
            destEtapaId = 38; // Alba
          } else {
            destUnidadId = 3; // Tropa
            destRolId = 11; // Scout
            destEtapaId = 42; // Cernícalo
          }
        } else if (perfil.unidad_id === 2 || perfil.unidad_id === 3) {
          destUnidadId = 4; // Avanzada
          destRolId = 12; // Pionero
          destEtapaId = 46; // Sendero
        } else if (perfil.unidad_id === 4) {
          destUnidadId = 5; // Clan
          destRolId = 13; // Caminante
          destEtapaId = 48; // Fuego
        }

        payload.unidad_origen_id = perfil.unidad_id;
        payload.unidad_destino_id = destUnidadId;

        const { error: profileError } = await supabase
          .from('perfiles')
          .update({
            unidad_id: destUnidadId,
            rol_id: destRolId,
            progresion_etapa_id: destEtapaId
          })
          .eq('id', perfil.id);

        if (profileError) throw profileError;

        const { data: partners } = await supabase
          .from('perfiles')
          .select('id')
          .eq('unidad_id', perfil.unidad_id)
          .in('rol_id', [1, 2, 3, 9, 10, 11, 12, 13])
          .neq('id', perfil.id);

        if (partners && partners.length > 0) {
          partners.forEach(p => {
            rawNotifications.push({
              perfil_id: p.id,
              mensaje: `Ceremonia de Paso: Deja tu mensaje de despedida para ${perfil.nombres}`,
              tipo: 'ceremonia_paso',
              link_url: 'TEMPLATE_ID'
            });
          });
        }
      }

      if (activeCeremonyType === 'etapa') {
        const { data: partners } = await supabase
          .from('perfiles')
          .select('id')
          .eq('unidad_id', perfil.unidad_id)
          .in('rol_id', [1, 2, 3, 9, 10, 11, 12, 13])
          .neq('id', perfil.id);

        if (partners && partners.length > 0) {
          partners.forEach(p => {
            rawNotifications.push({
              perfil_id: p.id,
              mensaje: `¡Nueva Etapa! Deja tus felicitaciones para ${perfil.nombres} por alcanzar la etapa ${cNombreHito}`,
              tipo: 'ceremonia_etapa',
              link_url: 'TEMPLATE_ID'
            });
          });
        }
      }



      // Deduplicate rawNotifications by perfil_id
      const uniqueNotifications: any[] = [];
      const seenIds = new Set<string>();
      for (const notif of rawNotifications) {
        if (!seenIds.has(notif.perfil_id)) {
          seenIds.add(notif.perfil_id);
          uniqueNotifications.push(notif);
        }
      }

      const { data: insertedCeremonia, error: ceremonyErr } = await supabase
        .from('ceremonias')
        .insert([payload])
        .select()
        .single();

      if (ceremonyErr) throw ceremonyErr;

      if (uniqueNotifications.length > 0 && insertedCeremonia) {
        const finalNotifications = uniqueNotifications.map((n: any) => ({
          ...n,
          link_url: `/dashboard?openCeremonyId=${insertedCeremonia.id}`
        }));
        await supabase.from('notificaciones').insert(finalNotifications);
      }

      await supabase.from('progresion_hitos').insert([{
        perfil_id: perfil.id,
        nombre_hito: cNombreHito,
        fecha_entrega: payload.fecha,
        tipo: activeCeremonyType,
        entregado_por: userPerfil.id
      }]);

      if (activeCeremonyType === 'etapa') {
        const stageMap: Record<string, number> = {
          'Lobezno': 1, 'Saltador': 2, 'Diestro': 3, 'Cazador': 4,
          'Alba': 38, 'Amanecer': 39, 'Luz': 40, 'Resplandor': 41,
          'Cernícalo': 42, 'Halcón': 43, 'Águila': 44, 'Cóndor': 45,
          'Sendero': 46, 'Cumbre': 47,
          'Fuego': 48, 'Antorcha': 49
        };
        const matchingStageId = stageMap[cNombreHito];
        if (matchingStageId) {
          await supabase.from('perfiles').update({
            progresion_etapa_id: matchingStageId
          }).eq('id', perfil.id);
        }
      }

      alert('¡Ceremonia registrada con éxito!');
      setActiveCeremonyType(null);
      setCNombreHito('');
      setCCampamento('');
      setCLugar('');
      setCFotoFile(null);
      setCPadrinoId('');
      setCMadrinaId('');
      
      await fetchCeremonias();
      await fetchDefaultProgresion();
    } catch (err: any) {
      console.error(err);
      alert('Error al registrar ceremonia: ' + err.message);
    } finally {
      notificadoresParaPaso();
    }
  };

  const notificadoresParaPaso = () => {
    setCLoading(false);
  };

  const handleSaveCeremonyMessage = async () => {
    if (!activeCeremonyForMessage || !farewellMessageText.trim()) return;
    try {
      const { error } = await supabase
        .from('ceremonia_mensajes')
        .insert([{
          ceremonia_id: activeCeremonyForMessage.id,
          remitente_id: userPerfil.id,
          mensaje: farewellMessageText.trim()
        }]);
      if (error) throw error;

      alert('¡Mensaje enviado con éxito!');
      setFarewellMessageText('');
      handleCloseMessageModal();
      await fetchCeremonias();
    } catch (err: any) {
      console.error(err);
      alert('Error al guardar mensaje: ' + err.message);
    }
  };

  const handleSaveInlineMessage = async (ceremonyId: string) => {
    const msg = inlineMessageTexts[ceremonyId]?.trim();
    if (!msg) return;
    try {
      const { error } = await supabase
        .from('ceremonia_mensajes')
        .insert([{
          ceremonia_id: ceremonyId,
          remitente_id: userPerfil.id,
          mensaje: msg
        }]);
      if (error) throw error;
      
      setInlineMessageTexts(prev => ({ ...prev, [ceremonyId]: '' }));
      alert('¡Mensaje guardado con éxito!');
      await fetchCeremonias();
    } catch (err: any) {
      alert('Error al guardar mensaje: ' + err.message);
    }
  };

  const handleViewReport = async (ceremony: any) => {
    setViewingReportCeremony(ceremony);
    const { data: objs } = await supabase
      .from('progresion_objetivos')
      .select('*')
      .eq('unidad_id', ceremony.unidad_origen_id);
    const { data: avs } = await supabase
      .from('progresion_avance')
      .select('*')
      .eq('perfil_id', perfil.id);
    setReportObjectives(objs || []);
    setReportAvances(avs || []);
  };

  const getStageOptionsForDropdown = () => {
    if (perfil.unidad_id === 1) return ['Lobezno', 'Saltador', 'Diestro', 'Cazador'];
    if (perfil.unidad_id === 2) return ['Alba', 'Amanecer', 'Luz', 'Resplandor'];
    if (perfil.unidad_id === 3) return ['Cernícalo', 'Halcón', 'Águila', 'Cóndor'];
    if (perfil.unidad_id === 4) return ['Cruz del Sur (Bienvenida)', 'Sendero', 'Cumbre'];
    if (perfil.unidad_id === 5) return ['Insignia del Caminante (Bienvenida)', 'Fuego', 'Antorcha', 'Egreso'];
    return [];
  };

  const fetchInitialData = async () => {
    setLoading(true)
    try {
      const { data: areasData } = await supabase.from('progresion_areas').select('*').order('id')
      setAreas(areasData || [])

      await fetchEspecialidades()
      await fetchCeremonias()

      if (isClan) {
        await fetchClanProgresion()
        await fetchDefaultProgresion()
      } else if (isAvanzada) {
        await fetchAvanzadaProgresion()
        await fetchDefaultProgresion()
      } else {
        await fetchDefaultProgresion()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // ==========================================
  // LOGICA CLAN (CAMINANTES)
  // ==========================================
  const fetchClanProgresion = async () => {
    // 1. Obtener o crear Agenda Personal
    let { data: agendaData, error: agendaErr } = await supabase
      .from('agendas_personales')
      .select('*')
      .eq('perfil_id', perfil.id)
      .maybeSingle()

    if (agendaErr) console.error(agendaErr)

    if (!agendaData && isOwner && perfil.rol_id === 13) {
      // Auto-crear agenda vacía si no existe
      const { data: newAgenda, error: createErr } = await supabase
        .from('agendas_personales')
        .insert([{ perfil_id: perfil.id, etapa_progresion: 'ninguna' }])
        .select()
        .single()
      
      if (createErr) console.error(createErr)
      else agendaData = newAgenda
    }

    setAgenda(agendaData)

    if (agendaData) {
      // 2. Obtener metas/objetivos de la agenda
      const { data: metas } = await supabase
        .from('proyecto_objetivos')
        .select('*, progresion_objetivos(*, progresion_areas(*)), proyectos(titulo)')
        .eq('agenda_id', agendaData.id)
      
      setAgendaObjetivos(metas || [])
    }

    // 3. Obtener todos los objetivos del Clan para seleccionarlos
    const { data: objsClan } = await supabase
      .from('progresion_objetivos')
      .select('*, progresion_areas(*)')
      .eq('unidad_id', 5)
    
    setTodosObjetivosClan(objsClan || [])

    // 4. Obtener proyectos individuales y colectivos del Caminante
    const { data: projsInd } = await supabase
      .from('proyectos')
      .select('*')
      .eq('perfil_id', perfil.id)
      .eq('es_grupal', false)
    
    const { data: projsCol } = await supabase
      .from('proyecto_participantes')
      .select('*, proyectos(*)')
      .eq('perfil_id', perfil.id)

    const listProjsCol = projsCol?.map(p => p.proyectos).filter(Boolean) || []
    const combined = [...(projsInd || []), ...listProjsCol]
    const uniqueProjs = Array.from(new Map(combined.map(p => [p.id, p])).values())
    setClanProyectos(uniqueProjs)
  }

  const handleUpdateAgendaField = async (field: string, value: string) => {
    if (!agenda) return
    const { error } = await supabase
      .from('agendas_personales')
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq('id', agenda.id)
    
    if (error) {
      alert('Error al guardar: ' + error.message)
    } else {
      setAgenda({ ...agenda, [field]: value })
    }
  }

  const handleUpdateAgendaEtapa = async (etapa: string) => {
    if (!isLeader || !agenda) return
    const payload: any = { etapa_progresion: etapa, updated_at: new Date().toISOString() }
    const dateField = etapa === 'fuego' ? 'fecha_fuego' : etapa === 'antorcha' ? 'fecha_antorcha' : etapa === 'partida' ? 'fecha_partida' : null
    if (dateField) {
      payload[dateField] = new Date().toISOString().split('T')[0]
    }

    const { error } = await supabase
      .from('agendas_personales')
      .update(payload)
      .eq('id', agenda.id)
    
    if (error) {
      alert('Error al actualizar etapa: ' + error.message)
    } else {
      await fetchClanProgresion()
      await fetchDefaultProgresion()
    }
  }

  const handleSaveGoalMeta = async () => {
    if (!agenda) return
    if (!selectedObjId || !metaPersonalText) return alert('Selecciona un objetivo y redacta tu meta.')
    
    const exists = agendaObjetivos.some(o => o.objetivo_id === selectedObjId)
    if (exists) return alert('Este objetivo ya se encuentra en tu Agenda de Vida.')

    const { error } = await supabase
      .from('proyecto_objetivos')
      .insert([{
        agenda_id: agenda.id,
        objetivo_id: selectedObjId,
        meta_personal: metaPersonalText,
        estado: 'pendiente'
      }])

    if (error) {
      alert('Error al agregar meta: ' + error.message)
    } else {
      setShowAddGoalModal(false)
      setSelectedObjId('')
      setMetaPersonalText('')
      fetchClanProgresion()
    }
  }

  const handleRegisterGoalEvidence = async (metaId: string) => {
    if (evidenceText.trim().length < 150) {
      return alert('La evidencia debe tener al menos 150 caracteres para garantizar un reporte serio y completo.')
    }

    const { error } = await supabase
      .from('proyecto_objetivos')
      .update({
        evidencia_texto: evidenceText,
        evidencia_url: evidenceUrl,
        estado: 'en_progreso',
        updated_at: new Date().toISOString()
      })
      .eq('id', metaId)

    if (error) {
      alert('Error al guardar evidencia: ' + error.message)
    } else {
      // Enviar notificación a los dirigentes de la unidad
      try {
        const { data: leaders } = await supabase
          .from('perfiles')
          .select('id')
          .in('rol_id', [1, 2, 3])
          .eq('unidad_id', perfil.unidad_id)
          .eq('estado', 'activo')

        if (leaders && leaders.length > 0) {
          const notifs = leaders.map(leader => ({
            perfil_id: leader.id,
            mensaje: `El/la caminante ${perfil.nombres} ${perfil.apellidos} ha subido evidencia para evaluar un objetivo de su Agenda de Vida.`,
            tipo: 'sistema',
            link_url: `/dashboard?perfil=${perfil.id}`
          }))
          await supabase.from('notificaciones').insert(notifs)
        }
      } catch (err) {
        console.error('Error sending goal notification to leaders:', err)
      }

      setActiveMetaIdForEvidence(null)
      setEvidenceText('')
      setEvidenceUrl('')
      fetchClanProgresion()
    }
  }

  const handleLeaderReviewGoal = async (metaId: string, approve: boolean) => {
    if (!leaderReviewText) return alert('Por favor, redacta un comentario pedagógico sobre la evaluación.')

    const { error } = await supabase
      .from('proyecto_objetivos')
      .update({
        estado: approve ? 'alcanzado' : 'pendiente',
        evaluacion_lider: leaderReviewText,
        updated_at: new Date().toISOString()
      })
      .eq('id', metaId)

    if (error) {
      alert('Error al evaluar meta: ' + error.message)
    } else {
      // Enviar notificación al caminante
      try {
        await supabase.from('notificaciones').insert([{
          perfil_id: perfil.id,
          mensaje: approve 
            ? `Tu objetivo personal de la Agenda de Vida ha sido evaluado como ALCANZADO.`
            : `Tu objetivo personal de la Agenda de Vida ha recibido comentarios pedagógicos de tu dirigente/guiadora.`,
          tipo: 'sistema',
          link_url: '/dashboard'
        }])
      } catch (err) {
        console.error('Error sending goal notification to Caminante:', err)
      }

      setActiveMetaIdForReview(null)
      setLeaderReviewText('')
      fetchClanProgresion()
    }
  }

  const handleDeleteGoal = async (metaId: string) => {
    if (!confirm('¿Estás seguro de eliminar este objetivo de tu Agenda de Vida? Se perderá todo su historial.')) return
    const { error } = await supabase
      .from('proyecto_objetivos')
      .delete()
      .eq('id', metaId)
    
    if (error) alert('Error al eliminar: ' + error.message)
    else fetchClanProgresion()
  }

  // ==========================================
  // LOGICA AVANZADA (PIONEROS)
  // ==========================================
  const fetchAvanzadaProgresion = async () => {
    // 1. Obtener o crear Agenda Personal
    let { data: agendaData, error: agendaErr } = await supabase
      .from('agendas_personales')
      .select('*')
      .eq('perfil_id', perfil.id)
      .maybeSingle()

    if (agendaErr) console.error(agendaErr)

    if (!agendaData && isOwner && perfil.rol_id === 12) {
      // Auto-crear agenda vacía si no existe
      const { data: newAgenda, error: createErr } = await supabase
        .from('agendas_personales')
        .insert([{ perfil_id: perfil.id, etapa_progresion: 'ninguna' }])
        .select()
        .single()
      
      if (createErr) console.error(createErr)
      else agendaData = newAgenda
    }

    setAgenda(agendaData)

    // 2. Obtener solicitudes de competencias
    const { data: solicitudes } = await supabase
      .from('solicitudes_competencias')
      .select('*, proyectos(titulo), aprobado_por:perfiles!aprobado_por(nombres, apellidos)')
      .eq('perfil_id', perfil.id)
    
    setCompetencias(solicitudes || [])

    // 3. Obtener proyectos individuales y colectivos de la Avanzada
    const { data: projsInd } = await supabase
      .from('proyectos')
      .select('*')
      .eq('perfil_id', perfil.id)
      .eq('es_grupal', false)

    const { data: projsCol } = await supabase
      .from('proyecto_participantes')
      .select('*, proyectos(*)')
      .eq('perfil_id', perfil.id)

    const listProjsCol = projsCol?.map(p => p.proyectos).filter(Boolean) || []
    const combined = [...(projsInd || []), ...listProjsCol]
    const uniqueProjs = Array.from(new Map(combined.map(p => [p.id, p])).values())
    setAvanzadaProyectos(uniqueProjs)
  }

  const handleRequestCompetencia = async () => {
    if (!selectedCompetenciaArea) {
      return alert('Por favor, selecciona un rumbo de competencia.')
    }
    if (justificacionNnj.trim().length < 150) {
      return alert('La justificación debe detallar tus acciones concretas con al menos 150 caracteres.')
    }

    if (editingSolicitudId) {
      const { error } = await supabase
        .from('solicitudes_competencias')
        .update({
          justificacion_nnj: justificacionNnj,
          evidencia_url: evidenciaCompUrl || null,
          proyecto_id: compProyectoId || null,
          estado: 'pendiente',
          updated_at: new Date().toISOString()
        })
        .eq('id', editingSolicitudId)

      if (error) {
        alert('Error al actualizar la solicitud: ' + error.message)
      } else {
        try {
          const { data: leaders } = await supabase
            .from('perfiles')
            .select('id')
            .in('rol_id', [1, 2, 3])
            .eq('unidad_id', perfil.unidad_id)
            .eq('estado', 'activo')

          if (leaders && leaders.length > 0) {
            const notifs = leaders.map(leader => ({
              perfil_id: leader.id,
              mensaje: `El/la pionero/a ${perfil.nombres} ${perfil.apellidos} ha enviado correcciones para el rumbo: ${selectedCompetenciaArea.replace('_', ' ').toUpperCase()}.`,
              tipo: 'sistema',
              link_url: `/dashboard?perfil=${perfil.id}`
            }))
            const { error: notifErr } = await supabase.from('notificaciones').insert(notifs)
            if (notifErr) {
              console.error('Error inserting notifications for leaders:', notifErr)
            }
          }
        } catch (err) {
          console.error(err)
        }

        setEditingSolicitudId(null)
        setShowCompetenciaModal(false)
        setSelectedCompetenciaArea('')
        setJustificacionNnj('')
        setEvidenciaCompUrl('')
        setCompProyectoId('')
        fetchAvanzadaProgresion()
        alert('Correcciones enviadas con éxito.')
      }
    } else {
      const { error } = await supabase
        .from('solicitudes_competencias')
        .insert([{
          perfil_id: perfil.id,
          area_competencia: selectedCompetenciaArea,
          justificacion_nnj: justificacionNnj,
          evidencia_url: evidenciaCompUrl || null,
          proyecto_id: compProyectoId || null,
          estado: 'pendiente'
        }])

      if (error) {
        alert('Error al enviar la solicitud: ' + error.message)
      } else {
        try {
          const { data: leaders } = await supabase
            .from('perfiles')
            .select('id')
            .in('rol_id', [1, 2, 3])
            .eq('unidad_id', perfil.unidad_id)
            .eq('estado', 'activo')

          if (leaders && leaders.length > 0) {
            const notifs = leaders.map(leader => ({
              perfil_id: leader.id,
              mensaje: `El/la pionero/a ${perfil.nombres} ${perfil.apellidos} ha solicitado la validación del rumbo: ${selectedCompetenciaArea.replace('_', ' ').toUpperCase()}.`,
              tipo: 'sistema',
              link_url: `/dashboard?perfil=${perfil.id}`
            }))
            const { error: notifErr } = await supabase.from('notificaciones').insert(notifs)
            if (notifErr) {
              console.error('Error inserting notifications for leaders:', notifErr)
            }
          }
        } catch (err) {
          console.error(err)
        }

        setShowCompetenciaModal(false)
        setSelectedCompetenciaArea('')
        setJustificacionNnj('')
        setEvidenciaCompUrl('')
        setCompProyectoId('')
        fetchAvanzadaProgresion()
      }
    }
  }

  const handleLeaderReviewCompetencia = async (solicitudId: string, action: 'aprobar' | 'pedir_cambios' | 'rechazar') => {
    if (!leaderReviewText.trim()) return alert('Por favor, escribe los fundamentos de la Reunión de Coordinadores.')

    const estadoDb = action === 'aprobar' ? 'aprobada' : action === 'pedir_cambios' ? 'solicitud_cambio' : 'rechazada'

    const { error } = await supabase
      .from('solicitudes_competencias')
      .update({
        estado: estadoDb,
        evaluacion_lider: leaderReviewText,
        aprobado_por: userPerfil.id
      })
      .eq('id', solicitudId)

    if (error) {
      alert('Error al resolver la competencia: ' + error.message)
    } else {
      try {
        const { data: request } = await supabase
          .from('solicitudes_competencias')
          .select('area_competencia')
          .eq('id', solicitudId)
          .single()

        const areaName = request ? request.area_competencia.replace('_', ' ').toUpperCase() : 'COMPETENCIA'
        const actionText = action === 'aprobar' ? 'APROBADO' : action === 'pedir_cambios' ? 'solicitado cambios para' : 'RECHAZADO'
        
        const { error: notifErr } = await supabase.from('notificaciones').insert([{
          perfil_id: perfil.id,
          mensaje: `Tu rumbo de competencia ${areaName} ha sido ${actionText} por la Reunión de Coordinadores.`,
          tipo: 'sistema',
          link_url: '/dashboard'
        }])
        if (notifErr) {
          console.error(notifErr)
        }
      } catch (err) {
        console.error(err)
      }

      setActiveMetaIdForReview(null)
      setLeaderReviewText('')
      fetchAvanzadaProgresion()
    }
  }

  const handleDirectDeliverCompetencia = async () => {
    if (!directLeaderReviewText.trim()) {
      return alert('Por favor, ingresa los fundamentos de la Reunión de Coordinadores.')
    }

    const { error } = await supabase
      .from('solicitudes_competencias')
      .insert([{
        perfil_id: perfil.id,
        area_competencia: selectedDirectCompetenciaArea,
        justificacion_nnj: 'Entregada directamente por dirigente/guiadora.',
        proyecto_id: directCompProyectoId || null,
        estado: 'aprobada',
        evaluacion_lider: directLeaderReviewText,
        aprobado_por: userPerfil.id
      }])

    if (error) {
      alert('Error al otorgar la competencia: ' + error.message)
    } else {
      try {
        const areaName = selectedDirectCompetenciaArea.replace('_', ' ').toUpperCase()
        await supabase.from('notificaciones').insert([{
          perfil_id: perfil.id,
          mensaje: `Se te ha otorgado el rumbo de competencia ${areaName} directamente por tu dirigente/guiadora.`,
          tipo: 'sistema',
          link_url: '/dashboard'
        }])
      } catch (err) {
        console.error(err)
      }

      setShowDirectCompetenciaModal(false)
      setSelectedDirectCompetenciaArea('')
      setDirectLeaderReviewText('')
      setDirectCompProyectoId('')
      fetchAvanzadaProgresion()
      alert('Competencia otorgada con éxito.')
    }
  }

  const handleDeleteCompetencia = async (solicitudId: string) => {
    if (!confirm('¿Estás seguro de que deseas retirar esta solicitud de competencia? Se perderá todo su historial.')) return
    
    const { error } = await supabase
      .from('solicitudes_competencias')
      .delete()
      .eq('id', solicitudId)
    
    if (error) {
      alert('Error al retirar la solicitud: ' + error.message)
    } else {
      fetchAvanzadaProgresion()
      alert('Solicitud retirada con éxito.')
    }
  }

  // ==========================================
  // LOGICA DEFAULT (LOBATOS / SCOUTS / GUIAS)
  // ==========================================
  const fetchDefaultProgresion = async () => {
    const { data: etapas } = await supabase
      .from('progresion_etapas')
      .select('*')
      .eq('unidad_id', perfil.unidad_id)
      .order('orden')
    setTodasEtapas(etapas || [])

    let etapa = null
    if (perfil.progresion_etapa_id) {
      etapa = etapas?.find(e => e.id === perfil.progresion_etapa_id)
    }
    
    if (!etapa) {
      if (isClan && agenda) {
        if (agenda.etapa_progresion === 'fuego') {
          etapa = etapas?.find(e => e.nombre.toLowerCase().includes('fuego'))
        } else if (agenda.etapa_progresion === 'antorcha') {
          etapa = etapas?.find(e => e.nombre.toLowerCase().includes('antorcha'))
        } else if (agenda.etapa_progresion === 'partida') {
          etapa = {
            id: 'partida',
            nombre: 'La Partida',
            rango_edad: '17 a 20 años',
            imagen_url: '/images/progresion/clan/etapa_partida.png',
            color: '#1b3f8a'
          }
        }
      }
      
      if (!etapa && (isClan || isAvanzada)) {
        etapa = {
          id: 'bienvenida',
          nombre: isAvanzada ? 'Cruz del Sur' : 'Insignia del Caminante',
          rango_edad: isAvanzada ? '15 a 17 años' : '17 a 20 años',
          imagen_url: isAvanzada ? '/images/progresion/avanzada/etapa_bienvenida.png' : '/images/progresion/clan/etapa_bienvenida.png',
          color: isAvanzada ? '#1b8a5a' : '#1b3f8a'
        }
      }
    }

    if (!etapa && etapas && etapas.length > 0) {
      const { data: avanceDataTmp } = await supabase.from('progresion_avance')
        .select('*')
        .eq('perfil_id', perfil.id)
      const logradosCount = avanceDataTmp?.filter(a => a.estado === 'logrado').length || 0
      
      if (isManada) {
        const isTardia = perfil.edad >= 9
        etapa = logradosCount >= 6 ? (isTardia ? etapas[3] : etapas[1]) : (isTardia ? etapas[2] : etapas[0])
      } else if (isCompania) {
        const isTardia = perfil.edad >= 13
        etapa = logradosCount >= 6 ? (isTardia ? etapas[3] : etapas[1]) : (isTardia ? etapas[2] : etapas[0])
      } else {
        etapa = etapas[0]
      }
    }
    setEtapaActual(etapa)

    let rangoParaCargar = etapa?.rango_edad
    if (!rangoParaCargar || isAvanzada || isClan) {
      if (isAvanzada) rangoParaCargar = '15 a 17 años'
      else if (isClan) rangoParaCargar = '17 a 20 años'
      else if (isManada) rangoParaCargar = perfil.edad >= 9 ? 'Infancia Tardía' : 'Infancia Media'
      else if (isCompania) rangoParaCargar = perfil.edad >= 13 ? '13 a 15 años' : '11 a 13 años'
    }
    
    const { data: objsData } = await supabase.from('progresion_objetivos')
      .select('*')
      .eq('unidad_id', perfil.unidad_id)
      .eq('rango_edad', rangoParaCargar)
    
    const { data: avanceData } = await supabase.from('progresion_avance')
      .select('*')
      .eq('perfil_id', perfil.id)

    setObjetivosDefault(objsData || [])
    setAvanceDefault(avanceData || [])
  }

  const handleSetEtapaDefault = async (etapaId: string) => {
    if (!isLeader) return
    const idVal = etapaId ? parseInt(etapaId) : null
    const { error } = await supabase.from('perfiles').update({ progresion_etapa_id: idVal }).eq('id', perfil.id)
    if (!error) {
      perfil.progresion_etapa_id = idVal
      fetchDefaultProgresion()
    }
  }

  const handleSelfEvalDefault = async (objId: string, currentEstado: string) => {
    if (!isOwner) return
    const nuevoEstado = currentEstado === 'en_proceso' ? 'pendiente' : 'en_proceso'
    const { error } = await supabase.from('progresion_avance').upsert({
      perfil_id: perfil.id,
      objetivo_id: objId,
      estado: nuevoEstado
    }, { onConflict: 'perfil_id,objetivo_id' })
    if (error) alert('Error al autoevaluar: ' + error.message)
    fetchDefaultProgresion()
  }

  const handleSelfEvalValue = async (objId: string, value: number) => {
    if (!isOwner) return
    const existing = avanceDefault.find(a => a.objetivo_id === objId)
    const payload: any = {
      perfil_id: perfil.id,
      objetivo_id: objId,
      valor: value
    }
    if (!existing) {
      payload.estado = 'en_proceso'
    }
    const { error } = await supabase.from('progresion_avance').upsert(payload, { onConflict: 'perfil_id,objetivo_id' })
    if (error) alert('Error al autoevaluar: ' + error.message)
    fetchDefaultProgresion()
  }

  const handleParentEvalValue = async (objId: string, value: number) => {
    if (!isParent) return
    const existing = avanceDefault.find(a => a.objetivo_id === objId)
    const payload: any = {
      perfil_id: perfil.id,
      objetivo_id: objId,
      valor_apoderado: value
    }
    if (!existing) {
      payload.estado = 'en_proceso'
    }
    const { error } = await supabase.from('progresion_avance').upsert(payload, { onConflict: 'perfil_id,objetivo_id' })
    if (error) alert('Error al registrar evaluación de apoderado: ' + error.message)
    fetchDefaultProgresion()
  }

  const handleParentCommentDefault = async (objId: string) => {
    if (!isParent) return
    const { error } = await supabase.from('progresion_avance').upsert({
      perfil_id: perfil.id,
      objetivo_id: objId,
      comentario_apoderado: tempComentario,
      fecha_comentario_apoderado: new Date().toISOString()
    }, { onConflict: 'perfil_id,objetivo_id' })
    if (error) alert('Error al guardar comentario: ' + error.message)
    setComentando(null)
    setTempComentario('')
    fetchDefaultProgresion()
  }

  const handleLeaderValidateDefault = async (objId: string, currentEstado: string) => {
    if (!isLeader) return
    const nuevoEstado = currentEstado === 'logrado' ? 'en_proceso' : 'logrado'
    const { error } = await supabase.from('progresion_avance').upsert({
      perfil_id: perfil.id,
      objetivo_id: objId,
      estado: nuevoEstado,
      fecha_logro: nuevoEstado === 'logrado' ? new Date().toISOString() : null,
      validado_por: userPerfil.id
    }, { onConflict: 'perfil_id,objetivo_id' })
    
    if (error) alert('Error al validar: ' + error.message)
    fetchDefaultProgresion()
  }

  const handleLeaderEvalValue = async (objId: string, value: number) => {
    if (!isLeader) return
    const existing = avanceDefault.find(a => a.objetivo_id === objId)
    const payload: any = {
      perfil_id: perfil.id,
      objetivo_id: objId,
      valor_dirigente: value,
      validado_por: userPerfil.id
    }
    if (!existing) {
      payload.estado = 'en_proceso'
    }
    const { error } = await supabase.from('progresion_avance').upsert(payload, { onConflict: 'perfil_id,objetivo_id' })
    if (error) alert('Error al registrar evaluación de dirigente: ' + error.message)
    fetchDefaultProgresion()
  }

  // ==========================================
  // RENDER - CLAN (CAMINANTES)
  // ==========================================
  const renderAgendaNotInitializedCard = () => {
    const isBeneficiaryRole = [12, 13].includes(perfil.rol_id)

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
                  alert('Error al inicializar la agenda: ' + createErr.message)
                } else {
                  setAgenda(newAgenda)
                  if (isClan) fetchClanProgresion()
                  else if (isAvanzada) fetchAvanzadaProgresion()
                }
              } catch (err: any) {
                alert('Error: ' + err.message)
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

  const renderProyectosSection = (proyectos: any[]) => {
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
                    onClick={() => { setWizardProyecto(p); setWizardEsGrupal(p.es_grupal); setWizardInitialStep(1); setIsWizardOpen(true); }}
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
    const completedSpecialties = especialidadesPersonales.filter(ep => ep.estado === 'completado')

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
              <img src={etapaActual.imagen_url} alt={etapaActual.nombre} className="w-full h-full object-cover" onError={(e:any) => e.target.style.display='none'} />
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
                onClick={() => setActiveCeremonyType('etapa')}
                className="p-2 active:scale-95 text-[1em] font-bold uppercase rounded-xl tracking-wider transition-all border border-white/25 cursor-pointer"
                style={{ backgroundColor: themeSecondary, color: themePrimary }}
              >
                🎖️ Entregar Insignia
              </button>
              <button
                onClick={() => setActiveCeremonyType('promesa')}
                className="p-2 active:scale-95 text-[1em] font-bold uppercase rounded-xl tracking-wider transition-all border border-white/25 cursor-pointer"
                style={{ backgroundColor: themeSecondary, color: themePrimary }}
              >
                🕯️ Promesa
              </button>
              <button
                onClick={() => setActiveCeremonyType('paso')}
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
    const labelEspecialidades = especialidadesSupervisadas.length > 0
      ? 'Tutorías y Supervisiones'
      : (isOwner ? 'Mis Especialidades' : `Especialidades de ${perfil.nombres}`)
    const labelCeremonias = 'Ceremonias e Hitos'

    return (
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 dark:border-white/10 pb-2">
        <button
          onClick={() => setSubTab('progreso')}
          className={`pb-2 px-4 font-bold uppercase text-[0.85em] md:text-[0.95em] border-b-2 transition-all ${
            subTab === 'progreso'
              ? 'text-zinc-900 dark:text-white font-extrabold'
              : 'border-transparent text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300'
          }`}
          style={subTab === 'progreso' ? { borderColor: themePrimary, color: themePrimary } : {}}
        >
          {labelProgreso} {isManada ? '🐾' : isCompania || isTropa ? '⚔️' : '📈'}
        </button>
        <button
          onClick={() => setSubTab('especialidades')}
          className={`pb-2 px-4 font-bold uppercase text-[0.85em] md:text-[0.95em] border-b-2 transition-all ${
            subTab === 'especialidades'
              ? 'text-zinc-900 dark:text-white font-extrabold'
              : 'border-transparent text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300'
          }`}
          style={subTab === 'especialidades' ? { borderColor: themePrimary, color: themePrimary } : {}}
        >
          {labelEspecialidades} 🎖️
        </button>
        <button
          onClick={() => setSubTab('ceremonias')}
          className={`pb-2 px-4 font-bold uppercase text-[0.85em] md:text-[0.95em] border-b-2 transition-all ${
            subTab === 'ceremonias'
              ? 'text-zinc-900 dark:text-white font-extrabold'
              : 'border-transparent text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300'
          }`}
          style={subTab === 'ceremonias' ? { borderColor: themePrimary, color: themePrimary } : {}}
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
      <div className="space-y-6 animate-in fade-in duration-500">
        <div>
          <h3 className="font-bold uppercase text-[1.5em] text-zinc-900 dark:text-white">
            🏆 Álbum de Ceremonias e Hitos
          </h3>
          <p className="text-[0.9em] font-bold text-zinc-400 mt-1">
            Los momentos más importantes de tu vida scout, celebraciones y cambios de etapa.
          </p>
        </div>

        {ceremonias.length === 0 ? (
          <div className="p-16 text-center border-2 border-dashed rounded-[3rem] opacity-50 bg-white dark:bg-zinc-900/20 dark:border-white/10">
            <span className="text-4xl mb-4 block">🎪</span>
            <p className="italic font-bold uppercase tracking-widest text-[0.8em]">
              No hay ceremonias registradas aún. ¡Cada gran paso es un momento de celebración!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ceremonias.map(c => {
              const formattedDate = c.fecha ? new Date(c.fecha + 'T00:00:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
              
              let badgeColor = 'bg-clr7 text-white';
              if (c.tipo === 'promesa') badgeColor = 'bg-amber-600 text-white';
              if (c.tipo === 'paso') badgeColor = 'bg-indigo-600 text-white';
              if (c.tipo === 'egreso') badgeColor = 'bg-red-600 text-white';
              if (c.tipo === 'bienvenida') badgeColor = 'bg-teal-600 text-white';

              const hasMessages = c.mensajes && c.mensajes.length > 0;
              
              const canWriteMessage = userPerfil.id !== c.perfil_id;
              
              const alreadyWrote = c.mensajes?.some((m: any) => m.remitente_id === userPerfil.id);
              const showInput = canWriteMessage && !alreadyWrote;

              return (
                <div key={c.id} className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 rounded-[2rem] p-6 shadow-lg flex flex-col relative overflow-hidden">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-[0.8em] font-extrabold uppercase tracking-wider mb-2 ${badgeColor}`}>
                        {c.tipo === 'etapa' ? 'Etapa' : c.tipo === 'promesa' ? 'Promesa' : c.tipo === 'paso' ? 'Paso de Unidad' : c.tipo}
                      </span>
                      <h4 className="text-[1.8em] font-black uppercase tracking-tight text-zinc-950 dark:text-white leading-none">
                        {c.nombre_hito}
                      </h4>
                      <p className="text-[0.85em] font-bold text-zinc-400 mt-1 uppercase tracking-wider">
                        📅 {formattedDate}
                      </p>
                    </div>
                  </div>

                  {(c.campamento || c.lugar) && (
                    <div className="mt-3 p-3 bg-zinc-50 dark:bg-black/20 rounded-2xl border dark:border-white/5 text-[0.85em] font-bold text-zinc-550 dark:text-zinc-355 space-y-1">
                      {c.campamento && <p>🏕️ Campamento: <span className="text-zinc-800 dark:text-white uppercase">{c.campamento}</span></p>}
                      {c.lugar && <p>📍 Lugar: <span className="text-zinc-800 dark:text-white uppercase">{c.lugar}</span></p>}
                    </div>
                  )}

                  {c.tipo === 'paso' && (
                    <div className="mt-3 flex items-center gap-2 text-[0.85em] font-black uppercase text-indigo-650 dark:text-indigo-400">
                      <span>👣 {c.unidad_origen?.nombre || 'Origen'}</span>
                      <span>➡️</span>
                      <span>{c.unidad_destino?.nombre || 'Destino'}</span>
                    </div>
                  )}

                  {c.foto_url && (
                    <div className="mt-4 rounded-2xl overflow-hidden shadow-inner border border-zinc-100 dark:border-white/5">
                      <img src={c.foto_url} alt="Ceremonia" className="w-full max-h-64 object-cover" />
                    </div>
                  )}

                  {c.radar_snapshot && Array.isArray(c.radar_snapshot) && c.radar_snapshot.length > 0 && (
                    <div className="mt-6 flex flex-col items-center bg-zinc-50 dark:bg-black/15 p-3 rounded-2xl border dark:border-white/5">
                      <span className="text-[0.8em] font-extrabold uppercase tracking-widest text-zinc-400 mb-1">
                        📊 Radar de Progresión en Ceremonia
                      </span>
                      <div className="w-full h-44 max-w-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="60%" data={c.radar_snapshot}>
                            <PolarGrid stroke="#e4e4e7" strokeWidth={1} />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 7, fontWeight: 'bold' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 8]} tick={{ fill: '#a1a1aa', fontSize: 5 }} tickCount={5} />
                            <Radar name="Mi Autoevaluación" dataKey="Autoevaluacion" stroke={themePrimary} fill={themePrimary} fillOpacity={0.15} />
                            <Radar name="Apoderado" dataKey="Apoderado" stroke="#d97706" fill="#d97706" fillOpacity={0.1} />
                            <Radar name="Dirigente" dataKey="Dirigente" stroke="#16a34a" fill="#16a34a" fillOpacity={0.15} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {c.tipo === 'promesa' && (c.padrino || c.madrina) && (
                    <div className="mt-4 p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-[0.85em] font-bold text-amber-805 dark:text-amber-400 space-y-1">
                      {c.padrino && <p>⛪ Padrino: <span className="text-zinc-800 dark:text-white uppercase">{c.padrino.nombres} {c.padrino.apellidos}</span></p>}
                      {c.madrina && <p>⛪ Madrina: <span className="text-zinc-800 dark:text-white uppercase">{c.madrina.nombres} {c.madrina.apellidos}</span></p>}
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-white/5 space-y-3">
                    <span className="text-[0.8em] font-extrabold uppercase tracking-widest text-zinc-400 block">
                      {c.tipo === 'promesa' 
                        ? '⛪ Mensajes y Bendiciones' 
                        : c.tipo === 'etapa' 
                          ? '🎉 Felicitaciones y Saludos' 
                          : '💬 Mensajes de Despedida'}
                    </span>

                    {hasMessages ? (
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {c.mensajes.map((m: any) => (
                          <div key={m.id} className="p-3 bg-zinc-50 dark:bg-black/20 rounded-2xl border dark:border-white/5 text-[0.85em]">
                            <p className="text-zinc-850 dark:text-zinc-200 italic font-bold">"{m.mensaje}"</p>
                            <p className="text-[0.8em] text-zinc-400 font-extrabold uppercase mt-1 text-right">
                              — {m.remitente?.nombres} {m.remitente?.apellidos} ({getRoleLabel(m.remitente?.rol_id)})
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[0.8em] font-bold text-zinc-400 italic">No hay mensajes aún.</p>
                    )}

                    {showInput && (
                      <div className="mt-3 flex gap-2">
                        <input
                          type="text"
                          value={inlineMessageTexts[c.id] || ''}
                          onChange={(e) => setInlineMessageTexts(prev => ({ ...prev, [c.id]: e.target.value }))}
                          placeholder={
                            c.tipo === 'promesa' 
                              ? "Escribe tus bendiciones para tu ahijado..." 
                              : c.tipo === 'etapa'
                                ? "Escribe tus felicitaciones por esta nueva etapa..."
                                : c.tipo === 'paso'
                                  ? "Escribe tu despedida al NNJ..."
                                  : "Escribe un mensaje de celebración..."
                          }
                          className="flex-1 bg-white dark:bg-clr3 border border-zinc-200 dark:border-white/5 p-2 rounded-xl text-[0.85em] font-bold text-zinc-805 dark:text-white"
                        />
                        <button
                          onClick={() => handleSaveInlineMessage(c.id)}
                          className="px-4 py-2 text-[0.8em] font-bold uppercase rounded-xl text-white shadow-md hover:brightness-105 active:scale-95 transition-all"
                          style={{ backgroundColor: themePrimary }}
                        >
                          Enviar
                        </button>
                      </div>
                    )}
                  </div>

                  {c.tipo === 'paso' && isLeader && (
                    <button
                      onClick={() => handleViewReport(c)}
                      className="mt-4 w-full py-2 border-2 border-dashed border-indigo-500/40 hover:border-indigo-500 hover:bg-indigo-500/5 text-indigo-700 dark:text-indigo-400 text-[0.8em] font-bold uppercase rounded-2xl shadow-sm transition-all"
                    >
                      📄 Ver Informe de Logros
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderEspecialidadesSection = () => {
    // Filter definitions based on search text and selected field filter
    const filteredCatalog = definicionesEspecialidades.filter(def => {
      const matchesSearch = def.nombre.toLowerCase().includes(searchCatQuery.toLowerCase()) ||
                            (def.descripcion && def.descripcion.toLowerCase().includes(searchCatQuery.toLowerCase()))
      const matchesField = selectedFieldFilter === 'todos' || def.campo_interes === selectedFieldFilter
      return matchesSearch && matchesField
    })

    const getPhaseLabel = (fase: string) => {
      switch (fase) {
        case 'exploracion': return 'Exploración 🔍'
        case 'planificacion': return 'Planificación 📋'
        case 'desarrollo': return 'Desarrollo 🛠️'
        case 'reconocimiento': return 'Reconocimiento 🎖️'
        default: return fase
      }
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
              {especialidadesSupervisadas.map(ep => {
                const color = getFieldColor(ep.campo_interes)
                const emoji = getFieldEmoji(ep.campo_interes)
                const name = ep.nombre_personalizado || ep.especialidades_definiciones?.nombre || 'Especialidad'
                const acts = ep.especialidades_actividades || []
                const completedCount = acts.filter((a: any) => a.completada).length
                const totalCount = acts.length
                const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
                const specialistName = ep.perfil ? `${ep.perfil.nombres} ${ep.perfil.apellidos}` : 'Miembro'

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
                        acts.some((a: any) => !a.completada && a.evidencia_texto) && (
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
            {isOwner && perfil.rol_id !== 14 && perfil.rol_id !== 12 && perfil.rol_id !== 13 && (
              <button 
                onClick={() => {
                  resetWizard();
                  setShowSpecialtyWizard(true);
                  setWizardStep(1);
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
          ) : especialidadesPersonales.length === 0 ? (
            <div className="p-2 rounded-[1rem] bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-center">
              <span className="text-4xl mb-2 block">✨</span>
              <h4 className="font-bold text-[1.1em] text-zinc-800 dark:text-zinc-200">¡Aún no tienes especialidades activas!</h4>
              <p className="text-[0.9em] text-zinc-500 dark:text-zinc-450 mt-1 max-w-md mx-auto">
                Explora el catálogo abajo para elegir un campo de interés y proponer tu primera especialidad.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {especialidadesPersonales.map(ep => {
                const color = getFieldColor(ep.campo_interes)
                const name = ep.nombre_personalizado || ep.especialidades_definiciones?.nombre || 'Especialidad'
                const acts = ep.especialidades_actividades || []
                const completedCount = acts.filter((a: any) => a.completada).length
                const totalCount = acts.length
                const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

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
        {perfil.rol_id !== 14 && (
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
                  const color = getFieldColor(def.campo_interes)
                  const emoji = getFieldEmoji(def.campo_interes)
                  
                  return (
                    <div 
                      key={def.id}
                      className="p-2 rounded-[1rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 hover:border-zinc-350 dark:hover:border-zinc-700 shadow-md hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between group border-l-[6px]"
                      style={{ borderLeftColor: color }}
                      onClick={() => {
                        if (isOwner && perfil.rol_id !== 12 && perfil.rol_id !== 13) {
                          resetWizard()
                          setWSelectedField(def.campo_interes)
                          setWSelectedDefId(def.id)
                          setWCustomName('')
                          setShowSpecialtyWizard(true)
                          setWizardStep(2) // Empezará en paso 2 con definición seleccionada
                        }
                      }}
                    >
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span 
                            className="p-1 rounded-full text-[0.9em] font-extrabold uppercase shadow-sm flex items-center gap-1 border shrink-0"
                            style={{ 
                              backgroundColor: getFieldBgColor(def.campo_interes),
                              color: getFieldTextColor(def.campo_interes),
                              borderColor: color
                            }}
                          >
                            <img src={getFieldLogoPath(def.campo_interes)} alt="" className="w-3.5 h-3.5 object-contain" loading="lazy" decoding="async" />
                            {getFieldLabel(def.campo_interes)}
                          </span>
                          <div className="w-17 h-17 flex items-center justify-center shadow-inner shrink-0">
                            <img src={getFieldLogoPath(def.campo_interes)} alt="" className="w-full h-full object-contain" loading="lazy" decoding="async" />
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

                      {isOwner && perfil.rol_id !== 12 && perfil.rol_id !== 13 && (
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
          onClose={() => setShowSpecialtyWizard(false)}
          perfil={perfil}
          definiciones={definicionesEspecialidades}
          onSaveSuccess={async (newSpec) => {
            setShowSpecialtyWizard(false)
            await fetchEspecialidades()
            if (newSpec && newSpec.fase === 'planificacion') {
              await refreshActiveSpecialty(newSpec.id)
            }
          }}
        />
        {activeEspecialidad && (
          <DashmodProgresionEspecialidadDetalle
            especialidad={activeEspecialidad}
            userPerfil={userPerfil}
            perfil={perfil}
            availableMonitors={availableMonitors}
            availableActivityArticles={availableActivityArticles}
            onClose={() => setActiveEspecialidad(null)}
            onRefreshParent={async () => {
              await fetchEspecialidades()
              if (activeEspecialidad) {
                await refreshActiveSpecialty(activeEspecialidad.id)
              }
            }}
          />
        )}
      </div>
    )
  }


  const renderEspecialidadesSectionOnlyTutorias = () => {
    const getPhaseLabel = (fase: string) => {
      switch (fase) {
        case 'exploracion': return 'Exploración 🔍'
        case 'planificacion': return 'Planificación 📋'
        case 'desarrollo': return 'Desarrollo 🛠️'
        case 'reconocimiento': return 'Reconocimiento 🎖️'
        default: return fase
      }
    }

    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Modales necesarios */}
        {activeEspecialidad && (
          <DashmodProgresionEspecialidadDetalle
            especialidad={activeEspecialidad}
            userPerfil={userPerfil}
            perfil={perfil}
            availableMonitors={availableMonitors}
            availableActivityArticles={availableActivityArticles}
            onClose={() => setActiveEspecialidad(null)}
            onRefreshParent={async () => {
              await fetchEspecialidades()
              if (activeEspecialidad) {
                await refreshActiveSpecialty(activeEspecialidad.id)
              }
            }}
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

          {especialidadesSupervisadas.length === 0 ? (
            <div className="p-8 rounded-[2rem] bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-center">
              <span className="text-4xl mb-2 block">🎓</span>
              <h4 className="font-bold text-[1.1em] text-zinc-800 dark:text-zinc-200">No tienes especialidades asignadas para supervisar</h4>
              <p className="text-[0.9em] text-zinc-500 dark:text-zinc-450 mt-1 max-w-md mx-auto">
                Cuando los beneficiarios te seleccionen como monitor en sus especialidades, aparecerán aquí para que puedas revisar y aprobar sus tareas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {especialidadesSupervisadas.map(ep => {
                const color = getFieldColor(ep.campo_interes)
                const name = ep.nombre_personalizado || ep.especialidades_definiciones?.nombre || 'Especialidad'
                const acts = ep.especialidades_actividades || []
                const completedCount = acts.filter((a: any) => a.completada).length
                const totalCount = acts.length
                const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
                const specialistName = ep.perfil ? `${ep.perfil.nombres} ${ep.perfil.apellidos}` : 'Miembro'

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
                        acts.some((a: any) => !a.completada && a.evidencia_texto) && (
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

  const renderCaminanteProgression = () => {

    return (
      <div className="space-y-12 animate-in fade-in duration-500 pb-20">
        {renderProgressionHeader()}

        {renderSubTabBar()}

        {subTab === 'ceremonias' ? (
          renderCeremoniasSection()
        ) : especialidadesSupervisadas.length > 0 && subTab === 'especialidades' ? (
          renderEspecialidadesSectionOnlyTutorias()
        ) : subTab === 'especialidades' ? (
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
                      ['fuego', 'antorcha', 'partida'].includes(agenda.etapa_progresion) ? 'grayscale-0' : 'grayscale opacity-40'
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
                      ['antorcha', 'partida'].includes(agenda.etapa_progresion) ? 'grayscale-0' : 'grayscale opacity-40'
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
              {isOwner && (
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
                      {isOwner && !isAlcanzada && !isEnProceso && (
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

        {subTab === 'ceremonias' ? (
          renderCeremoniasSection()
        ) : especialidadesSupervisadas.length > 0 && subTab === 'especialidades' ? (
          renderEspecialidadesSectionOnlyTutorias()
        ) : subTab === 'especialidades' ? (
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
            {isOwner && perfil.rol_id !== 14 && (
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
              
              const detailsMap: any = {
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
                                setJustificacionNnj(activeRow.justificacion_nnj)
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
                              setJustificacionNnj(c.justificacion_nnj)
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

        {subTab === 'ceremonias' ? (
          renderCeremoniasSection()
        ) : subTab === 'especialidades' ? (
          renderEspecialidadesSection()
        ) : (
          renderObjetivosEducativosSection()
        )}
      </div>
    )
  }

  const refreshSelectedProjectSheet = async (projectId: string) => {
    const { data, error } = await supabase
      .from('proyectos')
      .select('*')
      .eq('id', projectId)
      .single()
    if (!error && data) {
      setSelectedProjectSheet(data)
      await loadSheetParticipants(projectId)
    }
  }

  const loadSheetParticipants = async (projectId: string) => {
    const { data, error } = await supabase
      .from('proyecto_participantes')
      .select('*, perfiles(nombres, apellidos)')
      .eq('proyecto_id', projectId)
    if (!error && data) {
      setSheetParticipants(data)
    } else {
      setSheetParticipants([])
    }
  }

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
      alert('Error al eliminar el proyecto: ' + error.message)
    } else {
      setSelectedProjectSheet(null)
      fetchInitialData()
    }
  }

  const getRadarData = () => {
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
  };

  const renderObjetivosEducativosSection = () => {
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
          const radarData = getRadarData();
          const hasEvaluations = avanceDefault.some(a => 
            (a.valor !== null && a.valor !== undefined) ||
            (a.valor_dirigente !== null && a.valor_dirigente !== undefined) ||
            (a.valor_apoderado !== null && a.valor_apoderado !== undefined)
          );
          
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
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="#e4e4e7" strokeWidth={1} />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }} 
                      />
                      <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 8]} 
                        tickCount={5}
                        tick={{ fill: '#a1a1aa', fontSize: 8 }}
                      />
                      <Radar
                        name="Mi Autoevaluación"
                        dataKey="Autoevaluacion"
                        stroke={themePrimary}
                        fill={themePrimary}
                        fillOpacity={0.2}
                      />
                      <Radar
                        name="Apoderado"
                        dataKey="Apoderado"
                        stroke="#d97706"
                        fill="#d97706"
                        fillOpacity={0.15}
                      />
                      <Radar
                        name="Dirigente"
                        dataKey="Dirigente"
                        stroke="#16a34a"
                        fill="#16a34a"
                        fillOpacity={0.2}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          );
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

            const areaAvance = avanceDefault.filter(a => a.estado === 'logrado' && areaObjs.some(o => o.id === a.objetivo_id))
            
            if (searchQuery.trim() !== '' && areaObjs.length === 0) return null

            const baseAreaObjs = objetivosDefault.filter(o => o.area_id === area.id)
            const totalAvance = avanceDefault.filter(a => a.estado === 'logrado' && baseAreaObjs.some(o => o.id === a.objetivo_id))
            const percentage = baseAreaObjs.length > 0 ? (totalAvance.length / baseAreaObjs.length) * 100 : 0
            
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
                        onError={(e:any) => e.target.style.display='none'}
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
                      const dataAvance = avanceDefault.find(a => a.objetivo_id === obj.id);
                      const val = dataAvance?.valor;
                      const valDirigente = dataAvance?.valor_dirigente;
                      const valApoderado = dataAvance?.valor_apoderado;
                      const isLogrado = dataAvance?.estado === 'logrado';
                      const isEnProceso = dataAvance?.estado === 'en_proceso';

                      return (
                        <div key={obj.id} className={`p-2 rounded-2xl border-2 flex flex-col justify-between shadow-md ${
                          isLogrado ? 'bg-white dark:bg-zinc-800 border-green-500' : isEnProceso ? 'bg-blue-50/20 border-blue-400' : 'bg-white dark:bg-zinc-800/10 border-zinc-200'
                        }`} style={{ borderColor: themePrimary }}>
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
                                    <div className="flex justify-center" title={val !== undefined && val !== null ? `Propia: ${getEvalLabel(val, perfil.unidad_id)}` : 'Sin evaluación'}>
                                      {val !== undefined && val !== null ? (
                                        <span className="w-6 h-6 rounded-full flex items-center justify-center font-black text-white text-[0.8em] shadow-sm" style={{ backgroundColor: themePrimary }}>
                                          {val}
                                        </span>
                                      ) : (
                                        <span className="text-[0.8em] text-zinc-400 italic font-medium">-</span>
                                      )}
                                    </div>
                                    <div className="flex justify-center border-l border-r border-zinc-150 dark:border-white/5" title={valApoderado !== undefined && valApoderado !== null ? `Apoderado: ${getEvalLabel(valApoderado, perfil.unidad_id)}` : 'Sin evaluación'}>
                                      {valApoderado !== undefined && valApoderado !== null ? (
                                        <span className="w-6 h-6 rounded-full flex items-center justify-center font-black text-white text-[0.8em] bg-yellow-600 shadow-sm">
                                          {valApoderado}
                                        </span>
                                      ) : (
                                        <span className="text-[0.8em] text-zinc-400 italic font-medium">-</span>
                                      )}
                                    </div>
                                    <div className="flex justify-center" title={valDirigente !== undefined && valDirigente !== null ? `Dirigente: ${getEvalLabel(valDirigente, perfil.unidad_id)}` : 'Sin evaluación'}>
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
                            {isOwner && (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveObjForEval(obj);
                                  setTempEvalValue(val || null);
                                  setShowObjEvalModal(true);
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
                                  setActiveObjForEval(obj);
                                  setTempEvalValue(valApoderado || null);
                                  setShowObjEvalModal(true);
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
                                    setActiveObjForEval(obj);
                                    setTempEvalValue(valDirigente || null);
                                    setShowObjEvalModal(true);
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

    const totalGastos = presItems.filter((i: any) => i.tipo === 'gasto').reduce((acc: number, curr: any) => acc + (curr.cantidad * curr.costo_unitario), 0)
    const totalIngresos = presItems.filter((i: any) => i.tipo === 'ingreso').reduce((acc: number, curr: any) => acc + (curr.cantidad * curr.costo_unitario), 0)
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
                    setWizardEsGrupal(p.es_grupal); 
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
                    setWizardEsGrupal(p.es_grupal); 
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
              {acts.map((act: any, idx: number) => (
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
                    {sheetParticipants.map((pReg: any) => (
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
                  {partsManual.map((pMan: any, idx: number) => (
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
                    {presItems.map((item: any, idx: number) => (
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
              {finItems.map((item: any, idx: number) => (
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
                {Object.entries(evals).map(([name, comment]: [string, any], idx: number) => (
                  <div key={idx} className="p-4 bg-white dark:bg-zinc-900/60 rounded-[1rem] border border-zinc-150 dark:border-white/5 space-y-1">
                    <span className="text-[0.8em] font-bold uppercase" style={{ color: themePrimary }}>{name}</span>
                    <p className="text-[0.85em] font-bold text-zinc-700 dark:text-zinc-300 italic">
                      "{comment || 'Sin comentarios.'}"
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
            alert('Por favor, selecciona una calificación del 1 al 8.');
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
      {activeCeremonyType && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border dark:border-white/10 w-full max-w-lg rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-zinc-100 dark:border-white/5 flex justify-between items-center bg-zinc-50 dark:bg-black/10">
              <h3 className="font-extrabold uppercase text-[1.25em] text-zinc-955 dark:text-white">
                {activeCeremonyType === 'etapa' ? '🎖️ Entregar Insignia Etapa' : activeCeremonyType === 'promesa' ? '🕯️ Registrar Promesa' : '👣 Registrar Paso'}
              </h3>
              <button 
                onClick={() => setActiveCeremonyType(null)} 
                className="text-zinc-450 hover:text-zinc-650 dark:hover:text-white font-black text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-[0.9em]">
              {activeCeremonyType === 'etapa' ? (
                <div>
                  <label className="block font-extrabold uppercase text-zinc-450 mb-1">Nombre de la Etapa</label>
                  <select
                    value={cNombreHito}
                    onChange={(e) => setCNombreHito(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-clr3 border dark:border-white/10 p-3 rounded-xl font-bold uppercase tracking-tight text-zinc-800 dark:text-white cursor-pointer"
                  >
                    <option value="">Selecciona etapa...</option>
                    {getStageOptionsForDropdown().map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block font-extrabold uppercase text-zinc-450 mb-1">Nombre del Hito</label>
                  <input
                    type="text"
                    value={cNombreHito}
                    disabled
                    className="w-full bg-zinc-100 dark:bg-black/40 border dark:border-white/10 p-3 rounded-xl font-bold uppercase text-zinc-500"
                  />
                </div>
              )}

              <div>
                <label className="block font-extrabold uppercase text-zinc-450 mb-1">Campamento (Opcional)</label>
                <input
                  type="text"
                  value={cCampamento}
                  onChange={(e) => setCCampamento(e.target.value)}
                  placeholder="Ej: Campamento de Verano Picarquín"
                  className="w-full bg-zinc-50 dark:bg-black/20 border dark:border-white/10 p-3 rounded-xl font-bold text-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-extrabold uppercase text-zinc-450 mb-1">Lugar (Opcional)</label>
                <input
                  type="text"
                  value={cLugar}
                  onChange={(e) => setCLugar(e.target.value)}
                  placeholder="Ej: Local de Grupo o Picarquín"
                  className="w-full bg-zinc-50 dark:bg-black/20 border dark:border-white/10 p-3 rounded-xl font-bold text-zinc-805 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-extrabold uppercase text-zinc-450 mb-1">Fecha</label>
                <input
                  type="date"
                  value={cFecha}
                  onChange={(e) => setCFecha(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-black/20 border dark:border-white/10 p-3 rounded-xl font-bold text-zinc-800 dark:text-white cursor-pointer"
                />
              </div>

              {activeCeremonyType === 'promesa' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-extrabold uppercase text-zinc-455 mb-1">Padrino</label>
                    <select
                      value={cPadrinoId}
                      onChange={(e) => setCPadrinoId(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-black/20 border dark:border-white/10 p-3 rounded-xl font-bold text-zinc-800 dark:text-white cursor-pointer"
                    >
                      <option value="">Ninguno...</option>
                      {availablePadrinos.map(p => (
                        <option key={p.id} value={p.id}>{p.nombres} {p.apellidos}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-extrabold uppercase text-zinc-455 mb-1">Madrina</label>
                    <select
                      value={cMadrinaId}
                      onChange={(e) => setCMadrinaId(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-black/20 border dark:border-white/10 p-3 rounded-xl font-bold text-zinc-800 dark:text-white cursor-pointer"
                    >
                      <option value="">Ninguna...</option>
                      {availablePadrinos.map(p => (
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
                  onChange={(e) => setCFotoFile(e.target.files?.[0] || null)}
                  className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[0.8em] file:font-black file:uppercase file:bg-zinc-100 dark:file:bg-black/40 file:text-zinc-700 dark:file:text-white hover:file:bg-zinc-200 cursor-pointer font-bold text-zinc-500"
                />
              </div>

              {activeCeremonyType === 'paso' && (
                <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-bold text-[0.85em]">
                  💡 Al confirmar el paso, se cambiará automáticamente al beneficiario a su siguiente unidad y rol en la base de datos, y se enviará una notificación a sus pares para que dejen sus despedidas.
                </div>
              )}
            </div>

            <div className="p-4 border-t border-zinc-100 dark:border-white/5 flex gap-3 bg-zinc-50/50 dark:bg-black/10 shrink-0">
              <button 
                type="button"
                onClick={() => setActiveCeremonyType(null)} 
                disabled={cLoading}
                className="flex-1 py-3 text-[0.8em] font-black uppercase tracking-wider text-zinc-455 hover:text-red-500 transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={handleSaveCeremonia}
                disabled={cLoading || (activeCeremonyType === 'etapa' && !cNombreHito)}
                className="flex-[2] py-3 bg-clr7 text-white text-[0.8em] font-black uppercase rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all tracking-wider disabled:opacity-50 cursor-pointer"
              >
                {cLoading ? 'Guardando...' : '🏆 Registrar Ceremonia'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para dejar Mensaje (por url de notificación) */}
      {activeCeremonyForMessage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border dark:border-white/10 w-full max-w-md rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-zinc-100 dark:border-white/5 flex justify-between items-center bg-zinc-50 dark:bg-black/10">
              <h3 className="font-extrabold uppercase text-[1.1em] text-zinc-950 dark:text-white">
                💬 Escribir Mensaje Scout
              </h3>
              <button 
                onClick={handleCloseMessageModal} 
                className="text-zinc-455 hover:text-zinc-650 dark:hover:text-white font-black text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-[0.9em]">
              <p className="font-bold text-zinc-650 dark:text-zinc-350">
                Deja tus palabras para <span className="text-zinc-950 dark:text-white uppercase font-extrabold">{activeCeremonyForMessage.perfil?.nombres} {activeCeremonyForMessage.perfil?.apellidos}</span> en su ceremonia de <span className="text-clr7 font-extrabold uppercase">{activeCeremonyForMessage.nombre_hito}</span>:
              </p>
              <textarea
                value={farewellMessageText}
                onChange={(e) => setFarewellMessageText(e.target.value)}
                placeholder="Escribe tus mejores deseos, anécdotas o felicitaciones aquí..."
                rows={4}
                className="w-full bg-zinc-50 dark:bg-black/20 border dark:border-white/10 p-3 rounded-xl font-bold text-zinc-805 dark:text-white placeholder-zinc-450"
              />
            </div>

            <div className="p-4 border-t border-zinc-100 dark:border-white/5 flex gap-3 bg-zinc-50/50 dark:bg-black/10 shrink-0">
              <button 
                type="button"
                onClick={handleCloseMessageModal}
                className="flex-1 py-3 text-[0.8em] font-black uppercase tracking-wider text-zinc-450 hover:text-red-500 transition-all"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={handleSaveCeremonyMessage}
                disabled={!farewellMessageText.trim()}
                className="flex-[2] py-3 bg-clr7 text-white text-[0.8em] font-black uppercase rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all tracking-wider disabled:opacity-50 cursor-pointer"
              >
                🚀 Enviar Mensaje
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Informe de Paso (Transition report) */}
      {viewingReportCeremony && (
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
                onClick={() => setViewingReportCeremony(null)} 
                className="text-zinc-450 hover:text-zinc-650 dark:hover:text-white font-black text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-[0.9em]">
              <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-850 dark:text-indigo-400 font-bold uppercase text-[0.8em] flex justify-between">
                <span>Unidad de Origen: {viewingReportCeremony.unidad_origen?.nombre || 'Origen'}</span>
                <span>➡️</span>
                <span>Unidad de Destino: {viewingReportCeremony.unidad_destino?.nombre || 'Destino'}</span>
              </div>

              {/* Radar snapshot briefing */}
              <div>
                <h4 className="font-extrabold uppercase text-zinc-450 border-b pb-2 mb-3">📊 Nivel de Desarrollo Alcanzado</h4>
                {viewingReportCeremony.radar_snapshot && Array.isArray(viewingReportCeremony.radar_snapshot) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {viewingReportCeremony.radar_snapshot.map((item: any) => {
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
                  const achieved = reportObjectives.filter(obj => {
                    const av = reportAvances.find(a => a.objetivo_id === obj.id);
                    return av && (av.valor_dirigente >= 6 || av.estado === 'logrado');
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
                onClick={() => setViewingReportCeremony(null)} 
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
        isOpen={showSignatureModal}
        onClose={() => { setShowSignatureModal(false); setSigModalType(null); }}
        title={sigModalType === 'monitor' ? '✍️ Firma del Monitor' : '✍️ Firma del Dirigente'}
        description={sigModalType === 'monitor' 
          ? 'Dibuja tu firma a continuación para autorizar la aprobación técnica de esta especialidad.' 
          : 'Dibuja tu firma a continuación para confirmar la finalización y agendamiento de esta especialidad.'}
        onConfirm={async (signature) => {
          const targetId = sigModalTargetId;
          // Cerrar modal
          setShowSignatureModal(false);
          setSigModalType(null);
          
          // Ejecutar la acción respectiva
          if (sigModalType === 'monitor') {
            await handleMonitorApproveSpecialty(targetId, signature);
          } else {
            const ep = especialidadesPersonales.find((item: any) => item.id === targetId);
            if (ep) {
              await handleFinalizeSpecialty(ep, signature);
            }
          }
        }}
      />

      {loading ? (
        <div className="p-10 text-center opacity-50 uppercase tracking-widest text-[0.8em]">Cargando Progresión Personal...</div>
      ) : [1, 2, 3].includes(perfil.rol_id) ? (
        renderEspecialidadesSectionOnlyTutorias()
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
}
