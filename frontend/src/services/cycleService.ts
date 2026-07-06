import { supabase } from '@/lib/supabase'

const cleanUnidadId = (id: any): number | null => {
  if (id === null || id === undefined || id === 'null' || id === 'undefined') return null;
  const parsed = typeof id === 'string' ? parseInt(id, 10) : id;
  return isNaN(parsed) ? null : parsed;
};

/**
 * Servicio para encapsular todas las interacciones con la base de datos de Supabase
 * relacionadas con la gestión del Ciclo de Programa de las unidades scouts.
 * Sigue el principio de SoC (Separación de Responsabilidades).
 */
export const cycleService = {
  /**
   * Carga el ciclo activo para una unidad, o un ciclo específico si se provee overrideId
   */
  async getActiveCycle(unidadId?: any, overrideId?: string, isDirectivoAdmin?: boolean) {
    const cleanId = cleanUnidadId(unidadId);

    // Si estamos en el cliente y sin señal, ir directo a base local
    if (typeof window !== 'undefined' && !navigator.onLine) {
      return this.getLocalActiveCycle(cleanId, overrideId);
    }

    try {
      let query = supabase
        .from('ciclos_unidad')
        .select('*, articulo_juego:articulos!ciclos_unidad_articulo_juego_id_fkey(titulo, extracto, imagen_destacada, slug), unidades!ciclos_unidad_unidad_id_fkey(nombre, colores, logo_unidad_url)')
      
      if (overrideId) {
        query = query.eq('id', overrideId)
      } else if (cleanId !== null) {
        query = query.eq('unidad_id', cleanId).eq('estado', 'activo')
      } else if (isDirectivoAdmin) {
        query = query.eq('estado', 'activo').order('created_at', { ascending: false }).limit(1)
      } else {
        return null
      }

      const { data, error } = await query.maybeSingle()
      if (error) throw error
      return data
    } catch (err) {
      console.warn("Fallo la conexión de red al obtener ciclo activo. Cargando local...", err)
      return this.getLocalActiveCycle(cleanId, overrideId)
    }
  },

  async getLocalActiveCycle(cleanId: number | null, overrideId?: string) {
    try {
      const { db } = await import('@/lib/db')
      if (overrideId) {
        return await db.ciclo_activo.get(overrideId) || null
      } else if (cleanId !== null) {
        return await db.ciclo_activo.where('unidad_id').equals(cleanId).first() || null
      }
    } catch (e) {
      console.error("Error cargando ciclo activo local:", e)
    }
    return null
  },

  /**
   * Obtiene las propuestas asociadas a un ciclo
   */
  async getProposals(cicloId: string) {
    if (typeof window !== 'undefined' && !navigator.onLine) {
      return this.getLocalProposals(cicloId)
    }

    try {
      const { data, error } = await supabase
        .from('ciclo_propuestas')
        .select('*, autor:perfiles!ciclo_propuestas_autor_id_fkey(nombres, apellidos), articulo:articulos(id, titulo, slug, extracto, imagen_destacada, metadata)')
        .eq('ciclo_id', cicloId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (err) {
      console.warn("Fallo la conexión de red al obtener propuestas. Cargando local...", err)
      return this.getLocalProposals(cicloId)
    }
  },

  async getLocalProposals(cicloId: string) {
    try {
      const { db } = await import('@/lib/db')
      const props = await db.propuestas.where('ciclo_id').equals(cicloId).toArray()
      return props.map(p => ({
        ...p,
        autor: {
          nombres: p.autor_nombres,
          apellidos: p.autor_apellidos
        },
        articulo: p.articulo || null
      }))
    } catch (e) {
      console.error("Error cargando propuestas locales:", e)
      return []
    }
  },

  /**
   * Obtiene los acuerdos grupales globales
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
   * Obtiene las actividades programadas de la unidad o globales
   */
  async getProgrammedActivities(unidadId?: any) {
    const cleanId = cleanUnidadId(unidadId);
    const { data, error } = await supabase
      .from('actividades_programadas')
      .select('*, creador:perfiles!creado_por(nombres, apellidos)')
      .or(cleanId !== null ? `unidad_id.eq.${cleanId},unidad_id.is.null` : `unidad_id.is.null`)

    if (error) throw error
    return data || []
  },

  /**
   * Carga los votos para un ciclo
   */
  async getVotes() {
    const { data, error } = await supabase
      .from('ciclo_votos')
      .select('propuesta_id, perfil_id, cantidad')

    if (error) throw error
    return data || []
  },

  /**
   * Registra o elimina un voto por una propuesta
   */
  async registerVote(propId: string, perfilId: string, cantidad: number) {
    if (cantidad <= 0) {
      const { error } = await supabase
        .from('ciclo_votos')
        .delete()
        .match({ propuesta_id: propId, perfil_id: perfilId })
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('ciclo_votos')
        .upsert({ 
          propuesta_id: propId, 
          perfil_id: perfilId, 
          cantidad 
        }, { onConflict: 'propuesta_id,perfil_id' })
      if (error) throw error
    }
  },

  /**
   * Actualiza el texto de evaluación de una propuesta
   */
  async updateProposalEvaluation(propId: string, evaluacion: string) {
    const { error } = await supabase
      .from('ciclo_propuestas')
      .update({ evaluacion })
      .eq('id', propId)
    if (error) throw error
  },

  /**
   * Busca la bitácora más reciente relacionada con el título de la propuesta
   */
  async getLatestBitacoraWithTitle(unidadId: any, title: string) {
    const cleanId = cleanUnidadId(unidadId);
    if (cleanId === null) return null;
    const { data, error } = await supabase
      .from('bitacoras_unidad')
      .select('id, historia')
      .eq('unidad_id', cleanId)
      .ilike('titulo', `%${title}%`)
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) throw error
    return data && data.length > 0 ? data[0] : null
  },

  /**
   * Actualiza la historia de una bitácora existente
   */
  async updateBitacoraHistory(bitacoraId: string, historia: string) {
    const { error } = await supabase
      .from('bitacoras_unidad')
      .update({ historia })
      .eq('id', bitacoraId)
    if (error) throw error
  },

  /**
   * Cambia el estado de preselección de una propuesta
   */
  async toggleProposalPreselection(propId: string, preseleccionada: boolean) {
    const { error } = await supabase
      .from('ciclo_propuestas')
      .update({ preseleccionada })
      .eq('id', propId)
    if (error) throw error
  },

  /**
   * Quita del calendario una propuesta agendada
   */
  async unscheduleProposal(propId: string) {
    const { error } = await supabase
      .from('ciclo_propuestas')
      .update({ seleccionada: false, fecha_programada: null })
      .eq('id', propId)
    if (error) throw error
  },

  /**
   * Elimina permanentemente una propuesta de ciclo
   */
  async deleteProposal(propId: string) {
    const { error } = await supabase
      .from('ciclo_propuestas')
      .delete()
      .eq('id', propId)
    if (error) throw error
  },

  /**
   * Avanza la fase actual de un ciclo
   */
  async advanceStage(cicloId: string, nuevaFase: number) {
    const { error } = await supabase
      .from('ciclos_unidad')
      .update({ fase_actual: nuevaFase })
      .eq('id', cicloId)
    if (error) throw error
  },

  /**
   * Modifica las reglas de votación para el ciclo activo
   */
  async updateVotingRules(
    cicloId: string, 
    votosTotales: number, 
    votosMax: number, 
    votosIlimitados: boolean
  ) {
    const { error } = await supabase
      .from('ciclos_unidad')
      .update({ 
        votos_totales_por_persona: votosTotales,
        votos_max_por_propuesta: votosMax,
        votos_ilimitados: votosIlimitados
      })
      .eq('id', cicloId)
    if (error) throw error
  },

  /**
   * Guarda la evaluación general y del énfasis para el ciclo
   */
  async updateGeneralEvaluation(
    cicloId: string, 
    evaluacionGeneral: string, 
    evaluacionEnfasis: string
  ) {
    const { error } = await supabase
      .from('ciclos_unidad')
      .update({ 
        evaluacion_general: evaluacionGeneral, 
        evaluacion_enfasis: evaluacionEnfasis 
      })
      .eq('id', cicloId)
    if (error) throw error
  },

  /**
   * Cierra un ciclo marcándolo como cerrado y estableciendo fecha_fin
   */
  async closeCycle(cicloId: string) {
    const { error } = await supabase
      .from('ciclos_unidad')
      .update({ estado: 'cerrado', fecha_fin: new Date().toISOString() })
      .eq('id', cicloId)
    if (error) throw error
  },

  /**
   * Elimina un ciclo y en cascada borra sus propuestas, votos y asistencias
   */
  async deleteActiveCycle(cicloId: string) {
    const { error } = await supabase
      .from('ciclos_unidad')
      .delete()
      .eq('id', cicloId)
    if (error) throw error
  },

  /**
   * Obtiene la información de una etapa de progresión por ID
   */
  async getEtapaProgresion(etapaId: string) {
    const { data, error } = await supabase
      .from('progresion_etapas')
      .select('rango_edad, unidad_id')
      .eq('id', etapaId)
      .maybeSingle()

    if (error) throw error
    return data
  },

  /**
   * Resuelve el rango de edad y unidad de los objetivos de base de datos
   */
  async getDbObjetivosFiltrados(ids: string[]) {
    if (ids.length === 0) return []
    const { data, error } = await supabase
      .from('progresion_objetivos')
      .select('id, rango_edad, unidad_id')
      .in('id', ids)

    if (error) throw error
    return data || []
  },

  /**
   * Obtiene todos los NNJ de una unidad para evaluación de dirigentes
   */
  async getNnjForEvaluation(unidadId: any) {
    const cleanId = cleanUnidadId(unidadId);
    if (cleanId === null) return [];
    const { data, error } = await supabase
      .from('perfiles')
      .select('id, nombres, apellidos, unidad_id, progresion_etapa_id, fecha_nacimiento')
      .eq('unidad_id', cleanId)
      .in('rol_id', [9, 10, 11, 12, 13])
      .order('apellidos')

    if (error) throw error
    return data || []
  },

  /**
   * Obtiene la asistencia a las actividades de propuestas específicas
   */
  async getAsistencias(propuestasIds: string[], perfilId?: string) {
    if (propuestasIds.length === 0) return []
    
    let query = supabase
      .from('asistencia_actividades')
      .select('perfil_id, propuesta_id')
      .in('propuesta_id', propuestasIds)
      .eq('asistio', true)

    if (perfilId) {
      query = query.eq('perfil_id', perfilId)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  }
}
