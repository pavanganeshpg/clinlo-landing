// Service Worker for CLINLO 3D Health ATM & Vibrant Wellness Experience
// Cache-First strategy strictly scoped to 3D binary assets (/models/, /texture/, /map/, /draco/).
// Never intercepts HTML, ES modules (.js), CSS, /api/, non-GET, or cross-origin requests.

const CACHE_NAME = 'clinlo-3d-cache-v5';

// Core lightweight decoder & shared textures cached on install;
// large .glb models are cached lazily on first fetch (Cache-First) so initial page load & module imports stay fast.
const PRECACHE_ASSETS = [
  './draco/draco_decoder.wasm',
  './draco/draco_wasm_wrapper.js',
  './texture/white.jpg',
  './texture/mats/mat20.png'
];

async function precacheInSmallBatches(cache, urls, concurrency = 1) {
  let idx = 0;
  async function worker() {
    while (idx < urls.length) {
      const url = urls[idx++];
      try {
        await cache.add(url);
      } catch (err) {
        console.log('SW cache skip:', url, err);
      }
    }
  }
  const workers = Array.from({ length: Math.min(concurrency, urls.length) }, () => worker());
  await Promise.all(workers);
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => precacheInSmallBatches(cache, PRECACHE_ASSETS, 1))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Never intercept non-GET requests (e.g. POST /api/waitlist, CORS preflight, webhooks)
  if (event.request.method !== 'GET') {
    return;
  }

  let url;
  try {
    url = new URL(event.request.url);
  } catch (e) {
    return;
  }

  // Never intercept cross-origin requests or API endpoints
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) {
    return;
  }

  // Apply Cache-First ONLY for heavy 3D binary assets; let browser handle HTML/JS/CSS natively
  const is3dBinaryAsset =
    url.pathname.includes('/models/') ||
    url.pathname.includes('/texture/') ||
    url.pathname.includes('/map/') ||
    url.pathname.includes('/draco/');

  if (!is3dBinaryAsset) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache).catch(() => {});
          });
        }
        return networkResponse;
      }).catch(() => Response.error());
    })
  );
});
