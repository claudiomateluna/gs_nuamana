'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useDashboardContext } from '@/contexts/DashboardContext'
import { supabase } from '@/lib/supabase'
import type { Rendicion } from '@/types'

const DashRendiciones = dynamic(() => import('@/components/dashboard/sp_tesoreria_rendiciones'), { ssr: false })
const DashModRendicionCrear = dynamic(() => import('@/components/dashboard/tesoreria/mod_tesoreria_rendicion_crear'), { ssr: false })
const DashModRendicionVer = dynamic(() => import('@/components/dashboard/tesoreria/mod_tesoreria_rendicion_ver'), { ssr: false })

export default function TesoreriaRendicionesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { perfil, canActionTeso, unidades, fetchProfile, loading: ctxLoading } = useDashboardContext()
  
  const modal = searchParams.get('modal')
  const modalId = searchParams.get('id')
  
  const [rendiciones, setRendiciones] = useState<Rendicion[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal states
  const [isModCrearOpen, setIsModCrearOpen] = useState(false)
  const [isModVerOpen, setIsModVerOpen] = useState(false)
  const [viewingRendicion, setViewingRendicion] = useState<any>(null)

  const closeModal = useCallback(() => {
    setIsModCrearOpen(false)
    setIsModVerOpen(false)
    setViewingRendicion(null)
    router.replace('/panel/tesoreria/rendiciones')
  }, [router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await supabase.from('tesoreria_rendiciones').select('*, unidades(nombre)').order('created_at', { ascending: false })
        setRendiciones((data || []) as Rendicion[])
      } catch (err) {
        console.error('Error fetching rendiciones:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle modal query params
  useEffect(() => {
    if (!perfil) return

    if (modal === 'nueva') {
      setIsModCrearOpen(true)
    } else if (modal === 'ver' && modalId) {
      const rendicion = rendiciones.find(r => r.id === modalId)
      if (rendicion) {
        setViewingRendicion(rendicion)
        setIsModVerOpen(true)
      }
    } else {
      // Close all modals when no modal query param
      setIsModCrearOpen(false)
      setIsModVerOpen(false)
    }
  }, [modal, modalId, rendiciones, perfil])

  if (ctxLoading || loading) {
    return <div className="p-20 text-center font-body text-pclr7 dark:text-pdclr7 italic tracking-widest uppercase text-[0.8em]">Cargando...</div>
  }

  if (!perfil) return null

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Sub-tab navigation */}
      <div className="flex bg-pclr3 dark:bg-pdclr3 p-1 rounded-2xl w-fit">
        <Link href="/panel/tesoreria/libro" className="px-6 py-2 rounded-xl text-[0.8em] font-black uppercase text-pclr7 dark:text-pdclr7 hover:text-pclr4 dark:hover:text-pdclr4">Libro</Link>
        <Link href="/panel/tesoreria/rendiciones" className="px-6 py-2 rounded-xl text-[0.8em] font-black uppercase bg-pclr8 dark:bg-pdclr8 text-pclr12 dark:text-pdclr12 shadow-md">Rendiciones</Link>
        <Link href="/panel/tesoreria/recaudaciones" className="px-6 py-2 rounded-xl text-[0.8em] font-black uppercase text-pclr7 dark:text-pdclr7 hover:text-pclr4 dark:hover:text-pdclr4">Recaudaciones</Link>
      </div>

      <DashRendiciones
        rendiciones={rendiciones}
        isAdmin={canActionTeso}
        onNueva={() => router.push('/panel/tesoreria/rendiciones?modal=nueva')}
        onVer={(r) => { setViewingRendicion(r); setIsModVerOpen(true) }}
        onDelete={async (id) => { /* TODO */ }}
      />

      {/* Modales */}
      <DashModRendicionCrear isOpen={isModCrearOpen} onClose={closeModal} onSuccess={() => { fetchProfile(); closeModal() }} perfil={perfil} unidades={unidades} />
      <DashModRendicionVer isOpen={isModVerOpen} onClose={closeModal} rendicion={viewingRendicion} perfil={perfil} />
    </div>
  )
}
