// ═══ SCROLL EFFECTS ═══
// 1. Staggered fade-in with blur (IntersectionObserver)
// 2. 3D card tilt on hover (desktop only)
// Re-initializes on every page load (ViewTransitions compatible).

import { prefersReducedMotion } from './shared.js';

let _cleanup=null;

function initScrollEffects(){
  if(_cleanup) _cleanup();
  if(prefersReducedMotion) return;

  const ac=new AbortController();

  // ── 1. Staggered fade-in with blur ──
  // Marks elements with .reveal-item, reveals them with staggered delays
  // when they enter the viewport.

  const revealSelectors='.puzzle-card:not(.puzzle-extra), .mm-card, .note-card, .book-cover-item';
  const revealItems=document.querySelectorAll(revealSelectors);

  // Add .reveal-item class — but skip elements already in viewport
  // (avoids flash where visible content blinks hidden then revealed)
  const vh=window.innerHeight;
  revealItems.forEach(el=>{
    const rect=el.getBoundingClientRect();
    if(rect.top<vh && rect.bottom>0){
      // Already visible — no animation needed
      return;
    }
    el.classList.add('reveal-item');
  });

  const revealObserver=new IntersectionObserver((entries)=>{
    // Collect newly visible entries
    const visible=entries.filter(e=>e.isIntersecting);
    if(!visible.length) return;

    // Sort by DOM position for consistent stagger order
    visible.sort((a,b)=>{
      const pos=a.target.compareDocumentPosition(b.target);
      return pos & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });

    visible.forEach((entry,i)=>{
      const delay=i*50; // 50ms stagger per item
      entry.target.style.transitionDelay=`${delay}ms`;
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
      // Clean up delay after animation completes
      setTimeout(()=>{
        entry.target.style.transitionDelay='';
      },delay+500);
    });
  },{
    threshold:0.1,
    rootMargin:'0px 0px -40px 0px' // trigger slightly before fully in view
  });

  revealItems.forEach(el=>{
    if(el.classList.contains('reveal-item')) revealObserver.observe(el);
  });

  // Also reveal dynamically added mm-cards (Mymind loads async)
  const mmGrid=document.getElementById('mmindGrid');
  let mmMutObs=null;
  if(mmGrid){
    mmMutObs=new MutationObserver((mutations)=>{
      mutations.forEach(m=>{
        m.addedNodes.forEach(node=>{
          if(node.nodeType===1 && node.classList.contains('mm-card')){
            node.classList.add('reveal-item');
            revealObserver.observe(node);
          }
        });
      });
    });
    mmMutObs.observe(mmGrid,{childList:true});
  }

  // Also handle books grid (dynamic)
  const booksGrid=document.getElementById('booksGrid');
  let booksMutObs=null;
  if(booksGrid){
    booksMutObs=new MutationObserver((mutations)=>{
      mutations.forEach(m=>{
        m.addedNodes.forEach(node=>{
          if(node.nodeType===1 && node.classList.contains('book-cover-item')){
            node.classList.add('reveal-item');
            revealObserver.observe(node);
          }
        });
      });
    });
    booksMutObs.observe(booksGrid,{childList:true});
  }

  // ── 2. 3D card tilt on hover (desktop only) ──
  // Subtle perspective rotation following mouse position.
  // On ivory, shadow shift provides the physical feel instead of specular glow.

  const isMobile=window.matchMedia('(max-width:768px)').matches;

  if(!isMobile){
    const tiltCards=document.querySelectorAll('.puzzle-card');
    const maxRotate=4; // degrees — subtle

    tiltCards.forEach(card=>{
      card.classList.add('tilt-card');

      card.addEventListener('mouseenter',()=>{
        // Suppress transition so tilt tracking is instant
        card.style.transition='none';
      },{signal:ac.signal});

      card.addEventListener('mousedown',()=>{
        // Let CSS :active scale take priority
        card.style.transform='';
        card.style.transition='';
      },{signal:ac.signal});

      card.addEventListener('mousemove',e=>{
        const rect=card.getBoundingClientRect();
        const x=(e.clientX-rect.left)/rect.width;  // 0→1
        const y=(e.clientY-rect.top)/rect.height;   // 0→1
        const rotateY=(x-0.5)*maxRotate*2;  // -maxRotate → +maxRotate
        const rotateX=(0.5-y)*maxRotate*2;  // inverted for natural feel
        card.style.transform=`perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px) scale(1.01)`;
      },{signal:ac.signal});

      card.addEventListener('mouseleave',()=>{
        // Restore transition for smooth return
        card.style.transition='';
        card.style.transform='';
      },{signal:ac.signal});
    });
  }

  // ── Cleanup ──
  _cleanup=()=>{
    ac.abort();
    revealObserver.disconnect();
    if(mmMutObs) mmMutObs.disconnect();
    if(booksMutObs) booksMutObs.disconnect();
    // Remove tilt transforms
    document.querySelectorAll('.tilt-card').forEach(el=>{
      el.style.transform='';
      el.style.perspective='';
      el.classList.remove('tilt-card');
    });
    // Remove reveal classes
    document.querySelectorAll('.reveal-item').forEach(el=>{
      el.classList.remove('reveal-item','revealed');
      el.style.transitionDelay='';
    });
    _cleanup=null;
  };
}

window.__initScrollEffects=initScrollEffects;
