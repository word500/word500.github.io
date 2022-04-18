self.addEventListener('fetch', (event) => {
  event.respondWith(
	fetch(event.request).catch(() => {
	return caches.match(event.request);
    })
  );
});

self.onactivate = function() {
	console.log('Web-first sw activated!');
}