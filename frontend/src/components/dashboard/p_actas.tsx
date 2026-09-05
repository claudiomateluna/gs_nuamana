'use client'

import { isAdmin as checkAdmin, isDirigenteOrGuiadora as checkDirigente, isNNJ as checkNNJ, isDirectivaPadres as checkDirectivaPadres } from '@/lib/roles'
import type { Acta, Perfil } from '@/types'

interface DashActasProps {
  actas: Acta[]
  perfil: Perfil
  onNuevaActa: () => void
  onEditActa: (acta: Acta) => void
  onSign: (id: string) => void
  onVerActa: (acta: Acta) => void
  onDelete: (id: string) => void
}

export default function DashActas({ actas, perfil, onNuevaActa, onEditActa, onSign, onVerActa, onDelete }: DashActasProps) {
  const canCreate = checkAdmin(perfil) || checkDirigente(perfil) || checkNNJ(perfil) || checkDirectivaPadres(perfil)

  const canDelete = (acta: Acta) => {
    if (checkAdmin(perfil)) return true
    if (checkDirigente(perfil) && acta.tipo === 'Consejo de Unidad' && acta.unidad_id === perfil.unidad_id) return true
    return false
  }

  const canEdit = (acta: Acta) => {
    if (checkAdmin(perfil)) return true
    if (acta.estado === 'Cerrada') return false
    if (acta.ingresado_por === perfil.id) return true
    if (acta.mi_rol_reunion === 'Tomador de Notas') return true
    return false
  }

  return (
    <div className="space-y-2 animate-in fade-in duration-500 text-[1em]">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black font-display uppercase font-bold text-clr4 dark:text-dclr4">Libro de Actas</h2>
        {canCreate && (
          <button 
            onClick={onNuevaActa} 
            className="px-6 py-3 bg-clr6 text-clr1 uppercase rounded-xl text-[0.8em] font-inika font-bold tracking-widest shadow-lg hover:brightness-110 transition-all"
          >
            ➕ Nueva Acta
          </button>
        )}
      </div>

      <div className="grid gap-2">
        {actas.map(a => (
          <div key={a.id} className="p-2 bg-clr7 dark:bg-dclr7 rounded-3xl flex flex-col md:flex-row justify-between items-center hover:bg-clr7 dark:hover:bg-dclr1 transition-all group border border-transparent hover:border-clr6">
            <div className="flex items-center gap-6 w-full">
              <div className="w-16 h-16 rounded-2xl bg-clr6 flex flex-col items-center justify-center shrink-0">
                <span className="text-[0.8em] font-bold uppercase opacity-40">{new Date(a.fecha).toLocaleString('es', { month: 'short' })}</span>
                <span className="text-2xl font-black font-display leading-none">{new Date(a.fecha).getUTCDate()}</span>
              </div>
              <div>
                <p className="text-[0.8em] text-clr6 uppercase tracking-widest font-bold flex items-center gap-2">
                  {a.isPending ? (
                    <span className="bg-clr5 text-clr1 px-2 py-0.5 rounded-lg text-[0.8em] font-extrabold animate-pulse">PENDIENTE DE SINCRONIZACIÓN</span>
                  ) : (
                    <>{a.codigo} • <span className="opacity-60">{a.estado}</span></>
                  )}
                </p>
                <h3 className="uppercase font-bold text-[1.1em]">{a.tipo}</h3>
                <p className="text-[0.8em] opacity-60 font-bold mb-2">
                  📅 {new Date(a.fecha).toLocaleDateString('es-CL', { timeZone: 'UTC' })}
                </p>
                {a.acta_temas && a.acta_temas.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {a.acta_temas.map((t: any, idx: number) => (
                      <span key={idx} className="text-[0.8em] bg-clr7 dark:bg-dclr7 px-2 py-0.5 rounded-md border border-clr7 dark:border-dclr7 font-bold uppercase opacity-70">
                        {t.titulo}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 shrink-0 mt-4 md:mt-0">
              {a.isPending ? (
                <span className="text-[0.8em] font-bold uppercase opacity-55 px-3 py-2 bg-clr5 text-clr5 dark:text-dclr5 rounded-xl border border-clr5">
                  💾 Guardado Offline
                </span>
              ) : (
                <>
                  {a.mi_firma && !a.mi_firma.firmado && (
                    <button 
                      onClick={() => onSign(a.id)} 
                      className="px-4 py-2 bg-clr4 text-clr1 rounded-xl text-[0.8em] uppercase font-bold shadow-sm hover:brightness-110 animate-pulse"
                    >
                      ✍️ Firmar
                    </button>
                  )}
                  {a.mi_firma?.firmado && (
                    <span className="px-3 py-1 bg-clr6 text-clr6 rounded-full text-[0.8em] font-bold uppercase flex items-center border border-clr6">
                      ✓ Firmada
                    </span>
                  )}
                  <button 
                    onClick={() => onVerActa(a)} 
                    className="px-4 py-2 bg-clr1 dark:bg-dclr1 rounded-xl shadow-sm border text-[0.8em] uppercase font-bold tracking-widest hover:bg-clr7 hover:text-clr2 transition-all"
                  >
                    📂 Abrir
                  </button>
                  {canEdit(a) && (
                    <button 
                      onClick={() => onEditActa(a)} 
                      className="p-2 bg-clr1 dark:bg-dclr1 rounded-xl shadow-sm border border-clr6 text-clr6 hover:bg-clr6 hover:text-clr1 transition-all"
                      title="Editar Planificación/Desarrollo"
                    >
                      ✏️
                    </button>
                  )}
                  {canDelete(a) && (
                    <button 
                      onClick={() => { if (window.confirm('¿Eliminar esta acta? Esta acción no se puede deshacer.')) onDelete(a.id); }}
                      className="p-2 bg-clr1 dark:bg-dclr1 rounded-xl shadow-sm border border-clr4 text-clr4 hover:bg-clr4 hover:text-clr1 transition-all"
                      title="Eliminar Acta"
                    >
                      🗑️
                    </button>
                  )}
                </>
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
