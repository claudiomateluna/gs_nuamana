'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useDashboardContext } from '@/contexts/DashboardContext'
import { supabase } from '@/lib/supabase'
import type { Perfil, Acta } from '@/types'

const DashActas = dynamic(() => import('@/components/dashboard/p_actas'), { ssr: false })
const DashModActaCrear = dynamic(() => import('@/components/dashboard/actas/mod_actas_crear'), { ssr: false })
const DashModActaVer = dynamic(() => import('@/components/dashboard/actas/mod_actas_ver'), { ssr: false })

export default function ActasPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { perfil, fetchProfile, loading: ctxLoading } = useDashboardContext()
  
  const modal = searchParams.get('modal')
  const modalId = searchParams.get('id')
  
  const [actas, setActas] = useState<Acta[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal states
  const [isModCrearOpen, setIsModCrearOpen] = useState(false)
  const [editingActa, setEditingActa] = useState<any>(null)
  
  const [isModVerOpen, setIsModVerOpen] = useState(false)
  const [viewingActa, setViewingActa] = useState<any>(null)

  const closeModal = useCallback(() => {
    setIsModCrearOpen(false)
    setIsModVerOpen(false)
    setEditingActa(null)
    setViewingActa(null)
    router.replace('/panel/actas')
  }, [router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await supabase.from('actas').select('*, unidades(nombre), acta_temas(*), mi_firma:acta_firmas!acta_firmas_acta_id_fkey(*)').eq('acta_firmas.perfil_id', perfil?.id).order('fecha', { ascending: false })
        setActas((data || []) as Acta[])
      } catch (err) {
        console.error('Error fetching actas:', err)
      } finally {
        setLoading(false)
      }
    }

    if (perfil?.id) fetchData()
  }, [perfil?.id])

  // Handle modal query params
  useEffect(() => {
    if (!perfil) return

    if (modal === 'nueva') {
      setEditingActa(null)
      setIsModCrearOpen(true)
    } else if (modal === 'ver' && modalId) {
      const acta = actas.find(a => a.id === modalId)
      if (acta) {
        setViewingActa(acta)
        setIsModVerOpen(true)
      }
    } else {
      // Close all modals when no modal query param
      setIsModCrearOpen(false)
      setIsModVerOpen(false)
    }
  }, [modal, modalId, actas, perfil])

  const loadActaDetails = async (acta: any) => {
    setViewingActa(acta)
    setIsModVerOpen(true)
  }

  if (ctxLoading || loading) {
    return <div className="p-20 text-center font-body text-pclr7 dark:text-pdclr7 italic tracking-widest uppercase text-[0.8em]">Cargando...</div>
  }

  if (!perfil) return null

  return (
    <div className="animate-in fade-in duration-500">
      <DashActas
        actas={actas}
        perfil={perfil}
        onNuevaActa={() => router.push('/panel/actas?modal=nueva')}
        onEditActa={(a) => { setEditingActa(a); setIsModCrearOpen(true) }}
        onSign={async (actaId) => { /* TODO */ }}
        onVerActa={loadActaDetails}
        onDelete={async (actaId) => { /* TODO */ }}
      />

      {/* Modales */}
      <DashModActaCrear isOpen={isModCrearOpen} onClose={closeModal} perfil={perfil} miembrosUnidad={[]} onSuccess={() => { fetchProfile(); closeModal() }} editingActa={editingActa} />
      <DashModActaVer isOpen={isModVerOpen} onClose={closeModal} acta={viewingActa} />
    </div>
  )
}
