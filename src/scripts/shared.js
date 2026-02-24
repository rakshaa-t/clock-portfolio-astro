export function esc(s){return s?s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'):'';}
export const prefersReducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Custom smooth scroll ──
// Replaces browser-native `behavior:'smooth'` which uses ease-in-out
// (sluggish per Emil Kowalski). Default: ease-out cubic ≈ cubic-bezier(0.32,0.72,0,1).
// Optional ease-in-out for "return" scrolls (Show Less) — slow start for comprehension,
// fast middle, smooth landing. Per Emil: ease-in-out is correct for physical A→B motion.
// Interruptible: cancels on user wheel/touch/key.
let _scrollRaf=null;
function _easeOut(t){return 1-Math.pow(1-t,3);}
function _easeInOut(t){return t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}

export function smoothScrollTo(targetY,duration,easing){
  if(_scrollRaf){cancelAnimationFrame(_scrollRaf);_scrollRaf=null;}
  const startY=window.scrollY;
  const diff=targetY-startY;
  if(Math.abs(diff)<4) return;
  if(prefersReducedMotion){window.scrollTo(0,targetY);return;}
  const easeFn=easing==='ease-in-out'?_easeInOut:_easeOut;
  if(!duration) duration=Math.min(600,Math.max(300,Math.abs(diff)*0.5));
  const startTime=performance.now();
  let cancelled=false;
  function cancel(){cancelled=true;if(_scrollRaf){cancelAnimationFrame(_scrollRaf);_scrollRaf=null;}cleanup();}
  function cleanup(){window.removeEventListener('wheel',cancel);window.removeEventListener('touchstart',cancel);window.removeEventListener('keydown',cancel);}
  window.addEventListener('wheel',cancel,{once:true,passive:true});
  window.addEventListener('touchstart',cancel,{once:true,passive:true});
  window.addEventListener('keydown',cancel,{once:true,passive:true});
  function step(now){
    if(cancelled) return;
    const progress=Math.min((now-startTime)/duration,1);
    window.scrollTo(0,startY+diff*easeFn(progress));
    if(progress<1){_scrollRaf=requestAnimationFrame(step);}
    else{_scrollRaf=null;cleanup();}
  }
  _scrollRaf=requestAnimationFrame(step);
}

// Scroll element into view with custom easing.
// block: 'start'|'center'|'end'|'bottom-edge'
// easing: 'ease-out' (default) | 'ease-in-out' (for return scrolls)
export function smoothScrollToEl(el,block='start',offset=0,duration,easing){
  if(!el) return;
  const rect=el.getBoundingClientRect();
  let targetY;
  if(block==='start') targetY=window.scrollY+rect.top+offset;
  else if(block==='center') targetY=window.scrollY+rect.top-(window.innerHeight-rect.height)/2+offset;
  else if(block==='bottom-edge') targetY=window.scrollY+rect.bottom-window.innerHeight+offset;
  else targetY=window.scrollY+rect.bottom-window.innerHeight+offset;
  smoothScrollTo(targetY,duration,easing);
}

// Scroll `el` to the bottom edge of the viewport + 24px padding.
// Optional duration syncs scroll speed with reveal animations.
export function easeScrollTo(el,duration){
  if(!el||prefersReducedMotion) return;
  requestAnimationFrame(()=>{
    smoothScrollToEl(el,'bottom-edge',24,duration);
  });
}
