'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import type { StepWithActividadProps } from '@/types/autorizacion'

export default function Step18_FirmaDigital({ formData, setFormData, perfil, apoderadoData }: StepWithActividadProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);
  // Guardar firma en un ref para NO causar re-renders en cada trazo
  const firmaDataRef = useRef<string | null>(null);
  const [firmaCapturada, setFirmaCapturada] = useState(false);
  const isAdult = (perfil.edad ?? 0) >= 18;

  const titleStyle = "text-[1.2em] font-black text-pclr4 dark:text-pdclr4 uppercase tracking-tighter mb-8 border-b-2 border-pclr14 pb-2 text-center";
  const labelStyle = "text-[0.9em] font-black uppercase text-pclr7 tracking-widest block opacity-70 mb-1";
  
  const infoIconContainerStyle = "inline-block";
  const infoIconStyle = "text-pclr4 cursor-help text-[1.1em] hover:scale-110 transition-transform flex items-center justify-center";
  const tooltipStyle = "fixed z-[300] left-1/2 -translate-x-1/2 top-1/4 w-[90%] max-w-lg p-6 bg-pclr2 dark:bg-pdclr2 text-pclr12 text-[1em] font-medium leading-relaxed rounded-[2rem] shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 border-2 border-pclr14 backdrop-blur-md";

  // Solo sincronizar el ref al padre cuando el usuario hace click en "Borrar" o al montar
  useEffect(() => {
    // Si ya había una firma previa, restaurarla en el canvas
    if (formData.firma && sigCanvas.current) {
      const img = new Image();
      img.onload = () => {
        const canvas = sigCanvas.current?.getCanvas();
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            setTimeout(() => {
              ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
              firmaDataRef.current = formData.firma ?? null;
              setFirmaCapturada(true);
            }, 300);
          }
        }
      };
      img.src = formData.firma;
    }
  }, []); // Solo al montar

  // Determinar quién firma
  const nombreFirmante = isAdult 
    ? `${formData.nombres_usuario || perfil.nombres} ${formData.apellidos_usuario || perfil.apellidos}`
    : `${formData.nombre_apoderado || apoderadoData?.nombres || perfil.nombre_apoderado_contacto || ''} ${formData.apellidos_apoderado || apoderadoData?.apellidos || ''}`.trim();

  const rutFirmante = isAdult
    ? (formData.rut_usuario || perfil.rut)
    : (formData.rut_apoderado || apoderadoData?.rut || '---');

  const clear = () => {
    sigCanvas.current?.clear();
    firmaDataRef.current = null;
    setFirmaCapturada(false);
    setFormData({ ...formData, firma: null } as any);
  };

  // Capturar firma manualmente con botón — verifica el canvas en el momento del click
  const confirmarFirma = useCallback(() => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const canvas = sigCanvas.current.getCanvas();
      firmaDataRef.current = canvas.toDataURL('image/png');
      setFormData({ ...formData, firma: firmaDataRef.current ?? null } as any);
      setFirmaCapturada(true);
    }
  }, [setFormData]);

  const Field = ({ label, info, children }: { label: string; info: string; children: React.ReactNode }) => {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-1">
          <label className={labelStyle}>{label}</label>
          <div className="group">
            <div className={infoIconContainerStyle}>
              <span className={infoIconStyle}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </span>
            </div>
            <div className={tooltipStyle}>
              <div className="text-pclr4 font-black uppercase text-[0.8em] tracking-tight mb-3 border-b border-pclr14 pb-2 leading-tight">{label}</div>
              <div className="text-[0.95em]">{info}</div>
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-500 p-4 pb-10">
      <h3 className={titleStyle}>18. Firma Digital del Responsable</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-pclr3 dark:bg-pdclr3 rounded-3xl border border-pclr13 dark:border-pdclr13 text-center md:text-left">
        <div>
          <span className={labelStyle}>Firmante Responsable</span>
          <p className="text-[1.2em] font-black text-pclr4 dark:text-pdclr4 uppercase tracking-tight">{nombreFirmante}</p>
        </div>
        <div>
          <span className={labelStyle}>R.U.N. del Firmante</span>
          <p className="text-[1.2em] font-black text-pclr4 dark:text-pdclr4">{rutFirmante}</p>
        </div>
      </div>

      <Field 
        label="Firma del Responsable" 
        info="Esta firma es la aceptación legal de todo el documento de autorización (Ficha médica, Participación e Imagen)."
      >
        <div className="relative mt-2">
          <div className="border-4 border-dashed border-pclr13 dark:border-pdclr13 rounded-[2rem] bg-pclr1 overflow-hidden shadow-inner touch-none">
            <SignatureCanvas 
              ref={sigCanvas}
              penColor='#1b1b1b'
              minWidth={2.0}
              maxWidth={4.0}
              clearOnResize={false}
              canvasProps={{
                className: 'signature-canvas w-full h-[250px] cursor-crosshair'
              }}
            />
          </div>
          
          <div className="flex flex-wrap justify-between items-center gap-3 mt-4 px-2">
            <button 
              type="button"
              onClick={clear}
              className="px-6 py-2 text-[0.8em] font-black uppercase text-pclr4 hover:bg-pclr10 rounded-xl transition-colors border-2 border-pclr14"
            >
              ✕ Borrar Firma
            </button>

            <button 
              type="button"
              onClick={confirmarFirma}
              disabled={firmaCapturada}
              className={`px-6 py-2 text-[0.8em] font-black uppercase rounded-xl transition-all border-2 ${
                !firmaCapturada
                  ? 'bg-pclr10 text-pclr12 border-pclr14 hover:brightness-110 active:scale-95 shadow-lg'
                  : 'bg-pclr6 text-pclr12 dark:bg-pdclr6 dark:text-pdclr12 border-pclr6 cursor-default'
              }`}
            >
              {firmaCapturada ? '✓ Firma Confirmada' : '✍ Confirmar Firma'}
            </button>
          </div>
        </div>
      </Field>

      <div className="mt-10 p-6 bg-pclr3 dark:bg-pdclr3 rounded-3xl border-2 border-pclr5 dark:border-pdclr5">
        <p className="text-[0.85em] text-pclr5 dark:text-pdclr5 leading-relaxed font-medium italic text-center">
          "Al estampar mi firma digital, certifico que la información proporcionada es verdadera y completa, y acepto íntegramente los términos de participación y uso de imagen descritos en los pasos anteriores."
        </p>
      </div>
    </div>
  )
}
