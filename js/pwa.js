/* Gear Crafter Mobile install guide and offline asset manager. */
(()=>{'use strict';
let deferred=null,registration=null;
const $=id=>document.getElementById(id);
const installed=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
const ios=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const safari=()=>/Safari/i.test(navigator.userAgent)&&!/CriOS|FxiOS|EdgiOS|OPiOS/i.test(navigator.userAgent);
const setStatus=msg=>{if($('install-status'))$('install-status').textContent=msg};
const setBanner=()=>{const banner=$('install-banner');if(!banner)return;const hide=installed()||sessionStorage.getItem('gc-install-dismissed')==='1'||!('serviceWorker'in navigator);banner.hidden=hide;const b=$('install-game');if(b)b.hidden=installed()};
function installHelp(){if(installed()){setStatus('Installed! Open Gear Crafter from your home screen.');return}
 if(ios()){setStatus(safari()?'On iPhone/iPad: tap Safari’s Share button, choose “Add to Home Screen”, then tap Add. If you see “Open as Web App”, leave it enabled.':'On iPhone/iPad: open this page in Safari, then tap Share → Add to Home Screen → Add.');return}
 setStatus('In Chrome or another supported browser, open the browser menu and select “Install app” or “Add to Home screen” if the install prompt is unavailable.');}
async function doInstall(){sessionStorage.setItem('gc-install-dismissed','1');setBanner();if(installed()){setStatus('Gear Crafter is already installed!');return}if(deferred){const prompt=deferred;deferred=null;try{await prompt.prompt();const choice=await prompt.userChoice;if(choice.outcome==='accepted'){setBanner();setStatus('Installation accepted — look for Gear Crafter on your home screen.')}else installHelp()}catch(e){installHelp()}return}installHelp()}
function requestCache(){if(!navigator.serviceWorker?.controller){setStatus('Offline preparation requires an active service worker. Open the site with HTTPS and refresh.');return}navigator.serviceWorker.controller.postMessage({type:'CACHE_ALL'});$('offline-progress').textContent='Preparing offline items…'}
function onMessage(event){const d=event.data||{};if(d.type==='OFFLINE_ERROR'){$('offline-progress').textContent='Could not prepare offline files';return}if(d.type!=='OFFLINE_PROGRESS')return;const pct=d.total?Math.round(d.done/d.total*100):0;$('offline-progress').textContent=d.complete?'Ready for offline play':`${d.done}/${d.total} assets (${pct}%)${d.failed?' · '+d.failed+' to retry':''}`;$('offline-progress-bar').style.width=pct+'%';if(d.complete)localStorage.setItem('gc-offline-complete','1');}
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferred=event;setStatus('Ready to install! Tap the button above.');setBanner()});
window.addEventListener('appinstalled',()=>{deferred=null;sessionStorage.setItem('gc-install-dismissed','1');setBanner();setStatus('Installed! Gear Crafter is on your home screen.')});
window.addEventListener('DOMContentLoaded',async()=>{
 $('install-game')?.addEventListener('click',doInstall);$('install-banner-button')?.addEventListener('click',doInstall);
 $('install-banner-dismiss')?.addEventListener('click',()=>{sessionStorage.setItem('gc-install-dismissed','1');setBanner()});
 $('offline-retry')?.addEventListener('click',requestCache);
 document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>window.scrollTo({top:0,behavior:'auto'})));
 localStorage.removeItem('gc-app-installed');setBanner();installHelp();
 if(!('serviceWorker'in navigator)){setStatus('This browser does not support offline installation.');$('offline-progress').textContent='Unavailable';return}
 try{registration=await navigator.serviceWorker.register('./service-worker.js',{scope:'./'});await navigator.serviceWorker.ready;
  navigator.serviceWorker.addEventListener('message',onMessage);
  if(!navigator.serviceWorker.controller){await new Promise(resolve=>{const timeout=setTimeout(resolve,4500);navigator.serviceWorker.addEventListener('controllerchange',()=>{clearTimeout(timeout);resolve()},{once:true})})}
  if(navigator.serviceWorker.controller)requestCache();
  else $('offline-progress').textContent='Refresh to prepare offline items';
 }catch(e){$('offline-progress').textContent='Offline setup unavailable';setStatus('Offline installation requires HTTPS or localhost. '+e.message)}
});
})();
