'use client'
import { useState, useEffect, useCallback } from 'react'
import { syncService } from '@/lib/sync-service'
import { toast } from 'sonner'
import type { Perfil } from '@/types'

export function useDashboardSync(perfil: Perfil | null) {
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)
  const [syncMessage, setSyncMessage] = useState('')
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null)

  useEffect(() => {
    if (perfil?.unidad_id) {
      try {
        const time = localStorage.getItem(`last_sync_unidad_${perfil.unidad_id}`)
        if (time) setLastSyncTime(time)
      } catch (e) {
        console.warn(e)
      }
    }
  }, [perfil])

  const handleSyncOffline = useCallback(async () => {
    if (!perfil?.unidad_id) {
      toast.error('Error: No tienes una unidad asignada para sincronizar.')
      return
    }

    setIsSyncing(true)
    setSyncProgress(5)
    setSyncMessage('Iniciando sincronizacion...')

    try {
      await syncService.syncUnitData(perfil.unidad_id, (progress, message) => {
        if (progress === -1) {
          toast.info(message)
        } else {
          setSyncProgress(progress)
          setSyncMessage(message)
        }
      })

      const now = new Date().toISOString()
      setLastSyncTime(now)
    } catch (err: unknown) {
      console.error(err)
    } finally {
      setTimeout(() => {
        setIsSyncing(false)
      }, 1200)
    }
  }, [perfil])

  return {
    isSyncing, syncProgress, syncMessage, lastSyncTime,
    handleSyncOffline,
  }
}
