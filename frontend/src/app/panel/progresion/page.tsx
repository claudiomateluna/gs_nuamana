'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useDashboardContext } from '@/contexts/DashboardContext'

export default function ProgresionPage() {
  const router = useRouter()
  const pathname = usePathname()
  const { loading } = useDashboardContext()

  // Redirect to progreso by default
  useEffect(() => {
    if (pathname === '/panel/progresion') {
      router.replace('/panel/progresion/progreso')
    }
  }, [pathname, router])

  if (loading) {
    return <div className="p-20 text-center font-body text-pclr7 dark:text-pdclr7 italic tracking-widest uppercase text-[0.8em]">Cargando...</div>
  }

  return null
}
