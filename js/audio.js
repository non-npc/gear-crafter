'use strict';
window.GCAudio=(()=>{
 let ctx=null,ambientTimer=null,ambientStep=0,hammerNoise=null;
 const defaults={master:70,sfx:80,music:20,density:'balanced',muted:false};
 let options={...defaults};
 function configure(settings){options={...options,...settings};syncAmbient()}
 function unlock(){try{ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();if(ctx.state==='suspended')ctx.resume()}catch(e){ctx=null}}
 function tone(freq,duration=.14,kind='sine',volume=.12,delay=0,slide=1){if(!ctx||options.muted)return;let gain=ctx.createGain(),osc=ctx.createOscillator();let start=ctx.currentTime+delay;osc.type=kind;osc.frequency.setValueAtTime(freq,start);if(slide!==1)osc.frequency.exponentialRampToValueAtTime(Math.max(20,freq*slide),start+duration);const level=Math.max(0,Math.min(1,options.master/100*options.sfx/100))*volume;gain.gain.setValueAtTime(.00001,start);gain.gain.exponentialRampToValueAtTime(Math.max(.00002,level),start+.012);gain.gain.exponentialRampToValueAtTime(.00001,start+duration);osc.connect(gain);gain.connect(ctx.destination);osc.start(start);osc.stop(start+duration+.015)}
 // Short, layered metal-on-metal strike. All sound is generated locally through Web Audio.
 // A sharp noisy transient plus several detuned, quickly-decaying metal resonances.
 function hammerStrike(){
  if(!ctx||options.muted||options.density==='minimal')return;
  const volume=Math.max(0,Math.min(1,options.master/100*options.sfx/100));
  if(volume===0)return;
  if(!hammerNoise){
   hammerNoise=ctx.createBuffer(1,Math.floor(ctx.sampleRate*.19),ctx.sampleRate);
   const data=hammerNoise.getChannelData(0);
   for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1);
  }
  const t=ctx.currentTime,variation=.94+Math.random()*.12;
  const transient=ctx.createBufferSource();transient.buffer=hammerNoise;
  const highpass=ctx.createBiquadFilter();highpass.type='highpass';highpass.frequency.value=650;
  const snap=ctx.createGain();snap.gain.setValueAtTime(.0001,t);
  snap.gain.linearRampToValueAtTime(volume*.19,t+.002);
  snap.gain.exponentialRampToValueAtTime(.0001,t+.095);
  transient.connect(highpass);highpass.connect(snap);snap.connect(ctx.destination);
  transient.start(t);transient.stop(t+.1);
  [480,790,1370,2210].forEach((freq,i)=>{
   const osc=ctx.createOscillator(),gain=ctx.createGain();
   osc.type='sine';osc.frequency.value=freq*variation*(1+(Math.random()-.5)*.025);
   gain.gain.setValueAtTime(Math.max(.0001,volume*[.095,.072,.045,.025][i]),t);
   gain.gain.exponentialRampToValueAtTime(.0001,t+[.21,.17,.14,.095][i]);
   osc.connect(gain);gain.connect(ctx.destination);osc.start(t);osc.stop(t+.23);
  });
 }
 function chord(notes,delay=0,volume=.09,duration=.34){notes.forEach((n,i)=>tone(n,duration,'sine',volume,delay+i*.035))}
 const last={};function play(event){unlock();if(!ctx||options.muted)return;let now=performance.now();if(last[event]&&now-last[event]<75)return;last[event]=now;const r=()=>.95+Math.random()*.12;
 if(event==='click'){if(options.density==='minimal')return;tone(680*r(),.085,'sine',.065);tone(985,.08,'sine',.025,.055)}
 if(event==='ui'){if(options.density==='minimal')return;tone(850*r(),.07,'triangle',.047)}
 if(event==='hammer'){hammerStrike();return}
 if(event==='craft'){if(options.density==='minimal')return;tone(260*r(),.12,'triangle',.04,0,1.3);tone(520,.11,'sine',.035,.06)}
 if(event==='common'){if(options.density==='minimal')return;tone(600*r(),.12,'sine',.06)}
 if(event==='uncommon')chord([610,790],0,.075,.17);
 if(event==='magic')chord([550,740,980],0,.076,.21);
 if(event==='rare')chord([523,659,784,1047],0,.095,.25);
 if(event==='epic')chord([440,554,659,880,1109],0,.105,.32);
 if(event==='legendary')chord([392,523,659,784,1047,1318],0,.12,.44);
 if(event==='mythic'){chord([349,440,523,698,880,1047,1397],0,.13,.5);tone(180,.65,'sine',.07,0,2.7)}
 if(event==='rainbow'){chord([523,659,784,1047],0,.11,.35);chord([587,740,880,1175],.25,.11,.35);chord([659,830,988,1318,1568],.5,.12,.55);tone(250,.8,'sine',.065,0,4)}
 if(event==='achievement'){chord([659,784,988,1318],0,.1,.32);chord([784,988,1175],.21,.085,.32)}
 }
 function syncAmbient(){clearInterval(ambientTimer);ambientTimer=null;if(options.density==='full'&&options.music>0&&!options.muted){ambientTimer=setInterval(()=>{if(!ctx)return;const melody=[523,587,659,784,659,587,494,523];const freq=melody[ambientStep++%melody.length];const previous=options.sfx;options.sfx=options.music*.38;tone(freq,1.1,'sine',.05,0);options.sfx=previous},2300)}}
 return {unlock,play,configure,getOptions:()=>({...options})};
})();
