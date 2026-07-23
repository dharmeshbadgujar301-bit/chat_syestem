self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  self.clients.claim();
  self.registration.unregister().then(() => {
    console.log('Old service worker unregistered');
  });
});
