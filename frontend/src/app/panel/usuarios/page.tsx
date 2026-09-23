'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useDashboardContext } from '@/contexts/DashboardContext'
import { supabase } from '@/lib/supabase'
import type { Perfil } from '@/types'

const DashUsuarios = dynamic(() => import('@/components/dashboard/p_usuarios'), { ssr: false })
const DashModVerFicha = dynamic(() => import('@/components/dashboard/inicio/mod_inicio_ver_ficha'), { ssr: false })
const DashModPerfil = dynamic(() => import('@/components/dashboard/inicio/mod_inicio_perfil'), { ssr: false })

export default function UsuariosPage() {
  const { perfil, fetchProfile, loading: ctxLoading } = useDashboardContext()
  
  const [usuarios, setUsuarios] = useState<Perfil[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal states
  const [isModVerFichaOpen, setIsModVerFichaOpen] = useState(false)
  const [viewingFicha, setViewingFicha] = useState<Perfil | null>(null)
  
  const [isModPerfilOpen, setIsModPerfilOpen] = useState(false)
  const [editingPupilo, setEditingPupilo] = useState<Perfil | null>(null)
  const [editData, setEditData] = useState<Partial<Perfil>>({})
  const [editContactos, setEditContactos] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await supabase.from('perfiles').select('*, roles(name), unidades(nombre, colores, logo_unidad_url, logo_rama_url), contactos_emergencia(*), apoderado:apoderado_id(id, nombres, apellidos, telefono, email)').order('nombres')
        setUsuarios((data || []) as Perfil[])
      } catch (err) {
        console.error('Error fetching usuarios:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (ctxLoading || loading) {
    return <div className="p-20 text-center font-body text-pclr7 dark:text-pdclr7 italic tracking-widest uppercase text-[0.8em]">Cargando...</div>
  }

  if (!perfil) return null

  return (
    <div className="animate-in fade-in duration-500">
      <DashUsuarios
        userPerfil={perfil}
        usuarios={usuarios}
        onVer={(u) => { setViewingFicha(u); setIsModVerFichaOpen(true) }}
        onEdit={(u) => { setEditingPupilo(u); setEditData(u); setEditContactos(u.contactos_emergencia || []); setIsModPerfilOpen(true) }}
        onSuccess={fetchProfile}
      />

      {/* Modales */}
      <DashModVerFicha isOpen={isModVerFichaOpen} onClose={() => setIsModVerFichaOpen(false)} miembro={viewingFicha} perfil={perfil} autorizaciones={[]} />
      <DashModPerfil isOpen={isModPerfilOpen} onClose={() => setIsModPerfilOpen(false)} editingPupilo={editingPupilo} perfil={perfil} editData={editData} setEditData={setEditData} editContactos={editContactos} setEditContactos={setEditContactos} roles={[]} unidades={[]} onSuccess={fetchProfile} />
    </div>
  )
}
