'use client';

import { useState } from 'react';

interface Objective {
  id: string;
  area_id: number;
  texto_infantil: string;
  texto_terminal: string;
}

interface TropaCustomContentProps {
  objectives: Objective[];
}

export default function TropaCustomContent({ objectives = [] }: TropaCustomContentProps) {
  const [activeTab, setActiveTab] = useState<'camino' | 'perfil' | 'objetivos' | 'proyectos' | 'especialidades' | 'mistica'>('camino');
  const [profileTab, setProfileTab] = useState<'desarrollo' | 'egreso'>('desarrollo');

  // Colores de la Tropa: Verde (#009b3a) y Amarillo (#f5cd16) o Blanco
  const primario = '#009b3a';
  const secundario = '#1b1b1b'; // Neutro para texto y bordes de realce

  const areas = [
    { id: 1, name: "Corporalidad", icon: "🦅", img: "/images/progresion/tropa/area_corporalidad.png", color: "#00b7dc", symbol: "Hombre Pájaro", symbolDesc: "Inspirado en la cultura de Rapanui y la hazaña física de buscar el primer huevo del Manutara.", desc: "Desarrollo del cuerpo y cuidado de la salud." },
    { id: 2, name: "Creatividad", icon: "🏺", img: "/images/progresion/tropa/area_creatividad.png", color: "#ff8c00", symbol: "Vasija Diaguita", symbolDesc: "Símbolo de la capacidad de usar el conocimiento de manera original en la vida cotidiana.", desc: "Estimular el pensamiento, innovar y adquirir habilidades." },
    { id: 3, name: "Carácter", icon: "🧱", img: "/images/progresion/tropa/area_caracter.png", color: "#2ed573", symbol: "El Pucará", symbolDesc: "Fuerte incaico de piedra atacameño que representa solidez, tranquilidad y entereza moral.", desc: "Conocerse a sí mismo, madurez y escala de valores." },
    { id: 4, name: "Afectividad", icon: "🌸", img: "/images/progresion/tropa/area_afectividad.png", color: "#ff4757", symbol: "Chamanto de Doñihue", symbolDesc: "La flor tejida en el chamanto como símbolo de belleza, armonía y expresión de los afectos.", desc: "Lograr y mantener la madurez y equilibrio emocional." },
    { id: 5, name: "Sociabilidad", icon: "🐧", img: "/images/progresion/tropa/area_sociabilidad.png", color: "#a55eea", symbol: "Pingüino Emperador", symbolDesc: "Representa el trabajo cooperativo y la subsistencia comunitaria frente al clima antártico.", desc: "Compromiso social y convivencia en comunidad." },
    { id: 6, name: "Espiritualidad", icon: "🌲", img: "/images/progresion/tropa/area_espiritualidad.png", color: "#8e44ad", symbol: "Araucaria o Pehuén", symbolDesc: "Árbol venerado de raíces profundas y ramas al cielo, símbolo de la subsistencia y búsqueda de Dios.", desc: "Búsqueda del sentido trascendente y la fe." }
  ];

  const getObjectivesByArea = (areaId: number) => {
    return objectives.filter(o => o.area_id === areaId);
  };

  return (
    <div className="space-y-6">
      {/* Sistema de Pestañas Interactivas */}
      <div className="border-b border-zinc-200 dark:border-white/10 pb-2">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('camino')}
            className={`py-1 px-2 rounded-2xl text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'camino'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'camino' ? primario : undefined }}
          >
            Etapas de Tropa
          </button>
          <button
            onClick={() => setActiveTab('perfil')}
            className={`py-1 px-2 rounded-2xl text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'perfil'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'perfil' ? primario : undefined }}
          >
            Perfil del Scout
          </button>
          <button
            onClick={() => setActiveTab('objetivos')}
            className={`py-1 px-2 rounded-2xl text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
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
            className={`py-1 px-2 rounded-2xl text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'proyectos'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'proyectos' ? primario : undefined }}
          >
            Aventuras y Ciclo
          </button>
          <button
            onClick={() => setActiveTab('especialidades')}
            className={`py-1 px-2 rounded-2xl text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'especialidades'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'especialidades' ? primario : undefined }}
          >
            Especialidades
          </button>
          <button
            onClick={() => setActiveTab('mistica')}
            className={`py-1 px-2 rounded-2xl text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'mistica'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'mistica' ? primario : undefined }}
          >
            Símbolos
          </button>
        </div>
      </div>

      {/* Contenido de la Pestaña 1: Etapas de Tropa */}
      {activeTab === 'camino' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="space-y-4">
            <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>
              La Ruta del Crecimiento en la Tropa
            </h3>
            <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">
              En la Tropa, el camino de progresión personal se recorre explorando nuevos territorios con tu grupo de amigos. Las insignias de progresión representan el estímulo que se entrega al comenzar cada etapa, registrando tus avances en tu Bitácora.
            </p>
          </div>

          {/* Línea de Tiempo de Progresión */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-4">
            {[
              {
                title: "Etapa Cernícalo",
                subtitle: "Aprender a Observar",
                desc: "Se busca tener una visión panorámica de todo el conjunto que nos rodea, tal como hace el cernícalo al posarse en las ramas altas para detectar señales del entorno.",
                img: "/images/progresion/tropa/etapa_cernicalo.png"
              },
              {
                title: "Etapa Halcón",
                subtitle: "Observar y Descubrir",
                desc: "Tal como el halcón, que cubre territorios más amplios, estamos preparados para descubrir nuevos caminos que nos muestren con mayor claridad el rumbo de nuestra Tropa.",
                img: "/images/progresion/tropa/etapa_halcon.png"
              },
              {
                title: "Etapa Águila",
                subtitle: "Hace y Aplica",
                desc: "Como el águila, que vive a grandes alturas, encontramos nuevas perspectivas que ensanchan nuestro horizonte y nos permiten saber las condiciones necesarias para avanzar.",
                img: "/images/progresion/tropa/etapa_aguila.png"
              },
              {
                title: "Etapa Cóndor",
                subtitle: "Enseña y Lidera",
                desc: "Como el cóndor, cuya excelencia le permite aprovechar las corrientes para cruzar valles y montañas, nuestra búsqueda nunca termina en pos de estar siempre listos.",
                img: "/images/progresion/tropa/etapa_condor.png"
              }
            ].map((etapa, idx) => (
              <div key={idx} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-5 space-y-4 flex flex-col items-center text-center shadow-md">
                <div className="w-30 h-30 flex items-center justify-center">
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
              El Reconocimiento y la Bitácora
            </h4>
            <p className="text-[1.02em] leading-relaxed text-zinc-700 dark:text-zinc-300">
              Al finalizar cada ciclo de programa, se evalúan de común acuerdo tus objetivos en la patrulla y con tu dirigente de seguimiento. El logro de cada objetivo personal se reconoce pegando un **sello** de diseño temático en tu Bitácora. Con los timbres de tu Tropa, tu Bitácora adquiere el aspecto de un pasaporte personal de viaje.
            </p>
          </div>
        </div>
      )}

      {/* Contenido de la Pestaña 2: Perfil del Scout */}
      {activeTab === 'perfil' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="flex justify-center border-b border-zinc-200 dark:border-white/10 pb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setProfileTab('desarrollo')}
                className={`px-4 py-2 rounded-xl text-[0.85em] font-black uppercase tracking-wider transition-all duration-300 ${
                  profileTab === 'desarrollo'
                    ? 'text-white shadow-md'
                    : 'bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300'
                }`}
                style={{ backgroundColor: profileTab === 'desarrollo' ? primario : undefined }}
              >
                Desarrollo del Scout (11 a 15 años)
              </button>
              <button
                onClick={() => setProfileTab('egreso')}
                className={`px-4 py-2 rounded-xl text-[0.85em] font-black uppercase tracking-wider transition-all duration-300 ${
                  profileTab === 'egreso'
                    ? 'text-white shadow-md'
                    : 'bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300'
                }`}
                style={{ backgroundColor: profileTab === 'egreso' ? primario : undefined }}
              >
                Perfil de Egreso (A los 20 años)
              </button>
            </div>
          </div>

          {profileTab === 'desarrollo' ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>
                  Un Perfil a Grandes Trazos de la Adolescencia
                </h3>
                <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">
                  El perfil a grandes trazos describe las características reales y comportamientos de los scouts en este período de desarrollo (11 a 15 años), abarcando todos los aspectos de su personalidad:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {[
                  {
                    title: "Un Cuerpo Nuevo",
                    desc: "El cuerpo se renueva y crece a pasos agigantados. En él ocurren cambios que desconciertan y llaman a la exploración. El cansancio es un compañero constante, la torpeza motriz (desgarbo) es habitual y les preocupa enormemente la apariencia física y la aceptación de los demás."
                  },
                  {
                    title: "Ideas Emergentes",
                    desc: "Se expande la mente y aparece la capacidad de pensar en abstracto. Los jóvenes combinan conceptos y reflexionan de forma autónoma. El foco de sus preguntas pasa a ser interno: ¿Quién soy? ¿Cómo me ven los otros? Comienzan a cuestionar los dogmas y verdades previas."
                  },
                  {
                    title: "Valores Propios",
                    desc: "Aparecen dudas éticas e inquietudes sobre lo correcto e incorrecto. Se desarrolla la empatía y la capacidad de situarse en el lugar del otro. Empieza la formulación de una moral propia, dialogada con el grupo de iguales y distante del patrón puramente familiar."
                  },
                  {
                    title: "Emociones Contradictorias",
                    desc: "El mundo afectivo experimenta sentimientos de gran intensidad que cambian de un momento a otro. Domina el 'amar el amor' y el 'odiar el odio'. Ser incondicional con los amigos íntimos y distante con lo que no encaja en su búsqueda de identidad."
                  },
                  {
                    title: "Amigos para la Vida",
                    desc: "El grupo de amigos se vuelve el refugio de confianza absoluta. Las relaciones son intensas y selectivas. Los pares ejercen un rol de validación indispensable para la autoimagen, generando a veces roces o distancia frente a los padres y el hogar."
                  },
                  {
                    title: "Una Fe Personal",
                    desc: "Tránsito progresivo de la religiosidad infantil (heredada de la familia) a una vivencia espiritual propia. Hay una doble actitud: críticas a la institucionalidad y formas de culto externas, pero una sed profunda de encontrar sentido interior y conexión con Dios."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-md space-y-2 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: primario }} />
                    <h4 className="font-extrabold uppercase text-[1.1em] text-zinc-900 dark:text-white pl-2">
                      {item.title}
                    </h4>
                    <p className="text-[0.95em] text-zinc-650 dark:text-zinc-400 leading-relaxed italic pl-2">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>
                  Perfil de Egreso (El Horizonte de la Persona)
                </h3>
                <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">
                  El proyecto educativo del Movimiento Scout propone que cada joven construya de forma autónoma su propio proyecto de vida, orientando su carácter hacia los siguientes ideales:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
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
                  <div key={idx} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-md space-y-2 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: primario }} />
                    <h4 className="font-extrabold uppercase text-[1.1em] text-zinc-900 dark:text-white pl-2">
                      {pilar.title}
                    </h4>
                    <p className="text-[0.95em] text-zinc-650 dark:text-zinc-400 leading-relaxed pl-2">
                      {pilar.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contenido de la Pestaña 3: Objetivos Educativos */}
      {activeTab === 'objetivos' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-4">
            <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>
              Objetivos Educativos (Los desafíos del Scout)
            </h3>
            <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">
              La progresión personal se organiza en seis áreas de desarrollo. En cada una, la Tropa utiliza un símbolo de identidad nacional y local para representar tu crecimiento personal.
            </p>
          </div>

          <div className="space-y-4">
            {areas.map((area) => {
              const areaObjs = getObjectivesByArea(area.id);
              return (
                <div key={area.id} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-2 space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-white/10 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-30 h-30 flex items-center justify-center">
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

      {/* Contenido de la Pestaña 4: Aventuras y Ciclo */}
      {activeTab === 'proyectos' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-4">
            <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>
              Ciclo de Programa y Aventuras de Patrulla
            </h3>
            <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">
              La Tropa es una escuela de democracia y autogobierno donde los muchachos eligen y conducen su programa de actividades a través de ciclos estructurados en 4 fases sucesivas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-4">
              <h4 className="font-extrabold uppercase text-[1.2em] text-zinc-900 dark:text-white" style={{ color: primario }}>
                Las 4 Fases del Ciclo de Programa
              </h4>
              <div className="space-y-4">
                {[
                  { phase: "Fase 1: Propuesta y Selección", desc: "Se inicia tras el diagnóstico del ciclo anterior. Las patrullas proponen ideas y mediante Juegos Democráticos en Asamblea se eligen las actividades comunes." },
                  { phase: "Fase 2: Organización, Diseño y Preparación", desc: "Las actividades se organizan en un calendario flexible de Tropa. Cada patrulla diseña los componentes y prepara los recursos necesarios." },
                  { phase: "Fase 3: Desarrollo y Evaluación de Actividades", desc: "¡La emoción de hacer cosas! Se ejecutan los proyectos, campamentos y dinámicas. Se evalúa el cumplimiento de metas y progresión en 360 grados." },
                  { phase: "Fase 4: Cambio de Ciclo", desc: "Fase de transición: conclusiones de autoevaluación, entrega de reconocimientos, diagnóstico general de la Tropa y fijación de un nuevo Énfasis." }
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
              <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-4">
                <h4 className="font-extrabold uppercase text-[1.2em] text-zinc-900 dark:text-white" style={{ color: primario }}>
                  Los Proyectos de Tropa: DURAS
                </h4>
                <p className="text-[0.98em] text-zinc-650 dark:text-zinc-400 leading-relaxed">
                  Los proyectos (o Aventuras) de Tropa son actividades de mediana o larga duración. Deben cumplir con los criterios <strong>DURAS</strong>:
                </p>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { l: "D", title: "Desafiantes", desc: "Estimulan a superar límites y aprender técnicas scouts avanzadas." },
                    { l: "U", title: "Útiles", desc: "Tienen aplicación práctica en la vida al aire libre o el servicio." },
                    { l: "R", title: "Recompensantes", desc: "Brindan satisfacción grupal e individual al alcanzar la meta." },
                    { l: "A", title: "Atractivas", desc: "Llenas de dinamismo, misterio y aventura en la naturaleza." },
                    { l: "S", title: "Seguras", desc: "Identifican y controlan los riesgos de manera responsable." }
                  ].map((d, i) => (
                    <div key={i} className="flex gap-3 text-[0.88em]">
                      <span className="w-6 h-6 rounded-lg flex items-center justify-center font-black text-white shrink-0 text-[0.85em]" style={{ backgroundColor: primario }}>
                        {d.l}
                      </span>
                      <div className="text-zinc-700 dark:text-zinc-300">
                        <strong>{d.title}:</strong> <span className="text-zinc-550 dark:text-zinc-400">{d.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-4">
                <h4 className="font-extrabold uppercase text-[1.2em] text-zinc-900 dark:text-white" style={{ color: primario }}>
                  Actividades de la Unidad
                </h4>
                <div className="space-y-3 text-[0.95em]">
                  <div className="space-y-1">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 block text-[0.95em]">
                      📌 Actividades Fijas:
                    </span>
                    <p className="text-[0.9em] text-zinc-550 dark:text-zinc-400 leading-relaxed pl-3 border-l-2 border-zinc-200 dark:border-white/10">
                      Rutinas que estructuran el programa: Reuniones de Patrulla y de Tropa, Campamentos y excursiones, juegos scouts de despliegue físico y fogones.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 block text-[0.95em]">
                      🎨 Actividades Variables:
                    </span>
                    <p className="text-[0.9em] text-zinc-550 dark:text-zinc-400 leading-relaxed pl-3 border-l-2 border-zinc-200 dark:border-white/10">
                      Elegidas para el ciclo. Ejemplos: construcciones pioneras, técnicas de supervivencia, safaris fotográficos urbanos, primeros auxilios o iniciativas ecológicas locales.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido de la Pestaña 5: Símbolos */}
      {activeTab === 'mistica' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Promesa y Ley */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-4">
              <span className="text-[0.8em] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/30">
                Compromiso de Honor
              </span>
              <h4 className="font-extrabold uppercase text-[1.3em] text-zinc-900 dark:text-white leading-tight">
                La Promesa Scout
              </h4>
              <p className="text-[1.08em] leading-relaxed text-zinc-700 dark:text-zinc-300 italic pl-4 border-l-2 border-green-600">
                "Por mi honor prometo hacer cuanto de mí dependa para buscar a Dios, amar a mi familia, ayudar a los demás, servir a mi país, trabajar por la paz y vivir la Ley Scout."
              </p>
            </div>

            <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-4">
              <span className="text-[0.8em] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/30">
                Código de Conducta
              </span>
              <h4 className="font-extrabold uppercase text-[1.3em] text-zinc-900 dark:text-white leading-tight">
                La Ley Scout
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[0.92em]">
                {[
                  "1. Es digno de confianza.",
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
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-2 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: primario }} />
              <h4 className="font-extrabold uppercase text-[1.05em] text-zinc-900 dark:text-white pl-2">
                El Color Verde
              </h4>
              <p className="text-[0.88em] text-zinc-650 dark:text-zinc-400 leading-relaxed pl-2">
                Color histórico de la primera rama en crearse. Baden-Powell adoptó el verde del Transvaal en las primeras insignias scouts bordadas en amarillo.
              </p>
            </div>
            <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-2 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: '#fac620' }} />
              <h4 className="font-extrabold uppercase text-[1.05em] text-zinc-900 dark:text-white pl-2">
                La Flor de Lis
              </h4>
              <p className="text-[0.88em] text-zinc-650 dark:text-zinc-400 leading-relaxed pl-2">
                Indica la buena senda en la rosa de los vientos de los antiguos mapas. Recuerda a todo scout mantener su ideal y señalar el norte correcto.
              </p>
            </div>
            <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-2 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: primario }} />
              <h4 className="font-extrabold uppercase text-[1.05em] text-zinc-900 dark:text-white pl-2">
                Saludo Scout
              </h4>
              <p className="text-[0.88em] text-zinc-650 dark:text-zinc-400 leading-relaxed pl-2">
                Dedo pulgar sobre el meñique (el fuerte protege al débil) y tres dedos alzados (las tres partes de la promesa), levantado a la altura del hombro.
              </p>
            </div>
            <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-2 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: '#fac620' }} />
              <h4 className="font-extrabold uppercase text-[1.05em] text-zinc-900 dark:text-white pl-2">
                Buena Acción
              </h4>
              <p className="text-[0.88em] text-zinc-650 dark:text-zinc-400 leading-relaxed pl-2">
                Compromiso diario de servicio tangible y concreto hacia los demás, combatiendo la indiferencia y poniendo de manifiesto al prójimo.
              </p>
            </div>
          </div>

          {/* Logo Oficial de la Tropa */}
          <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row items-center gap-6 mt-4">
            <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: primario }} />
            <div className="w-30 h-30 shrink-0 flex items-center justify-center">
              <img src="/images/logos/iconos_scouts.svg" alt="Logo de Scouts" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="space-y-2">
              <h4 className="font-extrabold uppercase text-[1.25em] text-zinc-900 dark:text-white">
                Insignia Oficial de la Rama Scouts
              </h4>
              <p className="text-[0.95em] text-zinc-650 dark:text-zinc-400 leading-relaxed">
                El emblema oficial de la Rama Scouts muestra la flor de lis que muestra el horizonte al que debe apuntar todo scout, las estrellas representan la ley y la promesa y cada punta de una estrella representa un articulo de la Ley Scout. El lazo que rodea a la flor de liz y el nudo llano representan la hermandad scout en el mundo.
              </p>
            </div>
          </div>

          {/* Oración Scout */}
          <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: '#fac620' }} />
            <h4 className="font-extrabold uppercase text-[1.25em] text-zinc-900 dark:text-white pl-2">
              La Oración Scout
            </h4>
            <p className="italic text-zinc-650 dark:text-zinc-400 leading-relaxed pl-4 border-l-2 border-green-500 max-w-xl text-[1.05em]">
              "Señor,<br />
              enséñanos a ser generosos,<br />
              a servirte como lo mereces,<br />
              a dar sin medida,<br />
              a combatir sin miedo a que nos hieran,<br />
              a trabajar sin descanso<br />
              y a no buscar otra recompensa<br />
              que saber que hacemos Tu voluntad."
            </p>
          </div>

          {/* Himno Scout */}
          <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: primario }} />
            <h4 className="font-extrabold uppercase text-[1.2em] text-zinc-900 dark:text-white pl-2">
              Himno de la Rama: Avanzan las Patrullas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[0.95em] pl-2">
              <div className="space-y-1">
                <span className="font-bold text-zinc-800 dark:text-zinc-200 block text-[0.9em] uppercase tracking-wide">Coro</span>
                <p className="italic text-zinc-650 dark:text-zinc-400 leading-relaxed pl-3 border-l border-zinc-200 dark:border-white/10">
                  Juntos escalemos la montaña altiva,<br />
                  juntos escalemos el picacho azul.<br />
                  Solo los halcones sobre nuestras frentes<br />
                  giran majestuosos en el cielo azul.
                </p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-zinc-800 dark:text-zinc-200 block text-[0.9em] uppercase tracking-wide">Estrofa I</span>
                <p className="italic text-zinc-650 dark:text-zinc-400 leading-relaxed pl-3 border-l border-zinc-200 dark:border-white/10">
                  Avanzan las patrullas,<br />
                  a lo lejos, adelante.<br />
                  Avanzan las patrullas<br />
                  al toque del tambor. ¡Adelante!
                </p>
              </div>
            </div>
          </div>

          {/* Bandera de la Tropa */}
          <div className="relative rounded-[2rem] overflow-hidden border border-zinc-200 dark:border-white/10 bg-zinc-900 shadow-xl" style={{ minHeight: '280px' }}>
            <div className="absolute inset-0 z-0 select-none pointer-events-none opacity-40 dark:opacity-30">
              <img
                src="/images/unidades/bandera_tropa_1.jpg"
                alt="Bandera de la Tropa A'ata"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10 p-8 sm:p-10 flex flex-col justify-end h-full space-y-4 max-w-2xl bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent">
              <span className="text-[0.8em] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30 align-self-start self-start">
                Símbolo de Hermandad
              </span>
              <h4 className="text-[1.5em] font-black uppercase tracking-tight text-white leading-tight">
                La Bandera de la Tropa A'ata
              </h4>
              <p className="text-[1.02em] leading-relaxed text-zinc-200">
                La bandera oficial de la Rama Scouts lleva como fondo el color <strong>verde</strong> y en su centro, en color blanco, el diseño de la <strong>flor de lis</strong> utilizada en la insignia Scout Mundial, uniendo a todos los scouts del mundo.
              </p>
              <p className="text-[1.02em] leading-relaxed text-zinc-200">
                La bandera de la Tropa A'ata esta cargado de simbolos Rapa Nui como hilo conductor del grupo y en especial de la Tropa, en el centro se encuentra el <strong>tangata manu</strong> sosteniendo la espada Escalibur (herencia de una antigua tropa Impessa) que representa la fuerza y el coraje de los scouts, mientras que en las esquinas se encuentran los <strong>Ao</strong> que representan la historia y la cultura de la isla.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contenido de la Pestaña Especialidades */}
      {activeTab === 'especialidades' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-4">
            <h3 className="text-[1.5em] font-black uppercase tracking-tight p-2 rounded-lg" style={{ backgroundColor: primario, color: '#ffffff' }}>
              El Sistema de Especialidades en la Tropa
            </h3>
            <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300 font-semibold">
              Las especialidades son una propuesta educativa complementaria, voluntaria e individual, que invita a los scouts a descubrir sus aptitudes innatas, aprender haciendo y orientar sus talentos hacia el servicio útil de los demás.
            </p>
          </div>

          {/* Principios de las Especialidades */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Aptitudes Innatas",
                desc: "Fomenta y ejercita habilidades sobre una materia de interés del scout, descubriendo aficiones y fortaleciendo su autoestima.",
                icon: "🌟"
              },
              {
                title: "Voluntario y Apoyado",
                desc: "Es enteramente voluntario e individual. El scout cuenta con el apoyo de un monitor o tutor (dirigente, familiar o caminante) que lo orienta.",
                icon: "🤝"
              },
              {
                title: "Objetivos Flexibles",
                desc: "Los objetivos y requisitos se adaptan a las posibilidades reales del scout y su entorno geográfico o social.",
                icon: "🎯"
              },
              {
                title: "Aprender y Servir",
                desc: "Se evalúa mediante acciones prácticas (hacer cosas). El scout aprende para sí mismo y para poner su saber al servicio de los demás.",
                icon: "🎁"
              }
            ].map((principio, idx) => (
              <div key={idx} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-3xl p-2 text-center space-y-2 shadow-sm border-l-4" style={{ borderLeftColor: primario }}>
                <span className="text-6xl text-center p-4">{principio.icon}</span>
                <h5 className="font-extrabold uppercase text-[0.95em] text-zinc-900 dark:text-white">{principio.title}</h5>
                <p className="text-[0.88em] text-zinc-650 dark:text-zinc-400 leading-relaxed font-semibold">{principio.desc}</p>
              </div>
            ))}
          </div>

          {/* Campos de Interés */}
          <div className="space-y-4 pt-4">
            <h4 className="text-[1.25em] font-black uppercase text-zinc-900 dark:text-white">
              Campos de Interés (Especialidades)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {[
                { title: "Deportes y juegos", desc: "Fomenta la actividad física, el juego limpio, el desarrollo psicomotriz y hábitos saludables.", color: "#decf32", icon: "/images/especialidades/deportes.svg" },
                { title: "Vida al Aire Libre", desc: "Técnicas de campismo, cuidado de la naturaleza, cabuyería y exploración del entorno.", color: "#319fd9", icon: "/images/especialidades/aire_libre.svg" },
                { title: "Arte y cultura", desc: "Danza, música, manualidades, actuación y diversas expresiones de creatividad lobata.", color: "#e72a71", icon: "/images/especialidades/arte_expresion.svg" },
                { title: "Ciencias y Tecnología", desc: "Experimentos, informática, astronomía, modelismo y curiosidad científica aplicada.", color: "#ab7cb1", icon: "/images/especialidades/ciencia_tecnologia.svg" },
                { title: "Servicio y Comunidad", desc: "Acciones de solidaridad, primeros auxilios, cuidado animal y apoyo a la comunidad del Pueblo Libre.", color: "#87bd24", icon: "/images/especialidades/servicio_comunidad.svg" },
                { title: "Vida Espiritual", desc: "Reflexión moral, conocimiento de la fe, valores humanos y amor por la creación.", color: "#dcecf4", icon: "/images/especialidades/espiritual.svg" }
              ].map((campo, idx) => (
                <div key={idx} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-2xl py-3 pl-1 pr-3 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all flex gap-2 border-t-[10px]" style={{ borderTopColor: campo.color }}>
                  <img src={campo.icon} alt={campo.title} className="w-20 h-20 object-contain" />
                  <div className="space-y-1">
                    <h5 className="font-extrabold text-[1.1em] text-zinc-950 dark:text-zinc-100 uppercase">{campo.title}</h5>
                    <p className="text-[0.88em] text-zinc-650 dark:text-zinc-400 leading-relaxed font-semibold">{campo.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
