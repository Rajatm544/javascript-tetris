const cacheName = "v5";

const cachedAssets = ["index.html", "index.css", "script.js"];

// Call install event
self.addEventListener("install", (e) => {
    e.waitUntil(
        caches
            .open(cacheName)
            .then((cache) => {
                cache.addAll(cachedAssets);
            })
            .then(() => self.skipWaiting())
    );
});

// Call activate event
self.addEventListener("activate", (e) => {
    // Remove unwanted caches
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== cacheName) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Call fetch event
self.addEventListener("fetch", (e) => {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
