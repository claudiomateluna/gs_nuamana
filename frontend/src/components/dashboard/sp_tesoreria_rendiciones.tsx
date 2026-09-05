'use client'

import { useState } from 'react'

interface DashRendicionesProps {
  rendiciones: any[]
  isAdmin: boolean
  onNueva: () => void
  onVer: (rend: any) => void
  onDelete: (id: string) => void
}

export default function DashRendiciones({ rendiciones, isAdmin, onNueva, onVer, onDelete }: DashRendicionesProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-[1em]">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black font-display uppercase font-bold text-pclr4 dark:text-pdclr4">Rendiciones de Cuentas (DAF-FOR-03)</h2>
        {isAdmin && (
          <button onClick={onNueva} className="px-6 py-3 bg-pclr6 text-pclr12 uppercase rounded-xl text-[0.8em] font-inika font-bold tracking-widest shadow-lg hover:brightness-110 transition-all">
            ➕ Nueva Rendición
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rendiciones.map(r => (
          <div key={r.id} className="bg-pclr1 dark:bg-pdclr1 p-6 rounded-[2.5rem] border border-pclr13 dark:border-pdclr13 shadow-sm hover:shadow-xl transition-all relative group">
            <div className={`absolute top-4 right-6 px-3 py-1 rounded-full text-[0.8em] font-black uppercase tracking-widest ${
              r.estado === 'Aprobada' ? 'bg-pclr6 text-pclr12 dark:bg-pdclr6 dark:text-pdclr12' : 'bg-pclr5 text-pclr12 dark:bg-pdclr5 dark:text-pdclr12'
            }`}>
              {r.estado}
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-[0.8em] font-black text-pclr6 uppercase tracking-tighter mb-1">{r.unidades?.nombre || '⚜️ GRUPO'}</p>
                <h3 className="text-[1.1em] font-bold uppercase leading-tight text-pclr4 dark:text-pdclr4 line-clamp-2 h-12">{r.motivo}</h3>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[0.8em] border-t border-pclr13 dark:border-pdclr13 pt-4">
                <div>
                  <p className="opacity-40 font-bold uppercase">Total Gastado</p>
                  <p className="font-black text-lg text-pclr4">${r.total_rendicion.toLocaleString('es-CL')}</p>
                </div>
                <div className="text-right">
                  <p className="opacity-40 font-bold uppercase">Saldo</p>
                  <p className={`font-black text-lg ${r.saldo_final >= 0 ? 'text-pclr6' : 'text-pclr4'}`}>
                    ${r.saldo_final.toLocaleString('es-CL')}
                  </p>
                </div>
              </div>

              <div className="text-[0.8em] space-y-1 opacity-60 font-bold uppercase">
                <p>👤 {r.nombre_responsable}</p>
                <p>📅 {new Date(r.fecha).toLocaleDateString('es-CL')}</p>
              </div>

              <div className="flex gap-2 pt-2 border-t border-pclr13 dark:border-pdclr13">
                <button onClick={() => onVer(r)} className="flex-1 py-2 bg-pclr3 dark:bg-pdclr1 rounded-lg text-[0.8em] font-bold uppercase hover:bg-pclr10 hover:text-pclr12 transition-all">Ver Documento</button>
                {isAdmin && (
                  <button onClick={() => onDelete(r.id)} className="px-4 py-2 bg-pclr3 dark:bg-pdclr1 rounded-lg text-[0.8em] font-bold uppercase hover:bg-pclr10 hover:text-pclr12 transition-all">Eliminar</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {rendiciones.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed rounded-[3rem] opacity-40">
          <p className="italic uppercase tracking-widest text-[0.8em]">No hay rendiciones de cuenta registradas.</p>
        </div>
      )}
    </div>
  )
}
