'use client'

interface StepProps {
  formData: any
  setFormData: (data: any) => void
  perfil: any
}

export default function Step4_PrevisionSalud({ formData, setFormData, perfil }: StepProps) {
  const titleStyle = "text-[1.2em] font-black text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8 border-b-2 border-clr7 pb-2";
  const labelContainerStyle = "flex items-center gap-2 mb-1";
  const labelStyle = "text-[0.9em] font-black uppercase text-clr2 tracking-widest block";
  const inputStyle = "w-full bg-zinc-50 dark:bg-clr3 dark:text-dclr2 border-2 border-transparent focus:border-clr7 rounded-xl p-3 text-[1em] font-bold outline-none transition-all shadow-inner";
  const disabledInputStyle = "w-full bg-zinc-100 dark:bg-clr3/50 p-3 rounded-xl font-bold text-[1em] dark:text-dclr2 border border-zinc-200 dark:border-clr4 opacity-50 cursor-not-allowed outline-none";
  
  const infoIconContainerStyle = "inline-block";
  const infoIconStyle = "text-clr7 cursor-help text-[1.1em] hover:scale-110 transition-transform flex items-center justify-center";
  const tooltipStyle = "fixed z-[300] left-1/2 -translate-x-1/2 top-1/4 w-[90%] max-w-lg p-6 bg-zinc-800 dark:bg-zinc-900 text-white text-[1em] font-medium leading-relaxed rounded-[2rem] shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 border-2 border-clr7/50 backdrop-blur-md";

  const previsiones = ['FONASA', 'Isapre', 'Fuerzas Armadas', 'Particular', 'Otro'];

  // Valores actuales (Prioridad: Formulario > Perfil)
  const currentPrevision = formData.sistema_salud || perfil.sistema_salud || '';
  const needsIsapreName = currentPrevision === 'Isapre' || currentPrevision === 'Particular';
  
  const currentSeguro = formData.seguro_complementario_radio || (perfil.seguro_complementario ? 'SI' : 'NO');
  const needsSeguroName = currentSeguro === 'SI';

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
          <div className="text-[0.95em]">{info}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 p-4">
      <h3 className={titleStyle}>4. Datos Previsionales</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Previsión - TIPO: Selector */}
        <div className="space-y-1">
          <FieldInfo 
            label="¿Cuál es tu Sistema de Salud?" 
            info="Selecciona de la lista tu sistema de salud, esta información es necesaria para que en caso de emergencia podamos dirigirnos rápidamente al centro de urgencia adecuado. *Este Dato es Obligatorio." 
          />
          <select 
            value={currentPrevision} 
            onChange={(e) => setFormData({ ...formData, sistema_salud: e.target.value })} 
            className={inputStyle}
          >
            <option value="">Selecciona...</option>
            {previsiones.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Nombre Isapre/Otro - TIPO: Input de texto (Condicional) */}
        <div className="space-y-1">
          <FieldInfo 
            label="Nombre de la Isapre u otro" 
            info="Si seleccionaste Isapre o Particular indica el nombre del mismo. *Este Dato es Obligatorio." 
          />
          <input 
            type="text" 
            placeholder="Nombre del sistema"
            disabled={!needsIsapreName}
            value={needsIsapreName ? (formData.detalle_sistema_salud || perfil.detalle_sistema_salud || '') : ''} 
            onChange={(e) => setFormData({ ...formData, detalle_sistema_salud: e.target.value })}
            className={needsIsapreName ? inputStyle : disabledInputStyle} 
          />
        </div>

        {/* Seguro Complementario - TIPO: Radio */}
        <div className="space-y-1">
          <FieldInfo 
            label="¿Tienes seguro complementario?" 
            info="Indica si tienes contratado algún seguro de salud adicional. *Este Dato es Obligatorio." 
          />
          <div className="flex gap-4">
            {['SI', 'NO'].map(o => {
              const isChecked = currentSeguro === o;
              return (
                <label key={o} className={`flex-1 p-3 border-2 rounded-xl text-center cursor-pointer font-bold uppercase text-[0.9em] tracking-widest transition-all ${isChecked ? 'border-clr7 bg-clr7 text-white shadow-lg scale-105' : 'border-zinc-200 dark:border-clr4 dark:text-dclr2'}`}>
                  <input 
                    type="radio" 
                    name="seguro_radio"
                    checked={isChecked} 
                    onChange={() => setFormData({ ...formData, seguro_complementario_radio: o, seguro_complementario: o === 'SI' })} 
                    className="hidden" 
                  /> 
                  {o}
                </label>
              );
            })}
          </div>
        </div>

        {/* Nombre del Seguro - TIPO: Input de texto (Condicional) */}
        <div className="space-y-1">
          <FieldInfo 
            label="Nombre de tú seguro" 
            info="indica el nombre del seguro complementario. *Este Dato es Obligatorio." 
          />
          <input 
            type="text" 
            placeholder="Nombre del seguro"
            disabled={!needsSeguroName}
            value={needsSeguroName ? (formData.nombre_seguro_complementario || perfil.nombre_seguro_complementario || '') : ''} 
            onChange={(e) => setFormData({ ...formData, nombre_seguro_complementario: e.target.value })}
            className={needsSeguroName ? inputStyle : disabledInputStyle} 
          />
        </div>

      </div>
    </div>
  )
}
