'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Perfil, Unidad, TesoreriaItem } from '@/types'
import { toast } from 'sonner';

interface DashModComprobanteProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  perfil: Perfil
  unidades: Unidad[]
}

function numeroALetras(num: number): string {
  return `${num.toLocaleString('es-CL')} PESOS`.toUpperCase()
}

export default function DashModComprobante({ isOpen, onClose, onSuccess, perfil, unidades }: DashModComprobanteProps) {
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<any[]>([])
  const [tipo, setTipo] = useState<'Ingreso' | 'Egreso'>('Egreso')
  
  const [form, setForm] = useState({
    nombre: '',
    fecha: new Date().toISOString().split('T')[0],
    forma_pago: 'Efectivo',
    numero_documento: '',
    unidad_id: '',
    detalles: [
      { item_id: '', descripcion: '', valor: '' },
      { item_id: '', descripcion: '', valor: '' },
      { item_id: '', descripcion: '', valor: '' },
      { item_id: '', descripcion: '', valor: '' }
    ]
  })

  useEffect(() => {
    const fetchItems = async () => {
      const { data } = await supabase.from('tesoreria_items').select('*').order('codigo')
      setItems(data || [])
    }
    if (isOpen) fetchItems()
  }, [isOpen])

  if (!isOpen) return null

  const total = form.detalles.reduce((acc, d) => acc + (parseInt(d.valor) || 0), 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (total <= 0) { toast.info('El total debe ser mayor a 0'); return; }
    
    setLoading(true)
    try {
      const { data: comp, error: compErr } = await supabase.from('tesoreria_comprobantes').insert({
        tipo,
        pagado_recibido_nombre: form.nombre,
        suma_palabras: numeroALetras(total),
        fecha: form.fecha,
        forma_pago: form.forma_pago,
        numero_documento: form.numero_documento,
        unidad_id: form.unidad_id || null,
        hecho_por: perfil.id,
        estado: 'Aprobado'
      }).select().single()

      if (compErr) throw compErr

      const detallesToIns = form.detalles
        .filter(d => d.item_id && d.valor)
        .map(d => ({
          comprobante_id: comp.id,
          item_id: parseInt(d.item_id),
          descripcion: d.descripcion,
          valor: parseInt(d.valor)
        }))
      
      await supabase.from('tesoreria_comprobante_detalles').insert(detallesToIns)

      const fechaObj = new Date(form.fecha)
      await supabase.from('tesoreria_movimientos').insert({
        dia: fechaObj.getUTCDate(),
        mes: fechaObj.getUTCMonth() + 1,
        anio: fechaObj.getUTCFullYear(),
        fecha_completa: form.fecha,
        comprobante_numero: `VALE-${comp.folio}`,
        tipo_documento: tipo === 'Ingreso' ? 'I' : 'E',
        descripcion: `[VALE #${comp.folio}] ${form.nombre}: ${detallesToIns[0]?.descripcion || ''}`,
        item_id: detallesToIns[0]?.item_id,
        monto_ingreso: tipo === 'Ingreso' ? total : 0,
        monto_egreso: tipo === 'Egreso' ? total : 0,
        unidad_id: form.unidad_id || null,
        registrado_por: perfil.id
      })

      onSuccess()
      onClose()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[120] flex items-center justify-center p-2 md:p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-clr5 w-full max-w-4xl rounded-[3rem] p-6 md:p-10 shadow-2xl border-4 border-clr10 dark:border-clr4 overflow-y-auto max-h-[95vh]">
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-black font-display uppercase text-clr6 tracking-tighter">Emitir Vale Institucional</h2>
          <div className="flex bg-zinc-100 dark:bg-black/20 p-1 rounded-xl">
            <button onClick={() => setTipo('Egreso')} className={`px-4 py-2 rounded-lg text-[0.8em] font-bold uppercase transition-all ${tipo === 'Egreso' ? 'bg-red-500 text-white' : 'opacity-40'}`}>Egreso (FOR-05)</button>
            <button onClick={() => setTipo('Ingreso')} className={`px-4 py-2 rounded-lg text-[0.8em] font-bold uppercase transition-all ${tipo === 'Ingreso' ? 'bg-green-600 text-white' : 'opacity-40'}`}>Ingreso (FOR-06)</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-[1em]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[0.8em] font-bold uppercase opacity-40">{tipo === 'Egreso' ? 'PAGADO A:' : 'RECIBIDO DE:'}</label>
              <input required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-clr3 font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[0.8em] font-bold uppercase opacity-40">FECHA:</label>
                <input type="date" required value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-clr3 font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[0.8em] font-bold uppercase opacity-40">FORMA PAGO:</label>
                <select value={form.forma_pago} onChange={e => setForm({...form, forma_pago: e.target.value})} className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-clr3 font-bold uppercase">
                  <option value="Efectivo">Efectivo</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Depósito">Depósito</option>
                  <option value="Documento">Documento</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-1">
              <label className="text-[0.8em] font-bold uppercase opacity-40">Nº TRANSACCIÓN / DOC:</label>
              <input value={form.numero_documento} onChange={e => setForm({...form, numero_documento: e.target.value})} className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-clr3 font-bold" placeholder="Opcional..." />
            </div>
            <div className="md:col-span-1 space-y-1">
              <label className="text-[0.8em] font-bold uppercase opacity-40">REGISTRADO POR:</label>
              <div className="p-3 rounded-xl bg-zinc-100 dark:bg-clr4 font-bold text-xs uppercase opacity-60 truncate">
                {perfil?.nombres} {perfil?.apellidos} ({perfil?.rut})
              </div>
            </div>
            <div className="md:col-span-1 space-y-1">
              <label className="text-[0.8em] font-bold uppercase opacity-40">UNIDAD ASOCIADA:</label>
              <select value={form.unidad_id} onChange={e => setForm({...form, unidad_id: e.target.value})} className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-clr3 font-bold uppercase text-[0.8em]">
                <option value="">⚜️ GRUPO</option>
                {unidades.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[0.8em] font-black uppercase opacity-30 tracking-[0.2em] border-b pb-2">DETALLE DEL COMPROBANTE</h3>
            {form.detalles.map((det, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2">
                <div className="md:col-span-3">
                  <select value={det.item_id} onChange={e => {
                    const newD = [...form.detalles]; newD[idx].item_id = e.target.value; setForm({...form, detalles: newD})
                  }} className="w-full p-2 rounded-lg border bg-zinc-50 dark:bg-clr3 text-[0.8em] font-bold uppercase">
                    <option value="">Ítem...</option>
                    {items.filter(i => i.tipo === tipo).map(i => <option key={i.id} value={i.id}>{i.codigo} {i.nombre}</option>)}
                  </select>
                </div>
                <div className="md:col-span-6">
                  <input value={det.descripcion} onChange={e => {
                    const newD = [...form.detalles]; newD[idx].descripcion = e.target.value; setForm({...form, detalles: newD})
                  }} className="w-full p-2 rounded-lg border bg-zinc-50 dark:bg-clr3 text-[0.8em] uppercase" placeholder="Descripción del concepto..." />
                </div>
                <div className="md:col-span-3">
                  <input type="number" value={det.valor} onChange={e => {
                    const newD = [...form.detalles]; newD[idx].valor = e.target.value; setForm({...form, detalles: newD})
                  }} className="w-full p-2 rounded-lg border bg-zinc-50 dark:bg-clr3 text-[0.8em] font-black text-right" placeholder="$ 0" />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-zinc-100 dark:bg-black/30 p-6 rounded-[2rem] flex justify-between items-center gap-4 border-2 border-clr10 dark:border-clr4">
            <div className="flex-1">
              <p className="text-[0.8em] font-black uppercase opacity-40">Suma en palabras (Auto):</p>
              <p className="text-[0.9em] font-bold text-clr6 italic">{numeroALetras(total)}</p>
            </div>
            <div className="text-right">
              <p className="text-[0.8em] font-black uppercase opacity-40">Monto Total</p>
              <p className="text-3xl font-black text-clr5 dark:text-clr1">${total.toLocaleString('es-CL')}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="flex-1 py-4 bg-clr6 text-white font-black uppercase rounded-2xl shadow-xl hover:brightness-110 tracking-widest transition-all">
              {loading ? 'EMITIENDO...' : '💾 Emitir y Registrar en Libro'}
            </button>
            <button type="button" onClick={onClose} className="px-8 py-4 bg-zinc-100 dark:bg-clr4 text-clr2 font-bold uppercase rounded-2xl tracking-widest">CANCELAR</button>
          </div>
        </form>
      </div>
    </div>
  )
}
