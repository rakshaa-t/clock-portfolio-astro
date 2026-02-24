// ═══ AUDIO ENGINE ═══
// Standalone audio module — provides shared AudioContext for all UI sounds.
// Other modules use window.__clockAudio.ensure() to get the context.

const _AC=window.AudioContext||window.webkitAudioContext;
let _actx=null,_soundOn=true;

// Mobile: AudioContext starts suspended — resume on every user gesture
function _ensureAudioCtx(){
  if(!_actx)_actx=new _AC();
  if(_actx.state==='suspended')_actx.resume();
  return _actx;
}
let _audioUnlocked=false;
function _unlockAudio(){
  _ensureAudioCtx();
  if(_audioUnlocked)return;
  _audioUnlocked=true;
  // Play silent buffer to fully unlock audio on iOS
  const b=_actx.createBuffer(1,1,_actx.sampleRate);
  const s=_actx.createBufferSource();s.buffer=b;
  s.connect(_actx.destination);s.start(0);
}
document.addEventListener('touchstart',_unlockAudio,{passive:true});
document.addEventListener('touchend',_unlockAudio,{passive:true});
document.addEventListener('click',_unlockAudio);

// Rotary knob — brass watch crown toggle sound
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

// Sound knob toggle — re-binds on every init (ViewTransitions safe)
let _tipTimer=null;

// Lazy-create toast element — child of knob wrap for origin-aware positioning
let _toast=null;
function _getToast(){
  if(_toast) return _toast;
  _toast=document.createElement('div');
  _toast.className='sound-toast';
  const wrap=document.querySelector('.sound-knob-wrap');
  if(wrap) wrap.appendChild(_toast);
  else document.body.appendChild(_toast);
  return _toast;
}

function _initAudio(){
  const knob=document.querySelector('.sound-knob-mirror');

  function showToast(){
    const t=_getToast();
    // Snap closed instantly (kill transition), then replay origin animation
    t.style.transition='none';
    t.classList.remove('show');
    t.offsetHeight; // flush the instant hide
    t.style.transition='';
    t.textContent=_soundOn?'Sound on':'Sound off';
    t.classList.add('show');
    clearTimeout(_tipTimer);
    _tipTimer=setTimeout(()=>t.classList.remove('show'),1500);
  }

  function toggle(){
    _soundOn=!_soundOn;
    if(knob) knob.classList.toggle('off',!_soundOn);
    showToast();
    knobClick();
  }

  // Sync visual state with current _soundOn
  if(knob) knob.classList.toggle('off',!_soundOn);
  if(knob) knob.addEventListener('click',toggle);
}

// Expose for data-astro-rerun inline script (sole init path)
window.__initAudio=_initAudio;

// Magic Mouse click sound — lazy-loaded MP3, decoded on first play
let _mouseClickBuf=null,_mouseClickRaw=null,_decoding=null;
fetch('/magic-mouse-click.mp3')
  .then(r=>r.arrayBuffer())
  .then(ab=>{_mouseClickRaw=ab;})
  .catch(()=>{});
async function noteClick(){
  if(!_soundOn)return;
  // Decode on first play (fast — small MP3), cache for subsequent clicks
  if(!_mouseClickBuf){
    if(_decoding){_mouseClickBuf=await _decoding;}
    else if(_mouseClickRaw){
      const ctx=_ensureAudioCtx();
      if(!ctx)return;
      _decoding=ctx.decodeAudioData(_mouseClickRaw.slice(0));
      _mouseClickBuf=await _decoding;
      _mouseClickRaw=null;_decoding=null;
    }else{return;}
  }
  const ctx=_ensureAudioCtx();
  if(!ctx)return;
  const src=ctx.createBufferSource();
  src.buffer=_mouseClickBuf;
  const vol=ctx.createGain();
  vol.gain.value=0.18;
  src.connect(vol);vol.connect(ctx.destination);
  src.start();
}

// Expose audio context for other modules (about-section, books, etc.)
window.__clockAudio={
  ensure(){_ensureAudioCtx();return _actx;},
  get ctx(){return _actx;},
  get soundOn(){return _soundOn;},
  noteClick,
};
