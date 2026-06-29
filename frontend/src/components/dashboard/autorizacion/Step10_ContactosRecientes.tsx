'use client'

interface StepProps {
  formData: any
  setFormData: (data: any) => void
  perfil: any
}

export default function Step10_CondicionesRecientes({ formData, setFormData, perfil }: StepProps) {
  const titleStyle = "text-[1.2em] font-black text-clr5 dark:text-dclr2 uppercase mb-4 border-b-2 border-clr7 pb-2";
  const labelContainerStyle = "flex items-center gap-2 mb-1";
  const labelStyle = "text-[0.9em] font-black uppercase text-clr2 tracking-widest block";
  const inputStyle = "w-full bg-zinc-50 dark:bg-clr3 dark:text-dclr2 border-2 border-transparent focus:border-clr7 rounded-xl p-3 text-[1em] font-bold outline-none transition-all shadow-inner";
  
  const infoIconContainerStyle = "inline-block";
  const infoIconStyle = "text-clr7 cursor-help text-[1.1em] hover:scale-110 transition-transform flex items-center justify-center";
  const tooltipStyle = "fixed z-[300] left-1/2 -translate-x-1/2 top-1/4 w-[90%] max-w-lg p-6 bg-zinc-800 dark:bg-zinc-900 text-white text-[1em] font-medium leading-relaxed rounded-[2rem] shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 border-2 border-clr7/50 backdrop-blur-md";

  // Lógica de visibilidad
  const hasExposicion = formData.contacto_infecto_radio === 'Si' || (formData.contacto_infecto_radio === undefined && perfil.contacto_infecto === true);
  const hasViajado = formData.viajes_extranjero_radio === 'Si' || (formData.viajes_extranjero_radio === undefined && perfil.viajes_extranjero_bool === true);

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
      <h3 className={titleStyle}>10. CONTACTO RECIENTE CON ENFERMEDADES INFECTOCONTAGIOSAS</h3>
      
      <div className="space-y-4">
        
        {/* PARTE 1: EXPOSICIÓN */}
        <div className="space-y-3">
          <div className="space-y-2">
            <FieldInfo 
              label="¿Has estado expuesto de manera reciente a enfermedades infectocontagiosas?" 
              info="Dinos si has tenido contacto reciente con alguna persona que este enferma" 
            />
            <div className="flex gap-4">
              {['Si', 'No'].map(o => {
                const isChecked = (o === 'Si' && hasExposicion) || (o === 'No' && !hasExposicion);
                return (
                  <label key={o} className={`flex-1 p-3 border-2 rounded-xl text-center cursor-pointer font-bold uppercase text-[0.9em] tracking-widest transition-all ${isChecked ? 'border-clr7 bg-clr7 text-white shadow-lg scale-105' : 'border-zinc-100 dark:border-clr4 dark:text-dclr2'}`}>
                    <input type="radio" name="infecto_radio" checked={isChecked} onChange={() => setFormData({ ...formData, contacto_infecto_radio: o, contacto_infecto: o === 'Si' })} className="hidden" /> {o}
                  </label>
                );
              })}
            </div>
          </div>

          {hasExposicion && (
            <div className="animate-in slide-in-from-top-4 duration-500 space-y-1">
              <FieldInfo 
                label="¿A que enfermedad estuviste expuesto o tuviste contacto?" 
                info="Cuéntanos el detalle de la enfermedad con la que tuviste contacto o estuviste expuesto" 
              />
              <input 
                type="text" 
                defaultValue={formData.contacto_infecto_detalle || perfil.contacto_infecto_detalle || ''} 
                onChange={(e) => setFormData({ ...formData, contacto_infecto_detalle: e.target.value })} 
                placeholder="Nombre de la enfermedad..."
                className={inputStyle}
              />
            </div>
          )}
        </div>

        {/* PARTE 2: VIAJES */}
        <div className="space-y-3">
          <div className="space-y-2">
            <FieldInfo 
              label="¿Ha viajado al extranjero el último año?" 
              info="Cuéntanos si has hecho algún viaje al extranjero en el último año" 
            />
            <div className="flex gap-4">
              {['Si', 'No'].map(o => {
                const isChecked = (o === 'Si' && hasViajado) || (o === 'No' && !hasViajado);
                return (
                  <label key={o} className={`flex-1 p-3 border-2 rounded-xl text-center cursor-pointer font-bold uppercase text-[0.9em] tracking-widest transition-all ${isChecked ? 'border-clr7 bg-clr7 text-white shadow-lg scale-105' : 'border-zinc-100 dark:border-clr4 dark:text-dclr2'}`}>
                    <input type="radio" name="viaje_radio" checked={isChecked} onChange={() => setFormData({ ...formData, viajes_extranjero_radio: o, viajes_extranjero_bool: o === 'Si' })} className="hidden" /> {o}
                  </label>
                );
              })}
            </div>
          </div>

          {hasViajado && (
            <div className="animate-in slide-in-from-top-4 duration-500 space-y-4 bg-zinc-50 dark:bg-clr4 p-2 rounded-[1rem] border border-clr10 dark:border-clr5">
              
              <div className="space-y-1">
                <FieldInfo label="¿Qué país visitaste?" info="Cuentanos que país visitaste" />
                <input type="text" defaultValue={formData.pais_viaje || perfil.pais_viaje || ''} onChange={(e) => setFormData({ ...formData, pais_viaje: e.target.value })} placeholder="País..." className={inputStyle} />
              </div>

              <div className="space-y-1">
                <FieldInfo label="¿En que fecha viajaste?" info="Cuentanos en que fecha fue el viaje al extranjero" />
                <input type="date" defaultValue={formData.fecha_viaje || perfil.fecha_viaje || ''} onChange={(e) => setFormData({ ...formData, fecha_viaje: e.target.value })} className={inputStyle} />
              </div>

              <div className="space-y-1">
                <FieldInfo label="¿Qué vacunas se admnistró para el viaje?" info="Cuentanos que vacuna o vacunas tuviste que ponerte par ir a ese viaje al extranjero" />
                <input type="text" defaultValue={formData.vacuna_viaje || perfil.vacuna_viaje || ''} onChange={(e) => setFormData({ ...formData, vacuna_viaje: e.target.value })} placeholder="Vacunas de viaje..." className={inputStyle} />
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  )
}
