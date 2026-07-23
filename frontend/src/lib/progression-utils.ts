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

export {
  getFieldColor,
  getFieldLabel,
  getFieldBgColor,
  getFieldTextColor,
  getFieldLogoPath,
  getFieldEmoji,
  getSpecialtyInsigniaPath,
} from './field-helpers'

