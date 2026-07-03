'use client';

import { useState } from 'react';

interface Objective {
  id: string;
  area_id: number;
  texto_infantil: string;
  texto_terminal: string;
}

interface CompaniaCustomContentProps {
  objectives: Objective[];
}

export default function CompaniaCustomContent({ objectives = [] }: CompaniaCustomContentProps) {
  const [activeTab, setActiveTab] = useState<'camino' | 'perfil' | 'objetivos' | 'proyectos' | 'mistica'>('camino');

  // Colores de la Compañía: Celeste (#00b7dc) y Amarillo/Dorado (#e7a913)
  const primario = '#00b7dc';
  const secundario = '#e7a913';

  const areas = [
    { id: 1, name: "Corporalidad", icon: "🌱", img: "/images/progresion/compania/area_corporalidad.png", color: "#00b7dc", symbol: "El Alerce", symbolDesc: "Refleja fuerza y longevidad, creciendo de manera constante con agua y luz.", desc: "Desarrollo del cuerpo y cuidado de la salud." },
    { id: 2, name: "Creatividad", icon: "🔥", img: "/images/progresion/compania/area_creatividad.png", color: "#ff8c00", symbol: "El Fuego", symbolDesc: "Elemento de vital importancia para crear e innovar desde lo que tenemos.", desc: "Estimular el pensamiento, innovar y adquirir habilidades." },
    { id: 3, name: "Carácter", icon: "🏔️", img: "/images/progresion/compania/area_caracter.png", color: "#2ed573", symbol: "La Montaña", symbolDesc: "De base sólida y estable, nos desafía y reafirma quiénes somos.", desc: "Conocerse a sí mismo, madurez y escala de valores." },
    { id: 4, name: "Afectividad", icon: "🕊️", img: "/images/progresion/compania/area_afectividad.png", color: "#ff4757", symbol: "La Torcaza", symbolDesc: "Representa el andar seguro en bandada, la protección familiar y los afectos.", desc: "Lograr y mantener la madurez y equilibrio emocional." },
    { id: 5, name: "Sociabilidad", icon: "🐝", img: "/images/progresion/compania/area_sociabilidad.png", color: "#a55eea", symbol: "Las Abejas", symbolDesc: "Trabajo en sociedad para un fin común, comunicándose activamente.", desc: "Compromiso social y convivencia en comunidad." },
    { id: 6, name: "Espiritualidad", icon: "🌌", img: "/images/progresion/compania/area_espiritualidad.png", color: "#8e44ad", symbol: "La Constelación", symbolDesc: "La mirada al cielo nocturno buscando respuestas y trascendencia con Dios.", desc: "Búsqueda del sentido trascendente y la fe." }
  ];

  const getObjectivesByArea = (areaId: number) => {
    return objectives.filter(o => o.area_id === areaId);
  };

  return (
    <div className="space-y-12">
      {/* Sistema de Pestañas Interactivas */}
      <div className="border-b border-zinc-200 dark:border-white/10 pb-2">
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <button
            onClick={() => setActiveTab('camino')}
            className={`px-5 py-2.5 rounded-2xl text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'camino'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'camino' ? primario : undefined }}
          >
            Etapas de Progresión
          </button>
          <button
            onClick={() => setActiveTab('perfil')}
            className={`px-5 py-2.5 rounded-2xl text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'perfil'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'perfil' ? primario : undefined }}
          >
            Perfil de la Guía
          </button>
          <button
            onClick={() => setActiveTab('objetivos')}
            className={`px-5 py-2.5 rounded-2xl text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'objetivos'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'objetivos' ? primario : undefined }}
          >
            Objetivos Educativos
          </button>
          <button
            onClick={() => setActiveTab('proyectos')}
            className={`px-5 py-2.5 rounded-2xl text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'proyectos'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'proyectos' ? primario : undefined }}
          >
            Proyectos y Ciclo
          </button>
          <button
            onClick={() => setActiveTab('mistica')}
            className={`px-5 py-2.5 rounded-2xl text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'mistica'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'mistica' ? primario : undefined }}
          >
            Mística y Símbolos
          </button>
        </div>
      </div>

      {/* Contenido de la Pestaña 1: Etapas de Progresión */}
      {activeTab === 'camino' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-4">
            <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>
              La Ruta del Crecimiento en la Compañía
            </h3>
            <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">
              En la Compañía, el crecimiento personal se vive como una exploración continua de nuevos territorios con un grupo de amigas. Las insignias de progresión se entregan al comienzo de cada etapa como un estímulo para seguir adelante en tu propio Diario de los Desafíos.
            </p>
          </div>

          {/* Línea de Tiempo de Progresión */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 pt-4">
            {[
              {
                title: "Etapa Alba",
                subtitle: "La Primera Luz",
                desc: "El camino nos presenta los primeros destellos del sol por la cordillera. La guía se reconoce dentro de su patrulla y comienza a explorar los desafíos de 11 a 13 años.",
                img: "/images/progresion/compania/etapa_alba.png"
              },
              {
                title: "Etapa Amanecer",
                subtitle: "El Camino Se Ensancha",
                desc: "El sol ya se asoma indicando que el viaje ha comenzado. Se entrega al alcanzar aproximadamente la mitad de los desafíos del rango de 11 a 13 años, brindando más dirección a la senda.",
                img: "/images/progresion/compania/etapa_amanecer.png"
              },
              {
                title: "Etapa Luz",
                subtitle: "Exploración Eficaz",
                desc: "Con el sol alto en el cielo azul, la ruta se hace más visible y segura. Se inicia al interactuar con los objetivos de 13 a 15 años, marcando la senda para las demás.",
                img: "/images/progresion/compania/etapa_luz.png"
              },
              {
                title: "Etapa Resplandor",
                subtitle: "Legado y Compromiso",
                desc: "El sol brilla fuerte sobre nuestros hombros y la travesía es más intensa. Se entrega al promediar los objetivos de 13 a 15 años, preparándote para el paso a la Avanzada.",
                img: "/images/progresion/compania/etapa_resplandor.png"
              }
            ].map((etapa, idx) => (
              <div key={idx} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-5 space-y-4 flex flex-col items-center text-center shadow-md">
                <div className="w-24 h-24 flex items-center justify-center bg-zinc-50 dark:bg-white/5 rounded-2xl p-2">
                  <img src={etapa.img} alt={etapa.title} className="max-w-full max-h-full object-contain" />
                </div>
                <div>
                  <h4 className="font-extrabold uppercase text-[1.1em] text-zinc-900 dark:text-white">
                    {etapa.title}
                  </h4>
                  <span className="text-[0.8em] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mt-0.5">
                    {etapa.subtitle}
                  </span>
                  <p className="text-[0.9em] text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                    {etapa.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-4">
            <h4 className="font-extrabold uppercase text-[1.2em] text-zinc-900 dark:text-white">
              El Diario de los Desafíos y los Sellos
            </h4>
            <p className="text-[1.02em] leading-relaxed text-zinc-700 dark:text-zinc-300">
              Cuando al final de un ciclo de programa se evalúan tus objetivos y se consideran logrados, se procede a estampar un <strong>sello</strong> en tu pasaporte personal (Diario de los Desafíos). Cada área de desarrollo tiene su propio diseño inspirado en símbolos de la naturaleza que representan el crecimiento personal y la exploración de nuevos territorios.
            </p>
          </div>
        </div>
      )}

      {/* Contenido de la Pestaña 2: Perfil de la Guía */}
      {activeTab === 'perfil' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-4">
            <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>
              Perfil de Egreso de la Guía
            </h3>
            <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">
              En el Movimiento Guía y Scout aspiramos a que, al finalizar tu paso por la Compañía y el Grupo, seas capaz de forjar tu propio proyecto de vida basándote en los siguientes pilares de la personalidad:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Una persona íntegra y libre",
                desc: "Limpia de pensamiento y recta de corazón, de voluntad fuerte, responsable de sí misma, que ha optado por un proyecto personal de vida y que, fiel a la palabra dada, es lo que dice ser."
              },
              {
                title: "Una persona servidora de los demás",
                desc: "Solidaria con su comunidad, defensora de los derechos de los otros, comprometida con la democracia, integrada al desarrollo, amante de la justicia, promotora de la paz, que valora el trabajo humano y construye su familia en el amor."
              },
              {
                title: "Una persona creativa",
                desc: "Que se esfuerza por dejar el mundo mejor de cómo lo encontró, comprometida con la integridad de la naturaleza, interesada por aprender continuamente, en búsqueda de pistas aún no exploradas y libre del afán de poseer."
              },
              {
                title: "Una persona espiritual",
                desc: "Con un sentido trascendente para su vida, que camina al encuentro de Dios, vive alegremente su fe y la integra a su conducta, y que, abierta al diálogo y a la comprensión, respeta las opciones de los demás."
              }
            ].map((pilar, idx) => (
              <div key={idx} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-3">
                <h4 className="font-extrabold uppercase text-[1.15em] text-zinc-900 dark:text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: primario }}></span>
                  {pilar.title}
                </h4>
                <p className="text-[0.98em] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {pilar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contenido de la Pestaña 3: Objetivos Educativos */}
      {activeTab === 'objetivos' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-4">
            <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>
              Objetivos Educativos (Desafíos de la Guía)
            </h3>
            <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">
              La progresión personal se organiza en seis áreas de desarrollo. Cada una posee un símbolo protector en la naturaleza de la Compañía. Descubre tus objetivos y desafíate a explorar nuevos caminos junto a tu patrulla.
            </p>
          </div>

          <div className="space-y-8">
            {areas.map((area) => {
              const areaObjs = getObjectivesByArea(area.id);
              return (
                <div key={area.id} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-white/10 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-zinc-50 dark:bg-white/5 p-2 border border-zinc-150 dark:border-white/5">
                        <img src={area.img} alt={area.name} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div>
                        <h4 className="font-extrabold uppercase text-[1.25em] text-zinc-900 dark:text-white flex items-center gap-2">
                          {area.name}
                        </h4>
                        <p className="text-[0.85em] text-zinc-500 dark:text-zinc-400 leading-snug">
                          {area.desc}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-[0.8em] font-black uppercase tracking-widest px-3 py-1 rounded-full border"
                            style={{ borderColor: `${area.color}40`, backgroundColor: `${area.color}10`, color: area.color }}>
                        {area.symbol}
                      </span>
                      <p className="text-[0.8em] text-zinc-400 dark:text-zinc-500 mt-1 sm:max-w-xs leading-normal">
                        {area.symbolDesc}
                      </p>
                    </div>
                  </div>

                  {/* Lista de Objetivos de la base de datos */}
                  <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {areaObjs.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {areaObjs.map((obj) => (
                          <div key={obj.id} className="bg-zinc-50 dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-2xl p-4 flex gap-3 items-start hover:border-zinc-300 dark:hover:border-white/20 transition-colors">
                            <span className="font-bold text-[1.1em] mt-0.5" style={{ color: area.color }}>•</span>
                            <div className="space-y-1">
                              <span className="font-bold text-zinc-800 dark:text-zinc-200 block text-[0.98em]">
                                {obj.texto_infantil}
                              </span>
                              <p className="text-[0.85em] text-zinc-500 dark:text-zinc-400 leading-snug">
                                Meta terminal: {obj.texto_terminal}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[0.95em] text-zinc-500 dark:text-zinc-400 italic">
                        Cargando objetivos educativos desde la base de datos...
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Contenido de la Pestaña 4: Proyectos y Ciclo */}
      {activeTab === 'proyectos' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-4">
            <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>
              Ciclo de Programa y Proyectos de Patrulla
            </h3>
            <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">
              En la Compañía, el juego democrático y el protagonismo de las guías organizan la vida común. A través de ciclos que ocurren tres veces al año, planificamos, preparamos, desarrollamos y evaluamos nuestras aventuras.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-4">
              <h4 className="font-extrabold uppercase text-[1.2em] text-zinc-900 dark:text-white" style={{ color: primario }}>
                Las 4 Fases del Ciclo de Programa
              </h4>
              <div className="space-y-4">
                {[
                  { phase: "Fase 1: Diagnóstico de la Unidad", desc: "El Consejo de Compañía y los Consejos de Patrulla analizan el clima educativo, el avance de objetivos y las guiadoras, fijando el Énfasis del Ciclo." },
                  { phase: "Fase 2: Propuesta y Selección", desc: "Las patrullas exponen ideas de proyectos y actividades variables. Mediante Juegos Democráticos en Asamblea se eligen las favoritas." },
                  { phase: "Fase 3: Diseño y Preparación", desc: "Se arma un calendario flexible aprobado por la Asamblea. Cada actividad se diseña definiendo objetivos claros y se preparan materiales." },
                  { phase: "Fase 4: Desarrollo y Evaluación", desc: "¡La emoción de hacer cosas! Se ejecutan los proyectos, se evalúa el cumplimiento de metas y se reconoce la progresión con sellos." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center font-bold text-[0.85em] text-zinc-600 dark:text-zinc-300 shrink-0 mt-0.5 border border-zinc-200 dark:border-white/10">
                      {idx + 1}
                    </span>
                    <div>
                      <h5 className="font-bold text-zinc-800 dark:text-zinc-200 text-[1.02em]">{item.phase}</h5>
                      <p className="text-[0.9em] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-3">
                <h4 className="font-extrabold uppercase text-[1.2em] text-zinc-900 dark:text-white" style={{ color: primario }}>
                  Los Proyectos de Compañía
                </h4>
                <p className="text-[0.98em] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Los proyectos son actividades de mediana o larga duración organizadas por las patrullas en pos de un objetivo común. Las jóvenes son las protagonistas absolutas de sus proyectos: proponen ideas, diseñan las tareas, asumen responsabilidades individuales y evalúan los resultados juntas.
                </p>
                <div className="pt-2">
                  <span className="inline-block text-[0.8em] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-900/30">
                    DURAS: Desafiantes • Útiles • Recompensantes • Atractivas • Seguras
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-3">
                <h4 className="font-extrabold uppercase text-[1.2em] text-zinc-900 dark:text-white" style={{ color: primario }}>
                  Las Actividades Fijas
                </h4>
                <p className="text-[0.98em] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Aquellas rutinas que dan estructura a nuestra vida común: las <strong>Reuniones de Patrulla</strong> y de Compañía, los <strong>Campamentos</strong> y excursiones (que refuerzan la vida al aire libre), los juegos, los relatos e historias inspiradoras, y la tradicional <strong>Fiesta del Trébol</strong> en campamento.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido de la Pestaña 5: Mística y Símbolos */}
      {activeTab === 'mistica' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Promesa y Ley */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-4">
              <span className="text-[0.8em] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-900/30">
                Compromiso de Honor
              </span>
              <h4 className="font-extrabold uppercase text-[1.3em] text-zinc-900 dark:text-white leading-tight">
                La Promesa Guía
              </h4>
              <p className="text-[1.08em] leading-relaxed text-zinc-700 dark:text-zinc-300 italic pl-4 border-l-2 border-cyan-500">
                "Hacer cuanto de mí dependa para buscar a Dios, amar a mi familia, ayudar a los demás, servir a mi país, trabajar por la paz y vivir la Ley Guía."
              </p>
            </div>

            <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-4">
              <span className="text-[0.8em] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/30">
                Código de Conducta
              </span>
              <h4 className="font-extrabold uppercase text-[1.3em] text-zinc-900 dark:text-white leading-tight">
                La Ley Guía
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[0.92em]">
                {[
                  "1. Es digna de confianza.",
                  "2. Es leal.",
                  "3. Sirve sin esperar recompensa.",
                  "4. Comparte con todos.",
                  "5. Es alegre y cordial.",
                  "6. Protege la vida y la naturaleza.",
                  "7. Es responsable y nada hace a medias.",
                  "8. Es optimista.",
                  "9. Cuida las cosas y valora el trabajo.",
                  "10. Es coherente en su pensamiento, palabra y acción."
                ].map((ley, idx) => (
                  <span key={idx} className="text-zinc-700 dark:text-zinc-300 font-semibold">{ley}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Símbolos Principales */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-3">
              <h4 className="font-extrabold uppercase text-[1.1em] text-zinc-900 dark:text-white">
                El Color Cian
              </h4>
              <p className="text-[0.9em] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Es la mezcla exacta de verde y azul claro: los colores más significativos del entorno de exploración de las guías en la naturaleza. Representa la tierra fértil y el cielo abierto de Seeonee.
              </p>
            </div>
            <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-3">
              <h4 className="font-extrabold uppercase text-[1.1em] text-zinc-900 dark:text-white">
                El Trébol Mundial
              </h4>
              <p className="text-[0.9em] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Símbolo de la Asociación Mundial (WAGGGS). Sus tres hojas recuerdan los principios de la promesa, y su aguja en el centro representa la brújula que nos señala el norte en el camino.
              </p>
            </div>
            <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-3">
              <h4 className="font-extrabold uppercase text-[1.1em] text-zinc-900 dark:text-white">
                Saludo Izquierdo
              </h4>
              <p className="text-[0.9em] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Seña de confianza heredada del pueblo Ashanti: al saludar con la mano izquierda, el guerrero dejaba de lado su escudo protector, simbolizando que se encuentra ante amigas en quienes confía plenamente.
              </p>
            </div>
          </div>

          {/* Himno Guía */}
          <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-4">
            <h4 className="font-extrabold uppercase text-[1.2em] text-zinc-900 dark:text-white">
              Himno de la Rama: Siempre Lista
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[0.95em]">
              <div className="space-y-1">
                <span className="font-bold text-zinc-800 dark:text-zinc-200 block text-[0.9em] uppercase tracking-wide">Coro</span>
                <p className="italic text-zinc-650 dark:text-zinc-400 leading-relaxed pl-3 border-l border-zinc-200 dark:border-white/10">
                  Siempre lista, hermana guía,<br />
                  es el deber nuestra misión,<br />
                  ser la luz que brilla y brilla<br />
                  por la Patria y el honor.<br />
                  A la cumbre subiremos<br />
                  sin descanso hasta el final<br />
                  con el alma siempre abierta<br />
                  en pos de nuestro ideal.
                </p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-zinc-800 dark:text-zinc-200 block text-[0.9em] uppercase tracking-wide">Estrofa I</span>
                <p className="italic text-zinc-650 dark:text-zinc-400 leading-relaxed pl-3 border-l border-zinc-200 dark:border-white/10">
                  Guías, avanzad en alegre caravana<br />
                  porque la luz nos espera al final<br />
                  siempre en la paz, amor y amistad<br />
                  el triunfo será de nuestra hermandad.
                </p>
              </div>
            </div>
          </div>

          {/* Bandera de la Compañía */}
          <div className="relative rounded-[2rem] overflow-hidden border border-zinc-200 dark:border-white/10 bg-zinc-900 shadow-xl" style={{ minHeight: '280px' }}>
            <div className="absolute inset-0 z-0 select-none pointer-events-none opacity-40 dark:opacity-30">
              <img
                src="/images/unidades/bandera_compania.jpg"
                alt="Bandera de la Compañía de Guías"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10 p-8 sm:p-10 flex flex-col justify-end h-full space-y-4 max-w-2xl bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent">
              <span className="text-[0.8em] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 align-self-start self-start">
                Símbolo de Unidad
              </span>
              <h4 className="text-[1.5em] font-black uppercase tracking-tight text-white leading-tight">
                La Bandera de la Compañía
              </h4>
              <p className="text-[1.02em] leading-relaxed text-zinc-200">
                La bandera oficial de la Rama lleva como fondo el color <strong>cian</strong> y en su centro, en amarillo dorado, el <strong>trébol</strong> de la insignia Guía Mundial. Representa la hermandad internacional de niñas y jóvenes que exploran y sirven unidas a lo largo de todo el planeta.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
