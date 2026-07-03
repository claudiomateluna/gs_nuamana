'use client';

import { useState } from 'react';

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
  const [activeTab, setActiveTab] = useState<'camino' | 'perfil' | 'objetivos' | 'cacerias' | 'mistica'>('camino');

  // Colores de la Manada: Amarillo (#f5cd16) y Azul (#2b2c77)
  const primario = '#f5cd16';
  const secundario = '#2b2c77';

  const areas = [
    { id: 1, name: "Corporalidad", img: "/images/progresion/manada/area_corporalidad.png", color: "#1e90ff", desc: "Desarrollo del cuerpo y cuidado de la salud." },
    { id: 2, name: "Creatividad", img: "/images/progresion/manada/area_creatividad.png", color: "#ff8c00", desc: "Estimular el pensamiento, innovar y adquirir habilidades." },
    { id: 3, name: "Carácter", img: "/images/progresion/manada/area_caracter.png", color: "#2ed573", desc: "Conocerse a sí mismo, madurez y escala de valores." },
    { id: 4, name: "Afectividad", img: "/images/progresion/manada/area_afectividad.png", color: "#ff4757", desc: "Lograr y mantener la madurez y equilibrio emocional." },
    { id: 5, name: "Sociabilidad", img: "/images/progresion/manada/area_sociabilidad.png", color: "#a55eea", desc: "Compromiso social y convivencia en comunidad." },
    { id: 6, name: "Espiritualidad", img: "/images/progresion/manada/area_espiritualidad.png", color: "#8e44ad", desc: "Búsqueda del sentido trascendente y la fe." }
  ];

  const getObjectivesByArea = (areaId: number) => {
    return objectives.filter(o => o.area_id === areaId);
  };

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
            style={{ backgroundColor: activeTab === 'camino' ? secundario : undefined }}
          >
            Etapas de Manada
          </button>
          <button
            onClick={() => setActiveTab('perfil')}
            className={`px-2 py-1 rounded-[0.5rem] text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'perfil'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'perfil' ? secundario : undefined }}
          >
            Perfil del Lobato
          </button>
          <button
            onClick={() => setActiveTab('objetivos')}
            className={`px-2 py-1 rounded-[0.5rem] text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'objetivos'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'objetivos' ? secundario : undefined }}
          >
            Objetivos Educativos
          </button>
          <button
            onClick={() => setActiveTab('cacerias')}
            className={`px-2 py-1 rounded-[0.5rem] text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'cacerias'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'cacerias' ? secundario : undefined }}
          >
            Cacerías y Ciclo
          </button>
          <button
            onClick={() => setActiveTab('mistica')}
            className={`px-2 py-1 rounded-[0.5rem] text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'mistica'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'mistica' ? secundario : undefined }}
          >
            Símbolos
          </button>
        </div>
      </div>

      {/* Contenido de la Pestaña 1: Etapas de Manada */}
      {activeTab === 'camino' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-4">
            <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: secundario }}>
              La Ruta del Crecimiento en Seeonee
            </h3>
            <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">
              En la Manada, la progresión personal se vive en una senda adaptada a la niñez, donde las insignias de progresión reconocen el avance en el crecimiento del niño, evaluado a través de sus objetivos personales. El camino se divide en cuatro etapas de acuerdo con el rango de edad y madurez.
            </p>
          </div>

          {/* Línea de Tiempo de Progresión */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-4">
            {[
              {
                title: "Lobezno",
                desc: "Se entrega cuando el niño comienza con sus objetivos personales correspondientes a la Infancia Media. Es la bienvenida formal al cubil de Seeonee.",
                img: "/images/progresion/manada/etapa_lobezno.png"
              },
              {
                title: "Saltador",
                desc: "Se reconoce cuando el lobato ha alcanzado aproximadamente la mitad de sus objetivos personales de Infancia Media (7 a 9 años).",
                img: "/images/progresion/manada/etapa_saltador.png"
              },
              {
                title: "Diestro",
                desc: "Comienza cuando el niño avanza al rango de Infancia Tardía (9 a 11 años) y comienza a trabajar en sus objetivos del segundo Mapa del Lobato.",
                img: "/images/progresion/manada/etapa_diestro.png"
              },
              {
                title: "Cazador",
                desc: "Se reconoce cuando el lobato ha logrado aproximadamente la mitad de los objetivos correspondientes a la Infancia Tardía, preparándose para la transición.",
                img: "/images/progresion/manada/etapa_cazador.png"
              }
            ].map((etapa, idx) => (
              <div key={idx} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-2 space-y-4 flex flex-col items-center text-center shadow-md">
                <div className="w-30 h-30 flex items-center justify-center bg-zinc-50 dark:bg-white/5 rounded-[1.55rem]">
                  <img src={etapa.img} alt={etapa.title} className="max-w-full max-h-full object-contain rounded-[0.01rem]" />
                </div>
                <div>
                  <h4 className="font-extrabold uppercase text-[1.1em] text-zinc-900 dark:text-white">
                    {etapa.title}
                  </h4>
                  <p className="text-[0.9em] text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                    {etapa.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contenido de la Pestaña 2: Perfil del Lobato */}
      {activeTab === 'perfil' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-6">
            <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: secundario }}>
              Perfil del Lobato
            </h3>
            <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
              <p className="text-[1.05em] leading-relaxed font-bold">
                Niñas y Niños de 7 a 11 años
              </p>
              <p className="text-[1.05em] leading-relaxed font-bold">
                El perfil de manada describe las características de los niños y niñas durante este ciclo de desarrollo, abarcando de forma transversal todos los aspectos de su personalidad.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-md space-y-3">
                  <span className="px-3 py-1 rounded-[0.5rem] text-[0.95em] font-extrabold uppercase tracking-wide inline-block" style={{ backgroundColor: primario, color: secundario }}>
                    Activo y Lleno de Energía
                  </span>
                  <p className="text-[1.02em] leading-relaxed italic text-zinc-600 dark:text-zinc-400">
                    Llenos de dinamismo, exploran el deporte y la naturaleza. Les cuesta irse a dormir en campamento e inventan juegos y aventuras desafiando al cansancio del equipo de Viejos Lobos.
                  </p>
                </div>

                <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-md space-y-3">
                  <span className="px-3 py-1 rounded-[0.5rem] text-[0.95em] font-extrabold uppercase tracking-wide inline-block" style={{ backgroundColor: primario, color: secundario }}>
                    Curioso y Creador
                  </span>
                  <p className="text-[1.02em] leading-relaxed italic text-zinc-600 dark:text-zinc-400">
                    Buscadores de respuestas, inventan máquinas y herramientas. Disfrutan construyendo cosas con sus manos y exigen el máximo esfuerzo de sus dirigentes para alimentar su curiosidad.
                  </p>
                </div>

                <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-md space-y-3">
                  <span className="px-3 py-1 rounded-[0.5rem] text-[0.95em] font-extrabold uppercase tracking-wide inline-block" style={{ backgroundColor: primario, color: secundario }}>
                    Justo y Sincero
                  </span>
                  <p className="text-[1.02em] leading-relaxed italic text-zinc-600 dark:text-zinc-400">
                    Defensores de la verdad y justicia en sus juegos concretos. No toleran trampas ni repartos desiguales. Comprenden gradualmente los intereses de los demás y que no todo puede hacerse a su manera.
                  </p>
                </div>

                <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-md space-y-3">
                  <span className="px-3 py-1 rounded-[0.5rem] text-[0.95em] font-extrabold uppercase tracking-wide inline-block" style={{ backgroundColor: primario, color: secundario }}>
                    Comprometido y Colaborador
                  </span>
                  <p className="text-[1.02em] leading-relaxed italic text-zinc-600 dark:text-zinc-400">
                    Aceptan pequeñas tareas y se esfuerzan por cumplirlas. Aunque fallen en el proceso, este ejercicio les enseña el significado de un compromiso voluntario y les ayuda a forjar su responsabilidad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido de la Pestaña 3: Objetivos Educativos (Huellas) */}
      {activeTab === 'objetivos' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-4">
            <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: secundario }}>
              Objetivos Educativos de la Manada (Huellas)
            </h3>
            <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">
              Las "Huellas" son conductas previstas que los lobatos pueden lograr según su edad y madurez. En esta sección se muestran las conductas infantiles del Mapa del Lobato vinculadas a su correspondiente objetivo terminal.
            </p>
          </div>

          {/* Grilla de las 6 Áreas de Desarrollo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {areas.map(area => {
              const areaObjectives = getObjectivesByArea(area.id);
              return (
                <div key={area.id} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-md space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Encabezado del Área */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 flex-shrink-0 bg-zinc-50 dark:bg-white/5 rounded-2xl p-1.5 border border-zinc-200 dark:border-white/10" style={{ borderColor: `${area.color}30` }}>
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

                    {/* Lista de Objetivos (Scrollable con alto contraste) */}
                    <div className="pt-2">
                      {areaObjectives.length === 0 ? (
                        <p className="text-[0.9em] text-zinc-500 dark:text-zinc-400 italic">No hay objetivos registrados para esta área.</p>
                      ) : (
                        <div className="max-h-64 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-white/10">
                          {areaObjectives.map((obj) => (
                            <div key={obj.id} className="text-[0.95em] text-zinc-700 dark:text-zinc-300 leading-relaxed border-b border-zinc-150 dark:border-white/5 pb-2 last:border-0">
                              <div className="flex items-start gap-2.5">
                                <span className="font-bold text-[1.1em] mt-0.5" style={{ color: area.color }}>•</span>
                                <div>
                                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{obj.texto_infantil}</span>
                                  <p className="text-[0.85em] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
                                    Meta terminal: {obj.texto_terminal}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Contenido de la Pestaña 4: Cacerías y Ciclos */}
      {activeTab === 'cacerias' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-4">
            <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: secundario }}>
              Las Cacerías y el Ciclo de Programa
            </h3>
            <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">
              La metodología de proyectos en la Manada se conoce como **"Cacería"**. A través de ella, los lobatos proponen, planifican y ejecutan aventuras colectivas guiados por los Viejos Lobos (Akela, Baloo, Bagheera, Kaa).
            </p>
          </div>

          <div className="space-y-8">
            {/* Qué es una cacería */}
            <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-md items-center">
              <div className="w-full md:w-1/3 rounded-2xl overflow-hidden relative">
                <img 
                  src="/images/unidades/bandera_manada.webp" 
                  alt="Lobatos campamento" 
                  className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="w-full md:w-2/3 space-y-3">
                <span className="text-[0.8em] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-900/30">
                  Método Scout
                </span>
                <h4 className="text-[1.35em] font-black uppercase text-zinc-900 dark:text-white leading-tight">
                  ¿Qué es una Cacería?
                </h4>
                <p className="text-[0.95em] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Es un proyecto de corta duración estructurado a partir del juego y el marco simbólico. Toda la Manada participa activamente aportando ideas, eligiendo la cacería de forma democrática y asumiendo roles en las seisenas.
                </p>
              </div>
            </div>

            {/* Ciclo de programa en la manada */}
            <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-md space-y-6">
              <h4 className="text-[1.25em] font-black uppercase text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-white/10 pb-2">
                Fases del Ciclo de Programa
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                {[
                  { name: "Planificación", desc: "La Manada se reúne en el Cubil para proponer y votar las cacerías del ciclo." },
                  { name: "Preparación", desc: "Los lobatos organizan tareas y aprenden las destrezas necesarias para la aventura." },
                  { name: "Ejecución", desc: "Se vive la aventura elegida (excursiones, talleres, campamentos de manada)." },
                  { name: "Evaluación", desc: "Se evalúan los logros individuales y grupales, registrándose en el Libro de Mohwa." },
                  { name: "Celebración", desc: "Fiesta y reconocimiento de las insignias y huellas alcanzadas." }
                ].map((fase, i) => (
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
      )}

      {/* Contenido de la Pestaña 5: Marco Simbólico */}
      {activeTab === 'mistica' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-4">
            <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: secundario }}>
              Marco Simbólico de la Manada
            </h3>
            <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">
              El Marco Simbólico de la Manada se basa en la historia del Pueblo Libre de Seeonee, inspirada en "El Libro de las Tierras Vírgenes" de Rudyard Kipling. A través de la fantasía de la selva, los lobatos asimilan valores de convivencia, respeto y superación.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            {/* Columna Izquierda: Promesa de la Manada */}
            <div className="md:col-span-7 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-lg space-y-4 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: primario }} />
              <div className="space-y-4">
                <h4 className="text-[1.25em] font-black uppercase text-zinc-900 dark:text-white pl-2">
                  La Promesa de la Manada
                </h4>
                
                <blockquote className="bg-zinc-50 dark:bg-white/5 p-5 rounded-2xl border-l-4 border-yellow-400 italic text-[1.1em] text-zinc-700 dark:text-zinc-200 pl-4 font-medium leading-relaxed">
                  "Yo prometo ser siempre mejor, amar a Dios y a mi familia, ayudar a los demás y vivir la Ley de la Manada."
                </blockquote>

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

            {/* Columna Derecha: Ley de la Manada */}
            <div className="md:col-span-5 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-lg space-y-4 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: secundario }} />
              <div className="space-y-4">
                <h4 className="text-[1.25em] font-black uppercase text-zinc-900 dark:text-white pl-2">
                  La Ley de la Manada
                </h4>
                <p className="text-[0.9em] text-zinc-500 dark:text-zinc-400 pl-2 leading-relaxed">
                  Còdigo de conducta que resume los valores guías y scouts en acciones directas para el lobato:
                </p>
                <div className="grid grid-cols-1 gap-2 pt-2 pl-2">
                  {[
                    "Dice la verdad",
                    "Es alegre",
                    "Comparte con su familia",
                    "Escucha y ayuda a los demás",
                    "Cuida la naturaleza y las cosas",
                    "Busca aprender"
                  ].map((ley, i) => (
                    <div key={i} className="p-2.5 bg-zinc-50 dark:bg-white/5 rounded-xl border border-zinc-150 dark:border-white/5 flex items-center gap-2.5">
                      <span className="font-black text-yellow-500">✓</span>
                      <span className="text-[0.88em] font-extrabold text-zinc-800 dark:text-zinc-200 leading-tight">{ley}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Símbolos del Pueblo Libre: Tótem, Cubil, Libro de Mohwa */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-md space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: secundario }} />
              <h4 className="font-extrabold uppercase text-[1.1em] text-zinc-900 dark:text-white flex items-center gap-2">
                🐺 El Tótem
              </h4>
              <p className="text-[0.9em] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Una representación en madera de la cabeza de un lobo que encarna al Pueblo Libre. En él se cuelgan las cintas de colores que celebran las especialidades e hitos que los lobatos logran en su progresión.
              </p>
            </div>

            <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-md space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: primario }} />
              <h4 className="font-extrabold uppercase text-[1.1em] text-zinc-900 dark:text-white flex items-center gap-2">
                🏕️ El Cubil
              </h4>
              <p className="text-[0.9em] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                La guarida de la Manada. Es el local o rincón decorado y mantenido por los propios niños, sirviendo como un espacio exclusivo para planificar sus cacerías y resguardar los testimonios de su historia común.
              </p>
            </div>

            <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-md space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: secundario }} />
              <h4 className="font-extrabold uppercase text-[1.1em] text-zinc-900 dark:text-white flex items-center gap-2">
                📖 El Libro de Mohwa
              </h4>
              <p className="text-[0.9em] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                El libro histórico de la Manada. En él, los lobatos plasman bitácoras, anécdotas, dibujos y fotos de sus múltiples "cacerías", consolidando la tradición de la unidad en un valioso registro físico.
              </p>
            </div>
          </div>

          {/* Color de la Rama y Flor Roja */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch pt-4">
            <div className="md:col-span-6 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-md space-y-3 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: primario }} />
              <div className="space-y-3">
                <h4 className="text-[1.2em] font-black uppercase text-zinc-900 dark:text-white pl-2">
                  El Color Amarillo
                </h4>
                <p className="text-[0.92em] text-zinc-600 dark:text-zinc-400 leading-relaxed pl-2">
                  Históricamente, las primeras insignias scouts se bordaban en amarillo sobre fondo verde. Al expandir el Movimiento a los niños más pequeños, se eligió el **color amarillo** (uno de los colores propios del Escultismo) como el color oficial de identificación de los lobatos a nivel mundial, evocando alegría, luz y energía.
                </p>
              </div>
            </div>

            <div className="md:col-span-6 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-md space-y-3 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: secundario }} />
              <div className="space-y-3">
                <h4 className="text-[1.2em] font-black uppercase text-zinc-900 dark:text-white pl-2">
                  La Flor Roja
                </h4>
                <p className="text-[0.92em] text-zinc-600 dark:text-zinc-400 leading-relaxed pl-2">
                  La Flor Roja es la fiesta del fuego de la Manada. Deriva del episodio donde Mowgli busca el fuego en la aldea de los hombres para ahuyentar a Shere Khan y proteger a Akela. Simboliza el espacio para cantar, bailar y desplegar libremente la capacidad de expresión artística de los lobatos en torno a la fogata.
                </p>
              </div>
            </div>
          </div>

          {/* Bandera de la Manada (Full Width con imagen de fondo) */}
          <div 
            className="rounded-3xl overflow-hidden shadow-xl border border-zinc-200 dark:border-white/10 relative min-h-[300px] flex items-center group mt-8"
            style={{
              backgroundImage: "url('/images/unidades/Bandera_manada_webP.webp')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Overlay de gradiente oscuro con alto contraste para legibilidad en ambos modos */}
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/80 to-zinc-950/40 z-0 transition-opacity group-hover:opacity-95" />
            
            <div className="relative z-10 p-8 md:p-12 space-y-4 max-w-3xl text-white">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-8 rounded-full inline-block" style={{ backgroundColor: primario }} />
                <h4 className="text-[1.5em] font-black uppercase tracking-tight text-white">
                  La Bandera de la Manada
                </h4>
              </div>
              <div className="space-y-4 text-[0.98em] text-zinc-200 leading-relaxed font-semibold">
                <p>
                  La bandera de la Manada es el símbolo de reunión de la Rama y del Pueblo Libre de lobos. Es obligatoriamente de **color amarillo**, en representación de la Rama, y lleva en su centro la cabeza de un lobo y el nombre de la Manada bordado o pintado sobre ella.
                </p>
                <p>
                  Generalmente, la bandera tiene un lugar destacado y de honor en el Cubil (local de la Manada) y encabeza a los lobatos en las excursiones, juegos y ceremonias comunitarias del grupo.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
