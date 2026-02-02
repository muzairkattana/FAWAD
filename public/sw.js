const CACHE_NAME = 'ayesha-valentine-v3';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/smile.png',
    '/funny-valentine.gif',
    'https://www.transparenttextures.com/patterns/creme-paper.png',
    'https://www.transparenttextures.com/patterns/cream-paper.png',
    'https://www.transparenttextures.com/patterns/aged-paper.png',
    'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Cinzel+Decorative:wght@400;700&family=Special+Elite&family=Pacifico&family=Inter:wght@400;600&display=swap'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests like Supabase (they are handled by offline queue logic)
    if (!event.request.url.startsWith(self.location.origin) && !event.request.url.includes('google')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // If it's a valid response, clone it and save to cache
                if (response && response.status === 200 && response.type === 'basic') {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => {
                // If network fails, serve from cache
                return caches.match(event.request);
            })
    );
});
