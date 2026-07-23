'use client'

import DOMPurify from 'dompurify'
import type { StepProps } from '@/types/autorizacion'

export default function Step15_RegulacionEmocional({ formData, setFormData, perfil }: StepProps) {
  const titleStyle = "text-[1.2em] font-black text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8 border-b-2 border-clr7 pb-2";
  const labelContainerStyle = "flex items-center gap-2 mb-1";
  const labelStyle = "text-[0.9em] font-black uppercase text-clr2 tracking-widest block";
  const inputStyle = "w-full bg-zinc-50 dark:bg-clr3 dark:text-dclr2 border-2 dark:border-clr4 border-transparent focus:border-clr7 rounded-xl p-3 text-[1em] font-bold outline-none transition-all shadow-inner";
  
  const infoIconContainerStyle = "inline-block";
  const infoIconStyle = "text-clr7 cursor-help text-[1.1em] hover:scale-110 transition-transform flex items-center justify-center";
  const tooltipStyle = "fixed z-[300] left-1/2 -translate-x-1/2 top-1/4 w-[90%] max-w-lg p-6 bg-zinc-800 dark:bg-zinc-900 text-white text-[1em] font-medium leading-relaxed rounded-[2rem] shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 border-2 border-clr7/50 backdrop-blur-md";

  // Lógica de visibilidad
  const hasDiagnostico = formData.presenta_diagnostico_radio === 'Si' || (formData.presenta_diagnostico_radio === undefined && perfil.presenta_diagnostico_bool === true);

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

  const RadioGroup = ({ value, onChange, label, info }: { value: string; onChange: (val: string) => void; label: string; info: string }) => (
    <div className="space-y-4">
      <FieldInfo label={label} info={info} />
      <div className="flex gap-4">
        {['Si', 'No'].map(o => (
          <label key={o} className={`flex-1 p-3 border-2 rounded-xl text-center cursor-pointer font-bold uppercase text-[0.9em] transition-all ${value === o ? 'border-clr7 bg-clr7 text-white' : 'border-zinc-100 dark:border-clr4 dark:text-dclr2'}`}>
            <input type="radio" checked={value === o} onChange={() => onChange(o)} className="hidden" /> {o}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 overflow-x-hidden p-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
      <h3 className={titleStyle}>15. REGISTRO DE NECESIDADES DE REGULACIÓN EMOCIONAL</h3>
      
      <div className="space-y-4">
        
        {/* Item 1: Diagnóstico Raíz */}
        <RadioGroup 
          label="¿Presenta un diagnóstico o características relevantes de regulación emocional?" 
          info="Esta sección tiene como objetivo recopilar información para prestar apoyo y/o prevenir elementos o situaciones que puedan desencadenar en una desregulación. Para ello necesitamos realizar un trabajo de colaboración entre ustedes como apoderado/os y nosotros como guiadoras/dirigentes en pro de todos los integrantes del Grupo.<br></br>Esta información será con propósitos informativos y confidencial por lo que rogamos responder con la mayor sinceridad posible."
          value={formData.presenta_diagnostico_radio || (perfil.presenta_diagnostico_bool ? 'Si' : 'No')}
          onChange={(val: string) => setFormData({ ...formData, presenta_diagnostico_radio: val, presenta_diagnostico_bool: val === 'Si' })}
        />

        {hasDiagnostico && (
          <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
            
            {/* Item 2: Cuáles diagnósticos */}
            <div className="space-y-1">
              <FieldInfo label="¿Cuáles diagnósticos o características relevantes?" info="Por favor detallanos la información sobre estas características o diagnósticos" />
              <input type="text" defaultValue={formData.diagnostico_relevante_detalle || perfil.diagnostico_relevante_detalle || ''} onChange={(e) => setFormData({ ...formData, diagnostico_relevante_detalle: e.target.value })} placeholder="Especifique aquí..." className={inputStyle} />
            </div>

            {/* Item 3: Intereses y disfrute */}
            <div className="space-y-1">
              <FieldInfo label="¿Qué intereses y/o experiencias generan disfrute en el niño, niña, adolescente o joven?" info="Por favor cuentanos que intereses o expericias te generan alegria o disfrute" />
              <textarea defaultValue={formData.intereses_disfrute || perfil.intereses_disfrute || ''} onChange={(e) => setFormData({ ...formData, intereses_disfrute: e.target.value })} placeholder="Describa aquí..." className={`${inputStyle} h-24 resize-none`} />
            </div>

            {/* Item 4: Situaciones de estrés */}
            <div className="space-y-1">
              <FieldInfo label="¿Qué situaciones te generan estrés? ¿Qué conductas y/o acciones se observan cuando está ansioso/a o nervioso/a?" info="Identifique y mencione cuáles son las situaciones que generan estrés, lo que usted observa que gatille las desregulaciones dentro y fuera del hogar. ¿Qué conductas y/o acciones se observan cuando está ansioso/a o nervioso/a? Aquellas que son previas a una desregulación." />
              <textarea defaultValue={formData.situaciones_estres || perfil.situaciones_estres || ''} onChange={(e) => setFormData({ ...formData, situaciones_estres: e.target.value })} placeholder="Describa situaciones y conductas previas..." className={`${inputStyle} h-32 resize-none`} />
            </div>

            {/* Sub-sección: Necesidades Específicas */}
            <div className="p-4 bg-zinc-50 dark:bg-clr4/50 rounded-[1em] border border-clr10 dark:border-clr4 space-y-4">
              <h4 className="text-[1em] font-black uppercase text-clr7 tracking-widest border-b border-clr7/20 pb-2">Necesidades Específicas</h4>
              
              {/* Comunicación */}
              <div className="space-y-4">
                <RadioGroup 
                  label="¿Tienes necesidades de apoyo en comunicación?" 
                  info="Cuéntanos si tienes necesidades de apoyo en comunicación, por ejemplo, lenguaje no verbal, pictogramas, etc."
                  value={formData.apoyo_comunicacion_radio || (perfil.apoyo_comunicacion_bool ? 'Si' : 'No')}
                  onChange={(val: string) => setFormData({ ...formData, apoyo_comunicacion_radio: val, apoyo_comunicacion_bool: val === 'Si' })}
                />
                {formData.apoyo_comunicacion_bool && (
                  <input type="text" defaultValue={formData.apoyo_comunicacion_detalle || perfil.apoyo_comunicacion || ''} onChange={(e) => setFormData({ ...formData, apoyo_comunicacion_detalle: e.target.value })} placeholder="Cuáles necesidades de comunicación..." className={inputStyle} />
                )}
              </div>

              {/* Sensoriales */}
              <div className="space-y-4">
                <RadioGroup 
                  label="¿Tienes necesidades de apoyo por dificultades sensoriales?" 
                  info="Cuéntanos si tienes necesidades de apoyo por dificultades sensoriales, por ejemplo, luces, ruidos, texturas"
                  value={formData.dificultades_sensoriales_radio || (perfil.dificultades_sensoriales_bool ? 'Si' : 'No')}
                  onChange={(val: string) => setFormData({ ...formData, dificultades_sensoriales_radio: val, dificultades_sensoriales_bool: val === 'Si' })}
                />
                {formData.dificultades_sensoriales_bool && (
                  <input type="text" defaultValue={formData.dificultades_sensoriales_detalle || perfil.dificultades_sensoriales || ''} onChange={(e) => setFormData({ ...formData, dificultades_sensoriales_detalle: e.target.value })} placeholder="Cuáles dificultades sensoriales..." className={inputStyle} />
                )}
              </div>

              {/* Organización */}
              <div className="space-y-4">
                <RadioGroup 
                  label="¿Tienes necesidades de ayuda en organización y/o planificación?" 
                  info="Cuéntanos si tienes necesidades de ayuda en organización y/o planificación, por ejemplo, rutinas visuales, recordatorios"
                  value={formData.ayuda_organizacion_radio || (perfil.ayuda_organizacion_bool ? 'Si' : 'No')}
                  onChange={(val: string) => setFormData({ ...formData, ayuda_organizacion_radio: val, ayuda_organizacion_bool: val === 'Si' })}
                />
                {formData.ayuda_organizacion_bool && (
                  <input type="text" defaultValue={formData.ayuda_organizacion_detalle || perfil.ayuda_organizacion || ''} onChange={(e) => setFormData({ ...formData, ayuda_organizacion_detalle: e.target.value })} placeholder="Cuáles necesidades de organización..." className={inputStyle} />
                )}
              </div>

              {/* Otras */}
              <div className="space-y-4">
                <RadioGroup 
                  label="¿Tienes Otras necesidades especificas de ayuda?" 
                  info="Cuéntanos si tienes otras necesidades de ayuda o apoyo especificas"
                  value={formData.otras_necesidades_radio || (perfil.otras_necesidades_bool ? 'Si' : 'No')}
                  onChange={(val: string) => setFormData({ ...formData, otras_necesidades_radio: val, otras_necesidades_bool: val === 'Si' })}
                />
                {formData.otras_necesidades_bool && (
                  <input type="text" defaultValue={formData.otras_necesidades_detalle || perfil.otras_necesidades || ''} onChange={(e) => setFormData({ ...formData, otras_necesidades_detalle: e.target.value })} placeholder="Cuáles otras necesidades..." className={inputStyle} />
                )}
              </div>
            </div>

            {/* Estrategias */}
            <div className="space-y-1">
              <FieldInfo label="¿Qué acciones y/o apoyos otorgan para que la niña, niño, adolescente o joven para que vuelva a la calma?, ¿Con cuál logra calmarlo?, ¿Qué herramientas usas para calmarse?" info="Indícanos que estrategias funcionan para calmar a la niña, niño, adolescente o joven" />
              <textarea defaultValue={formData.estrategias_calma || perfil.estrategias_calma || ''} onChange={(e) => setFormData({ ...formData, estrategias_calma: e.target.value })} placeholder="Describa estrategias de calma..." className={`${inputStyle} h-32 resize-none`} />
            </div>

            {/* Observaciones adicionales */}
            <div className="space-y-1">
              <FieldInfo label="¿Quieres dejarnos alguna observación adicional?" info="comenta si hay alguna otra observación adicional sobre un diagnóstico o características relevantes" />
              <textarea defaultValue={formData.observaciones_adicionales || perfil.observaciones_adicionales || ''} onChange={(e) => setFormData({ ...formData, observaciones_adicionales: e.target.value })} placeholder="Cualquier otra información relevante..." className={`${inputStyle} h-24 resize-none`} />
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
