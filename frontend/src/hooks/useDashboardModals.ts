'use client'
import { useState } from 'react'
import type { Perfil, Acta, Bitacora, InventarioItem, TesoreriaMovimiento, Rendicion, AutorizacionActividad, Ceremonia } from '@/types'

export function useDashboardModals() {
  const [activeModal, setActiveModal] = useState<string | null>(null)

  const isModPerfilOpen = activeModal === 'perfil'
  const setIsModPerfilOpen = (open: boolean) => setActiveModal(open ? 'perfil' : null)

  const isModActaCrearOpen = activeModal === 'acta_crear'
  const setIsModActaCrearOpen = (open: boolean) => setActiveModal(open ? 'acta_crear' : null)

  const isModActaVerOpen = activeModal === 'acta_ver'
  const setIsModActaVerOpen = (open: boolean) => setActiveModal(open ? 'acta_ver' : null)

  const isModBitacoraCrearOpen = activeModal === 'bitacora_crear'
  const setIsModBitacoraCrearOpen = (open: boolean) => setActiveModal(open ? 'bitacora_crear' : null)

  const isModBitacoraVerOpen = activeModal === 'bitacora_ver'
  const setIsModBitacoraVerOpen = (open: boolean) => setActiveModal(open ? 'bitacora_ver' : null)

  const isModVerFichaOpen = activeModal === 'ver_ficha'
  const setIsModVerFichaOpen = (open: boolean) => setActiveModal(open ? 'ver_ficha' : null)

  const isModInventarioOpen = activeModal === 'inventario'
  const setIsModInventarioOpen = (open: boolean) => setActiveModal(open ? 'inventario' : null)

  const isModTesoreriaOpen = activeModal === 'tesoreria'
  const setIsModTesoreriaOpen = (open: boolean) => setActiveModal(open ? 'tesoreria' : null)

  const isModValeOpen = activeModal === 'vale'
  const setIsModValeOpen = (open: boolean) => setActiveModal(open ? 'vale' : null)

  const isModTesoreriaVerOpen = activeModal === 'tesoreria_ver'
  const setIsModTesoreriaVerOpen = (open: boolean) => setActiveModal(open ? 'tesoreria_ver' : null)

  const isModRendicionOpen = activeModal === 'rendicion'
  const setIsModRendicionOpen = (open: boolean) => setActiveModal(open ? 'rendicion' : null)

  const isModRendicionVerOpen = activeModal === 'rendicion_ver'
  const setIsModRendicionVerOpen = (open: boolean) => setActiveModal(open ? 'rendicion_ver' : null)

  const isModAutorizacionOpen = activeModal === 'autorizacion'
  const setIsModAutorizacionOpen = (open: boolean) => setActiveModal(open ? 'autorizacion' : null)

  const isModAutorizacionVerOpen = activeModal === 'autorizacion_ver'
  const setIsModAutorizacionVerOpen = (open: boolean) => setActiveModal(open ? 'autorizacion_ver' : null)

  const isModActividadOpen = activeModal === 'actividad'
  const setIsModActividadOpen = (open: boolean) => setActiveModal(open ? 'actividad' : null)

  const isModVincularPupiloOpen = activeModal === 'vincular_pupilo'
  const setIsModVincularPupiloOpen = (open: boolean) => setActiveModal(open ? 'vincular_pupilo' : null)

  const openModal = (name: string) => setActiveModal(name)
  const closeModal = () => setActiveModal(null)

  // Edit/View states
  const [editingPupilo, setEditingPupilo] = useState<Perfil | null>(null)
  const [editingActa, setEditingActa] = useState<Acta | null>(null)
  const [viewingActa, setViewingActa] = useState<Acta | null>(null)
  const [editingBitacora, setEditingBitacora] = useState<Bitacora | null>(null)
  const [viewingBitacora, setViewingBitacora] = useState<Bitacora | null>(null)
  const [viewingFicha, setViewingFicha] = useState<Perfil | null>(null)
  const [editingInventoryItem, setEditingInventoryItem] = useState<InventarioItem | null>(null)
  const [editingMov, setEditingMov] = useState<TesoreriaMovimiento | null>(null)
  const [viewingMov, setViewingMov] = useState<TesoreriaMovimiento | null>(null)
  const [viewingRendicion, setViewingRendicion] = useState<Rendicion | null>(null)
  const [viewingAuth, setViewingAuth] = useState<AutorizacionActividad | null>(null)
  const [viewingAuthProfile, setViewingAuthProfile] = useState<Perfil | null>(null)
  const [targetAuthProfile, setTargetAuthProfile] = useState<Perfil | null>(null)
  const [selectedProgresionPerfil, setSelectedProgresionPerfil] = useState<Perfil | null>(null)

  // Ceremony states
  const [activeCeremonyForMessage, setActiveCeremonyForMessage] = useState<Ceremonia | null>(null)
  const [farewellMessageText, setFarewellMessageText] = useState('')

  // Password
  const [showPassModal, setShowPassModal] = useState(false)
  const [newPass, setNewPass] = useState('')

  return {
    activeModal, openModal, closeModal,
    isModPerfilOpen, setIsModPerfilOpen,
    isModActaCrearOpen, setIsModActaCrearOpen,
    isModActaVerOpen, setIsModActaVerOpen,
    isModBitacoraCrearOpen, setIsModBitacoraCrearOpen,
    isModBitacoraVerOpen, setIsModBitacoraVerOpen,
    isModVerFichaOpen, setIsModVerFichaOpen,
    isModInventarioOpen, setIsModInventarioOpen,
    isModTesoreriaOpen, setIsModTesoreriaOpen,
    isModValeOpen, setIsModValeOpen,
    isModTesoreriaVerOpen, setIsModTesoreriaVerOpen,
    isModRendicionOpen, setIsModRendicionOpen,
    isModRendicionVerOpen, setIsModRendicionVerOpen,
    isModAutorizacionOpen, setIsModAutorizacionOpen,
    isModAutorizacionVerOpen, setIsModAutorizacionVerOpen,
    isModActividadOpen, setIsModActividadOpen,
    isModVincularPupiloOpen, setIsModVincularPupiloOpen,
    editingPupilo, setEditingPupilo,
    editingActa, setEditingActa,
    viewingActa, setViewingActa,
    editingBitacora, setEditingBitacora,
    viewingBitacora, setViewingBitacora,
    viewingFicha, setViewingFicha,
    editingInventoryItem, setEditingInventoryItem,
    editingMov, setEditingMov,
    viewingMov, setViewingMov,
    viewingRendicion, setViewingRendicion,
    viewingAuth, setViewingAuth,
    viewingAuthProfile, setViewingAuthProfile,
    targetAuthProfile, setTargetAuthProfile,
    selectedProgresionPerfil, setSelectedProgresionPerfil,
    activeCeremonyForMessage, setActiveCeremonyForMessage,
    farewellMessageText, setFarewellMessageText,
    showPassModal, setShowPassModal,
    newPass, setNewPass,
  }
}
