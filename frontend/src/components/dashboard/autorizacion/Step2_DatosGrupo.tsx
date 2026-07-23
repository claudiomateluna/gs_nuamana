'use client'

import DOMPurify from 'dompurify'
import type { StepProps } from '@/types/autorizacion'

export default function Step2_DatosGrupo({ formData, setFormData, perfil }: StepProps) {
  const unidadesMap: Record<number, string> = { 1: 'Manada', 2: 'Compañía', 3: 'Tropa', 4: 'Avanzada', 5: 'Clan' };

  const titleStyle = "text-[1.2em] font-black text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8 border-b-2 border-clr7 pb-2";
  const labelContainerStyle = "flex items-center gap-2 mb-1";
  const labelStyle = "text-[0.9em] font-black uppercase text-clr2 tracking-widest block";
  const inputStyle = "w-full bg-zinc-50 dark:bg-clr3 dark:text-dclr2 border-2 border-transparent focus:border-clr7 rounded-xl p-3 text-[1em] font-bold outline-none transition-all shadow-inner";
  
  const infoIconContainerStyle = "inline-block";
  const infoIconStyle = "text-clr7 cursor-help text-[1.1em] hover:scale-110 transition-transform flex items-center justify-center";
  const tooltipStyle = "fixed z-[300] left-1/2 -translate-x-1/2 top-1/4 w-[90%] max-w-lg p-6 bg-zinc-800 dark:bg-zinc-900 text-white text-[1em] font-medium leading-relaxed rounded-[2rem] shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 border-2 border-clr7/50 backdrop-blur-md";

  const unidades = ['No Aplica', 'Manada', 'Compañía', 'Tropa', 'Avanzada', 'Clan', 'Sin Unidad'];
  const zonasDistritos: Record<string, string[]> = {
    'Cajón del Maipo': ['Camilo Henríquez', 'Las Vizcachas', 'Puente Alto Poniente'],
    'Santiago Centro': ['Cerro Huelén', 'Santiago Centro', 'Providencia'],
    'Santiago Cordillera': ['Apoquindo', 'Los Leones', 'Manquehue', 'Vitacura'],
    'La Florida': ['Bellavista', 'Mapurayen', 'Peñimahuida'],
    'Maipo': ['San Bernardo', 'El Bosque', 'Valle del Maipo'],
    'Santiago Norte': ['Chacabuco', 'Conchalí', 'La Cañadilla', 'Quilicura', 'Renca'],
    'Santiago Oeste': ['Cerrillos', 'Maipú Nuevo Extremo', 'Melipilla', 'Pila del Ganso', 'Quilamapu', 'Quinta Normal-Cerro Navia', 'Talakanta'],
    'Santiago Oriente': ['La Reina', 'Macul', 'Ñuñoa', 'Pedro de Valdivia', 'Peñalolén'],
    'Santiago Sur': ['La Cisterna', 'La Granja', 'Pedro Aguirre Cerda', 'San Joaquín', 'San Miguel', 'Santa Rosa']
  };

  const currentZona = formData.zona || perfil.zona || 'Santiago Sur';

  const Field = ({ label, info, children, fullWidth = false }: { label: string; info: string; children: React.ReactNode; fullWidth?: boolean }) => {
    return (
      <div className={`space-y-1 ${fullWidth ? 'md:col-span-2' : ''}`}>
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
        {children}
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-500 p-4 pb-10 pt-4">
      <h3 className={titleStyle}>2. Datos de Grupo</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <Field fullWidth label="¿A que grupo Guía y Scout perteneces?" info="Seleccione el grupo guía / scout al que pertenece el niño, niña o joven, normalmente debería ser Nua Mana. *Este Dato es Obligatorio">
          <div className="flex gap-4">
            {['Guias y Scouts Nua Mana', 'Otro'].map(g => {
              const perteneceNuaMana = formData.pertenece_grupo_nua_mana !== undefined ? formData.pertenece_grupo_nua_mana : (perfil.pertenece_grupo_nua_mana ?? true);
              const isChecked = (g === 'Guias y Scouts Nua Mana' && perteneceNuaMana) || (g === 'Otro' && !perteneceNuaMana);
              return (
                <label key={g} className={`flex-1 p-3 border-2 rounded-xl text-center cursor-pointer font-bold uppercase text-[0.9em] tracking-widest transition-all ${isChecked ? 'border-clr7 bg-clr7 text-white shadow-lg scale-105' : 'border-zinc-200 dark:border-clr4 dark:text-dclr2 hover:border-clr7/30'}`}>
                  <input type="radio" name="nombre_grupo" checked={isChecked} onChange={() => setFormData({ ...formData, nombre_grupo: g, pertenece_grupo_nua_mana: g === 'Guias y Scouts Nua Mana' })} className="hidden" /> {g}
                </label>
              );
            })}
          </div>
        </Field>

        <Field label="¿A que unidad perteneces?" info="Seleccione la unidad a la que pertenece la niña, niño o joven de acuerdo a la edad del mismo (si es adulto seleccione su unidad)<br></br><br></br><b>Manada</b> – niños y niñas entre 7 y 11 años (unidad mixta)<br></br><b>Compañía</b> – niñas y jóvenes mujeres entre 11 y 15 años (unidad femenina)<br></br><b>Tropa</b> – niños y jóvenes entre 11 y 15 años (unidad masculina)<br></br><b>Avanzada</b> – jóvenes entre 15 y 17 años (unidad mixta)<br></br><b>Clan</b> – jóvenes entre 17 y 20 años (unidad mixta)<br></br><br></br><span class='font-black text-clr7'>* Estos campos son obligatorios</span>">
          <select defaultValue={formData.unidad_nombre || (perfil.unidad_id ? unidadesMap[perfil.unidad_id] : undefined) || 'Manada'} onChange={(e) => setFormData({ ...formData, unidad_nombre: e.target.value })} className={inputStyle}>
            {unidades.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </Field>

        <Field label="¿En que Zona está tu grupo?" info="Indica la Zona administrativa de la Asociación de Guías y Scouts de Chile a la que pertenece el grupo Guía y Scout que seleccionaste antes, normalmente es 'Santiago Sur'.<br/> *Este Dato es Obligatorio">
          <select defaultValue={currentZona} onChange={(e) => setFormData({ ...formData, zona: e.target.value, distrito: zonasDistritos[e.target.value][0] })} className={inputStyle}>
            {Object.keys(zonasDistritos).map(z => <option key={z} value={z}>{z}</option>)}
          </select>
        </Field>

        <Field fullWidth label="¿En que Distrito se encuentra tu grupo Guía y Scout?" info="Indica el Distrito administrativo de la Asociación de Guías y Scouts de Chile a la que pertenece el grupo Guía y Scout que seleccionaste antes, normalmente es 'La Granja'. *Este Dato es Obligatorio">
          <select value={formData.distrito || perfil.distrito || zonasDistritos[currentZona][0]} onChange={(e) => setFormData({ ...formData, distrito: e.target.value })} className={inputStyle}>
            {zonasDistritos[currentZona]?.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>

      </div>
    </div>
  )
}
