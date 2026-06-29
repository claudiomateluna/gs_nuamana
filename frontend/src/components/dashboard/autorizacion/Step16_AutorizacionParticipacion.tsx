'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface StepProps {
  formData: any
  setFormData: (data: any) => void
  perfil: any
  actividad: any
  apoderadoData?: any
}

const validarRut = (rut: string) => {
  if (!rut) return true; // No validar si está vacío aquí (se maneja con obligatorio en el submit)
  if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rut)) return false
  const [numero, dv] = rut.split('-')
  let sum = 0, mul = 2
  for (let i = numero.length - 1; i >= 0; i--) {
    sum += parseInt(numero[i]) * mul
    mul = mul === 7 ? 2 : mul + 1
  }
  const res = 11 - (sum % 11)
  let expectedDv = res === 11 ? '0' : res === 10 ? 'k' : res.toString()
  return expectedDv === dv.toLowerCase()
}

export default function Step16_AutorizacionParticipacion({ formData, setFormData, perfil, actividad, apoderadoData }: StepProps) {
  const isAdult = perfil.edad >= 18;
  const fechaHoy = format(new Date(), "yyyy-MM-dd");

  const titleStyle = "text-[1.2em] font-black text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8 border-b-2 border-clr7 pb-2";
  const labelContainerStyle = "flex items-center gap-2 mb-1";
  const labelStyle = "text-[0.9em] font-black uppercase text-clr2 tracking-widest block";
  const inputStyle = (isValid: boolean) => `w-full bg-zinc-50 dark:bg-clr3 dark:text-dclr2 border-2 ${!isValid ? 'border-red-500 bg-red-50' : 'border-transparent focus:border-clr7'} rounded-xl p-3 text-[1em] font-bold outline-none transition-all shadow-inner`;
  const disabledInputStyle = "w-full bg-zinc-100 dark:bg-clr3/50 p-3 rounded-xl font-bold text-[1em] dark:text-dclr2 border border-zinc-200 dark:border-clr4 opacity-70 cursor-not-allowed outline-none";
  
  const infoIconContainerStyle = "inline-block";
  const infoIconStyle = "text-clr7 cursor-help text-[1.1em] hover:scale-110 transition-transform flex items-center justify-center";
  const tooltipStyle = "fixed z-[300] left-1/2 -translate-x-1/2 top-1/4 w-[90%] max-w-lg p-6 bg-zinc-800 dark:bg-zinc-900 text-white text-[1em] font-medium leading-relaxed rounded-[2rem] shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 border-2 border-clr7/50 backdrop-blur-md";

  const legalTextAdult = (
    <>
      Al firmar esta autorización, declaro que no he presentado en las últimas 48 horas signos o síntomas compatibles con enfermedades infecciosas o condiciones de salud que pudieran poner en riesgo mi bienestar o el de los demás durante la realización de la actividad. Asimismo, manifiesto que no tengo conocimiento de que me encuentre cursando alguna condición médica que me impida participar de manera segura. 
      <br /><br />
      Entiendo y acepto que la organización de la actividad y/o la Asociación de Guías y Scout de Chile no será responsable por eventuales complicaciones de salud que pudieran derivarse de condiciones preexistentes y/o no informadas, siempre que estas no tengan relación directa con accidentes en la actividad desarrollada. Adicionalmente, declaro que he notificado a mi núcleo familiar, círculo cercano y/o las personas con las que vivo de las actividades que realizaré, el lugar donde se desarrollarán y las fechas de las mismas.
    </>
  );

  const legalTextMinor = (
    <>
      Al firmar esta autorización, declaro que el niño, niña o adolescente que represento no ha presentado en las últimas 48 horas signos o síntomas compatibles con enfermedades infecciosas o condiciones de salud que pudieran poner en riesgo su bienestar o el de los demás durante la realización de la actividad. Asimismo, manifiesto que no tengo conocimiento de que se encuentre cursando alguna condición médica que le impida participar de manera segura. 
      <br /><br />
      Entiendo y acepto que la organización de la actividad y/o la Asociación de Guías y Scout de Chile no será responsable por eventuales complicaciones de salud que pudieran derivarse de condiciones preexistentes y/o no informadas, siempre que estas no tengan relación directa con accidentes en la actividad desarrollada.
    </>
  );

  const medicalAuthText = isAdult 
    ? "Autorizo a quien es responsable de la actividad para que, en caso de urgencia y bajo recomendación de un profesional médico, disponga el tratamiento o intervenciones quirúrgicas que fueran necesarias realizar."
    : "Autorizo a quien es responsable de la actividad para que, en caso de urgencia y bajo recomendación de un profesional médico, disponga el tratamiento o intervenciones quirúrgicas que fueran necesarias realizar al niño, niña o adolescente que represento.";

  const Field = ({ label, info, children, fullWidth = false, error }: any) => {
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
        {error && <p className="text-red-500 text-[0.8em] font-black uppercase tracking-tight pl-2">⚠️ {error}</p>}
      </div>
    );
  };

  const aplicarMascaraRut = (val: string) => {
    let d = val.replace(/[^0-9kK]/g, '').slice(0, 9);
    if (d.length > 1) {
      return d.slice(0, -1) + '-' + d.slice(-1);
    }
    return d;
  };

  const currentRutA = formData.rut_apoderado || apoderadoData?.rut || '';
  const currentRutU = formData.rut_usuario || perfil.rut;
  const isRutAValid = validarRut(currentRutA);
  const isRutUValid = validarRut(currentRutU);

  return (
    <div className="animate-in fade-in duration-500 p-4">
      <h3 className={titleStyle}>16. Autorización de Participación en Actividades</h3>
      
      {/* Datos de la Actividad (Solo Lectura) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-zinc-50 dark:bg-black/10 rounded-2xl border border-clr10 dark:border-clr4">
        <div>
          <span className="text-[0.8em] font-black uppercase text-clr2 tracking-widest block">Nombre de la Actividad</span>
          <p className="font-bold dark:text-dclr2">{actividad?.nombre || '---'}</p>
        </div>
        <div>
          <span className="text-[0.8em] font-black uppercase text-clr2 tracking-widest block">Fechas de la Actividad</span>
          <p className="font-bold dark:text-dclr2">
            {actividad?.fecha_inicio ? format(new Date(actividad.fecha_inicio), "dd/MM/yyyy", { locale: es }) : '---'}
          </p>
        </div>
        <div>
          <span className="text-[0.8em] font-black uppercase text-clr2 tracking-widest block">Lugar de la Actividad</span>
          <p className="font-bold dark:text-dclr2">{actividad?.lugar || '---'}</p>
        </div>
      </div>

      {/* Bloque 1: Declaración de Salud */}
      <div className="p-6 bg-zinc-50 dark:bg-black/20 rounded-3xl border border-clr10 dark:border-clr4 mb-6">
        <div className="text-[0.95em] leading-relaxed italic dark:text-dclr2 text-zinc-700 font-medium">
          {isAdult ? legalTextAdult : legalTextMinor}
        </div>
      </div>

      {/* Bloque 2: Autorización Médica (Nueva Caja) */}
      <div className="p-6 bg-zinc-50 dark:bg-black/20 rounded-3xl border-2 border-clr7/30 mb-8">
        <p className="text-[0.95em] leading-relaxed italic dark:text-dclr2 text-zinc-700 font-bold">
          {medicalAuthText}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Decisión de Participación */}
        <Field 
          fullWidth
          label="¿Autoriza la participación y los tratamientos de urgencia?"
          info="Seleccione SI para confirmar que acepta los términos legales y autoriza los tratamientos médicos de urgencia bajo recomendación médica descritos arriba."
        >
          <div className="flex gap-6">
            {['SI', 'NO'].map(o => {
              const isChecked = formData.autoriza_participacion === o;
              return (
                <label key={o} className={`flex-1 p-3 border-2 rounded-xl text-center cursor-pointer font-bold uppercase text-[0.9em] tracking-widest transition-all ${isChecked ? 'border-clr7 bg-clr7 text-white shadow-lg scale-105' : 'border-zinc-200 dark:border-clr4 dark:text-dclr2'}`}>
                  <input type="radio" checked={isChecked} onChange={() => setFormData({ ...formData, autoriza_participacion: o })} className="hidden" /> {o}
                </label>
              );
            })}
          </div>
        </Field>

        {/* Fecha Actual */}
        <Field label="¿Qué día es hoy?" info="Este valor es referencial para saber en que momento se esta firmando la autorización">
          <input type="date" value={fechaHoy} disabled className={disabledInputStyle} />
        </Field>

        {/* Datos del Apoderado (Solo Menores) */}
        {!isAdult && (
          <>
            <Field 
              label="¿Cuál es el R.U.N. del apoderado?" 
              info="Dinos el R.U.T. o R.U.N. del apoderado"
              error={!isRutAValid && currentRutA ? "RUT Inválido" : null}
            >
              <input 
                type="text" 
                placeholder="12345678-9" 
                value={currentRutA} 
                onChange={(e) => setFormData({ ...formData, rut_apoderado: aplicarMascaraRut(e.target.value) })} 
                className={inputStyle(isRutAValid || !currentRutA)} 
              />
            </Field>
            <Field label="¿Cuál es el nombre del apoderado?" info="Indícanos el nombre de tu apoderado o tutor legar, que será quien firme esta autorización">
              <input 
                type="text" 
                placeholder="Nombre" 
                defaultValue={formData.nombre_apoderado || apoderadoData?.nombres || perfil.nombre_apoderado_contacto || ''} 
                onChange={(e) => setFormData({ ...formData, nombre_apoderado: e.target.value })} 
                className={inputStyle(true)} 
              />
            </Field>
            <Field label="¿Cuáles son los apellidos del apoderado?" info="Indícanos el nombre de tu apoderado o tutor legar, que será quien firme esta autorización">
              <input 
                type="text" 
                placeholder="Apellidos" 
                defaultValue={formData.apellidos_apoderado || apoderadoData?.apellidos || ''} 
                onChange={(e) => setFormData({ ...formData, apellidos_apoderado: e.target.value })} 
                className={inputStyle(true)} 
              />
            </Field>
          </>
        )}

        {/* Datos del Usuario */}
        <Field label="¿Cuál es tu nombre?" info="dinos cuál es el nombre de la persona que asiste a la actividad">
          <input 
            type="text" 
            placeholder="Nombres" 
            defaultValue={formData.nombres_usuario || perfil.nombres} 
            onChange={(e) => setFormData({ ...formData, nombres_usuario: e.target.value })} 
            className={inputStyle(true)} 
          />
        </Field>
        <Field label="¿Cuáles son tus apellidos?" info="dinos cuáles son los apellidos de la persona que asiste a la actividad">
          <input 
            type="text" 
            placeholder="Apellidos" 
            defaultValue={formData.apellidos_usuario || perfil.apellidos} 
            onChange={(e) => setFormData({ ...formData, apellidos_usuario: e.target.value })} 
            className={inputStyle(true)} 
          />
        </Field>
        <Field 
          label="¿Cuál es tú R.U.N.?" 
          info="Escribe el R.U.T. o R.U.N., de la persona que asiste a la actividad"
          error={!isRutUValid && currentRutU ? "RUT Inválido" : null}
        >
          <input 
            type="text" 
            placeholder="12345678-9" 
            value={currentRutU} 
            onChange={(e) => setFormData({ ...formData, rut_usuario: aplicarMascaraRut(e.target.value) })}
            className={inputStyle(isRutUValid || !currentRutU)} 
          />
        </Field>

      </div>
    </div>
  )
}
