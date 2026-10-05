const V="boekenkast-v3";const CORE=["./","index.html","manifest.json","icon-192.png","icon-512.png","https://unpkg.com/@zxing/library@0.21.3/umd/index.min.js","https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!=="covers").map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);if(e.request.method!=="GET")return;
 if(e.request.destination==="image"){e.respondWith(caches.open("covers").then(async c=>{const hit=await c.match(e.request);if(hit)return hit;try{const r=await fetch(e.request);if(r.ok||r.type==="opaque")c.put(e.request,r.clone());return r}catch(x){return hit||Response.error()}}));return}
 if(u.hostname.includes("googleapis.com")||u.hostname.includes("openlibrary.org"))return;
 e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(V).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match("index.html"))))});
