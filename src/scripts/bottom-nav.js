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

  // ── Pre-calculate highlight offsets (no getBoundingClientRect on scroll) ──
  let offsets=[];
  function measureOffsets(){
    // items are children of pill (position:relative), so offsetLeft is already relative to pill
    offsets=items.map(item=>({
      left:item.offsetLeft,
      width:item.offsetWidth
    }));
  }
  measureOffsets();

  let activeIdx=0;
  let ticking=false;

  function moveHighlight(idx){
    if(idx<0||idx>=offsets.length) return;
    activeIdx=idx;
    const o=offsets[idx];
    highlight.style.transform=`translateY(-50%) translateX(${o.left}px)`;
    highlight.style.width=o.width+'px';
    items.forEach((item,i)=>{
      item.classList.toggle('active',i===idx);
    });
  }

  // Set initial state
  moveHighlight(0);

  // ── Tap to scroll ──
  let programmaticScroll=false;
  const ac=new AbortController();

  items.forEach((item,i)=>{
    item.addEventListener('click',e=>{
      e.preventDefault();
      const sec=sections[i];
      if(!sec) return;
      programmaticScroll=true;
      moveHighlight(i);
      sec.scrollIntoView({behavior:'smooth',block:'start'});
      // Clear programmatic flag after scroll settles
      setTimeout(()=>{programmaticScroll=false;},600);
    },{signal:ac.signal});
  });

  // ── Active state tracking via IntersectionObserver ──
  // Minimal thresholds — just need to know which section is most visible
  const visible=new Map();

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting) visible.set(entry.target.id,entry.intersectionRatio);
      else visible.delete(entry.target.id);
    });

    if(programmaticScroll) return;

    // Batch highlight update to next frame
    if(!ticking){
      ticking=true;
      requestAnimationFrame(()=>{
        ticking=false;
        let bestId=null,bestRatio=0;
        visible.forEach((ratio,id)=>{
          if(ratio>bestRatio){bestRatio=ratio;bestId=id;}
        });
        if(bestId){
          const idx=items.findIndex(item=>item.dataset.section===bestId);
          if(idx!==-1&&idx!==activeIdx) moveHighlight(idx);
        }
      });
    }
  },{
    threshold:[0,0.3,0.6],
    rootMargin:'-10% 0px -10% 0px'
  });

  sections.forEach(sec=>observer.observe(sec));

  // ── Re-measure on resize (orientation change, etc) ──
  const ro=new ResizeObserver(()=>{
    measureOffsets();
    // Re-position highlight with fresh measurements
    const o=offsets[activeIdx];
    if(o){
      highlight.style.transform=`translateY(-50%) translateX(${o.left}px)`;
      highlight.style.width=o.width+'px';
    }
  });
  ro.observe(pill);

  // ── Cleanup function for next re-init ──
  _cleanup=()=>{
    ac.abort();
    observer.disconnect();
    ro.disconnect();
    visible.clear();
    _cleanup=null;
  };
}

// Expose for data-astro-rerun inline script (sole init path)
window.__initBottomNav=initBottomNav;
