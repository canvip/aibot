''// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var dataCacheName = 'Papyrus-v1';
var cacheName = 'Papyrus-final-1';
var filesToCache = [
  "https://cdn.ampproject.org/v0/amp-carousel-0.1.js",
  "https://cdn.ampproject.org/v0/amp-list-0.1.js",
  "https://cdn.ampproject.org/v0/amp-mustache-0.1.js",
  "https://cdn.ampproject.org/v0/amp-form-0.1.js",
  "https://cdn.ampproject.org/v0/amp-analytics-0.1.js",
  "https://cdn.ampproject.org/v0/amp-fit-text-0.1.js",
  "https://cdn.ampproject.org/v0/amp-sidebar-0.1.js",
  "https://cdn.ampproject.org/v0/amp-bind-0.1.js",
  "https://cdn.ampproject.org/v0/amp-lightbox-0.1.js",
  'https://horse-golf.glitch.me/',
  '/',
  'https://cdn.ampproject.org/v0.js',
  '/pwa',
  '/scripts/app.js',
  '/styles/inline.css',
  'https://cdn.glitch.com/0264b8ff-6d27-4539-a1fe-b8fc7dc5214f%2Fclear.png',
  'https://cdn.glitch.com/0264b8ff-6d27-4539-a1fe-b8fc7dc5214f%2Fcloudy-scattered-showers.png',
  'https://cdn.glitch.com/0264b8ff-6d27-4539-a1fe-b8fc7dc5214f%2Fcloudy.png',
  'https://cdn.glitch.com/0264b8ff-6d27-4539-a1fe-b8fc7dc5214f%2Ffog.png',
  'https://cdn.glitch.com/0264b8ff-6d27-4539-a1fe-b8fc7dc5214f%2Fic_add_white_24px.svg',
  'https://cdn.glitch.com/0264b8ff-6d27-4539-a1fe-b8fc7dc5214f%2Fic_refresh_white_24px.svg',
  'https://cdn.glitch.com/0264b8ff-6d27-4539-a1fe-b8fc7dc5214f%2Fpartly-cloudy.png',
  'https://cdn.glitch.com/0264b8ff-6d27-4539-a1fe-b8fc7dc5214f%2Frain.png',
  'https://cdn.glitch.com/0264b8ff-6d27-4539-a1fe-b8fc7dc5214f%2Fscattered-showers.png',
  'https://cdn.glitch.com/0264b8ff-6d27-4539-a1fe-b8fc7dc5214f%2Fsleet.png',
  'https://cdn.glitch.com/0264b8ff-6d27-4539-a1fe-b8fc7dc5214f%2Fsnow.png',
  'https://cdn.glitch.com/0264b8ff-6d27-4539-a1fe-b8fc7dc5214f%2Fthunderstorm.png',
  'https://cdn.glitch.com/0264b8ff-6d27-4539-a1fe-b8fc7dc5214f%2Fwind.png',
  'https://cdn.glitch.com/0264b8ff-6d27-4539-a1fe-b8fc7dc5214f%2Ffavicon.ico',
  'https://cdn.glitch.com/0264b8ff-6d27-4539-a1fe-b8fc7dc5214f%2Ficon-128x128.png',
  'https://cdn.glitch.com/0264b8ff-6d27-4539-a1fe-b8fc7dc5214f%2Ficon-144x144.png',
  'https://cdn.glitch.com/0264b8ff-6d27-4539-a1fe-b8fc7dc5214f%2Ficon-152x152.png',
  'https://cdn.glitch.com/0264b8ff-6d27-4539-a1fe-b8fc7dc5214f%2Ficon-192x192.png',
  'https://cdn.glitch.com/0264b8ff-6d27-4539-a1fe-b8fc7dc5214f%2Ficon-256x256.png',
  'https://s3.amazonaws.com/hyperweb-editor-assets/us-east-1%3Ad0d03a8e-22bf-451d-ba15-f08d8f4e99ba%2Fuse-url.svg',
      
     
     
];


self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});




self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  /*
   * Fixes a corner case in which the app wasn't returning the latest data.
   * You can reproduce the corner case by commenting out the line below and
   * then doing the following steps: 1) load app for first time so that the
   * initial New York City data is shown 2) press the refresh button on the
   * app 3) go offline 4) reload the app. You expect to see the newer NYC
   * data, but you actually see the initial data. This happens because the
   * service worker is not yet activated. The code below essentially lets
   * you activate the service worker faster.
   */
  return self.clients.claim();
});



self.addEventListener('fetch', function(event) {
	if (event.request.mode == 'navigate') {
		console.log('Handling fetch event for', event.request.url);
		console.log(event.request);
		event.respondWith(
			fetch(event.request).catch(function(exception) {
				// The `catch` is only triggered if `fetch()` throws an exception,
				// which most likely happens due to the server being unreachable.
				console.error(
					'Fetch failed; returning offline page instead.',
					exception
				);
				return caches.open(filesToCache).then(function(cache) {
					return cache.match('/');
				});
			})
		);
	} else {
		// It’s not a request for an HTML document, but rather for a CSS or SVG
		// file or whatever…
		event.respondWith(
			caches.match(event.request).then(function(response) {
				return response || fetch(event.request);
			})
		);
	}

});

/*
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => {
    return cache.addAll(filesToCache);
  }));
});

function addToCache(cacheName, filesToCache) {
  caches.open(cacheName).then(cache => {
    return cache.addAll(filesToCache);
  });
}
*/
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(response => {
    return response || fetch(event.request);
  }));
});
