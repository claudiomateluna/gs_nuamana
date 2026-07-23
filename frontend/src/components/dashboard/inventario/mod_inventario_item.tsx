'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { compressImage } from '@/lib/image-utils'
import type { InventarioItem, Unidad } from '@/types'
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error-utils';

interface DashModInventarioItemProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editingItem: any
  perfil: { id: string; unidad_id?: number | null }
  unidades: Unidad[]
}

const CATEGORIAS = ['Camping', 'Cocina', 'Material Didáctico', 'Herramientas', 'Uniformes/Mística', 'Alimentos', 'Otros']
const ESTADOS = ['Disponible', 'En Uso', 'En Reparación', 'Baja/Perdido']
const CONDICIONES = ['Nuevo', 'Casi Nuevo', 'Funcional', 'Deteriorado', 'Necesita Cambio', 'Roto']
const ORIGENES = ['Comprado', 'Donado']

export default function DashModInventarioItem({ isOpen, onClose, onSuccess, editingItem, perfil, unidades }: DashModInventarioItemProps) {
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    cantidad: 1,
    categoria: 'Otros',
    estado: 'Disponible',
    condicion: 'Funcional',
    origen: '',
    fecha_adquisicion: '',
    tiene_garantia: false,
    fecha_garantia: '',
    ubicacion: 'Sede Grupo',
    unidad_id: null as number | string | null,
    fecha_caducidad: '',
    imagenes: [] as string[]
  })

  useEffect(() => {
    if (editingItem) {
      setFormData({
        ...editingItem,
        nombre: editingItem.nombre || '',
        descripcion: editingItem.descripcion || '',
        categoria: editingItem.categoria || 'Otros',
        estado: editingItem.estado || 'Disponible',
        condicion: editingItem.condicion || 'Funcional',
        origen: editingItem.origen || '',
        ubicacion: editingItem.ubicacion || '',
        unidad_id: editingItem.unidad_id,
        fecha_caducidad: editingItem.fecha_caducidad || '',
        fecha_adquisicion: editingItem.fecha_adquisicion || '',
        fecha_garantia: editingItem.fecha_garantia || '',
        tiene_garantia: !!editingItem.tiene_garantia,
        imagenes: editingItem.imagen_url ? [editingItem.imagen_url] : (editingItem.imagenes || [])
      })
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        cantidad: 1,
        categoria: 'Otros',
        estado: 'Disponible',
        condicion: 'Funcional',
        origen: '',
        fecha_adquisicion: '',
        tiene_garantia: false,
        fecha_garantia: '',
        ubicacion: 'Sede Grupo',
        unidad_id: null,
        fecha_caducidad: '',
        imagenes: []
      })
    }
  }, [editingItem, isOpen])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const newUrls = [...(formData.imagenes || [])]

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const compressedFile = await compressImage(file)
        const fileExt = compressedFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
        
        const { data, error } = await supabase.storage
          .from('inventario')
          .upload(fileName, compressedFile)

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
          .from('inventario')
          .getPublicUrl(fileName)

        newUrls.push(publicUrl)
      }

      setFormData({ ...formData, imagenes: newUrls })
    } catch (err: unknown) {
      toast.error('Error al subir imagen: ' + getErrorMessage(err))
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      imagenes: formData.imagenes.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        nombre: formData.nombre,
        descripcion: formData.descripcion || null,
        cantidad: formData.cantidad,
        categoria: formData.categoria,
        estado: formData.estado,
        condicion: formData.condicion,
        origen: formData.origen || null,
        fecha_adquisicion: formData.fecha_adquisicion || null,
        tiene_garantia: formData.tiene_garantia,
        fecha_garantia: formData.tiene_garantia ? (formData.fecha_garantia || null) : null,
        ubicacion: formData.ubicacion || null,
        unidad_id: formData.unidad_id === 'grupal' ? null : formData.unidad_id,
        fecha_caducidad: formData.fecha_caducidad || null,
        imagen_url: formData.imagenes.length > 0 ? formData.imagenes[0] : null
      }

      if (editingItem) {
        const { error } = await supabase.from('inventario').update(payload).eq('id', editingItem.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('inventario').insert(payload)
        if (error) throw error
      }

      onSuccess()
      onClose()
    } catch (err: unknown) {
      console.error('Inventario error:', err);
      const msg = err instanceof Error ? err.message : (err && typeof err === 'object' && 'message' in err) ? String((err as { message: unknown }).message) : String(err);
      toast.error('Error al guardar: ' + msg)
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-2 md:p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-clr5 w-full max-w-3xl rounded-[2.5rem] p-6 md:p-10 shadow-2xl border-4 border-clr10 dark:border-clr4 overflow-y-auto max-h-[95vh]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-black font-display uppercase text-clr6 tracking-tighter">
            {editingItem ? 'Actualizar Recurso' : 'Nuevo Recurso Inventario'}
          </h2>
          <button onClick={onClose} className="text-2xl opacity-40 hover:opacity-100 transition-all">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-[1em]">
          {/* Bloque 1: Identificación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[0.8em] font-bold uppercase opacity-40 ml-2">Nombre del Objeto</label>
              <input required value={formData.nombre || ''} onChange={e => setFormData({...formData, nombre: e.target.value})} className="w-full p-4 rounded-2xl border bg-zinc-50 dark:bg-clr3 font-bold" placeholder="Ej: Carpa técnica 4p..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[0.8em] font-bold uppercase opacity-40 ml-2">Categoría</label>
                <select value={formData.categoria || 'Otros'} onChange={e => setFormData({...formData, categoria: e.target.value})} className="w-full p-4 rounded-2xl border bg-zinc-50 dark:bg-clr3 font-bold uppercase text-[0.9em]">
                  {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[0.8em] font-bold uppercase opacity-40 ml-2">Cantidad</label>
                <input type="number" min="1" value={formData.cantidad || 1} onChange={e => setFormData({...formData, cantidad: parseInt(e.target.value)})} className="w-full p-4 rounded-2xl border bg-zinc-50 dark:bg-clr3 font-bold" />
              </div>
            </div>
          </div>

          {/* Bloque 2: Estado y Condición */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[0.8em] font-bold uppercase opacity-40 ml-2">Estado Logístico</label>
              <select value={formData.estado || 'Disponible'} onChange={e => setFormData({...formData, estado: e.target.value})} className="w-full p-4 rounded-2xl border bg-zinc-50 dark:bg-clr3 font-bold uppercase text-[0.9em]">
                {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[0.8em] font-bold uppercase opacity-40 ml-2">Condición Física</label>
              <select value={formData.condicion || 'Funcional'} onChange={e => setFormData({...formData, condicion: e.target.value})} className="w-full p-4 rounded-2xl border bg-zinc-50 dark:bg-clr3 font-bold uppercase text-[0.9em]">
                {CONDICIONES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[0.8em] font-bold uppercase opacity-40 ml-2">Asignación</label>
              <select value={formData.unidad_id || 'grupal'} onChange={e => setFormData({...formData, unidad_id: e.target.value})} className="w-full p-4 rounded-2xl border bg-zinc-50 dark:bg-clr3 font-bold uppercase text-[0.9em]">
                <option value="grupal">⚜️ GRUPAL</option>
                {unidades.map(u => <option key={u.id} value={u.id}>{u.nombre.toUpperCase()}</option>)}
              </select>
            </div>
          </div>

          {/* FOTOS DEL ESTADO */}
          <div className="space-y-4">
            <label className="text-[0.8em] font-bold uppercase opacity-40 ml-2 block">Fotografías del Estado</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {formData.imagenes?.map((img: string, idx: number) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden shadow-md group">
                  <img src={img} className="w-full h-full object-cover" alt={`inventario-${idx}`} />
                  <button 
                    type="button" 
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >✕</button>
                </div>
              ))}
              <button 
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className={`aspect-square rounded-2xl border-2 border-dashed border-clr6 flex flex-col items-center justify-center gap-1 hover:bg-zinc-50 transition-all ${uploading ? 'animate-pulse opacity-50' : ''}`}
              >
                <span className="text-2xl">{uploading ? '⏳' : '📸'}</span>
                <span className="text-[8px] font-black uppercase text-clr6">Añadir</span>
              </button>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} multiple accept="image/*" className="hidden" />
          </div>

          {/* Bloque 3: Origen y Trazabilidad */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-zinc-50 dark:bg-black/10 rounded-2xl">
            <div className="space-y-1">
              <label className="text-[0.8em] font-bold uppercase opacity-40">Origen</label>
              <select value={formData.origen || ''} onChange={e => setFormData({...formData, origen: e.target.value})} className="w-full p-3 rounded-xl border bg-white dark:bg-clr3 font-bold uppercase text-[0.9em]">
                <option value="">Seleccionar...</option>
                {ORIGENES.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[0.8em] font-bold uppercase opacity-40">Fecha Adquisición</label>
              <input type="date" value={formData.fecha_adquisicion || ''} onChange={e => setFormData({...formData, fecha_adquisicion: e.target.value})} className="w-full p-3 rounded-xl border bg-white dark:bg-clr3 font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-[0.8em] font-bold uppercase opacity-40">Caducidad (Alimentos)</label>
              <input type="date" value={formData.fecha_caducidad || ''} onChange={e => setFormData({...formData, fecha_caducidad: e.target.value})} className="w-full p-3 rounded-xl border bg-white dark:bg-clr3 font-bold" />
            </div>
          </div>

          {/* Bloque 4: Garantía */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="flex items-center gap-3 p-3 h-[52px]">
              <input type="checkbox" id="garantia" checked={!!formData.tiene_garantia} onChange={e => setFormData({...formData, tiene_garantia: e.target.checked})} className="w-6 h-6 rounded-md accent-clr6" />
              <label htmlFor="garantia" className="font-bold uppercase text-[0.9em] cursor-pointer">¿Tiene Garantía?</label>
            </div>
            {formData.tiene_garantia && (
              <div className="space-y-1 md:col-span-2 animate-in slide-in-from-left duration-300">
                <label className="text-[0.8em] font-bold uppercase opacity-40 text-clr6">Fecha Límite de Garantía</label>
                <input type="date" required={formData.tiene_garantia} value={formData.fecha_garantia || ''} onChange={e => setFormData({...formData, fecha_garantia: e.target.value})} className="w-full p-3 rounded-xl border border-clr6 bg-white dark:bg-clr3 font-bold" />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[0.8em] font-bold uppercase opacity-40">Descripción / Ubicación Específica</label>
            <textarea value={formData.descripcion || ''} onChange={e => setFormData({...formData, descripcion: e.target.value})} className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-clr3 h-20 font-bold" placeholder="Escribe detalles adicionales..." />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={saving || uploading} className="flex-1 py-5 bg-clr6 text-white font-black uppercase rounded-[1.5rem] shadow-xl hover:brightness-110 tracking-widest transition-all disabled:opacity-50">
              {saving ? '⌛ Guardando...' : editingItem ? '💾 Actualizar Recurso' : '💾 Crear Recurso'}
            </button>
            <button type="button" onClick={onClose} className="px-8 py-5 bg-zinc-100 dark:bg-clr4 text-clr2 font-bold uppercase rounded-[1.5rem] tracking-widest">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
