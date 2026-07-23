'use client';

import { UnitView } from './UnitView';
import { SHARED_AREAS, EGRESO_PILARES, ESPECIALIDADES_CAMPOS, ESPECIALIDADES_PRINCIPIOS } from '@/data/unit-configs';

interface Objective { id: string; area_id: number; texto_infantil: string; texto_terminal: string; }
interface CompaniaCustomContentProps { objectives: Objective[]; }

export default function CompaniaCustomContent({ objectives = [] }: CompaniaCustomContentProps) {
  const primario = '#00b7dc';
  const secundario = '#e7a913';
  const areas = SHARED_AREAS[2];

  return (
    <UnitView
      primario={primario}
      secundario={secundario}
      areas={areas}
      objectives={objectives}
      profileTabLabels={{ desarrollo: 'Desarrollo de la Guía (11 a 15 años)', egreso: 'Perfil de Egreso (A los 20 años)' }}
      profileContent={{
        desarrollo: <CiaDesarrollo primario={primario} secundario={secundario} />,
        egreso: <CiaEgreso primario={primario} />,
      }}
      tabs={[
        { key: 'camino', label: 'Etapas de Progresión', content: <CiaCamino primario={primario} /> },
        { key: 'objetivos', label: 'Objetivos Educativos', content: <CiaObjetivos primario={primario} areas={areas} objectives={objectives} /> },
        { key: 'proyectos', label: 'Proyectos y Ciclo', content: <CiaProyectos primario={primario} /> },
        { key: 'especialidades', label: 'Especialidades', content: <CiaEspecialidades primario={primario} /> },
        { key: 'mistica', label: 'Símbolos', content: <CiaMistica primario={primario} secundario={secundario} /> },
      ]}
    />
  );
}

function CiaDesarrollo({ primario, secundario }: { primario: string; secundario: string }) {
  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>Un Perfil a Grandes Trazos de la Adolescencia</h3>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">El perfil a grandes trazos describe las características de las guías en este período de desarrollo (11 a 15 años) según los distintos aspectos de su personalidad, ordenados para acompañar su crecimiento:</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
        {[{ title: "Un Cuerpo Nuevo", desc: "El cuerpo se renueva cada día. En él pasan cosas que desconciertan, que invitan a la exploración, que empujan al extremo de los propios límites, que revelan la belleza y hacen surgir el pudor. El cansancio es un invitado permanente, la presentación personal las inquieta y la ropa parece no quedarles nunca." },{ title: "Ideas Emergentes", desc: "El mundo mental crece. Las ideas tienen vida propia y se pueden combinar en abstracciones. Las preguntas, antes orientadas al exterior, se concentran en sí mismas: ¿Quién soy? ¿Cómo soy? Cuestionan todo aquello que antes asumían como una verdad indiscutible." },{ title: "Valores Propios", desc: "Lo correcto e incorrecto es objeto de dudas y preguntas. Surge la capacidad de ponerse en el lugar del otro. Se inicia la construcción de un código de conducta asumido personalmente, independiente de la opinión familiar y basado en el diálogo con sus pares." },{ title: "Emociones Contradictorias", desc: "El mundo interior cobra fuerza con oleadas sentimentales intensas y perdurables que desconciertan y descontrolan. Se definen por amar el amor, odiar el odio, ser 'amiga de las amigas y enemiga de las enemigas', en una etapa de búsqueda de identidad propia." },{ title: "Amigas para la Vida", desc: "En las amigas se cree, se confía y se descansa. Los círculos de amistad son más reducidos pero mucho más profundos, funcionando como espejo y motor del desarrollo. Surge cierta distancia defensiva o confrontación con el entorno familiar inmediato." },{ title: "Una Fe Personal", desc: "Tránsito entre la fe infantil heredada del hogar y la fe del adulto, personal e íntima. Se vive en la dualidad entre la crítica permanente a la forma exterior y la búsqueda constante del sentido interior, distinguiendo la creencia propia de la del adulto." }].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-2 shadow-md space-y-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: secundario }} />
            <h4 className="font-extrabold uppercase text-[1.1em] text-zinc-900 dark:text-white ml-2" style={{ backgroundColor: primario, color: secundario, padding: '0.25rem 0.5rem', borderRadius: '0.5rem' }}>{item.title}</h4>
            <p className="text-[0.95em] text-zinc-650 dark:text-zinc-400 leading-relaxed italic pl-2">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CiaEgreso({ primario }: { primario: string }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>Perfil de Egreso (El Horizonte de la Persona)</h3>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">En el Movimiento Guía y Scout aspiramos a que, al finalizar tu paso por la Compañía y el Grupo, seas capaz de forjar tu propio proyecto de vida basándote en los siguientes pilares de la personalidad:</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
        {EGRESO_PILARES.map((pilar, idx) => (
          <div key={idx} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-2 shadow-md space-y-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: primario }} />
            <h4 className="font-extrabold uppercase text-[1.1em] text-zinc-900 dark:text-white pl-2">{pilar.title}</h4>
            <p className="text-[0.95em] text-zinc-650 dark:text-zinc-400 leading-relaxed pl-2">{pilar.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CiaCamino({ primario }: { primario: string }) {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>La Ruta del Crecimiento en la Compañía</h3>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">En la Compañía, el crecimiento personal se vive como una exploración continua de nuevos territorios con un grupo de amigas. Las insignias de progresión se entregan al comienzo de cada etapa como un estímulo para seguir adelante en tu propio Diario de los Desafíos.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
        {[{ title: "Etapa Alba", subtitle: "La Primera Luz", desc: "El camino nos presenta los primeros destellos del sol por la cordillera. La guía se reconoce dentro de su patrulla y comienza a explorar los desafíos de 11 a 13 años.", img: "/images/progresion/compania/etapa_alba.png" },{ title: "Etapa Amanecer", subtitle: "El Camino Se Ensancha", desc: "El sol ya se asoma indicando que el viaje ha comenzado. Se entrega al alcanzar aproximadamente la mitad de los desafíos del rango de 11 a 13 años, brindando más dirección a la senda.", img: "/images/progresion/compania/etapa_amanecer.png" },{ title: "Etapa Luz", subtitle: "Exploración Eficaz", desc: "Con el sol alto en el cielo azul, la ruta se hace más visible y segura. Se inicia al interactuar con los objetivos de 13 a 15 años, marcando la senda para las demás.", img: "/images/progresion/compania/etapa_luz.png" },{ title: "Etapa Resplandor", subtitle: "Legado y Compromiso", desc: "El sol brilla fuerte sobre nuestros hombros y la travesía es más intensa. Se entrega al promediar los objetivos de 13 a 15 años, preparándote para el paso a la Avanzada.", img: "/images/progresion/compania/etapa_resplandor.png" }].map((etapa, idx) => (
          <div key={idx} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-5 space-y-4 flex flex-col items-center text-center shadow-md">
            <div className="w-30 h-30 flex items-center justify-center"><img src={etapa.img} alt={etapa.title} className="max-w-full max-h-full object-contain" /></div>
            <div><h4 className="font-extrabold uppercase text-[1.1em] text-zinc-900 dark:text-white">{etapa.title}</h4><span className="text-[0.8em] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mt-0.5">{etapa.subtitle}</span><p className="text-[0.9em] text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">{etapa.desc}</p></div>
          </div>
        ))}
      </div>
      <div className="bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-2 space-y-4">
        <h4 className="font-extrabold uppercase text-[1.2em] text-zinc-900 dark:text-white">El Diario de los Desafíos y los Sellos</h4>
        <p className="text-[1.02em] leading-relaxed text-zinc-700 dark:text-zinc-300">Cuando al final de un ciclo de programa se evalúan tus objetivos y se consideran logrados, se procede a estampar un <strong>sello</strong> en tu pasaporte personal (Diario de los Desafíos). Cada área de desarrollo tiene su propio diseño inspirado en símbolos de la naturaleza que representan el crecimiento personal y la exploración de nuevos territorios.</p>
      </div>
    </div>
  );
}

function CiaObjetivos({ primario, areas, objectives }: { primario: string; areas: typeof SHARED_AREAS[2]; objectives: Objective[] }) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>Objetivos Educativos (Los desafíos de la Guía)</h3>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">La progresión personal se organiza en seis áreas de desarrollo. Cada una posee un símbolo protector en la naturaleza de la Compañía. Descubre tus objetivos y desafíate a explorar nuevos caminos junto a tu patrulla.</p>
      </div>
      <div className="space-y-8">
        {areas.map((area) => {
          const areaObjs = objectives.filter(o => o.area_id === area.id);
          return (
            <div key={area.id} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-2 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-30 h-30 flex items-center justify-center"><img src={area.img} alt={area.name} className="max-w-full max-h-full object-contain" /></div>
                  <div><h4 className="font-extrabold uppercase text-[1.25em] text-zinc-900 dark:text-white flex items-center gap-2">{area.name}</h4><p className="text-[0.85em] text-zinc-500 dark:text-zinc-400 leading-snug">{area.desc}</p></div>
                </div>
                {area.symbol && <div className="text-left sm:text-right"><span className="text-[0.8em] font-black uppercase tracking-widest px-3 py-1 rounded-full border" style={{ borderColor: `${area.color}40`, backgroundColor: `${area.color}10`, color: area.color }}>{area.symbol}</span><p className="text-[0.8em] text-zinc-400 dark:text-zinc-500 mt-1 sm:max-w-xs leading-normal">{area.symbolDesc}</p></div>}
              </div>
              <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
                {areaObjs.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">{areaObjs.map((obj) => (<div key={obj.id} className="bg-zinc-50 dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-2xl p-4 flex gap-3 items-start hover:border-zinc-300 dark:hover:border-white/20 transition-colors"><span className="font-bold text-[1.1em] mt-0.5" style={{ color: area.color }}>•</span><div className="space-y-1"><span className="font-bold text-zinc-800 dark:text-zinc-200 block text-[0.98em]">{obj.texto_infantil}</span><p className="text-[0.85em] text-zinc-500 dark:text-zinc-400 leading-snug">Meta terminal: {obj.texto_terminal}</p></div></div>))}</div>) : (<p className="text-[0.95em] text-zinc-500 dark:text-zinc-400 italic">Cargando objetivos educativos desde la base de datos...</p>)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CiaProyectos({ primario }: { primario: string }) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>Ciclo de Programa y Proyectos de Patrulla</h3>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">En la Compañía, el juego democrático y el protagonismo de las guías organizan la vida común. A través de ciclos que ocurren tres veces al año, planificamos, preparamos, desarrollamos y evaluamos nuestras aventuras.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-4">
          <h4 className="font-extrabold uppercase text-[1.2em] text-zinc-900 dark:text-white" style={{ color: primario }}>Las 4 Fases del Ciclo de Programa</h4>
          <div className="space-y-4">
            {[{ phase: "Fase 1: Diagnóstico de la Unidad", desc: "El Consejo de Compañía y los Consejos de Patrulla analizan el clima educativo, el avance de objetivos y las guiadoras, fijando el Énfasis del Ciclo." },{ phase: "Fase 2: Propuesta y Selección", desc: "Las patrullas exponen ideas de proyectos y actividades variables. Mediante Juegos Democráticos en Asamblea se eligen las favoritas." },{ phase: "Fase 3: Diseño y Preparación", desc: "Se arma un calendario flexible aprobado por la Asamblea. Cada actividad se diseña definiendo objetivos claros y se preparan materiales." },{ phase: "Fase 4: Desarrollo y Evaluación", desc: "¡La emoción de hacer cosas! Se ejecutan los proyectos, se evalúa el cumplimiento de metas y se reconoce la progresión con sellos." }].map((item, idx) => (
              <div key={idx} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center font-bold text-[0.85em] text-zinc-600 dark:text-zinc-300 shrink-0 mt-0.5 border border-zinc-200 dark:border-white/10">{idx + 1}</span>
                <div><h5 className="font-bold text-zinc-800 dark:text-zinc-200 text-[1.02em]">{item.phase}</h5><p className="text-[0.9em] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">{item.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-4">
            <h4 className="font-extrabold uppercase text-[1.2em] text-zinc-900 dark:text-white" style={{ color: primario }}>Las Actividades de Compañía: Deben ser DURAS</h4>
            <p className="text-[0.98em] text-zinc-650 dark:text-zinc-400 leading-relaxed">Los proyectos son actividades de mediana o larga duración organizadas por las patrullas. Deben cumplir con el criterios de ser <strong>DURAS</strong>:</p>
            <div className="grid grid-cols-1 gap-2.5">
              {[{ l: "D", title: "Desafiantes", desc: "Ponen a prueba las capacidades y estimulan a superar nuevos límites." },{ l: "U", title: "Útiles", desc: "Tienen un propósito claro, enseñan destrezas prácticas o sirven a la comunidad." },{ l: "R", title: "Recompensantes", desc: "Producen satisfacción personal e interna por el logro alcanzado." },{ l: "A", title: "Atractivas", desc: "Interesantes, llenas de aventura y motivantes para las jóvenes." },{ l: "S", title: "Seguras", desc: "Identifican y minimizan riesgos físicos y emocionales para todas." }].map((d, i) => (
                  <div key={i} className="flex gap-3 text-[0.88em]">
                    <span className="w-6 h-6 rounded-lg flex items-center justify-center font-black text-white shrink-0 text-[0.85em]" style={{ backgroundColor: primario }}>{d.l}</span>
                    <div className="text-zinc-700 dark:text-zinc-300"><strong>{d.title}:</strong> <span className="text-zinc-550 dark:text-zinc-400">{d.desc}</span></div>
                  </div>
                ))}
            </div>
          </div>
          <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-4">
            <h4 className="font-extrabold uppercase text-[1.2em] text-zinc-900 dark:text-white" style={{ color: primario }}>Actividades de la Unidad</h4>
            <div className="space-y-3 text-[0.95em]">
              <div className="space-y-1"><span className="font-bold text-zinc-800 dark:text-zinc-200 block text-[0.95em]">📌 Actividades Fijas:</span><p className="text-[0.9em] text-zinc-550 dark:text-zinc-400 leading-relaxed pl-3 border-l-2 border-zinc-200 dark:border-white/10">Rutinas constantes que estructuran la vida de la unidad: Reuniones de Patrulla y Compañía, Campamentos, Excursiones al aire libre y la tradicional Fiesta del Trébol.</p></div>
              <div className="space-y-1"><span className="font-bold text-zinc-800 dark:text-zinc-200 block text-[0.95em]">🎨 Actividades Variables:</span><p className="text-[0.9em] text-zinc-550 dark:text-zinc-400 leading-relaxed pl-3 border-l-2 border-zinc-200 dark:border-white/10">Elegidas específicamente para responder al Énfasis del Ciclo. Ejemplos: reciclaje ecológico, safaris fotográficos, talleres de nudos, deportes de aventura o proyectos solidarios locales.</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CiaEspecialidades({ primario }: { primario: string }) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight p-2 rounded-lg" style={{ backgroundColor: primario, color: '#ffffff' }}>El Sistema de Especialidades en la Compañía</h3>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300 font-semibold">Las especialidades son una propuesta educativa complementaria, voluntaria e individual, que invita a las guías a descubrir sus aptitudes innatas, aprender haciendo y orientar sus talentos hacia el servicio útil de los demás.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ESPECIALIDADES_PRINCIPIOS('scout').map((principio, idx) => (
          <div key={idx} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-3xl p-2 text-center space-y-2 shadow-sm border-l-4" style={{ borderLeftColor: primario }}>
            <span className="text-6xl text-center p-4">{principio.icon}</span>
            <h5 className="font-extrabold uppercase text-[0.95em] text-zinc-900 dark:text-white">{principio.title}</h5>
            <p className="text-[0.88em] text-zinc-650 dark:text-zinc-400 leading-relaxed font-semibold">{principio.desc}</p>
          </div>
        ))}
      </div>
      <div className="space-y-4 pt-4">
        <h4 className="text-[1.25em] font-black uppercase text-zinc-900 dark:text-white">Campos de Interés (Especialidades)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {ESPECIALIDADES_CAMPOS.map((campo, idx) => (
            <div key={idx} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-2xl py-3 pl-1 pr-3 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all flex gap-2 border-t-[10px]" style={{ borderTopColor: campo.color }}>
              <img src={campo.icon} alt={campo.title} className="w-20 h-20 object-contain" />
              <div className="space-y-1"><h5 className="font-extrabold text-[1.1em] text-zinc-950 dark:text-zinc-100 uppercase">{campo.title}</h5><p className="text-[0.88em] text-zinc-650 dark:text-zinc-400 leading-relaxed font-semibold">{campo.desc}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CiaMistica({ primario, secundario }: { primario: string; secundario: string }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-4">
          <span className="text-[0.8em] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-900/30">Compromiso de Honor</span>
          <h4 className="font-extrabold uppercase text-[1.3em] text-zinc-900 dark:text-white leading-tight">La Promesa Guía</h4>
          <p className="text-[1.08em] leading-relaxed text-zinc-700 dark:text-zinc-300 italic pl-4 border-l-2 border-cyan-500">"Hacer cuanto de mí dependa para buscar a Dios, amar a mi familia, ayudar a los demás, servir a mi país, trabajar por la paz y vivir la Ley Guía."</p>
        </div>
        <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-4">
          <span className="text-[0.8em] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/30">Código de Conducta</span>
          <h4 className="font-extrabold uppercase text-[1.3em] text-zinc-900 dark:text-white leading-tight">La Ley Guía</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[0.92em]">
            {["1. Es digna de confianza.","2. Es leal.","3. Sirve sin esperar recompensa.","4. Comparte con todos.","5. Es alegre y cordial.","6. Protege la vida y la naturaleza.","7. Es responsable y nada hace a medias.","8. Es optimista.","9. Cuida las cosas y valora el trabajo.","10. Es coherente en su pensamiento, palabra y acción."].map((ley, idx) => (
              <span key={idx} className="text-zinc-700 dark:text-zinc-300 font-semibold">{ley}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-3 relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: primario }} /><h4 className="font-extrabold uppercase text-[1.1em] text-zinc-900 dark:text-white pl-2">El Color Cian</h4><p className="text-[0.9em] text-zinc-650 dark:text-zinc-400 leading-relaxed pl-2">Es la mezcla exacta de verde y azul claro: los colores más significativos del entorno de exploración de las guías en la naturaleza.</p></div>
        <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-3 relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: secundario }} /><h4 className="font-extrabold uppercase text-[1.1em] text-zinc-900 dark:text-white pl-2">El Trébol Mundial</h4><p className="text-[0.9em] text-zinc-650 dark:text-zinc-400 leading-relaxed pl-2">Símbolo de la Asociación Mundial (WAGGGS). Sus tres hojas recuerdan los principios de la promesa, y su aguja en el centro representa la brújula.</p></div>
        <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-3 relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: primario }} /><h4 className="font-extrabold uppercase text-[1.1em] text-zinc-900 dark:text-white pl-2">Saludo de Mano Izquierda</h4><p className="text-[0.9em] text-zinc-650 dark:text-zinc-400 leading-relaxed pl-2">Seña de confianza heredada del pueblo Ashanti: al saludar con la mano izquierda, el guerrero dejaba de lado su escudo protector.</p></div>
      </div>
      <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row items-center gap-6 mt-4">
        <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: primario }} />
        <div className="w-30 h-30 shrink-0 flex items-center justify-center"><img src="/images/logos/iconos_guias.svg" alt="Logo de Guías" className="max-w-full max-h-full object-contain" /></div>
        <div className="space-y-2"><h4 className="font-extrabold uppercase text-[1.25em] text-zinc-900 dark:text-white">Insignia Oficial de la Rama Guías</h4><p className="text-[0.95em] text-zinc-650 dark:text-zinc-400 leading-relaxed">Es el símbolo mundial de las guías. Fue elegido por su carácter natural y simple en la naturaleza a la vez que evoca los diseños que, en forma de "T" estilizada, en los antiguos mapas señalaban el norte en la rosa de los vientos. Las tres hojas representan los tres principios del Movimiento.</p></div>
      </div>
      <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: secundario }} />
        <h4 className="font-extrabold uppercase text-[1.2em] text-zinc-900 dark:text-white pl-2">Himno de la Rama: Siempre Lista</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[0.95em] pl-2">
          <div className="space-y-1"><span className="font-bold text-zinc-800 dark:text-zinc-200 block text-[0.9em] uppercase tracking-wide">Coro</span><p className="italic text-zinc-650 dark:text-zinc-400 leading-relaxed pl-3 border-l border-zinc-200 dark:border-white/10">Siempre lista, hermana guía,<br />es el deber nuestra misión,<br />ser la luz que brilla y brilla<br />por la Patria y el honor.<br />A la cumbre subiremos<br />sin descanso hasta el final<br />con el alma siempre abierta<br />en pos de nuestro ideal.</p></div>
          <div className="space-y-1"><span className="font-bold text-zinc-800 dark:text-zinc-200 block text-[0.9em] uppercase tracking-wide">Estrofa I</span><p className="italic text-zinc-650 dark:text-zinc-400 leading-relaxed pl-3 border-l border-zinc-200 dark:border-white/10">Guías, avanzad en alegre caravana<br />porque la luz nos espera al final<br />siempre en la paz, amor y amistad<br />el triunfo será de nuestra hermandad.</p></div>
        </div>
      </div>
      <div className="relative rounded-[2rem] overflow-hidden border border-zinc-200 dark:border-white/10 bg-zinc-900 shadow-xl" style={{ minHeight: '280px' }}>
        <div className="absolute inset-0 z-0 select-none pointer-events-none opacity-40 dark:opacity-30"><img src="/images/unidades/bandera_cia.jpg" alt="Bandera de la Compañía de Guías" className="w-full h-full object-cover" /></div>
        <div className="relative z-10 p-8 sm:p-10 flex flex-col justify-end h-full space-y-4 max-w-2xl bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent">
          <span className="text-[0.8em] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 self-start">Símbolo de Unidad</span>
          <h4 className="text-[1.5em] font-black uppercase tracking-tight text-white leading-tight">La Bandera de la Compañía</h4>
          <p className="text-[1.02em] leading-relaxed text-zinc-200">La bandera oficial de la Rama lleva como fondo el color <strong>cian</strong> y en su centro, en amarillo dorado, el <strong>trébol</strong> de la insignia Guía Mundial.</p>
        </div>
      </div>
    </div>
  );
}
