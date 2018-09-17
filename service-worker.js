const VERSION = 1;
const CACHE_NAME = `dev-v-dev-cache-${VERSION}`;
const RESOURCES_MANIFEST = 'resources-manifest.json';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return fetch(RESOURCES_MANIFEST)
                .then(resp => resp.json())
                .then(fileArr => {
                    fileArr.forEach(filename => {
                        fetch(filename).then(resp => cache.put(filename, resp));
                    })
                })
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

function displayNotification(payload, tag = 'common-tag') {
    const title = 'Dev v Dev';


    return self.registration.showNotification(title, {
        icon: 'src/icons/icon-512x512.png',
        body: `${payload.data.text}
${payload.data.author} | ${self.getDateString(new Date(Number(payload.data.timestamp)))}`,
        tag,
        vibrate: [100, 50, 100, 50, 100, 50],
        requireInteraction: false
    });
}