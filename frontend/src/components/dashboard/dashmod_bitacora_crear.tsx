'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { getBitacoraName } from '@/lib/bitacora-utils'
import { uploadToStorage } from '@/lib/storage-utils'

interface DashModBitacoraCrearProps {
  isOpen: boolean
  onClose: () => void
  perfil: any
  onSuccess: () => void
  editingBitacora?: any
}

export default function DashModBitacoraCrear({ isOpen, onClose, perfil, onSuccess, editingBitacora }: DashModBitacoraCrearProps) {
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
  }, [isOpen, editingBitacora])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const newUrls = [...formData.imagenes]

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const publicUrl = await uploadToStorage(file, 'bitacoras', perfil.unidad_id.toString())
        newUrls.push(publicUrl)
      }

      setFormData({ ...formData, imagenes: newUrls })
    } catch (err: any) {
      alert('Error al subir imagen: ' + err.message)
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
    if (!formData.titulo || !formData.historia) return alert('Título e Historia son obligatorios.')

    setSaving(true)
    try {
      const payload = {
        ...formData,
        unidad_id: perfil.unidad_id,
        autor_id: perfil.id
      }

      if (editingBitacora) {
        const { error } = await supabase.from('bitacoras_unidad').update(payload).eq('id', editingBitacora.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('bitacoras_unidad').insert(payload)
        if (error) throw error
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      alert('Error: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-clr5 w-full max-w-2xl rounded-l-[1rem] p-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black font-display uppercase text-clr7 tracking-tighter leading-none">
            {editingBitacora ? 'Editar Historia' : `Escribir en el ${unitName}`}
          </h2>
          <button onClick={onClose} className="text-2xl opacity-40 hover:opacity-100 transition-all">✕</button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* TÍTULO */}
          <div className="space-y-1">
            <label className="text-[1em] font-black uppercase opacity-60 ml-4 tracking-widest font-display">Título de la Aventura</label>
            <input 
              type="text" 
              value={formData.titulo}
              onChange={e => setFormData({...formData, titulo: e.target.value})}
              placeholder="Ej: Nuestra primera fogata..."
              className="w-full p-4 rounded-2xl border dark:border-clr4 bg-zinc-50 dark:bg-clr3 font-bold text-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* FECHA */}
            <div className="space-y-1">
              <label className="text-[0.8em] font-black uppercase opacity-40 ml-4 tracking-widest font-display">¿Cuándo ocurrió?</label>
              <input 
                type="date" 
                value={formData.fecha_suceso}
                onChange={e => setFormData({...formData, fecha_suceso: e.target.value})}
                className="w-full p-4 rounded-2xl border dark:border-clr4 bg-zinc-50 dark:bg-clr3 font-bold"
              />
            </div>
            {/* PRIVACIDAD */}
            <div className="flex flex-col justify-center items-center p-2 bg-zinc-50 dark:bg-clr3 rounded-2xl border dark:border-clr4 relative overflow-hidden group">
              {formData.excluir_dirigentes && <div className="absolute inset-0 bg-clr7/5 animate-pulse" />}
              <label className="text-[0.8em] font-black uppercase opacity-60 text-center mb-2 z-10">¿Quien lo puede ver?</label>
              <div 
                onClick={() => setFormData({...formData, excluir_dirigentes: !formData.excluir_dirigentes})}
                className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors z-10 ${formData.excluir_dirigentes ? 'bg-clr7 shadow-lg shadow-clr7/40' : 'bg-zinc-300 dark:bg-clr4'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 ${formData.excluir_dirigentes ? 'translate-x-6' : ''}`} />
              </div>
              <p className="text-[0.8em] mt-2 opacity-40 uppercase font-bold text-center z-10">
                {formData.excluir_dirigentes ? 'Oculto a Dirigentes' : 'Visible para todos'}
              </p>
            </div>
          </div>

          {/* HISTORIA */}
          <div className="space-y-1">
            <label className="text-[0.8em] font-black uppercase opacity-40 ml-4 tracking-widest font-display">Relato de la Historia</label>
            <textarea 
              value={formData.historia}
              onChange={e => setFormData({...formData, historia: e.target.value})}
              placeholder="Cuéntanos qué pasó, qué aprendieron y qué fue lo más divertido..."
              className="w-full p-6 rounded-[2rem] border dark:border-clr4 bg-zinc-50 dark:bg-clr3 font-bold min-h-[180px] leading-relaxed italic text-lg"
            />
          </div>

          {/* FOTOS */}
          <div className="space-y-4">
            <label className="text-[0.8em] font-black uppercase opacity-40 ml-4 tracking-widest font-display block">Fotos de la Aventura</label>
            
            {/* Grid de Previsualización */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {formData.imagenes.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden shadow-md group">
                  <img src={img} className="w-full h-full object-cover" alt={`preview-${idx}`} />
                  <button 
                    type="button" 
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
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
                className={`aspect-square rounded-2xl border-2 border-dashed border-clr2 flex flex-col items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-clr4 transition-all ${uploading ? 'animate-pulse opacity-50' : ''}`}
              >
                <span className="text-3xl">{uploading ? '⏳' : '📸'}</span>
                <span className="text-[0.9em] font-black uppercase text-clr2 tracking-tighter">
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
            
            <p className="text-[1em] opacity-40 italic ml-4">
              * Las fotos se guardan de forma segura en la galería de la unidad.
            </p>
          </div>

          {/* BOTONES ACCIÓN */}
          <div className="flex gap-2 pt-6">
            <button 
              type="submit" 
              disabled={saving || uploading}
              className="flex-1 py-5 bg-clr7 text-white font-black font-display uppercase rounded-[1.5rem] shadow-2xl tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
            >
              {saving ? 'Guardando...' : `💾 Guardar en el ${unitName}`}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="px-8 py-5 bg-zinc-100 dark:bg-clr4 text-clr2 rounded-[1.5rem] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
