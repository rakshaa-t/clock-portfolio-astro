import { prefersReducedMotion } from './shared.js';

// ═══ ABOUT — click sounds + toggle ═══
const AboutAudioCtx=window.AudioContext||window.webkitAudioContext;
let aboutAudioCtx=null;
function _ensureAboutCtx(){
  if(!aboutAudioCtx)aboutAudioCtx=new AboutAudioCtx();
  if(aboutAudioCtx.state==='suspended')aboutAudioCtx.resume();
  return aboutAudioCtx;
}
function aboutClickSound(type){
  const audio=window.__clockAudio;
  if(!audio||!audio.on||prefersReducedMotion)return;
  _ensureAboutCtx();
  const t=aboutAudioCtx.currentTime;
  const bufLen=aboutAudioCtx.sampleRate*0.015;
  const buf=aboutAudioCtx.createBuffer(1,bufLen,aboutAudioCtx.sampleRate);
  const d=buf.getChannelData(0);
  for(let i=0;i<bufLen;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/bufLen,3);
  const src=aboutAudioCtx.createBufferSource();src.buffer=buf;
  const bp=aboutAudioCtx.createBiquadFilter();
  bp.type='bandpass';bp.frequency.value=type==='primary'?2200:3400;bp.Q.value=type==='primary'?1.2:1.8;
  const g=aboutAudioCtx.createGain();
  g.gain.setValueAtTime(type==='primary'?0.5:0.35,t);
  g.gain.exponentialRampToValueAtTime(0.001,t+0.025);
  src.connect(bp);bp.connect(g);g.connect(aboutAudioCtx.destination);
  src.start(t);src.stop(t+0.025);
}
const aboutPrimaryBtn=document.querySelector('.about-cta-primary');
if(aboutPrimaryBtn){
  aboutPrimaryBtn.addEventListener('mousedown',()=>aboutClickSound('primary'));
  aboutPrimaryBtn.addEventListener('touchstart',()=>aboutClickSound('primary'),{passive:true});
}
document.querySelectorAll('.about-cta-strip .about-cta').forEach(btn=>{
  btn.addEventListener('mousedown',()=>aboutClickSound('secondary'));
  btn.addEventListener('touchstart',()=>aboutClickSound('secondary'),{passive:true});
});

// Stack cards shuffle sound
let stackGain=null,stackSrc=null;
function stackShuffleStart(){
  const audio=window.__clockAudio;
  if(!audio||!audio.on||prefersReducedMotion)return;
  _ensureAboutCtx();
  stackShuffleStop();
  const t=aboutAudioCtx.currentTime;
  const dur=0.25;
  const bufLen=Math.ceil(aboutAudioCtx.sampleRate*dur);
  const buf=aboutAudioCtx.createBuffer(1,bufLen,aboutAudioCtx.sampleRate);
  const d=buf.getChannelData(0);
  for(let i=0;i<bufLen;i++){
    const p=i/bufLen;
    const env=Math.sin(p*Math.PI)*Math.pow(1-p,0.6);
    d[i]=(Math.random()*2-1)*env;
  }
  stackSrc=aboutAudioCtx.createBufferSource();stackSrc.buffer=buf;
  const bp=aboutAudioCtx.createBiquadFilter();
  bp.type='bandpass';bp.Q.value=0.7;
  bp.frequency.setValueAtTime(1000,t);
  bp.frequency.linearRampToValueAtTime(3200,t+dur);
  stackGain=aboutAudioCtx.createGain();
  stackGain.gain.setValueAtTime(0.25,t);
  stackGain.gain.exponentialRampToValueAtTime(0.001,t+dur);
  stackSrc.connect(bp);bp.connect(stackGain);stackGain.connect(aboutAudioCtx.destination);
  stackSrc.start(t);stackSrc.stop(t+dur);
  stackSrc.onended=()=>{stackSrc=null;stackGain=null;};
}
function stackShuffleStop(){
  if(stackGain&&aboutAudioCtx){
    try{stackGain.gain.cancelScheduledValues(aboutAudioCtx.currentTime);
    stackGain.gain.setValueAtTime(stackGain.gain.value,aboutAudioCtx.currentTime);
    stackGain.gain.exponentialRampToValueAtTime(0.001,aboutAudioCtx.currentTime+0.03);}catch(e){}
  }
  if(stackSrc){try{stackSrc.stop(aboutAudioCtx.currentTime+0.03);}catch(e){}}
  stackSrc=null;stackGain=null;
}
const stackCardsEl=document.querySelector('.stack-cards');
if(stackCardsEl){
  stackCardsEl.addEventListener('mouseenter',stackShuffleStart);
  stackCardsEl.addEventListener('mouseleave',stackShuffleStop);
  let stackTouched=false;
  stackCardsEl.addEventListener('touchstart',(e)=>{
    if(!stackTouched){
      stackTouched=true;
      stackCardsEl.classList.add('touched');
      stackShuffleStart();
    }else{
      stackTouched=false;
      stackCardsEl.classList.remove('touched');
      stackShuffleStop();
    }
  },{passive:true});
  document.addEventListener('touchstart',(e)=>{
    if(stackTouched&&!stackCardsEl.contains(e.target)){
      stackTouched=false;
      stackCardsEl.classList.remove('touched');
      stackShuffleStop();
    }
  },{passive:true});
}

// Location toggle
const locToggle=document.getElementById('locationToggle');
const locText=document.getElementById('locationText');
if(locToggle){
  function toggleLocation(){
    locToggle.classList.toggle('on');
    const isOn=locToggle.classList.contains('on');
    locToggle.setAttribute('aria-checked',isOn);
    locText.textContent=isOn?'Remote':'IST and UTC+0';
    aboutClickSound('secondary');
  }
  locToggle.addEventListener('mousedown',toggleLocation);
  locToggle.addEventListener('touchstart',(e)=>{e.preventDefault();toggleLocation();},{passive:false});
  locToggle.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();toggleLocation();}});
}

// About dropdowns
const _aboutDropData={
  agencies:[
    {name:'Doodleblue'}
  ],
  companies:[
    {name:'Adiagnosis'},
    {name:'Dealdoc'},
    {name:'Tickle'},
    {name:'Ova App'},
    {name:'Cognix Health'},
    {name:'Bewakoof.com'},
    {name:'Meyraki'},
    {name:'Indian Oil Company'},
    {name:'Inaam'},
    {name:'ENA'},
    {name:'Kodo Card'},
    {name:'Euman Technologies'},
    {name:'KG International'},
    {name:'Tennishop UAE'},
    {name:'Nourish App'},
    {name:'Unidel'},
    {name:'Lido Learning'},
    {name:'Unifynd'},
    {name:'Reverce'},
    {name:'Nesto Group'}
  ],
  leaders:[
    {name:'Tina Hua'},
    {name:'Angie Lee'},
    {name:'Aritra Senugupta'},
    {name:'Sarthak Sharma'},
    {name:'Max McQuillan'},
    {name:'Hannah Wartooth'},
    {name:'Neerav J'},
    {name:'Amrita Singh'},
    {name:'Rohit Biwas'},
    {name:'Arash'},
    {name:'Sunny'},
    {name:'Raj Karan'},
    {name:'Deepti Singhi'},
    {name:'Nyshita Jain'},
    {name:'Thomas Phua'},
    {name:'Rohit Goel'},
    {name:'Sagar Sharma'},
    {name:'Maruthy Ramgandhi'}
  ]
};
let _openDrop=null;
document.querySelectorAll('.about-drop-trigger').forEach(trigger=>{
  trigger.addEventListener('click',e=>{
    e.stopPropagation();
    const key=trigger.dataset.drop;
    if(_openDrop){_openDrop.classList.remove('open');if(_openDrop.parentElement===trigger){_openDrop=null;return;}_openDrop=null;}
    let wrap=trigger.querySelector('.about-drop-wrap');
    if(!wrap){
      wrap=document.createElement('div');
      wrap.className='about-drop-wrap';
      const drop=document.createElement('div');
      drop.className='about-dropdown';
      (_aboutDropData[key]||[]).forEach(item=>{
        const el=document.createElement('span');
        el.className='about-dropdown-item';
        el.textContent=item.name;
        drop.appendChild(el);
      });
      drop.addEventListener('wheel',ev=>{
        const atTop=drop.scrollTop<=0;
        const atBottom=drop.scrollTop+drop.clientHeight>=drop.scrollHeight;
        if((atTop&&ev.deltaY<0)||(atBottom&&ev.deltaY>0))ev.preventDefault();
      },{passive:false});
      drop.addEventListener('touchmove',ev=>{ev.stopPropagation();},{passive:false});
      wrap.appendChild(drop);
      const fade=document.createElement('div');
      fade.className='about-drop-fade hidden';
      wrap.appendChild(fade);
      trigger.appendChild(wrap);
      requestAnimationFrame(()=>{
        const needsScroll=drop.scrollHeight>drop.clientHeight+2;
        if(needsScroll)fade.classList.remove('hidden');
      });
      drop.addEventListener('scroll',()=>{
        const atBottom=drop.scrollTop+drop.clientHeight>=drop.scrollHeight-2;
        fade.classList.toggle('hidden',atBottom);
      });
    }
    requestAnimationFrame(()=>wrap.classList.add('open'));
    _openDrop=wrap;
  });
});
document.addEventListener('click',()=>{if(_openDrop){_openDrop.classList.remove('open');_openDrop=null;}});

// Email link
const _emailLink=document.getElementById('aboutEmailLink');
let _emailCopied=false;
if(_emailLink){
  const _emailW=_emailLink.offsetWidth;
  _emailLink.style.display='inline-block';
  _emailLink.style.minWidth=_emailW+'px';
  _emailLink.addEventListener('click',e=>{
    e.preventDefault();
    e.stopPropagation();
    if(_emailCopied){
      _emailLink.textContent='hey@raksha.design';
      _emailCopied=false;
      return;
    }
    const iframe=document.createElement('iframe');
    iframe.style.display='none';
    document.body.appendChild(iframe);
    iframe.contentWindow.location.href='mailto:hey@raksha.design';
    setTimeout(()=>document.body.removeChild(iframe),500);
    navigator.clipboard.writeText('hey@raksha.design').then(()=>{
      _emailLink.textContent='copied to clipboard';
      _emailCopied=true;
    });
  });
}
