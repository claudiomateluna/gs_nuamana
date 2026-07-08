const CACHE_NAME = 'nuamana-cache-v2';
const OFFLINE_URL = '/dashboard';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  // Pre-cachear el cascarón de la página y recursos básicos del branding
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        OFFLINE_URL,
        '/manifest.webmanifest',
        '/icon-192x192.png',
        '/icon-512x512.png',
        '/vercel.svg',
        '/globe.svg',
        '/file.svg',
        '/window.svg'
      ]).catch(err => {
        console.error('Error pre-cacheando recursos en install:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.clients.claim().then(() => {
      // Limpiar cachés antiguas
      return caches.keys().then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              console.log('Removiendo caché antigua de Service Worker:', key);
              return caches.delete(key);
            }
          })
        );
      });
    })
  );
});

// Interceptor de peticiones HTTP
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Solo interceptar peticiones GET de nuestro propio dominio
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Ignorar WebSockets, Hot Module Reloading y consultas directas a la API de Supabase o endpoints API locales
  if (
    url.pathname.startsWith('/_next/webpack-hmr') || 
    url.hostname.includes('supabase') || 
    url.pathname.startsWith('/api/')
  ) {
    return;
  }

  // 1. Estrategia para páginas HTML (navegaciones directas)
  // Usamos Network-First: intentamos red fresca, y si falla (offline), servimos del caché.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Guardar la página fresca en el caché
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => {
          // Si no hay internet, buscar la página exacta en caché
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Si la página específica no está, servir el dashboard como shell offline
            return caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  // 2. Estrategia para recursos estáticos (JS, CSS, imágenes, fuentes)
  // Usamos Stale-While-Revalidate: servir del caché al instante, y actualizar el caché en segundo plano
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.startsWith('/fonts/')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        }).catch(() => {
          // Fallback silencioso en segundo plano si no hay conexión
        });

        return cachedResponse || fetchPromise;
      })
    );
  }
});

// Evento que se dispara al recibir una notificación push desde el servidor
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'NuaMana PWA', body: event.data.text() };
    }
  }

  const options = {
    body: data.body || '',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Nueva Notificación', options)
  );
});

// Evento que se dispara cuando el usuario hace clic sobre la notificación push
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // URL de destino a abrir
  const targetUrl = event.notification.data?.url 
    ? new URL(event.notification.data.url, self.location.origin).href
    : self.location.origin + '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Buscar si ya hay alguna pestaña abierta de la PWA
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Si no hay pestaña abierta, abrir una nueva
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
