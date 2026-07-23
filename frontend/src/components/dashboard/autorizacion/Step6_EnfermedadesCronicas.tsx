'use client'

import { useEffect } from 'react'
import DOMPurify from 'dompurify'
import type { StepProps } from '@/types/autorizacion'

export default function Step6_EnfermedadesCronicas({ formData, setFormData, perfil }: StepProps) {
  const titleStyle = "text-[1.2em] font-black text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8 border-b-2 border-clr7 pb-2";
  const labelContainerStyle = "flex items-center gap-2 mb-1";
  const labelStyle = "text-[0.9em] font-black uppercase text-clr2 tracking-widest block";
  const inputStyle = "w-full bg-zinc-50 dark:bg-clr3 dark:text-dclr2 border-2 border-transparent focus:border-clr7 rounded-xl p-3 text-[1em] font-bold outline-none transition-all shadow-inner";
  
  const infoIconContainerStyle = "inline-block";
  const infoIconStyle = "text-clr7 cursor-help text-[1.1em] hover:scale-110 transition-transform flex items-center justify-center";
  const tooltipStyle = "fixed z-[300] left-1/2 -translate-x-1/2 top-1/4 w-[90%] max-w-lg p-6 bg-zinc-800 dark:bg-zinc-900 text-white text-[1em] font-medium leading-relaxed rounded-[2rem] shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 border-2 border-clr7/50 backdrop-blur-md";

  const opcionesEnfermedades = [
    'Diabetes mellitus', 'Hipertensión arterial', 'Patología cardiaca', 
    'Dolor de cabeza', 'Asma', 'Tuberculosis', 'Epilepsia', 
    'Enfermedad renal', 'Alteraciones sanguíneas', 'Enfermedad autoinmune', 
    'Hipo/Hipertiroidismo', 'Ninguna', 'Otra'
  ];

  useEffect(() => {
    if (formData.enfermedades_cronicas_json === undefined) {
      const dbEnfermedades = perfil.enfermedades_cronicas_json || [];
      const dbDetalle = perfil.antecedentes_medicos || '';
      let initialList = [...dbEnfermedades];
      const textoDetalleLimpio = dbDetalle.toLowerCase().trim();
      if (textoDetalleLimpio.length > 0 && textoDetalleLimpio !== 'ninguna' && textoDetalleLimpio !== 'no tiene' && !initialList.includes('Otra')) {
        initialList.push('Otra');
      }
      setFormData({ ...formData, enfermedades_cronicas_json: initialList, antecedentes_medicos: dbDetalle });
    }
  }, []);

  const selectedEnfermedades = formData.enfermedades_cronicas_json || [];
  const hasSelectedAny = selectedEnfermedades.length > 0 && !selectedEnfermedades.includes('Ninguna');
  const hasSelectedOtra = selectedEnfermedades.includes('Otra');

  const toggleEnfermedad = (opt: string) => {
    let newList = [...selectedEnfermedades];
    if (opt === 'Ninguna') { newList = ['Ninguna']; } 
    else {
      newList = newList.filter(i => i !== 'Ninguna');
      if (newList.includes(opt)) { newList = newList.filter(i => i !== opt); } 
      else { newList.push(opt); }
    }
    setFormData({ ...formData, enfermedades_cronicas_json: newList });
  };

  const FieldInfo = ({ label, info }: { label: string; info: string }) => (
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
          <div className="text-[0.95em]" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(info) }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 overflow-x-hidden p-4">
      <h3 className={titleStyle}>6. Enfermedades Crónicas o Importantes</h3>
      
      <div className="space-y-10">
        
        {/* Item 1: Checkboxes */}
        <div className="space-y-4">
          <FieldInfo 
            label="¿Qué enfermedades crónicas o importantes tienes?" 
            info="Selecciona si tienes enfermedades crónicas o importantes, si no tienes selecciona la opción Ninguna" 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {opcionesEnfermedades.map(opt => {
              const isChecked = selectedEnfermedades.includes(opt);
              return (
                <label key={opt} className={`p-3 border-2 rounded-xl text-center cursor-pointer font-bold text-[0.85em] uppercase transition-all ${isChecked ? 'border-clr7 bg-clr7 text-white shadow-md' : 'border-zinc-100 dark:border-clr4 dark:text-dclr2 hover:border-clr7/30'}`}>
                  <input type="checkbox" checked={isChecked} onChange={() => toggleEnfermedad(opt)} className="hidden" /> {opt}
                </label>
              );
            })}
          </div>
        </div>

        {/* Input condicional para "Otra" - Según frase literal del .txt */}
        {hasSelectedOtra && (
          <div className="animate-in slide-in-from-top-4 duration-500 space-y-1">
            <FieldInfo 
              label="Especifique cual enfermedad" 
              info="Si seleccionaste la opción Otra, por favor indicanos cual es la enfermedad" 
            />
            <input 
              type="text" 
              defaultValue={formData.enfermedad_otra_nombre || ''} 
              onChange={(e) => setFormData({ ...formData, enfermedad_otra_nombre: e.target.value })} 
              placeholder="Escriba el nombre de la enfermedad..."
              className={inputStyle}
            />
          </div>
        )}

        {/* Item 2: Textarea de detalle - SE MUESTRA solo si marca algo distinto a Ninguna */}
        {hasSelectedAny && (
          <div className="animate-in slide-in-from-top-4 duration-500 space-y-1">
            <FieldInfo 
              label="Especifique el detalle de Enfermedades Crónicas o Importantes." 
              info="Detalla o especifica la o las enfermedades crónicas o de importancia que tienes" 
            />
            <textarea 
              defaultValue={formData.antecedentes_medicos || ''}
              onChange={(e) => setFormData({ ...formData, antecedentes_medicos: e.target.value })}
              placeholder="Detalle o especifique sus enfermedades..."
              className={`${inputStyle} h-32 resize-none`}
            />
          </div>
        )}

        {/* Item 3: Textarea de Medicamentos */}
        <div className="space-y-1">
          <FieldInfo 
            label="¿Estás consumiendo algún medicamento?" 
            info="Indique si está consumiendo algún Tipo de medicamento <br></br><br></br>(**indique cual y su horario**) <br></br><br></br>Si no consume, por favor escriba <b>No Consume</b>.<br></br><br></br><span class='font-black text-clr7'>* Este campo es obligatorio</span>" 
          />
          <textarea 
            defaultValue={formData.medicamentos || perfil.medicamentos || ''}
            onChange={(e) => setFormData({ ...formData, medicamentos: e.target.value })}
            placeholder="Dosis, horarios y frecuencias..."
            className={`${inputStyle} h-32 resize-none`}
          />
        </div>

      </div>
    </div>
  )
}
