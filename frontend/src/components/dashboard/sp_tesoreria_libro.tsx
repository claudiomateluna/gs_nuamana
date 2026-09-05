'use client'

import { useState, useMemo } from 'react'

interface DashTesoreriaProps {
  movimientos: any[]
  unidades: any[]
  isAdmin: boolean // canSee but might not canAction (legacy prop name, keeping for safety)
  canAction: boolean // New specific prop for permissions
  onNuevoMovimiento: () => void
  onEditMovimiento: (mov: any) => void
  onDeleteMovimiento: (id: string) => void
  onEmitirVale: () => void
  onVerMovimiento: (mov: any) => void
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

export default function DashTesoreria({ 
  movimientos = [], 
  unidades = [], 
  isAdmin, 
  canAction,
  onNuevoMovimiento, 
  onEditMovimiento, 
  onDeleteMovimiento, 
  onEmitirVale,
  onVerMovimiento
}: DashTesoreriaProps) {
  const now = new Date()
  const [selectedMes, setSelectedMonth] = useState(now.getMonth() + 1)
  const [selectedAnio, setSelectedAnio] = useState(now.getFullYear())
  const [selectedUnidad, setSelectedUnidad] = useState('todas')

  const añosDisponibles = useMemo(() => {
    const years = new Set(movimientos.map(m => m.anio))
    years.add(new Date().getFullYear())
    years.add(2025)
    return Array.from(years).sort((a, b) => b - a)
  }, [movimientos])

  const filteredMovs = useMemo(() => {
    return movimientos.filter(m => {
      const matchAnio = m.anio === selectedAnio
      const matchMes = selectedMes === 0 || m.mes === selectedMes
      const matchUnidad = selectedUnidad === 'todas' || 
                         (selectedUnidad === 'grupal' ? !m.unidad_id : m.unidad_id === parseInt(selectedUnidad))
      return matchAnio && matchMes && matchUnidad
    }).sort((a, b) => {
      if (a.mes !== b.mes) return a.mes - b.mes
      return a.dia - b.dia
    })
  }, [movimientos, selectedMes, selectedAnio, selectedUnidad])

  const stats = useMemo(() => {
    const ingresos = filteredMovs.reduce((acc, curr) => acc + (curr.monto_ingreso || 0), 0)
    const egresos = filteredMovs.reduce((acc, curr) => acc + (curr.monto_egreso || 0), 0)
    
    const saldoAnterior = movimientos
      .filter(m => {
        const matchUnidad = selectedUnidad === 'todas' || 
                           (selectedUnidad === 'grupal' ? !m.unidad_id : m.unidad_id === parseInt(selectedUnidad))
        const anteriorAlAnio = m.anio < selectedAnio
        const mismoAnioMesAnterior = m.anio === selectedAnio && selectedMes !== 0 && m.mes < selectedMes
        
        return matchUnidad && (anteriorAlAnio || mismoAnioMesAnterior)
      })
      .reduce((acc, curr) => acc + (curr.monto_ingreso || 0) - (curr.monto_egreso || 0), 0)

    return { ingresos, egresos, saldoAnterior, saldoActual: saldoAnterior + ingresos - egresos }
  }, [filteredMovs, movimientos, selectedMes, selectedAnio, selectedUnidad])

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-[1em]">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black font-display uppercase font-bold text-pclr4 dark:text-pdclr4">Libro de Control Financiero</h2>
          <p className="text-[0.8em] font-bold opacity-40 uppercase tracking-widest mt-1">
            {selectedMes === 0 ? `Balance Anual ${selectedAnio}` : `Periodo: ${MESES[selectedMes-1]} ${selectedAnio}`}
          </p>
        </div>
        {canAction && (
          <div className="flex flex-wrap gap-2">
            <button onClick={onEmitirVale} className="px-4 py-2 bg-pclr10 dark:bg-pdclr10 text-pclr12 uppercase rounded-xl text-[0.9em] tracking-widest shadow-lg hover:brightness-110 transition-all">
              🖨️ Emitir Vale Por
            </button>
            <button onClick={onNuevoMovimiento} className="px-4 py-2 bg-pclr6 text-pclr12 uppercase rounded-xl text-[0.9em] tracking-widest shadow-lg hover:brightness-110 transition-all">
              ➕ Registrar Movimiento
            </button>
          </div>
        )}
      </div>

      {/* Widgets de Saldo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-pclr3 dark:bg-pdclr3 p-3 rounded-3xl border border-transparent">
          <p className="text-[0.8em] font-bold uppercase opacity-60 mb-1">Saldo Anterior</p>
          <p className="text-xl font-black text-pclr7">${stats.saldoAnterior.toLocaleString('es-CL')}</p>
        </div>
        <div className="bg-pclr3 dark:bg-pdclr3 p-3 rounded-3xl border border-pclr6 dark:border-pdclr6">
          <p className="text-[0.8em] font-bold uppercase text-pclr6 mb-1">Ingresos {selectedMes === 0 ? 'Año' : 'Mes'}</p>
          <p className="text-xl font-black text-pclr6 dark:text-pdclr6">+ ${stats.ingresos.toLocaleString('es-CL')}</p>
        </div>
        <div className="bg-pclr3 dark:bg-pdclr3 p-3 rounded-3xl border border-pclr5 dark:border-pdclr5">
          <p className="text-[0.8em] font-bold uppercase text-pclr5 dark:text-pdclr5 mb-1">Egresos {selectedMes === 0 ? 'Año' : 'Mes'}</p>
          <p className="text-xl font-black text-pclr5 dark:text-pdclr5">- ${stats.egresos.toLocaleString('es-CL')}</p>
        </div>
        <div className={`p-3 rounded-3xl shadow-xl text-pclr12 transition-all duration-500 ${
          stats.saldoActual >= 0 ? 'bg-pclr6 dark:bg-pdclr6 shadow-clr6' : 'bg-pclr10 dark:bg-pdclr10 shadow-clr4'
        }`}>
          <p className="text-[0.8em] font-bold uppercase opacity-80 mb-1">Saldo Final</p>
          <p className="text-xl font-black">${stats.saldoActual.toLocaleString('es-CL')}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center bg-pclr1 dark:bg-pdclr1 p-2 rounded-2xl border border-pclr13 dark:border-pdclr13">
        <div className="flex items-center gap-2 border-r pr-4">
          <select value={selectedAnio} onChange={e => setSelectedAnio(parseInt(e.target.value))} className="bg-transparent dark:bg-pdclr10 font-black text-pclr6 text-[1em] outline-none">
            {añosDisponibles.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={selectedMes} onChange={e => setSelectedMonth(parseInt(e.target.value))} className="bg-transparent dark:bg-pdclr10 font-bold uppercase text-[0.8em] outline-none">
            <option value={0}>Todo el Año</option>
            {MESES.map((m, i) => <option key={m} value={i + 1}>{m.toUpperCase()}</option>)}
          </select>
        </div>
        
        <div className="flex gap-1 overflow-x-auto scrollbar-hide flex-1">
          <button onClick={() => setSelectedUnidad('todas')} className={`px-4 py-2 rounded-xl text-[0.8em] font-bold uppercase transition-all whitespace-nowrap ${selectedUnidad === 'todas' ? 'bg-pclr10 text-pclr12' : 'opacity-40 hover:opacity-100'}`}>Todo</button>
          <button onClick={() => setSelectedUnidad('grupal')} className={`px-4 py-2 rounded-xl text-[0.8em] font-bold uppercase transition-all whitespace-nowrap ${selectedUnidad === 'grupal' ? 'bg-pclr10 text-pclr12' : 'opacity-40 hover:opacity-100'}`}>⚜️ Grupo</button>
          {unidades?.map(u => (
            <button key={u.id} onClick={() => setSelectedUnidad(u.id.toString())} className={`px-4 py-2 rounded-xl text-[0.8em] font-bold uppercase transition-all whitespace-nowrap ${selectedUnidad === u.id.toString() ? 'bg-pclr10 text-pclr12' : 'opacity-40 hover:opacity-100'}`}>{u.nombre}</button>
          ))}
        </div>
      </div>

      <div className="bg-pclr1 dark:bg-pdclr1 rounded-[2rem] border border-pclr13 dark:border-pdclr13 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-pclr3 dark:bg-pdclr3 text-[0.8em] font-black uppercase tracking-widest text-pclr7">
                <th className="p-4 w-16">Fecha</th>
                <th className="p-4 w-32">Comprobante</th>
                <th className="p-4">Descripción Detallada</th>
                <th className="p-4 text-right">Ingresos</th>
                <th className="p-4 text-right">Egresos</th>
                <th className="p-4 text-center">Gestor</th>
                <th className="p-4 w-10 text-center">Docs</th>
                {canAction && <th className="p-4 w-20 text-center">Acción</th>}
              </tr>
            </thead>
            <tbody className="text-[0.9em]">
              {filteredMovs.map(mov => (
                <tr key={mov.id} className="border-t border-pclr13 dark:border-pdclr13 hover:bg-pclr3 dark:hover:bg-pdclr3 transition-colors group">
                  <td className="p-4 font-black opacity-40 leading-tight">
                    {mov.dia}<br/>
                    <span className="text-[0.8em] uppercase">{MESES[mov.mes-1].slice(0,3)}</span>
                  </td>
                  <td className="p-4 font-bold">
                    <span className={`px-2 py-1 rounded-md text-[0.8em] ${mov.tipo_documento === 'I' ? 'bg-pclr6 text-pclr12 dark:bg-pdclr6 dark:text-pdclr12' : 'bg-pclr10 text-pclr4'}`}>{mov.tipo_documento}</span>
                    <span className="ml-2 opacity-60">#{mov.comprobante_numero || 'S/N'}</span>
                  </td>
                  <td className="p-4">
                    <p className="font-bold uppercase text-[0.85em]">{mov.descripcion}</p>
                    <div className="flex gap-2 items-center mt-1">
                      <p className="text-[0.8em] opacity-40 font-black uppercase">{mov.tesoreria_items?.nombre}</p>
                      {mov.unidades && <span className="text-[0.8em] bg-pclr10 text-pclr4 px-1 rounded font-black">{mov.unidades.nombre}</span>}
                    </div>
                  </td>
                  <td className="p-4 text-right font-bold text-pclr6">{mov.monto_ingreso > 0 ? `$${mov.monto_ingreso.toLocaleString('es-CL')}` : '-'}</td>
                  <td className="p-4 text-right font-bold text-pclr4">{mov.monto_egreso > 0 ? `$${mov.monto_egreso.toLocaleString('es-CL')}` : '-'}</td>
                  <td className="p-4 text-center">
                    <p className="text-[0.8em] font-black uppercase leading-tight">
                      {mov.registrado_por?.nombres?.split(' ')[0]} {mov.registrado_por?.apellidos?.split(' ')[0]}
                    </p>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => onVerMovimiento(mov)} className={`text-xl hover:scale-125 transition-transform ${mov.comprobante_numero?.startsWith('VALE-') || mov.imagen_respaldo_url ? 'opacity-100' : 'opacity-10 pointer-events-none'}`}>📄</button>
                  </td>
                  {canAction && (
                    <td className="p-4 text-center">
                      <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEditMovimiento(mov)} className="p-2 bg-pclr3 dark:bg-pdclr1 rounded-lg hover:bg-pclr6 hover:text-pclr12 transition-all">✏️</button>
                        <button onClick={() => { if (window.confirm('¿Eliminar este registro financiero?')) onDeleteMovimiento(mov.id); }} className="p-2 bg-pclr3 dark:bg-pdclr1 rounded-lg hover:bg-pclr10 hover:text-pclr12 transition-all">🗑️</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMovs.length === 0 && (
          <div className="py-20 text-center opacity-40">
            <p className="italic uppercase tracking-widest text-[0.8em]">No hay registros para este periodo.</p>
          </div>
        )}
      </div>
    </div>
  )
}
