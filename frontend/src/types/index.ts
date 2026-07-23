/**
 * Tipos de dominio para Grupo Scout Nua Mana.
 *
 * ANTES: 559 usos de `any` dispersos en todo el proyecto.
 * AHORA: una sola fuente de verdad para el modelo de datos online.
 *
 * Estos tipos reflejan los joins de Supabase (no las tablas crudas).
 * Ejemplo: Perfil incluye `roles` y `unidades` por el join en fetchProfile.
 */

// -- Entidades base ---------------------------------------------------------

export interface Rol {
  id: number
  name: string
}

export interface Unidad {
  id: number
  nombre: string
  colores?: { primario?: string | null; secundario?: string | null } | string | null
  logo_unidad_url?: string | null
  logo_rama_url?: string | null
}

// -- Perfil (con joins de Supabase) -----------------------------------------

export interface Perfil {
  id: string
  nombres: string
  apellidos: string
  rut: string
  email?: string | null
  telefono?: string | null
  estado?: string | null
  rol_id: number | null
  unidad_id?: number | null
  created_at?: string | null
  pertenece_grupo_nua_mana?: boolean | null
  apoderado_id?: string | null

  // Datos personales
  fecha_nacimiento?: string | null
  direccion?: string | null
  comuna?: string | null
  colegio?: string | null
  nivel_educacional?: string | null
  sexo?: string | null
  religion?: string | null

  // Ficha medica
  grupo_sangre?: string | null
  alergias?: string | null
  enfermedades_cronicas?: string | null
  prevision?: string | null
  seguro_complementario?: string | null
  comentarios_salud?: string | null
  medicamentos_uso_comun?: string | null
  restricciones_alimentarias?: string | null
  sistema_salud?: string | null
  detalle_sistema_salud?: string | null
  tipo_sangre?: string | null
  antecedentes_medicos?: string | null
  tratamientos_medicos?: string | null
  medicamentos?: string | null
  dieta_alimentaria?: string[] | null
  tiene_alergias?: boolean

  // Autorizaciones
  autoriza_fotos?: boolean | null
  fe_publica?: boolean | null

  // Datos calculados
  edad?: number

  // Progresion
  progresion_etapa_id?: number | null

  // Joins
  roles?: Rol | null
  unidades?: Unidad | null
  contactos_emergencia?: ContactoEmergencia[]
  apoderado?: Pick<Perfil, 'id' | 'nombres' | 'apellidos' | 'telefono' | 'email'> | null
}

// -- Contactos de emergencia ------------------------------------------------

export interface ContactoEmergencia {
  id: string
  perfil_id: string
  nombre: string
  telefono: string
  parentesco: string
  es_primario: boolean
}

// -- Actas ------------------------------------------------------------------

export interface ActaTema {
  id: string
  acta_id: string
  titulo: string
  descripcion?: string | null
}

export interface ActaAcuerdo {
  id: string
  acta_id: string
  descripcion: string
  responsable?: string | null
  fecha_limite?: string | null
  cumplido?: boolean
  fichas_vinculadas?: Array<{ id: string; titulo: string; slug: string }> | null
}

export interface ActaFirma {
  id: string
  acta_id: string
  perfil_id: string
  firmado: boolean
  fecha_firma?: string | null
}

export interface ActaParticipante {
  id: string
  acta_id: string
  perfil_id: string
  rol_en_reunion?: string | null
}

export interface Acta {
  id: string
  titulo?: string | null
  fecha: string
  unidad_id?: number | null
  created_at?: string | null
  estado?: string | null
  tipo?: string | null
  codigo?: string | null
  resumen?: string | null
  confidencialidad?: string | null
  proxima_reunion?: string | null
  observaciones_finales?: string | null
  isPending?: boolean
  ingresado_por?: string | null
  // Joins
  unidades?: Pick<Unidad, 'nombre'> | null
  acta_temas?: ActaTema[]
  mi_firma?: ActaFirma | null
  mi_rol_reunion?: string | null
  acta_participantes?: ActaParticipante[]
  acta_acuerdos?: ActaAcuerdo[]
  acta_firmas?: ActaFirma[]
}

// -- Articulos / Blog -------------------------------------------------------

export interface Articulo {
  id: string
  slug: string
  titulo: string
  extracto?: string | null
  contenido?: string | null
  categoria?: string | null
  imagen_destacada?: string | null
  autor_id?: string | null
  metadata?: ArticuloMetadata | null
  etiquetas?: string[] | null
  estado?: string | null
  created_at?: string | null
  updated_at?: string | null
  // Joins
  autor?: Pick<Perfil, 'id' | 'nombres' | 'apellidos'> | null
  articulo_categorias?: ArticuloCategoriaJoin[] | null
  articulo_resenas?: ArticuloResena[] | null
}

export interface ArticuloMetadata {
  objetivos?: string[] | string | null
  materiales?: string[] | string | null
  unidades?: string[] | null
  areas?: string[] | null
  areas_desarrollo?: string[] | null
  lugares?: string[] | null
  lugar?: string[] | null
  duracion?: string | null
  cantidad?: string | null
  lugar_nacimiento?: string | null
  pais_nacimiento?: string | null
  fecha_nacimiento?: string | null
  lugar_hecho?: string | null
  pais_hecho?: string | null
  ano_hecho?: string | null
  variaciones?: string | null
  recomendaciones?: string | null
  justificacion_areas?: string | null
  objetivos_educativos?: ObjEducacionMeta[] | null
  descargas?: { nombre: string; url: string }[] | null
  [key: string]: unknown
}

export interface ObjEducacionMeta {
  id: string
  texto?: string
  texto_terminal?: string
  rango_edad?: string
  unidad?: string
  area?: string
  color?: string
  como_se_cumple?: string | null
}

export interface ArticuloCategoriaJoin {
  categoria_id: number
  categorias?: Categoria | null
}

// -- Categorias --------------------------------------------------------------

export interface Categoria {
  id: number
  nombre: string
  slug: string
  parent_id: number | null
}

// -- Resenas -----------------------------------------------------------------

export interface ArticuloResena {
  id: string
  calificacion: number
  comentario?: string | null
  es_anonimo?: boolean | null
  unidad_resena?: string | null
  edad_resena?: number | null
  unidad_color_resena?: string | null
  unidad_logo_resena?: string | null
  created_at?: string | null
  perfiles?: Pick<Perfil, 'nombres' | 'apellidos' | 'fecha_nacimiento'> | null
}

// -- Bitacoras --------------------------------------------------------------

// -- Bitacora ----------------------------------------------------------------

export interface BitacoraPreData {
  id?: string
  titulo: string
  historia: string
  fecha_suceso?: string | null
  excluir_dirigentes?: boolean
  imagenes?: string[]
}

export interface Bitacora {
  id: string
  titulo: string
  contenido?: string | null
  fecha?: string | null
  perfil_id?: string | null
  unidad_id?: number | null
  created_at?: string | null
  // Join
  perfiles?: Pick<Perfil, 'id' | 'nombres' | 'apellidos'> | null
}

// -- Inventario -------------------------------------------------------------

export interface InventarioItem {
  id: string
  nombre: string
  descripcion?: string | null
  estado?: string | null
  unidad_id?: number | null
  responsable_id?: string | null
  created_at?: string | null
  // Join
  unidades?: Pick<Unidad, 'nombre'> | null
}

// -- Tesoreria --------------------------------------------------------------

export interface TesoreriaItem {
  id: string
  nombre: string
  descripcion?: string | null
}

export interface TesoreriaMovimiento {
  id: string
  tipo: 'ingreso' | 'egreso'
  monto: number
  descripcion?: string | null
  mes?: number | null
  anio?: number | null
  dia?: number | null
  unidad_id?: number | null
  item_id?: string | null
  registrado_por?: string | null
  created_at?: string | null
  // Joins
  tesoreria_items?: TesoreriaItem | null
  unidades?: Pick<Unidad, 'nombre'> | null
  registrado_por_perfile?: Pick<Perfil, 'nombres' | 'apellidos'> | null
}

export interface Rendicion {
  id: string
  titulo?: string | null
  monto_total?: number | null
  estado?: string | null
  unidad_id?: number | null
  created_at?: string | null
  // Join
  unidades?: Pick<Unidad, 'nombre'> | null
}

// -- Actividades ------------------------------------------------------------

export interface ActividadProgramada {
  id: string
  nombre: string
  descripcion?: string | null
  fecha_inicio?: string | null
  fecha_fin?: string | null
  unidad_id?: number | null
  created_at?: string | null
  // Join
  unidades?: Pick<Unidad, 'nombre'> | null
}

// -- Autorizaciones ---------------------------------------------------------

export interface AutorizacionActividad {
  id: string
  perfil_id: string
  actividad_id?: string | null
  actividad_titulo?: string | null
  actividad_nombre?: string | null
  lugar?: string | null
  fecha_inicio?: string | null
  fecha_fin?: string | null
  tipo_formulario?: string | null
  firmado?: boolean | null
  firmado_por_id?: string | null
  nombre_firmante?: string | null
  rut_firmante?: string | null
  firma_digital_b64?: string | null
  firma_url?: string | null
  fecha_firma?: string | null
  estado?: string | null
  created_at?: string | null
}

// -- Notificaciones ---------------------------------------------------------

export interface Notificacion {
  id: string
  perfil_id: string
  titulo?: string | null
  mensaje?: string | null
  leida?: boolean | null
  created_at?: string | null
}

// -- Ceremonias -------------------------------------------------------------

export interface Ceremonia {
  id: string
  perfil_id: string
  titulo?: string | null
  fecha?: string | null
  unidad_id?: number | null
  created_at?: string | null
  nombre_hito?: string | null
  // Join
  perfil?: Pick<Perfil, 'id' | 'nombres' | 'apellidos' | 'unidad_id'> | null
}

// -- Ciclos -----------------------------------------------------------------

export interface CicloUnidad {
  id: string
  nombre: string
  fase_actual: number
  fecha_inicio: string
  fecha_fin: string
  unidad_id: number
  created_at?: string | null
  enfasis?: string | null
  diagnostico?: string | null
  estado?: string | null
  evaluacion_general?: string | null
  evaluacion_enfasis?: string | null
  creado_por?: string | null
  votos_totales_por_persona?: number | null
  votos_max_por_propuesta?: number | null
  votos_ilimitados?: boolean | null
  unidades?: { nombre?: string; colores?: { primario?: string } | string | null; logo_unidad_url?: string | null } | null
}

export interface CicloPropuesta {
  id: string
  ciclo_id: string
  titulo: string
  descripcion?: string | null
  preseleccionada?: boolean | null
  seleccionada?: boolean | null
  fecha_programada?: string | null
  es_especialidad?: boolean | null
  articulo_id?: string | null
  autor_id?: string | null
  evaluacion?: string | null
  es_actividad_programada?: boolean | null
  actividad_programada_estado?: string | null
  es_grupal_global?: boolean | null
  fichas_vinculadas?: Array<{ id: string; titulo: string; slug: string }> | null
  created_at?: string | null
  // Joins
  articulo?: Pick<Articulo, 'id' | 'slug' | 'titulo' | 'extracto'> | null
  autor?: Pick<Perfil, 'id' | 'nombres' | 'apellidos'> | null
}

// -- Progresion -------------------------------------------------------------

export interface ProgresionAvance {
  id: string
  perfil_id: string
  objetivo_id: string
  estado?: string | null
  valor?: number | null
  valor_apoderado?: number | null
  comentario_apoderado?: string | null
  fecha_comentario_apoderado?: string | null
  fecha_logro?: string | null
  validado_por?: string | null
}

export interface ProgresionObjetivo {
  id: string
  unidad_id: number
  nombre: string
  rango_edad: string
  area_id?: number | null
  orden?: number
}

export interface ObjetivoMetadata {
  id: string
  texto: string
  area: string
  unidad: string
}

export interface ProgresionEtapa {
  id: number
  unidad_id: number
  nombre: string
  rango_edad?: string
  orden?: number
}

export interface ProgresionArea {
  id: number
  nombre: string
  color?: string
  icono?: string
}

// -- Props de componentes del dashboard -------------------------------------

/** Props base que comparten todos los componentes de vista del dashboard. */
export interface DashViewProps {
  perfil: Perfil
}

/** Props para componentes que necesitan permisos de admin/directivo. */
export interface DashAdminProps extends DashViewProps {
  isAdmin: boolean
}

/** Props para modales del dashboard. */
export interface DashModalProps {
  isOpen: boolean
  onClose: () => void
}

/** Callback genérico para acciones de éxito que recargan datos. */
export type onSuccessCallback = () => void | Promise<void>

