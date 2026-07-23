'use client'
import { useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useDashboardData } from './useDashboardData'
import { useDashboardModals } from './useDashboardModals'
import { useDashboardSync } from './useDashboardSync'
import { useDashboardActions } from './useDashboardActions'
import { isDirectivo, isAdmin } from '@/lib/roles'
import { toast } from 'sonner'

export function useDashboard() {
  const data = useDashboardData()
  const modals = useDashboardModals()
  const sync = useDashboardSync(data.perfil)
  const actions = useDashboardActions({
    perfil: data.perfil,
    fetchProfile: data.fetchProfile,
    setViewingActa: modals.setViewingActa,
    setIsModActaVerOpen: modals.setIsModActaVerOpen,
    setIsModAutorizacionOpen: modals.setIsModAutorizacionOpen,
    setTargetAuthProfile: modals.setTargetAuthProfile,
  })

  useEffect(() => {
    modals.setIsModAutorizacionOpen(false)
    modals.setTargetAuthProfile(null)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (typeof window !== 'undefined' && data.perfil) {
      const params = new URLSearchParams(window.location.search)
      const openCeremonyIdParam = params.get('openCeremonyId')
      if (openCeremonyIdParam) {
        supabase
          .from('ceremonias')
          .select('*, perfil:perfil_id(nombres, apellidos, unidad_id)')
          .eq('id', openCeremonyIdParam)
          .single()
          .then(async ({ data: ceremony }) => {
            if (ceremony && ceremony.perfil_id) {
              const isLeaderOfUnit = isDirectivo(data.perfil!) &&
                                     (isAdmin(data.perfil!) || data.perfil!.unidad_id === ceremony.perfil?.unidad_id)

              if (isLeaderOfUnit && ceremony.perfil_id !== data.perfil!.id) {
                data.setActiveTab('progresion')
                const { data: targetProfile } = await supabase
                  .from('perfiles')
                  .select('*, roles(name), unidades(nombre, colores, logo_unidad_url, logo_rama_url)')
                  .eq('id', ceremony.perfil_id)
                  .maybeSingle()
                if (targetProfile) {
                  modals.setSelectedProgresionPerfil(targetProfile)
                }
              } else {
                modals.setActiveCeremonyForMessage(ceremony)
              }
            }
          })
      }
    }
  }, [data.perfil]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCloseMessageModal = useCallback(() => {
    modals.setActiveCeremonyForMessage(null)
    modals.setFarewellMessageText('')
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.delete('openCeremonyId')
      window.history.replaceState({}, '', url.toString())
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSaveCeremonyMessage = useCallback(async () => {
    if (!modals.activeCeremonyForMessage || !modals.farewellMessageText.trim()) return
    if (!data.perfil) return
    try {
      const { error } = await supabase
        .from('ceremonia_mensajes')
        .insert([{
          ceremonia_id: modals.activeCeremonyForMessage.id,
          remitente_id: data.perfil.id,
          mensaje: modals.farewellMessageText.trim()
        }])
      if (error) throw error

      toast.success('Mensaje enviado con exito!')
      handleCloseMessageModal()
    } catch (err: unknown) {
      console.error(err)
      toast.error('Error al guardar mensaje: ' + (err as Error).message)
    }
  }, [modals.activeCeremonyForMessage, modals.farewellMessageText, data.perfil, handleCloseMessageModal])

  return {
    // Data
    perfil: data.perfil, setPerfil: data.setPerfil, loading: data.loading,
    unidades: data.unidades, roles: data.roles, contactos: data.contactos, pupilos: data.pupilos, apoderado: data.apoderado,
    miembrosUnidad: data.miembrosUnidad, miembrosGrupo: data.miembrosGrupo,
    actas: data.actas, bitacoras: data.bitacoras, articulos: data.articulos, inventario: data.inventario,
    tesoreria: data.tesoreria, rendiciones: data.rendiciones, actividades: data.actividades,
    autorizaciones: data.autorizaciones, notificaciones: data.notificaciones,
    // UI
    activeTab: data.activeTab, setActiveTab: data.setActiveTab,
    filter: data.filter, setFilter: data.setFilter,
    subTabTeso: data.subTabTeso, setSubTabTeso: data.setSubTabTeso,
    subTabCiclo: data.subTabCiclo, setSubTabCiclo: data.setSubTabCiclo,
    // Modals
    activeModal: modals.activeModal, openModal: modals.openModal, closeModal: modals.closeModal,
    isModPerfilOpen: modals.isModPerfilOpen, setIsModPerfilOpen: modals.setIsModPerfilOpen,
    isModActaCrearOpen: modals.isModActaCrearOpen, setIsModActaCrearOpen: modals.setIsModActaCrearOpen,
    isModActaVerOpen: modals.isModActaVerOpen, setIsModActaVerOpen: modals.setIsModActaVerOpen,
    isModBitacoraCrearOpen: modals.isModBitacoraCrearOpen, setIsModBitacoraCrearOpen: modals.setIsModBitacoraCrearOpen,
    isModBitacoraVerOpen: modals.isModBitacoraVerOpen, setIsModBitacoraVerOpen: modals.setIsModBitacoraVerOpen,
    isModVerFichaOpen: modals.isModVerFichaOpen, setIsModVerFichaOpen: modals.setIsModVerFichaOpen,
    isModInventarioOpen: modals.isModInventarioOpen, setIsModInventarioOpen: modals.setIsModInventarioOpen,
    isModTesoreriaOpen: modals.isModTesoreriaOpen, setIsModTesoreriaOpen: modals.setIsModTesoreriaOpen,
    isModValeOpen: modals.isModValeOpen, setIsModValeOpen: modals.setIsModValeOpen,
    isModTesoreriaVerOpen: modals.isModTesoreriaVerOpen, setIsModTesoreriaVerOpen: modals.setIsModTesoreriaVerOpen,
    isModRendicionOpen: modals.isModRendicionOpen, setIsModRendicionOpen: modals.setIsModRendicionOpen,
    isModRendicionVerOpen: modals.isModRendicionVerOpen, setIsModRendicionVerOpen: modals.setIsModRendicionVerOpen,
    isModAutorizacionOpen: modals.isModAutorizacionOpen, setIsModAutorizacionOpen: modals.setIsModAutorizacionOpen,
    isModAutorizacionVerOpen: modals.isModAutorizacionVerOpen, setIsModAutorizacionVerOpen: modals.setIsModAutorizacionVerOpen,
    isModActividadOpen: modals.isModActividadOpen, setIsModActividadOpen: modals.setIsModActividadOpen,
    isModVincularPupiloOpen: modals.isModVincularPupiloOpen, setIsModVincularPupiloOpen: modals.setIsModVincularPupiloOpen,
    // Edit/View
    editingPupilo: modals.editingPupilo, setEditingPupilo: modals.setEditingPupilo,
    editData: data.editData, setEditData: data.setEditData,
    editContactos: data.editContactos, setEditContactos: data.setEditContactos,
    editingActa: modals.editingActa, setEditingActa: modals.setEditingActa,
    viewingActa: modals.viewingActa, setViewingActa: modals.setViewingActa,
    editingBitacora: modals.editingBitacora, setEditingBitacora: modals.setEditingBitacora,
    viewingBitacora: modals.viewingBitacora, setViewingBitacora: modals.setViewingBitacora,
    viewingFicha: modals.viewingFicha, setViewingFicha: modals.setViewingFicha,
    editingInventoryItem: modals.editingInventoryItem, setEditingInventoryItem: modals.setEditingInventoryItem,
    editingMov: modals.editingMov, setEditingMov: modals.setEditingMov,
    viewingMov: modals.viewingMov, setViewingMov: modals.setViewingMov,
    viewingRendicion: modals.viewingRendicion, setViewingRendicion: modals.setViewingRendicion,
    viewingAuth: modals.viewingAuth, setViewingAuth: modals.setViewingAuth,
    viewingAuthProfile: modals.viewingAuthProfile, setViewingAuthProfile: modals.setViewingAuthProfile,
    targetAuthProfile: modals.targetAuthProfile, setTargetAuthProfile: modals.setTargetAuthProfile,
    selectedProgresionPerfil: modals.selectedProgresionPerfil, setSelectedProgresionPerfil: modals.setSelectedProgresionPerfil,
    // Ceremony
    activeCeremonyForMessage: modals.activeCeremonyForMessage, setActiveCeremonyForMessage: modals.setActiveCeremonyForMessage,
    farewellMessageText: modals.farewellMessageText, setFarewellMessageText: modals.setFarewellMessageText,
    handleCloseMessageModal,
    handleSaveCeremonyMessage,
    // Sync
    isSyncing: sync.isSyncing, syncProgress: sync.syncProgress, syncMessage: sync.syncMessage, lastSyncTime: sync.lastSyncTime,
    handleSyncOffline: sync.handleSyncOffline,
    // Password
    showPassModal: modals.showPassModal, setShowPassModal: modals.setShowPassModal,
    newPass: modals.newPass, setNewPass: modals.setNewPass,
    // Handlers
    fetchProfile: actions.fetchProfile,
    handleOpenWizard: actions.handleOpenWizard,
    handleCloseWizard: actions.handleCloseWizard,
    handleSignActa: actions.handleSignActa,
    handleDeleteActa: actions.handleDeleteActa,
    handleDeleteArticulo: actions.handleDeleteArticulo,
    handleDeleteInventory: actions.handleDeleteInventory,
    handleDeleteMov: actions.handleDeleteMov,
    handleDeleteRendicion: actions.handleDeleteRendicion,
    handleDeleteBitacora: actions.handleDeleteBitacora,
    handleDeleteUser: actions.handleDeleteUser,
    loadActaDetails: actions.loadActaDetails,
    markNotifRead: actions.markNotifRead,
    // Permissions
    directivo: data.directivo, nnj: data.nnj, canSeeUnits: data.canSeeUnits, canSeeTeso: data.canSeeTeso, canActionTeso: data.canActionTeso,
  }
}
