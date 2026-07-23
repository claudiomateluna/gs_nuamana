import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { hasRole, Rol, getRoleIds } from '@/lib/roles'
import type { Perfil, ProgresionObjetivo as ProgresionObjetivoBase, ProgresionArea } from '@/types'
import type { AgendaPersonal, ProyectoObjetivoConJoins, Proyecto } from '@/types/progresion'
import { toast } from 'sonner'

type ProgresionObjetivo = ProgresionObjetivoBase & { texto_terminal?: string; texto_infantil?: string }

interface UseClanProgresionProps {
  perfil: Perfil
  userPerfil: Perfil
  isOwner: boolean
  isLeader: boolean
  fetchDefaultProgresion: () => Promise<void>
}

export function useClanProgresion({ perfil, userPerfil, isOwner, isLeader, fetchDefaultProgresion }: UseClanProgresionProps) {
  const [agenda, setAgenda] = useState<AgendaPersonal | null>(null)
  const [agendaObjetivos, setAgendaObjetivos] = useState<ProyectoObjetivoConJoins[]>([])
  const [clanProyectos, setClanProyectos] = useState<Proyecto[]>([])
  const [todosObjetivosClan, setTodosObjetivosClan] = useState<(ProgresionObjetivo & { progresion_areas?: ProgresionArea })[]>([])
  const [showAddGoalModal, setShowAddGoalModal] = useState(false)
  const [selectedObjId, setSelectedObjId] = useState('')
  const [metaPersonalText, setMetaPersonalText] = useState('')
  const [evidenceText, setEvidenceText] = useState('')
  const [evidenceUrl, setEvidenceUrl] = useState('')
  const [leaderReviewText, setLeaderReviewText] = useState('')
  const [activeMetaIdForEvidence, setActiveMetaIdForEvidence] = useState<string | null>(null)
  const [activeMetaIdForReview, setActiveMetaIdForReview] = useState<string | null>(null)

  const fetchClanProgresion = useCallback(async () => {
    let { data: agendaData, error: agendaErr } = await supabase
      .from('agendas_personales')
      .select('*')
      .eq('perfil_id', perfil.id)
      .maybeSingle()

    if (agendaErr) console.error(agendaErr)

    if (!agendaData && isOwner && hasRole(perfil, Rol.NNJ5)) {
      const { data: newAgenda, error: createErr } = await supabase
        .from('agendas_personales')
        .insert([{ perfil_id: perfil.id, etapa_progresion: 'ninguna' }])
        .select()
        .single()

      if (createErr) console.error(createErr)
      else agendaData = newAgenda
    }

    setAgenda(agendaData)

    const [
      metasResult,
      objsClanResult,
      projsIndResult,
      projsColResult
    ] = await Promise.all([
      agendaData
        ? supabase
            .from('proyecto_objetivos')
            .select('*, progresion_objetivos(*, progresion_areas(*)), proyectos(titulo)')
            .eq('agenda_id', agendaData.id)
        : Promise.resolve({ data: null, error: null }),
      supabase
        .from('progresion_objetivos')
        .select('*, progresion_areas(*)')
        .eq('unidad_id', 5),
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

    setAgendaObjetivos(metasResult.data || [])
    setTodosObjetivosClan(objsClanResult.data || [])

    const listProjsCol = projsColResult.data?.map(p => p.proyectos).filter(Boolean) || []
    const combined = [...(projsIndResult.data || []), ...listProjsCol]
    const uniqueProjs = Array.from(new Map(combined.map(p => [p.id, p])).values())
    setClanProyectos(uniqueProjs)
  }, [perfil, isOwner, fetchDefaultProgresion])

  const handleUpdateAgendaField = async (field: string, value: string) => {
    if (!agenda) return
    const { error } = await supabase
      .from('agendas_personales')
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq('id', agenda.id)

    if (error) {
      toast.error('Error al guardar: ' + error.message)
    } else {
      setAgenda({ ...agenda, [field]: value })
    }
  }

  const handleUpdateAgendaEtapa = async (etapa: string) => {
    if (!isLeader || !agenda) return
    const payload: Record<string, unknown> = { etapa_progresion: etapa, updated_at: new Date().toISOString() }
    const dateField = etapa === 'fuego' ? 'fecha_fuego' : etapa === 'antorcha' ? 'fecha_antorcha' : etapa === 'partida' ? 'fecha_partida' : null
    if (dateField) {
      payload[dateField] = new Date().toISOString().split('T')[0]
    }

    const { error } = await supabase
      .from('agendas_personales')
      .update(payload)
      .eq('id', agenda.id)

    if (error) {
      toast.error('Error al actualizar etapa: ' + error.message)
    } else {
      await fetchClanProgresion()
      await fetchDefaultProgresion()
    }
  }

  const handleSaveGoalMeta = async () => {
    if (!agenda) return
    if (!selectedObjId || !metaPersonalText) { toast.warning('Selecciona un objetivo y redacta tu meta.'); return; }

    const exists = agendaObjetivos.some(o => o.objetivo_id === selectedObjId)
    if (exists) { toast.info('Este objetivo ya se encuentra en tu Agenda de Vida.'); return; }

    const { error } = await supabase
      .from('proyecto_objetivos')
      .insert([{
        agenda_id: agenda.id,
        objetivo_id: selectedObjId,
        meta_personal: metaPersonalText,
        estado: 'pendiente'
      }])

    if (error) {
      toast.error('Error al agregar meta: ' + error.message)
    } else {
      setShowAddGoalModal(false)
      setSelectedObjId('')
      setMetaPersonalText('')
      fetchClanProgresion()
    }
  }

  const handleRegisterGoalEvidence = async (metaId: string) => {
    if (evidenceText.trim().length < 150) {
      { toast.info('La evidencia debe tener al menos 150 caracteres para garantizar un reporte serio y completo.'); return; }
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
      toast.error('Error al guardar evidencia: ' + error.message)
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
            mensaje: `El/la caminante ${perfil.nombres} ${perfil.apellidos} ha subido evidencia para evaluar un objetivo de su Agenda de Vida.`,
            tipo: 'sistema',
            link_url: `/panel?perfil=${perfil.id}`
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
    if (!leaderReviewText) { toast.warning('Por favor, redacta un comentario pedagógico sobre la evaluación.'); return; }

    const { error } = await supabase
      .from('proyecto_objetivos')
      .update({
        estado: approve ? 'alcanzado' : 'pendiente',
        evaluacion_lider: leaderReviewText,
        updated_at: new Date().toISOString()
      })
      .eq('id', metaId)

    if (error) {
      toast.error('Error al evaluar meta: ' + error.message)
    } else {
      try {
        await supabase.from('notificaciones').insert([{
          perfil_id: perfil.id,
          mensaje: approve
            ? `Tu objetivo personal de la Agenda de Vida ha sido evaluado como ALCANZADO.`
            : `Tu objetivo personal de la Agenda de Vida ha recibido comentarios pedagógicos de tu dirigente/guiadora.`,
          tipo: 'sistema',
          link_url: '/panel'
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

    if (error) toast.error('Error al eliminar: ' + error.message)
    else fetchClanProgresion()
  }

  return {
    agenda,
    setAgenda,
    agendaObjetivos,
    clanProyectos,
    todosObjetivosClan,
    showAddGoalModal,
    setShowAddGoalModal,
    selectedObjId,
    setSelectedObjId,
    metaPersonalText,
    setMetaPersonalText,
    evidenceText,
    setEvidenceText,
    evidenceUrl,
    setEvidenceUrl,
    leaderReviewText,
    setLeaderReviewText,
    activeMetaIdForEvidence,
    setActiveMetaIdForEvidence,
    activeMetaIdForReview,
    setActiveMetaIdForReview,
    fetchClanProgresion,
    handleUpdateAgendaField,
    handleUpdateAgendaEtapa,
    handleSaveGoalMeta,
    handleRegisterGoalEvidence,
    handleLeaderReviewGoal,
    handleDeleteGoal,
  }
}
