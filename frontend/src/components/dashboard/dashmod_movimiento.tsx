'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface DashModMovimientoProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editingMov: any
  perfil: any
  unidades: any[]
}

const TIPOS_DOC = [
  { val: 'I', lab: 'Ingreso (I)' },
  { val: 'E', lab: 'Egreso (E)' },
  { val: 'B', lab: 'Boleta (B)' },
  { val: 'F', lab: 'Factura (F)' }
]

export default function DashModMovimiento({ isOpen, onClose, onSuccess, editingMov, perfil, unidades }: DashModMovimientoProps) {
  // 1. DECLARACIÓN DE TODOS LOS HOOKS (Siempre al principio)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [items, setItems] = useState<any[]>([])
  const [formData, setFormData] = useState<any>({
    dia: new Date().getDate(),
    mes: new Date().getMonth() + 1,
    anio: new Date().getFullYear(),
    comprobante_numero: '',
    tipo_documento: 'B',
    descripcion: '',
    item_id: '',
    monto_ingreso: 0,
    monto_egreso: 0,
    unidad_id: null,
    imagen_respaldo_url: ''
  })

  useEffect(() => {
    const fetchItems = async () => {
      const { data } = await supabase.from('tesoreria_items').select('*').order('codigo')
      setItems(data || [])
    }
    if (isOpen) fetchItems()
  }, [isOpen])

  useEffect(() => {
    if (editingMov) {
      setFormData({ 
        ...editingMov,
        monto_ingreso: editingMov.monto_ingreso || '',
        monto_egreso: editingMov.monto_egreso || '',
        comprobante_numero: editingMov.comprobante_numero || '',
        descripcion: editingMov.descripcion || '',
        imagen_respaldo_url: editingMov.imagen_respaldo_url || ''
      })
    } else {
      setFormData({
        dia: new Date().getDate(),
        mes: new Date().getMonth() + 1,
        anio: new Date().getFullYear(),
        comprobante_numero: '',
        tipo_documento: 'B',
        descripcion: '',
        item_id: '',
        monto_ingreso: '',
        monto_egreso: '',
        unidad_id: null,
        imagen_respaldo_url: ''
      })
    }
  }, [editingMov, isOpen])

  // 2. FUNCIONES DE MANEJO
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `respaldos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('tesoreria')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('tesoreria')
        .getPublicUrl(filePath)

      setFormData({ ...formData, imagen_respaldo_url: publicUrl })
    } catch (err: any) {
      alert('Error al subir: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fecha = `${formData.anio}-${String(formData.mes).padStart(2, '0')}-${String(formData.dia).padStart(2, '0')}`
      
      // Limpiar el payload: Solo enviar columnas reales de la tabla
      const payload = {
        dia: parseInt(formData.dia) || new Date().getDate(),
        mes: parseInt(formData.mes) || (new Date().getMonth() + 1),
        anio: parseInt(formData.anio) || new Date().getFullYear(),
        fecha_completa: fecha,
        comprobante_numero: formData.comprobante_numero || null,
        tipo_documento: formData.tipo_documento,
        descripcion: formData.descripcion,
        item_id: formData.item_id ? parseInt(formData.item_id) : null,
        monto_ingreso: parseInt(formData.monto_ingreso) || 0,
        monto_egreso: parseInt(formData.monto_egreso) || 0,
        unidad_id: formData.unidad_id === 'grupal' ? null : (formData.unidad_id ? parseInt(formData.unidad_id) : null),
        imagen_respaldo_url: formData.imagen_respaldo_url || null,
        registrado_por: perfil.id
      }

      if (editingMov) {
        const { error } = await supabase.from('tesoreria_movimientos').update(payload).eq('id', editingMov.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('tesoreria_movimientos').insert(payload)
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

  // 3. RENDERIZADO CONDICIONAL (Después de los hooks)
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-2 md:p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-clr5 w-full max-w-2xl rounded-[2.5rem] p-6 md:p-10 shadow-2xl border-4 border-clr10 dark:border-clr4 overflow-y-auto max-h-[95vh]">
        <h2 className="text-2xl font-black font-display uppercase text-clr6 mb-8 tracking-tighter">
          {editingMov ? 'Editar Movimiento' : 'Registrar Movimiento'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 text-[1em]">
          <div className="grid grid-cols-3 gap-4 bg-zinc-50 dark:bg-black/10 p-4 rounded-2xl border">
            <div className="space-y-1">
              <label className="text-[0.8em] font-black uppercase opacity-40">Día</label>
              <input type="number" min="1" max="31" required value={formData.dia} onChange={e => setFormData({...formData, dia: e.target.value})} className="w-full p-2 rounded-xl bg-white dark:bg-clr3 font-bold text-center" />
            </div>
            <div className="space-y-1">
              <label className="text-[0.8em] font-black uppercase opacity-40">Mes</label>
              <input type="number" min="1" max="12" required value={formData.mes} onChange={e => setFormData({...formData, mes: e.target.value})} className="w-full p-2 rounded-xl bg-white dark:bg-clr3 font-bold text-center" />
            </div>
            <div className="space-y-1">
              <label className="text-[0.8em] font-black uppercase opacity-40">Año</label>
              <input type="number" required value={formData.anio} onChange={e => setFormData({...formData, anio: e.target.value})} className="w-full p-2 rounded-xl bg-white dark:bg-clr3 font-bold text-center" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[0.8em] font-bold uppercase opacity-40">Tipo Documento</label>
              <select value={formData.tipo_documento} onChange={e => setFormData({...formData, tipo_documento: e.target.value})} className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-clr3 font-bold uppercase">
                {TIPOS_DOC.map(t => <option key={t.val} value={t.val}>{t.lab}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[0.8em] font-bold uppercase opacity-40">Nº Comprobante / Boleta</label>
              <input value={formData.comprobante_numero || ''} onChange={e => setFormData({...formData, comprobante_numero: e.target.value})} className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-clr3 font-bold" placeholder="Ej: 4521" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[0.8em] font-bold uppercase opacity-40">Ítem Presupuestario (Glosario)</label>
            <select required value={formData.item_id || ''} onChange={e => setFormData({...formData, item_id: e.target.value})} className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-clr3 font-bold uppercase text-[0.85em]">
              <option value="">Seleccionar ítem...</option>
              {items.map(i => <option key={i.id} value={i.id}>{i.codigo} - {i.nombre.toUpperCase()}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[0.8em] font-bold uppercase opacity-40">Descripción Detallada</label>
            <textarea required value={formData.descripcion || ''} onChange={e => setFormData({...formData, descripcion: e.target.value})} className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-clr3 font-bold h-20" placeholder="Ej: Compra de carbón y carne para actividad de unidad..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[0.8em] font-bold uppercase text-green-600">Ingreso ($)</label>
              <input 
                type="text" 
                inputMode="numeric" 
                pattern="[0-9]*" 
                placeholder="Ej: 5000"
                value={formData.monto_ingreso || ''} 
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '')
                  setFormData({...formData, monto_ingreso: val, monto_egreso: ''})
                }} 
                className="w-full p-3 rounded-xl border border-green-200 bg-green-50 dark:bg-green-900/10 font-black text-green-700 dark:text-green-400" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[0.8em] font-bold uppercase text-red-600">Egreso ($)</label>
              <input 
                type="text" 
                inputMode="numeric" 
                pattern="[0-9]*" 
                placeholder="Ej: 2500"
                value={formData.monto_egreso || ''} 
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '')
                  setFormData({...formData, monto_egreso: val, monto_ingreso: ''})
                }} 
                className="w-full p-3 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/10 font-black text-red-700 dark:text-red-400" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[0.8em] font-bold uppercase opacity-40">Asignación de Unidad</label>
            <select value={formData.unidad_id || 'grupal'} onChange={e => setFormData({...formData, unidad_id: e.target.value})} className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-clr3 font-bold uppercase">
              <option value="grupal">⚜️ GRUPAL (FONDO GRUPO)</option>
              {unidades.map(u => <option key={u.id} value={u.id}>{u.nombre.toUpperCase()}</option>)}
            </select>
          </div>

          <div className="space-y-1 bg-zinc-50 dark:bg-black/10 p-4 rounded-2xl border-2 border-dashed border-clr10 dark:border-clr4">
            <label className="text-[0.8em] font-bold uppercase opacity-40">Documento de Respaldo (Boleta/Factura)</label>
            <div className="mt-2 flex flex-col items-center gap-4">
              {formData.imagen_respaldo_url ? (
                <div className="relative group w-full h-40 bg-white rounded-xl overflow-hidden shadow-inner border">
                  <img src={formData.imagen_respaldo_url} className="w-full h-full object-contain" alt="Respaldo" />
                  <button type="button" onClick={() => setFormData({...formData, imagen_respaldo_url: ''})} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                </div>
              ) : (
                <label className="w-full h-24 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer hover:bg-white dark:hover:bg-clr3 transition-all">
                  <span className="text-2xl">{uploading ? '⌛' : '📸'}</span>
                  <span className="text-[0.8em] font-bold uppercase opacity-40">{uploading ? 'Subiendo...' : 'Subir Foto o PDF'}</span>
                  <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileUpload} disabled={uploading} />
                </label>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={saving} className="flex-1 py-4 bg-clr6 text-white font-black uppercase rounded-2xl shadow-xl hover:brightness-110 tracking-widest transition-all">
              {saving ? '⌛ Procesando...' : editingMov ? '💾 Actualizar' : '💾 Registrar'}
            </button>
            <button type="button" onClick={onClose} className="px-8 py-4 bg-zinc-100 dark:bg-clr4 text-clr2 font-bold uppercase rounded-2xl tracking-widest">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
