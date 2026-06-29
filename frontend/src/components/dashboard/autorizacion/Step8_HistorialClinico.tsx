'use client'

import { useEffect } from 'react'

interface StepProps {
  formData: any
  setFormData: (data: any) => void
  perfil: any
}

export default function Step8_HistorialClinico({ formData, setFormData, perfil }: StepProps) {
  const titleStyle = "text-[1.2em] font-black text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8 border-b-2 border-clr7 pb-2";
  const labelContainerStyle = "flex items-center gap-2 mb-1";
  const labelStyle = "text-[0.9em] font-black uppercase text-clr2 tracking-widest block";
  const inputStyle = "w-full bg-zinc-50 dark:bg-clr3 dark:text-dclr2 border-2 border-transparent focus:border-clr7 rounded-xl p-3 text-[1em] font-bold outline-none transition-all shadow-inner";
  
  const infoIconContainerStyle = "inline-block";
  const infoIconStyle = "text-clr7 cursor-help text-[1.1em] hover:scale-110 transition-transform flex items-center justify-center";
  const tooltipStyle = "fixed z-[300] left-1/2 -translate-x-1/2 top-1/4 w-[90%] max-w-lg p-6 bg-zinc-800 dark:bg-zinc-900 text-white text-[1em] font-medium leading-relaxed rounded-[2rem] shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 border-2 border-clr7/50 backdrop-blur-md";

  // Inicialización de listas dinámicas
  useEffect(() => {
    if (formData.hospitalizaciones === undefined) {
      setFormData({ 
        ...formData, 
        hospitalizaciones: (perfil.hospitalizaciones_previas_json || []),
        cirugias: (perfil.cirugias_previas_json || []),
        has_hospitalizaciones: formData.has_hospitalizaciones || (perfil.hospitalizaciones_previas === 'Si' ? 'Si' : 'No'),
        has_cirugias: formData.has_cirugias || (perfil.cirugias_previas === 'Si' ? 'Si' : 'No')
      });
    }
  }, []);

  const addHospitalizacion = () => {
    const newList = [...(formData.hospitalizaciones || []), { motivo: '', fecha: '' }];
    setFormData({ ...formData, hospitalizaciones: newList });
  };

  const updateHospitalizacion = (index: number, field: string, value: string) => {
    const newList = [...formData.hospitalizaciones];
    newList[index] = { ...newList[index], [field]: value };
    setFormData({ ...formData, hospitalizaciones: newList });
  };

  const removeHospitalizacion = (index: number) => {
    const newList = formData.hospitalizaciones.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, hospitalizaciones: newList });
  };

  const addCirugia = () => {
    const newList = [...(formData.cirugias || []), { nombre: '', fecha: '' }];
    setFormData({ ...formData, cirugias: newList });
  };

  const updateCirugia = (index: number, field: string, value: string) => {
    const newList = [...formData.cirugias];
    newList[index] = { ...newList[index], [field]: value };
    setFormData({ ...formData, cirugias: newList });
  };

  const removeCirugia = (index: number) => {
    const newList = formData.cirugias.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, cirugias: newList });
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
    <div className="animate-in fade-in duration-500 overflow-x-hidden p-4 pb-10">
      <h3 className={titleStyle}>8. Historial Clínico</h3>
      
      <div className="space-y-16">
        
        {/* SECCIÓN HOSPITALIZACIONES */}
        <div className="space-y-6">
          <div className="space-y-4">
            <FieldInfo 
              label="¿Haz estado hospitalizado?" 
              info="Cuéntanos si haz estado hospitalizado y en que fecha aproximadamente." 
            />
            <div className="flex gap-4">
              {['Si', 'No'].map(o => (
                <label key={o} className={`flex-1 p-3 border-2 rounded-xl text-center cursor-pointer font-bold uppercase text-[0.9em] tracking-widest transition-all ${formData.has_hospitalizaciones === o ? 'border-clr7 bg-clr7 text-white shadow-lg' : 'border-zinc-100 dark:border-clr4 dark:text-dclr2'}`}>
                  <input type="radio" checked={formData.has_hospitalizaciones === o} onChange={() => setFormData({ ...formData, has_hospitalizaciones: o })} className="hidden" /> {o}
                </label>
              ))}
            </div>
          </div>

          {formData.has_hospitalizaciones === 'Si' && (
            <div className="space-y-6 animate-in slide-in-from-top-4 duration-500 bg-zinc-50 dark:bg-black/10 p-6 rounded-[2rem] border border-clr10 dark:border-clr4">
              {(formData.hospitalizaciones || []).map((h: any, i: number) => (
                <div key={i} className="space-y-4 pb-6 border-b border-clr10 dark:border-clr4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <span className="text-[0.8em] font-black uppercase tracking-widest text-clr7">Registro #{i + 1}</span>
                    {i > 0 && <button onClick={() => removeHospitalizacion(i)} className="text-[0.8em] font-black uppercase text-red-500">Eliminar</button>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <FieldInfo label="¿Cuál fue el motivo de la hospitalización?" info="Cuéntanos por qué motivo te hospitalizaron" />
                      <input type="text" value={h.motivo} onChange={(e) => updateHospitalizacion(i, 'motivo', e.target.value)} className={inputStyle} placeholder="Motivo..." />
                    </div>
                    <div className="space-y-1">
                      <FieldInfo label="¿En que fecha aproximadamente ocurrió la hospitalización?" info="Cuéntanos en que fecha aproximadamente ocurrió la hospitalización" />
                      <input type="date" value={h.fecha} onChange={(e) => updateHospitalizacion(i, 'fecha', e.target.value)} className={inputStyle} />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addHospitalizacion} className="w-full py-3 border-2 border-dashed border-clr7/30 rounded-xl text-[0.8em] font-black text-clr7 uppercase hover:bg-clr7/5 transition-all">+ Agregar otra hospitalización</button>
            </div>
          )}
        </div>

        {/* SECCIÓN CIRUGÍAS */}
        <div className="space-y-6">
          <div className="space-y-4">
            <FieldInfo 
              label="¿Haz tenido cirugías?" 
              info="Cuéntanos si haz cirugías" 
            />
            <div className="flex gap-4">
              {['Si', 'No'].map(o => (
                <label key={o} className={`flex-1 p-3 border-2 rounded-xl text-center cursor-pointer font-bold uppercase text-[0.9em] tracking-widest transition-all ${formData.has_cirugias === o ? 'border-clr7 bg-clr7 text-white shadow-lg' : 'border-zinc-100 dark:border-clr4 dark:text-dclr2'}`}>
                  <input type="radio" checked={formData.has_cirugias === o} onChange={() => setFormData({ ...formData, has_cirugias: o })} className="hidden" /> {o}
                </label>
              ))}
            </div>
          </div>

          {formData.has_cirugias === 'Si' && (
            <div className="space-y-6 animate-in slide-in-from-top-4 duration-500 bg-zinc-50 dark:bg-black/10 p-6 rounded-[2rem] border border-clr10 dark:border-clr4">
              {(formData.cirugias || []).map((c: any, i: number) => (
                <div key={i} className="space-y-4 pb-6 border-b border-clr10 dark:border-clr4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <span className="text-[0.8em] font-black uppercase tracking-widest text-clr7">Cirugía #{i + 1}</span>
                    {i > 0 && <button onClick={() => removeCirugia(i)} className="text-[0.8em] font-black uppercase text-red-500">Eliminar</button>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <FieldInfo label="¿Qué cirugía tuviste?" info="Cuéntanos cómo se llama la cirugía o porque motivo la tuviste" />
                      <input type="text" value={c.nombre} onChange={(e) => updateCirugia(i, 'nombre', e.target.value)} className={inputStyle} placeholder="Nombre de la cirugía..." />
                    </div>
                    <div className="space-y-1">
                      <FieldInfo label="¿En que fecha aproximadamente ocurrió la cirugía?" info="Cuéntanos en que fecha aproximadamente ocurrió la cirugía" />
                      <input type="date" value={c.fecha} onChange={(e) => updateCirugia(i, 'fecha', e.target.value)} className={inputStyle} />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addCirugia} className="w-full py-3 border-2 border-dashed border-clr7/30 rounded-xl text-[0.8em] font-black text-clr7 uppercase hover:bg-clr7/5 transition-all">+ Agregar otra cirugía</button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
