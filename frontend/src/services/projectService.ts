import { supabase } from '@/lib/supabase'

/**
 * Servicio para encapsular todas las interacciones con la base de datos de Supabase
 * relacionadas con la gestión de Proyectos del Grupo Scout (flujo de 12 pasos, empresas, etc.).
 * Sigue el principio de SoC (Separación de Responsabilidades).
 */
export const projectService = {
  /**
   * Obtiene un proyecto grupal por su título y unidad
   */
  async getProjectByTitleAndUnit(title: string, unidadId: number) {
    const { data, error } = await supabase
      .from('proyectos')
      .select('*')
      .eq('titulo', title)
      .eq('unidad_id', unidadId)
      .eq('es_grupal', true)
      .maybeSingle()

    if (error) throw error
    return data
  },

  /**
   * Carga la lista de perfiles para la asignación de participantes/monitores
   */
  async getProfiles() {
    const { data, error } = await supabase
      .from('perfiles')
      .select('id, nombres, apellidos, rol_id, unidad_id, unidades(nombre)')
      .eq('estado', 'activo')
      .order('nombres')

    if (error) throw error
    return data || []
  },

  /**
   * Carga las unidades disponibles
   */
  async getUnits() {
    const { data, error } = await supabase
      .from('unidades')
      .select('*')
      .order('id')

    if (error) throw error
    return data || []
  },

  /**
   * Carga fichas de actividades del blog (artículos) filtradas por categorías específicas para el Wizard
   */
  async getArticlesForWizard() {
    const { data: cats, error: catErr } = await supabase
      .from('categorias')
      .select('id')
      .or('id.eq.1,parent_id.eq.1')
    if (catErr) throw catErr

    const catIds = cats ? cats.map(c => c.id) : [1]

    const { data: relations, error: relErr } = await supabase
      .from('articulo_categorias')
      .select('articulo_id')
      .in('categoria_id', catIds)
    if (relErr) throw relErr

    if (!relations || relations.length === 0) return []

    const articleIds = relations.map(r => r.articulo_id)
    const { data: articles, error: artErr } = await supabase
      .from('articulos')
      .select('id, titulo, slug')
      .in('id', articleIds)
      .eq('estado', 'publicado')
      .order('titulo')
    if (artErr) throw artErr

    return articles || []
  },

  /**
   * Carga el ciclo activo para una unidad determinada
   */
  async getActiveCycleForUnit(unidadId: number) {
    const { data, error } = await supabase
      .from('ciclos_unidad')
      .select('*')
      .eq('unidad_id', unidadId)
      .eq('estado', 'activo')
      .maybeSingle()

    if (error) throw error
    return data
  },

  /**
   * Carga acuerdos grupales asociados a actas con fecha de compromiso y catalogados como actividad grupal
   */
  async getGroupAgreements(unidadId: number) {
    const { data, error } = await supabase
      .from('acta_acuerdos')
      .select('id, titulo, descripcion, fecha_compromiso')
      .eq('es_actividad_grupal', true)
      .not('fecha_compromiso', 'is', null)

    if (error) throw error
    return data || []
  },

  /**
   * Carga propuestas de un ciclo dado que estén seleccionadas y tengan fecha programada
   */
  async getCycleProposals(cicloId: string) {
    const { data, error } = await supabase
      .from('ciclo_propuestas')
      .select('id, titulo, descripcion, fecha_programada')
      .eq('ciclo_id', cicloId)
      .eq('seleccionada', true)
      .not('fecha_programada', 'is', null)

    if (error) throw error
    return data || []
  },

  /**
   * Carga otros proyectos existentes en la unidad
   */
  async getOtherProjects(unidadId: number) {
    const { data, error } = await supabase
      .from('proyectos')
      .select('*')
      .eq('unidad_id', unidadId)

    if (error) throw error
    return data || []
  },

  /**
   * Carga los participantes registrados en un proyecto
   */
  async getProjectParticipants(proyectoId: string) {
    const { data, error } = await supabase
      .from('proyecto_participantes')
      .select('*')
      .eq('proyecto_id', proyectoId)

    if (error) throw error
    return data || []
  },

  /**
   * Guarda un proyecto (crea nuevo o actualiza existente)
   */
  async saveProject(proyecto: Record<string, unknown>, isNew: boolean) {
    if (isNew) {
      const { data, error } = await supabase
        .from('proyectos')
        .insert([proyecto])
        .select()
        .single()

      if (error) throw error
      return data
    } else {
      const { data, error } = await supabase
        .from('proyectos')
        .update(proyecto)
        .eq('id', proyecto.id)
        .select()
        .single()

      if (error) throw error
      return data
    }
  },

  /**
   * Reemplaza participantes de un proyecto eliminando los anteriores y agregando nuevos
   */
  async updateParticipants(proyectoId: string, insertParticipants: Record<string, unknown>[]) {
    // 1. Eliminar participantes anteriores
    const { error: deleteErr } = await supabase
      .from('proyecto_participantes')
      .delete()
      .eq('proyecto_id', proyectoId)

    if (deleteErr) throw deleteErr

    // 2. Insertar nuevos si hay
    if (insertParticipants.length > 0) {
      const { error: insertErr } = await supabase
        .from('proyecto_participantes')
        .insert(insertParticipants)

      if (insertErr) throw insertErr
    }
  },

  /**
   * Revisa si hay una propuesta de ciclo existente con el mismo título
   */
  async getProposalByCycleAndTitle(cicloId: string, titulo: string) {
    const { data, error } = await supabase
      .from('ciclo_propuestas')
      .select('*')
      .eq('ciclo_id', cicloId)
      .eq('titulo', titulo)
      .maybeSingle()

    if (error) throw error
    return data
  },

  /**
   * Guarda o actualiza una propuesta asociada al proyecto
   */
  async saveCycleProposal(proposal: Record<string, unknown>, isNew: boolean, existingId?: string) {
    if (isNew) {
      const { error } = await supabase
        .from('ciclo_propuestas')
        .insert([proposal])
      if (error) throw error
    } else if (existingId) {
      const { error } = await supabase
        .from('ciclo_propuestas')
        .update(proposal)
        .eq('id', existingId)
      if (error) throw error
    }
  }
}
