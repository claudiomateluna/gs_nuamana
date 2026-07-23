import { ReactNode } from 'react'
import { Perfil } from './index'

// --- Perfil extended with ficha medica fields (wizard context) --------------

export interface PerfilWizard extends Perfil {
  // Ficha medica (perfiles_ficha_medica)
  diagnostico_salud_mental?: string | null
  tratamiento_salud_mental?: string | null
  profesional_tratante_contacto?: string | null
  detalle_salud_mental?: string | null
  hospitalizaciones_previas_json?: Hospitalizacion[] | null
  cirugias_previas_json?: Cirugia[] | null
  hospitalizaciones_previas?: string | null
  cirugias_previas?: string | null
  enfermedades_cronicas_json?: string[] | null
  presenta_diagnostico_bool?: boolean | null
  apoyo_comunicacion_bool?: boolean | null
  apoyo_comunicacion?: string | null
  dificultades_sensoriales_bool?: boolean | null
  dificultades_sensoriales?: string | null
  ayuda_organizacion_bool?: boolean | null
  ayuda_organizacion?: string | null
  otras_necesidades_bool?: boolean | null
  otras_necesidades?: string | null
  diagnostico_relevante_detalle?: string | null
  intereses_disfrute?: string | null
  situaciones_estres?: string | null
  estrategias_calma?: string | null
  observaciones_adicionales?: string | null
  malestares_recientes_bool?: boolean | null
  malestares_recientes?: string | null
  tratamiento_reciente_bool?: boolean | null
  inicio_tratamiento_reciente?: string | null
  medicamentos_malestar?: string | null
  contacto_infecto?: boolean | null
  contacto_infecto_detalle?: string | null
  viajes_extranjero_bool?: boolean | null
  pais_viaje?: string | null
  fecha_viaje?: string | null
  vacuna_viaje?: string | null
  vacunas_al_dia?: boolean | null
  vacunas_extra?: string | null
  menstruaciones?: string | null
  embarazo?: string | null
  medicamento_colicos?: string | null
  metodo_anticonceptivo?: string | null
  fecha_ultimo_control_embarazo?: string | null
  ultimo_control_dental?: string | null
  tratamiento_dental_bool?: boolean | null
  especifique_tratamiento_dental?: string | null
  seguro_complementario?: string | null
  nombre_seguro_complementario?: string | null
  tiene_intolerancia?: boolean | null
  describe_intolerancia?: string | null
  nombre_apoderado_contacto?: string | null
  zona?: string | null
  distrito?: string | null
  nacionalidad?: string | null
  nombre_social?: string | null
}

// --- Sub-form data types ---------------------------------------------------

export interface ContactoEmergenciaForm {
  nombre: string
  relacion: string
  telefono: string
}

export interface Hospitalizacion {
  motivo: string
  fecha: string
}

export interface Cirugia {
  nombre: string
  fecha: string
}

// --- Wizard form data (all fields across all steps) ------------------------

export interface WizardFormData {
  // Step 1: Datos personales
  nombres?: string
  apellidos?: string
  nacionalidad?: string
  nombre_social?: string
  sexo?: string
  fecha_nacimiento?: string
  estatura_m?: string
  peso_kg?: string

  // Step 2: Datos grupo
  nombre_grupo?: string
  pertenece_grupo_nua_mana?: boolean
  unidad_nombre?: string
  zona?: string
  distrito?: string

  // Step 3: Contactos emergencia
  contactos_emergencia?: ContactoEmergenciaForm[]

  // Step 4: Prevision salud
  sistema_salud?: string
  detalle_sistema_salud?: string
  tipo_sangre?: string
  seguro_complementario_radio?: string
  seguro_complementario?: boolean | string
  nombre_seguro_complementario?: string

  // Step 5: Alergias
  tiene_alergias_radio?: string
  tiene_alergias?: boolean
  alergias?: string
  tiene_intolerancia_radio?: string
  tiene_intolerancia?: boolean
  describe_intolerancia?: string
  dieta_alimentaria?: string[]

  // Step 6: Enfermedades cronicas
  enfermedades_cronicas_json?: string[]
  enfermedad_otra_nombre?: string
  antecedentes_medicos?: string
  medicamentos?: string

  // Step 7: Salud mental
  diagnostico_salud_mental_radio?: string
  diagnostico_salud_mental?: string
  detalle_salud_mental?: string
  tratamiento_salud_mental_radio?: string
  tratamiento_salud_mental?: string
  profesional_tratante_contacto?: string
  salud_mental_contacto?: string

  // Step 8: Historial clinico
  has_hospitalizaciones?: string
  hospitalizaciones?: Hospitalizacion[]
  has_cirugias?: string
  cirugias?: Cirugia[]

  // Step 9: Condiciones recientes
  malestares_recientes_radio?: string
  malestares_recientes_bool?: boolean
  malestares_recientes_detalle?: string
  tratamiento_reciente_radio?: string
  tratamiento_reciente_bool?: boolean
  tratamiento_reciente_fecha?: string
  tratamiento_reciente_medicamentos?: string

  // Step 10: Contactos recientes
  contacto_infecto_radio?: string
  contacto_infecto?: boolean
  contacto_infecto_detalle?: string
  viajes_extranjero_radio?: string
  viajes_extranjero_bool?: boolean
  pais_viaje?: string
  fecha_viaje?: string
  vacuna_viaje?: string

  // Step 11: Vacunas
  vacunas_al_dia_radio?: string
  vacunas_al_dia?: boolean
  vacunas_extra_radio?: string
  vacunas_extra?: string

  // Step 12: Salud ginecologica
  menstruaciones?: string
  ciclo_regular?: string
  dismenorrea?: string
  medicamento_colicos?: string
  metodo_anticonceptivo?: string
  embarazo?: string
  semanas_embarazo?: string
  fecha_ultimo_control_embarazo?: string

  // Step 13: Salud dental
  ultimo_control_dental?: string
  tratamiento_dental_radio?: string
  tratamiento_dental_bool?: boolean
  tratamiento_dental_detalle?: string

  // Step 14: Necesidades especiales
  tratamientos_medicos?: string

  // Step 15: Regulacion emocional
  presenta_diagnostico_radio?: string
  presenta_diagnostico_bool?: boolean
  diagnostico_relevante_detalle?: string
  intereses_disfrute?: string
  situaciones_estres?: string
  apoyo_comunicacion_radio?: string
  apoyo_comunicacion_bool?: boolean
  apoyo_comunicacion_detalle?: string
  dificultades_sensoriales_radio?: string
  dificultades_sensoriales_bool?: boolean
  dificultades_sensoriales_detalle?: string
  ayuda_organizacion_radio?: string
  ayuda_organizacion_bool?: boolean
  ayuda_organizacion_detalle?: string
  otras_necesidades_radio?: string
  otras_necesidades_bool?: boolean
  otras_necesidades_detalle?: string
  estrategias_calma?: string
  observaciones_adicionales?: string

  // Step 16: Autorizacion participacion
  autoriza_participacion?: string
  rut_usuario?: string
  rut_apoderado?: string
  nombres_usuario?: string
  apellidos_usuario?: string
  nombre_apoderado?: string
  apellidos_apoderado?: string

  // Step 17: Autorizacion imagen
  autoriza_imagen?: string
  rut_usuario_img?: string
  rut_apoderado_img?: string
  nombres_usuario_img?: string
  apellidos_usuario_img?: string
  nombre_apoderado_img?: string
  apellidos_apoderado_img?: string

  // Step 18: Firma digital
  firma?: string | null

  // Allow dynamic field access for wizard parent's validColumns loop
  [key: string]: unknown
}

// --- External data types ---------------------------------------------------

export interface ActividadData {
  id: string
  nombre: string
  fecha_inicio?: string | null
  fecha_fin?: string | null
  lugar?: string | null
  unidad_id?: number | null
}

export interface ApoderadoData {
  rut?: string
  nombres?: string
  apellidos?: string
}

// --- Component prop types --------------------------------------------------

export interface FieldInfoProps {
  label: string
  info: string
}

export interface FieldProps extends FieldInfoProps {
  children: ReactNode
  fullWidth?: boolean
  error?: string | null
}

export interface RadioGroupProps {
  value: string
  onChange: (val: string) => void
  label: string
  info: string
}

// --- Step props ------------------------------------------------------------

export interface StepProps {
  formData: WizardFormData
  setFormData: (data: WizardFormData) => void
  perfil: PerfilWizard
}

export interface StepWithActividadProps extends StepProps {
  actividad?: ActividadData | null
  apoderadoData?: ApoderadoData | null
}

export interface Step0Props {
  perfil: PerfilWizard
  setActividadSelected: (actividad: ActividadData | null) => void
  actividadSelected: ActividadData | null
}
