import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Perfil, ProgresionArea } from '@/types'
import type { ProgresionObjetivo as ProgresionObjetivoBase, ProgresionAvance as ProgresionAvanceBase, ProgresionEtapa as ProgresionEtapaBase } from '@/types'
import type { AgendaPersonal } from '@/types/progresion'
import { db, ProgresionAvanceOffline } from '@/lib/db'
import { outboxService } from '@/lib/outbox-service'
import { UNIT_IDS } from '@/lib/unit-constants'
import { toast } from 'sonner'

type ProgresionObjetivo = ProgresionObjetivoBase & { texto_terminal?: string; texto_infantil?: string }
type ProgresionAvance = ProgresionAvanceBase & { valor_dirigente?: number | null }
type ProgresionEtapa = ProgresionEtapaBase & { imagen_url?: string }

interface UseDefaultProgresionProps {
  perfil: Perfil
  userPerfil: Perfil
  isOwner: boolean
  isParent: boolean
  isLeader: boolean
  agenda?: AgendaPersonal | null
}

export function useDefaultProgresion({ perfil, userPerfil, isOwner, isParent, isLeader, agenda }: UseDefaultProgresionProps) {
  const [objetivosDefault, setObjetivosDefault] = useState<ProgresionObjetivo[]>([])
  const [avanceDefault, setAvanceDefault] = useState<ProgresionAvance[]>([])
  const [todasEtapas, setTodasEtapas] = useState<ProgresionEtapa[]>([])
  const [etapaActual, setEtapaActual] = useState<ProgresionEtapa | null>(null)
  const [comentando, setComentando] = useState<string | null>(null)
  const [tempComentario, setTempComentario] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedAreas, setExpandedAreas] = useState<number[]>([])
  const [isMounted, setIsMounted] = useState(false)

  const unitName = perfil.unidades?.nombre?.toLowerCase() || ''
  const isManada = unitName.includes('manada')
  const isCompania = unitName.includes('compañía') || unitName.includes('compania')
  const isTropa = unitName.includes('tropa')
  const isAvanzada = perfil.unidad_id === UNIT_IDS.AVANZADA
  const isClan = perfil.unidad_id === UNIT_IDS.CLAN

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const fetchDefaultProgresion = useCallback(async () => {
    const { data: etapas } = await supabase
      .from('progresion_etapas')
      .select('*')
      .eq('unidad_id', perfil.unidad_id)
      .order('orden')
    setTodasEtapas(etapas || [])

    let etapa: (ProgresionEtapa & { imagen_url?: string; color?: string }) | null = null
    if (perfil.progresion_etapa_id) {
      etapa = etapas?.find(e => e.id === perfil.progresion_etapa_id) || null
    }

    if (!etapa) {
      if (isClan && agenda) {
        if (agenda.etapa_progresion === 'fuego') {
          etapa = etapas?.find(e => e.nombre.toLowerCase().includes('fuego')) || null
        } else if (agenda.etapa_progresion === 'antorcha') {
          etapa = etapas?.find(e => e.nombre.toLowerCase().includes('antorcha')) || null
        } else if (agenda.etapa_progresion === 'partida') {
          etapa = {
            id: 'partida' as unknown as number,
            unidad_id: 5,
            nombre: 'La Partida',
            rango_edad: '17 a 20 años',
            orden: 99,
            imagen_url: '/images/progresion/clan/etapa_partida.png',
            color: '#1b3f8a'
          }
        }
      }

      if (!etapa && (isClan || isAvanzada)) {
        etapa = {
          id: 'bienvenida' as unknown as number,
          unidad_id: isAvanzada ? 4 : 5,
          nombre: isAvanzada ? 'Cruz del Sur' : 'Insignia del Caminante',
          rango_edad: isAvanzada ? '15 a 17 años' : '17 a 20 años',
          orden: 0,
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
        const isTardia = (perfil.edad ?? 0) >= 9
        etapa = logradosCount >= 6 ? (isTardia ? etapas[3] : etapas[1]) : (isTardia ? etapas[2] : etapas[0])
      } else if (isCompania) {
        const isTardia = (perfil.edad ?? 0) >= 13
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
      else if (isManada) rangoParaCargar = (perfil.edad ?? 0) >= 9 ? 'Infancia Tardía' : 'Infancia Media'
      else if (isCompania) rangoParaCargar = (perfil.edad ?? 0) >= 13 ? '13 a 15 años' : '11 a 13 años'
    }

    let objsData: ProgresionObjetivo[] = []
    let avanceData: (ProgresionAvance & { valor_dirigente?: number | null })[] = []

    if (typeof window !== 'undefined' && !navigator.onLine) {
      try {
        const uId = perfil.unidad_id ?? 0
        objsData = await db.progresion_objetivos
          .where('unidad_id').equals(uId)
          .filter(obj => obj.rango_edad === rangoParaCargar)
          .toArray()

        avanceData = await db.progresion_avance
          .where('perfil_id').equals(perfil.id)
          .toArray()
      } catch (e) {
        console.error("Error cargando progresión offline:", e)
      }
    } else {
      try {
        const [oResult, aResult] = await Promise.all([
          supabase.from('progresion_objetivos')
            .select('*')
            .eq('unidad_id', perfil.unidad_id)
            .eq('rango_edad', rangoParaCargar),
          supabase.from('progresion_avance')
            .select('*')
            .eq('perfil_id', perfil.id)
        ])
        if (oResult.error) throw oResult.error
        objsData = oResult.data || []
        if (aResult.error) throw aResult.error
        avanceData = aResult.data || []
      } catch (err) {
        console.warn("Fallo carga online de progresión. Intentando local...", err)
        try {
          const uId = perfil.unidad_id ?? 0
          objsData = await db.progresion_objetivos
            .where('unidad_id').equals(uId)
            .filter(obj => obj.rango_edad === rangoParaCargar)
            .toArray()

          avanceData = await db.progresion_avance
            .where('perfil_id').equals(perfil.id)
            .toArray()
        } catch (e) {
          console.error("Error en fallback offline de progresión:", e)
        }
      }
    }

    setObjetivosDefault(objsData)
    setAvanceDefault(avanceData)
  }, [perfil, isClan, isAvanzada, isManada, isCompania, agenda])

  const handleSetEtapaDefault = async (etapaId: string) => {
    if (!isLeader) return
    const idVal = etapaId ? parseInt(etapaId) : null
    // Optimistically update UI from local state (todasEtapas ya está cargada)
    const newEtapa = todasEtapas.find(e => e.id === idVal) || null
    setEtapaActual(newEtapa)
    const { error } = await supabase.from('perfiles').update({ progresion_etapa_id: idVal }).eq('id', perfil.id)
    if (error) {
      // Si falla, revertir al valor anterior
      setEtapaActual(etapaActual)
      toast.error('Error al cambiar etapa')
    }
  }

  const handleSelfEvalDefault = async (objId: string, currentEstado: string) => {
    if (!isOwner) return
    const nuevoEstado = currentEstado === 'en_proceso' ? 'pendiente' : 'en_proceso'
    const payload = {
      perfil_id: perfil.id,
      objetivo_id: objId,
      estado: nuevoEstado
    }

    try {
      await db.progresion_avance.put({
        id: `${perfil.id}-${objId}`,
        ...payload,
        valor: null,
        valor_apoderado: null,
        comentario_apoderado: null,
        fecha_comentario_apoderado: null,
        fecha_logro: null,
        validado_por: null
      })
    } catch (e) {}

    if (typeof window !== 'undefined' && !navigator.onLine) {
      await outboxService.enqueue('progresion_avance', 'UPSERT', payload)
      fetchDefaultProgresion()
    } else {
      try {
        const { error } = await supabase.from('progresion_avance').upsert(payload, { onConflict: 'perfil_id,objetivo_id' })
        if (error) {
          await outboxService.enqueue('progresion_avance', 'UPSERT', payload)
        }
      } catch (err) {
        await outboxService.enqueue('progresion_avance', 'UPSERT', payload)
      }
      fetchDefaultProgresion()
    }
  }

  const handleSelfEvalValue = async (objId: string, value: number) => {
    if (!isOwner) return
    const existing = avanceDefault.find(a => a.objetivo_id === objId)
    const payload: Record<string, unknown> = {
      perfil_id: perfil.id,
      objetivo_id: objId,
      valor: value
    }
    if (!existing) {
      payload.estado = 'en_proceso'
    } else {
      payload.estado = existing.estado
    }

    try {
      await db.progresion_avance.put({
        id: `${perfil.id}-${objId}`,
        ...existing,
        ...payload
      } as ProgresionAvanceOffline)
    } catch (e) {}

    if (typeof window !== 'undefined' && !navigator.onLine) {
      await outboxService.enqueue('progresion_avance', 'UPSERT', payload)
      fetchDefaultProgresion()
    } else {
      try {
        const { error } = await supabase.from('progresion_avance').upsert(payload, { onConflict: 'perfil_id,objetivo_id' })
        if (error) {
          await outboxService.enqueue('progresion_avance', 'UPSERT', payload)
        }
      } catch (err) {
        await outboxService.enqueue('progresion_avance', 'UPSERT', payload)
      }
      fetchDefaultProgresion()
    }
  }

  const handleParentEvalValue = async (objId: string, value: number) => {
    if (!isParent) return
    const existing = avanceDefault.find(a => a.objetivo_id === objId)
    const payload: Record<string, unknown> = {
      perfil_id: perfil.id,
      objetivo_id: objId,
      valor_apoderado: value
    }
    if (!existing) {
      payload.estado = 'en_proceso'
    } else {
      payload.estado = existing.estado
    }

    try {
      await db.progresion_avance.put({
        id: `${perfil.id}-${objId}`,
        ...existing,
        ...payload
      } as ProgresionAvanceOffline)
    } catch (e) {}

    if (typeof window !== 'undefined' && !navigator.onLine) {
      await outboxService.enqueue('progresion_avance', 'UPSERT', payload)
      fetchDefaultProgresion()
    } else {
      try {
        const { error } = await supabase.from('progresion_avance').upsert(payload, { onConflict: 'perfil_id,objetivo_id' })
        if (error) {
          await outboxService.enqueue('progresion_avance', 'UPSERT', payload)
        }
      } catch (err) {
        await outboxService.enqueue('progresion_avance', 'UPSERT', payload)
      }
      fetchDefaultProgresion()
    }
  }

  const handleParentCommentDefault = async (objId: string) => {
    if (!isParent) return
    const existing = avanceDefault.find(a => a.objetivo_id === objId)
    const payload = {
      perfil_id: perfil.id,
      objetivo_id: objId,
      comentario_apoderado: tempComentario,
      fecha_comentario_apoderado: new Date().toISOString()
    }

    try {
      await db.progresion_avance.put({
        id: `${perfil.id}-${objId}`,
        ...existing,
        ...payload
      } as ProgresionAvanceOffline)
    } catch (e) {}

    if (typeof window !== 'undefined' && !navigator.onLine) {
      await outboxService.enqueue('progresion_avance', 'UPSERT', payload)
      setComentando(null)
      setTempComentario('')
      fetchDefaultProgresion()
    } else {
      try {
        const { error } = await supabase.from('progresion_avance').upsert(payload, { onConflict: 'perfil_id,objetivo_id' })
        if (error) {
          await outboxService.enqueue('progresion_avance', 'UPSERT', payload)
        }
      } catch (err) {
        await outboxService.enqueue('progresion_avance', 'UPSERT', payload)
      }
      setComentando(null)
      setTempComentario('')
      fetchDefaultProgresion()
    }
  }

  const handleLeaderValidateDefault = async (objId: string, currentEstado: string) => {
    if (!isLeader) return
    const nuevoEstado = currentEstado === 'logrado' ? 'en_proceso' : 'logrado'
    const existing = avanceDefault.find(a => a.objetivo_id === objId)
    const payload = {
      perfil_id: perfil.id,
      objetivo_id: objId,
      estado: nuevoEstado,
      fecha_logro: nuevoEstado === 'logrado' ? new Date().toISOString() : null,
      validado_por: userPerfil.id
    }

    try {
      await db.progresion_avance.put({
        id: `${perfil.id}-${objId}`,
        ...existing,
        ...payload
      } as ProgresionAvanceOffline)
    } catch (e) {}

    if (typeof window !== 'undefined' && !navigator.onLine) {
      await outboxService.enqueue('progresion_avance', 'UPSERT', payload)
      fetchDefaultProgresion()
    } else {
      try {
        const { error } = await supabase.from('progresion_avance').upsert(payload, { onConflict: 'perfil_id,objetivo_id' })
        if (error) {
          await outboxService.enqueue('progresion_avance', 'UPSERT', payload)
        }
      } catch (err) {
        await outboxService.enqueue('progresion_avance', 'UPSERT', payload)
      }
      fetchDefaultProgresion()
    }
  }

  const handleLeaderEvalValue = async (objId: string, value: number) => {
    if (!isLeader) return
    const existing = avanceDefault.find(a => a.objetivo_id === objId)
    const payload: Record<string, unknown> = {
      perfil_id: perfil.id,
      objetivo_id: objId,
      valor_dirigente: value,
      validado_por: userPerfil.id
    }
    if (!existing) {
      payload.estado = 'en_proceso'
    } else {
      payload.estado = existing.estado
    }

    try {
      await db.progresion_avance.put({
        id: `${perfil.id}-${objId}`,
        ...existing,
        ...payload
      } as ProgresionAvanceOffline)
    } catch (e) {}

    if (typeof window !== 'undefined' && !navigator.onLine) {
      await outboxService.enqueue('progresion_avance', 'UPSERT', payload)
      fetchDefaultProgresion()
    } else {
      try {
        const { error } = await supabase.from('progresion_avance').upsert(payload, { onConflict: 'perfil_id,objetivo_id' })
        if (error) {
          await outboxService.enqueue('progresion_avance', 'UPSERT', payload)
        }
      } catch (err) {
        await outboxService.enqueue('progresion_avance', 'UPSERT', payload)
      }
      fetchDefaultProgresion()
    }
  }

  return {
    objetivosDefault,
    avanceDefault,
    todasEtapas,
    etapaActual,
    comentando,
    setComentando,
    tempComentario,
    setTempComentario,
    searchQuery,
    setSearchQuery,
    expandedAreas,
    setExpandedAreas,
    isMounted,
    fetchDefaultProgresion,
    handleSetEtapaDefault,
    handleSelfEvalDefault,
    handleSelfEvalValue,
    handleParentEvalValue,
    handleParentCommentDefault,
    handleLeaderValidateDefault,
    handleLeaderEvalValue,
  }
}
