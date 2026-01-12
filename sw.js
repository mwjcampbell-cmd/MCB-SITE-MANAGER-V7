self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("mcb-v1").then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./styles.css",
        "./app.js",
        "./manifest.json",
        "./logo.png"
      ]);
    })
  );
});
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});