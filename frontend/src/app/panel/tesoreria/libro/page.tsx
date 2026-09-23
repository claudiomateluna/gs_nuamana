'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useDashboardContext } from '@/contexts/DashboardContext'
import { supabase } from '@/lib/supabase'
import type { TesoreriaMovimiento } from '@/types'

const DashTesoreria = dynamic(() => import('@/components/dashboard/sp_tesoreria_libro'), { ssr: false })
const DashModMovimiento = dynamic(() => import('@/components/dashboard/tesoreria/mod_tesoreria_movimiento'), { ssr: false })
const DashModComprobante = dynamic(() => import('@/components/dashboard/tesoreria/mod_tesoreria_comprobante'), { ssr: false })
const DashModTesoreriaVer = dynamic(() => import('@/components/dashboard/tesoreria/mod_tesoreria_ver'), { ssr: false })

export default function TesoreriaLibroPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { perfil, canSeeTeso, canActionTeso, unidades, fetchProfile, loading: ctxLoading } = useDashboardContext()
  
  const modal = searchParams.get('modal')
  const modalId = searchParams.get('id')
  
  const [movimientos, setMovimientos] = useState<TesoreriaMovimiento[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal states
  const [isModMovimientoOpen, setIsModMovimientoOpen] = useState(false)
  const [editingMov, setEditingMov] = useState<any>(null)
  
  const [isModValeOpen, setIsModValeOpen] = useState(false)
  const [isModVerOpen, setIsModVerOpen] = useState(false)
  const [viewingMov, setViewingMov] = useState<any>(null)

  const closeModal = useCallback(() => {
    setIsModMovimientoOpen(false)
    setIsModValeOpen(false)
    setIsModVerOpen(false)
    setEditingMov(null)
    setViewingMov(null)
    router.replace('/panel/tesoreria/libro')
  }, [router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await supabase.from('tesoreria_movimientos').select('*, tesoreria_items(*), unidades(nombre), registrado_por:perfiles(nombres, apellidos)').order('anio', { ascending: false }).order('mes', { ascending: false }).order('dia', { ascending: false })
        setMovimientos((data || []) as TesoreriaMovimiento[])
      } catch (err) {
        console.error('Error fetching movimientos:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle modal query params
  useEffect(() => {
    if (!perfil) return

    if (modal === 'movimiento') {
      setEditingMov(null)
      setIsModMovimientoOpen(true)
    } else if (modal === 'editar-movimiento' && modalId) {
      const mov = movimientos.find(m => m.id === modalId)
      if (mov) {
        setEditingMov(mov)
        setIsModMovimientoOpen(true)
      }
    } else if (modal === 'vale') {
      setIsModValeOpen(true)
    } else if (modal === 'ver' && modalId) {
      const mov = movimientos.find(m => m.id === modalId)
      if (mov) {
        setViewingMov(mov)
        setIsModVerOpen(true)
      }
    } else {
      // Close all modals when no modal query param
      setIsModMovimientoOpen(false)
      setIsModValeOpen(false)
      setIsModVerOpen(false)
    }
  }, [modal, modalId, movimientos, perfil])

  if (ctxLoading || loading) {
    return <div className="p-20 text-center font-body text-pclr7 dark:text-pdclr7 italic tracking-widest uppercase text-[0.8em]">Cargando...</div>
  }

  if (!perfil || !canSeeTeso) return null

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Sub-tab navigation */}
      <div className="flex bg-pclr3 dark:bg-pdclr3 p-1 rounded-2xl w-fit">
        <Link href="/panel/tesoreria/libro" className="px-6 py-2 rounded-xl text-[0.8em] font-black uppercase bg-pclr8 dark:bg-pdclr8 text-pclr12 dark:text-pdclr12 shadow-md">Libro</Link>
        <Link href="/panel/tesoreria/rendiciones" className="px-6 py-2 rounded-xl text-[0.8em] font-black uppercase text-pclr7 dark:text-pdclr7 hover:text-pclr4 dark:hover:text-pdclr4">Rendiciones</Link>
        <Link href="/panel/tesoreria/recaudaciones" className="px-6 py-2 rounded-xl text-[0.8em] font-black uppercase text-pclr7 dark:text-pdclr7 hover:text-pclr4 dark:hover:text-pdclr4">Recaudaciones</Link>
      </div>

      <DashTesoreria
        movimientos={movimientos}
        unidades={unidades}
        isAdmin={true}
        canAction={canActionTeso}
        onNuevoMovimiento={() => router.push('/panel/tesoreria/libro?modal=movimiento')}
        onEditMovimiento={(m) => { setEditingMov(m); setIsModMovimientoOpen(true) }}
        onDeleteMovimiento={async (id) => { /* TODO */ }}
        onEmitirVale={() => router.push('/panel/tesoreria/libro?modal=vale')}
        onVerMovimiento={(m) => { setViewingMov(m); setIsModVerOpen(true) }}
      />

      {/* Modales */}
      <DashModMovimiento isOpen={isModMovimientoOpen} onClose={closeModal} onSuccess={() => { fetchProfile(); closeModal() }} editingMov={editingMov} perfil={perfil} unidades={unidades} />
      <DashModComprobante isOpen={isModValeOpen} onClose={closeModal} onSuccess={() => { fetchProfile(); closeModal() }} perfil={perfil} unidades={unidades} />
      <DashModTesoreriaVer isOpen={isModVerOpen} onClose={closeModal} data={viewingMov} />
    </div>
  )
}
