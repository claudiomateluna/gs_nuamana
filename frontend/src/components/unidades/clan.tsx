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
  const [activeTab, setActiveTab] = useState<'camino' | 'perfil' | 'objetivos' | 'compromiso' | 'proyectos' | 'mistica'>('camino');

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
        <div className="flex flex-wrap gap-1 sm:gap-1">
          <button
            onClick={() => setActiveTab('camino')}
            className={`py-1 px-2 rounded-md text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'camino'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'camino' ? primario : undefined }}
          >
            El Camino
          </button>
          <button
            onClick={() => setActiveTab('perfil')}
            className={`py-1 px-2 rounded-md text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'perfil'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'perfil' ? primario : undefined }}
          >
            Perfil de Egreso
          </button>
          <button
            onClick={() => setActiveTab('compromiso')}
            className={`py-1 px-2 rounded-md text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'compromiso'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'compromiso' ? primario : undefined }}
          >
            El Compromiso
          </button>
          <button
            onClick={() => setActiveTab('objetivos')}
            className={`py-1 px-2 rounded-md text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
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
            className={`py-1 px-2 rounded-md text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'proyectos'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'proyectos' ? primario : undefined }}
          >
            Proyectos
          </button>
          <button
            onClick={() => setActiveTab('mistica')}
            className={`py-1 px-2 rounded-md text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'mistica'
                ? 'text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
            style={{ backgroundColor: activeTab === 'mistica' ? primario : undefined }}
          >
            Marco Simbolico
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
                desc: "El Fuego es la Insignia que identifi­ca al Caminante con su primera etapa de vivencia en el Clan. La potencia del fuego y todo su signi­ficado en la rama implica el comienzo de un período de concentración de energía, es una etapa de reflexión, la que espera el momento de expandirse, donde la juventud moviliza sus convicciones en crear y configu­rar una sociedad mejor.",
                img: "/images/progresion/clan/etapa_fuego.png"
              },
              {
                title: "Etapa Antorcha",
                desc: "La Antorcha, a su vez, identifica la segunda etapa del caminante y la última etapa de vivencia como joven en el movimiento. Sin embargo, no se considera como el final del recorrido, sino, por el contrario, implica la llegada del caminante a un punto de su vida en el cual se abren las posibilida­des y, desde este lugar, se visuali­zan o proyectan los caminos posibles a iluminar, volviéndose real el sentido contenido en la idea del Hombre y Mujer a que aspiramos ser.",
                img: "/images/progresion/clan/etapa_antorcha.png"
              },
              {
                title: "La Partida",
                desc: "El hito terminal. El rover egresa del grupo listo para remar su propia canoa en la sociedad civil.",
                img: "/images/progresion/clan/etapa_partida.png"
              }
            ].map((etapa, idx) => (
              <div key={idx} className="bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-5 space-y-4 flex flex-col items-center text-center shadow-md">
                <div className="w-30 h-30 flex items-center justify-center">
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
          <div className="space-y-4">
            <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>
              Perfil de Egreso del Caminante
            </h3>
              <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">A continuación, te presentamos el perfil de egreso de nuestra asociación, para leer y analizar junto a tu equipo y clan. </p>
              <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">Las personas que compartimos en los Movimientos Guía y Scout, aspira­mos a hacer todo lo que de nosotros dependa para ser: </p>
              <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300"><span className="bg-clr7 p-1 rounded-[0.5rem]">Una persona íntegra y libre, </span><br />limpia de pensamiento y recta de corazón, <br />de voluntad fuerte, responsable de sí misma, <br />que ha optado por un proyecto personal de vida <br />y que, fiel a la palabra dada, es lo que dice ser. <br /></p>
              <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300"><span className="bg-clr7 p-1 rounded-[0.5rem]">Una persona que está¡ al servicio de los demás </span><br /> solidaria con su comunidad, <br />defensora de los derechos de los otros, <br />comprometida con la democracia, integrada al desarrollo, <br />amante de la justicia, promotora de la paz, <br />que valora el trabajo humano, <br />que construye su familia en el amor, <br />que reconoce su dignidad y la del sexo complementario <br />y que, alegre y afectuosa, comparte con todos. <br /></p>
              <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300"><span className="bg-clr7 p-1 rounded-[0.5rem]">Una persona creativa </span><br />que se esfuerza por dejar el mundo mejor de como lo encontró, <br /> comprometida con la integridad de la naturaleza, <br />interesada por aprender continuamente, <br />en búsqueda de pistas aun no exploradas, <br />que hace bien su trabajo <br />y que, libre del afán de poseer, <br />es independiente ante las cosas. </p>
              <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300"><span className="bg-clr7 p-1 rounded-[0.5rem]">Una persona espiritual </span><br />con un sentido trascendente para su vida, <br />que camina al encuentro con su felicidad <br />que vive alegremente su fe y la integra a su conducta y que, abierta al diálogo y a la comprensión, <br />respeta las opciones religiosas de los demás.</p>
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

      {/* Contenido de la Pestaña 4: Compromiso del Caminante */}
      {activeTab === 'compromiso' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-4">
            <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>
              Compromiso del Caminante
            </h3>
            <p>El compromiso es un testimonio de la promesa guía o scout, o la realiza­ción de la misma en caso de no haber estado en el Movimiento antes de ser caminante. La idea es volver a realizar un compromiso contigo mismo, en público, pero esta vez desde un punto de vista más crítico y reflexivo, ya que la edad en la que te encuentras no es la misma que cuando eras guía, scout, pionero o pionera.</p>
            <p>El compromiso y su texto deben ser parte de tus propias creencias y valores, el texto que allí sale es sugerido y puede ser homologado según tus creencias personales y espirituales; pero, siempre teniendo a la vista nuestros valores y principios como guías y como scouts.</p>
            <p>El texto de la promesa es el siguiente: </p> <span className="font-bold text-clr7"> <p>Por mi honor prometo <br />hacer cuanto de mí dependa para <br />buscar a Dios, <br />amar a mi familia, <br />ayudar a los demás, <br />servir a mi país,  <br />trabajar por la paz <br />y vivir la Ley.</p></span>
            <div className="my-5 p-6 rounded-lg bg-clr7 w-96 object-contain text-right text-extrabold text-[1.2em]" style={{ backgroundColor: primario, color: 'white' }}><p>Invitamos a que las y los caminantes <br />antes de recitar el texto <br />del compromiso de Clan, <br />den testimonio de la <br />vivencia del mismo, dentro <br />del movimiento guía y <br />scout. Que lo hagan de manera <br />que refleje frente a <br />quienes lo o la acompañen, lo <br />que esto ha significado <br />para ellas y ellos, que disfruten <br /> de su momento.</p></div>
            <p>Tal y como dice en nuestra promesa, nos comprometemos a vivir la ley del y la caminante, que es el código de conducta valórico que nos guía y nos guiará durante el desarrollo de nuestra vida.</p>
            <p>A continuación, te presentamos los 10 artículos de la ley del caminante.</p>
            <div className="font-bold uppercase px-6 py-4 rounded-full w-80 object-contain" style={{ backgroundColor: secundario, color: primario }}><h4>El caminante o la caminante.</h4></div>
            <ul className="ml-10 space-y-2 text-[1.25em] text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <ul>Es una persona digna de confianza.</ul>
              <ul>Es leal.</ul>
              <ul>Sirve sin esperar recompensa.</ul>
              <ul>Comparte con todos.</ul>
              <ul>Es alegre y cordial.</ul>
              <ul>Protege la vida y la naturaleza.</ul>
              <ul>Es responsable y nada hace a medias.</ul>
              <ul>Es optimista.</ul>
              <ul>Cuida las cosas y valora el trabajo.</ul>
              <ul>Es coherente en su pensamiento, palabra y acción.</ul>
            </ul>
          </div>
        </div>
      )}

      {/* Contenido de la Pestaña 5: Proyectos */}
      {activeTab === 'proyectos' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-4">
            <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>
              Proyectos del Clan
            </h3>
            <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">
              La metodología de trabajo del Clan son los proyectos. Proyectos colectivo o individuales diseñados, ejecutados y evaluados en su totalidad por los propios caminantes, orientados a resolver problemas reales de su entorno.
            </p>
          </div>

          {/* Grid de Proyectos / Ejemplos con Imágenes Orientadas */}
          <div className="space-y-8">
            {/* Proyectos Colectivos: Imagen a la izquierda */}
            <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-md items-center">
              <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden relative shadow-inner">
                <img 
                  src="/images/unidades/bandera_clan.webp" 
                  alt="Proyectos Colectivos" 
                  className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="w-full md:w-2/3 space-y-3">
                <h4 className="text-[1.35em] font-black uppercase text-zinc-900 dark:text-white leading-tight">
                  Proyectos Colectivos
                </h4>
                <p className="text-[0.95em] text-zinc-650 dark:text-zinc-400 leading-relaxed">
                  Un proyecto colectivo de caminantes es un conjunto de actividades que tienen un objetivo en común y que es parte de un cronograma de un equipo o un clan. Surge producto de un diagnostico en común se coordinan, y participan de forma conjunta, contribuyendo con experiencias a su proyecto personal. Este tipo de proyectos les ayudan a descubrir y entrenar competencias que les servirán de forma directa a ir completando su proyecto personal.
                </p>
                <p className="text-[0.95em] text-zinc-650 dark:text-zinc-400 leading-relaxed">
                  Los proyectos colectivos dentro del clan, son el pilar fundamental de sus programas y de su progre­sión personal, ya que como vimos en "<b>El Camino</b>" las insignias de las etapas de progresión se entregan con la ejecución de proyectos colectivos en cuatro campos de acción prioritarios diferentes.
                </p>
              </div>
            </div>
            {/* Campos de Acción Prioritarios: Imagen a la derecha */}
            <div className="flex flex-col md:flex-row-reverse gap-6 bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-md items-center">
              <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden relative shadow-inner">
                <img 
                  src="/images/unidades/bandera_clan.webp" 
                  alt="Construcción" 
                  className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="w-full md:w-2/3 space-y-3 text-right">
                <h4 className="text-[1.35em] font-black uppercase text-zinc-900 dark:text-white leading-tight">
                  Campos de Acción Prioritarios
                </h4>
                <p className="text-[0.95em] text-zinc-650 dark:text-zinc-400 leading-relaxed">
                  Un campo de acción es un área delimitada de conocimientos en común que son trabajados en diferentes actividades y proyectos. Pueden ser áreas técnicas, tecno­lógicas, reflexivas, etc.
                </p>
                <p className="text-[0.95em] text-zinc-650 dark:text-zinc-400 leading-relaxed">
                  Dependiendo de sus intereses y de las necesidades del Clan, las actividades pueden referirse a diversas temáticas. Sin embargo, por distintas razones, existen determinadas áreas o materias que atraen las preferencias de los jóvenes, a los que llamamos campos de acción; aquí encontra­mos por ejemplo Alfabetización, Acción con niños en situación de riesgo social.; promoción de la diversidad cultural y comprensión intercultural; derechos humanos y democracia; educación para la paz; prevención de la violencia intrafamiliar y del trabajo infantil; asis­tencia en emergencias; prevención del consumo de drogas; deportes y recreación; etc. 
                </p>
                <p className="text-[0.95em] text-zinc-650 dark:text-zinc-400 leading-relaxed">
                  Dentro de todos los campos de acción existentes en el escultismo, el guidismo y el roverismo, cuatro se destacan en nuestra rama Caminante como prioritarios, estos son: el servicio, la naturaleza, el viaje y el trabajo. Estos campos son fundamentales a considerar a la hora de organizar proyectos colectivos con tu equipo y clan, ya que al menos tres de ellos, deben ser la temática principal de los proyectos que desarrollen a lo largo de su experiencia como caminantes, estos proyectos influi­rán directamente en tu progre­sión personal.
                </p>
              </div>
            </div>
            {/* Servicio: Imagen a la izquierda */}
            <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-md items-center">
              <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden relative shadow-inner">
                <img 
                  src="/images/unidades/servicio.webp" 
                  alt="Servicio" 
                  className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="w-full md:w-2/3 space-y-3">
                <span className="text-[0.8em] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-clr7 dark:bg-clr7/40 text-white dark:text-red-400 border border-red-200 dark:border-red-900/30 mb-3">
                  Campo de Acción Prioritario
                </span>
                <h4 className="text-[1.35em] font-black uppercase text-zinc-900 dark:text-white leading-tight">
                  Servicio
                </h4>
                <p className="text-[0.95em] text-zinc-650 dark:text-zinc-400 leading-relaxed">
                  Desde el origen de nuestro movimiento, Baden Powell a través del emblemático sitio de Mafeking, imprimió el compromiso con los demás. La libertad humana nos conduce a la felicidad y a la realización personal, cuando nos encontramos con el otro. La respuesta de esto la encontramos a través de la solidaridad, en el compromiso con la comunidad, en el auxilio al que sufre. Por ese motivo nuestro movimiento no es sustentable sin servicio e integración social, donde los y las caminantes tienen un rol importante dentro de su entorno, tendiendo a ser agentes de cambio dentro de la sociedad. Es importante siempre vincularse con quienes pretendemos prestar este servicio, para efectuar un diagnóstico al respecto y poder detectar las necesidades y determinar la solución a sus problemas o carencias.
                </p>
              </div>
            </div>
            {/* Trabajo: Imagen a la derecha */}
            <div className="flex flex-col md:flex-row-reverse gap-6 bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-md items-center">
              <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden relative shadow-inner">
                <img 
                  src="/images/unidades/bandera_clan.webp" 
                  alt="Construcción" 
                  className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="w-full md:w-2/3 space-y-3 text-right">
                <span className="text-[0.8em] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-blue-500 dark:bg-blue-200/60 text-clr1 dark:text-blue-900 border border-blue-200 dark:border-blue-500 mb-3">
                  Campo de Acción Prioritario
                </span>
                <h4 className="text-[1.35em] font-black uppercase text-zinc-900 dark:text-white leading-tight">
                  Trabajo
                </h4>
                <p className="text-[0.95em] text-zinc-650 dark:text-zinc-400 leading-relaxed">
                  Este campo de acción prioritario, nos invita a ver su vivencia en el dan como una posibilidad de experimentar y ver opción de trabajos suyos y las ayuden a saber cómo es este mundo en la vida de la adultez y les permita tener conocimiento de lo que implica desenvolverse en ese espacio.
                </p>
                <p className="text-[0.95em] text-zinc-650 dark:text-zinc-400 leading-relaxed">
                  Es importante mencionar por otra parte que el trabajo es el medio que tenemos para conservar nuestra propia vida, a través de los recursos que esto nos proporciona para lograr algunos objetivos. Este campo de acción prioritario te invita a ver el trabajo desde el punto del emprendimiento en el cual nuestras ideas de negocios y para generar recursos las convirtamos en un proyecto que puede definir nuestra vida laboral o desde el punto de la empleabilidad que nos invita a insertarnos de manera efectiva en el mundo laboral. En ambos proyectos lo que importa es la capacidad que tengas de generar ingresos ya sea a través de tu idea de negocios o a través del trabajo que hayas escogido.
                </p>
              </div>
            </div>
            {/* Viaje: Imagen a la izquierda */}
            <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-md items-center">
              <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden relative shadow-inner">
                <img 
                  src="/images/unidades/viaje.webp" 
                  alt="Viaje" 
                  className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="w-full md:w-2/3 space-y-3">
                <span className="text-[0.8em] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-clr8 dark:bg-clr8/40 text-white dark:text-clr8 border border-clr8 dark:border-clr8/30 mb-3">
                  Campo de Acción Prioritario
                </span>
                <h4 className="text-[1.35em] font-black uppercase text-zinc-900 dark:text-white leading-tight">
                  Viaje
                </h4>
                <p className="text-[0.95em] text-zinc-650 dark:text-zinc-400 leading-relaxed">
                  Cuando hablamos de viaje, no tiene que ver solo con ir de campamento, sino habla de un recorrido donde puedas efectuar algunas paradas, cono­cer lugares cercanos, compenetrarte de la vida local , realizar alguna activi­dad típica. En resumen enriquecerte como persona a través de esta nueva aventura. Este proyecto parece muy sencillo, pero en realidad tiene varios detalles que no debes dejar sin prever sobre todo su tu proyecto colectivo tiene que ver con un viaje al extranjero. Todo es posible, es tu sueño, lo puedes lograr. 
                </p>
              </div>
            </div>
            {/* Naturaleza: Imagen a la derecha */}
            <div className="flex flex-col md:flex-row-reverse gap-6 bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-md items-center">
              <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden relative shadow-inner">
                <img 
                  src="/images/unidades/naturaleza.webp" 
                  alt="Naturaleza" 
                  className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="w-full md:w-2/3 space-y-3 text-right">
                <span className="text-[0.8em] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-clr6 dark:bg-clr6/40 text-clr1 dark:text-clr6 border border-green-200 dark:border-clr6 mb-3">
                  Campo de Acción Prioritario
                </span>
                <h4 className="text-[1.35em] font-black uppercase text-zinc-900 dark:text-white leading-tight">
                  Naturaleza
                </h4>
                <p className="text-[0.95em] text-zinc-650 dark:text-zinc-400 leading-relaxed">
                  Junto con servicio, la vida en la naturaleza, es el campo de acción que está totalmente impreso en nuestra vivencia de guía y scout. Nuestra imagen social está totalmente conectada con este campo, por ese motivo no podemos dejar de crear proyectos que ayuden a la comunidad a crear conciencia por proteger y preservarla. Esta área invita a ser creadores y ejecutores de grandes ideas que ayuden a nuestro entorno natural.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido de la Pestaña 5: Marco Simbolico */}
      {activeTab === 'mistica' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-4">
            <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>
              Marco Simbolico
            </h3>
            <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">
              Es propio de los Movimientos Guía y Scout ofrecer, a niñas, niños y jóvenes, diversas miradas simbólicas, que llamamos marcos simbólicos y que caracterizan a cada Rama; le ofrecen una motivación apropiada a su proceso de maduración y acompañan su crecimiento.
            </p>
            <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">
              Tengo un proyecto para mi vida, es la expresión simbólica que se propone a los y las caminantes, la cual coincide con la sugerencia que el fundador de los scouts, Baden Powell, hacía a los y las jóvenes de esta edad: "toma tu propia canoa y rema". Ya no se trata de vivir una aventura que es en parte individual y parte en equipo. Más o menos próximo a definir tu identidad personal, ahora es el tiempo en que tu como joven deberás comenzar paralelamente a definir un propósito personal para tu vida. Y tu equipo, que está presente, pero de un modo distinto, puede ayudar mucho en esta tarea. Sin embargo, la responsabilidad es individual. Nadie podrá vivir por ti la vida que comenzarás a vivir a partir de esta etapa.
            </p>
            <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">
              Entonces, hay que tener un proyecto para la vida. La expresión no es puramente simbólica: en la práctica, la gran tarea de los caminantes en el clan es la construcción, desarrollo, evaluación y reformulación continua, por escrito, de un Proyecto Personal y que esta agenda te ayudará a realizar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Columna Izquierda: Ley del Clan */}
            <div className="md:col-span-7 bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-lg space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: primario }} />
              <h4 className="text-[1.25em] font-black uppercase text-zinc-900 dark:text-white pl-2">
                Nuestra Ley
              </h4>
              <ul className="space-y-3 text-[0.95em] text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium pl-2">
                <li className="flex items-start gap-2">
                  <span className="font-black animate-pulse" style={{ color: primario }}>✓</span>
                  <span><strong>La y El Caminante:</strong>Es una persona digna de confianza.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-black animate-pulse" style={{ color: primario }}>✓</span>
                  <span><strong>El Y La Caminante:</strong>Es leal.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-black animate-pulse" style={{ color: primario }}>✓</span>
                  <span><strong>La y El Caminante:</strong>Sirve sin esperar recompensa.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-black animate-pulse" style={{ color: primario }}>✓</span>
                  <span><strong>El y La Caminante:</strong>Comparte con todos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-black animate-pulse" style={{ color: primario }}>✓</span>
                  <span><strong>La y El Caminante:</strong>Es alegre y cordial.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-black animate-pulse" style={{ color: primario }}>✓</span>
                  <span><strong>El y La Caminante:</strong>Protege la vida y la naturaleza.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-black animate-pulse" style={{ color: primario }}>✓</span>
                  <span><strong>La y El Caminante:</strong>Es responsable y nada hace a medias.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-black animate-pulse" style={{ color: primario }}>✓</span>
                  <span><strong>El y La Caminante:</strong>Es optimista.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-black animate-pulse" style={{ color: primario }}>✓</span>
                  <span><strong>La y El Caminante:</strong>Cuida las cosas y valora el trabajo.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-black animate-pulse" style={{ color: primario }}>✓</span>
                  <span><strong>El y La Caminante:</strong>Es coherente en su pensamiento, palabra y acción.</span>
                </li>
              </ul>
            </div>

            {/* Columna Derecha: Lema del Caminante */}
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
              <p className="text-[1em] ¿text-zinc-100 italic mt-3 max-w-xs leading-relaxed">
                Baden Powell en sus últimos momen­tos, nos dejó como legado dejar un mundo mejor del que encontramos. Un mensaje tan sencillo y tan complejo a la vez, que les invita a que sean protagonistas de un mundo que requiere de sus acciones, es decir, deben ser actores primordiales en el servicio a los demás, escapando de los estereotipos bonachones o de la participación asistencialista.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Columna Izquierda: Color del Clan */}
            <div 
              className="md:col-span-5 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl border border-white/10 text-white animate-pulse-slow"
              style={{ 
                background: `linear-gradient(135deg, ${primario}ee, ${primario}bb)`,
              }}
            >
              <span className="text-[0.9em] font-extrabold uppercase tracking-widest text-zinc-200">
                Color del Clan
              </span>
              <h4 className="text-[3em] font-black tracking-tight uppercase mt-2 drop-shadow-xl text-shadow-[0_0_10px_rgba(255,0,0,0.8)] text-shadow-yellow-950" style={{ color: primario }}>
                ROJO
              </h4>
              <p className="text-[1em] ¿text-zinc-100 italic mt-3 max-w-xs leading-relaxed">
                El rojo es el color que identifica a toda la Rama Caminantes. Relacionamos este color con el esfuerzo y el sacrificio requerido para desarrollar aptitudes y habilida­des personales que vayan para el bien de los demás. También es el color que alcanzan los metales al fundirse y purificarse y, por último, es el color del fuego, que simboliza la pasión con que actúan los caminantes.
              </p>
            </div>
            {/* Columna Derecha: Flor de Liz y Trebol */}
            <div className="md:col-span-7 bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-lg space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: secundario }} />
              <h4 className="text-[1.25em] font-black uppercase text-zinc-900 dark:text-white pl-2">
                Flor de Liz y Trebol
              </h4>
              <img src="/images/logos/iconos_caminantes.svg" alt="Logo Caminantes" className="w-24 h-24 object-contain mx-auto mt-2" />
              <p className="text-[1em] ¿text-zinc-100 italic mt-3 leading-relaxed">
                La flor de lis es un símbolo universal de los scouts que se ha hecho extensivo a los y las caminantes. Proviene de los antiguos mapas que la utilizaban en la rosa de los vientos para indicar el norte. En palabras de Baden-Powell, representa "la buena senda que ha de seguir todo scout". Un sentido similar tiene el trébol, emblema mundial de las guías, cuyos pétalos representan los tres principios del Movimiento, la llama inferior simboliza el amor a la humanidad, las dos estrellas aluden a la Promesa y a la Ley y la vena interior es el símil de la aguja, que al igual que en la rosa de los vientos, indica el buen camino a seguir.
              </p>              
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Columna Derecha: Bastón Rover */}
            <div className="md:col-span-7 bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl py-6 pl-0 pr-6 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: primario }} />
              <div className="grid grid-cols-12 gap-1 items-center pl-2">
                {/* Columna Izquierda: Imagen */}
                <div className="col-span-4 sm:col-span-4 mx-2 flex justify-center">
                  <img 
                    src="/images/unidades/baston_rover.jpg" 
                    alt="Bastón Rover" 
                    className="" 
                  />
                </div>
                {/* Columna Derecha: Contenido */}
                <div className="col-span-8 sm:col-span-8 space-y-2">
                  <h4 className="text-[1.25em] font-black uppercase text-zinc-900 dark:text-white">
                    Bastón Rover
                  </h4>
                  <p className="text-[0.95em] text-zinc-650 dark:text-zinc-300 leading-relaxed italic">
                    El bastón Rover es una vara de un largo ligeramente mayor al de un bastón habitual, puede ser terminado en horquilla o en su forma natural. Lo importante es que se utiliza por los y las jóvenes caminantes como un apoyo para sostenerse, avanzar, abrir camino y defenderse. A pesar de que en Chile la Rama se llama Caminantes, la costumbre y la tradición han mantenido el nombre Rover para singularizar este bastón, aun cuando en otras asociaciones se le conoce también como Horqueta Rover.
                  </p>
                  <p className="text-[0.95em] text-zinc-650 dark:text-zinc-300 leading-relaxed italic">
                    El bastón rover es un símbolo identificatorio de los y las caminantes, que representa el liderazgo y la responsabilidad que asume un joven al tomar decisiones en beneficio del grupo. Este está presente en las insignias de progresión: Fuego y Antorcha.
                  </p>
                </div>
              </div>
            </div>
            {/* Columna Izquierda: Fuego */}
            <div 
              className="md:col-span-5 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl border border-white/10 text-white animate-pulse-slow"
              style={{ 
                background: `linear-gradient(135deg, ${secundario}ee, ${primario}bb)`,
              }}
            >
              <img src="/images/progresion/clan/fuego.svg" alt="Logo Caminantes" className="w-24 h-24 object-contain mx-auto mt-2" />
              <h4 className="text-[3em] font-black tracking-tight uppercase mt-2 drop-shadow-xl text-shadow-[0_0_10px_rgba(255,0,0,0.8)] text-shadow-yellow-950" style={{ color: secundario }}>
                Fuego
              </h4>
              <p className="text-[1em] ¿text-zinc-100 italic mt-3 max-w-xs leading-relaxed">
                El fuego es un símbolo identificatorio de los y las caminan­tes, que representa el coraje y la entereza de un joven por llevar adelante su Proyecto Personal, a pesar todas las dificultades que naturalmente va a encontrar. El fuego permite al caminante iluminar sus caminos cuando existe oscuridad. Este está presente en las insignias de progresión: Fuego y Antorcha.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
