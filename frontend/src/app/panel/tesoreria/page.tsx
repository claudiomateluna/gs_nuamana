'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useDashboardContext } from '@/contexts/DashboardContext'

export default function TesoreriaPage() {
  const router = useRouter()
  const pathname = usePathname()
  const { canSeeTeso, loading } = useDashboardContext()

  useEffect(() => {
    if (!loading && !canSeeTeso) {
      router.replace('/panel/ficha')
    }
  }, [loading, canSeeTeso, router])

  // Redirect to libro by default
  useEffect(() => {
    if (pathname === '/panel/tesoreria') {
      router.replace('/panel/tesoreria/libro')
    }
  }, [pathname, router])

  if (loading) {
    return <div className="p-20 text-center font-body text-pclr7 dark:text-pdclr7 italic tracking-widest uppercase text-[0.8em]">Cargando...</div>
  }

  return null
}
