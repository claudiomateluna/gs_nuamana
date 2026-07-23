'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import DashCicloHistorial from '@/components/dashboard/sp_ciclo_historial'
import { getErrorMessage } from '@/lib/error-utils'

export default function HistorialCiclosPage() {
  const [perfil, setPerfil] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPerfil()
  }, [])

  const fetchPerfil = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: p } = await supabase
        .from('perfiles')
        .select('*, unidades(*)')
        .eq('id', user.id)
        .single()
      
      setPerfil(p)
    } catch (err: unknown) {
      console.error('Error fetching perfil for historial page:', getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-20 text-center animate-pulse uppercase font-medium text-[0.8em] tracking-widest text-clr2">
        Cargando Memoria Scout...
      </div>
    )
  }

  if (!perfil) {
    return (
      <div className="p-20 text-center uppercase font-bold text-[0.9em] text-clr2">
        No se pudo cargar el perfil de usuario.
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <DashCicloHistorial perfil={perfil} />
    </div>
  )
}
