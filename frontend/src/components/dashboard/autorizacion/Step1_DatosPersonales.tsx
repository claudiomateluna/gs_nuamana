'use client'

import type { StepProps } from '@/types/autorizacion'

export default function Step1_DatosPersonales({ formData, setFormData, perfil }: StepProps) {
  const titleStyle = "text-[1.2em] font-black text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-4 border-b-2 border-clr7 pb-2";
  const labelContainerStyle = "flex items-center gap-2 mb-1";
  const labelStyle = "text-[0.9em] font-black uppercase text-clr2 tracking-widest block";
  const inputStyle = "w-full bg-zinc-50 dark:bg-clr3 dark:text-dclr2 border-2 border-transparent focus:border-clr7 rounded-xl p-3 text-[1em] font-bold outline-none transition-all shadow-inner";
  const disabledInputStyle = "w-full bg-zinc-100 dark:bg-clr3/50 p-3 rounded-xl font-bold text-[1em] dark:text-dclr2 border border-zinc-200 dark:border-clr4 opacity-70 cursor-not-allowed outline-none";
  
  const infoIconContainerStyle = "inline-block";
  const infoIconStyle = "text-clr7 cursor-help text-[1.1em] hover:scale-110 transition-transform flex items-center justify-center";
  const tooltipStyle = "fixed z-[300] left-1/2 -translate-x-1/2 top-1/4 w-[90%] max-w-lg p-6 bg-zinc-800 dark:bg-zinc-900 text-white text-[1em] font-medium leading-relaxed rounded-[2rem] shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 border-2 border-clr7/50 backdrop-blur-md";

  const nacionalidades = ['Argentina', 'Boliviana', 'Brasileña', 'Chilena', 'Colombiana', 'Costarricense', 'Cubana', 'Ecuatoriana', 'Salvadoreña', 'Guatemalteca', 'Haitiana', 'Hondureña', 'Mexicana', 'Nicaragüense', 'Panameña', 'Paraguaya', 'Peruana', 'Dominicana', 'Uruguaya', 'Venezolana', 'Otra'];

  const Field = ({ label, info, children, fullWidth = false }: { label: string; info: string; children: React.ReactNode; fullWidth?: boolean }) => {
    return (
      <div className={`space-y-1 ${fullWidth ? 'md:col-span-2' : ''}`}>
        <div className={labelContainerStyle}>
          <label className={labelStyle}>{label}</label>
          <div className="group">
            <div className={infoIconContainerStyle}>
              <span className={infoIconStyle}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </span>
            </div>
            <div className={tooltipStyle}>
              <div className="text-clr7 font-black uppercase text-[0.8em] tracking-tight mb-3 border-b border-clr7/30 pb-2 leading-tight">{label}</div>
              <div className="text-[0.95em]">{info}</div>
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-500 p-4">
      <h3 className={titleStyle}>1. Datos Personales</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <Field label="¿Cuál es tu nombre y apellidos?" info="Indica el nombre completo de la persona que esta completando el formulario *Este Dato es Obligatorio">
          <div className="flex gap-2">
            <input type="text" placeholder="Nombres" defaultValue={formData.nombres || perfil.nombres} onChange={(e) => setFormData({ ...formData, nombres: e.target.value })} className={inputStyle} />
            <input type="text" placeholder="Apellidos" defaultValue={formData.apellidos || perfil.apellidos} onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })} className={inputStyle} />
          </div>
        </Field>

        <Field label="¿cuál es tu R.U.N. o R.U.T.?" info="Escribe el R.U.T. o R.U.N., de la persona que asiste a la actividad, sin puntos y con guión y dígito verificador, por ejemplo, 12345678-9.">
          <input type="text" value={perfil.rut} disabled className={disabledInputStyle} />
        </Field>

        <Field label="¿Cuál es tu Nacionalidad?" info="si eres extranjera o extranjero indica tu nacionalidad, por defecto es Chilena.">
          <select defaultValue={formData.nacionalidad || perfil.nacionalidad || 'Chilena'} onChange={(e) => setFormData({ ...formData, nacionalidad: e.target.value })} className={inputStyle}>
            {nacionalidades.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </Field>

        <Field label="¿Cómo te dicen?" info="Dinos como le dicen o como llaman a la persona que esta completando el formulario *Este Dato es Opcional">
          <input type="text" defaultValue={formData.nombre_social || perfil.nombre_social || ''} onChange={(e) => setFormData({ ...formData, nombre_social: e.target.value })} className={inputStyle} />
        </Field>

        <Field fullWidth label="¿Cuál es la asignación Femenina/Masculina entregada al nacer?" info="Selecciona la asignación femenina/masculina entregada al nacer de la persona que está completando el formulario. *Este Dato es Obligatorio">
          <div className="flex gap-6">
            {['Femenina', 'Masculina'].map(s => {
              const isChecked = (formData.sexo || perfil.sexo)?.toLowerCase() === s.toLowerCase();
              return (
                <label key={s} className={`flex-1 p-3 border-2 rounded-xl text-center cursor-pointer font-bold uppercase text-[0.9em] tracking-widest transition-all ${isChecked ? 'border-clr7 bg-clr7 text-white shadow-lg scale-105' : 'border-zinc-200 dark:border-clr4 dark:text-dclr2'}`}>
                  <input type="radio" checked={isChecked} onChange={() => setFormData({ ...formData, sexo: s.toLowerCase() })} className="hidden" /> {s}
                </label>
              );
            })}
          </div>
        </Field>

        <Field label="¿Cuándo Naciste?" info="Ingrese la fecha de nacimiento de la persona que está completando el formulario. *Este Dato es Obligatorio">
          <input type="date" defaultValue={formData.fecha_nacimiento || perfil.fecha_nacimiento || undefined} onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })} className={inputStyle} />
        </Field>

        <Field label="¿Cuál es tu edad?" info="Indica la edad del apersona que está completando el formulario. *Este Dato es Obligatorio">
          <input type="text" value={`${perfil.edad} años`} disabled className={disabledInputStyle} />
        </Field>

        <Field label="¿Cuánto mides actualmente?" info="Indica la estatura en centímetros de la persona que está completando el formulario, ejemplo 165 si mide un metro 65 centímetros. *Este Dato es Obligatorio">
          <input type="number" placeholder="Ej: 165" defaultValue={formData.estatura_m || ''} onChange={(e) => setFormData({ ...formData, estatura_m: e.target.value })} className={inputStyle} />
        </Field>

        <Field label="¿Cuánto pesas actualmente?" info="Indica el peso en kilogramos de la persona que está completando el formulario. *Este Dato es Obligatorio">
          <input type="number" placeholder="Ej: 60" defaultValue={formData.peso_kg || ''} onChange={(e) => setFormData({ ...formData, peso_kg: e.target.value })} className={inputStyle} />
        </Field>

      </div>
    </div>
  )
}
