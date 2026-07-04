'use client';

import { useState } from 'react';

interface Objective {
  id: string;
  area_id: number;
  texto_infantil: string;
  texto_terminal: string;
}

interface AvanzadaCustomContentProps {
  objectives: Objective[];
}

export default function AvanzadaCustomContent({ objectives = [] }: AvanzadaCustomContentProps) {
  const [activeTab, setActiveTab] = useState<'camino' | 'perfil' | 'objetivos' | 'competencias' | 'proyectos' | 'mistica'>('camino');
  const [profileTab, setProfileTab] = useState<'desarrollo' | 'egreso'>('desarrollo');

  // Colores de la Avanzada en la Base de Datos: Añil (#4a3f8c) y Secundario (#FFFFFF)
  const primario = '#4a3f8c';
  const secundario = '#FFFFFF';

  const areas = [
    { id: 1, name: "Corporalidad", img: "/images/progresion/avanzada/area_corporalidad.png", color: "#1e90ff", desc: "Desarrollo del cuerpo y cuidado de la salud." },
    { id: 2, name: "Creatividad", img: "/images/progresion/avanzada/area_creatividad.png", color: "#ff8c00", desc: "Estimular el pensamiento, innovar y adquirir habilidades." },
    { id: 3, name: "Carácter", img: "/images/progresion/avanzada/area_caracter.png", color: "#2ed573", desc: "Conocerse a sí mismo, madurez y escala de valores." },
    { id: 4, name: "Afectividad", img: "/images/progresion/avanzada/area_afectividad.png", color: "#ff4757", desc: "Lograr y mantener la madurez y equilibrio emocional." },
    { id: 5, name: "Sociabilidad", img: "/images/progresion/avanzada/area_sociabilidad.png", color: "#a55eea", desc: "Compromiso social y convivencia en comunidad." },
    { id: 6, name: "Espiritualidad", img: "/images/progresion/avanzada/area_espiritualidad.png", color: "#8e44ad", desc: "Búsqueda del sentido trascendente y la fe." }
  ];

  const getObjectivesByArea = (areaId: number) => {
    return objectives.filter(o => o.area_id === areaId);
  };

  const competenciasData = [
    {
      titulo: "Cultura",
      slug: "cultura",
      imagen: "/images/competencias/Cultura.svg",
      color: "#ff8c00",
      desc: "Capacidad de conocer, apreciar y comprender críticamente las diferentes manifestaciones culturales, artísticas y patrimoniales, dotándolas de valor, motivando la participación, contribuyendo a la conservación de estas expresiones y utilizar recursos artísticos y estéticos para la realización de creaciones propias, colaborativas y de aporte a la unidad."
    },
    {
      titulo: "Actividad Física",
      slug: "actividad_fisica",
      imagen: "/images/competencias/ActividadFisica.svg",
      color: "#1e90ff",
      desc: "Consideración de la importancia del autocuidado del cuerpo humano, manteniendo y promoviendo prácticas de vida saludables en las actividades que realiza con la unidad. Motiva, promueve y practica una alimentación saludable y la actividad física entre sus pares."
    },
    {
      titulo: "Trabajo en Equipo",
      slug: "trabajo_equipo",
      imagen: "/images/competencias/TrabajoEnEquipo.svg",
      color: "#22c55e",
      desc: "Capacidad de trabajar en diferentes roles al interior de un equipo para el logro de los objetivos, actividad o proyecto, participación activa, responsable y colaborativa. Desarrolla capacidades de liderazgo, motivación, mediación, escucha activa y trabajo en ambientes multidisciplinarios."
    },
    {
      titulo: "Innovación",
      slug: "innovacion",
      imagen: "/images/competencias/Innovacion.svg",
      color: "#ff4757",
      desc: "Promueve constantemente ideas creativas para el desarrollo de actividades y proyectos. Posee un especial interés en la tecnología y la ciencia, vinculando estos conocimientos con el quehacer de la unidad."
    },
    {
      titulo: "Comunicación",
      slug: "comunicacion",
      imagen: "/images/competencias/Comunicacion.svg",
      color: "#a55eea",
      desc: "Demuestra capacidades de expresión oral y escrita, difusión en un lenguaje adaptable a las condiciones de cada actividad o proyecto de su avanzada. Promueve e incentiva la comunicación entre sus pares por diferentes canales."
    },
    {
      titulo: "Ciudadanía",
      slug: "ciudadania",
      imagen: "/images/competencias/Ciudadania.svg",
      color: "#a855f7",
      desc: "Evidencia una conducta de respeto por la diversidad y multiculturalidad, aceptando las diferencias y aprendiendo de ellas. Defiende y practica los derechos de todas las personas, compromiso ético y social en las actividades realizadas."
    },
    {
      titulo: "Medioambiente",
      slug: "medioambiente",
      imagen: "/images/competencias/MedioAmbiente.svg",
      color: "#10b981",
      desc: "Consideración de las implicancias medioambientales de sus acciones y decisiones en las actividades y proyectos que realiza junto a su unidad. Concibiendo, proponiendo y realizando acciones que permitan minimizar los impactos que producen. Valorización por el medioambiente y la biodiversidad."
    }
  ];

  return (
    <div className="space-y-12">
      {/* Sistema de Pestañas Interactivas */}
      <div className="border-b border-zinc-200 dark:border-white/10 pb-2">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('camino')}
            className={`px-2 py-1 rounded-[0.5rem] text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'camino'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'camino' ? primario : undefined }}
          >
            El Camino
          </button>
          <button
            onClick={() => setActiveTab('perfil')}
            className={`px-2 py-1 rounded-[0.5rem] text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'perfil'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'perfil' ? primario : undefined }}
          >
            Perfil de la Rama
          </button>
          <button
            onClick={() => setActiveTab('objetivos')}
            className={`px-2 py-1 rounded-[0.5rem] text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'objetivos'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'objetivos' ? primario : undefined }}
          >
            Objetivos Educativos
          </button>
          <button
            onClick={() => setActiveTab('competencias')}
            className={`px-2 py-1 rounded-[0.5rem] text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'competencias'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'competencias' ? primario : undefined }}
          >
            Competencias
          </button>
          <button
            onClick={() => setActiveTab('proyectos')}
            className={`px-2 py-1 rounded-[0.5rem] text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'proyectos'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'proyectos' ? primario : undefined }}
          >
            Aventuras y Ciclo
          </button>
          <button
            onClick={() => setActiveTab('mistica')}
            className={`px-2 py-1 rounded-[0.5rem] text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
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

      {/* Pestaña 1: El Camino del Pionero */}
      {activeTab === 'camino' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-4">
            <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>
              La Ruta de Progresión en la Avanzada
            </h3>
            <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300 font-semibold">
              El paso por la Comunidad de Pioneros comprende la entrega de la insignia Cruz del Sur al integrarse a la Rama, y el desarrollo de las etapas de progresión personal Sendero y Cumbre:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-4">
            {[
              {
                title: "Cruz del Sur",
                badgeName: "Insignia de Bienvenida e Ingreso",
                desc: "Es la insignia de pertenencia a la rama Pioneros, y acompaña a las y los jóvenes durante su paso por la unidad. Representa una constante que orienta a las pioneras y pioneros en la búsqueda y elección de su Sendero, para alcanzar la Cumbre y proyectarse hacia adelante. Esta insignia se utiliza en el brazo izquierdo, por sobre la insignia de progresión.",
                img: "/images/progresion/avanzada/etapa_bienvenida.png"
              },
              {
                title: "Sendero",
                badgeName: "Etapa de Progresión",
                desc: "Corresponde a las pioneras o pioneros que comienzan a trabajar con los objetivos educativos de esta Rama, establece el primer acercamiento a estos y se los plantea como un desafío. Aplica en general para las y los jóvenes que provienen de las Ramas Guía o Scout, pues corresponde a la continuación de la malla de objetivos o bien aquellos que tienen entre 14 y 15 años. El Sendero es la oportunidad de las y los jóvenes para explorar y elegir sus caminos de manera individual, pero apoyados siempre por su grupo de amigas y amigos.",
                img: "/images/progresion/avanzada/etapa_sendero.png"
              },
              {
                title: "Cumbre",
                badgeName: "Etapa de Progresión",
                desc: "Corresponde a los jóvenes que han alcanzado al menos la mitad de los objetivos educativos propuestos para la Rama. Esto puede lograrse en la vivencia de la etapa anterior o bien antes del ingreso a la Avanzada a partir de su desarrollo y crecimiento personal, especialmente cuando tiene entre 16 y 17 años. La Cumbre es el lugar desde donde las y los jóvenes pueden mirar hacia atrás para ver los diferentes caminos que han tomado para llegar hasta ahí y proyectarse hacia el futuro con una visión más amplia.",
                img: "/images/progresion/avanzada/etapa_cumbre.png"
              }
            ].map((etapa, idx) => (
              <div key={idx} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-3xl p-6 space-y-4 flex flex-col items-center text-center shadow-md border-t-[5px]" style={{ borderTopColor: primario }}>
                <div className="w-30 h-30 flex items-center justify-center">
                  <img src={etapa.img} alt={etapa.title} className="max-w-full max-h-full object-contain" />
                </div>
                <div>
                  <h4 className="font-extrabold uppercase text-[1.25em] text-zinc-900 dark:text-white leading-none">
                    {etapa.title}
                  </h4>
                  <span className="text-[0.8em] font-bold uppercase tracking-wider block mt-1" style={{ color: primario }}>
                    {etapa.badgeName}
                  </span>
                  <p className="text-[0.88em] text-zinc-650 dark:text-zinc-400 mt-3 leading-relaxed font-semibold">
                    {etapa.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pestaña 2: Perfil de la Rama */}
      {activeTab === 'perfil' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Sub-navegación de Perfiles */}
          <div className="flex gap-2 border-b border-zinc-200 dark:border-white/10 pb-2">
            <button
              onClick={() => setProfileTab('desarrollo')}
              className={`px-3 py-1 rounded-lg text-[0.85em] font-extrabold uppercase tracking-wider transition-all ${
                profileTab === 'desarrollo'
                  ? 'text-white'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
              style={{ backgroundColor: profileTab === 'desarrollo' ? primario : undefined }}
            >
              Desarrollo (15 a 17 años)
            </button>
            <button
              onClick={() => setProfileTab('egreso')}
              className={`px-3 py-1 rounded-lg text-[0.85em] font-extrabold uppercase tracking-wider transition-all ${
                profileTab === 'egreso'
                  ? 'text-white'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
              style={{ backgroundColor: profileTab === 'egreso' ? primario : undefined }}
            >
              Perfil de Egreso
            </button>
          </div>

          {profileTab === 'desarrollo' ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>
                  El Pionero y la Pionera a Grandes Trazos
                </h3>
                <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300 font-semibold">
                  La adolescencia media (15 a 17 años) es la etapa clave de desarrollo donde el joven transita desde la dependencia familiar a la autonomía. Sus rasgos principales en las seis dimensiones del crecimiento son:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    titulo: "El Cuerpo (Corporalidad)",
                    img: "/images/progresion/avanzada/area_corporalidad.png",
                    desc: "Aceptación de los marcados cambios físicos y consolidación de la autoimagen corporal. Desarrollo de hábitos de higiene, autocuidado y toma de responsabilidad en la salud y nutrición."
                  },
                  {
                    titulo: "La Inteligencia (Creatividad)",
                    img: "/images/progresion/avanzada/area_creatividad.png",
                    desc: "Adquisición del pensamiento abstracto e hipotético-deductivo completo. Habilidad para analizar problemáticas complejas, formular teorías alternativas y llevar a cabo soluciones tecnológicas e innovadoras."
                  },
                  {
                    titulo: "La Voluntad (Carácter)",
                    img: "/images/progresion/avanzada/area_caracter.png",
                    desc: "Inicio de la conformación de la identidad personal y moral. Adecuación progresiva del comportamiento a una escala de valores propios y conscientemente aceptados, superando la presión del grupo."
                  },
                  {
                    titulo: "Los Afectos (Afectividad)",
                    img: "/images/progresion/avanzada/area_afectividad.png",
                    desc: "Alcanzar progresivamente la madurez y la identidad de género. Búsqueda de relaciones afectivas auténticas y simétricas, y experimentación de estabilidad y control emocional ante conflictos cotidianos."
                  },
                  {
                    titulo: "La Integración Social (Sociabilidad)",
                    img: "/images/progresion/avanzada/area_sociabilidad.png",
                    desc: "Construcción de la identidad vocacional y proyección laboral. Búsqueda de amigos afines, conformando grupos de pertenencia por libre acuerdo, y compromiso real en servicios hacia la comunidad civil."
                  },
                  {
                    titulo: "Sentido de la Existencia (Espiritualidad)",
                    img: "/images/progresion/avanzada/area_espiritualidad.png",
                    desc: "Transición gradual desde la fe tradicional familiar e infantil a una vivencia de fe personal e internalizada. Búsqueda de trascendencia religiosa o no religiosa basada en convicciones íntimas."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-3xl py-2 pl-1 pr-2 shadow-sm hover:shadow-md flex gap-4 border-l-[6px]" style={{ borderLeftColor: primario }}>
                    <div className="w-20 h-20 shrink-0 flex items-center justify-center">
                      <img src={item.img} alt={item.titulo} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-[1.1em] text-zinc-950 dark:text-zinc-100 uppercase leading-snug">{item.titulo}</h4>
                      <p className="text-[0.9em] text-zinc-650 dark:text-zinc-400 leading-relaxed font-semibold">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>
                  Perfil de Egreso
                </h3>
                <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300 font-semibold">
                  Las personas que compartimos en los Movimientos Guía y Scout aspiramos a hacer todo lo que de nosotros dependa para ser:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Una persona íntegra y libre",
                    desc: "Limpia de pensamiento y recta de corazón, de voluntad fuerte, responsable de sí misma, que ha optado por un proyecto personal de vida y que, fiel a la palabra dada, es lo que dice ser."
                  },
                  {
                    title: "Una persona servidora",
                    desc: "Solidaria con su comunidad, defensora de los derechos de los otros, comprometida con la democracia, integrada al desarrollo, amante de la justicia, promotora de la paz, que valora el trabajo humano y construye su familia en el amor."
                  },
                  {
                    title: "Una persona creativa",
                    desc: "Que se esfuerza por dejar el mundo mejor de como lo encontró, comprometida con la integridad de la naturaleza, interesada por aprender continuamente, en búsqueda de pistas aún no exploradas, libre del afán de poseer."
                  },
                  {
                    title: "Una persona espiritual",
                    desc: "Con un sentido trascendente para su vida, que camina al encuentro con su felicidad, que vive alegremente su fe y la integra a su conducta y que, abierta al diálogo y a la comprensión, respeta las opciones de los demás."
                  }
                ].map((perfil, i) => (
                  <div key={i} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-3xl p-5 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: primario }} />
                    <h4 className="font-extrabold text-[1.1em] text-zinc-900 dark:text-white uppercase mb-2">{perfil.title}</h4>
                    <p className="text-[0.9em] text-zinc-650 dark:text-zinc-400 leading-relaxed font-semibold">{perfil.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pestaña 3: Objetivos Educativos */}
      {activeTab === 'objetivos' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-4">
            <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>
              Objetivos Educativos en la Avanzada
            </h3>
            <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300 font-semibold">
              La progresión personal en la Avanzada se organiza en seis áreas de desarrollo. A través de ellas, los pioneros se proponen metas concretas para crecer de forma integral, adaptadas a su rango de edad y madurez.
            </p>
          </div>

          <div className="space-y-4">
            {areas.map((area) => {
              const areaObjs = getObjectivesByArea(area.id);
              return (
                <div key={area.id} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-2 space-y-4 shadow-sm relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-white/10 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-26 h-26 shrink-0 flex items-center justify-center">
                        <img src={area.img} alt={area.name} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div>
                        <h4 className="font-extrabold uppercase text-[1.25em] text-zinc-900 dark:text-white flex items-center gap-2">
                          {area.name}
                        </h4>
                        <p className="text-[0.85em] text-zinc-550 dark:text-zinc-400 leading-snug">
                          {area.desc}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Lista de Objetivos de la base de datos */}
                  <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {areaObjs.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {areaObjs.map((obj) => (
                          <div key={obj.id} className="bg-zinc-50 dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-2xl p-4 flex gap-3 items-start hover:border-zinc-300 dark:hover:border-white/20 transition-colors">
                            <span className="font-bold text-[1.1em] mt-0.5" style={{ color: primario }}>•</span>
                            <div className="space-y-1">
                              <span className="font-bold text-zinc-800 dark:text-zinc-200 block text-[0.98em]">
                                {obj.texto_infantil}
                              </span>
                              {obj.texto_terminal && (
                                <p className="text-[0.85em] text-zinc-500 dark:text-zinc-400 leading-snug">
                                  Meta terminal: {obj.texto_terminal}
                                </p>
                              )}
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

      {/* Pestaña 4: El Sistema de Competencias */}
      {activeTab === 'competencias' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-4">
            <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>
              Las Competencias en las Pioneras y Pioneros
            </h3>
            <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300 font-semibold">
              Las Competencias en nuestra Rama las entendemos como atributos subyacentes de una persona (que están detrás de nuestro comportamiento), naturales o adquiridos, que posibilitan una actuación efectiva en el desempeño de alguna tarea, actividad o proyecto. La adquisición de competencias, como complemento a la progresión personal reemplaza en la Rama Pioneras y Pioneros a las especialidades de la Tropa y la Compañía.
            </p>
            
            {/* Características del Sistema */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-2xl p-5 space-y-2 border-l-4" style={{ borderLeftColor: primario }}>
                <span className="text-2xl">🌱</span>
                <h5 className="font-extrabold uppercase text-[0.95em] text-zinc-900 dark:text-white">Ligadas a Actividades</h5>
                <p className="text-[0.88em] text-zinc-650 dark:text-zinc-400 leading-relaxed font-semibold">Las Competencias están ligadas a las actividades y proyectos, son menos periféricas al programa de actividades que desarrollan, pues su adquisición surge como una necesidad de lo que ocurre.</p>
              </div>
              <div className="bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-2xl p-5 space-y-2 border-l-4" style={{ borderLeftColor: primario }}>
                <span className="text-2xl">🎯</span>
                <h5 className="font-extrabold uppercase text-[0.95em] text-zinc-900 dark:text-white">Habilitación para el Desempeño</h5>
                <p className="text-[0.88em] text-zinc-650 dark:text-zinc-400 leading-relaxed font-semibold">Durante la Tropa y la Compañía, una especialidad podría ser perfectamente un pasatiempo, lo que no ocurre en la Avanzada, pues la Competencia es la habilitación para el desempeño y la vida adulta.</p>
              </div>
              <div className="bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-2xl p-5 space-y-2 border-l-4" style={{ borderLeftColor: primario }}>
                <span className="text-2xl">🤝</span>
                <h5 className="font-extrabold uppercase text-[0.95em] text-zinc-900 dark:text-white">Proceso Orgánico</h5>
                <p className="text-[0.88em] text-zinc-650 dark:text-zinc-400 leading-relaxed font-semibold">Surgen a partir del ciclo y proyectos, no existe una "inscripción", sino de un proceso donde sus pares, animadores o el propio joven reconocen la motivación y capacidad adicional.</p>
              </div>
            </div>
          </div>

          {/* Grilla de los 7 Rumbos o Áreas de Competencias */}
          <div className="space-y-4 pt-4">
            <h4 className="text-[1.25em] font-black uppercase text-zinc-900 dark:text-white">
              Los 7 Rumbos de las Competencias
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {competenciasData.map((comp, idx) => (
                <div key={idx} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-3xl p-6 shadow-md flex gap-4 hover:shadow-lg transition-shadow relative overflow-hidden border-t-[5px]" style={{ borderTopColor: comp.color }}>
                  <div className="w-26 h-26 flex-shrink-0 flex items-center justify-center" style={{ borderColor: `${comp.color}40` }}>
                    <img src={comp.imagen} alt={comp.titulo} className="w-full h-full object-contain" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-extrabold text-[1.1em] text-zinc-950 dark:text-zinc-100 uppercase">{comp.titulo}</h5>
                    <p className="text-[0.88em] text-zinc-650 dark:text-zinc-400 leading-relaxed font-semibold">{comp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pestaña 5: Aventuras y Ciclo */}
      {activeTab === 'proyectos' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-4">
            <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>
              Las Aventuras de la Avanzada
            </h3>
            <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300 font-semibold">
              En la Avanzada de Pioneros, el método de proyectos toma el nombre de **"Aventura"**. A través de la Aventura, la Comunidad planifica, prepara y ejecuta iniciativas significativas que desafían su intelecto, destrezas de vida al aire libre y compromiso social.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {/* Comunidades y Grupos de Trabajo */}
            <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-lg space-y-4 relative overflow-hidden border-l-[6px]" style={{ borderLeftColor: primario }}>
              <h4 className="text-[1.25em] font-black uppercase text-zinc-900 dark:text-white">
                Comunidades y Grupos de Trabajo
              </h4>
              <div className="space-y-4 text-[0.9em] text-zinc-650 dark:text-zinc-400 leading-relaxed font-semibold">
                <p>
                  El funcionamiento interno de la Avanzada es flexible. Para dar apoyo afectivo y socialización, los jóvenes se agrupan por afinidad en **Comunidades** de carácter estable.
                </p>
                <p>
                  Sin embargo, para planificar y ejecutar la mayoría de los proyectos y tareas concretas, los pioneros se organizan de forma dinámica en **Grupos de Trabajo** adaptados al tamaño y complejidad de la tarea o Aventura. Esta dualidad enseña a convivir en armonía y responder eficientemente ante desafíos.
                </p>
              </div>
            </div>

            {/* Ciclo de Aventura */}
            <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-lg space-y-4 relative overflow-hidden border-l-[6px]" style={{ borderLeftColor: primario }}>
              <h4 className="text-[1.25em] font-black uppercase text-zinc-900 dark:text-white">
                Las 5 Fases del Ciclo de Aventura
              </h4>
              <div className="space-y-3">
                {[
                  { name: "Planificación", desc: "Se proponen ideas, se debaten y la Comunidad elige democráticamente su Aventura." },
                  { name: "Preparación", desc: "Se arman los Grupos de Trabajo y los pioneros se capacitan e investigan los recursos." },
                  { name: "Ejecución", desc: "Se vive el proyecto principal en el terreno (excursión, campamento, intervención comunitaria)." },
                  { name: "Evaluación", desc: "Reunión de análisis para diagnosticar los aciertos, dificultades y evaluar objetivos." },
                  { name: "Celebración", desc: "Fiesta y reconocimiento de las competencias y etapas alcanzadas." }
                ].map((fase, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="font-black text-[0.9em]" style={{ color: primario }}>0{i+1}.</span>
                    <div>
                      <h5 className="font-extrabold uppercase text-[0.9em] text-zinc-900 dark:text-zinc-200 leading-tight">{fase.name}</h5>
                      <p className="text-[0.85em] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug font-semibold">{fase.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pestaña 6: Mística y Símbolos */}
      {activeTab === 'mistica' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-4">
            <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>
              Identidad en la Avanzada
            </h3>
            <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300 font-semibold">
              El Marco Simbólico se resume en la consigna **"Vivir mi propia aventura"**. A través de ella, los pioneros se conciben como exploradores activos que diseñan su rumbo, superan obstáculos y se abren paso en el mundo real.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            {/* Columna Izquierda: Promesa de la Avanzada */}
            <div className="md:col-span-7 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-lg space-y-4 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: primario }} />
              <div className="space-y-4">
                <h4 className="text-[1.25em] font-black uppercase text-zinc-900 dark:text-white pl-2">
                  La Promesa del Pionero
                </h4>
                
                <blockquote className="bg-zinc-50 dark:bg-white/5 p-5 rounded-2xl border-l-4 italic text-[1.02em] text-zinc-700 dark:text-zinc-200 pl-4 font-medium leading-relaxed" style={{ borderLeftColor: primario }}>
                  "Ante ustedes hermanos de la Avanzada asumo mi ideal y elijo el camino de los hombres libres que entregaron su vida al servicio de los demás. Si avanzo, que los Pioneros me sigan, si tropiezo, que la Avanzada me ayude. Y si mi vida sirve a la causa del amor, Que Dios y las personas me acojan. Por mi Honor prometo hacer cuanto de mi dependa para buscar a Dios, amar a mi familia, ayudar a los demás, servir a mi país, trabajar por la paz y vivir la Ley."
                </blockquote>

                <div className="space-y-2 pl-2">
                  <h5 className="font-extrabold text-[0.95em] uppercase text-zinc-800 dark:text-zinc-350">La Ley Guía-Scout:</h5>
                  <p className="text-[0.9em] text-zinc-500 dark:text-zinc-400 leading-relaxed font-semibold">
                    Los valores de la Ley Guía y Scout se proponen en diez artículos reflexivos que invitan a vivir en coherencia cotidiana:
                  </p>
                  <ul className="grid grid-cols-1 gap-2 text-[0.88em] text-zinc-750 dark:text-zinc-350 font-bold mt-2 pl-2 list-decimal font-body">
                    <li><strong>Es una persona digna de confianza:</strong> Sus actos y palabras son coherentes con su vida interior. Todo su honor reside en ser fiel a su palabra.</li>
                    <li><strong>Es leal:</strong> Persistencia de nuestras convicciones en aquello que consideramos importante y con los valores comunes.</li>
                    <li><strong>Sirve sin esperar recompensa:</strong> Mirar con cuidado y respeto al ser humano, poniéndose libremente a disposición de los demás.</li>
                    <li><strong>Es alegre y cordial:</strong> Actitud permanente que contagia entusiasmo, acoge al otro y es fuerza de paz sin violencia.</li>
                    <li><strong>Comparte con todos:</strong> Actitud abierta hacia las demás personas, sus formas de ver el mundo y practicar el desprendimiento.</li>
                    <li><strong>Protege la vida y la naturaleza:</strong> Respetar y potenciar al ser humano en su dignidad intrínseca y preservar el medio ambiente.</li>
                    <li><strong>Es responsable y nada hace a medias:</strong> Capacidad de compromiso, de actuar en consecuencia y cumplir las tareas asumidas.</li>
                    <li><strong>Cuida las cosas y valora el trabajo:</strong> Valora el esfuerzo humano que permite progresar y cuida las obras de ese esfuerzo.</li>
                    <li><strong>Es optimista:</strong> Escudo contra el temor que refuerza la curiosidad por lo incierto, arriesga y busca aventuras.</li>
                    <li><strong>Es coherente en su pensamiento, palabra y acción:</strong> Rectitud de corazón y rectitud de conciencia, oponiéndose a simular o actuar por cumplir.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Lema e Identidad */}
            <div className="md:col-span-5 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-lg space-y-4 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: primario }} />
              <div className="space-y-4">
                <h4 className="text-[1.25em] font-black uppercase text-zinc-900 dark:text-white pl-2">
                  El Lema de Avanzada
                </h4>
                <div className="p-5 bg-zinc-50 dark:bg-white/5 rounded-2xl border border-zinc-150 dark:border-white/5 text-center space-y-2">
                  <span className="text-[2em] font-black uppercase tracking-wider block" style={{ color: primario }}>
                    "Siempre Adelante!"
                  </span>
                  <p className="text-[0.9em] text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">
                    Es un recordatorio a la superación, al crecimiento personal y la perseverancia. Es un recuerdo del compromiso que adquirieron con la Ley Guía y Scout.
                  </p>
                </div>

                <div className="space-y-2 pl-2">
                  <h5 className="font-extrabold text-[0.95em] uppercase text-zinc-800 dark:text-zinc-350">Color Oficial:</h5>
                  <div className="flex gap-4 items-center mt-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full border shadow-sm block" style={{ backgroundColor: primario }} />
                      <span className="text-[0.88em] font-extrabold text-zinc-700 dark:text-zinc-300">Añil (Jiquilite)</span>
                    </div>
                  </div>
                  <p className="text-[0.88em] text-zinc-550 dark:text-zinc-400 leading-relaxed font-semibold mt-2">
                    El **color Añil** se obtiene del arbusto Jiquilite. Es una unión de la energía del rojo y de la espiritualidad del azul que sugiere la energía orientada al servicio útil y desinteresado.
                  </p>
                </div>

                <div className="space-y-2 pl-2 pt-2 border-t border-zinc-150 dark:border-white/10">
                  <h5 className="font-extrabold text-[0.95em] uppercase text-zinc-850 dark:text-zinc-300">Oración de la Avanzada:</h5>
                  <p className="text-[1em] italic text-zinc-600 dark:text-zinc-350 leading-relaxed font-semibold">
                    "Señor ayúdame a encontrar la fortaleza del bosque para que ningún triunfo me envanezca, La alegría de la mañana para que ninguna soledad me abata, La libertad del ave para elegir mi camino, Y la voluntad del Pionero para seguir siempre adelante y servir. Así sea."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Símbolos Físicos de Avanzada */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-3xl p-5 shadow-sm space-y-2 relative overflow-hidden border-t-4" style={{ borderTopColor: primario }}>
              <h5 className="font-extrabold uppercase text-[1.05em] text-zinc-950 dark:text-white">Nuestro Emblema</h5>
              <p className="text-[0.88em] text-zinc-650 dark:text-zinc-450 leading-relaxed font-semibold">
                La flor de Lis y el Trébol se unen de manera estilizada para representar la unidad y el trabajo conjunto de hombres y mujeres, orientados por la Cruz del Sur que señala la buena senda a seguir.
              </p>
            </div>

            <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-3xl p-5 shadow-sm space-y-2 relative overflow-hidden border-t-4" style={{ borderTopColor: primario }}>
              <h5 className="font-extrabold uppercase text-[1.05em] text-zinc-950 dark:text-white">El Cayado</h5>
              <p className="text-[0.88em] text-zinc-650 dark:text-zinc-450 leading-relaxed font-semibold">
                Vara terminada en dos puntas en un extremo. Refuerza el concept de responsabilidad ante las encrucijadas y elecciones de caminos que se presentan en la vida, desafiando a decidir sin mirar atrás.
              </p>
            </div>

            <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-3xl p-5 shadow-sm space-y-2 relative overflow-hidden border-t-4" style={{ borderTopColor: primario }}>
              <h5 className="font-extrabold uppercase text-[1.05em] text-zinc-950 dark:text-white">El Refugio</h5>
              <p className="text-[0.88em] text-zinc-650 dark:text-zinc-450 leading-relaxed font-semibold">
                Denominación del punto de reunión de la Avanzada. Es concebido como un espacio seguro y protector (análogo a los de montañismo) donde los jóvenes comparten ideas, se resguardan y se proyectan plenamente.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
            <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-3xl p-5 shadow-sm flex gap-4 items-center border-l-4" style={{ borderLeftColor: primario }}>
              <div className="w-30 h-30 shrink-0 flex items-center justify-center">
                <img src="/images/progresion/avanzada/etapa_bienvenida.png" alt="Logo de Avanzada" className="max-w-full max-h-full object-contain" />
              </div>
              <div className="space-y-1">
                <h5 className="font-extrabold uppercase text-[1.05em] text-zinc-950 dark:text-white">Insignia Cruz del Sur</h5>
                <p className="text-[0.85em] text-zinc-600 dark:text-zinc-400 leading-normal font-semibold">
                  Insignia de pertenencia que acompaña al joven durante todo su paso por la Avanzada y orienta en la búsqueda de su Sendero.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-3xl p-5 shadow-sm flex gap-4 items-center border-l-4" style={{ borderLeftColor: primario }}>
              <div className="text-6xl shrink-0">📖</div>
              <div className="space-y-1">
                <h5 className="font-extrabold uppercase text-[1.05em] text-zinc-950 dark:text-white">La Bitácora</h5>
                <p className="text-[0.85em] text-zinc-600 dark:text-zinc-400 leading-normal font-semibold">
                  Libro simple de acuerdos de la Asamblea que recoge el testimonio y la historia de la Avanzada, manteniendo su identidad única.
                </p>
              </div>
            </div>
          </div>

          {/* Bandera de la Avanzada (Full Width con imagen de fondo) */}
          <div 
            className="rounded-3xl overflow-hidden shadow-xl border border-zinc-200 dark:border-white/10 relative min-h-[300px] flex items-center group mt-8"
            style={{
              backgroundImage: "url('/images/unidades/bandera_avanzada_1.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/80 to-zinc-950/40 z-0 transition-opacity group-hover:opacity-95" />
            
            <div className="relative z-10 p-8 md:p-12 space-y-4 max-w-3xl text-white">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-8 rounded-full inline-block" style={{ backgroundColor: primario }} />
                <h4 className="text-[1.5em] font-black uppercase tracking-tight text-white">
                  La Bandera de la Avanzada
                </h4>
              </div>
              <div className="space-y-4 text-[0.98em] text-zinc-200 leading-relaxed font-semibold">
                <p>
                  La Bandera reúne el color y los símbolos que nos identifican: la flor de Lis y el trébol que se mezclan y conjugan, acompañados y orientados por la Cruz del Sur.
                </p>
                <p>
                  Es la insignia comunitaria que encarna el espíritu de los pioneros que marchan "Siempre Adelante!" abriendo nuevas sendas y asumiendo desafíos de liderazgo.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
