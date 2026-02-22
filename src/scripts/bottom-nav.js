// ═══ BOTTOM NAV ═══
// Mobile section navigation — sliding highlight, scroll-to-section.
// Re-initializes on every page load (ViewTransitions compatible).

// Persistent state across re-inits
let _cleanup=null;

function initBottomNav(){
  // Tear down previous instance (ViewTransitions)
  if(_cleanup) _cleanup();

  const nav=document.getElementById('bottomNav');
  if(!nav) return;

  const highlight=document.getElementById('bottomNavHighlight');
  const items=[...nav.querySelectorAll('.bottom-nav-item')];
  const pill=nav.querySelector('.bottom-nav-pill');
  const sections=items
    .map(item=>document.getElementById(item.dataset.section))
    .filter(Boolean);
  if(!sections.length||!pill||!highlight) return;

  // ── Pre-calculate highlight offsets ──
  let offsets=[];
  function measureOffsets(){
    offsets=items.map(item=>({
      left:item.offsetLeft,
      width:item.offsetWidth
    }));
  }
  measureOffsets();

  let activeIdx=0;
  let programmaticScroll=false;
  let ticking=false;

  function moveHighlight(idx){
    if(idx<0||idx>=offsets.length||idx===activeIdx) return;
    activeIdx=idx;
    const o=offsets[idx];
    highlight.style.transform=`translateY(-50%) translateX(${o.left}px)`;
    highlight.style.width=o.width+'px';
    items.forEach((item,i)=>{
      item.classList.toggle('active',i===idx);
    });
  }

  // Force-set without the idx===activeIdx guard (for init + resize)
  function forceHighlight(idx){
    activeIdx=-1;
    moveHighlight(idx);
  }

  // ── Scroll-based active tracking ──
  // Picks whichever section covers the most viewport pixels.
  // Stable: a tall section like Work won't lose to a short adjacent section
  // until that section genuinely takes over the majority of the screen.
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
    moveHighlight(bestIdx);
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

  // Set initial state from current scroll position
  forceHighlight(0);
  updateActiveFromScroll();

  // ── Tap to scroll ──
  items.forEach((item,i)=>{
    item.addEventListener('click',e=>{
      e.preventDefault();
      const sec=sections[i];
      if(!sec) return;
      programmaticScroll=true;
      activeIdx=-1; // force update
      moveHighlight(i);
      sec.scrollIntoView({behavior:'smooth',block:'start'});
      setTimeout(()=>{programmaticScroll=false;},800);
    },{signal:ac.signal});
  });

  // ── Re-measure on resize ──
  const ro=new ResizeObserver(()=>{
    measureOffsets();
    const o=offsets[activeIdx];
    if(o){
      highlight.style.transform=`translateY(-50%) translateX(${o.left}px)`;
      highlight.style.width=o.width+'px';
    }
  });
  ro.observe(pill);

  // ── Cleanup ──
  _cleanup=()=>{
    ac.abort();
    ro.disconnect();
    _cleanup=null;
  };
}

// Expose for data-astro-rerun inline script (sole init path)
window.__initBottomNav=initBottomNav;
