// ═══ DATA (imported from src/data/) ═══
import { SECTIONS, THUMB_COLORS, THUMB_IMAGES, THUMB_SVGS, PROJECTS } from '../data/clock-config.js';
import { PUZZLE_PROJECTS } from '../data/projects.js';
import { KINDLE_BOOKS } from '../data/books.js';
import { NOTES, GLOSSARY } from '../data/notes.js';
import { MMIND_CARDS } from '../data/mymind.js';

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
  // Brass body resonance
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
  // Friction grit
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
  // Detent click
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
  if(Math.floor(n/22.5)!==Math.floor(l/22.5))clockTick();
  _lastTick=a;
}

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
const sectionIndicator=document.getElementById('sectionIndicator');
const skipLinkEl=document.getElementById('skipLink');
const bottomUI=document.getElementById('bottomUI');
const pageHeader=document.getElementById('pageHeader');
const sectionTitle=document.getElementById('sectionTitle');

// Cache NodeLists for per-frame use
const _allThumbnails=document.querySelectorAll('.thumbnail');
const _allMenuLabels=document.querySelectorAll('.menu-label');
const _allIndicatorDots=document.querySelectorAll('.indicator-dot');

// Initialize browse content off screen
browseContent.style.transform='translateY(100vh)';

// Tracks how far anticipation has shifted the clock (vh)
let _anticipationVh=0;

// ═══ SNAP POINTS ═══
const SNAP_ANGLES=[], SNAP_META=[];
for(let q=0;q<4;q++){
  SNAP_ANGLES.push(q*90);
  SNAP_META.push({type:'major',section:q,thumbIndex:null});
  [3,6,9,12].forEach((tp,idx)=>{
    SNAP_ANGLES.push(q*90+tp*6);
    SNAP_META.push({type:'minor',section:q,thumbIndex:idx});
  });
}

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

let _lastFocusedThumb=null;
let _handTransitionCleared=false;

function applyAngle(angle){
  if(!_handTransitionCleared){handContainer.style.transition='none';_handTransitionCleared=true;}
  handContainer.style.transform=`rotate(${angle}deg)`;
  checkTick(angle);
  const miniHand=document.getElementById('miniHand');
  if(miniHand)miniHand.setAttribute('transform',`rotate(${normAngle(angle)} 50 50)`);

  const snapIdx=findNearestSnap(angle);
  const snap=SNAP_META[snapIdx];
  const newSection=snap.section;

  if(newSection!==currentSection){
    currentSection=newSection;
    _allMenuLabels.forEach(l=>l.classList.toggle('active',+l.dataset.section===newSection));
    _allThumbnails.forEach(t=>t.classList.toggle('active-quadrant',+t.dataset.quadrant===newSection));
    const tEl=document.getElementById('activeSectionTitle'),dEl=document.getElementById('activeSectionDesc');
    tEl.style.opacity=0;dEl.style.opacity=0;
    setTimeout(()=>{tEl.textContent=SECTIONS[newSection].name;dEl.textContent=SECTIONS[newSection].desc;tEl.style.opacity=1;dEl.style.opacity=1;},120);
    _allIndicatorDots.forEach(d=>d.classList.toggle('active',+d.dataset.section===newSection));
  }

  if(_lastFocusedThumb){_lastFocusedThumb.classList.remove('focused');_lastFocusedThumb=null;}
  if(snap.type==='minor'){
    const dist=Math.abs(normAngle(angle)-SNAP_ANGLES[snapIdx]);
    if(dist<5||dist>355){
      const ft=document.querySelector(`.thumbnail[data-quadrant="${snap.section}"][data-index="${snap.thumbIndex}"]`);
      if(ft){ft.classList.add('focused');_lastFocusedThumb=ft;}
    }
  }
  skipLinkEl.classList.add('hidden');

  // ═══ ANTICIPATION — clock starts sliding as hand passes 270° ═══
  const baseLoop=Math.floor(angle/360)*360;
  const progressInLoop=angle-baseLoop;
  if(progressInLoop>270 && !returnedFromBrowse && phase==='clock'){
    const p=Math.min(1,(progressInLoop-270)/90);
    const eased=p*p;
    _anticipationVh=eased*8;
    clockScreen.style.transform=`translateY(${-_anticipationVh}vh)`;
    bottomUI.style.opacity=Math.max(0,1-p*1.5);
  } else if(phase==='clock' && progressInLoop>0 && progressInLoop<=270){
    _anticipationVh=0;
    clockScreen.style.transform='';
    bottomUI.style.opacity='';
  }
}

const prefersReducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
// How far below the viewport top the content should start (computed once per push)
let contentStartVh=100;

function computeContentStart(){
  // Measure where the bottom of the clock UI is
  const bottomEl=document.getElementById('bottomUI');
  if(bottomEl){
    const rect=bottomEl.getBoundingClientRect();
    // Content starts just below the bottom UI + small gap
    // Add back any anticipation shift so we measure the natural position
    contentStartVh=(rect.bottom-4)/window.innerHeight*100+_anticipationVh;
  }else{
    contentStartVh=85; // fallback
  }
}

// Cached threshold states — avoid redundant non-compositor DOM writes per frame
let _lastCPE='auto',_lastBPE='none',_lastMini=false;

function applyDockProgress(p){
  dockProgress=p;

  // Blend from wherever anticipation left off (0 if none)
  const totalScrollVh=contentStartVh-_anticipationVh;
  const scrollVh=_anticipationVh+p*totalScrollVh;

  // Compositor-only properties — safe every frame
  clockScreen.style.transform=`translateY(${-scrollVh}vh)`;
  browseContent.style.transform=`translateY(${100*(1-p)}vh)`;

  const fadeOut=Math.max(0,1-p*3);
  pageHeader.style.opacity=fadeOut;
  sectionTitle.style.opacity=fadeOut;
  bottomUI.style.opacity=0;

  // Non-compositor properties — only write when threshold crossed
  const cpe=p>0.3?'none':'auto';
  if(cpe!==_lastCPE){clockScreen.style.pointerEvents=cpe;_lastCPE=cpe;}
  const bpe=p>0.85?'auto':'none';
  if(bpe!==_lastBPE){browseContent.style.pointerEvents=bpe;_lastBPE=bpe;}
  const mv=p>0.7;
  if(mv!==_lastMini){miniClockBar.classList.toggle('visible',mv);_lastMini=mv;}
}

// ═══ UNIFIED SCROLL HANDLER ═══
// How many px of scroll to fully push the clock off screen
const PUSH_DISTANCE=window.innerHeight*0.4; // ~40vh — quick push like a door opening

window.addEventListener('wheel',(e)=>{
  if(modalOpen)return;

  // Browse mode: let native scroll handle everything
  if(phase==='browse') return;

  if(clockPopOpen)closeClockPop();
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

    // Track if hand has visited past 6 o'clock in this loop
    const normCurrent=((rawAngle%360)+360)%360;
    if(normCurrent>=180) visitedPast180=true;
    if(normCurrent<10) visitedPast180=false; // reset when near 12

    if(e.deltaY>0 && newAngle>=target360){
      // Skip this crossing only if returned from browse AND hand was deep in the clock
      const skipThisCrossing=returnedFromBrowse && visitedPast180;

      if(skipThisCrossing){
        returnedFromBrowse=false;
        visitedPast180=false;
      }else{
        // Trigger push — anticipation already signaled the transition
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
    // Track velocity for momentum
    pushDeltas.push({d:e.deltaY,t:performance.now()});
    if(pushDeltas.length>5) pushDeltas.shift();

    // Bidirectional during push
    dockProgress=Math.min(1,Math.max(0,dockProgress+e.deltaY/PUSH_DISTANCE));

    // Hand drifts slowly during push — clock winding down
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

    // Reset momentum timer
    clearTimeout(pushMomentumTimer);
    pushMomentumTimer=setTimeout(()=>{
      if(phase!=='pushing') return;
      // Average recent deltas for momentum
      const now=performance.now();
      const recent=pushDeltas.filter(d=>now-d.t<150);
      if(recent.length<2) return;
      let avgV=recent.reduce((s,d)=>s+d.d,0)/recent.length;
      if(Math.abs(avgV)<1) return;
      // Decay loop
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
  // If navigated via label click, scroll to that section
  if(_navTarget!==null){
    const secId=['sec-about','sec-work','sec-notes','sec-bookmarks'][_navTarget];
    const target=document.getElementById(secId);
    if(target)requestAnimationFrame(()=>target.scrollIntoView({behavior:'smooth',block:'start'}));
    _navTarget=null;
  }
  // If a note was requested from the clock popover, open it after transition
  if(_pendingNoteIdx!==null){
    const ni=_pendingNoteIdx;
    _pendingNoteIdx=null;
    setTimeout(()=>openNote(ni),450);
  }
}

function updateMiniClockHand(){
  if(phase!=='browse') return;
  const miniHand=document.getElementById('miniHand');
  if(!miniHand) return;

  // Pure scroll-to-angle: 0% scroll = 0°, 100% scroll = 360°
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
  if(clockPopOpen)closeClockPop();
  const y=e.touches[0].clientY;
  const delta=touchLastY-y;touchLastY=y;

  if(phase==='clock'){
    if(undockGuard){
      if(delta>0) undockGuard=false;
      else return;
    }

    // Mobile: swipe up outside clock face → skip rotation, go straight to push
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
  // Snap to target section angle if navigating, otherwise snap to next full rotation
  if(_navTarget!==null){
    rawAngle=Math.floor(rawAngle/360)*360+_navTarget*90;
    if(rawAngle<=rawAngle-1)rawAngle+=360; // ensure forward
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
  phase='clock';
  totalForwardScroll=0;dockProgress=0;_anticipationVh=0;_lastCPE='auto';_lastBPE='none';_lastMini=false;
  window.removeEventListener('scroll',updateMiniClockHand);

  // Reset overflow
  document.documentElement.style.overflow='hidden';
  document.body.style.overflow='hidden';
  document.body.style.height='100%';

  // Reset browse content
  browseContent.style.position='fixed';browseContent.style.top='0';
  browseContent.style.transform='translateY(100vh)';browseContent.style.opacity='1';browseContent.style.pointerEvents='none';
  browseContent.style.willChange='';

  // Show clock
  clockScreen.style.display='';
  clockScreen.style.transform='';clockScreen.style.opacity='';clockScreen.style.pointerEvents='';
  pageHeader.style.opacity='';sectionTitle.style.opacity='';
  bottomUI.style.display='';bottomUI.style.opacity='';
  skipLinkEl.classList.remove('hidden');
  miniClockBar.classList.remove('visible');
  const miniHand=document.getElementById('miniHand');
  if(miniHand) miniHand.setAttribute('transform','rotate(0 50 50)');

  // Reset hand
  rawAngle=0;springVelocity=0;springTarget=0;currentSection=0;returnedFromBrowse=false;visitedPast180=false;
  handContainer.style.transform='rotate(0deg)';
  applyAngle(0);
  document.querySelectorAll('.menu-label').forEach(l=>l.classList.toggle('active',+l.dataset.section===0));
  document.querySelectorAll('.thumbnail').forEach(t=>{t.classList.toggle('active-quadrant',+t.dataset.quadrant===0);t.classList.remove('focused');});
  document.querySelectorAll('.indicator-dot').forEach(d=>d.classList.toggle('active',+d.dataset.section===0));
  document.getElementById('activeSectionTitle').textContent='About';
  document.getElementById('activeSectionDesc').textContent='Who I am & how to reach me';
}

// ═══ CLICK NAV ═══
let _navTarget=null;
let _pendingNoteIdx=null;
function navigateTo(s){
  if(modalOpen)return;
  if(phase==='browse'){
    const target=document.getElementById(['sec-about','sec-work','sec-notes','sec-bookmarks'][s]);
    if(target)target.scrollIntoView({behavior:'smooth',block:'start'});
    return;
  }
  // In clock mode: skip to browse and scroll to the section
  _navTarget=s;
  skipToContent();
}

// ═══ KEYBOARD ═══
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&clockPopOpen){closeClockPop();return;}
  if(e.key==='Escape'&&modalOpen){closeModal();return;}
  if(e.key==='Escape'&&currentNote!==null){closeNote();return;}
  if(e.key==='Escape'&&mmindActiveIdx!==null){mmindClosePopover();return;}
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

// ═══ THUMBNAILS ═══
function renderThumbnails(){
  const r=clockFace.getBoundingClientRect();
  const cx=r.width/2,cy=r.height/2;
  const isMobile=window.innerWidth<=480;
  // On portrait mobile: elliptical orbit matching tall clock shape
  const rx=cx*(isMobile?0.84:0.78);
  const ry=cy*(isMobile?0.80:0.78);
  const sz=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--thumbnail-size'));
  for(let q=0;q<4;q++){
    [3,6,9,12].forEach((pos,idx)=>{
      const a=((q*15+pos)*6-90)*(Math.PI/180);
      const x=cx+rx*Math.cos(a),y=cy+ry*Math.sin(a);
      const th=document.createElement('div');
      th.className='thumbnail';th.dataset.quadrant=q;th.dataset.index=idx;
      th.style.cssText=`position:absolute;left:${x-sz/2}px;top:${y-sz/2}px;width:${sz}px;height:${sz}px;`;
      const ph=document.createElement('div');
      ph.className='thumbnail-placeholder';
      if(q===2){
        ph.className='thumbnail-placeholder notes-icon';
        ph.style.background='#fff';ph.style.padding='0';ph.style.overflow='hidden';
        ph.innerHTML=`<div class="ni-yellow"></div><div class="ni-dots"></div><div class="ni-lines"><span></span><span></span></div>`;
      }else if(THUMB_IMAGES[q]&&THUMB_IMAGES[q][idx]){
        ph.style.background='none';ph.style.padding='0';ph.style.overflow='hidden';
        ph.innerHTML=`<img src="${THUMB_IMAGES[q][idx]}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`;
      }else if(THUMB_SVGS[q]&&THUMB_SVGS[q][idx]){
        ph.style.background=THUMB_COLORS[q]?THUMB_COLORS[q][idx]:'#E8E4E0';
        ph.innerHTML=THUMB_SVGS[q][idx];
        ph.style.display='flex';ph.style.alignItems='center';ph.style.justifyContent='center';
        ph.style.color='rgba(0,0,0,0.4)';
      }else{
        ph.style.background=THUMB_COLORS[q]?THUMB_COLORS[q][idx]:'#ccc';
        ph.textContent=PROJECTS[q][idx].title.substring(0,2).toUpperCase();
      }
      th.appendChild(ph);
      th.addEventListener('click',()=>{
        if(clockPopOpen)closeClockPop();
        const thumbAngle=(q*15+[3,6,9,12][idx])*6;
        springToAngle(thumbAngle,true);
        if(q===0){
          // About section: open social links directly
          const link=PROJECTS[q][idx].link;
          if(link&&link!=='#')window.open(link,'_blank','noopener,noreferrer');
        }
        else{openClockPop(q,idx,th);}
      });
      clockFace.appendChild(th);
    });
  }
}

// ═══ CLOCK THUMBNAIL POPOVER ═══
const clockPopWrap=document.getElementById('clockPopWrap');
const clockPop=document.getElementById('clockPop');
const clockPopScrim=document.getElementById('clockPopScrim');
let clockPopOpen=false;

function openClockPop(q,idx,thumbEl){
  const project=PROJECTS[q][idx];
  let html='';

  // Work section (q===1): preview + "View case study" button
  if(q===1){
    html+=`<div class="cpop-title">${project.title}</div>`;
    if(project.tags?.length){
      html+=`<div class="cpop-tags">${project.tags.map(t=>`<span class="cpop-tag">${t}</span>`).join('')}</div>`;
    }
    const desc=typeof project.desc==='string'?project.desc:project.desc;
    html+=`<div class="cpop-desc">${desc}</div>`;
    html+=`<button class="cpop-link cpop-view-case" data-pidx="${project._puzzleIdx}">View case study \u2192</button>`;
  }
  // Notes section (q===2): preview with "View full note" button; 4th item = coming soon
  else if(q===2&&idx===3){
    html+=`<div class="cpop-title">${project.title}</div>`;
    html+=`<div class="cpop-desc" style="color:var(--accent);font-weight:500;">Coming soon</div>`;
  }else if(q===2){
    html+=`<div class="cpop-title">${project.title}</div>`;
    if(project.tags?.length){
      html+=`<div class="cpop-tags">${project.tags.map(t=>`<span class="cpop-tag">${t}</span>`).join('')}</div>`;
    }
    const desc=Array.isArray(project.desc)?project.desc[0]:project.desc;
    html+=`<div class="cpop-desc">${desc}</div>`;
    html+=`<button class="cpop-link cpop-view-note" data-q="${q}" data-idx="${idx}">View full note \u2192</button>`;
  }else{
    html+=`<div class="cpop-title">${project.title}</div>`;
    if(typeof project.desc==='string'){
      html+=`<div class="cpop-desc">${project.desc}</div>`;
    }else if(Array.isArray(project.desc)){
      html+=`<div class="cpop-desc">${project.desc[0]}</div>`;
    }
    if(project.tags?.length){
      html+=`<div class="cpop-tags">${project.tags.map(t=>`<span class="cpop-tag">${t}</span>`).join('')}</div>`;
    }
    if(project.link&&project.link!=='#'){
      const display=project.link.replace('https://','').replace('mailto:','');
      html+=`<a class="cpop-link" href="${project.link}" target="_blank">${display} \u2197</a>`;
    }
  }
  clockPop.innerHTML=html;

  // Attach "View case study" click handler — open puzzle modal
  const caseBtn=clockPop.querySelector('.cpop-view-case');
  if(caseBtn){
    caseBtn.addEventListener('click',()=>{
      const pi=+caseBtn.dataset.pidx;
      closeClockPop();
      openPuzzleModal(PUZZLE_PROJECTS[pi]);
    });
  }

  // Attach "View full note" click handler — navigate to Notes section and open the note
  const noteBtn=clockPop.querySelector('.cpop-view-note');
  if(noteBtn){
    noteBtn.addEventListener('click',()=>{
      const ni=+noteBtn.dataset.idx;
      closeClockPop();
      _navTarget=2;
      _pendingNoteIdx=ni;
      skipToContent();
    });
  }

  // Position relative to clock face
  const faceRect=clockFace.getBoundingClientRect();
  const thumbRect=thumbEl.getBoundingClientRect();
  const thumbCX=thumbRect.left+thumbRect.width/2-faceRect.left;
  const thumbBottom=thumbRect.bottom-faceRect.top;
  const thumbTop=thumbRect.top-faceRect.top;
  const popWidth=200;
  const gap=8;

  // Horizontal — center on thumb, allow extending beyond clock face
  let left=thumbCX-popWidth/2;
  left=Math.max(-20,Math.min(left,faceRect.width-popWidth+20));
  clockPopWrap.style.left=left+'px';
  clockPopWrap.style.right='';

  // Vertical — try below, flip above if needed
  clockPopWrap.style.visibility='hidden';
  clockPopWrap.style.top=(thumbBottom+gap)+'px';
  clockPopWrap.classList.add('open');
  const popH=clockPop.offsetHeight;
  clockPopWrap.classList.remove('open');
  clockPopWrap.style.visibility='';

  // Allow popover to extend below clock face (no longer clipped)
  const spaceBelow=faceRect.height-thumbBottom-gap+40;
  if(spaceBelow>=popH){
    clockPopWrap.style.top=(thumbBottom+gap)+'px';
  }else{
    clockPopWrap.style.top=(thumbTop-gap-popH)+'px';
  }

  // Highlight thumb
  document.querySelectorAll('.thumbnail').forEach(t=>t.classList.remove('focused'));
  thumbEl.classList.add('focused');

  clockPopWrap.classList.remove('open');
  clockPopWrap.offsetHeight;
  clockPopWrap.classList.add('open');
  clockPopScrim.classList.add('open');
  clockPopOpen=true;
}

function closeClockPop(){
  clockPopWrap.classList.remove('open');
  clockPopScrim.classList.remove('open');
  document.querySelectorAll('.thumbnail').forEach(t=>t.classList.remove('focused'));
  clockPopOpen=false;
}

clockPopScrim.addEventListener('click',closeClockPop);

// ═══ MODAL ═══
// 3D tilt state
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
  // Reset modal body scroll
  if(modalBody){modalBody.scrollTop=0;modalBody.classList.remove('has-scroll-fade');modalBody.classList.remove('has-bottom-fade');}
  modalOverlay.classList.add('open');
  modalCard.style.willChange='transform';
  document.body.style.overflow='hidden';
  // Check overflow after layout settles
  requestAnimationFrame(()=>{if(modalBody){
    const hasOverflow=modalBody.scrollHeight>modalBody.clientHeight+4;
    modalBody.classList.toggle('has-bottom-fade',hasOverflow);
  }});
  updateCarouselButtons();

  // Scale-in + tilt init
  tiltRX=0;tiltRY=0;tiltTargetRX=0;tiltTargetRY=0;tiltVelRX=0;tiltVelRY=0;
  const isMobileModal=window.matchMedia('(max-width:480px)').matches;
  if(isMobileModal){
    // Mobile: let CSS slide-up transition handle everything — don't touch transform
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
function openModal(q,idx,thumbEl){_showModal(PROJECTS[q][idx],thumbEl);}
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
  else{modalCard.style.willChange='';} // Mobile: leave transform to CSS transition
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
renderThumbnails();
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
document.querySelectorAll('.thumbnail[data-quadrant="0"]').forEach(t=>t.classList.add('active-quadrant'));
applyDockProgress(0);

// Default to browse mode on load — clock is accessible via mini dock icon
enterBrowseMode();
miniClockBar.classList.add('visible');
_lastMini=true;


// ═══ CMS: Optionally override Notes + Mymind from portfolio-data.json ═══
// HTML has hardcoded defaults. JSON only replaces them if found.
async function loadPortfolioData(){
  try{
    const res=await fetch('/portfolio-data.json');
    if(!res.ok)return; // keep hardcoded HTML
    const data=await res.json();
  }catch(e){/* JSON not available, hardcoded HTML stays */}
}

function esc(s){return s?s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'):'';}

loadPortfolioData();

// ═══ KINDLE — Library grid + detail view + highlights drawer ═══
// Data imported from src/data/books.js

const kindleScreenEl=document.getElementById('kindleScreen');
const kindleGrid=document.getElementById('kindleGrid');
const kindleLibraryView=document.getElementById('kindleLibraryView');
const kindleDetailView=document.getElementById('kindleDetailView');
const kindleBack=document.getElementById('kindleBack');
const kindleNotesBtn=document.getElementById('kindleNotesBtn');
const kindleDrawer=document.getElementById('kindleDrawer');
const kindleDrawerOverlay=document.getElementById('kindleDrawerOverlay');
const kindleDrawerClose=document.getElementById('kindleDrawerClose');
const kindleDrawerContent=document.getElementById('kindleDrawerContent');

// Render library grid
function kindleRenderLibrary(){
  kindleGrid.innerHTML='';
  KINDLE_BOOKS.forEach((book,i)=>{
    const el=document.createElement('div');
    el.className='kindle-grid-book';
    el.innerHTML=`
      <div class="kindle-grid-cover">
        <img src="${esc(book.cover)}" alt="${esc(book.title)}" loading="lazy">
        <div class="kindle-grid-bar"><div class="kindle-grid-bar-fill" style="width:${book.progress}%"></div></div>
      </div>`;
    el.addEventListener('click',()=>kindleOpenDetail(i));
    kindleGrid.appendChild(el);
  });
}

function kindleOpenDetail(idx){
  const book=KINDLE_BOOKS[idx];
  // E-ink flash
  if(!prefersReducedMotion){
    kindleScreenEl.classList.remove('eink-flash');
    kindleScreenEl.offsetHeight;
    kindleScreenEl.classList.add('eink-flash');
    kindleScreenEl.addEventListener('animationend',()=>kindleScreenEl.classList.remove('eink-flash'),{once:true});
  }
  // Populate detail
  const coverEl=document.getElementById('kindleDetailCover');
  coverEl.innerHTML=`<img src="${esc(book.cover)}" alt="${esc(book.title)}">`;
  document.getElementById('kindleDetailTopTitle').textContent=book.title.length>30?book.title.substring(0,30)+'\u2026':book.title;
  document.getElementById('kindleDetailSubtitle').textContent=book.title;
  document.getElementById('kindleDetailBy').textContent='by '+book.author;
  document.getElementById('kindleDetailPct').textContent=book.progress+'%';
  document.getElementById('kindleDetailFill').style.width=book.progress+'%';
  // Populate drawer content
  if(book.notes&&book.notes.length>0){
    kindleDrawerContent.innerHTML=book.notes.map(n=>
      `<div class="kindle-highlight">
        <div class="kindle-highlight-bar">${esc(n.highlight)}</div>
        <div class="kindle-highlight-note">${esc(n.note)}</div>
      </div>`).join('');
  }else{
    kindleDrawerContent.innerHTML='<div class="kindle-no-notes">No highlights yet</div>';
  }
  // Reset drawer state
  kindleDrawer.classList.remove('open');
  kindleDrawerOverlay.classList.remove('open');
  kindleNotesBtn.classList.remove('active');
  // View transition
  kindleLibraryView.classList.add('hidden');
  kindleDetailView.classList.remove('hidden');
}

function kindleCloseDetail(){
  kindleCloseDrawer();
  if(!prefersReducedMotion){
    kindleScreenEl.classList.remove('eink-flash');
    kindleScreenEl.offsetHeight;
    kindleScreenEl.classList.add('eink-flash');
    kindleScreenEl.addEventListener('animationend',()=>kindleScreenEl.classList.remove('eink-flash'),{once:true});
  }
  kindleDetailView.classList.add('hidden');
  kindleLibraryView.classList.remove('hidden');
}

function kindleOpenDrawer(){
  kindleDrawer.classList.add('open');
  kindleDrawerOverlay.classList.add('open');
  kindleNotesBtn.classList.add('active');
}
function kindleCloseDrawer(){
  kindleDrawer.classList.remove('open');
  kindleDrawerOverlay.classList.remove('open');
  kindleNotesBtn.classList.remove('active');
}

kindleBack.addEventListener('click',kindleCloseDetail);
kindleNotesBtn.addEventListener('click',()=>{
  if(kindleDrawer.classList.contains('open')) kindleCloseDrawer();
  else kindleOpenDrawer();
});
kindleDrawerClose.addEventListener('click',kindleCloseDrawer);
kindleDrawerOverlay.addEventListener('click',kindleCloseDrawer);
kindleRenderLibrary();

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
window.openModal = openModal;
window.openPuzzleModal = openPuzzleModal;

// Data imported from src/data/notes.js


const DEMOS={
  "spring-ball":{
    height:140,hint:"Drag the ball and release",
    init(canvas){
      const ctx=canvas.getContext('2d');
      const w=canvas.width,h=canvas.height;
      let ballX=w/2,ballY=h/2,velX=0,velY=0;
      let targetX=w/2,targetY=h/2;
      let dragging=false,raf,active=false;
      const stiff=0.08,damp=0.78,radius=16;
      function render(){
        ctx.clearRect(0,0,w,h);
        ctx.beginPath();ctx.arc(ballX,ballY,radius+4,0,Math.PI*2);
        ctx.fillStyle='rgba(139,126,200,0.08)';ctx.fill();
        const grad=ctx.createRadialGradient(ballX-4,ballY-4,2,ballX,ballY,radius);
        grad.addColorStop(0,'#A699D4');grad.addColorStop(1,'#7B6CB8');
        ctx.beginPath();ctx.arc(ballX,ballY,radius,0,Math.PI*2);
        ctx.fillStyle=grad;ctx.fill();
        ctx.beginPath();ctx.arc(ballX-4,ballY-5,5,0,Math.PI*2);
        ctx.fillStyle='rgba(255,255,255,0.35)';ctx.fill();
      }
      function step(){
        if(!dragging){
          const dx=targetX-ballX,dy=targetY-ballY;
          velX=(velX+dx*stiff)*damp;velY=(velY+dy*stiff)*damp;
          ballX+=velX;ballY+=velY;
          if(Math.abs(dx)<0.5&&Math.abs(dy)<0.5&&Math.abs(velX)<0.5&&Math.abs(velY)<0.5){
            ballX=targetX;ballY=targetY;render();active=false;return;
          }
        }
        render();raf=requestAnimationFrame(step);
      }
      function start(){if(!active){active=true;raf=requestAnimationFrame(step);}}
      function getPos(e){
        const r=canvas.getBoundingClientRect();
        const t=e.touches?e.touches[0]:e;
        return{x:(t.clientX-r.left)*(w/r.width),y:(t.clientY-r.top)*(h/r.height)};
      }
      canvas.addEventListener('mousedown',e=>{const p=getPos(e);if(Math.hypot(p.x-ballX,p.y-ballY)<radius+10){dragging=true;start();}});
      canvas.addEventListener('mousemove',e=>{if(dragging){const p=getPos(e);ballX=p.x;ballY=p.y;velX=0;velY=0;}});
      canvas.addEventListener('mouseup',()=>{dragging=false;start();});
      canvas.addEventListener('mouseleave',()=>{dragging=false;start();});
      canvas.addEventListener('touchstart',e=>{e.preventDefault();const p=getPos(e);if(Math.hypot(p.x-ballX,p.y-ballY)<radius+20){dragging=true;start();}},{passive:false});
      canvas.addEventListener('touchmove',e=>{e.preventDefault();if(dragging){const p=getPos(e);ballX=p.x;ballY=p.y;velX=0;velY=0;}},{passive:false});
      canvas.addEventListener('touchend',()=>{dragging=false;start();});
      render();
      return()=>{active=false;cancelAnimationFrame(raf);};
    }
  },
  "easing-vs-spring":{
    height:120,hint:"Tap anywhere to trigger both",
    init(canvas){
      const ctx=canvas.getContext('2d');
      const w=canvas.width,h=canvas.height;
      let easingX=40,springX=40,springV=0;
      let targetX=40,animating=false,startTime=0;
      let raf,active=false,autoTimer;
      const radius=10,stiff=0.06,damp=0.75;
      function easeOut(t){return 1-Math.pow(1-t,3);}
      function render(){
        ctx.clearRect(0,0,w,h);
        ctx.font='500 9px Geist, sans-serif';
        ctx.fillStyle='rgba(0,0,0,0.2)';
        ctx.fillText('EASE-OUT',8,h/4+3);
        ctx.fillText('SPRING',8,3*h/4+3);
        ctx.strokeStyle='rgba(0,0,0,0.04)';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(40,h/4);ctx.lineTo(w-20,h/4);ctx.stroke();
        ctx.beginPath();ctx.moveTo(40,3*h/4);ctx.lineTo(w-20,3*h/4);ctx.stroke();
        let g1=ctx.createRadialGradient(easingX-2,h/4-2,1,easingX,h/4,radius);
        g1.addColorStop(0,'#B0AAA2');g1.addColorStop(1,'#8A857D');
        ctx.beginPath();ctx.arc(easingX,h/4,radius,0,Math.PI*2);ctx.fillStyle=g1;ctx.fill();
        let g2=ctx.createRadialGradient(springX-2,3*h/4-2,1,springX,3*h/4,radius);
        g2.addColorStop(0,'#A699D4');g2.addColorStop(1,'#7B6CB8');
        ctx.beginPath();ctx.arc(springX,3*h/4,radius,0,Math.PI*2);ctx.fillStyle=g2;ctx.fill();
      }
      function step(){
        if(animating){
          const elapsed=(performance.now()-startTime)/600;
          const t=Math.min(1,elapsed);
          easingX=40+(targetX-40)*easeOut(t);
          if(t>=1)easingX=targetX;
          const dx=targetX-springX;
          springV=(springV+dx*stiff)*damp;springX+=springV;
          if(t>=1&&Math.abs(dx)<0.5&&Math.abs(springV)<0.5){
            springX=targetX;animating=false;render();active=false;return;
          }
        }
        render();raf=requestAnimationFrame(step);
      }
      function start(){if(!active){active=true;raf=requestAnimationFrame(step);}}
      canvas.addEventListener('click',()=>{
        targetX=targetX>w/2?40:w-40;
        easingX=easingX>w/2?easingX:40;
        startTime=performance.now();animating=true;start();
      });
      if(!prefersReducedMotion){
        autoTimer=setTimeout(()=>{targetX=w-40;startTime=performance.now();animating=true;start();},600);
      }
      render();
      return()=>{active=false;cancelAnimationFrame(raf);clearTimeout(autoTimer);};
    }
  }
};

// Notes DOM refs
const SITE_URL='https://raks.design';
const anotesSlider=document.getElementById('anotesSlider');
const anotesList=document.getElementById('anotesList');
const anotesSearchInput=document.getElementById('anotesSearchInput');
const anotesSearchClear=document.getElementById('anotesSearchClear');
const anotesNoResults=document.getElementById('anotesNoResults');
const anotesSearchDropdown=document.getElementById('anotesSearchDropdown');
const anotesDropdownTags=document.getElementById('anotesDropdownTags');
const anotesSortBtn=document.getElementById('anotesSortBtn');
let currentNote=null;
let activeCleanups=[];
let activeTags=new Set();
let sortAsc=false;
const allTags=[...new Set(NOTES.flatMap(n=>n.tags||[]))].sort();

function renderDropdownTags(){
  anotesDropdownTags.innerHTML=allTags.map(tag=>
    `<span class="tag-capsule${activeTags.has(tag)?' active':''}" data-tag="${tag}">${tag}</span>`
  ).join('');
  anotesDropdownTags.querySelectorAll('.tag-capsule').forEach(cap=>{
    cap.addEventListener('click',(e)=>{
      e.stopPropagation();
      const tag=cap.dataset.tag;
      if(activeTags.has(tag))activeTags.delete(tag);
      else activeTags.add(tag);
      renderDropdownTags();updateSearchChips();filterNotes();
    });
  });
}

function showDropdown(){anotesSearchDropdown.classList.add('open');}
function hideDropdown(){anotesSearchDropdown.classList.remove('open');}

anotesSearchInput.addEventListener('focus',()=>{
  if(!anotesSearchInput.value.trim())showDropdown();
});
document.addEventListener('mousedown',(e)=>{
  const wrap=document.querySelector('.anotes-search-wrap');
  if(wrap&&!wrap.contains(e.target))hideDropdown();
});

function updateSearchChips(){
  document.querySelectorAll('.search-chip').forEach(c=>c.remove());
  const searchBar=document.querySelector('.anotes-search');
  activeTags.forEach(tag=>{
    const chip=document.createElement('span');
    chip.className='search-chip';
    chip.innerHTML=`${esc(tag)}<button>&times;</button>`;
    chip.querySelector('button').addEventListener('click',(e)=>{
      e.stopPropagation();
      activeTags.delete(tag);
      renderDropdownTags();updateSearchChips();filterNotes();
    });
    searchBar.insertBefore(chip,anotesSearchInput);
  });
  anotesSearchClear.classList.toggle('visible',anotesSearchInput.value.trim().length>0||activeTags.size>0);
}

function getSortedIndices(){
  const indices=NOTES.map((_,i)=>i);
  indices.sort((a,b)=>{
    const da=NOTES[a].sortDate||0,db=NOTES[b].sortDate||0;
    return sortAsc?da-db:db-da;
  });
  return indices;
}

function renderList(){
  const sorted=getSortedIndices();
  anotesList.innerHTML=sorted.map((i,pos)=>`
    <div class="anotes-note${pos===0?' active':''}" data-note="${i}">
      <div class="anotes-note-title">${NOTES[i].title}</div>
      <div class="anotes-note-row">
        <span class="anotes-note-date">${NOTES[i].date}</span>
        <span class="anotes-note-preview">${NOTES[i].preview}</span>
      </div>
    </div>
  `).join('');
  anotesSearchInput.placeholder=`Search ${NOTES.length} notes`;
  const footer=document.getElementById('anotesListFooter');
  if(footer)footer.textContent=`${NOTES.length} Note${NOTES.length!==1?'s':''}`;
  anotesList.querySelectorAll('.anotes-note').forEach(el=>{
    el.addEventListener('click',()=>{
      noteClickSound();
      anotesList.querySelectorAll('.anotes-note').forEach(n=>n.classList.remove('active'));
      el.classList.add('active');
      openNote(+el.dataset.note);
    });
  });
  renderDropdownTags();
}

anotesSortBtn.addEventListener('click',()=>{
  sortAsc=!sortAsc;
  anotesSortBtn.classList.toggle('asc',sortAsc);
  anotesSortBtn.querySelector('span').textContent=sortAsc?'Oldest':'Newest';
  renderList();filterNotes();
});

function filterNotes(){
  const raw=anotesSearchInput.value.trim();
  const inlineTags=[];
  const textQuery=raw.replace(/#(\w+)/g,(_,tag)=>{
    inlineTags.push(tag.toLowerCase());return '';
  }).toLowerCase().trim();
  const allActiveTags=new Set([...activeTags,...inlineTags.map(t=>allTags.find(at=>at.toLowerCase()===t)||t)]);
  const items=anotesList.querySelectorAll('.anotes-note');
  let v=0;
  items.forEach(el=>{
    const n=NOTES[+el.dataset.note];
    const noteTags=(n.tags||[]).map(t=>t.toLowerCase());
    const tagMatch=allActiveTags.size===0||[...allActiveTags].some(t=>noteTags.includes(t.toLowerCase()));
    const textMatch=!textQuery||(n.title+' '+n.preview+' '+n.date+' '+noteTags.join(' ')).toLowerCase().includes(textQuery);
    const show=tagMatch&&textMatch;
    el.style.display=show?'':'none';
    if(show)v++;
  });
  anotesNoResults.classList.toggle('visible',v===0);
}

anotesSearchInput.addEventListener('input',()=>{
  const hasText=anotesSearchInput.value.trim().length>0;
  anotesSearchClear.classList.toggle('visible',hasText||activeTags.size>0);
  if(hasText)hideDropdown();else showDropdown();
  filterNotes();
});
anotesSearchClear.addEventListener('click',()=>{
  anotesSearchInput.value='';activeTags.clear();
  renderDropdownTags();updateSearchChips();filterNotes();
  anotesSearchClear.classList.remove('visible');hideDropdown();
  anotesSearchInput.focus();
});

function renderBody(note){
  const container=document.getElementById('anotesReaderBody');
  activeCleanups.forEach(fn=>fn&&fn());activeCleanups=[];
  if(!note.rich){container.innerHTML=typeof note.body==='string'?note.body:'';return;}
  container.innerHTML='';
  note.body.forEach(block=>{
    if(block.type==='text'){
      const div=document.createElement('div');div.innerHTML=block.html;container.appendChild(div);
    }else if(block.type==='callout'){
      const div=document.createElement('div');div.className='note-callout';div.textContent=block.html;container.appendChild(div);
    }else if(block.type==='code'){
      const wrap=document.createElement('div');wrap.style.cssText='position:relative;';
      const pre=document.createElement('div');pre.className='note-code';pre.innerHTML=block.html;
      const copyBtn=document.createElement('button');copyBtn.className='note-code-copy';copyBtn.textContent='copy';
      const rawText=pre.textContent;
      copyBtn.addEventListener('click',()=>{navigator.clipboard.writeText(rawText);copyBtn.textContent='copied';setTimeout(()=>copyBtn.textContent='copy',1500);});
      wrap.appendChild(pre);wrap.appendChild(copyBtn);container.appendChild(wrap);
    }else if(block.type==='image'){
      const wrap=document.createElement('div');wrap.className='note-img';
      if(block.src){
        const img=document.createElement('img');img.src=block.src;img.alt=block.caption||'';img.loading='lazy';
        wrap.appendChild(img);
      }else{
        const placeholder=document.createElement('div');
        placeholder.style.cssText=`width:100%;height:160px;background:${block.gradient};border-radius:10px;`;
        wrap.appendChild(placeholder);
      }
      container.appendChild(wrap);
      if(block.caption){const cap=document.createElement('div');cap.className='note-img-caption';cap.textContent=block.caption;container.appendChild(cap);}
    }else if(block.type==='embed'){
      const wrap=document.createElement('div');wrap.className='note-embed';
      const ph=document.createElement('div');ph.className='note-embed-placeholder';
      const lbl=document.createElement('div');lbl.className='note-embed-label';lbl.textContent='Interactive prototype';
      const btn=document.createElement('button');btn.className='note-embed-btn';btn.textContent='Try it';
      ph.appendChild(lbl);ph.appendChild(btn);wrap.appendChild(ph);
      ph.addEventListener('click',()=>{
        const iframe=document.createElement('iframe');iframe.src=block.src;iframe.loading='lazy';
        iframe.setAttribute('sandbox','allow-scripts allow-same-origin');
        wrap.replaceChild(iframe,ph);
      });
      container.appendChild(wrap);
      if(block.caption){const cap=document.createElement('div');cap.className='note-embed-caption';cap.textContent=block.caption;container.appendChild(cap);}
    }else if(block.type==='demo'){
      const demo=DEMOS[block.id];if(!demo)return;
      const wrap=document.createElement('div');wrap.className='note-demo';
      const label=document.createElement('div');label.className='note-demo-label';label.textContent='Interactive';wrap.appendChild(label);
      const canvas=document.createElement('canvas');canvas.width=460;canvas.height=demo.height||140;wrap.appendChild(canvas);
      if(demo.hint){const hint=document.createElement('div');hint.className='note-demo-hint';hint.textContent=demo.hint;wrap.appendChild(hint);}
      container.appendChild(wrap);
      requestAnimationFrame(()=>{const cleanup=demo.init(canvas);if(cleanup)activeCleanups.push(cleanup);});
    }
  });
  // Bind glossary terms
  container.querySelectorAll('.term').forEach(el=>{
    el.addEventListener('click',(e)=>{
      e.stopPropagation();
      document.querySelectorAll('.popover.visible').forEach(p=>p.classList.remove('visible'));
      const key=el.dataset.term;const def=GLOSSARY[key];if(!def)return;
      let pop=document.querySelector('.popover[data-key="'+key+'"]');
      if(!pop){
        pop=document.createElement('div');pop.className='popover';pop.dataset.key=key;
        pop.innerHTML=`<div class="popover-title">${def.title}</div><div class="popover-desc">${def.desc}</div>`;
        document.body.appendChild(pop);
      }
      const termRect=el.getBoundingClientRect();
      const winRect=document.querySelector('.anotes-window').getBoundingClientRect();
      const popW=220;
      let left=termRect.left+termRect.width/2-popW/2;
      left=Math.max(winRect.left+8,Math.min(left,winRect.right-popW-8));
      pop.style.visibility='hidden';pop.style.display='block';pop.style.left=left+'px';pop.style.top='0px';
      const popH=pop.offsetHeight;pop.style.visibility='';pop.style.display='';
      let top=termRect.top-popH-8;
      if(top<winRect.top+8)top=termRect.bottom+8;
      pop.style.left=left+'px';pop.style.top=top+'px';
      requestAnimationFrame(()=>pop.classList.add('visible'));
    });
  });
}

document.addEventListener('click',()=>{
  document.querySelectorAll('.popover.visible').forEach(p=>p.classList.remove('visible'));
});

function openNote(idx){
  currentNote=idx;const n=NOTES[idx];
  document.getElementById('anotesReaderDate').textContent=n.date;
  document.getElementById('anotesReaderTitle').textContent=n.title;
  document.getElementById('anotesReaderTags').innerHTML=(n.tags||[]).map(t=>`<span class="reader-tag">${esc(t)}</span>`).join('');
  renderBody(n);
  document.getElementById('anotesReaderScroll').scrollTop=0;
  anotesSlider.classList.add('show-reader');
}
function closeNote(){
  anotesSlider.classList.remove('show-reader');
  activeCleanups.forEach(fn=>fn&&fn());activeCleanups=[];
  currentNote=null;
}
function shareOnX(){
  if(currentNote===null)return;
  window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(`"${NOTES[currentNote].title}"\n\n${SITE_URL}`)}`, '_blank');
}

document.getElementById('anotesReaderBack').addEventListener('click',closeNote);
document.getElementById('anotesFooterShare').addEventListener('click',shareOnX);
document.getElementById('anotesFooterCopy').addEventListener('click',()=>{
  const body=document.getElementById('anotesReaderBody');
  if(!body)return;
  navigator.clipboard.writeText(body.innerText);
  const btn=document.getElementById('anotesFooterCopy');
  btn.textContent='Copied!';setTimeout(()=>btn.textContent='Copy note',1500);
});

// Magic Mouse click — real Apple Magic Mouse sample (CC0, BigSoundBank)
let _mouseClickBuf=null;
fetch('/magic-mouse-click.mp3')
  .then(r=>r.arrayBuffer())
  .then(ab=>{
    const ctx=new(_AC)();
    return ctx.decodeAudioData(ab).then(buf=>{_mouseClickBuf=buf;ctx.close();});
  }).catch(()=>{});
function noteClickSound(){
  if(!_soundOn||!_mouseClickBuf)return;
  _ensureAudioCtx();
  const src=_actx.createBufferSource();
  src.buffer=_mouseClickBuf;
  const vol=_actx.createGain();
  vol.gain.value=0.18;
  src.connect(vol);vol.connect(_actx.destination);
  src.start();
}

renderList();

// Data imported from src/data/mymind.js

const mmindApp=document.querySelector('.mymind-app');
const mmindGrid=document.getElementById('mmindGrid');
const mmindPopWrap=document.getElementById('mmindPopWrap');
const mmindPopover=document.getElementById('mmindPopover');
const mmindScrim=document.getElementById('mmindScrim');
const mmindSearchInput=document.getElementById('mmindSearchInput');
const mmindFilters=document.getElementById('mmindFilters');
let mmindActiveIdx=null;
let mmindActiveFilter='all';
let mmindSearchQuery='';

function mmindBuildCard(card,i){
  const el=document.createElement('div');
  el.className='mm-card';
  el.dataset.idx=i;
  if(card.type==='image'){
    el.classList.add('mm-img-card');
    if(card.img){
      el.innerHTML=`<div class="mm-thumb" style="height:${card.height}px;"><img src="${card.img}" alt="${esc(card.caption)}" loading="lazy"></div><div class="mm-caption">${card.caption}</div>`;
    }else{
      el.innerHTML=`<div class="mm-thumb" style="background:${card.color};height:${card.height}px;"></div><div class="mm-caption">${card.caption}</div>`;
    }
  }else if(card.type==='note'){
    el.classList.add('mm-note-card');
    el.innerHTML=`<p>${card.text}</p>${card.author?`<span class="mm-author">\u2014 ${card.author}</span>`:''}`;
  }else if(card.type==='link'){
    el.classList.add('mm-link-card');
    el.innerHTML=`<div class="mm-link-icon">${card.icon}</div><div class="mm-link-title">${card.linkTitle}</div><div class="mm-link-desc">${card.linkDesc}</div>`;
  }
  return el;
}

function mmindOpenPopover(idx,cardEl){
  const card=MMIND_CARDS[idx];
  const copyText=card.url&&card.url!=='#'?card.url:(card.text||card.title);
  let html=`<div class="pop-header"><div class="pop-title">${card.title}</div><button class="pop-close" id="mmindPopClose">&times;</button></div>`;
  if(card.source)html+=`<a class="pop-source" href="${card.url||'#'}" target="_blank">${card.source} \u2197</a>`;
  if(card.tldr)html+=`<div class="pop-tldr">${card.tldr}</div>`;
  if(card.tags?.length)html+=`<div class="pop-tags">${card.tags.map(t=>`<span class="pop-tag">${t}</span>`).join('')}</div>`;
  html+=`<div class="pop-footer"><span class="pop-date">${card.date}</span><button class="pop-copy" data-copy="${esc(copyText)}"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="5" width="9" height="9" rx="1.5"/><path d="M5 11H3.5A1.5 1.5 0 012 9.5v-7A1.5 1.5 0 013.5 1h7A1.5 1.5 0 0112 2.5V5"/></svg> Copy</button></div>`;
  mmindPopover.innerHTML=html;

  // Position — column-aware horizontal, top/bottom flip
  const appRect=mmindApp.getBoundingClientRect();
  const cardRect=cardEl.getBoundingClientRect();
  const gap=12,padding=12;
  const cardCenterX=cardRect.left+cardRect.width/2-appRect.left;
  const appWidth=appRect.width;
  const third=appWidth/3;

  mmindPopWrap.style.top='';mmindPopWrap.style.bottom='';
  mmindPopWrap.style.left='';mmindPopWrap.style.right='';

  if(cardCenterX<third){
    mmindPopWrap.style.left=padding+'px';
    mmindPopover.style.transformOrigin='top left';
  }else if(cardCenterX>third*2){
    mmindPopWrap.style.right=padding+'px';
    mmindPopover.style.transformOrigin='top right';
  }else{
    const popWidth=appWidth*0.52;
    const leftPos=cardCenterX-popWidth/2;
    const clampedLeft=Math.max(padding,Math.min(leftPos,appWidth-popWidth-padding));
    mmindPopWrap.style.left=clampedLeft+'px';
    mmindPopover.style.transformOrigin='top center';
  }

  // Vertical flip — measure then place
  mmindPopWrap.style.visibility='hidden';
  mmindPopWrap.style.top='0px';
  mmindPopWrap.classList.add('open');
  const popHeight=mmindPopover.offsetHeight;
  mmindPopWrap.classList.remove('open');
  mmindPopWrap.style.visibility='';

  const cardBottom=cardRect.bottom-appRect.top;
  const cardTop=cardRect.top-appRect.top;
  const appHeight=mmindApp.offsetHeight;
  const spaceBelow=appHeight-cardBottom-gap;
  const spaceAbove=cardTop-gap;

  let popTop;
  if(spaceBelow>=popHeight||spaceBelow>=spaceAbove){
    popTop=cardBottom+gap;
    mmindPopover.style.setProperty('--pop-dir','8px');
    mmindPopover.style.transformOrigin=mmindPopover.style.transformOrigin.replace(/^bottom/,'top');
  }else{
    popTop=cardTop-gap-popHeight;
    mmindPopover.style.setProperty('--pop-dir','-8px');
    mmindPopover.style.transformOrigin=mmindPopover.style.transformOrigin.replace(/^top/,'bottom');
  }
  // Clamp within app bounds
  popTop=Math.max(padding,Math.min(popTop,appHeight-popHeight-padding));
  mmindPopWrap.style.top=popTop+'px';

  mmindGrid.querySelectorAll('.mm-card').forEach(c=>c.classList.remove('active'));
  cardEl.classList.add('active');
  mmindActiveIdx=idx;

  mmindPopWrap.classList.remove('open');
  mmindPopWrap.offsetHeight;
  mmindPopWrap.classList.add('open');
  mmindScrim.classList.add('open');

  document.getElementById('mmindPopClose').addEventListener('click',(e)=>{
    e.stopPropagation();
    mmindClosePopover();
  });
  const copyBtn=mmindPopover.querySelector('.pop-copy');
  if(copyBtn){
    copyBtn.addEventListener('click',(e)=>{
      e.stopPropagation();
      navigator.clipboard.writeText(copyBtn.dataset.copy).then(()=>{
        copyBtn.innerHTML='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 8 7 11 12 5"/></svg> Copied!';
        copyBtn.classList.add('copied');
        setTimeout(()=>{
          copyBtn.innerHTML='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="5" width="9" height="9" rx="1.5"/><path d="M5 11H3.5A1.5 1.5 0 012 9.5v-7A1.5 1.5 0 013.5 1h7A1.5 1.5 0 0112 2.5V5"/></svg> Copy';
          copyBtn.classList.remove('copied');
        },1500);
      });
    });
  }
}

function mmindClosePopover(){
  mmindPopWrap.classList.remove('open');
  mmindScrim.classList.remove('open');
  mmindGrid.querySelectorAll('.mm-card').forEach(c=>c.classList.remove('active'));
  mmindActiveIdx=null;
}

function mmindRenderGrid(){
  mmindGrid.innerHTML='';
  mmindClosePopover();
  MMIND_CARDS.forEach((card,i)=>{
    if(mmindActiveFilter!=='all'&&card.category!==mmindActiveFilter)return;
    if(mmindSearchQuery){
      const q=mmindSearchQuery.toLowerCase();
      const haystack=[card.title,card.caption,card.text,card.author,card.linkTitle,card.linkDesc,card.source,card.tldr,...(card.tags||[])].filter(Boolean).join(' ').toLowerCase();
      if(!haystack.includes(q))return;
    }
    const el=mmindBuildCard(card,i);
    el.addEventListener('click',()=>{
      if(mmindActiveIdx===i)mmindClosePopover();
      else mmindOpenPopover(i,el);
    });
    mmindGrid.appendChild(el);
  });
}

// Filters
mmindFilters.addEventListener('click',(e)=>{
  const pill=e.target.closest('.mymind-pill');
  if(!pill)return;
  mmindActiveFilter=pill.dataset.filter;
  mmindFilters.querySelectorAll('.mymind-pill').forEach(p=>
    p.classList.toggle('active',p.dataset.filter===mmindActiveFilter)
  );
  mmindRenderGrid();
});

// Search
mmindSearchInput.addEventListener('input',()=>{
  mmindSearchQuery=mmindSearchInput.value.trim();
  mmindRenderGrid();
});

// Click outside
mmindScrim.addEventListener('mousedown',mmindClosePopover);

// Lock container height after initial paint (skip width lock — fights responsive)
mmindRenderGrid();
requestAnimationFrame(()=>{
  mmindApp.style.minHeight=mmindApp.offsetHeight+'px';
});

// ═══ ABOUT — click sounds + toggle ═══
const AboutAudioCtx=window.AudioContext||window.webkitAudioContext;
let aboutAudioCtx=null;
function _ensureAboutCtx(){
  if(!aboutAudioCtx)aboutAudioCtx=new AboutAudioCtx();
  if(aboutAudioCtx.state==='suspended')aboutAudioCtx.resume();
  return aboutAudioCtx;
}
function aboutClickSound(type){
  if(!_soundOn||prefersReducedMotion)return;
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

// Stack cards shuffle sound — synced to 250ms transition
let stackGain=null,stackSrc=null;
function stackShuffleStart(){
  if(!_soundOn||prefersReducedMotion)return;
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
  // Touch: tap to toggle fan-out + sound
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
  // Close on tap outside
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

// ═══ RESIZE ═══
let rt;
window.addEventListener('resize',()=>{
  clearTimeout(rt);rt=setTimeout(()=>{
    if(phase!=='browse'){
      document.querySelectorAll('.thumbnail').forEach(el=>el.remove());
      renderThumbnails();
      document.querySelectorAll(`.thumbnail[data-quadrant="${currentSection}"]`).forEach(t=>t.classList.add('active-quadrant'));
    }
  },200);
});

// Email link — copy to clipboard, toggle text
const _emailLink=document.getElementById('aboutEmailLink');
let _emailCopied=false;
if(_emailLink){
  // Lock width to prevent reflow when text changes
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
    // Try mailto via hidden iframe
    const iframe=document.createElement('iframe');
    iframe.style.display='none';
    document.body.appendChild(iframe);
    iframe.contentWindow.location.href='mailto:hey@raksha.design';
    setTimeout(()=>document.body.removeChild(iframe),500);
    // Copy to clipboard + swap text
    navigator.clipboard.writeText('hey@raksha.design').then(()=>{
      _emailLink.textContent='copied to clipboard';
      _emailCopied=true;
    });
  });
}
