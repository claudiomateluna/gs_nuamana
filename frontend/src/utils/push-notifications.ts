import { supabase } from '@/lib/supabase';

// Convertir la clave VAPID pública de Base64 a Uint8Array (necesario para el PushManager)
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Solicita permisos de notificación y suscribe el dispositivo actual en la base de datos
 */
export async function subscribeUserToPush() {
  if (typeof window === 'undefined') return;
  
  // Validar si el navegador soporta Service Workers y Push Manager
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Las notificaciones push no están soportadas en este navegador/dispositivo.');
    return;
  }

  try {
    // 1. Obtener el usuario autenticado actual
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return;
    }

    // 2. Verificar el estado actual de permisos
    if (Notification.permission === 'denied') {
      console.warn('El permiso de notificaciones está bloqueado por el usuario.');
      return;
    }

    // Si el permiso aún no ha sido otorgado, pedirlo
    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('El usuario denegó el permiso para enviar notificaciones.');
        return;
      }
    }

    // 3. Esperar a que el Service Worker esté listo
    const registration = await navigator.serviceWorker.ready;

    // Clave pública VAPID (debe ser idéntica a la que firma en el servidor)
    const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BHAnBwEN1pUusDJR5xRNFMh9M5JCH6sGEUp0cd1ztwAjezxhRO3o0Igs1FhUI_k4R_r6BJhj4dqHTmfrV2zGXuQ';
    const convertedVapidKey = urlBase64ToUint8Array(publicVapidKey);

    // 4. Suscribir el dispositivo al canal de Push de Google/Apple
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    });

    // 5. Extraer claves de cifrado y convertirlas a Base64 para almacenarlas de forma segura en la DB
    const p256dh = subscription.getKey('p256dh');
    const auth = subscription.getKey('auth');
    
    if (!p256dh || !auth) {
      throw new Error('Las claves criptográficas de suscripción no están disponibles');
    }

    // Convertir de ArrayBuffer a string Base64
    const p256dhBase64 = btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(p256dh))));
    const authBase64 = btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(auth))));

    // 6. Almacenar la suscripción en Supabase
    const { error } = await supabase
      .from('suscripciones_push')
      .upsert({
        perfil_id: user.id,
        endpoint: subscription.endpoint,
        p256dh: p256dhBase64,
        auth: authBase64
      }, { onConflict: 'endpoint' });

    if (error) {
      console.error('Error al guardar la suscripción push en Supabase:', error.message);
    }
  } catch (err) {
    console.error('Excepción al registrar notificaciones push:', err);
  }
}
