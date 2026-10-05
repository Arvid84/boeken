const V="boekenkast-v4";const IMG="covers-v2";
const CORE=["./","index.html","manifest.json","icon-192.png","icon-512.png","https://unpkg.com/@zxing/library@0.21.3/umd/index.min.js","https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).catch(()=>{}).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!==IMG).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
/* only cache cover URLs that are stable; never ISBN lookups or "default=false" probes, whose errors are invisible (opaque) */
const cacheable=u=>/covers\.openlibrary\.org\/b\/id\//.test(u)||/books\.google\.com\/books\/(content|publisher)/.test(u)||/googleusercontent\.com/.test(u);
self.addEventListener("fetch",e=>{const req=e.request;if(req.method!=="GET")return;const u=new URL(req.url);
  if(req.destination==="image"&&u.origin!==location.origin){
    if(!cacheable(req.url))return;
    e.respondWith(caches.open(IMG).then(async c=>{const hit=await c.match(req);if(hit)return hit;
      const r=await fetch(req);if(r.ok||(r.type==="opaque"))c.put(req,r.clone()).catch(()=>{});return r}));return}
  if(u.origin!==location.origin&&!CORE.includes(req.url))return;
  e.respondWith(fetch(req).then(r=>{if(r.ok){const cp=r.clone();caches.open(V).then(c=>c.put(req,cp))}return r}).catch(()=>caches.match(req).then(r=>r||caches.match("index.html"))))});
