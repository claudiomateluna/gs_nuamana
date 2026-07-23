'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { StepProps } from '@/types/autorizacion'

export default function Step3_ContactosEmergencia({ formData, setFormData, perfil }: StepProps) {
  const [loading, setLoading] = useState(true)

  const titleStyle = "text-[1.2em] font-black text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8 border-b-2 border-clr7 pb-2";
  const labelContainerStyle = "flex items-center gap-2 mb-1";
  const labelStyle = "text-[0.9em] font-black uppercase text-clr2 tracking-widest block";
  const inputStyle = "w-full bg-zinc-50 dark:bg-clr3 dark:text-dclr2 border-2 border-transparent focus:border-clr7 rounded-xl p-3 text-[1em] font-bold outline-none transition-all shadow-inner";
  const infoIconContainerStyle = "inline-block";
  const infoIconStyle = "text-clr7 cursor-help text-[1.1em] hover:scale-110 transition-transform flex items-center justify-center";
  const tooltipStyle = "fixed z-[300] left-1/2 -translate-x-1/2 top-1/4 w-[90%] max-w-lg p-6 bg-zinc-800 dark:bg-zinc-900 text-white text-[1em] font-medium leading-relaxed rounded-[2rem] shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 border-2 border-clr7/50 backdrop-blur-md";

  const relaciones = ['No Aplica', 'Madre', 'Padre', 'Hermana (o)', 'Tía (o)', 'Abuela (o)', 'Sobrina (o)', 'Hija (o)', 'Otra'];

  const aplicarMascaraTelefono = (valor: string) => {
    let v = valor.replace(/\D/g, ''); // Solo números
    if (v.startsWith('56')) v = v.substring(2); // Evitar duplicar 56
    if (v.length > 9) v = v.substring(0, 9); // Limitar a 9 dígitos
    
    let formatted = '+56 ';
    if (v.length > 0) formatted += v.substring(0, 1) + ' ';
    if (v.length > 1) formatted += v.substring(1, 5) + ' ';
    if (v.length > 5) formatted += v.substring(5, 9);
    
    return v.length === 0 ? '' : formatted.trim();
  };

  useEffect(() => {
    async function loadContacts() {
      if (formData.contactos_emergencia && formData.contactos_emergencia.length > 0) {
        setLoading(false)
        return
      }
      const { data, error } = await supabase
        .from('contactos_emergencia')
        .select('*')
        .eq('perfil_id', perfil.id)

      if (!error && data && data.length > 0) {
        // Aplicamos la máscara a los teléfonos cargados
        const dataFormateada = data.map(c => ({ ...c, telefono: aplicarMascaraTelefono(c.telefono || '') }));
        setFormData({ ...formData, contactos_emergencia: dataFormateada })
      } else {
        setFormData({ ...formData, contactos_emergencia: [{ nombre: '', relacion: 'No Aplica', telefono: '' }] })
      }
      setLoading(false)
    }
    loadContacts()
  }, [])

  const addContact = () => {
    const newList = [...(formData.contactos_emergencia ?? []), { nombre: '', relacion: 'No Aplica', telefono: '' }]
    setFormData({ ...formData, contactos_emergencia: newList })
  }

  const updateContact = (index: number, field: string, value: string) => {
    const newList = [...(formData.contactos_emergencia ?? [])]
    if (field === 'telefono') {
      newList[index] = { ...newList[index], [field]: aplicarMascaraTelefono(value) }
    } else {
      newList[index] = { ...newList[index], [field]: value }
    }
    setFormData({ ...formData, contactos_emergencia: newList })
  }

  const removeContact = (index: number) => {
    const newList = (formData.contactos_emergencia ?? []).filter((_, i) => i !== index)
    setFormData({ ...formData, contactos_emergencia: newList })
  }

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
          <div className="text-[0.95em]">{info}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 p-4 pb-10 pt-4">
      <h3 className={titleStyle}>3. Contacto de Emergencia</h3>
      
      {loading ? (
        <div className="py-20 text-center animate-pulse text-clr2 font-black uppercase text-[1em] tracking-widest">Cargando contactos...</div>
      ) : (
        <div className="space-y-2">
          {(formData.contactos_emergencia || []).map((c, i) => (
            <div key={i} className="p-4 bg-zinc-50 dark:bg-clr4 rounded-[1em] border border-clr10 dark:border-clr4 space-y-4 relative shadow-sm">
              <div className="flex justify-between items-center border-b border-clr10 dark:border-clr5 pb-2 mb-4">
                <span className="text-[0.8em] font-black uppercase tracking-[0.2em] text-clr7">Contacto #{i + 1}</span>
                {i > 0 && (
                  <button type="button" onClick={() => removeContact(i)} className="text-[0.8em] font-black uppercase text-red-500 hover:underline">Eliminar</button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <FieldInfo label="¿Cómo se llama tu contacto de emergencia?" info="Indica el nombre de tu contacto de emergencia, a quien llamaremos en caso de una situación de Emergencia" />
                  <input type="text" placeholder="Nombre Completo" value={c.nombre} onChange={(e) => updateContact(i, 'nombre', e.target.value)} className={inputStyle} />
                </div>

                <div className="space-y-1">
                  <FieldInfo label="¿Cual es tu relación con el contacto de emergencia?" info="Indica la relación o parentesco que tienes con la o el contacto de emergencia." />
                  <select value={c.relacion} onChange={(e) => updateContact(i, 'relacion', e.target.value)} className={inputStyle}>
                    {relaciones.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <FieldInfo label="¿Cuál es su teléfono?" info="Indica el teléfono de tu contacto de emergencia" />
                  <input type="tel" placeholder="+56 9 1234 5678" value={c.telefono} onChange={(e) => updateContact(i, 'telefono', e.target.value)} className={inputStyle} />
                </div>
              </div>
            </div>
          ))}
          
          <button type="button" onClick={addContact} className="w-full py-6 border-2 border-dashed border-clr10 dark:border-clr4 rounded-[2.5rem] text-[0.9em] font-black uppercase text-clr2 tracking-widest hover:text-clr7 hover:border-clr7 transition-all bg-white/50 dark:bg-black/5">
            + AGREGAR OTRO CONTACTO DE EMERGENCIA
          </button>
        </div>
      )}
    </div>
  )
}
