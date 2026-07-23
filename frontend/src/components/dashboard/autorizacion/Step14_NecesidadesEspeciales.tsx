'use client'

import DOMPurify from 'dompurify'
import type { StepProps } from '@/types/autorizacion'

export default function Step14_NecesidadesEspeciales({ formData, setFormData, perfil }: StepProps) {
  const titleStyle = "text-[1.2em] font-black text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8 border-b-2 border-clr7 pb-2";
  const labelContainerStyle = "flex items-center gap-2 mb-1";
  const labelStyle = "text-[0.9em] font-black uppercase text-clr2 tracking-widest block";
  const inputStyle = "w-full bg-zinc-50 dark:bg-clr3 dark:text-dclr2 border-2 border-transparent focus:border-clr7 rounded-xl p-3 text-[1em] font-bold outline-none transition-all shadow-inner";
  
  const infoIconContainerStyle = "inline-block";
  const infoIconStyle = "text-clr7 cursor-help text-[1.1em] hover:scale-110 transition-transform flex items-center justify-center";
  const tooltipStyle = "fixed z-[300] left-1/2 -translate-x-1/2 top-1/4 w-[90%] max-w-lg p-6 bg-zinc-800 dark:bg-zinc-900 text-white text-[1em] font-medium leading-relaxed rounded-[2rem] shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 border-2 border-clr7/50 backdrop-blur-md";

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
    <div className="animate-in fade-in duration-500 overflow-x-hidden p-4 pb-10">
      <h3 className={titleStyle}>14. NECESIDADES Y RESTRICCIONES ESPECIALES</h3>
      
      <div className="space-y-8">
        
        {/* Item Único: Textarea */}
        <div className="space-y-1">
          <FieldInfo 
            label="¿Tienes necesidades o restricciones especiales?" 
            info="por favor incluye aspectos médicos, alimentarios, neurodivergencias, religiosos, ayudas técnicas, etc.<br></br><br></br>IMPORTANTE: Debe adjuntar receta médica por tratamientos indicados en ficha. Llevar medicamentos, inhaladores, aerocámara, entre otros. Si está cursando un embarazo debe llevar carné de control." 
          />
          <textarea 
            defaultValue={formData.tratamientos_medicos || perfil.tratamientos_medicos || ''} 
            onChange={(e) => setFormData({ ...formData, tratamientos_medicos: e.target.value })} 
            placeholder="Describa aquí aspectos médicos, alimentarios, neurodivergencias, religiosos, ayudas técnicas, etc..."
            className={`${inputStyle} h-64 resize-none`}
          />
        </div>

      </div>
    </div>
  )
}
