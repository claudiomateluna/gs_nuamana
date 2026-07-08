self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Manejador vacío para cumplir con los requisitos de instalación de PWA de Google Chrome
  // sin interferir con el comportamiento de red o el almacenamiento en caché
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
