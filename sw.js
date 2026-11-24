// Service Worker for OSGYM 3D Health ATM & Vibrant Wellness Experience
// Cache-First strategy for ultra-fast, zero-latency 3D asset delivery on mobile & low-bandwidth connections

const CACHE_NAME = 'osgym-3d-cache-v1';

const PRECACHE_ASSETS = [
  './models/skinMB2.glb',
  './models/skinF2.glb',
  './models/podium.glb',
  './models/newBG.glb',
  './models/brain.glb',
  './models/heart.glb',
  './models/liver.glb',
  './models/kidneys2.glb',
  './models/intestine.glb',
  './models/stomach.glb',
  './models/thyroid.glb',
  './models/glands.glb',
  './models/dna.glb',
  './models/cellNew.glb',
  './map/GSG_PRO_STUDIOS_METAL_001_sm.webp',
  './texture/white.jpg',
  './texture/mats/mat20.png',
  './texture/Plastic015A_1K-JPG_NormalGL.jpg',
  './draco/draco_decoder.wasm',
  './draco/draco_wasm_wrapper.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Gracefully attempt caching without blocking installation on any missing optional asset
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) => cache.add(url).catch((err) => console.log('SW cache skip:', url, err)))
      );
    }).then(() => self.skipWaiting())
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
  const url = new URL(event.request.url);

  // Apply Cache-First for 3D binary assets (models, textures, wasm)
  if (url.pathname.includes('/models/') || url.pathname.includes('/texture/') || url.pathname.includes('/map/') || url.pathname.includes('/draco/')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
    );
  } else {
    // Network-first with cache fallback for HTML/CSS/JS
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
