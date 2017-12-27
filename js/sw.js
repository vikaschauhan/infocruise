self.addEventListener('fetch', event => {
    event.respondWith(cacheFirst(event.request))
  })
  
  function cacheFirst(request) {
    const cacheName = getCacheName(request.url)
    return caches.open(cacheName)
      .then(cache => cache.match(request.url))
      .then(response => {
        return response || fetchAndCache(request, cacheName)
      })
  }
  
  function fetchAndCache(request, cacheName) {
    return fetch(request).then(response => {
      const copy = response.clone()
      caches.open(cacheName)
        .then(cache => cache.put(request, copy))
      return response
    })
  }
  self.addEventListener('install', event => {
    event.waitUntil(
      caches.open('core-v1')
        .then(cache => cache.addAll([
          '/assets/css/main-f08d25a912.css',
          '/assets/js/index-b5bca639b6.js',
          '/en/offline/',
          '/nl/offline/',
        ]))
        .then(() => self.skipWaiting())
    )
  })
  function alterHtmlResponse(response) {
    return response.text()
      .then(html => renderTemplate(html))
      .then(body => replaceResponseBody(response, body))
  }
  
  function renderTemplate(template) {
    return template
      .replace(/href="[^"]*\/main-[a-z0-9]{10}\.css"/g, '/assets/css/main-f08d25a912.css')
      .replace(/src="[^"]*\/index-[a-z0-9]{10}\.js"/g, '/assets/js/index-b5bca639b6.js')
  }
  
  function replaceResponseBody(response, body) {
      return new Response(body, {
          status: response.status,
          statusText: response.statusText,
          headers: {'content-type': 'text/html'}
      })
  }