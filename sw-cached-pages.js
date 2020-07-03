const cacheName = "v1";

const cachedAssets = ["index.html", "index.css", "script.js"];

// Call install event
self.addEventListener("install", (e) => {
    e.waitUntil(
        caches
            .open(cacheName)
            .then((cache) => {
                console.log("Service worker: caching assets");
                cache.addAll(cachedAssets);
            })
            .then(() => self.skipWaiting())
    );
    console.log("Service Worker: Caching Assets");
});

// Call activate event
self.addEventListener("activate", (e) => {
    console.log("Service Worker activated");
    // Remove unwanted caches
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== cacheName) {
                        console.log("Service Worker: Clearing old cache");
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Call fetch event
self.addEventListener("fetch", (e) => {
    console.log("Service Worker: Fetching");
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
