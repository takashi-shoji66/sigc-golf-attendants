// SIGC Golf Attendants — Service Worker
// バージョンを上げると古いキャッシュが自動削除されます
const CACHE_NAME = 'sigc-v1.5.0'

const PRECACHE = [
  './',
  './index.html',
  './attendants.json',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
]

const PHOTO_CACHE = 'sigc-photos-v1.5.0'

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== PHOTO_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)

  if (url.pathname.match(/\/photos(-mono|-soft|-pencil)?\//)) {
    event.respondWith(
      caches.open(PHOTO_CACHE).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached
          return fetch(event.request).then(res => {
            if (res.ok) cache.put(event.request, res.clone())
            return res
          }).catch(() => cached)
        })
      )
    )
    return
  }

  if (url.pathname.endsWith('/') ||
      url.pathname.endsWith('index.html') ||
      url.pathname.endsWith('attendants.json')) {
    event.respondWith(
      fetch(event.request).then(res => {
        if (res.ok) {
          const clone = res.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
        }
        return res
      }).catch(() =>
        caches.match(event.request).then(cached =>
          cached || caches.match('./index.html')
        )
      )
    )
    return
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached
      return fetch(event.request).then(res => {
        if (!res.ok) return res
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, res.clone())
          return res
        })
      }).catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('./index.html')
        }
      })
    })
  )
})
