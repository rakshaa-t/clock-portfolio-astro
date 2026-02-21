// ═══ BOTTOM NAV ═══
// Mobile section navigation — sliding highlight, scroll-to-section, scroll-to-top.
// Re-initializes on every page load (ViewTransitions compatible).

function initBottomNav(){
  const nav=document.getElementById('bottomNav');
  if(!nav) return;

  const highlight=document.getElementById('bottomNavHighlight');
  const items=[...nav.querySelectorAll('.bottom-nav-item')];
  const sectionIds=items.map(item=>item.dataset.section);
  const sections=sectionIds.map(id=>document.getElementById(id)).filter(Boolean);
  if(!sections.length) return;

  let programmaticScroll=false;

  // ── Sliding highlight ──
  const pill=nav.querySelector('.bottom-nav-pill');
  function moveHighlight(activeItem){
    if(!highlight||!activeItem||!pill) return;
    const pillRect=pill.getBoundingClientRect();
    const itemRect=activeItem.getBoundingClientRect();
    highlight.style.left=(itemRect.left-pillRect.left)+'px';
    highlight.style.width=itemRect.width+'px';
  }

  // Position highlight on the initial active item
  const initialActive=nav.querySelector('.bottom-nav-item.active');
  if(initialActive) requestAnimationFrame(()=>moveHighlight(initialActive));

  function setActive(item){
    items.forEach(i=>i.classList.remove('active'));
    item.classList.add('active');
    moveHighlight(item);
  }

  // ── Tap to scroll ──
  items.forEach(item=>{
    item.addEventListener('click',e=>{
      e.preventDefault();
      const sec=document.getElementById(item.dataset.section);
      if(!sec) return;
      programmaticScroll=true;
      setActive(item);
      sec.scrollIntoView({behavior:'smooth',block:'start'});
      setTimeout(()=>{programmaticScroll=false;},800);
    });
  });

  // ── Active state tracking via IntersectionObserver ──
  const visibleSections=new Map();

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting) visibleSections.set(entry.target.id,entry.intersectionRatio);
      else visibleSections.delete(entry.target.id);
    });

    if(programmaticScroll) return;

    let bestId=null,bestRatio=0;
    visibleSections.forEach((ratio,id)=>{
      if(ratio>bestRatio){bestRatio=ratio;bestId=id;}
    });

    if(bestId){
      const activeItem=items.find(i=>i.dataset.section===bestId);
      if(activeItem&&!activeItem.classList.contains('active')) setActive(activeItem);
    }
  },{
    threshold:[0,0.1,0.25,0.5,0.75,1],
    rootMargin:'-10% 0px -10% 0px'
  });

  sections.forEach(sec=>observer.observe(sec));

}

// Expose for data-astro-rerun inline script (sole init path)
window.__initBottomNav=initBottomNav;
