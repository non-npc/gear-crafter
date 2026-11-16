"use strict";
(()=>{
 const files={"⌚":"231a.png","⏭":"23ed.png","⏱":"23f1.png","⏳":"23f3.png","☕":"2615.png","⚒️":"2692-fe0f.png","⚔️":"2694-fe0f.png","⚙":"2699.png","⚙️":"2699-fe0f.png","⚪":"26aa.png","✨":"2728.png","⭐":"2b50.png","🌈":"1f308.png","🌟":"1f31f.png","🌰":"1f330.png","🌱":"1f331.png","🌸":"1f338.png","🌻":"1f33b.png","🌿":"1f33f.png","🍀":"1f340.png","🍁":"1f341.png","🍃":"1f343.png","🍄":"1f344.png","🍌":"1f34c.png","🍴":"1f374.png","🍼":"1f37c.png","🍾":"1f37e.png","🎀":"1f380.png","🎁":"1f381.png","🎆":"1f386.png","🎉":"1f389.png","🎒":"1f392.png","🎖️":"1f396-fe0f.png","🎩":"1f3a9.png","🎯":"1f3af.png","🎲":"1f3b2.png","🎵":"1f3b5.png","🎶":"1f3b6.png","🏆":"1f3c6.png","🏛️":"1f3db-fe0f.png","🏹":"1f3f9.png","🏺":"1f3fa.png","👑":"1f451.png","👒":"1f452.png","👓":"1f453.png","👗":"1f457.png","👟":"1f45f.png","💍":"1f48d.png","💎":"1f48e.png","💕":"1f495.png","💠":"1f4a0.png","💪":"1f4aa.png","💫":"1f4ab.png","📊":"1f4ca.png","📖":"1f4d6.png","📜":"1f4dc.png","📤":"1f4e4.png","📥":"1f4e5.png","📦":"1f4e6.png","📿":"1f4ff.png","🔇":"1f507.png","🔊":"1f50a.png","🔍":"1f50d.png","🔒":"1f512.png","🔤":"1f524.png","🔧":"1f527.png","🔨":"1f528.png","🔮":"1f52e.png","🔱":"1f531.png","🔹":"1f539.png","🕒":"1f552.png","🕯️":"1f56f-fe0f.png","🗑️":"1f5d1-fe0f.png","🗝️":"1f5dd-fe0f.png","🗡️":"1f5e1-fe0f.png","🛡️":"1f6e1-fe0f.png","🥄":"1f944.png","🥤":"1f964.png","🥨":"1f968.png","🥾":"1f97e.png","🦄":"1f984.png","🦆":"1f986.png","🦺":"1f9ba.png","🧀":"1f9c0.png","🧙":"1f9d9.png","🧣":"1f9e3.png","🧤":"1f9e4.png","🧥":"1f9e5.png","🧦":"1f9e6.png","🧩":"1f9e9.png","🧪":"1f9ea.png","🧭":"1f9ed.png","🧴":"1f9f4.png","🧵":"1f9f5.png","🧸":"1f9f8.png","🧹":"1f9f9.png","🧺":"1f9fa.png","🧻":"1f9fb.png","🧿":"1f9ff.png","🪁":"1fa81.png","🪃":"1fa83.png","🪄":"1fa84.png","🪅":"1fa85.png","🪆":"1fa86.png","🪓":"1fa93.png","🪖":"1fa96.png","🪗":"1fa97.png","🪙":"1fa99.png","🪚":"1fa9a.png","🪞":"1fa9e.png","🪠":"1faa0.png","🪣":"1faa3.png","🪥":"1faa5.png","🪩":"1faa9.png","🪬":"1faac.png","🪷":"1fab7.png","🪸":"1fab8.png","🫖":"1fad6.png","🫧":"1fae7.png"};
 const tokens=Object.keys(files).sort((a,b)=>b.length-a.length);
 const escaped=tokens.map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
 const matcher=new RegExp('('+escaped.join('|')+')','gu');
 function convert(textNode){
   if(!textNode.parentNode||!textNode.nodeValue)return;
   const parent=textNode.parentNode;
   if(['SCRIPT','STYLE','TEXTAREA','OPTION','SVG','NOSCRIPT'].includes(parent.nodeName))return;
   const value=textNode.nodeValue;
   matcher.lastIndex=0;
   if(!matcher.test(value))return;
   matcher.lastIndex=0;
   const fragment=document.createDocumentFragment();let cursor=0,match;
   while((match=matcher.exec(value))!==null){
     if(match.index>cursor)fragment.appendChild(document.createTextNode(value.slice(cursor,match.index)));
     const img=document.createElement('img');
     img.className='gc-emoji';img.src='assets/icons/'+files[match[0]];
     img.alt=match[0];img.decoding='async';img.draggable=false;
     fragment.appendChild(img);cursor=matcher.lastIndex;
   }
   if(cursor<value.length)fragment.appendChild(document.createTextNode(value.slice(cursor)));
   parent.replaceChild(fragment,textNode);
 }
 function scan(node){
  if(node.nodeType===3){convert(node);return}
  if(node.nodeType!==1&&node.nodeType!==11)return;
  if(node.nodeType===1&&['SCRIPT','STYLE','TEXTAREA','SVG','NOSCRIPT'].includes(node.nodeName))return;
  const walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT);const nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  for(const text of nodes)convert(text);
 }
 scan(document.body);
 const observer=new MutationObserver(records=>{
   for(const r of records){
    if(r.type==='characterData')convert(r.target);
    for(const n of r.addedNodes)scan(n);
   }
 });
 observer.observe(document.body,{subtree:true,childList:true,characterData:true});
})();
