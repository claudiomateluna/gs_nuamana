'use client'

import { useState, useEffect } from 'react'
import { fetchLinkedFichas, linkFichasToAcuerdo } from '@/services/dashboardService'
import SelectorFichasActividad from '@/components/dashboard/unidad/SelectorFichasActividad'
import type { Articulo } from '@/types'
import { toast } from 'sonner'

interface DashModActaVerProps {
  isOpen: boolean
  onClose: () => void
  acta: any
}

export default function DashModActaVer({ isOpen, onClose, acta }: DashModActaVerProps) {
  const [fichasPorAcuerdo, setFichasPorAcuerdo] = useState<Record<number, Articulo[]>>({})
  const [editingAcuerdoIdx, setEditingAcuerdoIdx] = useState<number | null>(null)
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isOpen || !acta?.acuerdos?.length) return

    const loadFichas = async () => {
      const map: Record<number, Articulo[]> = {}
      await Promise.all(
        acta.acuerdos.map(async (acuerdo: any, idx: number) => {
          if (acuerdo.id) {
            const fichas = await fetchLinkedFichas(acuerdo.id)
            if (fichas.length > 0) {
              map[idx] = fichas
            }
          }
        })
      )
      setFichasPorAcuerdo(map)
    }

    loadFichas()
  }, [isOpen, acta?.acuerdos])

  const startEditing = (idx: number) => {
    setEditingAcuerdoIdx(idx)
    setTempSelectedIds(fichasPorAcuerdo[idx]?.map(f => f.id) || [])
  }

  const saveFichas = async () => {
    if (editingAcuerdoIdx === null) return
    const acuerdo = acta.acuerdos[editingAcuerdoIdx]
    if (!acuerdo?.id) return

    setSaving(true)
    try {
      await linkFichasToAcuerdo(acuerdo.id, tempSelectedIds)
      // Reload fichas
      const fichas = await fetchLinkedFichas(acuerdo.id)
      setFichasPorAcuerdo(prev => ({ ...prev, [editingAcuerdoIdx]: fichas }))
      setEditingAcuerdoIdx(null)
      toast.success('Fichas vinculadas correctamente')
    } catch (err) {
      toast.error('Error al guardar fichas')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen || !acta) return null

  const grupalAcuerdos = acta.acuerdos?.filter((a: any) => a.es_actividad_grupal) || []

  return (
    <div className="fixed inset-0 bg-pclr2 backdrop-blur-md z-[100] flex items-center justify-center p-2 xs:p-1 sm:p-2 md:p-3 lg:p-4 animate-in zoom-in-95 duration-300 text-[1em]">
      <div className="bg-pclr1 dark:bg-pdclr1 w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg rounded-[1em] p-3 shadow-2xl overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-8 right-8 text-2xl opacity-60 hover:opacity-100 font-bold">✕</button>
        
        <header className="mb-4 border-b pb-2 flex flex-col md:flex-row md:items-center gap-3">
          <div className="w-20 h-20 bg-pclr6 rounded-[1em] flex flex-col items-center justify-center text-pclr12 shadow-lg shrink-0">
            <span className="text-xs font-bold uppercase">{new Date(acta.fecha).toLocaleString('es', { month: 'short' })}</span>
            <span className="text-3xl font-black">{new Date(acta.fecha).getUTCDate()}</span>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <p className="text-[0.8em] font-bold text-pclr6 uppercase tracking-widest">{acta.codigo}</p>
              <span className={`px-2 py-0.5 rounded-full text-[0.8em] font-bold uppercase ${
                acta.confidencialidad === 'Pública' ? 'bg-pclr6 text-pclr12 dark:bg-pdclr6 dark:text-pdclr12' : 'bg-pclr5 text-pclr12 dark:bg-pdclr5 dark:text-pdclr12'
              }`}>
                🔒 {acta.confidencialidad}
              </span>
            </div>
            <h2 className="text-3xl font-black font-display uppercase tracking-tighter text-pclr4 dark:text-pdclr4">{acta.tipo}</h2>
            <p className="text-[0.8em] opacity-40 font-bold uppercase">{acta.unidades?.nombre || 'General'}</p>
          </div>
        </header>

        {/* Botón Vincular Fichas — disponible para cualquier rol */}
        {grupalAcuerdos.length > 0 && (
          <div className="mb-4 p-3 bg-pclr10 dark:bg-pdclr10 rounded-xl border border-pclr14 dark:border-pdclr14">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-pclr4 dark:text-pdclr4">📋 Fichas de Actividad</p>
                <p className="text-xs opacity-60">{grupalAcuerdos.length} compromiso(s) grupal(es) — vinculá fichas para que aparezcan en el ciclo</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* RESUMEN AGENDA */}
          <section className="bg-pclr3 dark:bg-pdclr3 p-2 rounded-[0.5em] border border-pclr13 dark:border-pdclr13">
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
                    <div key={i} className="pl-4 border-l-4 border-pclr6 relative">
                      <div className="absolute -left-2 top-0 w-3 h-3 rounded-full bg-pclr6 shadow-sm" />
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-black text-pclr4 dark:text-pdclr4 uppercase text-[1em] tracking-tight">{t.titulo}</h4>
                        <span className="text-[0.8em] opacity-40 uppercase">⏱️ {t.duracion_real || t.duracion_estimada} min</span>
                      </div>
                      <div className="space-y-4 text-[1em]">
                        <div>
                          <p className="text-[1em]">{t.description || t.descripcion}</p>
                        </div>
                        {t.conclusiones && (
                          <div className="bg-pclr3 dark:bg-pdclr3 p-3 rounded-xl border border-pclr6 dark:border-pdclr6">
                            <p className="text-[0.8em] font-bold text-pclr6 dark:text-pdclr6 uppercase mb-1">Conclusiones / Decisiones</p>
                            <p className="font-bold">{t.conclusiones}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold uppercase text-[0.8em] opacity-40 border-b pb-2 tracking-widest font-slab text-pclr4 dark:text-pdclr4">Acuerdos y Compromisos</h3>
                <div className="grid gap-2 text-[1em]">
                  {acta.acuerdos?.map((a: any, i: number) => (
                    <div key={i} className="p-2 bg-pclr10 dark:bg-pdclr10 rounded-[0.5rem] border border-pclr14 dark:border-pdclr14 relative group shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold uppercase text-pclr4 dark:text-pdclr4">{a.titulo}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[1em] ${
                          a.prioridad === 'Alta' || a.prioridad === 'Urgente' ? 'bg-pclr10 text-pclr4' : 'bg-pclr10 text-pclr4'
                        }`}>{a.prioridad}</span>
                      </div>
                      <p className="mb-4 font-bold">{a.descripcion}</p>
                      <div className="flex flex-wrap gap-4 pt-2 border-t border-pclr14 text-[0.8em]">
                        <span>👤 Resp: {a.responsable?.nombres} {a.responsable?.apellidos}</span>
                        <span>📅 Plazo: {a.fecha_compromiso || 'S/F'}</span>
                        <span>📊 Estado: {a.estado}</span>
                        {a.es_actividad_grupal && <span className="px-2 py-0.5 bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 rounded-full font-bold border border-pclr13 dark:border-pdclr13">👥 Grupal</span>}
                      </div>
                      
                      {/* Fichas vinculadas — solo muestra si no está editando este acuerdo */}
                      {editingAcuerdoIdx !== i && fichasPorAcuerdo[i] && fichasPorAcuerdo[i].length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {fichasPorAcuerdo[i].map((ficha: Articulo) => (
                            <a key={ficha.id} href={`/blog/actividades/${ficha.slug}`} target="_blank" rel="noopener noreferrer"
                               className="px-3 py-1 bg-pclr10 text-pclr4 rounded-full text-xs font-bold hover:bg-pclr10">
                              📋 {ficha.titulo}
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Botón Vincular — para acuerdos grupales */}
                      {a.es_actividad_grupal && editingAcuerdoIdx !== i && (
                        <button 
                          onClick={() => startEditing(i)}
                          className="mt-2 px-3 py-1 bg-pclr6 text-pclr12 rounded-full text-xs font-bold hover:brightness-110 transition-all"
                        >
                          📎 {fichasPorAcuerdo[i]?.length ? 'Editar Fichas' : 'Vincular Fichas'}
                        </button>
                      )}

                      {/* Selector inline — cuando está editando este acuerdo */}
                      {editingAcuerdoIdx === i && (
                        <div className="mt-3 p-3 bg-pclr1 dark:bg-pdclr1 rounded-xl border-2 border-pclr6">
                          <SelectorFichasActividad
                            selectedIds={tempSelectedIds}
                            onChange={setTempSelectedIds}
                          />
                          <div className="flex gap-2 mt-3">
                            <button 
                              onClick={saveFichas} 
                              disabled={saving}
                              className="px-4 py-2 bg-pclr6 text-pclr12 rounded-xl text-xs font-bold hover:brightness-110 disabled:opacity-50"
                            >
                              {saving ? 'Guardando...' : '💾 Guardar'}
                            </button>
                            <button 
                              onClick={() => setEditingAcuerdoIdx(null)}
                              className="px-4 py-2 bg-pclr3 dark:bg-pdclr3 rounded-xl text-xs font-bold"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}
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
                      <div key={p.id} className="flex justify-between items-center text-[0.85em] font-bold uppercase p-2 bg-pclr3 dark:bg-pdclr3 rounded-[0.5em]">
                        <div className="truncate pr-2">
                          <p>{p.perfiles?.nombres}</p>
                          <p className="text-[0.8em] opacity-60">{p.rol_en_reunion}</p>
                        </div>
                        <span className={`whitespace-nowrap ${f?.firmado ? 'text-pclr6' : 'text-pclr5'}`}>
                          {f?.firmado ? '✓ FIRMADO' : '✍️ PNDTE'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </section>

              <section className="space-y-4 bg-pclr3 dark:bg-pdclr3 p-2 rounded-[1rem] border dark:border-pdclr13">
                <h3 className="font-bold uppercase text-[0.8em] opacity-60 border-b pb-2 tracking-widest">Cierre de Sesión</h3>
                <div className="space-y-4 text-[0.9em]">
                  {acta.proxima_reunion && (
                    <div>
                      <p className="text-[0.9em] uppercase opacity-60 mb-1">Próxima Reunión</p>
                      <p className="font-bold text-pclr4">{acta.proxima_reunion}</p>
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
          className="w-full py-4 bg-pclr2 text-pclr12 font-black uppercase rounded-[0.5em] mt-12 font-inika tracking-widest shadow-xl hover:brightness-125 transition-all text-[1em]"
        >
          Cerrar Libro de Actas
        </button>
      </div>
    </div>
  )
}
