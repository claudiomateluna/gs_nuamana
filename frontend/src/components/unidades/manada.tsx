'use client';

import { useState } from 'react';
import { UnitView } from './UnitView';
import { SHARED_AREAS, EGRESO_PILARES, ESPECIALIDADES_CAMPOS, ESPECIALIDADES_PRINCIPIOS } from '@/data/unit-configs';

interface Objective {
  id: string;
  area_id: number;
  texto_infantil: string;
  texto_terminal: string;
}

interface ManadaCustomContentProps {
  objectives: Objective[];
}

export default function ManadaCustomContent({ objectives = [] }: ManadaCustomContentProps) {
  const primario = '#f5cd16';
  const secundario = '#2b2c77';
  const areas = SHARED_AREAS[1];

  return (
    <UnitView
      primario={primario}
      secundario={secundario}
      areas={areas}
      objectives={objectives}
      profileTabLabels={{ desarrollo: 'Desarrollo del Lobato (7 a 11 años)', egreso: 'Perfil de Egreso (A los 20 años)' }}
      profileContent={{
        desarrollo: <ManadaDesarrollo primario={primario} secundario={secundario} />,
        egreso: <ManadaEgreso primario={primario} secundario={secundario} />,
      }}
      tabs={[
        { key: 'camino', label: 'Etapas de Manada', content: <ManadaCamino primario={primario} secundario={secundario} /> },
        { key: 'objetivos', label: 'Objetivos Educativos', content: <ManadaObjetivos primario={primario} secundario={secundario} areas={areas} objectives={objectives} /> },
        { key: 'cacerias', label: 'Cacerías y Ciclo', content: <ManadaCacerias secundario={secundario} /> },
        { key: 'especialidades', label: 'Especialidades', content: <ManadaEspecialidades primario={primario} secundario={secundario} /> },
        { key: 'mistica', label: 'Símbolos', content: <ManadaMistica primario={primario} secundario={secundario} /> },
      ]}
    />
  );
}

function ManadaDesarrollo({ primario, secundario }: { primario: string; secundario: string }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight px-2 py-4 rounded-lg" style={{ backgroundColor: primario, color: secundario }}>Un Perfil a Grandes Trazos de la Infancia</h3>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">El perfil a grandes trazos describe las características reales y comportamientos de las niñas y niños de 7 a 11 años según los distintos aspectos de su personalidad, orientando a los Viejos Lobos en la Manada:</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
        {[{ title: "Activos y Llenos de Energía", desc: "Pese a haber corrido y jugado durante todo el día, nunca quieren irse a dormir en campamento y siempre están demasiado cansados para despertar." },{ title: "Curiosos e Investigadores", desc: "Buscar nuevas preguntas y respuestas es parte del juego de la vida en esta edad. Todo ofrece algo nuevo por descubrir o presenta alguna utilidad que antes no conocían." },{ title: "Observadores e Inventores", desc: "Observadores de la naturaleza y del mundo que los rodea, inventores de máquinas y herramientas, son capaces de construirlo todo y exigen el mejor de tus esfuerzos para satisfacer su curiosidad." },{ title: "Defensores de la Verdad y la Justicia", desc: "No perdonarán una trampa al jugar o una distribución poco equitativa de lo disponible. Comprenden gradualmente las opiniones e intereses ajenos y que no siempre se puede hacer lo que ellos quieren." },{ title: "Cumplidores de Pequeñas Tareas", desc: "Aceptarán comprometerse en pequeñas responsabilidades e intentarán cumplirlas. Aunque fallen una y mil veces, aprenderán de a poco lo que significa un compromiso." },{ title: "Cuestionadores de la Autoridad", desc: "Ya no aceptan la autoridad solo 'porque debe ser aceptada', sino porque el que la ejerce se ha ganado su respeto y confianza con honestidad y claridad en sus argumentos." },{ title: "Emociones Fuertes y Transitorias", desc: "La estabilidad de su ánimo se ve alterada por emociones fuertes y contrapuestas que se van tan rápido como vienen: alegría, tristeza, aburrimiento o excitación." },{ title: "Normas Construidas en Común", desc: "Juegan y comparten bajo reglas comunes. Poco a poco, estas ya no son impuestas por otros, sino construidas por ellos mismos con la ayuda de los dirigentes." },{ title: "Tolerancia ante la Diversidad", desc: "Descubren que entre sus compañeros, padres y profesores existen opiniones distintas y que parte de la vida es ponerse de acuerdo, base del respeto mutuo." },{ title: "Curiosidad por la Trascendencia", desc: "Quieren conocer mejor a Dios. Construyen una relación personal con Él como un amigo cercano, un hermano que ayuda, y un padre que protege y al que se aprende a amar." }].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-4 shadow-md space-y-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: primario }} />
            <h4 className="font-extrabold uppercase text-[1.1em] text-zinc-900 dark:text-white pl-2" style={{ backgroundColor: secundario, color: primario, padding: '0.25rem 0.5rem', borderRadius: '0.5rem' }}>{item.title}</h4>
            <p className="text-[0.95em] text-zinc-650 dark:text-zinc-400 leading-relaxed italic pl-2">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ManadaEgreso({ primario, secundario }: { primario: string; secundario: string }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ backgroundColor: secundario, color: primario, padding: '0.25rem 0.5rem', borderRadius: '0.5rem' }}>Perfil de Egreso</h3>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">Las personas que compartimos en el Movimiento Guía y Scout, aspiramos a hacer todo lo que de nosotros dependa para ser al término del camino:</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {EGRESO_PILARES.map((pilar, idx) => (
          <div key={idx} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-4 shadow-md space-y-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: secundario }} />
            <h4 className="font-extrabold uppercase text-[1.1em] text-zinc-900 dark:text-white pl-2" style={{ backgroundColor: primario, color: secundario, padding: '0.25rem 0.5rem', borderRadius: '0.5rem' }}>{pilar.title}</h4>
            <p className="text-[0.95em] text-zinc-650 dark:text-zinc-400 leading-relaxed pl-2">{pilar.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ManadaCamino({ primario, secundario }: { primario: string; secundario: string }) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight p-4 rounded-lg" style={{ backgroundColor: primario, color: secundario }}>La Ruta del Crecimiento</h3>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">En la Manada, la progresión personal se vive en una senda adaptada a la niñez, donde las insignias de progresión reconocen el avance en el crecimiento del niño, evaluado a través de sus objetivos personales. El camino se divide en cuatro etapas de acuerdo con el rango de edad y madurez.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-4">
        {[{ title: "Lobezno", desc: "Se entrega cuando el niño comienza con sus objetivos personales correspondientes a la Infancia Media. Es la bienvenida formal al cubil de Seeonee.", img: "/images/progresion/manada/etapa_lobezno.png" },{ title: "Saltador", desc: "Se reconoce cuando el lobato ha alcanzado aproximadamente la mitad de sus objetivos personales de Infancia Media (7 a 9 años).", img: "/images/progresion/manada/etapa_saltador.png" },{ title: "Diestro", desc: "Comienza cuando el niño avanza al rango de Infancia Tardía (9 a 11 años) y comienza a trabajar en sus objetivos del segundo Mapa del Lobato.", img: "/images/progresion/manada/etapa_diestro.png" },{ title: "Cazador", desc: "Se reconoce cuando el lobato ha logrado aproximadamente la mitad de los objetivos correspondientes a la Infancia Tardía, preparándose para la transición.", img: "/images/progresion/manada/etapa_cazador.png" }].map((etapa, idx) => (
          <div key={idx} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-2 space-y-4 flex flex-col items-center text-center shadow-md">
            <div className="w-30 h-30 flex items-center justify-center bg-zinc-50 dark:bg-white/5 rounded-[1.55rem]"><img src={etapa.img} alt={etapa.title} className="max-w-full max-h-full object-contain rounded-[0.01rem]" /></div>
            <div><h4 className="font-extrabold uppercase text-[1.1em] text-zinc-900 dark:text-white">{etapa.title}</h4><p className="text-[0.9em] text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">{etapa.desc}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ManadaObjetivos({ primario, secundario, areas, objectives }: { primario: string; secundario: string; areas: typeof SHARED_AREAS[1]; objectives: Objective[] }) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ backgroundColor: secundario, color: primario, padding: '0.25rem 0.5rem', borderRadius: '0.5rem' }}>Objetivos Educativos de la Manada (Huellas)</h3>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">Las "Huellas" son conductas previstas que los lobatos pueden lograr según su edad y madurez.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {areas.map(area => {
          const areaObjectives = objectives.filter(o => o.area_id === area.id);
          return (
            <div key={area.id} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-2 shadow-md space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 flex-shrink-0 bg-zinc-50 dark:bg-white/5 rounded-2xl p-0"><img src={area.img} alt={area.name} className="w-full h-full object-contain" /></div>
                  <div><h4 className="font-extrabold uppercase text-[1.25em]" style={{ color: area.color }}>{area.name}</h4><p className="text-[0.8em] text-zinc-500 dark:text-zinc-400 font-semibold leading-tight">{area.desc}</p></div>
                </div>
                <div className="pt-2">
                  {areaObjectives.length === 0 ? (<p className="text-[0.9em] text-zinc-500 dark:text-zinc-400 italic">No hay objetivos registrados para esta área.</p>) : (
                    <div className="max-h-64 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-white/10">
                      {areaObjectives.map((obj) => (<div key={obj.id} className="text-[0.95em] text-zinc-700 dark:text-zinc-300 leading-relaxed border-b border-zinc-150 dark:border-white/5 pb-2 last:border-0"><div className="flex items-start gap-1"><span className="font-bold text-[1.1em] mt-0.5" style={{ color: area.color }}>•</span><div><span className="font-bold text-zinc-800 dark:text-zinc-200">{obj.texto_infantil}</span><p className="text-[0.85em] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">Meta terminal: {obj.texto_terminal}</p></div></div></div>))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ManadaCacerias({ secundario }: { secundario: string }) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: secundario }}>Las Cacerías y el Ciclo de Programa</h3>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">La metodología de proyectos en la Manada se conoce como **"Cacería"**. A través de ella, los lobatos proponen, planifican y ejecutan aventuras colectivas guiados por los Viejos Lobos (Akela, Baloo, Bagheera, Kaa).</p>
      </div>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-md items-center">
          <div className="w-full md:w-1/3 rounded-2xl overflow-hidden relative"><img src="/images/unidades/bandera_manada.webp" alt="Lobatos campamento" className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-500" /></div>
          <div className="w-full md:w-2/3 space-y-3">
            <span className="text-[0.8em] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-900/30">Método Scout</span>
            <h4 className="text-[1.35em] font-black uppercase text-zinc-900 dark:text-white leading-tight">¿Qué es una Cacería?</h4>
            <p className="text-[0.95em] text-zinc-600 dark:text-zinc-400 leading-relaxed">Es un proyecto de corta duración estructurado a partir del juego y el marco simbólico. Toda la Manada participa activamente aportando ideas, eligiendo la cacería de forma democrática y asumiendo roles en las seisenas.</p>
          </div>
        </div>
        <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-md space-y-6">
          <h4 className="text-[1.25em] font-black uppercase text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-white/10 pb-2">Fases del Ciclo de Programa</h4>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {[{ name: "Planificación", desc: "La Manada se reúne en el Cubil para proponer y votar las cacerías del ciclo." },{ name: "Preparación", desc: "Los lobatos organizan tareas y aprenden las destrezas necesarias para la aventura." },{ name: "Ejecución", desc: "Se vive la aventura elegida (excursiones, talleres, campamentos de manada)." },{ name: "Evaluación", desc: "Se evalúan los logros individuales y grupales, registrándose en el Libro de Mohwa." },{ name: "Celebración", desc: "Fiesta y reconocimiento de las insignias y huellas alcanzadas." }].map((fase, i) => (
              <div key={i} className="bg-zinc-50 dark:bg-white/5 rounded-2xl p-4 space-y-2 border border-zinc-150 dark:border-white/5">
                <span className="text-[1.5em] font-black text-yellow-500">0{i+1}</span>
                <h5 className="font-extrabold uppercase text-[0.95em] text-zinc-900 dark:text-white">{fase.name}</h5>
                <p className="text-[0.85em] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">{fase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ManadaEspecialidades({ primario, secundario }: { primario: string; secundario: string }) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight p-2 rounded-lg" style={{ backgroundColor: primario, color: secundario }}>El Sistema de Especialidades en la Manada</h3>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300 font-semibold">Las especialidades son una propuesta educativa complementaria, voluntaria e individual, que invita a las lobatas y los lobatos a descubrir sus aptitudes innatas.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ESPECIALIDADES_PRINCIPIOS('lobato').map((principio, idx) => (
          <div key={idx} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-3xl p-2 text-center space-y-2 shadow-sm border-l-4" style={{ borderLeftColor: primario }}>
            <span className="text-6xl text-center p-4">{principio.icon}</span>
            <h5 className="font-extrabold uppercase text-[0.95em] text-zinc-900 dark:text-white">{principio.title}</h5>
            <p className="text-[0.88em] text-zinc-600 dark:text-zinc-400 leading-relaxed font-semibold">{principio.desc}</p>
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

function ManadaMistica({ primario, secundario }: { primario: string; secundario: string }) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: secundario }}>Marco Simbólico de la Manada</h3>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">El Marco Simbólico de la Manada se basa en la historia del Pueblo Libre de Seeonee, inspirada en "El Libro de las Tierras Vírgenes" de Rudyard Kipling.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        <div className="md:col-span-7 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-lg space-y-4 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: primario }} />
          <div className="space-y-4">
            <h4 className="text-[1.25em] font-black uppercase text-zinc-900 dark:text-white pl-2">La Promesa de la Manada</h4>
            <blockquote className="bg-zinc-50 dark:bg-white/5 p-5 rounded-2xl border-l-4 border-yellow-400 italic text-[1.1em] text-zinc-700 dark:text-zinc-200 pl-4 font-medium leading-relaxed">"Yo prometo ser siempre mejor, amar a Dios y a mi familia, ayudar a los demás y vivir la Ley de la Manada."</blockquote>
            <div className="space-y-2 pl-2">
              <h5 className="font-extrabold text-[0.95em] uppercase text-zinc-800 dark:text-zinc-350">Significado del Compromiso:</h5>
              <ul className="space-y-2 text-[0.9em] text-zinc-600 dark:text-zinc-400 leading-relaxed font-semibold">
                <li>• <strong>Yo prometo:</strong> Reafirma el carácter personal y voluntario del compromiso asumido.</li>
                <li>• <strong>Ser siempre mejor:</strong> Refuerza el lema e invita a la superación permanente del niño.</li>
                <li>• <strong>Amar a Dios y a mi familia:</strong> Compartir y vivir los valores de la fe y el hogar.</li>
                <li>• <strong>Ayudar a los demás:</strong> Fomentar la actitud solidaria para hacer del mundo un lugar mejor.</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="md:col-span-5 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-lg space-y-4 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: secundario }} />
          <div className="space-y-4">
            <h4 className="text-[1.25em] font-black uppercase text-zinc-900 dark:text-white pl-2">La Ley de la Manada</h4>
            <p className="text-[0.9em] text-zinc-500 dark:text-zinc-400 pl-2 leading-relaxed">Código de conducta para el lobato:</p>
            <div className="grid grid-cols-1 gap-2 pt-2 pl-2">
              {["Dice la verdad","Es alegre","Comparte con su familia","Escucha y ayuda a los demás","Cuida la naturaleza y las cosas","Busca aprender"].map((ley, i) => (
                <div key={i} className="p-2.5 bg-zinc-50 dark:bg-white/5 rounded-xl border border-zinc-150 dark:border-white/5 flex items-center gap-2.5">
                  <span className="font-black text-yellow-500">✓</span>
                  <span className="text-[0.88em] font-extrabold text-zinc-800 dark:text-zinc-200 leading-tight">{ley}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-md space-y-3 relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: secundario }} /><h4 className="font-extrabold uppercase text-[1.1em] text-zinc-900 dark:text-white flex items-center gap-2">🐺 El Tótem</h4><p className="text-[0.9em] text-zinc-600 dark:text-zinc-400 leading-relaxed">Una representación en madera de la cabeza de un lobo que encarna al Pueblo Libre.</p></div>
        <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-md space-y-3 relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: primario }} /><h4 className="font-extrabold uppercase text-[1.1em] text-zinc-900 dark:text-white flex items-center gap-2">🏕️ El Cubil</h4><p className="text-[0.9em] text-zinc-600 dark:text-zinc-400 leading-relaxed">La guarida de la Manada. Es el local o rincón decorado y mantenido por los propios niños.</p></div>
        <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-md space-y-3 relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: secundario }} /><h4 className="font-extrabold uppercase text-[1.1em] text-zinc-900 dark:text-white flex items-center gap-2">📖 El Libro de Mohwa</h4><p className="text-[0.9em] text-zinc-600 dark:text-zinc-400 leading-relaxed">El libro histórico de la Manada donde los lobatos plasman bitácoras, anécdotas y fotos.</p></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch pt-4">
        <div className="md:col-span-6 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-md space-y-3 relative overflow-hidden flex flex-col justify-between"><div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: primario }} /><div className="space-y-3"><h4 className="text-[1.2em] font-black uppercase text-zinc-900 dark:text-white pl-2">El Color Amarillo</h4><p className="text-[0.92em] text-zinc-650 dark:text-zinc-400 leading-relaxed pl-2">Históricamente, las primeras insignias scouts se bordaban en amarillo sobre fondo verde. Se eligió el <strong>color amarillo</strong> como el color oficial de identificación de los lobatos.</p></div></div>
        <div className="md:col-span-6 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-md space-y-3 relative overflow-hidden flex flex-col justify-between"><div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: secundario }} /><div className="space-y-3"><h4 className="text-[1.2em] font-black uppercase text-zinc-900 dark:text-white pl-2">La Flor Roja</h4><p className="text-[0.92em] text-zinc-650 dark:text-zinc-400 leading-relaxed pl-2">La Flor Roja es la fiesta del fuego de la Manada. Deriva del episodio donde Mowgli busca el fuego en la aldea de los hombres.</p></div></div>
      </div>
      <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row items-center gap-6 mt-4">
        <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: secundario }} />
        <div className="w-30 h-30 shrink-0 flex items-center justify-center"><img src="/images/logos/iconos_lobatos.svg" alt="Logo de Lobatos" className="max-w-full max-h-full object-contain" /></div>
        <div className="space-y-2"><h4 className="font-extrabold uppercase text-[1.25em] text-zinc-900 dark:text-white">Insignia Oficial de la Rama Lobatos</h4><p className="text-[0.95em] text-zinc-650 dark:text-zinc-400 leading-relaxed">La insignia oficial de la Rama Lobatos representa la cabeza de un lobo sonriente de Seeonee, simbolizando la amabilidad, la alegría y la fraternidad de la Manada.</p></div>
      </div>
      <div className="rounded-3xl overflow-hidden shadow-xl border border-zinc-200 dark:border-white/10 relative min-h-[300px] flex items-center group mt-8" style={{ backgroundImage: "url('/images/unidades/Bandera_manada_webP.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/80 to-zinc-950/40 z-0 transition-opacity group-hover:opacity-95" />
        <div className="relative z-10 p-8 md:p-12 space-y-4 max-w-3xl text-white">
          <div className="flex items-center gap-3"><span className="w-2.5 h-8 rounded-full inline-block" style={{ backgroundColor: primario }} /><h4 className="text-[1.5em] font-black uppercase tracking-tight text-white">La Bandera de la Manada</h4></div>
          <div className="space-y-4 text-[0.98em] text-zinc-200 leading-relaxed font-semibold">
            <p>La bandera de la Manada es el símbolo de reunión de la Rama. Es obligatoriamente de <strong>color amarillo</strong> y lleva en su centro la cabeza de un lobo.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
