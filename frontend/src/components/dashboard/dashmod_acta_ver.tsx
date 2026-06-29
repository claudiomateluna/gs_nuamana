'use client'

interface DashModActaVerProps {
  isOpen: boolean
  onClose: () => void
  acta: any
}

export default function DashModActaVer({ isOpen, onClose, acta }: DashModActaVerProps) {
  if (!isOpen || !acta) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-2 xs:p-1 sm:p-2 md:p-3 lg:p-4 animate-in zoom-in-95 duration-300 text-[1em]">
      <div className="bg-white dark:bg-clr5 w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg rounded-[1em] p-3 shadow-2xl overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-8 right-8 text-2xl opacity-60 hover:opacity-100 font-bold">✕</button>
        
        <header className="mb-4 border-b pb-2 flex flex-col md:flex-row md:items-center gap-3">
          <div className="w-20 h-20 bg-clr6 rounded-[1em] flex flex-col items-center justify-center text-white shadow-lg shrink-0">
            <span className="text-xs font-bold uppercase">{new Date(acta.fecha).toLocaleString('es', { month: 'short' })}</span>
            <span className="text-3xl font-black">{new Date(acta.fecha).getUTCDate()}</span>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <p className="text-[0.8em] font-bold text-clr6 uppercase tracking-widest">{acta.codigo}</p>
              <span className={`px-2 py-0.5 rounded-full text-[0.8em] font-bold uppercase ${
                acta.confidencialidad === 'Pública' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}>
                🔒 {acta.confidencialidad}
              </span>
            </div>
            <h2 className="text-3xl font-black font-display uppercase tracking-tighter text-clr5 dark:text-clr1">{acta.tipo}</h2>
            <p className="text-[0.8em] opacity-40 font-bold uppercase">{acta.unidades?.nombre || 'General'}</p>
          </div>
        </header>

        <div className="space-y-4">
          {/* RESUMEN AGENDA */}
          <section className="bg-zinc-50 dark:bg-clr3 p-2 rounded-[0.5em] border border-zinc-100 dark:border-clr4">
            <h3 className="font-bold uppercase text-[0.8em] opacity-60 border-b pb-2 mb-2 tracking-widest">Resumen de Agenda</h3>
            <p className="italic text-[1em] leading-relaxed">{acta.resumen || 'Sin resumen registrado.'}</p>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* IZQUIERDA: DESARROLLO DE TEMAS */}
            <div className="lg:col-span-2 space-y-10">
              <section className="space-y-4">
                <h3 className="font-bold uppercase text-[0.8em] opacity-60 border-b pb-2 tracking-widest font-slab">Temas y Decisiones</h3>
                <div className="space-y-4">
                  {acta.temas?.map((t: any, i: number) => (
                    <div key={i} className="pl-4 border-l-4 border-clr6/20 relative">
                      <div className="absolute -left-2 top-0 w-3 h-3 rounded-full bg-clr6 shadow-sm" />
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-black text-clr5 dark:text-clr1 uppercase text-[1em] tracking-tight">{t.titulo}</h4>
                        <span className="text-[0.8em] opacity-40 uppercase">⏱️ {t.duracion_real || t.duracion_estimada} min</span>
                      </div>
                      <div className="space-y-4 text-[1em]">
                        <div>
                          <p className="text-[1em]">{t.description || t.descripcion}</p>
                        </div>
                        {t.conclusiones && (
                          <div className="bg-clr6/5 p-3 rounded-xl border border-clr6/10">
                            <p className="text-[0.8em] font-bold text-clr6 uppercase mb-1">Conclusiones / Decisiones</p>
                            <p className="font-bold">{t.conclusiones}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold uppercase text-[0.8em] opacity-40 border-b pb-2 tracking-widest font-slab text-blue-600 dark:text-blue-200">Acuerdos y Compromisos</h3>
                <div className="grid gap-2 text-[1em]">
                  {acta.acuerdos?.map((a: any, i: number) => (
                    <div key={i} className="p-2 bg-blue-50/30 dark:bg-clr3/40 rounded-[0.5rem] border border-blue-100 dark:border-clr4 relative group shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold uppercase text-blue-700 dark:text-blue-300">{a.titulo}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[1em] ${
                          a.prioridad === 'Alta' || a.prioridad === 'Urgente' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                        }`}>{a.prioridad}</span>
                      </div>
                      <p className="mb-4 font-bold">{a.descripcion}</p>
                      <div className="flex flex-wrap gap-4 pt-2 border-t border-blue-100/50 text-[0.8em]">
                        <span>👤 Resp: {a.responsable?.nombres} {a.responsable?.apellidos}</span>
                        <span>📅 Plazo: {a.fecha_compromiso || 'S/F'}</span>
                        <span>📊 Estado: {a.estado}</span>
                      </div>
                    </div>
                  ))}
                  {(!acta.acuerdos || acta.acuerdos.length === 0) && (
                    <p className="italic text-center py-2">No se generaron acuerdos específicos en esta sesión.</p>
                  )}
                </div>
              </section>
            </div>

            {/* DERECHA: ASISTENCIA Y CIERRE */}
            <div className="space-y-10">
              <section className="space-y-4">
                <h3 className="font-bold uppercase text-[0.8em] opacity-40 border-b pb-2 tracking-widest font-slab">Control de Firmas</h3>
                <div className="space-y-2">
                  {acta.participantes?.map((p: any) => {
                    if (p.asistencia === 'No Invitado') return null;
                    const f = acta.firmas?.find((f: any) => f.perfil_id === p.perfil_id)
                    return (
                      <div key={p.id} className="flex justify-between items-center text-[0.85em] font-bold uppercase p-2 bg-zinc-50 dark:bg-black/10 rounded-[0.5em]">
                        <div className="truncate pr-2">
                          <p>{p.perfiles?.nombres}</p>
                          <p className="text-[0.8em] opacity-60">{p.rol_en_reunion}</p>
                        </div>
                        <span className={`whitespace-nowrap ${f?.firmado ? 'text-green-600' : 'text-amber-600'}`}>
                          {f?.firmado ? '✓ FIRMADO' : '✍️ PNDTE'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </section>

              <section className="space-y-4 bg-zinc-50 dark:bg-black/10 p-2 rounded-[1rem] border dark:border-clr4">
                <h3 className="font-bold uppercase text-[0.8em] opacity-60 border-b pb-2 tracking-widest">Cierre de Sesión</h3>
                <div className="space-y-4 text-[0.9em]">
                  {acta.proxima_reunion && (
                    <div>
                      <p className="text-[0.9em] uppercase opacity-60 mb-1">Próxima Reunión</p>
                      <p className="font-bold text-clr7">{acta.proxima_reunion}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-[0.9em] uppercase opacity-60 mb-1">Observaciones Finales</p>
                    <p className="italic">{acta.observaciones_finales || 'Sin observaciones adicionales.'}</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <button 
          onClick={onClose} 
          className="w-full py-4 bg-zinc-900 text-white font-black uppercase rounded-[0.5em] mt-12 font-inika tracking-widest shadow-xl hover:brightness-125 transition-all text-[1em]"
        >
          Cerrar Libro de Actas
        </button>
      </div>
    </div>
  )
}
