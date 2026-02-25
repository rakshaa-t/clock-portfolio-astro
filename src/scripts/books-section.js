// ═══ BOOKS SECTION ═══
// Cover grid with filter pills and popover highlights.
// Re-initializes on every page load (ViewTransitions compatible).

import { KINDLE_BOOKS } from '../data/books.js';
import { esc, smoothScrollToEl } from './shared.js';

const BOOKS_INITIAL=8;

function getBookCategory(book){
  if(book.fav) return 'excellent';
  if(book.progress===100) return 'great';
  return 'reading';
}

function initBooks(){
  const booksGrid=document.getElementById('booksGrid');
  const bookPopWrap=document.getElementById('bookPopWrap');
  const bookPopover=document.getElementById('bookPopover');
  const bookScrim=document.getElementById('bookScrim');
  const bookFilters=document.getElementById('bookFilters');
  const booksShowMore=document.getElementById('booksShowMore');
  if(!booksGrid||!bookFilters) return;

  let bookActiveIdx=null;
  const bookSection=booksGrid.closest('.browse-section');
  let bookActiveFilter='all';

  function buildCover(book,i){
    const el=document.createElement('div');
    el.className='book-cover-item';
    el.dataset.idx=i;
    el.setAttribute('tabindex','0');
    el.setAttribute('role','button');
    el.setAttribute('aria-label',book.title);
    el.innerHTML=`
      <div class="book-cover-img">
        <img src="${esc(book.cover)}" alt="${esc(book.title)}" loading="lazy">
        ${book.fav?'<div class="book-badge fav" data-tip="Excellent"><svg viewBox="0 0 24 24" fill="#C0392B" stroke="none" width="12" height="12"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z"/></svg></div>':book.progress===100?'<div class="book-badge done" data-tip="Great"><svg viewBox="0 0 24 24" fill="#8B7EC8" stroke="none" width="12" height="12"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z"/></svg></div>':''}
      </div>`;
    return el;
  }

  function openBookPopover(idx,cardEl){
    const book=KINDLE_BOOKS[idx];
    let html=`<div class="pop-header"><div class="pop-title">${esc(book.title)}</div><button class="pop-close" id="bookPopClose" aria-label="Close">\u2715</button></div>`;
    html+=`<div class="book-pop-meta">by ${esc(book.author)}${book.fav?'<span class="book-pop-rating excellent">Excellent</span>':book.progress===100?'<span class="book-pop-rating great">Great</span>':''}</div>`;
    html+=`<div class="book-pop-progress"><div class="book-pop-progress-bar"><div class="book-pop-progress-fill" style="width:100%;transform:scaleX(${book.progress/100})"></div></div><span class="book-pop-pct">${book.progress}%</span></div>`;
    if(book.notes&&book.notes.length>0){
      html+=`<div class="book-pop-highlights">`;
      html+=book.notes.map(n=>`<div class="book-pop-highlight">${n.note}</div>`).join('');
      html+=`</div>`;
    }
    bookPopover.innerHTML=html;

    const isMobile=window.matchMedia('(max-width:480px)').matches;
    if(!isMobile){
      const gridRect=booksGrid.getBoundingClientRect();
      const cardRect=cardEl.getBoundingClientRect();
      const gap=12;
      const viewH=window.innerHeight;
      const popWidth=Math.min(300,gridRect.width);
      let left=cardRect.left+cardRect.width/2-popWidth/2;
      left=Math.max(gridRect.left,Math.min(left,gridRect.right-popWidth));
      bookPopWrap.style.left=left+'px';
      bookPopWrap.style.width=popWidth+'px';
      bookPopWrap.style.visibility='hidden';
      bookPopWrap.style.top='0px';
      bookPopWrap.classList.add('open');
      const popHeight=bookPopover.offsetHeight;
      bookPopWrap.classList.remove('open');
      bookPopWrap.style.visibility='';
      const spaceBelow=viewH-cardRect.bottom-gap;
      const below=spaceBelow>=popHeight;
      let top;
      if(below) top=cardRect.bottom+gap;
      else top=cardRect.top-gap-popHeight;
      top=Math.max(16,Math.min(top,viewH-popHeight-16));
      bookPopWrap.style.top=top+'px';
      // Origin-aware: scale from the trigger card's center
      const originX=cardRect.left+cardRect.width/2-left;
      bookPopover.style.transformOrigin=`${originX}px ${below?'0':'100%'}`;
      bookPopover.style.setProperty('--pop-dir',below?'8px':'-8px');
    }

    booksGrid.querySelectorAll('.book-cover-item').forEach(c=>c.classList.remove('active'));
    cardEl.classList.add('active');
    bookActiveIdx=idx;
    bookPopWrap.classList.remove('open');
    bookPopWrap.offsetHeight;
    bookPopWrap.classList.add('open');
    bookScrim.classList.add('open');
    // Auto-close on scroll outside popover
    stopBookScrollWatch();
    function onBookScroll(e){
      if(bookPopWrap.contains(e.target)) return;
      closeBookPopover();
    }
    window.addEventListener('scroll',onBookScroll,{passive:true,capture:true});
    bookSection._scrollClose=onBookScroll;
    const bookCloseBtn=document.getElementById('bookPopClose');
    bookCloseBtn.addEventListener('click',(e)=>{
      e.stopPropagation();
      closeBookPopover();
    });
    bookCloseBtn.focus();
  }

  function stopBookScrollWatch(){
    if(bookSection._scrollClose){
      window.removeEventListener('scroll',bookSection._scrollClose,{passive:true,capture:true});
      bookSection._scrollClose=null;
    }
  }

  function closeBookPopover(){
    stopBookScrollWatch();
    bookPopWrap.classList.remove('open');
    bookScrim.classList.remove('open');
    booksGrid.querySelectorAll('.book-cover-item').forEach(c=>c.classList.remove('active'));
    bookActiveIdx=null;
  }

  function renderBooks(){
    booksGrid.innerHTML='';
    closeBookPopover();
    const isFiltered=bookActiveFilter!=='all';
    let visibleCount=0;
    KINDLE_BOOKS.forEach((book,i)=>{
      if(isFiltered&&getBookCategory(book)!==bookActiveFilter) return;
      visibleCount++;
      const el=buildCover(book,i);
      if(!isFiltered&&visibleCount>BOOKS_INITIAL) el.classList.add('book-extra');
      function activateBook(){
        const audio=window.__clockAudio;
        if(audio&&audio.soundOn){
          const ctx=audio.ensure();
          if(ctx){
            const t=ctx.currentTime;
            const o=ctx.createOscillator();o.type='sine';
            o.frequency.setValueAtTime(1200,t);o.frequency.exponentialRampToValueAtTime(800,t+0.03);
            const g=ctx.createGain();g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.04);
            o.connect(g);g.connect(ctx.destination);o.start(t);o.stop(t+0.04);
          }
        }
        if(bookActiveIdx===i) closeBookPopover();
        else openBookPopover(i,el);
      }
      el.addEventListener('click',activateBook);
      el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activateBook();}});
      booksGrid.appendChild(el);
    });
    if(booksShowMore){
      booksShowMore.classList.toggle('hidden',isFiltered||visibleCount<=BOOKS_INITIAL);
    }
  }

  bookFilters.addEventListener('click',(e)=>{
    const pill=e.target.closest('.mymind-pill');
    if(!pill) return;
    bookActiveFilter=pill.dataset.filter;
    bookFilters.querySelectorAll('.mymind-pill').forEach(p=>
      p.classList.toggle('active',p.dataset.filter===bookActiveFilter)
    );
    booksGrid.classList.remove('expanded');
    if(booksShowMore) booksShowMore.textContent='Show more books';
    renderBooks();
  });

  if(booksShowMore){
    booksShowMore.addEventListener('click',()=>{
      const expanding=!booksGrid.classList.contains('expanded');
      booksGrid.classList.toggle('expanded');
      booksShowMore.textContent=expanding?'Show fewer books':'Show more books';
      booksShowMore.setAttribute('aria-expanded',expanding);
      if(expanding){
        // Stagger reveal: 50ms between each item (wave top→bottom)
        const extras=[...booksGrid.querySelectorAll('.book-extra')];
        const stagger=0.05;
        extras.forEach((el,i)=>{el.style.animationDelay=`${i*stagger}s`;});
      }else{
        booksGrid.querySelectorAll('.book-extra').forEach(el=>{el.style.animationDelay='';});
        smoothScrollToEl(booksShowMore,'center',0,600);
      }
    });
  }

  bookScrim.addEventListener('mousedown',closeBookPopover);

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&bookActiveIdx!==null) closeBookPopover();
  });

  renderBooks();
}

// Expose for data-astro-rerun inline script (sole init path)
window.__initBooks=initBooks;
