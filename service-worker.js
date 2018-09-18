const VERSION = 1;
const CACHE_NAME = `dev-v-dev-cache-${VERSION}`;
const RESOURCES_MANIFEST = 'resources-manifest.json';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return fetch(RESOURCES_MANIFEST)
                .then(resp => resp.json())
                .then(fileArr => cache.addAll(fileArr))
        })
    );
});

self.addEventListener('activate', function onActivate(event) {
    event.waitUntil(
        caches.keys().then(keys => {
            keys.forEach(key => {
                if (key !== CACHE_NAME) {
                    caches.delete(key);
                }
            });
        })
    );
});

self.addEventListener('fetch', event => {
    if (event.request.url.indexOf(location.origin) === 0) {
        const duplicatedRequest = event.request.clone();

        event.respondWith(caches.match(event.request).then(resp => {
            return resp || fetch(duplicatedRequest);
        }));
    }
});

self.addEventListener('push', event => {
    event.waitUntil(
        displayNotification(event.data.json())
    );
});

function displayNotification(payload, tag = 'common-tag') {
    const title = 'Dev v Dev';
    const {
        data
    } = payload;

    let resultText = "wins over";

    if (data.result === 'dev2') {
        resultText = "loses to";
    } else if (data.result === 'draw') {
        resultText = "draws"
    }

    return self.registration.showNotification(title, {
        icon: 'src/icons/icon-512x512.png',
        body: `${data.dev1} ${resultText} ${data.dev2}`,
        tag,
        vibrate: [100, 50, 100, 50, 100, 50],
        requireInteraction: false
    });
}