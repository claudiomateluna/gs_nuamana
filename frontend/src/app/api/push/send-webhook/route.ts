import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const WEBHOOK_SECRET = process.env.PUSH_WEBHOOK_SECRET;

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !WEBHOOK_SECRET) {
  console.error('Missing required environment variables: NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, PUSH_WEBHOOK_SECRET');
}

let vapidConfigured = false;

function ensureVapidConfigured() {
  if (vapidConfigured) return;
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    throw new Error('VAPID keys not configured. Set NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY.');
  }
  webpush.setVapidDetails(
    'mailto:contacto@nuamana.cl',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
  vapidConfigured = true;
}

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

    ensureVapidConfigured();

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
      } catch (err: unknown) {
        console.error(`Error enviando notificación a la suscripción ${sub.id}:`, err);
        // Si el servidor de notificaciones (Google/Mozilla/Apple) devuelve 410 (Gone) o 404 (Not Found),
        // significa que el token expiró o la app fue desinstalada. Lo eliminamos para mantener limpia la DB.
        const statusCode = err instanceof Error && 'statusCode' in err ? (err as { statusCode: number }).statusCode : null;
        if (statusCode === 410 || statusCode === 404) {
          await adminClient.from('suscripciones_push').delete().eq('id', sub.id);
        }
      }
    });

    await Promise.all(sendPromises);

    return NextResponse.json({ success: true, sent_count: subs.length });
  } catch (error: unknown) {
    console.error('Error procesando webhook de notificaciones push:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
