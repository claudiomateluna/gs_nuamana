'use client'

interface DashActasProps {
  actas: any[]
  perfil: any
  onNuevaActa: () => void
  onEditActa: (acta: any) => void
  onSign: (id: string) => void
  onVerActa: (acta: any) => void
  onDelete: (id: string) => void
}

export default function DashActas({ actas, perfil, onNuevaActa, onEditActa, onSign, onVerActa, onDelete }: DashActasProps) {
  const isAdmin = perfil?.rol_id === 1
  const isDirigenteOrGuiadora = [2, 3].includes(perfil?.rol_id || 0)
  const isNNJ = [9, 10, 11, 12, 13].includes(perfil?.rol_id || 0)
  const isDirectivaPadres = [4, 5, 6, 7].includes(perfil?.rol_id || 0)
  const canCreate = isAdmin || isDirigenteOrGuiadora || isNNJ || isDirectivaPadres

  const canDelete = (acta: any) => {
    if (isAdmin) return true
    if (isDirigenteOrGuiadora && acta.tipo === 'Consejo de Unidad' && acta.unidad_id === perfil.unidad_id) return true
    // Agregamos lógica para que directiva de padres borre sus actas si fuera necesario, 
    // pero por ahora mantenemos la restricción solicitada de que apoderados (rol 8) no borran.
    return false
  }

  const canEdit = (acta: any) => {
    if (isAdmin) return true
    if (acta.estado === 'Cerrada') return false
    if (acta.ingresado_por === perfil.id) return true
    if (acta.mi_rol_reunion === 'Tomador de Notas') return true
    return false
  }

  return (
    <div className="space-y-2 animate-in fade-in duration-500 text-[1em]">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black font-display uppercase font-bold text-clr5 dark:text-clr1">Libro de Actas</h2>
        {canCreate && (
          <button 
            onClick={onNuevaActa} 
            className="px-6 py-3 bg-clr6 text-white uppercase rounded-xl text-[0.8em] font-inika font-bold tracking-widest shadow-lg hover:brightness-110 transition-all"
          >
            ➕ Nueva Acta
          </button>
        )}
      </div>

      <div className="grid gap-2">
        {actas.map(a => (
          <div key={a.id} className="p-2 bg-zinc-50 dark:bg-black/20 rounded-3xl flex flex-col md:flex-row justify-between items-center hover:bg-zinc-100 dark:hover:bg-black/30 transition-all group border border-transparent hover:border-clr6/20">
            <div className="flex items-center gap-6 w-full">
              <div className="w-16 h-16 rounded-2xl bg-clr6/10 flex flex-col items-center justify-center shrink-0">
                <span className="text-[0.8em] font-bold uppercase opacity-40">{new Date(a.fecha).toLocaleString('es', { month: 'short' })}</span>
                <span className="text-2xl font-black font-display leading-none">{new Date(a.fecha).getUTCDate()}</span>
              </div>
              <div>
                <p className="text-[0.8em] text-clr6 uppercase tracking-widest font-bold">
                  {a.codigo} • <span className="opacity-60">{a.estado}</span>
                </p>
                <h3 className="uppercase font-bold text-[1.1em]">{a.tipo}</h3>
                <p className="text-[0.8em] opacity-60 font-bold mb-2">
                  📅 {new Date(a.fecha).toLocaleDateString('es-CL', { timeZone: 'UTC' })}
                </p>
                {/* Lista de Temas rápida */}
                {a.acta_temas && a.acta_temas.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {a.acta_temas.map((t: any, idx: number) => (
                      <span key={idx} className="text-[0.8em] bg-zinc-100 dark:bg-black/20 px-2 py-0.5 rounded-md border border-zinc-200 dark:border-clr4 font-bold uppercase opacity-70">
                        {t.titulo}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 shrink-0 mt-4 md:mt-0">
              {a.mi_firma && !a.mi_firma.firmado && (
                <button 
                  onClick={() => onSign(a.id)} 
                  className="px-4 py-2 bg-clr7 text-white rounded-xl text-[0.8em] uppercase font-bold shadow-sm hover:brightness-110 animate-pulse"
                >
                  ✍️ Firmar
                </button>
              )}
              {a.mi_firma?.firmado && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[0.8em] font-bold uppercase flex items-center border border-green-200">
                  ✓ Firmada
                </span>
              )}
              <button 
                onClick={() => onVerActa(a)} 
                className="px-4 py-2 bg-white dark:bg-clr4 rounded-xl shadow-sm border text-[0.8em] uppercase font-bold tracking-widest hover:bg-zinc-100 hover:text-clr4 transition-all"
              >
                📂 Abrir
              </button>
              {canEdit(a) && (
                <button 
                  onClick={() => onEditActa(a)} 
                  className="p-2 bg-white dark:bg-clr4 rounded-xl shadow-sm border border-clr6 text-clr6 hover:bg-clr6 hover:text-white transition-all"
                  title="Editar Planificación/Desarrollo"
                >
                  ✏️
                </button>
              )}
              {canDelete(a) && (
                <button 
                  onClick={() => onDelete(a.id)} 
                  className="p-2 bg-white dark:bg-clr4 rounded-xl shadow-sm border border-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                  title="Eliminar Acta"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        ))}
        {actas.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed rounded-[3rem] opacity-40">
            <p className="italic">No hay actas registradas que coincidan con tu perfil.</p>
          </div>
        )}
      </div>
    </div>
  )
}
