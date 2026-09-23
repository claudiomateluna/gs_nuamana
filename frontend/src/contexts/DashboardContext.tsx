'use client'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { fetchDashboardData } from '@/services/dashboardService'
import { db } from '@/lib/db'
import { isDirectivo, isNNJ, canSeeTreasury, canActionTreasury } from '@/lib/roles'
import type { Perfil, Unidad } from '@/types'

interface DashboardContextType {
  // Core data
  perfil: Perfil | null
  loading: boolean
  unidades: Unidad[]
  roles: Array<{ id: number; name: string }>
  miembrosUnidad: Perfil[]
  pupilos: Perfil[]
  
  // Permissions
  directivo: boolean
  nnj: boolean
  canSeeUnits: boolean
  canSeeTeso: boolean
  canActionTeso: boolean
  
  // Actions
  fetchProfile: () => Promise<void>
  lastSyncTime: string | null
}

const DashboardContext = createContext<DashboardContextType | null>(null)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [loading, setLoading] = useState(true)
  const [unidades, setUnidades] = useState<Unidad[]>([])
  const [roles, setRoles] = useState<Array<{ id: number; name: string }>>([])
  const [miembrosUnidad, setMiembrosUnidad] = useState<Perfil[]>([])
  const [pupilos, setPupilos] = useState<Perfil[]>([])
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null)

  const directivo = perfil ? isDirectivo(perfil) : false
  const nnj = perfil ? isNNJ(perfil) : false
  const canSeeUnits = directivo
  const canSeeTeso = perfil ? canSeeTreasury(perfil) : false
  const canActionTeso = perfil ? canActionTreasury(perfil) : false

  const fetchProfile = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) { window.location.href = '/login'; return }

      const data = await fetchDashboardData(user.id)
      setPerfil(data.perfil)
      setUnidades(data.unidades)
      setRoles(data.roles)
      setMiembrosUnidad(data.miembrosUnidad)
      setPupilos(data.pupilos)
      setLastSyncTime(new Date().toISOString())
    } catch (err) {
      console.warn('Error fetching profile:', err)
      // Fallback to IndexedDB
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const localPerfil = await db.perfiles.get(session.user.id)
        if (localPerfil) setPerfil(localPerfil as Perfil)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return (
    <DashboardContext.Provider value={{
      perfil,
      loading,
      unidades,
      roles,
      miembrosUnidad,
      pupilos,
      directivo,
      nnj,
      canSeeUnits,
      canSeeTeso,
      canActionTeso,
      fetchProfile,
      lastSyncTime,
    }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboardContext() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboardContext must be used within DashboardProvider')
  return ctx
}
