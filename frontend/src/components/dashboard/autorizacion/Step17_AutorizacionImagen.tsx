'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface StepProps {
  formData: any
  setFormData: (data: any) => void
  perfil: any
  apoderadoData?: any
}

const validarRut = (rut: string) => {
  if (!rut) return true;
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

export default function Step17_AutorizacionImagen({ formData, setFormData, perfil, apoderadoData }: StepProps) {
  const isAdult = perfil.edad >= 18;
  const fechaHoyStr = format(new Date(), "dd/MM/yyyy", { locale: es });
  const fechaHoyISO = format(new Date(), "yyyy-MM-dd");

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
      Esto incluye el uso de mi imagen y voz para promover, difundir y documentar las actividades, eventos y programas de la AGSCh y Guías y Scouts Nua Mana. Mi imagen y voz podrán ser utilizadas en materiales informativos, educativos, promocionales, comerciales o para cualquier otro fin que la AGSCh y Guías y Scouts Nua Mana estime conveniente, sin limitación de tiempo o de territorios. Esto incluye, pero no se limita a, impresiones, publicaciones digitales, sitios web, redes sociales y otros medios o/y plataformas, actuales o futuros.
      <br /><br />
      Reconozco y acepto que la AGSCh y Guías y Scouts Nua Mana tiene el derecho de editar, modificar, adaptar y alterar el material audiovisual y gráfico de acuerdo con sus necesidades, respetando siempre los principios de moral y buenas costumbres. Entiendo que la AGSCh y Guías y Scouts Nua Mana pueden optar por no utilizar el material capturado o utilizar solo una parte de este, y que no tengo derecho a recibir compensación económica alguna por el uso de dicho material. Aunque la autorización es amplia, tengo el derecho de solicitar la eliminación de mi imagen y voz de futuros materiales mediante notificación escrita a quien corresponda en Guías y Scouts Nua Mana y la AGSCh (Nivel Grupal, Distrital, Zonal o Nacional), quien procederá a efectuar la eliminación en un plazo razonable.
      <br /><br />
      Declaro que he leído y comprendido en su totalidad el contenido de este documento y confirmo que soy mayor de edad con capacidad legal para otorgar esta autorización.
    </>
  );

  const legalTextMinor = (
    <>
      Esto incluye el uso de la imagen y la voz de la persona menor de edad para promover, difundir y documentar las actividades, eventos y programas de la AGSCh y Guías y Scouts Nua Mana. La imagen y voz podrán ser utilizadas en materiales informativos, educativos, promocionales, comerciales o para cualquier otro fin que la AGSCh y Guías y Scouts Nua Mana estime conveniente, sin limitación de tiempo o de territorios. Esto incluye, pero no se limita a, impresiones, publicaciones digitales, sitios web, redes sociales y otros medios o plataformas, actuales o futuros.
      <br /><br />
      Declaro que la o el menor de edad ha sido informado sobre esta autorización, que asiente y se encuentra de acuerdo con la utilización de su imagen y voz.
      <br /><br />
      Reconozco y acepto que la AGSCh y Guías y Scouts Nua Mana tiene el derecho de editar, modificar, adaptar y alterar el material audiovisual y gráfico de acuerdo con sus necesidades, respetando siempre los principios de moral y buenas costumbres. Entiendo que la AGSCh y Guías y Scouts Nua Mana puede optar por no utilizar el material capturado o utilizar solo una parte de este, y que no tengo derecho a recibir compensación económica alguna por el uso de dicho material. Aunque la autorización es amplia, tengo el derecho de solicitar la eliminación de la imagen y voz de la persona menor de edad de futuros materiales mediante notificación escrita a quien corresponda en Guías y Scouts Nua Mana y la AGSCh (Nivel Grupal, Distrital, Zonal o Nacional), quien procederá a efectuar la eliminación en un plazo razonable.
      <br /><br />
      Declaro que he leído y comprendido en su totalidad el contenido de este documento y confirmo que soy la tutora o el tutor legal, de la persona menor de edad mencionada, con la capacidad legal para otorgar esta autorización.
    </>
  );

  const aplicarMascaraRut = (val: string) => {
    let d = val.replace(/[^0-9kK]/g, '').slice(0, 9);
    if (d.length > 1) {
      return d.slice(0, -1) + '-' + d.slice(-1);
    }
    return d;
  };

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

  const valNombreU = formData.nombres_usuario_img || perfil.nombres;
  const valApellidosU = formData.apellidos_usuario_img || perfil.apellidos;
  const valRutU = formData.rut_usuario_img || perfil.rut;
  const valNombreA = formData.nombre_apoderado_img || apoderadoData?.nombres || perfil.nombre_apoderado_contacto || '';
  const valApellidosA = formData.apellidos_apoderado_img || apoderadoData?.apellidos || '';
  const valRutA = formData.rut_apoderado_img || apoderadoData?.rut || '';

  const isRutUValid = validarRut(valRutU);
  const isRutAValid = validarRut(valRutA);

  const dynamicQuestion = isAdult
    ? `Con fecha ${fechaHoyStr}, Yo ${valNombreU} ${valApellidosU} RUN ${valRutU} Autorizo voluntariamente a la Asociación de Guías y Scouts de Chile (AGSCh), a Guías y Scouts Nua Mana y a sus representantes, personas voluntarias y/o personal remunerado autorizados por esta, a capturar, difundir, reproducir y utilizar mi imagen y mi voz en fotografías, videos, grabaciones u otros medios visuales o sonoros.`
    : `Con fecha ${fechaHoyStr}, Yo ${valNombreA} ${valApellidosA} RUN ${valRutA} Apoderada, apoderado, tutor o tutora legal de ${valNombreU} ${valApellidosU} RUN ${valRutU} Autorizo voluntariamente a la Asociación de Guías y Scouts de Chile (AGSCh), a Guías y Scouts Nua Mana y a sus representantes, personas voluntarias y/o personal remunerado autorizados por esta, a capturar, difundir, reproducir y utilizar la imagen y la voz del o de la menor de edad en fotografías, videos, grabaciones u otros medios visuales o sonoros.`;

  return (
    <div className="animate-in fade-in duration-500 p-4">
      <h3 className={titleStyle}>17. Autorización de Uso de Imagen y Voz</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Fecha Actual */}
        <Field label="¿Qué día es hoy?" info="Este valor es referencial para saber en que momento se esta firmando la autorización">
          <input type="date" value={fechaHoyISO} disabled className={disabledInputStyle} />
        </Field>

        {/* Datos del Apoderado (Solo Menores) */}
        {!isAdult && (
          <>
            <Field 
              label="¿Cuál es el R.U.N. del apoderado?" 
              info="Dinos el R.U.T. o R.U.N. del apoderado"
              error={!isRutAValid && valRutA ? "RUT Inválido" : null}
            >
              <input 
                type="text" 
                placeholder="12345678-9" 
                value={valRutA} 
                onChange={(e) => setFormData({ ...formData, rut_apoderado_img: aplicarMascaraRut(e.target.value) })} 
                className={inputStyle(isRutAValid || !valRutA)} 
              />
            </Field>
            <Field label="¿Cuál es el nombre del apoderado?" info="Indícanos el nombre de tu apoderado o tutor legar, que será quien firme esta autorización">
              <input 
                type="text" 
                placeholder="Nombre" 
                defaultValue={valNombreA} 
                onChange={(e) => setFormData({ ...formData, nombre_apoderado_img: e.target.value })} 
                className={inputStyle(true)} 
              />
            </Field>
            <Field label="¿Cuáles son los apellidos del apoderado?" info="Indícanos el nombre de tu apoderado o tutor legar, que será quien firme esta autorización">
              <input 
                type="text" 
                placeholder="Apellidos" 
                defaultValue={valApellidosA} 
                onChange={(e) => setFormData({ ...formData, apellidos_apoderado_img: e.target.value })} 
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
            defaultValue={valNombreU} 
            onChange={(e) => setFormData({ ...formData, nombres_usuario_img: e.target.value })} 
            className={inputStyle(true)} 
          />
        </Field>
        <Field label="¿Cuáles son tus apellidos?" info="dinos cuáles son los apellidos de la persona que asiste a la actividad">
          <input 
            type="text" 
            placeholder="Apellidos" 
            defaultValue={valApellidosU} 
            onChange={(e) => setFormData({ ...formData, apellidos_usuario_img: e.target.value })} 
            className={inputStyle(true)} 
          />
        </Field>
        <Field 
          label="¿Cuál es tú R.U.N.?" 
          info="Escribe el R.U.T. o R.U.N., de la persona que asiste a la actividad"
          error={!isRutUValid && valRutU ? "RUT Inválido" : null}
        >
          <input 
            type="text" 
            placeholder="12345678-9" 
            value={valRutU} 
            onChange={(e) => setFormData({ ...formData, rut_usuario_img: aplicarMascaraRut(e.target.value) })} 
            className={inputStyle(isRutUValid || !valRutU)} 
          />
        </Field>
      </div>

      {/* Control de Decisión (Pregunta Dinámica) */}
      <Field 
        fullWidth
        label="Decisión de Uso de Imagen"
        info="Seleccione SI para autorizar el uso de imagen y voz bajo las condiciones descritas en el texto legal."
      >
        <div className="p-6 bg-zinc-50 dark:bg-black/20 rounded-3xl border-2 border-clr7/30 mb-6">
          <p className="text-[0.95em] leading-relaxed italic dark:text-dclr2 text-zinc-700 font-bold text-center">
            {dynamicQuestion}
          </p>
        </div>
        <div className="flex gap-6">
          {['SI', 'NO'].map(o => {
            const isChecked = formData.autoriza_imagen === o;
            return (
              <label key={o} className={`flex-1 p-3 border-2 rounded-xl text-center cursor-pointer font-bold uppercase text-[0.9em] tracking-widest transition-all ${isChecked ? 'border-clr7 bg-clr7 text-white shadow-lg scale-105' : 'border-zinc-200 dark:border-clr4 dark:text-dclr2'}`}>
                <input type="radio" checked={isChecked} onChange={() => setFormData({ ...formData, autoriza_imagen: o })} className="hidden" /> {o}
              </label>
            );
          })}
        </div>
      </Field>

      {/* Texto Legal (Informativo) */}
      <div className="mt-8 p-6 bg-zinc-50 dark:bg-black/20 rounded-3xl border border-clr10 dark:border-clr4">
        <div className="text-[0.9em] leading-relaxed italic dark:text-dclr2 text-zinc-600 font-medium">
          {isAdult ? legalTextAdult : legalTextMinor}
        </div>
      </div>
    </div>
  )
}
