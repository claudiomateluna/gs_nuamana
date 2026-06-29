'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface DashModRendicionVerProps {
  isOpen: boolean
  onClose: () => void
  rendicion: any
  perfil: any
}

// Versión: 2026-03-08-01 (Actualización Formato Oficial DAF-FOR-03)
export default function DashModRendicionVer({ isOpen, onClose, rendicion, perfil }: DashModRendicionVerProps) {
  const [movimientos, setMovimientos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchMovs = async () => {
      if (!rendicion) return
      setLoading(true)
      const { data } = await supabase
        .from('tesoreria_rendicion_movimientos')
        .select('*, tesoreria_movimientos(*, tesoreria_items(*))')
        .eq('rendicion_id', rendicion.id)
      
      setMovimientos(data?.map(d => d.tesoreria_movimientos) || [])
      setLoading(false)
    }
    if (isOpen) fetchMovs()
  }, [rendicion, isOpen])

  if (!isOpen || !rendicion) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[130] flex items-center justify-center p-2 md:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 text-black dark:text-white w-full max-w-5xl p-4 md:p-8 shadow-2xl font-sans border-[1px] border-black dark:border-zinc-700 my-auto print:p-0 print:border-none print:bg-white print:text-black">
        
        <div className="border-[1.5px] border-black dark:border-white p-4 space-y-4 print:border-black">
          {/* 1. Encabezado Oficial Nua Mana */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <img src="/images/logos/LogoColor.svg" alt="Logo" className="w-16 h-16 object-contain" />
              <div className="text-[0.8em] leading-tight font-bold uppercase">
                <p className="text-[0.9em]">CENTRO JUVENIL CULTURAL DE OUTDOOR NUA MANA</p>
                <p>R.U.T.: 65.015.731-1</p>
                <p>Bahía Catalina 11781</p>
                <p>Teléfono: +56 9 6689 6001</p>
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="text-[0.8em] font-bold uppercase opacity-60">
                DAF-FOR-03 | Rev 3 | 03-11-2021
              </div>
              <h2 className="text-xl font-bold uppercase tracking-tighter border-b-2 border-black dark:border-white print:border-black pb-1">Rendición de Cuentas</h2>
              <div className="inline-block border-[2px] border-black dark:border-white p-2 mt-2 print:border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                <p className="text-[0.8em] font-bold uppercase text-center mb-1">MONTO A RENDIR $</p>
                <p className="text-2xl font-bold">${rendicion.monto_a_rendir.toLocaleString('es-CL')}</p>
              </div>
            </div>
          </div>

          {/* 2. Datos del Responsable - Bloque DAF */}
          <div className="grid grid-cols-12 gap-2 text-[0.8em] uppercase font-bold">
            <div className="col-span-8 flex gap-2 border-b border-black dark:border-white pb-1 print:border-black">
              <span className="opacity-40 shrink-0">NOMBRE:</span>
              <span className="truncate">{rendicion.nombre_responsable}</span>
            </div>
            <div className="col-span-4 flex gap-2 border-b border-black dark:border-white pb-1 print:border-black">
              <span className="opacity-40 shrink-0">FECHA:</span>
              <span>{new Date(rendicion.fecha).toLocaleDateString('es-CL')}</span>
            </div>
            <div className="col-span-8 flex gap-2 border-b border-black dark:border-white pb-1 print:border-black">
              <span className="opacity-40 shrink-0">ESTRUCTURA:</span>
              <span>{rendicion.unidades?.nombre || 'GRUPO NUA MANA'}</span>
            </div>
            <div className="col-span-4 flex gap-2 border-b border-black dark:border-white pb-1 print:border-black">
              <span className="opacity-40 shrink-0">CARGO:</span>
              <span>{rendicion.cargo_responsable}</span>
            </div>
            <div className="col-span-12 flex gap-2 border-b border-black dark:border-white pb-1 print:border-black">
              <span className="opacity-40 shrink-0">MOTIVO:</span>
              <span className="italic">{rendicion.motivo}</span>
            </div>
          </div>

          {/* 3. Tabla de Detalles Técnica (DAF Standard) */}
          <table className="w-full border-collapse border-[1.5px] border-black dark:border-white text-[0.8em] print:border-black">
            <thead>
              <tr className="bg-zinc-100 dark:bg-white/10 uppercase font-bold print:bg-zinc-100">
                <th rowSpan={2} className="border border-black dark:border-white p-1 w-8 print:border-black">Nº</th>
                <th colSpan={3} className="border border-black dark:border-white p-1 text-center print:border-black">FECHA</th>
                <th rowSpan={2} className="border border-black dark:border-white p-1 w-12 text-center print:border-black">TIPO</th>
                <th rowSpan={2} className="border border-black dark:border-white p-1 w-20 print:border-black">Nº DCTO</th>
                <th rowSpan={2} className="border border-black dark:border-white p-1 w-16 print:border-black">ITEM</th>
                <th rowSpan={2} className="border border-black dark:border-white p-1 print:border-black">MOTIVO / CONCEPTO</th>
                <th rowSpan={2} className="border border-black dark:border-white p-1 w-24 text-right print:border-black">VALOR</th>
              </tr>
              <tr className="bg-zinc-50 dark:bg-white/5 uppercase font-bold print:bg-zinc-50">
                <th className="border border-black dark:border-white p-1 w-8 print:border-black">D</th>
                <th className="border border-black dark:border-white p-1 w-8 print:border-black">M</th>
                <th className="border border-black dark:border-white p-1 w-10 print:border-black">A</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="p-8 text-center animate-pulse font-bold">CARGANDO DETALLE...</td></tr>
              ) : (
                <>
                  {movimientos.map((m, idx) => (
                    <tr key={idx} className="uppercase font-bold h-6">
                      <td className="border border-black dark:border-white p-1 text-center print:border-black">{idx + 1}</td>
                      <td className="border border-black dark:border-white p-1 text-center print:border-black">{m.dia}</td>
                      <td className="border border-black dark:border-white p-1 text-center print:border-black">{m.mes}</td>
                      <td className="border border-black dark:border-white p-1 text-center print:border-black">{m.anio}</td>
                      <td className="border border-black dark:border-white p-1 text-center print:border-black">{m.tipo_documento}</td>
                      <td className="border border-black dark:border-white p-1 print:border-black">{m.comprobante_numero || '-'}</td>
                      <td className="border border-black dark:border-white p-1 text-center print:border-black">{m.tesoreria_items?.codigo}</td>
                      <td className="border border-black dark:border-white p-1 truncate max-w-[250px] print:border-black">{m.descripcion}</td>
                      <td className="border border-black dark:border-white p-1 text-right print:border-black">${Math.abs(m.monto_egreso || m.monto_ingreso).toLocaleString('es-CL')}</td>
                    </tr>
                  ))}
                  {/* Filas de relleno para completar el folio */}
                  {Array.from({length: Math.max(0, 12 - movimientos.length)}).map((_, i) => (
                    <tr key={`fill-${i}`} className="h-6"><td colSpan={9} className="border border-black dark:border-white print:border-black"></td></tr>
                  ))}
                </>
              )}
            </tbody>
          </table>

          {/* 4. Pie de Reporte y Resumen Financiero */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-7 border-[1.5px] border-black dark:border-white p-2 print:border-black">
              <p className="text-[0.8em] font-bold uppercase mb-2">DATOS PARA REEMBOLSO (EN CASO DE SALDO A FAVOR):</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[0.8em] font-bold uppercase">
                <div className="border-b border-black dark:border-white print:border-black">NOMBRE: {rendicion.banco_nombre_titular || '-'}</div>
                <div className="border-b border-black dark:border-white print:border-black">RUT: {rendicion.banco_rut || '-'}</div>
                <div className="border-b border-black dark:border-white print:border-black">BANCO: {rendicion.banco_nombre_banco || '-'}</div>
                <div className="border-b border-black dark:border-white print:border-black">TIPO CTA: {rendicion.banco_tipo_cuenta || '-'}</div>
                <div className="col-span-2 border-b border-black dark:border-white print:border-black">EMAIL: {rendicion.banco_email || '-'}</div>
              </div>
            </div>
            <div className="col-span-5 border-[1.5px] border-black dark:border-white overflow-hidden print:border-black font-bold text-[0.8em]">
              <div className="flex justify-between p-1.5 border-b border-black dark:border-white print:border-black">
                <span>TOTAL RENDICIÓN $</span>
                <span>{rendicion.total_rendicion.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between p-1.5 border-b border-black dark:border-white print:border-black">
                <span>MONTO A RENDIR $</span>
                <span>{rendicion.monto_a_rendir.toLocaleString('es-CL')}</span>
              </div>
              <div className={`flex justify-between p-1.5 ${rendicion.saldo_final >= 0 ? 'bg-zinc-100 dark:bg-white/10' : 'bg-red-50 dark:bg-red-900/20'} print:bg-zinc-100`}>
                <span>SALDO $</span>
                <span>{rendicion.saldo_final.toLocaleString('es-CL')}</span>
              </div>
            </div>
          </div>

          {/* 5. Bloque de Firmas Institucionales */}
          <div className="grid grid-cols-3 gap-8 pt-12 pb-4">
            <div className="text-center space-y-1">
              <div className="border-t border-black dark:border-white print:border-black pt-1">
                <p className="text-[0.8em] font-bold uppercase">RENDIDO POR</p>
                <p className="text-[0.8em] font-bold uppercase">{rendicion.nombre_responsable}</p>
                <p className="text-[7px] opacity-60">RUT: {perfil?.rut || '-'}</p>
              </div>
            </div>
            <div className="text-center space-y-1">
              <div className="border-t border-black dark:border-white print:border-black pt-1">
                <p className="text-[0.8em] font-bold uppercase">VISTO BUENO</p>
                <p className="text-[0.8em] font-bold uppercase">TESORERÍA GRUPO</p>
              </div>
            </div>
            <div className="text-center space-y-1">
              <div className="border-t border-black dark:border-white print:border-black pt-1">
                <p className="text-[0.8em] font-bold uppercase">APROBADO POR</p>
                <p className="text-[0.8em] font-bold uppercase">CONSEJO DE GRUPO</p>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones de Sistema */}
        <div className="mt-8 flex justify-center gap-4 no-print">
          <button onClick={() => window.print()} className="px-10 py-3 bg-clr5 text-white font-bold uppercase rounded-xl shadow-lg hover:brightness-110 transition-all text-xs tracking-widest">🖨️ Imprimir Rendición</button>
          <button onClick={onClose} className="px-10 py-3 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white font-bold uppercase rounded-xl hover:brightness-110 transition-all text-xs tracking-widest">Cerrar</button>
        </div>
      </div>

      <style jsx>{`
        @media print {
          .no-print { display: none !important; }
          .fixed { position: absolute !important; top: 0; left: 0; width: 100%; height: auto; background: white !important; padding: 0 !important; }
          body { background: white !important; }
          :global(.dark) .bg-zinc-900 { background-color: white !important; color: black !important; }
          :global(.dark) .border-white { border-color: black !important; }
          :global(.dark) .bg-white\/10, :global(.dark) .bg-white\/5 { background-color: #f4f4f5 !important; color: black !important; }
        }
      `}</style>
    </div>
  )
}
