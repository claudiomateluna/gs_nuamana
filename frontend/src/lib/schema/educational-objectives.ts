/**
 * Educational Objectives (relational table ↔ schema.org)
 * The article page renders objectives from articulo_objetivos_educativos joined
 * against progresion_objetivos, NOT from the metadata JSONB — so the JSON-LD
 * must read the same source, otherwise the schema would advertise objectives
 * the reader never sees. The route and the client share this select + mapper
 * to keep both views literally identical.
 */

import type { ObjEducacionMeta } from '@/types';

export const EDU_OBJECTIVES_SELECT =
  'objetivo_id, como_se_cumple, objetivo:progresion_objetivos(id, texto_infantil, texto_terminal, rango_edad, area_id, unidad_id, area:progresion_areas(nombre), unidad:unidades(nombre, colores))';

export interface EduObjectiveRow {
  objetivo_id: string;
  como_se_cumple: string | null;
  objetivo: {
    id: string;
    texto_infantil: string;
    texto_terminal: string;
    rango_edad: string;
    area: { nombre: string } | null;
    unidad: { nombre: string; colores: { primario?: string } | string | null } | null;
  } | null;
}

/** Rows → ObjEducacionMeta with the exact field mapping the article page displays. */
export function mapEduObjectives(rows: EduObjectiveRow[] | null | undefined): ObjEducacionMeta[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => {
    const colores = row.objetivo?.unidad?.colores;
    return {
      id: row.objetivo_id,
      texto: row.objetivo?.texto_infantil,
      texto_terminal: row.objetivo?.texto_terminal,
      rango_edad: row.objetivo?.rango_edad,
      unidad: row.objetivo?.unidad?.nombre,
      area: row.objetivo?.area?.nombre,
      color: colores && typeof colores === 'object' ? colores.primario : undefined,
      como_se_cumple: row.como_se_cumple,
    };
  });
}
