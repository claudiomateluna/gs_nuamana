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
  const [activeTab, setActiveTab] = useState<'camino' | 'perfil' | 'objetivos' | 'cacerias' | 'compromiso'>('camino');

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
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <button
            onClick={() => setActiveTab('camino')}
            className={`px-5 py-2.5 rounded-2xl text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'camino'
                ? 'text-white shadow-lg shadow-yellow-500/20'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'camino' ? secundario : undefined }}
          >
            Etapas de Manada
          </button>
          <button
            onClick={() => setActiveTab('perfil')}
            className={`px-5 py-2.5 rounded-2xl text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'perfil'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'perfil' ? secundario : undefined }}
          >
            Perfil del Lobato
          </button>
          <button
            onClick={() => setActiveTab('objetivos')}
            className={`px-5 py-2.5 rounded-2xl text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'objetivos'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'objetivos' ? secundario : undefined }}
          >
            Objetivos Educativos
          </button>
          <button
            onClick={() => setActiveTab('cacerias')}
            className={`px-5 py-2.5 rounded-2xl text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'cacerias'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'cacerias' ? secundario : undefined }}
          >
            Cacerías y Ciclo
          </button>
          <button
            onClick={() => setActiveTab('compromiso')}
            className={`px-5 py-2.5 rounded-2xl text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'compromiso'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'compromiso' ? secundario : undefined }}
          >
            Promesa y Ley
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
              En la Manada, la progresión personal se vive en una senda adaptada a la niñez, donde las insignias representan el crecimiento del lobato dentro del Pueblo Libre. El camino se divide en cuatro etapas de acuerdo con el rango de edad y madurez.
            </p>
          </div>

          {/* Línea de Tiempo de Progresión */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 pt-4">
            {[
              {
                title: "Lobezno",
                desc: "Etapa introductoria. El niño ingresa a la Manada, se adapta al Cubil, y empieza a conocer la Ley de la Selva para formular su Promesa.",
                img: "/images/progresion/manada/etapa_lobezno.png"
              },
              {
                title: "Saltador",
                desc: "Infancia Media (7 a 9 años). Se alcanza cuando el lobato ha logrado aproximadamente la mitad de sus objetivos personales de infancia media.",
                img: "/images/progresion/manada/etapa_saltador.png"
              },
              {
                title: "Diestro",
                desc: "Infancia Tardía (9 a 11 años). Se entrega cuando el niño pasa al rango de infancia tardía y comienza a trazar sus objetivos del nuevo Mapa.",
                img: "/images/progresion/manada/etapa_diestro.png"
              },
              {
                title: "Cazador",
                desc: "Etapa terminal. El lobato ha logrado la mitad de sus objetivos de infancia tardía, liderando cacerías y preparándose para dar el salto a la Tropa o Compañía.",
                img: "/images/progresion/manada/etapa_cazador.png"
              }
            ].map((etapa, idx) => (
              <div key={idx} className="bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-5 space-y-4 flex flex-col items-center text-center shadow-md">
                <div className="w-24 h-24 flex items-center justify-center bg-zinc-50 dark:bg-white/5 rounded-2xl p-2">
                  <img src={etapa.img} alt={etapa.title} className="max-w-full max-h-full object-contain" />
                </div>
                <div>
                  <h4 className="font-extrabold uppercase text-[1.1em] text-zinc-900 dark:text-white" style={{ color: idx === 3 ? primario : undefined }}>
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

      {/* Contenido de la Pestaña 2: Perfil del Lobato */}
      {activeTab === 'perfil' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-6">
            <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: secundario }}>
              Perfil del Lobato (Niños de 7 a 11 años)
            </h3>
            <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
              <p className="text-[1.05em] leading-relaxed font-bold">
                El perfil de egreso o características de los lobatos describe las cualidades físicas, intelectuales y sociales de los niños en esta rica etapa de crecimiento.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-md space-y-3">
                  <span className="px-3 py-1 rounded-[0.5rem] text-[0.95em] font-extrabold uppercase tracking-wide inline-block" style={{ backgroundColor: `${primario}20`, color: secundario }}>
                    Activo y Lleno de Energía
                  </span>
                  <p className="text-[1.02em] leading-relaxed italic text-zinc-600 dark:text-zinc-300">
                    Siempre listos para correr y jugar, con un entusiasmo inagotable por inventar nuevas aventuras y explorar de cabo a rabo la naturaleza en cada campamento.
                  </p>
                </div>

                <div className="bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-md space-y-3">
                  <span className="px-3 py-1 rounded-[0.5rem] text-[0.95em] font-extrabold uppercase tracking-wide inline-block" style={{ backgroundColor: `${primario}20`, color: secundario }}>
                    Curioso y Observador
                  </span>
                  <p className="text-[1.02em] leading-relaxed italic text-zinc-600 dark:text-zinc-300">
                    Buscador de respuestas y creador de herramientas sencillas. Le fascina saber por qué ocurren las cosas y probar el funcionamiento de todo lo que le rodea.
                  </p>
                </div>

                <div className="bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-md space-y-3">
                  <span className="px-3 py-1 rounded-[0.5rem] text-[0.95em] font-extrabold uppercase tracking-wide inline-block" style={{ backgroundColor: `${primario}20`, color: secundario }}>
                    Defensor de la Verdad y Justicia
                  </span>
                  <p className="text-[1.02em] leading-relaxed italic text-zinc-600 dark:text-zinc-300">
                    Rechaza las trampas en los juegos y reclama la equidad. Poco a poco aprende a considerar las opiniones de los demás y comprende que no todo puede hacerse bajo su propio deseo.
                  </p>
                </div>

                <div className="bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-md space-y-3">
                  <span className="px-3 py-1 rounded-[0.5rem] text-[0.95em] font-extrabold uppercase tracking-wide inline-block" style={{ backgroundColor: `${primario}20`, color: secundario }}>
                    Consciente del Compromiso
                  </span>
                  <p className="text-[1.02em] leading-relaxed italic text-zinc-600 dark:text-zinc-300">
                    Acepta pequeñas tareas y responsabilidades en su Seisena. Aunque falle en el intento, aprende progresivamente el valor de su palabra y la constancia.
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
              Las "Huellas" son las conductas esperables que los lobatos convienen y desarrollan individualmente. Están divididas en las 6 áreas de desarrollo, mostrando tanto la redacción infantil como la terminal.
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

                    {/* Lista de Objetivos (Scrollable) */}
                    <div className="pt-2">
                      {areaObjectives.length === 0 ? (
                        <p className="text-[0.9em] text-zinc-500 dark:text-zinc-400 italic">No hay objetivos registrados para esta área.</p>
                      ) : (
                        <div className="max-h-64 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-white/10">
                          {areaObjectives.map((obj, i) => (
                            <div key={obj.id} className="text-[0.95em] text-zinc-700 dark:text-zinc-300 leading-relaxed border-b border-zinc-100 dark:border-white/5 pb-2 last:border-0">
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
            <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-md items-center">
              <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden relative shadow-inner">
                <img 
                  src="/images/unidades/bandera_manada.jpg" 
                  alt="Lobatos campamento" 
                  className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="w-full md:w-2/3 space-y-3">
                <span className="text-[0.8em] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-450 border border-yellow-250">
                  Método Scout
                </span>
                <h4 className="text-[1.35em] font-black uppercase text-zinc-900 dark:text-white leading-tight">
                  ¿Qué es una Cacería?
                </h4>
                <p className="text-[0.95em] text-zinc-650 dark:text-zinc-400 leading-relaxed">
                  Es un proyecto de corta duración estructurado a partir del juego y el marco simbólico. Toda la Manada participa activamente aportando ideas, eligiendo la cacería de forma democrática y asumiendo roles en las seisenas.
                </p>
              </div>
            </div>

            {/* Ciclo de programa en la manada */}
            <div className="bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-md space-y-6">
              <h4 className="text-[1.25em] font-black uppercase text-zinc-900 dark:text-white border-b pb-2">
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
                  <div key={i} className="bg-zinc-50 dark:bg-white/5 rounded-2xl p-4 space-y-2 border">
                    <span className="text-[1.5em] font-black text-yellow-500">0{i+1}</span>
                    <h5 className="font-extrabold uppercase text-[0.95em] text-zinc-900 dark:text-white">{fase.name}</h5>
                    <p className="text-[0.85em] text-zinc-600 dark:text-zinc-450 mt-1">{fase.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido de la Pestaña 5: Promesa y Ley */}
      {activeTab === 'compromiso' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-4">
            <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: secundario }}>
              La Promesa y Ley de la Manada
            </h3>
            <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">
              La Promesa es el compromiso voluntario y personal que toma el lobato para vivir de acuerdo con los valores del movimiento scout, mientras que la Ley resume el código de conducta en acciones simples y directas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            {/* Columna Izquierda: Promesa de la Manada */}
            <div className="md:col-span-7 bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-lg space-y-4 relative overflow-hidden flex flex-col justify-between">
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
                  <ul className="space-y-2 text-[0.9em] text-zinc-650 dark:text-zinc-400 leading-relaxed font-semibold">
                    <li>• <strong>Ser siempre mejor:</strong> Espíritu de superación constante para ser hoy mejor que ayer.</li>
                    <li>• <strong>Amar a Dios y a mi familia:</strong> Compartir valores de fe y retribuir el amor del hogar.</li>
                    <li>• <strong>Ayudar a los demás:</strong> Aprender a ser útil y servicial con el entorno.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Ley de la Manada */}
            <div className="md:col-span-5 bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-lg space-y-4 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: secundario }} />
              <div className="space-y-4">
                <h4 className="text-[1.25em] font-black uppercase text-zinc-900 dark:text-white pl-2">
                  La Ley de la Manada
                </h4>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {[
                    "Dice la verdad",
                    "Es alegre",
                    "Comparte con su familia",
                    "Escucha y ayuda a los demás",
                    "Cuida la naturaleza y las cosas",
                    "Busca aprender"
                  ].map((ley, i) => (
                    <div key={i} className="p-3 bg-zinc-50 dark:bg-white/5 rounded-xl border flex items-center gap-2">
                      <span className="font-black text-yellow-500">✓</span>
                      <span className="text-[0.88em] font-extrabold text-zinc-800 dark:text-zinc-250 leading-tight">{ley}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Símbolo: El Gran Aullido (Full Width) */}
          <div 
            className="rounded-3xl overflow-hidden shadow-xl border border-zinc-150 dark:border-white/5 relative min-h-[300px] flex items-center group"
            style={{
              backgroundImage: "url('/images/unidades/bandera_manada.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Overlay de gradiente oscuro para legibilidad */}
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/75 to-zinc-950/40 z-0 transition-opacity group-hover:opacity-95" />
            
            <div className="relative z-10 p-8 md:p-12 space-y-4 max-w-3xl text-white">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-8 rounded-full inline-block" style={{ backgroundColor: primario }} />
                <h4 className="text-[1.5em] font-black uppercase tracking-tight text-white">
                  El Gran Aullido y la Roca del Consejo
                </h4>
              </div>
              <div className="space-y-4 text-[0.98em] text-zinc-200 leading-relaxed font-medium">
                <p>
                  El Gran Aullido es la ceremonia tradicional más importante de la Manada. En ella, reunidos en círculo alrededor de la Roca del Consejo, los lobatos saludan a Akela y reafirman en comunidad su compromiso de "hacer siempre lo mejor".
                </p>
                <p>
                  A través de este gran saludo colectivo, la Manada revive los pasajes del Libro de la Selva donde Mowgli es reconocido por el Pueblo Libre. Simboliza la cohesión, la alegría y la fraternidad de los lobatos bajo un mismo marco de valores y respeto a la Ley.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
