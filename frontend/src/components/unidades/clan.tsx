'use client';

import { useState } from 'react';

interface Objective {
  id: string;
  area_id: number;
  texto_terminal: string;
}

interface ClanCustomContentProps {
  objectives: Objective[];
}

export default function ClanCustomContent({ objectives = [] }: ClanCustomContentProps) {
  const [activeTab, setActiveTab] = useState<'camino' | 'perfil' | 'objetivos' | 'proyectos' | 'mistica'>('camino');

  // Colores del Clan: Rojo (#e32328) y Amarillo (#fac620)
  const primario = '#e32328';
  const secundario = '#fac620';

  const areas = [
    { id: 1, name: "Corporalidad", img: "/images/progresion/clan/area_corporalidad.png", color: "#1e90ff", desc: "Desarrollo del cuerpo y cuidado de la salud." },
    { id: 2, name: "Creatividad", img: "/images/progresion/clan/area_creatividad.png", color: "#ff8c00", desc: "Estimular el pensamiento, innovar y adquirir habilidades." },
    { id: 3, name: "Carácter", img: "/images/progresion/clan/area_caracter.png", color: "#2ed573", desc: "Conocerse a sí mismo, madurez y escala de valores." },
    { id: 4, name: "Afectividad", img: "/images/progresion/clan/area_afectividad.png", color: "#ff4757", desc: "Lograr y mantener la madurez y equilibrio emocional." },
    { id: 5, name: "Sociabilidad", img: "/images/progresion/clan/area_sociabilidad.png", color: "#a55eea", desc: "Compromiso social y convivencia en comunidad." },
    { id: 6, name: "Espiritualidad", img: "/images/progresion/clan/area_espiritualidad.png", color: "#8e44ad", desc: "Búsqueda del sentido trascendente y la fe." }
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
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'camino' ? primario : undefined }}
          >
            El Camino del Caminante
          </button>
          <button
            onClick={() => setActiveTab('perfil')}
            className={`px-5 py-2.5 rounded-2xl text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'perfil'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'perfil' ? primario : undefined }}
          >
            Perfil de Egreso
          </button>
          <button
            onClick={() => setActiveTab('objetivos')}
            className={`px-5 py-2.5 rounded-2xl text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'objetivos'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'objetivos' ? primario : undefined }}
          >
            Objetivos Terminales
          </button>
          <button
            onClick={() => setActiveTab('proyectos')}
            className={`px-5 py-2.5 rounded-2xl text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'proyectos'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'proyectos' ? primario : undefined }}
          >
            Servicio y Proyectos
          </button>
          <button
            onClick={() => setActiveTab('mistica')}
            className={`px-5 py-2.5 rounded-2xl text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'mistica'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'mistica' ? primario : undefined }}
          >
            Mística y Horqueta
          </button>
        </div>
      </div>

      {/* Contenido de la Pestaña 1: El Camino del Caminante */}
      {activeTab === 'camino' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-4">
            <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>
              La Ruta de Progresión Personal
            </h3>
            <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">
              En el Clan Ahu Akivi, el caminante vive una progresión basada en la autonomía y la madurez. A través de hitos personales y proyectos colectivos, cada joven forja su carácter de cara al egreso del movimiento scout.
            </p>
          </div>

          {/* Línea de Tiempo de Progresión */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 pt-4">
            {[
              {
                title: "Bienvenida",
                desc: "Iniciación en el Clan. El caminante descubre la mística del servicio y se integra a la comunidad.",
                img: "/images/progresion/clan/etapa_bienvenida.png"
              },
              {
                title: "Etapa Fuego",
                desc: "El caminante enciende su compromiso, definiendo sus primeros objetivos y participando en proyectos.",
                img: "/images/progresion/clan/etapa_fuego.png"
              },
              {
                title: "Etapa Antorcha",
                desc: "Liderazgo y madurez. El caminante guía a otros y se convierte en referente de servicio social.",
                img: "/images/progresion/clan/etapa_antorcha.png"
              },
              {
                title: "La Partida",
                desc: "El hito terminal. El rover egresa del grupo listo para remar su propia canoa en la sociedad civil.",
                img: "/images/progresion/clan/etapa_partida.png"
              }
            ].map((etapa, idx) => (
              <div key={idx} className="bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-5 space-y-4 flex flex-col items-center text-center shadow-md">
                <div className="w-24 h-24 flex items-center justify-center bg-zinc-50 dark:bg-white/5 rounded-2xl p-2">
                  <img src={etapa.img} alt={etapa.title} className="max-w-full max-h-full object-contain" />
                </div>
                <div>
                  <h4 className="font-extrabold uppercase text-[1.1em] text-zinc-900 dark:text-white" style={{ color: idx === 3 ? secundario : undefined }}>
                    {etapa.title}
                  </h4>
                  <p className="text-[0.9em] text-zinc-650 dark:text-zinc-400 mt-2 leading-relaxed">
                    {etapa.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contenido de la Pestaña 2: Perfil de Egreso */}
      {activeTab === 'perfil' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-6">
            <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>
              Perfil de Egreso del Caminante
            </h3>
            <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
              <p className="text-[1.05em] leading-relaxed font-bold">
                A continuación, te presentamos el perfil de egreso de nuestra asociación, para leer y analizar junto a tu equipo y clan.
              </p>
              <p className="text-[1.05em] leading-relaxed">
                Las personas que compartimos en los Movimientos Guía y Scout, aspiramos a hacer todo lo que de nosotros dependa para ser:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-md space-y-3">
                  <span className="bg-clr7/15 dark:bg-clr7/20 text-clr7 px-3 py-1 rounded-[0.5rem] text-[0.95em] font-extrabold uppercase tracking-wide inline-block" style={{ color: primario }}>
                    Una persona íntegra y libre
                  </span>
                  <p className="text-[1.02em] leading-relaxed italic text-zinc-600 dark:text-zinc-300">
                    Limpia de pensamiento y recta de corazón,<br />
                    de voluntad fuerte, responsable de sí misma,<br />
                    que ha optado por un proyecto personal de vida<br />
                    y que, fiel a la palabra dada, es lo que dice ser.
                  </p>
                </div>

                <div className="bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-md space-y-3">
                  <span className="bg-clr7/15 dark:bg-clr7/20 text-clr7 px-3 py-1 rounded-[0.5rem] text-[0.95em] font-extrabold uppercase tracking-wide inline-block" style={{ color: primario }}>
                    Una persona al servicio de los demás
                  </span>
                  <p className="text-[1.02em] leading-relaxed italic text-zinc-600 dark:text-zinc-300">
                    Solidaria con su comunidad, defensora de los derechos de los otros,<br />
                    comprometida con la democracia, integrada al desarrollo,<br />
                    amante de la justicia, promotora de la paz, que valora el trabajo humano,<br />
                    que construye su familia en el amor,<br />
                    que reconoce su dignidad y la del sexo complementario<br />
                    y que, alegre y afectuosa, comparte con todos.
                  </p>
                </div>

                <div className="bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-md space-y-3">
                  <span className="bg-clr7/15 dark:bg-clr7/20 text-clr7 px-3 py-1 rounded-[0.5rem] text-[0.95em] font-extrabold uppercase tracking-wide inline-block" style={{ color: primario }}>
                    Una persona creativa
                  </span>
                  <p className="text-[1.02em] leading-relaxed italic text-zinc-600 dark:text-zinc-300">
                    Que se esfuerza por dejar el mundo mejor de como lo encontró,<br />
                    comprometida con la integridad de la naturaleza,<br />
                    interesada por aprender continuamente,<br />
                    en búsqueda de pistas aún no exploradas, que hace bien su trabajo<br />
                    y que, libre del afán de poseer, es independiente ante las cosas.
                  </p>
                </div>

                <div className="bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-md space-y-3">
                  <span className="bg-clr7/15 dark:bg-clr7/20 text-clr7 px-3 py-1 rounded-[0.5rem] text-[0.95em] font-extrabold uppercase tracking-wide inline-block" style={{ color: primario }}>
                    Una persona espiritual
                  </span>
                  <p className="text-[1.02em] leading-relaxed italic text-zinc-600 dark:text-zinc-300">
                    Con un sentido trascendente para su vida,<br />
                    que camina al encuentro con su felicidad,<br />
                    que vive alegremente su fe y la integra a su conducta y que, abierta al diálogo y a la comprensión, respeta las opciones religiosas de los demás.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido de la Pestaña 3: Objetivos Terminales */}
      {activeTab === 'objetivos' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-4">
            <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>
              Objetivos Terminales del Caminante
            </h3>
            <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">
              Los objetivos terminales son los propósitos educativos que un joven aspira a alcanzar al egresar del Clan. Están estructurados en las 6 áreas de desarrollo de la propuesta educativa scout.
            </p>
          </div>

          {/* Grilla de las 6 Áreas de Desarrollo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {areas.map(area => {
              const areaObjectives = getObjectivesByArea(area.id);
              return (
                <div key={area.id} className="bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-md space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Encabezado del Área */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 flex-shrink-0 bg-zinc-50 dark:bg-white/5 rounded-2xl p-1.5 border" style={{ borderColor: `${area.color}30` }}>
                        <img src={area.img} alt={area.name} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <h4 className="font-extrabold uppercase text-[1.25em]" style={{ color: area.color }}>
                          {area.name}
                        </h4>
                        <p className="text-[0.8em] text-zinc-500 dark:text-zinc-400 font-semibold leading-tight">
                          {area.desc}
                        </p>
                      </div>
                    </div>

                    {/* Lista de Objetivos */}
                    <div className="pt-2">
                      {areaObjectives.length === 0 ? (
                        <p className="text-[0.9em] text-zinc-500 dark:text-zinc-400 italic">No hay objetivos registrados para esta área.</p>
                      ) : (
                        <ul className="space-y-2">
                          {areaObjectives.map((obj, i) => (
                            <li key={obj.id} className="text-[0.95em] text-zinc-700 dark:text-zinc-300 flex items-start gap-2.5 leading-relaxed">
                              <span className="font-bold text-[1.1em] mt-0.5" style={{ color: area.color }}>•</span>
                              <span>{obj.texto_terminal}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Contenido de la Pestaña 4: Servicio y Proyectos */}
      {activeTab === 'proyectos' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-4">
            <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>
              Las Empresas del Clan
            </h3>
            <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">
              La metodología de proyectos en el Clan se llama "Empresa". Es un proyecto colectivo diseñado, ejecutado y evaluado en su totalidad por los propios caminantes, orientado a resolver problemas reales de su entorno.
            </p>
          </div>

          {/* Grid de Proyectos / Ejemplos con Imágenes Orientadas */}
          <div className="space-y-8">
            {/* Proyecto 1: Imagen a la izquierda */}
            <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-md items-center">
              <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden relative shadow-inner">
                <img 
                  src="/images/unidades/bandera_clan.jpg" 
                  alt="Servicio comunitario" 
                  className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="w-full md:w-2/3 space-y-3">
                <span className="text-[0.8em] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30">
                  Medio Ambiente
                </span>
                <h4 className="text-[1.35em] font-black uppercase text-zinc-900 dark:text-white leading-tight">
                  Reforestación Nativa en la Quebrada
                </h4>
                <p className="text-[0.95em] text-zinc-650 dark:text-zinc-400 leading-relaxed">
                  Plantamos más de 150 árboles nativos en la quebrada del sector, colaborando con la junta de vecinos para crear un cortafuegos natural y recuperar el suelo degradado.
                </p>
              </div>
            </div>

            {/* Proyecto 2: Imagen a la derecha */}
            <div className="flex flex-col md:flex-row-reverse gap-6 bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-md items-center">
              <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden relative shadow-inner">
                <img 
                  src="/images/unidades/bandera_clan.jpg" 
                  alt="Construcción" 
                  className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="w-full md:w-2/3 space-y-3">
                <span className="text-[0.8em] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30">
                  Infraestructura Social
                </span>
                <h4 className="text-[1.35em] font-black uppercase text-zinc-900 dark:text-white leading-tight">
                  Construcción de Rampa de Acceso Universal
                </h4>
                <p className="text-[0.95em] text-zinc-650 dark:text-zinc-400 leading-relaxed">
                  Diseñamos y construimos una rampa de acceso universal para la sede del club de adulto mayor, facilitando el acceso a abuelos y personas con movilidad reducida del barrio.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido de la Pestaña 5: Mística y Tradición */}
      {activeTab === 'mistica' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-4">
            <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>
              La Horqueta y la Carta del Clan
            </h3>
            <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">
              La horqueta es la rama de madera bifurcada que representa las decisiones que el caminante debe tomar en su vida. En cada encrucijada, debe decidir qué camino seguir en consonancia con la Carta del Clan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Columna Izquierda: Carta del Clan */}
            <div className="md:col-span-7 bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-lg space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: primario }} />
              <h4 className="text-[1.25em] font-black uppercase text-zinc-900 dark:text-white pl-2">
                Nuestra Promesa y Ley
              </h4>
              <ul className="space-y-3 text-[0.95em] text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium pl-2">
                <li className="flex items-start gap-2">
                  <span className="font-black animate-pulse" style={{ color: primario }}>✓</span>
                  <span><strong>El Clan sirve:</strong> El caminante busca ser útil a su comunidad activamente.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-black animate-pulse" style={{ color: primario }}>✓</span>
                  <span><strong>El Clan reflexiona:</strong> Espacios de autocrítica y crecimiento espiritual.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-black animate-pulse" style={{ color: primario }}>✓</span>
                  <span><strong>El Clan camina:</strong> Avanzamos juntos sin dejar a nadie atrás.</span>
                </li>
              </ul>
            </div>

            {/* Columna Derecha: Lema del Rover */}
            <div 
              className="md:col-span-5 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl border border-white/10 text-white animate-pulse-slow"
              style={{ 
                background: `linear-gradient(135deg, ${primario}ee, ${primario}bb)`,
              }}
            >
              <span className="text-[0.9em] font-extrabold uppercase tracking-widest text-zinc-200">
                Lema del Caminante
              </span>
              <h4 className="text-[3em] font-black tracking-tight uppercase mt-2 drop-shadow-lg" style={{ color: secundario }}>
                SERVIR
              </h4>
              <p className="text-[0.95em] font-bold text-zinc-100 italic mt-3 max-w-xs leading-relaxed">
                "Remar tu propia canoa hacia el puerto del servicio desinteresado."
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
