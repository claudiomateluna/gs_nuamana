export type RamaUnidadTipo = 'Manada' | 'Compañía' | 'Tropa' | 'Avanzada' | 'Clan'

export interface MomentoGrupalItem {
  id: string
  dia_numero: number // 1 a N
  hora_inicio: string // "08:30"
  hora_fin: string // "09:00"
  es_dia_completo: boolean
  titulo: string // Ej: "Inauguración y Levantamiento de Campo", "Gran Juego Grupal", "Fogón"
  descripcion?: string
  responsable: string // Ej: "Jefatura de Grupo", "Tropa", "Clan"
  lugar_recinto?: string // Ej: "Explanada central", "Playa"
  materiales?: string
}

export interface ActividadUnidadItem {
  id: string
  unidad_nombre: RamaUnidadTipo
  dia_numero: number
  hora_inicio: string // "10:30"
  hora_fin: string // "12:30"
  titulo: string // Ej: "Construcción de Rincón de Patrulla", "Caza de Mowgli"
  descripcion?: string
  objetivo_progresion?: string // Ej: "Corporalidad - Cabuyería", "Carácter"
  responsable: string // Ej: "Jefe de Tropa", "Akela"
  materiales?: string
}

export interface CampamentoProgramaData {
  momentos_grupales: MomentoGrupalItem[]
  actividades_unidades: ActividadUnidadItem[]
}
