'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { getBitacoraName } from '@/lib/bitacora-utils'
import { uploadToStorage } from '@/lib/storage-utils'
import { outboxService } from '@/lib/outbox-service'
import type { Perfil, Bitacora, BitacoraPreData } from '@/types'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/error-utils'

interface DashModBitacoraCrearProps {
  isOpen: boolean
  onClose: () => void
  perfil: Perfil
  onSuccess: () => void
  editingBitacora?: any
  defaultData?: BitacoraPreData
}

export default function DashModBitacoraCrear({ isOpen, onClose, perfil, onSuccess, editingBitacora, defaultData }: DashModBitacoraCrearProps) {
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    titulo: '',
    historia: '',
    fecha_suceso: new Date().toISOString().split('T')[0],
    excluir_dirigentes: false,
    imagenes: [] as string[]
  })
  
  const unitName = getBitacoraName(perfil?.unidad_id)

  useEffect(() => {
    if (isOpen) {
      if (editingBitacora) {
        setFormData({
          titulo: editingBitacora.titulo,
          historia: editingBitacora.historia,
          fecha_suceso: editingBitacora.fecha_suceso,
          excluir_dirigentes: editingBitacora.excluir_dirigentes,
          imagenes: editingBitacora.imagenes || []
        })
      } else if (defaultData) {
        setFormData({
          titulo: defaultData.titulo || '',
          historia: defaultData.historia || '',
          fecha_suceso: defaultData.fecha_suceso || new Date().toISOString().split('T')[0],
          excluir_dirigentes: defaultData.excluir_dirigentes || false,
          imagenes: []
        })
      } else {
        setFormData({
          titulo: '',
          historia: '',
          fecha_suceso: new Date().toISOString().split('T')[0],
          excluir_dirigentes: false,
          imagenes: []
        })
      }
    }
  }, [isOpen, editingBitacora, defaultData])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const newUrls = [...formData.imagenes]

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const publicUrl = await uploadToStorage(file, 'bitacoras', perfil.unidad_id?.toString() || '0')
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.titulo || !formData.historia) { 
      toast.warning('Título e Historia son obligatorios.')
      return 
    }

    setSaving(true)
    try {
      const payload = {
        titulo: formData.titulo,
        historia: formData.historia,
        fecha_suceso: formData.fecha_suceso,
        excluir_dirigentes: formData.excluir_dirigentes,
        imagenes: formData.imagenes,
        unidad_id: perfil.unidad_id,
        autor_id: perfil.id
      }

      if (navigator.onLine) {
        if (editingBitacora) {
          const { error } = await supabase
            .from('bitacoras_unidad')
            .update(payload)
            .eq('id', editingBitacora.id)
          if (error) throw error
          toast.success('Historia actualizada correctamente.')
        } else {
          const { error } = await supabase
            .from('bitacoras_unidad')
            .insert([payload])
          if (error) throw error
          toast.success('Historia guardada con éxito.')
        }
        onSuccess()
        onClose()
      } else {
        toast.info('Sin conexión. Guardando localmente...')
        if (editingBitacora) {
          await outboxService.enqueue('bitacoras_unidad', 'UPDATE', { ...payload, id: editingBitacora.id })
        } else {
          const tempId = 'temp-' + Math.random().toString(36).substr(2, 9)
          await outboxService.enqueue('bitacoras_unidad', 'INSERT', { ...payload, id: tempId })
        }
        onSuccess()
        onClose()
      }
    } catch (err: unknown) {
      toast.error('Error al guardar historia: ' + getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-pclr2/70 dark:bg-pdclr2/80 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-pclr1 dark:bg-pdclr1 border border-pclr13 dark:border-pdclr13 text-pclr4 dark:text-pdclr4 w-full max-w-2xl rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black font-display uppercase text-pclr4 dark:text-pdclr4 tracking-tight leading-none">
            {editingBitacora ? 'Editar Historia' : `Escribir en el ${unitName}`}
          </h2>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-pclr7 dark:text-pdclr7 hover:text-pclr4 dark:hover:text-pdclr4 text-2xl transition-all"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* TÍTULO */}
          <div className="space-y-1">
            <label className="text-[0.85em] font-bold uppercase tracking-wider text-pclr7 dark:text-pdclr7 font-display">
              Título de la Aventura
            </label>
            <input 
              type="text" 
              value={formData.titulo}
              onChange={e => setFormData({...formData, titulo: e.target.value})}
              placeholder="Ej: Nuestra primera fogata..."
              className="w-full p-4 rounded-xl border border-pclr13 dark:border-pdclr13 bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 placeholder:text-pclr7 dark:placeholder:text-pdclr7 font-bold text-lg outline-hidden focus:border-pclr8 dark:focus:border-pdclr8 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* FECHA */}
            <div className="space-y-1">
              <label className="text-[0.85em] font-bold uppercase tracking-wider text-pclr7 dark:text-pdclr7 font-display">
                ¿Cuándo ocurrió?
              </label>
              <input 
                type="date" 
                value={formData.fecha_suceso}
                onChange={e => setFormData({...formData, fecha_suceso: e.target.value})}
                className="w-full p-3.5 rounded-xl border border-pclr13 dark:border-pdclr13 bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 font-bold outline-hidden focus:border-pclr8 dark:focus:border-pdclr8 transition"
              />
            </div>

            {/* PRIVACIDAD */}
            <div className="flex flex-col justify-center items-center p-3 bg-pclr2 dark:bg-pdclr2 rounded-xl border border-pclr13 dark:border-pdclr13 relative overflow-hidden group">
              <label className="text-[0.85em] font-bold uppercase text-pclr7 dark:text-pdclr7 text-center mb-2">
                ¿Quién lo puede ver?
              </label>
              <div 
                onClick={() => setFormData({...formData, excluir_dirigentes: !formData.excluir_dirigentes})}
                className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors z-10 ${
                  formData.excluir_dirigentes ? 'bg-pclr10 dark:bg-pdclr10' : 'bg-pclr3 dark:bg-pdclr3'
                }`}
              >
                <div className={`w-6 h-6 bg-pclr1 dark:bg-pdclr1 rounded-full transition-transform duration-300 shadow-sm ${
                  formData.excluir_dirigentes ? 'translate-x-6' : ''
                }`} />
              </div>
              <p className="text-[0.8em] mt-2 font-bold uppercase tracking-wider text-center text-pclr7 dark:text-pdclr7">
                {formData.excluir_dirigentes ? '🔒 Oculto a Dirigentes' : '👥 Visible para todos'}
              </p>
            </div>
          </div>

          {/* HISTORIA */}
          <div className="space-y-1">
            <label className="text-[0.85em] font-bold uppercase tracking-wider text-pclr7 dark:text-pdclr7 font-display">
              Relato de la Historia
            </label>
            <textarea 
              value={formData.historia}
              onChange={e => setFormData({...formData, historia: e.target.value})}
              placeholder="Cuéntanos qué pasó, qué aprendieron y qué fue lo más divertido..."
              className="w-full p-4 rounded-2xl border border-pclr13 dark:border-pdclr13 bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 placeholder:text-pclr7 dark:placeholder:text-pdclr7 font-medium min-h-[180px] leading-relaxed italic text-base outline-hidden focus:border-pclr8 dark:focus:border-pdclr8 transition"
            />
          </div>

          {/* FOTOS */}
          <div className="space-y-4">
            <label className="text-[0.85em] font-bold uppercase tracking-wider text-pclr7 dark:text-pdclr7 font-display block">
              Fotos de la Aventura
            </label>
            
            {/* Grid de Previsualización */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {formData.imagenes.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden shadow-md group border border-pclr13 dark:border-pdclr13">
                  <img src={img} className="w-full h-full object-cover" alt={`preview-${idx}`} />
                  <button 
                    type="button" 
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 w-6 h-6 bg-pclr5 text-pclr12 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    ✕
                  </button>
                </div>
              ))}
              
              {/* Botón de Carga */}
              <button 
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className={`aspect-square rounded-2xl border-2 border-dashed border-pclr13 dark:border-pdclr13 flex flex-col items-center justify-center gap-2 hover:bg-pclr3 dark:hover:bg-pdclr3 transition-all ${uploading ? 'animate-pulse opacity-50' : ''}`}
              >
                <span className="text-3xl">{uploading ? '⏳' : '📸'}</span>
                <span className="text-[0.85em] font-bold uppercase text-pclr7 dark:text-pdclr7 tracking-wider">
                  {uploading ? 'Subiendo...' : 'Añadir Fotos'}
                </span>
              </button>
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              multiple 
              accept="image/*" 
              className="hidden" 
            />
            
            <p className="text-[0.85em] text-pclr7 dark:text-pdclr7 italic">
              * Las fotos se guardan de forma segura en la galería de la unidad.
            </p>
          </div>

          {/* BOTONES ACCIÓN */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-pclr13 dark:border-pdclr13">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-3 border border-pclr13 dark:border-pdclr13 rounded-xl font-bold uppercase text-pclr4 dark:text-pdclr4 hover:bg-pclr3 dark:hover:bg-pdclr3 transition text-[0.85em]"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={saving || uploading}
              className="px-6 py-3 bg-pclr10 dark:bg-pdclr10 text-pclr12 dark:text-pdclr12 font-black font-display uppercase rounded-xl shadow-lg hover:shadow-xl hover:brightness-110 active:scale-95 transition-all tracking-wider text-[0.9em] disabled:opacity-50"
            >
              {saving ? 'Guardando...' : `💾 Guardar en el ${unitName}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
