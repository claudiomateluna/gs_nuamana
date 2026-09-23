'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useDashboardContext } from '@/contexts/DashboardContext'

const DashCicloHistorial = dynamic(() => import('@/components/dashboard/sp_ciclo_historial'), { ssr: false })

export default function CicloHistorialPage() {
  const { perfil, directivo, loading } = useDashboardContext()

  if (loading) {
    return <div className="p-20 text-center font-body text-pclr7 dark:text-pdclr7 italic tracking-widest uppercase text-[0.8em]">Cargando...</div>
  }

  if (!perfil) return null

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Sub-tab navigation */}
      <div className="flex bg-pclr3 dark:bg-pdclr3 p-1 rounded-2xl w-fit">
        <Link href="/panel/ciclo/activo" className="px-6 py-2 rounded-xl text-[0.8em] font-black uppercase text-pclr7 dark:text-pdclr7 hover:text-pclr4 dark:hover:text-pdclr4">Ciclo Activo</Link>
        <Link href="/panel/ciclo/historial" className="px-6 py-2 rounded-xl text-[0.8em] font-black uppercase bg-pclr8 dark:bg-pdclr8 text-pclr12 dark:text-pdclr12 shadow-md">Historial</Link>
        {directivo && (
          <Link href="/panel/ciclo/otras-unidades" className="px-6 py-2 rounded-xl text-[0.8em] font-black uppercase text-pclr7 dark:text-pdclr7 hover:text-pclr4 dark:hover:text-pdclr4">Otras Unidades</Link>
        )}
      </div>

      <DashCicloHistorial perfil={perfil} />
    </div>
  )
}
