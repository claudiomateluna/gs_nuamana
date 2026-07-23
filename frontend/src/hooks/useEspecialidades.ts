'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { getRoleIds } from '@/lib/roles'
import { generateSpecialtyCertificate } from '@/lib/pdf-service'
import { Perfil as PerfilBase, Articulo } from '@/types'
import {
  EspecialidadActividad,
  EspecialidadDefinicion,
  EspecialidadPersonal,
} from '@/types/progresion'
import { toast } from 'sonner'

type Perfil = PerfilBase & { edad?: number }

interface UseEspecialidadesProps {
  perfil: Perfil
  userPerfil: Perfil
}

export function useEspecialidades({ perfil, userPerfil }: UseEspecialidadesProps) {
  const [subTab, setSubTab] = useState<'progreso' | 'especialidades' | 'ceremonias'>('progreso')
  const [especialidadesPersonales, setEspecialidadesPersonales] = useState<EspecialidadPersonal[]>([])
  const [definicionesEspecialidades, setDefinicionesEspecialidades] = useState<EspecialidadDefinicion[]>([])
  const [loadingEspecialidades, setLoadingEspecialidades] = useState(true)
  const [activeEspecialidad, setActiveEspecialidad] = useState<EspecialidadPersonal | null>(null)

  const [searchCatQuery, setSearchCatQuery] = useState('')
  const [selectedFieldFilter, setSelectedFieldFilter] = useState<string>('todos')
  const [showSpecialtyWizard, setShowSpecialtyWizard] = useState(false)
  const [wizardStep, setWizardStep] = useState(1)

  const [wSelectedField, setWSelectedField] = useState<string>('arte_expresion')
  const [wSelectedDefId, setWSelectedDefId] = useState<string>('')
  const [wCustomName, setWCustomName] = useState<string>('')
  const [wMetaGeneral, setWMetaGeneral] = useState<string>('')
  const [wDiagnostico, setWDiagnostico] = useState<string>('')
  const [wMonitorName, setWMonitorName] = useState<string>('')
  const [wActivities, setWActivities] = useState<EspecialidadActividad[]>([])
  const [wNewActivityText, setWNewActivityText] = useState<string>('')
  const [wNewActivityDetalles, setWNewActivityDetalles] = useState<string>('')
  const [wMonitorPerfilId, setWMonitorPerfilId] = useState<string>('')
  const [wIsMonitorInterno, setWIsMonitorInterno] = useState<boolean>(true)
  const [wMonitorSearchText, setWMonitorSearchText] = useState<string>('')
  const [showMonitorDropdown, setShowMonitorDropdown] = useState<boolean>(false)
  const [availableMonitors, setAvailableMonitors] = useState<Pick<Perfil, 'id' | 'nombres' | 'apellidos'>[]>([])
  const [especialidadesSupervisadas, setEspecialidadesSupervisadas] = useState<EspecialidadPersonal[]>([])

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
  const [availableActivityArticles, setAvailableActivityArticles] = useState<Articulo[]>([])
  const [actAutoevaluacionText, setActAutoevaluacionText] = useState<string>('')
  const [finalSpecEvaluation, setFinalSpecEvaluation] = useState<string>('')
  const [goalChecked, setGoalChecked] = useState<boolean>(false)
  const [deliveryDate, setDeliveryDate] = useState<string>('')
  const [feedbackComment, setFeedbackComment] = useState<string>('')
  const [showFeedbackInput, setShowFeedbackInput] = useState<boolean>(false)
  const [newActivityArticleTitle, setNewActivityArticleTitle] = useState<string>('')
  const [taskDates, setTaskDates] = useState<Record<string, string>>({})

  const [showSignatureModal, setShowSignatureModal] = useState(false)
  const [sigModalType, setSigModalType] = useState<'monitor' | 'leader' | null>(null)
  const [sigModalTargetId, setSigModalTargetId] = useState<string>('')
  const prevActiveSpecIdRef = useRef<string | null>(null)

  const fetchEspecialidades = useCallback(async () => {
    setLoadingEspecialidades(true)
    try {
      const [
        persResult,
        defsResult,
        superResult,
        actRelsResult
      ] = await Promise.all([
        supabase
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
                estado
              )
            )
          `)
          .eq('perfil_id', perfil.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('especialidades_definiciones')
          .select('*')
          .order('nombre'),
        supabase
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
          .eq('monitor_perfil_id', userPerfil.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('articulo_categorias')
          .select('articulo_id')
          .eq('categoria_id', 1)
      ])

      if (persResult.error) throw persResult.error

      // Client-side deduplication: if multiple rows exist for the same definicion_id,
      // keep only the most recent (first in created_at DESC order)
      const rawPersonales = persResult.data || []
      const deduplicated: typeof rawPersonales = []
      const seenDefIds = new Set<string>()
      for (const ep of rawPersonales) {
        if (ep.definicion_id) {
          if (seenDefIds.has(ep.definicion_id)) continue
          seenDefIds.add(ep.definicion_id)
        }
        deduplicated.push(ep)
      }
      setEspecialidadesPersonales(deduplicated)

      if (defsResult.error) throw defsResult.error
      setDefinicionesEspecialidades(defsResult.data || [])

      if (!superResult.error && superResult.data) {
        setEspecialidadesSupervisadas(superResult.data)
      } else if (superResult.error) {
        console.error('Error al cargar especialidades supervisadas:', superResult.error)
      }

      if (actRelsResult.data && actRelsResult.data.length > 0) {
        const artIds = actRelsResult.data.map(r => r.articulo_id)
        const { data: arts } = await supabase
          .from('articulos')
          .select('id, titulo, slug')
          .in('id', artIds)
          .eq('estado', 'publicado')
          .order('titulo')
        setAvailableActivityArticles((arts as Articulo[]) || [])
      } else {
        setAvailableActivityArticles([])
      }
    } catch (err) {
      console.error('Error al cargar especialidades:', err)
    } finally {
      setLoadingEspecialidades(false)
    }
  }, [perfil.id, userPerfil.id])

  const fetchAvailableMonitors = useCallback(async () => {
    if (availableMonitors.length > 0) return
    const { data, error } = await supabase
      .from('perfiles')
      .select('id, nombres, apellidos, rut')
      .order('nombres')
    if (!error && data) {
      setAvailableMonitors(data)
    }
  }, [availableMonitors.length])

  const resetWizard = useCallback(() => {
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
  }, [])

  const refreshActiveSpecialty = useCallback(async (epId: string) => {
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
      .eq('id', epId)
      .single()
    if (updatedSpec) setActiveEspecialidad(updatedSpec)
  }, [])

  const handleSaveSpecialty = useCallback(async (targetPhase = 'exploracion') => {
    if (!wDiagnostico.trim()) {
      toast.warning('Por favor ingresa la exploración de tu especialidad.')
      return
    }
    if (!wSelectedDefId && !wCustomName.trim()) {
      toast.warning('Por favor selecciona una especialidad del catálogo o define una personalizada.')
      return
    }

    try {
      // Prevent duplicate: check if user already has an active specialty for this definition
      if (wSelectedDefId) {
        const existing = especialidadesPersonales.find(
          ep => ep.definicion_id === wSelectedDefId && ep.estado !== 'completado'
        )
        if (existing) {
          toast.warning('Ya tienes una especialidad activa para esta definición. Finaliza o elimina la existente antes de crear una nueva.')
          return
        }
      }

      const payload: Record<string, unknown> = {
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

      toast.success(targetPhase === 'planificacion'
        ? 'Especialidad creada y lista para iniciar su planificación.'
        : 'Exploración de especialidad guardada para más adelante.'
      )
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

      await Promise.all([
        fetchEspecialidades(),
        ...(targetPhase === 'planificacion' && specData ? [refreshActiveSpecialty(specData.id)] : [])
      ])
    } catch (err: unknown) {
      console.error(err)
      toast.error('Error al guardar la especialidad: ' + (err as Error).message)
    }
  }, [perfil.id, wDiagnostico, wSelectedDefId, wCustomName, wSelectedField, fetchEspecialidades, refreshActiveSpecialty])

  const handleUpdateSpecialtyInfo = useCallback(async (epId: string) => {
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
      .eq('id', epId)

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

      const specName = activeEspecialidad?.nombre_personalizado || activeEspecialidad?.especialidades_definiciones?.nombre || 'Especialidad'
      if (wMonitorPerfilId) {
        await supabase.from('notificaciones').insert([{
          perfil_id: wMonitorPerfilId,
          mensaje: `${perfil.nombres} ha completado la planificación de la especialidad "${specName}". Revisa para aprobar su planificación e iniciar desarrollo.`,
          tipo: 'especialidad',
          link_url: '/panel'
        }])
      }

      toast.success('Información de especialidad guardada.')
      await Promise.all([fetchEspecialidades(), refreshActiveSpecialty(epId)])
    }
  }, [wMetaGeneral, wMonitorName, wMonitorPerfilId, taskDates, activeEspecialidad, perfil.nombres, fetchEspecialidades, refreshActiveSpecialty])

  const handlePauseSpecialty = useCallback(async (epId: string) => {
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
      toast.error('Error al pausar especialidad: ' + error.message)
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

    toast.success('Especialidad pausada y fechas de tareas reiniciadas.')
    await Promise.all([fetchEspecialidades(), refreshActiveSpecialty(epId)])
  }, [fetchEspecialidades, refreshActiveSpecialty])

  const handleResumeSpecialty = useCallback(async (epId: string) => {
    const { error } = await supabase
      .from('especialidades_personales')
      .update({
        fase: 'planificacion',
        estado: 'activo',
        updated_at: new Date().toISOString()
      })
      .eq('id', epId)

    if (error) {
      toast.error('Error al retomar especialidad: ' + error.message)
    } else {
      toast.success('La especialidad se ha retomado en fase de Planificación.')
      await Promise.all([fetchEspecialidades(), refreshActiveSpecialty(epId)])
    }
  }, [fetchEspecialidades, refreshActiveSpecialty])

  const handleAdvanceSpecialtyPhase = useCallback(async (epId: string, nextPhase: string) => {
    const { error } = await supabase
      .from('especialidades_personales')
      .update({ fase: nextPhase, updated_at: new Date().toISOString() })
      .eq('id', epId)

    if (error) {
      toast.error('Error al actualizar fase: ' + error.message)
    } else {
      toast.info(`Especialidad avanzada a la fase de ${nextPhase === 'planificacion' ? 'Planificación' : nextPhase === 'desarrollo' ? 'Desarrollo' : 'Evaluación y Reconocimiento'}.`)
      await Promise.all([fetchEspecialidades(), refreshActiveSpecialty(epId)])
    }
  }, [fetchEspecialidades, refreshActiveSpecialty])

  const handleSubmitActivityEvidence = useCallback(async (actId: string) => {
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

      const specName = activeEspecialidad?.nombre_personalizado || activeEspecialidad?.especialidades_definiciones?.nombre || 'Especialidad'
      if (activeEspecialidad?.monitor_perfil_id) {
        await supabase.from('notificaciones').insert([{
          perfil_id: activeEspecialidad.monitor_perfil_id,
          mensaje: `${perfil.nombres} ha entregado evidencia para la tarea "${activeEspecialidad.especialidades_actividades?.find((a: EspecialidadActividad) => a.id === actId)?.descripcion || 'de especialidad'}" de "${specName}". Revisa para validar.`,
          tipo: 'especialidad',
          link_url: '/panel'
        }])
      }

      toast.success('Evidencia y autoevaluación registradas con éxito. Se ha notificado a tu monitor.')
      setSubmittingEvidenceActId(null)
      setActEvidenceText('')
      setActEvidenceUrl('')
      setActAutoevaluacionText('')

      await Promise.all([
        fetchEspecialidades(),
        ...(activeEspecialidad ? [refreshActiveSpecialty(activeEspecialidad.id)] : [])
      ])
    } catch (err: unknown) {
      console.error(err)
      toast.error('Error al registrar evidencia: ' + (err as Error).message)
    }
  }, [actEvidenceText, actEvidenceUrl, actAutoevaluacionText, activeEspecialidad, perfil.nombres, fetchEspecialidades, refreshActiveSpecialty])

  const handleApproveActivity = useCallback(async (actId: string) => {
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
      if (activeEspecialidad) {
        const specName = activeEspecialidad.nombre_personalizado || activeEspecialidad.especialidades_definiciones?.nombre || 'Especialidad'
        const actDesc = activeEspecialidad.especialidades_actividades?.find((a: EspecialidadActividad) => a.id === actId)?.descripcion || 'Tarea'

        await supabase.from('notificaciones').insert([{
          perfil_id: activeEspecialidad.perfil_id,
          mensaje: `Tu monitor ha aprobado la tarea "${actDesc}" de tu especialidad "${specName}".`,
          tipo: 'especialidad',
          link_url: '/panel'
        }])
      }

      toast.success('Tarea aprobada con éxito.')
      await Promise.all([
        fetchEspecialidades(),
        ...(activeEspecialidad ? [refreshActiveSpecialty(activeEspecialidad.id)] : [])
      ])
    }
  }, [activeEspecialidad, fetchEspecialidades, refreshActiveSpecialty])

  const handleReviewActivity = useCallback(async (actId: string) => {
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
      if (activeEspecialidad) {
        const specName = activeEspecialidad.nombre_personalizado || activeEspecialidad.especialidades_definiciones?.nombre || 'Especialidad'
        const actDesc = activeEspecialidad.especialidades_actividades?.find((a: EspecialidadActividad) => a.id === actId)?.descripcion || 'Tarea'

        await supabase.from('notificaciones').insert([{
          perfil_id: activeEspecialidad.perfil_id,
          mensaje: `Tu monitor ha dejado una corrección/comentario en la tarea "${actDesc}" de tu especialidad "${specName}": "${actReviewComment.slice(0, 60)}${actReviewComment.length > 60 ? '...' : ''}"`,
          tipo: 'especialidad',
          link_url: '/panel'
        }])
      }

      setReviewingActId(null)
      setActReviewComment('')
      await Promise.all([
        fetchEspecialidades(),
        ...(activeEspecialidad ? [refreshActiveSpecialty(activeEspecialidad.id)] : [])
      ])
    }
  }, [actReviewComment, activeEspecialidad, fetchEspecialidades, refreshActiveSpecialty])

  const handleAddActivityToExisting = useCallback(async (epId: string) => {
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

        const specName = activeEspecialidad?.nombre_personalizado || activeEspecialidad?.especialidades_definiciones?.nombre || 'Especialidad'

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

        if (activeEspecialidad?.monitor_perfil_id) {
          await supabase.from('notificaciones').insert({
            perfil_id: activeEspecialidad.monitor_perfil_id,
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

      toast.success('Tarea agregada con éxito.')

      setNewDetailActText('')
      setNewDetailActDetalles('')
      setWNewActivityFechaLimite('')
      setWNewActivityFechaActividad('')
      setWNewActivityRequiresCalendar(false)
      setWNewActivityArticleId('')
      setWNewActivityLugar('Local Scout')
      setNewActivityArticleTitle('')

      await Promise.all([fetchEspecialidades(), refreshActiveSpecialty(epId)])
    } catch (err: unknown) {
      console.error(err)
      toast.error('Error al agregar tarea: ' + (err as Error).message)
    }
  }, [newDetailActText, newDetailActDetalles, wNewActivityRequiresCalendar, wNewActivityFechaActividad, newActivityArticleTitle, wNewActivityArticleId, wNewActivityLugar, wNewActivityFechaLimite, userPerfil.id, perfil.unidad_id, fetchEspecialidades, refreshActiveSpecialty])

  const handleDeleteActivity = useCallback(async (actId: string) => {
    const isConfirm = window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')
    if (!isConfirm) return

    const { error } = await supabase
      .from('especialidades_actividades')
      .delete()
      .eq('id', actId)

    if (error) {
      toast.error('Error al eliminar actividad: ' + error.message)
    } else {
      await Promise.all([
        fetchEspecialidades(),
        ...(activeEspecialidad ? [refreshActiveSpecialty(activeEspecialidad.id)] : [])
      ])
    }
  }, [activeEspecialidad, fetchEspecialidades, refreshActiveSpecialty])

  const handleDeleteSpecialty = useCallback(async (epId: string) => {
    const isConfirm = window.confirm('¿Estás seguro de que deseas eliminar esta especialidad? Esta acción no se puede deshacer.')
    if (!isConfirm) return

    const { error } = await supabase
      .from('especialidades_personales')
      .delete()
      .eq('id', epId)

    if (error) {
      toast.error('Error al eliminar: ' + error.message)
    } else {
      setActiveEspecialidad(null)
      await fetchEspecialidades()
    }
  }, [fetchEspecialidades])

  const handleFinalizeSpecialty = useCallback(async (ep: EspecialidadPersonal, signatureB64?: string) => {
    if (!deliveryDate) {
      toast.warning('Por favor selecciona una fecha de entrega para la insignia.')
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

      const specName = ep.nombre_personalizado || ep.especialidades_definiciones?.nombre || 'Especialidad'

      const { error: hitoErr } = await supabase
        .from('progresion_hitos')
        .insert([{
          perfil_id: ep.perfil_id,
          nombre_hito: specName,
          fecha_entrega: deliveryDate,
          tipo: 'especialidad',
          entregado_por: userPerfil.id
        }])

      if (hitoErr) throw hitoErr

      await supabase.from('notificaciones').insert([{
        perfil_id: ep.perfil_id,
        mensaje: `¡Felicitaciones! Tu insignia de la especialidad "${specName}" será entregada en el próximo campamento o salida el ${deliveryDate}.`,
        tipo: 'especialidad',
        link_url: '/panel'
      }])

      toast.success('¡Especialidad aprobada y entrega agendada con éxito!')

      const updatedEp = {
        ...ep,
        fase: 'reconocimiento',
        estado: 'completado',
        fecha_fin: today,
        fecha_entrega: deliveryDate,
        firma_dirigente_b64: signatureB64,
        especialidades_definiciones: ep.especialidades_definiciones ?? undefined
      }
      await generateSpecialtyCertificate(ep.perfil || perfil, updatedEp)

      await fetchEspecialidades()
      setActiveEspecialidad(null)
    } catch (err: unknown) {
      console.error(err)
      toast.error('Error al finalizar especialidad: ' + (err as Error).message)
    }
  }, [deliveryDate, userPerfil.id, perfil, fetchEspecialidades])

  const handleMonitorApproveSpecialty = useCallback(async (epId: string, signatureB64?: string) => {
    if (!signatureB64) {
      setSigModalType('monitor');
      setSigModalTargetId(epId);
      setShowSignatureModal(true);
      return;
    }
    if (!activeEspecialidad) return

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

      await supabase.from('notificaciones').insert([{
        perfil_id: activeEspecialidad.perfil_id,
        mensaje: `¡Tu monitor ha aprobado tu especialidad "${specName}"! Esperando que los dirigentes agenden la fecha de entrega de tu insignia.`,
        tipo: 'especialidad',
        link_url: '/panel'
      }])

      const targetUnitId = activeEspecialidad.perfil?.unidad_id || perfil.unidad_id
      const { data: leaders } = await supabase
        .from('perfiles')
        .select('id')
        .in('rol_id', getRoleIds('directivos'))
        .eq('unidad_id', targetUnitId)

      if (leaders && leaders.length > 0) {
        const notifPromises = leaders.map(leader => {
          return supabase.from('notificaciones').insert([{
            perfil_id: leader.id,
            mensaje: `El monitor de ${activeEspecialidad.perfil?.nombres || 'un miembro'} ha aprobado su especialidad "${specName}". Agenda la fecha de entrega de la insignia.`,
            tipo: 'especialidad',
            link_url: '/panel'
          }])
        })
        await Promise.all(notifPromises)
      }

      toast.success('Especialidad aprobada por monitor con éxito.')
      await Promise.all([fetchEspecialidades(), refreshActiveSpecialty(epId)])
    } catch (err: unknown) {
      console.error(err)
      toast.error('Error al aprobar especialidad: ' + (err as Error).message)
    }
  }, [activeEspecialidad, perfil.unidad_id, fetchEspecialidades, refreshActiveSpecialty])

  const handleMonitorFeedbackSpecialty = useCallback(async (epId: string) => {
    if (!feedbackComment.trim()) {
      toast.warning('Por favor escribe un comentario de retroalimentación.')
      return
    }
    if (!activeEspecialidad) return

    try {
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

      await supabase.from('notificaciones').insert([{
        perfil_id: activeEspecialidad.perfil_id,
        mensaje: `Tu monitor ha dejado comentarios de mejora en tu especialidad "${specName}": "${feedbackComment}". La especialidad ha retornado a fase de Desarrollo.`,
        tipo: 'especialidad',
        link_url: '/panel'
      }])

      toast.success('Comentarios enviados. La especialidad ha retornado a Desarrollo.')
      setFeedbackComment('')
      setShowFeedbackInput(false)
      await Promise.all([fetchEspecialidades(), refreshActiveSpecialty(epId)])
    } catch (err: unknown) {
      console.error(err)
      toast.error('Error al enviar retroalimentación: ' + (err as Error).message)
    }
  }, [feedbackComment, activeEspecialidad, fetchEspecialidades, refreshActiveSpecialty])

  const handleRequestRecognition = useCallback(async (epId: string) => {
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
        .eq('id', epId)

      if (error) throw error

      const specName = activeEspecialidad?.nombre_personalizado || activeEspecialidad?.especialidades_definiciones?.nombre || 'Especialidad'

      if (activeEspecialidad?.monitor_perfil_id) {
        await supabase.from('notificaciones').insert([{
          perfil_id: activeEspecialidad.monitor_perfil_id,
          mensaje: `${perfil.nombres} ha completado su evaluación final y solicitado el reconocimiento para la especialidad "${specName}". Revisa para validar.`,
          tipo: 'especialidad',
          link_url: '/panel'
        }])
      }

      toast.success('Evaluación guardada y reconocimiento solicitado con éxito.')
      await Promise.all([fetchEspecialidades(), refreshActiveSpecialty(epId)])
    } catch (err: unknown) {
      console.error(err)
      toast.error('Error al solicitar reconocimiento: ' + (err as Error).message)
    }
  }, [finalSpecEvaluation, goalChecked, activeEspecialidad, perfil.nombres, fetchEspecialidades, refreshActiveSpecialty])

  const handleApproveSpecialtyPlanning = useCallback(async (epId: string) => {
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
      toast.error('Error al aprobar planificación: ' + error.message)
    } else {
      toast.success('Planificación aprobada. La especialidad ahora se encuentra en fase de Desarrollo.')
      await Promise.all([fetchEspecialidades(), refreshActiveSpecialty(epId)])
    }
  }, [fetchEspecialidades, refreshActiveSpecialty])

  useEffect(() => {
    if (activeEspecialidad) {
      const isDifferent = prevActiveSpecIdRef.current !== activeEspecialidad.id
      prevActiveSpecIdRef.current = activeEspecialidad.id

      const dates: Record<string, string> = {}
      activeEspecialidad.especialidades_actividades?.forEach((act: EspecialidadActividad) => {
        dates[act.id] = act.fecha_limite || ''
      })

      if (isDifferent) {
        setTaskDates(dates)
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

  return {
    subTab,
    setSubTab,
    especialidadesPersonales,
    definicionesEspecialidades,
    loadingEspecialidades,
    activeEspecialidad,
    setActiveEspecialidad,
    searchCatQuery,
    setSearchCatQuery,
    selectedFieldFilter,
    setSelectedFieldFilter,
    showSpecialtyWizard,
    setShowSpecialtyWizard,
    wizardStep,
    setWizardStep,
    wSelectedField,
    setWSelectedField,
    wSelectedDefId,
    setWSelectedDefId,
    wCustomName,
    setWCustomName,
    wMetaGeneral,
    setWMetaGeneral,
    wDiagnostico,
    setWDiagnostico,
    wMonitorName,
    setWMonitorName,
    wActivities,
    setWActivities,
    wNewActivityText,
    setWNewActivityText,
    wNewActivityDetalles,
    setWNewActivityDetalles,
    wMonitorPerfilId,
    setWMonitorPerfilId,
    wIsMonitorInterno,
    setWIsMonitorInterno,
    wMonitorSearchText,
    setWMonitorSearchText,
    showMonitorDropdown,
    setShowMonitorDropdown,
    availableMonitors,
    especialidadesSupervisadas,
    submittingEvidenceActId,
    setSubmittingEvidenceActId,
    actEvidenceText,
    setActEvidenceText,
    actEvidenceUrl,
    setActEvidenceUrl,
    reviewingActId,
    setReviewingActId,
    actReviewComment,
    setActReviewComment,
    newDetailActText,
    setNewDetailActText,
    newDetailActDetalles,
    setNewDetailActDetalles,
    wNewActivityFechaLimite,
    setWNewActivityFechaLimite,
    wNewActivityFechaActividad,
    setWNewActivityFechaActividad,
    wNewActivityRequiresCalendar,
    setWNewActivityRequiresCalendar,
    wNewActivityArticleId,
    setWNewActivityArticleId,
    wNewActivityLugar,
    setWNewActivityLugar,
    availableActivityArticles,
    actAutoevaluacionText,
    setActAutoevaluacionText,
    finalSpecEvaluation,
    setFinalSpecEvaluation,
    goalChecked,
    setGoalChecked,
    deliveryDate,
    setDeliveryDate,
    feedbackComment,
    setFeedbackComment,
    showFeedbackInput,
    setShowFeedbackInput,
    newActivityArticleTitle,
    setNewActivityArticleTitle,
    taskDates,
    setTaskDates,
    showSignatureModal,
    setShowSignatureModal,
    sigModalType,
    setSigModalType,
    sigModalTargetId,
    setSigModalTargetId,

    fetchEspecialidades,
    fetchAvailableMonitors,
    resetWizard,
    refreshActiveSpecialty,
    handleSaveSpecialty,
    handleUpdateSpecialtyInfo,
    handlePauseSpecialty,
    handleResumeSpecialty,
    handleAdvanceSpecialtyPhase,
    handleSubmitActivityEvidence,
    handleApproveActivity,
    handleReviewActivity,
    handleAddActivityToExisting,
    handleDeleteActivity,
    handleDeleteSpecialty,
    handleFinalizeSpecialty,
    handleMonitorApproveSpecialty,
    handleMonitorFeedbackSpecialty,
    handleRequestRecognition,
    handleApproveSpecialtyPlanning,
  }
}
