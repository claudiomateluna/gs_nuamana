'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { TesoreriaMovimiento } from '@/types'

interface ComprobanteData {
  id: string
  tipo: string
  pagado_recibido_nombre: string
  suma_palabras: string
  fecha: string
  forma_pago: string
  numero_documento: string
  folio: number
  tesoreria_comprobante_detalles?: Array<{
    descripcion: string
    valor: number
    tesoreria_items?: { codigo: string }
  }>
  hecho_por?: { nombres: string; apellidos: string; rut: string }
  visto_bueno_por?: { nombres: string; apellidos: string }
}

interface DashModTesoreriaVerProps {
  isOpen: boolean
  onClose: () => void
  data: any
}

export default function DashModTesoreriaVer({ isOpen, onClose, data }: DashModTesoreriaVerProps) {        
  const [comprobante, setComprobante] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchFullData = async () => {
      if (!data) return
      setLoading(true)
      if (data.comprobante_numero?.startsWith('VALE-')) {
        const folio = parseInt(data.comprobante_numero.split('-')[1])
        const { data: comp } = await supabase
          .from('tesoreria_comprobantes')
          .select('*, tesoreria_comprobante_detalles(*, tesoreria_items(*)), hecho_por:perfiles!tesoreria_comprobantes_hecho_por_fkey(nombres, apellidos, rut), visto_bueno_por:perfiles!tesoreria_comprobantes_visto_bueno_por_fkey(nombres, apellidos)')
          .eq('folio', folio)
          .single()
        setComprobante(comp)
      } else {
        setComprobante(null)
      }
      setLoading(false)
    }
    if (isOpen) fetchFullData()
  }, [data, isOpen])

  if (!isOpen || !data) return null

  return (
    <div className="fixed inset-0 bg-pclr2 backdrop-blur-sm z-[130] flex items-center justify-center p-2 md:p-4 overflow-y-auto font-quicksand">
      <div className="font-quicksand bg-pclr1 dark:bg-pdclr1 text-pclr4 dark:text-pdclr4 w-full max-w-4xl p-4 md:p-8 shadow-2xl font-sans border-[1px] border-pclr2 dark:border-pdclr2 my-auto print:bg-pclr1 print:text-pclr4 print:border-pclr2 print:p-0">

        {loading ? (
          <div className="py-20 text-center animate-pulse font-bold uppercase tracking-widest">Cargando Documento Institucional...</div>
        ) : comprobante ? (
          /* VISTA DE VALE INSTITUCIONAL (DAF-FOR-05/06) */
          <div className="font-quicksand space-y-0 border-[1.5px] border-pclr2 dark:border-pdclr2 p-4 print:border-pclr2 rounded-[1rem]">
            {/* CABECERA OFICIAL NUA MANA */}
            <div className="flex justify-between items-start border-b-[1.5px] border-pclr2 dark:border-pdclr2 pb-4 mb-4 print:border-pclr2">
              <div className="flex items-center gap-4">
                <img src="/images/logos/LogoColor.svg" alt="Logo" className="w-16 h-16 object-contain" /> 
                <div className="text-[0.8em] leading-tight font-bold uppercase dark:text-pdclr4 print:text-pclr4">
                  <p>CENTRO JUVENIL CULTURAL DE OUTDOOR NUA MANA</p>
                  <p>R.U.T.: 65.015.731-1</p>
                  <p>Dirección: Bahía Catalina 11781</p>
                  <p>Teléfono: +56 9 6689 6001</p>
                </div>
              </div>
              <div className="text-right">
                <div className="border-[1.5px] border-pclr2 dark:border-pdclr2 p-2 min-w-[200px] text-center mb-1 rounded-[0.5em] print:border-pclr2">
                  <p className="text-[1em] font-bold uppercase text-dclr2 print:text-pclr4">COMPROBANTE DE {comprobante.tipo.toUpperCase()}</p>
                </div>
                <div className="text-[0.8em] font-bold uppercase flex justify-end gap-4 mr-2 dark:text-pdclr4 print:text-pclr4">
                  <span>Rev 3</span>
                  <span>03-11-2021</span>
                  <span className="border-l border-pclr2 dark:border-pdclr2 pl-2 print:border-pclr2">FOLIO: {comprobante.folio}</span>
                </div>
              </div>
            </div>

            {/* CUERPO DEL VALE */}
            <div className="grid grid-cols-12 border-b-[1.5px] border-pclr2 dark:border-pdclr2 mt-[-14px] mb-4 print:border-pclr2 dark:text-pdclr4 print:text-pclr4">
              <div className="col-span-9 p-2 border-r-[1.5px] border-pclr2 dark:border-pdclr2 print:border-pclr2">
                <p className="text-[0.8em] font-bold uppercase mb-1">{comprobante.tipo === 'Egreso' ? 'PAGADO A:' : 'RECIBIDO DE:'}</p>
                <p className="text-[0.9em] font-bold uppercase">{comprobante.pagado_recibido_nombre}</p> 
              </div>
              <div className="col-span-3 p-2">
                <p className="text-[0.8em] font-bold uppercase mb-1">FECHA:</p>
                <p className="text-[0.9em] font-bold">{new Date(comprobante.fecha).toLocaleDateString('es-CL')}</p>
              </div>
            </div>

            <div className="p-2 mt-[-10px] border-b-[1.5px] border-pclr2 dark:border-pdclr2 mb-4 print:border-pclr2 dark:text-pdclr4 print:text-pclr4">
              <p className="text-[0.8em] font-bold uppercase mb-1">LA SUMA DE:</p>
              <p className="text-[0.9em] font-bold italic uppercase pb-1">{comprobante.suma_palabras}</p> 
            </div>

            {/* TABLA DE DETALLES */}
            <table className="w-full border-collapse border-[1.5px] border-pclr2 dark:border-pdclr2 mb-4 text-[0.9em] print:border-pclr2">
              <thead>
                <tr className="bg-pclr3 dark:bg-pdclr3 uppercase font-bold print:bg-pclr3">
                  <th className="border-[1.5px] border-pclr2 dark:border-pdclr2 p-1 w-20 print:border-pclr2">ITEM</th>
                  <th className="border-[1.5px] border-pclr2 dark:border-pdclr2 p-1 print:border-pclr2">POR CONCEPTO DE:</th>
                  <th className="border-[1.5px] border-pclr2 dark:border-pdclr2 p-1 w-32 text-right print:border-pclr2">VALOR</th>
                </tr>
              </thead>
              <tbody>
                {[0, 1, 2, 3].map((idx) => {
                  const det = comprobante.tesoreria_comprobante_detalles?.[idx]
                  return (
                    <tr key={idx} className="h-8 uppercase font-bold">
                      <td className="border-[1.5px] border-pclr2 dark:border-pdclr2 p-1 text-center print:border-pclr2">{det?.tesoreria_items?.codigo || ''}</td>
                      <td className="border-[1.5px] border-pclr2 dark:border-pdclr2 p-1 print:border-pclr2">{det?.descripcion || ''}</td>
                      <td className="border-[1.5px] border-pclr2 dark:border-pdclr2 p-1 text-right print:border-pclr2">{det ? `$${det.valor.toLocaleString('es-CL')}` : ''}</td>
                    </tr>
                  )
                })}
                <tr className="h-10 bg-pclr3 dark:bg-pdclr3 font-bold print:bg-pclr3">
                  <td colSpan={2} className="border-[1.5px] border-pclr2 dark:border-pdclr2 p-2 text-right uppercase print:border-pclr2">Nombre de la Estructura: NUA MANA • TOTAL</td>
                  <td className="border-[1.5px] border-pclr2 dark:border-pdclr2 p-2 text-right text-lg print:border-pclr2">
                    ${(data.monto_ingreso || data.monto_egreso).toLocaleString('es-CL')}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* FIRMAS Y FORMA DE PAGO */}
            <div className="grid grid-cols-12 border-[1.5px] border-pclr2 dark:border-pdclr2 print:border-pclr2">
              <div className="col-span-4 p-2 border-r-[1.5px] border-pclr2 dark:border-pdclr2 border-b-[1.5px] print:border-pclr2">
                <p className="text-[0.8em] font-bold uppercase mb-2">FORMA DE PAGO</p>
                <div className="grid grid-cols-2 gap-1 text-[0.8em] font-bold">
                  <div className="flex items-center gap-1">
                    <div className={`w-3 h-3 border border-pclr2 dark:border-pdclr2 print:border-pclr2 ${comprobante.forma_pago === 'Transferencia' ? 'bg-pclr2 dark:bg-pdclr1 print:bg-pclr2' : ''}`}></div>
                    <span>TRANSF.</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-3 h-3 border border-pclr2 dark:border-pdclr2 print:border-pclr2 ${comprobante.forma_pago === 'Depósito' ? 'bg-pclr2 dark:bg-pdclr1 print:bg-pclr2' : ''}`}></div>
                    <span>DEPÓSITO</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-3 h-3 border border-pclr2 dark:border-pdclr2 print:border-pclr2 ${comprobante.forma_pago === 'Documento' ? 'bg-pclr2 dark:bg-pdclr1 print:bg-pclr2' : ''}`}></div>
                    <span>DOC.</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-3 h-3 border border-pclr2 dark:border-pdclr2 print:border-pclr2 ${comprobante.forma_pago === 'Efectivo' ? 'bg-pclr2 dark:bg-pdclr1 print:bg-pclr2' : ''}`}></div>
                    <span>EFECTIVO</span>
                  </div>
                </div>
                {comprobante.numero_documento && <p className="text-[8px] mt-2 opacity-60">REF: {comprobante.numero_documento}</p>}
              </div>
              <div className="col-span-4 p-2 border-r-[1.5px] border-pclr2 dark:border-pdclr2 border-b-[1.5px] text-center print:border-pclr2">
                <p className="text-[0.9em] font-bold uppercase mb-8">HECHO POR</p>
                <div className="border-t border-pclr2 dark:border-pdclr2 pt-1 print:border-pclr2">
                  <p className="text-[0.8em] font-bold uppercase">{comprobante.hecho_por?.nombres} {comprobante.hecho_por?.apellidos}</p>
                  <p className="text-[0.8em] font-bold opacity-70">RUT: {comprobante.hecho_por?.rut}</p>    
                </div>
              </div>
              <div className="col-span-4 p-2 border-b-[1.5px] border-pclr2 dark:border-pdclr2 text-center relative overflow-hidden print:border-pclr2">
                <div className="absolute inset-0 flex items-center justify-center opacity-10 dark:opacity-20 rotate-12 text-pclr6 font-bold text-2xl pointer-events-none">APROBADO</div>
                <p className="text-[0.9em] font-bold uppercase mb-8">VISTO BUENO</p>
                <p className="text-[0.8em] font-bold uppercase border-t border-pclr2 dark:border-pdclr2 pt-1 print:border-pclr2">CONSEJO DE GRUPO</p>
              </div>

              <div className="col-span-12 p-2 text-center h-20 flex flex-col justify-end">
                <p className="text-[0.8em] font-bold uppercase border-t border-pclr2 dark:border-pdclr2 pt-1 w-64 mx-auto print:border-pclr2">FIRMA RECEPTOR</p>
              </div>
            </div>
          </div>
        ) : (
          /* VISTA DE MOVIMIENTO GENÉRICO (Boleta/Factura) con Modo Oscuro */
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b-2 border-pclr2 dark:border-pdclr2 pb-4 print:border-pclr2">
              <h2 className="text-2xl font-bold uppercase">Registro de Movimiento</h2>
              <span className="text-xl font-bold">{data.tipo_documento === 'B' ? 'BOLETA' : 'FACTURA'} #{data.comprobante_numero || 'S/N'}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase opacity-40">Descripción</p>
                  <p className="text-lg font-bold uppercase">{data.descripcion}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase opacity-40">Ítem Presupuestario</p>
                  <p className="text-md font-bold uppercase text-pclr6">{data.tesoreria_items?.nombre}</p> 
                </div>
              </div>
              <div className="bg-pclr3 dark:bg-pdclr3 p-6 border-2 border-pclr2 dark:border-pdclr2 rounded-3xl text-right print:bg-pclr3 print:border-pclr2">
                <p className="text-xs font-bold uppercase opacity-40">Monto Total</p>
                <p className={`text-4xl font-bold ${data.monto_ingreso > 0 ? 'text-pclr6' : 'text-pclr4'}`}>
                  ${(data.monto_ingreso || data.monto_egreso).toLocaleString('es-CL')}
                </p>
                <p className="text-xs font-bold mt-2 opacity-60 uppercase">REGISTRADO EL {new Date(data.fecha_completa).toLocaleDateString('es-CL')}</p>
              </div>
            </div>
            {data.imagen_respaldo_url && (
              <div className="border-2 border-pclr2 dark:border-pdclr2 p-2 rounded-3xl overflow-hidden print:border-pclr2">
                <img src={data.imagen_respaldo_url} className="w-full h-auto max-h-[500px] object-contain" alt="Respaldo" />
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex justify-center gap-4 no-print">
          <button onClick={() => window.print()} className="px-8 py-3 bg-pclr10 text-pclr12 font-bold uppercase rounded-xl shadow-lg hover:brightness-110 transition-all text-xs tracking-widest">🖨️ Imprimir</button>
          <button onClick={onClose} className="px-8 py-3 bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 font-bold uppercase rounded-xl hover:brightness-110 transition-all text-xs tracking-widest">Cerrar</button>
        </div>
      </div>

      <style jsx>{`
        @media print {
          .no-print { display: none !important; }
          .fixed { position: absolute !important; top: 0; left: 0; width: 100%; height: auto; background: white !important; padding: 0 !important; }
          .bg-pclr2\/80 { background: white !important; }
          /* Forzar modo claro en impresión */
          :global(.dark) .bg-pclr2 { background-color: white !important; color: black !important; }    
          :global(.dark) .border-pclr1 { border-color: black !important; }
          :global(.dark) .bg-pclr1\/10 { background-color: #f4f4f5 !important; }
          :global(.dark) .bg-pclr1\/5 { background-color: #fafafa !important; }
        }
      `}</style>
    </div>
  )
}
