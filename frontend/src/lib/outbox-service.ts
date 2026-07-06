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
