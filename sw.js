// Service Worker mínimo - solo para que la PWA sea instalable
self.addEventListener('install', () => {
    console.log('SW instalado');
    self.skipWaiting();
});

self.addEventListener('activate', () => {
    console.log('SW activado');
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
});