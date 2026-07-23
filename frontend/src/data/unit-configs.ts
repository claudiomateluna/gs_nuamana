import { UnitArea } from '@/components/unidades/UnitView';

export const SHARED_AREAS: Record<number, UnitArea[]> = {
  1: [ // Manada
    { id: 1, name: "Corporalidad", img: "/images/progresion/manada/area_corporalidad.png", color: "#1e90ff", desc: "Desarrollo del cuerpo y cuidado de la salud." },
    { id: 2, name: "Creatividad", img: "/images/progresion/manada/area_creatividad.png", color: "#ff8c00", desc: "Estimular el pensamiento, innovar y adquirir habilidades." },
    { id: 3, name: "Carácter", img: "/images/progresion/manada/area_caracter.png", color: "#2ed573", desc: "Conocerse a sí mismo, madurez y escala de valores." },
    { id: 4, name: "Afectividad", img: "/images/progresion/manada/area_afectividad.png", color: "#ff4757", desc: "Lograr y mantener la madurez y equilibrio emocional." },
    { id: 5, name: "Sociabilidad", img: "/images/progresion/manada/area_sociabilidad.png", color: "#a55eea", desc: "Compromiso social y convivencia en comunidad." },
    { id: 6, name: "Espiritualidad", img: "/images/progresion/manada/area_espiritualidad.png", color: "#8e44ad", desc: "Búsqueda del sentido trascendente y la fe." },
  ],
  2: [ // Compañía
    { id: 1, name: "Corporalidad", icon: "🌱", img: "/images/progresion/compania/area_corporalidad.png", color: "#00b7dc", symbol: "El Alerce", symbolDesc: "Refleja fuerza y longevidad, creciendo de manera constante con agua y luz.", desc: "Desarrollo del cuerpo y cuidado de la salud." },
    { id: 2, name: "Creatividad", icon: "🔥", img: "/images/progresion/compania/area_creatividad.png", color: "#ff8c00", symbol: "El Fuego", symbolDesc: "Elemento de vital importancia para crear e innovar desde lo que tenemos.", desc: "Estimular el pensamiento, innovar y adquirir habilidades." },
    { id: 3, name: "Carácter", icon: "🏔️", img: "/images/progresion/compania/area_caracter.png", color: "#2ed573", symbol: "La Montaña", symbolDesc: "De base sólida y estable, nos desafía y reafirma quiénes somos.", desc: "Conocerse a sí mismo, madurez y escala de valores." },
    { id: 4, name: "Afectividad", icon: "🕊️", img: "/images/progresion/compania/area_afectividad.png", color: "#ff4757", symbol: "La Torcaza", symbolDesc: "Representa el andar seguro en bandada, la protección familiar y los afectos.", desc: "Lograr y mantener la madurez y equilibrio emocional." },
    { id: 5, name: "Sociabilidad", icon: "🐝", img: "/images/progresion/compania/area_sociabilidad.png", color: "#a55eea", symbol: "Las Abejas", symbolDesc: "Trabajo en sociedad para un fin común, comunicándose activamente.", desc: "Compromiso social y convivencia en comunidad." },
    { id: 6, name: "Espiritualidad", icon: "🌌", img: "/images/progresion/compania/area_espiritualidad.png", color: "#8e44ad", symbol: "La Constelación", symbolDesc: "La mirada al cielo nocturno buscando respuestas y trascendencia con Dios.", desc: "Búsqueda del sentido trascendente y la fe." },
  ],
  3: [ // Tropa
    { id: 1, name: "Corporalidad", icon: "🦅", img: "/images/progresion/tropa/area_corporalidad.png", color: "#00b7dc", symbol: "Hombre Pájaro", symbolDesc: "Inspirado en la cultura de Rapanui y la hazaña física de buscar el primer huevo del Manutara.", desc: "Desarrollo del cuerpo y cuidado de la salud." },
    { id: 2, name: "Creatividad", icon: "🏺", img: "/images/progresion/tropa/area_creatividad.png", color: "#ff8c00", symbol: "Vasija Diaguita", symbolDesc: "Símbolo de la capacidad de usar el conocimiento de manera original en la vida cotidiana.", desc: "Estimular el pensamiento, innovar y adquirir habilidades." },
    { id: 3, name: "Carácter", icon: "🧱", img: "/images/progresion/tropa/area_caracter.png", color: "#2ed573", symbol: "El Pucará", symbolDesc: "Fuerte incaico de piedra atacameño que representa solidez, tranquilidad y entereza moral.", desc: "Conocerse a sí mismo, madurez y escala de valores." },
    { id: 4, name: "Afectividad", icon: "🌸", img: "/images/progresion/tropa/area_afectividad.png", color: "#ff4757", symbol: "Chamanto de Doñihue", symbolDesc: "La flor tejida en el chamanto como símbolo de belleza, armonía y expresión de los afectos.", desc: "Lograr y mantener la madurez y equilibrio emocional." },
    { id: 5, name: "Sociabilidad", icon: "🐧", img: "/images/progresion/tropa/area_sociabilidad.png", color: "#a55eea", symbol: "Pingüino Emperador", symbolDesc: "Representa el trabajo cooperativo y la subsistencia comunitaria frente al clima antártico.", desc: "Compromiso social y convivencia en comunidad." },
    { id: 6, name: "Espiritualidad", icon: "🌲", img: "/images/progresion/tropa/area_espiritualidad.png", color: "#8e44ad", symbol: "Araucaria o Pehuén", symbolDesc: "Árbol venerado de raíces profundas y ramas al cielo, símbolo de la subsistencia y búsqueda de Dios.", desc: "Búsqueda del sentido trascendente y la fe." },
  ],
  4: [ // Avanzada
    { id: 1, name: "Corporalidad", img: "/images/progresion/avanzada/area_corporalidad.png", color: "#1e90ff", desc: "Desarrollo del cuerpo y cuidado de la salud." },
    { id: 2, name: "Creatividad", img: "/images/progresion/avanzada/area_creatividad.png", color: "#ff8c00", desc: "Estimular el pensamiento, innovar y adquirir habilidades." },
    { id: 3, name: "Carácter", img: "/images/progresion/avanzada/area_caracter.png", color: "#2ed573", desc: "Conocerse a sí mismo, madurez y escala de valores." },
    { id: 4, name: "Afectividad", img: "/images/progresion/avanzada/area_afectividad.png", color: "#ff4757", desc: "Lograr y mantener la madurez y equilibrio emocional." },
    { id: 5, name: "Sociabilidad", img: "/images/progresion/avanzada/area_sociabilidad.png", color: "#a55eea", desc: "Compromiso social y convivencia en comunidad." },
    { id: 6, name: "Espiritualidad", img: "/images/progresion/avanzada/area_espiritualidad.png", color: "#8e44ad", desc: "Búsqueda del sentido trascendente y la fe." },
  ],
  5: [ // Clan
    { id: 1, name: "Corporalidad", img: "/images/progresion/clan/area_corporalidad.png", color: "#1e90ff", desc: "Desarrollo del cuerpo y cuidado de la salud." },
    { id: 2, name: "Creatividad", img: "/images/progresion/clan/area_creatividad.png", color: "#ff8c00", desc: "Estimular el pensamiento, innovar y adquirir habilidades." },
    { id: 3, name: "Carácter", img: "/images/progresion/clan/area_caracter.png", color: "#2ed573", desc: "Conocerse a sí mismo, madurez y escala de valores." },
    { id: 4, name: "Afectividad", img: "/images/progresion/clan/area_afectividad.png", color: "#ff4757", desc: "Lograr y mantener la madurez y equilibrio emocional." },
    { id: 5, name: "Sociabilidad", img: "/images/progresion/clan/area_sociabilidad.png", color: "#a55eea", desc: "Compromiso social y convivencia en comunidad." },
    { id: 6, name: "Espiritualidad", img: "/images/progresion/clan/area_espiritualidad.png", color: "#8e44ad", desc: "Búsqueda del sentido trascendente y la fe." },
  ],
};

export const EGRESO_PILARES = [
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
];

export const ESPECIALIDADES_CAMPOS = [
  { title: "Deportes y juegos", desc: "Fomenta la actividad física, el juego limpio, el desarrollo psicomotriz y hábitos saludables.", color: "#decf32", icon: "/images/especialidades/deportes.svg" },
  { title: "Vida al Aire Libre", desc: "Técnicas de campismo, cuidado de la naturaleza, cabuyería y exploración del entorno.", color: "#319fd9", icon: "/images/especialidades/aire_libre.svg" },
  { title: "Arte y cultura", desc: "Danza, música, manualidades, actuación y diversas expresiones de creatividad lobata.", color: "#e72a71", icon: "/images/especialidades/arte_expresion.svg" },
  { title: "Ciencias y Tecnología", desc: "Experimentos, informática, astronomía, modelismo y curiosidad científica aplicada.", color: "#ab7cb1", icon: "/images/especialidades/ciencia_tecnologia.svg" },
  { title: "Servicio y Comunidad", desc: "Acciones de solidaridad, primeros auxilios, cuidado animal y apoyo a la comunidad del Pueblo Libre.", color: "#87bd24", icon: "/images/especialidades/servicio_comunidad.svg" },
  { title: "Vida Espiritual", desc: "Reflexión moral, conocimiento de la fe, valores humanos y amor por la creación.", color: "#dcecf4", icon: "/images/especialidades/espiritual.svg" },
];

export const ESPECIALIDADES_PRINCIPIOS = (unidadLabel: string) => [
  {
    title: "Aptitudes Innatas",
    desc: `Fomenta y ejercita habilidades sobre una materia de interés del ${unidadLabel}, descubriendo aficiones y fortaleciendo su autoestima.`,
    icon: "🌟"
  },
  {
    title: "Voluntario y Apoyado",
    desc: `Es enteramente voluntario e individual. El ${unidadLabel} cuenta con el apoyo de un monitor o tutor (dirigente, familiar o caminante) que lo orienta.`,
    icon: "🤝"
  },
  {
    title: "Objetivos Flexibles",
    desc: `Los objetivos y requisitos se adaptan a las posibilidades reales del ${unidadLabel} y su entorno geográfico o social.`,
    icon: "🎯"
  },
  {
    title: "Aprender y Servir",
    desc: `Se evalúa mediante acciones prácticas (hacer cosas). El ${unidadLabel} aprende para sí mismo y para poner su saber al servicio de los demás.`,
    icon: "🎁"
  }
];
