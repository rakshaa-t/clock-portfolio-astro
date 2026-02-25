// ═══ PORTFOLIO CORE ═══
// Modal system, puzzle card handlers, show more, lazy video observer.
// Re-initializes on every page load (ViewTransitions compatible).

import { PUZZLE_PROJECTS } from '../data/projects.js';
import { esc, prefersReducedMotion, smoothScrollToEl, smoothScrollElH } from './shared.js';

// ═══ STATE ═══
let modalOpen=false, carouselIndex=0, currentModalData=null, _modalTrigger=null;

// ═══ MUTABLE DOM REFS (re-assigned on each page load) ═══
let modalOverlay, modalCard, modalBody, modalDescWrap, carouselScroll;
let slideObserver=null;

// ═══ PLACEHOLDER TEXT ═══
const PLACEHOLDER_DESC='A detailed case study for this project is coming soon. Check back for an in-depth look at the design process, challenges, and outcomes.';

// ═══ 3D TILT ═══
const TILT_MAX=0.6;
let tiltRX=0,tiltRY=0,tiltTargetRX=0,tiltTargetRY=0,tiltVelRX=0,tiltVelRY=0;
let tiltCardCX=0,tiltCardCY=0,tiltCardW=0,tiltCardH=0;
let tiltRaf=null;

function tiltLoop(){
  if(!modalOpen){tiltRaf=null;return;}
  const fx=(tiltTargetRX-tiltRX)*0.06;
  const fy=(tiltTargetRY-tiltRY)*0.06;
  tiltVelRX=(tiltVelRX+fx)*0.75;
  tiltVelRY=(tiltVelRY+fy)*0.75;
  tiltRX+=tiltVelRX;tiltRY+=tiltVelRY;
  modalCard.style.transform=`perspective(900px) rotateX(${tiltRX}deg) rotateY(${tiltRY}deg)`;
  tiltRaf=requestAnimationFrame(tiltLoop);
}

function updateTiltRect(){
  const saved=modalCard.style.transform;
  modalCard.style.transform='perspective(900px) rotateX(0deg) rotateY(0deg)';
  const r=modalCard.getBoundingClientRect();
  modalCard.style.transform=saved;
  tiltCardCX=r.left+r.width/2;tiltCardCY=r.top+r.height/2;
  tiltCardW=r.width;tiltCardH=r.height;
}

// ═══ CAROUSEL HELPERS ═══
function _slideCount(p){return (p.images||p.slides).length;}

function updateCounter(){
  if(!currentModalData)return;
  const total=_slideCount(currentModalData);
  const counterEl=document.getElementById('carouselCounter');
  counterEl.textContent=total<=1?'':`${carouselIndex+1} / ${total}`;
}

function updateCarouselButtons(){
  if(!currentModalData)return;
  document.querySelector('.carousel-btn.prev').disabled=(carouselIndex===0);
  document.querySelector('.carousel-btn.next').disabled=(carouselIndex===_slideCount(currentModalData)-1);
}

function renderModalDesc(project,slideIdx){
  const descEl=document.getElementById('modalDesc');
  if(!project.desc){
    descEl.innerHTML=`<p>${esc(PLACEHOLDER_DESC)}</p>`;
    return;
  }
  const d=Array.isArray(project.desc)?project.desc[slideIdx]||project.desc[0]:project.desc;
  descEl.innerHTML=d.split('\n\n').map(p=>`<p>${esc(p)}</p>`).join('');
}

function recheckDescScroll(){
  requestAnimationFrame(()=>{if(modalDescWrap){
    modalDescWrap.scrollTop=0;modalDescWrap.classList.remove('has-scroll-fade');
    const hasOverflow=modalDescWrap.scrollHeight>modalDescWrap.clientHeight+4;
    modalDescWrap.classList.toggle('has-bottom-fade',hasOverflow);
  }});
}

// ═══ SNAP-SCROLL OBSERVER ═══
function setupSlideObserver(){
  if(slideObserver) slideObserver.disconnect();
  if(!carouselScroll) return;
  const slides=carouselScroll.querySelectorAll('.carousel-slide');
  if(!slides.length) return;
  slideObserver=new IntersectionObserver((entries)=>{
    for(const e of entries){
      if(e.isIntersecting){
        const idx=[...slides].indexOf(e.target);
        if(idx>=0&&idx!==carouselIndex){
          carouselIndex=idx;
          updateCounter();
          updateCarouselButtons();
          if(Array.isArray(currentModalData?.desc)){renderModalDesc(currentModalData,carouselIndex);recheckDescScroll();}
        }
      }
    }
  },{root:carouselScroll,threshold:0.6});
  slides.forEach(s=>slideObserver.observe(s));
}

function scrollToSlide(idx){
  if(!carouselScroll) return;
  const slide=carouselScroll.querySelectorAll('.carousel-slide')[idx];
  if(!slide) return;
  smoothScrollElH(carouselScroll,slide.offsetLeft);
}

// ═══ SHOW MODAL ═══
function _showModal(project){
  currentModalData=project;carouselIndex=0;modalOpen=true;
  carouselScroll=document.getElementById('carouselScroll');
  carouselScroll.scrollLeft=0;
  const isComingSoon=!!project.comingSoon;
  const slides=project.images||project.slides;
  if(isComingSoon){
    carouselScroll.innerHTML=`<div class="carousel-slide"><div class="carousel-slide-color" style="background:${slides[0]}"><span class="coming-soon-label">I'm working on it</span></div></div>`;
  }else{
    carouselScroll.innerHTML=slides.map((s,i)=>{
      if(project.images&&s.endsWith('.mp4')) return `<div class="carousel-slide"><video src="${s}" autoplay muted playsinline preload="metadata" aria-label="${esc(project.title)} demo video"></video></div>`;
      if(project.images) return `<div class="carousel-slide"><img src="${s}" alt="${project.title} slide ${i+1}" loading="${i<2?'eager':'lazy'}" draggable="false"></div>`;
      return `<div class="carousel-slide"><div class="carousel-slide-color" style="background:${s}">${i===0?project.title.substring(0,2).toUpperCase():'IMG '+(i+1)}</div></div>`;
    }).join('');
  }
  const counterEl=document.getElementById('carouselCounter');
  counterEl.textContent=(isComingSoon||slides.length===1)?'':`1 / ${slides.length}`;
  counterEl.style.display=(isComingSoon||slides.length===1)?'none':'';
  document.getElementById('modalTitle').textContent=project.title;
  const tagsEl=document.getElementById('modalTags');
  if(project.link&&project.link!=='#')tagsEl.innerHTML=`<a class="modal-tag link" href="${project.link}" target="_blank">View full case study <svg class="cta-arrow" width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12L12 4"/><path d="M5 4h7v7"/></svg></a>`;
  else tagsEl.innerHTML='';
  const innerEl=document.querySelector('.modal-card-inner');
  innerEl.classList.toggle('coming-soon',isComingSoon);
  // Always show text area — render desc (or placeholder)
  renderModalDesc(project,0);
  const hideNav=isComingSoon||slides.length===1;
  document.querySelector('.carousel-btn.prev').style.display=hideNav?'none':'';
  document.querySelector('.carousel-btn.next').style.display=hideNav?'none':'';
  document.querySelectorAll('.puzzle-card video').forEach(v=>{try{v.pause();}catch(e){}});
  if(modalDescWrap){modalDescWrap.scrollTop=0;modalDescWrap.classList.remove('has-scroll-fade');modalDescWrap.classList.remove('has-bottom-fade');}
  modalOverlay.classList.add('open');
  modalCard.style.willChange='transform';
  document.body.style.overflow='hidden';
  // Move focus into modal for keyboard users
  requestAnimationFrame(()=>{const closeBtn=modalCard.querySelector('.modal-close');if(closeBtn)closeBtn.focus();});
  requestAnimationFrame(()=>{if(modalDescWrap){
    const hasOverflow=modalDescWrap.scrollHeight>modalDescWrap.clientHeight+4;
    modalDescWrap.classList.toggle('has-bottom-fade',hasOverflow);
  }});
  updateCarouselButtons();

  // Setup snap-scroll observer for slide tracking
  setupSlideObserver();

  tiltRX=0;tiltRY=0;tiltTargetRX=0;tiltTargetRY=0;tiltVelRX=0;tiltVelRY=0;
  const isMobileModal=window.matchMedia('(max-width:480px)').matches;
  if(isMobileModal){
    // Mobile: CSS scale handles animation, no tilt
  }else if(!prefersReducedMotion){
    // CSS transition handles scale(0.95)→scale(1), then start tilt
    const onTransitionEnd=(e)=>{
      if(e.target!==modalCard||e.propertyName!=='transform')return;
      modalCard.removeEventListener('transitionend',onTransitionEnd);
      if(modalOpen&&!tiltRaf) tiltRaf=requestAnimationFrame(tiltLoop);
    };
    modalCard.addEventListener('transitionend',onTransitionEnd);
  }else{
    modalCard.style.transform='none';
  }
}

function openPuzzleModal(project,triggerEl){_modalTrigger=triggerEl||null;_showModal(project);}

function closeModal(){
  modalOpen=false;
  const trigger=_modalTrigger;_modalTrigger=null;
  if(carouselScroll) document.querySelectorAll('#carouselScroll video').forEach(v=>{try{v.pause();v.removeAttribute('src');v.load();}catch(e){}});
  if(slideObserver){slideObserver.disconnect();slideObserver=null;}
  modalOverlay.classList.remove('open');
  document.body.style.overflow='';
  modalCard.style.transform='';modalCard.style.willChange='';
  if(modalDescWrap){modalDescWrap.classList.remove('has-bottom-fade');modalDescWrap.classList.remove('has-scroll-fade');}
  if(tiltRaf){cancelAnimationFrame(tiltRaf);tiltRaf=null;}
  document.querySelectorAll('.puzzle-card video').forEach(v=>{
    const r=v.getBoundingClientRect();
    if(r.bottom>0&&r.top<window.innerHeight) v.play().catch(()=>{});
  });
  // Restore focus to trigger element
  if(trigger&&trigger.focus) trigger.focus();
}

function carouselNext(){
  if(!currentModalData||carouselIndex>=_slideCount(currentModalData)-1)return;
  carouselIndex++;
  scrollToSlide(carouselIndex);
  updateCounter();
  if(Array.isArray(currentModalData.desc)){renderModalDesc(currentModalData,carouselIndex);recheckDescScroll();}
  updateCarouselButtons();
}

function carouselPrev(){
  if(!currentModalData||carouselIndex<=0)return;
  carouselIndex--;
  scrollToSlide(carouselIndex);
  updateCounter();
  if(Array.isArray(currentModalData.desc)){renderModalDesc(currentModalData,carouselIndex);recheckDescScroll();}
  updateCarouselButtons();
}

// ═══ EXPOSE TO GLOBAL SCOPE ═══
window.closeModal=closeModal;
window.carouselPrev=carouselPrev;
window.carouselNext=carouselNext;
window.openPuzzleModal=openPuzzleModal;

// ═══ INIT — runs on every page load ═══
function initPortfolioCore(){
  modalOverlay=document.getElementById('modalOverlay');
  modalCard=document.getElementById('modalCard');
  modalBody=document.querySelector('.modal-body');
  modalDescWrap=document.getElementById('modalDescWrap');
  carouselScroll=document.getElementById('carouselScroll');
  if(!modalOverlay||!modalCard) return;

  // Scroll fade on description area
  if(modalDescWrap) modalDescWrap.addEventListener('scroll',function(){
    this.classList.toggle('has-scroll-fade',this.scrollTop>2);
    const atBottom=this.scrollHeight-this.scrollTop-this.clientHeight<4;
    const hasOverflow=this.scrollHeight>this.clientHeight+4;
    this.classList.toggle('has-bottom-fade',hasOverflow&&!atBottom);
  });

  if(!prefersReducedMotion){
    modalCard.addEventListener('mouseenter',()=>{if(modalOpen)updateTiltRect();});
    modalCard.addEventListener('mousemove',e=>{
      if(!modalOpen)return;
      if(!tiltCardW)updateTiltRect();
      const nx=(e.clientX-tiltCardCX)/tiltCardW;
      const ny=(e.clientY-tiltCardCY)/tiltCardH;
      tiltTargetRY=nx*TILT_MAX*2;
      tiltTargetRX=-ny*TILT_MAX*2;
    });
    modalCard.addEventListener('mouseleave',()=>{tiltTargetRX=0;tiltTargetRY=0;});
  }

  // Show more projects
  const puzzleShowMore=document.getElementById('puzzleShowMore');
  const puzzleGrid=document.querySelector('.puzzle-grid');
  let puzzleExpanded=false;
  if(puzzleShowMore){
    puzzleShowMore.addEventListener('click',()=>{
      if(!puzzleExpanded){
        puzzleGrid.classList.remove('collapsing');
        puzzleGrid.classList.add('expanded');
        puzzleShowMore.textContent='Show less';
        puzzleExpanded=true;
      }else{
        puzzleGrid.classList.remove('expanded');
        puzzleGrid.classList.add('collapsing');
        puzzleShowMore.textContent='Show more work';
        puzzleExpanded=false;
        smoothScrollToEl(puzzleShowMore,'center',0,600);
      }
      puzzleShowMore.setAttribute('aria-expanded',puzzleExpanded);
    });
  }

  // Puzzle card click handlers + keyboard access
  document.querySelectorAll('.puzzle-card[data-project]').forEach(card=>{
    const idx=parseInt(card.dataset.project,10);
    const proj=PUZZLE_PROJECTS[idx];
    if(!proj) return;
    card.setAttribute('tabindex','0');
    card.setAttribute('role','button');
    const overlaySpan=card.querySelector('.puzzle-overlay span');
    if(overlaySpan) card.setAttribute('aria-label',overlaySpan.textContent);
    function activate(){
      if('externalLink' in proj){
        if(proj.externalLink) window.open(proj.externalLink,'_blank');
        return;
      }
      openPuzzleModal(proj,card);
    }
    if('externalLink' in proj&&!proj.externalLink){card.style.cursor='default';return;}
    card.addEventListener('click',activate);
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});
  });

  // Lazy video playback
  const _cardVideos=document.querySelectorAll('.puzzle-card video');
  if(_cardVideos.length){
    const vidObs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting&&!modalOpen) e.target.play().catch(()=>{});
        else e.target.pause();
      });
    },{threshold:0.25});
    _cardVideos.forEach(v=>vidObs.observe(v));
  }

  // Keyboard + focus trap
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&modalOpen){closeModal();return;}
    if(modalOpen&&e.key==='ArrowRight'){carouselNext();return;}
    if(modalOpen&&e.key==='ArrowLeft'){carouselPrev();return;}
    if(modalOpen&&e.key==='Tab'){
      const focusable=modalCard.querySelectorAll('button,[href],input,[tabindex]:not([tabindex="-1"])');
      if(!focusable.length) return;
      const first=focusable[0],last=focusable[focusable.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });

  // Note card click sound (Magic Mouse click)
  document.querySelectorAll('.note-card').forEach(card=>{
    card.addEventListener('click',()=>{
      if(window.__clockAudio) window.__clockAudio.noteClick();
    });
  });
}

// Expose for data-astro-rerun inline script (sole init path)
window.__initPortfolioCore=initPortfolioCore;
