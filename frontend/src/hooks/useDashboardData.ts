'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { fetchDashboardData } from '@/services/dashboardService'
import { db } from '@/lib/db'
import { isDirectivo, isNNJ, canSeeTreasury, canActionTreasury } from '@/lib/roles'
import type { Perfil, Unidad, Acta, Bitacora, Articulo, InventarioItem, TesoreriaMovimiento, Rendicion, ActividadProgramada, AutorizacionActividad, Notificacion, ContactoEmergencia } from '@/types'

export function useDashboardData() {
  const [activeTab, setActiveTab] = useState('inicio')
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [unidades, setUnidades] = useState<Unidad[]>([])
  const [roles, setRoles] = useState<Array<{ id: number; name: string }>>([])
  const [contactos, setContactos] = useState<ContactoEmergencia[]>([])
  const [pupilos, setPupilos] = useState<Perfil[]>([])
  const [apoderado, setApoderado] = useState<Perfil | null>(null)
  const [miembrosUnidad, setMiembrosUnidad] = useState<Perfil[]>([])
  const [miembrosGrupo, setMiembrosGrupo] = useState<Perfil[]>([])
  const [actas, setActas] = useState<Acta[]>([])
  const [bitacoras, setBitacoras] = useState<Bitacora[]>([])
  const [articulos, setArticulos] = useState<Articulo[]>([])
  const [inventario, setInventario] = useState<InventarioItem[]>([])
  const [tesoreria, setTesoreria] = useState<TesoreriaMovimiento[]>([])
  const [rendiciones, setRendiciones] = useState<Rendicion[]>([])
  const [actividades, setActividades] = useState<ActividadProgramada[]>([])
  const [autorizaciones, setAutorizaciones] = useState<AutorizacionActividad[]>([])
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('todos')
  const [subTabTeso, setSubTabTeso] = useState<'libro' | 'rendiciones' | 'recaudaciones'>('libro')
  const [subTabCiclo, setSubTabCiclo] = useState<'activo' | 'historial' | 'otras_unidades'>('activo')

  const [editData, setEditData] = useState<Partial<Perfil>>({})
  const [editContactos, setEditContactos] = useState<ContactoEmergencia[]>([])

  const directivo = perfil ? isDirectivo(perfil) : false
  const nnj = perfil ? isNNJ(perfil) : false
  const canSeeUnits = directivo
  const canSeeTeso = perfil ? canSeeTreasury(perfil) : false
  const canActionTeso = perfil ? canActionTreasury(perfil) : false

  const fetchOfflineData = useCallback(async (userId: string) => {
    try {
      console.warn('Cargando datos locales IndexedDB para el usuario:', userId)
      const localPerfil = await db.perfiles.get(userId)
      if (!localPerfil) {
        console.warn('No hay perfil local para el usuario:', userId)
        return
      }

      const localFicha = await db.fichas_medicas.get(userId)
      const localEmergencia = await db.contactos_emergencia.where('perfil_id').equals(userId).toArray()

      const combinedPerfil = {
        ...localPerfil,
        grupo_sangre: localFicha?.grupo_sangre || null,
        alergias: localFicha?.alergias_medicamentos || null,
        tiene_alergias: !!localFicha?.alergias_medicamentos,
        enfermedades_cronicas: localFicha?.enfermedades_cronicas || null,
        prevision: localFicha?.prevision || null,
        seguro_complementario: localFicha?.seguro_complementario || null,
        comentarios_salud: localFicha?.comentarios_salud || null,
        medicamentos_uso_comun: localFicha?.medicamentos_uso_comun || null,
        restricciones_alimentarias: localFicha?.restricciones_alimentarias || null,
        contactos_emergencia: localEmergencia
      }

      setPerfil(combinedPerfil as Perfil)
      setEditData(combinedPerfil as Partial<Perfil>)
      setEditContactos(localEmergencia)

      if (localPerfil.unidad_id) {
        const uMems = await db.perfiles.where('unidad_id').equals(localPerfil.unidad_id).toArray()
        const fullMems = await Promise.all(uMems.map(async m => {
          const fm = await db.fichas_medicas.get(m.id)
          const ce = await db.contactos_emergencia.where('perfil_id').equals(m.id).toArray()
          return {
            ...m,
            grupo_sangre: fm?.grupo_sangre || null,
            alergias: fm?.alergias_medicamentos || null,
            tiene_alergias: !!fm?.alergias_medicamentos,
            enfermedades_cronicas: fm?.enfermedades_cronicas || null,
            prevision: fm?.prevision || null,
            seguro_complementario: fm?.seguro_complementario || null,
            comentarios_salud: fm?.comentarios_salud || null,
            medicamentos_uso_comun: fm?.medicamentos_uso_comun || null,
            restricciones_alimentarias: fm?.restricciones_alimentarias || null,
            contactos_emergencia: ce
          }
        }))
        setMiembrosUnidad(fullMems as Perfil[])
      }

      const localAuths = await db.autorizaciones.toArray()
      setAutorizaciones(localAuths)

      const pendingActas = await db.outbox_queue.where('tabla').equals('actas_completo').toArray()
      const formattedPendingActas = pendingActas.map(item => {
        const { payload } = item.payload
        return {
          id: `pending-${item.id}`,
          codigo: 'PENDIENTE',
          tipo: payload.tipo,
          fecha: payload.fecha,
          resumen: payload.resumen,
          estado: 'Borrador',
          isPending: true
        }
      })
      setActas(formattedPendingActas)

    } catch (e) {
      console.error('Error cargando datos locales IndexedDB:', e)
    }
  }, [])

  const fetchProfile = useCallback(async () => {
    let userId: string | null = null
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) { window.location.href = '/login'; return; }
      userId = user.id

      const data = await fetchDashboardData(user.id)

      setNotificaciones(data.notificaciones)
      setArticulos(data.articulos)
      setRoles(data.roles)
      setContactos(data.contactos)
      setInventario(data.inventario)
      setUnidades(data.unidades)
      setTesoreria(data.tesoreria)
      setRendiciones(data.rendiciones)
      setActividades(data.actividades)
      setPupilos(data.pupilos)
      setAutorizaciones(data.autorizaciones)
      setMiembrosUnidad(data.miembrosUnidad)
      setMiembrosGrupo(data.miembrosGrupo)
      setActas(data.actas)
      setPerfil(data.perfil)
      setEditData(data.editData)
      setEditContactos(data.editContactos)
    } catch (err) {
      console.warn("Fallo la carga online del perfil. Intentando cargar datos locales (PWA Offline)...", err)
      if (userId) {
        await fetchOfflineData(userId)
      }
    } finally {
      setLoading(false)
    }
  }, [fetchOfflineData])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return {
    perfil, setPerfil, loading,
    unidades, roles, contactos, pupilos, apoderado,
    miembrosUnidad, miembrosGrupo,
    actas, bitacoras, articulos, inventario,
    tesoreria, rendiciones, actividades,
    autorizaciones, notificaciones,
    activeTab, setActiveTab,
    filter, setFilter,
    subTabTeso, setSubTabTeso,
    subTabCiclo, setSubTabCiclo,
    editData, setEditData,
    editContactos, setEditContactos,
    directivo, nnj, canSeeUnits, canSeeTeso, canActionTeso,
    fetchProfile,
  }
}
