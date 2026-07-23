'use client';

import { UnitView } from './UnitView';
import { SHARED_AREAS, EGRESO_PILARES } from '@/data/unit-configs';

interface Objective { id: string; area_id: number; texto_infantil: string; texto_terminal: string; }
interface AvanzadaCustomContentProps { objectives: Objective[]; }

export default function AvanzadaCustomContent({ objectives = [] }: AvanzadaCustomContentProps) {
  const primario = '#4a3f8c';
  const secundario = '#FFFFFF';
  const areas = SHARED_AREAS[4];

  return (
    <UnitView
      primario={primario}
      secundario={secundario}
      areas={areas}
      objectives={objectives}
      profileTabLabels={{ desarrollo: 'Desarrollo (15 a 17 años)', egreso: 'Perfil de Egreso' }}
      profileContent={{
        desarrollo: <AvzDesarrollo primario={primario} />,
        egreso: <AvzEgreso primario={primario} />,
      }}
      tabs={[
        { key: 'camino', label: 'El Camino', content: <AvzCamino primario={primario} /> },
        { key: 'objetivos', label: 'Objetivos Educativos', content: <AvzObjetivos primario={primario} areas={areas} objectives={objectives} /> },
        { key: 'competencias', label: 'Competencias', content: <AvzCompetencias primario={primario} /> },
        { key: 'proyectos', label: 'Aventuras y Ciclo', content: <AvzProyectos primario={primario} /> },
        { key: 'mistica', label: 'Símbolos', content: <AvzMistica primario={primario} /> },
      ]}
    />
  );
}

function AvzDesarrollo({ primario }: { primario: string }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>El Pionero y la Pionera a Grandes Trazos</h3>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300 font-semibold">La adolescencia media (15 a 17 años) es la etapa clave de desarrollo donde el joven transita desde la dependencia familiar a la autonomía. Sus rasgos principales en las seis dimensiones del crecimiento son:</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[{ titulo: "El Cuerpo (Corporalidad)", img: "/images/progresion/avanzada/area_corporalidad.png", desc: "Aceptación de los marcados cambios físicos y consolidación de la autoimagen corporal. Desarrollo de hábitos de higiene, autocuidado y toma de responsabilidad en la salud y nutrición." },{ titulo: "La Inteligencia (Creatividad)", img: "/images/progresion/avanzada/area_creatividad.png", desc: "Adquisición del pensamiento abstracto e hipotético-deductivo completo. Habilidad para analizar problemáticas complejas, formular teorías alternativas y llevar a cabo soluciones tecnológicas e innovadoras." },{ titulo: "La Voluntad (Carácter)", img: "/images/progresion/avanzada/area_caracter.png", desc: "Inicio de la conformación de la identidad personal y moral. Adecuación progresiva del comportamiento a una escala de valores propios y conscientemente aceptados, superando la presión del grupo." },{ titulo: "Los Afectos (Afectividad)", img: "/images/progresion/avanzada/area_afectividad.png", desc: "Alcanzar progresivamente la madurez y la identidad de género. Búsqueda de relaciones afectivas auténticas y simétricas, y experimentación de estabilidad y control emocional ante conflictos cotidianos." },{ titulo: "La Integración Social (Sociabilidad)", img: "/images/progresion/avanzada/area_sociabilidad.png", desc: "Construcción de la identidad vocacional y proyección laboral. Búsqueda de amigos afines, conformando grupos de pertenencia por libre acuerdo, y compromiso real en servicios hacia la comunidad civil." },{ titulo: "Sentido de la Existencia (Espiritualidad)", img: "/images/progresion/avanzada/area_espiritualidad.png", desc: "Transición gradual desde la fe tradicional familiar e infantil a una vivencia de fe personal e internalizada. Búsqueda de trascendencia religiosa o no religiosa basada en convicciones íntimas." }].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-3xl py-2 pl-1 pr-2 shadow-sm hover:shadow-md flex gap-4 border-l-[6px]" style={{ borderLeftColor: primario }}>
            <div className="w-20 h-20 shrink-0 flex items-center justify-center"><img src={item.img} alt={item.titulo} className="max-w-full max-h-full object-contain" /></div>
            <div className="space-y-1"><h4 className="font-extrabold text-[1.1em] text-zinc-950 dark:text-zinc-100 uppercase leading-snug">{item.titulo}</h4><p className="text-[0.9em] text-zinc-650 dark:text-zinc-400 leading-relaxed font-semibold">{item.desc}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AvzEgreso({ primario }: { primario: string }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-2">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>Perfil de Egreso</h3>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300 font-semibold">Las personas que compartimos en los Movimientos Guía y Scout aspiramos a hacer todo lo que de nosotros dependa para ser:</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {EGRESO_PILARES.map((perfil, i) => (
          <div key={i} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-3xl p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: primario }} />
            <h4 className="font-extrabold text-[1.1em] text-zinc-900 dark:text-white uppercase mb-2">{perfil.title}</h4>
            <p className="text-[0.9em] text-zinc-650 dark:text-zinc-400 leading-relaxed font-semibold">{perfil.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AvzCamino({ primario }: { primario: string }) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>La Ruta de Progresión en la Avanzada</h3>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300 font-semibold">El paso por la Comunidad de Pioneros comprende la entrega de la insignia Cruz del Sur al integrarse a la Rama, y el desarrollo de las etapas de progresión personal Sendero y Cumbre:</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-4">
        {[{ title: "Cruz del Sur", badgeName: "Insignia de Bienvenida e Ingreso", desc: "Es la insignia de pertenencia a la rama Pioneros, y acompaña a las y los jóvenes durante su paso por la unidad. Representa una constante que orienta a las pioneras y pioneros en la búsqueda y elección de su Sendero.", img: "/images/progresion/avanzada/etapa_bienvenida.png" },{ title: "Sendero", badgeName: "Etapa de Progresión", desc: "Corresponde a las pioneras o pioneros que comienzan a trabajar con los objetivos educativos de esta Rama. El Sendero es la oportunidad de explorar y elegir sus caminos de manera individual, pero apoyados siempre por su grupo.", img: "/images/progresion/avanzada/etapa_sendero.png" },{ title: "Cumbre", badgeName: "Etapa de Progresión", desc: "Corresponde a los jóvenes que han alcanzado al menos la mitad de los objetivos educativos propuestos para la Rama. La Cumbre es el lugar desde donde se puede mirar hacia atrás y proyectarse hacia el futuro.", img: "/images/progresion/avanzada/etapa_cumbre.png" }].map((etapa, idx) => (
          <div key={idx} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-3xl p-6 space-y-4 flex flex-col items-center text-center shadow-md border-t-[5px]" style={{ borderTopColor: primario }}>
            <div className="w-30 h-30 flex items-center justify-center"><img src={etapa.img} alt={etapa.title} className="max-w-full max-h-full object-contain" /></div>
            <div><h4 className="font-extrabold uppercase text-[1.25em] text-zinc-900 dark:text-white leading-none">{etapa.title}</h4><span className="text-[0.8em] font-bold uppercase tracking-wider block mt-1" style={{ color: primario }}>{etapa.badgeName}</span><p className="text-[0.88em] text-zinc-650 dark:text-zinc-400 mt-3 leading-relaxed font-semibold">{etapa.desc}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AvzObjetivos({ primario, areas, objectives }: { primario: string; areas: typeof SHARED_AREAS[4]; objectives: Objective[] }) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>Objetivos Educativos en la Avanzada</h3>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300 font-semibold">La progresión personal en la Avanzada se organiza en seis áreas de desarrollo. A través de ellas, los pioneros se proponen metas concretas para crecer de forma integral.</p>
      </div>
      <div className="space-y-4">
        {areas.map((area) => {
          const areaObjs = objectives.filter(o => o.area_id === area.id);
          return (
            <div key={area.id} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-2 space-y-4 shadow-sm relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-white/10 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-26 h-26 shrink-0 flex items-center justify-center"><img src={area.img} alt={area.name} className="max-w-full max-h-full object-contain" /></div>
                  <div><h4 className="font-extrabold uppercase text-[1.25em] text-zinc-900 dark:text-white flex items-center gap-2">{area.name}</h4><p className="text-[0.85em] text-zinc-550 dark:text-zinc-400 leading-snug">{area.desc}</p></div>
                </div>
              </div>
              <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
                {areaObjs.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 gap-2">{areaObjs.map((obj) => (<div key={obj.id} className="bg-zinc-50 dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-2xl p-4 flex gap-3 items-start hover:border-zinc-300 dark:hover:border-white/20 transition-colors"><span className="font-bold text-[1.1em] mt-0.5" style={{ color: primario }}>•</span><div className="space-y-1"><span className="font-bold text-zinc-800 dark:text-zinc-200 block text-[0.98em]">{obj.texto_infantil}</span>{obj.texto_terminal && <p className="text-[0.85em] text-zinc-500 dark:text-zinc-400 leading-snug">Meta terminal: {obj.texto_terminal}</p>}</div></div>))}</div>) : (<p className="text-[0.95em] text-zinc-500 dark:text-zinc-400 italic">Cargando objetivos educativos desde la base de datos...</p>)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const COMPETENCIAS_DATA = [
  { titulo: "Cultura", slug: "cultura", imagen: "/images/competencias/Cultura.svg", color: "#ff8c00", desc: "Capacidad de conocer, apreciar y comprender críticamente las diferentes manifestaciones culturales, artísticas y patrimoniales." },
  { titulo: "Actividad Física", slug: "actividad_fisica", imagen: "/images/competencias/ActividadFisica.svg", color: "#1e90ff", desc: "Consideración de la importancia del autocuidado del cuerpo humano, manteniendo y promoviendo prácticas de vida saludables." },
  { titulo: "Trabajo en Equipo", slug: "trabajo_equipo", imagen: "/images/competencias/TrabajoEnEquipo.svg", color: "#22c55e", desc: "Capacidad de trabajar en diferentes roles al interior de un equipo para el logro de los objetivos." },
  { titulo: "Innovación", slug: "innovacion", imagen: "/images/competencias/Innovacion.svg", color: "#ff4757", desc: "Promueve constantemente ideas creativas para el desarrollo de actividades y proyectos." },
  { titulo: "Comunicación", slug: "comunicacion", imagen: "/images/competencias/Comunicacion.svg", color: "#a55eea", desc: "Demuestra capacidades de expresión oral y escrita, difusión en un lenguaje adaptable a las condiciones de cada actividad." },
  { titulo: "Ciudadanía", slug: "ciudadania", imagen: "/images/competencias/Ciudadania.svg", color: "#a855f7", desc: "Evidencia una conducta de respeto por la diversidad y multiculturalidad, aceptando las diferencias." },
  { titulo: "Medioambiente", slug: "medioambiente", imagen: "/images/competencias/MedioAmbiente.svg", color: "#10b981", desc: "Consideración de las implicancias medioambientales de sus acciones y decisiones." },
];

function AvzCompetencias({ primario }: { primario: string }) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>Las Competencias en las Pioneras y Pioneros</h3>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300 font-semibold">Las Competencias en nuestra Rama las entendemos como atributos subyacentes de una persona (que están detrás de nuestro comportamiento), naturales o adquiridos, que posibilitan una actuación efectiva en el desempeño de alguna tarea, actividad o proyecto.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-2xl p-5 space-y-2 border-l-4" style={{ borderLeftColor: primario }}><span className="text-2xl">🌱</span><h5 className="font-extrabold uppercase text-[0.95em] text-zinc-900 dark:text-white">Ligadas a Actividades</h5><p className="text-[0.88em] text-zinc-650 dark:text-zinc-400 leading-relaxed font-semibold">Las Competencias están ligadas a las actividades y proyectos, son menos periféricas al programa de actividades.</p></div>
          <div className="bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-2xl p-5 space-y-2 border-l-4" style={{ borderLeftColor: primario }}><span className="text-2xl">🎯</span><h5 className="font-extrabold uppercase text-[0.95em] text-zinc-900 dark:text-white">Habilitación para el Desempeño</h5><p className="text-[0.88em] text-zinc-650 dark:text-zinc-400 leading-relaxed font-semibold">La Competencia es la habilitación para el desempeño y la vida adulta.</p></div>
          <div className="bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-2xl p-5 space-y-2 border-l-4" style={{ borderLeftColor: primario }}><span className="text-2xl">🤝</span><h5 className="font-extrabold uppercase text-[0.95em] text-zinc-900 dark:text-white">Proceso Orgánico</h5><p className="text-[0.88em] text-zinc-650 dark:text-zinc-400 leading-relaxed font-semibold">Surgen a partir del ciclo y proyectos, no existe una "inscripción".</p></div>
        </div>
      </div>
      <div className="space-y-4 pt-4">
        <h4 className="text-[1.25em] font-black uppercase text-zinc-900 dark:text-white">Los 7 Rumbos de las Competencias</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COMPETENCIAS_DATA.map((comp, idx) => (
            <div key={idx} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-3xl p-6 shadow-md flex gap-4 hover:shadow-lg transition-shadow relative overflow-hidden border-t-[5px]" style={{ borderTopColor: comp.color }}>
              <div className="w-26 h-26 flex-shrink-0 flex items-center justify-center"><img src={comp.imagen} alt={comp.titulo} className="w-full h-full object-contain" /></div>
              <div className="space-y-1"><h5 className="font-extrabold text-[1.1em] text-zinc-950 dark:text-zinc-100 uppercase">{comp.titulo}</h5><p className="text-[0.88em] text-zinc-650 dark:text-zinc-400 leading-relaxed font-semibold">{comp.desc}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AvzProyectos({ primario }: { primario: string }) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>Las Aventuras de la Avanzada</h3>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300 font-semibold">En la Avanzada de Pioneros, el método de proyectos toma el nombre de **"Aventura"**. A través de la Aventura, la Comunidad planifica, prepara y ejecuta iniciativas significativas.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-lg space-y-4 relative overflow-hidden border-l-[6px]" style={{ borderLeftColor: primario }}>
          <h4 className="text-[1.25em] font-black uppercase text-zinc-900 dark:text-white">Comunidades y Grupos de Trabajo</h4>
          <div className="space-y-4 text-[0.9em] text-zinc-650 dark:text-zinc-400 leading-relaxed font-semibold">
            <p>El funcionamiento interno de la Avanzada es flexible. Para dar apoyo afectivo y socialización, los jóvenes se agrupan por afinidad en <strong>Comunidades</strong> de carácter estable.</p>
            <p>Sin embargo, para planificar y ejecutar la mayoría de los proyectos, los pioneros se organizan de forma dinámica en <strong>Grupos de Trabajo</strong> adaptados al tamaño y complejidad de la tarea o Aventura.</p>
          </div>
        </div>
        <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-lg space-y-4 relative overflow-hidden border-l-[6px]" style={{ borderLeftColor: primario }}>
          <h4 className="text-[1.25em] font-black uppercase text-zinc-900 dark:text-white">Las 5 Fases del Ciclo de Aventura</h4>
          <div className="space-y-3">
            {[{ name: "Planificación", desc: "Se proponen ideas, se debaten y la Comunidad elige democráticamente su Aventura." },{ name: "Preparación", desc: "Se arman los Grupos de Trabajo y los pioneros se capacitan e investigan los recursos." },{ name: "Ejecución", desc: "Se vive el proyecto principal en el terreno (excursión, campamento, intervención comunitaria)." },{ name: "Evaluación", desc: "Reunión de análisis para diagnosticar los aciertos, dificultades y evaluar objetivos." },{ name: "Celebración", desc: "Fiesta y reconocimiento de las competencias y etapas alcanzadas." }].map((fase, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="font-black text-[0.9em]" style={{ color: primario }}>0{i+1}.</span>
                <div><h5 className="font-extrabold uppercase text-[0.9em] text-zinc-900 dark:text-zinc-200 leading-tight">{fase.name}</h5><p className="text-[0.85em] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug font-semibold">{fase.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AvzMistica({ primario }: { primario: string }) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>Identidad en la Avanzada</h3>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300 font-semibold">El Marco Simbólico se resume en la consigna **"Vivir mi propia aventura"**. Los pioneros se conciben como exploradores activos que diseñan su rumbo, superan obstáculos y se abren paso en el mundo real.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        <div className="md:col-span-7 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-lg space-y-4 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: primario }} />
          <div className="space-y-4">
            <h4 className="text-[1.25em] font-black uppercase text-zinc-900 dark:text-white pl-2">La Promesa del Pionero</h4>
            <blockquote className="bg-zinc-50 dark:bg-white/5 p-5 rounded-2xl border-l-4 italic text-[1.02em] text-zinc-700 dark:text-zinc-200 pl-4 font-medium leading-relaxed" style={{ borderLeftColor: primario }}>
              "Ante ustedes hermanos de la Avanzada asumo mi ideal y elijo el camino de los hombres libres que entregaron su vida al servicio de los demás. Si avanzo, que los Pioneros me sigan, si tropiezo, que la Avanzada me ayude. Y si mi vida sirve a la causa del amor, Que Dios y las personas me acojan. Por mi Honor prometo hacer cuanto de mi dependa para buscar a Dios, amar a mi familia, ayudar a los demás, servir a mi país, trabajar por la paz y vivir la Ley."
            </blockquote>
            <div className="space-y-2 pl-2">
              <h5 className="font-extrabold text-[0.95em] uppercase text-zinc-800 dark:text-zinc-350">La Ley Guía-Scout:</h5>
              <ul className="grid grid-cols-1 gap-2 text-[0.88em] text-zinc-750 dark:text-zinc-350 font-bold mt-2 pl-2 list-decimal font-body">
                <li><strong>Es una persona digna de confianza:</strong> Sus actos y palabras son coherentes con su vida interior.</li>
                <li><strong>Es leal:</strong> Persistencia de nuestras convicciones en aquello que consideramos importante.</li>
                <li><strong>Sirve sin esperar recompensa:</strong> Mirar con cuidado y respeto al ser humano.</li>
                <li><strong>Es alegre y cordial:</strong> Actitud permanente que contagia entusiasmo y acoge al otro.</li>
                <li><strong>Comparte con todos:</strong> Actitud abierta hacia las demás personas.</li>
                <li><strong>Protege la vida y la naturaleza:</strong> Respetar y potenciar al ser humano.</li>
                <li><strong>Es responsable y nada hace a medias:</strong> Capacidad de compromiso.</li>
                <li><strong>Cuida las cosas y valora el trabajo:</strong> Valora el esfuerzo humano.</li>
                <li><strong>Es optimista:</strong> Escudo contra el temor.</li>
                <li><strong>Es coherente en su pensamiento, palabra y acción:</strong> Rectitud de corazón.</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="md:col-span-5 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-lg space-y-4 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: primario }} />
          <div className="space-y-4">
            <h4 className="text-[1.25em] font-black uppercase text-zinc-900 dark:text-white pl-2">El Lema de Avanzada</h4>
            <div className="p-5 bg-zinc-50 dark:bg-white/5 rounded-2xl border border-zinc-150 dark:border-white/5 text-center space-y-2">
              <span className="text-[2em] font-black uppercase tracking-wider block" style={{ color: primario }}>"Siempre Adelante!"</span>
              <p className="text-[0.9em] text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">Es un recordatorio a la superación, al crecimiento personal y la perseverancia.</p>
            </div>
            <div className="space-y-2 pl-2">
              <h5 className="font-extrabold text-[0.95em] uppercase text-zinc-800 dark:text-zinc-350">Color Oficial:</h5>
              <div className="flex gap-4 items-center mt-2"><div className="flex items-center gap-2"><span className="w-5 h-5 rounded-full border shadow-sm block" style={{ backgroundColor: primario }} /><span className="text-[0.88em] font-extrabold text-zinc-700 dark:text-zinc-300">Añil (Jiquilite)</span></div></div>
              <p className="text-[0.88em] text-zinc-550 dark:text-zinc-400 leading-relaxed font-semibold mt-2">El **color Añil** se obtiene del arbusto Jiquilite. Es una unión de la energía del rojo y de la espiritualidad del azul.</p>
            </div>
            <div className="space-y-2 pl-2 pt-2 border-t border-zinc-150 dark:border-white/10">
              <h5 className="font-extrabold text-[0.95em] uppercase text-zinc-850 dark:text-zinc-300">Oración de la Avanzada:</h5>
              <p className="text-[1em] italic text-zinc-600 dark:text-zinc-350 leading-relaxed font-semibold">"Señor ayúdame a encontrar la fortaleza del bosque para que ningún triunfo me envanezca, La alegría de la mañana para que ninguna soledad me abata, La libertad del ave para elegir mi camino, Y la voluntad del Pionero para seguir siempre adelante y servir. Así sea."</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-3xl p-5 shadow-sm space-y-2 relative overflow-hidden border-t-4" style={{ borderTopColor: primario }}><h5 className="font-extrabold uppercase text-[1.05em] text-zinc-950 dark:text-white">Nuestro Emblema</h5><p className="text-[0.88em] text-zinc-650 dark:text-zinc-450 leading-relaxed font-semibold">La flor de Lis y el Trébol se unen de manera estilizada para representar la unidad y el trabajo conjunto de hombres y mujeres.</p></div>
        <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-3xl p-5 shadow-sm space-y-2 relative overflow-hidden border-t-4" style={{ borderTopColor: primario }}><h5 className="font-extrabold uppercase text-[1.05em] text-zinc-950 dark:text-white">El Cayado</h5><p className="text-[0.88em] text-zinc-650 dark:text-zinc-450 leading-relaxed font-semibold">Vara terminada en dos puntas en un extremo. Refuerza el concept de responsabilidad ante las encrucijadas y elecciones de caminos.</p></div>
        <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-3xl p-5 shadow-sm space-y-2 relative overflow-hidden border-t-4" style={{ borderTopColor: primario }}><h5 className="font-extrabold uppercase text-[1.05em] text-zinc-950 dark:text-white">El Refugio</h5><p className="text-[0.88em] text-zinc-650 dark:text-zinc-450 leading-relaxed font-semibold">Denominación del punto de reunión de la Avanzada. Espacio seguro y protector donde los jóvenes comparten ideas.</p></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
        <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-3xl p-5 shadow-sm flex gap-4 items-center border-l-4" style={{ borderLeftColor: primario }}>
          <div className="w-30 h-30 shrink-0 flex items-center justify-center"><img src="/images/progresion/avanzada/etapa_bienvenida.png" alt="Logo de Avanzada" className="max-w-full max-h-full object-contain" /></div>
          <div className="space-y-1"><h5 className="font-extrabold uppercase text-[1.05em] text-zinc-950 dark:text-white">Insignia Cruz del Sur</h5><p className="text-[0.85em] text-zinc-600 dark:text-zinc-400 leading-normal font-semibold">Insignia de pertenencia que acompaña al joven durante todo su paso por la Avanzada.</p></div>
        </div>
        <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-3xl p-5 shadow-sm flex gap-4 items-center border-l-4" style={{ borderLeftColor: primario }}>
          <div className="text-6xl shrink-0">📖</div>
          <div className="space-y-1"><h5 className="font-extrabold uppercase text-[1.05em] text-zinc-950 dark:text-white">La Bitácora</h5><p className="text-[0.85em] text-zinc-600 dark:text-zinc-400 leading-normal font-semibold">Libro simple de acuerdos de la Asamblea que recoge el testimonio y la historia de la Avanzada.</p></div>
        </div>
      </div>
      <div className="rounded-3xl overflow-hidden shadow-xl border border-zinc-200 dark:border-white/10 relative min-h-[300px] flex items-center group mt-8" style={{ backgroundImage: "url('/images/unidades/bandera_avanzada_1.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/80 to-zinc-950/40 z-0 transition-opacity group-hover:opacity-95" />
        <div className="relative z-10 p-8 md:p-12 space-y-4 max-w-3xl text-white">
          <div className="flex items-center gap-3"><span className="w-2.5 h-8 rounded-full inline-block" style={{ backgroundColor: primario }} /><h4 className="text-[1.5em] font-black uppercase tracking-tight text-white">La Bandera de la Avanzada</h4></div>
          <div className="space-y-4 text-[0.98em] text-zinc-200 leading-relaxed font-semibold">
            <p>La Bandera reúne el color y los símbolos que nos identifican: la flor de Lis y el trébol que se mezclan y conjugan, acompañados y orientados por la Cruz del Sur.</p>
            <p>Es la insignia comunitaria que encarna el espíritu de los pioneros que marchan "Siempre Adelante!" abriendo nuevas sendas y asumiendo desafíos de liderazgo.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
