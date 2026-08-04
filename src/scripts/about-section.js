// ═══ ABOUT — click sounds + toggle ═══
// Re-initializes on every page load (ViewTransitions compatible).

function _getCtx(){
  const audio=window.__clockAudio;
  if(!audio||!audio.soundOn)return null;
  return audio.ensure();
}
function aboutClickSound(type){
  const ctx=_getCtx();
  if(!ctx)return;
  const t=ctx.currentTime;
  const bufLen=ctx.sampleRate*0.015;
  const buf=ctx.createBuffer(1,bufLen,ctx.sampleRate);
  const d=buf.getChannelData(0);
  for(let i=0;i<bufLen;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/bufLen,3);
  const src=ctx.createBufferSource();src.buffer=buf;
  const bp=ctx.createBiquadFilter();
  bp.type='bandpass';bp.frequency.value=type==='primary'?2200:3400;bp.Q.value=type==='primary'?1.2:1.8;
  const g=ctx.createGain();
  g.gain.setValueAtTime(type==='primary'?0.5:0.35,t);
  g.gain.exponentialRampToValueAtTime(0.001,t+0.025);
  src.connect(bp);bp.connect(g);g.connect(ctx.destination);
  src.start(t);src.stop(t+0.025);
}

const _aboutDropData={
  agencies:[{name:'Doodleblue'},{name:'Fullsite'}],
  companies:[
    {name:'Study Loop'},{name:'Adiagnosis'},{name:'Dealdoc'},{name:'Tickle'},{name:'Ova App'},
    {name:'Cognix Health'},{name:'Bewakoof.com'},{name:'Meyraki'},
    {name:'Indian Oil Company'},{name:'Inaam'},{name:'ENA'},{name:'Kodo Card'},
    {name:'Euman Technologies'},{name:'KG International'},{name:'Tennishop UAE'},
    {name:'Nourish App'},{name:'Unidel'},{name:'Lido Learning'},
    {name:'Unifynd'},{name:'Reverce'},{name:'Nesto Group'}
  ]
};

function initAbout(){
  const aboutSection=document.getElementById('sec-about');
  if(aboutSection?.dataset.aboutInit==='1') return;
  if(aboutSection) aboutSection.dataset.aboutInit='1';

  const aboutPrimaryBtn=document.querySelector('.about-cta-primary');
  if(!aboutPrimaryBtn) return; // not on portfolio page

  // The beam travels 160% of each word's width. Match its physical velocity
  // across labels by scaling short-word duration from the widest label.
  const syncTextBeamDurations=()=>{
    const targets=[...document.querySelectorAll('.about-drop-trigger,.about-bio-link')];
    const widths=targets.map(target=>target.getBoundingClientRect().width);
    const widest=Math.max(...widths,1);
    widths.forEach((width,index)=>{
      const duration=Math.max(400,Math.round((width/widest)*1300));
      targets[index].style.setProperty('--about-text-beam-duration',`${duration}ms`);
    });
  };
  syncTextBeamDurations();
  document.fonts?.ready?.then(syncTextBeamDurations);

  aboutPrimaryBtn.addEventListener('mousedown',()=>aboutClickSound('primary'));
  aboutPrimaryBtn.addEventListener('touchstart',()=>aboutClickSound('primary'),{passive:true});

  // Subsequent tooltips instant — warm state on the strip
  const ctaStrip=document.querySelector('.about-cta-strip');
  let tipWarmTimer=null;
  document.querySelectorAll('.about-cta-strip .about-cta').forEach(btn=>{
    btn.addEventListener('mousedown',()=>aboutClickSound('secondary'));
    btn.addEventListener('touchstart',()=>aboutClickSound('secondary'),{passive:true});
    btn.addEventListener('mouseenter',()=>{
      if(tipWarmTimer) clearTimeout(tipWarmTimer);
      if(ctaStrip) ctaStrip.classList.add('tip-warm');
    });
    btn.addEventListener('mouseleave',()=>{
      if(tipWarmTimer) clearTimeout(tipWarmTimer);
      tipWarmTimer=setTimeout(()=>{if(ctaStrip) ctaStrip.classList.remove('tip-warm');},300);
    });
  });

  // Stack cards shuffle sound
  let stackGain=null,stackSrc=null,_stackCtx=null;
  function stackShuffleStart(){
    const ctx=_getCtx();if(!ctx)return;_stackCtx=ctx;stackShuffleStop();
    const t=ctx.currentTime;const dur=0.25;
    const bufLen=Math.ceil(ctx.sampleRate*dur);
    const buf=ctx.createBuffer(1,bufLen,ctx.sampleRate);
    const d=buf.getChannelData(0);
    for(let i=0;i<bufLen;i++){const p=i/bufLen;const env=Math.sin(p*Math.PI)*Math.pow(1-p,0.6);d[i]=(Math.random()*2-1)*env;}
    stackSrc=ctx.createBufferSource();stackSrc.buffer=buf;
    const bp=ctx.createBiquadFilter();bp.type='bandpass';bp.Q.value=0.7;
    bp.frequency.setValueAtTime(1000,t);bp.frequency.linearRampToValueAtTime(3200,t+dur);
    stackGain=ctx.createGain();stackGain.gain.setValueAtTime(0.25,t);stackGain.gain.exponentialRampToValueAtTime(0.001,t+dur);
    stackSrc.connect(bp);bp.connect(stackGain);stackGain.connect(ctx.destination);
    stackSrc.start(t);stackSrc.stop(t+dur);
    stackSrc.onended=()=>{stackSrc=null;stackGain=null;};
  }
  function stackShuffleStop(){
    if(stackGain&&_stackCtx){try{stackGain.gain.cancelScheduledValues(_stackCtx.currentTime);stackGain.gain.setValueAtTime(stackGain.gain.value,_stackCtx.currentTime);stackGain.gain.exponentialRampToValueAtTime(0.001,_stackCtx.currentTime+0.03);}catch(e){}}
    if(stackSrc&&_stackCtx){try{stackSrc.stop(_stackCtx.currentTime+0.03);}catch(e){}}
    stackSrc=null;stackGain=null;
  }
  const stackCardsEl=document.querySelector('.stack-cards');
  if(stackCardsEl){
    stackCardsEl.addEventListener('mouseenter',stackShuffleStart);
    stackCardsEl.addEventListener('mouseleave',stackShuffleStop);
    let stackTouched=false;
    stackCardsEl.addEventListener('touchstart',()=>{
      if(!stackTouched){stackTouched=true;stackCardsEl.classList.add('touched');stackShuffleStart();}
      else{stackTouched=false;stackCardsEl.classList.remove('touched');stackShuffleStop();}
    },{passive:true});
    document.addEventListener('touchstart',(e)=>{
      if(stackTouched&&!stackCardsEl.contains(e.target)){stackTouched=false;stackCardsEl.classList.remove('touched');stackShuffleStop();}
    },{passive:true});
  }

  // Location toggle — guard against duplicate listeners on View Transition re-init
  const locToggle=document.getElementById('locationToggle');
  const locText=document.getElementById('locationText');
  if(locToggle&&locText&&!locToggle._bound){
    locToggle._bound=true;
    const locationTextWidth=locText.getBoundingClientRect().width;
    locText.style.display='inline-block';
    locText.style.minWidth=`${locationTextWidth}px`;
    let locationTextTimer=0,locationTextFrame=0;
    function setLocationText(value){
      if(locationTextTimer){clearTimeout(locationTextTimer);locationTextTimer=0;}
      if(locationTextFrame){cancelAnimationFrame(locationTextFrame);locationTextFrame=0;}
      if(locText.textContent===value){
        locText.classList.remove('is-leaving','is-entering');
        return;
      }
      if(window.matchMedia('(prefers-reduced-motion:reduce)').matches){
        locText.classList.remove('is-leaving','is-entering');
        locText.textContent=value;
        return;
      }
      locText.classList.remove('is-entering');
      locText.classList.add('is-leaving');
      locationTextTimer=window.setTimeout(()=>{
        locationTextTimer=0;
        locText.textContent=value;
        locText.classList.remove('is-leaving');
        locText.classList.add('is-entering');
        locationTextFrame=requestAnimationFrame(()=>{
          locationTextFrame=requestAnimationFrame(()=>{
            locText.classList.remove('is-entering');
            locationTextFrame=0;
          });
        });
      },80);
    }
    function toggleLocation(){
      locToggle.classList.toggle('on');
      const isOn=locToggle.classList.contains('on');
      locToggle.setAttribute('aria-checked',isOn);
      setLocationText(isOn?'Remote':'IST, UTC+0 and AEDT');
      aboutClickSound('secondary');
    }
    locToggle.addEventListener('mousedown',toggleLocation);
    locToggle.addEventListener('touchstart',(e)=>{e.preventDefault();toggleLocation();},{passive:false});
    locToggle.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();toggleLocation();}});
  }

  // About dropdowns
  let _openDrop=null,_openTrigger=null;
  document.querySelectorAll('.about-drop-trigger').forEach(trigger=>{
    trigger.setAttribute('tabindex','0');
    trigger.setAttribute('role','button');
    trigger.setAttribute('aria-expanded','false');
    trigger.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();trigger.click();}});
    trigger.addEventListener('click',e=>{
      e.stopPropagation();
      const key=trigger.dataset.drop;
      if(_openDrop){_openDrop.classList.remove('open');if(_openTrigger)_openTrigger.setAttribute('aria-expanded','false');if(_openDrop.parentElement===trigger){_openDrop=null;_openTrigger=null;return;}_openDrop=null;_openTrigger=null;}
      let wrap=trigger.querySelector('.about-drop-wrap');
      if(!wrap){
        wrap=document.createElement('div');wrap.className='about-drop-wrap';
        const drop=document.createElement('div');drop.className='about-dropdown';
        (_aboutDropData[key]||[]).forEach(item=>{const el=document.createElement('span');el.className='about-dropdown-item';el.textContent=item.name;drop.appendChild(el);});
        drop.addEventListener('wheel',ev=>{const atTop=drop.scrollTop<=0;const atBottom=drop.scrollTop+drop.clientHeight>=drop.scrollHeight;if((atTop&&ev.deltaY<0)||(atBottom&&ev.deltaY>0))ev.preventDefault();},{passive:false});
        drop.addEventListener('touchmove',ev=>{ev.stopPropagation();},{passive:false});
        wrap.appendChild(drop);
        const fade=document.createElement('div');fade.className='about-drop-fade hidden';wrap.appendChild(fade);
        trigger.appendChild(wrap);
        requestAnimationFrame(()=>{if(drop.scrollHeight>drop.clientHeight+2)fade.classList.remove('hidden');});
        drop.addEventListener('scroll',()=>{fade.classList.toggle('hidden',drop.scrollTop+drop.clientHeight>=drop.scrollHeight-2);});
      }
      requestAnimationFrame(()=>wrap.classList.add('open'));
      _openDrop=wrap;
      _openTrigger=trigger;
      trigger.setAttribute('aria-expanded','true');
    });
  });
  document.addEventListener('click',()=>{if(_openDrop){_openDrop.classList.remove('open');if(_openTrigger)_openTrigger.setAttribute('aria-expanded','false');_openDrop=null;_openTrigger=null;}});

  // Email link
  const _emailLink=document.getElementById('aboutEmailLink');
  let _emailCopied=false;
  if(_emailLink){
    const _emailW=_emailLink.offsetWidth;
    _emailLink.style.display='inline-block';
    _emailLink.style.minWidth=_emailW+'px';
    _emailLink.addEventListener('click',e=>{
      e.preventDefault();e.stopPropagation();
      if(_emailCopied){_emailLink.textContent='hey@raksha.design';_emailCopied=false;return;}
      const iframe=document.createElement('iframe');iframe.style.display='none';
      document.body.appendChild(iframe);iframe.contentWindow.location.href='mailto:hey@raksha.design';
      setTimeout(()=>document.body.removeChild(iframe),500);
      navigator.clipboard.writeText('hey@raksha.design').then(()=>{_emailLink.textContent='copied to clipboard';_emailCopied=true;});
    });
  }
}

// Expose for data-astro-rerun inline script
window.__initAbout=initAbout;
// Re-init on every View Transition navigation (back/forward included)
document.addEventListener('astro:page-load',()=>{
  if(document.getElementById('sec-about')) initAbout();
});
