/* 先联网再吃缓存：推了新版她联网就能拿到，断网也还能开 */
const C='yizhan-v1';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const img=/\.(png|jpg|jpeg|webp|svg)$/i.test(new URL(e.request.url).pathname);
  if(img){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
      const c=res.clone();caches.open(C).then(k=>k.put(e.request,c));return res;
    }).catch(()=>r)));
  }else{
    e.respondWith(fetch(e.request).then(res=>{
      const c=res.clone();caches.open(C).then(k=>k.put(e.request,c));return res;
    }).catch(()=>caches.match(e.request)));
  }
});
