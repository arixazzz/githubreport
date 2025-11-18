// ===============================
// Custom Service Worker
// Offline cache + Push Notification
// ===============================

// Versi cache → ganti kalau update file SW
const CACHE_VERSION = "v1.0.1"; // increment versi biar refresh
const CACHE_NAME = `app-cache-${CACHE_VERSION}`;
const OFFLINE_URL = "/offline.html";

// Asset penting untuk precache
const PRECACHE_ASSETS = [
  "/offline.html",
  "/favicon.ico",
  "/assets/icons/icon.svg",
];

// Install SW → cache asset penting
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn("[SW] Precaching failed:", err);
      })
    )
  );
  self.skipWaiting();
});

// Activate SW → hapus cache lama kalau ada
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[SW] Deleting old cache:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch handler → offline-first untuk page, cache-first untuk asset
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip API calls → ditangani Dexie/outbox
  if (request.url.includes("/api/")) return;

  // Hanya cache request GET
  if (request.method !== "GET") return;

  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // Kalau response gagal, jangan cache
        if (!networkResponse || !networkResponse.ok) {
          return networkResponse;
        }

        // Clone 2x: satu buat return ke browser, satu buat cache
        const responseToReturn = networkResponse.clone();
        const responseForCache = networkResponse.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseForCache).catch((err) => {
            console.warn("[SW] cache.put failed:", err);
          });
        });

        return responseToReturn;
      })
      .catch(() => {
        // Fallback ke cache
        return caches.match(request).then((cachedResp) => {
          if (cachedResp) return cachedResp;

          // Kalau navigasi page & gak ada cache → offline fallback
          if (request.mode === "navigate") {
            return caches.match(OFFLINE_URL);
          }
        });
      })
  );
});

//  ======== notification 

self.addEventListener('push', (event) => {
  if (!event.data) return
  const payload = event.data.json()
  const title = payload.title || 'Notifikasi'
  const options = {
    body: payload.body,
    icon: '/assets/icons/dprd-pali-logo.png',
    badge: '/assets/icons/dprd-pali-logo.png',
    data: payload.data || {},
    requireInteraction: true,
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const data = event.notification.data || {}
  const url = data?.refId
    ? `/notification`
    : '/notification'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((wins) => {
      for (const c of wins) {
        if ('focus' in c) {
          c.navigate(url)
          return c.focus()
        }
      }
      if (clients.openWindow) return clients.openWindow(url)
    })
  )
})

// ============