'use strict';
window.GCEngine=(()=>{
 const D=window.GCData;
 const random=a=>a[Math.floor(Math.random()*a.length)];
 const randomInt=n=>Math.floor(Math.random()*n);
 const invented=()=>{let word=random(D.syllables1)+random(D.syllables2)+(Math.random()<.55?random(D.syllables3):'');return word[0].toUpperCase()+word.slice(1)};
 const prefix=()=>{let n=Math.random();if(n<.12)return invented()+(Math.random()<.5?'-Touched':'');if(n<.57)return random(D.adjectives);if(n<.84)return random(D.materials);return random(D.adjectives)+' '+random(D.materials)};
 const suffix=()=>{let n=Math.random();if(n<.12)return 'of '+invented();if(n<.30)return 'of '+random(D.realms);if(n<.85)return 'of '+random(D.suffixThings);return 'of the '+random(['Everlasting','Lost','Whispering','Fabled','Tiny','Golden','Ancient'])+' '+random(['Moon','Star','Wizard','King','Cat','Fox','Dragon','Dream'])};

 const V=window.GCVisualData;
 const visualThemes={
  frost:['frost','crystals','stars'],ice:['frost','crystals'],snow:['frost','stars'],
  moon:['moon','stars','comet'],lunar:['moon','stars'],astral:['stars','comet','moon'],celestial:['stars','comet'],star:['stars','comet'],
  flower:['flowers','sunflowers','leaves'],sunflower:['sunflowers','flowers'],garden:['flowers','leaves'],nature:['leaves','clover'],
  thunder:['lightning','sparkles'],storm:['lightning','bubbles'],fire:['flames','sparkles'],ember:['flames','stars'],
  bubble:['bubbles','heart'],candy:['candy','ribbon'],sweet:['candy','heart'],peach:['flowers','ribbon'],
  royal:['crown','gem'],gold:['crown','gem'],crystal:['crystals','gem'],rainbow:['rainbow','sparkles'],
  magic:['sparkles','runes'],arcane:['runes','orb'],runic:['runes','sparkles'],spark:['sparkles','stars'],
  love:['heart','ribbon'],friend:['heart','ribbon'],dragon:['flames','crystals'],unicorn:['rainbow','heart'],
  sleep:['moon','bubbles'],nap:['moon','stars'],dream:['moon','comet'],sun:['sunflowers','stars'],
  fairy:['flowers','sparkles'],tiny:['heart','stars'],wish:['comet','stars']
 };
 function hash(text){let h=2166136261;for(let j=0;j<text.length;j++){h^=text.charCodeAt(j);h=Math.imul(h,16777619)}return h>>>0}
 function visualFor(item,seed){const seedNumber=seed===undefined?hash(item.key):seed>>>0;
  const variant=seedNumber%3;
  const rarity=D.rarities.find(x=>x.name===item.rarity)?.name||'Common';
  const max=rarity==='Common'?1:['Uncommon','Magic','Rare'].includes(rarity)?1:2;
  let count=rarity==='Common'?(seedNumber%4===0?1:0):rarity==='Uncommon'?(seedNumber%3===0?0:1):rarity==='Magic'||rarity==='Rare'?(seedNumber%5===0?0:1):1+(seedNumber%2);
  count=Math.min(max,count);
  const txt=(item.pre+' '+item.suf).toLowerCase();const themed=[];
  for(const [keyword,list] of Object.entries(visualThemes))if(txt.includes(keyword))for(const name of list)if(!themed.includes(name))themed.push(name);
  const all=V.overlays;let chosen=[];
  for(let j=0;j<count;j++){
   let pick;if(themed.length&&j===0)pick=themed[seedNumber%themed.length];
   else pick=all[(Math.floor(seedNumber/((j+1)*7+1))+j*11)%all.length];
   if(chosen.includes(pick))pick=all.find((n,index)=>!chosen.includes(n)&&((index+seedNumber)%all.length>=0))||pick;
   chosen.push(pick);
  }
  return {variant,overlays:chosen,seed:seedNumber};
 }
 function appearance(item){if(item.visual&&Number.isInteger(item.visual.variant)&&Array.isArray(item.visual.overlays))return item.visual;return visualFor(item)}

 function pickBase(){
  const recent=Array.isArray(state.recentBases)?state.recentBases:[];
  const pool=Object.entries(D.categories).flatMap(([cat,items])=>items.map(base=>({cat,base})));
  // Strong soft exclusion instead of a hard ban: every base always remains possible.
  const weights=pool.map(({base})=>{const i=recent.lastIndexOf(base[1]);return i<0?100:i>=recent.length-8?1:i>=recent.length-20?5:15});
  const sum=weights.reduce((a,b)=>a+b,0);let roll=Math.random()*sum;
  for(let i=0;i<pool.length;i++){roll-=weights[i];if(roll<0)return pool[i]}
  return pool[pool.length-1];
 }
 function create(){const roll=randomInt(10000);let total=0,rarity=D.rarities[0];for(const r of D.rarities){total+=r.weight;if(roll<total){rarity=r;break}}
 const {cat,base}=pickBase();let affixRoll=Math.random();let hasPrefix=affixRoll>=.29&&affixRoll<.74||affixRoll>=.74,hasSuffix=affixRoll>=.57;
 // 29% no affix, 28% prefix only, 17% suffix only, 26% both
 hasPrefix=affixRoll>=.29&&affixRoll<.57||affixRoll>=.74;
 hasSuffix=affixRoll>=.57;
 let pre=hasPrefix?prefix():'',suf=hasSuffix?suffix():'';
 const name=[pre,base[1],suf].filter(Boolean).join(' ');
 const identity=[cat,base[1],rarity.name,pre,suf];
 const temp={key:JSON.stringify(identity),pre,suf,rarity:rarity.name};
 const visual=visualFor(temp,randomInt(0x100000000));
 const key=JSON.stringify([name,rarity.name]);
 return {key,category:cat,base:base[1],emoji:base[0],rarity:rarity.name,pre,suf,name,visual,created:Date.now(),count:1,favorite:false};}
 function initial(){return {version:1,total:0,duplicates:0,items:{},recent:[],achievements:{},counts:Object.fromEntries(D.rarities.map(r=>[r.name,0])),stats:{prefix:0,suffix:0,both:0,none:0},categories:{},affixes:[],history:[],recentBases:[],settings:{master:70,sfx:80,music:20,density:'balanced',muted:false,duration:3000,effects:'full',autoDismiss:true}}}
 let state=initial(),storeDB=null,saveTimer=null,initComplete=false;
 function collectibleKey(item){return JSON.stringify([item.name||[item.pre,item.base,item.suf].filter(Boolean).join(' '),item.rarity])}
 function normalize(raw){
  const defaults=initial();if(!raw||typeof raw!=='object')return defaults;
  const result={...defaults,...raw,items:{},counts:{...defaults.counts,...raw.counts},stats:{...defaults.stats,...raw.stats},settings:{...defaults.settings,...raw.settings},recent:[],history:Array.isArray(raw.history)?raw.history.slice(-20):[],recentBases:Array.isArray(raw.recentBases)?raw.recentBases.filter(x=>typeof x==='string').slice(-30):[],affixes:Array.isArray(raw.affixes)?raw.affixes:[],achievements:raw.achievements&&typeof raw.achievements==='object'?raw.achievements:{}};
  const prior=raw.items&&typeof raw.items==='object'&&!Array.isArray(raw.items)?raw.items:{};
  const aliases={};let mergedCount=0;
  for(const [oldKey,oldItem] of Object.entries(prior)){
   if(!oldItem||typeof oldItem!=='object'||!oldItem.rarity||!oldItem.base)continue;
   const key=collectibleKey(oldItem);aliases[oldKey]=key;
   const qty=Number.isFinite(oldItem.count)&&oldItem.count>0?Math.floor(oldItem.count):1;
   if(!result.items[key]) result.items[key]={...oldItem,key,count:qty,favorite:!!oldItem.favorite};
   else {result.items[key].count+=qty;result.items[key].favorite=!!(result.items[key].favorite||oldItem.favorite);mergedCount+=qty;}
  }
  result.recent=Array.isArray(raw.recent)?raw.recent.map(k=>aliases[k]||k).filter(k=>result.items[k]).slice(0,15):[];
  // Each craft beyond the first of its name+rarity is a duplicate, including merged historical variants.
  const totalFromItems=Object.values(result.items).reduce((sum,item)=>sum+item.count,0);
  result.duplicates=Math.max(0,totalFromItems-Object.keys(result.items).length);
  // Retain the original total where possible; the inventory and duplicate counter must agree.
  result.total=Math.max(Number.isFinite(raw.total)?raw.total:0,totalFromItems);
  return result;
 }
 function load(){return new Promise(resolve=>{if(!('indexedDB'in window)){try{state=normalize(JSON.parse(localStorage.getItem('gear-crafter-save')))}catch{}initComplete=true;resolve();return}let request=indexedDB.open('gear-crafter',1);request.onupgradeneeded=()=>{request.result.createObjectStore('saves')};request.onerror=()=>{try{state=normalize(JSON.parse(localStorage.getItem('gear-crafter-save')))}catch{}initComplete=true;resolve()};request.onsuccess=()=>{storeDB=request.result;let txn=storeDB.transaction('saves','readonly'),req=txn.objectStore('saves').get('main');req.onsuccess=()=>{try{state=normalize(req.result||JSON.parse(localStorage.getItem('gear-crafter-save')))}catch{state=initial()}initComplete=true;resolve()};req.onerror=()=>{initComplete=true;resolve()}}})}
 function save(){if(!initComplete)return;clearTimeout(saveTimer);saveTimer=setTimeout(()=>{try{let serialized=JSON.stringify(state);if(storeDB){let tx=storeDB.transaction('saves','readwrite');tx.objectStore('saves').put(state,'main');tx.onerror=()=>{try{localStorage.setItem('gear-crafter-save',serialized)}catch(e){console.warn('Save storage full',e)}}}else localStorage.setItem('gear-crafter-save',serialized)}catch(e){console.warn('Save failed',e)}},140)}
 function commit(item){item.key=collectibleKey(item);let isNew=!state.items[item.key];if(isNew)state.items[item.key]=item;else state.items[item.key].count++,state.duplicates++;state.total++;state.recentBases.push(item.base);state.recentBases=state.recentBases.slice(-30);state.counts[item.rarity]=(state.counts[item.rarity]||0)+1;
 let kind=item.pre?(item.suf?'both':'prefix'):(item.suf?'suffix':'none');state.stats[kind]=(state.stats[kind]||0)+1;state.categories[item.category]=(state.categories[item.category]||0)+1;
 let affixes=new Set(state.affixes);if(item.pre)affixes.add('p:'+item.pre);if(item.suf)affixes.add('s:'+item.suf);state.affixes=[...affixes];state.recent.unshift(item.key);state.recent=state.recent.slice(0,15);state.history.push({name:item.name,rarity:item.rarity,time:item.created,new:isNew});state.history=state.history.slice(-20);
 let achievements=[];const s=summary();for(let [id,icon,name,description,test] of D.achievements){if(!state.achievements[id]&&test(s)){state.achievements[id]=Date.now();achievements.push({id,icon,name,description})}}
 save();return {isNew,achievements,item:state.items[item.key]}}
 function summary(){return {total:state.total,unique:Object.keys(state.items).length,duplicates:state.duplicates,rarity:state.counts,categories:state.categories,distinctAffixes:state.affixes.length,...state.stats}}
 function changeSettings(settings){state.settings={...state.settings,...settings};save()}
 function toggleFavorite(key){if(state.items[key]){state.items[key].favorite=!state.items[key].favorite;save()}}
 function exportSave(){return JSON.stringify({app:'gear-crafter',exported:new Date().toISOString(),save:state},null,2)}
 function importSave(json){const parsed=JSON.parse(json);if(parsed.app!=='gear-crafter'||!parsed.save||parsed.save.version!==1)throw Error('This is not a valid Gear Crafter save file.');if(!Number.isInteger(parsed.save.total)||parsed.save.total<0||!parsed.save.items||Array.isArray(parsed.save.items))throw Error('Save data is malformed.');state=normalize(parsed.save);save();return state}
 function reset(){state=initial();save()}
 function find(key){return state.items[key]}
 return {load,save,create,commit,appearance,summary,changeSettings,toggleFavorite,exportSave,importSave,reset,find,get state(){return state},rarities:D.rarities};
})();
