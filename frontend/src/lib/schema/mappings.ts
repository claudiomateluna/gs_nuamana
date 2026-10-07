/**
 * Metadata → schema.org Value Mappings
 * Tolerant parsers for hand-entered activity fields: production data is free
 * form ('01 hora', 'Toda la Unidad', legacy field aliases), so every parser
 * returns undefined instead of throwing when a value is unusable. Unit ranges
 * are UNIONED (manada + clan → 7-20) because a game can be played by several
 * units at once, and accents are normalized so labels match regardless of how
 * they were typed.
 */

import { sinAcentos, titleCase } from './normalize';

export interface QuantitativePlayers {
  '@type': 'QuantitativeValue';
  value: number;
  minValue: number;
  maxValue: number;
  unitText: 'People';
}

export interface NamedPlace {
  '@type': 'Place';
  name: string;
}

export interface NamedThing {
  '@type': 'Thing';
  name: string;
}

export interface QuestThing {
  '@type': 'Thing';
  name: string;
  description: string;
}

/** Scout unit label (accent-insensitive) -> inclusive age range. */
const UNIDAD_RANGES: Record<string, readonly [number, number]> = {
  manada: [7, 11],
  compania: [11, 15],
  tropa: [11, 15],
  avanzada: [15, 17],
  clan: [17, 20],
};

interface UnidadReconocida {
  label: string;
  range: readonly [number, number];
}

/**
 * The ONE place that decides which units a list really contains. Unknown and
 * blank entries are dropped, duplicates collapse on the accent-free key, and
 * the survivors are sorted by age (then key) so every consumer — the age range
 * AND the unit names — sees the same units in the same order no matter how the
 * metadata was typed.
 */
function unidadesReconocidas(unidades?: string[] | null): UnidadReconocida[] {
  if (!Array.isArray(unidades)) return [];
  const byKey = new Map<string, UnidadReconocida>();
  for (const unidad of unidades) {
    if (typeof unidad !== 'string') continue;
    const label = unidad.trim();
    const key = sinAcentos(label);
    // Own-property lookup: inherited Object.prototype keys are not unit names.
    const range = Object.prototype.hasOwnProperty.call(UNIDAD_RANGES, key)
      ? UNIDAD_RANGES[key]
      : undefined;
    if (!range || byKey.has(key)) continue;
    byKey.set(key, { label, range });
  }
  return [...byKey.values()].sort(
    (a, b) =>
      a.range[0] - b.range[0] || a.range[1] - b.range[1] || sinAcentos(a.label).localeCompare(sinAcentos(b.label)),
  );
}

/** Accept legacy/dirty values, return undefined when nothing is usable. */
export function unidadRango(unidades?: string[] | null): string | undefined {
  const found = unidadesReconocidas(unidades);
  if (!found.length) return undefined;
  const min = Math.min(...found.map((unidad) => unidad.range[0]));
  const max = Math.max(...found.map((unidad) => unidad.range[1]));
  if (!Number.isFinite(min) || !Number.isFinite(max)) return undefined;
  return `${min}-${max}`;
}

/**
 * Title-cased unit NAMES for the very same list unidadRango unions — the labels
 * `educationalLevel` publishes. Sorted by age and deduped, so [] means "nothing
 * recognized" and the caller decides between a string, an array or no key.
 */
export function unidadNombres(unidades?: string[] | null): string[] {
  return unidadesReconocidas(unidades).map((unidad) => titleCase(unidad.label));
}

/**
 * '20 minutos' -> 'PT20M', '90 minutos' -> 'PT1H30M', '01 hora' -> 'PT1H',
 * '1 hora 30 minutos' -> 'PT1H30M', 'todo el día' -> 'P1D'.
 * Hour forms exist in production ('01 hora'), so hours, minutes and both
 * together are understood; anything else stays undefined (total <= 0 too).
 */
export function duracionIso(duracion?: string | null): string | undefined {
  if (typeof duracion !== 'string') return undefined;
  const value = duracion.trim().toLowerCase();
  if (!value) return undefined;
  if (sinAcentos(value) === 'todo el dia') return 'P1D';

  let hours = 0;
  let minutes = 0;
  const withHours = value.match(/^(\d+)\s*horas?(?:\s+(\d+)\s*minutos?)?$/);
  if (withHours) {
    hours = Number.parseInt(withHours[1], 10);
    minutes = withHours[2] ? Number.parseInt(withHours[2], 10) : 0;
  } else {
    const minutesOnly = value.match(/^(\d+)\s*minutos$/);
    if (!minutesOnly) return undefined;
    minutes = Number.parseInt(minutesOnly[1], 10);
  }

  const total = hours * 60 + minutes;
  if (!Number.isFinite(total) || total <= 0) return undefined;

  const isoHours = Math.floor(total / 60);
  const isoMinutes = total % 60;
  let iso = 'PT';
  if (isoHours > 0) iso += `${isoHours}H`;
  if (isoMinutes > 0) iso += `${isoMinutes}M`;
  return iso;
}

/**
 * '04 participantes' -> {value: 4, ...}, 'individual' -> 1,
 * 'Toda la Unidad' -> 'Toda la Unidad': schema.org allows Text on
 * numberOfPlayers, so a label without digits is kept instead of dropped.
 */
export function cantidadPlayers(
  cantidad?: string | null,
): QuantitativePlayers | number | string | undefined {
  if (typeof cantidad !== 'string') return undefined;
  const trimmed = cantidad.trim();
  const value = trimmed.toLowerCase();
  if (!value) return undefined;
  if (value === 'individual') return 1;

  const match = value.match(/(\d+)/);
  if (!match) return trimmed;
  const parsed = Number.parseInt(match[1], 10);
  if (!Number.isFinite(parsed)) return undefined;

  return { '@type': 'QuantitativeValue', value: parsed, minValue: parsed, maxValue: parsed, unitText: 'People' };
}

/** Title-cased, deduped Place list; empty input -> undefined. */
export function lugaresPlaces(lugares?: string[] | null): NamedPlace[] | undefined {
  const names = cleanNames(lugares);
  if (!names) return undefined;
  return names.map((name) => ({ '@type': 'Place', name }));
}

/** Title-cased, deduped Thing list; empty input -> undefined. */
export function areasThings(areas?: string[] | null): NamedThing[] | undefined {
  const names = cleanNames(areas);
  if (!names) return undefined;
  return names.map((name) => ({ '@type': 'Thing', name }));
}

function cleanNames(values: string[] | null | undefined): string[] | undefined {
  if (!Array.isArray(values)) return undefined;
  const seen = new Set<string>();
  const names: string[] = [];
  for (const raw of values) {
    if (typeof raw !== 'string') continue;
    const name = titleCase(raw);
    if (!name) continue;
    const key = sinAcentos(name);
    if (seen.has(key)) continue;
    seen.add(key);
    names.push(name);
  }
  return names.length ? names : undefined;
}

/**
 * Plain strings (materials/tools), never title-cased.
 * The comma split does NOT happen here: it lives in toStringArray, which turns
 * the creation form's comma-separated `materiales` into this list — keywordsFor
 * relies on that same split for legacy tag strings. Objectives do NOT split;
 * objetivosQuest hands toStringArray an array, so no comma string reaches it.
 */
export function stringsAThing(valores?: string[] | string | null): string[] | undefined {
  const items = toStringArray(valores);
  return items.length ? items : undefined;
}

/**
 * Single Thing holding every objective, description joined with '. '.
 * A legacy string is ONE objective: splitting it on commas would invent extra
 * objectives out of a sentence like 'Trabajar en equipo, escucha activa'.
 */
export function objetivosQuest(objetivos?: string[] | string | null): QuestThing | undefined {
  const source: string[] | null = Array.isArray(objetivos)
    ? objetivos
    : typeof objetivos === 'string'
      ? [objetivos]
      : null;
  const parts = toStringArray(source)
    .map((item) => item.replace(/\.$/, ''))
    .filter((item) => item.length > 0);
  if (!parts.length) return undefined;
  const joined = parts.join('. ');
  const description = /[.!?]$/.test(joined) ? joined : `${joined}.`;
  return { '@type': 'Thing', name: 'Objetivos', description };
}

/** Normalize legacy `string[] | comma-separated string` metadata into a clean list. */
export function toStringArray(value?: string[] | string | null): string[] {
  const source: unknown[] = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : [];
  const items: string[] = [];
  const seen = new Set<string>();
  for (const entry of source) {
    if (typeof entry !== 'string') continue;
    const item = entry.trim();
    if (!item || seen.has(item)) continue;
    seen.add(item);
    items.push(item);
  }
  return items;
}
