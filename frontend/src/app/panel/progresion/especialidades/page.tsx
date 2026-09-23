'use client'

import dynamic from 'next/dynamic'
import { useDashboardContext } from '@/contexts/DashboardContext'

const DashmodProgresion = dynamic(() => import('@/components/dashboard/p_progresion'), { ssr: false })

export default function ProgresionEspecialidadesPage() {
  const { perfil, loading } = useDashboardContext()

  if (loading) {
    return <div className="p-20 text-center font-body text-pclr7 dark:text-pdclr7 italic tracking-widest uppercase text-[0.8em]">Cargando...</div>
  }

  if (!perfil) return null

  return (
    <DashmodProgresion 
      perfil={perfil} 
      userPerfil={perfil} 
    />
  )
}
