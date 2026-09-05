'use client'

interface ProyectoPaso3ParaQueProps {
  formData: any
  setFormData: (data: any) => void
  themePrimary: string
  themeSecondary: string
}

export default function ProyectoPaso3ParaQue({
  formData,
  setFormData,
  themePrimary,
  themeSecondary
}: ProyectoPaso3ParaQueProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 p-2 opacity-60 rounded-[0.8rem]" style={{ backgroundColor: themePrimary }}>
        <span className="w-8 h-8 rounded-full flex items-center justify-center text-clr1 text-[0.9em] font-bold" style={{ color: themeSecondary }}>3</span>
        <h3 className="text-xl font-black uppercase tracking-tight text-clr2 dark:text-dclr2" style={{ color: themeSecondary }}>¿Para Qué?</h3>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 min-h-[420px] p-1 font-body">
        {/* Left Column (Desktop) / Top Row (Mobile) */}
        <div className="w-full flex items-center justify-center lg:items-end lg:justify-start">
          <img 
            src="/images/proyectos/ParaQue2.svg" 
            alt="Ilustración Paso 3" 
            className="block lg:hidden w-full max-h-[160px] object-contain mb-2"
          />
          <img 
            src="/images/proyectos/ParaQue.svg" 
            alt="Ilustración Paso 3" 
            className="hidden lg:block w-full max-h-[500px] object-contain"
          />
        </div>

        {/* Right Column (Desktop) / Bottom Row (Mobile) */}
        <div className="w-full space-y-2 bg-clr7 dark:bg-dclr7 p-1 rounded-[1rem] border border-clr7 dark:border-dclr7 backdrop-blur-xs shadow-md">
          <div className="p-2 bg-clr4 dark:bg-dclr4 rounded-xl border border-clr4 text-[0.9em] font-bold">
            <span className="font-black text-clr4 dark:text-dclr4 uppercase block">💡 Guía Rápida:</span>
            <p className="opacity-90 leading-tight">**General:** El gran sueño.<br />**Específicos:** Pasos medibles.</p>
          </div>

          <div className="space-y-1">
            <label className="text-[0.8em] md:text-[0.9em] font-bold uppercase ml-1 p-1 rounded-[0.6rem] text-center" style={{ backgroundColor: themePrimary, color: themeSecondary }}>Objetivo General</label>
            <textarea 
              value={formData.paso3_para_que_general || ''}
              onChange={e => setFormData({ ...formData, paso3_para_que_general: e.target.value })}
              placeholder="El gran propósito que se desea conseguir..."
              className="w-full p-2 rounded-2xl border-2 border-clr7 dark:border-dclr7 bg-clr1 dark:bg-dclr1 font-bold h-20 text-[0.9em]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[0.8em] md:text-[0.9em] font-bold uppercase ml-1 p-1 rounded-[0.6rem] text-center" style={{ backgroundColor: themePrimary, color: themeSecondary }}>Objetivos Específicos</label>
            <textarea 
              value={formData.paso3_para_que_especificos || ''}
              onChange={e => setFormData({ ...formData, paso3_para_que_especificos: e.target.value })}
              placeholder="Meta 1, Meta 2... (secuenciales y medibles)..."
              className="w-full p-2 rounded-2xl border-2 border-clr7 dark:border-dclr7 bg-clr1 dark:bg-dclr1 font-bold h-24 text-[0.9em]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
