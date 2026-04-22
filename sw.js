// SIGC Golf Attendants — Service Worker
// バージョンを上げると古いキャッシュが自動削除されます
const CACHE_NAME = 'sigc-v1.3.0'

// キャッシュするファイル一覧（インストール時に全取得）
const PRECACHE = [
  './',
  './index.html',
  './attendants.json',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
]

// 写真は動的キャッシュ（初回アクセス時に保存）
const PHOTO_CACHE = 'sigc-photos-v1.3.0'

// ── INSTALL: 基本ファイルをキャッシュ ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  )
})

// ── ACTIVATE: 古いキャッシュを削除 ──
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

// ── FETCH: キャッシュ優先 → ネットワーク ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)

  // 写真ファイル: キャッシュ優先、なければネット取得してキャッシュに保存
  if (url.pathname.match(/\/photos(-mono|-soft|-pencil)?\//)) {
    event.respondWith(
      caches.open(PHOTO_CACHE).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached
          return fetch(event.request).then(res => {
            if (res.ok) cache.put(event.request, res.clone())
            return res
          }).catch(() => cached) // オフライン時はキャッシュ返却
        })
      )
    )
    return
  }

  // その他: キャッシュ優先、なければネット
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
        // オフライン時: index.htmlを返す
        if (event.request.destination === 'document') {
          return caches.match('./index.html')
        }
      })
    })
  )
})
