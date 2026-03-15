// ═══ BOTTOM NAV ═══
// Section navigation — text color active indicator, scroll-to-section.
// Re-initializes on every page load (ViewTransitions compatible).

import { smoothScrollToEl } from './shared.js';

let _cleanup=null;

function initBottomNav(){
  if(_cleanup) _cleanup();

  const nav=document.getElementById('bottomNav');
  if(!nav) return;

  const items=[...nav.querySelectorAll('.bottom-nav-item')];
  const sections=items
    .map(item=>document.getElementById(item.dataset.section))
    .filter(Boolean);
  if(!sections.length) return;

  let activeIdx=0;
  let programmaticScroll=false;
  let ticking=false;

  function setActive(idx){
    if(idx<0||idx>=sections.length||idx===activeIdx) return;
    activeIdx=idx;
    items.forEach((item,i)=>item.classList.toggle('active',i===idx));
  }

  function forceActive(idx){
    activeIdx=-1;
    setActive(idx);
  }

  function updateActiveFromScroll(){
    if(programmaticScroll) return;
    const vh=window.innerHeight;
    let bestIdx=0,bestCoverage=0;
    for(let i=0;i<sections.length;i++){
      const r=sections[i].getBoundingClientRect();
      const visTop=Math.max(r.top,0);
      const visBot=Math.min(r.bottom,vh);
      const coverage=Math.max(0,visBot-visTop);
      if(coverage>bestCoverage){
        bestCoverage=coverage;
        bestIdx=i;
      }
    }
    setActive(bestIdx);
  }

  function onScroll(){
    if(!ticking){
      ticking=true;
      requestAnimationFrame(()=>{
        ticking=false;
        updateActiveFromScroll();
      });
    }
  }

  const ac=new AbortController();
  window.addEventListener('scroll',onScroll,{passive:true,signal:ac.signal});

  forceActive(0);
  updateActiveFromScroll();

  items.forEach((item,i)=>{
    item.addEventListener('click',e=>{
      e.preventDefault();
      const sec=sections[i];
      if(!sec) return;
      programmaticScroll=true;
      activeIdx=-1;
      setActive(i);
      smoothScrollToEl(sec,'start');
      setTimeout(()=>{programmaticScroll=false;},800);
    },{signal:ac.signal});
  });

  _cleanup=()=>{
    ac.abort();
    _cleanup=null;
  };
}

window.__initBottomNav=initBottomNav;
