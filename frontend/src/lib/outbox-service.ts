import { db } from './db'

interface ActaPayload {
  tipo: string;
  fecha: string;
  [key: string]: unknown;
}

interface Tema {
  titulo?: string;
  descripcion?: string;
  conclusiones?: string;
  duracion_estimada?: string;
  duracion_real?: string;
}

interface Participante {
  perfil_id: string;
  rol_en_reunion?: string;
  asistencia?: string;
}

interface Acuerdo {
  titulo: string;
  descripcion?: string;
  responsable_id?: string | null;
  fecha_compromiso?: string | null;
  prioridad?: string;
  estado?: string;
  es_actividad_grupal?: boolean;
  fichas_vinculadas?: string[];
}

interface ActaCompletoPayload {
  payload: ActaPayload;
  temas: Tema[];
  participantes: Participante[];
  acuerdos: Acuerdo[];
}

interface SupabaseError {
  message: string;
  status?: number;
}

export const outboxService = {
  /**
   * Encola una acción de escritura localmente en IndexedDB.
   * Si está online, intenta vaciar la cola de inmediato.
   */
  async enqueue(tabla: string, accion: string, payload: Record<string, unknown>) {
    await db.outbox_queue.add({
      tabla,
      accion,
      payload,
      timestamp: Date.now(),
      intentos: 0
    })

    // Intentar vaciar cola si estamos conectados
    if (typeof window !== 'undefined' && navigator.onLine) {
      this.processQueue()
    }
  },

  /**
   * Procesa de forma cronológica todas las peticiones encoladas.
   */
  async processQueue() {
    if (typeof window === 'undefined' || !navigator.onLine) return

    const items = await db.outbox_queue.orderBy('timestamp').toArray()
    if (items.length === 0) return

    const { supabase } = await import('./supabase')

    // Verificar sesión antes de iniciar
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      console.warn('⚠️ Sin sesión activa de Supabase. Abortando procesamiento de cola.')
      return
    }

    for (const item of items) {
      try {
        let error: SupabaseError | null = null

        if (item.tabla === 'progresion_avance') {
          if (item.accion === 'UPSERT') {
            const { error: err } = await supabase
              .from('progresion_avance')
              .upsert(item.payload, { onConflict: 'perfil_id,objetivo_id' })
            error = err
          }
        } else if (item.tabla === 'bitacoras_unidad') {
          if (item.accion === 'INSERT') {
            const { error: err } = await supabase
              .from('bitacoras_unidad')
              .insert(item.payload)
            error = err
          } else if (item.accion === 'UPDATE') {
            const { error: err } = await supabase
              .from('bitacoras_unidad')
              .update(item.payload)
              .eq('id', item.payload.id)
            error = err
          } else if (item.accion === 'DELETE') {
            const { error: err } = await supabase
              .from('bitacoras_unidad')
              .delete()
              .eq('id', item.payload.id)
            error = err
          }
        } else if (item.tabla === 'ciclo_propuestas') {
          if (item.accion === 'UPDATE') {
            const { id, ...updates } = item.payload as { id: string; [key: string]: unknown }
            const { error: err } = await supabase
              .from('ciclo_propuestas')
              .update(updates)
              .eq('id', id)
            error = err
          }
        } else if (item.tabla === 'actas_completo') {
          if (item.accion === 'INSERT') {
            const { payload: actPayload, temas, participantes, acuerdos } = item.payload as any;
            const codigo = `ACT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
            
            // 1. Insertar acta
            const { data: newActa, error: actErr } = await supabase
              .from('actas')
              .insert({ ...actPayload, codigo })
              .select()
              .single();
            
            if (actErr) {
              error = actErr;
            } else {
              const newActaId = newActa.id;
              
              // 2. Insertar temas
              const temasParaGuardar = temas.map((t: Tema, i: number) => ({
                acta_id: newActaId,
                titulo: t.titulo?.trim() || 'Sin título',
                descripcion: t.descripcion || '',
                conclusiones: t.conclusiones || '',
                duracion_estimada: parseInt(t.duracion_estimada || '0') || 0,
                duracion_real: parseInt(t.duracion_real || '0') || 0,
                orden: i
              }));
              if (temasParaGuardar.length > 0) {
                const { error: teErr } = await supabase.from('acta_temas').insert(temasParaGuardar);
                if (teErr) error = teErr;
              }
              
              // 3. Insertar participantes
              const partParaGuardar = participantes.map((p: Participante) => ({
                acta_id: newActaId,
                perfil_id: p.perfil_id,
                rol_en_reunion: p.rol_en_reunion || 'Asistente',
                asistencia: p.asistencia || 'Ausente'
              }));
              if (!error && partParaGuardar.length > 0) {
                const { error: pErr } = await supabase.from('acta_participantes').insert(partParaGuardar);
                if (pErr) error = pErr;
              }
              
              // 4. Crear los casilleros de firma
              const invitadosObligatorios = participantes.filter((p: Participante) => p.asistencia !== 'No Invitado');
              if (!error && invitadosObligatorios.length > 0) {
                const firmasParaGuardar = invitadosObligatorios.map((p: Participante) => ({
                  acta_id: newActaId,
                  perfil_id: p.perfil_id,
                  firmado: false
                }));
                const { error: fErr } = await supabase.from('acta_firmas').insert(firmasParaGuardar);
                if (fErr) error = fErr;
              }
              
              // 5. Insertar acuerdos
              const acToIns = acuerdos.map((a: Acuerdo) => ({
                acta_id: newActaId,
                titulo: a.titulo.trim(),
                descripcion: a.descripcion || '',
                responsable_id: a.responsable_id || null,
                fecha_compromiso: a.fecha_compromiso || null,
                prioridad: a.prioridad || 'Media',
                estado: a.estado || 'Abierta',
                es_actividad_grupal: !!a.es_actividad_grupal
              }));
              let insertedAcuerdos: Array<{ id: string }> = [];
              if (!error && acToIns.length > 0) {
                const { data: insAc, error: acErr } = await supabase.from('acta_acuerdos').insert(acToIns).select('id');
                if (acErr) error = acErr;
                else insertedAcuerdos = insAc || [];
              }

              // 5b. Insertar links de fichas para acuerdos grupales
              if (!error && insertedAcuerdos.length > 0) {
                for (let ai = 0; ai < acuerdos.length; ai++) {
                  const acuerdo = acuerdos[ai];
                  if (acuerdo.fichas_vinculadas && acuerdo.fichas_vinculadas.length > 0 && insertedAcuerdos[ai]) {
                    const links = acuerdo.fichas_vinculadas.map((fichaId: string) => ({
                      acuerdo_id: insertedAcuerdos[ai].id,
                      articulo_id: fichaId
                    }));
                    const { error: fErr } = await supabase.from('acta_acuerdo_fichas').insert(links);
                    if (fErr) console.warn('Error inserting ficha links:', fErr);
                  }
                }
              }
              
              // 6. Insertar notificaciones
              if (!error && invitadosObligatorios.length > 0) {
                const msg = `Se ha creado el acta (${actPayload.tipo}) del ${actPayload.fecha}. Revisa y firma en el panel.`;
                const notifs = invitadosObligatorios.map((p: Participante) => ({
                  perfil_id: p.perfil_id,
                  mensaje: msg,
                  tipo: 'sistema',
                  link_url: '/panel'
                }));
                const { error: notifErr } = await supabase.from('notificaciones').insert(notifs);
                if (notifErr) {
                  console.warn("Fallo al insertar notificaciones de acta sincronizada offline:", notifErr);
                }
              }
            }
          }
        } else {
          // Tabla no soportada — eliminar de la cola para evitar loop infinito
          console.warn(`⚠️ Outbox item #${item.id}: tabla "${item.tabla}" no soportada. Eliminando.`)
          await db.outbox_queue.delete(item.id!)
          continue
        }

        if (error) {
          const errorMsg = (error && typeof error === 'object' && 'message' in error) 
            ? (error as { message: string }).message 
            : String(error)
          console.error(`❌ Error procesando outbox item #${item.id} (${item.tabla}/${item.accion}):`, errorMsg)
          // Si es un fallo de red o del servidor remoto, detenemos el procesamiento para reintentar más tarde
          if (
            error.message?.includes('Fetch') || 
            error.status === 0 || 
            error.message?.includes('Network') ||
            (error.status !== undefined && error.status >= 500)
          ) {
            break
          }

          // Para errores de lógica/validación/permisos, incrementamos intentos
          const nuevosIntentos = item.intentos + 1
          if (nuevosIntentos >= 3) {
            console.warn(`🗑️ Eliminando outbox item #${item.id} por exceso de fallos: ${error.message}`)
            await db.outbox_queue.delete(item.id!)
          } else {
            await db.outbox_queue.update(item.id!, {
              intentos: nuevosIntentos,
              error_ultimo: error.message
            })
          }
        } else {
          // Éxito completo: eliminar de la cola local
          await db.outbox_queue.delete(item.id!)
        }
      } catch (e) {
        console.error('💥 Excepción procesando elemento de outbox:', e instanceof Error ? e.message : e)
        break // Detener por seguridad
      }
    }
  },

  /**
   * Registra los detectores de cambio de red para auto-sincronizar.
   */
  registerListeners() {
    if (typeof window === 'undefined') return

    // Registrar listener de vuelta de conexión
    window.addEventListener('online', () => {
      this.processQueue()
    })
  }
}
