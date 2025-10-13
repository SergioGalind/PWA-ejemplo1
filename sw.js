//Plantilla de service worker 

//1. nombre y archivos a cachear 
const CACHE_NAME = "mi-pwa-v1";
const BASE_PATH = "./pwa-ejemplo1/";
const urlsToCache = [
    `${BASE_PATH}index.html`,
    `${BASE_PATH}manifest.json`,
    `${BASE_PATH}offline.html,`
    `${BASE_PATH}icons/icon-96x96.png`,
    `${BASE_PATH}icons/icon-180x180.png`,
    `${BASE_PATH}icons/icon-192x192.png`,
    `${BASE_PATH}icons/icon-512x512.png`,
] ;

//2. INSTALL -> El evento que se ejecuta al instalar el SW
//Se dispara la primera vez que se registra el service worker
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache.addAll(urlsToCache))
    );
});

//3.ACTIVATE -> El evento que se ejecuta al activarse y debe limpiar caches viejas
// Se dispara cuando el service worker toma el control de la aplicación
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then( keys  => 
            Promise.all(
                keys.filter( key => key !== CACHE_NAME )
                .map( key => caches.delete(key) )
            )
        )
    );
});
    

    //4. FETCH -> Interpreta las peticiones de la PW.
    // Interpreta cada peticion de cada pagina de la PWA
    // busca primero el cache y si el recurso no esta se va a red, si fallatodo nos muetra offline.html

    self.addEventListener("fetch", event => {
        event.respondWith(
            caches.match(event.request).then( response => {
                return response || fetch(event.request).catch(() => caches.match(`${BASE_PATH}offline.html`));
            })
        );
    });

    //5. PUSH -> Manejo de notificaciones En segundo plano (opcional)
    self.addEventListener("push", event => {
        const data = event.data ? event.data.text() : "Notificación sin datos";
        event.waitUntil(
            self.registration.showNotification("Mi PWA", { body: data})
        );
    });


   // Opcional:
//SYNC -> Sincronización en segundo plano (opcional)
// Manejo de eventos de APIS que el navegador soporte