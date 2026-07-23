export const UNIT_IDS = {
  MANADA: 1,
  COMPANIA: 2,
  TROPA: 3,
  AVANZADA: 4,
  CLAN: 5,
} as const;

export type UnitId = (typeof UNIT_IDS)[keyof typeof UNIT_IDS];
