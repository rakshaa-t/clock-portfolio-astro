// ═══ MYMIND FLAT ═══
// Mymind masonry grid without container shell.
// Re-initializes on every page load (ViewTransitions compatible).

import { MMIND_CARDS } from '../data/mymind.js';
import { esc, smoothScrollToEl } from './shared.js';

const MMIND_INITIAL=9;

function initMymind(){
  const mmindGrid=document.getElementById('mmindGrid');
  const mmindPopWrap=document.getElementById('mmindPopWrap');
  const mmindPopover=document.getElementById('mmindPopover');
  const mmindScrim=document.getElementById('mmindScrim');
  const mmindSearchInput=document.getElementById('mmindSearchInput');
  const mmindFilters=document.getElementById('mmindFilters');
  const mmindShowMore=document.getElementById('mmindShowMore');
  if(!mmindGrid||!mmindFilters) return;

  let mmindActiveIdx=null;
  let mmindActiveFilter='all';
  let mmindSearchQuery='';
  const mmindSection=mmindGrid.closest('.browse-section');

  function mmindBuildCard(card,i){
    const el=document.createElement('div');
    el.className='mm-card';
    el.dataset.idx=i;
    if(card.type==='image'){
      el.classList.add('mm-img-card');
      if(card.img){
        el.innerHTML=`<div class="mm-thumb" style="height:${card.height}px;"><img src="${card.img}" alt="${esc(card.caption)}" loading="lazy"></div><div class="mm-caption">${card.caption}</div>`;
      }else{
        el.innerHTML=`<div class="mm-thumb" style="background:${card.color};height:${card.height}px;"></div><div class="mm-caption">${card.caption}</div>`;
      }
    }else if(card.type==='note'){
      el.classList.add('mm-note-card');
      el.innerHTML=`<p>${card.text}</p>${card.author?`<span class="mm-author">\u2014 ${card.author}</span>`:''}`;
    }else if(card.type==='link'){
      el.classList.add('mm-link-card');
      el.innerHTML=`<div class="mm-link-icon">${card.icon}</div><div class="mm-link-title">${card.linkTitle}</div><div class="mm-link-desc">${card.linkDesc}</div>`;
    }
    return el;
  }

  function mmindOpenPopover(idx,cardEl){
    const card=MMIND_CARDS[idx];
    const copyText=card.url&&card.url!=='#'?card.url:(card.text||card.title);
    let html=`<div class="pop-header"><div class="pop-title">${card.title}</div><button class="pop-close" id="mmindPopClose" aria-label="Close">\u2715</button></div>`;
    if(card.source)html+=`<a class="pop-source" href="${card.url||'#'}" target="_blank">${card.source} \u2197</a>`;
    if(card.tldr)html+=`<div class="pop-tldr">${card.tldr}</div>`;
    if(card.tags?.length)html+=`<div class="pop-tags">${card.tags.map(t=>`<span class="pop-tag">${t}</span>`).join('')}</div>`;
    html+=`<div class="pop-footer"><span class="pop-date">${card.date}</span><button class="pop-copy" data-copy="${esc(copyText)}"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="5" width="9" height="9" rx="1.5"/><path d="M5 11H3.5A1.5 1.5 0 012 9.5v-7A1.5 1.5 0 013.5 1h7A1.5 1.5 0 0112 2.5V5"/></svg> Copy</button></div>`;
    mmindPopover.innerHTML=html;

    const isMobile=window.matchMedia('(max-width:480px)').matches;
    if(!isMobile){
      const gridRect=mmindGrid.getBoundingClientRect();
      const sectionRect=mmindSection.getBoundingClientRect();
      const cardRect=cardEl.getBoundingClientRect();
      const gap=12;
      const popWidth=Math.min(280,gridRect.width);
      let left=cardRect.left+cardRect.width/2-popWidth/2;
      left=Math.max(gridRect.left,Math.min(left,gridRect.right-popWidth));
      mmindPopWrap.style.left=left+'px';
      mmindPopWrap.style.right='';
      mmindPopWrap.style.width=popWidth+'px';
      mmindPopWrap.style.visibility='hidden';
      mmindPopWrap.style.top='0px';
      mmindPopWrap.classList.add('open');
      const popHeight=mmindPopover.offsetHeight;
      mmindPopWrap.classList.remove('open');
      mmindPopWrap.style.visibility='';
      const spaceBelow=sectionRect.bottom-cardRect.bottom-gap;
      const below=spaceBelow>=popHeight;
      let top;
      if(below) top=cardRect.bottom+gap;
      else top=cardRect.top-gap-popHeight;
      top=Math.max(sectionRect.top,Math.min(top,sectionRect.bottom-popHeight));
      mmindPopWrap.style.top=top+'px';
      // Origin-aware: scale from the trigger card's center
      const originX=cardRect.left+cardRect.width/2-left;
      mmindPopover.style.transformOrigin=`${originX}px ${below?'0':'100%'}`;
      mmindPopover.style.setProperty('--pop-dir',below?'6px':'-6px');
    }

    mmindGrid.querySelectorAll('.mm-card').forEach(c=>c.classList.remove('active'));
    cardEl.classList.add('active');
    mmindActiveIdx=idx;
    mmindPopWrap.classList.remove('open');
    mmindPopWrap.offsetHeight;
    mmindPopWrap.classList.add('open');
    mmindScrim.classList.add('open');
    // Auto-close on any scroll
    stopMmindScrollWatch();
    function onMmindScroll(){ mmindClosePopover(); }
    window.addEventListener('scroll',onMmindScroll,{passive:true,capture:true,once:true});
    mmindSection._scrollClose=onMmindScroll;

    const mmindCloseBtn=document.getElementById('mmindPopClose');
    mmindCloseBtn.addEventListener('click',(e)=>{
      e.stopPropagation();
      mmindClosePopover();
    });
    mmindCloseBtn.focus();
    const copyBtn=mmindPopover.querySelector('.pop-copy');
    if(copyBtn){
      copyBtn.addEventListener('click',(e)=>{
        e.stopPropagation();
        navigator.clipboard.writeText(copyBtn.dataset.copy).then(()=>{
          copyBtn.innerHTML='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 8 7 11 12 5"/></svg> Copied!';
          copyBtn.classList.add('copied');
          setTimeout(()=>{
            copyBtn.innerHTML='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="5" width="9" height="9" rx="1.5"/><path d="M5 11H3.5A1.5 1.5 0 012 9.5v-7A1.5 1.5 0 013.5 1h7A1.5 1.5 0 0112 2.5V5"/></svg> Copy';
            copyBtn.classList.remove('copied');
          },1500);
        });
      });
    }
  }

  function stopMmindScrollWatch(){
    if(mmindSection._scrollClose){
      window.removeEventListener('scroll',mmindSection._scrollClose,{passive:true,capture:true});
      mmindSection._scrollClose=null;
    }
  }

  function mmindClosePopover(){
    stopMmindScrollWatch();
    mmindPopWrap.classList.remove('open');
    mmindScrim.classList.remove('open');
    mmindGrid.querySelectorAll('.mm-card').forEach(c=>c.classList.remove('active'));
    mmindActiveIdx=null;
  }

  function mmindRenderGrid(){
    mmindGrid.innerHTML='';
    mmindClosePopover();
    const isFiltered=mmindActiveFilter!=='all'||mmindSearchQuery;
    const colCount=window.matchMedia('(max-width:480px)').matches?2:3;
    // Create column containers
    const cols=[];
    for(let c=0;c<colCount;c++){
      const col=document.createElement('div');
      col.className='mm-col';
      mmindGrid.appendChild(col);
      cols.push(col);
    }
    const colHeights=new Array(colCount).fill(0);
    let visibleCount=0;
    MMIND_CARDS.forEach((card,i)=>{
      if(mmindActiveFilter!=='all'&&card.category!==mmindActiveFilter)return;
      if(mmindSearchQuery){
        const q=mmindSearchQuery.toLowerCase();
        const haystack=[card.title,card.caption,card.text,card.author,card.linkTitle,card.linkDesc,card.source,card.tldr,...(card.tags||[])].filter(Boolean).join(' ').toLowerCase();
        if(!haystack.includes(q))return;
      }
      visibleCount++;
      const el=mmindBuildCard(card,i);
      el.setAttribute('tabindex','0');
      el.setAttribute('role','button');
      el.setAttribute('aria-label',card.title||card.caption||'Bookmark');
      function activateCard(){
        if(mmindActiveIdx===i)mmindClosePopover();
        else mmindOpenPopover(i,el);
      }
      el.addEventListener('click',activateCard);
      el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activateCard();}});
      const isExtra=!isFiltered&&visibleCount>MMIND_INITIAL;
      if(isExtra) el.classList.add('mm-extra');
      // Shortest-column-first using estimated heights (no DOM measurement)
      let shortest=0;
      for(let c=1;c<colCount;c++){
        if(colHeights[c]<colHeights[shortest]) shortest=c;
      }
      cols[shortest].appendChild(el);
      // Estimate card height from data
      let h=80;
      if(card.type==='image') h=(card.height||120)+32;
      else if(card.type==='note') h=Math.max(80,Math.ceil((card.text||'').length/28)*18+40);
      else if(card.type==='link') h=85;
      colHeights[shortest]+=h+8;
    });
    if(mmindShowMore){
      mmindShowMore.classList.toggle('hidden',isFiltered||visibleCount<=MMIND_INITIAL);
    }
  }

  mmindFilters.addEventListener('click',(e)=>{
    const pill=e.target.closest('.mymind-pill');
    if(!pill)return;
    mmindActiveFilter=pill.dataset.filter;
    mmindFilters.querySelectorAll('.mymind-pill').forEach(p=>
      p.classList.toggle('active',p.dataset.filter===mmindActiveFilter)
    );
    // Reset expanded state so extras don't occupy invisible layout space
    mmindGrid.querySelectorAll('.mm-extra').forEach(el=>{
      el.getAnimations().forEach(a=>a.cancel());
      el.style.opacity='';el.style.transform='';
    });
    mmindGrid.classList.remove('expanded');
    if(mmindShowMore) mmindShowMore.textContent='Show more bookmarks';
    mmindRenderGrid();
  });

  mmindSearchInput.addEventListener('input',()=>{
    mmindSearchQuery=mmindSearchInput.value.trim();
    mmindGrid.querySelectorAll('.mm-extra').forEach(el=>{
      el.getAnimations().forEach(a=>a.cancel());
      el.style.opacity='';el.style.transform='';
    });
    mmindGrid.classList.remove('expanded');
    if(mmindShowMore) mmindShowMore.textContent='Show more bookmarks';
    mmindRenderGrid();
  });

  mmindScrim.addEventListener('mousedown',mmindClosePopover);

  mmindRenderGrid();

  if(mmindShowMore){
    mmindShowMore.addEventListener('click',()=>{
      const expanding=!mmindGrid.classList.contains('expanded');
      mmindGrid.classList.toggle('expanded');
      mmindShowMore.textContent=expanding?'Show fewer bookmarks':'Show more bookmarks';
      mmindShowMore.setAttribute('aria-expanded',expanding);
      if(expanding){
        // Items are now display:block; opacity:0 (CSS).
        // Sort by visual position then reveal with WAAPI (compositor-thread, precise timing).
        const extras=[...mmindGrid.querySelectorAll('.mm-extra')];
        extras.sort((a,b)=>{
          const ra=a.getBoundingClientRect(),rb=b.getBoundingClientRect();
          return ra.top-rb.top||ra.left-rb.left;
        });
        const stagger=50;
        extras.forEach((el,i)=>{
          const anim=el.animate([
            {opacity:0,transform:'translateY(12px)'},
            {opacity:1,transform:'translateY(0)'}
          ],{duration:300,delay:i*stagger,easing:'cubic-bezier(0.32,0.72,0,1)',fill:'forwards'});
          anim.onfinish=()=>{el.style.opacity='1';el.style.transform='translateY(0)';};
        });
      }else{
        // Cancel any running animations, clear inline styles
        mmindGrid.querySelectorAll('.mm-extra').forEach(el=>{
          el.getAnimations().forEach(a=>a.cancel());
          el.style.opacity='';el.style.transform='';
        });
        smoothScrollToEl(mmindShowMore,'center',0,600);
      }
    });
  }

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&mmindActiveIdx!==null){mmindClosePopover();}
  });
}

// Expose for data-astro-rerun inline script (sole init path)
window.__initMymind=initMymind;
