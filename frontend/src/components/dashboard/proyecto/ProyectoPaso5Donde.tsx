'use client'

interface ProyectoPaso5DondeProps {
  formData: any
  setFormData: (data: any) => void
  themePrimary: string
  themeSecondary: string
}

export default function ProyectoPaso5Donde({
  formData,
  setFormData,
  themePrimary,
  themeSecondary
}: ProyectoPaso5DondeProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 p-2 opacity-60 rounded-[0.8rem]" style={{ backgroundColor: themePrimary }}>
        <span className="w-8 h-8 rounded-full flex items-center justify-center text-pclr12 text-[0.9em] font-bold" style={{ color: themeSecondary }}>5</span>
        <h3 className="text-xl font-black uppercase tracking-tight text-pclr4 dark:text-pdclr4" style={{ color: themeSecondary }}>¿Dónde?</h3>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 min-h-[420px] p-1 font-body">
        {/* Left Column (Desktop) / Top Row (Mobile) */}
        <div className="w-full flex items-center justify-center lg:items-end lg:justify-start">
          <img 
            src="/images/proyectos/Donde2.svg" 
            alt="Ilustración Paso 5" 
            className="block lg:hidden w-full max-h-[160px] object-contain mb-2"
          />
          <img 
            src="/images/proyectos/Donde.svg" 
            alt="Ilustración Paso 5" 
            className="hidden lg:block w-full max-h-[500px] object-contain"
          />
        </div>

        {/* Right Column (Desktop) / Bottom Row (Mobile) */}
        <div className="w-full space-y-2 bg-pclr3 dark:bg-pdclr3 p-1 rounded-[1rem] border border-pclr13 dark:border-pdclr13 backdrop-blur-xs shadow-md">
          <div className="space-y-1">
            <label className="text-[0.8em] md:text-[0.9em] font-bold uppercase ml-1 p-1 rounded-[0.6rem] text-center" style={{ backgroundColor: themePrimary, color: themeSecondary }}>Ubicación y Medidas de Seguridad</label>
            <textarea 
              value={formData.paso5_donde || ''}
              onChange={e => setFormData({ ...formData, paso5_donde: e.target.value })}
              placeholder="Indica las ubicaciones físicas y qué medidas de seguridad o accesibilidad considerarán..."
              className="w-full p-2 rounded-2xl border-2 border-pclr13 dark:border-pdclr13 bg-pclr1 dark:bg-pdclr1 font-bold h-36 text-[0.9em]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
