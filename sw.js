// Plantilla de service worker

// 1. Nombre y archivos a cachear
const CACHE_NAME = "mi-pwa-v1";
const BASE_PATH = "./";
const urlsToCache = [
    `${BASE_PATH}index.html`,
    `${BASE_PATH}manifest.json`,
    `${BASE_PATH}offline.html`,
    `${BASE_PATH}icons/icon-96x96.png`,
    `${BASE_PATH}icons/icon-180x180.png`,
    `${BASE_PATH}icons/icon-192x192.png`,
    `${BASE_PATH}icons/icon-512x512.png`,
];

// 2. INSTALL
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

// 3. ACTIVATE
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
});

// 4. FETCH
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(() => caches.match(`${BASE_PATH}offline.html`));
        })
    );
});

// 5. PUSH (opcional)
self.addEventListener("push", event => {
    const data = event.data ? event.data.text() : "Notificación sin datos";
    event.waitUntil(
        self.registration.showNotification("Mi PWA", { body: data })
    );
});
