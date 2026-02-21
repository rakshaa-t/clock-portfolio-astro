// ═══ BOOKS SECTION ═══
// Cover grid with filter pills and popover highlights.
// Same spatial popover pattern as mymind — one tap to see, tap elsewhere to dismiss.

import { KINDLE_BOOKS } from '../data/books.js';
import { esc } from './shared.js';

const booksGrid=document.getElementById('booksGrid');
const bookPopWrap=document.getElementById('bookPopWrap');
const bookPopover=document.getElementById('bookPopover');
const bookScrim=document.getElementById('bookScrim');
const bookFilters=document.getElementById('bookFilters');
const booksShowMore=document.getElementById('booksShowMore');

const BOOKS_INITIAL=8;
let bookActiveIdx=null;
let bookActiveFilter='all';

function getBookCategory(book){
  if(book.fav) return 'excellent';
  if(book.progress===100) return 'great';
  return 'reading';
}

function buildCover(book,i){
  const el=document.createElement('div');
  el.className='book-cover-item';
  el.dataset.idx=i;
  el.innerHTML=`
    <div class="book-cover-img">
      <img src="${esc(book.cover)}" alt="${esc(book.title)}" loading="lazy">
      ${book.fav?'<div class="book-badge fav" title="Excellent"><svg viewBox="0 0 24 24" fill="#C0392B" stroke="none" width="12" height="12"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z"/></svg></div>':book.progress===100?'<div class="book-badge done" title="Great"><svg viewBox="0 0 24 24" fill="#8B7EC8" stroke="none" width="12" height="12"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z"/></svg></div>':''}
    </div>`;
  return el;
}

function openBookPopover(idx,cardEl){
  const book=KINDLE_BOOKS[idx];

  // Build popover content
  let html=`<div class="pop-header"><div class="pop-title">${esc(book.title)}</div><button class="pop-close" id="bookPopClose">&times;</button></div>`;
  html+=`<div class="book-pop-meta">by ${esc(book.author)}</div>`;
  html+=`<div class="book-pop-progress"><div class="book-pop-progress-bar"><div class="book-pop-progress-fill" style="width:${book.progress}%"></div></div><span class="book-pop-pct">${book.progress}%</span></div>`;

  if(book.notes&&book.notes.length>0){
    html+=`<div class="book-pop-highlights">`;
    html+=book.notes.map(n=>`<div class="book-pop-highlight">${n.note}</div>`).join('');
    html+=`</div>`;
  }

  bookPopover.innerHTML=html;

  // Use the grid container as the bounding box so popover never exceeds content width
  const gridRect=booksGrid.getBoundingClientRect();
  const cardRect=cardEl.getBoundingClientRect();
  const gap=12;
  const viewH=window.innerHeight;
  const popWidth=Math.min(300,gridRect.width);

  // Horizontal — clamp within grid bounds
  let left=cardRect.left+cardRect.width/2-popWidth/2;
  left=Math.max(gridRect.left,Math.min(left,gridRect.right-popWidth));
  bookPopWrap.style.left=left+'px';
  bookPopWrap.style.width=popWidth+'px';

  // Measure pop height
  bookPopWrap.style.visibility='hidden';
  bookPopWrap.style.top='0px';
  bookPopWrap.classList.add('open');
  const popHeight=bookPopover.offsetHeight;
  bookPopWrap.classList.remove('open');
  bookPopWrap.style.visibility='';

  // Vertical — below card, flip above if needed
  const spaceBelow=viewH-cardRect.bottom-gap;
  let top;
  if(spaceBelow>=popHeight){
    top=cardRect.bottom+gap;
  }else{
    top=cardRect.top-gap-popHeight;
  }
  top=Math.max(16,Math.min(top,viewH-popHeight-16));
  bookPopWrap.style.top=top+'px';

  // Activate
  booksGrid.querySelectorAll('.book-cover-item').forEach(c=>c.classList.remove('active'));
  cardEl.classList.add('active');
  bookActiveIdx=idx;

  bookPopWrap.classList.remove('open');
  bookPopWrap.offsetHeight;
  bookPopWrap.classList.add('open');
  bookScrim.classList.add('open');

  // Close button
  document.getElementById('bookPopClose').addEventListener('click',(e)=>{
    e.stopPropagation();
    closeBookPopover();
  });
}

function closeBookPopover(){
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
    el.addEventListener('click',()=>{
      // Click sound
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
    });
    booksGrid.appendChild(el);
  });

  // Show/hide show-more button
  if(booksShowMore){
    booksShowMore.classList.toggle('hidden',isFiltered||visibleCount<=BOOKS_INITIAL);
  }
}

// Filter pills
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

// Show more
if(booksShowMore){
  booksShowMore.addEventListener('click',()=>{
    const expanding=!booksGrid.classList.contains('expanded');
    booksGrid.classList.toggle('expanded');
    booksShowMore.textContent=expanding?'Show fewer books':'Show more books';
  });
}

// Scrim dismiss
bookScrim.addEventListener('mousedown',closeBookPopover);

// Keyboard
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&bookActiveIdx!==null) closeBookPopover();
});

renderBooks();
