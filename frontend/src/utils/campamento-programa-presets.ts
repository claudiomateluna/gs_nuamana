import type {
  CampamentoProgramaData,
  MomentoGrupalItem,
  ActividadUnidadItem,
  RamaUnidadTipo
} from '@/types/campamento-programa'

export interface BloqueCronogramaUnidad {
  id: string
  hora_inicio: string
  hora_fin: string
  titulo: string
  tipo: 'momento_grupal' | 'actividad_unidad'
  es_invariable: boolean
  es_dia_completo?: boolean
  descripcion?: string
  responsable?: string
  lugar_recinto?: string
  materiales?: string
  objetivo_progresion?: string
}

/**
 * Genera el conjunto de Momentos Grupales tradicionales para un campamento scout
 */
export function generarMomentosGrupalesPredeterminados(dias: number = 4): MomentoGrupalItem[] {
  const momentos: MomentoGrupalItem[] = []

  // Día 1: Llegada e Inauguración
  momentos.push({
    id: 'mg-d1-llegada',
    dia_numero: 1,
    hora_inicio: '10:00',
    hora_fin: '11:45',
    es_dia_completo: false,
    titulo: 'Llegada, Descarga de Buses y Asignación de Subcampos',
    descripcion: 'Descarga comunitaria de carpas y equipos. Reconocimiento del terreno y delimitación de rincones.',
    responsable: 'Jefatura de Grupo',
    lugar_recinto: 'Campo general',
    materiales: 'Carrocería, cuerdas, botiquín de campo'
  })

  momentos.push({
    id: 'mg-d1-inauguracion',
    dia_numero: 1,
    hora_inicio: '12:00',
    hora_fin: '12:45',
    es_dia_completo: false,
    titulo: 'Ceremonia Oficial de Inauguración de Campamento',
    descripcion: 'Izamiento inaugural del pabellón, presentación de subcampos y palabras del Jefe de Grupo.',
    responsable: 'Jefatura de Grupo',
    lugar_recinto: 'Mástil central'
  })

  // Días intermedios: Izamiento diario y Arriamiento
  for (let d = 2; d <= dias; d++) {
    momentos.push({
      id: `mg-d${d}-izamiento`,
      dia_numero: d,
      hora_inicio: '08:30',
      hora_fin: '09:00',
      es_dia_completo: false,
      titulo: 'Izamiento General y Reflexión de la Mañana',
      descripcion: 'Inspección de orden matutino, izamiento del pabellón patrio e institucional y pensamiento guía.',
      responsable: d % 2 === 0 ? 'Tropa y Compañía' : 'Manada y Clan',
      lugar_recinto: 'Mástil central'
    })

    if (d < dias) {
      momentos.push({
        id: `mg-d${d}-arriamiento`,
        dia_numero: d,
        hora_inicio: '19:30',
        hora_fin: '20:00',
        es_dia_completo: false,
        titulo: 'Arriamiento del Pabellón',
        descripcion: 'Cierre del día cívico y paso de consigna para guardias.',
        responsable: 'Jefatura de Turno',
        lugar_recinto: 'Mástil central'
      })
    }
  }

  // Gran Juego Grupal en el día intermedio
  const diaGranJuego = Math.max(2, Math.floor(dias / 2))
  momentos.push({
    id: `mg-d${diaGranJuego}-gran-juego`,
    dia_numero: diaGranJuego,
    hora_inicio: '10:00',
    hora_fin: '17:30',
    es_dia_completo: true,
    titulo: 'Gran Juego Grupal Scout (Jornada Comunitaria)',
    descripcion: 'Gran aventura temática donde participan todas las ramas integradas en patrullas mixtas o bases de destreza.',
    responsable: 'Equipo de Jefatura y Clan',
    lugar_recinto: 'Todo el recinto de campamento',
    materiales: 'Pistas, banderas, lana, pintura, distintivos'
  })

  // Penúltima noche: Gran Fogón de Campamento
  const diaFogon = dias > 1 ? dias - 1 : 1
  momentos.push({
    id: `mg-d${diaFogon}-fogon`,
    dia_numero: diaFogon,
    hora_inicio: '21:00',
    hora_fin: '23:30',
    es_dia_completo: false,
    titulo: 'Gran Fogón de Campamento y Velada Tradicional',
    descripcion: 'Presentación de sketches por patrullas, danzas, canciones de campamento y momento místico.',
    responsable: 'Clan y Avanzada',
    lugar_recinto: 'Círculo de fuego',
    materiales: 'Leña gruesa, antorchas, cancionero'
  })

  // Último día: Desarme y Clausura
  momentos.push({
    id: `mg-d${dias}-desarme`,
    dia_numero: dias,
    hora_inicio: '09:00',
    hora_fin: '12:00',
    es_dia_completo: false,
    titulo: 'Desarme de Construcciones y Limpieza de Campo',
    descripcion: 'Desarme de toldos y construcciones. Desmonte de letrinas y línea de barrido ("Dejar el lugar mejor de como lo encontramos").',
    responsable: 'Todas las Unidades',
    lugar_recinto: 'Todo el campo'
  })

  momentos.push({
    id: `mg-d${dias}-clausura`,
    dia_numero: dias,
    hora_inicio: '12:30',
    hora_fin: '13:30',
    es_dia_completo: false,
    titulo: 'Ceremonia de Clausura, Entregas y Promesas',
    descripcion: 'Entrega de reconocimientos, insignias de campamento, ceremonias de promesas y círculo de la hermandad.',
    responsable: 'Jefatura de Grupo',
    lugar_recinto: 'Mástil central'
  })

  return momentos
}

/**
 * Retorna el cronograma combinado para una unidad y día específico,
 * fusionando los Momentos Grupales (bloqueados como invariables) con las
 * Actividades Propias de la Unidad, ordenados cronológicamente por hora_inicio.
 */
export function obtenerCronogramaCombinadoUnidad(
  programa: CampamentoProgramaData,
  unidad: RamaUnidadTipo,
  diaNumero: number
): BloqueCronogramaUnidad[] {
  const bloques: BloqueCronogramaUnidad[] = []

  // 1. Inyectar Momentos Grupales del día (Invariables)
  const momentosDia = (programa.momentos_grupales || []).filter(
    m => m.dia_numero === diaNumero
  )
  for (const mg of momentosDia) {
    bloques.push({
      id: mg.id,
      hora_inicio: mg.hora_inicio,
      hora_fin: mg.hora_fin,
      titulo: mg.titulo,
      tipo: 'momento_grupal',
      es_invariable: true,
      es_dia_completo: mg.es_dia_completo,
      descripcion: mg.descripcion,
      responsable: mg.responsable,
      lugar_recinto: mg.lugar_recinto,
      materiales: mg.materiales
    })
  }

  // 2. Inyectar Actividades Propias de esta Unidad en el día
  const actividadesDia = (programa.actividades_unidades || []).filter(
    a => a.unidad_nombre === unidad && a.dia_numero === diaNumero
  )
  for (const act of actividadesDia) {
    bloques.push({
      id: act.id,
      hora_inicio: act.hora_inicio,
      hora_fin: act.hora_fin,
      titulo: act.titulo,
      tipo: 'actividad_unidad',
      es_invariable: false,
      descripcion: act.descripcion,
      responsable: act.responsable,
      materiales: act.materiales,
      objetivo_progresion: act.objetivo_progresion
    })
  }

  // Ordenar cronológicamente
  bloques.sort((a, b) => {
    if (a.es_dia_completo && !b.es_dia_completo) return -1
    if (!a.es_dia_completo && b.es_dia_completo) return 1
    return a.hora_inicio.localeCompare(b.hora_inicio)
  })

  return bloques
}
