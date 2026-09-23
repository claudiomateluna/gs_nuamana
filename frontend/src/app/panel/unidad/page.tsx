'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useDashboardContext } from '@/contexts/DashboardContext'
import { supabase } from '@/lib/supabase'
import type { Perfil, ActividadProgramada, AutorizacionActividad } from '@/types'

const DashUnidad = dynamic(() => import('@/components/dashboard/p_unidad'), { ssr: false })
const DashModVerFicha = dynamic(() => import('@/components/dashboard/inicio/mod_inicio_ver_ficha'), { ssr: false })
const DashModPerfil = dynamic(() => import('@/components/dashboard/inicio/mod_inicio_perfil'), { ssr: false })
const DashModAutorizacionVer = dynamic(() => import('@/components/dashboard/autorizacion/mod_autorizacion_ver'), { ssr: false })

export default function UnidadPage() {
  const { perfil, directivo, fetchProfile, loading: ctxLoading } = useDashboardContext()
  
  const [miembros, setMiembros] = useState<Perfil[]>([])
  const [actividades, setActividades] = useState<ActividadProgramada[]>([])
  const [autorizaciones, setAutorizaciones] = useState<AutorizacionActividad[]>([])
  const [loading, setLoading] = useState(true)
  
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

  useEffect(() => {
    if (!perfil?.unidad_id || !directivo) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const [miembrosRes, actividadesRes, autorizacionesRes] = await Promise.all([
          supabase.from('perfiles').select('*, roles(name), unidades(nombre, colores, logo_unidad_url, logo_rama_url), contactos_emergencia(*), apoderado:apoderado_id(id, nombres, apellidos, telefono, email)').eq('unidad_id', perfil.unidad_id).order('nombres'),
          supabase.from('actividades_programadas').select('*, unidades(nombre)').order('fecha_inicio', { ascending: false }),
          supabase.from('autorizaciones_actividades').select('*').in('perfil_id', miembros.map(m => m.id)).order('fecha_firma', { ascending: false }),
        ])

        setMiembros((miembrosRes.data || []) as Perfil[])
        setActividades((actividadesRes.data || []) as ActividadProgramada[])
        setAutorizaciones((autorizacionesRes.data || []) as AutorizacionActividad[])
      } catch (err) {
        console.error('Error fetching unidad data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [perfil?.unidad_id, directivo])

  if (ctxLoading || loading) {
    return <div className="p-20 text-center font-body text-pclr7 dark:text-pdclr7 italic tracking-widest uppercase text-[0.8em]">Cargando...</div>
  }

  if (!perfil || !directivo) {
    return <div className="p-20 text-center font-body text-pclr7 dark:text-pdclr7 italic tracking-widest uppercase text-[0.8em]">Sin acceso</div>
  }

  return (
    <div className="animate-in fade-in duration-500">
      <DashUnidad
        perfil={perfil}
        miembros={miembros}
        actividades={actividades}
        autorizaciones={autorizaciones}
        onVerFicha={(m) => { setViewingFicha(m); setIsModVerFichaOpen(true) }}
        onEdit={(m) => { setEditingPupilo(m); setEditData(m); setIsModPerfilOpen(true) }}
        onVerAutorizacion={(a, p) => { setViewingAuth(a); setViewingAuthProfile(p); setIsModAutorizacionVerOpen(true) }}
        onSuccess={fetchProfile}
      />

      {/* Modales */}
      <DashModVerFicha isOpen={isModVerFichaOpen} onClose={() => setIsModVerFichaOpen(false)} miembro={viewingFicha} perfil={perfil} autorizaciones={autorizaciones} />
      <DashModPerfil isOpen={isModPerfilOpen} onClose={() => setIsModPerfilOpen(false)} editingPupilo={editingPupilo} perfil={perfil} editData={editData} setEditData={setEditData} editContactos={editContactos} setEditContactos={setEditContactos} roles={[]} unidades={[]} onSuccess={fetchProfile} />
      <DashModAutorizacionVer isOpen={isModAutorizacionVerOpen} onClose={() => setIsModAutorizacionVerOpen(false)} auth={viewingAuth} perfil={viewingAuthProfile} />
    </div>
  )
}
