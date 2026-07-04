'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import SecondaryHeader from '@/components/SecondaryHeader'

import dynamic from 'next/dynamic'

// Vistas Dinámicas
const DashInicio = dynamic(() => import('@/components/dashboard/dash_inicio'), { ssr: false })
const DashUnidad = dynamic(() => import('@/components/dashboard/dash_unidad'), { ssr: false })
const DashGrupo = dynamic(() => import('@/components/dashboard/dash_grupo'), { ssr: false })
const DashActas = dynamic(() => import('@/components/dashboard/dash_actas'), { ssr: false })
const DashBitacoras = dynamic(() => import('@/components/dashboard/dash_bitacoras'), { ssr: false })
const DashTally = dynamic(() => import('@/components/dashboard/dash_tally'), { ssr: false })
const DashCiclo = dynamic(() => import('@/components/dashboard/dash_ciclo'), { ssr: false })
const DashCicloHistorial = dynamic(() => import('@/components/dashboard/dash_ciclo_historial'), { ssr: false })
const DashCiclosOtros = dynamic(() => import('@/components/dashboard/dash_ciclos_otros'), { ssr: false })
const DashInventario = dynamic(() => import('@/components/dashboard/dash_inventario'), { ssr: false })
const DashTesoreria = dynamic(() => import('@/components/dashboard/dash_tesoreria'), { ssr: false })
const DashRendiciones = dynamic(() => import('@/components/dashboard/dash_rendiciones'), { ssr: false })
const DashUsuarios = dynamic(() => import('@/components/dashboard/dash_usuarios'), { ssr: false })
const DashmodProgresion = dynamic(() => import('@/components/dashboard/dashmod_progresion'), { ssr: false })

// Modales Dinámicos
const DashModPerfil = dynamic(() => import('@/components/dashboard/dashmod_perfil'), { ssr: false })
const DashModActaCrear = dynamic(() => import('@/components/dashboard/dashmod_acta_crear'), { ssr: false })
const DashModActaVer = dynamic(() => import('@/components/dashboard/dashmod_acta_ver'), { ssr: false })
const DashModBitacoraCrear = dynamic(() => import('@/components/dashboard/dashmod_bitacora_crear'), { ssr: false })
const DashModBitacoraVer = dynamic(() => import('@/components/dashboard/dashmod_bitacora_ver'), { ssr: false })
const DashModVerFicha = dynamic(() => import('@/components/dashboard/dashmod_ver_ficha'), { ssr: false })
const DashModInventarioItem = dynamic(() => import('@/components/dashboard/dashmod_inventario'), { ssr: false })
const DashModMovimiento = dynamic(() => import('@/components/dashboard/dashmod_movimiento'), { ssr: false })
const DashModComprobante = dynamic(() => import('@/components/dashboard/dashmod_comprobante'), { ssr: false })
const DashModTesoreriaVer = dynamic(() => import('@/components/dashboard/dashmod_tesoreria_ver'), { ssr: false })
const DashModRendicionCrear = dynamic(() => import('@/components/dashboard/dashmod_rendicion_crear'), { ssr: false })
const DashModRendicionVer = dynamic(() => import('@/components/dashboard/dashmod_rendicion_ver'), { ssr: false })
const DashModAutorizacionWizard = dynamic(() => import('@/components/dashboard/dashmod_autorizacion_wizard'), { ssr: false })
const DashModAutorizacionVer = dynamic(() => import('@/components/dashboard/dashmod_autorizacion_ver'), { ssr: false })
const DashModActividadCrear = dynamic(() => import('@/components/dashboard/dashmod_actividad_crear'), { ssr: false })
const DashModVincularPupilo = dynamic(() => import('@/components/dashboard/dashmod_vincular_pupilo'), { ssr: false })

import { getBitacoraName, getBitacoraDescription } from '@/lib/bitacora-utils'

export default function DashboardPage() {
  // 1. ESTADOS DE DATOS
  const [activeTab, setActiveTab] = useState('inicio')
  const [perfil, setPerfil] = useState<any>(null)
  const [unidades, setUnidades] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [contactos, setContactos] = useState<any[]>([])
  const [pupilos, setPupilos] = useState<any[]>([])
  const [apoderado, setApoderado] = useState<any>(null)
  const [miembrosUnidad, setMiembrosUnidad] = useState<any[]>([])
  const [miembrosGrupo, setMiembrosGrupo] = useState<any[]>([])
  const [actas, setActas] = useState<any[]>([])
  const [bitacoras, setBitacoras] = useState<any[]>([])
  const [articulos, setArticulos] = useState<any[]>([])
  const [inventario, setInventario] = useState<any[]>([])
  const [tesoreria, setTesoreria] = useState<any[]>([])
  const [rendiciones, setRendiciones] = useState<any[]>([])
  const [actividades, setActividades] = useState<any[]>([]) 
  const [autorizaciones, setAutorizaciones] = useState<any[]>([])
  const [notificaciones, setNotificaciones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('todos')
  const [subTabTeso, setSubTabTeso] = useState<'libro' | 'rendiciones'>('libro')
  const [subTabCiclo, setSubTabCiclo] = useState<'activo' | 'historial' | 'otras_unidades'>('activo')
  
  // 2. ESTADOS DE MODALES (Consolidados para cumplir con KISS)
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const isModPerfilOpen = activeModal === 'perfil';
  const setIsModPerfilOpen = (open: boolean) => setActiveModal(open ? 'perfil' : null);

  const isModActaCrearOpen = activeModal === 'acta_crear';
  const setIsModActaCrearOpen = (open: boolean) => setActiveModal(open ? 'acta_crear' : null);

  const isModActaVerOpen = activeModal === 'acta_ver';
  const setIsModActaVerOpen = (open: boolean) => setActiveModal(open ? 'acta_ver' : null);

  const isModBitacoraCrearOpen = activeModal === 'bitacora_crear';
  const setIsModBitacoraCrearOpen = (open: boolean) => setActiveModal(open ? 'bitacora_crear' : null);

  const isModBitacoraVerOpen = activeModal === 'bitacora_ver';
  const setIsModBitacoraVerOpen = (open: boolean) => setActiveModal(open ? 'bitacora_ver' : null);

  const isModVerFichaOpen = activeModal === 'ver_ficha';
  const setIsModVerFichaOpen = (open: boolean) => setActiveModal(open ? 'ver_ficha' : null);

  const isModInventarioOpen = activeModal === 'inventario';
  const setIsModInventarioOpen = (open: boolean) => setActiveModal(open ? 'inventario' : null);

  const isModTesoreriaOpen = activeModal === 'tesoreria';
  const setIsModTesoreriaOpen = (open: boolean) => setActiveModal(open ? 'tesoreria' : null);

  const isModValeOpen = activeModal === 'vale';
  const setIsModValeOpen = (open: boolean) => setActiveModal(open ? 'vale' : null);

  const isModTesoreriaVerOpen = activeModal === 'tesoreria_ver';
  const setIsModTesoreriaVerOpen = (open: boolean) => setActiveModal(open ? 'tesoreria_ver' : null);

  const isModRendicionOpen = activeModal === 'rendicion';
  const setIsModRendicionOpen = (open: boolean) => setActiveModal(open ? 'rendicion' : null);

  const isModRendicionVerOpen = activeModal === 'rendicion_ver';
  const setIsModRendicionVerOpen = (open: boolean) => setActiveModal(open ? 'rendicion_ver' : null);

  const isModAutorizacionOpen = activeModal === 'autorizacion';
  const setIsModAutorizacionOpen = (open: boolean) => setActiveModal(open ? 'autorizacion' : null);

  const isModAutorizacionVerOpen = activeModal === 'autorizacion_ver';
  const setIsModAutorizacionVerOpen = (open: boolean) => setActiveModal(open ? 'autorizacion_ver' : null);

  const isModActividadOpen = activeModal === 'actividad';
  const setIsModActividadOpen = (open: boolean) => setActiveModal(open ? 'actividad' : null);

  const isModVincularPupiloOpen = activeModal === 'vincular_pupilo';
  const setIsModVincularPupiloOpen = (open: boolean) => setActiveModal(open ? 'vincular_pupilo' : null);
  
  // 3. ESTADOS DE EDICIÓN / VISUALIZACIÓN
  const [editingPupilo, setEditingPupilo] = useState<any>(null)
  const [editData, setEditData] = useState<any>({})
  const [editContactos, setEditContactos] = useState<any[]>([])
  const [editingActa, setEditingActa] = useState<any>(null)
  const [viewingActa, setViewingActa] = useState<any>(null)
  const [editingBitacora, setEditingBitacora] = useState<any>(null)
  const [viewingBitacora, setViewingBitacora] = useState<any>(null)
  const [viewingFicha, setViewingFicha] = useState<any>(null)
  const [editingInventoryItem, setEditingInventoryItem] = useState<any>(null)
  const [editingMov, setEditingMov] = useState<any>(null)
  const [viewingMov, setViewingMov] = useState<any>(null)
  const [viewingRendicion, setViewingRendicion] = useState<any>(null)
  const [viewingAuth, setViewingAuth] = useState<any>(null)
  const [viewingAuthProfile, setViewingAuthProfile] = useState<any>(null)
  const [targetAuthProfile, setTargetAuthProfile] = useState<any>(null)
  const [selectedProgresionPerfil, setSelectedProgresionPerfil] = useState<any>(null)
  
  // --- Estados de Ceremonias Globales ---
  const [activeCeremonyForMessage, setActiveCeremonyForMessage] = useState<any>(null)
  const [farewellMessageText, setFarewellMessageText] = useState('')
  
  const [showPassModal, setShowPassModal] = useState(false)
  const [newPass, setNewPass] = useState('')

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return (window.location.href = '/login')
      
      const { data: profile, error } = await supabase.from('perfiles').select('*, roles(name), unidades(nombre, colores, logo_unidad_url, logo_rama_url)').eq('id', user.id).maybeSingle()
      if (error || !profile || profile.estado === 'pendiente') {
        if (profile?.estado === 'pendiente') alert('Tu cuenta aún no ha sido activada.');
        await supabase.auth.signOut(); window.location.href = '/login'; return;
      }

      const isDirectivo = [1, 2, 3].includes(profile.rol_id)
      const isNNJ = [9, 10, 11, 12, 13].includes(profile.rol_id)
      const articlesQuery = isDirectivo ? supabase.from('articulos').select('*').order('created_at', { ascending: false }) : isNNJ ? supabase.from('articulos').select('*').eq('autor_id', user.id).order('created_at', { ascending: false }) : Promise.resolve({ data: [] });

      const [notifs, acts, arts, rolesData, emergency, invData, unitsData, tesoData, rendData, actvsData] = await Promise.all([
        supabase.from('notificaciones').select('*').eq('perfil_id', user.id).order('created_at', { ascending: false }),
        supabase.from('actas').select('*, unidades(nombre), acta_temas(*), mi_firma:acta_firmas!acta_firmas_acta_id_fkey(*)').eq('acta_firmas.perfil_id', user.id).order('fecha', { ascending: false }),
        articlesQuery,
        supabase.from('roles').select('*').order('id'),
        supabase.from('contactos_emergencia').select('*').eq('perfil_id', user.id),
        supabase.from('inventario').select('*, unidades(nombre)').order('nombre'),
        supabase.from('unidades').select('*').order('id'),
        supabase.from('tesoreria_movimientos').select('*, tesoreria_items(*), unidades(nombre), registrado_por:perfiles(nombres, apellidos)').order('anio', {ascending: false}).order('mes', {ascending: false}).order('dia', {ascending: false}),
        supabase.from('tesoreria_rendiciones').select('*, unidades(nombre)').order('created_at', { ascending: false }),
        supabase.from('actividades_programadas').select('*, unidades(nombre)').order('fecha_inicio', { ascending: false })
      ])

      setNotificaciones(notifs.data || [])
      setArticulos(arts.data || [])
      setRoles(rolesData.data || [])
      setContactos(emergency.data || [])
      setInventario(invData.data || [])
      setUnidades(unitsData.data || [])
      setTesoreria(tesoData.data || [])
      setRendiciones(rendData.data || [])
      setActividades(actvsData.data || [])

      let pupilList: any[] = []
      if ([2, 3, 4, 5, 6, 7, 8].includes(profile.rol_id)) { 
        const { data: children } = await supabase.from('perfiles').select('*, roles(name), unidades(nombre, colores, logo_unidad_url, logo_rama_url), contactos_emergencia(*)').eq('apoderado_id', user.id)
        pupilList = children || []
        setPupilos(pupilList)
      }

      // 4. Autorizaciones (Propias + Relacionadas)
      let authsQuery = supabase.from('autorizaciones_actividades').select('*')
      const idsDeInteres = [user.id, ...pupilList.map(p => p.id)]
      if (isDirectivo && profile.unidad_id) {
        const { data: uMems } = await supabase.from('perfiles').select('id').eq('unidad_id', profile.unidad_id)
        uMems?.forEach(m => idsDeInteres.push(m.id))
      }
      const { data: authsData } = await authsQuery.in('perfil_id', Array.from(new Set(idsDeInteres))).order('fecha_firma', { ascending: false })
      setAutorizaciones(authsData || [])

      if (isDirectivo) {
        if (profile.unidad_id) {
          const { data: u } = await supabase.from('perfiles').select('*, roles(name), unidades(nombre, colores, logo_unidad_url, logo_rama_url), contactos_emergencia(*), apoderado:apoderado_id(id, nombres, apellidos, telefono, email)').eq('unidad_id', profile.unidad_id).order('nombres')
          setMiembrosUnidad(u || [])
        }
        let gQuery = supabase.from('perfiles').select('*, roles(name), unidades(nombre, colores, logo_unidad_url, logo_rama_url), contactos_emergencia(*), apoderado:apoderado_id(id, nombres, apellidos, telefono, email)').order('nombres')
        if (profile.rol_id !== 1) gQuery = gQuery.eq('pertenece_grupo_nua_mana', true)
        const { data: g } = await gQuery; setMiembrosGrupo(g || [])
      }

      if (acts.data) {
        const actasWithSignatures = await Promise.all(acts.data.map(async acta => {
          const { data: firma } = await supabase.from('acta_firmas').select('*').eq('acta_id', acta.id).eq('perfil_id', user.id).maybeSingle()
          const { data: participante } = await supabase.from('acta_participantes').select('rol_en_reunion').eq('acta_id', acta.id).eq('perfil_id', user.id).maybeSingle()
          return { ...acta, mi_firma: firma, mi_rol_reunion: participante?.rol_en_reunion }
        }))
        setActas(actasWithSignatures)
      }

      setPerfil({ ...profile, contactos_emergencia: emergency.data || [] })
      setEditData(profile); setEditContactos(emergency.data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { 
    fetchProfile();
    // Safety Force Close
    setIsModAutorizacionOpen(false);
    setTargetAuthProfile(null);
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && perfil) {
      const params = new URLSearchParams(window.location.search);
      const openCeremonyIdParam = params.get('openCeremonyId');
      if (openCeremonyIdParam) {
        supabase
          .from('ceremonias')
          .select('*, perfil:perfil_id(nombres, apellidos, unidad_id)')
          .eq('id', openCeremonyIdParam)
          .single()
          .then(async ({ data: ceremony }) => {
            if (ceremony && ceremony.perfil_id) {
              const isLeaderOfUnit = [1, 2, 3].includes(perfil.rol_id) && 
                                     (perfil.rol_id === 1 || perfil.unidad_id === ceremony.perfil?.unidad_id);
              
              if (isLeaderOfUnit && ceremony.perfil_id !== perfil.id) {
                // Es líder de la unidad y es otro usuario: ir a progresión y cargar su perfil
                setActiveTab('progresion');
                const { data: targetProfile } = await supabase
                  .from('perfiles')
                  .select('*, roles(name), unidades(nombre, colores, logo_unidad_url, logo_rama_url)')
                  .eq('id', ceremony.perfil_id)
                  .maybeSingle();
                if (targetProfile) {
                  setSelectedProgresionPerfil(targetProfile);
                }
              } else {
                // No es líder de la unidad, o es uno mismo: no cambiar de pestaña ni perfil,
                // solo abrir el modal global
                setActiveCeremonyForMessage(ceremony);
              }
            }
          });
      }
    }
  }, [perfil]);

  const handleCloseMessageModal = () => {
    setActiveCeremonyForMessage(null);
    setFarewellMessageText('');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('openCeremonyId');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleSaveCeremonyMessage = async () => {
    if (!activeCeremonyForMessage || !farewellMessageText.trim()) return;
    try {
      const { error } = await supabase
        .from('ceremonia_mensajes')
        .insert([{
          ceremonia_id: activeCeremonyForMessage.id,
          remitente_id: perfil.id,
          mensaje: farewellMessageText.trim()
        }]);
      if (error) throw error;

      alert('¡Mensaje enviado con éxito!');
      handleCloseMessageModal();
    } catch (err: any) {
      console.error(err);
      alert('Error al guardar mensaje: ' + err.message);
    }
  };

  const handleOpenWizard = (p: any) => { setTargetAuthProfile(p || perfil); setIsModAutorizacionOpen(true); }
  const handleCloseWizard = () => { setIsModAutorizacionOpen(false); setTargetAuthProfile(null); }

  const handleSignActa = async (actaId: string) => {
    await supabase.from('acta_firmas').upsert({ acta_id: actaId, perfil_id: perfil.id, firmado: true, fecha_firma: new Date().toISOString() }, { onConflict: 'acta_id,perfil_id' });
    fetchProfile(); alert('Firmado.');
  }

  const handleDeleteActa = async (id: string) => {
    if (confirm('¿Seguro que deseas eliminar esta acta?')) {
      try {
        // 1. Obtener datos del acta y participantes antes de borrar
        const { data: acta } = await supabase.from('actas').select('*').eq('id', id).single()
        const { data: parts } = await supabase.from('acta_participantes').select('perfil_id').eq('acta_id', id).neq('asistencia', 'No Invitado')
        
        if (acta && parts && parts.length > 0) {
          const actorName = `${perfil.nombres} ${perfil.apellidos}`
          const msg = `${actorName} ha eliminado el acta ${acta.codigo} (${acta.tipo}) del ${acta.fecha}.`
          
          const notifs = parts.map(p => ({
            perfil_id: p.perfil_id,
            mensaje: msg,
            tipo: 'sistema',
            link_url: '/dashboard'
          }))
          
          await supabase.from('notificaciones').insert(notifs)
        }
      } catch (err) {
        console.error('Error enviando notificaciones de eliminación de acta:', err)
      }
      
      // 2. Eliminar el acta
      await supabase.from('actas').delete().eq('id', id);
      fetchProfile();
    }
  }
  const handleDeleteArticulo = async (id: string) => { if (confirm('¿Eliminar?')) { await supabase.from('articulos').delete().eq('id', id); fetchProfile(); } }
  const handleDeleteInventory = async (id: string) => { if (confirm('¿Eliminar?')) { await supabase.from('inventario').delete().eq('id', id); fetchProfile(); } }
  const handleDeleteMov = async (id: string) => { if (confirm('¿Eliminar?')) { await supabase.from('tesoreria_movimientos').delete().eq('id', id); fetchProfile(); } }
  const handleDeleteRendicion = async (id: string) => { if (confirm('¿Eliminar esta rendición?')) { await supabase.from('tesoreria_rendiciones').delete().eq('id', id); fetchProfile(); } }
  const handleDeleteBitacora = async (id: string) => { if (confirm('¿Eliminar esta historia?')) { await supabase.from('bitacoras_unidad').delete().eq('id', id); fetchProfile(); } }

  const loadActaDetails = async (acta: any) => {
    const [p, t, f, a] = await Promise.all([
      supabase.from('acta_participantes').select('*, perfiles(nombres, apellidos)').eq('acta_id', acta.id),
      supabase.from('acta_temas').select('*').eq('acta_id', acta.id).order('orden'),
      supabase.from('acta_firmas').select('*, perfiles(nombres, apellidos)').eq('acta_id', acta.id),
      supabase.from('acta_acuerdos').select('*, responsable:perfiles(nombres, apellidos)').eq('acta_id', acta.id)
    ])
    setViewingActa({ ...acta, participantes: p.data || [], temas: t.data || [], firmas: f.data || [], acuerdos: a.data || [] }); setIsModActaVerOpen(true)
  }

  const markNotifRead = async (id: string) => { await supabase.from('notificaciones').update({ leido: true }).eq('id', id); fetchProfile(); }

  if (loading) return <div className="p-20 text-center font-body text-clr2 italic tracking-widest uppercase text-[0.8em]">Sincronizando Bitácora...</div>
  if (!perfil) return null

  const isDirectivo = [1, 2, 3].includes(perfil.rol_id || 0)
  const isNNJ = [9, 10, 11, 12, 13].includes(perfil.rol_id || 0)
  const canSeeUnits = isDirectivo
  const canSeeTeso = (perfil.rol_id || 0) <= 8
  const canActionTeso = (perfil.rol_id || 0) <= 7

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-clr4 font-body transition-colors">
      <SecondaryHeader />
      <main className="max-w-[1080px] mx-auto px-2 py-32">
        <div className="bg-gradient-to-br from-white/30 via-clr5/20 to-clr7/40 dark:from-clr4 dark:via-clr5 dark:to-clr7/20 rounded-[1rem] p-2 md:p-4 shadow-2xl border border-clr10 dark:border-clr4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 border-b border-zinc-100 dark:border-clr4 pb-4">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-black font-display text-clr5 dark:text-clr1 uppercase tracking-tighter leading-none font-bold">{perfil.nombres} {perfil.apellidos}</h1>
              <p className="text-sm md:text-xl text-[#cb3327] font-bold uppercase tracking-[0.2em] mt-2">{perfil.roles?.name} • {perfil.unidades?.nombre || 'Grupo Nua Mana'}</p>
            </div>
            <div className="shrink-0 w-24 h-24 bg-clr6 rounded-full flex items-center justify-center shadow-xl overflow-hidden"><img src="/images/logos/LogoColor.svg" alt="Logo" className="w-28 h-28" /></div>
          </header>

          {/* ACCIONES RÁPIDAS */}
          <div className="flex flex-col md:flex-row gap-2 border-b border-zinc-100 dark:border-clr4 pb-4">
            {isDirectivo && (
              <button onClick={() => setIsModActividadOpen(true)} className="flex items-center justify-between gap-2 p-2 bg-zinc-900 text-white font-bold uppercase rounded-2xl shadow-xl hover:brightness-125 transition-all tracking-widest text-[1em] font-inika text-right leading-none">
                <div className="w-10 h-10 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_programar_actividad.svg)', maskImage: 'url(/images/iconos/icono_programar_actividad.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
                Programar Actividad
              </button>
            )}
            <button onClick={() => { setEditingPupilo(null); setEditData(perfil); setIsModPerfilOpen(true); }} className="flex items-center justify-between gap-2 p-2 bg-clr6 dark:bg-dclr6 text-white font-bold uppercase rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all tracking-widest text-[1em] font-inika text-right leading-none">
              <div className="w-10 h-10 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_actualizar_ficha.svg)', maskImage: 'url(/images/iconos/icono_actualizar_ficha.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
              Actualizar Mi Ficha
            </button>
            <button onClick={() => handleOpenWizard(perfil)} className="flex items-center justify-between gap-2 p-2 bg-blue-600 text-white font-bold uppercase rounded-2xl shadow-xl hover:bg-blue-700 active:scale-95 transition-all tracking-widest text-[1em] font-inika text-right leading-none">
              <div className="w-10 h-10 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_autorizacion.svg)', maskImage: 'url(/images/iconos/icono_autorizacion.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
              Autorización de Actividad
            </button>
            <button onClick={() => setShowPassModal(true)} className="flex items-center justify-between gap-2 p-2 bg-zinc-200 dark:bg-clr4 text-clr2 font-bold uppercase rounded-2xl hover:bg-zinc-300 transition-all tracking-widest text-[1em] font-inika text-right leading-none">
              <div className="w-10 h-10 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_cambiar_contrasena.svg)', maskImage: 'url(/images/iconos/icono_cambiar_contrasena.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
              Cambiar Contraseña
            </button>
            <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/'; }} className="flex items-center justify-between gap-2 p-2 bg-clr7 dark:bg-dclr7 text-white font-bold uppercase rounded-2xl hover:brightness-110 active:scale-95 transition-all tracking-widest text-[1em] font-inika text-right leading-none">
              <div className="w-10 h-10 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_salir.svg)', maskImage: 'url(/images/iconos/icono_salir.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
              Cerrar Sesión
            </button>
          </div>

          <div className="flex border-b border-zinc-100 dark:border-clr4 mb-5 mt-2 overflow-x-auto scrollbar-hide text-[1em]">
            <button onClick={() => setActiveTab('inicio')} className={`flex flex-col items-center justify-center px-4 py-2 uppercase font-slab border-b-2 gap-1 ${activeTab === 'inicio' ? 'border-clr7 text-clr7 font-bold' : 'border-transparent text-clr2 hover:text-black dark:hover:text-white'}`}>
              <div className="w-8 h-8 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_ficha.svg)', maskImage: 'url(/images/iconos/icono_ficha.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
              <span className="text-[0.8em] sm:text-xs leading-none">Ficha</span>
            </button>
            {canSeeUnits && <button onClick={() => setActiveTab('unidad')} className={`flex flex-col items-center justify-center px-4 py-2 uppercase font-slab border-b-2 gap-1 ${activeTab === 'unidad' ? 'border-clr7 text-clr7 font-bold' : 'border-transparent text-clr2 hover:text-black dark:hover:text-white'}`}>
              <div className="w-8 h-8 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_unidad.svg)', maskImage: 'url(/images/iconos/icono_unidad.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
              <span className="text-[0.8em] sm:text-xs leading-none">Unidad</span>
            </button>}
            {isDirectivo && <button onClick={() => setActiveTab('usuarios')} className={`flex flex-col items-center justify-center px-4 py-2 uppercase font-slab border-b-2 gap-1 ${activeTab === 'usuarios' ? 'border-clr7 text-clr7 font-bold' : 'border-transparent text-clr2 hover:text-black dark:hover:text-white'}`}>
              <div className="w-8 h-8 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_grupo.svg)', maskImage: 'url(/images/iconos/icono_grupo.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
              <span className="text-[0.8em] sm:text-xs leading-none">Grupo</span>
            </button>}
            {perfil?.rol_id !== 14 && <button onClick={() => setActiveTab('actas')} className={`flex flex-col items-center justify-center px-4 py-2 uppercase font-slab border-b-2 gap-1 ${activeTab === 'actas' ? 'border-clr7 text-clr7 font-bold' : 'border-transparent text-clr2 hover:text-black dark:hover:text-white'}`}>
              <div className="w-8 h-8 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_actas.svg)', maskImage: 'url(/images/iconos/icono_actas.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
              <span className="text-[0.8em] sm:text-xs leading-none">Actas</span>
            </button>}
            {canSeeTeso && <button onClick={() => setActiveTab('tesoreria')} className={`flex flex-col items-center justify-center px-4 py-2 uppercase font-slab border-b-2 gap-1 ${activeTab === 'tesoreria' ? 'border-clr7 text-clr7 font-bold' : 'border-transparent text-clr2 hover:text-black dark:hover:text-white'}`}>
              <div className="w-8 h-8 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_tesoreria.svg)', maskImage: 'url(/images/iconos/icono_tesoreria.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
              <span className="text-[0.8em] sm:text-xs leading-none">Tesorería</span>
            </button>}
            {(isDirectivo || isNNJ) && <button onClick={() => setActiveTab('ciclo')} className={`flex flex-col items-center justify-center px-4 py-2 uppercase font-slab border-b-2 gap-1 ${activeTab === 'ciclo' ? 'border-clr7 text-clr7 font-bold' : 'border-transparent text-clr2 hover:text-black dark:hover:text-white'}`}>
              <div className="w-8 h-8 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_ciclo.svg)', maskImage: 'url(/images/iconos/icono_ciclo.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
              <span className="text-[0.8em] sm:text-xs leading-none">Ciclo</span>
            </button>}
            {(isDirectivo || isNNJ) && <button onClick={() => setActiveTab('articulos')} className={`flex flex-col items-center justify-center px-4 py-2 uppercase font-slab border-b-2 gap-1 ${activeTab === 'articulos' ? 'border-clr7 text-clr7 font-bold' : 'border-transparent text-clr2 hover:text-black dark:hover:text-white'}`}>
              <div className="w-8 h-8 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_articulos.svg)', maskImage: 'url(/images/iconos/icono_articulos.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
              <span className="text-[0.8em] sm:text-xs leading-none">Artículos</span>
            </button>}
            {(isDirectivo || isNNJ) && <button onClick={() => setActiveTab('tally')} className={`flex flex-col items-center justify-center px-4 py-2 uppercase font-slab border-b-2 gap-1 ${activeTab === 'tally' ? 'border-clr7 text-clr7 font-bold' : 'border-transparent text-clr2 hover:text-black dark:hover:text-white'}`}>
              <div className="w-8 h-8 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_unidad.svg)', maskImage: 'url(/images/iconos/icono_tally.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
              <span className="text-[0.8em] sm:text-xs leading-none">{getBitacoraName(perfil?.unidad_id)}</span>
            </button>}
            <button onClick={() => setActiveTab('progresion')} className={`flex flex-col items-center justify-center px-4 py-2 uppercase font-slab border-b-2 gap-1 ${activeTab === 'progresion' ? 'border-clr7 text-clr7 font-bold' : 'border-transparent text-clr2 hover:text-black dark:hover:text-white'}`}>
              <div className="w-8 h-8 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_progresion.svg)', maskImage: 'url(/images/iconos/icono_progresion.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
              <span className="text-[0.8em] sm:text-xs leading-none">Progresión</span>
            </button>
            {perfil?.rol_id !== 14 && <button onClick={() => setActiveTab('inventario')} className={`flex flex-col items-center justify-center px-4 py-2 uppercase font-slab border-b-2 gap-1 ${activeTab === 'inventario' ? 'border-clr7 text-clr7 font-bold' : 'border-transparent text-clr2 hover:text-black dark:hover:text-white'}`}>
              <div className="w-8 h-8 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_inventario.svg)', maskImage: 'url(/images/iconos/icono_inventario.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
              <span className="text-[0.8em] sm:text-xs leading-none">Inventario</span>
            </button>}
          </div>

          {activeTab === 'inicio' && perfil && <DashInicio perfil={perfil} pupilos={pupilos} apoderado={apoderado} autorizaciones={autorizaciones.filter(a => a.perfil_id === perfil.id)} onEdit={() => setIsModPerfilOpen(true)} onGenerateAuth={handleOpenWizard} onProgramActividad={() => setIsModActividadOpen(true)} onVincularExistente={() => setIsModVincularPupiloOpen(true)} onVerAutorizacion={(a) => { setViewingAuth(a); setViewingAuthProfile(perfil); setIsModAutorizacionVerOpen(true); }} setShowPassModal={setShowPassModal} />}
          {activeTab === 'unidad' && <DashUnidad perfil={perfil} miembros={miembrosUnidad} actividades={actividades} autorizaciones={autorizaciones} onVerFicha={(m) => { setViewingFicha(m); setIsModVerFichaOpen(true); }} onEdit={(m) => { setEditingPupilo(m); setEditData(m); setIsModPerfilOpen(true); }} onVerAutorizacion={(a, p) => { setViewingAuth(a); setViewingAuthProfile(p); setIsModAutorizacionVerOpen(true); }} />}
          {activeTab === 'actas' && <DashActas actas={actas} perfil={perfil} onNuevaActa={() => setIsModActaCrearOpen(true)} onEditActa={(a) => { setEditingActa(a); setIsModActaCrearOpen(true); }} onSign={handleSignActa} onVerActa={loadActaDetails} onDelete={handleDeleteActa} />}
          {activeTab === 'articulos' && <DashBitacoras articulos={articulos} filter={filter} setFilter={setFilter} onDelete={handleDeleteArticulo} isAdmin={isDirectivo} />}
          {activeTab === 'tally' && (
            <DashTally 
              perfil={perfil} 
              onNuevaEntrada={() => { setEditingBitacora(null); setIsModBitacoraCrearOpen(true); }} 
              onEditEntrada={(b) => { setEditingBitacora(b); setIsModBitacoraCrearOpen(true); }} 
              onVerEntrada={(b) => { setViewingBitacora(b); setIsModBitacoraVerOpen(true); }} 
              onDelete={handleDeleteBitacora} 
            />
          )}
          {activeTab === 'usuarios' && <DashUsuarios userPerfil={perfil} usuarios={miembrosGrupo} onVer={(u) => { setViewingFicha(u); setIsModVerFichaOpen(true); }} onEdit={(u) => { setEditingPupilo(u); setEditData(u); setEditContactos(u.contactos_emergencia || []); setIsModPerfilOpen(true); }} />}
          
          {activeTab === 'progresion' && (
            <div className="space-y-8">
              {/* Selector de Miembro para Apoderados y Dirigentes */}
              {(isDirectivo || perfil.rol_id === 8) && (
                <div className="p-4 bg-zinc-100 dark:bg-black/20 rounded-[2rem] flex flex-wrap gap-2 items-center">
                  <span className="text-[0.8em] font-black uppercase text-clr2 ml-4">Ver Progresión de:</span>
                  {(perfil.rol_id === 8 ? pupilos : miembrosUnidad).map(m => (
                    <button 
                      key={m.id} 
                      onClick={() => setSelectedProgresionPerfil(m)}
                      className={`px-4 py-2 rounded-xl text-[0.8em] font-black uppercase transition-all ${selectedProgresionPerfil?.id === m.id ? 'bg-clr7 text-white shadow-md' : 'bg-white dark:bg-clr4 text-clr2'}`}
                    >
                      {m.nombres}
                    </button>
                  ))}
                  {isNNJ && (
                    <button 
                      onClick={() => setSelectedProgresionPerfil(perfil)}
                      className={`px-4 py-2 rounded-xl text-[0.8em] font-black uppercase transition-all ${selectedProgresionPerfil?.id === perfil.id ? 'bg-clr7 text-white shadow-md' : 'bg-white dark:bg-clr4 text-clr2'}`}
                    >
                      Mí Progresión
                    </button>
                  )}
                </div>
              )}

              {/* Render del Componente de Progresión */}
              {(selectedProgresionPerfil || isNNJ || isDirectivo || perfil?.rol_id === 14) ? (
                <DashmodProgresion 
                  perfil={selectedProgresionPerfil || perfil} 
                  userPerfil={perfil} 
                />
              ) : (
                <div className="p-20 text-center border-2 border-dashed rounded-[3rem] opacity-40">
                  <p className="italic uppercase tracking-widest text-[0.8em]">Selecciona un beneficiario para ver su Camino de Seeonee.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'inventario' && <DashInventario items={inventario} isAdmin={isDirectivo} onEdit={(item) => { setEditingInventoryItem(item); setIsModInventarioOpen(true); }} onDelete={handleDeleteInventory} onNuevo={() => { setEditingInventoryItem(null); setIsModInventarioOpen(true); }} />}
          {activeTab === 'tesoreria' && (
            <div className="space-y-6">
              <div className="flex bg-zinc-100 dark:bg-black/20 p-1 rounded-2xl w-fit">
                <button onClick={() => setSubTabTeso('libro')} className={`px-6 py-2 rounded-xl text-[0.8em] font-black uppercase ${subTabTeso === 'libro' ? 'bg-white dark:bg-clr5 shadow-md text-clr6' : 'opacity-40'}`}>Libro</button>
                <button onClick={() => setSubTabTeso('rendiciones')} className={`px-6 py-2 rounded-xl text-[0.8em] font-black uppercase ${subTabTeso === 'rendiciones' ? 'bg-white dark:bg-clr5 shadow-md text-clr6' : 'opacity-40'}`}>Rendiciones</button>
              </div>
              {subTabTeso === 'libro' ? <DashTesoreria movimientos={tesoreria} unidades={unidades} isAdmin={true} canAction={canActionTeso} onNuevoMovimiento={() => { setEditingMov(null); setIsModTesoreriaOpen(true); }} onEditMovimiento={(m) => { setEditingMov(m); setIsModTesoreriaOpen(true); }} onDeleteMovimiento={handleDeleteMov} onEmitirVale={() => setIsModValeOpen(true)} onVerMovimiento={(m) => { setViewingMov(m); setIsModTesoreriaVerOpen(true); }} /> : <DashRendiciones rendiciones={rendiciones} isAdmin={canActionTeso} onNueva={() => setIsModRendicionOpen(true)} onVer={(r) => { setViewingRendicion(r); setIsModRendicionVerOpen(true); }} onDelete={handleDeleteRendicion} />}
            </div>
          )}
          {activeTab === 'ciclo' && (
            <div className="space-y-6">
              <div className="flex bg-zinc-100 dark:bg-black/20 p-1 rounded-2xl w-fit">
                <button onClick={() => setSubTabCiclo('activo')} className={`px-6 py-2 rounded-xl text-[0.8em] font-black uppercase ${subTabCiclo === 'activo' ? 'bg-white dark:bg-clr5 shadow-md text-clr6' : 'opacity-40'}`}>Ciclo Activo</button>
                <button onClick={() => setSubTabCiclo('historial')} className={`px-6 py-2 rounded-xl text-[0.8em] font-black uppercase ${subTabCiclo === 'historial' ? 'bg-white dark:bg-clr5 shadow-md text-clr6' : 'opacity-40'}`}>Historial</button>
                {isDirectivo && (
                  <button onClick={() => setSubTabCiclo('otras_unidades')} className={`px-6 py-2 rounded-xl text-[0.8em] font-black uppercase ${subTabCiclo === 'otras_unidades' ? 'bg-white dark:bg-clr5 shadow-md text-clr6' : 'opacity-40'}`}>Otras Unidades</button>
                )}
              </div>
              {subTabCiclo === 'activo' && <DashCiclo perfil={perfil} />}
              {subTabCiclo === 'historial' && <DashCicloHistorial perfil={perfil} />}
              {subTabCiclo === 'otras_unidades' && <DashCiclosOtros perfil={perfil} />}
            </div>
          )}
        </div>
      </main>

      <DashModPerfil isOpen={isModPerfilOpen} onClose={() => setIsModPerfilOpen(false)} editingPupilo={editingPupilo} perfil={perfil} editData={editData} setEditData={setEditData} editContactos={editContactos} setEditContactos={setEditContactos} roles={roles} unidades={unidades} onSuccess={fetchProfile} />
      <DashModActaCrear isOpen={isModActaCrearOpen} onClose={() => setIsModActaCrearOpen(false)} perfil={perfil} miembrosUnidad={miembrosUnidad} onSuccess={fetchProfile} editingActa={editingActa} />
      <DashModActaVer isOpen={isModActaVerOpen} onClose={() => setIsModActaVerOpen(false)} acta={viewingActa} />
      <DashModBitacoraCrear isOpen={isModBitacoraCrearOpen} onClose={() => setIsModBitacoraCrearOpen(false)} perfil={perfil} onSuccess={fetchProfile} editingBitacora={editingBitacora} />
      <DashModBitacoraVer isOpen={isModBitacoraVerOpen} onClose={() => setIsModBitacoraVerOpen(false)} bitacora={viewingBitacora} />
      <DashModVerFicha isOpen={isModVerFichaOpen} onClose={() => setIsModVerFichaOpen(false)} miembro={viewingFicha} />
      <DashModInventarioItem isOpen={isModInventarioOpen} onClose={() => setIsModInventarioOpen(false)} onSuccess={fetchProfile} editingItem={editingInventoryItem} perfil={perfil} unidades={unidades} />
      <DashModMovimiento isOpen={isModTesoreriaOpen} onClose={() => setIsModTesoreriaOpen(false)} onSuccess={fetchProfile} editingMov={editingMov} perfil={perfil} unidades={unidades} />
      <DashModComprobante isOpen={isModValeOpen} onClose={() => setIsModValeOpen(false)} onSuccess={fetchProfile} perfil={perfil} unidades={unidades} />
      <DashModTesoreriaVer isOpen={isModTesoreriaVerOpen} onClose={() => setIsModTesoreriaVerOpen(false)} data={viewingMov} />
      <DashModRendicionCrear isOpen={isModRendicionOpen} onClose={() => setIsModRendicionOpen(false)} onSuccess={fetchProfile} perfil={perfil} unidades={unidades} />
      <DashModRendicionVer isOpen={isModRendicionVerOpen} onClose={() => setIsModRendicionVerOpen(false)} rendicion={viewingRendicion} perfil={perfil} />
      
      {isModAutorizacionOpen && targetAuthProfile && (
        <DashModAutorizacionWizard
          isOpen={isModAutorizacionOpen}
          onClose={handleCloseWizard}
          perfil={targetAuthProfile}
          onSuccess={fetchProfile}
        />
      )}
      {isModAutorizacionVerOpen && (
        <DashModAutorizacionVer 
          isOpen={isModAutorizacionVerOpen} 
          onClose={() => setIsModAutorizacionVerOpen(false)} 
          auth={viewingAuth} 
          perfil={viewingAuthProfile} 
        />
      )}

      {isModActividadOpen && (
        <DashModActividadCrear 
          isOpen={isModActividadOpen} 
          onClose={() => setIsModActividadOpen(false)} 
          perfil={perfil} 
          unidades={unidades} 
          onSuccess={fetchProfile} 
        />
      )}

      {isModVincularPupiloOpen && (
        <DashModVincularPupilo
          isOpen={isModVincularPupiloOpen}
          onClose={() => setIsModVincularPupiloOpen(false)}
          perfil={perfil}
          onSuccess={fetchProfile}
        />
      )}

      {showPassModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-clr5 w-full max-w-md rounded-[3rem] p-10 shadow-2xl">
            <h2 className="text-2xl font-black font-display uppercase text-[#cb3327] mb-8 border-b pb-4 tracking-tighter font-bold">Seguridad</h2>
            <form onSubmit={async (e) => { e.preventDefault(); const { error } = await supabase.auth.updateUser({ password: newPass }); if (!error) { alert('¡OK!'); setShowPassModal(false); } else alert(error.message); }} className="space-y-6">
              <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} className="w-full p-4 rounded-2xl border bg-zinc-50 font-bold text-center" autoFocus placeholder="Nueva Contraseña" />
              <div className="flex gap-4 pt-4"><button type="submit" className="flex-1 py-4 bg-clr7 text-white font-black uppercase rounded-2xl shadow-xl font-inika text-[0.8em] tracking-widest">Actualizar</button><button type="button" onClick={() => setShowPassModal(false)} className="flex-1 py-4 bg-zinc-100 rounded-2xl font-inika text-[0.8em] tracking-widest">Cancelar</button></div>
            </form>
          </div>
        </div>
      )}
      {activeCeremonyForMessage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border dark:border-white/10 w-full max-w-md rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-zinc-100 dark:border-white/5 flex justify-between items-center bg-zinc-50 dark:bg-black/10">
              <h3 className="font-extrabold uppercase text-[1.1em] text-zinc-950 dark:text-white">
                💬 Escribir Mensaje Scout
              </h3>
              <button 
                onClick={handleCloseMessageModal} 
                className="text-zinc-455 hover:text-zinc-650 dark:hover:text-white font-black text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-[0.9em]">
              <p className="font-bold text-zinc-650 dark:text-zinc-350">
                Deja tus palabras para <span className="text-zinc-950 dark:text-white uppercase font-extrabold">{activeCeremonyForMessage.perfil?.nombres} {activeCeremonyForMessage.perfil?.apellidos}</span> en su ceremonia de <span className="text-clr7 font-extrabold uppercase">{activeCeremonyForMessage.nombre_hito}</span>:
              </p>
              <textarea
                value={farewellMessageText}
                onChange={(e) => setFarewellMessageText(e.target.value)}
                placeholder="Escribe tus mejores deseos, anécdotas o felicitaciones aquí..."
                rows={4}
                className="w-full bg-zinc-50 dark:bg-black/20 border dark:border-white/10 p-3 rounded-xl font-bold text-zinc-805 dark:text-white placeholder-zinc-450"
              />
            </div>

            <div className="p-4 border-t border-zinc-100 dark:border-white/5 flex gap-3 bg-zinc-50/50 dark:bg-black/10 shrink-0">
              <button 
                type="button"
                onClick={handleCloseMessageModal}
                className="flex-1 py-3 text-[0.8em] font-black uppercase tracking-wider text-zinc-455 hover:text-red-500 transition-all"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={handleSaveCeremonyMessage}
                disabled={!farewellMessageText.trim()}
                className="flex-[2] py-3 bg-clr7 text-white text-[0.8em] font-black uppercase rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all tracking-wider disabled:opacity-50 cursor-pointer"
              >
                🚀 Enviar Mensaje
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
