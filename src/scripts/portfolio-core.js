// ═══ PORTFOLIO CORE ═══
// Modal system, puzzle card handlers, show more, lazy video observer.
// Re-initializes on every page load (ViewTransitions compatible).

import { PUZZLE_PROJECTS } from '../data/projects.js';
import { esc, prefersReducedMotion, easeScrollTo } from './shared.js';

// ═══ STATE ═══
let modalOpen=false, carouselIndex=0, currentModalData=null;

// ═══ MUTABLE DOM REFS (re-assigned on each page load) ═══
let modalOverlay, modalCard, modalBody;

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

function updateCarouselButtons(){
  if(!currentModalData)return;
  document.querySelector('.carousel-btn.prev').disabled=(carouselIndex===0);
  document.querySelector('.carousel-btn.next').disabled=(carouselIndex===_slideCount(currentModalData)-1);
}

function renderModalDesc(project,slideIdx){
  const descEl=document.getElementById('modalDesc');
  const d=Array.isArray(project.desc)?project.desc[slideIdx]||project.desc[0]:project.desc;
  descEl.innerHTML=d.split('\n\n').map(p=>`<p>${esc(p)}</p>`).join('');
}

function recheckScrollLine(){
  requestAnimationFrame(()=>{if(modalBody){
    modalBody.scrollTop=0;modalBody.classList.remove('has-scroll-fade');
    const hasOverflow=modalBody.scrollHeight>modalBody.clientHeight+4;
    modalBody.classList.toggle('has-bottom-fade',hasOverflow);
  }});
}

// ═══ SHOW MODAL ═══
function _showModal(project){
  currentModalData=project;carouselIndex=0;modalOpen=true;
  const track=document.getElementById('carouselTrack');
  track.style.transition='none';
  track.style.transform='translateX(0)';
  track.offsetHeight;
  track.style.transition='';
  const isComingSoon=!!project.comingSoon;
  const slides=project.images||project.slides;
  if(isComingSoon){
    track.innerHTML=`<div class="carousel-slide"><div class="carousel-slide-color" style="background:${slides[0]}"><span class="coming-soon-label">I'm working on it</span></div></div>`;
  }else{
    const fitClass=project.images&&project.images.length===1?'single-media':'';
    track.innerHTML=slides.map((s,i)=>{
      if(project.images&&s.endsWith('.mp4')) return `<div class="carousel-slide ${fitClass}"><video src="${s}" autoplay muted playsinline preload="metadata"></video></div>`;
      if(project.images) return `<div class="carousel-slide ${fitClass}"><img src="${s}" alt="${project.title} slide ${i+1}" loading="${i<2?'eager':'lazy'}" draggable="false"></div>`;
      return `<div class="carousel-slide"><div class="carousel-slide-color" style="background:${s}">${i===0?project.title.substring(0,2).toUpperCase():'IMG '+(i+1)}</div></div>`;
    }).join('');
  }
  const counterEl=document.getElementById('carouselCounter');
  counterEl.textContent=(isComingSoon||slides.length===1)?'':`1 / ${slides.length}`;
  counterEl.style.display=(isComingSoon||slides.length===1)?'none':'';
  document.getElementById('modalTitle').textContent=project.title;
  const tagsEl=document.getElementById('modalTags');
  tagsEl.innerHTML=project.tags.map(t=>`<span class="modal-tag">${t}</span>`).join('');
  if(project.link&&project.link!=='#')tagsEl.innerHTML+=`<a class="modal-tag link" href="${project.link}" target="_blank">${project.link.replace('https://','').replace('mailto:','')} <svg class="cta-arrow" width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12L12 4"/><path d="M5 4h7v7"/></svg></a>`;
  const isImageOnly=!!project.images&&!project.desc;
  const innerEl=document.querySelector('.modal-card-inner');
  innerEl.classList.toggle('image-only',isImageOnly||isComingSoon);
  innerEl.classList.toggle('coming-soon',isComingSoon);
  if(!isImageOnly&&!isComingSoon) renderModalDesc(project,0);
  else document.getElementById('modalDesc').innerHTML='';
  const caseStudyLink=document.getElementById('modalCaseStudyLink');
  if(isImageOnly&&project.link&&project.link!=='#'){caseStudyLink.href=project.link;caseStudyLink.style.display='';}
  else{caseStudyLink.style.display='none';}
  const hideNav=isComingSoon||slides.length===1;
  document.querySelector('.carousel-btn.prev').style.display=hideNav?'none':'';
  document.querySelector('.carousel-btn.next').style.display=hideNav?'none':'';
  document.querySelectorAll('.puzzle-card video').forEach(v=>{try{v.pause();}catch(e){}});
  if(modalBody){modalBody.scrollTop=0;modalBody.classList.remove('has-scroll-fade');modalBody.classList.remove('has-bottom-fade');}
  modalOverlay.classList.add('open');
  modalCard.style.willChange='transform';
  document.body.style.overflow='hidden';
  requestAnimationFrame(()=>{if(modalBody){
    const hasOverflow=modalBody.scrollHeight>modalBody.clientHeight+4;
    modalBody.classList.toggle('has-bottom-fade',hasOverflow);
  }});
  updateCarouselButtons();

  tiltRX=0;tiltRY=0;tiltTargetRX=0;tiltTargetRY=0;tiltVelRX=0;tiltVelRY=0;
  const isMobileModal=window.matchMedia('(max-width:480px)').matches;
  if(isMobileModal){
    // Mobile: CSS slide-up
  }else if(!prefersReducedMotion){
    let scaleP=0;
    function scaleIn(){
      scaleP+=(1-scaleP)*0.15;
      const s=0.95+scaleP*0.05;
      modalCard.style.transform=`perspective(900px) scale(${s}) rotateX(0deg) rotateY(0deg)`;
      if(scaleP<0.99)requestAnimationFrame(scaleIn);
      else{
        modalCard.style.transform='perspective(900px) rotateX(0deg) rotateY(0deg)';
        if(!tiltRaf)tiltRaf=requestAnimationFrame(tiltLoop);
      }
    }
    requestAnimationFrame(scaleIn);
  }else{
    modalCard.style.transform='none';
  }
}

function openPuzzleModal(project,triggerEl){_showModal(project);}

function closeModal(){
  modalOpen=false;
  document.querySelectorAll('#carouselTrack video').forEach(v=>{try{v.pause();v.removeAttribute('src');v.load();}catch(e){}});
  modalOverlay.classList.remove('open');
  document.body.style.overflow='';
  const isMobileClose=window.matchMedia('(max-width:480px)').matches;
  if(!isMobileClose){modalCard.style.transform='';modalCard.style.willChange='';}
  else{modalCard.style.willChange='';}
  if(modalBody){modalBody.classList.remove('has-bottom-fade');modalBody.classList.remove('has-scroll-fade');}
  if(tiltRaf){cancelAnimationFrame(tiltRaf);tiltRaf=null;}
  document.querySelectorAll('.puzzle-card video').forEach(v=>{
    const r=v.getBoundingClientRect();
    if(r.bottom>0&&r.top<window.innerHeight) v.play().catch(()=>{});
  });
}

function updateTitleTagsVisibility(){
  const isImageOnly=currentModalData&&!!currentModalData.images&&!currentModalData.desc;
  if(isImageOnly)return;
  const show=carouselIndex===0;
  document.getElementById('modalTitle').style.display=show?'':'none';
  document.getElementById('modalTags').style.display=show?'':'none';
}

function carouselNext(){
  if(!currentModalData||carouselIndex>=_slideCount(currentModalData)-1)return;
  carouselIndex++;
  document.getElementById('carouselTrack').style.transform=`translateX(-${carouselIndex*100}%)`;
  document.getElementById('carouselCounter').textContent=`${carouselIndex+1} / ${_slideCount(currentModalData)}`;
  if(Array.isArray(currentModalData.desc)){renderModalDesc(currentModalData,carouselIndex);recheckScrollLine();}
  updateTitleTagsVisibility();
  updateCarouselButtons();
}

function carouselPrev(){
  if(!currentModalData||carouselIndex<=0)return;
  carouselIndex--;
  document.getElementById('carouselTrack').style.transform=`translateX(-${carouselIndex*100}%)`;
  document.getElementById('carouselCounter').textContent=`${carouselIndex+1} / ${_slideCount(currentModalData)}`;
  if(Array.isArray(currentModalData.desc)){renderModalDesc(currentModalData,carouselIndex);recheckScrollLine();}
  updateTitleTagsVisibility();
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
  if(!modalOverlay||!modalCard) return;

  if(modalBody) modalBody.addEventListener('scroll',function(){
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
        // Sync scroll with CSS stagger (max 0.4s delay + 0.3s animation = 700ms)
        easeScrollTo(puzzleShowMore,700);
      }else{
        puzzleGrid.classList.remove('expanded');
        puzzleGrid.classList.add('collapsing');
        puzzleShowMore.textContent='Show more work';
        puzzleExpanded=false;
        easeScrollTo(puzzleShowMore);
      }
    });
  }

  // Puzzle card click handlers
  document.querySelectorAll('.puzzle-card[data-project]').forEach(card=>{
    const idx=parseInt(card.dataset.project,10);
    const proj=PUZZLE_PROJECTS[idx];
    if(!proj) return;
    if('externalLink' in proj){
      if(proj.externalLink){
        card.style.cursor='pointer';
        card.addEventListener('click',()=>window.open(proj.externalLink,'_blank'));
      } else {
        card.style.cursor='default';
      }
      return;
    }
    card.addEventListener('click',()=>openPuzzleModal(proj,card));
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

  // Keyboard
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&modalOpen){closeModal();return;}
    if(modalOpen&&e.key==='ArrowRight'){carouselNext();return;}
    if(modalOpen&&e.key==='ArrowLeft'){carouselPrev();return;}
  });
}

// Expose for data-astro-rerun inline script (sole init path)
window.__initPortfolioCore=initPortfolioCore;
