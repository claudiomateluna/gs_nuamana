import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { getRoleIds } from '@/lib/roles'
import type { Perfil } from '@/types'
import type { SolicitudCompetenciaConJoins, Proyecto } from '@/types/progresion'
import { toast } from 'sonner'

interface UseAvanzadaProgresionProps {
  perfil: Perfil
  userPerfil: Perfil
  isOwner: boolean
  isLeader: boolean
}

export function useAvanzadaProgresion({ perfil, userPerfil, isOwner, isLeader }: UseAvanzadaProgresionProps) {
  const [competencias, setCompetencias] = useState<SolicitudCompetenciaConJoins[]>([])
  const [avanzadaProyectos, setAvanzadaProyectos] = useState<Proyecto[]>([])
  const [showCompetenciaModal, setShowCompetenciaModal] = useState(false)
  const [selectedCompetenciaArea, setSelectedCompetenciaArea] = useState('')
  const [justificacionNnj, setJustificacionNnj] = useState('')
  const [evidenciaCompUrl, setEvidenciaCompUrl] = useState('')
  const [compProyectoId, setCompProyectoId] = useState('')
  const [editingSolicitudId, setEditingSolicitudId] = useState<string | null>(null)
  const [showDirectCompetenciaModal, setShowDirectCompetenciaModal] = useState(false)
  const [selectedDirectCompetenciaArea, setSelectedDirectCompetenciaArea] = useState('')
  const [directLeaderReviewText, setDirectLeaderReviewText] = useState('')
  const [directCompProyectoId, setDirectCompProyectoId] = useState('')
  const [leaderReviewText, setLeaderReviewText] = useState('')
  const [activeMetaIdForReview, setActiveMetaIdForReview] = useState<string | null>(null)

  const fetchAvanzadaProgresion = useCallback(async () => {
    const [solicitudesResult, projsIndResult, projsColResult] = await Promise.all([
      supabase
        .from('solicitudes_competencias')
        .select('*, proyectos(titulo), aprobado_por:perfiles!aprobado_por(nombres, apellidos)')
        .eq('perfil_id', perfil.id),
      supabase
        .from('proyectos')
        .select('*')
        .eq('perfil_id', perfil.id)
        .eq('es_grupal', false),
      supabase
        .from('proyecto_participantes')
        .select('*, proyectos(*)')
        .eq('perfil_id', perfil.id)
    ])

    setCompetencias(solicitudesResult.data || [])

    const listProjsCol = projsColResult.data?.map(p => p.proyectos).filter(Boolean) || []
    const combined = [...(projsIndResult.data || []), ...listProjsCol]
    const uniqueProjs = Array.from(new Map(combined.map(p => [p.id, p])).values())
    setAvanzadaProyectos(uniqueProjs)
  }, [perfil.id])

  const handleRequestCompetencia = async () => {
    if (!selectedCompetenciaArea) {
      { toast.warning('Por favor, selecciona un rumbo de competencia.'); return; }
    }
    if (justificacionNnj.trim().length < 150) {
      { toast.info('La justificación debe detallar tus acciones concretas con al menos 150 caracteres.'); return; }
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
        toast.error('Error al actualizar la solicitud: ' + error.message)
      } else {
        try {
          const { data: leaders } = await supabase
            .from('perfiles')
            .select('id')
            .in('rol_id', getRoleIds('directivos'))
            .eq('unidad_id', perfil.unidad_id)
            .eq('estado', 'activo')

          if (leaders && leaders.length > 0) {
            const notifs = leaders.map(leader => ({
              perfil_id: leader.id,
              mensaje: `El/la pionero/a ${perfil.nombres} ${perfil.apellidos} ha enviado correcciones para el rumbo: ${selectedCompetenciaArea.replace('_', ' ').toUpperCase()}.`,
              tipo: 'sistema',
              link_url: `/panel?perfil=${perfil.id}`
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
        toast.success('Correcciones enviadas con éxito.')
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
        toast.error('Error al enviar la solicitud: ' + error.message)
      } else {
        try {
          const { data: leaders } = await supabase
            .from('perfiles')
            .select('id')
            .in('rol_id', getRoleIds('directivos'))
            .eq('unidad_id', perfil.unidad_id)
            .eq('estado', 'activo')

          if (leaders && leaders.length > 0) {
            const notifs = leaders.map(leader => ({
              perfil_id: leader.id,
              mensaje: `El/la pionero/a ${perfil.nombres} ${perfil.apellidos} ha solicitado la validación del rumbo: ${selectedCompetenciaArea.replace('_', ' ').toUpperCase()}.`,
              tipo: 'sistema',
              link_url: `/panel?perfil=${perfil.id}`
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
    if (!leaderReviewText.trim()) { toast.warning('Por favor, escribe los fundamentos de la Reunión de Coordinadores.'); return; }

    const estadoDb = action === 'aprobar' ? 'aprobada' : action === 'pedir_cambios' ? 'solicitud_cambio' : 'rechazada'

    const { error } = await supabase
      .from('solicitudes_competencias')
      .update({
        estado: estadoDb,
        evaluacion_lider: leaderReviewText,
        aprobado_por: userPerfil.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', solicitudId)

    if (error) {
      toast.error('Error al resolver la competencia: ' + error.message)
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
          link_url: '/panel'
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
      { toast.warning('Por favor, ingresa los fundamentos de la Reunión de Coordinadores.'); return; }
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
      toast.error('Error al otorgar la competencia: ' + error.message)
    } else {
      try {
        const areaName = selectedDirectCompetenciaArea.replace('_', ' ').toUpperCase()
        await supabase.from('notificaciones').insert([{
          perfil_id: perfil.id,
          mensaje: `Se te ha otorgado el rumbo de competencia ${areaName} directamente por tu dirigente/guiadora.`,
          tipo: 'sistema',
          link_url: '/panel'
        }])
      } catch (err) {
        console.error(err)
      }

      setShowDirectCompetenciaModal(false)
      setSelectedDirectCompetenciaArea('')
      setDirectLeaderReviewText('')
      setDirectCompProyectoId('')
      fetchAvanzadaProgresion()
      toast.success('Competencia otorgada con éxito.')
    }
  }

  const handleDeleteCompetencia = async (solicitudId: string) => {
    if (!confirm('¿Estás seguro de que deseas retirar esta solicitud de competencia? Se perderá todo su historial.')) return

    const { error } = await supabase
      .from('solicitudes_competencias')
      .delete()
      .eq('id', solicitudId)

    if (error) {
      toast.error('Error al retirar la solicitud: ' + error.message)
    } else {
      fetchAvanzadaProgresion()
      toast.success('Solicitud retirada con éxito.')
    }
  }

  return {
    competencias,
    avanzadaProyectos,
    showCompetenciaModal,
    setShowCompetenciaModal,
    selectedCompetenciaArea,
    setSelectedCompetenciaArea,
    justificacionNnj,
    setJustificacionNnj,
    evidenciaCompUrl,
    setEvidenciaCompUrl,
    compProyectoId,
    setCompProyectoId,
    editingSolicitudId,
    setEditingSolicitudId,
    showDirectCompetenciaModal,
    setShowDirectCompetenciaModal,
    selectedDirectCompetenciaArea,
    setSelectedDirectCompetenciaArea,
    directLeaderReviewText,
    setDirectLeaderReviewText,
    directCompProyectoId,
    setDirectCompProyectoId,
    leaderReviewText,
    setLeaderReviewText,
    activeMetaIdForReview,
    setActiveMetaIdForReview,
    fetchAvanzadaProgresion,
    handleRequestCompetencia,
    handleLeaderReviewCompetencia,
    handleDirectDeliverCompetencia,
    handleDeleteCompetencia,
  }
}
