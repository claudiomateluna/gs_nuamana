'use client'

import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { isNNJ, isDirigenteOrGuiadora, isAdmin, Rol, canSeeTreasury } from '@/lib/roles'
import type { Perfil } from '@/types'
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error-utils';

interface Recaudacion {
  id: string
  nombre: string
}

interface DashModRecaudacionComprobanteProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  recaudacion: Recaudacion
  perfil: Perfil
}

interface UserListItem {
  id: string
  nombres: string
  apellidos: string
  rol_id: number
  apoderado_id: string | null
}

export default function DashModRecaudacionComprobante({
  isOpen,
  onClose,
  onSuccess,
  recaudacion,
  perfil
}: DashModRecaudacionComprobanteProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState<UserListItem[]>([])
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [monto, setMonto] = useState<number | ''>('')
  const [archivo, setArchivo] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // 1. Cargar lista de usuarios al abrir el modal
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('perfiles')
          .select('id, nombres, apellidos, rol_id, apoderado_id')
          .eq('estado', 'activo')

        if (error) throw error
        setUsers(data || [])
      } catch (err: unknown) {
        console.error('Error al cargar usuarios:', getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    if (isOpen) {
      fetchUsers()
      // Limpiar estados
      setSelectedUserIds([])
      setMonto('')
      setArchivo(null)
      setPreviewUrl(null)
      setSearchQuery('')
    }
  }, [isOpen])

  // 2. Ordenar usuarios de acuerdo a los requerimientos
  const sortedUsers = useMemo(() => {
    if (!perfil || users.length === 0) return []

    // Filtrar/mapear y separar por grupos
    const pupilos = users.filter(u => u.apoderado_id === perfil.id)
    const selfUser = users.filter(u => u.id === perfil.id)
    
    const otherNNJ = users
      .filter(u => u.id !== perfil.id && u.apoderado_id !== perfil.id && isNNJ(u))
      .sort((a, b) => `${a.nombres} ${a.apellidos}`.localeCompare(`${b.nombres} ${b.apellidos}`))

    const leaders = users
      .filter(u => u.id !== perfil.id && isDirigenteOrGuiadora(u))
      .sort((a, b) => `${a.nombres} ${a.apellidos}`.localeCompare(`${b.nombres} ${b.apellidos}`))

    const parents = users
      .filter(u => u.id !== perfil.id && !isNNJ(u) && !isDirigenteOrGuiadora(u) && !isAdmin(u) && canSeeTreasury(u))
      .sort((a, b) => `${a.nombres} ${a.apellidos}`.localeCompare(`${b.nombres} ${b.apellidos}`))

    const others = users
      .filter(u => u.id !== perfil.id && u.apoderado_id !== perfil.id && u.rol_id >= Rol.Restringido)
      .sort((a, b) => `${a.nombres} ${a.apellidos}`.localeCompare(`${b.nombres} ${b.apellidos}`))

    // Consolidar lista ordenada
    return [...pupilos, ...selfUser, ...otherNNJ, ...leaders, ...parents, ...others]
  }, [users, perfil])

  // 3. Filtrar según la búsqueda
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return sortedUsers
    const query = searchQuery.toLowerCase()
    return sortedUsers.filter(u => 
      `${u.nombres} ${u.apellidos}`.toLowerCase().includes(query)
    )
  }, [sortedUsers, searchQuery])

  // 4. Manejo de Checkbox de selección
  const toggleUserSelection = (id: string) => {
    if (selectedUserIds.includes(id)) {
      setSelectedUserIds(selectedUserIds.filter(userId => userId !== id))
    } else {
      setSelectedUserIds([...selectedUserIds, id])
    }
  }

  // 5. Manejo de archivo adjunto
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setArchivo(file)
    if (file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file))
    } else {
      setPreviewUrl(null) // Para PDFs u otros archivos
    }
  }

  // 6. Envío del Formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedUserIds.length === 0) {
      toast.warning('Debe seleccionar al menos un participante (NNJ/miembro) asociado al pago.')
      return
    }
    if (!monto || monto <= 0) {
      toast.warning('Por favor ingrese un monto válido.')
      return
    }
    if (!archivo) {
      toast.info('Debe adjuntar la imagen o PDF del comprobante de transferencia.')
      return
    }

    setSaving(true)
    try {
      // 6.1 Subir archivo al bucket 'comprobantes_recaudacion'
      const fileExt = archivo.name.split('.').pop()
      const compId = crypto.randomUUID()
      const filePath = `recaudacion_${recaudacion.id}/${compId}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('comprobantes_recaudacion')
        .upload(filePath, archivo)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('comprobantes_recaudacion')
        .getPublicUrl(filePath)

      // 6.2 Registrar comprobante en la base de datos
      const { data: comp, error: compError } = await supabase
        .from('tesoreria_recaudaciones_comprobantes')
        .insert({
          id: compId,
          recaudacion_id: recaudacion.id,
          monto: parseInt(monto.toString()),
          imagen_url: publicUrl,
          hecho_por: perfil.id,
          estado: 'pendiente'
        })
        .select()
        .single()

      if (compError) throw compError

      // 6.3 Relacionar el comprobante con los usuarios seleccionados
      const mappings = selectedUserIds.map(userId => ({
        comprobante_id: compId,
        usuario_id: userId
      }))

      const { error: mappingError } = await supabase
        .from('tesoreria_recaudaciones_comprobantes_usuarios')
        .insert(mappings)

      if (mappingError) throw mappingError

      toast.success('¡Comprobante enviado con éxito! Queda pendiente de validación por parte del equipo de tesorería.')
      onSuccess()
      onClose()
    } catch (err: unknown) {
      toast.error('Error al enviar comprobante: ' + getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen || !recaudacion) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-2 md:p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-clr5 w-full max-w-2xl rounded-[2.5rem] p-6 md:p-10 shadow-2xl border-4 border-clr10 dark:border-clr4 overflow-y-auto max-h-[95vh]">
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-black font-display uppercase text-clr6 tracking-tighter">
              Enviar Comprobante
            </h2>
            <p className="text-[0.8em] font-bold opacity-50 uppercase mt-1">
              Recaudación: {recaudacion.nombre}
            </p>
          </div>
          <button onClick={onClose} className="text-clr2 hover:text-black dark:text-white/60 dark:hover:text-white font-bold text-[1.2em]">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-[1em]">
          
          {/* Selector de NNJ / Participantes */}
          <div className="space-y-2">
            <label className="text-[0.8em] font-bold uppercase opacity-60">Seleccionar Participante(s)</label>
            <p className="text-[0.75em] opacity-40 font-semibold uppercase mt-0.5 pl-1">
              Selecciona a quién o quiénes cubre este pago de recaudación.
            </p>

            <input
              type="text"
              placeholder="🔍 Buscar participante por nombre..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full p-2.5 rounded-xl border bg-zinc-50 dark:bg-clr3 font-semibold text-[0.9em]"
            />

            <div className="border rounded-2xl overflow-hidden max-h-[220px] overflow-y-auto bg-zinc-50 dark:bg-black/10">
              {loading ? (
                <p className="p-4 text-center text-[0.85em] opacity-50 uppercase font-bold">Cargando lista...</p>
              ) : filteredUsers.length === 0 ? (
                <p className="p-4 text-center text-[0.85em] opacity-50 uppercase font-bold">No se encontraron miembros</p>
              ) : (
                <div className="divide-y divide-zinc-100 dark:divide-white/5">
                  {filteredUsers.map(u => {
                    const isPupilo = u.apoderado_id === perfil.id;
                    const isSelf = u.id === perfil.id;
                    let badge = '';
                    if (isPupilo) badge = '👶 Pupilo';
                    else if (isSelf) badge = '⭐ Yo';
                    else if (isNNJ(u)) badge = '👤 NNJ';
                    else if (isDirigenteOrGuiadora(u)) badge = '⚜️ Dirigente';
                    else badge = '👪 Apoderado';

                    return (
                      <label
                        key={u.id}
                        className={`flex items-center justify-between p-3 cursor-pointer hover:bg-zinc-100 dark:hover:bg-white/5 transition-all ${
                          selectedUserIds.includes(u.id) ? 'bg-clr6/5 border-l-4 border-l-clr6 pl-2' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedUserIds.includes(u.id)}
                            onChange={() => toggleUserSelection(u.id)}
                            className="w-4 h-4 rounded accent-clr6"
                          />
                          <span className="font-bold text-[0.9em]">
                            {u.nombres} {u.apellidos}
                          </span>
                        </div>
                        <span className="text-[0.75em] bg-zinc-200 dark:bg-clr3 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded-full font-black uppercase">
                          {badge}
                        </span>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fecha (No Editable) */}
            <div className="space-y-1">
              <label className="text-[0.8em] font-bold uppercase opacity-60">Fecha de Envío</label>
              <input
                type="text"
                disabled
                value={new Date().toLocaleDateString('es-CL')}
                className="w-full p-3 rounded-xl border bg-zinc-100 dark:bg-clr3 font-black text-center opacity-70 cursor-not-allowed"
              />
            </div>

            {/* Monto de Comprobante */}
            <div className="space-y-1">
              <label className="text-[0.8em] font-bold uppercase opacity-60">Monto del Comprobante ($)</label>
              <input
                type="number"
                required
                min="1"
                placeholder="Ej: 15000"
                value={monto}
                onChange={e => setMonto(e.target.value === '' ? '' : parseInt(e.target.value))}
                className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-clr3 font-black text-center text-[1.1em] text-clr6"
              />
            </div>
          </div>

          {/* Carga de Comprobante */}
          <div className="space-y-1">
            <label className="text-[0.8em] font-bold uppercase opacity-60">Adjuntar Comprobante (Imagen o PDF)</label>
            <input
              type="file"
              required
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-clr3 font-bold"
            />
            {previewUrl && (
              <div className="mt-3 border rounded-2xl overflow-hidden max-h-[160px] flex items-center justify-center bg-zinc-100 dark:bg-black/25">
                <img src={previewUrl} alt="Vista previa del comprobante" className="object-contain h-full max-h-[150px]" />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t dark:border-clr4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-clr2 text-clr2 rounded-xl text-[0.85em] font-bold uppercase hover:bg-zinc-50 dark:hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-clr6 text-white rounded-xl text-[0.85em] font-bold uppercase hover:brightness-110 shadow-lg transition-all disabled:opacity-50"
            >
              {saving ? 'Enviando...' : 'Enviar Comprobante'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
