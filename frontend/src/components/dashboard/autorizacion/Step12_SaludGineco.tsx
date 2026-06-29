'use client'

interface StepProps {
  formData: any
  setFormData: (data: any) => void
  perfil: any
}

export default function Step12_SaludGineco({ formData, setFormData, perfil }: StepProps) {
  const isFemale = perfil.sexo === 'femenina';

  const titleStyle = "text-[1.2em] font-black text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-4 border-b-2 border-clr7 pb-2";
  const labelContainerStyle = "flex items-center gap-2 mb-1";
  const labelStyle = "text-[0.9em] font-black uppercase text-clr2 tracking-widest block";
  const inputStyle = "w-full bg-zinc-50 dark:bg-clr3 dark:text-dclr2 border-2 border-transparent focus:border-clr7 rounded-xl p-3 text-[1em] font-bold outline-none transition-all shadow-inner";
  
  const infoIconContainerStyle = "inline-block";
  const infoIconStyle = "text-clr7 cursor-help text-[1.1em] hover:scale-110 transition-transform flex items-center justify-center";
  const tooltipStyle = "fixed z-[300] left-1/2 -translate-x-1/2 top-1/4 w-[90%] max-w-lg p-6 bg-zinc-800 dark:bg-zinc-900 text-white text-[1em] font-medium leading-relaxed rounded-[2rem] shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 border-2 border-clr7/50 backdrop-blur-md";

  // Lógica de visibilidad
  const hasMenstruacion = formData.menstruaciones === 'Si' || (formData.menstruaciones === undefined && perfil.menstruaciones === 'Si');
  const isEmbarazada = formData.embarazo === 'Si' || (formData.embarazo === undefined && perfil.embarazo === 'Si');

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

  if (!isFemale) {
    return (
      <div className="animate-in fade-in duration-500 p-10 text-center">
        <h3 className={titleStyle}>12. INFORMACIÓN GINECO-OBSTÉTRICA</h3>
        <div className="bg-zinc-50 dark:bg-black/10 p-4 rounded-[1rem] border-2 border-dashed border-clr10 dark:border-clr4">
          <p className="text-clr2 font-bold italic text-[1em]">Esta sección no aplica según tu asignación de nacimiento registrada.</p>
          <p className="mt-4 text-[0.8em] uppercase font-black text-clr7 tracking-widest">Puedes avanzar al siguiente paso →</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 overflow-x-hidden p-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
      <h3 className={titleStyle}>12. INFORMACIÓN GINECO-OBSTÉTRICA</h3>
      
      <div className="space-y-4">
        
        {/* Item 1: Menstruaciones */}
        <div className="space-y-4">
          <FieldInfo label="¿Tienes menstruaciones?" info="Por favor cuéntanos si ya has tenido menstruaciones" />
          <div className="flex gap-4">
            {['Si', 'No'].map(o => (
              <label key={o} className={`flex-1 p-3 border-2 rounded-xl text-center cursor-pointer font-bold uppercase text-[0.9em] transition-all ${formData.menstruaciones === o ? 'border-clr7 bg-clr7 text-white' : 'border-zinc-100 dark:border-clr4 dark:text-dclr2'}`}>
                <input type="radio" name="mens_radio" checked={formData.menstruaciones === o} onChange={() => setFormData({ ...formData, menstruaciones: o })} className="hidden" /> {o}
              </label>
            ))}
          </div>
        </div>

        {hasMenstruacion && (
          <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Item 2: Ciclos */}
              <div className="space-y-4">
                <FieldInfo label="¿Tus ciclos menstruales son…?" info="Cuantanos si tienes ciclos menstruales regulares o irregulares" />
                <div className="flex gap-4">
                  {['Regulares', 'Irregulares'].map(o => (
                    <label key={o} className={`flex-1 p-3 border-2 rounded-xl text-center cursor-pointer font-bold uppercase text-[0.8em] transition-all ${formData.ciclo_regular === o ? 'border-clr7 bg-clr7 text-white' : 'border-zinc-100 dark:border-clr4 dark:text-dclr2'}`}>
                      <input type="radio" name="ciclo_radio" checked={formData.ciclo_regular === o} onChange={() => setFormData({ ...formData, ciclo_regular: o })} className="hidden" /> {o}
                    </label>
                  ))}
                </div>
              </div>

              {/* Item 3: Dismenorrea */}
              <div className="space-y-4">
                <FieldInfo label="¿Sufres de dismenorrea?" info="Por favor cuentanos si sufres cólicos o dolores durante tu menstruación" />
                <div className="flex gap-4">
                  {['Si', 'No'].map(o => (
                    <label key={o} className={`flex-1 p-3 border-2 rounded-xl text-center cursor-pointer font-bold uppercase text-[0.8em] transition-all ${formData.dismenorrea === o ? 'border-clr7 bg-clr7 text-white' : 'border-zinc-100 dark:border-clr4 dark:text-dclr2'}`}>
                      <input type="radio" name="dis_radio" checked={formData.dismenorrea === o} onChange={() => setFormData({ ...formData, dismenorrea: o })} className="hidden" /> {o}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Item 4: Medicamento cólicos */}
              <div className="space-y-1">
                <FieldInfo label="¿Qué medicamento consumes para los cólicos menstruales?" info="Dinos si tomas algún medicamento especifico para los cólicos menstruales" />
                <input type="text" defaultValue={formData.medicamento_colicos || perfil.medicamento_colicos || ''} onChange={(e) => setFormData({ ...formData, medicamento_colicos: e.target.value })} placeholder="Escriba aquí..." className={inputStyle} />
              </div>

              {/* Item 5: Método anticonceptivo */}
              <div className="space-y-1">
                <FieldInfo label="¿Usas un método anticonceptivo? ¿Cuál es su nombre?" info="Cuéntanos si usas un método anticonceptivo y su nombre en caso de usarlo" />
                <input type="text" defaultValue={formData.metodo_anticonceptivo || perfil.metodo_anticonceptivo || ''} onChange={(e) => setFormData({ ...formData, metodo_anticonceptivo: e.target.value })} placeholder="Nombre del método..." className={inputStyle} />
              </div>
            </div>

            {/* Item 6: Embarazo */}
            <div className="space-y-4">
              <FieldInfo label="¿Estás cursando un embarazo?" info="Cuéntanos si actualmente estas embarazada" />
              <div className="flex gap-4">
                {['Si', 'No'].map(o => (
                  <label key={o} className={`flex-1 p-3 border-2 rounded-xl text-center cursor-pointer font-bold uppercase text-[0.9em] transition-all ${formData.embarazo === o ? 'border-clr7 bg-clr7 text-white' : 'border-zinc-100 dark:border-clr4 dark:text-dclr2'}`}>
                    <input type="radio" name="emb_radio" checked={formData.embarazo === o} onChange={() => setFormData({ ...formData, embarazo: o })} className="hidden" /> {o}
                  </label>
                ))}
              </div>
            </div>

            {isEmbarazada && (
              <div className="animate-in slide-in-from-top-4 duration-500 grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-50 dark:bg-black/10 p-2 rounded-[1em] border border-clr10 dark:border-clr4">
                {/* Item 7: Semanas */}
                <div className="space-y-1">
                  <FieldInfo label="¿En que semana de Embarazo te encuentras?" info="Indicanos en que semana de embarazo te encuentras" />
                  <select value={formData.semanas_embarazo || ''} onChange={(e) => setFormData({ ...formData, semanas_embarazo: e.target.value })} className={inputStyle}>
                    <option value="">Selecciona...</option>
                    {Array.from({ length: 42 }, (_, i) => i + 1).map(w => <option key={w} value={`semana ${w}`}>semana {w}</option>)}
                  </select>
                </div>

                {/* Item 8: Último Control */}
                <div className="space-y-1">
                  <FieldInfo label="¿En que fecha tuviste el último control?" info="Indicanos en que fecha tuviste el último control de embarazo por favor" />
                  <input type="date" defaultValue={formData.fecha_ultimo_control_embarazo || perfil.fecha_ultimo_control_embarazo || ''} onChange={(e) => setFormData({ ...formData, fecha_ultimo_control_embarazo: e.target.value })} className={inputStyle} />
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  )
}
