'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface DashModRecaudacionCerrarProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  recaudacion: any
  perfil: any
}

export default function DashModRecaudacionCerrar({
  isOpen,
  onClose,
  onSuccess,
  recaudacion,
  perfil
}: DashModRecaudacionCerrarProps) {
  const [saving, setSaving] = useState(false)
  const [items, setItems] = useState<any[]>([])
  const [totalRecaudado, setTotalRecaudado] = useState(0)
  const [montoGasto, setMontoGasto] = useState<number | ''>('')
  
  // Ítems de contabilidad seleccionados por el usuario
  const [itemIdIngreso, setItemIdIngreso] = useState('')
  const [itemIdEgreso, setItemIdEgreso] = useState('')

  // 1. Cargar datos del glosario contable y calcular el total de comprobantes validados
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar ítems
        const { data: itemsData } = await supabase
          .from('tesoreria_items')
          .select('*')
          .order('codigo')
        setItems(itemsData || [])

        // Calcular total recaudado de comprobantes validados
        const { data: comps, error: compsErr } = await supabase
          .from('tesoreria_recaudaciones_comprobantes')
          .select('monto')
          .eq('recaudacion_id', recaudacion.id)
          .eq('estado', 'validado')

        if (compsErr) throw compsErr

        const sum = comps.reduce((acc, curr) => acc + (curr.monto || 0), 0)
        setTotalRecaudado(sum)
      } catch (err: any) {
        console.error('Error al cargar datos de cierre:', err.message)
      }
    }
    if (isOpen && recaudacion) {
      fetchData()
      setMontoGasto('')
      setItemIdIngreso('')
      setItemIdEgreso('')
    }
  }, [isOpen, recaudacion])

  // Filtrar ítems de ingreso y egreso
  const ingresosItems = items.filter(i => i.codigo.startsWith('I-'))
  const egresosItems = items.filter(i => i.codigo.startsWith('E-'))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!itemIdIngreso) {
      alert('Por favor seleccione el ítem contable para registrar el ingreso.')
      return
    }
    if (montoGasto !== '' && montoGasto > 0 && !itemIdEgreso) {
      alert('Por favor seleccione el ítem contable para registrar el egreso del gasto.')
      return
    }

    setSaving(true)
    try {
      const gastoVal = montoGasto === '' ? 0 : parseInt(montoGasto.toString())

      // 1. Marcar la recaudación como completada e ingresar el monto gastado
      const { error: updErr } = await supabase
        .from('tesoreria_recaudaciones')
        .update({
          estado: 'completada',
          monto_gastado: gastoVal
        })
        .eq('id', recaudacion.id)

      if (updErr) throw updErr

      // 2. Insertar movimiento de INGRESO en el libro contable (si hay montos recaudados)
      if (totalRecaudado > 0) {
        const { error: ingErr } = await supabase
          .from('tesoreria_movimientos')
          .insert({
            dia: new Date().getDate(),
            mes: new Date().getMonth() + 1,
            anio: new Date().getFullYear(),
            fecha_completa: new Date().toISOString().split('T')[0],
            tipo_documento: 'I', // Ingreso
            descripcion: `RECAUDACIÓN EVENTO: ${recaudacion.nombre}`,
            item_id: parseInt(itemIdIngreso),
            monto_ingreso: totalRecaudado,
            monto_egreso: 0,
            unidad_id: null, // General del grupo
            registrado_por: perfil.id
          })
        if (ingErr) throw ingErr
      }

      // 3. Insertar movimiento de EGRESO en el libro contable (si hay gastos informados)
      if (gastoVal > 0) {
        const { error: egrErr } = await supabase
          .from('tesoreria_movimientos')
          .insert({
            dia: new Date().getDate(),
            mes: new Date().getMonth() + 1,
            anio: new Date().getFullYear(),
            fecha_completa: new Date().toISOString().split('T')[0],
            tipo_documento: 'E', // Egreso
            descripcion: `GASTOS ASOCIADOS EVENTO: ${recaudacion.nombre}`,
            item_id: parseInt(itemIdEgreso),
            monto_ingreso: 0,
            monto_egreso: gastoVal,
            unidad_id: null,
            registrado_por: perfil.id
          })
        if (egrErr) throw egrErr
      }

      alert('¡Recaudación completada y registrada en el Libro Diario exitosamente!')
      onSuccess()
      onClose()
    } catch (err: any) {
      alert('Error al cerrar recaudación: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen || !recaudacion) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-2 md:p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-clr5 w-full max-w-lg rounded-[2.5rem] p-6 md:p-10 shadow-2xl border-4 border-clr10 dark:border-clr4 overflow-y-auto max-h-[95vh]">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black font-display uppercase text-clr7 tracking-tighter">
            Completar Recaudación
          </h2>
          <button onClick={onClose} className="text-clr2 hover:text-black dark:text-white/60 dark:hover:text-white font-bold text-[1.2em]">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-[1em]">
          <div className="bg-zinc-50 dark:bg-black/10 p-5 rounded-2xl border text-center space-y-2">
            <p className="text-[0.8em] font-bold uppercase opacity-60">Total Validado Recaudado</p>
            <p className="text-3xl font-black text-green-600">${totalRecaudado.toLocaleString('es-CL')}</p>
            <p className="text-[0.75em] opacity-40 font-semibold uppercase">
              Sumatoria de comprobantes con estado validado.
            </p>
          </div>

          {/* Seleccionar Ítem Contable de Ingreso */}
          <div className="space-y-1">
            <label className="text-[0.8em] font-bold uppercase opacity-60">Ítem Contable de Ingreso</label>
            <select
              required
              value={itemIdIngreso}
              onChange={e => setItemIdIngreso(e.target.value)}
              className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-clr3 font-bold uppercase text-[0.8em]"
            >
              <option value="">Seleccionar ítem...</option>
              {ingresosItems.map(i => (
                <option key={i.id} value={i.id}>{i.codigo} - {i.nombre.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Monto de Gasto (Egreso) */}
          <div className="space-y-1">
            <label className="text-[0.8em] font-bold uppercase opacity-60">Gasto de la Recaudación ($)</label>
            <input
              type="number"
              min="0"
              placeholder="Indicar cuánto se gastó (dejar vacío si es $0)"
              value={montoGasto}
              onChange={e => setMontoGasto(e.target.value === '' ? '' : parseInt(e.target.value))}
              className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-clr3 font-black text-center text-[1.1em] text-clr7"
            />
          </div>

          {/* Seleccionar Ítem Contable de Egreso (Solo si hay gasto) */}
          {montoGasto !== '' && montoGasto > 0 && (
            <div className="space-y-1 animate-in slide-in-from-top duration-300">
              <label className="text-[0.8em] font-bold uppercase opacity-60">Ítem Contable de Egreso</label>
              <select
                required
                value={itemIdEgreso}
                onChange={e => setItemIdEgreso(e.target.value)}
                className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-clr3 font-bold uppercase text-[0.8em]"
              >
                <option value="">Seleccionar ítem...</option>
                {egresosItems.map(i => (
                  <option key={i.id} value={i.id}>{i.codigo} - {i.nombre.toUpperCase()}</option>
                ))}
              </select>
            </div>
          )}

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
              className="px-6 py-3 bg-clr7 text-white rounded-xl text-[0.85em] font-bold uppercase hover:brightness-110 shadow-lg transition-all disabled:opacity-50"
            >
              {saving ? 'Procesando...' : 'Completar y Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
