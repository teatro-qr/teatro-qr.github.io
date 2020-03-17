importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg|mp3)$/,
    new workbox.strategies.NetworkFirst({
        cacheName: 'images'
    })
);

// workbox.routing.registerRoute(
//     new RegExp('/index.html|/js/|/css/'),
//     new workbox.strategies.NetworkFirst()
// );
