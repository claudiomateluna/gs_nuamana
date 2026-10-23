import type { CampamentoProgramaData } from './campamento-programa'

export interface CotizacionBusItem {
  id: string
  empresa_nombre: string
  contacto_nombre?: string
  telefono?: string
  email?: string
  capacidad_asientos: number
  monto_total_clp: number
  incluye_peajes: boolean
  incluye_combustible: boolean
  incluye_viatico_chofer: boolean
  observaciones?: string
  adjudicada: boolean
  fecha_cotizacion?: string
}

export type EvaluacionPuntoBus = 'bien' | 'mal' | 'pendiente'

export interface PuntoInspeccionBusItem {
  id: string
  label: string
  estado: EvaluacionPuntoBus
  observaciones?: string
}

export interface InspeccionFotoItem {
  id: string
  etiqueta: string
  foto_url: string
  fecha: string
}

export interface InspeccionBusData {
  id: string
  bus_cotizacion_id?: string
  patente: string
  empresa: string
  nombre_chofer_1: string
  rut_chofer_1: string
  nombre_chofer_2?: string
  rut_chofer_2?: string
  nombre_auxiliar?: string
  rut_auxiliar?: string
  datos_dueno?: string
  destino_viaje?: string
  numero_pasajeros?: number
  kilometraje_inicial?: string
  hora_salida?: string
  fecha_salida?: string
  kilometraje_final?: string
  hora_llegada?: string
  fecha_llegada?: string
  permiso_circulacion: boolean
  revision_tecnica: boolean
  seguro_obligatorio: boolean
  puntos: PuntoInspeccionBusItem[]
  fotos: InspeccionFotoItem[]
  aprobado_final: boolean
  observaciones_generales?: string
}

export interface CotizacionLugarItem {
  id: string
  nombre_lugar: string
  comuna_region: string
  contacto_nombre?: string
  telefono?: string
  modalidad_cobro: 'por_persona_dia' | 'global_fijo'
  valor_unitario_clp: number
  monto_total_calculado_clp: number
  tiene_agua_potable: boolean
  tiene_banos_letrinas: boolean
  tiene_luz_electrica: boolean
  cercania_posta_km?: number
  observaciones?: string
  adjudicada: boolean
}

export interface OtroCostoCampamentoItem {
  id: string
  descripcion: string
  categoria: 'materiales' | 'salud_botiquin' | 'combustible_gas' | 'seguro' | 'imprevistos'
  monto_clp: number
}

export interface CampamentoPreparacion {
  id: string
  nombre: string
  tipo_campamento: 'verano' | 'primavera' | 'invierno' | 'salida_corta'
  lugar_nombre: string
  fecha_inicio: string
  fecha_fin: string
  dias_totales: number
  
  // Responsable de Campamento (exclusivo Rol Dirigente o Rol Guiadora)
  responsable_id?: string
  responsable_nombre?: string
  responsable_rol?: 'Dirigente' | 'Guiadora'

  // Conteo de asistentes por estamento
  asistentes_nnj: number
  asistentes_jefatura: number
  asistentes_apoderados: number
  
  // Configuración de cuotas y subsidio voluntario
  eximir_jefatura: boolean
  eximir_apoderados: boolean
  margen_imprevistos_pct: number

  // Módulos integrados
  menu_id: string
  cotizaciones_bus: CotizacionBusItem[]
  bus_adjudicado_id?: string
  inspeccion_bus?: InspeccionBusData
  
  cotizaciones_lugar: CotizacionLugarItem[]
  lugar_adjudicado_id?: string
  
  otros_costos: OtroCostoCampamentoItem[]
  programa?: CampamentoProgramaData
  
  created_at: string
  updated_at: string
}
