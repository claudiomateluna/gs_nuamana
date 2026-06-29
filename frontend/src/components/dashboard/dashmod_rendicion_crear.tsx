'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface DashModRendicionCrearProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  perfil: any
  unidades: any[]
}

export default function DashModRendicionCrear({ isOpen, onClose, onSuccess, perfil, unidades }: DashModRendicionCrearProps) {
  const [loading, setLoading] = useState(false)
  const [availableMovs, setAvailableMovs] = useState<any[]>([])
  const [selectedMovs, setSelectedMovs] = useState<string[]>([])
  
  const [form, setForm] = useState<any>({
    nombre_responsable: perfil?.nombres + ' ' + perfil?.apellidos,
    cargo_responsable: perfil?.roles?.name || '',
    fecha: new Date().toISOString().split('T')[0],
    motivo: '',
    unidad_id: '',
    monto_a_rendir: '',
    banco_nombre_titular: '',
    banco_nombre_banco: '',
    banco_tipo_cuenta: '',
    banco_rut: '',
    banco_email: ''
  })

  useEffect(() => {
    const fetchMovs = async () => {
      const { data } = await supabase.from('tesoreria_movimientos').select('*, tesoreria_items(codigo, nombre)').order('fecha_completa', { ascending: false })
      const { data: linked } = await supabase.from('tesoreria_rendicion_movimientos').select('movimiento_id')
      const linkedIds = new Set(linked?.map(l => l.movimiento_id) || [])
      setAvailableMovs(data?.filter(m => !linkedIds.has(m.id)) || [])
    }
    if (isOpen) fetchMovs()
  }, [isOpen])

  if (!isOpen) return null

  // TOTAL RENDICIÓN: Suma absoluta de los documentos seleccionados (sin importar si son I o E)
  const totalRendicion = availableMovs
    .filter(m => selectedMovs.includes(m.id))
    .reduce((acc, m) => acc + (m.monto_egreso || 0) + (m.monto_ingreso || 0), 0)

  const montoARendirNum = parseInt(form.monto_a_rendir) || 0
  const saldoFinal = montoARendirNum - totalRendicion

  const handleCalcularBalance = async () => {
    const anioActual = new Date(form.fecha).getFullYear()
    let query = supabase.from('tesoreria_movimientos').select('monto_ingreso, monto_egreso').eq('anio', anioActual)
    
    if (form.unidad_id) query = query.eq('unidad_id', parseInt(form.unidad_id))
    else query = query.is('unidad_id', null)

    const { data } = await query
    const balance = (data || []).reduce((acc, m) => acc + (m.monto_ingreso || 0) - (m.monto_egreso || 0), 0)
    setForm({...form, monto_a_rendir: Math.max(0, balance).toString()})
  }

  const toggleMov = (id: string) => {
    setSelectedMovs(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedMovs.length === 0) return alert('Selecciona al menos un movimiento.')
    
    setLoading(true)
    try {
      const { data: rend, error: rendErr } = await supabase.from('tesoreria_rendiciones').insert({
        ...form,
        monto_a_rendir: montoARendirNum,
        unidad_id: form.unidad_id || null,
        total_rendicion: totalRendicion,
        saldo_final: saldoFinal,
        estado: 'Aprobada'
      }).select().single()

      if (rendErr) throw rendErr

      const links = selectedMovs.map(id => ({ rendicion_id: rend.id, movimiento_id: id }))
      await supabase.from('tesoreria_rendicion_movimientos').insert(links)

      onSuccess()
      onClose()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[120] flex items-center justify-center p-1 md:p-2 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-clr5 w-full max-w-5xl rounded-l-[1rem] p-2 md:p-4 shadow-2xl border-4 border-clr10 dark:border-clr4 overflow-y-auto max-h-[95vh]">
        <h2 className="text-2xl md:text-3xl font-black font-display uppercase text-clr6 mb-4 tracking-tighter">Nueva Rendición de Cuentas (FOR-03)</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-[1em]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-zinc-50 dark:bg-black/10 p-4 rounded-[1rem] border">
            <div className="space-y-1"><label className="text-[0.8em] font-black uppercase opacity-80">Responsable</label><input required value={form.nombre_responsable} onChange={e => setForm({...form, nombre_responsable: e.target.value})} className="w-full border border-clr3 dark:border-dclr2 p-2 rounded-xl bg-white dark:bg-clr3 font-bold" /></div>
            <div className="space-y-1"><label className="text-[0.8em] font-black uppercase opacity-80">Cargo</label><input required value={form.cargo_responsable} onChange={e => setForm({...form, cargo_responsable: e.target.value})} className="w-full border border-clr3 dark:border-dclr2 p-2 rounded-xl bg-white dark:bg-clr3 font-bold" /></div>
            <div className="space-y-1"><label className="text-[0.8em] font-black uppercase opacity-80">Fecha Reporte</label><input type="date" required value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} className="w-full border border-clr3 dark:border-dclr2 p-2 rounded-xl bg-white dark:bg-clr3 font-bold" /></div>
            <div className="md:col-span-2 space-y-1"><label className="text-[0.8em] font-black uppercase opacity-80">Motivo / Actividad</label><input required value={form.motivo} onChange={e => setForm({...form, motivo: e.target.value})} className="w-full border border-clr3 dark:border-dclr2 p-2 rounded-xl bg-white dark:bg-clr3 font-bold" placeholder="Ej: Campamento de Verano 2026" /></div>
            <div className="space-y-1"><label className="text-[0.8em] font-black uppercase opacity-80">Unidad</label><select value={form.unidad_id} onChange={e => setForm({...form, unidad_id: e.target.value})} className="w-full border border-clr3 dark:border-dclr2 p-2 rounded-xl bg-white dark:bg-clr3 font-bold uppercase"><option value="">⚜️ GRUPO</option>{unidades.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}</select></div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center"><h3 className="text-[0.8em] font-black uppercase opacity-80 tracking-widest">Seleccionar Movimientos a Rendir</h3><span className="text-[0.8em] bg-clr6 text-white px-3 py-1 rounded-full font-bold">{selectedMovs.length} Seleccionados</span></div>
            <div className="border rounded-[1rem] overflow-hidden max-h-[300px] overflow-y-auto"><table className="w-full text-left text-[0.8em]"><thead className="sticky top-0 bg-zinc-100 dark:bg-clr4 font-black uppercase"><tr><th className="p-3 w-10"></th><th className="p-3 w-24">Fecha</th><th className="p-3">Descripción</th><th className="p-3 text-right">Monto</th></tr></thead><tbody>{availableMovs.map(m => (<tr key={m.id} onClick={() => toggleMov(m.id)} className={`border-t cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/5 ${selectedMovs.includes(m.id) ? 'bg-clr6/5 border-l-4 border-l-clr6' : ''}`}><td className="p-3 text-center"><input type="checkbox" checked={selectedMovs.includes(m.id)} readOnly className="w-4 h-4 rounded accent-clr6" /></td><td className="p-3 font-bold">{new Date(m.fecha_completa).toLocaleDateString('es-CL')}</td><td className="p-3"><p className="font-bold uppercase">{m.descripcion}</p><p className="opacity-80 text-[1em]">{m.tesoreria_items?.codigo} {m.tesoreria_items?.nombre}</p></td><td className="p-3 text-right font-black">${(m.monto_egreso || m.monto_ingreso).toLocaleString('es-CL')}</td></tr>))}</tbody></table></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1 p-3 bg-zinc-50 dark:bg-black/10 rounded-[1rem] border relative">
              <label className="text-[0.8em] font-black uppercase opacity-80">MONTO A RENDIR $</label>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black opacity-60">$</span>
                <input 
                  type="text" inputMode="numeric" pattern="[0-9]*" placeholder="0"
                  value={form.monto_a_rendir} onChange={e => setForm({...form, monto_a_rendir: e.target.value.replace(/\D/g, '')})} 
                  className="w-full text-2xl font-black bg-transparent outline-none text-clr5 dark:text-clr9" 
                />
              </div>
              <button type="button" onClick={handleCalcularBalance} className="absolute top-2 right-4 text-[0.8em] font-black uppercase text-clr6 underline">Calcular Balance Año</button>
            </div>
            <div className="space-y-1 p-3 bg-zinc-50 dark:bg-black/10 rounded-[1rem] border">
              <label className="text-[0.8em] font-black uppercase opacity-40">TOTAL RENDICIÓN $</label>
              <p className="text-2xl font-black text-red-600">${totalRendicion.toLocaleString('es-CL')}</p>
            </div>
            <div className={`space-y-1 p-3 rounded-[1rem] border shadow-xl transition-colors ${saldoFinal >= 0 ? 'bg-clr6 text-white' : 'bg-clr7 text-white'}`}>
              <label className="text-[0.8em] font-black uppercase opacity-80">SALDO $ {saldoFinal >= 0 ? '(A FAVOR)' : '(EN CONTRA)'}</label>
              <p className="text-2xl font-black">${Math.abs(saldoFinal).toLocaleString('es-CL')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[0.8em] font-black uppercase opacity-30 tracking-[0.2em] border-b pb-2">Datos para Reembolso (Si aplica)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input placeholder="Nombre Titular" value={form.banco_nombre_titular} onChange={e => setForm({...form, banco_nombre_titular: e.target.value})} className="p-3 rounded-xl border bg-zinc-50 dark:bg-clr3 text-xs font-bold uppercase" />
              <input placeholder="RUT" value={form.banco_rut} onChange={e => setForm({...form, banco_rut: e.target.value})} className="p-3 rounded-xl border bg-zinc-50 dark:bg-clr3 text-xs font-bold uppercase" />
              <input placeholder="Banco" value={form.banco_nombre_banco} onChange={e => setForm({...form, banco_nombre_banco: e.target.value})} className="p-3 rounded-xl border bg-zinc-50 dark:bg-clr3 text-xs font-bold uppercase" />
              <input placeholder="Tipo Cuenta" value={form.banco_tipo_cuenta} onChange={e => setForm({...form, banco_tipo_cuenta: e.target.value})} className="p-3 rounded-xl border bg-zinc-50 dark:bg-clr3 text-xs font-bold uppercase" />
              <input placeholder="Email" value={form.banco_email} onChange={e => setForm({...form, banco_email: e.target.value})} className="p-3 rounded-xl border bg-zinc-50 dark:bg-clr3 text-xs font-bold" />
            </div>
          </div>

          <div className="flex gap-3 pt-4"><button type="submit" disabled={loading || selectedMovs.length === 0} className="flex-1 py-4 bg-clr6 text-white font-black uppercase rounded-2xl shadow-xl hover:brightness-110 tracking-widest transition-all disabled:opacity-30">{loading ? 'PROCESANDO...' : '💾 Generar Rendición Final'}</button><button type="button" onClick={onClose} className="px-8 py-4 bg-zinc-100 dark:bg-clr4 text-clr2 font-bold uppercase rounded-2xl tracking-widest">CANCELAR</button></div>
        </form>
      </div>
    </div>
  )
}
