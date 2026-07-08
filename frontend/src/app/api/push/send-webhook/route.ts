import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

// Configurar claves VAPID por defecto
// Estas claves sirven para firmar los payloads y autenticarnos ante FCM/APNs
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BHAnBwEN1pUusDJR5xRNFMh9M5JCH6sGEUp0cd1ztwAjezxhRO3o0Igs1FhUI_k4R_r6BJhj4dqHTmfrV2zGXuQ';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || 'luijpVvAnqLbCHT_RRDDii49d_XVszq6RTj_XsKPuZk';
const WEBHOOK_SECRET = process.env.PUSH_WEBHOOK_SECRET || 'nua-mana-secret-push-token-2026';

// Configurar los detalles de VAPID
webpush.setVapidDetails(
  'mailto:contacto@nuamana.cl',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

export async function POST(request: NextRequest) {
  try {
    const headers = request.headers;
    const secret = headers.get('x-webhook-secret');
    
    // Validar token de seguridad para que solo la DB o servicios autorizados puedan llamarlo
    if (secret !== WEBHOOK_SECRET) {
      console.warn('Intento de llamada no autorizada al webhook de Push');
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { perfil_id, titulo, contenido, accion_url } = body;

    if (!perfil_id || !titulo || !contenido) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos (perfil_id, titulo, contenido)' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Configuración de Supabase incompleta para el webhook de push.');
      return NextResponse.json({ error: 'Error de configuración en el servidor' }, { status: 500 });
    }

    // Crear cliente admin para bypasear RLS y buscar las suscripciones push de ese perfil
    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { data: subs, error: subError } = await adminClient
      .from('suscripciones_push')
      .select('*')
      .eq('perfil_id', perfil_id);

    if (subError) {
      console.error('Error obteniendo suscripciones push:', subError);
      return NextResponse.json({ error: 'Error al consultar suscripciones' }, { status: 500 });
    }

    if (!subs || subs.length === 0) {
      return NextResponse.json({ success: true, message: 'El usuario no tiene dispositivos suscritos' }, { status: 200 });
    }

    // Payload de la notificación
    const payload = JSON.stringify({
      title: titulo,
      body: contenido,
      url: accion_url || '/'
    });

    // Enviar notificaciones push en paralelo a todos los navegadores/dispositivos suscritos
    const sendPromises = subs.map(async (sub) => {
      try {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth
          }
        };

        await webpush.sendNotification(pushSubscription, payload);
      } catch (err: any) {
        console.error(`Error enviando notificación a la suscripción ${sub.id}:`, err);
        // Si el servidor de notificaciones (Google/Mozilla/Apple) devuelve 410 (Gone) o 404 (Not Found),
        // significa que el token expiró o la app fue desinstalada. Lo eliminamos para mantener limpia la DB.
        if (err.statusCode === 410 || err.statusCode === 404) {
          console.log(`Removiendo suscripción obsoleta/inexistente: ${sub.id}`);
          await adminClient.from('suscripciones_push').delete().eq('id', sub.id);
        }
      }
    });

    await Promise.all(sendPromises);

    return NextResponse.json({ success: true, sent_count: subs.length });
  } catch (error: any) {
    console.error('Error procesando webhook de notificaciones push:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
