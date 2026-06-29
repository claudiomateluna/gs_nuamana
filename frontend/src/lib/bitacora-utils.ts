/**
 * Retorna el nombre tradicional de la bitácora/diario según la unidad.
 * @param unidadId ID de la unidad (1: Manada, 2: Compañía, 3: Tropa, 4: Avanzada, 5: Clan)
 * @returns string Nombre tradicional
 */
export function getBitacoraName(unidadId: number | null | undefined): string {
  switch (unidadId) {
    case 1:
      return 'Libro de Mowha';
    case 2:
    case 3:
      return 'Tally';
    case 4:
    case 5:
      return 'Bitácora';
    default:
      return 'Bitácora de Unidad';
  }
}

/**
 * Retorna una descripción sugerida para la bitácora según la unidad.
 */
export function getBitacoraDescription(unidadId: number | null | undefined): string {
  switch (unidadId) {
    case 1:
      return 'Las historias y aventuras del Pueblo Libre en la Selva de Seeonee.';
    case 2:
    case 3:
      return 'El registro de nuestras patrullas, expediciones y la vida al aire libre.';
    case 4:
    case 5:
      return 'Un espacio para la reflexión, los desafíos y las vivencias de nuestra ruta.';
    default:
      return 'Historias y vivencias de nuestra unidad.';
  }
}
