// ═══ DATA (imported from src/data/) ═══
import { SECTIONS } from '../data/clock-config.js';
import { PUZZLE_PROJECTS } from '../data/projects.js';
import { esc, prefersReducedMotion } from './shared.js';

// ═══ STATE ═══
let currentSection=0, modalOpen=false, carouselIndex=0, currentModalData=null;

// Scroll phases: 'clock' → 'docking' → 'browse'
let phase='clock';
let totalForwardScroll=0; // cumulative forward scroll in clock phase
let dockProgress=0;       // 0 = full clock, 1 = fully docked
let undockGuard=false;     // true after undocking completes — blocks backward scroll until user scrolls forward
let returnedFromBrowse=false; // true after undocking — enables the half-check logic
let visitedPast180=false;     // true if hand has been past 180° in current rotation loop
let pushDeltas=[];            // recent scroll deltas for momentum
let pushMomentumTimer=null;   // timer to start momentum decay
let pushHandAngle=0;          // extra hand rotation during push (winding down)


// ═══ CLOCK TICK AUDIO ═══
const _AC=window.AudioContext||window.webkitAudioContext;
let _actx=null,_lastTick=0,_soundOn=true;

// Mobile: AudioContext starts suspended — resume on first user gesture
function _ensureAudioCtx(){
  if(!_actx)_actx=new _AC();
  if(_actx.state==='suspended')_actx.resume();
  return _actx;
}
let _audioUnlocked=false;
function _unlockAudio(){
  if(_audioUnlocked)return;
  _audioUnlocked=true;
  _ensureAudioCtx();
}
document.addEventListener('touchstart',_unlockAudio,{once:true,passive:true});
document.addEventListener('click',_unlockAudio,{once:true});

// Sound knob toggle
const _knob=document.getElementById('soundKnob');
const _knobTip=document.getElementById('knobTooltip');
_knob.addEventListener('click',function(){
  _soundOn=!_soundOn;
  this.classList.toggle('off',!_soundOn);
  _knobTip.textContent=_soundOn?'Sound on':'Sound off';
  knobClick();
});

function clockTick(){
  if(!_soundOn)return;
  _ensureAudioCtx();
  const t=_actx.currentTime;
  const bs=_actx.sampleRate*0.008;
  const b=_actx.createBuffer(1,bs,_actx.sampleRate);
  const d=b.getChannelData(0);
  for(let i=0;i<bs;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/bs,6);
  const n=_actx.createBufferSource();n.buffer=b;
  const f=_actx.createBiquadFilter();f.type='bandpass';f.frequency.value=4000;f.Q.value=2.5;
  const g=_actx.createGain();g.gain.setValueAtTime(0.2,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.012);
  n.connect(f);f.connect(g);g.connect(_actx.destination);n.start(t);n.stop(t+0.012);
}

// Rotary knob — brass watch crown rotation
function knobClick(){
  _ensureAudioCtx();
  const t=_actx.currentTime;
  const ring=_actx.createOscillator();
  ring.type='triangle';
  ring.frequency.setValueAtTime(1800,t);
  ring.frequency.exponentialRampToValueAtTime(900,t+0.04);
  const ringF=_actx.createBiquadFilter();ringF.type='bandpass';ringF.frequency.value=1400;ringF.Q.value=4;
  const ringG=_actx.createGain();
  ringG.gain.setValueAtTime(0.15,t);
  ringG.gain.exponentialRampToValueAtTime(0.001,t+0.05);
  ring.connect(ringF);ringF.connect(ringG);ringG.connect(_actx.destination);
  ring.start(t);ring.stop(t+0.05);
  const bs=_actx.sampleRate*0.025;
  const b=_actx.createBuffer(1,bs,_actx.sampleRate);
  const d=b.getChannelData(0);
  for(let i=0;i<bs;i++){
    const p=i/bs;
    const env=p<0.3?p/0.3:Math.pow(1-(p-0.3)/0.7,2);
    d[i]=(Math.random()*2-1)*env*0.5;
  }
  const n=_actx.createBufferSource();n.buffer=b;
  const hp=_actx.createBiquadFilter();hp.type='highpass';hp.frequency.value=2000;
  const lp=_actx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=6000;
  const ng=_actx.createGain();ng.gain.setValueAtTime(0.16,t);ng.gain.exponentialRampToValueAtTime(0.001,t+0.03);
  n.connect(hp);hp.connect(lp);lp.connect(ng);ng.connect(_actx.destination);
  n.start(t);n.stop(t+0.03);
  const det=_actx.createOscillator();
  det.type='sine';
  det.frequency.setValueAtTime(3200,t+0.02);
  det.frequency.exponentialRampToValueAtTime(1600,t+0.03);
  const detG=_actx.createGain();
  detG.gain.setValueAtTime(0,t);
  detG.gain.setValueAtTime(0.12,t+0.02);
  detG.gain.exponentialRampToValueAtTime(0.001,t+0.035);
  det.connect(detG);detG.connect(_actx.destination);
  det.start(t+0.02);det.stop(t+0.035);
}
function checkTick(a){
  const n=((a%360)+360)%360,l=((_lastTick%360)+360)%360;
  if(Math.floor(n/45)!==Math.floor(l/45))clockTick();
  _lastTick=a;
}

// Expose audio state for other modules (notes, about, etc.)
window.__clockAudio={
  get on(){return _soundOn;},
  ensureCtx:_ensureAudioCtx,
  get ctx(){return _actx;}
};

const clockFace=document.getElementById('clockFace');
const handContainer=document.getElementById('handContainer');
const modalOverlay=document.getElementById('modalOverlay');
const modalCard=document.getElementById('modalCard');
const modalBody=document.querySelector('.modal-body');
if(modalBody)modalBody.addEventListener('scroll',function(){
  this.classList.toggle('has-scroll-fade',this.scrollTop>2);
  const atBottom=this.scrollHeight-this.scrollTop-this.clientHeight<4;
  const hasOverflow=this.scrollHeight>this.clientHeight+4;
  this.classList.toggle('has-bottom-fade',hasOverflow&&!atBottom);
});
const clockScreen=document.getElementById('clockScreen');
const miniClockBar=document.getElementById('miniClockBar');
const browseContent=document.getElementById('browseContent');
const skipLinkEl=document.getElementById('skipLink');
const bottomUI=document.getElementById('bottomUI');
const pageHeader=document.getElementById('pageHeader');
const sectionTitle=document.getElementById('sectionTitle');

// Cache NodeLists for per-frame use
const _allMenuLabels=document.querySelectorAll('.menu-label');

// Initialize browse content off screen
browseContent.style.transform='translateY(100vh)';

// Tracks how far anticipation has shifted the clock (vh)
let _anticipationVh=0;

// ═══ SNAP POINTS (8 menu items at 45° intervals) ═══
const MENU_TARGETS=['top','sec-work','sec-about','sec-notes','sec-bookmarks','sec-books','sec-concepts','cal'];
const SNAP_ANGLES=SECTIONS.map(s=>s.angle); // [0,45,90,135,180,225,270,315]

let rawAngle=0, snapTimer=null, isSnapping=false, animFrame=null;
let springVelocity=0, springTarget=0, useGentleSpring=false;

const SCROLL_SENSITIVITY=0.15, SNAP_DELAY=120;
const SPRING_STIFFNESS=0.2, SPRING_DAMPING=0.75;

function normAngle(a){return((a%360)+360)%360;}

function findNearestSnap(angle){
  const norm=normAngle(angle);let best=0,bestD=999;
  for(let i=0;i<SNAP_ANGLES.length;i++){let d=Math.abs(norm-SNAP_ANGLES[i]);if(d>180)d=360-d;if(d<bestD){bestD=d;best=i;}}
  return best;
}

let _handTransitionCleared=false;

function applyAngle(angle){
  if(!_handTransitionCleared){handContainer.style.transition='none';_handTransitionCleared=true;}
  handContainer.style.transform=`rotate(${angle}deg)`;
  checkTick(angle);
  const miniHand=document.getElementById('miniHand');
  if(miniHand)miniHand.setAttribute('transform',`rotate(${normAngle(angle)} 50 50)`);

  const snapIdx=findNearestSnap(angle);
  const newSection=snapIdx;

  if(newSection!==currentSection){
    currentSection=newSection;
    _allMenuLabels.forEach(l=>l.classList.toggle('active',+l.dataset.section===newSection));
    const tEl=document.getElementById('activeSectionTitle'),dEl=document.getElementById('activeSectionDesc');
    tEl.style.opacity=0;dEl.style.opacity=0;
    setTimeout(()=>{tEl.textContent=SECTIONS[newSection].name;dEl.textContent=SECTIONS[newSection].desc;tEl.style.opacity=1;dEl.style.opacity=1;},120);
  }

  skipLinkEl.classList.add('hidden');

  // ═══ ANTICIPATION — clock starts sliding as hand passes 315° ═══
  const baseLoop=Math.floor(angle/360)*360;
  const progressInLoop=angle-baseLoop;
  if(progressInLoop>315 && !returnedFromBrowse && phase==='clock'){
    const p=Math.min(1,(progressInLoop-315)/45);
    const eased=p*p;
    _anticipationVh=eased*8;
    clockScreen.style.transform=`translateY(${-_anticipationVh}vh)`;
    bottomUI.style.opacity=Math.max(0,1-p*1.5);
  } else if(phase==='clock' && progressInLoop>0 && progressInLoop<=315){
    _anticipationVh=0;
    clockScreen.style.transform='';
    bottomUI.style.opacity='';
  }
}

function animateSpring(){
  if(prefersReducedMotion){
    rawAngle=springTarget;applyAngle(rawAngle);
    isSnapping=false;useGentleSpring=false;animFrame=null;return;
  }
  const diff=springTarget-rawAngle;
  if(Math.abs(diff)<0.5&&Math.abs(springVelocity)<0.5){
    rawAngle=springTarget;applyAngle(rawAngle);
    isSnapping=false;useGentleSpring=false;animFrame=null;return;
  }
  if(useGentleSpring){rawAngle+=diff*0.08;}
  else{const f=diff*SPRING_STIFFNESS;springVelocity=(springVelocity+f)*SPRING_DAMPING;rawAngle+=springVelocity;}
  applyAngle(rawAngle);
  animFrame=requestAnimationFrame(animateSpring);
}

function startSnap(){
  const si=findNearestSnap(rawAngle);
  const tn=SNAP_ANGLES[si],cn=normAngle(rawAngle);
  let diff=tn-cn;if(diff>180)diff-=360;if(diff<-180)diff+=360;
  springTarget=rawAngle+diff;springVelocity=0;isSnapping=true;useGentleSpring=false;
  if(animFrame)cancelAnimationFrame(animFrame);
  animFrame=requestAnimationFrame(animateSpring);
}

function scheduleSnap(){clearTimeout(snapTimer);snapTimer=setTimeout(()=>startSnap(),SNAP_DELAY);}

function springToAngle(targetNorm,gentle){
  const cn=normAngle(rawAngle);let diff=targetNorm-cn;
  if(diff>180)diff-=360;if(diff<-180)diff+=360;
  springTarget=rawAngle+diff;springVelocity=0;isSnapping=true;useGentleSpring=!!gentle;
  if(animFrame)cancelAnimationFrame(animFrame);
  animFrame=requestAnimationFrame(animateSpring);
}

// ═══ DOCK TRANSITION (scroll-driven) ═══
let contentStartVh=100;

function computeContentStart(){
  const bottomEl=document.getElementById('bottomUI');
  if(bottomEl){
    const rect=bottomEl.getBoundingClientRect();
    contentStartVh=(rect.bottom-4)/window.innerHeight*100+_anticipationVh;
  }else{
    contentStartVh=85;
  }
}

// Cached threshold states
let _lastCPE='auto',_lastBPE='none',_lastMini=false;

function applyDockProgress(p){
  dockProgress=p;
  const totalScrollVh=contentStartVh-_anticipationVh;
  const scrollVh=_anticipationVh+p*totalScrollVh;
  clockScreen.style.transform=`translateY(${-scrollVh}vh)`;
  browseContent.style.transform=`translateY(${100*(1-p)}vh)`;
  const fadeOut=Math.max(0,1-p*3);
  pageHeader.style.opacity=fadeOut;
  sectionTitle.style.opacity=fadeOut;
  bottomUI.style.opacity=0;
  const cpe=p>0.3?'none':'auto';
  if(cpe!==_lastCPE){clockScreen.style.pointerEvents=cpe;_lastCPE=cpe;}
  const bpe=p>0.85?'auto':'none';
  if(bpe!==_lastBPE){browseContent.style.pointerEvents=bpe;_lastBPE=bpe;}
  const mv=p>0.7;
  if(mv!==_lastMini){miniClockBar.classList.toggle('visible',mv);_lastMini=mv;}
}

// ═══ UNIFIED SCROLL HANDLER ═══
const PUSH_DISTANCE=window.innerHeight*0.4;

window.addEventListener('wheel',(e)=>{
  if(modalOpen)return;
  if(phase==='browse') return;
  e.preventDefault();

  if(phase==='clock'){
    if(undockGuard){
      if(e.deltaY>0) undockGuard=false;
      else return;
    }
    if(isSnapping){isSnapping=false;if(animFrame){cancelAnimationFrame(animFrame);animFrame=null;}}
    let newAngle=rawAngle+e.deltaY*SCROLL_SENSITIVITY;
    const baseLoop=Math.floor(rawAngle/360)*360;
    const target360=baseLoop+360;
    const normCurrent=((rawAngle%360)+360)%360;
    if(normCurrent>=180) visitedPast180=true;
    if(normCurrent<10) visitedPast180=false;

    if(e.deltaY>0 && newAngle>=target360){
      const skipThisCrossing=returnedFromBrowse && visitedPast180;
      if(skipThisCrossing){
        returnedFromBrowse=false;
        visitedPast180=false;
      }else{
        rawAngle=target360;
        applyAngle(rawAngle);
        clearTimeout(snapTimer);
        if(animFrame){cancelAnimationFrame(animFrame);animFrame=null;isSnapping=false;}
        phase='pushing';
        browseContent.style.willChange='transform';
        computeContentStart();
        dockProgress=0;
        pushDeltas=[];
        pushHandAngle=0;
        const overflowPx=(newAngle-target360)/SCROLL_SENSITIVITY;
        dockProgress=Math.min(1,overflowPx/PUSH_DISTANCE);
        applyDockProgress(dockProgress);
        return;
      }
    }

    rawAngle=newAngle;
    applyAngle(rawAngle);
    scheduleSnap();
    if(e.deltaY>0)totalForwardScroll+=e.deltaY*SCROLL_SENSITIVITY;

  }else if(phase==='pushing'){
    pushDeltas.push({d:e.deltaY,t:performance.now()});
    if(pushDeltas.length>5) pushDeltas.shift();
    dockProgress=Math.min(1,Math.max(0,dockProgress+e.deltaY/PUSH_DISTANCE));
    pushHandAngle+=e.deltaY*0.03;
    handContainer.style.transform=`rotate(${rawAngle+pushHandAngle}deg)`;
    checkTick(rawAngle+pushHandAngle);
    applyDockProgress(dockProgress);

    if(dockProgress>=1){
      enterBrowseMode();
    }else if(dockProgress<=0){
      phase='clock';
      rawAngle=0;
      totalForwardScroll=0;
      returnedFromBrowse=true;
      visitedPast180=false;
      pushHandAngle=0;
      _anticipationVh=0;
      clockScreen.style.transform='';
      bottomUI.style.opacity='';
      applyDockProgress(0);
    }

    clearTimeout(pushMomentumTimer);
    pushMomentumTimer=setTimeout(()=>{
      if(phase!=='pushing') return;
      const now=performance.now();
      const recent=pushDeltas.filter(d=>now-d.t<150);
      if(recent.length<2) return;
      let avgV=recent.reduce((s,d)=>s+d.d,0)/recent.length;
      if(Math.abs(avgV)<1) return;
      function decayMomentum(){
        if(phase!=='pushing'||Math.abs(avgV)<0.5) return;
        avgV*=0.85;
        dockProgress=Math.min(1,Math.max(0,dockProgress+avgV/PUSH_DISTANCE));
        pushHandAngle+=avgV*0.03;
        handContainer.style.transform=`rotate(${rawAngle+pushHandAngle}deg)`;
        applyDockProgress(dockProgress);
        if(dockProgress>=1){enterBrowseMode();return;}
        else if(dockProgress<=0){
          phase='clock';rawAngle=0;totalForwardScroll=0;
          returnedFromBrowse=true;visitedPast180=false;pushHandAngle=0;
          _anticipationVh=0;clockScreen.style.transform='';bottomUI.style.opacity='';
          applyDockProgress(0);return;
        }
        requestAnimationFrame(decayMomentum);
      }
      requestAnimationFrame(decayMomentum);
    },80);
  }
},{passive:false});

// ═══ ENTER/EXIT BROWSE ═══
function enterBrowseMode(){
  phase='browse';
  document.documentElement.style.overflow='auto';
  document.body.style.overflow='auto';
  document.body.style.height='auto';
  browseContent.style.position='relative';
  browseContent.style.top='0';
  browseContent.style.transform='none';
  browseContent.style.opacity='1';
  browseContent.style.pointerEvents='auto';
  clockScreen.style.display='none';
  bottomUI.style.display='none';
  window.scrollTo(0,0);
  window.addEventListener('scroll',updateMiniClockHand);
  if(_navTarget!==null){
    const t=MENU_TARGETS[_navTarget];
    if(t==='top'){/* already at top */}
    else if(t==='cal'){window.open('https://cal.com/raksha-tated-v2ee58/15min','_blank','noopener,noreferrer');}
    else{
      const el=document.getElementById(t);
      if(el)requestAnimationFrame(()=>el.scrollIntoView({behavior:'smooth',block:'start'}));
    }
    _navTarget=null;
  }
}

function updateMiniClockHand(){
  if(phase!=='browse') return;
  const miniHand=document.getElementById('miniHand');
  if(!miniHand) return;
  const scrollTop=window.scrollY;
  const docHeight=document.documentElement.scrollHeight-window.innerHeight;
  if(docHeight<=0) return;
  const scrollPct=Math.min(1,scrollTop/docHeight);
  const angle=scrollPct*360;
  miniHand.setAttribute('transform',`rotate(${angle} 50 50)`);
}

// ═══ AUTO-COMPLETE (only for skip button) ═══
let dockAnimFrame=null;

function animateSkipDock(){
  const diff=1-dockProgress;
  if(diff<0.005){
    dockProgress=1;
    applyDockProgress(1);
    dockAnimFrame=null;
    enterBrowseMode();
    return;
  }
  dockProgress+=diff*0.1;
  applyDockProgress(dockProgress);
  dockAnimFrame=requestAnimationFrame(animateSkipDock);
}

// ═══ TOUCH ═══
let touchLastY=0,isTouching=false,touchOnFace=false;
const isMobileTouch=window.matchMedia('(max-width:480px)').matches;
window.addEventListener('touchstart',e=>{
  if(modalOpen)return;
  touchLastY=e.touches[0].clientY;isTouching=true;
  touchOnFace=clockFace.contains(e.target);
  if(phase==='clock'&&isSnapping){isSnapping=false;if(animFrame){cancelAnimationFrame(animFrame);animFrame=null;}}
},{passive:true});

window.addEventListener('touchmove',e=>{
  if(!isTouching||modalOpen)return;
  const y=e.touches[0].clientY;
  const delta=touchLastY-y;touchLastY=y;

  if(phase==='clock'){
    if(undockGuard){
      if(delta>0) undockGuard=false;
      else return;
    }
    if(isMobileTouch&&!touchOnFace&&delta>0){
      clearTimeout(snapTimer);
      if(animFrame){cancelAnimationFrame(animFrame);animFrame=null;isSnapping=false;}
      phase='pushing';browseContent.style.willChange='transform';computeContentStart();dockProgress=0;pushDeltas=[];pushHandAngle=0;
      dockProgress=Math.min(1,delta/PUSH_DISTANCE);
      applyDockProgress(dockProgress);
      return;
    }

    let newAngle=rawAngle+delta*0.5;
    if(delta>0)totalForwardScroll+=delta*0.5;
    const baseLoop=Math.floor(rawAngle/360)*360;
    const target360=baseLoop+360;
    const normCurrent=((rawAngle%360)+360)%360;
    if(normCurrent>=180) visitedPast180=true;
    if(normCurrent<10) visitedPast180=false;

    if(delta>0 && newAngle>=target360){
      const skipThisCrossing=returnedFromBrowse && visitedPast180;
      if(skipThisCrossing){
        returnedFromBrowse=false;
        visitedPast180=false;
      }else{
        rawAngle=target360;
        applyAngle(rawAngle);
        clearTimeout(snapTimer);
        if(animFrame){cancelAnimationFrame(animFrame);animFrame=null;isSnapping=false;}
        phase='pushing';browseContent.style.willChange='transform';computeContentStart();dockProgress=0;pushDeltas=[];pushHandAngle=0;
        const overflowPx=(newAngle-target360)*2;
        dockProgress=Math.min(1,overflowPx/PUSH_DISTANCE);
        applyDockProgress(dockProgress);
        return;
      }
    }

    rawAngle=newAngle;
    applyAngle(rawAngle);
  }else if(phase==='pushing'){
    dockProgress=Math.min(1,Math.max(0,dockProgress+delta/PUSH_DISTANCE));
    pushHandAngle+=delta*0.03;
    handContainer.style.transform=`rotate(${rawAngle+pushHandAngle}deg)`;
    checkTick(rawAngle+pushHandAngle);
    applyDockProgress(dockProgress);
    if(dockProgress>=1) enterBrowseMode();
    else if(dockProgress<=0){
      phase='clock';
      rawAngle=0;
      totalForwardScroll=0;
      returnedFromBrowse=true;
      visitedPast180=false;
      pushHandAngle=0;
      _anticipationVh=0;
      clockScreen.style.transform='';bottomUI.style.opacity='';
      applyDockProgress(0);
    }
  }
},{passive:true});

window.addEventListener('touchend',()=>{
  isTouching=false;
  if(phase==='clock'&&!modalOpen)scheduleSnap();
},{passive:true});

// ═══ SKIP TO CONTENT ═══
function skipToContent(){
  if(phase!=='clock')return;
  if(_navTarget!==null){
    rawAngle=Math.floor(rawAngle/360)*360+_navTarget*45;
    if(rawAngle<=rawAngle-1)rawAngle+=360;
  }else{
    rawAngle=Math.ceil(rawAngle/360)*360||360;
  }
  applyAngle(rawAngle);
  clearTimeout(snapTimer);
  if(animFrame){cancelAnimationFrame(animFrame);animFrame=null;isSnapping=false;}
  phase='pushing';
  browseContent.style.willChange='transform';
  computeContentStart();
  dockProgress=0;
  if(dockAnimFrame)cancelAnimationFrame(dockAnimFrame);
  dockAnimFrame=requestAnimationFrame(animateSkipDock);
}

// ═══ RE-ENTER CLOCK MODE ═══
function reenterClockMode(){
  let returnSection=0;
  const secIds=['sec-about','sec-work','sec-notes','sec-bookmarks','sec-books','sec-concepts'];
  const menuMap={'sec-about':2,'sec-work':1,'sec-notes':3,'sec-bookmarks':4,'sec-books':5,'sec-concepts':6};
  const scrollY=window.scrollY;
  for(let i=secIds.length-1;i>=0;i--){
    const el=document.getElementById(secIds[i]);
    if(el&&el.offsetTop<=scrollY+window.innerHeight*0.4){returnSection=menuMap[secIds[i]];break;}
  }
  const returnAngle=returnSection*45;

  phase='clock';
  totalForwardScroll=0;dockProgress=0;_anticipationVh=0;_lastCPE='auto';_lastBPE='none';_lastMini=false;
  window.removeEventListener('scroll',updateMiniClockHand);
  document.documentElement.style.overflow='hidden';
  document.body.style.overflow='hidden';
  document.body.style.height='100%';
  browseContent.style.position='fixed';browseContent.style.top='0';
  browseContent.style.transform='translateY(100vh)';browseContent.style.opacity='1';browseContent.style.pointerEvents='none';
  browseContent.style.willChange='';
  clockScreen.style.display='flex';
  clockScreen.style.transform='';clockScreen.style.opacity='';clockScreen.style.pointerEvents='';
  pageHeader.style.opacity='';sectionTitle.style.opacity='';
  bottomUI.style.display='';bottomUI.style.opacity='';
  skipLinkEl.classList.remove('hidden');
  miniClockBar.classList.remove('visible');
  const miniHand=document.getElementById('miniHand');
  if(miniHand) miniHand.setAttribute('transform',`rotate(${returnAngle} 50 50)`);
  rawAngle=returnAngle;springVelocity=0;springTarget=returnAngle;currentSection=returnSection;returnedFromBrowse=false;visitedPast180=false;
  handContainer.style.transform=`rotate(${returnAngle}deg)`;
  applyAngle(returnAngle);
  document.querySelectorAll('.menu-label').forEach(l=>l.classList.toggle('active',+l.dataset.section===returnSection));
  document.getElementById('activeSectionTitle').textContent=SECTIONS[returnSection].name;
  document.getElementById('activeSectionDesc').textContent=SECTIONS[returnSection].desc;
}

// ═══ CLICK NAV ═══
let _navTarget=null;
function navigateTo(s){
  if(modalOpen)return;
  const target=MENU_TARGETS[s];
  if(target==='cal'){
    window.open('https://cal.com/raksha-tated-v2ee58/15min','_blank','noopener,noreferrer');
    return;
  }
  if(phase==='browse'){
    if(target==='top'){window.scrollTo({top:0,behavior:'smooth'});return;}
    const el=document.getElementById(target);
    if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
    return;
  }
  _navTarget=s;
  skipToContent();
}

// ═══ KEYBOARD ═══
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&modalOpen){closeModal();return;}
  if(modalOpen&&e.key==='ArrowRight'){carouselNext();return;}
  if(modalOpen&&e.key==='ArrowLeft'){carouselPrev();return;}
  if(!modalOpen&&phase==='clock'){
    if(e.key==='ArrowDown'||e.key==='ArrowRight'){
      e.preventDefault();const si=findNearestSnap(rawAngle);const ni=(si+1)%SNAP_ANGLES.length;
      const tn=SNAP_ANGLES[ni],cn=normAngle(rawAngle);let d=tn-cn;if(d<=0)d+=360;if(d>180&&ni!==0)d-=360;
      springTarget=rawAngle+d;springVelocity=0;isSnapping=true;useGentleSpring=false;
      if(animFrame)cancelAnimationFrame(animFrame);animFrame=requestAnimationFrame(animateSpring);
    }else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){
      e.preventDefault();const si=findNearestSnap(rawAngle);const pi=(si-1+SNAP_ANGLES.length)%SNAP_ANGLES.length;
      const tn=SNAP_ANGLES[pi],cn=normAngle(rawAngle);let d=tn-cn;if(d>=0)d-=360;if(d<-180&&pi!==SNAP_ANGLES.length-1)d+=360;
      springTarget=rawAngle+d;springVelocity=0;isSnapping=true;useGentleSpring=false;
      if(animFrame)cancelAnimationFrame(animFrame);animFrame=requestAnimationFrame(animateSpring);
    }
  }
});

// ═══ MODAL ═══
const TILT_MAX=0.6;
let tiltRX=0,tiltRY=0,tiltTargetRX=0,tiltTargetRY=0,tiltVelRX=0,tiltVelRY=0;
let tiltCardCX=0,tiltCardCY=0,tiltCardW=0,tiltCardH=0;
let tiltRaf=null;

function tiltLoop(){
  if(!modalOpen){tiltRaf=null;return;}
  const fx=(tiltTargetRX-tiltRX)*0.06;
  const fy=(tiltTargetRY-tiltRY)*0.06;
  tiltVelRX=(tiltVelRX+fx)*0.75;
  tiltVelRY=(tiltVelRY+fy)*0.75;
  tiltRX+=tiltVelRX;tiltRY+=tiltVelRY;
  modalCard.style.transform=`perspective(900px) rotateX(${tiltRX}deg) rotateY(${tiltRY}deg)`;
  tiltRaf=requestAnimationFrame(tiltLoop);
}

function updateTiltRect(){
  const saved=modalCard.style.transform;
  modalCard.style.transform='perspective(900px) rotateX(0deg) rotateY(0deg)';
  const r=modalCard.getBoundingClientRect();
  modalCard.style.transform=saved;
  tiltCardCX=r.left+r.width/2;tiltCardCY=r.top+r.height/2;
  tiltCardW=r.width;tiltCardH=r.height;
}

if(!prefersReducedMotion){
  modalCard.addEventListener('mouseenter',()=>{if(modalOpen)updateTiltRect();});
  modalCard.addEventListener('mousemove',e=>{
    if(!modalOpen)return;
    if(!tiltCardW)updateTiltRect();
    const nx=(e.clientX-tiltCardCX)/tiltCardW;
    const ny=(e.clientY-tiltCardCY)/tiltCardH;
    tiltTargetRY=nx*TILT_MAX*2;
    tiltTargetRX=-ny*TILT_MAX*2;
  });
  modalCard.addEventListener('mouseleave',()=>{tiltTargetRX=0;tiltTargetRY=0;});
}

function updateCarouselButtons(){
  if(!currentModalData)return;
  document.querySelector('.carousel-btn.prev').disabled=(carouselIndex===0);
  document.querySelector('.carousel-btn.next').disabled=(carouselIndex===currentModalData.slides.length-1);
}

function renderModalDesc(project,slideIdx){
  const descEl=document.getElementById('modalDesc');
  const d=Array.isArray(project.desc)?project.desc[slideIdx]||project.desc[0]:project.desc;
  descEl.innerHTML=d.split('\n\n').map(p=>`<p>${esc(p)}</p>`).join('');
}
function _showModal(project,originEl){
  currentModalData=project;carouselIndex=0;modalOpen=true;
  const track=document.getElementById('carouselTrack');
  track.style.transition='none';
  track.style.transform='translateX(0)';
  track.offsetHeight;
  track.style.transition='';
  track.innerHTML=project.slides.map((c,i)=>`<div class="carousel-slide"><div class="carousel-slide-color" style="background:${c}">${i===0?project.title.substring(0,2).toUpperCase():'IMG '+(i+1)}</div></div>`).join('');
  document.getElementById('carouselCounter').textContent=`1 / ${project.slides.length}`;
  document.getElementById('modalTitle').textContent=project.title;
  const tagsEl=document.getElementById('modalTags');
  tagsEl.innerHTML=project.tags.map(t=>`<span class="modal-tag">${t}</span>`).join('');
  if(project.link&&project.link!=='#')tagsEl.innerHTML+=`<a class="modal-tag link" href="${project.link}" target="_blank">${project.link.replace('https://','').replace('mailto:','')} ↗</a>`;
  renderModalDesc(project,0);
  if(modalBody){modalBody.scrollTop=0;modalBody.classList.remove('has-scroll-fade');modalBody.classList.remove('has-bottom-fade');}
  modalOverlay.classList.add('open');
  modalCard.style.willChange='transform';
  document.body.style.overflow='hidden';
  requestAnimationFrame(()=>{if(modalBody){
    const hasOverflow=modalBody.scrollHeight>modalBody.clientHeight+4;
    modalBody.classList.toggle('has-bottom-fade',hasOverflow);
  }});
  updateCarouselButtons();
  tiltRX=0;tiltRY=0;tiltTargetRX=0;tiltTargetRY=0;tiltVelRX=0;tiltVelRY=0;
  const isMobileModal=window.matchMedia('(max-width:480px)').matches;
  if(isMobileModal){
  }else if(!prefersReducedMotion){
    let scaleP=0;
    function scaleIn(){
      scaleP+=(1-scaleP)*0.15;
      const s=0.95+scaleP*0.05;
      modalCard.style.transform=`perspective(900px) scale(${s}) rotateX(0deg) rotateY(0deg)`;
      if(scaleP<0.99)requestAnimationFrame(scaleIn);
      else{
        modalCard.style.transform='perspective(900px) rotateX(0deg) rotateY(0deg)';
        if(!tiltRaf)tiltRaf=requestAnimationFrame(tiltLoop);
      }
    }
    requestAnimationFrame(scaleIn);
  }else{
    modalCard.style.transform='none';
  }
}
function openPuzzleModal(project){_showModal(project,null);}
function recheckScrollLine(){
  requestAnimationFrame(()=>{if(modalBody){
    modalBody.scrollTop=0;modalBody.classList.remove('has-scroll-fade');
    const hasOverflow=modalBody.scrollHeight>modalBody.clientHeight+4;
    modalBody.classList.toggle('has-bottom-fade',hasOverflow);
  }});
}
function closeModal(){
  modalOpen=false;
  modalOverlay.classList.remove('open');
  document.body.style.overflow='';
  clockScreen.style.filter='';
  const isMobileClose=window.matchMedia('(max-width:480px)').matches;
  if(!isMobileClose){modalCard.style.transform='';modalCard.style.willChange='';}
  else{modalCard.style.willChange='';}
  if(modalBody){modalBody.classList.remove('has-bottom-fade');modalBody.classList.remove('has-scroll-fade');}
  if(tiltRaf){cancelAnimationFrame(tiltRaf);tiltRaf=null;}
  if(dockProgress>0)applyDockProgress(dockProgress);else clockScreen.style.transform='';
}
function updateTitleTagsVisibility(){
  const show=carouselIndex===0;
  document.getElementById('modalTitle').style.display=show?'':'none';
  document.getElementById('modalTags').style.display=show?'':'none';
}
function carouselNext(){
  if(!currentModalData||carouselIndex>=currentModalData.slides.length-1)return;
  carouselIndex++;
  document.getElementById('carouselTrack').style.transform=`translateX(-${carouselIndex*100}%)`;
  document.getElementById('carouselCounter').textContent=`${carouselIndex+1} / ${currentModalData.slides.length}`;
  if(Array.isArray(currentModalData.desc)){renderModalDesc(currentModalData,carouselIndex);recheckScrollLine();}
  updateTitleTagsVisibility();
  updateCarouselButtons();
}
function carouselPrev(){
  if(!currentModalData||carouselIndex<=0)return;
  carouselIndex--;
  document.getElementById('carouselTrack').style.transform=`translateX(-${carouselIndex*100}%)`;
  document.getElementById('carouselCounter').textContent=`${carouselIndex+1} / ${currentModalData.slides.length}`;
  if(Array.isArray(currentModalData.desc)){renderModalDesc(currentModalData,carouselIndex);recheckScrollLine();}
  updateTitleTagsVisibility();
  updateCarouselButtons();
}

// ═══ INIT ═══
handContainer.style.transform='rotate(0deg)';

// ═══ SHOW MORE PROJECTS ═══
const puzzleShowMore=document.getElementById('puzzleShowMore');
const puzzleGrid=document.querySelector('.puzzle-grid');
let puzzleExpanded=false;
if(puzzleShowMore){
  puzzleShowMore.addEventListener('click',()=>{
    if(!puzzleExpanded){
      puzzleGrid.classList.remove('collapsing');
      puzzleGrid.classList.add('expanded');
      puzzleShowMore.textContent='Show less';
      puzzleExpanded=true;
      requestAnimationFrame(()=>{
        const firstExtra=puzzleGrid.querySelector('.puzzle-extra');
        if(firstExtra)firstExtra.scrollIntoView({behavior:'smooth',block:'center'});
      });
    }else{
      puzzleGrid.classList.remove('expanded');
      puzzleGrid.classList.add('collapsing');
      puzzleShowMore.textContent='Show more work';
      puzzleExpanded=false;
      requestAnimationFrame(()=>{
        puzzleShowMore.scrollIntoView({behavior:'smooth',block:'center'});
      });
    }
  });
}
applyDockProgress(0);

// Default to browse mode on load
enterBrowseMode();
miniClockBar.classList.add('visible');
_lastMini=true;

// ═══ CMS ═══
async function loadPortfolioData(){
  try{
    const res=await fetch('/portfolio-data.json');
    if(!res.ok)return;
    const data=await res.json();
  }catch(e){}
}
loadPortfolioData();

// ═══ PUZZLE CARDS ═══
document.querySelectorAll('.puzzle-card[data-project]').forEach(card=>{
  card.addEventListener('click',()=>{
    const idx=+card.dataset.project;
    const project=PUZZLE_PROJECTS[idx];
    if(!project) return;
    openPuzzleModal(project);
  });
});

// Expose to window for inline onclick handlers in HTML
window.navigateTo = navigateTo;
window.closeModal = closeModal;
window.carouselPrev = carouselPrev;
window.carouselNext = carouselNext;
window.reenterClockMode = reenterClockMode;
window.skipToContent = skipToContent;
window.openPuzzleModal = openPuzzleModal;

// ═══ RESIZE ═══
let rt;
window.addEventListener('resize',()=>{
  clearTimeout(rt);rt=setTimeout(()=>{},200);
});
