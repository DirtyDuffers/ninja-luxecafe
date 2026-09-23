var CACHE_NAME="ninja-luxe-cafe-v5";
var CORE=[
  "./",
  "https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.2/babel.min.js"
];

self.addEventListener("install",function(event){
  event.waitUntil(caches.open(CACHE_NAME).then(function(cache){
    return Promise.allSettled(CORE.map(function(url){return cache.add(url);}));
  }).then(function(){return self.skipWaiting();}));
});

self.addEventListener("activate",function(event){
  event.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(key){return key.indexOf("ninja-luxe-cafe-")===0&&key!==CACHE_NAME;}).map(function(key){return caches.delete(key);}));
  }).then(function(){return self.clients.claim();}));
});

self.addEventListener("fetch",function(event){
  if(event.request.method!=="GET")return;
  if(event.request.mode==="navigate"){
    event.respondWith(fetch(event.request).then(function(response){
      var copy=response.clone();caches.open(CACHE_NAME).then(function(cache){cache.put(event.request,copy);});return response;
    }).catch(function(){return caches.match(event.request).then(function(hit){return hit||caches.match("./");});}));
    return;
  }
  event.respondWith(caches.match(event.request).then(function(hit){
    if(hit)return hit;
    return fetch(event.request).then(function(response){
      if(response&&response.status===200){var copy=response.clone();caches.open(CACHE_NAME).then(function(cache){cache.put(event.request,copy);});}
      return response;
    });
  }));
});
