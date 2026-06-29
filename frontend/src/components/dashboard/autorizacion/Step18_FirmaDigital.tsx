'use client'

import { useRef, useEffect } from 'react'
import SignatureCanvas from 'react-signature-canvas'

interface StepProps {
  formData: any
  setFormData: (data: any) => void
  perfil: any
  apoderadoData?: any
}

export default function Step18_FirmaDigital({ formData, setFormData, perfil, apoderadoData }: StepProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const isAdult = perfil.edad >= 18;

  const titleStyle = "text-[1.2em] font-black text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8 border-b-2 border-clr7 pb-2 text-center";
  const labelStyle = "text-[0.9em] font-black uppercase text-clr2 tracking-widest block opacity-70 mb-1";
  
  const infoIconContainerStyle = "inline-block";
  const infoIconStyle = "text-clr7 cursor-help text-[1.1em] hover:scale-110 transition-transform flex items-center justify-center";
  const tooltipStyle = "fixed z-[300] left-1/2 -translate-x-1/2 top-1/4 w-[90%] max-w-lg p-6 bg-zinc-800 dark:bg-zinc-900 text-white text-[1em] font-medium leading-relaxed rounded-[2rem] shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 border-2 border-clr7/50 backdrop-blur-md";

  // Efecto para sincronizar el tamaño del canvas y evitar el offset del puntero
  useEffect(() => {
    const resizeCanvas = () => {
      if (sigCanvas.current) {
        const canvas = sigCanvas.current.getCanvas();
        // Solo redimensionar si es necesario para evitar ciclos infinitos
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        const targetWidth = canvas.offsetWidth * ratio;
        const targetHeight = canvas.offsetHeight * ratio;

        if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          canvas.getContext("2d")?.scale(ratio, ratio);
          // Si ya había una firma, el redimensionado la borra, por lo que limpiamos el estado
          if (formData.firma) {
            setFormData({ ...formData, firma: null });
          }
          sigCanvas.current.clear();
        }
      }
    };

    // Pequeño delay para asegurar que el DOM esté listo y el modal desplegado
    const timeout = setTimeout(resizeCanvas, 200);
    window.addEventListener("resize", resizeCanvas);
    
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [formData.firma, setFormData]);

  // Determinar quién firma
  const nombreFirmante = isAdult 
    ? `${formData.nombres_usuario || perfil.nombres} ${formData.apellidos_usuario || perfil.apellidos}`
    : `${formData.nombre_apoderado || apoderadoData?.nombres || perfil.nombre_apoderado_contacto || ''} ${formData.apellidos_apoderado || apoderadoData?.apellidos || ''}`.trim();

  const rutFirmante = isAdult
    ? (formData.rut_usuario || perfil.rut)
    : (formData.rut_apoderado || apoderadoData?.rut || '---');

  const clear = () => {
    sigCanvas.current?.clear();
    setFormData({ ...formData, firma: null });
  };

  const save = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
      setFormData({ ...formData, firma: dataURL });
    }
  };

  const Field = ({ label, info, children }: any) => {
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
              <div className="text-clr7 font-black uppercase text-[0.8em] tracking-tight mb-3 border-b border-clr7/30 pb-2 leading-tight">{label}</div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-zinc-50 dark:bg-black/10 rounded-3xl border border-clr10 dark:border-clr4 text-center md:text-left">
        <div>
          <span className={labelStyle}>Firmante Responsable</span>
          <p className="text-[1.2em] font-black text-clr5 dark:text-dclr2 uppercase tracking-tight">{nombreFirmante}</p>
        </div>
        <div>
          <span className={labelStyle}>R.U.N. del Firmante</span>
          <p className="text-[1.2em] font-black text-clr5 dark:text-dclr2">{rutFirmante}</p>
        </div>
      </div>

      <Field 
        label="Firma del Responsable" 
        info="Esta firma es la aceptación legal de todo el documento de autorización (Ficha médica, Participación e Imagen)."
      >
        <div className="relative mt-2">
          <div className="border-4 border-dashed border-clr10 dark:border-clr4 rounded-[2rem] bg-white overflow-hidden shadow-inner touch-none">
            <SignatureCanvas 
              ref={sigCanvas}
              penColor='#1b1b1b'
              minWidth={2.0}
              maxWidth={4.0}
              canvasProps={{
                className: 'signature-canvas w-full h-[250px] cursor-crosshair'
              }}
              onEnd={save}
            />
          </div>
          
          <div className="flex justify-between items-center mt-4 px-2">
            <button 
              type="button"
              onClick={clear}
              className="px-6 py-2 text-[0.8em] font-black uppercase text-red-600 hover:bg-red-50 rounded-xl transition-colors border-2 border-red-100"
            >
              ✕ Borrar Firma
            </button>
            
            {formData.firma && (
              <span className="text-green-600 text-[0.8em] font-black uppercase flex items-center gap-2 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Firma Capturada
              </span>
            )}
          </div>
        </div>
      </Field>

      <div className="mt-10 p-6 bg-amber-50 dark:bg-amber-950/20 rounded-3xl border border-amber-200 dark:border-amber-900/30">
        <p className="text-[0.85em] text-amber-800 dark:text-amber-200 leading-relaxed font-medium italic text-center">
          "Al estampar mi firma digital, certifico que la información proporcionada es verdadera y completa, y acepto íntegramente los términos de participación y uso de imagen descritos en los pasos anteriores."
        </p>
      </div>
    </div>
  )
}
