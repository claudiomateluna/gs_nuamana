import { supabase } from '@/lib/supabase'
import { db } from '@/lib/db'
import { isDirectivo, isNNJ, isAdmin, isAdultoConPupilos } from '@/lib/roles'
import type { Perfil, Unidad, Acta, Articulo, InventarioItem, TesoreriaMovimiento, Rendicion, ActividadProgramada, AutorizacionActividad, Notificacion, ContactoEmergencia } from '@/types'
import { toast } from 'sonner';

export interface DashboardData {
  perfil: Perfil
  unidades: Unidad[]
  roles: Array<{ id: number; name: string }>
  contactos: ContactoEmergencia[]
  pupilos: Perfil[]
  apoderado: Perfil | null
  miembrosUnidad: Perfil[]
  miembrosGrupo: Perfil[]
  actas: Acta[]
  articulos: Articulo[]
  inventario: InventarioItem[]
  tesoreria: TesoreriaMovimiento[]
  rendiciones: Rendicion[]
  actividades: ActividadProgramada[]
  autorizaciones: AutorizacionActividad[]
  notificaciones: Notificacion[]
  editData: Partial<Perfil>
  editContactos: ContactoEmergencia[]
}

/**
 * Fetches all dashboard data from Supabase.
 * Falls back to IndexedDB if offline.
 * Throws if user is not authenticated or profile not found.
 */
/**
 * Fetches fichas de actividad linked to a specific acuerdo.
 */
export async function fetchLinkedFichas(acuerdoId: string): Promise<Articulo[]> {
  const { data } = await supabase
    .from('acta_acuerdo_fichas')
    .select('articulo:articulos(id, titulo, slug)')
    .eq('acuerdo_id', acuerdoId)

  return (data?.map(d => d.articulo).filter(Boolean) as unknown as Articulo[]) || []
}

/**
 * Replaces all linked fichas for an acuerdo (delete-all + insert-all pattern).
 */
export async function linkFichasToAcuerdo(acuerdoId: string, articuloIds: string[]): Promise<void> {
  await supabase.from('acta_acuerdo_fichas').delete().eq('acuerdo_id', acuerdoId)

  if (articuloIds.length > 0) {
    const links = articuloIds.map(id => ({ acuerdo_id: acuerdoId, articulo_id: id }))
    await supabase.from('acta_acuerdo_fichas').insert(links)
  }
}

export async function fetchDashboardData(userId: string): Promise<DashboardData> {
  let profile: any = null
  let errorOccurred = false

  try {
    const { data, error } = await supabase.from('perfiles').select('*, roles(name), unidades(nombre, colores, logo_unidad_url, logo_rama_url)').eq('id', userId).maybeSingle()
    if (error || !data) {
      errorOccurred = true
    } else {
      profile = data
    }
  } catch {
    errorOccurred = true
  }

  if (errorOccurred || !profile) {
    console.warn("Fallo la consulta online del perfil, intentando cargar local...")
    profile = await db.perfiles.get(userId)
    if (!profile) {
      await supabase.auth.signOut()
      window.location.href = '/login'
      throw new Error('No profile found')
    }
  } else if (profile.estado === 'pendiente') {
    toast.info('Tu cuenta aun no ha sido activada.')
    await supabase.auth.signOut()
    window.location.href = '/login'
    throw new Error('Account pending activation')
  }

  const directivo = isDirectivo(profile)
  const nnj = isNNJ(profile)
  const articlesQuery = directivo
    ? supabase.from('articulos').select('*').order('created_at', { ascending: false })
    : nnj
      ? supabase.from('articulos').select('*').eq('autor_id', userId).order('created_at', { ascending: false })
      : Promise.resolve({ data: [] })

  const [notifs, acts, arts, rolesData, emergency, invData, unitsData, tesoData, rendData, actvsData] = await Promise.all([
    supabase.from('notificaciones').select('*').eq('perfil_id', userId).order('created_at', { ascending: false }),
    supabase.from('actas').select('*, unidades(nombre), acta_temas(*), mi_firma:acta_firmas!acta_firmas_acta_id_fkey(*)').eq('acta_firmas.perfil_id', userId).order('fecha', { ascending: false }),
    articlesQuery,
    supabase.from('roles').select('*').order('id'),
    supabase.from('contactos_emergencia').select('*').eq('perfil_id', userId),
    supabase.from('inventario').select('*, unidades(nombre)').order('nombre'),
    supabase.from('unidades').select('*').order('id'),
    supabase.from('tesoreria_movimientos').select('*, tesoreria_items(*), unidades(nombre), registrado_por:perfiles(nombres, apellidos)').order('anio', { ascending: false }).order('mes', { ascending: false }).order('dia', { ascending: false }),
    supabase.from('tesoreria_rendiciones').select('*, unidades(nombre)').order('created_at', { ascending: false }),
    supabase.from('actividades_programadas').select('*, unidades(nombre)').order('fecha_inicio', { ascending: false })
  ])

  let pupilList: Perfil[] = []
  if (isAdultoConPupilos(profile)) {
    const { data: children } = await supabase.from('perfiles').select('*, roles(name), unidades(nombre, colores, logo_unidad_url, logo_rama_url), contactos_emergencia(*)').eq('apoderado_id', userId)
    pupilList = (children || []) as Perfil[]
  }

  // Autorizaciones (Propias + Relacionadas)
  const idsDeInteres = [userId, ...pupilList.map(p => p.id)]
  if (directivo && profile.unidad_id) {
    const { data: uMems } = await supabase.from('perfiles').select('id').eq('unidad_id', profile.unidad_id)
    uMems?.forEach(m => idsDeInteres.push(m.id))
  }
  const { data: authsData } = await supabase.from('autorizaciones_actividades').select('*').in('perfil_id', Array.from(new Set(idsDeInteres))).order('fecha_firma', { ascending: false })

  let miembrosUnidad: Perfil[] = []
  let miembrosGrupo: Perfil[] = []

  if (directivo) {
    if (profile.unidad_id) {
      const { data: u } = await supabase.from('perfiles').select('*, roles(name), unidades(nombre, colores, logo_unidad_url, logo_rama_url), contactos_emergencia(*), apoderado:apoderado_id(id, nombres, apellidos, telefono, email)').eq('unidad_id', profile.unidad_id).order('nombres')
      miembrosUnidad = (u || []) as Perfil[]
    }
    let gQuery = supabase.from('perfiles').select('*, roles(name), unidades(nombre, colores, logo_unidad_url, logo_rama_url), contactos_emergencia(*), apoderado:apoderado_id(id, nombres, apellidos, telefono, email)').order('nombres')
    if (!isAdmin(profile)) gQuery = gQuery.eq('pertenece_grupo_nua_mana', true)
    const { data: g } = await gQuery
    miembrosGrupo = (g || []) as Perfil[]
  }

  // Enrich actas with per-user signatures (batch fetch)
  let enrichedActas: Acta[] = acts.data || []
  if (acts.data && acts.data.length > 0) {
    const actaIds = acts.data.map(a => a.id)
    const [allFirmas, allParticipantes] = await Promise.all([
      supabase.from('acta_firmas').select('*').in('acta_id', actaIds).eq('perfil_id', userId),
      supabase.from('acta_participantes').select('*').in('acta_id', actaIds).eq('perfil_id', userId)
    ])
    enrichedActas = acts.data.map(acta => ({
      ...acta,
      mi_firma: allFirmas.data?.find(f => f.acta_id === acta.id) || null,
      mi_rol_reunion: allParticipantes.data?.find(p => p.acta_id === acta.id)?.rol_en_reunion || null
    }))
  }

  const contactos = (emergency.data || []) as ContactoEmergencia[]
  const perfilWithContactos: Perfil = { ...profile, contactos_emergencia: contactos }

  // Cache to IndexedDB for offline support
  await cacheProfileOffline(profile, contactos)

  // Try to process outbox queue
  import('@/lib/outbox-service').then(({ outboxService }) => {
    outboxService.processQueue()
  })

  return {
    perfil: perfilWithContactos,
    unidades: (unitsData.data || []) as Unidad[],
    roles: (rolesData.data || []) as Array<{ id: number; name: string }>,
    contactos,
    pupilos: pupilList,
    apoderado: null,
    miembrosUnidad,
    miembrosGrupo,
    actas: enrichedActas,
    articulos: (arts.data || []) as Articulo[],
    inventario: (invData.data || []) as InventarioItem[],
    tesoreria: (tesoData.data || []) as TesoreriaMovimiento[],
    rendiciones: (rendData.data || []) as Rendicion[],
    actividades: (actvsData.data || []) as ActividadProgramada[],
    autorizaciones: (authsData || []) as AutorizacionActividad[],
    notificaciones: (notifs.data || []) as Notificacion[],
    editData: profile,
    editContactos: contactos,
  }
}

/**
 * Persists profile and medical data to IndexedDB for offline support.
 */
export async function cacheProfileOffline(profile: Record<string, any>, emergencyContacts: ContactoEmergencia[]): Promise<void> {
  try {
    await db.perfiles.put({
      id: profile.id,
      nombres: profile.nombres,
      apellidos: profile.apellidos,
      rut: profile.rut,
      unidad_id: profile.unidad_id,
      rol_id: profile.rol_id,
      created_at: profile.created_at,
      roles: profile.roles,
      unidades: profile.unidades
    })

    await db.fichas_medicas.put({
      perfil_id: profile.id,
      grupo_sangre: profile.grupo_sangre || null,
      alergias_medicamentos: profile.alergias || null,
      alergias_alimentarias: null,
      enfermedades_cronicas: profile.enfermedades_cronicas || null,
      prevision: profile.prevision || null,
      seguro_complementario: profile.seguro_complementario || null,
      comentarios_salud: profile.comentarios_salud || null,
      medicamentos_uso_comun: profile.medicamentos_uso_comun || null,
      restricciones_alimentarias: profile.restricciones_alimentarias || null
    })

    if (emergencyContacts.length > 0) {
      await db.contactos_emergencia.where('perfil_id').equals(profile.id).delete()
      for (const c of emergencyContacts) {
        await db.contactos_emergencia.put(c)
      }
    }
  } catch (dbErr) {
    console.warn("Fallo el auto-guardado del perfil en IndexedDB:", dbErr)
  }
}
