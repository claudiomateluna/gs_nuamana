'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useDashboardContext } from '@/contexts/DashboardContext'
import { canSeeAllTabs, isApoderado } from '@/lib/roles'
import type { Perfil } from '@/types'

const DashmodProgresion = dynamic(() => import('@/components/dashboard/p_progresion'), { ssr: false })

export default function ProgresionProgresoPage() {
  const { perfil, directivo, nnj, miembrosUnidad, pupilos, loading } = useDashboardContext()
  
  const [selectedProgresionPerfil, setSelectedProgresionPerfil] = useState<Perfil | null>(null)

  // Auto-select profile for NNJ users
  useEffect(() => {
    if (nnj && perfil) {
      setSelectedProgresionPerfil(perfil)
    }
  }, [nnj, perfil])

  if (loading) {
    return <div className="p-20 text-center font-body text-pclr7 dark:text-pdclr7 italic tracking-widest uppercase text-[0.8em]">Cargando...</div>
  }

  if (!perfil) return null

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Profile selector for leaders/apoderados */}
      {(directivo || isApoderado(perfil)) && (
        <div className="p-4 bg-pclr3 dark:bg-pdclr3 rounded-[2rem] flex flex-wrap gap-2 items-center">
          <span className="text-[0.8em] font-black uppercase text-pclr7 dark:text-pdclr7 ml-4">Ver Progresion de:</span>
          {(isApoderado(perfil) 
            ? pupilos 
            : miembrosUnidad.filter(m => (m.rol_id ?? 0) > 8)
          ).map(m => (
            <button 
              key={m.id} 
              onClick={() => setSelectedProgresionPerfil(m)}
              className={`px-4 py-2 rounded-xl text-[0.8em] font-black uppercase transition-all ${selectedProgresionPerfil?.id === m.id ? 'bg-pclr8 dark:bg-pdclr8 text-pclr12 dark:text-pdclr12 shadow-md' : 'bg-pclr1 dark:bg-pdclr1 text-pclr4 dark:text-pdclr4'}`}
            >
              {m.nombres}
            </button>
          ))}
          {nnj && (
            <button 
              onClick={() => setSelectedProgresionPerfil(perfil)}
              className={`px-4 py-2 rounded-xl text-[0.8em] font-black uppercase transition-all ${selectedProgresionPerfil?.id === perfil.id ? 'bg-pclr8 dark:bg-pdclr8 text-pclr12 dark:text-pdclr12 shadow-md' : 'bg-pclr1 dark:bg-pdclr1 text-pclr4 dark:text-pdclr4'}`}
            >
              Mi Progresion
            </button>
          )}
        </div>
      )}

      {/* Progression content */}
      {(selectedProgresionPerfil || nnj || directivo || !canSeeAllTabs(perfil)) ? (
        <DashmodProgresion 
          perfil={selectedProgresionPerfil || perfil} 
          userPerfil={perfil} 
        />
      ) : (
        <div className="p-20 text-center border-2 border-dashed rounded-[3rem] opacity-40 border-pclr13 dark:border-pdclr13">
          <p className="italic uppercase tracking-widest text-[0.8em] text-pclr7 dark:text-pdclr7">Selecciona un beneficiario para ver su Camino de Seeonee.</p>
        </div>
      )}
    </div>
  )
}
