'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useDashboardContext } from '@/contexts/DashboardContext'
import { supabase } from '@/lib/supabase'
import { canSeeAllTabs, isInactive } from '@/lib/roles'
import type { InventarioItem } from '@/types'

const DashInventario = dynamic(() => import('@/components/dashboard/p_inventario'), { ssr: false })
const DashModInventarioItem = dynamic(() => import('@/components/dashboard/inventario/mod_inventario_item'), { ssr: false })

export default function InventarioPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { perfil, directivo, unidades, fetchProfile, loading: ctxLoading } = useDashboardContext()
  
  const modal = searchParams.get('modal')
  const modalId = searchParams.get('id')
  
  const [inventario, setInventario] = useState<InventarioItem[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal states
  const [isModOpen, setIsModOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  const closeModal = useCallback(() => {
    setIsModOpen(false)
    setEditingItem(null)
    router.replace('/panel/inventario')
  }, [router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await supabase.from('inventario').select('*, unidades(nombre)').order('nombre')
        setInventario((data || []) as InventarioItem[])
      } catch (err) {
        console.error('Error fetching inventario:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle modal query params
  useEffect(() => {
    if (!perfil) return

    if (modal === 'nuevo') {
      setEditingItem(null)
      setIsModOpen(true)
    } else if (modal === 'editar' && modalId) {
      const item = inventario.find(i => i.id === modalId)
      if (item) {
        setEditingItem(item)
        setIsModOpen(true)
      }
    } else {
      // Close all modals when no modal query param
      setIsModOpen(false)
    }
  }, [modal, modalId, inventario, perfil])

  const handleDeleteInventory = async (id: string) => {
    // TODO: implement
  }

  if (ctxLoading || loading) {
    return <div className="p-20 text-center font-body text-pclr7 dark:text-pdclr7 italic tracking-widest uppercase text-[0.8em]">Cargando...</div>
  }

  if (!perfil || !canSeeAllTabs(perfil) || isInactive(perfil)) {
    return <div className="p-20 text-center font-body text-pclr7 dark:text-pdclr7 italic tracking-widest uppercase text-[0.8em]">Sin acceso</div>
  }

  return (
    <div className="animate-in fade-in duration-500">
      <DashInventario
        items={inventario}
        isAdmin={directivo}
        onEdit={(item) => { setEditingItem(item); setIsModOpen(true) }}
        onDelete={handleDeleteInventory}
        onNuevo={() => router.push('/panel/inventario?modal=nuevo')}
      />

      {/* Modal */}
      <DashModInventarioItem isOpen={isModOpen} onClose={closeModal} onSuccess={() => { fetchProfile(); closeModal() }} editingItem={editingItem} perfil={perfil} unidades={unidades} />
    </div>
  )
}
