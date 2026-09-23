'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useDashboardContext } from '@/contexts/DashboardContext'

export default function CicloPage() {
  const router = useRouter()
  const pathname = usePathname()
  const { directivo, nnj, loading } = useDashboardContext()

  useEffect(() => {
    if (!loading && !directivo && !nnj) {
      router.replace('/panel/ficha')
    }
  }, [loading, directivo, nnj, router])

  // Redirect to activo by default
  useEffect(() => {
    if (pathname === '/panel/ciclo') {
      router.replace('/panel/ciclo/activo')
    }
  }, [pathname, router])

  if (loading) {
    return <div className="p-20 text-center font-body text-pclr7 dark:text-pdclr7 italic tracking-widest uppercase text-[0.8em]">Cargando...</div>
  }

  return null
}
