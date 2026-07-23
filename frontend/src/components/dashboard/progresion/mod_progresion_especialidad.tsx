import React, { useState, useEffect, useRef, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import SignatureCanvas from 'react-signature-canvas'
import { 
  getFieldColor, 
  getFieldBgColor, 
  getFieldTextColor, 
  getFieldLogoPath, 
  getFieldEmoji, 
  getSpecialtyInsigniaPath,
  getFieldLabel
} from '@/lib/progression-utils'
import { generateSpecialtyCertificate } from '@/lib/pdf-service'
import { isDirectivo, isAdmin, getRoleIds } from '@/lib/roles'
import type { Perfil, Articulo } from '@/types'
import { toast } from 'sonner';
import { DebouncedInput, DebouncedTextarea } from './DebouncedInputs'
import DashModActividadCrear from '@/components/dashboard/unidad/mod_unidad_actividad_crear'

interface EspecialidadActividad {
  id: string
  descripcion: string
  detalles?: string | null
  completada: boolean
  fecha_completado?: string | null
  evidencia_texto?: string | null
  evidencia_url?: string | null
  comentario_monitor?: string | null
  fecha_limite?: string | null
  articulo_id?: string | null
  actividad_programada_id?: string | null
  autoevaluacion?: string | null
  articulos?: { id: string; titulo: string; slug: string; estado?: string } | null
  actividades_programadas?: { id: string; nombre: string; fecha_inicio: string; fecha_fin?: string; tipo?: string; lugar?: string; estado?: string } | null
}

interface EspecialidadPersonal {
  id: string
  perfil_id: string
  especialidad_definicion_id?: number | null
  nombre_personalizado?: string | null
  meta_general?: string | null
  monitor_nombre?: string | null
  monitor_perfil_id?: string | null
  fase?: string | null
  estado?: string | null
  campo_interes?: string | null
  evaluacion_final?: string | null
  objetivo_cumplido?: boolean | null
  diagnostico_previo?: string | null
  fecha_entrega?: string | null
  fecha_fin?: string | null
  aprobado_monitor?: boolean | null
  comentario_monitor?: string | null
  firma_dirigente_b64?: string | null
  firma_monitor_b64?: string | null
  updated_at?: string | null
  especialidades_definiciones?: {
    nombre?: string | null
    descripcion?: string | null
    campo_interes?: string | null
    imagen_sugerida_url?: string | null
  } | null
  especialidades_actividades?: EspecialidadActividad[] | null
  perfil?: Pick<Perfil, 'id' | 'nombres' | 'apellidos' | 'unidad_id'> | null
}

interface SpecialtyDetailProps {
  especialidad: EspecialidadPersonal
  userPerfil: Perfil
  perfil: Perfil
  availableMonitors: Perfil[]
  availableActivityArticles: Articulo[]
  onClose: () => void
  onRefreshParent: () => Promise<void>
  onFetchAvailableMonitors?: () => Promise<void>
}

const DashmodProgresionEspecialidadDetalle = React.memo(function DashmodProgresionEspecialidadDetalle({
  especialidad,
  userPerfil,
  perfil,
  availableMonitors,
  availableActivityArticles,
  onClose,
  onRefreshParent,
  onFetchAvailableMonitors
}: SpecialtyDetailProps) {
  const [ep, setEp] = useState<EspecialidadPersonal>(especialidad)

  // Sync local state when prop updates
  useEffect(() => {
    setEp(especialidad)
  }, [especialidad])

  // Local Form States
  const [wMetaGeneral, setWMetaGeneral] = useState('')
  const [wMonitorName, setWMonitorName] = useState('')
  const [wMonitorPerfilId, setWMonitorPerfilId] = useState('')
  const [wIsMonitorInterno, setWIsMonitorInterno] = useState(true)
  const [wMonitorSearchText, setWMonitorSearchText] = useState('')
  const [showMonitorDropdown, setShowMonitorDropdown] = useState(false)
  const [finalSpecEvaluation, setFinalSpecEvaluation] = useState('')
  const [goalChecked, setGoalChecked] = useState(false)
  const [deliveryDate, setDeliveryDate] = useState('')
  const [taskDates, setTaskDates] = useState<Record<string, string>>({})
  const [wDiagnostico, setWDiagnostico] = useState(ep.diagnostico_previo || '')

  // Add Task States
  const [newDetailActText, setNewDetailActText] = useState('')
  const [newDetailActDetalles, setNewDetailActDetalles] = useState('')
  const [wNewActivityFechaLimite, setWNewActivityFechaLimite] = useState('')
  const [wNewActivityFechaActividad, setWNewActivityFechaActividad] = useState('')
  const [wNewActivityRequiresCalendar, setWNewActivityRequiresCalendar] = useState(false)
  const [wNewActivityArticleId, setWNewActivityArticleId] = useState('')
  const [wNewActivityLugar, setWNewActivityLugar] = useState('Local Scout')
  const [newActivityArticleTitle, setNewActivityArticleTitle] = useState('')
  const [activitySearchQuery, setActivitySearchQuery] = useState('')
  const [isModActividadOpen, setIsModActividadOpen] = useState(false)
  const [editingActividad, setEditingActividad] = useState<{ id: string; tipo: string; nombre: string; lugar: string; fecha_inicio: string; fecha_fin: string } | null>(null)

  // Evidence Submit
  const [submittingEvidenceActId, setSubmittingEvidenceActId] = useState<string | null>(null)
  const [actEvidenceText, setActEvidenceText] = useState('')
  const [actEvidenceUrl, setActEvidenceUrl] = useState('')
  const [actAutoevaluacionText, setActAutoevaluacionText] = useState('')

  // Monitor review
  const [reviewingActId, setReviewingActId] = useState<string | null>(null)
  const [actReviewComment, setActReviewComment] = useState('')

  // Feedback states
  const [feedbackComment, setFeedbackComment] = useState('')
  const [showFeedbackInput, setShowFeedbackInput] = useState(false)

  // Signature Pad States
  const [showSignatureModal, setShowSignatureModal] = useState(false)
  const [sigModalType, setSigModalType] = useState<'monitor' | 'leader' | null>(null)
  const [sigModalTargetId, setSigModalTargetId] = useState('')
  const [tempSignature, setTempSignature] = useState<string | null>(null)
  const sigCanvasRef = useRef<SignatureCanvas>(null)

  // Memoized Monitors
  const filteredMonitors = useMemo(() => {
    const query = wMonitorSearchText.toLowerCase()
    return availableMonitors.filter(m => 
      m.id !== perfil.id && `${m.nombres} ${m.apellidos}`.toLowerCase().includes(query)
    )
  }, [wMonitorSearchText, availableMonitors, perfil.id])

  const filteredArticles = useMemo(() => {
    if (!activitySearchQuery.trim()) return availableActivityArticles
    const query = activitySearchQuery.toLowerCase()
    return availableActivityArticles.filter(art =>
      art.titulo.toLowerCase().includes(query)
    )
  }, [activitySearchQuery, availableActivityArticles])

  // Initialize values when opening
  useEffect(() => {
    if (ep) {
      setWMetaGeneral(ep.meta_general || '')
      setWMonitorName(ep.monitor_nombre || '')
      setWMonitorPerfilId(ep.monitor_perfil_id || '')
      setWIsMonitorInterno(!!ep.monitor_perfil_id || !ep.monitor_nombre)
      setWMonitorSearchText(ep.monitor_nombre || '')
      setFinalSpecEvaluation(ep.evaluacion_final || '')
      setGoalChecked(ep.objetivo_cumplido || false)
      setDeliveryDate(ep.fecha_entrega || '')

      const dates: Record<string, string> = {}
      ep.especialidades_actividades?.forEach((act: EspecialidadActividad) => {
        dates[act.id] = act.fecha_limite || ''
      })
      setTaskDates(dates)
    }
  }, [ep.id, ep.especialidades_actividades?.length])

  const refreshLocalSpecialty = async () => {
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
            slug,
            estado
          ),
          actividades_programadas (
            id,
            nombre,
            fecha_inicio,
            fecha_fin,
            tipo,
            lugar,
            estado
          )
        )
      `)
      .eq('id', ep.id)
      .single()
    if (updatedSpec) {
      setEp(updatedSpec)
    }
    await onRefreshParent()
  }

  const isSpecOwner = userPerfil.id === ep.perfil_id
  const isLeader = isDirectivo(userPerfil) && (isAdmin(userPerfil) || userPerfil.unidad_id === (ep.perfil?.unidad_id || perfil.unidad_id))
  const isMonitor = userPerfil.id === ep.monitor_perfil_id || (!ep.monitor_perfil_id && isLeader)

  const color = getFieldColor(ep.campo_interes || '')
  const emoji = getFieldEmoji(ep.campo_interes || '')
  const name = ep.nombre_personalizado || ep.especialidades_definiciones?.nombre || 'Especialidad'
  const acts = ep.especialidades_actividades || []
  const completedCount = acts.filter((a: EspecialidadActividad) => a.completada).length
  const totalCount = acts.length
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const getPhaseBadge = (fase: string) => {
    switch (fase) {
      case 'exploracion': return 'Exploración 🔍'
      case 'planificacion': return 'Planificación 📋'
      case 'desarrollo': return 'Desarrollo 🛠️'
      case 'reconocimiento': return 'Reconocimiento 🎖️'
      default: return fase
    }
  }

  // --- Handlers ---
  const handleSaveExploracionChanges = async () => {
    if (!wDiagnostico.trim()) {
      toast.warning('Por favor escribe tu exploración.')
      return
    }
    const { error } = await supabase
      .from('especialidades_personales')
      .update({ diagnostico_previo: wDiagnostico.trim(), updated_at: new Date().toISOString() })
      .eq('id', ep.id)
    if (error) {
      toast.error('Error al guardar: ' + error.message)
    } else {
      toast.success('Exploración guardada con éxito.')
      await refreshLocalSpecialty()
    }
  }

  const handleStartDevelopment = async () => {
    if (!wMetaGeneral.trim()) {
      toast.warning('Por favor ingresa una meta general.')
      return
    }
    if (!wMonitorName.trim()) {
      toast.warning('Por favor selecciona o escribe un monitor/acompañante.')
      return
    }
    if (acts.length === 0) {
      toast.warning('Por favor agrega al menos una tarea a realizar en tu planificación.')
      return
    }

    const missingDates = acts.some((a: EspecialidadActividad) => !taskDates[a.id])
    if (missingDates) {
      toast.warning('Por favor establece una fecha límite para todas las tareas planificadas.')
      return
    }

    try {
      const { error } = await supabase
        .from('especialidades_personales')
        .update({
          meta_general: wMetaGeneral,
          monitor_nombre: wMonitorName,
          monitor_perfil_id: wMonitorPerfilId || null,
          fase: 'desarrollo',
          updated_at: new Date().toISOString()
        })
        .eq('id', ep.id)

      if (error) throw error

      const promises = Object.entries(taskDates).map(([actId, dateVal]) => {
        return supabase
          .from('especialidades_actividades')
          .update({ fecha_limite: dateVal ? dateVal : null })
          .eq('id', actId)
      })
      await Promise.all(promises)

      if (wMonitorPerfilId) {
        await supabase.from('notificaciones').insert([{
          perfil_id: wMonitorPerfilId,
          mensaje: `${perfil.nombres} ha iniciado el desarrollo de su especialidad "${name}".`,
          tipo: 'especialidad',
          link_url: '/panel'
        }])
      }

      toast.success('¡Planificación guardada e inicio de Desarrollo exitoso! A trabajar en tus tareas.')
      await refreshLocalSpecialty()
    } catch (err: unknown) {
      console.error(err)
      toast.error('Error al iniciar desarrollo: ' + (err instanceof Error ? err.message : String(err)))
    }
  }

  const handleUpdateSpecialtyInfo = async () => {
    if (!wMetaGeneral.trim()) {
      toast.warning('Por favor ingresa una meta general.')
      return
    }
    if (!wMonitorName.trim()) {
      toast.warning('Por favor selecciona o escribe un monitor/acompañante.')
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
      .eq('id', ep.id)

    if (error) {
      toast.error('Error al actualizar especialidad: ' + error.message)
    } else {
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

      if (wMonitorPerfilId) {
        await supabase.from('notificaciones').insert([{
          perfil_id: wMonitorPerfilId,
          mensaje: `${perfil.nombres} ha completado la planificación de la especialidad "${name}". Revisa para aprobar su planificación e iniciar desarrollo.`,
          tipo: 'especialidad',
          link_url: '/panel'
        }])
      }

      toast.success('Información de especialidad guardada.')
      await refreshLocalSpecialty()
    }
  }

  const handlePauseSpecialty = async () => {
    const isConfirm = window.confirm('¿Estás seguro de que deseas pausar esta especialidad? Las fechas de las tareas planificadas se reiniciarán.')
    if (!isConfirm) return

    const { error } = await supabase
      .from('especialidades_personales')
      .update({
        estado: 'pausado',
        updated_at: new Date().toISOString()
      })
      .eq('id', ep.id)

    if (error) {
      toast.error('Error al pausar especialidad: ' + error.message)
      return
    }

    const { error: actErr } = await supabase
      .from('especialidades_actividades')
      .update({
        fecha_limite: null
      })
      .eq('especialidad_personal_id', ep.id)

    if (actErr) {
      console.error('Error al borrar fechas de actividades:', actErr)
    }

    toast.success('Especialidad pausada y fechas de tareas reiniciadas.')
    await refreshLocalSpecialty()
  }

  const handleResumeSpecialty = async () => {
    const { error } = await supabase
      .from('especialidades_personales')
      .update({
        fase: 'planificacion',
        estado: 'activo',
        updated_at: new Date().toISOString()
      })
      .eq('id', ep.id)

    if (error) {
      toast.error('Error al retomar especialidad: ' + error.message)
    } else {
      toast.success('La especialidad se ha retomado en fase de Planificación.')
      await refreshLocalSpecialty()
    }
  }

  const handleAdvanceSpecialtyPhase = async (nextPhase: string) => {
    const { error } = await supabase
      .from('especialidades_personales')
      .update({ fase: nextPhase, updated_at: new Date().toISOString() })
      .eq('id', ep.id)
    
    if (error) {
      toast.error('Error al actualizar fase: ' + error.message)
    } else {
      toast.info(`Especialidad avanzada a la fase de ${nextPhase === 'planificacion' ? 'Planificación' : nextPhase === 'desarrollo' ? 'Desarrollo' : 'Evaluación y Reconocimiento'}.`)
      await refreshLocalSpecialty()
    }
  }

  const handleSubmitActivityEvidence = async (actId: string) => {
    if (!actEvidenceText.trim()) {
      toast.warning('Por favor describe la evidencia de lo realizado.')
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

      if (ep.monitor_perfil_id) {
        await supabase.from('notificaciones').insert([{
          perfil_id: ep.monitor_perfil_id,
          mensaje: `${perfil.nombres} ha entregado evidencia para la tarea "${ep.especialidades_actividades?.find((a: EspecialidadActividad) => a.id === actId)?.descripcion || 'de especialidad'}" de "${name}". Revisa para validar.`,
          tipo: 'especialidad',
          link_url: '/panel'
        }])
      }

      toast.success('Evidencia y autoevaluación registradas con éxito. Se ha notificado a tu monitor.')
      setSubmittingEvidenceActId(null)
      setActEvidenceText('')
      setActEvidenceUrl('')
      setActAutoevaluacionText('')
      
      await refreshLocalSpecialty()
    } catch (err: unknown) {
      console.error(err)
      toast.error('Error al registrar evidencia: ' + (err instanceof Error ? err.message : String(err)))
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
      toast.error('Error al aprobar tarea: ' + error.message)
    } else {
      const actDesc = ep.especialidades_actividades?.find((a: EspecialidadActividad) => a.id === actId)?.descripcion || 'Tarea'
      
      await supabase.from('notificaciones').insert([{
        perfil_id: ep.perfil_id,
        mensaje: `Tu monitor ha aprobado la tarea "${actDesc}" de tu especialidad "${name}".`,
        tipo: 'especialidad',
        link_url: '/panel'
      }])

      toast.success('Tarea aprobada con éxito.')
      await refreshLocalSpecialty()
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
      toast.error('Error al guardar comentario: ' + error.message)
    } else {
      const actDesc = ep.especialidades_actividades?.find((a: EspecialidadActividad) => a.id === actId)?.descripcion || 'Tarea'
      
      await supabase.from('notificaciones').insert([{
        perfil_id: ep.perfil_id,
        mensaje: `Tu monitor ha dejado una corrección/comentario en la tarea "${actDesc}" de tu especialidad "${name}": "${actReviewComment.slice(0, 60)}${actReviewComment.length > 60 ? '...' : ''}"`,
        tipo: 'especialidad',
        link_url: '/panel'
      }])

      setReviewingActId(null)
      setActReviewComment('')
      await refreshLocalSpecialty()
    }
  }

  const handleAddActivityToExisting = async () => {
    if (!newDetailActText.trim()) {
      toast.warning('Por favor ingresa un título para la tarea.')
      return
    }

    try {
      let finalArtId: string | null = null
      let finalActProgId: string | null = null

      if (wNewActivityRequiresCalendar) {
        if (!wNewActivityFechaActividad) {
          toast.warning('Por favor selecciona la fecha de la actividad con la unidad.')
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
              estado: 'borrador'
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

        const specName = ep.nombre_personalizado || ep.especialidades_definiciones?.nombre || 'Especialidad'

        const { data: newActProg, error: actProgErr } = await supabase
          .from('actividades_programadas')
          .insert([{
            tipo: 'Especialidad',
            nombre: newDetailActText.trim(),
            lugar: wNewActivityLugar || 'Local Scout',
            fecha_inicio: wNewActivityFechaActividad,
            fecha_fin: wNewActivityFechaActividad,
            unidad_id: perfil.unidad_id,
            creado_por: userPerfil.id,
            estado: 'borrador'
          }])
          .select()
          .single()

        if (actProgErr) throw actProgErr
        finalActProgId = newActProg.id

        if (ep.monitor_perfil_id) {
          await supabase.from('notificaciones').insert({
            perfil_id: ep.monitor_perfil_id,
            mensaje: `Se ha creado un borrador de actividad "${newDetailActText.trim()}" vinculado a la especialidad "${specName}". Revisa y publica cuando esté listo.`,
            tipo: 'especialidad',
            link_url: '/panel'
          })
        }

        const { data: admins } = await supabase
          .from('perfiles')
          .select('id')
          .eq('rol_id', 1)

        if (admins?.length) {
          await supabase.from('notificaciones').insert(
            admins.map(a => ({
              perfil_id: a.id,
              mensaje: `Nuevo borrador de actividad "${newDetailActText.trim()}" creado por ${userPerfil.nombres} ${userPerfil.apellidos}. Revisa para publicar.`,
              tipo: 'especialidad',
              link_url: '/panel'
            }))
          )
        }
      }

      const { data: newAct, error: insertErr } = await supabase
        .from('especialidades_actividades')
        .insert([{
          especialidad_personal_id: ep.id,
          descripcion: newDetailActText.trim(),
          detalles: newDetailActDetalles.trim(),
          fecha_limite: wNewActivityFechaLimite ? wNewActivityFechaLimite : null,
          articulo_id: finalArtId,
          actividad_programada_id: finalActProgId,
          completada: false
        }])
        .select('id')
        .single()

      if (insertErr) throw insertErr

      // Sync taskDates with the new activity so the date picker shows correctly
      if (newAct && wNewActivityFechaLimite) {
        setTaskDates(prev => ({ ...prev, [newAct.id]: wNewActivityFechaLimite }))
      }

      toast.success('Tarea agregada con éxito.')
      
      setNewDetailActText('')
      setNewDetailActDetalles('')
      setWNewActivityFechaLimite('')
      setWNewActivityFechaActividad('')
      setWNewActivityRequiresCalendar(false)
      setWNewActivityArticleId('')
      setWNewActivityLugar('Local Scout')
      setNewActivityArticleTitle('')

      await refreshLocalSpecialty()
    } catch (err: unknown) {
      console.error(err)
      toast.error('Error al agregar tarea: ' + (err instanceof Error ? err.message : String(err)))
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
      toast.error('Error al eliminar actividad: ' + error.message)
    } else {
      await refreshLocalSpecialty()
    }
  }

  const handleDeleteSpecialty = async () => {
    const isConfirm = window.confirm('¿Estás seguro de que deseas eliminar esta especialidad? Esta acción no se puede deshacer.')
    if (!isConfirm) return

    const { error } = await supabase
      .from('especialidades_personales')
      .delete()
      .eq('id', ep.id)

    if (error) {
      toast.error('Error al eliminar: ' + error.message)
    } else {
      onClose()
      await onRefreshParent()
    }
  }

  const handleFinalizeSpecialty = async (signatureB64?: string) => {
    if (!deliveryDate) {
      toast.warning('Por favor selecciona una fecha de entrega para la insignia.')
      return
    }

    if (!signatureB64) {
      setSigModalType('leader');
      setSigModalTargetId(ep.id);
      setTempSignature(null);
      setShowSignatureModal(true);
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0]
      
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

      const hitoName = `${getFieldLabel(ep.campo_interes || '')} - ${name}`
      
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

      await supabase.from('notificaciones').insert([{
        perfil_id: ep.perfil_id,
        mensaje: `¡Felicitaciones! Tu insignia de la especialidad "${name}" será entregada en el próximo campamento o salida el ${deliveryDate}.`,
        tipo: 'especialidad',
        link_url: '/panel'
      }])

      toast.success('¡Especialidad aprobada y entrega agendada con éxito!')

      const certData = {
        fase: 'reconocimiento', 
        estado: 'completado', 
        fecha_fin: today, 
        fecha_entrega: deliveryDate,
        firma_dirigente_b64: signatureB64,
        especialidades_definiciones: ep.especialidades_definiciones ? { nombre: ep.especialidades_definiciones.nombre ?? '' } : undefined,
        nombre_personalizado: ep.nombre_personalizado ?? undefined,
        campo_interes: ep.campo_interes ?? undefined,
        firma_monitor_b64: ep.firma_monitor_b64 ?? undefined
      }
      await generateSpecialtyCertificate(ep.perfil || perfil, certData)

      await refreshLocalSpecialty()
      onClose()
    } catch (err: unknown) {
      console.error(err)
      toast.error('Error al finalizar especialidad: ' + (err instanceof Error ? err.message : String(err)))
    }
  }

  const handleMonitorApproveSpecialty = async (signatureB64?: string) => {
    if (!signatureB64) {
      setSigModalType('monitor');
      setSigModalTargetId(ep.id);
      setTempSignature(null);
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
        .eq('id', ep.id)

      if (error) throw error
      
      await supabase.from('notificaciones').insert([{
        perfil_id: ep.perfil_id,
        mensaje: `¡Tu monitor ha aprobado tu especialidad "${name}"! Esperando que los dirigentes agenden la fecha de entrega de tu insignia.`,
        tipo: 'especialidad',
        link_url: '/panel'
      }])

      const targetUnitId = ep.perfil?.unidad_id || perfil.unidad_id
      const { data: leaders } = await supabase
        .from('perfiles')
        .select('id')
        .in('rol_id', getRoleIds('directivos'))
        .eq('unidad_id', targetUnitId)

      if (leaders && leaders.length > 0) {
        const notifPromises = leaders.map(leader => {
          return supabase.from('notificaciones').insert([{
            perfil_id: leader.id,
            mensaje: `El monitor de ${ep.perfil?.nombres || 'un miembro'} ha aprobado su especialidad "${name}". Agenda la fecha de entrega de la insignia.`,
            tipo: 'especialidad',
            link_url: '/panel'
          }])
        })
        await Promise.all(notifPromises)
      }

      toast.success('Especialidad aprobada por monitor con éxito.')
      await refreshLocalSpecialty()
    } catch (err: unknown) {
      console.error(err)
      toast.error('Error al aprobar especialidad: ' + (err instanceof Error ? err.message : String(err)))
    }
  }

  const handleMonitorFeedbackSpecialty = async () => {
    if (!feedbackComment.trim()) {
      toast.warning('Por favor escribe un comentario de retroalimentación.')
      return
    }

    try {
      const { error } = await supabase
        .from('especialidades_personales')
        .update({
          fase: 'desarrollo',
          aprobado_monitor: false,
          comentario_monitor: feedbackComment.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', ep.id)

      if (error) throw error

      await supabase.from('notificaciones').insert([{
        perfil_id: ep.perfil_id,
        mensaje: `Tu monitor ha dejado comentarios de mejora en tu especialidad "${name}": "${feedbackComment}". La especialidad ha retornado a fase de Desarrollo.`,
        tipo: 'especialidad',
        link_url: '/panel'
      }])

      toast.success('Comentarios enviados. La especialidad ha retornado a Desarrollo.')
      setFeedbackComment('')
      setShowFeedbackInput(false)
      await refreshLocalSpecialty()
    } catch (err: unknown) {
      console.error(err)
      toast.error('Error al enviar retroalimentación: ' + (err instanceof Error ? err.message : String(err)))
    }
  }

  const handleRequestRecognition = async () => {
    if (!finalSpecEvaluation.trim()) {
      toast.warning('Por favor ingresa tu evaluación final de la especialidad.')
      return
    }
    if (!goalChecked) {
      toast.warning('Por favor confirma que has cumplido tu objetivo general.')
      return
    }

    try {
      const { error } = await supabase
        .from('especialidades_personales')
        .update({
          evaluacion_final: finalSpecEvaluation.trim(),
          objetivo_cumplido: true,
          fase: 'reconocimiento',
          updated_at: new Date().toISOString()
        })
        .eq('id', ep.id)

      if (error) throw error

      if (ep.monitor_perfil_id) {
        await supabase.from('notificaciones').insert([{
          perfil_id: ep.monitor_perfil_id,
          mensaje: `${perfil.nombres} ha completado su evaluación final y solicitado el reconocimiento para la especialidad "${name}". Revisa para validar.`,
          tipo: 'especialidad',
          link_url: '/panel'
        }])
      }

      toast.success('Evaluación guardada y reconocimiento solicitado con éxito.')
      await refreshLocalSpecialty()
    } catch (err: unknown) {
      console.error(err)
      toast.error('Error al solicitar reconocimiento: ' + (err instanceof Error ? err.message : String(err)))
    }
  }

  const handleApproveSpecialtyPlanning = async () => {
    const isConfirm = window.confirm('¿Deseas aprobar la planificación de esta especialidad e iniciar la fase de desarrollo?')
    if (!isConfirm) return

    const { error } = await supabase
      .from('especialidades_personales')
      .update({
        fase: 'desarrollo',
        updated_at: new Date().toISOString()
      })
      .eq('id', ep.id)

    if (error) {
      toast.error('Error al aprobar planificación: ' + error.message)
    } else {
      toast.success('Planificación aprobada. La especialidad ahora se encuentra en fase de Desarrollo.')
      await refreshLocalSpecialty()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[140] flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-l-[1rem] p-2 shadow-2xl border-2 space-y-6 max-h-[90vh] overflow-y-auto"
        style={{ borderColor: color }}
      >
        
        {/* Header */}
        <div className="flex flex-col items-center md:flex-row gap-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
          <div className="relative shrink-0">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center border-4 border-white dark:border-zinc-800 shadow-md relative"
              style={{ backgroundColor: `${color}15` }}
            >
              <img 
                src={getFieldLogoPath(ep.campo_interes || '')} 
                alt="" 
                className="w-12 h-12 object-contain"
                loading="lazy"
                decoding="async"
              />
              <span className="absolute -bottom-2 -right-2 text-[1.4em] drop-shadow-md">{emoji}</span>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-2 items-center">
              <span className="px-3 py-0.5 rounded-full text-[0.75em] font-extrabold uppercase text-white tracking-wider" style={{ backgroundColor: color }}>
                {getFieldLabel(ep.campo_interes || '')}
              </span>
              <span className="px-3 py-0.5 rounded-full text-[0.75em] font-extrabold uppercase bg-zinc-100 dark:bg-zinc-850 text-zinc-700 dark:text-zinc-350 tracking-wider">
                {getPhaseBadge(ep.fase || '')}
              </span>
              {ep.estado === 'pausado' && (
                <span className="px-3 py-1 rounded-full text-[0.8em] font-extrabold uppercase text-amber-500 bg-amber-100/50 dark:bg-amber-900/20 border border-amber-300">
                  Pausada ⏸️
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold uppercase tracking-tight text-zinc-900 dark:text-white">
              {name}
            </h3>
            {!isSpecOwner && ep.perfil && (
              <p className="text-[0.9em] font-semibold text-zinc-550 dark:text-zinc-400">
                Especialista: {ep.perfil.nombres} {ep.perfil.apellidos}
              </p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300 text-2xl font-bold p-1 self-start md:self-auto"
          >
            ✕
          </button>
        </div>

        {/* Details body */}
        <div className="space-y-6">

          {/* FASE 1: EXPLORACION */}
          {ep.fase === 'exploracion' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[0.8em] font-extrabold uppercase tracking-wider text-zinc-400 block ml-1">
                  Mi Exploración de la Especialidad
                </label>
                {isSpecOwner && ep.estado === 'activo' ? (
                  <div className="space-y-3">
                    <DebouncedTextarea
                      value={wDiagnostico}
                      onChange={val => setWDiagnostico(val)}
                      placeholder="Explica qué significa para ti esta especialidad, en qué consiste, por qué te gusta y si ya tienes algún conocimiento previo..."
                      className="w-full p-4 rounded-2xl border border-zinc-300 dark:border-white/10 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-[1em] font-medium h-40"
                    />
                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={handleSaveExploracionChanges}
                        className="px-4 py-2 text-[0.85em] font-bold uppercase text-white bg-zinc-600 rounded-xl"
                      >
                        Guardar Cambios 📂
                      </button>
                      <button
                        onClick={() => handleAdvanceSpecialtyPhase('planificacion')}
                        className="px-5 py-2 text-[0.85em] font-bold uppercase text-white rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all"
                        style={{ backgroundColor: color }}
                      >
                        Avanzar a la Planificación 🚀
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-150 dark:border-white/5 text-[1em] text-zinc-700 dark:text-zinc-350 italic">
                    "{ep.diagnostico_previo || 'Sin exploración registrada'}"
                  </p>
                )}
              </div>

              {!isSpecOwner && (
                <p className="text-[0.9em] font-bold text-zinc-450 italic">
                  Esta especialidad está en fase de Exploración. El participante aún no ha iniciado su planificación.
                </p>
              )}
            </div>
          )}

          {/* FASE 2: PLANIFICACION */}
          {ep.fase === 'planificacion' && (
            <div className="space-y-6">
              {isSpecOwner && ep.estado === 'activo' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-[1em] font-bold uppercase tracking-wider text-zinc-400 block ml-1">Mi Meta General (¿Qué quiero lograr?)</label>
                    <DebouncedTextarea 
                      value={wMetaGeneral}
                      onChange={val => setWMetaGeneral(val)}
                      placeholder="Describe de forma general el objetivo de tu especialidad..."
                      className="w-full p-4 rounded-2xl border border-zinc-300 dark:border-white/10 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-[1em] font-medium h-24"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[0.8em] font-extrabold uppercase tracking-wider text-zinc-400 block ml-1">
                      Monitor / Acompañante (Persona experta que te guiará)
                    </label>

                    <div className="flex gap-4 mb-2">
                      <label className="flex items-center gap-2 text-[0.85em] font-bold cursor-pointer text-zinc-700 dark:text-zinc-300">
                        <input 
                          type="radio" 
                          name="monitorType" 
                          checked={wIsMonitorInterno} 
                          onChange={() => {
                            setWIsMonitorInterno(true);
                            setWMonitorPerfilId('');
                            setWMonitorName('');
                            setWMonitorSearchText('');
                          }} 
                        />
                        Miembro del Grupo 📱
                      </label>
                      <label className="flex items-center gap-2 text-[0.85em] font-bold cursor-pointer text-zinc-700 dark:text-zinc-300">
                        <input 
                          type="radio" 
                          name="monitorType" 
                          checked={!wIsMonitorInterno} 
                          onChange={() => {
                            setWIsMonitorInterno(false);
                            setWMonitorPerfilId('');
                            setWMonitorName('');
                            setWMonitorSearchText('');
                          }} 
                        />
                        Persona Externa 👤
                      </label>
                    </div>

                    {wIsMonitorInterno ? (
                      <div className="relative">
                        <DebouncedInput 
                          type="text"
                          value={wMonitorSearchText}
                          onChange={val => {
                            setWMonitorSearchText(val);
                            setShowMonitorDropdown(true);
                            onFetchAvailableMonitors?.();
                            if (!val) {
                              setWMonitorPerfilId('');
                              setWMonitorName('');
                            }
                          }}
                          onFocus={() => {
                            setShowMonitorDropdown(true);
                            onFetchAvailableMonitors?.();
                          }}
                          placeholder="Escribe el nombre del monitor para buscar..."
                          className="w-full p-4 rounded-2xl border border-zinc-300 dark:border-white/10 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-[1em] font-medium"
                        />
                        {wMonitorPerfilId && (
                          <span className="absolute right-12 top-1/2 -translate-y-1/2 text-green-500 text-sm font-bold">
                            ✓ Seleccionado
                          </span>
                        )}
                        {wMonitorSearchText && (
                          <button
                            type="button"
                            onClick={() => {
                              setWMonitorSearchText('');
                              setWMonitorPerfilId('');
                              setWMonitorName('');
                              setShowMonitorDropdown(false);
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300 font-bold"
                          >
                            ✕
                          </button>
                        )}
                        
                        {showMonitorDropdown && (
                          <>
                            <div 
                              className="fixed inset-0 z-[155]" 
                              onClick={() => setShowMonitorDropdown(false)} 
                            />
                            <div className="absolute z-[160] left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white dark:bg-zinc-900 border-2 border-zinc-150 dark:border-white/10 rounded-2xl shadow-xl divide-y divide-zinc-100 dark:divide-zinc-800">
                              {filteredMonitors
                                .map(m => (
                                  <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => {
                                      setWMonitorPerfilId(m.id);
                                      setWMonitorName(`${m.nombres} ${m.apellidos}`);
                                      setWMonitorSearchText(`${m.nombres} ${m.apellidos}`);
                                      setShowMonitorDropdown(false);
                                    }}
                                    className="w-full text-left px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-[0.9em] font-bold text-zinc-800 dark:text-zinc-200"
                                  >
                                    {m.nombres} {m.apellidos}
                                  </button>
                                ))
                              }
                              {filteredMonitors.length === 0 && (
                                <p className="px-4 py-3 text-zinc-450 italic text-[0.9em]">No se encontraron perfiles...</p>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <DebouncedInput 
                        type="text"
                        value={wMonitorName}
                        onChange={val => setWMonitorName(val)}
                        placeholder="Ej: Juan Pérez (Profesor de Música / Tío / Experto)"
                        className="w-full p-4 rounded-2xl border border-zinc-300 dark:border-white/10 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-[1em] font-medium"
                      />
                    )}
                  </div>
                </>
              ) : (
                <div className="p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-800/40 border space-y-3 text-[0.95em]">
                  <p className="text-zinc-700 dark:text-zinc-300"><span className="font-extrabold text-zinc-400 block uppercase text-[0.8em]">Meta General</span>{ep.meta_general || 'Ninguna meta descrita'}</p>
                  <p className="text-zinc-700 dark:text-zinc-300"><span className="font-extrabold text-zinc-400 block uppercase text-[0.8em]">Monitor Acompañante</span>{ep.monitor_nombre || 'No asignado'}</p>
                </div>
              )}

              {/* TAREAS PLANIFICADAS */}
              <div className="space-y-4">
                <span className="text-[0.8em] font-extrabold uppercase tracking-wider text-zinc-400 block ml-1">Tareas en conjunto</span>
                
                <div className="space-y-3">
                  {acts.map((act: EspecialidadActividad) => (
                    <div 
                      key={act.id} 
                      className="p-4 rounded-2xl border border-zinc-150 dark:border-clr1/10 bg-white dark:bg-dclr1 flex justify-between items-center"
                    >
                      <div className="space-y-1">
                        <p className="font-bold text-zinc-900 dark:text-white text-[0.95em]">{act.descripcion}</p>
                        {act.detalles && <p className="text-zinc-500 dark:text-zinc-400 text-[0.85em] font-medium">{act.detalles}</p>}
                        
                        {/* Task date selector */}
                        {isSpecOwner && ep.estado === 'activo' ? (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[0.75em] font-extrabold uppercase text-zinc-400">Fecha límite:</span>
                            <input 
                              type="date"
                              value={taskDates[act.id] || ''}
                              onChange={e => setTaskDates(prev => ({ ...prev, [act.id]: e.target.value }))}
                              className="p-1 px-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-[0.85em] text-zinc-800 dark:text-zinc-200 font-bold"
                            />
                          </div>
                        ) : (
                          act.fecha_limite && (
                            <span className="inline-block px-2.5 py-0.5 mt-1 rounded bg-red-100 dark:bg-red-950/20 text-red-650 text-[0.8em] font-extrabold">
                              Límite: {new Date(act.fecha_limite + 'T00:00:00').toLocaleDateString('es-CL')}
                            </span>
                          )
                        )}

                        {/* Calendar activity & article detail rendering */}
                        {act.actividades_programadas && (
                          <div className="mt-1 flex items-center gap-1.5 text-[0.8em] font-semibold text-blue-500">
                            <span>📅 Actividad: {act.actividades_programadas.nombre}</span>
                            <span className="opacity-75">({new Date(act.actividades_programadas.fecha_inicio + 'T00:00:00').toLocaleDateString('es-CL')})</span>
                          </div>
                        )}
                        {act.articulos && (
                          <div className="mt-0.5 flex items-center gap-1.5 text-[0.8em] font-semibold text-teal-600 dark:text-teal-400">
                            <span>📰 Artículo:</span>
                            <a 
                              href={`/blog/actividades/${act.articulos.slug}`} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="underline hover:text-teal-800"
                            >
                              {act.articulos.titulo}
                            </a>
                          </div>
                        )}
                      </div>

                      {isSpecOwner && ep.estado === 'activo' && (
                        <button
                          onClick={() => handleDeleteActivity(act.id)}
                          className="text-red-500 hover:text-red-700 font-bold p-1 text-[0.9em]"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  {acts.length === 0 && (
                    <p className="text-center py-6 text-zinc-400 font-bold italic text-[0.85em]">Aún no has agregado ninguna tarea.</p>
                  )}
                </div>

                {/* Add task form */}
                {isSpecOwner && ep.estado === 'activo' && (
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-150 dark:border-white/5 space-y-4">
                    <span className="text-[0.8em] font-extrabold uppercase tracking-wider text-zinc-550 block">Agregar Tarea Planificada</span>
                    <div className="space-y-1">
                      <label className="text-[0.8em] font-bold uppercase tracking-wider text-zinc-400">Título / Nombre</label>
                      <DebouncedInput 
                        type="text"
                        value={newDetailActText}
                        onChange={val => setNewDetailActText(val)}
                        placeholder="Ej: Hacer un herbario..."
                        className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-[1em] font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[0.8em] font-bold uppercase tracking-wider text-zinc-400">Especificaciones / Detalles</label>
                      <DebouncedTextarea 
                        value={newDetailActDetalles}
                        onChange={val => setNewDetailActDetalles(val)}
                        placeholder="Ej: Buscar 10 tipos de hojas..."
                        className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-[1em] font-medium h-16"
                      />
                    </div>

                    {/* Fecha de Cumplimiento */}
                    <div className="space-y-1">
                      <label className="text-[0.8em] font-bold uppercase tracking-wider text-zinc-400">Fecha de Cumplimiento (Límite)</label>
                      <input 
                        type="date"
                        value={wNewActivityFechaLimite}
                        onChange={e => setWNewActivityFechaLimite(e.target.value)}
                        className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-[1em] font-medium"
                      />
                    </div>

                    {/* Calendar Event & Article integration */}
                    <div className="p-3 bg-white dark:bg-zinc-900 border rounded-xl space-y-3">
                      <label className="flex items-center gap-2 text-[0.85em] font-bold text-zinc-700 dark:text-zinc-350 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={wNewActivityRequiresCalendar}
                          onChange={e => setWNewActivityRequiresCalendar(e.target.checked)}
                        />
                        ¿Esta tarea involucra una actividad con la unidad? (Agendar al Calendario)
                      </label>

                      {wNewActivityRequiresCalendar && (
                        <div className="pl-6 space-y-3 border-l-2 border-blue-500 animate-in slide-in-from-top-1">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[0.8em] font-bold uppercase text-zinc-400">Fecha de la Actividad</label>
                              <input 
                                type="date"
                                value={wNewActivityFechaActividad}
                                onChange={e => setWNewActivityFechaActividad(e.target.value)}
                                className="w-full p-2 border rounded-lg bg-zinc-50 dark:bg-zinc-900 text-sm font-semibold"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[0.8em] font-bold uppercase text-zinc-400">Lugar</label>
                              <input 
                                type="text"
                                value={wNewActivityLugar}
                                onChange={e => setWNewActivityLugar(e.target.value)}
                                className="w-full p-2 border rounded-lg bg-zinc-50 dark:bg-zinc-900 text-sm font-semibold"
                              />
                            </div>
                          </div>

                          <div className="p-3 bg-zinc-50 dark:bg-zinc-850/50 rounded-xl space-y-2 border">
                            <span className="text-[0.75em] font-black uppercase text-zinc-400 tracking-wider">Artículo del Blog Asociado</span>
                            <div className="space-y-2">
                              <div className="space-y-1">
                                <label className="text-[0.75em] font-bold text-zinc-500 block">Opción A: Crear Nuevo Artículo de Ficha Técnica</label>
                                <input 
                                  type="text"
                                  value={newActivityArticleTitle}
                                  onChange={e => {
                                    setNewActivityArticleTitle(e.target.value);
                                    if (e.target.value) setWNewActivityArticleId('');
                                  }}
                                  placeholder="Ej: Ficha de herbario scout"
                                  className="w-full p-2 border rounded-lg bg-white dark:bg-zinc-900 text-sm font-semibold"
                                />
                              </div>
                              
                              <div className="space-y-1">
                                <label className="text-[0.75em] font-bold text-zinc-500 block">Opción B: Vincular con Ficha/Artículo Existente</label>
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    placeholder="Buscar actividad por título..."
                                    value={activitySearchQuery}
                                    onChange={(e) => {
                                      setActivitySearchQuery(e.target.value)
                                      if (e.target.value) setWNewActivityArticleId('')
                                    }}
                                    className="w-full p-2 border rounded-lg bg-white dark:bg-zinc-900 text-sm font-semibold"
                                  />
                                  {activitySearchQuery && (
                                    <div className="max-h-48 overflow-y-auto border rounded-xl">
                                      {filteredArticles.length === 0 ? (
                                        <p className="p-3 text-sm text-zinc-400">No se encontraron actividades</p>
                                      ) : (
                                        filteredArticles.map(art => (
                                          <button
                                            key={art.id}
                                            type="button"
                                            onClick={() => {
                                              setWNewActivityArticleId(art.id)
                                              setNewActivityArticleTitle(art.titulo)
                                              setActivitySearchQuery('')
                                            }}
                                            className={`w-full p-3 text-left text-sm hover:bg-zinc-50 border-b last:border-b-0 ${
                                              wNewActivityArticleId === art.id ? 'bg-blue-50 border-blue-200' : ''
                                            }`}
                                          >
                                            {art.titulo}
                                          </button>
                                        ))
                                      )}
                                    </div>
                                  )}
                                  {wNewActivityArticleId && newActivityArticleTitle && !activitySearchQuery && (
                                    <p className="text-sm text-blue-600">Vinculada: {newActivityArticleTitle}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleAddActivityToExisting}
                      className="w-full py-2.5 bg-zinc-650 hover:brightness-110 text-white rounded-xl text-[0.8em] font-bold uppercase tracking-wider shadow"
                    >
                      Añadir Tarea ➕
                    </button>
                  </div>
                )}
              </div>

              {/* Botón Iniciar Desarrollo */}
              {isSpecOwner && ep.estado === 'activo' && (
                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-150 dark:border-white/5">
                  <button
                    onClick={handleUpdateSpecialtyInfo}
                    className="px-5 py-3 text-[0.85em] font-bold uppercase text-zinc-700 bg-zinc-100 rounded-xl"
                  >
                    Guardar Planificación 📂
                  </button>
                  <button
                    onClick={handleStartDevelopment}
                    className="px-6 py-3 text-[0.85em] font-bold uppercase text-white rounded-xl shadow-lg hover:brightness-110"
                    style={{ backgroundColor: color }}
                  >
                    Iniciar Desarrollo 🚀
                  </button>
                </div>
              )}

              {/* Aprobación del Monitor en Planificación */}
              {!isSpecOwner && isMonitor && ep.estado === 'activo' && (
                <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 space-y-4">
                  <p className="text-[0.9em] font-semibold text-amber-800 dark:text-amber-300">
                    Aprobación de Planificación: El especialista ha definido su meta y tareas en conjunto. Como monitor, revisa y aprueba su planificación para comenzar el desarrollo técnico.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleApproveSpecialtyPlanning}
                      className="px-4 py-2 bg-amber-600 text-white font-bold rounded-xl text-[0.8em] uppercase tracking-wider"
                    >
                      Aprobar Planificación e Iniciar Desarrollo ✓
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* FASE 3: DESARROLLO */}
          {ep.fase === 'desarrollo' && (
            <div className="space-y-6">
              
              {/* Resumen Planificación */}
              <div className="p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-150 dark:border-white/5 space-y-3 text-[0.95em]">
                <p className="text-zinc-700 dark:text-clr1"><span className="font-extrabold text-zinc-400 block uppercase text-[0.8em] tracking-wide">Meta General</span>{ep.meta_general || 'Ninguna meta descrita'}</p>
                <p className="text-zinc-700 dark:text-clr1"><span className="font-extrabold text-zinc-400 block uppercase text-[0.8em] tracking-wide">Monitor / Acompañante</span>{ep.monitor_nombre || 'No asignado'}</p>
              </div>

              {/* LISTA DE TAREAS EN DESARROLLO */}
              <div className="space-y-4">
                <span className="text-[0.8em] font-extrabold uppercase tracking-wider text-zinc-400 block ml-1">Desarrollo de Tareas ({completedCount} de {totalCount} completadas)</span>
                
                {/* Progress bar */}
                <div className="w-full bg-zinc-100 dark:bg-dclr1 h-3 rounded-full overflow-hidden border dark:border-zinc-800">
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: color }} />
                </div>

                <div className="space-y-4">
                  {acts.map((act: EspecialidadActividad) => (
                    <div 
                      key={act.id} 
                      className={`p-4 rounded-3xl border transition-all ${
                        act.completada 
                          ? 'border-green-300 bg-green-50/20 dark:bg-green-950/5' 
                          : 'border-zinc-150 dark:border-white/5 bg-white dark:bg-dclr1'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`font-bold text-[0.95em] ${act.completada ? 'line-through text-zinc-450 dark:text-zinc-500' : 'text-zinc-900 dark:text-white'}`}>
                              {act.descripcion}
                            </p>
                            {act.completada ? (
                              <span className="px-2 py-0.5 rounded-full text-[0.7em] font-extrabold uppercase bg-green-100 dark:bg-green-900/30 text-green-600">Completada ✓</span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[0.7em] font-extrabold uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-450 dark:text-zinc-500">Pendiente</span>
                            )}
                          </div>
                          {act.detalles && <p className="text-zinc-500 dark:text-zinc-400 text-[0.85em] font-medium">{act.detalles}</p>}
                          
                          <div className="flex items-center gap-2 flex-wrap">
                            {act.fecha_limite && (
                              <span className="inline-block px-2.5 py-0.5 rounded bg-clr7 text-clr1 text-[0.9em] font-extrabold">
                                Fecha Límite: {new Date(act.fecha_limite + 'T00:00:00').toLocaleDateString('es-CL')}
                              </span>
                            )}
                            {/* Botón de reprogramar fecha límite */}
                            <br/><span className="text-[0.9em]">Reprogramar Fecha Límite</span>
                            {isSpecOwner && (
                              <input
                                type="date"
                                value={taskDates[act.id] || ''}
                                onChange={async (e) => {
                                  const newDate = e.target.value
                                  setTaskDates(prev => ({ ...prev, [act.id]: newDate }))
                                  // Guardar inmediatamente en la DB
                                  await supabase
                                    .from('especialidades_actividades')
                                    .update({ fecha_limite: newDate || null, updated_at: new Date().toISOString() })
                                    .eq('id', act.id)
                                }}
                                className="text-[0.75em] border rounded-lg px-2 py-1 dark:bg-clr3 dark:border-clr4 font-bold cursor-pointer"
                                title="Reprogramar fecha límite"
                              />
                            )}
                          </div>

                          {/* Calendar activity & article detail rendering */}
                          {act.actividades_programadas ? (
                            <div className="mt-1 flex items-center gap-2 text-[0.9em] font-semibold text-blue-500 flex-wrap">
                              <span>
                                📅 Actividad: {act.actividades_programadas.nombre}
                              </span>
                              <span className="opacity-75">({new Date(act.actividades_programadas.fecha_inicio + 'T00:00:00').toLocaleDateString('es-CL')})</span>
                              {act.actividades_programadas.estado === 'borrador' && (
                                <span className="px-2 py-0.5 rounded-full text-[0.8em] font-extrabold uppercase bg-amber-100 text-amber-700">Borrador</span>
                              )}

                              {/* Dirigentes pueden editar siempre */}
                              {isLeader && (
                                <button
                                  onClick={() => {
                                    setEditingActividad({
                                      id: act.actividades_programadas!.id,
                                      tipo: 'Especialidad',
                                      nombre: act.actividades_programadas!.nombre,
                                      lugar: act.actividades_programadas!.lugar || '',
                                      fecha_inicio: act.actividades_programadas!.fecha_inicio,
                                      fecha_fin: act.actividades_programadas!.fecha_fin || act.actividades_programadas!.fecha_inicio,
                                    })
                                    setIsModActividadOpen(true)
                                  }}
                                  className="text-[0.8em] text-zinc-500 hover:text-zinc-700"
                                >
                                  ✏️
                                </button>
                              )}
                            </div>
                          ) : isSpecOwner ? (
                            <button
                              onClick={async () => {
                                // Crear un artículo básico vinculado a esta tarea
                                const title = act.descripcion || 'Ficha de actividad'
                                const slug = `actividad-${title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-${Date.now()}`
                                
                                const { data: newArt, error } = await supabase
                                  .from('articulos')
                                  .insert([{
                                    autor_id: userPerfil.id,
                                    titulo: title,
                                    slug: slug,
                                    contenido: `<p>Ficha de actividad para: ${act.descripcion}</p><p>Describe aquí los detalles de la actividad...</p>`,
                                    estado: 'borrador'
                                  }])
                                  .select('id')
                                  .single()
                                
                                if (error) {
                                  toast.error('Error al crear artículo: ' + error.message)
                                  return
                                }
                                
                                // Vincular el artículo a la tarea
                                await supabase
                                  .from('especialidades_actividades')
                                  .update({ articulo_id: newArt.id, updated_at: new Date().toISOString() })
                                  .eq('id', act.id)
                                
                                toast.success('Artículo creado como borrador. Edítalo para agregar los detalles.')
                                await refreshLocalSpecialty()
                              }}
                              className="mt-1 text-[0.9em] text-blue-500 hover:text-blue-700 font-semibold"
                            >
                              📰 Crear Ficha para esta tarea
                            </button>
                          ) : null}
                          {act.articulos && (
                            <div className="mt-0.5 flex items-center gap-1.5 text-[0.9em] font-semibold text-teal-600 dark:text-teal-400 flex-wrap">
                              <span>📰 Artículo:</span>
                              <a 
                                href={`/blog/actividades/${act.articulos.slug}`} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="underline hover:text-teal-800"
                              >
                                {act.articulos.titulo}
                              </a>
                              {act.articulos.estado === 'borrador' && (
                                <span className="px-2 py-0.5 rounded-full text-[0.8em] font-extrabold uppercase bg-amber-100 text-amber-700">Borrador</span>
                              )}
                              {isSpecOwner && act.articulos.estado === 'borrador' && (
                                <a
                                  href={`/blog/editar/${act.articulo_id}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-amber-600 hover:text-amber-800 font-bold underline"
                                >
                                  ✏️ Editar
                                </a>
                              )}
                            </div>
                          )}

                          {/* Evidencia registrada */}
                          {act.evidencia_texto && (
                            <div className="mt-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border text-[0.85em] space-y-1">
                              <span className="font-extrabold text-zinc-400 uppercase text-[0.75em] block">Evidencia del Especialista:</span>
                              <p className="text-zinc-700 dark:text-zinc-300 font-medium italic">"{act.evidencia_texto}"</p>
                              {act.evidencia_url && (
                                <a 
                                  href={act.evidencia_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-blue-500 underline font-bold block mt-1 hover:text-blue-700"
                                >
                                  🔗 Ver adjunto o enlace de evidencia
                                </a>
                              )}
                              {act.autoevaluacion && (
                                <p className="text-zinc-700 dark:text-zinc-350 font-medium mt-1"><span className="font-extrabold text-zinc-400 uppercase text-[0.75em]">Autoevaluación:</span> {act.autoevaluacion}</p>
                              )}
                            </div>
                          )}

                          {/* Comentario / Corrección del monitor */}
                          {act.comentario_monitor && (
                            <div className="mt-2 p-3 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 text-[0.85em] space-y-1">
                              <span className="font-extrabold text-red-500 uppercase text-[0.75em] block">⚠️ Observación de Mejora (Monitor):</span>
                              <p className="text-red-700 dark:text-red-300 font-semibold">"{act.comentario_monitor}"</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Botones de acción de tarea */}
                      <div className="mt-4 flex gap-2 justify-end">
                        {isSpecOwner && ep.estado === 'activo' && !act.completada && (
                          <button
                            onClick={() => {
                              setSubmittingEvidenceActId(act.id);
                              setActEvidenceText(act.evidencia_texto || '');
                              setActEvidenceUrl(act.evidencia_url || '');
                              setActAutoevaluacionText(act.autoevaluacion || '');
                            }}
                            className="px-4 py-2 bg-zinc-750 text-white rounded-xl text-[0.8em] font-bold uppercase hover:brightness-110"
                          >
                            {act.evidencia_texto ? 'Actualizar Evidencia 📂' : 'Subir Evidencia 📤'}
                          </button>
                        )}

                        {/* Monitor actions */}
                        {!isSpecOwner && isMonitor && ep.estado === 'activo' && act.evidencia_texto && !act.completada && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveActivity(act.id)}
                              className="px-4 py-2 bg-green-600 hover:brightness-110 text-white font-bold rounded-xl text-[0.8em] uppercase tracking-wider"
                            >
                              Aprobar Tarea ✓
                            </button>
                            <button
                              onClick={() => {
                                setReviewingActId(act.id);
                                setActReviewComment(act.comentario_monitor || '');
                              }}
                              className="px-4 py-2 border border-red-200 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold rounded-xl text-[0.8em] uppercase tracking-wider"
                            >
                              Corregir / Observar 📝
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Modal de subir evidencia */}
                      {submittingEvidenceActId === act.id && (
                        <div className="mt-4 p-4 border rounded-2xl bg-zinc-55 dark:bg-zinc-800 space-y-3">
                          <span className="text-[0.8em] font-extrabold uppercase text-zinc-400 block">Registrar Evidencia de Tarea</span>
                          <div className="space-y-1">
                            <label className="text-[0.75em] font-bold text-zinc-500 block">Descripción del Trabajo Realizado</label>
                            <DebouncedTextarea 
                              value={actEvidenceText}
                              onChange={val => setActEvidenceText(val)}
                              placeholder="Ej: Completé el herbario con las 10 muestras descritas y lo expuse ante la patrulla..."
                              className="w-full p-3 rounded-lg border text-sm font-semibold"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[0.75em] font-bold text-zinc-500 block">Enlace de Evidencia (Google Drive / Foto / Documento Opcional)</label>
                            <DebouncedInput 
                              type="text"
                              value={actEvidenceUrl}
                              onChange={val => setActEvidenceUrl(val)}
                              placeholder="Ej: https://drive.google.com/..."
                              className="w-full p-2 border rounded-lg text-sm font-semibold"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[0.75em] font-bold text-zinc-500 block">Autoevaluación (¿Qué aprendiste de esta tarea?)</label>
                            <DebouncedTextarea 
                              value={actAutoevaluacionText}
                              onChange={val => setActAutoevaluacionText(val)}
                              placeholder="Ej: Aprendí a diferenciar distintos tipos de árboles nativos y su importancia..."
                              className="w-full p-3 rounded-lg border text-sm font-semibold"
                            />
                          </div>
                          <div className="flex gap-2 justify-end pt-2">
                            <button
                              onClick={() => setSubmittingEvidenceActId(null)}
                              className="px-4 py-2 text-zinc-400 text-xs uppercase font-extrabold"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleSubmitActivityEvidence(act.id)}
                              className="px-5 py-2.5 bg-green-600 text-white text-xs uppercase font-extrabold rounded-lg hover:brightness-110"
                            >
                              Enviar Evidencia 📤
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Modal de ingresar corrección */}
                      {reviewingActId === act.id && (
                        <div className="mt-4 p-4 border rounded-2xl bg-red-50/50 dark:bg-red-950/10 border-red-200 space-y-3">
                          <span className="text-[0.8em] font-extrabold uppercase text-red-500 block">Indicar Comentario de Mejora</span>
                          <div className="space-y-1">
                            <label className="text-[0.75em] font-bold text-red-700 dark:text-red-400 block">¿Qué debe mejorar o completar el participante?</label>
                            <DebouncedTextarea 
                              value={actReviewComment}
                              onChange={val => setActReviewComment(val)}
                              placeholder="Ej: Falta agregar la descripción ecológica de dos plantas en el herbario. Compleméntalo para aprobar..."
                              className="w-full p-3 rounded-lg border text-sm font-semibold"
                            />
                          </div>
                          <div className="flex gap-2 justify-end pt-2">
                            <button
                              onClick={() => setReviewingActId(null)}
                              className="px-4 py-2 text-zinc-400 text-xs uppercase font-extrabold"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleReviewActivity(act.id)}
                              className="px-5 py-2.5 bg-red-600 text-white text-xs uppercase font-extrabold rounded-lg hover:brightness-110"
                            >
                              Enviar Corrección
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Botón Solicitar Reconocimiento */}
              {isSpecOwner && ep.estado === 'activo' && completedCount === totalCount && totalCount > 0 && (
                <div className="p-4 rounded-3xl bg-green-50 dark:bg-green-950/20 border border-green-200 space-y-4">
                  <p className="text-[0.9em] font-bold text-green-700 dark:text-green-300">
                    ¡Has completado todas tus tareas planificadas! A continuación evalúa tu experiencia para solicitar tu insignia de especialidad.
                  </p>
                  
                  <div className="space-y-2">
                    <label className="text-[0.8em] font-bold uppercase tracking-wider text-zinc-400 block">Evaluación Final del Especialista</label>
                    <DebouncedTextarea 
                      value={finalSpecEvaluation}
                      onChange={val => setFinalSpecEvaluation(val)}
                      placeholder="Describe qué fue lo que más te gustó, qué dificultades tuviste y cómo este conocimiento te ayuda en tu vida diaria..."
                      className="w-full p-4 border rounded-2xl bg-white dark:bg-zinc-900 text-sm font-medium h-24"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-[0.9em] font-bold cursor-pointer text-zinc-800 dark:text-zinc-200 select-none">
                    <input 
                      type="checkbox"
                      checked={goalChecked}
                      onChange={e => setGoalChecked(e.target.checked)}
                    />
                    Confirmo que logré cumplir mi Meta General declarada
                  </label>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleRequestRecognition}
                      className="px-6 py-3 bg-green-600 text-white font-extrabold rounded-xl text-[0.85em] uppercase tracking-wider hover:brightness-110 shadow-lg"
                    >
                      Enviar Solicitud de Reconocimiento 🎖️
                    </button>
                  </div>
                </div>
              )}

              {/* Aprobación del Monitor al finalizar Desarrollo */}
              {!isSpecOwner && isMonitor && ep.estado === 'activo' && completedCount === totalCount && totalCount > 0 && !ep.aprobado_monitor && (
                <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 space-y-4">
                  <p className="text-[0.95em] font-bold text-amber-800 dark:text-amber-300">
                    Aprobación Técnica del Monitor: Todas las tareas técnicas han sido validadas. Revisa la evaluación final del participante y firma para autorizar la entrega de su insignia.
                  </p>

                  {ep.evaluacion_final && (
                    <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border text-sm">
                      <span className="font-extrabold text-zinc-400 uppercase text-[0.75em] block">Evaluación Final del Especialista:</span>
                      <p className="italic text-zinc-700 dark:text-zinc-300">"{ep.evaluacion_final}"</p>
                    </div>
                  )}

                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => handleMonitorApproveSpecialty()}
                      className="px-5 py-3 bg-green-600 text-white font-bold rounded-xl text-[0.8em] uppercase tracking-wider hover:brightness-110 shadow-md"
                    >
                      Aprobar Especialidad y Firmar ✍️
                    </button>
                    <button
                      onClick={() => setShowFeedbackInput(true)}
                      className="px-5 py-3 border border-red-200 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold rounded-xl text-[0.8em] uppercase tracking-wider"
                    >
                      Solicitar Mejoras / Retroalimentar 📝
                    </button>
                  </div>

                  {showFeedbackInput && (
                    <div className="mt-4 p-4 border rounded-2xl bg-white dark:bg-zinc-900 space-y-3">
                      <label className="text-[0.8em] font-bold uppercase text-zinc-450 block">Retroalimentación / Comentarios de Mejora</label>
                      <DebouncedTextarea 
                        value={feedbackComment}
                        onChange={val => setFeedbackComment(val)}
                        placeholder="Escribe aquí las observaciones o mejoras que debe realizar antes de aprobar..."
                        className="w-full p-3 rounded-lg border text-sm font-semibold"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setShowFeedbackInput(false)}
                          className="px-4 py-2 text-zinc-400 text-xs uppercase font-extrabold"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleMonitorFeedbackSpecialty}
                          className="px-5 py-2 bg-red-600 text-white text-xs uppercase font-extrabold rounded-lg hover:brightness-110"
                        >
                          Enviar Comentarios
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* FASE 4: RECONOCIMIENTO */}
          {ep.fase === 'reconocimiento' && (
            <div className="space-y-6">
              <div className="p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-150 dark:border-white/5 space-y-4 text-[0.95em]">
                <p className="text-zinc-700 dark:text-zinc-350"><span className="font-extrabold text-zinc-400 block uppercase text-[0.8em] tracking-wide">Meta General</span>{ep.meta_general || 'Ninguna meta descrita'}</p>
                <p className="text-zinc-700 dark:text-zinc-350"><span className="font-extrabold text-zinc-400 block uppercase text-[0.8em] tracking-wide">Monitor / Acompañante</span>{ep.monitor_nombre || 'No asignado'}</p>
                <p className="text-zinc-700 dark:text-zinc-350"><span className="font-extrabold text-zinc-400 block uppercase text-[0.8em] tracking-wide">Evaluación Final</span>{ep.evaluacion_final || 'Sin evaluación registrada'}</p>
              </div>

              {/* Aprobación del Monitor en fase de Reconocimiento */}
              {!isSpecOwner && isMonitor && ep.estado === 'activo' && !ep.aprobado_monitor && (
                <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 space-y-4">
                  <p className="text-[0.95em] font-bold text-amber-800 dark:text-amber-300">
                    Aprobación del Monitor: El especialista ha solicitado el reconocimiento. Revisa su evaluación final y firma para autorizar la entrega de la insignia.
                  </p>

                  {ep.evaluacion_final && (
                    <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border text-sm">
                      <span className="font-extrabold text-zinc-400 uppercase text-[0.75em] block">Evaluación Final del Especialista:</span>
                      <p className="italic text-zinc-700 dark:text-zinc-300">"{ep.evaluacion_final}"</p>
                    </div>
                  )}

                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => handleMonitorApproveSpecialty()}
                      className="px-5 py-3 bg-green-600 text-white font-bold rounded-xl text-[0.8em] uppercase tracking-wider hover:brightness-110 shadow-md"
                    >
                      Aprobar y Firmar ✍️
                    </button>
                    <button
                      onClick={() => setShowFeedbackInput(true)}
                      className="px-5 py-3 border border-red-200 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold rounded-xl text-[0.8em] uppercase tracking-wider"
                    >
                      Solicitar Mejoras 📝
                    </button>
                  </div>

                  {showFeedbackInput && (
                    <div className="mt-4 p-4 border rounded-2xl bg-white dark:bg-zinc-900 space-y-3">
                      <label className="text-[0.8em] font-bold uppercase text-zinc-450 block">Retroalimentación</label>
                      <DebouncedTextarea 
                        value={feedbackComment}
                        onChange={val => setFeedbackComment(val)}
                        placeholder="Escribe las observaciones o mejoras que debe realizar..."
                        className="w-full p-3 rounded-lg border text-sm font-semibold"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setShowFeedbackInput(false)}
                          className="px-4 py-2 text-zinc-400 text-xs uppercase font-extrabold"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleMonitorFeedbackSpecialty}
                          className="px-5 py-2 bg-red-600 text-white text-xs uppercase font-extrabold rounded-lg hover:brightness-110"
                        >
                          Enviar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Aprobación del Dirigente y Entrega */}
              {isLeader && ep.estado === 'activo' && ep.aprobado_monitor && (
                <div className="p-5 rounded-3xl bg-green-50 dark:bg-green-950/20 border border-green-200 space-y-4">
                  <p className="text-[0.95em] font-bold text-green-800 dark:text-green-300">
                    Aprobación de Ceremonia (Dirigente / Guiadora): El monitor ha aprobado la especialidad técnica. Ingresa la fecha en la que se entregará la insignia y firma para expedir el certificado oficial del grupo.
                  </p>

                  <div className="space-y-2">
                    <label className="text-[0.8em] font-bold uppercase tracking-wider text-zinc-400 block">Fecha de Entrega de la Insignia (Ceremonia)</label>
                    <input 
                      type="date"
                      value={deliveryDate}
                      onChange={e => setDeliveryDate(e.target.value)}
                      className="p-3 border rounded-xl bg-white dark:bg-zinc-900 text-sm font-semibold w-full"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => handleFinalizeSpecialty()}
                      className="px-6 py-3 bg-green-600 text-white font-extrabold rounded-xl text-[0.85em] uppercase tracking-wider hover:brightness-110 shadow-lg"
                    >
                      Aprobar e Imprimir Certificado 🏆
                    </button>
                  </div>
                </div>
              )}

              {/* Estado de finalización para el NNJ */}
              {ep.estado === 'completado' && (
                <div className="p-5 rounded-3xl bg-green-50 dark:bg-green-950/20 border border-green-200 text-center space-y-4">
                  <p className="text-[1.1em] font-black text-green-700 dark:text-green-300 uppercase">
                    🏆 ¡Especialidad Completada con Éxito!
                  </p>
                  <p className="text-[0.9em] text-zinc-650 dark:text-zinc-350">
                    Esta especialidad ha sido completada y avalada tanto por tu monitor como por la directiva de tu unidad.
                    {ep.fecha_entrega && ` La insignia se agendó para entregarse el ${new Date(ep.fecha_entrega + 'T00:00:00').toLocaleDateString('es-CL')}.`}
                  </p>
                  
                  <div className="flex justify-center">
                    <button
                      onClick={() => generateSpecialtyCertificate(ep.perfil || perfil, {
                        nombre_personalizado: ep.nombre_personalizado ?? undefined,
                        especialidades_definiciones: ep.especialidades_definiciones ? { nombre: ep.especialidades_definiciones.nombre ?? '' } : undefined,
                        campo_interes: ep.campo_interes ?? undefined,
                        firma_dirigente_b64: ep.firma_dirigente_b64 ?? undefined,
                        firma_monitor_b64: ep.firma_monitor_b64 ?? undefined,
                        fecha_entrega: ep.fecha_entrega ?? undefined,
                        fecha_fin: ep.fecha_fin ?? undefined
                      })}
                      className="px-6 py-3 bg-zinc-800 hover:brightness-110 text-white text-[0.85em] font-extrabold uppercase rounded-xl tracking-wider shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      Descargar Certificado Oficial 📜
                    </button>
                  </div>
                </div>
              )}

              {ep.estado === 'activo' && !ep.aprobado_monitor && (
                <div className="p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-150 dark:border-white/5 text-center">
                  <p className="text-[0.9em] font-bold text-zinc-550 italic">
                    Esperando aprobación final y firma digital de tu monitor/acompañante...
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal footer / Delete specialty */}
        {isSpecOwner && ep.estado === 'activo' && (
          <div className="pt-4 border-t border-zinc-150 dark:border-white/5 flex justify-between gap-3">
            {ep.estado === 'activo' ? (
              <button
                onClick={handlePauseSpecialty}
                className="px-4 py-2 text-[0.8em] font-bold uppercase text-amber-600 bg-amber-50 dark:bg-amber-950/20 hover:brightness-110 rounded-xl"
              >
                Pausar Especialidad ⏸️
              </button>
            ) : (
              <button
                onClick={handleResumeSpecialty}
                className="px-4 py-2 text-[0.8em] font-bold uppercase text-green-600 bg-green-50 dark:bg-green-950/20 hover:brightness-110 rounded-xl"
              >
                Retomar Especialidad ▶️
              </button>
            )}
            
            <button
              onClick={handleDeleteSpecialty}
              className="px-4 py-2 text-[0.8em] font-bold uppercase text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
            >
              Eliminar Especialidad ✕
            </button>
          </div>
        )}

      </div>

      {/* Modal de Crear Actividad Programada */}
      <DashModActividadCrear
        isOpen={isModActividadOpen}
        onClose={() => { setIsModActividadOpen(false); setEditingActividad(null); }}
        perfil={{ id: userPerfil.id, unidad_id: userPerfil.unidad_id }}
        unidades={[]}
        onSuccess={() => {
          setIsModActividadOpen(false)
          setEditingActividad(null)
          refreshLocalSpecialty()
        }}
        editingActividad={editingActividad}
      />

      {/* Modal de Captura de Firma Digital (Especialidades) */}
      {showSignatureModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-[2.5rem] border border-zinc-150 dark:border-clr4 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => { setShowSignatureModal(false); setSigModalType(null); }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-650 dark:hover:text-white font-extrabold text-[1.1em] cursor-pointer"
            >
              ✕
            </button>
            
            <h3 className="text-[1.25em] font-black text-zinc-850 dark:text-dclr2 uppercase tracking-tighter mb-4 text-center border-b pb-2 font-display">
              {sigModalType === 'monitor' ? '✍️ Firma del Monitor' : '✍️ Firma del Dirigente'}
            </h3>
            
            <p className="text-[0.85em] text-zinc-400 mb-4 text-center">
              {sigModalType === 'monitor' 
                ? 'Dibuja tu firma a continuación para autorizar la aprobación técnica de esta especialidad.' 
                : 'Dibuja tu firma a continuación para confirmar la finalización y agendamiento de esta especialidad.'}
            </p>

            <div className="border-4 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[1.5rem] bg-white overflow-hidden shadow-inner touch-none relative">
              <SignatureCanvas 
                ref={sigCanvasRef}
                penColor='#1b1b1b'
                minWidth={1.8}
                maxWidth={3.5}
                canvasProps={{
                  className: 'signature-canvas w-full h-[200px] cursor-crosshair'
                }}
                onEnd={() => {
                  if (sigCanvasRef.current) {
                    setTempSignature(sigCanvasRef.current.getTrimmedCanvas().toDataURL('image/png'));
                  }
                }}
              />
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                type="button"
                onClick={() => {
                  sigCanvasRef.current?.clear();
                  setTempSignature(null);
                }}
                className="px-4 py-2 text-[0.8em] font-black uppercase text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors border border-red-200 cursor-pointer"
              >
                Limpiar
              </button>

              <button
                type="button"
                onClick={async () => {
                  if (!tempSignature) {
                    toast.warning('Por favor dibuja tu firma antes de confirmar.');
                    return;
                  }
                  
                  const signature = tempSignature;
                  
                  // Cerrar modal
                  setShowSignatureModal(false);
                  setSigModalType(null);
                  
                  if (sigModalType === 'monitor') {
                    await handleMonitorApproveSpecialty(signature);
                  } else {
                    await handleFinalizeSpecialty(signature);
                  }
                }}
                className="px-6 py-2.5 bg-green-600 hover:brightness-110 text-white rounded-xl text-[0.8em] font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                Confirmar Firma
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
});

export default DashmodProgresionEspecialidadDetalle;
