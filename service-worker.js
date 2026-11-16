/* Gear Crafter Mobile — versioned offline cache, strictly scoped to this PWA. */
const VERSION='gc-mobile-1.0.1';
const CORE_CACHE=VERSION+'-core', ART_CACHE=VERSION+'-art';
const CORE=['./','index.html','manifest.webmanifest','assets-manifest.json','css/style.css','css/mobile.css','js/data.js','js/audio.js','js/visual-data.js','js/extra-items.js','js/engine.js','js/app.js','js/icon-assets.js','js/pwa.js','assets/pwa/icon-192.png','assets/pwa/icon-512.png','assets/pwa/maskable-512.png'];
self.addEventListener('install',event=>{event.waitUntil((async()=>{const cache=await caches.open(CORE_CACHE);await cache.addAll(CORE);await self.skipWaiting()})())});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('gc-mobile-')&&!key.startsWith(VERSION))await caches.delete(key);await self.clients.claim()})())});
const allClients=()=>self.clients.matchAll({includeUncontrolled:true,type:'window'});
async function notify(data){for(const client of await allClients())client.postMessage(data)}
let ongoing=null;
async function prepareAll(){if(ongoing)return ongoing;ongoing=(async()=>{
 try{
  const res=await fetch(new URL('assets-manifest.json',self.registration.scope),{cache:'no-store'});
  if(!res.ok)throw Error('Could not retrieve offline file list');
  const manifest=await res.json(),files=manifest.files||[],cache=await caches.open(ART_CACHE);
  let done=0,failed=0;
  for(let i=0;i<files.length;i+=12){const batch=files.slice(i,i+12);
   await Promise.all(batch.map(async name=>{
    const url=new URL(name,self.registration.scope);try{
     if(!(await cache.match(url))){const r=await fetch(url);if(!r.ok)throw Error(String(r.status));await cache.put(url,r)}
    }catch(e){failed++}finally{done++}
    }
   ));
   await notify({type:'OFFLINE_PROGRESS',done,total:files.length,failed,complete:false});
  }
  await notify({type:'OFFLINE_PROGRESS',done,total:files.length,failed,complete:failed===0});
 }catch(e){await notify({type:'OFFLINE_ERROR',message:String(e.message||e)})}
 finally{ongoing=null}
})();return ongoing}
self.addEventListener('message',event=>{if(event.data?.type==='CACHE_ALL')event.waitUntil(prepareAll());if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',event=>{const req=event.request,url=new URL(req.url);if(req.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
 if(req.mode==='navigate'){event.respondWith((async()=>{try{const live=await fetch(req);if(live.ok)(await caches.open(CORE_CACHE)).put(new URL('./',self.registration.scope),live.clone());return live}catch{const cache=await caches.open(CORE_CACHE);return await cache.match(new URL('./',self.registration.scope))||await cache.match(new URL('index.html',self.registration.scope))||Response.error()}})());return}
 event.respondWith((async()=>{const cached=await caches.match(req);if(cached)return cached;try{const live=await fetch(req);if(live.ok&&(url.pathname.includes('/assets/')||url.pathname.endsWith('.js')||url.pathname.endsWith('.css')))(await caches.open(ART_CACHE)).put(req,live.clone());return live}catch{return Response.error()}})());
});
