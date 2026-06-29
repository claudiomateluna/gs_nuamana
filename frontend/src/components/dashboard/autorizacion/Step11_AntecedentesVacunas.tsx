'use client'

interface StepProps {
  formData: any
  setFormData: (data: any) => void
  perfil: any
}

export default function Step11_AntecedentesVacunas({ formData, setFormData, perfil }: StepProps) {
  const titleStyle = "text-[1.2em] font-black text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8 border-b-2 border-clr7 pb-2";
  const labelContainerStyle = "flex items-center gap-2 mb-1";
  const labelStyle = "text-[0.9em] font-black uppercase text-clr2 tracking-widest block";
  const inputStyle = "w-full bg-zinc-50 dark:bg-clr3 dark:text-dclr2 border-2 border-transparent focus:border-clr7 rounded-xl p-3 text-[1em] font-bold outline-none transition-all shadow-inner";
  
  const infoIconContainerStyle = "inline-block";
  const infoIconStyle = "text-clr7 cursor-help text-[1.1em] hover:scale-110 transition-transform flex items-center justify-center";
  const tooltipStyle = "fixed z-[300] left-1/2 -translate-x-1/2 top-1/4 w-[90%] max-w-lg p-6 bg-zinc-800 dark:bg-zinc-900 text-white text-[1em] font-medium leading-relaxed rounded-[2rem] shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 border-2 border-clr7/50 backdrop-blur-md";

  // Lógica de visibilidad
  const hasVacunasPni = formData.vacunas_al_dia_radio === 'Si' || (formData.vacunas_al_dia_radio === undefined && perfil.vacunas_al_dia === true);
  const hasOtrasVacunas = formData.vacunas_extra_radio === 'Si' || (formData.vacunas_extra_radio === undefined && (perfil.vacunas_extra || '').length > 0);

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
    <div className="animate-in fade-in duration-500 overflow-x-hidden p-4 pb-10">
      <h3 className={titleStyle}>11. ANTECEDENTES DE VACUNAS</h3>
      
      <div className="space-y-4">
        
        {/* Item 1: PNI al día */}
        <div className="space-y-4">
          <FieldInfo 
            label="¿Tiene las vacunas del Plan Nacional de Inmunización al día?" 
            info="Marca la opción para indicar si tienes o no las vacunas al día con respecto al plan nacional de vacunación" 
          />
          <div className="flex gap-4">
            {['Si', 'No'].map(o => {
              const isChecked = (o === 'Si' && hasVacunasPni) || (o === 'No' && !hasVacunasPni);
              return (
                <label key={o} className={`flex-1 p-3 border-2 rounded-xl text-center cursor-pointer font-bold uppercase text-[0.9em] tracking-widest transition-all ${isChecked ? 'border-clr7 bg-clr7 text-white shadow-lg scale-105' : 'border-zinc-200 dark:border-clr4 dark:text-dclr2'}`}>
                  <input type="radio" name="pni_radio" checked={isChecked} onChange={() => setFormData({ ...formData, vacunas_al_dia_radio: o, vacunas_al_dia: o === 'Si' })} className="hidden" /> {o}
                </label>
              );
            })}
          </div>
        </div>

        {/* Item 2: ¿Otras vacunas? */}
        <div className="space-y-3">
          <div className="space-y-2">
            <FieldInfo 
              label="¿Ha recibido otra vacuna?" 
              info="Indícanos si has recibido alguna otra vacuna, por ejemplo, refuerzo antitetánica, antirrábica, fiebre amarilla, etc." 
            />
            <div className="flex gap-4">
              {['Si', 'No'].map(o => {
                const isChecked = (o === 'Si' && hasOtrasVacunas) || (o === 'No' && !hasOtrasVacunas);
                return (
                  <label key={o} className={`flex-1 p-3 border-2 rounded-xl text-center cursor-pointer font-bold uppercase text-[0.9em] tracking-widest transition-all ${isChecked ? 'border-clr7 bg-clr7 text-white shadow-lg scale-105' : 'border-zinc-200 dark:border-clr4 dark:text-dclr2'}`}>
                    <input type="radio" name="extra_radio" checked={isChecked} onChange={() => setFormData({ ...formData, vacunas_extra_radio: o })} className="hidden" /> {o}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Item 3: Especifique (Condicional) */}
          {hasOtrasVacunas && (
            <div className="animate-in slide-in-from-top-4 duration-500 space-y-1">
              <FieldInfo 
                label="¿Qué otra vacuna has recibido?" 
                info="Danos el detalle sobre las otras vacunas que has recibido" 
              />
              <input 
                type="text" 
                defaultValue={formData.vacunas_extra || perfil.vacunas_extra || ''} 
                onChange={(e) => setFormData({ ...formData, vacunas_extra: e.target.value })} 
                placeholder="Ej: Fiebre amarilla, COVID..."
                className={inputStyle}
              />
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
