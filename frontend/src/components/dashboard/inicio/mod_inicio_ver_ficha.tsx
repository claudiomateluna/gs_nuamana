'use client'

import { useState } from 'react'
import type { Perfil, AutorizacionActividad } from '@/types'
import { isDirectivo } from '@/lib/roles'
import { calcularEdad } from '@/utils/date-utils'
import { cleanPhone } from '@/utils/format-utils'
import DashModAutorizacionVer from '@/components/dashboard/autorizacion/mod_autorizacion_ver'

interface DashModVerFichaProps {
  isOpen: boolean
  onClose: () => void
  miembro: any
  perfil?: Perfil | null
  autorizaciones?: AutorizacionActividad[]
}

export default function DashModVerFicha({ isOpen, onClose, miembro, perfil, autorizaciones = [] }: DashModVerFichaProps) {
  const [selectedAuth, setSelectedAuth] = useState<AutorizacionActividad | null>(null)
  const [showPdfModal, setShowPdfModal] = useState(false)

  if (!isOpen || !miembro) return null

  const authsDelMiembro = autorizaciones.filter(a => a.perfil_id === miembro.id)
  const showSignedAuths = perfil ? isDirectivo(perfil) && authsDelMiembro.length > 0 : false

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-2 animate-in zoom-in-95 duration-300">
      <div className="bg-white dark:bg-clr5 w-full max-w-5xl rounded-[1rem] p-2 shadow-2xl overflow-y-auto max-h-[90vh] text-[1em]">
        <button onClick={onClose} className="absolute top-8 right-8 text-2xl opacity-40 hover:opacity-100 font-bold">✕</button>

        <header className="mb-8 border-b pb-6">
          <h2 className="text-3xl font-black font-display uppercase text-clr7 tracking-tighter font-bold">Ficha Personal</h2>
          <h3 className="text-2xl font-black text-clr5 dark:text-clr1 uppercase">{miembro.nombres} {miembro.apellidos}</h3>
          <p className="text-lg font-bold text-clr5 dark:text-clr1 opacity-60 uppercase">{calcularEdad(miembro.fecha_nacimiento)} Años • {miembro.unidades?.nombre || 'Sin Unidad'}</p>
        </header>

        <div className="space-y-12">
          {/* TARJETAS RESUMEN - Mobile */}
          <div className="block md:hidden space-y-2">
            <div className="p-3 bg-zinc-50 dark:bg-black/20 rounded-[1rem] border border-transparent">
              <h3 className="text-[0.8em] font-black uppercase text-clr2 tracking-widest font-bold">R.U.T.</h3>
              <p className="font-bold text-clr5 dark:text-clr1 uppercase text-[1em] text-right">{miembro.rut}</p>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-black/20 rounded-[1rem] border border-transparent">
              <h3 className="text-[0.8em] font-black uppercase text-clr2 tracking-widest font-bold">Nacimiento</h3>
              <p className="font-bold text-clr5 dark:text-clr1 uppercase text-[1em] text-right">
                {miembro.fecha_nacimiento ? `${miembro.fecha_nacimiento.split('-')[2]}/${miembro.fecha_nacimiento.split('-')[1]}/${miembro.fecha_nacimiento.split('-')[0]}` : ''}
              </p>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-black/20 rounded-[1rem] border border-transparent">
              <h3 className="text-[0.8em] font-black uppercase text-clr2 tracking-widest font-bold">Email Registrado</h3>
              <p className="font-bold text-clr5 dark:text-clr1 text-[0.9em] truncate text-right">{miembro.email}</p>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-black/20 rounded-[1rem] border border-transparent">
              <h3 className="text-[0.8em] font-black uppercase text-clr2 tracking-widest font-bold">Estado Cuenta</h3>
              <div className="flex items-center justify-end gap-3">
                <span className="font-bold text-clr5 dark:text-clr1 uppercase text-[1em]">{miembro.estado}</span>
                <div className={`w-2.5 h-2.5 rounded-full ${miembro.estado === 'activo' ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`} />
              </div>
            </div>
          </div>

          {/* TARJETAS RESUMEN - Desktop */}
          <div className="hidden md:grid grid-cols-5 gap-2">
            <div className="p-3 bg-zinc-50 dark:bg-black/20 rounded-[1rem] border border-transparent hover:border-clr7 transition-all relative">
              <h3 className="text-[0.8em] font-black uppercase text-clr2 tracking-widest font-bold">R.U.T.</h3>
              <p className="font-bold text-clr5 dark:text-clr1 uppercase text-[1em]">{miembro.rut}</p>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-black/20 rounded-[1rem] border border-transparent hover:border-clr7 transition-all relative">
              <h3 className="text-[0.8em] font-black uppercase text-clr2 tracking-widest font-bold">Nacimiento</h3>
              <p className="font-bold text-clr5 dark:text-clr1 uppercase text-[1em] absolute bottom-2 right-3">
                {miembro.fecha_nacimiento ? `${miembro.fecha_nacimiento.split('-')[2]}/${miembro.fecha_nacimiento.split('-')[1]}/${miembro.fecha_nacimiento.split('-')[0]}` : ''}
              </p>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-black/20 rounded-[1rem] border border-transparent hover:border-clr7 transition-all relative col-span-2">
              <h3 className="text-[0.8em] font-black uppercase text-clr2 tracking-widest font-bold">Email Registrado</h3>
              <p className="font-bold text-clr5 dark:text-clr1 text-[0.9em] truncate absolute bottom-2 right-3">{miembro.email}</p>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-black/20 rounded-[1rem] border border-transparent hover:border-clr7 transition-all relative">
              <h3 className="text-[0.8em] font-black uppercase text-clr2 tracking-widest font-bold">Estado Cuenta</h3>
              <div className="flex items-center gap-3 absolute bottom-2 right-3">
                <div className={`w-2.5 h-2.5 rounded-full ${miembro.estado === 'activo' ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`} />
                <span className="font-bold text-clr5 dark:text-clr1 uppercase text-[1em] font-bold">{miembro.estado}</span>
              </div>
            </div>
          </div>

          {/* INFORMACION DETALLADA (Grid 2/3 + 1/3 como en Inicio) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-8">
              <section className="space-y-6">
                <h2 className="text-lg font-black font-display uppercase text-clr5 dark:text-clr1 border-l-4 border-clr7 pl-4 font-bold">Información Personal y Contacto</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[1em]">
                  <div className="p-3 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                    <p className="text-[0.8em] font-bold uppercase opacity-40 font-slab">Dirección</p>
                    <p className="text-[0.9em] text-clr5 dark:text-clr9 font-bold">{miembro.direccion}, {miembro.comuna}</p>
                  </div>
                  <div className="p-3 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                    <p className="text-[0.8em] font-bold uppercase opacity-40 font-slab">Teléfono Personal</p>
                    <p className="text-[0.9em] text-clr5 dark:text-clr9 font-bold">{cleanPhone(miembro.telefono)}</p>
                  </div>
                  <div className="p-3 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                    <p className="text-[0.8em] font-bold uppercase opacity-40 font-slab">Institución Educacional</p>
                    <p className="text-[0.9em] text-clr5 dark:text-clr9 font-bold">{miembro.colegio || 'No registrado'} ({miembro.nivel_educacional || 'S/I'})</p>
                  </div>
                  <div className="p-3 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                    <p className="text-[0.8em] font-bold uppercase opacity-40 font-slab">Asignación / Confesión</p>
                    <p className="text-[0.9em] text-clr5 dark:text-clr9 capitalize font-bold">{miembro.sexo} • {miembro.religion}</p>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-lg font-black font-display uppercase text-clr5 dark:text-clr1 border-l-4 border-clr7 pl-4 font-bold">Salud y Dietas</h2>
                {/* Mobile */}
                <div className="block md:hidden space-y-2">
                  <div className="p-2 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                    <p className="text-[0.8em] font-bold uppercase opacity-40 font-slab">Sistema Salud</p>
                    <p className="text-[0.9em] text-clr5 dark:text-clr9 font-bold">{miembro.sistema_salud} {miembro.detalle_sistema_salud ? `(${miembro.detalle_sistema_salud})` : ''}</p>
                  </div>
                  <div className="p-2 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                    <p className="text-[0.8em] font-bold uppercase opacity-40 font-slab">Tipo Sangre</p>
                    <p className="text-[0.9em] font-bold text-clr5 dark:text-clr2">{miembro.tipo_sangre || 'S/I'}</p>
                  </div>
                  <div className="p-2 bg-zinc-50 dark:bg-black/10 rounded-2xl border-l-4 border-red-500">
                    <p className="text-[0.8em] font-bold uppercase opacity-40 font-slab">Alergias</p>
                    <p className="text-[0.9em] text-clr5 dark:text-clr9 font-bold">{miembro.alergias || 'Ninguna'}</p>
                  </div>
                  <div className="p-2 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                    <p className="text-[0.8em] font-bold uppercase opacity-40 font-slab">Antecedentes Medicos</p>
                    <p className="text-[0.9em] text-clr5 dark:text-clr9 font-bold">{miembro.antecedentes_medicos || 'Sin antecedentes'}</p>
                  </div>
                  <div className="p-2 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                    <p className="text-[0.8em] font-bold uppercase opacity-40 font-slab">Tratamientos Medicos</p>
                    <p className="text-[0.9em] text-clr5 dark:text-clr9 font-bold">{miembro.tratamientos_medicos || 'Sin tratamiento'}</p>
                  </div>
                  <div className="p-2 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                    <p className="text-[0.8em] font-bold uppercase opacity-40 font-slab">Consumo de Medicamentos</p>
                    <p className="text-[0.9em] text-clr5 dark:text-clr9 font-bold">{miembro.medicamentos || 'Ninguno'}</p>
                  </div>
                  <div className="p-2 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                    <p className="text-[0.8em] font-bold uppercase opacity-40 font-slab">Dieta Alimentaria</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {miembro.dieta_alimentaria?.length > 0 ? miembro.dieta_alimentaria.map((d: string) => (<span key={d} className="px-2 py-0.5 bg-clr7/50 text-clr9 rounded text-[0.8em] uppercase font-bold">{d}</span>)) : <span className="text-[0.8em] italic opacity-40 font-bold">Sin restricciones</span>}
                    </div>
                  </div>
                </div>
                {/* Desktop */}
                <div className="hidden md:grid grid-cols-4 gap-2 text-[1em]">
                  <div className="p-2 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                    <p className="text-[0.8em] font-bold uppercase opacity-40 font-slab">Sistema Salud</p>
                    <p className="text-[0.9em] text-clr5 dark:text-clr9 font-bold">{miembro.sistema_salud} {miembro.detalle_sistema_salud ? `(${miembro.detalle_sistema_salud})` : ''}</p>
                  </div>
                  <div className="p-2 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                    <p className="text-[0.8em] font-bold uppercase opacity-40 font-slab">Tipo Sangre</p>
                    <p className="text-[0.9em] font-bold text-clr5 dark:text-clr2">{miembro.tipo_sangre || 'S/I'}</p>
                  </div>
                  <div className="p-2 bg-zinc-50 dark:bg-black/10 rounded-2xl border-l-4 border-red-500 col-span-2">
                    <p className="text-[0.8em] font-bold uppercase opacity-40 font-slab">Alergias</p>
                    <p className="text-[0.9em] text-clr5 dark:text-clr9 font-bold">{miembro.alergias || 'Ninguna'}</p>
                  </div>
                  <div className="col-span-full p-2 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                    <p className="text-[0.8em] font-bold uppercase opacity-40 font-slab">Antecedentes Medicos</p>
                    <p className="text-[0.9em] text-clr5 dark:text-clr9 font-bold">{miembro.antecedentes_medicos || 'Sin antecedentes'}</p>
                  </div>
                  <div className="col-span-full p-2 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                    <p className="text-[0.8em] font-bold uppercase opacity-40 font-slab">Tratamientos Medicos</p>
                    <p className="text-[0.9em] text-clr5 dark:text-clr9 font-bold">{miembro.tratamientos_medicos || 'Sin tratamiento'}</p>
                  </div>
                  <div className="col-span-full p-2 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                    <p className="text-[0.8em] font-bold uppercase opacity-40 font-slab">Consumo de Medicamentos</p>
                    <p className="text-[0.9em] text-clr5 dark:text-clr9 font-bold">{miembro.medicamentos || 'Ninguno'}</p>
                  </div>
                  <div className="col-span-full p-2 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                    <p className="text-[0.8em] font-bold uppercase opacity-40 font-slab">Dieta Alimentaria</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {miembro.dieta_alimentaria?.length > 0 ? miembro.dieta_alimentaria.map((d: string) => (<span key={d} className="px-2 py-0.5 bg-clr7/50 text-clr9 rounded text-[0.8em] uppercase font-bold">{d}</span>)) : <span className="text-[0.8em] italic opacity-40 font-bold">Sin restricciones</span>}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section className="space-y-6">
                <h2 className="text-lg font-black font-display uppercase text-clr5 dark:text-clr1 border-l-4 border-clr7 pl-4 font-bold">Contactos de Emergencia</h2>
                <div className="space-y-3">
                  {miembro.contactos_emergencia?.map((c: any) => (
                    <div key={c.id} className="p-2 bg-clr7/5 rounded-2xl border border-clr7/10">
                      <p className="text-[0.8em] font-bold text-clr7 uppercase">{c.nombre}</p>
                      <p className="text-[0.8em] font-bold opacity-60 mt-[-5px]">{c.relacion}</p>
                      <p className="text-[0.9em] text-clr5 dark:text-clr1 text-right font-bold font-inika"><a href={`tel:${cleanPhone(c.telefono)}`} className="text-clr5 dark:text-clr1">{cleanPhone(c.telefono)}</a></p>
                    </div>
                  ))}
                  {(!miembro.contactos_emergencia || miembro.contactos_emergencia.length === 0) && (
                    <div className="p-4 bg-blue-50/10 rounded-2xl border border-dashed text-center">
                      <p className="text-[0.8em] font-bold uppercase text-clr2">Apoderado de Contacto</p>
                      <p className="font-bold text-[0.9em]">{miembro.nombre_apoderado_contacto || 'S/I'}</p>
                      <p className="text-lg font-black text-clr7"><a href={`tel:${cleanPhone(miembro.telefono_apoderado_contacto)}`}>📞 {cleanPhone(miembro.telefono_apoderado_contacto)}</a></p>
                    </div>
                  )}
                </div>
              </section>

              {miembro.apoderado && (
                <section className="space-y-6">
                  <h2 className="text-lg font-black font-display uppercase text-clr5 dark:text-clr1 border-l-4 border-clr7 pl-4 font-bold">Apoderado Responsable</h2>
                  <div className="p-4 bg-amber-50/10 rounded-2xl border border-dashed text-center">
                    <p className="text-[0.8em] font-bold uppercase text-clr2">Apoderado Vinculado</p>
                    <p className="font-bold text-[0.9em]">{miembro.apoderado.nombres} {miembro.apoderado.apellidos}</p>
                    <p className="text-lg font-black text-clr7"><a href={`tel:${cleanPhone(miembro.apoderado.telefono)}`}>📞 {cleanPhone(miembro.apoderado.telefono)}</a></p>
                    {miembro.apoderado.email && <p className="text-[0.8em] font-bold opacity-60 mt-1">✉️ {miembro.apoderado.email}</p>}
                  </div>
                </section>
              )}

              <section className="space-y-6">
                <h2 className="text-lg font-black font-display uppercase text-clr5 dark:text-clr1 border-l-4 border-clr7 pl-4 font-bold">Autorizaciones</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                    <span className="text-[0.8em] font-bold uppercase opacity-60">Uso de Imagen</span>
                    <span className={`text-[0.8em] uppercase font-bold ${miembro.autoriza_fotos ? 'text-clr6' : 'text-clr7'}`}>{miembro.autoriza_fotos ? 'Sí' : 'No'}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                    <span className="text-[0.8em] font-bold uppercase opacity-60">Fe Pública</span>
                    <span className={`text-[0.8em] uppercase font-bold ${miembro.fe_publica ? 'text-clr6' : 'text-clr7'}`}>{miembro.fe_publica ? 'Sí' : 'No'}</span>
                  </div>
                </div>
              </section>

              {showSignedAuths && (
                <section className="space-y-6">
                  <h2 className="text-lg font-black font-display uppercase text-clr5 dark:text-clr1 border-l-4 border-clr7 pl-4 font-bold">Autorizaciones Firmadas</h2>
                  <div className="space-y-3">
                    {authsDelMiembro.map(auth => (
                      <div key={auth.id} className="p-4 bg-zinc-50 dark:bg-black/10 rounded-2xl space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-[0.9em] font-bold text-clr5 dark:text-clr1 uppercase truncate">{auth.actividad_nombre || auth.actividad_titulo || 'Actividad'}</p>
                            <p className="text-[0.8em] font-bold opacity-50 mt-0.5">
                              {auth.fecha_inicio || auth.fecha_firma ? `${auth.fecha_inicio ? new Date(auth.fecha_inicio).toLocaleDateString('es-CL') : '—'} — ${auth.fecha_fin ? new Date(auth.fecha_fin).toLocaleDateString('es-CL') : '—'}` : ''}
                            </p>
                          </div>
                          <span className={`shrink-0 px-2 py-0.5 rounded-full text-[0.7em] font-bold uppercase ${
                            auth.estado === 'Vigente' ? 'bg-green-100 text-green-700' :
                            auth.estado === 'Vencida' ? 'bg-red-100 text-red-700' :
                            'bg-zinc-100 text-zinc-600'
                          }`}>{auth.estado || 'Sin estado'}</span>
                        </div>
                        <div className="flex items-center justify-between text-[0.8em]">
                          <span className="font-bold opacity-60">
                            Firmado por: <span className="text-clr5 dark:text-clr1">{auth.nombre_firmante || '—'}</span>
                          </span>
                          {auth.fecha_firma && (
                            <span className="font-bold opacity-60">{new Date(auth.fecha_firma).toLocaleDateString('es-CL')}</span>
                          )}
                        </div>
                        <button
                          onClick={() => { setSelectedAuth(auth); setShowPdfModal(true) }}
                          className="w-full py-2 bg-clr7 text-white font-bold uppercase text-[0.8em] rounded-xl hover:brightness-110 transition-all tracking-widest shadow-sm"
                        >
                          Ver PDF
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>

        <button 
          onClick={onClose} 
          className="w-full py-4 bg-zinc-900 text-white font-black uppercase rounded-2xl mt-12 font-inika tracking-widest shadow-xl hover:brightness-125 transition-all"
        >
          Cerrar Ficha de Seguridad
        </button>
      </div>

      {showPdfModal && selectedAuth && (
        <DashModAutorizacionVer
          isOpen={showPdfModal}
          onClose={() => { setShowPdfModal(false); setSelectedAuth(null) }}
          auth={selectedAuth}
          perfil={miembro}
        />
      )}
    </div>
  )
}
