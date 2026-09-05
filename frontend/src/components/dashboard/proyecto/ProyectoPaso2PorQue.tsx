'use client'

interface ProyectoPaso2PorQueProps {
  formData: any
  setFormData: (data: any) => void
  themePrimary: string
  themeSecondary: string
}

export default function ProyectoPaso2PorQue({
  formData,
  setFormData,
  themePrimary,
  themeSecondary
}: ProyectoPaso2PorQueProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 p-2 opacity-60 rounded-[0.8rem]" style={{ backgroundColor: themePrimary }}>
        <span className="w-8 h-8 rounded-full flex items-center justify-center text-clr1 text-[0.9em] font-bold" style={{ color: themeSecondary }}>2</span>
        <h3 className="text-xl font-black uppercase tracking-tight text-clr2 dark:text-dclr2" style={{ color: themeSecondary }}>¿Por Qué?</h3>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 min-h-[420px] p-1 font-body">
        {/* Left Column (Desktop) / Top Row (Mobile) */}
        <div className="w-full flex items-center justify-center lg:items-end lg:justify-start">
          <img 
            src="/images/proyectos/PorQue2.svg" 
            alt="Ilustración Paso 2" 
            className="block lg:hidden w-full max-h-[160px] object-contain mb-2"
          />
          <img 
            src="/images/proyectos/PorQue.svg" 
            alt="Ilustración Paso 2" 
            className="hidden lg:block w-full max-h-[500px] object-contain"
          />
        </div>

        {/* Right Column (Desktop) / Bottom Row (Mobile) */}
        <div className="w-full space-y-2 bg-clr7 dark:bg-dclr7 p-1 rounded-[1rem] border border-clr7 dark:border-dclr7 backdrop-blur-xs shadow-md">
          <div className="space-y-1">
            <label className="text-[0.8em] md:text-[0.9em] font-bold uppercase p-1 rounded-[0.6rem] text-center" style={{ backgroundColor: themePrimary, color: themeSecondary }}>Diagnóstico<br />¿Qué vimos?</label>
            <textarea 
              value={formData.paso2_por_que_diagnostico || ''}
              onChange={e => setFormData({ ...formData, paso2_por_que_diagnostico: e.target.value })}
              placeholder="Describe la oportunidad o necesidad identificada..."
              className="w-full p-2 rounded-2xl border-2 border-clr7 dark:border-dclr7 bg-clr1 dark:bg-dclr1 font-bold h-24 text-[0.9em]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[0.8em] md:text-[0.9em] font-bold uppercase p-1 rounded-[0.6rem] text-center" style={{ backgroundColor: themePrimary, color: themeSecondary }}>Justificación y Fundamentos<br />¿Por qué lo haremos?</label>
            <textarea 
              value={formData.paso2_por_que_justificacion || ''}
              onChange={e => setFormData({ ...formData, paso2_por_que_justificacion: e.target.value })}
              placeholder="Explica por qué es fundamental realizar este proyecto ahora..."
              className="w-full p-2 rounded-2xl border-2 border-clr7 dark:border-dclr7 bg-clr1 dark:bg-dclr1 font-bold h-28 text-[0.9em]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
