'use client'

import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { isDirectivo, isDirigenteOrGuiadora, isAdultoConPupilos, isApoderado, isInactive } from '@/lib/roles'
import type { Perfil, AutorizacionActividad, ContactoEmergencia } from '@/types'
import { calcularEdad } from '@/utils/date-utils'
import { cleanPhone } from '@/utils/format-utils'

interface DashInicioProps {
  perfil: Perfil
  pupilos: Perfil[]
  apoderado: Perfil | null
  autorizaciones?: AutorizacionActividad[]
  onEdit: (pupilo?: Perfil) => void
  onVerAutorizacion: (auth: AutorizacionActividad) => void
  onGenerateAuth: (p: Perfil) => void
  onProgramActividad: () => void
  onVincularExistente: () => void
  setShowPassModal: (show: boolean) => void
}

export default function DashInicio({ 
  perfil, pupilos, apoderado, autorizaciones = [], 
  onEdit, onVerAutorizacion, onGenerateAuth, onProgramActividad, onVincularExistente, setShowPassModal
}: DashInicioProps) {
  const isDirigente = isDirigenteOrGuiadora(perfil)
  const inactive = isInactive(perfil)

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* MIS PUPILOS ASOCIADOS (Para todos los Adultos: Roles 2 al 8) */}
      {isAdultoConPupilos(perfil) && (
        <section className="space-y-6">
            <div className="flex flex-wrap justify-between items-center border-l-4 border-pclr8 dark:border-pdclr8 pl-4 gap-4">
            <h2 className="font-black font-display uppercase text-pclr4 dark:text-pdclr4 font-bold">Mis Pupilos Asociados</h2>
            <div className="flex gap-2">
              {!inactive && (
                <button 
                  onClick={onVincularExistente}
                  className="px-4 py-2 bg-pclr10 dark:bg-pdclr10 text-pclr12 dark:text-pdclr12 text-[1em] font-black uppercase rounded-xl shadow-lg hover:scale-105 transition-all"
                >
                  🔗 Vincular Existente
                </button>
              )}
              <Link 
                href={`/registro?apoderado_id=${perfil.id}`}
                className="px-4 py-2 bg-pclr10 dark:bg-pdclr10 text-pclr12 dark:text-pdclr12 text-[1em] font-black uppercase rounded-xl shadow-lg hover:scale-105 transition-all"
              >
                + Agregar Nuevo
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pupilos.map(p => (
              <div key={p.id} className="p-6 bg-pclr3 dark:bg-pdclr3 rounded-3xl border border-transparent hover:border-pclr8 dark:hover:border-pdclr8 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-black text-pclr4 dark:text-pdclr4 uppercase text-sm leading-tight font-bold">{p.nombres} {p.apellidos}</p>
                    <span className={`px-2 py-0.5 rounded-full text-[0.7em] font-bold uppercase ${
                      p.estado === 'activo' ? 'bg-pclr6 dark:bg-pdclr6 text-pclr12 dark:text-pdclr12' :
                      p.estado === 'inactivo' ? 'bg-pclr5 dark:bg-pdclr5 text-pclr12 dark:text-pdclr12' :
                      'bg-pclr11 dark:bg-pdclr11 text-pclr12 dark:text-pdclr12'
                    }`}>{p.estado}</span>
                    <p className="text-[0.8em] font-bold text-pclr5 dark:text-pdclr5 uppercase tracking-wider">{calcularEdad(p.fecha_nacimiento)} • {p.roles?.name} • {p.unidades?.nombre || 'Sin Unidad'}</p>
                  </div>
                  <button onClick={() => onEdit(p)} className="p-2 bg-pclr1 dark:bg-pdclr1 rounded-xl shadow-sm hover:scale-110 transition-all">✏️</button>
                </div>
                <div className="space-y-1">
                  <p className="text-[0.8em] font-black uppercase text-pclr7 dark:text-pdclr7 font-bold">RUT: {p.rut}</p>
                  <p className="text-[0.8em] font-black uppercase text-pclr7 dark:text-pdclr7 font-bold">Salud: {p.alergias ? '⚠️ Alerta Médica' : '✅ Ficha al día'}</p>
                </div>
              </div>
            ))}
            {pupilos.length === 0 && (
              <div className="col-span-full p-8 bg-pclr3 dark:bg-pdclr3 rounded-3xl text-center border-2 border-dashed border-pclr13 dark:border-pdclr13">
                <p className="text-lg italic opacity-40 text-pclr7 dark:text-pdclr7">No tienes pupilos registrados bajo tu RUT.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* MI APODERADO RESPONSABLE (Para NNJ) */}
      {apoderado && (
        <section className="space-y-6">
          <h2 className="text-lg font-black font-display uppercase text-pclr4 dark:text-pdclr4 border-l-4 border-pclr8 dark:border-pdclr8 pl-4 tracking-tighter font-bold">Mi Apoderado Responsable</h2>
          <div className="p-6 bg-pclr3 dark:bg-pdclr3 rounded-3xl flex items-center gap-6 max-w-xl border border-pclr13 dark:border-pdclr13">
            <div className="w-12 h-12 rounded-full bg-pclr10 dark:bg-pdclr10 text-pclr12 dark:text-pdclr12 flex items-center justify-center text-xl shadow-inner">👤</div>
            <div>
              <p className="font-black text-pclr4 dark:text-pdclr4 uppercase text-sm font-bold">{apoderado.nombres} {apoderado.apellidos}</p>
              <p className="text-[0.8em] text-pclr7 dark:text-pdclr7 uppercase mb-2 font-bold">Contacto Directo</p>
              <div className="flex gap-4">
                <p className="text-xs font-bold text-pclr4 dark:text-pdclr4">📞 {cleanPhone(apoderado.telefono)}</p>
                <p className="text-xs font-bold text-pclr4 dark:text-pdclr4">✉️ {apoderado.email}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TARJETAS RESUMEN - Mobile */}
      <div className="block md:hidden space-y-2">
        <div className="p-2 bg-pclr3 dark:bg-pdclr3 rounded-[0.6rem] border border-transparent">
          <h3 className="text-[0.8em] font-black uppercase text-pclr7 dark:text-pdclr7 tracking-widest font-bold">R.U.T.</h3>
          <p className="font-bold text-pclr4 dark:text-pdclr4 uppercase text-[1em] text-right">{perfil?.rut}</p>
        </div>
        <div className="p-2 bg-pclr3 dark:bg-pdclr3 rounded-[0.6rem] border border-transparent">
          <h3 className="text-[0.8em] font-black uppercase text-pclr7 dark:text-pdclr7 tracking-widest font-bold">Nacimiento</h3>
          <p className="font-bold text-pclr4 dark:text-pdclr4 uppercase text-[1em] text-right">
            {perfil.fecha_nacimiento ? `${perfil.fecha_nacimiento.split('-')[2]}/${perfil.fecha_nacimiento.split('-')[1]}/${perfil.fecha_nacimiento.split('-')[0]}` : ''}
          </p>
        </div>
        <div className="p-2 bg-pclr3 dark:bg-pdclr3 rounded-[0.6rem] border border-transparent">
          <h3 className="text-[0.8em] font-black uppercase text-pclr7 dark:text-pdclr7 tracking-widest font-bold">Email Registrado</h3>
          <p className="font-bold text-pclr4 dark:text-pdclr4 text-[0.9em] truncate text-right">{perfil?.email}</p>
        </div>
        <div className="p-2 bg-pclr3 dark:bg-pdclr3 rounded-[0.6rem] border border-transparent">
          <h3 className="text-[0.8em] font-black uppercase text-pclr7 dark:text-pdclr7 tracking-widest font-bold">Estado Cuenta</h3>
          <div className="flex items-center justify-end gap-3">
            <span className="font-bold text-pclr4 dark:text-pdclr4 uppercase text-[1em] text-right">{perfil?.estado}</span>
            <div className={`w-2.5 h-2.5 rounded-full ${perfil?.estado === 'activo' ? 'bg-pclr6 dark:bg-pdclr6' : perfil?.estado === 'inactivo' ? 'bg-pclr5 dark:bg-pdclr5' : 'bg-pclr11 dark:bg-pdclr11'} animate-pulse`} />
          </div>
        </div>
      </div>

      {/* TARJETAS RESUMEN - Desktop */}
      <div className="hidden md:grid grid-cols-5 gap-2">
        <div className="p-2 bg-pclr3 dark:bg-pdclr3 rounded-[0.6rem] border border-transparent hover:border-pclr8 dark:hover:border-pdclr8 transition-all relative">
          <h3 className="text-[0.8em] font-black uppercase text-pclr7 dark:text-pdclr7 tracking-widest font-bold">R.U.T.</h3>
          <p className="font-bold text-pclr4 dark:text-pdclr4 uppercase text-[1em]">{perfil?.rut}</p>
        </div>
        <div className="p-2 bg-pclr3 dark:bg-pdclr3 rounded-[0.6rem] border border-transparent hover:border-pclr8 dark:hover:border-pdclr8 transition-all relative">
          <h3 className="text-[0.8em] font-black uppercase text-pclr7 dark:text-pdclr7 tracking-widest font-bold">Nacimiento</h3>
          <p className="font-bold text-pclr4 dark:text-pdclr4 uppercase text-[1em] absolute bottom-2 right-3">
            {perfil.fecha_nacimiento ? `${perfil.fecha_nacimiento.split('-')[2]}/${perfil.fecha_nacimiento.split('-')[1]}/${perfil.fecha_nacimiento.split('-')[0]}` : ''}
          </p>
        </div>
        <div className="p-2 bg-pclr3 dark:bg-pdclr3 rounded-[0.6rem] border border-transparent hover:border-pclr8 dark:hover:border-pdclr8 transition-all relative col-span-2">
          <h3 className="text-[0.8em] font-black uppercase text-pclr7 dark:text-pdclr7 tracking-widest font-bold">Email Registrado</h3>
          <p className="font-bold text-pclr4 dark:text-pdclr4 text-[0.9em] truncate absolute bottom-2 right-3">{perfil?.email}</p>
        </div>
        <div className="p-2 bg-pclr3 dark:bg-pdclr3 rounded-[0.6rem] border border-transparent hover:border-pclr8 dark:hover:border-pdclr8 transition-all relative">
          <h3 className="text-[0.8em] font-black uppercase text-pclr7 dark:text-pdclr7 tracking-widest font-bold">Estado Cuenta</h3>
          <div className="flex items-center gap-3 absolute bottom-2 right-3">
            <div className={`w-2.5 h-2.5 rounded-full ${perfil?.estado === 'activo' ? 'bg-pclr6 dark:bg-pdclr6' : perfil?.estado === 'inactivo' ? 'bg-pclr5 dark:bg-pdclr5' : 'bg-pclr11 dark:bg-pdclr11'} animate-pulse`} />
            <span className="font-bold text-pclr4 dark:text-pdclr4 uppercase text-[1em]">{perfil?.estado}</span>
          </div>
        </div>
      </div>

      {/* INFORMACION DETALLADA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-6">
            <h2 className="text-lg font-black font-display uppercase text-pclr4 dark:text-pdclr4 border-l-4 border-pclr8 dark:border-pdclr8 pl-4 font-bold">Información Personal y Contacto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[1em]">
              <div className="p-2 bg-pclr3 dark:bg-pdclr3 rounded-[0.6rem]">
                <p className="text-[0.8em] font-bold uppercase text-pclr7 dark:text-pdclr7 font-slab">Dirección</p>
                <p className="text-[0.9em] text-pclr4 dark:text-pdclr4 font-bold">{perfil?.direccion}, {perfil?.comuna}</p>
              </div>
              <div className="p-2 bg-pclr3 dark:bg-pdclr3 rounded-[0.6rem]">
                <p className="text-[0.8em] font-bold uppercase text-pclr7 dark:text-pdclr7 font-slab">Teléfono Personal</p>
                <p className="text-[0.9em] text-pclr4 dark:text-pdclr4 font-bold">{cleanPhone(perfil?.telefono)}</p>
              </div>
              <div className="p-2 bg-pclr3 dark:bg-pdclr3 rounded-[0.6rem]">
                <p className="text-[0.8em] font-bold uppercase text-pclr7 dark:text-pdclr7 font-slab">Institución Educacional</p>
                <p className="text-[0.9em] text-pclr4 dark:text-pdclr4 font-bold">{perfil?.colegio || 'No registrado'} ({perfil?.nivel_educacional || 'S/I'})</p>
              </div>
              <div className="p-2 bg-pclr3 dark:bg-pdclr3 rounded-[0.6rem]">
                <p className="text-[0.8em] font-bold uppercase text-pclr7 dark:text-pdclr7 font-slab">Asignación / Confesión</p>
                <p className="text-[0.9em] text-pclr4 dark:text-pdclr4 capitalize font-bold">{perfil?.sexo} • {perfil?.religion}</p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-lg font-black font-display uppercase text-pclr4 dark:text-pdclr4 border-l-4 border-pclr8 dark:border-pdclr8 pl-4 font-bold">Salud y Dietas</h2>
            {/* Mobile */}
            <div className="block md:hidden space-y-2">
              <div className="p-2 bg-pclr3 dark:bg-pdclr3 rounded-[0.6rem]">
                <p className="text-[0.8em] font-bold uppercase text-pclr7 dark:text-pdclr7 font-slab">Sistema Salud</p>
                <p className="text-[0.9em] text-pclr4 dark:text-pdclr4 font-bold text-right">{perfil?.sistema_salud} {perfil?.detalle_sistema_salud ? `(${perfil?.detalle_sistema_salud})` : ''}</p>
              </div>
              <div className="p-2 bg-pclr3 dark:bg-pdclr3 rounded-[0.6rem]">
                <p className="text-[0.8em] font-bold uppercase text-pclr7 dark:text-pdclr7 font-slab">Tipo Sangre</p>
                <p className="text-[0.9em] font-bold text-pclr4 dark:text-pdclr4 text-right">{perfil?.tipo_sangre || 'S/I'}</p>
              </div>
              <div className="p-2 bg-pclr3 dark:bg-pdclr3 rounded-[0.6rem] border-l-4 border-pclr8 dark:border-pdclr8">
                <p className="text-[0.8em] font-bold uppercase text-pclr7 dark:text-pdclr7 font-slab">Alergias</p>
                <p className="text-[0.9em] text-pclr4 dark:text-pdclr4 font-bold text-right">{perfil?.alergias || 'Ninguna'}</p>
              </div>
              <div className="p-2 bg-pclr3 dark:bg-pdclr3 rounded-2xl">
                <p className="text-[0.8em] font-bold uppercase text-pclr7 dark:text-pdclr7 font-slab">Antecedentes Medicos</p>
                <p className="text-[0.9em] text-pclr4 dark:text-pdclr4 font-bold text-right">{perfil?.antecedentes_medicos || 'Sin antecedentes'}</p>
              </div>
              <div className="p-2 bg-pclr3 dark:bg-pdclr3 rounded-2xl">
                <p className="text-[0.8em] font-bold uppercase text-pclr7 dark:text-pdclr7 font-slab">Tratamientos Medicos</p>
                <p className="text-[0.9em] text-pclr4 dark:text-pdclr4 font-bold text-right">{perfil?.tratamientos_medicos || 'Sin tratamiento'}</p>
              </div>
              <div className="p-2 bg-pclr3 dark:bg-pdclr3 rounded-2xl">
                <p className="text-[0.8em] font-bold uppercase text-pclr7 dark:text-pdclr7 font-slab">Consumo de Medicamentos</p>
                <p className="text-[0.9em] text-pclr4 dark:text-pdclr4 font-bold text-right">{perfil?.medicamentos || 'Ninguno'}</p>
              </div>
              <div className="p-2 bg-pclr3 dark:bg-pdclr3 rounded-2xl">
                <p className="text-[0.8em] font-bold uppercase text-pclr7 dark:text-pdclr7 font-slab">Dieta Alimentaria</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {perfil?.dieta_alimentaria && perfil.dieta_alimentaria.length > 0 ? perfil.dieta_alimentaria.map((d: string) => (<span key={d} className="px-2 py-0.5 bg-pclr10 dark:bg-pdclr10 text-pclr12 dark:text-pdclr12 rounded text-[0.8em] uppercase font-bold">{d}</span>)) : <span className="text-[0.8em] italic text-pclr7 dark:text-pdclr7 font-bold">Sin restricciones</span>}
                </div>
              </div>
            </div>
            {/* Desktop */}
            <div className="hidden md:grid grid-cols-4 gap-2 text-[1em]">
              <div className="p-2 bg-pclr3 dark:bg-pdclr3 rounded-2xl">
                <p className="text-[0.8em] font-bold uppercase text-pclr7 dark:text-pdclr7 font-slab">Sistema Salud</p>
                <p className="text-[0.9em] text-pclr4 dark:text-pdclr4 font-bold">{perfil?.sistema_salud} {perfil?.detalle_sistema_salud ? `(${perfil?.detalle_sistema_salud})` : ''}</p>
              </div>
              <div className="p-2 bg-pclr3 dark:bg-pdclr3 rounded-2xl">
                <p className="text-[0.8em] font-bold uppercase text-pclr7 dark:text-pdclr7 font-slab">Tipo Sangre</p>
                <p className="text-[0.9em] font-bold text-pclr4 dark:text-pdclr4">{perfil?.tipo_sangre || 'S/I'}</p>
              </div>
              <div className="p-2 bg-pclr3 dark:bg-pdclr3 rounded-2xl border-l-4 border-pclr8 dark:border-pdclr8 col-span-2">
                <p className="text-[0.8em] font-bold uppercase text-pclr7 dark:text-pdclr7 font-slab">Alergias</p>
                <p className="text-[0.9em] text-pclr4 dark:text-pdclr4 font-bold">{perfil?.alergias || 'Ninguna'}</p>
              </div>
              <div className="col-span-full p-2 bg-pclr3 dark:bg-pdclr3 rounded-2xl">
                <p className="text-[0.8em] font-bold uppercase text-pclr7 dark:text-pdclr7 font-slab">Antecedentes Medicos</p>
                <p className="text-[0.9em] text-pclr4 dark:text-pdclr4 font-bold">{perfil?.antecedentes_medicos || 'Sin antecedentes'}</p>
              </div>
              <div className="col-span-full p-2 bg-pclr3 dark:bg-pdclr3 rounded-2xl">
                <p className="text-[0.8em] font-bold uppercase text-pclr7 dark:text-pdclr7 font-slab">Tratamientos Medicos</p>
                <p className="text-[0.9em] text-pclr4 dark:text-pdclr4 font-bold">{perfil?.tratamientos_medicos || 'Sin tratamiento'}</p>
              </div>
              <div className="col-span-full p-2 bg-pclr3 dark:bg-pdclr3 rounded-2xl">
                <p className="text-[0.8em] font-bold uppercase text-pclr7 dark:text-pdclr7 font-slab">Consumo de Medicamentos</p>
                <p className="text-[0.9em] text-pclr4 dark:text-pdclr4 font-bold">{perfil?.medicamentos || 'Ninguno'}</p>
              </div>
              <div className="col-span-full p-2 bg-pclr3 dark:bg-pdclr3 rounded-2xl">
                <p className="text-[0.8em] font-bold uppercase text-pclr7 dark:text-pdclr7 font-slab">Dieta Alimentaria</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {perfil?.dieta_alimentaria && perfil.dieta_alimentaria.length > 0 ? perfil.dieta_alimentaria.map((d: string) => (<span key={d} className="px-2 py-0.5 bg-pclr10 dark:bg-pdclr10 text-pclr12 dark:text-pdclr12 rounded text-[0.8em] uppercase font-bold">{d}</span>)) : <span className="text-[0.8em] italic text-pclr7 dark:text-pdclr7 font-bold">Sin restricciones</span>}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="space-y-6">
            <h2 className="text-lg font-black font-display uppercase text-pclr4 dark:text-pdclr4 border-l-4 border-pclr8 dark:border-pdclr8 pl-4 font-bold">Contactos de Emergencia</h2>
            <div className="space-y-3">
              {(perfil?.contactos_emergencia || []).map((c: ContactoEmergencia) => (
                <div key={c.id} className="p-2 bg-pclr3 dark:bg-pdclr3 rounded-2xl border border-pclr13 dark:border-pdclr13">
                  <p className="text-[0.8em] font-bold text-pclr4 dark:text-pdclr4 uppercase">{c.nombre}</p>
                  <p className="text-[0.8em] font-bold text-pclr7 dark:text-pdclr7 mt-[-5px]">{c.parentesco}</p>
                  <p className="text-[0.9em] text-pclr4 dark:text-pdclr4 text-right font-bold font-inika"><a href={`tel:${cleanPhone(c.telefono)}`} className="text-pclr4 dark:text-pdclr4">{cleanPhone(c.telefono)}</a></p>
                </div>
              ))}
              {(!perfil?.contactos_emergencia || perfil.contactos_emergencia.length === 0) && <p className="text-xs italic text-pclr7 dark:text-pdclr7 p-4">No hay contactos registrados.</p>}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-lg font-black font-display uppercase text-pclr4 dark:text-pdclr4 border-l-4 border-pclr8 dark:border-pdclr8 pl-4 font-bold">Autorizaciones</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-pclr3 dark:bg-pdclr3 rounded-2xl">
                <span className="text-[0.8em] font-bold uppercase text-pclr7 dark:text-pdclr7">Uso de Imagen</span>
                <span className={`text-[0.8em] uppercase font-bold ${perfil?.autoriza_fotos ? 'text-pclr6 dark:text-pdclr6' : 'text-pclr5 dark:text-pdclr5'}`}>{perfil?.autoriza_fotos ? 'Sí' : 'No'}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-pclr3 dark:bg-pdclr3 rounded-2xl">
                <span className="text-[0.8em] font-bold uppercase text-pclr7 dark:text-pdclr7">Fe Pública</span>
                <span className={`text-[0.8em] uppercase font-bold ${perfil?.fe_publica ? 'text-pclr6 dark:text-pdclr6' : 'text-pclr5 dark:text-pdclr5'}`}>{perfil?.fe_publica ? 'Sí' : 'No'}</span>
              </div>
            </div>

            {/* LISTA DE DOCUMENTOS FIRMADOS */}
            <div className="mt-6 space-y-3">
              <h3 className="text-[0.8em] font-black uppercase text-pclr7 dark:text-pdclr7 tracking-widest px-2">Documentos Firmados Recientemente</h3>
              {autorizaciones.map(auth => (
                <button 
                  key={auth.id} 
                  onClick={() => onVerAutorizacion(auth)}
                  className="w-full flex justify-between items-center p-4 bg-pclr1 dark:bg-pdclr1 border border-pclr13 dark:border-pdclr13 rounded-2xl hover:border-pclr8 dark:hover:border-pdclr8 transition-all group"
                >
                  <div className="text-left">
                    <p className="text-[0.85em] font-black uppercase leading-tight group-hover:text-pclr8 dark:group-hover:text-pdclr8 text-pclr4 dark:text-pdclr4">{auth.actividad_titulo}</p>
                    <p className="text-[0.8em] text-pclr7 dark:text-pdclr7 font-bold">{auth.fecha_firma ? new Date(auth.fecha_firma).toLocaleDateString('es-CL') : ''}</p>
                  </div>
                  <span className="text-xl group-hover:scale-125 transition-transform">📄</span>
                </button>
              ))}
              {autorizaciones.length === 0 && (
                <div className="p-4 bg-pclr3 dark:bg-pdclr3 rounded-2xl border border-dashed border-pclr13 dark:border-pdclr13 text-center">
                  <p className="text-[0.8em] italic text-pclr7 dark:text-pdclr7">No tienes documentos firmados aún.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* ACCIONES RÁPIDAS */}
      <div className="flex flex-wrap gap-4 pt-8 border-t border-pclr13 dark:border-pdclr13">
        <button onClick={() => onEdit(perfil)} className="flex-1 min-w-[200px] py-4 bg-pclr10 dark:bg-pdclr10 text-pclr12 dark:text-pdclr12 font-black uppercase rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all tracking-widest text-xs font-inika">✏️ Actualizar Mi Ficha</button>
        
        {isApoderado(perfil) && pupilos.length > 0 && (
          <button onClick={() => onGenerateAuth(pupilos[0])} className="flex-1 min-w-[200px] py-4 bg-pclr8 dark:bg-pdclr8 text-pclr12 dark:text-pdclr12 font-black uppercase rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all tracking-widest text-xs font-inika">📄 Generar Autorización</button>
        )}

        {isDirigente && !inactive && (
          <button onClick={onProgramActividad} className="flex-1 min-w-[200px] py-4 bg-pclr10 dark:bg-pdclr10 text-pclr12 dark:text-pdclr12 font-black uppercase rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all tracking-widest text-xs font-inika">📅 Programar Actividad</button>
        )}

        <button onClick={() => setShowPassModal(true)} className="flex-1 min-w-[200px] py-4 bg-pclr11 dark:bg-pdclr11 text-pclr12 dark:text-pdclr12 font-black uppercase rounded-2xl hover:brightness-125 transition-all tracking-widest text-xs font-inika">🔑 Cambiar Contraseña</button>
      </div>

    </div>
  )
}
