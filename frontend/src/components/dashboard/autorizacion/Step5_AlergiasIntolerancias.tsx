'use client'

interface StepProps {
  formData: any
  setFormData: (data: any) => void
  perfil: any
}

export default function Step5_AlergiasIntolerancias({ formData, setFormData, perfil }: StepProps) {
  const titleStyle = "text-[1.2em] font-black text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8 border-b-2 border-clr7 pb-2";
  const labelContainerStyle = "flex items-center gap-2 mb-1";
  const labelStyle = "text-[0.9em] font-black uppercase text-clr2 tracking-widest block";
  const inputStyle = "w-full bg-zinc-50 dark:bg-clr3 dark:text-dclr2 border-2 border-transparent focus:border-clr7 rounded-xl p-3 text-[1em] font-bold outline-none transition-all shadow-inner";
  const disabledInputStyle = "w-full bg-zinc-100 dark:bg-clr3/50 p-3 rounded-xl font-bold text-[1em] dark:text-dclr2 border border-zinc-200 dark:border-clr4 opacity-50 cursor-not-allowed outline-none";
  
  const infoIconContainerStyle = "inline-block";
  const infoIconStyle = "text-clr7 cursor-help text-[1.1em] hover:scale-110 transition-transform flex items-center justify-center";
  const tooltipStyle = "fixed z-[300] left-1/2 -translate-x-1/2 top-1/4 w-[90%] max-w-lg p-6 bg-zinc-800 dark:bg-zinc-900 text-white text-[1em] font-medium leading-relaxed rounded-[2rem] shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 border-2 border-clr7/50 backdrop-blur-md";

  const tiposSangre = ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-', 'No Sabe'];
  const opcionesMenu = ['Menú General', 'Menú Vegetariano', 'Menú Vegano', 'Celiaco', 'Intolerante Lactosa'];

  // Lógica de valores actuales
  const isAlergiasSi = formData.tiene_alergias_radio === 'Si' || (formData.tiene_alergias_radio === undefined && perfil.tiene_alergias === true);
  const isIntoleranciaSi = formData.tiene_intolerancia_radio === 'Si' || (formData.tiene_intolerancia_radio === undefined && perfil.tiene_intolerancia === true);

  const toggleMenu = (opt: string) => {
    const list = formData.dieta_alimentaria || perfil.dieta_alimentaria || [];
    const newList = list.includes(opt) ? list.filter((i: string) => i !== opt) : [...list, opt];
    setFormData({ ...formData, dieta_alimentaria: newList });
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
          <div className="text-[0.95em]">{info}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 p-4">
      <h3 className={titleStyle}>5. Antecedentes Médicos</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Grupo Sanguíneo - TIPO: Selector */}
        <div className="space-y-1">
          <FieldInfo 
            label="¿Cuál es tu tipo de sangre?" 
            info="Indique el tipo de sangre, este es un dato vital en caso de una emergencia médica. * Esto es Obligatorio" 
          />
          <select 
            value={formData.tipo_sangre || perfil.tipo_sangre || ''} 
            onChange={(e) => setFormData({ ...formData, tipo_sangre: e.target.value })} 
            className={inputStyle}
          >
            <option value="">Selecciona...</option>
            {tiposSangre.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Alergias - TIPO: Radio */}
        <div className="space-y-1">
          <FieldInfo 
            label="¿Tienes alguna alergia?" 
            info="Selecciones si tiene alguna alergia o no" 
          />
          <div className="flex gap-4">
            {['Si', 'No'].map(o => {
              const isChecked = (o === 'Si' && isAlergiasSi) || (o === 'No' && !isAlergiasSi);
              return (
                <label key={o} className={`flex-1 p-3 border-2 rounded-xl text-center cursor-pointer font-bold uppercase text-[0.9em] tracking-widest transition-all ${isChecked ? 'border-clr7 bg-clr7 text-white shadow-lg' : 'border-zinc-200 dark:border-clr4 dark:text-dclr2'}`}>
                  <input type="radio" name="alergia_radio" checked={isChecked} onChange={() => setFormData({ ...formData, tiene_alergias_radio: o, tiene_alergias: o === 'Si' })} className="hidden" /> {o}
                </label>
              );
            })}
          </div>
        </div>

        {/* Especifique Alergias - TIPO: Textarea (Condicional) */}
        <div className="md:col-span-2 space-y-1">
          <FieldInfo 
            label="¿Qué alergias tienes?" 
            info="cuéntanos cuales son tus alergias" 
          />
          <textarea 
            disabled={!isAlergiasSi}
            value={isAlergiasSi ? (formData.alergias || perfil.alergias || '') : ''}
            onChange={(e) => setFormData({ ...formData, alergias: e.target.value })}
            placeholder="Especifique sus alergias..."
            className={isAlergiasSi ? `${inputStyle} h-24 resize-none` : `${disabledInputStyle} h-24 resize-none`}
          />
        </div>

        {/* Intolerancia Alimentaria - TIPO: Radio */}
        <div className="space-y-1">
          <FieldInfo 
            label="¿Tienes alguna alguna intolerancia Alimentaria?" 
            info="Marca la opción Si en caso que tengas alguna intolerancia alimentaria" 
          />
          <div className="flex gap-4">
            {['Si', 'No'].map(o => {
              const isChecked = (o === 'Si' && isIntoleranciaSi) || (o === 'No' && !isIntoleranciaSi);
              return (
                <label key={o} className={`flex-1 p-3 border-2 rounded-xl text-center cursor-pointer font-bold uppercase text-[0.9em] tracking-widest transition-all ${isChecked ? 'border-clr7 bg-clr7 text-white shadow-lg' : 'border-zinc-200 dark:border-clr4 dark:text-dclr2'}`}>
                  <input type="radio" name="intol_radio" checked={isChecked} onChange={() => setFormData({ ...formData, tiene_intolerancia_radio: o, tiene_intolerancia: o === 'Si' })} className="hidden" /> {o}
                </label>
              );
            })}
          </div>
        </div>

        {/* Describe Intolerancia - TIPO: Input de texto (Condicional) */}
        <div className="space-y-1">
          <FieldInfo 
            label="¿Qué intolerancia Alimentaria tienes?" 
            info="Especifica la intolerancia alimentaria que tengas" 
          />
          <input 
            type="text" 
            disabled={!isIntoleranciaSi}
            value={isIntoleranciaSi ? (formData.describe_intolerancia || perfil.describe_intolerancia || '') : ''}
            onChange={(e) => setFormData({ ...formData, describe_intolerancia: e.target.value })}
            placeholder="Describa su intolerancia..."
            className={isIntoleranciaSi ? inputStyle : disabledInputStyle} 
          />
        </div>

        {/* Menú Alimenticio - TIPO: Checkboxes */}
        <div className="md:col-span-2 space-y-1">
          <FieldInfo 
            label="¿Cuál es tu dieta alimentaria?" 
            info="Selecciona el tipo de comida que consumes en tu vida cotidiana, esta respuesta es importante para establecer el menú de campamento." 
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-2">
            {opcionesMenu.map(opt => {
              const list = formData.dieta_alimentaria || perfil.dieta_alimentaria || [];
              const isChecked = list.includes(opt);
              return (
                <label key={opt} className={`p-3 border-2 rounded-xl text-center cursor-pointer font-bold text-[0.8em] uppercase transition-all ${isChecked ? 'border-clr7 bg-clr7/10 text-clr7' : 'border-zinc-100 dark:border-clr4 dark:text-dclr2'}`}>
                  <input type="checkbox" checked={isChecked} onChange={() => toggleMenu(opt)} className="hidden" /> {opt}
                </label>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
