// Service Worker para la PWA en GitHub Pages

const CACHE_NAME = "mi-pwa-v3";
const BASE_PATH = "/PWA-ejemplo1/"; // 👈 importante: nombre del repo

const urlsToCache = [
  `${BASE_PATH}index.html`,
  `${BASE_PATH}login.html`,
  `${BASE_PATH}offline.html`,
  `${BASE_PATH}manifest.json`,
  `${BASE_PATH}icons/icon-96x96.png`,
  `${BASE_PATH}icons/icon-180x180.png`,
  `${BASE_PATH}icons/icon-192x192.png`,
  `${BASE_PATH}icons/icon-512x512.png`
];

// Instalación y cacheo
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Instalando...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Archivos cacheados");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activación: limpiar cachés antiguas
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activando...");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
});

// Interceptar peticiones y servir desde cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() =>
          caches.match(`${BASE_PATH}offline.html`)
        )
      );
    })
  );
});
