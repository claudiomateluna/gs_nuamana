export const getObjetivoTerm = (unidadId: number): string => {
  switch (unidadId) {
    case 1: // Manada
      return 'huella';
    case 2: // Compañía
    case 3: // Tropa
      return 'desafío';
    case 4: // Avanzada
    case 5: // Clan
      return 'objetivo';
    default:
      return 'objetivo';
  }
};

export const EVAL_SCALE = [
  { value: 1, label: "Siento que no se pudo ver el/la {term}" },
  { value: 2, label: "Creo que la actividad algo tenía que ver con el/la {term}" },
  { value: 3, label: "Sentí que en momentos desarrolle este/esta {term}" },
  { value: 4, label: "Desarrollo un tema en especial de este/esta {term}" },
  { value: 5, label: "Participe en la actividad desarrollando esta/este {term}" },
  { value: 6, label: "Me sentí cómodo desarrollando esa/ese {term} y me gustó mucho" },
  { value: 7, label: "Logre desarrollar esta/este {term} y en conjunto con mis compañeros" },
  { value: 8, label: "Lo que logre en este/esta {term} se puede proyectar a mi vida" },
];

export const getEvalLabel = (value: number, unidadId: number): string => {
  const term = getObjetivoTerm(unidadId);
  const item = EVAL_SCALE.find(s => s.value === value);
  if (!item) return '';
  return item.label.replace(/{term}/g, term);
};

export const getFieldColor = (field: string) => {
  switch (field) {
    case 'arte_expresion': return '#dd0061'
    case 'deportes': return '#b78913'
    case 'ciencia_tecnologia': return '#261d4e'
    case 'aire_libre': return '#29397d'
    case 'espiritual': return '#0093c4'
    case 'servicio_comunidad': return '#00a946'
    default: return '#1b1b1b'
  }
}

export const getFieldLabel = (field: string) => {
  switch (field) {
    case 'arte_expresion': return 'Arte y Cultura'
    case 'deportes': return 'Deportes y Juegos'
    case 'ciencia_tecnologia': return 'Ciencia y Tecnología'
    case 'aire_libre': return 'Vida al Aire Libre'
    case 'espiritual': return 'Vida Espiritual'
    case 'servicio_comunidad': return 'Servicio y Comunidad'
    default: return field
  }
}

export const getFieldBgColor = (field: string) => {
  switch (field) {
    case 'arte_expresion': return '#fe3075'
    case 'deportes': return '#d9d306'
    case 'ciencia_tecnologia': return '#a479b0'
    case 'aire_libre': return '#00aef5'
    case 'espiritual': return '#dbebf3'
    case 'servicio_comunidad': return '#7bc02c'
    default: return '#f3f4f6'
  }
}

export const getFieldTextColor = (field: string) => {
  switch (field) {
    case 'arte_expresion': return '#ffffff'
    case 'deportes': return '#1b1b1b'
    case 'ciencia_tecnologia': return '#ffffff'
    case 'aire_libre': return '#ffffff'
    case 'espiritual': return '#1b1b1b'
    case 'servicio_comunidad': return '#ffffff'
    default: return '#1b1b1b'
  }
}

export const getFieldLogoPath = (field: string) => {
  switch (field) {
    case 'arte_expresion': return '/images/especialidades/arte_expresion.svg'
    case 'deportes': return '/images/especialidades/deportes.svg'
    case 'ciencia_tecnologia': return '/images/especialidades/ciencia_tecnologia.svg'
    case 'aire_libre': return '/images/especialidades/aire_libre.svg'
    case 'espiritual': return '/images/especialidades/espiritual.svg'
    case 'servicio_comunidad': return '/images/especialidades/servicio_comunidad.svg'
    default: return '/images/especialidades/generico.svg'
  }
}

export const getFieldEmoji = (field: string) => {
  switch (field) {
    case 'arte_expresion': return '🎨'
    case 'deportes': return '⚽'
    case 'ciencia_tecnologia': return '🔬'
    case 'aire_libre': return '⛺'
    case 'espiritual': return '🧘'
    case 'servicio_comunidad': return '🤝'
    default: return '🎖️'
  }
}

export const getSpecialtyInsigniaPath = (name: string) => {
  if (!name) return '/images/especialidades/generico.svg'
  const normalized = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
  return `/images/especialidades/${normalized}.svg`
}

