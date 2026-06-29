'use client'

interface StepProps {
  formData: any
  setFormData: (data: any) => void
  perfil: any
}

export default function Step9_CondicionesRecientes({ formData, setFormData, perfil }: StepProps) {
  const titleStyle = "text-[1.2em] font-black text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8 border-b-2 border-clr7 pb-2";
  const labelContainerStyle = "flex items-center gap-2 mb-1";
  const labelStyle = "text-[0.9em] font-black uppercase text-clr2 tracking-widest block";
  const inputStyle = "w-full bg-zinc-50 dark:bg-clr3 dark:text-dclr2 border-2 border-transparent focus:border-clr7 rounded-xl p-3 text-[1em] font-bold outline-none transition-all shadow-inner";
  
  const infoIconContainerStyle = "inline-block";
  const infoIconStyle = "text-clr7 cursor-help text-[1.1em] hover:scale-110 transition-transform flex items-center justify-center";
  const tooltipStyle = "fixed z-[300] left-1/2 -translate-x-1/2 top-1/4 w-[90%] max-w-lg p-6 bg-zinc-800 dark:bg-zinc-900 text-white text-[1em] font-medium leading-relaxed rounded-[2rem] shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 border-2 border-clr7/50 backdrop-blur-md";

  // Lógica de visibilidad
  const hasMalestares = formData.malestares_recientes_radio === 'Si' || (formData.malestares_recientes_radio === undefined && perfil.malestares_recientes_bool === true);
  const isEnTratamientoReciente = formData.tratamiento_reciente_radio === 'Si' || (formData.tratamiento_reciente_radio === undefined && perfil.tratamiento_reciente_bool === true);

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
      <h3 className={titleStyle}>9. CONDICIONES RECIENTES</h3>
      
      <div className="space-y-4">
        
        {/* Item 1: Malestares 2 semanas */}
        <div className="space-y-2">
          <FieldInfo 
            label="¿Ha tenido malestares en las últimas 2 semanas? (dolor, fiebre, etc)" 
            info="Cuéntanos si has tenido algún malestar recientemente (dolor, fiebre, etc)" 
          />
          <div className="flex gap-2">
            {['Si', 'No'].map(o => {
              const isChecked = (o === 'Si' && hasMalestares) || (o === 'No' && !hasMalestares);
              return (
                <label key={o} className={`flex-1 p-2 border-2 rounded-xl text-center cursor-pointer font-bold uppercase text-[0.9em] tracking-widest transition-all ${isChecked ? 'border-clr7 bg-clr7 text-white shadow-lg' : 'border-zinc-100 dark:border-clr4 dark:text-dclr2'}`}>
                  <input type="radio" name="malestar_radio" checked={isChecked} onChange={() => setFormData({ ...formData, malestares_recientes_radio: o, malestares_recientes_bool: o === 'Si' })} className="hidden" /> {o}
                </label>
              );
            })}
          </div>
        </div>

        {/* Bloque dependiente de Malestares */}
        {hasMalestares && (
          <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
            
            {/* Item 2: Especifique malestar */}
            <div className="space-y-1">
              <FieldInfo 
                label="¿Qué malestares has tenido en las últimas 2 semanas?" 
                info="Por favor detalla los malestares recientes que haz tenido" 
              />
              <input 
                type="text" 
                defaultValue={formData.malestares_recientes_detalle || perfil.malestares_recientes || ''} 
                onChange={(e) => setFormData({ ...formData, malestares_recientes_detalle: e.target.value })} 
                placeholder="Dolor de cabeza, fiebre, etc..."
                className={inputStyle}
              />
            </div>

            {/* Item 3: ¿En tratamiento? */}
            <div className="space-y-4">
              <FieldInfo 
                label="¿Estás en tratamiento actualmente?" 
                info="Cuéntanos si actualmente estas en tratamiento por los malestares que nos indicaste antes" 
              />
              <div className="flex gap-2">
                {['Si', 'No'].map(o => {
                  const isChecked = (o === 'Si' && isEnTratamientoReciente) || (o === 'No' && !isEnTratamientoReciente);
                  return (
                    <label key={o} className={`flex-1 p-2 border-2 rounded-xl text-center cursor-pointer font-bold uppercase text-[0.9em] tracking-widest transition-all ${isChecked ? 'border-clr7 bg-clr7 text-white shadow-lg' : 'border-zinc-100 dark:border-clr4 dark:text-dclr2'}`}>
                      <input type="radio" name="tratamiento_radio" checked={isChecked} onChange={() => setFormData({ ...formData, tratamiento_reciente_radio: o, tratamiento_reciente_bool: o === 'Si' })} className="hidden" /> {o}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Bloque dependiente de Tratamiento */}
            {isEnTratamientoReciente && (
              <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                
                {/* Item 4: Fecha Inicio */}
                <div className="space-y-1">
                  <FieldInfo 
                    label="¿En que fecha inicio el tratamiento?" 
                    info="Cuéntanos en que fecha se inicio el tratamiento que indicaste antes" 
                  />
                  <input 
                    type="date" 
                    defaultValue={formData.tratamiento_reciente_fecha || perfil.inicio_tratamiento_reciente || ''} 
                    onChange={(e) => setFormData({ ...formData, tratamiento_reciente_fecha: e.target.value })} 
                    className={inputStyle}
                  />
                </div>

                {/* Item 5: Medicamentos del malestar */}
                <div className="space-y-1">
                  <FieldInfo 
                    label="¿Qué medicamento? ¿En que horario? y ¿Cuál es la dosis del medicamento?" 
                    info="Cuéntanos en detalle el tratamiento, dinos el medicamento, la dosis del medicamento y el horario en que lo tomas" 
                  />
                  <input 
                    type="text" 
                    defaultValue={formData.tratamiento_reciente_medicamentos || perfil.medicamentos_malestar || ''} 
                    onChange={(e) => setFormData({ ...formData, tratamiento_reciente_medicamentos: e.target.value })} 
                    placeholder="Medicamento, dosis, horario..."
                    className={inputStyle}
                  />
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  )
}
