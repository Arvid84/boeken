const V="boekenkast-v5";
const CORE=["./","index.html","manifest.json","icon-192.png","icon-512.png","https://unpkg.com/@zxing/library@0.21.3/umd/index.min.js","https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).catch(()=>{}).then(()=>self.skipWaiting()))});
/* remove all old caches, including earlier cover caches */
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
/* app shell only; cover images are left to the browser's own cache */
self.addEventListener("fetch",e=>{const req=e.request;if(req.method!=="GET")return;const u=new URL(req.url);
  if(u.origin!==location.origin&&!CORE.includes(req.url))return;
  e.respondWith(fetch(req).then(r=>{if(r.ok){const cp=r.clone();caches.open(V).then(c=>c.put(req,cp))}return r}).catch(()=>caches.match(req).then(r=>r||caches.match("index.html"))))});
