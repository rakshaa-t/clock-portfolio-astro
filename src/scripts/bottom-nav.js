// ═══ SECTION NAV ═══
// Desktop: vertical side-nav lines with scroll spy.
// Mobile: burger button opens full-screen menu overlay.
// Re-initializes on every page load (ViewTransitions compatible).

import { smoothScrollToEl } from './shared.js';
import { haptic } from './haptics.js';

let _cleanup=null;

function initBottomNav(){
  if(_cleanup) _cleanup();

  const sideNav=document.getElementById('sideNav');
  const burgerBtn=document.getElementById('burgerBtn');
  const menuWrap=document.getElementById('mobileMenuWrap');
  if(!sideNav&&!burgerBtn) return;

  const sideItems=sideNav?[...sideNav.querySelectorAll('.side-nav-line')]:[];
  const menuItems=menuWrap?[...menuWrap.querySelectorAll('.mobile-menu-item')]:[];

  const sections=sideItems.length
    ? sideItems.map(item=>document.getElementById(item.dataset.section)).filter(Boolean)
    : menuItems.map(item=>document.getElementById(item.dataset.section)).filter(Boolean);
  if(!sections.length) return;

  let activeIdx=0;
  let programmaticScroll=false;
  let ticking=false;
  let menuOpen=false;

  function setActive(idx){
    if(idx<0||idx>=sections.length||idx===activeIdx) return;
    activeIdx=idx;
    sideItems.forEach((item,i)=>item.classList.toggle('active',i===idx));
    menuItems.forEach((item,i)=>item.classList.toggle('active',i===idx));
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

  // ── Mobile menu toggle ──
  function openMenu(){
    if(menuOpen) return;
    menuOpen=true;
    burgerBtn.classList.add('open');
    burgerBtn.setAttribute('aria-expanded','true');
    menuWrap.classList.add('open');
    document.body.style.overflow='hidden';
    haptic('light');
  }

  function closeMenu(){
    if(!menuOpen) return;
    menuOpen=false;
    burgerBtn.classList.remove('open');
    burgerBtn.setAttribute('aria-expanded','false');
    menuWrap.classList.remove('open');
    document.body.style.overflow='';
  }

  function toggleMenu(){
    if(menuOpen) closeMenu(); else openMenu();
  }

  // ── Scroll to section ──
  function scrollToSection(idx){
    const sec=sections[idx];
    if(!sec) return;
    programmaticScroll=true;
    activeIdx=-1;
    setActive(idx);
    if(menuOpen) closeMenu();
    smoothScrollToEl(sec,'start');
    setTimeout(()=>{programmaticScroll=false;},800);
  }

  const ac=new AbortController();
  window.addEventListener('scroll',onScroll,{passive:true,signal:ac.signal});

  forceActive(0);
  updateActiveFromScroll();

  // Desktop side nav clicks
  sideItems.forEach((item,i)=>{
    item.addEventListener('click',e=>{
      e.preventDefault();
      scrollToSection(i);
    },{signal:ac.signal});
  });

  // Mobile menu item clicks
  menuItems.forEach((item,i)=>{
    item.addEventListener('click',e=>{
      e.preventDefault();
      scrollToSection(i);
    },{signal:ac.signal});
  });

  // Burger button
  if(burgerBtn){
    burgerBtn.addEventListener('click',toggleMenu,{signal:ac.signal});
  }

  // Escape key closes menu
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&menuOpen) closeMenu();
  },{signal:ac.signal});

  _cleanup=()=>{
    ac.abort();
    if(menuOpen) closeMenu();
    _cleanup=null;
  };
}

window.__initBottomNav=initBottomNav;
