const CACHE_NAME = "mi-cache-v2"; // Cambié a v2 para forzar actualización
const urlsToCache = [
    "./",
    "./index.html",
    "./manifest.json",
    "./style.css"
];

// INSTALL
self.addEventListener("install", event => {
    console.log("SW: Instalando...");
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log("Cache abierto");
                // Cachear archivos uno por uno para evitar errores
                return Promise.all(
                    urlsToCache.map(url => {
                        return cache.add(url).catch(err => {
                            console.log("Error cacheando:", url);
                        });
                    })
                );
            })
    );
    self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", event => {
    console.log("SW: Activando...");
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
            )
        )
    );
    return self.clients.claim();
});

// FETCH
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(() => {
                return caches.match("./index.html");
            })
    );
});
