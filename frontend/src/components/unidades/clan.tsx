'use client';

import { UnitView } from './UnitView';
import { SHARED_AREAS } from '@/data/unit-configs';

interface Objective { id: string; area_id: number; texto_infantil: string; texto_terminal: string; }
interface ClanCustomContentProps { objectives: Objective[]; }

export default function ClanCustomContent({ objectives = [] }: ClanCustomContentProps) {
  const primario = '#e32328';
  const secundario = '#fac620';
  const areas = SHARED_AREAS[5];

  return (
    <UnitView
      primario={primario}
      secundario={secundario}
      areas={areas}
      objectives={objectives}
      profileTabLabels={{ desarrollo: 'Perfil de Egreso', egreso: 'Perfil de Egreso' }}
      profileContent={{
        desarrollo: <ClanPerfil primario={primario} />,
        egreso: <ClanPerfil primario={primario} />,
      }}
      tabs={[
        { key: 'camino', label: 'El Camino', content: <ClanCamino primario={primario} secundario={secundario} /> },
        { key: 'perfil', label: 'Perfil de Egreso', content: <ClanPerfil primario={primario} /> },
        { key: 'compromiso', label: 'El Compromiso', content: <ClanCompromiso primario={primario} secundario={secundario} /> },
        { key: 'objetivos', label: 'Objetivos Terminales', content: <ClanObjetivos primario={primario} areas={areas} objectives={objectives} /> },
        { key: 'proyectos', label: 'Proyectos', content: <ClanProyectos /> },
        { key: 'mistica', label: 'Marco Simbolico', content: <ClanMistica primario={primario} secundario={secundario} /> },
      ]}
    />
  );
}

function ClanPerfil({ primario }: { primario: string }) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>Perfil de Egreso del Caminante</h3>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">A continuación, te presentamos el perfil de egreso de nuestra asociación.</p>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300"><span className="bg-clr7 p-1 rounded-[0.5rem]">Una persona íntegra y libre,</span><br/>limpia de pensamiento y recta de corazón, de voluntad fuerte, responsable de sí misma.</p>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300"><span className="bg-clr7 p-1 rounded-[0.5rem]">Una persona que está al servicio de los demás</span><br/>solidaria con su comunidad, defensora de los derechos de los otros, comprometida con la democracia.</p>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300"><span className="bg-clr7 p-1 rounded-[0.5rem]">Una persona creativa</span><br/>que se esfuerza por dejar el mundo mejor de como lo encontró, comprometida con la integridad de la naturaleza.</p>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300"><span className="bg-clr7 p-1 rounded-[0.5rem]">Una persona espiritual</span><br/>con un sentido trascendente para su vida, que camina al encuentro con su felicidad.</p>
      </div>
    </div>
  );
}

function ClanCamino({ primario, secundario }: { primario: string; secundario: string }) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>La Ruta de Progresión Personal</h3>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">En el Clan Ahu Akivi, el caminante vive una progresión basada en la autonomía y la madurez.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 pt-4">
        {[{ title: "Bienvenida", desc: "Iniciación en el Clan. El caminante descubre la mística del servicio.", img: "/images/progresion/clan/etapa_bienvenida.png" },{ title: "Etapa Fuego", desc: "El Fuego es la Insignia que identifica al Caminante con su primera etapa de vivencia en el Clan.", img: "/images/progresion/clan/etapa_fuego.png" },{ title: "Etapa Antorcha", desc: "La Antorcha identifica la segunda etapa del caminante y la última etapa de vivencia como joven.", img: "/images/progresion/clan/etapa_antorcha.png" },{ title: "La Partida", desc: "El hito terminal. El rover egresa del grupo listo para remar su propia canoa.", img: "/images/progresion/clan/etapa_partida.png" }].map((etapa, idx) => (
          <div key={idx} className="bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-5 space-y-4 flex flex-col items-center text-center shadow-md">
            <div className="w-30 h-30 flex items-center justify-center"><img src={etapa.img} alt={etapa.title} className="max-w-full max-h-full object-contain" /></div>
            <div><h4 className="font-extrabold uppercase text-[1.1em] text-zinc-900 dark:text-white" style={{ color: idx === 3 ? secundario : undefined }}>{etapa.title}</h4><p className="text-[0.9em] text-zinc-650 dark:text-zinc-400 mt-2 leading-relaxed">{etapa.desc}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClanCompromiso({ primario, secundario }: { primario: string; secundario: string }) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>Compromiso del Caminante</h3>
        <p>El compromiso es un testimonio de la promesa guía o scout.</p>
        <span className="font-bold text-clr7"><p>Por mi honor prometo<br/>hacer cuanto de mí dependa para<br/>buscar a Dios, amar a mi familia, ayudar a los demás, servir a mi país, trabajar por la paz y vivir la Ley.</p></span>
        <div className="my-5 p-6 rounded-lg w-96 text-right text-extrabold text-[1.2em]" style={{ backgroundColor: primario, color: 'white' }}><p>Invitamos a que las y los caminantes den testimonio de la vivencia del mismo.</p></div>
        <div className="font-bold uppercase px-6 py-4 rounded-full w-80" style={{ backgroundColor: secundario, color: primario }}><h4>El caminante o la caminante.</h4></div>
        <ul className="ml-10 space-y-2 text-[1.25em] text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {["Es una persona digna de confianza.","Es leal.","Sirve sin esperar recompensa.","Comparte con todos.","Es alegre y cordial.","Protege la vida y la naturaleza.","Es responsable y nada hace a medias.","Es optimista.","Cuida las cosas y valora el trabajo.","Es coherente en su pensamiento, palabra y acción."].map((ley, i) => (<ul key={i}>{ley}</ul>))}
        </ul>
      </div>
    </div>
  );
}

function ClanObjetivos({ primario, areas, objectives }: { primario: string; areas: typeof SHARED_AREAS[5]; objectives: Objective[] }) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>Objetivos Terminales del Caminante</h3>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">Los objetivos terminales son los propósitos educativos que un joven aspira a alcanzar al egresar del Clan.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {areas.map(area => {
          const areaObjectives = objectives.filter(o => o.area_id === area.id);
          return (
            <div key={area.id} className="bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-md space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 flex-shrink-0 bg-zinc-50 dark:bg-white/5 rounded-2xl p-1.5 border" style={{ borderColor: `${area.color}30` }}><img src={area.img} alt={area.name} className="w-full h-full object-contain" /></div>
                  <div><h4 className="font-extrabold uppercase text-[1.25em]" style={{ color: area.color }}>{area.name}</h4><p className="text-[0.8em] text-zinc-500 dark:text-zinc-400 font-semibold leading-tight">{area.desc}</p></div>
                </div>
                <div className="pt-2">
                  {areaObjectives.length === 0 ? (<p className="text-[0.9em] text-zinc-500 dark:text-zinc-400 italic">No hay objetivos registrados para esta área.</p>) : (
                    <ul className="space-y-2">
                      {areaObjectives.map((obj) => (<li key={obj.id} className="text-[0.95em] text-zinc-700 dark:text-zinc-300 flex items-start gap-2.5 leading-relaxed"><span className="font-bold text-[1.1em] mt-0.5" style={{ color: area.color }}>•</span><span>{obj.texto_terminal}</span></li>))}
                    </ul>
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

function ClanProyectos() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: '#e32328' }}>Proyectos del Clan</h3>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">La metodología de trabajo del Clan son los proyectos. Proyectos colectivos o individuales diseñados, ejecutados y evaluados por los propios caminantes.</p>
      </div>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-md items-center">
          <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden relative shadow-inner"><img src="/images/unidades/bandera_clan.webp" alt="Proyectos Colectivos" className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-500" /></div>
          <div className="w-full md:w-2/3 space-y-3">
            <h4 className="text-[1.35em] font-black uppercase text-zinc-900 dark:text-white leading-tight">Proyectos Colectivos</h4>
            <p className="text-[0.95em] text-zinc-650 dark:text-zinc-400 leading-relaxed">Un proyecto colectivo de caminantes es un conjunto de actividades que tienen un objetivo en común.</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row-reverse gap-6 bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-md items-center">
          <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden relative shadow-inner"><img src="/images/unidades/bandera_clan.webp" alt="Campos de Accion" className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-500" /></div>
          <div className="w-full md:w-2/3 space-y-3 text-right">
            <h4 className="text-[1.35em] font-black uppercase text-zinc-900 dark:text-white leading-tight">Campos de Accion Prioritarios</h4>
            <p className="text-[0.95em] text-zinc-650 dark:text-zinc-400 leading-relaxed">Cuatro campos se destacan como prioritarios: el servicio, la naturaleza, el viaje y el trabajo.</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-md items-center">
          <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden relative shadow-inner"><img src="/images/unidades/servicio.webp" alt="Servicio" className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-500" /></div>
          <div className="w-full md:w-2/3 space-y-3">
            <span className="text-[0.8em] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-clr7 dark:bg-clr7/40 text-white dark:text-red-400 border border-red-200 dark:border-red-900/30 mb-3">Campo de Accion Prioritario</span>
            <h4 className="text-[1.35em] font-black uppercase text-zinc-900 dark:text-white leading-tight">Servicio</h4>
            <p className="text-[0.95em] text-zinc-650 dark:text-zinc-400 leading-relaxed">Desde el origen de nuestro movimiento, Baden Powell imprimio el compromiso con los demas.</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row-reverse gap-6 bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-md items-center">
          <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden relative shadow-inner"><img src="/images/unidades/bandera_clan.webp" alt="Trabajo" className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-500" /></div>
          <div className="w-full md:w-2/3 space-y-3 text-right">
            <span className="text-[0.8em] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-blue-500 dark:bg-blue-200/60 text-clr1 dark:text-blue-900 border border-blue-200 dark:border-blue-500 mb-3">Campo de Accion Prioritario</span>
            <h4 className="text-[1.35em] font-black uppercase text-zinc-900 dark:text-white leading-tight">Trabajo</h4>
            <p className="text-[0.95em] text-zinc-650 dark:text-zinc-400 leading-relaxed">Este campo nos invita a ver la vivencia del trabajo como posibilidad de experimentar el mundo laboral.</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-md items-center">
          <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden relative shadow-inner"><img src="/images/unidades/viaje.webp" alt="Viaje" className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-500" /></div>
          <div className="w-full md:w-2/3 space-y-3">
            <span className="text-[0.8em] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-clr8 dark:bg-clr8/40 text-white dark:text-clr8 border border-clr8 dark:border-clr8/30 mb-3">Campo de Accion Prioritario</span>
            <h4 className="text-[1.35em] font-black uppercase text-zinc-900 dark:text-white leading-tight">Viaje</h4>
            <p className="text-[0.95em] text-zinc-650 dark:text-zinc-400 leading-relaxed">Un recorrido donde puedas conocer lugares cercanos y enriquecerte como persona.</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row-reverse gap-6 bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-md items-center">
          <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden relative shadow-inner"><img src="/images/unidades/naturaleza.webp" alt="Naturaleza" className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-500" /></div>
          <div className="w-full md:w-2/3 space-y-3 text-right">
            <span className="text-[0.8em] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-clr6 dark:bg-clr6/40 text-clr1 dark:text-clr6 border border-green-200 dark:border-clr6 mb-3">Campo de Accion Prioritario</span>
            <h4 className="text-[1.35em] font-black uppercase text-zinc-900 dark:text-white leading-tight">Naturaleza</h4>
            <p className="text-[0.95em] text-zinc-650 dark:text-zinc-400 leading-relaxed">La vida en la naturaleza es el campo de accion que esta totalmente impreso en nuestra vivencia scout.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClanMistica({ primario, secundario }: { primario: string; secundario: string }) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-[1.5em] font-black uppercase tracking-tight" style={{ color: primario }}>Marco Simbolico</h3>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">Es propio de los Movimientos Guias y Scout ofrecer diversas miradas symbolicas, que caracterizan a cada Rama.</p>
        <p className="text-[1.05em] leading-relaxed text-zinc-700 dark:text-zinc-300">Tengo un proyecto para mi vida, es la expresion symbolica que se propone a los caminantes: "toma tu propia canoa y rema".</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7 bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-lg space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: primario }} />
          <h4 className="text-[1.25em] font-black uppercase text-zinc-900 dark:text-white pl-2">Nuestra Ley</h4>
          <ul className="space-y-3 text-[0.95em] text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium pl-2">
            {["Es una persona digna de confianza.","Es leal.","Sirve sin esperar recompensa.","Comparte con todos.","Es alegre y cordial.","Protege la vida y la naturaleza.","Es responsable y nada hace a medias.","Es optimista.","Cuida las cosas y valora el trabajo.","Es coherente en su pensamiento, palabra y accion."].map((ley, i) => (
              <li key={i} className="flex items-start gap-2"><span className="font-black" style={{ color: primario }}>&#10003;</span><span>{ley}</span></li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-5 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl border border-white/10 text-white" style={{ background: `linear-gradient(135deg, ${primario}ee, ${primario}bb)` }}>
          <span className="text-[0.9em] font-extrabold uppercase tracking-widest text-zinc-200">Lema del Caminante</span>
          <h4 className="text-[3em] font-black tracking-tight uppercase mt-2 drop-shadow-lg" style={{ color: secundario }}>SERVIR</h4>
          <p className="text-[1em] italic mt-3 max-w-xs leading-relaxed">Baden Powell nos dejo como legado dejar un mundo mejor del que encontramos.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-5 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl border border-white/10 text-white" style={{ background: `linear-gradient(135deg, ${primario}ee, ${primario}bb)` }}>
          <span className="text-[0.9em] font-extrabold uppercase tracking-widest text-zinc-200">Color del Clan</span>
          <h4 className="text-[3em] font-black tracking-tight uppercase mt-2 drop-shadow-xl" style={{ color: primario }}>ROJO</h4>
          <p className="text-[1em] italic mt-3 max-w-xs leading-relaxed">El rojo es el color que identifica a toda la Rama Caminantes.</p>
        </div>
        <div className="md:col-span-7 bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl p-6 shadow-lg space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: secundario }} />
          <h4 className="text-[1.25em] font-black uppercase text-zinc-900 dark:text-white pl-2">Flor de Liz y Trebol</h4>
          <img src="/images/logos/iconos_caminantes.svg" alt="Logo Caminantes" className="w-24 h-24 object-contain mx-auto mt-2" />
          <p className="text-[1em] italic mt-3 leading-relaxed">La flor de lis es un simbolo universal de los scouts que se ha hecho extensivo a los caminantes.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7 bg-white dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-3xl py-6 pl-0 pr-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: primario }} />
          <div className="grid grid-cols-12 gap-1 items-center pl-2">
            <div className="col-span-4 mx-2 flex justify-center"><img src="/images/unidades/baston_rover.jpg" alt="Baston Rover" /></div>
            <div className="col-span-8 space-y-2">
              <h4 className="text-[1.25em] font-black uppercase text-zinc-900 dark:text-white">Baston Rover</h4>
              <p className="text-[0.95em] text-zinc-650 dark:text-zinc-300 leading-relaxed italic">El baston Rover es una vara que se utiliza por los caminantes como un apoyo para sostenerse, avanzar y abrir camino.</p>
            </div>
          </div>
        </div>
        <div className="md:col-span-5 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl border border-white/10 text-white" style={{ background: `linear-gradient(135deg, ${secundario}ee, ${primario}bb)` }}>
          <img src="/images/progresion/clan/fuego.svg" alt="Fuego" className="w-24 h-24 object-contain mx-auto mt-2" />
          <h4 className="text-[3em] font-black tracking-tight uppercase mt-2 drop-shadow-xl" style={{ color: secundario }}>Fuego</h4>
          <p className="text-[1em] italic mt-3 max-w-xs leading-relaxed">El fuego es un simbolo identificatorio de los caminantes, que representa el coraje y la entereza.</p>
        </div>
      </div>
    </div>
  );
}
