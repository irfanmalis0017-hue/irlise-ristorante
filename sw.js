/* IRLISE RISTORANTE — service worker (offline + installable).
   Ubah VERSION setiap kali kamu rilis update supaya cache lama dibersihkan. */
const VERSION = 'irlise-2.2.0';
const CACHE = VERSION;
const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
const LOCAL_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // File lokal wajib ada; kalau ada yang gagal, jangan blokir install.
    await Promise.all(LOCAL_ASSETS.map((u) => cache.add(u).catch(() => {})));
    // Mesin 3D (three.js) disimpan supaya game bisa jalan tanpa internet.
    try {
      const res = await fetch(THREE_URL, { mode: 'cors' });
      if (res && res.ok) await cache.put(THREE_URL, res);
    } catch (e) { /* offline saat install: akan di-cache saat pertama dimuat */ }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Cek maintenance/versi harus selalu ke server (jangan di-cache).
  if (url.origin === location.origin && url.pathname.endsWith('/status.json')) return;

  // Halaman utama: ambil yang terbaru dulu, fallback ke cache kalau offline.
  if (req.mode === 'navigate' || (url.origin === location.origin && (url.pathname.endsWith('/') || url.pathname.endsWith('/index.html')))) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        if (fresh && fresh.ok) {
          const cache = await caches.open(CACHE);
          cache.put('./index.html', fresh.clone());
        }
        return fresh;
      } catch (e) {
        const cached = (await caches.match(req)) || (await caches.match('./index.html')) || (await caches.match('./'));
        if (cached) return cached;
        throw e;
      }
    })());
    return;
  }

  // three.js (versi dikunci di URL) : cache dulu.
  if (url.href === THREE_URL) {
    event.respondWith((async () => {
      const cached = await caches.match(THREE_URL);
      if (cached) return cached;
      const res = await fetch(req);
      if (res && res.ok) (await caches.open(CACHE)).put(THREE_URL, res.clone());
      return res;
    })());
    return;
  }

  // File statis lain di domain yang sama (ikon, manifest): cache dulu, perbarui di belakang.
  if (url.origin === location.origin) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(req);
      const network = fetch(req).then((res) => {
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      }).catch(() => cached);
      return cached || network;
    })());
  }
});
