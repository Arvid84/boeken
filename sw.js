const V="boekenkast-v17";
const SHELL=["./","index.html","manifest.json","icon-192.png","icon-512.png"];
const LIBS=["https://unpkg.com/@zxing/library@0.21.3/umd/index.min.js","https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"];
/* precache: app files always fresh from the server (bypass the HTTP cache), libraries are versioned and may come from cache */
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>Promise.all([
  ...SHELL.map(u=>fetch(u,{cache:"reload"}).then(r=>r.ok&&c.put(u,r)).catch(()=>{})),
  ...LIBS.map(u=>c.add(u).catch(()=>{}))])).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const req=e.request;if(req.method!=="GET")return;const u=new URL(req.url);
  const same=u.origin===location.origin;if(!same&&!LIBS.includes(req.url))return;
  if(!same){e.respondWith(caches.match(req).then(r=>r||fetch(req)));return}
  /* own files: network first, revalidated with the server (no stale copies), offline falls back to the saved copy */
  e.respondWith(fetch(u.href,{cache:"no-cache",credentials:"same-origin"}).then(r=>{if(r.ok){const cp=r.clone();caches.open(V).then(c=>c.put(req,cp))}return r})
    .catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match("index.html"))))});
