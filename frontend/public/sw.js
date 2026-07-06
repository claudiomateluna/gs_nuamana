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
