// ═══ TEARDOWN SCROLL ENGINE ═══
// Left panel scrolls internally. IntersectionObserver watches
// sections inside that scroll container and triggers mockup
// state changes on the right panel.

function initTeardown(){
  const wrapper=document.querySelector('.teardown');
  if(!wrapper) return;

  const scrollRoot=wrapper.querySelector('.td-left');
  const sections=wrapper.querySelectorAll('.td-section[data-mockup]');
  const mockups=wrapper.querySelectorAll('.td-mockup');
  if(!scrollRoot||!sections.length||!mockups.length) return;

  let activeId=null;

  function activate(id){
    if(id===activeId) return;
    activeId=id;
    mockups.forEach(m=>{
      m.classList.toggle('active',m.dataset.mockupId===id);
    });
  }

  // Activate first mockup by default
  const firstId=sections[0]?.dataset.mockup;
  if(firstId) activate(firstId);

  // Observer rooted in the left scroll container.
  // Fires when a section enters the top 40% of that container.
  const observer=new IntersectionObserver((entries)=>{
    let best=null;
    entries.forEach(e=>{
      if(e.isIntersecting&&(!best||e.intersectionRatio>best.intersectionRatio)){
        best=e;
      }
    });
    if(best){
      const id=best.target.dataset.mockup;
      if(id) activate(id);
    }
  },{
    root:scrollRoot,
    rootMargin:'-10% 0px -50% 0px',
    threshold:[0,0.25,0.5,0.75,1]
  });

  sections.forEach(s=>observer.observe(s));

  // Cleanup on page navigation (ViewTransitions)
  document.addEventListener('astro:before-swap',()=>{
    observer.disconnect();
  },{once:true});
}

// Expose for data-astro-rerun inline script
window.__initTeardown=initTeardown;
