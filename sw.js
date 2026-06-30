const CACHE = 'fifa-lottery-v2';
const ASSETS = [
  '/FIfa-Lottery/',
  '/FIfa-Lottery/index.html',
  '/FIfa-Lottery/style.css',
  '/FIfa-Lottery/app.js',
  '/FIfa-Lottery/players.js'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).then(function(response) {
        var clone = response.clone();
        caches.open(CACHE).then(function(cache) { cache.put(e.request, clone); });
        return response;
      }).catch(function() { return caches.match('/FIfa-Lottery/index.html'); });
    })
  );
});
