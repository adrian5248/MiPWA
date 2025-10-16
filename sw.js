//Plantilla de un service Worker minimo

const { cache } = require("react");


//1. Nombre del sw y los archivos a cachear
const CACHE_NAME = "mi-cache";
const BASE_PATH  = "MiPWA/";
const urlsToCache = [
    `${BASE_PATH}index.html`,
    `${BASE_PATH}manifest.json`,
    `${BASE_PATH}style.css`,
    `${BASE_PATH}offline.html`,
    `${BASE_PATH}icons/icon-192x192.png`,
    `${BASE_PATH}icons/icon-512x512.png`
    ];

//2. INSTALL -> se ejecuta al instalar el service worker
//see cachean los recursos base de la PWA
self.addEventListener("install", event => {
    console.log("SW: Instalando el SW ...");
    event.waitUntil(
        caches.open((CACHE_NAME).then(cache => {
            console.log("Archivos cacheados");
            return cache.addAll(urlsToCache)
        }))
    );
});

//3. ACTIVATE -> se ejecuta al activar el service worker
//limpiar el viejo, para mantener solo la version actual de la cache

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter( key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
            )
        )
    );
});

// 4. FETCH -> intercepta peticiones de la app
//Intercepta cada peticion de la PWA
//Buscar primero en caché
//Si no esta, busca en internet
//En caso de falla, muestra la pagina offline.html
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch (() => caches.match(`${BASE_PATH}offline.html`));
        })
    );
});

// 5. Push - notificaciones en segundo plano
// Manejo de notificaciones push (opcional)
self.addEventListener("push", event => {
    const data = event.data ? event.data.text() : "Notificación sin texto"
    event.waitUntil(
        self.ServiceWorkerRegistration.showNotification("Mi PWA", {body: data})
    );
});

