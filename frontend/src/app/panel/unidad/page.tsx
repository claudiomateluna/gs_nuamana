'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useDashboardContext } from '@/contexts/DashboardContext'
import { supabase } from '@/lib/supabase'
import { db } from '@/lib/db'
import type { Perfil, ActividadProgramada, AutorizacionActividad } from '@/types'

const DashUnidad = dynamic(() => import('@/components/dashboard/p_unidad'), { ssr: false })
const DashSalidasManager = dynamic(() => import('@/components/dashboard/salidas/DashSalidasManager'), { ssr: false })
const DashModVerFicha = dynamic(() => import('@/components/dashboard/inicio/mod_inicio_ver_ficha'), { ssr: false })
const DashModPerfil = dynamic(() => import('@/components/dashboard/inicio/mod_inicio_perfil'), { ssr: false })
const DashModAutorizacionVer = dynamic(() => import('@/components/dashboard/autorizacion/mod_autorizacion_ver'), { ssr: false })
const DashModActividadCrear = dynamic(() => import('@/components/dashboard/unidad/mod_unidad_actividad_crear'), { ssr: false })

export default function UnidadPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const { perfil, directivo, roles, unidades, fetchProfile, loading: ctxLoading } = useDashboardContext()
  
  const [activeTab, setActiveTab] = useState<'nomina' | 'salidas'>(
    tabParam === 'salidas' ? 'salidas' : 'nomina'
  )
  const [selectedMenuActId, setSelectedMenuActId] = useState<string | null>(null)
  const [miembros, setMiembros] = useState<Perfil[]>([])
  const [actividades, setActividades] = useState<ActividadProgramada[]>([])
  const [autorizaciones, setAutorizaciones] = useState<AutorizacionActividad[]>([])
  const [loading, setLoading] = useState(true)
  const [isOffline, setIsOffline] = useState(false)
  
  // Modal states
  const [isModVerFichaOpen, setIsModVerFichaOpen] = useState(false)
  const [viewingFicha, setViewingFicha] = useState<Perfil | null>(null)
  
  const [isModPerfilOpen, setIsModPerfilOpen] = useState(false)
  const [editingPupilo, setEditingPupilo] = useState<Perfil | null>(null)
  const [editData, setEditData] = useState<Partial<Perfil>>({})
  const [editContactos, setEditContactos] = useState<any[]>([])
  
  const [isModAutorizacionVerOpen, setIsModAutorizacionVerOpen] = useState(false)
  const [viewingAuth, setViewingAuth] = useState<any>(null)
  const [viewingAuthProfile, setViewingAuthProfile] = useState<Perfil | null>(null)

  const [isModActividadOpen, setIsModActividadOpen] = useState(false)

  // Sincronizar tab si cambia el parámetro de URL
  useEffect(() => {
    if (tabParam === 'salidas') {
      setActiveTab('salidas')
    } else if (tabParam === 'nomina') {
      setActiveTab('nomina')
    } else if (tabParam === 'menus') {
      router.replace('/panel/campamentos')
    }
  }, [tabParam])

  const fetchData = useCallback(async () => {
    if (!directivo) {
      setLoading(false)
      return
    }

    const online = typeof navigator !== 'undefined' ? navigator.onLine : true

    if (online) {
      try {
        let miembrosQuery = supabase
          .from('perfiles')
          .select('*, roles(name), unidades(nombre, colores, logo_unidad_url, logo_rama_url), contactos_emergencia(*), apoderado:apoderado_id(id, nombres, apellidos, telefono, email)')
          .order('nombres')

        if (perfil?.unidad_id) {
          miembrosQuery = miembrosQuery.eq('unidad_id', perfil.unidad_id)
        }

        const [miembrosRes, actividadesRes] = await Promise.all([
          miembrosQuery,
          supabase.from('actividades_programadas').select('*, unidades(nombre)').order('fecha_inicio', { ascending: false }),
        ])

        const miembrosData = (miembrosRes.data || []) as Perfil[]
        const memberIds = miembrosData.map(m => m.id)

        let authsData: AutorizacionActividad[] = []
        if (memberIds.length > 0) {
          const { data } = await supabase
            .from('autorizaciones_actividades')
            .select('*')
            .order('fecha_firma', { ascending: false })
          authsData = (data || []) as AutorizacionActividad[]
        }

        setMiembros(miembrosData)
        setActividades((actividadesRes.data || []) as ActividadProgramada[])
        setAutorizaciones(authsData)
        setIsOffline(false)
        setLoading(false)
        return
      } catch (err) {
        console.warn('Fallo al obtener datos de red, recurriendo a IndexedDB local:', err)
      }
    }

    // Fallback a IndexedDB (modo desconectado o fallo de red)
    try {
      setIsOffline(true)
      const [localPerfiles, localActs, localAuths] = await Promise.all([
        db.perfiles.toArray(),
        db.actividades_programadas.toArray(),
        db.autorizaciones.toArray()
      ])

      const filteredPerfiles = perfil?.unidad_id
        ? localPerfiles.filter(p => p.unidad_id === perfil.unidad_id)
        : localPerfiles

      setMiembros(filteredPerfiles as any[])
      setActividades(localActs as any[])
      setAutorizaciones(localAuths as any[])
    } catch (offlineErr) {
      console.error('Error al consultar base de datos offline:', offlineErr)
    } finally {
      setLoading(false)
    }
  }, [perfil?.unidad_id, directivo])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (ctxLoading || loading) {
    return <div className="p-20 text-center font-body text-pclr7 dark:text-pdclr7 italic tracking-widest uppercase text-[0.8em]">Cargando...</div>
  }

  if (!perfil || !directivo) {
    return <div className="p-20 text-center font-body text-pclr7 dark:text-pdclr7 italic tracking-widest uppercase text-[0.8em]">Sin acceso</div>
  }

  const handleRefresh = async () => {
    await Promise.all([fetchProfile(), fetchData()])
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Sub-pestañas de navegación: Nómina de Unidad vs Salidas */}
      <div className="flex bg-pclr3 dark:bg-pdclr3 p-1 rounded-2xl w-fit border border-pclr13 dark:border-pdclr13 flex-wrap gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('nomina')}
          className={`px-5 py-2 rounded-xl text-[0.82em] font-black uppercase transition-all cursor-pointer ${
            activeTab === 'nomina'
              ? 'bg-pclr8 dark:bg-pdclr8 text-pclr12 dark:text-pdclr12 shadow-sm'
              : 'text-pclr7 dark:text-pdclr7 hover:text-pclr4 dark:hover:text-pdclr4 dark:text-pdclr4 dark:hover:text-pdclr4'
          }`}
        >
          👥 Nómina {perfil?.unidades?.nombre || 'de Unidad'}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('salidas')}
          className={`px-5 py-2 rounded-xl text-[0.82em] font-black uppercase transition-all cursor-pointer ${
            activeTab === 'salidas'
              ? 'bg-pclr8 dark:bg-pdclr8 text-pclr12 dark:text-pdclr12 shadow-sm'
              : 'text-pclr7 dark:text-pdclr7 hover:text-pclr4 dark:hover:text-pdclr4 dark:text-pdclr4 dark:hover:text-pdclr4'
          }`}
        >
          🏕️ Salidas y Autorizaciones
        </button>
      </div>

      {/* Contenido según la pestaña activa */}
      {activeTab === 'nomina' && (
        <DashUnidad
          perfil={perfil}
          miembros={miembros}
          actividades={actividades}
          autorizaciones={autorizaciones}
          onVerFicha={(m) => { setViewingFicha(m); setIsModVerFichaOpen(true) }}
          onEdit={(m) => { setEditingPupilo(m); setEditData(m); setIsModPerfilOpen(true) }}
          onVerAutorizacion={(a, p) => { setViewingAuth(a); setViewingAuthProfile(p); setIsModAutorizacionVerOpen(true) }}
          onSuccess={handleRefresh}
        />
      )}

      {activeTab === 'salidas' && (
        <DashSalidasManager
          perfil={perfil}
          actividades={actividades}
          autorizaciones={autorizaciones}
          miembros={miembros}
          isOffline={isOffline}
          onVerAutorizacion={(a, p) => { setViewingAuth(a); setViewingAuthProfile(p); setIsModAutorizacionVerOpen(true) }}
          onCrearSalida={() => setIsModActividadOpen(true)}
          onPlanificarMenu={() => {
            router.push('/panel/campamentos')
          }}
        />
      )}

      {/* Modales */}
      <DashModVerFicha
        isOpen={isModVerFichaOpen}
        onClose={() => setIsModVerFichaOpen(false)}
        miembro={viewingFicha}
        perfil={perfil}
        autorizaciones={autorizaciones}
      />

      <DashModPerfil 
        isOpen={isModPerfilOpen} 
        onClose={() => setIsModPerfilOpen(false)} 
        editingPupilo={editingPupilo} 
        perfil={perfil} 
        editData={editData} 
        setEditData={setEditData} 
        editContactos={editContactos} 
        setEditContactos={setEditContactos} 
        roles={roles} 
        unidades={unidades} 
        onSuccess={handleRefresh} 
      />

      <DashModAutorizacionVer
        isOpen={isModAutorizacionVerOpen}
        onClose={() => setIsModAutorizacionVerOpen(false)}
        auth={viewingAuth}
        perfil={viewingAuthProfile}
        onDelete={handleRefresh}
      />

      <DashModActividadCrear
        isOpen={isModActividadOpen}
        onClose={() => setIsModActividadOpen(false)}
        perfil={perfil}
        unidades={unidades}
        onSuccess={handleRefresh}
      />
    </div>
  )
}
