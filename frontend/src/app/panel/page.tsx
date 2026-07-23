'use client'

import { useState } from 'react'
import { useDashboard } from '@/hooks/useDashboard'
import type { Perfil } from '@/types'

import dynamic from 'next/dynamic'

// Vistas Dinamicas
const DashInicio = dynamic(() => import('@/components/dashboard/p_inicio'), { ssr: false })
const DashUnidad = dynamic(() => import('@/components/dashboard/p_unidad'), { ssr: false })
const DashActas = dynamic(() => import('@/components/dashboard/p_actas'), { ssr: false })
const DashBitacoras = dynamic(() => import('@/components/dashboard/p_articulos'), { ssr: false })
const DashTally = dynamic(() => import('@/components/dashboard/p_tally'), { ssr: false })
const DashCiclo = dynamic(() => import('@/components/dashboard/sp_ciclo_activo'), { ssr: false })
const DashCicloHistorial = dynamic(() => import('@/components/dashboard/sp_ciclo_historial'), { ssr: false })
const DashCiclosOtros = dynamic(() => import('@/components/dashboard/sp_ciclo_otras_unidades'), { ssr: false })
const DashInventario = dynamic(() => import('@/components/dashboard/p_inventario'), { ssr: false })
const DashTesoreria = dynamic(() => import('@/components/dashboard/sp_tesoreria_libro'), { ssr: false })
const DashRendiciones = dynamic(() => import('@/components/dashboard/sp_tesoreria_rendiciones'), { ssr: false })
const DashRecaudaciones = dynamic(() => import('@/components/dashboard/sp_tesoreria_recaudaciones'), { ssr: false })
const DashUsuarios = dynamic(() => import('@/components/dashboard/p_usuarios'), { ssr: false })
const DashmodProgresion = dynamic(() => import('@/components/dashboard/p_progresion'), { ssr: false })

// Modales Dinamicos
const DashModPerfil = dynamic(() => import('@/components/dashboard/inicio/mod_inicio_perfil'), { ssr: false })
const DashModActaCrear = dynamic(() => import('@/components/dashboard/actas/mod_actas_crear'), { ssr: false })
const DashModActaVer = dynamic(() => import('@/components/dashboard/actas/mod_actas_ver'), { ssr: false })
const DashModBitacoraCrear = dynamic(() => import('@/components/dashboard/tally/mod_tally_crear'), { ssr: false })
const DashModBitacoraVer = dynamic(() => import('@/components/dashboard/tally/mod_tally_ver'), { ssr: false })
const DashModVerFicha = dynamic(() => import('@/components/dashboard/inicio/mod_inicio_ver_ficha'), { ssr: false })
const DashModInventarioItem = dynamic(() => import('@/components/dashboard/inventario/mod_inventario_item'), { ssr: false })
const DashModMovimiento = dynamic(() => import('@/components/dashboard/tesoreria/mod_tesoreria_movimiento'), { ssr: false })
const DashModComprobante = dynamic(() => import('@/components/dashboard/tesoreria/mod_tesoreria_comprobante'), { ssr: false })
const DashModTesoreriaVer = dynamic(() => import('@/components/dashboard/tesoreria/mod_tesoreria_ver'), { ssr: false })
const DashModRendicionCrear = dynamic(() => import('@/components/dashboard/tesoreria/mod_tesoreria_rendicion_crear'), { ssr: false })
const DashModRendicionVer = dynamic(() => import('@/components/dashboard/tesoreria/mod_tesoreria_rendicion_ver'), { ssr: false })
const DashModAutorizacionWizard = dynamic(() => import('@/components/dashboard/autorizacion/mod_autorizacion_wizard'), { ssr: false })
const DashModAutorizacionVer = dynamic(() => import('@/components/dashboard/autorizacion/mod_autorizacion_ver'), { ssr: false })
const DashModActividadCrear = dynamic(() => import('@/components/dashboard/unidad/mod_unidad_actividad_crear'), { ssr: false })
const DashModVincularPupilo = dynamic(() => import('@/components/dashboard/unidad/mod_unidad_vincular_pupilo'), { ssr: false })

import SecondaryHeader from '@/components/SecondaryHeader'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { canSeeAllTabs, isApoderado, isInactive } from '@/lib/roles'
import { getBitacoraName } from '@/lib/bitacora-utils'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner';

export default function DashboardPage() {
  const d = useDashboard()
  const [tallyRefreshKey, setTallyRefreshKey] = useState(0)

  if (d.loading) return <div className="p-20 text-center font-body text-clr2 italic tracking-widest uppercase text-[0.8em]">Sincronizando Bitacora...</div>
  if (!d.perfil) return null

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-clr4 font-body transition-colors">
      <SecondaryHeader />
      <main className="max-w-[1080px] mx-auto px-2 py-32">
        <div className="bg-gradient-to-br from-white/30 via-clr5/20 to-clr7/40 dark:from-clr4 dark:via-clr5 dark:to-clr7/20 rounded-[1rem] p-2 md:p-4 shadow-2xl border border-clr10 dark:border-clr4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 border-b border-zinc-100 dark:border-clr4 pb-4">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-black font-display text-clr5 dark:text-clr1 uppercase tracking-tighter leading-none font-bold">{d.perfil.nombres} {d.perfil.apellidos}</h1>
              <p className="text-sm md:text-xl text-[#cb3327] font-bold uppercase tracking-[0.2em] mt-2">{d.perfil.roles?.name} • {d.perfil.unidades?.nombre || 'Grupo Nua Mana'}</p>
            </div>
            <div className="shrink-0 w-24 h-24 bg-clr6 rounded-full flex items-center justify-center shadow-xl overflow-hidden"><img src="/images/logos/LogoColor.svg" alt="Logo" className="w-28 h-28" /></div>
          </header>

          {/* ACCIONES RAPIDAS */}
          <div className="flex flex-col md:flex-row gap-2 border-b border-zinc-100 dark:border-clr4 pb-4 flex-wrap">
            {d.directivo && (
              <>
                <button onClick={() => d.setIsModActividadOpen(true)} className="flex items-center justify-between gap-2 p-2 bg-zinc-900 text-white font-bold uppercase rounded-[1rem] shadow-xl hover:brightness-125 transition-all tracking-widest text-[0.9em] font-inika text-right leading-none">
                  <div className="w-6 h-6 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_programar_actividad.svg)', maskImage: 'url(/images/iconos/icono_programar_actividad.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
                  Programar Actividad
                </button>
                <button onClick={d.handleSyncOffline} className="flex items-center justify-between gap-2 p-2 bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase rounded-[1rem] shadow-xl active:scale-95 transition-all tracking-widest text-[0.9em] font-inika text-right leading-none relative group">
                  <div className="w-6 h-6 flex items-center justify-center bg-transparent text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <div className="flex flex-col text-right">
                    <span>Preparar Campamento</span>
                    {d.lastSyncTime && (
                      <span className="text-[0.9em] opacity-75 lowercase italic font-body font-normal leading-none mt-1">
                        Sinc: {new Date(d.lastSyncTime).toLocaleDateString('es-CL')} {new Date(d.lastSyncTime).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </button>
              </>
            )}
            <button onClick={() => { d.setEditingPupilo(null); d.setEditData(d.perfil as Partial<Perfil>); d.setIsModPerfilOpen(true); }} className="flex items-center justify-between gap-2 p-2 bg-clr6 dark:bg-dclr6 text-white font-bold uppercase rounded-[1rem] shadow-xl hover:brightness-110 active:scale-95 transition-all tracking-widest text-[0.9em] font-inika text-right leading-none">
              <div className="w-6 h-6 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_actualizar_ficha.svg)', maskImage: 'url(/images/iconos/icono_actualizar_ficha.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
              Actualizar Datos
            </button>
            <button onClick={() => d.handleOpenWizard(d.perfil)} className="flex items-center justify-between gap-2 p-2 bg-blue-600 text-white font-bold uppercase rounded-[1rem] shadow-xl hover:bg-blue-700 active:scale-95 transition-all tracking-widest text-[0.9em] font-inika text-right leading-none">
              <div className="w-6 h-6 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_autorizacion.svg)', maskImage: 'url(/images/iconos/icono_autorizacion.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
              Autorizacion
            </button>
            <button onClick={() => d.setShowPassModal(true)} className="flex items-center justify-between gap-2 p-2 bg-clr10 dark:bg-clr4 text-clr4 dark:text-clr1 font-bold uppercase rounded-[1rem] hover:bg-clr6 transition-all tracking-widest text-[0.9em] font-inika text-right leading-none">
              <div className="w-6 h-6 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_cambiar_contrasena.svg)', maskImage: 'url(/images/iconos/icono_cambiar_contrasena.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
              Cambiar Contrasena
            </button>
            <button onClick={async () => { if (!window.confirm('¿Cerrar sesión?')) return; await supabase.auth.signOut(); window.location.href = '/'; }} className="flex items-center justify-between gap-2 p-2 bg-clr7 dark:bg-dclr7 text-white font-bold uppercase rounded-[1rem] hover:brightness-110 active:scale-95 transition-all tracking-widest text-[0.9em] font-inika text-right leading-none">
              <div className="w-6 h-6 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_salir.svg)', maskImage: 'url(/images/iconos/icono_salir.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
              Cerrar Sesion
            </button>
          </div>

          <div className="flex border-b border-zinc-100 dark:border-clr4 mb-5 mt-2 overflow-x-auto scrollbar-hide text-[1em]">
            <button onClick={() => d.setActiveTab('inicio')} className={`flex flex-col items-center justify-center px-4 py-2 uppercase font-slab border-b-2 gap-1 ${d.activeTab === 'inicio' ? 'border-clr7 text-clr7 font-bold' : 'border-transparent text-clr2 hover:text-black dark:hover:text-white'}`}>
              <div className="w-8 h-8 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_ficha.svg)', maskImage: 'url(/images/iconos/icono_ficha.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
              <span className="text-[0.8em] sm:text-xs leading-none">Ficha</span>
            </button>
            {d.canSeeUnits && <button onClick={() => d.setActiveTab('unidad')} className={`flex flex-col items-center justify-center px-4 py-2 uppercase font-slab border-b-2 gap-1 ${d.activeTab === 'unidad' ? 'border-clr7 text-clr7 font-bold' : 'border-transparent text-clr2 hover:text-black dark:hover:text-white'}`}>
              <div className="w-8 h-8 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_unidad.svg)', maskImage: 'url(/images/iconos/icono_unidad.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
              <span className="text-[0.8em] sm:text-xs leading-none">Unidad</span>
            </button>}
            {d.directivo && <button onClick={() => d.setActiveTab('usuarios')} className={`flex flex-col items-center justify-center px-4 py-2 uppercase font-slab border-b-2 gap-1 ${d.activeTab === 'usuarios' ? 'border-clr7 text-clr7 font-bold' : 'border-transparent text-clr2 hover:text-black dark:hover:text-white'}`}>
              <div className="w-8 h-8 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_grupo.svg)', maskImage: 'url(/images/iconos/icono_grupo.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
              <span className="text-[0.8em] sm:text-xs leading-none">Grupo</span>
            </button>}
            {canSeeAllTabs(d.perfil) && !isInactive(d.perfil) && <button onClick={() => d.setActiveTab('actas')} className={`flex flex-col items-center justify-center px-4 py-2 uppercase font-slab border-b-2 gap-1 ${d.activeTab === 'actas' ? 'border-clr7 text-clr7 font-bold' : 'border-transparent text-clr2 hover:text-black dark:hover:text-white'}`}>
              <div className="w-8 h-8 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_actas.svg)', maskImage: 'url(/images/iconos/icono_actas.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
              <span className="text-[0.8em] sm:text-xs leading-none">Actas</span>
            </button>}
            {d.canSeeTeso && <button onClick={() => d.setActiveTab('tesoreria')} className={`flex flex-col items-center justify-center px-4 py-2 uppercase font-slab border-b-2 gap-1 ${d.activeTab === 'tesoreria' ? 'border-clr7 text-clr7 font-bold' : 'border-transparent text-clr2 hover:text-black dark:hover:text-white'}`}>
              <div className="w-8 h-8 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_tesoreria.svg)', maskImage: 'url(/images/iconos/icono_tesoreria.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
              <span className="text-[0.8em] sm:text-xs leading-none">Tesoreria</span>
            </button>}
            {(d.directivo || d.nnj) && <button onClick={() => d.setActiveTab('ciclo')} className={`flex flex-col items-center justify-center px-4 py-2 uppercase font-slab border-b-2 gap-1 ${d.activeTab === 'ciclo' ? 'border-clr7 text-clr7 font-bold' : 'border-transparent text-clr2 hover:text-black dark:hover:text-white'}`}>
              <div className="w-8 h-8 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_ciclo.svg)', maskImage: 'url(/images/iconos/icono_ciclo.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
              <span className="text-[0.8em] sm:text-xs leading-none">Ciclo</span>
            </button>}
            {(d.directivo || d.nnj) && !isInactive(d.perfil) && <button onClick={() => d.setActiveTab('articulos')} className={`flex flex-col items-center justify-center px-4 py-2 uppercase font-slab border-b-2 gap-1 ${d.activeTab === 'articulos' ? 'border-clr7 text-clr7 font-bold' : 'border-transparent text-clr2 hover:text-black dark:hover:text-white'}`}>
              <div className="w-8 h-8 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_articulos.svg)', maskImage: 'url(/images/iconos/icono_articulos.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
              <span className="text-[0.8em] sm:text-xs leading-none">Articulos</span>
            </button>}
            {(d.directivo || d.nnj) && !isInactive(d.perfil) && <button onClick={() => d.setActiveTab('tally')} className={`flex flex-col items-center justify-center px-4 py-2 uppercase font-slab border-b-2 gap-1 ${d.activeTab === 'tally' ? 'border-clr7 text-clr7 font-bold' : 'border-transparent text-clr2 hover:text-black dark:hover:text-white'}`}>
              <div className="w-8 h-8 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_unidad.svg)', maskImage: 'url(/images/iconos/icono_tally.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
              <span className="text-[0.8em] sm:text-xs leading-none">{getBitacoraName(d.perfil?.unidad_id)}</span>
            </button>}
            <button onClick={() => d.setActiveTab('progresion')} className={`flex flex-col items-center justify-center px-4 py-2 uppercase font-slab border-b-2 gap-1 ${d.activeTab === 'progresion' ? 'border-clr7 text-clr7 font-bold' : 'border-transparent text-clr2 hover:text-black dark:hover:text-white'}`}>
              <div className="w-8 h-8 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_progresion.svg)', maskImage: 'url(/images/iconos/icono_progresion.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
              <span className="text-[0.8em] sm:text-xs leading-none">Progresion</span>
            </button>
            {canSeeAllTabs(d.perfil) && !isInactive(d.perfil) && <button onClick={() => d.setActiveTab('inventario')} className={`flex flex-col items-center justify-center px-4 py-2 uppercase font-slab border-b-2 gap-1 ${d.activeTab === 'inventario' ? 'border-clr7 text-clr7 font-bold' : 'border-transparent text-clr2 hover:text-black dark:hover:text-white'}`}>
              <div className="w-8 h-8 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_inventario.svg)', maskImage: 'url(/images/iconos/icono_inventario.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
              <span className="text-[0.8em] sm:text-xs leading-none">Inventario</span>
            </button>}
          </div>

          <ErrorBoundary key={d.activeTab}>
          {d.activeTab === 'inicio' && d.perfil && <DashInicio perfil={d.perfil} pupilos={d.pupilos} apoderado={d.apoderado} autorizaciones={d.autorizaciones.filter(a => a.perfil_id === d.perfil!.id)} onEdit={() => d.setIsModPerfilOpen(true)} onGenerateAuth={d.handleOpenWizard} onProgramActividad={() => d.setIsModActividadOpen(true)} onVincularExistente={() => d.setIsModVincularPupiloOpen(true)} onVerAutorizacion={(a) => { d.setViewingAuth(a); d.setViewingAuthProfile(d.perfil); d.setIsModAutorizacionVerOpen(true); }} setShowPassModal={d.setShowPassModal} />}
          {d.activeTab === 'unidad' && <DashUnidad perfil={d.perfil} miembros={d.miembrosUnidad} actividades={d.actividades} autorizaciones={d.autorizaciones} onVerFicha={(m) => { d.setViewingFicha(m); d.setIsModVerFichaOpen(true); }} onEdit={(m) => { d.setEditingPupilo(m); d.setEditData(m); d.setIsModPerfilOpen(true); }} onVerAutorizacion={(a, p) => { d.setViewingAuth(a); d.setViewingAuthProfile(p); d.setIsModAutorizacionVerOpen(true); }} onSuccess={() => d.fetchProfile()} />}
          {d.activeTab === 'actas' && <DashActas actas={d.actas} perfil={d.perfil} onNuevaActa={() => d.setIsModActaCrearOpen(true)} onEditActa={(a) => { d.setEditingActa(a); d.setIsModActaCrearOpen(true); }} onSign={d.handleSignActa} onVerActa={d.loadActaDetails} onDelete={d.handleDeleteActa} />}
          {d.activeTab === 'articulos' && <DashBitacoras articulos={d.articulos} filter={d.filter} setFilter={d.setFilter} onDelete={d.handleDeleteArticulo} isAdmin={d.directivo} inactive={isInactive(d.perfil)} />}
          {d.activeTab === 'tally' && (
            <DashTally 
              perfil={d.perfil} 
              refreshKey={tallyRefreshKey}
              onNuevaEntrada={() => { d.setEditingBitacora(null); d.setIsModBitacoraCrearOpen(true); }} 
              onEditEntrada={(b) => { d.setEditingBitacora(b); d.setIsModBitacoraCrearOpen(true); }} 
              onVerEntrada={(b) => { d.setViewingBitacora(b); d.setIsModBitacoraVerOpen(true); }} 
              onDelete={d.handleDeleteBitacora} 
            />
          )}
          {d.activeTab === 'usuarios' && <DashUsuarios userPerfil={d.perfil} usuarios={d.miembrosGrupo} onVer={(u) => { d.setViewingFicha(u); d.setIsModVerFichaOpen(true); }} onEdit={(u) => { d.setEditingPupilo(u); d.setEditData(u); d.setEditContactos(u.contactos_emergencia || []); d.setIsModPerfilOpen(true); }} onDelete={d.handleDeleteUser} onSuccess={() => d.fetchProfile()} />}
          
          {d.activeTab === 'progresion' && (
            <div className="space-y-8">
              {(d.directivo || isApoderado(d.perfil)) && (
                <div className="p-4 bg-zinc-100 dark:bg-black/20 rounded-[2rem] flex flex-wrap gap-2 items-center">
                  <span className="text-[0.8em] font-black uppercase text-clr2 ml-4">Ver Progresion de:</span>
                  {/* Roles 1-3: ven todos los NNJ de la unidad (excluir roles 1-8) */}
                  {/* Roles 4-8: solo ven su pupilo/hijo vinculado */}
                  {(isApoderado(d.perfil) 
                    ? d.pupilos 
                    : d.miembrosUnidad.filter(m => (m.rol_id ?? 0) > 8)
                  ).map(m => (
                    <button 
                      key={m.id} 
                      onClick={() => d.setSelectedProgresionPerfil(m)}
                      className={`px-4 py-2 rounded-xl text-[0.8em] font-black uppercase transition-all ${d.selectedProgresionPerfil?.id === m.id ? 'bg-clr7 text-white shadow-md' : 'bg-white dark:bg-clr4 text-clr2'}`}
                    >
                      {m.nombres}
                    </button>
                  ))}
                  {d.nnj && (
                    <button 
                      onClick={() => d.setSelectedProgresionPerfil(d.perfil)}
                      className={`px-4 py-2 rounded-xl text-[0.8em] font-black uppercase transition-all ${d.selectedProgresionPerfil?.id === d.perfil!.id ? 'bg-clr7 text-white shadow-md' : 'bg-white dark:bg-clr4 text-clr2'}`}
                    >
                      Mi Progresion
                    </button>
                  )}
                </div>
              )}

              {(d.selectedProgresionPerfil || d.nnj || d.directivo || !canSeeAllTabs(d.perfil)) ? (
                <DashmodProgresion 
                  perfil={d.selectedProgresionPerfil || d.perfil} 
                  userPerfil={d.perfil} 
                />
              ) : (
                <div className="p-20 text-center border-2 border-dashed rounded-[3rem] opacity-40">
                  <p className="italic uppercase tracking-widest text-[0.8em]">Selecciona un beneficiario para ver su Camino de Seeonee.</p>
                </div>
              )}
            </div>
          )}

          {d.activeTab === 'inventario' && <DashInventario items={d.inventario} isAdmin={d.directivo} onEdit={(item) => { d.setEditingInventoryItem(item); d.setIsModInventarioOpen(true); }} onDelete={d.handleDeleteInventory} onNuevo={() => { d.setEditingInventoryItem(null); d.setIsModInventarioOpen(true); }} />}
          {d.activeTab === 'tesoreria' && (
            <div className="space-y-6">
              <div className="flex bg-zinc-100 dark:bg-black/20 p-1 rounded-2xl w-fit">
                <button onClick={() => d.setSubTabTeso('libro')} className={`px-6 py-2 rounded-xl text-[0.8em] font-black uppercase ${d.subTabTeso === 'libro' ? 'bg-white dark:bg-clr5 shadow-md text-clr6' : 'opacity-40'}`}>Libro</button>
                <button onClick={() => d.setSubTabTeso('rendiciones')} className={`px-6 py-2 rounded-xl text-[0.8em] font-black uppercase ${d.subTabTeso === 'rendiciones' ? 'bg-white dark:bg-clr5 shadow-md text-clr6' : 'opacity-40'}`}>Rendiciones</button>
                <button onClick={() => d.setSubTabTeso('recaudaciones')} className={`px-6 py-2 rounded-xl text-[0.8em] font-black uppercase ${d.subTabTeso === 'recaudaciones' ? 'bg-white dark:bg-clr5 shadow-md text-clr6' : 'opacity-40'}`}>Recaudaciones</button>
              </div>
              {d.subTabTeso === 'libro' && <DashTesoreria movimientos={d.tesoreria} unidades={d.unidades} isAdmin={true} canAction={d.canActionTeso} onNuevoMovimiento={() => { d.setEditingMov(null); d.setIsModTesoreriaOpen(true); }} onEditMovimiento={(m) => { d.setEditingMov(m); d.setIsModTesoreriaOpen(true); }} onDeleteMovimiento={d.handleDeleteMov} onEmitirVale={() => d.setIsModValeOpen(true)} onVerMovimiento={(m) => { d.setViewingMov(m); d.setIsModTesoreriaVerOpen(true); }} />}
              {d.subTabTeso === 'rendiciones' && <DashRendiciones rendiciones={d.rendiciones} isAdmin={d.canActionTeso} onNueva={() => d.setIsModRendicionOpen(true)} onVer={(r) => { d.setViewingRendicion(r); d.setIsModRendicionVerOpen(true); }} onDelete={d.handleDeleteRendicion} />}
              {d.subTabTeso === 'recaudaciones' && <DashRecaudaciones perfil={d.perfil} unidades={d.unidades} canAction={d.canActionTeso} onSuccess={d.fetchProfile} />}
            </div>
          )}
          {d.activeTab === 'ciclo' && (
            <div className="space-y-6">
              <div className="flex bg-zinc-100 dark:bg-black/20 p-1 rounded-2xl w-fit">
                <button onClick={() => d.setSubTabCiclo('activo')} className={`px-6 py-2 rounded-xl text-[0.8em] font-black uppercase ${d.subTabCiclo === 'activo' ? 'bg-white dark:bg-clr5 shadow-md text-clr6' : 'opacity-40'}`}>Ciclo Activo</button>
                <button onClick={() => d.setSubTabCiclo('historial')} className={`px-6 py-2 rounded-xl text-[0.8em] font-black uppercase ${d.subTabCiclo === 'historial' ? 'bg-white dark:bg-clr5 shadow-md text-clr6' : 'opacity-40'}`}>Historial</button>
                {d.directivo && (
                  <button onClick={() => d.setSubTabCiclo('otras_unidades')} className={`px-6 py-2 rounded-xl text-[0.8em] font-black uppercase ${d.subTabCiclo === 'otras_unidades' ? 'bg-white dark:bg-clr5 shadow-md text-clr6' : 'opacity-40'}`}>Otras Unidades</button>
                )}
              </div>
              {d.subTabCiclo === 'activo' && <DashCiclo perfil={d.perfil} />}
              {d.subTabCiclo === 'historial' && <DashCicloHistorial perfil={d.perfil} />}
              {d.subTabCiclo === 'otras_unidades' && <DashCiclosOtros perfil={d.perfil} />}
            </div>
          )}
          </ErrorBoundary>
        </div>
      </main>

      <DashModPerfil isOpen={d.isModPerfilOpen} onClose={() => d.setIsModPerfilOpen(false)} editingPupilo={d.editingPupilo} perfil={d.perfil} editData={d.editData} setEditData={d.setEditData} editContactos={d.editContactos as any} setEditContactos={d.setEditContactos as any} roles={d.roles} unidades={d.unidades} onSuccess={d.fetchProfile} />
      <DashModActaCrear isOpen={d.isModActaCrearOpen} onClose={() => d.setIsModActaCrearOpen(false)} perfil={d.perfil} miembrosUnidad={d.miembrosUnidad} onSuccess={d.fetchProfile} editingActa={d.editingActa} />
      <DashModActaVer isOpen={d.isModActaVerOpen} onClose={() => d.setIsModActaVerOpen(false)} acta={d.viewingActa} />
      <DashModBitacoraCrear isOpen={d.isModBitacoraCrearOpen} onClose={() => d.setIsModBitacoraCrearOpen(false)} perfil={d.perfil} onSuccess={() => { d.fetchProfile(); setTallyRefreshKey(k => k + 1) }} editingBitacora={d.editingBitacora} />
      <DashModBitacoraVer isOpen={d.isModBitacoraVerOpen} onClose={() => d.setIsModBitacoraVerOpen(false)} bitacora={d.viewingBitacora} />
      <DashModVerFicha isOpen={d.isModVerFichaOpen} onClose={() => d.setIsModVerFichaOpen(false)} miembro={d.viewingFicha} perfil={d.perfil} autorizaciones={d.autorizaciones} />
      <DashModInventarioItem isOpen={d.isModInventarioOpen} onClose={() => d.setIsModInventarioOpen(false)} onSuccess={d.fetchProfile} editingItem={d.editingInventoryItem} perfil={d.perfil} unidades={d.unidades} />
      <DashModMovimiento isOpen={d.isModTesoreriaOpen} onClose={() => d.setIsModTesoreriaOpen(false)} onSuccess={d.fetchProfile} editingMov={d.editingMov} perfil={d.perfil} unidades={d.unidades} />
      <DashModComprobante isOpen={d.isModValeOpen} onClose={() => d.setIsModValeOpen(false)} onSuccess={d.fetchProfile} perfil={d.perfil} unidades={d.unidades} />
      <DashModTesoreriaVer isOpen={d.isModTesoreriaVerOpen} onClose={() => d.setIsModTesoreriaVerOpen(false)} data={d.viewingMov} />
      <DashModRendicionCrear isOpen={d.isModRendicionOpen} onClose={() => d.setIsModRendicionOpen(false)} onSuccess={d.fetchProfile} perfil={d.perfil} unidades={d.unidades} />
      <DashModRendicionVer isOpen={d.isModRendicionVerOpen} onClose={() => d.setIsModRendicionVerOpen(false)} rendicion={d.viewingRendicion} perfil={d.perfil} />
      
      {d.isModAutorizacionOpen && d.targetAuthProfile && (
        <DashModAutorizacionWizard
          isOpen={d.isModAutorizacionOpen}
          onClose={d.handleCloseWizard}
          perfil={d.targetAuthProfile}
          onSuccess={d.fetchProfile}
        />
      )}
      {d.isModAutorizacionVerOpen && (
        <DashModAutorizacionVer 
          isOpen={d.isModAutorizacionVerOpen} 
          onClose={() => d.setIsModAutorizacionVerOpen(false)} 
          auth={d.viewingAuth} 
          perfil={d.viewingAuthProfile} 
        />
      )}

      {d.isModActividadOpen && (
        <DashModActividadCrear 
          isOpen={d.isModActividadOpen} 
          onClose={() => d.setIsModActividadOpen(false)} 
          perfil={d.perfil} 
          unidades={d.unidades} 
          onSuccess={d.fetchProfile} 
        />
      )}

      {d.isModVincularPupiloOpen && (
        <DashModVincularPupilo
          isOpen={d.isModVincularPupiloOpen}
          onClose={() => d.setIsModVincularPupiloOpen(false)}
          perfil={d.perfil}
          onSuccess={d.fetchProfile}
        />
      )}

      {d.showPassModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-clr5 w-full max-w-md rounded-[3rem] p-10 shadow-2xl">
            <h2 className="text-2xl font-black font-display uppercase text-[#cb3327] mb-8 border-b pb-4 tracking-tighter font-bold">Seguridad</h2>
            <form onSubmit={async (e) => { e.preventDefault(); const { error } = await supabase.auth.updateUser({ password: d.newPass }); if (!error) { toast.success('Contraseña actualizada correctamente.'); d.setShowPassModal(false); } else toast.error(error.message); }} className="space-y-6">
              <input type="password" value={d.newPass} onChange={(e) => d.setNewPass(e.target.value)} className="w-full p-4 rounded-2xl border bg-zinc-50 font-bold text-center" autoFocus placeholder="Nueva Contrasena" />
              <div className="flex gap-2 pt-4"><button type="submit" className="flex-1 py-4 bg-clr7 text-white font-black uppercase rounded-2xl shadow-xl font-inika text-[0.8em] tracking-widest">Actualizar</button><button type="button" onClick={() => d.setShowPassModal(false)} className="flex-1 py-4 bg-zinc-100 rounded-2xl font-inika text-[0.8em] tracking-widest">Cancelar</button></div>
            </form>
          </div>
        </div>
      )}
      {d.activeCeremonyForMessage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border dark:border-white/10 w-full max-w-md rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-zinc-100 dark:border-white/5 flex justify-between items-center bg-zinc-50 dark:bg-black/10">
              <h3 className="font-extrabold uppercase text-[1.1em] text-zinc-950 dark:text-white">
                Escribir Mensaje Scout
              </h3>
              <button 
                onClick={d.handleCloseMessageModal} 
                className="text-zinc-455 hover:text-zinc-650 dark:hover:text-white font-black text-xl"
              >
                X
              </button>
            </div>

            <div className="p-6 space-y-4 text-[0.9em]">
              <p className="font-bold text-zinc-650 dark:text-zinc-350">
                Deja tus palabras para <span className="text-zinc-950 dark:text-white uppercase font-extrabold">{d.activeCeremonyForMessage.perfil?.nombres} {d.activeCeremonyForMessage.perfil?.apellidos}</span> en su ceremonia de <span className="text-clr7 font-extrabold uppercase">{d.activeCeremonyForMessage.nombre_hito}</span>:
              </p>
              <textarea
                value={d.farewellMessageText}
                onChange={(e) => d.setFarewellMessageText(e.target.value)}
                placeholder="Escribe tus mejores deseos, anecdotas o felicitaciones aqui..."
                rows={4}
                className="w-full bg-zinc-50 dark:bg-black/20 border dark:border-white/10 p-3 rounded-xl font-bold text-zinc-805 dark:text-white placeholder-zinc-450"
              />
            </div>

            <div className="p-4 border-t border-zinc-100 dark:border-white/5 flex gap-3 bg-zinc-50/50 dark:bg-black/10 shrink-0">
              <button 
                type="button"
                onClick={d.handleCloseMessageModal}
                className="flex-1 py-3 text-[0.8em] font-black uppercase tracking-wider text-zinc-455 hover:text-red-500 transition-all"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={d.handleSaveCeremonyMessage}
                disabled={!d.farewellMessageText.trim()}
                className="flex-[2] py-3 bg-clr7 text-white text-[0.8em] font-black uppercase rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all tracking-wider disabled:opacity-50 cursor-pointer"
              >
                Enviar Mensaje
              </button>
            </div>
          </div>
        </div>
      )}
      {d.isSyncing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-clr5 w-full max-w-md rounded-[3rem] p-10 shadow-2xl flex flex-col items-center text-center space-y-6">
            <div className="relative w-20 h-20 flex items-center justify-center bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300 rounded-full animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-black font-display uppercase tracking-tight text-clr5 dark:text-clr1">Preparando Campamento</h3>
              <p className="text-sm font-medium opacity-65 font-body leading-tight">
                Estamos descargando los datos de tu unidad a la base de datos local para que puedas acceder sin senal.
              </p>
            </div>

            <div className="w-full bg-zinc-100 dark:bg-black/35 h-3 rounded-full overflow-hidden animate-pulse">
              <div 
                className="bg-amber-600 h-full transition-all duration-300 rounded-full" 
                style={{ width: `${d.syncProgress}%` }}
              ></div>
            </div>
            
            <p className="text-xs font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider">
              {d.syncProgress}% - {d.syncMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
