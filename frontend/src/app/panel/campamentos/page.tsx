'use client'

import dynamic from 'next/dynamic'
import { useDashboardContext } from '@/contexts/DashboardContext'
import { canSeeAllTabs, isInactive } from '@/lib/roles'

const DashCampamentosHub = dynamic(
  () => import('@/components/dashboard/campamentos/DashCampamentosHub').then(m => m.DashCampamentosHub),
  { ssr: false }
)

export default function CampamentosPage() {
  const { perfil, loading: ctxLoading } = useDashboardContext()

  if (ctxLoading) {
    return (
      <div className="p-20 text-center font-body text-pclr7 dark:text-pdclr7 italic tracking-widest uppercase text-[0.8em]">
        Cargando preparaciones de campamento...
      </div>
    )
  }

  if (!perfil || !canSeeAllTabs(perfil) || isInactive(perfil)) {
    return (
      <div className="p-20 text-center font-body text-pclr7 dark:text-pdclr7 italic tracking-widest uppercase text-[0.8em]">
        Sin acceso a la planificación de campamentos.
      </div>
    )
  }

  return <DashCampamentosHub />
}
