import Dexie, { type Table } from 'dexie';

export interface PerfilOffline {
  id: string;
  nombres: string;
  apellidos: string;
  rut: string;
  unidad_id: number | null;
  rol_id: number | null;
  created_at?: string;
  roles?: { name: string } | null;
  unidades?: { nombre: string } | null;
}

export interface FichaMedicaOffline {
  perfil_id: string;
  grupo_sangre: string | null;
  alergias_medicamentos: string | null;
  alergias_alimentarias: string | null;
  enfermedades_cronicas: string | null;
  prevision: string | null;
  seguro_complementario: string | null;
  comentarios_salud?: string | null;
  medicamentos_uso_comun?: string | null;
  restricciones_alimentarias?: string | null;
}

export interface ContactoEmergenciaOffline {
  id: string;
  perfil_id: string;
  nombre: string;
  telefono: string;
  parentesco: string;
  es_primario: boolean;
}

export interface AutorizacionOffline {
  id: string;
  perfil_id: string;
  actividad_id: string;
  actividad_titulo: string;
  firmado: boolean;
  nombre_firmante: string | null;
  fecha_firma: string | null;
  firma_url: string | null;
}

export interface ProgresionAvanceOffline {
  id: string;
  perfil_id: string;
  objetivo_id: string;
  estado: string | null;
  valor: number | null;
  valor_apoderado: number | null;
  comentario_apoderado: string | null;
  fecha_comentario_apoderado: string | null;
  fecha_logro: string | null;
  validado_por: string | null;
}

export interface CicloActivoOffline {
  id: string;
  nombre: string;
  fase_actual: number;
  fecha_inicio: string;
  fecha_fin: string;
  unidad_id: number;
  articulo_juego_id: string | null;
  articulo_juego?: {
    id: string;
    slug: string;
    titulo: string;
    extracto: string;
    imagen_destacada: string | null;
  } | null;
}

export interface PropuestaOffline {
  id: string;
  ciclo_id: string;
  titulo: string;
  descripcion: string;
  seleccionada: boolean;
  fecha_programada: string | null;
  es_especialidad: boolean;
  articulo_id: string | null;
  articulo?: {
    id: string;
    slug: string;
    titulo: string;
    extracto: string;
  } | null;
  autor_nombres?: string | null;
  autor_apellidos?: string | null;
}

export interface ArticuloActividadOffline {
  id: string;
  slug: string;
  titulo: string;
  extracto: string;
  contenido: string;
  categoria: string;
  imagen_destacada: string | null;
}

export interface OutboxItem {
  id?: number;
  tabla: 'progresion_avance' | 'tesoreria_movimientos' | 'actas';
  accion: 'INSERT' | 'UPDATE' | 'DELETE';
  payload: any;
  timestamp: number;
  intentos: number;
  error_ultimo?: string;
}

export interface ProgresionObjetivoOffline {
  id: string;
  unidad_id: number;
  nombre: string;
  rango_edad: string;
  area_id: number | null;
  orden?: number;
}

export interface ProgresionEtapaOffline {
  id: number;
  unidad_id: number;
  nombre: string;
  rango_edad?: string;
  orden?: number;
}

export interface ProgresionAreaOffline {
  id: number;
  nombre: string;
  color?: string;
  icono?: string;
}

class NuaManaOfflineDB extends Dexie {
  perfiles!: Table<PerfilOffline, string>;
  fichas_medicas!: Table<FichaMedicaOffline, string>;
  contactos_emergencia!: Table<ContactoEmergenciaOffline, string>;
  autorizaciones!: Table<AutorizacionOffline, string>;
  progresion_avance!: Table<ProgresionAvanceOffline, string>;
  progresion_objetivos!: Table<ProgresionObjetivoOffline, string>;
  progresion_etapas!: Table<ProgresionEtapaOffline, number>;
  progresion_areas!: Table<ProgresionAreaOffline, number>;
  ciclo_activo!: Table<CicloActivoOffline, string>;
  propuestas!: Table<PropuestaOffline, string>;
  articulos_actividades!: Table<ArticuloActividadOffline, string>;
  outbox_queue!: Table<OutboxItem, number>;

  constructor() {
    super('NuaManaOfflineDB');
    this.version(2).stores({
      perfiles: 'id, rut, unidad_id',
      fichas_medicas: 'perfil_id',
      contactos_emergencia: 'id, perfil_id',
      autorizaciones: 'id, perfil_id, actividad_id',
      progresion_avance: 'id, perfil_id, objetivo_id',
      progresion_objetivos: 'id, unidad_id',
      progresion_etapas: 'id, unidad_id',
      progresion_areas: 'id',
      ciclo_activo: 'id, unidad_id',
      propuestas: 'id, ciclo_id, seleccionada',
      articulos_actividades: 'id, slug',
      outbox_queue: '++id, tabla, timestamp'
    });
  }
}

export const db = new NuaManaOfflineDB();
