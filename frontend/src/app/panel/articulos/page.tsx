'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useDashboardContext } from '@/contexts/DashboardContext'
import { supabase } from '@/lib/supabase'
import { isInactive } from '@/lib/roles'
import type { Articulo } from '@/types'

const DashBitacoras = dynamic(() => import('@/components/dashboard/p_articulos'), { ssr: false })

export default function ArticulosPage() {
  const { perfil, directivo, nnj, fetchProfile, loading: ctxLoading } = useDashboardContext()
  
  const [articulos, setArticulos] = useState<Articulo[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('todos')

  useEffect(() => {
    const fetchData = async () => {
      try {
        let query = supabase.from('articulos').select('*').order('created_at', { ascending: false })
        
        if (!directivo && nnj && perfil?.id) {
          query = query.eq('autor_id', perfil.id)
        }
        
        const { data } = await query
        setArticulos((data || []) as Articulo[])
      } catch (err) {
        console.error('Error fetching articulos:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [directivo, nnj, perfil?.id])

  if (ctxLoading || loading) {
    return <div className="p-20 text-center font-body text-pclr7 dark:text-pdclr7 italic tracking-widest uppercase text-[0.8em]">Cargando...</div>
  }

  if (!perfil) return null

  return (
    <div className="animate-in fade-in duration-500">
      <DashBitacoras
        articulos={articulos}
        filter={filter}
        setFilter={setFilter}
        onDelete={async (id) => { /* TODO */ }}
        isAdmin={directivo}
        inactive={isInactive(perfil)}
      />
    </div>
  )
}
