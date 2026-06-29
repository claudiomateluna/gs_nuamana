'use client'

interface StepProps {
  formData: any
  setFormData: (data: any) => void
  perfil: any
}

export default function Step13_SaludDental({ formData, setFormData, perfil }: StepProps) {
  const titleStyle = "text-[1.2em] font-black text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8 border-b-2 border-clr7 pb-2";
  const labelContainerStyle = "flex items-center gap-2 mb-1";
  const labelStyle = "text-[0.9em] font-black uppercase text-clr2 tracking-widest block";
  const inputStyle = "w-full bg-zinc-50 dark:bg-clr3 dark:text-dclr2 border-2 border-transparent focus:border-clr7 rounded-xl p-3 text-[1em] font-bold outline-none transition-all shadow-inner";
  
  const infoIconContainerStyle = "inline-block";
  const infoIconStyle = "text-clr7 cursor-help text-[1.1em] hover:scale-110 transition-transform flex items-center justify-center";
  const tooltipStyle = "fixed z-[300] left-1/2 -translate-x-1/2 top-1/4 w-[90%] max-w-lg p-6 bg-zinc-800 dark:bg-zinc-900 text-white text-[1em] font-medium leading-relaxed rounded-[2rem] shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 border-2 border-clr7/50 backdrop-blur-md";

  // Lógica de visibilidad
  const isEnTratamientoDental = formData.tratamiento_dental_radio === 'Si' || (formData.tratamiento_dental_radio === undefined && perfil.tratamiento_dental_bool === true);

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
      <h3 className={titleStyle}>13. ANTECEDENTES DENTALES</h3>
      
      <div className="space-y-4">
        
        {/* Item 1: Último control */}
        <div className="space-y-1">
          <FieldInfo 
            label="¿Cuándo fue tu último control dental?" 
            info="Indícanos en que fecha tuviste tu último control dentala" 
          />
          <input 
            type="date" 
            defaultValue={formData.ultimo_control_dental || perfil.ultimo_control_dental || ''} 
            onChange={(e) => setFormData({ ...formData, ultimo_control_dental: e.target.value })} 
            className={inputStyle}
          />
        </div>

        {/* Item 2: ¿Tratamiento en curso? */}
        <div className="space-y-6">
          <div className="space-y-4">
            <FieldInfo 
              label="¿Tienes algún tratamiento dental en curso?" 
              info="Cuéntanos si actualmente estas con algún tratamiento dental" 
            />
            <div className="flex gap-4">
              {['Si', 'No'].map(o => {
                const isChecked = (o === 'Si' && isEnTratamientoDental) || (o === 'No' && !isEnTratamientoDental);
                return (
                  <label key={o} className={`flex-1 p-3 border-2 rounded-xl text-center cursor-pointer font-bold uppercase text-[0.9em] tracking-widest transition-all ${isChecked ? 'border-clr7 bg-clr7 text-white shadow-lg scale-105' : 'border-zinc-100 dark:border-clr4 dark:text-dclr2'}`}>
                    <input type="radio" name="dental_radio" checked={isChecked} onChange={() => setFormData({ ...formData, tratamiento_dental_radio: o, tratamiento_dental_bool: o === 'Si' })} className="hidden" /> {o}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Item 3: Especifique (Condicional) */}
          {isEnTratamientoDental && (
            <div className="animate-in slide-in-from-top-4 duration-500 space-y-1">
              <FieldInfo 
                label="¿Qué tratamiento dental estas llevando a cabo?" 
                info="Por favor detallanos el tratamiento dental que estas haciendo en este momento" 
              />
              <input 
                type="text" 
                defaultValue={formData.tratamiento_dental_detalle || perfil.especifique_tratamiento_dental || ''} 
                onChange={(e) => setFormData({ ...formData, tratamiento_dental_detalle: e.target.value })} 
                placeholder="Ej: Ortodoncia, endodoncia..."
                className={inputStyle}
              />
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
