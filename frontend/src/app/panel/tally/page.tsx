'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useDashboardContext } from '@/contexts/DashboardContext'
import { supabase } from '@/lib/supabase'
import { isInactive } from '@/lib/roles'
import type { Bitacora } from '@/types'

const DashTally = dynamic(() => import('@/components/dashboard/p_tally'), { ssr: false })
const DashModBitacoraCrear = dynamic(() => import('@/components/dashboard/tally/mod_tally_crear'), { ssr: false })
const DashModBitacoraVer = dynamic(() => import('@/components/dashboard/tally/mod_tally_ver'), { ssr: false })

export default function TallyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { perfil, directivo, nnj, fetchProfile, loading: ctxLoading } = useDashboardContext()
  
  const modal = searchParams.get('modal')
  const modalId = searchParams.get('id')
  
  const [loading, setLoading] = useState(true)
  const [tallyRefreshKey, setTallyRefreshKey] = useState(0)
  
  // Modal states
  const [isModCrearOpen, setIsModCrearOpen] = useState(false)
  const [editingBitacora, setEditingBitacora] = useState<any>(null)
  
  const [isModVerOpen, setIsModVerOpen] = useState(false)
  const [viewingBitacora, setViewingBitacora] = useState<any>(null)

  const closeModal = useCallback(() => {
    setIsModCrearOpen(false)
    setIsModVerOpen(false)
    setEditingBitacora(null)
    setViewingBitacora(null)
    router.replace('/panel/tally')
  }, [router])

  useEffect(() => {
    setLoading(false)
  }, [])

  // Handle modal query params
  useEffect(() => {
    if (!perfil) return

    if (modal === 'nueva') {
      setEditingBitacora(null)
      setIsModCrearOpen(true)
    } else if (modal === 'ver' && modalId) {
      // Fetch the bitacora entry
      supabase.from('bitacoras_unidad').select('*').eq('id', modalId).single()
        .then(({ data }) => {
          if (data) {
            setViewingBitacora(data)
            setIsModVerOpen(true)
          }
        })
    } else {
      // Close all modals when no modal query param
      setIsModCrearOpen(false)
      setIsModVerOpen(false)
    }
  }, [modal, modalId, perfil])

  const handleDeleteBitacora = async (id: string) => {
    // TODO: implement
  }

  if (ctxLoading || loading) {
    return <div className="p-20 text-center font-body text-pclr7 dark:text-pdclr7 italic tracking-widest uppercase text-[0.8em]">Cargando...</div>
  }

  if (!perfil) return null

  return (
    <div className="animate-in fade-in duration-500">
      <DashTally
        perfil={perfil}
        refreshKey={tallyRefreshKey}
        onNuevaEntrada={() => router.push('/panel/tally?modal=nueva')}
        onEditEntrada={(b) => { setEditingBitacora(b); setIsModCrearOpen(true) }}
        onVerEntrada={(b) => { setViewingBitacora(b); setIsModVerOpen(true) }}
        onDelete={handleDeleteBitacora}
      />

      {/* Modales */}
      <DashModBitacoraCrear isOpen={isModCrearOpen} onClose={closeModal} perfil={perfil} onSuccess={() => { fetchProfile(); setTallyRefreshKey(k => k + 1); closeModal() }} editingBitacora={editingBitacora} />
      <DashModBitacoraVer isOpen={isModVerOpen} onClose={closeModal} bitacora={viewingBitacora} />
    </div>
  )
}
