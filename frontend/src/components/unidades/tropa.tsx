'use client';

import { UnitView } from './UnitView';
import { SHARED_AREAS, EGRESO_PILARES, ESPECIALIDADES_CAMPOS, ESPECIALIDADES_PRINCIPIOS } from '@/data/unit-configs';

interface Objective { id: string; area_id: number; texto_infantil: string; texto_terminal: string; }
interface TropaCustomContentProps { objectives: Objective[]; nombreUnidad?: string | null; }

export default function TropaCustomContent({ objectives = [], nombreUnidad }: TropaCustomContentProps) {
  const primario = '#009b3a';
  const secundario = '#1b1b1b';
  const areas = SHARED_AREAS[3];

  return (
    <UnitView
      primario={primario}
      secundario={secundario}
      areas={areas}
      objectives={objectives}
      profileTabLabels={{ desarrollo: 'Desarrollo del Scout (11 a 15 años)', egreso: 'Perfil de Egreso (A los 20 años)' }}
      profileContent={{
        desarrollo: <TropaDesarrollo primario={primario} />,
        egreso: <TropaEgreso primario={primario} />,
      }}
      tabs={[
        { key: 'camino', label: 'Etapas de Tropa', content: <TropaCamino primario={primario} /> },
        { key: 'objetivos', label: 'Objetivos Educativos', content: <TropaObjetivos primario={primario} areas={areas} objectives={objectives} /> },
        { key: 'proyectos', label: 'Aventuras y Ciclo', content: <TropaProyectos primario={primario} /> },
        { key: 'especialidades', label: 'Especialidades', content: <TropaEspecialidades primario={primario} /> },
        { key: 'mistica', label: 'Símbolos', content: <TropaMistica primario={primario} nombreUnidad={nombreUnidad} /> },
      ]}
    />
  );
}

function TropaDesarrollo({ primario }: { primario: string }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>Un Perfil a Grandes Trazos de la Adolescencia</h3>
        <p className="text-[1.05em] leading-relaxed text-clr2 dark:text-dclr2">El perfil a grandes trazos describe las características reales y comportamientos de los scouts en este período de desarrollo (11 a 15 años), abarcando todos los aspectos de su personalidad:</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {[{ title: "Un Cuerpo Nuevo", desc: "El cuerpo se renueva y crece a pasos agigantados. En él ocurren cambios que desconciertan y llaman a la exploración. El cansancio es un compañero constante, la torpeza motriz (desgarbo) es habitual y les preocupa enormemente la apariencia física y la aceptación de los demás." },{ title: "Ideas Emergentes", desc: "Se expande la mente y aparece la capacidad de pensar en abstracto. Los jóvenes combinan conceptos y reflexionan de forma autónoma. El foco de sus preguntas pasa a ser interno: ¿Quién soy? ¿Cómo me ven los otros? Comienzan a cuestionar los dogmas y verdades previas." },{ title: "Valores Propios", desc: "Aparecen dudas éticas e inquietudes sobre lo correcto e incorrecto. Se desarrolla la empatía y la capacidad de situarse en el lugar del otro. Empieza la formulación de una moral propia, dialogada con el grupo de iguales y distante del patrón puramente familiar." },{ title: "Emociones Contradictorias", desc: "El mundo afectivo experimenta sentimientos de gran intensidad que cambian de un momento a otro. Domina el 'amar el amor' y el 'odiar el odio'. Ser incondicional con los amigos íntimos y distante con lo que no encaja en su búsqueda de identidad." },{ title: "Amigos para la Vida", desc: "El grupo de amigos se vuelve el refugio de confianza absoluta. Las relaciones son intensas y selectivas. Los pares ejercen un rol de validación indispensable para la autoimagen, generando a veces roces o distancia frente a los padres y el hogar." },{ title: "Una Fe Personal", desc: "Tránsito progresivo de la religiosidad infantil (heredada de la familia) a una vivencia espiritual propia. Hay una doble actitud: críticas a la institucionalidad y formas de culto externas, pero una sed profunda de encontrar sentido interior y conexión con Dios." }].map((item, idx) => (
          <div key={idx} className="bg-clr1 dark:bg-clr1 border border-clr7 dark:border-dclr7 rounded-3xl p-6 shadow-md space-y-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: primario }} />
            <h4 className="font-extrabold uppercase text-[1.1em] text-clr2 dark:text-dclr2 pl-2">{item.title}</h4>
            <p className="text-[0.95em] text-clr2 dark:text-dclr2 leading-relaxed italic pl-2">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TropaEgreso({ primario }: { primario: string }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>Perfil de Egreso (El Horizonte de la Persona)</h3>
        <p className="text-[1.05em] leading-relaxed text-clr2 dark:text-dclr2">El proyecto educativo del Movimiento Scout propone que cada joven construya de forma autónoma su propio proyecto de vida, orientando su carácter hacia los siguientes ideales:</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {EGRESO_PILARES.map((pilar, idx) => (
          <div key={idx} className="bg-clr1 dark:bg-clr1 border border-clr7 dark:border-dclr7 rounded-3xl p-6 shadow-md space-y-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: primario }} />
            <h4 className="font-extrabold uppercase text-[1.1em] text-clr2 dark:text-dclr2 pl-2">{pilar.title}</h4>
            <p className="text-[0.95em] text-clr2 dark:text-dclr2 leading-relaxed pl-2">{pilar.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TropaCamino({ primario }: { primario: string }) {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>La Ruta del Crecimiento en la Tropa</h3>
        <p className="text-[1.05em] leading-relaxed text-clr2 dark:text-dclr2">En la Tropa, el camino de progresión personal se recorre explorando nuevos territorios con tu grupo de amigos. Las insignias de progresión representan el estímulo que se entrega al comenzar cada etapa, registrando tus avances en tu Bitácora.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-4">
        {[{ title: "Etapa Cernícalo", subtitle: "Aprender a Observar", desc: "Se busca tener una visión panorámica de todo el conjunto que nos rodea, tal como hace el cernícalo al posarse en las ramas altas para detectar señales del entorno.", img: "/images/progresion/tropa/etapa_cernicalo.png" },{ title: "Etapa Halcón", subtitle: "Observar y Descubrir", desc: "Tal como el halcón, que cubre territorios más amplios, estamos preparados para descubrir nuevos caminos que nos muestren con mayor claridad el rumbo de nuestra Tropa.", img: "/images/progresion/tropa/etapa_halcon.png" },{ title: "Etapa Águila", subtitle: "Hace y Aplica", desc: "Como el águila, que vive a grandes alturas, encontramos nuevas perspectivas que ensanchan nuestro horizonte y nos permiten saber las condiciones necesarias para avanzar.", img: "/images/progresion/tropa/etapa_aguila.png" },{ title: "Etapa Cóndor", subtitle: "Enseña y Lidera", desc: "Como el cóndor, cuya excelencia le permite aprovechar las corrientes para cruzar valles y montañas, nuestra búsqueda nunca termina en pos de estar siempre listos.", img: "/images/progresion/tropa/etapa_condor.png" }].map((etapa, idx) => (
          <div key={idx} className="bg-clr1 dark:bg-clr1 border border-clr7 dark:border-dclr7 rounded-3xl p-5 space-y-4 flex flex-col items-center text-center shadow-md">
            <div className="w-30 h-30 flex items-center justify-center"><img src={etapa.img} alt={etapa.title} className="max-w-full max-h-full object-contain" /></div>
            <div><h4 className="font-extrabold uppercase text-[1.1em] text-clr2 dark:text-dclr2">{etapa.title}</h4><span className="text-[0.8em] font-black uppercase tracking-wider text-clr3 dark:text-dclr3 block mt-0.5">{etapa.subtitle}</span><p className="text-[0.9em] text-clr2 dark:text-dclr2 mt-2 leading-relaxed">{etapa.desc}</p></div>
          </div>
        ))}
      </div>
      <div className="bg-clr7 dark:bg-dclr7 border border-clr7 dark:border-dclr7 rounded-3xl p-6 space-y-4">
        <h4 className="font-extrabold uppercase text-[1.2em] text-clr2 dark:text-dclr2">El Reconocimiento y la Bitácora</h4>
        <p className="text-[1.02em] leading-relaxed text-clr2 dark:text-dclr2">Al finalizar cada ciclo de programa, se evalúan de común acuerdo tus objetivos en la patrulla y con tu dirigente de seguimiento. El logro de cada objetivo personal se reconoce pegando un **sello** de diseño temático en tu Bitácora. Con los timbres de tu Tropa, tu Bitácora adquiere el aspecto de un pasaporte personal de viaje.</p>
      </div>
    </div>
  );
}

function TropaObjetivos({ primario, areas, objectives }: { primario: string; areas: typeof SHARED_AREAS[3]; objectives: Objective[] }) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>Objetivos Educativos (Los desafíos del Scout)</h3>
        <p className="text-[1.05em] leading-relaxed text-clr2 dark:text-dclr2">La progresión personal se organiza en seis áreas de desarrollo. En cada una, la Tropa utiliza un símbolo de identidad nacional y local para representar tu crecimiento personal.</p>
      </div>
      <div className="space-y-4">
        {areas.map((area) => {
          const areaObjs = objectives.filter(o => o.area_id === area.id);
          return (
            <div key={area.id} className="bg-clr1 dark:bg-clr1 border border-clr7 dark:border-dclr7 rounded-3xl p-2 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-clr7 dark:border-dclr7 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-30 h-30 flex items-center justify-center"><img src={area.img} alt={area.name} className="max-w-full max-h-full object-contain" /></div>
                  <div><h4 className="font-extrabold uppercase text-[1.25em] text-clr2 dark:text-dclr2 flex items-center gap-2">{area.name}</h4><p className="text-[0.85em] text-clr3 dark:text-dclr3 leading-snug">{area.desc}</p></div>
                </div>
                {area.symbol && <div className="text-left sm:text-right"><span className="text-[0.8em] font-black uppercase tracking-widest px-3 py-1 rounded-full border" style={{ borderColor: `${area.color}40`, backgroundColor: `${area.color}10`, color: area.color }}>{area.symbol}</span><p className="text-[0.8em] text-clr3 dark:text-dclr3 mt-1 sm:max-w-xs leading-normal">{area.symbolDesc}</p></div>}
              </div>
              <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
                {areaObjs.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">{areaObjs.map((obj) => (<div key={obj.id} className="bg-clr7 dark:bg-dclr7 border border-clr7 dark:border-clr1 rounded-2xl p-4 flex gap-3 items-start hover:border-clr3 dark:hover:border-clr1 transition-colors"><span className="font-bold text-[1.1em] mt-0.5" style={{ color: area.color }}>•</span><div className="space-y-1"><span className="font-bold text-clr2 dark:text-dclr2 block text-[0.98em]">{obj.texto_infantil}</span><p className="text-[0.85em] text-clr3 dark:text-dclr3 leading-snug">Meta terminal: {obj.texto_terminal}</p></div></div>))}</div>) : (<p className="text-[0.95em] text-clr3 dark:text-dclr3 italic">Cargando objetivos educativos desde la base de datos...</p>)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TropaProyectos({ primario }: { primario: string }) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>Ciclo de Programa y Aventuras de Patrulla</h3>
        <p className="text-[1.05em] leading-relaxed text-clr2 dark:text-dclr2">La Tropa es una escuela de democracia y autogobierno donde los muchachos eligen y conducen su programa de actividades a través de ciclos estructurados en 4 fases sucesivas.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-clr1 dark:bg-clr1 border border-clr7 dark:border-dclr7 rounded-3xl p-6 space-y-4">
          <h4 className="font-extrabold uppercase text-[1.2em] text-clr2 dark:text-dclr2" style={{ color: primario }}>Las 4 Fases del Ciclo de Programa</h4>
          <div className="space-y-4">
            {[{ phase: "Fase 1: Propuesta y Selección", desc: "Se inicia tras el diagnóstico del ciclo anterior. Las patrullas proponen ideas y mediante Juegos Democráticos en Asamblea se eligen las actividades comunes." },{ phase: "Fase 2: Organización, Diseño y Preparación", desc: "Las actividades se organizan en un calendario flexible de Tropa. Cada patrulla diseña los componentes y prepara los recursos necesarios." },{ phase: "Fase 3: Desarrollo y Evaluación de Actividades", desc: "¡La emoción de hacer cosas! Se ejecutan los proyectos, campamentos y dinámicas. Se evalúa el cumplimiento de metas y progresión en 360 grados." },{ phase: "Fase 4: Cambio de Ciclo", desc: "Fase de transición: conclusiones de autoevaluación, entrega de reconocimientos, diagnóstico general de la Tropa y fijación de un nuevo Énfasis." }].map((item, idx) => (
              <div key={idx} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-clr7 dark:bg-dclr7 flex items-center justify-center font-bold text-[0.85em] text-clr2 dark:text-dclr2 shrink-0 mt-0.5 border border-clr7 dark:border-dclr7">{idx + 1}</span>
                <div><h5 className="font-bold text-clr2 dark:text-dclr2 text-[1.02em]">{item.phase}</h5><p className="text-[0.9em] text-clr3 dark:text-dclr3 mt-1 leading-relaxed">{item.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-clr1 dark:bg-clr1 border border-clr7 dark:border-dclr7 rounded-3xl p-6 space-y-4">
            <h4 className="font-extrabold uppercase text-[1.2em] text-clr2 dark:text-dclr2" style={{ color: primario }}>Los Proyectos de Tropa: DURAS</h4>
            <p className="text-[0.98em] text-clr2 dark:text-dclr2 leading-relaxed">Los proyectos (o Aventuras) de Tropa son actividades de mediana o larga duración. Deben cumplir con los criterios <strong>DURAS</strong>:</p>
            <div className="grid grid-cols-1 gap-2.5">
              {[{ l: "D", title: "Desafiantes", desc: "Estimulan a superar límites y aprender técnicas scouts avanzadas." },{ l: "U", title: "Útiles", desc: "Tienen aplicación práctica en la vida al aire libre o el servicio." },{ l: "R", title: "Recompensantes", desc: "Brindan satisfacción grupal e individual al alcanzar la meta." },{ l: "A", title: "Atractivas", desc: "Llenas de dinamismo, misterio y aventura en la naturaleza." },{ l: "S", title: "Seguras", desc: "Identifican y controlan los riesgos de manera responsable." }].map((d, i) => (
                  <div key={i} className="flex gap-3 text-[0.88em]">
                    <span className="w-6 h-6 rounded-lg flex items-center justify-center font-black text-clr1 shrink-0 text-[0.85em]" style={{ backgroundColor: primario }}>{d.l}</span>
                    <div className="text-clr2 dark:text-dclr2"><strong>{d.title}:</strong> <span className="text-clr3 dark:text-dclr3">{d.desc}</span></div>
                  </div>
                ))}
            </div>
          </div>
          <div className="bg-clr1 dark:bg-clr1 border border-clr7 dark:border-dclr7 rounded-3xl p-6 space-y-4">
            <h4 className="font-extrabold uppercase text-[1.2em] text-clr2 dark:text-dclr2" style={{ color: primario }}>Actividades de la Unidad</h4>
            <div className="space-y-3 text-[0.95em]">
              <div className="space-y-1"><span className="font-bold text-clr2 dark:text-dclr2 block text-[0.95em]">📌 Actividades Fijas:</span><p className="text-[0.9em] text-clr3 dark:text-dclr3 leading-relaxed pl-3 border-l-2 border-clr7 dark:border-dclr7">Rutinas que estructuran el programa: Reuniones de Patrulla y de Tropa, Campamentos y excursiones, juegos scouts de despliegue físico y fogones.</p></div>
              <div className="space-y-1"><span className="font-bold text-clr2 dark:text-dclr2 block text-[0.95em]">🎨 Actividades Variables:</span><p className="text-[0.9em] text-clr3 dark:text-dclr3 leading-relaxed pl-3 border-l-2 border-clr7 dark:border-dclr7">Elegidas para el ciclo. Ejemplos: construcciones pioneras, técnicas de supervivencia, safaris fotográficos urbanos, primeros auxilios o iniciativas ecológicas locales.</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TropaEspecialidades({ primario }: { primario: string }) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight p-2 rounded-lg" style={{ backgroundColor: primario, color: '#ffffff' }}>El Sistema de Especialidades en la Tropa</h3>
        <p className="text-[1.05em] leading-relaxed text-clr2 dark:text-dclr2 font-semibold">Las especialidades son una propuesta educativa complementaria, voluntaria e individual, que invita a los scouts a descubrir sus aptitudes innatas, aprender haciendo y orientar sus talentos hacia el servicio útil de los demás.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ESPECIALIDADES_PRINCIPIOS('scout').map((principio, idx) => (
          <div key={idx} className="bg-clr1 dark:bg-clr1 border border-clr7 dark:border-dclr7 rounded-3xl p-2 text-center space-y-2 shadow-sm border-l-4" style={{ borderLeftColor: primario }}>
            <span className="text-6xl text-center p-4">{principio.icon}</span>
            <h5 className="font-extrabold uppercase text-[0.95em] text-clr2 dark:text-dclr2">{principio.title}</h5>
            <p className="text-[0.88em] text-clr2 dark:text-dclr2 leading-relaxed font-semibold">{principio.desc}</p>
          </div>
        ))}
      </div>
      <div className="space-y-4 pt-4">
        <h4 className="text-[1.25em] font-black uppercase text-clr2 dark:text-dclr2">Campos de Interés (Especialidades)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {ESPECIALIDADES_CAMPOS.map((campo, idx) => (
            <div key={idx} className="bg-clr1 dark:bg-clr1 border border-clr7 dark:border-dclr7 rounded-2xl py-3 pl-1 pr-3 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all flex gap-2 border-t-[10px]" style={{ borderTopColor: campo.color }}>
              <img src={campo.icon} alt={campo.title} className="w-20 h-20 object-contain" />
              <div className="space-y-1"><h5 className="font-extrabold text-[1.1em] text-clr2 dark:text-dclr2 uppercase">{campo.title}</h5><p className="text-[0.88em] text-clr2 dark:text-dclr2 leading-relaxed font-semibold">{campo.desc}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TropaMistica({ primario, nombreUnidad }: { primario: string; nombreUnidad?: string | null }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-clr1 dark:bg-clr1 border border-clr7 dark:border-dclr7 rounded-3xl p-6 space-y-4">
          <span className="text-[0.8em] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-clr6 dark:bg-dclr6 text-clr6 dark:text-dclr6 border border-clr6 dark:border-dclr6">Compromiso de Honor</span>
          <h4 className="font-extrabold uppercase text-[1.3em] text-clr2 dark:text-dclr2 leading-tight">La Promesa Scout</h4>
          <p className="text-[1.08em] leading-relaxed text-clr2 dark:text-dclr2 italic pl-4 border-l-2 border-clr6">"Por mi honor prometo hacer cuanto de mí dependa para buscar a Dios, amar a mi familia, ayudar a los demás, servir a mi país, trabajar por la paz y vivir la Ley Scout."</p>
        </div>
        <div className="bg-clr1 dark:bg-clr1 border border-clr7 dark:border-dclr7 rounded-3xl p-6 space-y-4">
          <span className="text-[0.8em] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-clr5 dark:bg-dclr5 text-clr5 dark:text-dclr5 border border-clr5 dark:border-dclr5">Código de Conducta</span>
          <h4 className="font-extrabold uppercase text-[1.3em] text-clr2 dark:text-dclr2 leading-tight">La Ley Scout</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[0.92em]">
            {["1. Es digno de confianza.","2. Es leal.","3. Sirve sin esperar recompensa.","4. Comparte con todos.","5. Es alegre y cordial.","6. Protege la vida y la naturaleza.","7. Es responsable y nada hace a medias.","8. Es optimista.","9. Cuida las cosas y valora el trabajo.","10. Es coherente en su pensamiento, palabra y acción."].map((ley, idx) => (
              <span key={idx} className="text-clr2 dark:text-dclr2 font-semibold">{ley}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-clr1 dark:bg-clr1 border border-clr7 dark:border-dclr7 rounded-3xl p-6 space-y-2 relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: primario }} /><h4 className="font-extrabold uppercase text-[1.05em] text-clr2 dark:text-dclr2 pl-2">El Color Verde</h4><p className="text-[0.88em] text-clr2 dark:text-dclr2 leading-relaxed pl-2">Color histórico de la primera rama en crearse. Baden-Powell adoptó el verde del Transvaal en las primeras insignias scouts bordadas en amarillo.</p></div>
        <div className="bg-clr1 dark:bg-clr1 border border-clr7 dark:border-dclr7 rounded-3xl p-6 space-y-2 relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: '#fac620' }} /><h4 className="font-extrabold uppercase text-[1.05em] text-clr2 dark:text-dclr2 pl-2">La Flor de Lis</h4><p className="text-[0.88em] text-clr2 dark:text-dclr2 leading-relaxed pl-2">Indica la buena senda en la rosa de los vientos de los antiguos mapas. Recuerda a todo scout mantener su ideal y señalar el norte correcto.</p></div>
        <div className="bg-clr1 dark:bg-clr1 border border-clr7 dark:border-dclr7 rounded-3xl p-6 space-y-2 relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: primario }} /><h4 className="font-extrabold uppercase text-[1.05em] text-clr2 dark:text-dclr2 pl-2">Saludo Scout</h4><p className="text-[0.88em] text-clr2 dark:text-dclr2 leading-relaxed pl-2">Dedo pulgar sobre el meñique (el fuerte protege al débil) y tres dedos alzados (las tres partes de la promesa), levantado a la altura del hombro.</p></div>
        <div className="bg-clr1 dark:bg-clr1 border border-clr7 dark:border-dclr7 rounded-3xl p-6 space-y-2 relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: '#fac620' }} /><h4 className="font-extrabold uppercase text-[1.05em] text-clr2 dark:text-dclr2 pl-2">Buena Acción</h4><p className="text-[0.88em] text-clr2 dark:text-dclr2 leading-relaxed pl-2">Compromiso diario de servicio tangible y concreto hacia los demás, combatiendo la indiferencia y poniendo de manifiesto al prójimo.</p></div>
      </div>
      <div className="bg-clr1 dark:bg-clr1 border border-clr7 dark:border-dclr7 rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row items-center gap-6 mt-4">
        <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: primario }} />
        <div className="w-30 h-30 shrink-0 flex items-center justify-center"><img src="/images/logos/iconos_scouts.svg" alt="Logo de Scouts" className="max-w-full max-h-full object-contain" /></div>
        <div className="space-y-2"><h4 className="font-extrabold uppercase text-[1.25em] text-clr2 dark:text-dclr2">Insignia Oficial de la Rama Scouts</h4><p className="text-[0.95em] text-clr2 dark:text-dclr2 leading-relaxed">El emblema oficial de la Rama Scouts muestra la flor de lis que muestra el horizonte al que debe apuntar todo scout, las estrellas representan la ley y la promesa y cada punta de una estrella representa un articulo de la Ley Scout. El lazo que rodea a la flor de liz y el nudo llano representan la hermandad scout en el mundo.</p></div>
      </div>
      <div className="bg-clr1 dark:bg-clr1 border border-clr7 dark:border-dclr7 rounded-3xl p-6 space-y-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: '#fac620' }} />
        <h4 className="font-extrabold uppercase text-[1.25em] text-clr2 dark:text-dclr2 pl-2">La Oración Scout</h4>
        <p className="italic text-clr2 dark:text-dclr2 leading-relaxed pl-4 border-l-2 border-clr6 max-w-xl text-[1.05em]">"Señor,<br />enséñanos a ser generosos,<br />a servirte como lo mereces,<br />a dar sin medida,<br />a combatir sin miedo a que nos hieran,<br />a trabajar sin descanso<br />y a no buscar otra recompensa<br />que saber que hacemos Tu voluntad."</p>
      </div>
      <div className="bg-clr1 dark:bg-clr1 border border-clr7 dark:border-dclr7 rounded-3xl p-6 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: primario }} />
        <h4 className="font-extrabold uppercase text-[1.2em] text-clr2 dark:text-dclr2 pl-2">Himno de la Rama: Avanzan las Patrullas</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[0.95em] pl-2">
          <div className="space-y-1"><span className="font-bold text-clr2 dark:text-dclr2 block text-[0.9em] uppercase tracking-wide">Coro</span><p className="italic text-clr2 dark:text-dclr2 leading-relaxed pl-3 border-l border-clr7 dark:border-dclr7">Juntos escalemos la montaña altiva,<br />juntos escalemos el picacho azul.<br />Solo los halcones sobre nuestras frentes<br />giran majestuosos en el cielo azul.</p></div>
          <div className="space-y-1"><span className="font-bold text-clr2 dark:text-dclr2 block text-[0.9em] uppercase tracking-wide">Estrofa I</span><p className="italic text-clr2 dark:text-dclr2 leading-relaxed pl-3 border-l border-clr7 dark:border-dclr7">Avanzan las patrullas,<br />a lo lejos, adelante.<br />Avanzan las patrullas<br />al toque del tambor. ¡Adelante!</p></div>
        </div>
      </div>
      <div className="relative rounded-[2rem] overflow-hidden border border-clr7 dark:border-dclr7 bg-clr2 shadow-xl" style={{ minHeight: '280px' }}>
        <div className="absolute inset-0 z-0 select-none pointer-events-none opacity-40 dark:opacity-30"><img src="/images/unidades/bandera_tropa_1.jpg" alt={`Bandera de la Tropa ${nombreUnidad || "A'ata"}`} className="w-full h-full object-cover" /></div>
        <div className="relative z-10 p-8 sm:p-10 flex flex-col justify-end h-full space-y-4 max-w-2xl bg-gradient-to-t from-clr2 via-clr2 to-transparent">
          <span className="text-[0.8em] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-clr6 text-clr6 border border-clr6 self-start">Símbolo de Hermandad</span>
          <h4 className="text-[1.5em] font-black uppercase tracking-tight text-clr1 leading-tight">La Bandera de la Tropa {nombreUnidad || "A'ata"}</h4>
          <p className="text-[1.02em] leading-relaxed text-clr7">La bandera oficial de la Rama Scouts lleva como fondo el color <strong>verde</strong> y en su centro, en color blanco, el diseño de la <strong>flor de lis</strong> utilizada en la insignia Scout Mundial.</p>
        </div>
      </div>
    </div>
  );
}
