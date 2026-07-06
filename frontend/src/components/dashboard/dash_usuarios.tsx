'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface DashUsuariosProps {
  userPerfil: any
  usuarios: any[]
  onEdit: (perfil: any) => void
  onVer: (perfil: any) => void
  onDelete?: (perfil: any) => void
}

export default function DashUsuarios({ userPerfil, usuarios = [], onEdit, onVer, onDelete }: DashUsuariosProps) {
  const [search, setSearch] = useState('')

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

  const filtered = usuarios.filter(u => 
    `${u.nombres} ${u.apellidos}`.toLowerCase().includes(search.toLowerCase()) ||
    u.rut?.includes(search)
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <h2 className="text-[1.8em] font-black text-clr5 dark:text-clr1 uppercase tracking-tighter">Gestión de Grupo</h2>
        <input 
          type="text" 
          placeholder="🔍 Buscar por nombre o RUT..." 
          className="w-full md:w-96 p-4 rounded-2xl border-2 border-zinc-100 dark:border-white/10 bg-white dark:bg-black/20 outline-none focus:border-clr7 transition-all text-[1em] font-medium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(u => {
          const unitColor = u.unidades?.colores?.primario;
          const unitColor2 = u.unidades?.colores?.secundario;
          const logoUrl = u.unidades?.logo_unidad_url;
          return (
            <div 
              key={u.id} 
              className="p-2 bg-white dark:bg-clr5 rounded-[1.5rem] border-2 shadow-sm hover:shadow-xl transition-all group flex flex-col relative overflow-hidden"
              style={{ borderColor: unitColor2 ? `${unitColor2}50` : 'rgba(244, 244, 245, 0.5)', backgroundColor: unitColor, color: unitColor2 }}
            >
              {logoUrl && (
                <div 
                  className="absolute right-0 top-0 w-28 h-28 opacity-20 pointer-events-none bg-contain bg-no-repeat bg-center mix-blend-luminosity dark:mix-blend-normal transition-transform group-hover:scale-110"
                  style={{ backgroundImage: `url(${logoUrl})` }}
                />
              )}

              <div className="flex items-center gap-5 mb-4 relative z-10">
                <div 
                  className="w-12 h-12 bg-current rounded-full p-1" 
                  style={{ 
                    color: unitColor2 || '#1b1c1d',
                    WebkitMaskImage: 'url(/images/iconos/icono_mi_panel.svg)', 
                    maskImage: 'url(/images/iconos/icono_mi_panel.svg)', 
                    WebkitMaskSize: 'contain', 
                    maskSize: 'contain', 
                    WebkitMaskRepeat: 'no-repeat', 
                    maskRepeat: 'no-repeat', 
                    WebkitMaskPosition: 'center', 
                    maskPosition: 'center' 
                  }}
                />
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-black text-[1.1em] py-[0.5px] px-1 rounded-xl text-clr5 dark:text-clr1 truncate uppercase leading-tight mb-[-4px]" style={{ backgroundColor: unitColor2, color: unitColor }}>
                    {u.nombres}
                  </h3>
                  <p className="font-bold text-[0.9em] text-clr4 dark:text-clr1 truncate uppercase tracking-tight ml-1" style={{ color: unitColor2 }}>{u.apellidos}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4 flex-1 relative z-10">
                <div className="flex justify-between items-center p-2 bg-zinc-50 dark:bg-black/20 rounded-xl" style={{ color: unitColor2 }}>
                  <span className="text-[0.8em] uppercase">Unidad</span>
                  {u.unidades?.nombre ? (
                    <span 
                      className="text-[0.85em] font-black uppercase px-2.5 py-1 rounded-lg text-white tracking-wider"
                      style={{ backgroundColor: unitColor || '#a1a1aa' }}
                    >
                      {u.unidades.nombre}
                    </span>
                  ) : (
                    <span className="text-[0.9em] font-bold text-zinc-400 uppercase">Sin Unidad</span>
                  )}
                </div>
                <div className="flex justify-between items-center p-2 bg-zinc-50 dark:bg-black/20 rounded-xl">
                  <span className="text-[0.8em] uppercase" style={{ color: unitColor2 }}>Rol</span>
                  <span className="text-[0.9em] font-bold text-clr5 dark:text-clr2 uppercase" style={{ color: unitColor2 }}>{u.roles?.name}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-zinc-50 dark:bg-black/20 rounded-xl">
                  <span className="text-[0.8em] uppercase" style={{ color: unitColor2 }}>Edad</span>
                  <span className="text-[0.9em] font-bold text-clr5 dark:text-clr2 uppercase" style={{ color: unitColor2 }}>{calcularEdad(u.fecha_nacimiento)}</span>
                </div>
              </div>

              <div className={`grid ${userPerfil?.rol_id === 1 ? 'grid-cols-3' : 'grid-cols-2'} gap-3 relative z-10`}>
                <button 
                  onClick={() => onVer(u)}
                  className="p-2.5 bg-zinc-100 dark:bg-white/5 text-clr3 dark:text-white rounded-2xl text-[0.8em] font-black uppercase tracking-widest transition-all hover:bg-zinc-200 dark:hover:bg-white/10 text-center"
                >
                  🔎 Ver
                </button>
                <button 
                  onClick={() => onEdit(u)}
                  className="p-2.5 bg-clr7/10 text-clr7 border-1 border-clr7/20 rounded-2xl text-[0.8em] font-bold uppercase tracking-widest transition-all hover:bg-clr7 hover:text-white shadow-sm text-center"
                  style={{ backgroundColor: unitColor, color: unitColor2, borderColor: unitColor2 }}
                >
                  ✎ Editar
                </button>
                {userPerfil?.rol_id === 1 && onDelete && (
                  <button 
                    onClick={() => onDelete(u)}
                    className="p-2.5 bg-red-500/15 text-red-600 border border-red-500/20 rounded-2xl text-[0.8em] font-bold uppercase tracking-widest transition-all hover:bg-red-600 hover:text-white shadow-sm text-center"
                  >
                    🗑 Borrar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}
