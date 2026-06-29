'use client'

interface DashGrupoProps {
  miembros: any[]
  onVerFicha: (miembro: any) => void
  onEdit: (miembro: any) => void
}

export default function DashGrupo({ miembros, onVerFicha, onEdit }: DashGrupoProps) {
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b pb-6 gap-4 text-[1em]">
        <div>
          <h2 className="text-2xl font-bold font-display uppercase text-clr5 dark:text-clr1 font-bold">Miembros del Grupo</h2>
          <p className="text-[0.8em] text-clr7 uppercase font-bold tracking-widest">{miembros.length} Usuarios Registrados</p>
        </div>
        <button className="p-2 bg-zinc-100 dark:bg-black/20 text-clr2 rounded-xl text-[0.8em] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all border shadow-sm">📥 Exportar Listado</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {miembros.map(m => (
          <div key={m.id} className="p-2 bg-zinc-50 dark:bg-black/20 rounded-[2.5rem] border border-transparent hover:border-clr7/20 transition-all group relative shadow-sm hover:shadow-md">
            {m.alergias && (
              <div className="absolute top-0 right-0 bg-red-500 text-white text-[0.8em] font-bold px-3 py-1 uppercase rounded-bl-xl tracking-tighter shadow-md">⚠️ Salud</div>
            )}
            <p className="font-bold text-clr5 dark:text-clr1 uppercase text-[0.9em] mb-1">{m.nombres} {m.apellidos}</p>
            <p className="text-[0.8em] font-bold text-clr7 uppercase tracking-wider mb-1 opacity-60">
              {m.roles?.name} • {m.unidades?.nombre || 'S/U'}
            </p>
            <p className="text-[0.8em] font-bold text-clr2 uppercase tracking-widest mb-4 opacity-80">
              Edad: {calcularEdad(m.fecha_nacimiento)}
            </p>
            
            <div className="space-y-2 mb-6 text-[0.9em]">
              <div className="flex justify-between uppercase"><span className="opacity-40">RUT:</span><span className="font-bold">{m.rut}</span></div>
              <div className="flex justify-between uppercase"><span className="opacity-40">Tel:</span><span className="font-bold">{m.telefono || 'S/I'}</span></div>
              <div className="flex justify-between uppercase"><span className="opacity-40">Sangre:</span><span className={`font-bold ${m.tipo_sangre?.includes('O-') ? 'text-red-600' : ''}`}>{m.tipo_sangre || 'S/I'}</span></div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => onVerFicha(m)}
                className="flex-1 py-3 bg-white dark:bg-clr4 text-clr2 font-bold uppercase text-[0.8em] rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-100 transition-all tracking-widest"
              >
                🔍 Ver
              </button>
              <button 
                onClick={() => onEdit(m)}
                className="flex-1 py-3 bg-clr6 text-white font-bold uppercase text-[0.8em] rounded-xl shadow-sm hover:brightness-110 transition-all tracking-widest"
              >
                ✏️ Editar
              </button>
            </div>
          </div>
        ))}
        {miembros.length === 0 && (
          <div className="col-span-full p-20 text-center border-2 border-dashed rounded-[3rem] opacity-40">
            <p className="text-[1em] italic">No hay otros miembros registrados en el grupo.</p>
          </div>
        )}
      </div>
    </div>
  )
}
