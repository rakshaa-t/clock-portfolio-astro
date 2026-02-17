// ═══ DATA ═══
const SECTIONS=[
  {name:'About',desc:'Who I am & how to reach me',angle:0},
  {name:'Work',desc:'Selected projects & case studies',angle:90},
  {name:'Notes',desc:'Articles & reflections',angle:180},
  {name:'Mymind',desc:'Saves & inspiration',angle:270},
];
const THUMB_COLORS=[
  ['#E8E4E0','#E8E4E0','#E8E4E0','#E8E4E0'],
  ['#A699D4','#9488C8','#B8ADDC','#8278B8'],
  ['#F2D98B','#E8CC7A','#F5E0A0','#EDD590'],
  null,
];
const THUMB_IMAGES=[
  null,
  ['/projects/pet-tickle.jpg','/projects/ova-app.jpg','/projects/greex-defi.jpg','/projects/indianoil.jpg'],
  null,
  ['/mymind/framer-layout.png','/mymind/satisfying-checkbox.gif','/mymind/generative-logo.jpg','/mymind/devouring-details.png'],
];
const THUMB_SVGS=[
  [
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  ],
  null,null,null,
];
const PROJECTS=[
  [{title:'Twitter / X',tags:['Social'],link:'https://x.com/rakshaa_t',desc:'Design insights and vibe coding process.',slides:['#A080BC','#9070AC','#80609C']},{title:'GitHub',tags:['Code'],link:'https://github.com/rakshaa-t',desc:'Open source components and experiments.',slides:['#C4A4D8','#B494C8','#A484B8']},{title:'LinkedIn',tags:['Connect'],link:'https://www.linkedin.com/in/rakshatated/',desc:'Connect with me.',slides:['#B090C8','#A080B8','#9070A8']},{title:'Send a Message',tags:['Email'],link:'mailto:hey@raksha.design',desc:'Let\'s chat about design, code, or anything creative.',slides:['#9470B0','#8460A0','#745090']}],
  [{title:'Tickle',tags:['Mobile','MVP','2025'],link:'#',desc:'A self care pet app. Tickle your pet daily for mood care without calling it that.',slides:['#A699D4','#9488C8','#B8ADDC','#8278B8'],_puzzleIdx:0},{title:'Ova App',tags:['Health','0-1','Figma'],link:'#',desc:'A privacy-first period tracking app with a companion character called Ova.',slides:['#6C7EB8','#5C6EA8','#4C5E98'],_puzzleIdx:1},{title:'Greex DeFi',tags:['Fintech','Trading','2024'],link:'#',desc:'Decentralized options and futures trading. Strategy-based trading made accessible.',slides:['#9DB8D0','#8DA8C0','#7D98B0'],_puzzleIdx:2},{title:'DealDoc',tags:['SaaS','Dashboard','2025'],link:'#',desc:'A workspace for investment teams. Calm, navigable, sharp.',slides:['#8BA8C4','#7B98B4','#6B88A4'],_puzzleIdx:4}],
  [{title:'Process Breakdown: Building this portfolio',tags:['design','process','portfolio'],link:'#',desc:'How a random Tuesday, a clock app, and an obsessive build process turned into this website...',slides:['#7E8EC8','#6E7EB8','#5E6EA8']},{title:'Code and canvas as methods of communication',tags:['design','code','thinking'],link:'#',desc:'All design is communication. Code just gave it more dimensions...',slides:['#6C7EB8','#5C6EA8','#4C5E98']},{title:'All Claude skills in my MD file',tags:['ai','workflow','tools'],link:'#',desc:'41 skills, 4 MCP servers, and 3 custom skills I\'ve built up working with Claude Code...',slides:['#90A0D4','#8090C4','#7080B4']},{title:'Coming Soon',tags:[],link:'#',desc:'New note coming soon.',slides:['#A4B2DC','#94A2CC','#8492BC']}],
  [{title:'Animation References',tags:['Bookmark'],link:'#',desc:'Curated animation patterns from iOS, Material, and indie apps.',slides:['#8BA8C4','#7B98B4','#6B88A4']},{title:'Design System Resources',tags:['Bookmark'],link:'#',desc:'Tokens and implementation guides from top design systems.',slides:['#7998B8','#6988A8','#597898']},{title:'Reading List 2024',tags:['Books'],link:'#',desc:'Notes from design engineering books, essays, and technical reads.',slides:['#9DB8D0','#8DA8C0','#7D98B0']},{title:'Creative Process Notes',tags:['Personal'],link:'#',desc:'Documenting flow states, creative rituals, and what makes the best work happen.',slides:['#6B88A8','#5B7898','#4B6888']}],
];

// Flat project data for puzzle grid cards
const PUZZLE_PROJECTS=[
  {title:'Tickle',tags:['Mobile','MVP','2025'],link:'#',desc:['Max came to me with a quirky ask: "Can you design a pet you can tickle every day?" A self care pet app where the main way you take care of the pet is by tickling it everyday. When you tickle it, it laughs uncontrollably and makes you feel great. Mood boosting and anxiety/stress relieving. The MVP was really focused on that daily tickling, character interaction and streak building.','We didn\'t have answers to a lot of things honestly. Why would someone want to tickle a pet every day? What role could this play in their life? How will this app make an impact?','Before sketches I dove head-first into product strategy, user psychology, and the crowded self-care market. Looked at Finch, Ahead and Honestly. What stood out across all of them: emotional bonding, personality-first UX, gamified mood tracking, playful onboarding, fun facts, surprise moments.','From that research and some creative chaos I developed 3 distinct product paths.\n\nFirst one: Tickle as an "emotional pit stop". A place to recharge without feeling guilty about not being productive. Second: your rebellious little escape. Not a mood tracker or self-help tool but your "happy chaos companion", a place to hit pause on life and just let loose. Third: a self-love app disguised as a cute emotional companion. Users practice being gentle with themselves by caring for the pet\'s moods and well-being.\n\nMax and his team went ahead with the first direction.','To make a pet you tickle daily matter I didn\'t just map screens. I mapped meaning. This is Tickle\'s Product Experience Architecture. A behavior-first, emotion-led journey from curiosity to connection. Each interaction carefully placed to spark delight, form habit, and build an emotional loop without ever feeling like self-improvement.','Onboarding wasn\'t about filling forms. We used curiosity, suspense, and micro-rewards to pull users in and get them attached fast. Choose your pet with a color picker. Each pet has a different giggle and personality. Name your pet for a personalised experience. From picking a pet to hearing its first giggle the goal was emotional buy-in early. Every screen is a step toward attachment, not just progression.','The whole experience is built around one simple action: tickle your pet. That tickle becomes a ritual. Something light, easy, and weirdly satisfying. It\'s mood care without calling it that.\n\nEverytime you log in your pet is doing something. Tickle them in the middle of the act to surprise them and hear them giggle. Practice daily rituals with your pet for a quick mood boost.','Tickle\'s Wisdom is my favourite part honestly. When users share how they feel, Tickle replies with nonsense advice that somehow makes sense. It\'s light, it\'s weird, and it\'s built to be shared. Perfect for screenshots, inside jokes, or TikTok bait.\n\nLow-friction mood input that feeds emotional logic to the pet. Emotional UX disguised as a laugh. Builds reciprocal bonding. Feels like progress without pressure.','Every screen was handed off with clear logic, interaction intent, and emotional context so devs didn\'t just build what they saw but why it mattered. From button behavior to mood-based animations, nothing was left to guesswork. The goal was to make implementation smooth, scalable, and just as emotionally sharp as the design.'],slides:['#A699D4','#9488C8','#B8ADDC','#8278B8','#A699D4','#9488C8','#B8ADDC','#8278B8','#A699D4']},
  {title:'Ova App',tags:['Health','0-1','Figma','Rive'],link:'#',desc:['A privacy-first period tracking app for women of all ages. The core idea was a companion character called Ova who guides users through their cycles, gives them insights and predicts upcoming symptoms and moods. Not just another tracker but a warm buddy throughout the reproductive journey. I handled product strategy, vision, UX and UI design.','Hannah came to me clear about what she wanted: a privacy-first, teenage friendly period tracking app. Her frustration came from competitors that make period tracking explicit and unfriendly for younger users and also share their data. She has a few consumer apps on Base and wanted to bring this under her parent company Cryptiq. I connected with her vision immediately and we started the same day.','I dug into the competitor landscape. Looked at Flo and others. A few things became clear quickly. We needed something that felt less analytical and more warm. We needed an educational layer because not every woman knows what luteal phase or ovulation is. Users had to know their data is encrypted. And a companion resonated the most because that seemed slightly missing from the market. AI companions are on a rise and it made sense to hop onto that wave.','Explored two design directions. Digital Confection: bright, colorful, approachable, sweet, new school, feminine. Fun, slightly gamified, light hearted. Not just cycles but symptoms, cravings, the whole picture. This would align with the younger demographic.\n\nWarm Constructivism: warm, grown up, sophisticated, subtle, grounded. Bold and expressive, mature but full of energy. Tactile, confident, a little sensual. The palette pulls from natural tones like clay, skin and peach.','Digital Confection won. The idea that we wanted to cater to a bigger demographic and not just grown ups steered that decision.\n\nFor the companion we wanted something not too complicated. Something cute and relatable. The finalized characters were based off the resemblance of an egg (OVA) which is the main biological element. Minimal, youthful and curious. During onboarding users pick their Ova, give it a unique color, name and character. That personalisation was important for emotional connection.','The Oracle dashboard shows current cycle status, lets users log symptoms and periods which helps predict future cycles. Ova Chat is a companion you can talk to for personalized recommendations on the paid plan, with voice enabled chat.\n\nOnboarding asks basic questions about hormonal health, birth control and goals to align the app to specific needs. Beta releases on Base first, then iOS and Android after early feedback.'],slides:['#6C7EB8','#5C6EA8','#4C5E98','#5C6EA8','#6C7EB8','#4C5E98']},
  {title:'Greex DeFi',tags:['Fintech','Trading','2024'],link:'#',desc:['Greex was a decentralized options and futures trading platform. The idea was to make strategy-based trading more accessible. Users could apply predefined strategies, understand risk-reward visually, and execute trades across web and mobile. I led the complete product design for both platforms, from wireframing and UX architecture to polished UI.','The hardest part was designing for a space I had zero experience in. Options and futures trading has a steep learning curve even for users, let alone designers. So before I touched any UX I spent time understanding trading logic, strategies, risk curves and market mechanics. That groundwork changed everything about how I approached the screens.','The UX flow I landed on let users browse and apply prebuilt trading strategies, see the strategy logic and risk profile visually, place trades through a simplified execution UI, and track everything in real time through a portfolio dashboard. The whole thing had to feel instant because traders don\'t wait.','The strategic decision that made this work was educating users while letting them act. The flow didn\'t just look clean, it actively supported decision-making. Every screen was designed to remove hesitation and guide action.\n\nThe platform was designed and tested with strong feedback during early demos. The company shut down due to investor issues but the product foundation remains a complete deep-dive into a complex domain translated into a clean experience. One of my proudest projects honestly.'],slides:['#9DB8D0','#8DA8C0','#7D98B0','#8DA8C0']},
  {title:'IndianOil Dashboard',tags:['Dashboard','Enterprise'],link:'#',desc:'Dashboard design for IndianOil.',slides:['#7E8EC8','#6E7EB8','#5E6EA8']},
  {title:'DealDoc',tags:['SaaS','Dashboard','2025'],link:'#',desc:['DealDoc is a workspace for investment teams. The problem was straightforward: too many clicks, too many tabs, no idea what\'s going on at a glance. My job was to take a messy multi-source process and turn it into something that feels calm, navigable and sharp for people juggling around ten deals at once.','The redesigned dashboard surfaces active deals, ongoing tasks, recent changes and AI suggestions all in one view. Built an AI-powered smart search for quickly finding anything across deals. The deal overview page was redesigned with a visual hierarchy that actually makes sense when you\'re scanning fast.','On the system side I built components for deal notes, updates, tasks, document trails and team mentions. The interface had to respect mental load. No visual clutter, no over-design. Everything scalable across the different functional areas the teams work in.','Delivered comprehensive specs covering states, empty flows, placeholder logic, permissions, microcopy and layout rules for handoff. Both light and dark theme versions. The kind of documentation where devs don\'t have to come back and ask what happens when something is empty or who can see what.'],slides:['#8BA8C4','#7B98B4','#6B88A4','#7B98B4']},
  {title:'ADiagnosis',tags:['Medical','AI'],link:'#',desc:'Medical diagnosis application.',slides:['#B090C8','#A080B8','#9070A8']},
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
    title:"Process Breakdown: Building this portfolio",
    date:"Feb 16, 2026",sortDate:20260216,
    tags:["design","process","portfolio"],
    preview:"How a random Tuesday, a clock app, and an obsessive build process turned into this website...",
    rich:true,
    body:[
      {type:"text",html:`<p>The whole thing started with me looking at the iPhone clock app on a random Tuesday. Beautiful interface. I'd never seen a webpage with circular navigation like a clock. So naturally I had to fiddle with the idea.</p>`},
      {type:"text",html:`<p>The initial idea was actually the entire webpage as a clock component. Rotate through sections, everything lives inside the clock face. Looked cool but the UX was genuinely bad. So the clock became a preview and navigation system instead. You can hop between sections or glance at primary content in each category right from the clock face.</p>`},
      {type:"image",src:"/article/clock-overview.png",caption:"The clock navigation system"},
      {type:"image",src:"/article/work-modal.jpg",caption:"Each section is its own interactable object"},
      {type:"text",html:`<p>Once the clock was the muse, the next step was looking at familiar objects. Kindle, Notes app, <a class="note-link" href="https://mymind.com" target="_blank">Mymind</a>. These products are already widely used. People more or less know their UX. No need to reinvent the wheel. So they're built into the portfolio as they are, or as close as possible. The navigation is rotation but the experience feels linear.</p>`},
      {type:"image",src:"/article/notes-list.png",caption:"The Notes app"},
      {type:"image",src:"/article/mymind-masonry.jpg",caption:"The Mymind board"},
      {type:"text",html:`<p><strong>The facets</strong></p>`},
      {type:"text",html:`<p><a class="note-link" href="https://x.com/joshpuckett?s=20" target="_blank">Josh Puckett</a> has this thing he talks about famously which is uncommon care and his facets of design. Keeping that as integral part of my design I drafted my facets alongside my design explorations:</p>`},
      {type:"text",html:`<p><em>Discoverability</em> / Users can discover more about me but only if they wish to. Want to see what I think about a book I read? Glance through my Kindle highlights. Share my notes on X? Visit my bookmarks? Copy the links to your clipboard? All available but nothing shown by default. Every section has its own navigation. Only what's necessary is on screen, and if the viewer's curiosity persists they can go deeper.</p>`},
      {type:"text",html:`<p><em>Nostalgia</em> / Each section connects to something the viewer already knows. A Kindle, a notes app, <a class="note-link" href="https://mymind.com" target="_blank">Mymind</a>. My approach might be a bit biased towards iOS users but the interfaces are easy to pick up even if not familiar. I also added sound to interactions. Rotating the clock, clicking through notes, shuffling the stack cards. Each one has its own sound. That part took me a while to get right honestly.</p>`},
      {type:"text",html:`<p><em>Compartmentalisation</em> / The website works in compartments (the clock quadrants) and each one gives its own experience. Each compartment holds the power to expand as more of my data comes. Maybe someday the Kindle becomes a full reading experience, or the bookmarks board becomes an extension of my entire <a class="note-link" href="https://mymind.com" target="_blank">Mymind</a>. That kind of expansion may never be needed but the architecture allows for it.</p>`},
      {type:"text",html:`<p><em>Continuous refinement</em> / This website is how I work. You can see in real time what I'm drawing inspiration from, what I'm reading, what I'm writing about, what designs I'm experimenting with. A living space.</p>`},
      {type:"image",src:"/article/about-section.jpg",caption:"The about section"},
      {type:"text",html:`<p><strong>The build</strong></p>`},
      {type:"text",html:`<p>All started with a rough sketch and Claude Code's CLI. Instead of building the whole website at once the build process was compartmentalised too. Clock component first. Get that working, get the rotation feeling right, get the hand snapping to sections. Once that felt solid, objectify the rest of the content one section at a time. Clock, then Kindle, then Notes, then <a class="note-link" href="https://mymind.com" target="_blank">Mymind</a>. Each one its own mini project within the project.</p>`},
      {type:"image",src:"/article/mymind-cards.jpg",caption:"Compartmentalised build: each section in isolation"},
      {type:"text",html:`<p>Quick prototypes in vanilla HTML first, to see if the interaction patterns actually worked, then Astro as the build framework. The design keeps things simple on the framework side. Static pages with JS doing the heavy lifting. Astro was the right fit.</p>`},
      {type:"text",html:`<p>Sounds use the Web Audio API. Took a bit of back and forth to find the right tone for each interaction. Everything is synthesised in real-time through code so each sound responds to exactly how you interact with it. That was a fun rabbit hole.</p>`},
      {type:"text",html:`<p>The whole stack is vanilla JS and one CSS file. These components took about three weeks and close to 100 iterations.</p>`},
      {type:"text",html:`<p>Thats all for now, cheers!</p>`},
    ]
  },
  {
    title:"Code and canvas as methods of communication",
    date:"Today",sortDate:20260217,
    tags:["design","code","thinking"],
    preview:"All design is communication. Code just gave it more dimensions...",
    body:`<p>With the canvas the permutations of what you could do with a rectangle, ellipse or polygon felt endless. All that freedom. But ultimately all design is communication. If you communicate through visual shapes long enough you naturally develop taste.</p><p>I think code is also a form of communication. It just never got seen that way because of the technical barrier around it.</p><p>Canvas restricts you to a one dimensional output. With code you see design in a multi dimensional form. I don't just see a rectangle anymore, I see a plane. A plane on which I can add sound, depth, interaction, math and physics. Code in itself is a system. I like to call design with code systems design because that's what's happening. You're building systems and articulating ideas into words at the same time. It stimulates a lot of your expressive mechanisms all at once.</p><p>This doesn't mean the canvas is going anywhere. For people who truly love it their craft will only deepen. The canvas has existed for centuries and it will continue to exist for the creatives. All the noise around AI and code doesn't change someone's method of expression. If it's the canvas, staying true to it is a moat.</p><p>Code and canvas are closer than they appear. It's not duality as an output. It's duality as an input. A child who likes math may not like chemistry. Both are sciences of their own sort. The output is a good user experience but the input depends on what the creator has leverage in. Interest, passion, love. Different inputs don't mean the outputs should differ.</p><p>I'm not here to say which is superior. Canvas will always exist. Code just gave wings to people who were multi dimensional in their thought process and ideas.</p>`
  },
  {
    title:"All Claude skills in my MD file",
    date:"Today",sortDate:20260217,
    tags:["ai","workflow","tools"],
    preview:"41 skills, 4 MCP servers, and 3 custom skills I've built up working with Claude Code...",
    rich:true,
    body:[
      {type:"text",html:`<p><strong>41 installed skills</strong></p>`},
      {type:"text",html:`<p><em>Animation & Motion (9)</em></p>`},
      {type:"text",html:`<p style="margin-top:36px"><strong>12 Principles of Animation</strong><br><span style="color:rgba(0,0,0,0.4)">Audit animations against Disney's 12 principles adapted for web</span></p>`},
      {type:"code",html:`npx ui-skills add 12-principles-of-animation`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Animate Presence</strong><br><span style="color:rgba(0,0,0,0.4)">Exit animations with Motion's AnimatePresence for modals, toasts, page transitions</span></p>`},
      {type:"code",html:`<span class="cm"># Custom skill — ~/.claude/skills/</span>`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Axiom UIKit Animation Debugging</strong><br><span style="color:rgba(0,0,0,0.4)">Diagnose CAAnimation issues, spring physics, device-specific jank</span></p>`},
      {type:"code",html:`npx skills add syntag-umd/claude-agent-skills --skill axiom-uikit-animation-debugging`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Fixing Motion Performance</strong><br><span style="color:rgba(0,0,0,0.4)">Fix repaints, layout thrashing, GPU layer issues in animations</span></p>`},
      {type:"code",html:`npx ui-skills add fixing-motion-performance`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Framer Motion Animator</strong><br><span style="color:rgba(0,0,0,0.4)">Page transitions, gestures, scroll-based animations, orchestrated sequences</span></p>`},
      {type:"code",html:`npx skills add syntag-umd/claude-agent-skills --skill framer-motion-animator`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Motion (Nuxt)</strong><br><span style="color:rgba(0,0,0,0.4)">Motion component API and composables for Vue 3 / Nuxt</span></p>`},
      {type:"code",html:`npx skills add onmax/nuxt-skills --skill motion`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Shared Layout Animations</strong><br><span style="color:rgba(0,0,0,0.4)">Seamless layout transitions using Motion's layoutId</span></p>`},
      {type:"code",html:`<span class="cm"># Custom skill — ~/.claude/skills/</span>`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Shadow Design</strong><br><span style="color:rgba(0,0,0,0.4)">Generate beautiful, realistic layered CSS shadows</span></p>`},
      {type:"code",html:`<span class="cm"># Custom skill — ~/.claude/skills/</span>`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Three.js Animation</strong><br><span style="color:rgba(0,0,0,0.4)">Keyframe, skeletal, morph target animations and procedural motion</span></p>`},
      {type:"code",html:`npx skills add cloudai-x/threejs-skills --skill threejs-animation`},
      {type:"text",html:`<p style="margin-top:28px"><em>UI/UX Design (10)</em></p>`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Baseline UI</strong><br><span style="color:rgba(0,0,0,0.4)">Opinionated UI baseline to prevent AI-generated interface slop</span></p>`},
      {type:"code",html:`npx ui-skills add baseline-ui`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Canvas Design</strong><br><span style="color:rgba(0,0,0,0.4)">Create visual art in .png and .pdf using design philosophy</span></p>`},
      {type:"code",html:`npx ui-skills add canvas-design`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Design Lab</strong><br><span style="color:rgba(0,0,0,0.4)">Generate five distinct UI variations, collect feedback, produce implementation plans</span></p>`},
      {type:"code",html:`npx ui-skills add design-lab`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Frontend Design</strong><br><span style="color:rgba(0,0,0,0.4)">Production-grade frontend interfaces with high design quality</span></p>`},
      {type:"code",html:`npx skills add anthropics/skills --skill frontend-design`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Implement Design</strong><br><span style="color:rgba(0,0,0,0.4)">Translate Figma designs into production code with 1:1 visual fidelity</span></p>`},
      {type:"code",html:`npx skills add figma/mcp-server-guide --skill implement-design`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Interaction Design</strong><br><span style="color:rgba(0,0,0,0.4)">Microinteractions, motion design, transitions, user feedback patterns</span></p>`},
      {type:"code",html:`npx ui-skills add interaction-design`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Interface Design</strong><br><span style="color:rgba(0,0,0,0.4)">Dashboards, admin panels, apps, tools, interactive products</span></p>`},
      {type:"code",html:`npx ui-skills add interface-design`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Mobile Design</strong><br><span style="color:rgba(0,0,0,0.4)">Mobile-first design for iOS and Android — touch, performance, offline</span></p>`},
      {type:"code",html:`npx skills add sickn33/antigravity-awesome-skills --skill mobile-design`},
      {type:"text",html:`<p style="margin-top:36px"><strong>UI/UX Pro Max</strong><br><span style="color:rgba(0,0,0,0.4)">50 styles, 21 palettes, 50 font pairings, 9 stacks</span></p>`},
      {type:"code",html:`npx ui-skills add ui-ux-pro-max`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Web Design Guidelines</strong><br><span style="color:rgba(0,0,0,0.4)">Review UI against Web Interface Guidelines for best practices</span></p>`},
      {type:"code",html:`npx skills add vercel-labs/agent-skills --skill web-design-guidelines`},
      {type:"text",html:`<p style="margin-top:28px"><em>Layout & Responsive (6)</em></p>`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Frontend Responsive Design Standards</strong><br><span style="color:rgba(0,0,0,0.4)">Responsive layouts with fluid containers and mobile-first breakpoints</span></p>`},
      {type:"code",html:`npx skills add am-will/codex-skills --skill "Frontend Responsive Design Standards"`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Responsive Design</strong><br><span style="color:rgba(0,0,0,0.4)">Container queries, fluid typography, CSS Grid, mobile-first strategies</span></p>`},
      {type:"code",html:`npx skills add wshobson/agents --skill responsive-design`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Responsive Web Design</strong><br><span style="color:rgba(0,0,0,0.4)">CSS Grid, Flexbox, media queries, adaptive interfaces across devices</span></p>`},
      {type:"code",html:`npx skills add aj-geddes/useful-ai-prompts --skill responsive-web-design`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Tailwind CSS</strong><br><span style="color:rgba(0,0,0,0.4)">Utility-first framework for rapid UI development with dark mode</span></p>`},
      {type:"code",html:`npx skills add bobmatnyc/claude-mpm-skills --skill tailwind-css`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Tailwind CSS Mobile First</strong><br><span style="color:rgba(0,0,0,0.4)">Mobile-first responsive patterns for Tailwind CSS v4</span></p>`},
      {type:"code",html:`npx skills add josiahsiegel/claude-plugin-marketplace --skill tailwindcss-mobile-first`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Tailwind CSS Patterns</strong><br><span style="color:rgba(0,0,0,0.4)">Layout utilities, flexbox, grid, spacing, typography, colors</span></p>`},
      {type:"code",html:`npx skills add giuseppe-trisciuoglio/developer-kit --skill tailwind-css-patterns`},
      {type:"text",html:`<p style="margin-top:28px"><em>Design Systems & Tokens (3)</em></p>`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Design Systems</strong><br><span style="color:rgba(0,0,0,0.4)">Build and scale design systems — component libraries, brand consistency</span></p>`},
      {type:"code",html:`npx skills add syntag-umd/claude-agent-skills --skill design-systems`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Design Tokens</strong><br><span style="color:rgba(0,0,0,0.4)">DTCG spec tokens — color spaces, theming, multi-platform systems</span></p>`},
      {type:"code",html:`npx skills add syntag-umd/claude-agent-skills --skill design-tokens`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Tailwind Advanced Design Systems</strong><br><span style="color:rgba(0,0,0,0.4)">Advanced design systems with design tokens and @theme configuration</span></p>`},
      {type:"code",html:`npx skills add syntag-umd/claude-agent-skills --skill tailwindcss-advanced-design-systems`},
      {type:"text",html:`<p style="margin-top:28px"><em>Accessibility & Quality (4)</em></p>`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Fixing Accessibility</strong><br><span style="color:rgba(0,0,0,0.4)">Identify and fix accessibility issues across components</span></p>`},
      {type:"code",html:`npx ui-skills add fixing-accessibility`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Fixing Metadata</strong><br><span style="color:rgba(0,0,0,0.4)">Ship correct, complete metadata for SEO and social sharing</span></p>`},
      {type:"code",html:`npx ui-skills add fixing-metadata`},
      {type:"text",html:`<p style="margin-top:36px"><strong>WCAG Audit Patterns</strong><br><span style="color:rgba(0,0,0,0.4)">WCAG 2.2 audits with automated testing and remediation guidance</span></p>`},
      {type:"code",html:`npx ui-skills add wcag-audit-patterns`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Web Performance Optimization</strong><br><span style="color:rgba(0,0,0,0.4)">Core Web Vitals, bundle size, caching strategies, runtime performance</span></p>`},
      {type:"code",html:`npx skills add sickn33/antigravity-awesome-skills --skill web-performance-optimization`},
      {type:"text",html:`<p style="margin-top:28px"><em>Code Quality & Review (4)</em></p>`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Code Reviewer</strong><br><span style="color:rgba(0,0,0,0.4)">Review code for correctness, maintainability, and project standards</span></p>`},
      {type:"code",html:`npx skills add google-gemini/gemini-cli --skill code-reviewer`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Frontend Patterns</strong><br><span style="color:rgba(0,0,0,0.4)">React, Next.js, state management, performance optimization patterns</span></p>`},
      {type:"code",html:`npx skills add sickn33/antigravity-awesome-skills --skill frontend-patterns`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Karpathy Guidelines</strong><br><span style="color:rgba(0,0,0,0.4)">Reduce common LLM coding mistakes — surgical changes, surface assumptions</span></p>`},
      {type:"code",html:`npx skills add forrestchang/andrej-karpathy-skills --skill karpathy-guidelines`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Vercel React Best Practices</strong><br><span style="color:rgba(0,0,0,0.4)">React and Next.js performance optimization from Vercel Engineering</span></p>`},
      {type:"code",html:`npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices`},
      {type:"text",html:`<p style="margin-top:28px"><em>Workflow & Planning (4)</em></p>`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Ask Questions if Underspecified</strong><br><span style="color:rgba(0,0,0,0.4)">Clarify requirements before implementing when doubts arise</span></p>`},
      {type:"code",html:`npx skills add trailofbits/skills --skill ask-questions-if-underspecified`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Executing Plans</strong><br><span style="color:rgba(0,0,0,0.4)">Execute implementation plans in separate sessions with review checkpoints</span></p>`},
      {type:"code",html:`npx skills add obra/superpowers --skill executing-plans`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Find Skills</strong><br><span style="color:rgba(0,0,0,0.4)">Discover and install new agent skills from the community</span></p>`},
      {type:"code",html:`npx skills add vercel-labs/skills --skill find-skills`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Humanizer</strong><br><span style="color:rgba(0,0,0,0.4)">Remove signs of AI-generated writing to sound more natural</span></p>`},
      {type:"code",html:`npx skills add blader/humanizer --skill humanizer`},
      {type:"text",html:`<p style="margin-top:28px"><em>Platform Specific (1)</em></p>`},
      {type:"text",html:`<p style="margin-top:36px"><strong>SwiftUI UI Patterns</strong><br><span style="color:rgba(0,0,0,0.4)">SwiftUI views, TabView architecture, component-specific patterns</span></p>`},
      {type:"code",html:`npx ui-skills add swiftui-ui-patterns`},
      {type:"text",html:`<p style="margin-top:28px"><strong>4 MCP servers</strong></p>`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Motion</strong><br><span style="color:rgba(0,0,0,0.4)">Motion.dev Studio — animation code generation</span></p>`},
      {type:"code",html:`motion`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Pencil</strong><br><span style="color:rgba(0,0,0,0.4)">.pen design files</span></p>`},
      {type:"code",html:`pencil`},
      {type:"text",html:`<p style="margin-top:36px"><strong>Figma</strong><br><span style="color:rgba(0,0,0,0.4)">Figma design integration</span></p>`},
      {type:"code",html:`figma`},
      {type:"text",html:`<p>Up-to-date library documentation</p>`},
      {type:"code",html:`context7`},
    ]
  },
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
    locText.textContent=isOn?'Remote':'Travel around';
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
