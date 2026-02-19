import { MMIND_CARDS } from '../data/mymind.js';
import { esc } from './shared.js';

const mmindApp=document.querySelector('.mymind-app');
const mmindGrid=document.getElementById('mmindGrid');
const mmindPopWrap=document.getElementById('mmindPopWrap');
const mmindPopover=document.getElementById('mmindPopover');
const mmindScrim=document.getElementById('mmindScrim');
const mmindSearchInput=document.getElementById('mmindSearchInput');
const mmindFilters=document.getElementById('mmindFilters');
let mmindActiveIdx=null;
let mmindActiveFilter='all';
let mmindSearchQuery='';

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
  let html=`<div class="pop-header"><div class="pop-title">${card.title}</div><button class="pop-close" id="mmindPopClose">&times;</button></div>`;
  if(card.source)html+=`<a class="pop-source" href="${card.url||'#'}" target="_blank">${card.source} \u2197</a>`;
  if(card.tldr)html+=`<div class="pop-tldr">${card.tldr}</div>`;
  if(card.tags?.length)html+=`<div class="pop-tags">${card.tags.map(t=>`<span class="pop-tag">${t}</span>`).join('')}</div>`;
  html+=`<div class="pop-footer"><span class="pop-date">${card.date}</span><button class="pop-copy" data-copy="${esc(copyText)}"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="5" width="9" height="9" rx="1.5"/><path d="M5 11H3.5A1.5 1.5 0 012 9.5v-7A1.5 1.5 0 013.5 1h7A1.5 1.5 0 0112 2.5V5"/></svg> Copy</button></div>`;
  mmindPopover.innerHTML=html;

  const appRect=mmindApp.getBoundingClientRect();
  const cardRect=cardEl.getBoundingClientRect();
  const gap=12,padding=12;
  const cardCenterX=cardRect.left+cardRect.width/2-appRect.left;
  const appWidth=appRect.width;
  const third=appWidth/3;

  mmindPopWrap.style.top='';mmindPopWrap.style.bottom='';
  mmindPopWrap.style.left='';mmindPopWrap.style.right='';

  if(cardCenterX<third){
    mmindPopWrap.style.left=padding+'px';
    mmindPopover.style.transformOrigin='top left';
  }else if(cardCenterX>third*2){
    mmindPopWrap.style.right=padding+'px';
    mmindPopover.style.transformOrigin='top right';
  }else{
    const popWidth=appWidth*0.52;
    const leftPos=cardCenterX-popWidth/2;
    const clampedLeft=Math.max(padding,Math.min(leftPos,appWidth-popWidth-padding));
    mmindPopWrap.style.left=clampedLeft+'px';
    mmindPopover.style.transformOrigin='top center';
  }

  mmindPopWrap.style.visibility='hidden';
  mmindPopWrap.style.top='0px';
  mmindPopWrap.classList.add('open');
  const popHeight=mmindPopover.offsetHeight;
  mmindPopWrap.classList.remove('open');
  mmindPopWrap.style.visibility='';

  const cardBottom=cardRect.bottom-appRect.top;
  const cardTop=cardRect.top-appRect.top;
  const appHeight=mmindApp.offsetHeight;
  const spaceBelow=appHeight-cardBottom-gap;
  const spaceAbove=cardTop-gap;

  let popTop;
  if(spaceBelow>=popHeight||spaceBelow>=spaceAbove){
    popTop=cardBottom+gap;
    mmindPopover.style.setProperty('--pop-dir','8px');
    mmindPopover.style.transformOrigin=mmindPopover.style.transformOrigin.replace(/^bottom/,'top');
  }else{
    popTop=cardTop-gap-popHeight;
    mmindPopover.style.setProperty('--pop-dir','-8px');
    mmindPopover.style.transformOrigin=mmindPopover.style.transformOrigin.replace(/^top/,'bottom');
  }
  popTop=Math.max(padding,Math.min(popTop,appHeight-popHeight-padding));
  mmindPopWrap.style.top=popTop+'px';

  mmindGrid.querySelectorAll('.mm-card').forEach(c=>c.classList.remove('active'));
  cardEl.classList.add('active');
  mmindActiveIdx=idx;

  mmindPopWrap.classList.remove('open');
  mmindPopWrap.offsetHeight;
  mmindPopWrap.classList.add('open');
  mmindScrim.classList.add('open');

  document.getElementById('mmindPopClose').addEventListener('click',(e)=>{
    e.stopPropagation();
    mmindClosePopover();
  });
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

function mmindClosePopover(){
  mmindPopWrap.classList.remove('open');
  mmindScrim.classList.remove('open');
  mmindGrid.querySelectorAll('.mm-card').forEach(c=>c.classList.remove('active'));
  mmindActiveIdx=null;
}

function mmindRenderGrid(){
  mmindGrid.innerHTML='';
  mmindClosePopover();
  MMIND_CARDS.forEach((card,i)=>{
    if(mmindActiveFilter!=='all'&&card.category!==mmindActiveFilter)return;
    if(mmindSearchQuery){
      const q=mmindSearchQuery.toLowerCase();
      const haystack=[card.title,card.caption,card.text,card.author,card.linkTitle,card.linkDesc,card.source,card.tldr,...(card.tags||[])].filter(Boolean).join(' ').toLowerCase();
      if(!haystack.includes(q))return;
    }
    const el=mmindBuildCard(card,i);
    el.addEventListener('click',()=>{
      if(mmindActiveIdx===i)mmindClosePopover();
      else mmindOpenPopover(i,el);
    });
    mmindGrid.appendChild(el);
  });
}

mmindFilters.addEventListener('click',(e)=>{
  const pill=e.target.closest('.mymind-pill');
  if(!pill)return;
  mmindActiveFilter=pill.dataset.filter;
  mmindFilters.querySelectorAll('.mymind-pill').forEach(p=>
    p.classList.toggle('active',p.dataset.filter===mmindActiveFilter)
  );
  mmindRenderGrid();
});

mmindSearchInput.addEventListener('input',()=>{
  mmindSearchQuery=mmindSearchInput.value.trim();
  mmindRenderGrid();
});

mmindScrim.addEventListener('mousedown',mmindClosePopover);

mmindRenderGrid();
requestAnimationFrame(()=>{
  mmindApp.style.minHeight=mmindApp.offsetHeight+'px';
});

// Keyboard: Escape to close popover
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&mmindActiveIdx!==null){mmindClosePopover();}
});
