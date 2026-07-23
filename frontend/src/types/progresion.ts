import type { Perfil, ProgresionObjetivo, ProgresionArea, Ceremonia } from '@/types'

export interface EspecialidadActividad {
  id: string
  descripcion?: string
  completada?: boolean
  evidencia_texto?: string
  evidencia_url?: string
  autoevaluacion?: string
  comentario_monitor?: string | null
  fecha_limite?: string
  articulo_id?: string | null
  actividad_programada_id?: string | null
  articulos?: { id: string; titulo: string; slug: string; estado?: string } | null
  actividades_programadas?: { id: string; nombre: string; fecha_inicio: string; fecha_fin?: string; tipo?: string; lugar?: string; estado?: string } | null
}

export interface EspecialidadDefinicion {
  id: string
  nombre: string
  campo_interes?: string
  descripcion?: string
}

export interface EspecialidadPersonal {
  id: string
  perfil_id: string
  campo_interes: string
  fase: string
  meta_general?: string
  diagnostico_previo?: string
  monitor_nombre?: string
  monitor_perfil_id?: string | null
  estado?: string
  nombre_personalizado?: string
  definicion_id?: string
  evaluacion_final?: string
  objetivo_cumplido?: boolean
  aprobado_monitor?: boolean
  comentario_monitor?: string | null
  fecha_inicio?: string
  fecha_fin?: string
  fecha_entrega?: string
  firma_dirigente_b64?: string
  firma_monitor_b64?: string
  created_at?: string
  updated_at?: string
  especialidades_definiciones?: EspecialidadDefinicion | null
  especialidades_actividades?: EspecialidadActividad[]
  perfil?: Pick<Perfil, 'id' | 'nombres' | 'apellidos' | 'unidad_id'> | null
}

export interface AgendaPersonal {
  id: string
  perfil_id: string
  etapa_progresion?: string
  compromiso_texto?: string
  quien_soy?: string
  vision_futuro?: string
  como_me_visualizo?: string
  que_hago_hoy?: string
  fecha_fuego?: string
  fecha_antorcha?: string
  fecha_partida?: string
  updated_at?: string
}

export interface ProyectoObjetivoConJoins {
  id: string
  agenda_id?: string
  objetivo_id?: string
  meta_personal?: string
  estado?: string
  evidencia_texto?: string
  evidencia_url?: string
  evaluacion_lider?: string
  updated_at?: string
  progresion_objetivos?: (ProgresionObjetivo & { progresion_areas?: ProgresionArea; texto_terminal?: string; texto_infantil?: string }) | null
  proyectos?: { titulo?: string } | null
}

export interface SolicitudCompetenciaConJoins {
  id: string
  perfil_id: string
  area_competencia: string
  estado: string
  justificacion?: string
  justificacion_nnj?: string
  evaluacion_lider?: string
  evidencia_url?: string
  proyecto_id?: string
  created_at?: string
  proyectos?: { titulo?: string } | null
  aprobado_por?: { nombres?: string; apellidos?: string } | null
}

export interface CeremoniaConJoins extends Ceremonia {
  tipo?: string
  campamento?: string
  lugar?: string
  foto_url?: string
  radar_snapshot?: RadarSnapshotItem[]
  unidad_origen?: { nombre?: string } | null
  unidad_origen_id?: number
  unidad_destino?: { nombre?: string } | null
  padrino?: { nombres?: string; apellidos?: string } | null
  madrina?: { nombres?: string; apellidos?: string } | null
  mensajes?: { id: string; remitente_id: string; mensaje: string; remitente?: { nombres?: string; apellidos?: string } | null }[]
}

export interface PresupuestoItem {
  tipo: string
  nombre?: string
  descripcion?: string
  fuente?: string
  actividad_nombre?: string
  cantidad: number
  costo_unitario: number
}

export interface FinanciamientoItem {
  nombre?: string
  lugar?: string
  recursos?: string
  fecha?: string
}

export interface ProjectActivity {
  id: string
  nombre?: string
  descripcion?: string
  fecha?: string
  articulo_id?: string
}

export interface RadarSnapshotItem {
  subject: string
  Autoevaluacion?: number
  Apoderado?: number
  Dirigente?: number
}

export interface NotificationPayload {
  perfil_id: string
  mensaje: string
  tipo: string
  link_url: string
}

export interface SheetParticipant {
  perfil_id: string
  tarea_asignada?: string
  rol_en_proyecto?: string
  perfiles?: { nombres?: string; apellidos?: string } | null
}

export interface Proyecto {
  id: string
  titulo: string
  es_grupal?: boolean
  fase?: string
  campo_prioritario?: string
  paso1_que_haremos?: string
  paso2_por_que_diagnostico?: string
  paso2_por_que_justificacion?: string
  paso3_que_queremos_lograr?: string
  paso3_para_que_general?: string
  paso3_para_que_especificos?: string
  paso4_por_que?: string
  paso4_para_quienes?: string
  paso5_donde?: string
  paso6_como_lo_haremos?: string
  paso7_cuales_actividades?: string
  paso8_cronograma?: string
  paso9_quienes?: string
  paso10_cuanto_presupuesto?: string
  paso11_con_que_financiamiento?: string
  paso12_como_lo_hicimos?: string
  participantes_manuales?: string
  competencias_asociadas?: string
  perfil_id?: string
  unidad_id?: number
  created_at?: string
}

export interface ProgresionUnidadProps {
  perfil: Perfil
  userPerfil: Perfil
}
