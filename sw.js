// Service Worker para la PWA en GitHub Pages

const CACHE_NAME = 'pwa-v1';
const BASE_PATH = "/PWA-ejemplo1/"; // 👈 importante: nombre del repo

const urlsToCache = [
    './',
    './index.html',
    './offline.html',
    './manifest.json',
    './icons/icon-96x96.png',
    './icons/icon-180x180.png',
    './icons/icon-192x192.png',
    './icons/icon-512x512.png'
];

// Instalación y cacheo
self.addEventListener("install", (event) => {
    self.skipWaiting(); // forzar que el SW pase a activate
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// Activación: limpiar cachés antiguas
self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            // borrar caches viejos si aplica
            const keys = await caches.keys();
            await Promise.all(keys.map(k => { if (k !== CACHE_NAME) return caches.delete(k); }));
            await self.clients.claim(); // tomar control inmediato de las páginas
        })()
    );
});

// Interceptar peticiones y servir desde cache
self.addEventListener("fetch", (event) => {
    if (event.request.method !== 'GET') return;
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // opcional: actualizar cache en segundo plano
                return response;
            })
            .catch(() => {
                // si falla la red, intentar cache
                return caches.match(event.request).then(cached => {
                    return cached || caches.match('./offline.html');
                });
            })
    );
});
