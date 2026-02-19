import { KINDLE_BOOKS } from '../data/books.js';
import { esc, prefersReducedMotion } from './shared.js';

const kindleScreenEl=document.getElementById('kindleScreen');
const kindleGrid=document.getElementById('kindleGrid');
const kindleLibraryView=document.getElementById('kindleLibraryView');
const kindleDetailView=document.getElementById('kindleDetailView');
const kindleBack=document.getElementById('kindleBack');
const kindleNotesBtn=document.getElementById('kindleNotesBtn');
const kindleDrawer=document.getElementById('kindleDrawer');
const kindleDrawerOverlay=document.getElementById('kindleDrawerOverlay');
const kindleDrawerClose=document.getElementById('kindleDrawerClose');
const kindleDrawerContent=document.getElementById('kindleDrawerContent');

function kindleRenderLibrary(){
  kindleGrid.innerHTML='';
  KINDLE_BOOKS.forEach((book,i)=>{
    const el=document.createElement('div');
    el.className='kindle-grid-book';
    el.innerHTML=`
      <div class="kindle-grid-cover">
        <img src="${esc(book.cover)}" alt="${esc(book.title)}" loading="lazy">
        ${book.fav?'<div class="kindle-fav"><div class="kindle-fav-inner"><svg viewBox="0 0 24 24" fill="#C0392B" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z"/></svg></div><div class="kindle-fav-tip">Excellent</div></div>':book.progress===100?'<div class="kindle-fav"><div class="kindle-fav-inner"><svg viewBox="0 0 24 24" fill="#8B7EC8" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z"/></svg></div><div class="kindle-fav-tip">Great</div></div>':''}
      </div>`;
    const fav=el.querySelector('.kindle-fav');
    if(fav){
      fav.addEventListener('touchstart',(e)=>{
        e.stopPropagation();
        const tip=fav.querySelector('.kindle-fav-tip');
        if(tip){tip.classList.toggle('show');}
      },{passive:true});
    }
    el.addEventListener('click',()=>kindleOpenDetail(i));
    kindleGrid.appendChild(el);
  });
}

function kindleOpenDetail(idx){
  const book=KINDLE_BOOKS[idx];
  if(!prefersReducedMotion){
    kindleScreenEl.classList.remove('eink-flash');
    kindleScreenEl.offsetHeight;
    kindleScreenEl.classList.add('eink-flash');
    kindleScreenEl.addEventListener('animationend',()=>kindleScreenEl.classList.remove('eink-flash'),{once:true});
  }
  const coverEl=document.getElementById('kindleDetailCover');
  coverEl.innerHTML=`<img src="${esc(book.cover)}" alt="${esc(book.title)}">`;
  document.getElementById('kindleDetailTopTitle').textContent=book.title.length>30?book.title.substring(0,30)+'\u2026':book.title;
  document.getElementById('kindleDetailSubtitle').textContent=book.title;
  document.getElementById('kindleDetailBy').textContent='by '+book.author;
  document.getElementById('kindleDetailPct').textContent=book.progress+'%';
  document.getElementById('kindleDetailFill').style.width=book.progress+'%';
  const detailFav=document.getElementById('kindleDetailFav');
  if(book.fav){
    detailFav.classList.remove('hidden');
    detailFav.classList.add('top');
    detailFav.textContent='Excellent';
  }else if(book.progress===100){
    detailFav.classList.remove('hidden','top');
    detailFav.textContent='Great';
  }else{
    detailFav.classList.add('hidden');
    detailFav.classList.remove('top');
  }
  if(book.notes&&book.notes.length>0){
    kindleDrawerContent.innerHTML=book.notes.map(n=>
      `<div class="kindle-highlight">
        <div class="kindle-highlight-note">${n.note}</div>
      </div>`).join('');
  }else{
    kindleDrawerContent.innerHTML='<div class="kindle-no-notes">No highlights yet</div>';
  }
  kindleDrawer.classList.remove('open');
  kindleDrawerOverlay.classList.remove('open');
  kindleNotesBtn.classList.remove('active');
  kindleLibraryView.classList.add('hidden');
  kindleDetailView.classList.remove('hidden');
}

function kindleCloseDetail(){
  kindleCloseDrawer();
  if(!prefersReducedMotion){
    kindleScreenEl.classList.remove('eink-flash');
    kindleScreenEl.offsetHeight;
    kindleScreenEl.classList.add('eink-flash');
    kindleScreenEl.addEventListener('animationend',()=>kindleScreenEl.classList.remove('eink-flash'),{once:true});
  }
  kindleDetailView.classList.add('hidden');
  kindleLibraryView.classList.remove('hidden');
}

function kindleOpenDrawer(){
  kindleDrawer.classList.add('open');
  kindleDrawerOverlay.classList.add('open');
  kindleNotesBtn.classList.add('active');
}
function kindleCloseDrawer(){
  kindleDrawer.classList.remove('open');
  kindleDrawerOverlay.classList.remove('open');
  kindleNotesBtn.classList.remove('active');
}

kindleBack.addEventListener('click',kindleCloseDetail);
kindleNotesBtn.addEventListener('click',()=>{
  if(kindleDrawer.classList.contains('open')) kindleCloseDrawer();
  else kindleOpenDrawer();
});
kindleDrawerClose.addEventListener('click',kindleCloseDrawer);
kindleDrawerOverlay.addEventListener('click',kindleCloseDrawer);
kindleRenderLibrary();
