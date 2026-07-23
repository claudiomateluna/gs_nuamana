'use client'
import { useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import type { Perfil, Acta } from '@/types'

interface UseDashboardActionsParams {
  perfil: Perfil | null
  fetchProfile: () => Promise<void>
  setViewingActa: (acta: Acta | null) => void
  setIsModActaVerOpen: (open: boolean) => void
  setIsModAutorizacionOpen: (open: boolean) => void
  setTargetAuthProfile: (p: Perfil | null) => void
}

export function useDashboardActions({
  perfil,
  fetchProfile,
  setViewingActa,
  setIsModActaVerOpen,
  setIsModAutorizacionOpen,
  setTargetAuthProfile,
}: UseDashboardActionsParams) {
  const handleOpenWizard = useCallback((p: Perfil | null) => {
    setTargetAuthProfile(p || perfil)
    setIsModAutorizacionOpen(true)
  }, [perfil, setIsModAutorizacionOpen, setTargetAuthProfile])

  const handleCloseWizard = useCallback(() => {
    setIsModAutorizacionOpen(false)
    setTargetAuthProfile(null)
  }, [setIsModAutorizacionOpen, setTargetAuthProfile])

  const handleSignActa = useCallback(async (actaId: string) => {
    await supabase.from('acta_firmas').upsert({ acta_id: actaId, perfil_id: perfil!.id, firmado: true, fecha_firma: new Date().toISOString() }, { onConflict: 'acta_id,perfil_id' })
    fetchProfile()
    toast.success('Firmado.')
  }, [perfil, fetchProfile])

  const handleDeleteActa = useCallback(async (id: string) => {
    if (confirm('Seguro que deseas eliminar esta acta?')) {
      try {
        const { data: acta } = await supabase.from('actas').select('*').eq('id', id).single()
        const { data: parts } = await supabase.from('acta_participantes').select('perfil_id').eq('acta_id', id).neq('asistencia', 'No Invitado')

        if (acta && parts && parts.length > 0) {
          const actorName = `${perfil!.nombres} ${perfil!.apellidos}`
          const msg = `${actorName} ha eliminado el acta ${acta.codigo} (${acta.tipo}) del ${acta.fecha}.`

          const notifs = parts.map(p => ({
            perfil_id: p.perfil_id,
            mensaje: msg,
            tipo: 'sistema',
            link_url: '/panel'
          }))

          await supabase.from('notificaciones').insert(notifs)
        }
      } catch (err) {
        console.error('Error enviando notificaciones de eliminacion de acta:', err)
      }

      await supabase.from('actas').delete().eq('id', id)
      fetchProfile()
    }
  }, [perfil, fetchProfile])

  const handleDeleteArticulo = useCallback(async (id: string) => {
    if (confirm('Eliminar?')) { await supabase.from('articulos').delete().eq('id', id); fetchProfile() }
  }, [fetchProfile])

  const handleDeleteInventory = useCallback(async (id: string) => {
    if (confirm('Eliminar?')) { await supabase.from('inventario').delete().eq('id', id); fetchProfile() }
  }, [fetchProfile])

  const handleDeleteMov = useCallback(async (id: string) => {
    if (confirm('Eliminar?')) { await supabase.from('tesoreria_movimientos').delete().eq('id', id); fetchProfile() }
  }, [fetchProfile])

  const handleDeleteRendicion = useCallback(async (id: string) => {
    if (confirm('Eliminar esta rendicion?')) { await supabase.from('tesoreria_rendiciones').delete().eq('id', id); fetchProfile() }
  }, [fetchProfile])

  const handleDeleteBitacora = useCallback(async (id: string) => {
    if (confirm('Eliminar esta historia?')) { await supabase.from('bitacoras_unidad').delete().eq('id', id); fetchProfile() }
  }, [fetchProfile])

  const handleDeleteUser = useCallback(async (u: Perfil) => {
    if (confirm(`Estas seguro de que deseas eliminar permanentemente al usuario ${u.nombres} ${u.apellidos}? Esta accion no se puede deshacer.`)) {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const response = await fetch('/api/admin/delete-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`
          },
          body: JSON.stringify({ targetUserId: u.id })
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || 'Error al eliminar usuario')
        toast.success('Usuario eliminado con exito.')
        fetchProfile()
      } catch (err: unknown) {
        toast.error(`Error: ${(err as Error).message}`)
      }
    }
  }, [fetchProfile])

  const loadActaDetails = useCallback(async (acta: Acta) => {
    const [p, t, f, a] = await Promise.all([
      supabase.from('acta_participantes').select('*, perfiles(nombres, apellidos)').eq('acta_id', acta.id),
      supabase.from('acta_temas').select('*').eq('acta_id', acta.id).order('orden'),
      supabase.from('acta_firmas').select('*, perfiles(nombres, apellidos)').eq('acta_id', acta.id),
      supabase.from('acta_acuerdos').select('*, responsable:perfiles(nombres, apellidos)').eq('acta_id', acta.id)
    ])
    setViewingActa({ ...acta, participantes: p.data || [], temas: t.data || [], firmas: f.data || [], acuerdos: a.data || [] } as Acta)
    setIsModActaVerOpen(true)
  }, [setViewingActa, setIsModActaVerOpen])

  const markNotifRead = useCallback(async (id: string) => {
    await supabase.from('notificaciones').update({ leido: true }).eq('id', id)
    fetchProfile()
  }, [fetchProfile])

  return {
    fetchProfile,
    handleOpenWizard,
    handleCloseWizard,
    handleSignActa,
    handleDeleteActa,
    handleDeleteArticulo,
    handleDeleteInventory,
    handleDeleteMov,
    handleDeleteRendicion,
    handleDeleteBitacora,
    handleDeleteUser,
    loadActaDetails,
    markNotifRead,
  }
}
