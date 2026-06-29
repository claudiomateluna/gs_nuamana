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
        <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[0.9em] font-bold" style={{ color: themeSecondary }}>3</span>
        <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-white" style={{ color: themeSecondary }}>¿Para Qué?</h3>
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
        <div className="w-full space-y-2 bg-zinc-50/30 dark:bg-zinc-900/30 p-1 rounded-[1rem] border border-zinc-150 dark:border-white/5 backdrop-blur-xs shadow-md">
          <div className="p-2 bg-blue-50/80 dark:bg-blue-900/20 rounded-xl border border-blue-200/30 text-[0.9em] font-bold">
            <span className="font-black text-blue-700 dark:text-blue-300 uppercase block">💡 Guía Rápida:</span>
            <p className="opacity-90 leading-tight">**General:** El gran sueño.<br />**Específicos:** Pasos medibles.</p>
          </div>

          <div className="space-y-1">
            <label className="text-[0.8em] md:text-[0.9em] font-bold uppercase ml-1 p-1 rounded-[0.6rem] text-center" style={{ backgroundColor: themePrimary, color: themeSecondary }}>Objetivo General</label>
            <textarea 
              value={formData.paso3_para_que_general || ''}
              onChange={e => setFormData({ ...formData, paso3_para_que_general: e.target.value })}
              placeholder="El gran propósito que se desea conseguir..."
              className="w-full p-2 rounded-2xl border-2 border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800 font-bold h-20 text-[0.9em]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[0.8em] md:text-[0.9em] font-bold uppercase ml-1 p-1 rounded-[0.6rem] text-center" style={{ backgroundColor: themePrimary, color: themeSecondary }}>Objetivos Específicos</label>
            <textarea 
              value={formData.paso3_para_que_especificos || ''}
              onChange={e => setFormData({ ...formData, paso3_para_que_especificos: e.target.value })}
              placeholder="Meta 1, Meta 2... (secuenciales y medibles)..."
              className="w-full p-2 rounded-2xl border-2 border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800 font-bold h-24 text-[0.9em]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
