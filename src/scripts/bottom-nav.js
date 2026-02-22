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
  // Finds which section's top is closest to viewport top.
  // Much more reliable than IntersectionObserver for tall vs short sections.
  const OFFSET=window.innerHeight*0.35; // detection line ~35% down viewport

  function updateActiveFromScroll(){
    if(programmaticScroll) return;
    let bestIdx=0;
    for(let i=sections.length-1;i>=0;i--){
      const top=sections[i].getBoundingClientRect().top;
      if(top<=OFFSET){
        bestIdx=i;
        break;
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
