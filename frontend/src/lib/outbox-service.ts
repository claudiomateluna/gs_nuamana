import { db } from './db'

export const outboxService = {
  /**
   * Encola una acción de escritura localmente en IndexedDB.
   * Si está online, intenta vaciar la cola de inmediato.
   */
  async enqueue(tabla: string, accion: string, payload: any) {
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

    console.log(`🔄 Procesando cola de envío local (${items.length} elementos)...`)
    const { supabase } = await import('./supabase')

    // Verificar sesión antes de iniciar
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      console.warn('⚠️ Sin sesión activa de Supabase. Abortando procesamiento de cola.')
      return
    }

    for (const item of items) {
      try {
        let error: any = null

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
        } else if (item.tabla === 'actas_completo') {
          if (item.accion === 'INSERT') {
            const { payload: actPayload, temas, participantes, acuerdos } = item.payload;
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
              const temasParaGuardar = temas.map((t: any, i: number) => ({
                acta_id: newActaId,
                titulo: t.titulo?.trim() || 'Sin título',
                descripcion: t.descripcion || '',
                conclusiones: t.conclusiones || '',
                duracion_estimada: parseInt(t.duracion_estimada) || 0,
                duracion_real: parseInt(t.duracion_real) || 0,
                orden: i
              }));
              if (temasParaGuardar.length > 0) {
                const { error: teErr } = await supabase.from('acta_temas').insert(temasParaGuardar);
                if (teErr) error = teErr;
              }
              
              // 3. Insertar participantes
              const partParaGuardar = participantes.map((p: any) => ({
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
              const invitadosObligatorios = participantes.filter((p: any) => p.asistencia !== 'No Invitado');
              if (!error && invitadosObligatorios.length > 0) {
                const firmasParaGuardar = invitadosObligatorios.map((p: any) => ({
                  acta_id: newActaId,
                  perfil_id: p.perfil_id,
                  firmado: false
                }));
                const { error: fErr } = await supabase.from('acta_firmas').insert(firmasParaGuardar);
                if (fErr) error = fErr;
              }
              
              // 5. Insertar acuerdos
              const acToIns = acuerdos.map((a: any) => ({
                acta_id: newActaId,
                titulo: a.titulo.trim(),
                descripcion: a.descripcion || '',
                responsable_id: a.responsable_id || null,
                fecha_compromiso: a.fecha_compromiso || null,
                prioridad: a.prioridad || 'Media',
                estado: a.estado || 'Abierta',
                es_actividad_grupal: !!a.es_actividad_grupal
              }));
              if (!error && acToIns.length > 0) {
                const { error: acErr } = await supabase.from('acta_acuerdos').insert(acToIns);
                if (acErr) error = acErr;
              }
              
              // 6. Insertar notificaciones
              if (!error && invitadosObligatorios.length > 0) {
                const msg = `Se ha creado el acta (${actPayload.tipo}) del ${actPayload.fecha}. Revisa y firma en el panel.`;
                const notifs = invitadosObligatorios.map((p: any) => ({
                  perfil_id: p.perfil_id,
                  mensaje: msg,
                  tipo: 'sistema',
                  link_url: '/dashboard'
                }));
                const { error: notifErr } = await supabase.from('notificaciones').insert(notifs);
                if (notifErr) {
                  console.warn("Fallo al insertar notificaciones de acta sincronizada offline:", notifErr);
                }
              }
            }
          }
        }

        if (error) {
          console.error(`❌ Error procesando outbox item #${item.id}:`, error)
          // Si es un fallo de red o del servidor remoto, detenemos el procesamiento para reintentar más tarde
          if (
            error.message?.includes('Fetch') || 
            error.status === 0 || 
            error.message?.includes('Network') ||
            error.status >= 500
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
          console.log(`✅ Outbox item #${item.id} sincronizado con éxito.`)
        }
      } catch (e: any) {
        console.error('💥 Excepción procesando elemento de outbox:', e)
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
      console.log('📶 Conexión restablecida. Procesando cola de envío...')
      this.processQueue()
    })
  }
}
