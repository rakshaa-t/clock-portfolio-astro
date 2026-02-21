export function esc(s){return s?s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'):'';}
export const prefersReducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll `el` to the bottom edge of the viewport.
// Uses native smooth scroll (off-main-thread, no jank).
export function easeScrollTo(el){
  if(!el||prefersReducedMotion) return;
  requestAnimationFrame(()=>{
    const rect=el.getBoundingClientRect();
    const targetY=window.scrollY+rect.bottom-window.innerHeight+24;
    if(Math.abs(targetY-window.scrollY)<4) return;
    window.scrollTo({top:targetY,behavior:'smooth'});
  });
}
