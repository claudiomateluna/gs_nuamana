import { supabase } from '@/lib/supabase';
import { db } from '@/lib/db';
import { cycleService } from '@/services/cycleService';

export const syncService = {
  /**
   * Descarga todos los datos requeridos para la unidad del dirigente e inicializa el caché de IndexedDB.
   */
  async syncUnitData(
    unidadId: number,
    progressCallback?: (progress: number, message: string) => void
  ): Promise<void> {
    const reportProgress = (progress: number, message: string) => {
      if (progressCallback) progressCallback(progress, message);
    };

    try {
      reportProgress(5, 'Iniciando descarga de datos...');

      // 1. Obtener nómina de NNJ de la unidad
      reportProgress(10, 'Descargando lista de NNJ y contactos de emergencia...');
      const { data: miembros, error: miembrosErr } = await supabase
        .from('perfiles')
        .select(`
          *,
          roles(name),
          unidades(nombre, colores, logo_unidad_url, logo_rama_url),
          contactos_emergencia(*),
          apoderado:apoderado_id(id, nombres, apellidos, telefono, email)
        `)
        .eq('unidad_id', unidadId)
        .order('nombres');

      if (miembrosErr) throw miembrosErr;
      if (!miembros) throw new Error('No se encontraron miembros en esta unidad.');

      reportProgress(30, 'Guardando nómina y datos médicos en base local...');
      
      // Limpiar bases de datos locales (excepto outbox_queue para no borrar envíos locales pendientes)
      await db.perfiles.clear();
      await db.fichas_medicas.clear();
      await db.contactos_emergencia.clear();
      await db.autorizaciones.clear();
      await db.progresion_avance.clear();
      await db.progresion_objetivos.clear();
      await db.progresion_etapas.clear();
      await db.progresion_areas.clear();
      await db.ciclo_activo.clear();
      await db.propuestas.clear();
      await db.articulos_actividades.clear();

      // Guardar perfiles y contactos de emergencia
      for (const m of miembros) {
        // Guardar perfil offline
        await db.perfiles.put({
          id: m.id,
          nombres: m.nombres,
          apellidos: m.apellidos,
          rut: m.rut,
          unidad_id: m.unidad_id,
          rol_id: m.rol_id,
          created_at: m.created_at,
          roles: m.roles,
          unidades: m.unidades
        });

        // Guardar ficha médica
        await db.fichas_medicas.put({
          perfil_id: m.id,
          grupo_sangre: m.grupo_sangre || null,
          alergias_medicamentos: m.alergias || null,
          alergias_alimentarias: m.restricciones_alimentarias || null,
          enfermedades_cronicas: m.enfermedades_cronicas || null,
          prevision: m.prevision || null,
          seguro_complementario: m.seguro_complementario || null,
          comentarios_salud: m.comentarios_salud || null,
          medicamentos_uso_comun: m.medicamentos_uso_comun || null,
          restricciones_alimentarias: m.restricciones_alimentarias || null
        });

        // Guardar contactos de emergencia
        if (m.contactos_emergencia && Array.isArray(m.contactos_emergencia)) {
          for (const c of m.contactos_emergencia) {
            await db.contactos_emergencia.put({
              id: c.id,
              perfil_id: c.perfil_id,
              nombre: c.nombre,
              telefono: c.telefono,
              parentesco: c.parentesco,
              es_primario: c.es_primario
            });
          }
        }
      }

      // 2. Obtener autorizaciones de actividades
      reportProgress(45, 'Descargando autorizaciones activas...');
      const miembroIds = miembros.map(m => m.id);
      
      if (miembroIds.length > 0) {
        const { data: auths, error: authsErr } = await supabase
          .from('autorizaciones_actividades')
          .select('*')
          .in('perfil_id', miembroIds);

        if (authsErr) throw authsErr;

        if (auths) {
          for (const a of auths) {
            await db.autorizaciones.put({
              id: a.id,
              perfil_id: a.perfil_id,
              actividad_id: a.actividad_id,
              actividad_titulo: a.actividad_titulo || 'Salida Scout',
              firmado: a.firmado || false,
              nombre_firmante: a.nombre_firmante || null,
              fecha_firma: a.fecha_firma || null,
              firma_url: a.firma_url || null
            });
          }
        }
      }

      // 3. Obtener progresión de los NNJ de la unidad
      reportProgress(60, 'Descargando avances de progresión...');
      if (miembroIds.length > 0) {
        const { data: avances, error: avancesErr } = await supabase
          .from('progresion_avance')
          .select('*')
          .in('perfil_id', miembroIds);

        if (avancesErr) throw avancesErr;

        if (avances) {
          for (const av of avances) {
            await db.progresion_avance.put({
              id: `${av.perfil_id}-${av.objetivo_id}`,
              perfil_id: av.perfil_id,
              objetivo_id: av.objetivo_id,
              estado: av.estado || null,
              valor: av.valor || null,
              valor_apoderado: av.valor_apoderado || null,
              comentario_apoderado: av.comentario_apoderado || null,
              fecha_comentario_apoderado: av.fecha_comentario_apoderado || null,
              fecha_logro: av.fecha_logro || null,
              validado_por: av.validado_por || null
            });
          }
        }
      }

      // 3.5 Obtener catálogo de objetivos, etapas y áreas de progresión
      reportProgress(68, 'Descargando catálogo de objetivos y etapas...');
      const [areasRes, etapasRes, objsRes] = await Promise.all([
        supabase.from('progresion_areas').select('*'),
        supabase.from('progresion_etapas').select('*').eq('unidad_id', unidadId),
        supabase.from('progresion_objetivos').select('*').eq('unidad_id', unidadId)
      ]);

      if (areasRes.error) throw areasRes.error;
      if (etapasRes.error) throw etapasRes.error;
      if (objsRes.error) throw objsRes.error;

      if (areasRes.data) {
        for (const ar of areasRes.data) {
          await db.progresion_areas.put({
            id: ar.id,
            nombre: ar.nombre,
            color: ar.color || null,
            icono: ar.icono || null
          });
        }
      }

      if (etapasRes.data) {
        for (const et of etapasRes.data) {
          await db.progresion_etapas.put({
            id: et.id,
            unidad_id: et.unidad_id,
            nombre: et.nombre,
            rango_edad: et.rango_edad || null,
            orden: et.orden || null
          });
        }
      }

      if (objsRes.data) {
        for (const obj of objsRes.data) {
          await db.progresion_objetivos.put({
            id: obj.id,
            unidad_id: obj.unidad_id,
            nombre: obj.nombre,
            rango_edad: obj.rango_edad,
            area_id: obj.area_id || null,
            orden: obj.orden || null
          });
        }
      }

      // 4. Obtener ciclo de programa activo y propuestas
      reportProgress(75, 'Descargando ciclo de programa y propuestas...');
      const cicloActivoData = await cycleService.getActiveCycle(unidadId);
      
      const articleIdsToSync = new Set<string>();

      if (cicloActivoData) {
        await db.ciclo_activo.put({
          id: cicloActivoData.id,
          nombre: cicloActivoData.nombre,
          fase_actual: cicloActivoData.fase_actual,
          fecha_inicio: cicloActivoData.fecha_inicio,
          fecha_fin: cicloActivoData.fecha_fin,
          unidad_id: cicloActivoData.unidad_id,
          articulo_juego_id: cicloActivoData.articulo_juego_id,
          articulo_juego: cicloActivoData.articulo_juego
        });

        if (cicloActivoData.articulo_juego_id) {
          articleIdsToSync.add(cicloActivoData.articulo_juego_id);
        }

        // Obtener propuestas de este ciclo
        const propuestasData = await cycleService.getProposals(cicloActivoData.id);
        for (const p of propuestasData) {
          await db.propuestas.put({
            id: p.id,
            ciclo_id: p.ciclo_id,
            titulo: p.titulo,
            descripcion: p.descripcion,
            seleccionada: p.seleccionada || false,
            fecha_programada: p.fecha_programada || null,
            es_especialidad: p.es_especialidad || false,
            articulo_id: p.articulo_id,
            articulo: p.articulo,
            autor_nombres: p.autor?.nombres || null,
            autor_apellidos: p.autor?.apellidos || null
          });

          if (p.seleccionada && p.articulo_id) {
            articleIdsToSync.add(p.articulo_id);
          }
        }
      }

      // 5. Descargar artículos de actividades vinculadas (Juegos, dinámicas, etc.)
      reportProgress(90, 'Sincronizando contenidos de juegos y dinámicas...');
      if (articleIdsToSync.size > 0) {
        const { data: articulos, error: articulosErr } = await supabase
          .from('articulos')
          .select('id, slug, titulo, extracto, contenido, categoria, imagen_destacada')
          .in('id', Array.from(articleIdsToSync));

        if (articulosErr) throw articulosErr;

        if (articulos) {
          for (const art of articulos) {
            await db.articulos_actividades.put({
              id: art.id,
              slug: art.slug,
              titulo: art.titulo,
              extracto: art.extracto || '',
              contenido: art.contenido || '',
              categoria: art.categoria || '',
              imagen_destacada: art.imagen_destacada || null
            });
          }
        }
      }

      reportProgress(100, '¡Sincronización finalizada con éxito!');
      
      try {
        localStorage.setItem(`last_sync_unidad_${unidadId}`, new Date().toISOString());
      } catch (e) {
        console.warn('Error al escribir fecha de sincronización en localStorage:', e);
      }

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Error durante la sincronización offline:', error);
      reportProgress(-1, `Error en la sincronización: ${message}`);
      throw error;
    }
  }
};
