'use client'

import { useState } from 'react'

interface DashUnidadProps {
  perfil: any
  miembros: any[]
  actividades: any[]
  autorizaciones: any[]
  onVerFicha: (miembro: any) => void
  onEdit: (miembro: any) => void
  onVerAutorizacion: (auth: any, profile: any) => void
}

export default function DashUnidad({ 
  perfil, miembros, actividades, autorizaciones, 
  onVerFicha, onEdit, onVerAutorizacion 
}: DashUnidadProps) {
  const [selectedActId, setSelectedActId] = useState<string>('')

  const calcularEdad = (fechaNacimiento: string | null) => {
    if (!fechaNacimiento) return 'S/I';
    const hoy = new Date();
    const cumpleanos = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    const m = hoy.getMonth() - cumpleanos.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
    }
    return `${edad} años`;
  }

  // Filtrar autorizaciones de la actividad seleccionada
  const authsDeActividad = autorizaciones.filter(a => a.actividad_id === selectedActId)
  const idsFirmados = new Set(authsDeActividad.map(a => a.perfil_id))

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end border-b pb-6 gap-4 text-[1em]">
        <div>
          <h2 className="text-2xl font-bold font-display uppercase text-clr5 dark:text-clr1 font-bold">Nómina {perfil?.unidades?.nombre}</h2>
          <p className="text-[0.8em] text-clr7 uppercase font-bold tracking-wider">Total: {miembros.length} Miembros</p>
        </div>
        
        {/* CONTROL DE SALIDAS */}
        <div className="flex flex-col items-end gap-2">
          <label className="text-[0.8em] font-black uppercase opacity-40">Control de Autorizaciones</label>
          <select 
            value={selectedActId} 
            onChange={(e) => setSelectedActId(e.target.value)}
            className="p-2 bg-zinc-100 dark:bg-clr4 border rounded-xl text-[0.8em] font-bold uppercase outline-none"
          >
            <option value="">-- Seleccionar Actividad --</option>
            {actividades.map(act => (
              <option key={act.id} value={act.id}>{act.nombre} ({new Date(act.fecha_inicio).toLocaleDateString('es-CL')})</option>
            ))}
          </select>
        </div>
      </div>

      {selectedActId && (
        <div className="bg-clr6/5 p-4 rounded-3xl border border-clr6/20 flex justify-between items-center">
          <p className="text-[0.8em] font-black uppercase text-clr6">
            Estado de Firmas: {idsFirmados.size} de {miembros.length} completadas
          </p>
          <div className="flex gap-2">
             <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-full"></div><span className="text-[0.8em] font-bold opacity-60">FIRMADO</span></div>
             <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-full"></div><span className="text-[0.8em] font-bold opacity-60">PENDIENTE</span></div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {miembros.map(m => {
          const yaFirmo = idsFirmados.has(m.id)
          const authRecord = authsDeActividad.find(a => a.perfil_id === m.id)

          return (
            <div key={m.id} className="p-6 bg-zinc-50 dark:bg-black/20 rounded-[2.5rem] border border-transparent hover:border-clr7/20 transition-all relative overflow-hidden group shadow-sm hover:shadow-md">
              {m.alergias && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-[0.8em] font-bold px-3 py-1 uppercase rounded-bl-xl tracking-tighter shadow-md">⚠️ Salud</div>
              )}
              
              {selectedActId && (
                <div className={`absolute top-0 left-0 w-2 h-full ${yaFirmo ? 'bg-green-500' : 'bg-red-500'}`} title={yaFirmo ? 'Autorizado' : 'Pendiente'}></div>
              )}

              <p className="font-bold text-clr5 dark:text-clr1 uppercase text-[0.9em] mb-1">{m.nombres} {m.apellidos}</p>
              <div className="flex justify-between items-center mb-4">
                <p className="text-[0.8em] font-bold text-clr7 uppercase tracking-wider opacity-60">{m.roles?.name}</p>
                {yaFirmo && (
                  <button 
                    onClick={() => onVerAutorizacion(authRecord, m)}
                    className="text-[0.8em] font-black text-green-600 hover:underline uppercase"
                  >
                    Ver Autorización 📋
                  </button>
                )}
              </div>
              
              <div className="space-y-2 mb-6 text-[0.9em]">
                <div className="flex justify-between uppercase"><span className="opacity-40">RUT:</span><span className="font-bold">{m.rut}</span></div>
                <div className="flex justify-between uppercase"><span className="opacity-40">Tel:</span><span className="font-bold">{m.telefono || 'S/I'}</span></div>
                <div className="flex justify-between uppercase"><span className="opacity-40">Edad:</span><span className="font-bold">{calcularEdad(m.fecha_nacimiento)}</span></div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => onVerFicha(m)}
                  className="flex-1 py-3 bg-white dark:bg-clr4 text-clr2 font-bold uppercase text-[0.8em] rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-100 transition-all tracking-widest"
                >
                  🔍 Ver Ficha
                </button>
                <button 
                  onClick={() => onEdit(m)}
                  className="flex-1 py-3 bg-clr6 text-white font-bold uppercase text-[0.8em] rounded-xl shadow-sm hover:brightness-110 transition-all tracking-widest"
                >
                  ✏️ Editar
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
