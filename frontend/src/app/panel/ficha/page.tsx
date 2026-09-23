'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useDashboardContext } from '@/contexts/DashboardContext'
import { supabase } from '@/lib/supabase'
import { isApoderado, isDirigenteOrGuiadora, isInactive } from '@/lib/roles'
import type { Perfil } from '@/types'
import { toast } from 'sonner'

const DashInicio = dynamic(() => import('@/components/dashboard/p_inicio'), { ssr: false })
const DashModPerfil = dynamic(() => import('@/components/dashboard/inicio/mod_inicio_perfil'), { ssr: false })
const DashModVerFicha = dynamic(() => import('@/components/dashboard/inicio/mod_inicio_ver_ficha'), { ssr: false })
const DashModAutorizacionWizard = dynamic(() => import('@/components/dashboard/autorizacion/mod_autorizacion_wizard'), { ssr: false })
const DashModAutorizacionVer = dynamic(() => import('@/components/dashboard/autorizacion/mod_autorizacion_ver'), { ssr: false })
const DashModActividadCrear = dynamic(() => import('@/components/dashboard/unidad/mod_unidad_actividad_crear'), { ssr: false })
const DashModVincularPupilo = dynamic(() => import('@/components/dashboard/unidad/mod_unidad_vincular_pupilo'), { ssr: false })

export default function FichaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { perfil, unidades, directivo, nnj, fetchProfile, loading } = useDashboardContext()
  
  const modal = searchParams.get('modal')
  const modalId = searchParams.get('id')
  
  // Modal states
  const [isModPerfilOpen, setIsModPerfilOpen] = useState(false)
  const [editingPupilo, setEditingPupilo] = useState<Perfil | null>(null)
  const [editData, setEditData] = useState<Partial<Perfil>>({})
  const [editContactos, setEditContactos] = useState<any[]>([])
  
  const [isModVerFichaOpen, setIsModVerFichaOpen] = useState(false)
  const [viewingFicha, setViewingFicha] = useState<Perfil | null>(null)
  
  const [isModAutorizacionOpen, setIsModAutorizacionOpen] = useState(false)
  const [targetAuthProfile, setTargetAuthProfile] = useState<Perfil | null>(null)
  
  const [isModAutorizacionVerOpen, setIsModAutorizacionVerOpen] = useState(false)
  const [viewingAuth, setViewingAuth] = useState<any>(null)
  const [viewingAuthProfile, setViewingAuthProfile] = useState<Perfil | null>(null)
  
  const [isModActividadOpen, setIsModActividadOpen] = useState(false)
  const [isModVincularPupiloOpen, setIsModVincularPupiloOpen] = useState(false)
  
  const [showPassModal, setShowPassModal] = useState(false)
  const [newPass, setNewPass] = useState('')
  
  // Sync state
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)
  const [syncMessage, setSyncMessage] = useState('')

  const closeModal = useCallback(() => {
    setIsModPerfilOpen(false)
    setIsModVerFichaOpen(false)
    setIsModAutorizacionOpen(false)
    setIsModAutorizacionVerOpen(false)
    setIsModActividadOpen(false)
    setIsModVincularPupiloOpen(false)
    setShowPassModal(false)
    setEditingPupilo(null)
    setViewingFicha(null)
    router.replace('/panel/ficha')
  }, [router])

  // Handle modal query params
  useEffect(() => {
    if (!perfil) return

    if (modal === 'editar-perfil') {
      setEditingPupilo(null)
      setEditData(perfil as Partial<Perfil>)
      setIsModPerfilOpen(true)
    } else if (modal === 'ver-ficha' && modalId) {
      // Fetch the profile to view
      supabase.from('perfiles').select('*, roles(name), unidades(nombre, colores, logo_unidad_url, logo_rama_url), contactos_emergencia(*)').eq('id', modalId).single()
        .then(({ data }) => {
          if (data) {
            setViewingFicha(data as Perfil)
            setIsModVerFichaOpen(true)
          }
        })
    } else if (modal === 'autorizacion') {
      setTargetAuthProfile(perfil)
      setIsModAutorizacionOpen(true)
    } else if (modal === 'programar-actividad' && directivo) {
      setIsModActividadOpen(true)
    } else if (modal === 'cambiar-contrasena') {
      setShowPassModal(true)
    } else if (modal === 'preparar-campamento' && directivo) {
      handleSyncOffline()
    } else if (modal === 'salir') {
      handleSignOut()
    } else if (modal === 'vincular-pupilo') {
      setIsModVincularPupiloOpen(true)
    } else {
      // Close all modals when no modal query param
      setIsModPerfilOpen(false)
      setIsModVerFichaOpen(false)
      setIsModAutorizacionOpen(false)
      setIsModAutorizacionVerOpen(false)
      setIsModActividadOpen(false)
      setIsModVincularPupiloOpen(false)
      setShowPassModal(false)
    }
  }, [modal, modalId, perfil, directivo])

  const handleSyncOffline = async () => {
    setIsSyncing(true)
    setSyncProgress(0)
    setSyncMessage('Iniciando sincronización...')
    
    if (!perfil?.unidad_id) {
      closeModal()
      return
    }
    
    try {
      const { syncService } = await import('@/lib/sync-service')
      await syncService.syncUnitData(perfil.unidad_id, (progress: number, message: string) => {
        setSyncProgress(progress)
        setSyncMessage(message)
      })
      toast.success('Datos sincronizados correctamente')
    } catch (err) {
      console.error('Sync error:', err)
      toast.error('Error al sincronizar datos')
    } finally {
      setIsSyncing(false)
      closeModal()
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const handleOpenWizard = (p: Perfil) => {
    setTargetAuthProfile(p)
    setIsModAutorizacionOpen(true)
  }

  if (loading) {
    return <div className="p-20 text-center font-body text-pclr7 dark:text-pdclr7 italic tracking-widest uppercase text-[0.8em]">Cargando...</div>
  }

  if (!perfil) return null

  const inactive = isInactive(perfil)
  const isDirigente = isDirigenteOrGuiadora(perfil)

  // Fetch pupilos for apoderados
  const [pupilos, setPupilos] = useState<Perfil[]>([])
  useEffect(() => {
    if (isApoderado(perfil)) {
      supabase.from('perfiles').select('*, roles(name), unidades(nombre, colores, logo_unidad_url, logo_rama_url)').eq('apoderado_id', perfil.id)
        .then(({ data }) => setPupilos((data || []) as Perfil[]))
    }
  }, [perfil])

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ACCIONES RAPIDAS */}
      <div className="flex flex-col md:flex-row gap-2 border-b border-pclr13 dark:border-pdclr13 pb-4 flex-wrap">
        {directivo && (
          <>
            <button onClick={() => router.push('/panel/ficha?modal=programar-actividad')} className="flex items-center justify-between gap-2 p-2 bg-pclr10 dark:bg-pdclr10 text-pclr12 dark:text-pdclr12 font-bold uppercase rounded-[1rem] shadow-xl hover:brightness-125 transition-all tracking-widest text-[0.9em] font-inika text-right leading-none">
              <div className="w-6 h-6 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_programar_actividad.svg)', maskImage: 'url(/images/iconos/icono_programar_actividad.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
              Crear Salida
            </button>
            <button onClick={() => router.push('/panel/ficha?modal=preparar-campamento')} className="flex items-center justify-between gap-2 p-2 bg-pclr6 dark:bg-pdclr6 text-pclr12 dark:text-pdclr12 font-bold uppercase rounded-[1rem] shadow-xl active:scale-95 transition-all tracking-widest text-[0.9em] font-inika text-right leading-none relative group">
              <div className="w-6 h-6 flex items-center justify-center bg-transparent text-pclr12 dark:text-pdclr12">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <div className="flex flex-col text-right">
                <span>Campamento</span>
              </div>
            </button>
          </>
        )}
        <button onClick={() => router.push('/panel/ficha?modal=editar-perfil')} className="flex items-center justify-between gap-2 p-2 bg-pclr10 dark:bg-pdclr10 text-pclr12 dark:text-pdclr12 font-bold uppercase rounded-[1rem] shadow-xl hover:brightness-110 active:scale-95 transition-all tracking-widest text-[0.9em] font-inika text-right leading-none">
          <div className="w-6 h-6 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_actualizar_ficha.svg)', maskImage: 'url(/images/iconos/icono_actualizar_ficha.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
          Actualizar Datos
        </button>
        <button onClick={() => router.push('/panel/ficha?modal=autorizacion')} className="flex items-center justify-between gap-2 p-2 bg-pclr8 dark:bg-pdclr8 text-pclr12 dark:text-pdclr12 font-bold uppercase rounded-[1rem] shadow-xl active:scale-95 transition-all tracking-widest text-[0.9em] font-inika text-right leading-none">
          <div className="w-6 h-6 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_autorizacion.svg)', maskImage: 'url(/images/iconos/icono_autorizacion.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
          Autorizacion
        </button>
        <button onClick={() => router.push('/panel/ficha?modal=cambiar-contrasena')} className="flex items-center justify-between gap-2 p-2 bg-pclr11 dark:bg-pdclr11 text-pclr12 dark:text-pdclr12 font-bold uppercase rounded-[1rem] hover:brightness-125 transition-all tracking-widest text-[0.9em] font-inika text-right leading-none">
          <div className="w-6 h-6 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_cambiar_contrasena.svg)', maskImage: 'url(/images/iconos/icono_cambiar_contrasena.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
          Contraseña
        </button>
        <button onClick={() => router.push('/panel/ficha?modal=salir')} className="flex items-center justify-between gap-2 p-2 bg-pclr5 dark:bg-pdclr5 text-pclr12 dark:text-pdclr12 font-bold uppercase rounded-[1rem] hover:brightness-110 active:scale-95 transition-all tracking-widest text-[0.9em] font-inika text-right leading-none">
          <div className="w-6 h-6 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_salir.svg)', maskImage: 'url(/images/iconos/icono_salir.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
          Salir
        </button>
      </div>

      {/* Contenido de la Ficha */}
      <DashInicio
        perfil={perfil}
        pupilos={pupilos}
        apoderado={null}
        autorizaciones={[]}
        onEdit={(p) => {
          setEditingPupilo(p || null)
          setEditData(p || perfil)
          setIsModPerfilOpen(true)
        }}
        onGenerateAuth={handleOpenWizard}
        onProgramActividad={() => router.push('/panel/ficha?modal=programar-actividad')}
        onVincularExistente={() => router.push('/panel/ficha?modal=vincular-pupilo')}
        onVerAutorizacion={(a) => {
          setViewingAuth(a)
          setViewingAuthProfile(perfil)
          setIsModAutorizacionVerOpen(true)
        }}
        setShowPassModal={() => router.push('/panel/ficha?modal=cambiar-contrasena')}
      />

      {/* Modales */}
      <DashModPerfil
        isOpen={isModPerfilOpen}
        onClose={closeModal}
        editingPupilo={editingPupilo}
        perfil={perfil}
        editData={editData}
        setEditData={setEditData}
        editContactos={editContactos}
        setEditContactos={setEditContactos}
        roles={[]}
        unidades={unidades}
        onSuccess={() => { fetchProfile(); closeModal() }}
      />
      
      <DashModVerFicha
        isOpen={isModVerFichaOpen}
        onClose={closeModal}
        miembro={viewingFicha}
        perfil={perfil}
        autorizaciones={[]}
      />
      
      {isModAutorizacionOpen && targetAuthProfile && (
        <DashModAutorizacionWizard
          isOpen={isModAutorizacionOpen}
          onClose={closeModal}
          perfil={targetAuthProfile}
          onSuccess={() => { fetchProfile(); closeModal() }}
        />
      )}
      
      <DashModAutorizacionVer
        isOpen={isModAutorizacionVerOpen}
        onClose={closeModal}
        auth={viewingAuth}
        perfil={viewingAuthProfile}
      />
      
      <DashModActividadCrear
        isOpen={isModActividadOpen}
        onClose={closeModal}
        perfil={perfil}
        unidades={unidades}
        onSuccess={() => { fetchProfile(); closeModal() }}
      />
      
      <DashModVincularPupilo
        isOpen={isModVincularPupiloOpen}
        onClose={closeModal}
        perfil={perfil}
        onSuccess={() => { fetchProfile(); closeModal() }}
      />

      {/* Modal Cambiar Contraseña */}
      {showPassModal && (
        <div className="fixed inset-0 bg-pclr4/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-pclr1 dark:bg-pdclr1 w-full max-w-md rounded-[3rem] p-10 shadow-2xl border border-pclr13 dark:border-pdclr13">
            <h2 className="text-2xl font-black font-display uppercase text-pclr4 dark:text-pclr4 mb-8 border-b border-pclr13 dark:border-pdclr13 pb-4 tracking-tighter font-bold">Seguridad</h2>
            <form onSubmit={async (e) => {
              e.preventDefault()
              const { error } = await supabase.auth.updateUser({ password: newPass })
              if (!error) {
                toast.success('Contraseña actualizada correctamente.')
                setShowPassModal(false)
                setNewPass('')
                closeModal()
              } else {
                toast.error(error.message)
              }
            }} className="space-y-6">
              <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} className="w-full p-4 rounded-2xl border border-pclr13 dark:border-pdclr13 bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 font-bold text-center" autoFocus placeholder="Nueva Contrasena" />
              <div className="flex gap-2 pt-4">
                <button type="submit" className="flex-1 py-4 bg-pclr10 dark:bg-pdclr10 text-pclr12 dark:text-pdclr12 font-black uppercase rounded-2xl shadow-xl font-inika text-[0.8em] tracking-widest">Actualizar</button>
                <button type="button" onClick={() => { setShowPassModal(false); setNewPass(''); closeModal() }} className="flex-1 py-4 bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 rounded-2xl font-inika text-[0.8em] tracking-widest">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sync Overlay */}
      {isSyncing && (
        <div className="fixed inset-0 bg-pclr4/40 backdrop-blur-sm z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-pclr1 dark:bg-pdclr1 w-full max-w-md rounded-[3rem] p-10 shadow-2xl flex flex-col items-center text-center space-y-6 border border-pclr13 dark:border-pdclr13">
            <div className="relative w-20 h-20 flex items-center justify-center bg-pclr6 dark:bg-pdclr6 text-pclr12 dark:text-pdclr12 rounded-full animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black font-display uppercase tracking-tight text-pclr4 dark:text-pdclr4">Preparando Campamento</h3>
              <p className="text-sm font-medium opacity-65 font-body leading-tight text-pclr4 dark:text-pdclr4">
                Estamos descargando los datos de tu unidad a la base de datos local para que puedas acceder sin senal.
              </p>
            </div>
            <div className="w-full bg-pclr3 dark:bg-pdclr3 h-3 rounded-full overflow-hidden animate-pulse">
              <div className="bg-pclr6 dark:bg-pdclr6 h-full transition-all duration-300 rounded-full" style={{ width: `${syncProgress}%` }}></div>
            </div>
            <p className="text-xs font-black uppercase text-pclr6 dark:text-pdclr6 tracking-wider">
              {syncProgress}% - {syncMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
