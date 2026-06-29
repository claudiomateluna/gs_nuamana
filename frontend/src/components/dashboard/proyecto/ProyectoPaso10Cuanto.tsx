'use client'

interface ProyectoPaso10CuantoProps {
  actividades: any[]
  presupuestoItems: any[]
  addPresupuestoItem: () => void
  removePresupuestoItem: (idx: number) => void
  updatePresupuestoItem: (idx: number, field: string, val: any) => void
  totalIngresos: number
  totalGastos: number
  balance: number
  themePrimary: string
  themeSecondary: string
}

export default function ProyectoPaso10Cuanto({
  actividades,
  presupuestoItems,
  addPresupuestoItem,
  removePresupuestoItem,
  updatePresupuestoItem,
  totalIngresos,
  totalGastos,
  balance,
  themePrimary,
  themeSecondary
}: ProyectoPaso10CuantoProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 p-2 opacity-60 rounded-[0.8rem]" style={{ backgroundColor: themePrimary }}>
        <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[0.9em] font-bold" style={{ color: themeSecondary }}>10</span>
        <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-white" style={{ color: themeSecondary }}>¿Cuánto?</h3>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 min-h-[420px] p-1 font-body">
        {/* Left Column (Desktop) / Top Row (Mobile) */}
        <div className="w-full flex items-center justify-center lg:items-end lg:justify-start">
          <img 
            src="/images/proyectos/Cuanto2.svg" 
            alt="Ilustración Paso 10" 
            className="block lg:hidden w-full max-h-[160px] object-contain mb-2"
          />
          <img 
            src="/images/proyectos/Cuanto.svg" 
            alt="Ilustración Paso 10" 
            className="hidden lg:block w-full max-h-[500px] object-contain"
          />
        </div>

        {/* Right Column (Desktop) / Bottom Row (Mobile) */}
        <div className="w-full space-y-2 bg-zinc-50/30 dark:bg-zinc-900/30 p-1 rounded-[1rem] border border-zinc-150 dark:border-white/5 backdrop-blur-xs shadow-md">
          <div className="flex justify-end p-1">
            <button 
              type="button" 
              onClick={addPresupuestoItem}
              className="px-2 py-1.5 rounded-xl text-[0.8em] font-black uppercase hover:brightness-110 shadow-sm border-none animate-in fade-in"
              style={{ backgroundColor: themePrimary, color: themeSecondary }}
            >
              ➕ Agregar Ítem
            </button>
          </div>

          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {presupuestoItems.map((item, idx) => (
              <div key={idx} className="p-2 bg-white dark:bg-zinc-800 border dark:border-white/10 rounded-xl space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[0.8em] font-black uppercase text-zinc-400">Presupuesto Ítem #{idx + 1}</span>
                  <button 
                    type="button" 
                    onClick={() => removePresupuestoItem(idx)}
                    className="text-red-500 font-bold text-[0.8em] px-2 py-0.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl border-none bg-transparent"
                  >
                    ✕ Quitar
                  </button>
                </div>

                <input 
                  type="text" 
                  value={item.descripcion || ''}
                  onChange={e => updatePresupuestoItem(idx, 'descripcion', e.target.value)}
                  placeholder="Descripción / Material"
                  className="w-full p-2 rounded-lg border dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 text-[0.9em] font-bold"
                />

                <div className="flex flex-col sm:flex-row gap-1.5">
                  <label className="text-[0.8em] font-bold uppercase px-2 py-0.4 rounded-[0.4rem] flex items-center" style={{ backgroundColor: themePrimary, color: themeSecondary }}>Cantidad</label>
                  <input 
                    type="number" 
                    value={item.cantidad || 0}
                    onChange={e => updatePresupuestoItem(idx, 'cantidad', parseInt(e.target.value) || 0)}
                    placeholder="Cant."
                    className="w-full sm:w-1/2 p-2 rounded-lg border dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 text-[0.85em] font-bold text-center"
                  />
                  <label className="text-[0.8em] font-bold uppercase px-2 py-0.4 rounded-[0.4rem] flex items-center leading-none" style={{ backgroundColor: themePrimary, color: themeSecondary }}>Costo Unitario</label> 
                  <input 
                    type="number" 
                    value={item.costo_unitario || 0}
                    onChange={e => updatePresupuestoItem(idx, 'costo_unitario', parseInt(e.target.value) || 0)}
                    placeholder="$ Unitario"
                    className="w-full sm:w-1/2 p-2 rounded-lg border dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 text-[0.85em] font-bold text-center"
                  />
                </div>

                <div className="grid grid-cols-1 gap-1.5">
                  <select 
                    value={item.tipo || 'gasto'}
                    onChange={e => updatePresupuestoItem(idx, 'tipo', e.target.value)}
                    className="w-full p-2 rounded-lg border dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 text-[0.8em] font-black uppercase"
                  >
                    <option value="gasto">📉 Gasto / Compra</option>
                    <option value="ingreso">📈 Ingreso / Aporte</option>
                  </select>

                  {item.tipo === 'gasto' ? (
                    <select 
                      value={item.fuente || 'compra'}
                      onChange={e => updatePresupuestoItem(idx, 'fuente', e.target.value)}
                      className="w-full p-2 rounded-lg border dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 text-[0.8em] font-black uppercase"
                    >
                      <option value="compra">Compra Directa</option>
                      <option value="donacion">Donación / Reciclado</option>
                    </select>
                  ) : (
                    <select 
                      value={item.fuente || 'ingreso_propio'}
                      onChange={e => updatePresupuestoItem(idx, 'fuente', e.target.value)}
                      className="w-full p-2 rounded-lg border dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 text-[0.8em] font-black uppercase"
                    >
                      <option value="ingreso_propio">Ingreso Propio</option>
                      <option value="donacion">Aporte Terceros</option>
                    </select>
                  )}

                  <select 
                    value={item.actividad_nombre || ''}
                    onChange={e => updatePresupuestoItem(idx, 'actividad_nombre', e.target.value)}
                    className="w-full p-2 rounded-lg border dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 text-[0.8em] font-bold"
                  >
                    <option value="">-- Asociar Actividad --</option>
                    {actividades.map(act => (
                      <option key={act.id} value={act.nombre}>{act.nombre || '(Sin nombre)'}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Balance General */}
          <div className="bg-white dark:bg-zinc-800 p-2 rounded-2xl border dark:border-white/10 flex flex-col gap-1">
            <div className="text-[0.8em] font-bold uppercase opacity-80 space-y-0.5">
              <p>Ingresos: <span className="text-green-500">${totalIngresos.toLocaleString()}</span></p>
              <p>Gastos: <span className="text-red-500">${totalGastos.toLocaleString()}</span></p>
            </div>
            <div className="border-t pt-1 dark:border-white/5 flex justify-between items-center">
              <span className="text-[0.8em] font-black uppercase text-zinc-400">Balance</span>
              <p className={`text-lg font-black ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ${balance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
