// ═══ DATA ═══
const SECTIONS=[
  {name:'Work',desc:'Selected projects & case studies',angle:0},
  {name:'Notes',desc:'Articles & reflections',angle:90},
  {name:'Mymind',desc:'Saves & inspiration',angle:180},
  {name:'About',desc:'Who I am & how to reach me',angle:270},
];
const THUMB_COLORS=[
  ['#A699D4','#9488C8','#B8ADDC','#8278B8'],
  ['#F2D98B','#E8CC7A','#F5E0A0','#EDD590'],
  null,
  ['#E8E4E0','#E8E4E0','#E8E4E0','#E8E4E0'],
];
const THUMB_IMAGES=[
  ['/projects/pet-tickle.jpg','/projects/ova-app.jpg','/projects/greex-defi.jpg','/projects/indianoil.jpg'],
  null,
  ['/mymind/framer-layout.png','/mymind/satisfying-checkbox.gif','/mymind/generative-logo.jpg','/mymind/devouring-details.png'],
  null,
];
const THUMB_SVGS=[
  null,null,null,
  [
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a4 4 0 00-8 0v2"/></svg>',
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  ],
];
const PROJECTS=[
  [{title:'AI Usage Optimizer',tags:['React','Figma','2024'],link:'#',desc:'A dashboard tool with 3D tilt effects and metallic animations for tracking AI API usage.',slides:['#A699D4','#9488C8','#8278B8']},{title:'Component Marketplace',tags:['SwiftUI','Design System'],link:'#',desc:'Premium UI component marketplace with liquid animations and haptic micro-interactions.',slides:['#9488C8','#8478BC','#7468AC']},{title:'Tab Switcher Component',tags:['React','Animation'],link:'#',desc:'Buttery smooth tab switcher with liquid mercury transitions. Built with spring physics.',slides:['#B8ADDC','#A89DCC','#988DBC']},{title:'3D Dice App',tags:['SwiftUI','Three.js'],link:'#',desc:'Interactive 3D dice with realistic physics and satisfying roll animations.',slides:['#8278B8','#7268A8','#625898']}],
  [{title:'On Vibe Coding',tags:['Essay','2024'],link:'#',desc:'How designing in the browser with AI assistants changes prototyping.',slides:['#7E8EC8','#6E7EB8','#5E6EA8']},{title:'The Flow State Protocol',tags:['Personal'],link:'#',desc:'Lessons from chasing peak creative states.',slides:['#6C7EB8','#5C6EA8','#4C5E98']},{title:'Design Engineering Manifesto',tags:['Essay'],link:'#',desc:'Why the design-engineering gap is a feature, not a bug.',slides:['#90A0D4','#8090C4','#7080B4']},{title:'Design Systems Deep Dive',tags:['Essay'],link:'#',desc:'Why the design-engineering gap is a feature, not a bug.',slides:['#A4B2DC','#94A2CC','#8492BC']}],
  [{title:'Animation References',tags:['Bookmark'],link:'#',desc:'Curated animation patterns from iOS, Material, and indie apps.',slides:['#8BA8C4','#7B98B4','#6B88A4']},{title:'Design System Resources',tags:['Bookmark'],link:'#',desc:'Tokens and implementation guides from top design systems.',slides:['#7998B8','#6988A8','#597898']},{title:'Reading List 2024',tags:['Books'],link:'#',desc:'Notes from design engineering books, essays, and technical reads.',slides:['#9DB8D0','#8DA8C0','#7D98B0']},{title:'Creative Process Notes',tags:['Personal'],link:'#',desc:'Documenting flow states, creative rituals, and what makes the best work happen.',slides:['#6B88A8','#5B7898','#4B6888']}],
  [{title:'Work With Me',tags:['Freelance'],link:'#',desc:'Premium UI components and design engineering.',slides:['#B090C8','#A080B8','#9070A8']},{title:'Twitter / X',tags:['Social'],link:'https://twitter.com',desc:'Design insights and vibe coding process.',slides:['#A080BC','#9070AC','#80609C']},{title:'GitHub',tags:['Code'],link:'https://github.com',desc:'Open source components and experiments.',slides:['#C4A4D8','#B494C8','#A484B8']},{title:'Send a Message',tags:['Email'],link:'mailto:hello@raks.design',desc:'Let\'s chat about design, code, or anything creative.',slides:['#9470B0','#8460A0','#745090']}],
];

// Flat project data for puzzle grid cards
const PUZZLE_PROJECTS=[
  {title:'AI Usage Optimizer',tags:['React','Figma','2024'],link:'#',desc:'A dashboard tool with 3D tilt effects and metallic animations for tracking AI API usage.',slides:['#A699D4','#9488C8','#8278B8']},
  {title:'Component Marketplace',tags:['SwiftUI','Design System'],link:'#',desc:'Premium UI component marketplace with liquid animations and haptic micro-interactions.',slides:['#9488C8','#8478BC','#7468AC']},
  {title:'Tab Switcher Component',tags:['React','Animation'],link:'#',desc:'Buttery smooth tab switcher with liquid mercury transitions. Built with spring physics.',slides:['#B8ADDC','#A89DCC','#988DBC']},
  {title:'3D Dice App',tags:['SwiftUI','Three.js'],link:'#',desc:'Interactive 3D dice with realistic physics and satisfying roll animations.',slides:['#7E8EC8','#6E7EB8','#5E6EA8']},
  {title:'Magicpath Experiments',tags:['AI Design','Components'],link:'#',desc:'Design experiments and premium UI components built with Magicpath AI design software.',slides:['#8BA8C4','#7B98B4','#6B88A4']},
  {title:'Bewakoof Redesign',tags:['E-Commerce','2023'],link:'#',desc:'Full e-commerce redesign — product pages, checkout flow, and mobile-first shopping experience.',slides:['#B090C8','#A080B8','#9070A8']},
  {title:'Ova App',tags:['Health','0→1'],link:'#',desc:'End-to-end product design for a women\'s health tracking application.',slides:['#6C7EB8','#5C6EA8','#4C5E98']},
  {title:'Greex DeFi',tags:['Fintech','Trading'],link:'#',desc:['DeFi trading platform with real-time charts, portfolio management, and swap interfaces. Built the entire trading experience from scratch — order books, candlestick charts, portfolio breakdowns, and one-tap swap flows. Every interaction had to feel instant because traders don\'t wait.\n\nWe designed a complete trading suite: limit orders, market orders, stop-losses, and trailing stops. The portfolio view breaks down holdings by asset class with real-time P&L calculations. The swap interface supports multi-hop routing across liquidity pools to find the best rates automatically.','The hardest part was making complex financial data feel approachable. We used progressive disclosure everywhere: simple view by default, pro mode one tap away.','Designed a real-time order book that updates 60 times per second without layout thrash. Candlestick charts render thousands of data points with buttery smooth pan and zoom.'],slides:['#9DB8D0','#8DA8C0','#7D98B0']},
];

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
  if(!_actx)_actx=new _AC();
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
  if(!_actx)_actx=new _AC();
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
    const secId=['sec-work','sec-notes','sec-bookmarks','sec-about'][_navTarget];
    const target=document.getElementById(secId);
    if(target)requestAnimationFrame(()=>target.scrollIntoView({behavior:'smooth',block:'start'}));
    _navTarget=null;
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
let touchLastY=0,isTouching=false;
window.addEventListener('touchstart',e=>{
  if(modalOpen)return;
  touchLastY=e.touches[0].clientY;isTouching=true;
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
  rawAngle=Math.ceil(rawAngle/360)*360||360;
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
  document.getElementById('activeSectionTitle').textContent='Work';
  document.getElementById('activeSectionDesc').textContent='Selected projects & case studies';
}

// ═══ CLICK NAV ═══
let _navTarget=null;
function navigateTo(s){
  if(modalOpen)return;
  if(phase==='browse'){
    const target=document.getElementById(['sec-work','sec-notes','sec-bookmarks','sec-about'][s]);
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
      if(q===1){
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
        const thumbAngle=(q*15+[3,6,9,12][idx])*6;
        springToAngle(thumbAngle,true);
        if(q===0){openModal(q,idx,th);}
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
  let html=`<div class="cpop-title">${project.title}</div>`;
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
  clockPop.innerHTML=html;

  // Position relative to clock face
  const faceRect=clockFace.getBoundingClientRect();
  const thumbRect=thumbEl.getBoundingClientRect();
  const thumbCX=thumbRect.left+thumbRect.width/2-faceRect.left;
  const thumbBottom=thumbRect.bottom-faceRect.top;
  const thumbTop=thumbRect.top-faceRect.top;
  const popWidth=200;
  const gap=8;

  // Horizontal — center on thumb, clamp to face
  let left=thumbCX-popWidth/2;
  left=Math.max(8,Math.min(left,faceRect.width-popWidth-8));
  clockPopWrap.style.left=left+'px';
  clockPopWrap.style.right='';

  // Vertical — try below, flip above if needed
  clockPopWrap.style.visibility='hidden';
  clockPopWrap.style.top=(thumbBottom+gap)+'px';
  clockPopWrap.classList.add('open');
  const popH=clockPop.offsetHeight;
  clockPopWrap.classList.remove('open');
  clockPopWrap.style.visibility='';

  const spaceBelow=faceRect.height-thumbBottom-gap;
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
  if(!prefersReducedMotion){
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
  modalCard.style.transform='';
  modalCard.style.willChange='';
  if(modalBody){modalBody.classList.remove('has-bottom-fade');modalBody.classList.remove('has-scroll-fade');}
  if(tiltRaf){cancelAnimationFrame(tiltRaf);tiltRaf=null;}
  if(dockProgress>0)applyDockProgress(dockProgress);else clockScreen.style.transform='';
}
function carouselNext(){
  if(!currentModalData||carouselIndex>=currentModalData.slides.length-1)return;
  carouselIndex++;
  document.getElementById('carouselTrack').style.transform=`translateX(-${carouselIndex*100}%)`;
  document.getElementById('carouselCounter').textContent=`${carouselIndex+1} / ${currentModalData.slides.length}`;
  if(Array.isArray(currentModalData.desc)){renderModalDesc(currentModalData,carouselIndex);recheckScrollLine();}
  updateCarouselButtons();
}
function carouselPrev(){
  if(!currentModalData||carouselIndex<=0)return;
  carouselIndex--;
  document.getElementById('carouselTrack').style.transform=`translateX(-${carouselIndex*100}%)`;
  document.getElementById('carouselCounter').textContent=`${carouselIndex+1} / ${currentModalData.slides.length}`;
  if(Array.isArray(currentModalData.desc)){renderModalDesc(currentModalData,carouselIndex);recheckScrollLine();}
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
const KINDLE_BOOKS=[
  {title:'Siddhartha',author:'Hermann Hesse',cover:'/books/siddhartha.jpg',progress:100,subtitle:'A Novel',notes:[
    {highlight:'Knowledge can be communicated, but not wisdom.',note:'Placeholder note \u2014 replace with your own.'},
    {highlight:'The river is everywhere at the same time.',note:'Placeholder note \u2014 replace with your own.'}
  ]},
  {title:'The War of Art',author:'Steven Pressfield',cover:'/books/war-of-art.jpg',progress:100,subtitle:'Creative Resistance',notes:[
    {highlight:'The more scared we are of a work or calling, the more sure we can be that we have to do it.',note:'Placeholder note \u2014 replace with your own.'}
  ]},
  {title:'Thinking with Type',author:'Ellen Lupton',cover:'/books/thinking-with-type.jpg',progress:15,subtitle:'Thinking with Type',notes:[
    {highlight:'Typography is what language looks like.',note:'Placeholder note \u2014 replace with your own.'}
  ]},
  // Currently reading
  {title:'How to Cope',author:'Boethius (trans. Philip Freeman)',cover:'/books/how-to-cope.jpg',progress:5,subtitle:'Ancient Wisdom',notes:[
    {highlight:'Philosophy herself would grieve if the charges against an innocent man went unchallenged.',note:'Placeholder note \u2014 replace with your own.'}
  ]},
  {title:'Turning Pro',author:'Steven Pressfield',cover:'/books/turning-pro.jpg',progress:5,subtitle:'Turning Pro',notes:[
    {highlight:'Turning pro is a mindset. If we are struggling with fear, self-sabotage, procrastination, self-doubt, etc., the problem is, we\u2019re thinking like amateurs.',note:'Placeholder note \u2014 replace with your own.'}
  ]},
  {title:'The Art of Doing Science and Engineering',author:'Richard Hamming',cover:'/books/hamming.jpg',progress:5,subtitle:'Learning to Learn',notes:[
    {highlight:'The purpose of computing is insight, not numbers.',note:'Placeholder note \u2014 replace with your own.'}
  ]},
  {title:'Kafka on the Shore',author:'Haruki Murakami',cover:'/books/kafka-shore.jpg',progress:10,subtitle:'A Novel',notes:[]},
  {title:'Reality Transurfing',author:'Vadim Zeland',cover:'/books/reality-transurfing.jpg',progress:15,subtitle:'Reality Transurfing',notes:[]},
  // In progress
  {title:'The 48 Laws of Power',author:'Robert Greene',cover:'/books/48-laws.jpg',progress:22,subtitle:'Strategy',notes:[]},
  {title:'The Gene',author:'Siddhartha Mukherjee',cover:'/books/the-gene.jpg',progress:31,subtitle:'An Intimate History',notes:[
    {highlight:'A gene is a long word written in the letters of the DNA alphabet.',note:'Placeholder note \u2014 replace with your own.'}
  ]},
  {title:'Grid Systems',author:'Josef M\u00FCller-Brockmann',cover:'/books/grid-systems.jpg',progress:45,subtitle:'Graphic Design',notes:[
    {highlight:'The grid system is an aid, not a guarantee.',note:'Placeholder note \u2014 replace with your own.'}
  ]},
  {title:'Psycho-Cybernetics',author:'Maxwell Maltz',cover:'/books/psycho-cybernetics.jpg',progress:60,subtitle:'Self-Image Psychology',notes:[
    {highlight:'The self-image is the key to human personality and human behavior.',note:'Placeholder note \u2014 replace with your own.'}
  ]},
  // Finished
  {title:'Becoming Supernatural',author:'Dr. Joe Dispenza',cover:'/books/becoming-supernatural.jpg',progress:100,subtitle:'Mind & Body',notes:[
    {highlight:'Your thoughts are incredibly powerful. Choose yours wisely.',note:'Placeholder note \u2014 replace with your own.'}
  ]},
  {title:'Feeling is the Secret',author:'Neville Goddard',cover:'/books/feeling-secret.jpg',progress:100,subtitle:'Manifestation',notes:[
    {highlight:'Feeling is the secret of successful prayer.',note:'Placeholder note \u2014 replace with your own.'}
  ]},
  {title:'The Power of Now',author:'Eckhart Tolle',cover:'/books/power-of-now.jpg',progress:100,subtitle:'Presence',notes:[
    {highlight:'Realize deeply that the present moment is all you ever have.',note:'Placeholder note \u2014 replace with your own.'}
  ]},
  {title:'Bhagavad Gita As It Is',author:'A.C. Bhaktivedanta Swami Prabhupada',cover:'/books/bhagavad-gita.jpg',progress:100,subtitle:'Ancient Wisdom',notes:[
    {highlight:'For the soul there is neither birth nor death at any time.',note:'Placeholder note \u2014 replace with your own.'},
    {highlight:'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.',note:'Placeholder note \u2014 replace with your own.'}
  ]},
  {title:'Ayurveda',author:'Dr. Vasant Lad',cover:'/books/ayurveda.jpg',progress:100,subtitle:'Science of Self-Healing',notes:[]},
];

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

// ═══ NOTES (Apple Notes interactive component) ═══
const NOTES=[
  {
    title:"How spring physics actually works",
    date:"Today",sortDate:20260211,
    tags:["animation","code","interactive"],
    preview:"The math behind buttery animations, with live demos you can touch...",
    rich:true,
    body:[
      {type:"text",html:`<p>Every animation you love on iOS uses <span class="term" data-term="spring-physics">spring physics</span>. Not easing curves, not keyframes. Springs. And once you understand the three numbers that control them, you'll never animate any other way.</p>`},
      {type:"callout",html:`This note has live demos. Drag things. Break things. That's the point.`},
      {type:"text",html:`<p>A spring animation is driven by three properties: <span class="term" data-term="stiffness">stiffness</span>, <span class="term" data-term="damping">damping</span>, and <span class="term" data-term="mass">mass</span>. Together they simulate how a physical spring behaves. The result is motion that feels real because it literally follows the same differential equations as a real spring.</p>`},
      {type:"demo",id:"spring-ball"},
      {type:"text",html:`<p>See how it overshoots and settles? That's the spring. High stiffness = snappy. High damping = less bounce. High mass = slower, heavier. The interplay between these three values is what gives each animation its character.</p>`},
      {type:"text",html:`<p>Here's what the code looks like in <a class="note-link" href="https://www.framer.com/motion/" target="_blank">Framer Motion</a>:</p>`},
      {type:"code",html:`<span class="cm">// Spring with personality</span>\n<span class="kw">const</span> transition = {\n  type: <span class="str">"spring"</span>,\n  stiffness: <span class="num">300</span>,\n  damping: <span class="num">24</span>,\n  mass: <span class="num">0.8</span>\n}`},
      {type:"text",html:`<p>Compare that to a CSS easing curve. The spring feels alive. The easing feels programmed. Users can't tell you why, but they feel the difference immediately.</p>`},
      {type:"demo",id:"easing-vs-spring"},
      {type:"text",html:`<p>The top ball uses a CSS <span class="term" data-term="bezier">cubic-bezier</span> ease-out. The bottom uses a spring. Watch how the spring overshoots slightly then settles. That tiny overshoot is what makes it feel physical.</p>`},
      {type:"image",gradient:"linear-gradient(135deg,#667eea 0%,#764ba2 100%)",caption:"Spring curves visualized: stiffness vs damping matrix"},
      {type:"text",html:`<p>My workflow: I start with stiffness <span class="term" data-term="stiffness">300</span> and damping <span class="term" data-term="damping">20</span> as defaults. Then I adjust by feel in the browser. No amount of Figma prototyping replaces tuning a spring in real time at 60fps.</p>`},
      {type:"callout",html:`Rule of thumb: if it moves, spring it. If it appears, fade it. If it resizes, use layout animation. Never combine all three.`},
    ]
  },
  {title:"Top-tier prompting is more than words",date:"Yesterday",sortDate:20260210,tags:["workflow","ai"],preview:"The gap between what you imagine and what you build is closing fast...",body:`<p>The gap between what you imagine and what you build is closing fast. But closing isn't closed. The last mile is still taste, specificity, and knowing what to ask for.</p><p>Most people prompt like they're filling out a form. The best prompts read like creative briefs: they carry intent, constraints, references, and a clear picture of what done looks like.</p><p>I've started treating every prompt like a design spec. Context first, then the ask, then the constraints. The output quality difference is night and day.</p><p>The skill isn't writing code or even understanding code. It's being able to articulate what you want with enough precision that the machine can close the gap. That's a design skill.</p>`},
  {title:"Don't be shy, use these libraries",date:"Feb 8",sortDate:20260208,tags:["tools","code"],preview:"A curated list of the tools and resources I actually use daily...",body:`<p>A curated list of the tools and resources I actually use daily. Not the ones I bookmarked and forgot about. The ones that are open in my tabs right now.</p><p>Framer Motion for React animations. Not because it's the best, but because the API matches how I think about motion. Spring physics out of the box, layout animations that just work.</p><p>Recharts for data viz. Simple, composable, doesn't try to be D3. For dashboards and product UIs it's exactly enough.</p><p>Tailwind for spacing and layout. I know the debate. I don't care. It's fast, it's consistent, and it maps directly to the spacing system I use in Figma.</p><p>Claude for everything else. Not as a replacement for thinking, but as an accelerant. First drafts, refactoring, exploring approaches I wouldn't try manually because of time.</p>`},
  {title:"How I vibe-code complex animations",date:"Feb 6",sortDate:20260206,tags:["animation","workflow"],preview:"Physics-based springs, momentum curves, and making things feel alive...",body:`<p>Physics-based springs, momentum curves, and making things feel alive. This is the part of design engineering that gets me out of bed.</p><p>The trick isn't learning animation libraries. It's developing a feel for what 'right' looks like at 60fps. You can't spec that in Figma. You have to feel it in the browser.</p><p>My process: start with the interaction design in my head. Not a mockup, a feeling. How should this feel when you drag it? What happens when you let go? Then I translate that feeling into spring parameters.</p><p>Stiffness controls the snap. Damping controls the settle. Mass controls the weight. Once you internalize those three, you stop copying and start designing motion.</p>`},
  {title:"All Claude skills in my MD file",date:"Feb 2",sortDate:20260202,tags:["ai","workflow"],preview:"The skill files I've built up over months of working with Claude...",body:`<p>The skill files I've built up over months of working with Claude. Not prompts, not templates. Skill files: structured instructions that shape how Claude approaches specific tasks.</p><p>I have one for React components. One for animations. One for design system tokens. Each one encodes the patterns and preferences I'd otherwise repeat in every conversation.</p><p>The key insight: Claude gets dramatically better when you give it your design principles, not just your requirements. Tell it you prefer spring physics over easing curves. Tell it you want 4px spacing grids. Tell it your color system.</p><p>It's like onboarding a junior designer, except the onboarding doc is the entire relationship.</p>`},
  {title:"Fewer tools, tighter workflow",date:"Jan 28",sortDate:20260128,tags:["workflow","tools"],preview:"I used to juggle 15 apps. Now it's Figma, Claude, and a terminal...",body:`<p>I used to juggle 15 apps. Now it's Figma, Claude, and a terminal. That's it. Everything else is noise.</p><p>Figma for thinking. Not wireframing, not pixel-pushing. Thinking. I use it like a whiteboard that happens to produce production-ready specs.</p><p>Claude for building. Not for generating code I don't understand. For pair-programming with something that has infinite patience and zero ego.</p><p>Terminal for shipping. Git, npm, deploy. The fewer steps between idea and live URL, the more ideas you actually test.</p><p>Every tool you add is a context switch. Every context switch is a tiny tax on creative momentum. Protect your momentum like your life depends on it.</p>`},
  {title:"The design-engineering gap",date:"Jan 20",sortDate:20260120,tags:["career","design"],preview:"The tension between design and code isn't a problem to solve...",body:`<p>The tension between design and code isn't a problem to solve. It's a creative space to work in.</p><p>Designers who code make different design decisions. Not better, not worse. Different. They think in terms of state, transitions, and edge cases because they've felt the cost of ignoring them.</p><p>Engineers who design make different architecture decisions. They leave room for delight because they understand that the user experience is the product, not the system behind it.</p><p>The gap isn't shrinking. The people who can work in both spaces are just getting more valuable. That's where I'm trying to be.</p>`},
];

const GLOSSARY={
  "spring-physics":{title:"Spring Physics",desc:"Animation model based on Hooke's law. Uses stiffness, damping, and mass to create natural-feeling motion instead of fixed-duration easing curves."},
  "stiffness":{title:"Stiffness",desc:"How tight the spring is. Higher values = snappier, more aggressive motion. Typical range: 100\u2013500."},
  "damping":{title:"Damping",desc:"How much the spring resists oscillation. Higher values = less bounce, faster settle. Typical range: 10\u201340."},
  "mass":{title:"Mass",desc:"The virtual weight of the animated object. Higher values = slower, more lethargic movement. Usually 0.5\u20132."},
  "bezier":{title:"Cubic Bezier",desc:"A CSS timing function that defines acceleration using two control points. Fixed duration, no overshoot. Feels mechanical compared to springs."},
};

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
      const pre=document.createElement('div');pre.className='note-code';pre.innerHTML=block.html;container.appendChild(pre);
    }else if(block.type==='image'){
      const wrap=document.createElement('div');wrap.className='note-img';
      const placeholder=document.createElement('div');
      placeholder.style.cssText=`width:100%;height:160px;background:${block.gradient};border-radius:10px;`;
      wrap.appendChild(placeholder);container.appendChild(wrap);
      if(block.caption){const cap=document.createElement('div');cap.className='note-img-caption';cap.textContent=block.caption;container.appendChild(cap);}
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
  if(!_actx)_actx=new _AC();
  const src=_actx.createBufferSource();
  src.buffer=_mouseClickBuf;
  const vol=_actx.createGain();
  vol.gain.value=0.18;
  src.connect(vol);vol.connect(_actx.destination);
  src.start();
}

renderList();

// ═══ MYMIND (Interactive bookmark grid) ═══
const MMIND_CARDS=[
  {
    type:'image', img:'/mymind/framer-layout.png', height:110,
    caption:'Everything about Framer Motion layout animations',
    title:'Framer Motion Layout Animations',
    source:'blog.maximeheckel.com', url:'https://blog.maximeheckel.com/posts/framer-motion-layout-animations/',
    tldr:'Deep dive into layout animations with Framer Motion \u2014 shared layouts, layout groups, and practical patterns.',
    tags:['Animation'], category:'animation', date:'2 days ago'
  },
  {
    type:'image', img:'/mymind/ramp-ui.png', height:100,
    caption:'Bootstrapping a UI component library',
    title:'Bootstrapping a UI Component Library',
    source:'builders.ramp.com', url:'https://builders.ramp.com/post/bootstrapping-a-ui-component-library',
    tldr:'How Ramp built their component library from scratch \u2014 architecture, tokens, and scaling decisions.',
    tags:['UI Design','Tools'], category:'ui design', date:'3 days ago'
  },
  {
    type:'image', img:'/mymind/animate-presence.png', height:100,
    caption:'Mastering Animate Presence',
    title:'Mastering AnimatePresence',
    source:'userinterface.wiki', url:'https://www.userinterface.wiki/mastering-animate-presence',
    tldr:'Exit animations done right \u2014 AnimatePresence patterns for modals, toasts, and page transitions.',
    tags:['Animation'], category:'animation', date:'5 days ago'
  },
  {
    type:'image', img:'/mymind/satisfying-checkbox.gif', height:120,
    caption:'The World\u2019s Most Satisfying Checkbox',
    title:'The Most Satisfying Checkbox',
    source:'notbor.ing', url:'https://notbor.ing/words/the-most-satisfying-checkbox',
    tldr:'The art of game feel applied to product design \u2014 making a checkbox feel incredible.',
    tags:['UI Design','Inspiration'], category:'ui design', date:'1 week ago'
  },
  {
    type:'image', img:'/mymind/aiverse.png', height:100,
    caption:'Using AI as a Design Engineer',
    title:'Aiverse \u2014 AI UX Interactions',
    source:'aiverse.design', url:'https://www.aiverse.design/browse',
    tldr:'Playbook for designing AI products \u2014 browsable interaction examples from real products.',
    tags:['Tools','UI Design'], category:'tools', date:'1 week ago'
  },
  {
    type:'image', img:'/mymind/skills-sh.jpg', height:90,
    caption:'The Agent Skills Directory',
    title:'Skills.sh \u2014 Agent Skills',
    source:'skills.sh', url:'https://skills.sh/',
    tldr:'Directory of agent skills for Claude Code and other AI coding tools.',
    tags:['Tools'], category:'tools', date:'10 days ago'
  },
  {
    type:'image', img:'/mymind/animations-dev.png', height:105,
    caption:'Animations on the Web',
    title:'Animations.dev',
    source:'animations.dev', url:'https://animations.dev/',
    tldr:'Interactive learning experience for web animation theory and practice.',
    tags:['Animation'], category:'animation', date:'2 weeks ago'
  },
  {
    type:'note', text:'Fonts to add : Epilouge',
    title:'Font Bookmark',
    tldr:'Epilogue \u2014 a variable geometric sans from Etcetera Type Company.',
    tags:['UI Design','Notes'], category:'ui design', date:'2 weeks ago'
  },
  {
    type:'image', img:'/mymind/animejs-modifier.png', height:80,
    caption:'modifier',
    title:'Anime.js Modifier',
    source:'animejs.com', url:'https://animejs.com/documentation/animatable/animatable-settings/modifier',
    tldr:'Animatable settings modifier docs \u2014 transform animation values on the fly.',
    tags:['Animation','Tools'], category:'animation', date:'2 weeks ago'
  },
  {
    type:'image', img:'/mymind/bestdesignsonx.png', height:95,
    caption:'Best Designs on X',
    title:'Best Designs on X',
    source:'bestdesignsonx.com', url:'https://bestdesignsonx.com/raul_dronca/status/2009950274753122483',
    tldr:'Curated collection of the best design work shared on X/Twitter.',
    tags:['Inspiration','UI Design'], category:'inspiration', date:'3 weeks ago'
  },
  {
    type:'image', img:'/mymind/spectrums.png', height:110,
    caption:'Spectrums',
    title:'Spectrums \u2014 Free Vector Shapes',
    source:'spectrums.framer.website', url:'https://spectrums.framer.website/',
    tldr:'Free vector shapes and gradients for creative projects.',
    tags:['Tools','Inspiration'], category:'tools', date:'3 weeks ago'
  },
  {
    type:'image', img:'/mymind/devouring-details.png', height:100,
    caption:'Devouring Details',
    title:'Devouring Details',
    source:'devouringdetails.com', url:'https://devouringdetails.com',
    tldr:'An interactive reference manual for interaction-curious designers.',
    tags:['UI Design','Inspiration'], category:'ui design', date:'3 weeks ago'
  },
  {
    type:'note', text:'List of tings i gotta do\n- start writing one article a month\n- re-do portfolio / simpler / to the point\n- create detailed product screens 1 / day\n- add to archives / design inspo everyday\n- make few opensource projects like libraries etc 1 per month\n- make interactable small tools 1 per month\n- add a fun stuff page where i showcase all prototypes i vibe coded with claude under me+ claude section',
    title:'Goals & To-Do List',
    tldr:'Personal creative goals \u2014 writing, portfolio, open source, tools.',
    tags:['Notes'], category:'notes', date:'1 month ago'
  },
  {
    type:'image', color:'linear-gradient(145deg,#1a1a1a,#333)', height:85,
    caption:'Matt Rothenberg',
    title:'Matt Rothenberg \u2014 Portfolio',
    source:'mattrothenberg.com', url:'https://mattrothenberg.com/',
    tldr:'Design engineer portfolio \u2014 clean, minimal, thoughtful craft.',
    tags:['Inspiration'], category:'inspiration', date:'1 month ago'
  },
  {
    type:'image', img:'/mymind/generative-logo.jpg', height:115,
    caption:'Generative Logo Motion Graphics',
    title:'Generative Logo Motion \u2014 BP&O',
    source:'bpando.org', url:'https://bpando.org/2023/01/26/generative-logo-motion-graphics-branding/',
    tldr:'Generative 3D logo and motion graphics for Forskningsr\u00e5det by Anti.',
    tags:['Inspiration','Animation'], category:'inspiration', date:'1 month ago'
  },
  {
    type:'image', img:'/mymind/interfacecraft.png', height:100,
    caption:'Interface Craft',
    title:'Interface Craft',
    source:'interfacecraft.dev', url:'https://interfacecraft.dev',
    tldr:'A working library for those committed to designing with uncommon care.',
    tags:['UI Design','Inspiration'], category:'ui design', date:'5 weeks ago'
  },
  {
    type:'image', img:'/mymind/elwyn.jpg', height:90,
    caption:'ben elwyn | creative technologist',
    title:'Ben Elwyn \u2014 Portfolio',
    source:'elwyn.co', url:'https://www.elwyn.co/',
    tldr:'Freelance creative technologist portfolio.',
    tags:['Inspiration'], category:'inspiration', date:'5 weeks ago'
  },
  {
    type:'image', img:'/mymind/newdays.jpg', height:85,
    caption:'STUDIO NEWDAYS',
    title:'Studio Newdays',
    source:'newdays.work', url:'https://newdays.work/',
    tldr:'Design studio with thoughtful, minimal web presence.',
    tags:['Inspiration'], category:'inspiration', date:'6 weeks ago'
  },
  {
    type:'note', text:'Vibe code / skills\n\nClaude needs that readme file for all projects with this prompt: Read the README on this repository. Explore the code base to learn about best practices and patterns for using Claude Code effectively. Take what you learn and bring it back into the context of our codebase.',
    title:'Claude Code Setup Notes',
    tldr:'Prompt template for bootstrapping Claude Code skills in new projects.',
    tags:['Tools','Notes'], category:'notes', date:'6 weeks ago'
  },
  {
    type:'image', img:'/mymind/curated-supply.png', height:80,
    caption:'Curated Supply',
    title:'Curated Supply',
    source:'curated.supply', url:'https://www.curated.supply/',
    tldr:'Curated directory of design resources and tools.',
    tags:['Tools','Inspiration'], category:'inspiration', date:'2 months ago'
  },
  {
    type:'image', img:'/mymind/factory.png', height:95,
    caption:'Factory \u2014 Agent-Native Dev',
    title:'Factory.ai',
    source:'factory.ai', url:'https://factory.ai/',
    tldr:'Agent-native software development \u2014 AI coding agents for startups and enterprises.',
    tags:['Tools'], category:'tools', date:'2 months ago'
  },
  {
    type:'link', icon:'\u25B6', linkTitle:'Remotion', linkDesc:'React-based MP4 production',
    title:'Remotion \u2014 Programmatic Video',
    source:'remotion.dev', url:'https://www.remotion.dev/',
    tldr:'Make videos programmatically with React components.',
    tags:['Tools'], category:'tools', date:'2 months ago'
  },
  {
    type:'image', img:'/mymind/reality-transurfing-ch.png', height:100,
    caption:'Chapter Summaries: Reality Transurfin\u2026',
    title:'Reality Transurfing \u2014 Chapter Summaries',
    source:'julianpaul.me', url:'https://julianpaul.me/blog/chapter-summaries-reality-transurfing',
    tldr:'Detailed chapter-by-chapter breakdown of Reality Transurfing Steps I-V.',
    tags:['Notes','Inspiration'], category:'notes', date:'2 months ago'
  }
];

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

  if(spaceBelow>=popHeight||spaceBelow>=spaceAbove){
    mmindPopWrap.style.top=(cardBottom+gap)+'px';
    mmindPopover.style.setProperty('--pop-dir','8px');
    mmindPopover.style.transformOrigin=mmindPopover.style.transformOrigin.replace(/^bottom/,'top');
  }else{
    mmindPopWrap.style.top=(cardTop-gap-popHeight)+'px';
    mmindPopover.style.setProperty('--pop-dir','-8px');
    mmindPopover.style.transformOrigin=mmindPopover.style.transformOrigin.replace(/^top/,'bottom');
  }

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
function aboutClickSound(type){
  if(!_soundOn||prefersReducedMotion)return;
  if(!aboutAudioCtx)aboutAudioCtx=new AboutAudioCtx();
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
if(aboutPrimaryBtn)aboutPrimaryBtn.addEventListener('mousedown',()=>aboutClickSound('primary'));
document.querySelectorAll('.about-cta-strip .about-cta').forEach(btn=>{
  btn.addEventListener('mousedown',()=>aboutClickSound('secondary'));
});

// Stack cards shuffle sound — synced to 250ms transition
let stackGain=null,stackSrc=null;
function stackShuffleStart(){
  if(!_soundOn||prefersReducedMotion)return;
  if(!aboutAudioCtx)aboutAudioCtx=new AboutAudioCtx();
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
}

// Location toggle
const locToggle=document.getElementById('locationToggle');
const locText=document.getElementById('locationText');
if(locToggle){
  function toggleLocation(){
    locToggle.classList.toggle('on');
    const isOn=locToggle.classList.contains('on');
    locToggle.setAttribute('aria-checked',isOn);
    locText.textContent=isOn?'Remote':'Travel around';
    aboutClickSound('secondary');
  }
  locToggle.addEventListener('mousedown',toggleLocation);
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
