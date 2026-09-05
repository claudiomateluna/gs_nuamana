// Constante de mapeo slug → id (replica del mapa en unidad/[slug]/page.tsx)
// Usada por la action server-side donde no tenemos la función del page.tsx
export const UNIT_SLUG_TO_ID: Record<string, number> = {
  manada: 1, compania: 2, tropa: 3, avanzada: 4, clan: 5
};

export const UNIT_ID_TO_SLUG: Record<number, string> = {
  1: 'manada', 2: 'compania', 3: 'tropa', 4: 'avanzada', 5: 'clan'
};

// Tipo mínimo de la fila de unidades (solo lo que necesitamos)
export interface UnitNameRow {
  id: number;
  nombre: string;
  nombre_unidad?: string | null;
}

// Extrae el slug de un href de unidad: '/unidad/manada' → 'manada', null si no es href de unidad
export function extractUnitSlug(href: string | null): string | null {
  if (!href) return null;
  const match = /^\/unidad\/([^/?#]+)/.exec(href);
  return match ? match[1] : null;
}

// Compone el título: "Compañía (Põ Nui Vaikava)" — o "Compañía" si no hay nombre_unidad
export function composeUnitTitle(
  nombre: string,
  nombreUnidad: string | null | undefined,
): string {
  return nombreUnidad ? `${nombre} (${nombreUnidad})` : nombre;
}

// Aplica composición recursiva sobre un árbol MenuItemNode[]:
// Para cada nodo cuyo href matchea /unidad/<slug>, reemplaza titulo con composeUnitTitle
// Busca en unidadesMap por slug para obtener nombre + nombre_unidad.
// Si no encuentra la unidad en el mapa, deja el titulo original (fallback).
export function enhanceMenuTitles<T extends { titulo: string; href?: string | null; children?: T[] }>(
  items: T[],
  unidadesMap: Record<string, UnitNameRow>,
): T[] {
  return items.map((item) => {
    const slug = extractUnitSlug(item.href ?? null);
    const unidad = slug ? unidadesMap[slug] : undefined;
    const titulo = unidad ? composeUnitTitle(unidad.nombre, unidad.nombre_unidad ?? null) : item.titulo;
    const children = item.children && item.children.length > 0
      ? enhanceMenuTitles(item.children, unidadesMap)
      : item.children;
    if (children === item.children && titulo === item.titulo) return item;
    return { ...item, titulo, children };
  });
}

// Construye el mapa slug→row desde un array de unidades
export function buildUnitNameMap(unidades: UnitNameRow[]): Record<string, UnitNameRow> {
  const map: Record<string, UnitNameRow> = {};
  for (const unidad of unidades) {
    const slug = UNIT_ID_TO_SLUG[unidad.id];
    if (slug) map[slug] = unidad;
  }
  return map;
}
