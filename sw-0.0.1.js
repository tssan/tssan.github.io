const cacheName = 'dojoitPWA_v0.1.1';
const staticAssets = [
    '/theme/js/blog.js',
    '/theme/css/blog.css',
    '/theme/fonts/ShareTechMono-Regular.ttf',
    '/theme/images/dojoit-logo.png',
    '/theme/vendors/fontawesome/css/all.min.css',
    '/theme/vendors/fontawesome/webfonts/fa-brands-400.eot',
    '/theme/vendors/fontawesome/webfonts/fa-brands-400.svg',
    '/theme/vendors/fontawesome/webfonts/fa-brands-400.ttf',
    '/theme/vendors/fontawesome/webfonts/fa-brands-400.woff',
    '/theme/vendors/fontawesome/webfonts/fa-brands-400.woff2',
    '/theme/vendors/fontawesome/webfonts/fa-regular-400.eot',
    '/theme/vendors/fontawesome/webfonts/fa-regular-400.svg',
    '/theme/vendors/fontawesome/webfonts/fa-regular-400.ttf',
    '/theme/vendors/fontawesome/webfonts/fa-regular-400.woff',
    '/theme/vendors/fontawesome/webfonts/fa-regular-400.woff2',
    '/theme/vendors/fontawesome/webfonts/fa-solid-900.eot',
    '/theme/vendors/fontawesome/webfonts/fa-solid-900.svg',
    '/theme/vendors/fontawesome/webfonts/fa-solid-900.ttf',
    '/theme/vendors/fontawesome/webfonts/fa-solid-900.woff',
    '/theme/vendors/fontawesome/webfonts/fa-solid-900.woff2',
    '/favicon.png',
    '/index.html',
    '/2d-map-generator-in-python.html',
    '/how-to-create-website-using-pelican.html',
    '/how-to-transpile-bundle-and-minify-js-projects.html',
    '/service-workers-for-beginners.html',
    '/pages/about.html',
    '/pages/curriculum-vitae.html',
];


self.addEventListener('install', async e => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    return self.skipWaiting();
})

self.addEventListener('activate', e => {
    self.clients.claim();
})

self.addEventListener('fetch', async e => {
    const req = e.request;
    const url = new URL(req.url);
    if(url.origin === location.origin) {
        e.respondWith(cacheFirst(req));
    } else {
        e.respondWith(networkAndCache(req));
    }
})

async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(req);
    return cached || fetch(req);
}

async function networkAndCache(req) {
    const cache = await caches.open(cacheName);
    try {
        const freshResponse = await fetch(req);
        await cache.put(req, freshResponse.clone());
        return freshResponse;
    } catch (e) {
        const cached = await cache.match(req);
        return cached;
    }
}
