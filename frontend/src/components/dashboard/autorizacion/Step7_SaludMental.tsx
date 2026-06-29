'use client'

interface StepProps {
  formData: any
  setFormData: (data: any) => void
  perfil: any
}

export default function Step7_SaludMental({ formData, setFormData, perfil }: StepProps) {
  const titleStyle = "text-[1.2em] font-black text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8 border-b-2 border-clr7 pb-2";
  const labelContainerStyle = "flex items-center gap-2 mb-1";
  const labelStyle = "text-[0.9em] font-black uppercase text-clr2 tracking-widest block";
  const inputStyle = "w-full bg-zinc-50 dark:bg-clr3 dark:text-dclr2 border-2 border-transparent focus:border-clr7 rounded-xl p-3 text-[1em] font-bold outline-none transition-all shadow-inner";
  
  const infoIconContainerStyle = "inline-block";
  const infoIconStyle = "text-clr7 cursor-help text-[1.1em] hover:scale-110 transition-transform flex items-center justify-center";
  const tooltipStyle = "fixed z-[300] left-1/2 -translate-x-1/2 top-1/4 w-[90%] max-w-lg p-6 bg-zinc-800 dark:bg-zinc-900 text-white text-[1em] font-medium leading-relaxed rounded-[2rem] shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 border-2 border-clr7/50 backdrop-blur-md";

  // Lógica de visibilidad
  const hasDiagnostico = formData.diagnostico_salud_mental_radio === 'Si' || (formData.diagnostico_salud_mental_radio === undefined && perfil.diagnostico_salud_mental === 'Si');
  const isEnTratamiento = formData.tratamiento_salud_mental_radio === 'Si' || (formData.tratamiento_salud_mental_radio === undefined && perfil.tratamiento_salud_mental === 'Si');
  const hasProfesionalNombre = (formData.profesional_tratante_contacto || perfil.profesional_tratante_contacto || '').trim().length > 0;

  const aplicarMascaraTelefono = (valor: string) => {
    let v = valor.replace(/\D/g, ''); if (v.startsWith('56')) v = v.substring(2); if (v.length > 9) v = v.substring(0, 9);
    let formatted = '+56 '; if (v.length > 0) formatted += v.substring(0, 1) + ' '; if (v.length > 1) formatted += v.substring(1, 5) + ' '; if (v.length > 5) formatted += v.substring(5, 9);
    return v.length === 0 ? '' : formatted.trim();
  };

  const FieldInfo = ({ label, info }: any) => (
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
          <div className="text-[0.95em]" dangerouslySetInnerHTML={{ __html: info }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 overflow-x-hidden p-4">
      <h3 className={titleStyle}>7. Antecedentes de Salud Mental</h3>
      
      <div className="space-y-4">
        
        {/* Item 1: ¿Diagnóstico? */}
        <div className="space-y-2">
          <FieldInfo 
            label="¿Tienes un diagnostico de Salud Mental?" 
            info="Cuéntanos si tienes un diagnostico de salud mental, selecciona la opción que corresponda" 
          />
          <div className="flex gap-2">
            {['Si', 'No'].map(o => {
              const isChecked = (o === 'Si' && hasDiagnostico) || (o === 'No' && !hasDiagnostico);
              return (
                <label key={o} className={`flex-1 p-3 border-2 rounded-xl text-center cursor-pointer font-bold uppercase text-[0.9em] tracking-widest transition-all ${isChecked ? 'border-clr7 bg-clr7 text-white shadow-lg' : 'border-zinc-100 dark:border-clr4 dark:text-dclr2'}`}>
                  <input type="radio" checked={isChecked} onChange={() => setFormData({ ...formData, diagnostico_salud_mental_radio: o, diagnostico_salud_mental: o })} className="hidden" /> {o}
                </label>
              );
            })}
          </div>
        </div>

        {/* Bloque dependiente de Diagnóstico */}
        {hasDiagnostico && (
          <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
            
            {/* Item 2: Especifica Diagnóstico */}
            <div className="space-y-1">
              <FieldInfo 
                label="¿Qué diagnostico de salud mental te dieron?" 
                info="Dinos cuál fue el diagnostico de salud mental que te dieron" 
              />
              <input 
                type="text" 
                defaultValue={formData.detalle_salud_mental || perfil.detalle_salud_mental || ''} 
                onChange={(e) => setFormData({ ...formData, detalle_salud_mental: e.target.value })} 
                placeholder="Escriba aquí..."
                className={inputStyle}
              />
            </div>

            {/* Item 3: ¿Está en tratamiento? */}
            <div className="space-y-4">
              <FieldInfo 
                label="¿Está en un tratamiento de salud mental actualmente?" 
                info="Seleccione la opción que indique si esta o no en un tratamiento de salud mental actualmente" 
              />
              <div className="flex gap-2">
                {['Si', 'No'].map(o => {
                  const isChecked = (o === 'Si' && isEnTratamiento) || (o === 'No' && !isEnTratamiento);
                  return (
                    <label key={o} className={`flex-1 p-2 border-2 rounded-xl text-center cursor-pointer font-bold uppercase text-[0.9em] tracking-widest transition-all ${isChecked ? 'border-clr7 bg-clr7 text-white shadow-lg' : 'border-zinc-100 dark:border-clr4 dark:text-dclr2'}`}>
                      <input type="radio" checked={isChecked} onChange={() => setFormData({ ...formData, tratamiento_salud_mental_radio: o, tratamiento_salud_mental: o })} className="hidden" /> {o}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Item 4: Medicamentos */}
            <div className="space-y-1">
              <FieldInfo 
                label="¿Estás consumiendo algún medicamento?" 
                info="Indique si está consumiendo algún Tipo de medicamento <br></br><br></br>(**indique cual y su horario**) <br></br><br></br>Si no consume, por favor escriba <b>No Consume</b>.<br></br><br></br><span class='font-black text-clr7'>* Este campo es obligatorio</span>" 
              />
              <textarea 
                defaultValue={formData.medicamentos || perfil.medicamentos || ''}
                onChange={(e) => setFormData({ ...formData, medicamentos: e.target.value })}
                placeholder="Detalle de medicamentos de salud mental..."
                className={`${inputStyle} h-32 resize-none`}
              />
            </div>

            {/* Bloque dependiente de Tratamiento */}
            {isEnTratamiento && (
              <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                
                {/* Item 5: Profesional Tratante */}
                <div className="space-y-1">
                  <FieldInfo 
                    label="¿Cómo se llama el profesional que esta llevando el tratamiento de salud mental?" 
                    info="Cuentanos cómo se llama el profesional que esta dirigiendo el tratamiento de salud mental" 
                  />
                  <input 
                    type="text" 
                    defaultValue={formData.profesional_tratante_contacto || perfil.profesional_tratante_contacto || ''} 
                    onChange={(e) => setFormData({ ...formData, profesional_tratante_contacto: e.target.value })} 
                    placeholder="Nombre del médico o terapeuta"
                    className={inputStyle}
                  />
                </div>

                {/* Item 6: Contacto Profesional */}
                {hasProfesionalNombre && (
                  <div className="space-y-1 animate-in zoom-in-95 duration-300">
                    <FieldInfo 
                      label="¿Cuál es el telefono del profesional tratante?" 
                      info="Cuentanos cuál es el teléfono del profesional que esta llevando el tratamiento de salud mental" 
                    />
                    <input 
                      type="tel" 
                      value={formData.salud_mental_contacto || ''} 
                      onChange={(e) => setFormData({ ...formData, salud_mental_contacto: aplicarMascaraTelefono(e.target.value) })} 
                      placeholder="+56 9 1234 5678"
                      className={inputStyle}
                    />
                  </div>
                )}

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  )
}
