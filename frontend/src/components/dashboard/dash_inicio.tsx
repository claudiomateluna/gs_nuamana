'use client'

import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface DashInicioProps {
  perfil: any
  pupilos: any[]
  apoderado: any
  autorizaciones?: any[]
  onEdit: (pupilo?: any) => void
  onVerAutorizacion: (auth: any) => void
  onGenerateAuth: (p: any) => void
  onProgramActividad: () => void
  onVincularExistente: () => void
  setShowPassModal: (show: boolean) => void
}

export default function DashInicio({ 
  perfil, pupilos, apoderado, autorizaciones = [], 
  onEdit, onVerAutorizacion, onGenerateAuth, onProgramActividad, onVincularExistente, setShowPassModal
}: DashInicioProps) {
  const isDirectivo = [1, 2, 3].includes(perfil?.rol_id || 0)
  const isDirigente = [2, 3].includes(perfil?.rol_id || 0)
  const isAdulto = [2, 3, 4, 5, 6, 7, 8].includes(perfil?.rol_id || 0)

  const calcularEdad = (fechaNacimiento: string | null) => {
    if (!fechaNacimiento) return 'Edad S/I';
    const hoy = new Date();
    const cumpleanos = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    const m = hoy.getMonth() - cumpleanos.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
    }
    return `${edad} años`;
  }

  const cleanPhone = (phone: string | null | undefined) => {
    if (!phone) return 'S/I';
    return phone.replace(/[`']/g, '').trim();
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* MIS PUPILOS ASOCIADOS (Para todos los Adultos: Roles 2 al 8) */}
      {isAdulto && (
        <section className="space-y-6">
          <div className="flex flex-wrap justify-between items-center border-l-4 border-clr7 pl-4 gap-4">
            <h2 className="font-black font-display uppercase text-clr7 font-bold">Mis Pupilos Asociados</h2>
            <div className="flex gap-2">
              <button 
                onClick={onVincularExistente}
                className="px-4 py-2 bg-clr5 text-white text-[1em] font-black uppercase rounded-xl shadow-lg hover:scale-105 transition-all"
              >
                🔗 Vincular Existente
              </button>
              <Link 
                href={`/registro?apoderado_id=${perfil.id}`}
                className="px-4 py-2 bg-clr7 text-white text-[1em] font-black uppercase rounded-xl shadow-lg hover:scale-105 transition-all"
              >
                + Agregar Nuevo
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pupilos.map(p => (
              <div key={p.id} className="p-6 bg-zinc-50 dark:bg-black/20 rounded-3xl border border-transparent hover:border-clr7/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-black text-clr5 dark:text-clr1 uppercase text-sm leading-tight font-bold">{p.nombres} {p.apellidos}</p>
                    <p className="text-[0.8em] font-bold text-clr7 uppercase tracking-wider">{calcularEdad(p.fecha_nacimiento)} • {p.roles?.name} • {p.unidades?.nombre || 'Sin Unidad'}</p>
                  </div>
                  <button onClick={() => onEdit(p)} className="p-2 bg-white dark:bg-clr4 rounded-xl shadow-sm hover:scale-110 transition-all">✏️</button>
                </div>
                <div className="space-y-1">
                  <p className="text-[0.8em] font-black uppercase opacity-40 font-bold">RUT: {p.rut}</p>
                  <p className="text-[0.8em] font-black uppercase opacity-40 font-bold">Salud: {p.alergias ? '⚠️ Alerta Médica' : '✅ Ficha al día'}</p>
                </div>
              </div>
            ))}
            {pupilos.length === 0 && (
              <div className="col-span-full p-8 bg-zinc-50 dark:bg-black/10 rounded-3xl text-center border-2 border-dashed border-zinc-200 dark:border-clr4">
                <p className="text-lg italic opacity-40">No tienes pupilos registrados bajo tu RUT.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* MI APODERADO RESPONSABLE (Para NNJ) */}
      {apoderado && (
        <section className="space-y-6">
          <h2 className="text-lg font-black font-display uppercase text-clr7 border-l-4 border-clr7 pl-4 tracking-tighter font-bold">Mi Apoderado Responsable</h2>
          <div className="p-6 bg-blue-50/30 dark:bg-black/20 rounded-3xl flex items-center gap-6 max-w-xl">
            <div className="w-12 h-12 rounded-full bg-clr7/10 flex items-center justify-center text-xl shadow-inner">👤</div>
            <div>
              <p className="font-black text-clr5 dark:text-clr1 uppercase text-sm font-bold">{apoderado.nombres} {apoderado.apellidos}</p>
              <p className="text-[0.8em] opacity-60 uppercase mb-2 font-bold">Contacto Directo</p>
              <div className="flex gap-4">
                <p className="text-xs font-bold">📞 {cleanPhone(apoderado.telefono)}</p>
                <p className="text-xs font-bold">✉️ {apoderado.email}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TARJETAS RESUMEN (Grid de 5 columnas en old) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        <div className="p-3 bg-zinc-50 dark:bg-black/20 rounded-[1rem] border border-transparent hover:border-clr7 transition-all relative">
          <h3 className="text-[0.8em] font-black uppercase text-clr2 tracking-widest font-bold">R.U.T.</h3>
          <p className="font-bold text-clr5 dark:text-clr1 uppercase text-[1em]">{perfil?.rut}</p>
        </div>
        <div className="p-3 bg-zinc-50 dark:bg-black/20 rounded-[1rem] border border-transparent hover:border-clr7 transition-all relative">
          <h3 className="text-[0.8em] font-black uppercase text-clr2 tracking-widest font-bold">Nacimiento</h3>
          <p className="font-bold text-clr5 dark:text-clr1 uppercase text-[1em] absolute bottom-2 right-3">
            {perfil.fecha_nacimiento ? `${perfil.fecha_nacimiento.split('-')[2]}/${perfil.fecha_nacimiento.split('-')[1]}/${perfil.fecha_nacimiento.split('-')[0]}` : ''}
          </p>
          </div>
        <div className="p-3 bg-zinc-50 dark:bg-black/20 rounded-[1rem] border border-transparent hover:border-clr7 transition-all relative col-span-2">
          <h3 className="text-[0.8em] font-black uppercase text-clr2 tracking-widest font-bold">Email Registrado</h3>
          <p className="font-bold text-clr5 dark:text-clr1 text-[0.9em] truncate absolute bottom-2 right-3">{perfil?.email}</p>
        </div>
        <div className="p-3 bg-zinc-50 dark:bg-black/20 rounded-[1rem] border border-transparent hover:border-clr7 transition-all relative">
          <h3 className="text-[0.8em] font-black uppercase text-clr2 tracking-widest font-bold">Estado Cuenta</h3>
          <div className="flex items-center gap-3 absolute bottom-2 right-3">
            <div className={`w-2.5 h-2.5 rounded-full ${perfil?.estado === 'activo' ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`} />
            <span className="font-bold text-clr5 dark:text-clr1 uppercase text-[1em] font-bold">{perfil?.estado}</span>
          </div>
        </div>
      </div>

      {/* INFORMACION DETALLADA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-6">
            <h2 className="text-lg font-black font-display uppercase text-clr5 dark:text-clr1 border-l-4 border-clr7 pl-4 font-bold">Información Personal y Contacto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[1em]">
              <div className="p-3 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                <p className="text-[0.8em] font-bold uppercase opacity-40 font-slab">Dirección</p>
                <p className="text-[0.9em] text-clr5 dark:text-clr9 font-bold">{perfil?.direccion}, {perfil?.comuna}</p>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                <p className="text-[0.8em] font-bold uppercase opacity-40 font-slab">Teléfono Personal</p>
                <p className="text-[0.9em] text-clr5 dark:text-clr9 font-bold">{cleanPhone(perfil?.telefono)}</p>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                <p className="text-[0.8em] font-bold uppercase opacity-40 font-slab">Institución Educacional</p>
                <p className="text-[0.9em] text-clr5 dark:text-clr9 font-bold">{perfil?.colegio || 'No registrado'} ({perfil?.nivel_educacional || 'S/I'})</p>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                <p className="text-[0.8em] font-bold uppercase opacity-40 font-slab">Asignación / Confesión</p>
                <p className="text-[0.9em] text-clr5 dark:text-clr9 capitalize font-bold">{perfil?.sexo} • {perfil?.religion}</p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-lg font-black font-display uppercase text-clr5 dark:text-clr1 border-l-4 border-clr7 pl-4 font-bold">Salud y Dietas</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-[1em]">
              <div className="p-2 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                <p className="text-[0.8em] font-bold uppercase opacity-40 font-slab">Sistema Salud</p>
                <p className="text-[0.9em] text-clr5 dark:text-clr9 font-bold">{perfil?.sistema_salud} {perfil?.detalle_sistema_salud ? `(${perfil?.detalle_sistema_salud})` : ''}</p>
              </div>
              <div className="p-2 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                <p className="text-[0.8em] font-bold uppercase opacity-40 font-slab">Tipo Sangre</p>
                <p className="text-[0.9em] font-bold text-clr5 dark:text-clr2">{perfil?.tipo_sangre || 'S/I'}</p>
              </div>
              <div className="p-2 bg-zinc-50 dark:bg-black/10 rounded-2xl border-l-4 border-red-500 col-span-2">
                <p className="text-[0.8em] font-bold uppercase opacity-40 font-slab">Alergias</p>
                <p className="text-[0.9em] text-clr5 dark:text-clr9 font-bold">{perfil?.alergias || 'Ninguna'}</p>
              </div>
              <div className="col-span-full p-2 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                <p className="text-[0.8em] font-bold uppercase opacity-40 font-slab">Antecedentes Medicos</p>
                <p className="text-[0.9em] text-clr5 dark:text-clr9 font-bold">{perfil?.antecedentes_medicos || 'Sin antecedentes'}</p>
              </div>
              <div className="col-span-full p-2 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                <p className="text-[0.8em] font-bold uppercase opacity-40 font-slab">Tratamientos Medicos</p>
                <p className="text-[0.9em] text-clr5 dark:text-clr9 font-bold">{perfil?.tratamientos_medicos || 'Sin tratamiento'}</p>
              </div>
              <div className="col-span-full p-2 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                <p className="text-[0.8em] font-bold uppercase opacity-40 font-slab">Consumo de Medicamentos</p>
                <p className="text-[0.9em] text-clr5 dark:text-clr9 font-bold">{perfil?.medicamentos || 'Ninguno'}</p>
              </div>
              <div className="col-span-full p-2 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                <p className="text-[0.8em] font-bold uppercase opacity-40 font-slab">Dieta Alimentaria</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {perfil?.dieta_alimentaria?.length > 0 ? perfil.dieta_alimentaria.map((d: string) => (<span key={d} className="px-2 py-0.5 bg-clr7/50 text-clr9 rounded text-[0.8em] uppercase font-bold">{d}</span>)) : <span className="text-[0.8em] italic opacity-40 font-bold">Sin restricciones</span>}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="space-y-6">
            <h2 className="text-lg font-black font-display uppercase text-clr5 dark:text-clr1 border-l-4 border-clr7 pl-4 font-bold">Contactos de Emergencia</h2>
            <div className="space-y-3">
              {(perfil?.contactos_emergencia || []).map((c: any) => (
                <div key={c.id} className="p-2 bg-clr7/5 rounded-2xl border border-clr7/10">
                  <p className="text-[0.8em] font-bold text-clr7 uppercase">{c.nombre}</p>
                  <p className="text-[0.8em] font-bold opacity-60 mt-[-5px]">{c.relacion}</p>
                  <p className="text-[0.9em] text-clr5 dark:text-clr1 text-right font-bold font-inika"><a href={`tel:${cleanPhone(c.telefono)}`} className="text-clr5 dark:text-clr1">{cleanPhone(c.telefono)}</a></p>
                </div>
              ))}
              {(!perfil?.contactos_emergencia || perfil.contactos_emergencia.length === 0) && <p className="text-xs italic opacity-40 p-4">No hay contactos registrados.</p>}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-lg font-black font-display uppercase text-clr5 dark:text-clr1 border-l-4 border-clr7 pl-4 font-bold">Autorizaciones</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                <span className="text-[0.8em] font-bold uppercase opacity-60">Uso de Imagen</span>
                <span className={`text-[0.8em] uppercase font-bold ${perfil?.autoriza_fotos ? 'text-clr6' : 'text-clr7'}`}>{perfil?.autoriza_fotos ? 'Sí' : 'No'}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-black/10 rounded-2xl">
                <span className="text-[0.8em] font-bold uppercase opacity-60">Fe Pública</span>
                <span className={`text-[0.8em] uppercase font-bold ${perfil?.fe_publica ? 'text-clr6' : 'text-clr7'}`}>{perfil?.fe_publica ? 'Sí' : 'No'}</span>
              </div>
            </div>

            {/* LISTA DE DOCUMENTOS FIRMADOS */}
            <div className="mt-6 space-y-3">
              <h3 className="text-[0.8em] font-black uppercase opacity-40 tracking-widest px-2">Documentos Firmados Recientemente</h3>
              {autorizaciones.map(auth => (
                <button 
                  key={auth.id} 
                  onClick={() => onVerAutorizacion(auth)}
                  className="w-full flex justify-between items-center p-4 bg-white dark:bg-clr4 border border-zinc-100 dark:border-zinc-800 rounded-2xl hover:border-clr6 transition-all group"
                >
                  <div className="text-left">
                    <p className="text-[0.85em] font-black uppercase leading-tight group-hover:text-clr6">{auth.actividad_nombre}</p>
                    <p className="text-[0.8em] opacity-40 font-bold">{new Date(auth.fecha_firma).toLocaleDateString('es-CL')}</p>
                  </div>
                  <span className="text-xl group-hover:scale-125 transition-transform">📄</span>
                </button>
              ))}
              {autorizaciones.length === 0 && (
                <div className="p-4 bg-zinc-50 dark:bg-black/5 rounded-2xl border border-dashed text-center">
                  <p className="text-[0.8em] italic opacity-40">No tienes documentos firmados aún.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* ACCIONES RÁPIDAS */}
      <div className="flex flex-wrap gap-4 pt-8 border-t border-zinc-100 dark:border-clr4">
        <button onClick={() => onEdit(perfil)} className="flex-1 min-w-[200px] py-4 bg-clr6 text-white font-black uppercase rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all tracking-widest text-xs font-inika">✏️ Actualizar Mi Ficha</button>
        
        {perfil?.rol_id === 8 && pupilos.length > 0 && (
          <button onClick={() => onGenerateAuth(pupilos[0])} className="flex-1 min-w-[200px] py-4 bg-clr7 text-white font-black uppercase rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all tracking-widest text-xs font-inika">📄 Generar Autorización</button>
        )}

        {isDirigente && (
          <button onClick={onProgramActividad} className="flex-1 min-w-[200px] py-4 bg-clr5 text-white font-black uppercase rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all tracking-widest text-xs font-inika">📅 Programar Actividad</button>
        )}

        <button onClick={() => setShowPassModal(true)} className="flex-1 min-w-[200px] py-4 bg-zinc-200 dark:bg-black/20 text-clr2 font-black uppercase rounded-2xl hover:bg-zinc-300 transition-all tracking-widest text-xs font-inika">🔑 Cambiar Contraseña</button>
      </div>

    </div>
  )
}
