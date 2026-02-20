import { NOTES, GLOSSARY } from '../data/notes.js';
import { esc, prefersReducedMotion } from './shared.js';

const _AC=window.AudioContext||window.webkitAudioContext;

const DEMOS={
  "spring-ball":{
    height:140,hint:"Drag the ball and release",
    init(canvas){
      const ctx=canvas.getContext('2d');
      const w=canvas.width,h=canvas.height;
      let ballX=w/2,ballY=h/2,velX=0,velY=0;
      let targetX=w/2,targetY=h/2;
      let dragging=false,raf,active=false;
      const stiff=0.08,damp=0.78,radius=16;
      function render(){
        ctx.clearRect(0,0,w,h);
        ctx.beginPath();ctx.arc(ballX,ballY,radius+4,0,Math.PI*2);
        ctx.fillStyle='rgba(139,126,200,0.08)';ctx.fill();
        const grad=ctx.createRadialGradient(ballX-4,ballY-4,2,ballX,ballY,radius);
        grad.addColorStop(0,'#A699D4');grad.addColorStop(1,'#7B6CB8');
        ctx.beginPath();ctx.arc(ballX,ballY,radius,0,Math.PI*2);
        ctx.fillStyle=grad;ctx.fill();
        ctx.beginPath();ctx.arc(ballX-4,ballY-5,5,0,Math.PI*2);
        ctx.fillStyle='rgba(255,255,255,0.35)';ctx.fill();
      }
      function step(){
        if(!dragging){
          const dx=targetX-ballX,dy=targetY-ballY;
          velX=(velX+dx*stiff)*damp;velY=(velY+dy*stiff)*damp;
          ballX+=velX;ballY+=velY;
          if(Math.abs(dx)<0.5&&Math.abs(dy)<0.5&&Math.abs(velX)<0.5&&Math.abs(velY)<0.5){
            ballX=targetX;ballY=targetY;render();active=false;return;
          }
        }
        render();raf=requestAnimationFrame(step);
      }
      function start(){if(!active){active=true;raf=requestAnimationFrame(step);}}
      function getPos(e){
        const r=canvas.getBoundingClientRect();
        const t=e.touches?e.touches[0]:e;
        return{x:(t.clientX-r.left)*(w/r.width),y:(t.clientY-r.top)*(h/r.height)};
      }
      canvas.addEventListener('mousedown',e=>{const p=getPos(e);if(Math.hypot(p.x-ballX,p.y-ballY)<radius+10){dragging=true;start();}});
      canvas.addEventListener('mousemove',e=>{if(dragging){const p=getPos(e);ballX=p.x;ballY=p.y;velX=0;velY=0;}});
      canvas.addEventListener('mouseup',()=>{dragging=false;start();});
      canvas.addEventListener('mouseleave',()=>{dragging=false;start();});
      canvas.addEventListener('touchstart',e=>{e.preventDefault();const p=getPos(e);if(Math.hypot(p.x-ballX,p.y-ballY)<radius+20){dragging=true;start();}},{passive:false});
      canvas.addEventListener('touchmove',e=>{e.preventDefault();if(dragging){const p=getPos(e);ballX=p.x;ballY=p.y;velX=0;velY=0;}},{passive:false});
      canvas.addEventListener('touchend',()=>{dragging=false;start();});
      render();
      return()=>{active=false;cancelAnimationFrame(raf);};
    }
  },
  "easing-vs-spring":{
    height:120,hint:"Tap anywhere to trigger both",
    init(canvas){
      const ctx=canvas.getContext('2d');
      const w=canvas.width,h=canvas.height;
      let easingX=40,springX=40,springV=0;
      let targetX=40,animating=false,startTime=0;
      let raf,active=false,autoTimer;
      const radius=10,stiff=0.06,damp=0.75;
      function easeOut(t){return 1-Math.pow(1-t,3);}
      function render(){
        ctx.clearRect(0,0,w,h);
        ctx.font='500 9px Geist, sans-serif';
        ctx.fillStyle='rgba(0,0,0,0.2)';
        ctx.fillText('EASE-OUT',8,h/4+3);
        ctx.fillText('SPRING',8,3*h/4+3);
        ctx.strokeStyle='rgba(0,0,0,0.04)';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(40,h/4);ctx.lineTo(w-20,h/4);ctx.stroke();
        ctx.beginPath();ctx.moveTo(40,3*h/4);ctx.lineTo(w-20,3*h/4);ctx.stroke();
        let g1=ctx.createRadialGradient(easingX-2,h/4-2,1,easingX,h/4,radius);
        g1.addColorStop(0,'#B0AAA2');g1.addColorStop(1,'#8A857D');
        ctx.beginPath();ctx.arc(easingX,h/4,radius,0,Math.PI*2);ctx.fillStyle=g1;ctx.fill();
        let g2=ctx.createRadialGradient(springX-2,3*h/4-2,1,springX,3*h/4,radius);
        g2.addColorStop(0,'#A699D4');g2.addColorStop(1,'#7B6CB8');
        ctx.beginPath();ctx.arc(springX,3*h/4,radius,0,Math.PI*2);ctx.fillStyle=g2;ctx.fill();
      }
      function step(){
        if(animating){
          const elapsed=(performance.now()-startTime)/600;
          const t=Math.min(1,elapsed);
          easingX=40+(targetX-40)*easeOut(t);
          if(t>=1)easingX=targetX;
          const dx=targetX-springX;
          springV=(springV+dx*stiff)*damp;springX+=springV;
          if(t>=1&&Math.abs(dx)<0.5&&Math.abs(springV)<0.5){
            springX=targetX;animating=false;render();active=false;return;
          }
        }
        render();raf=requestAnimationFrame(step);
      }
      function start(){if(!active){active=true;raf=requestAnimationFrame(step);}}
      canvas.addEventListener('click',()=>{
        targetX=targetX>w/2?40:w-40;
        easingX=easingX>w/2?easingX:40;
        startTime=performance.now();animating=true;start();
      });
      if(!prefersReducedMotion){
        autoTimer=setTimeout(()=>{targetX=w-40;startTime=performance.now();animating=true;start();},600);
      }
      render();
      return()=>{active=false;cancelAnimationFrame(raf);clearTimeout(autoTimer);};
    }
  }
};

// Notes DOM refs
const SITE_URL='https://raks.design';
const anotesSlider=document.getElementById('anotesSlider');
const anotesList=document.getElementById('anotesList');
const anotesSearchInput=document.getElementById('anotesSearchInput');
const anotesSearchClear=document.getElementById('anotesSearchClear');
const anotesNoResults=document.getElementById('anotesNoResults');
const anotesSearchDropdown=document.getElementById('anotesSearchDropdown');
const anotesDropdownTags=document.getElementById('anotesDropdownTags');
const anotesSortBtn=document.getElementById('anotesSortBtn');
let currentNote=null;
let activeCleanups=[];
let activeTags=new Set();
let sortAsc=false;
const allTags=[...new Set(NOTES.flatMap(n=>n.tags||[]))].sort();

function renderDropdownTags(){
  anotesDropdownTags.innerHTML=allTags.map(tag=>
    `<span class="tag-capsule${activeTags.has(tag)?' active':''}" data-tag="${tag}">${tag}</span>`
  ).join('');
  anotesDropdownTags.querySelectorAll('.tag-capsule').forEach(cap=>{
    cap.addEventListener('click',(e)=>{
      e.stopPropagation();
      const tag=cap.dataset.tag;
      if(activeTags.has(tag))activeTags.delete(tag);
      else activeTags.add(tag);
      renderDropdownTags();updateSearchChips();filterNotes();
    });
  });
}

function showDropdown(){anotesSearchDropdown.classList.add('open');}
function hideDropdown(){anotesSearchDropdown.classList.remove('open');}

anotesSearchInput.addEventListener('focus',()=>{
  if(!anotesSearchInput.value.trim())showDropdown();
});
document.addEventListener('mousedown',(e)=>{
  const wrap=document.querySelector('.anotes-search-wrap');
  if(wrap&&!wrap.contains(e.target))hideDropdown();
});

function updateSearchChips(){
  document.querySelectorAll('.search-chip').forEach(c=>c.remove());
  const searchBar=document.querySelector('.anotes-search');
  activeTags.forEach(tag=>{
    const chip=document.createElement('span');
    chip.className='search-chip';
    chip.innerHTML=`${esc(tag)}<button>&times;</button>`;
    chip.querySelector('button').addEventListener('click',(e)=>{
      e.stopPropagation();
      activeTags.delete(tag);
      renderDropdownTags();updateSearchChips();filterNotes();
    });
    searchBar.insertBefore(chip,anotesSearchInput);
  });
  anotesSearchClear.classList.toggle('visible',anotesSearchInput.value.trim().length>0||activeTags.size>0);
}

function getSortedIndices(){
  const indices=NOTES.map((_,i)=>i);
  indices.sort((a,b)=>{
    const da=NOTES[a].sortDate||0,db=NOTES[b].sortDate||0;
    return sortAsc?da-db:db-da;
  });
  return indices;
}

function renderList(){
  const sorted=getSortedIndices();
  anotesList.innerHTML=sorted.map((i,pos)=>`
    <div class="anotes-note${pos===0?' active':''}" data-note="${i}">
      <div class="anotes-note-title">${NOTES[i].title}</div>
      <div class="anotes-note-row">
        <span class="anotes-note-date">${NOTES[i].date}</span>
        <span class="anotes-note-preview">${NOTES[i].preview}</span>
      </div>
    </div>
  `).join('');
  anotesSearchInput.placeholder=`Search ${NOTES.length} notes`;
  const footer=document.getElementById('anotesListFooter');
  if(footer)footer.textContent=`${NOTES.length} Note${NOTES.length!==1?'s':''}`;
  anotesList.querySelectorAll('.anotes-note').forEach(el=>{
    el.addEventListener('click',()=>{
      noteClickSound();
      anotesList.querySelectorAll('.anotes-note').forEach(n=>n.classList.remove('active'));
      el.classList.add('active');
      openNote(+el.dataset.note);
    });
  });
  renderDropdownTags();
}

anotesSortBtn.addEventListener('click',()=>{
  sortAsc=!sortAsc;
  anotesSortBtn.classList.toggle('asc',sortAsc);
  anotesSortBtn.querySelector('span').textContent=sortAsc?'Oldest':'Newest';
  renderList();filterNotes();
});

function filterNotes(){
  const raw=anotesSearchInput.value.trim();
  const inlineTags=[];
  const textQuery=raw.replace(/#(\w+)/g,(_,tag)=>{
    inlineTags.push(tag.toLowerCase());return '';
  }).toLowerCase().trim();
  const allActiveTags=new Set([...activeTags,...inlineTags.map(t=>allTags.find(at=>at.toLowerCase()===t)||t)]);
  const items=anotesList.querySelectorAll('.anotes-note');
  let v=0;
  items.forEach(el=>{
    const n=NOTES[+el.dataset.note];
    const noteTags=(n.tags||[]).map(t=>t.toLowerCase());
    const tagMatch=allActiveTags.size===0||[...allActiveTags].some(t=>noteTags.includes(t.toLowerCase()));
    const textMatch=!textQuery||(n.title+' '+n.preview+' '+n.date+' '+noteTags.join(' ')).toLowerCase().includes(textQuery);
    const show=tagMatch&&textMatch;
    el.style.display=show?'':'none';
    if(show)v++;
  });
  anotesNoResults.classList.toggle('visible',v===0);
}

anotesSearchInput.addEventListener('input',()=>{
  const hasText=anotesSearchInput.value.trim().length>0;
  anotesSearchClear.classList.toggle('visible',hasText||activeTags.size>0);
  if(hasText)hideDropdown();else showDropdown();
  filterNotes();
});
anotesSearchClear.addEventListener('click',()=>{
  anotesSearchInput.value='';activeTags.clear();
  renderDropdownTags();updateSearchChips();filterNotes();
  anotesSearchClear.classList.remove('visible');hideDropdown();
  anotesSearchInput.focus();
});

function renderBody(note){
  const container=document.getElementById('anotesReaderBody');
  activeCleanups.forEach(fn=>fn&&fn());activeCleanups=[];
  if(!note.rich){container.innerHTML=typeof note.body==='string'?note.body:'';return;}
  container.innerHTML='';
  note.body.forEach(block=>{
    if(block.type==='text'){
      const div=document.createElement('div');div.innerHTML=block.html;container.appendChild(div);
    }else if(block.type==='callout'){
      const div=document.createElement('div');div.className='note-callout';div.textContent=block.html;container.appendChild(div);
    }else if(block.type==='code'){
      const wrap=document.createElement('div');wrap.style.cssText='position:relative;';
      const pre=document.createElement('div');pre.className='note-code';pre.innerHTML=block.html;
      const copyBtn=document.createElement('button');copyBtn.className='note-code-copy';copyBtn.textContent='copy';
      const rawText=pre.textContent;
      copyBtn.addEventListener('click',()=>{navigator.clipboard.writeText(rawText);copyBtn.textContent='copied';setTimeout(()=>copyBtn.textContent='copy',1500);});
      wrap.appendChild(pre);wrap.appendChild(copyBtn);container.appendChild(wrap);
    }else if(block.type==='image'){
      const wrap=document.createElement('div');wrap.className='note-img';
      if(block.src){
        const img=document.createElement('img');img.src=block.src;img.alt=block.caption||'';img.loading='lazy';
        wrap.appendChild(img);
      }else{
        const placeholder=document.createElement('div');
        placeholder.style.cssText=`width:100%;height:160px;background:${block.gradient};border-radius:10px;`;
        wrap.appendChild(placeholder);
      }
      container.appendChild(wrap);
      if(block.caption){const cap=document.createElement('div');cap.className='note-img-caption';cap.textContent=block.caption;container.appendChild(cap);}
    }else if(block.type==='embed'){
      const wrap=document.createElement('div');wrap.className='note-embed';
      const ph=document.createElement('div');ph.className='note-embed-placeholder';
      const lbl=document.createElement('div');lbl.className='note-embed-label';lbl.textContent='Interactive prototype';
      const btn=document.createElement('button');btn.className='note-embed-btn';btn.textContent='Try it';
      ph.appendChild(lbl);ph.appendChild(btn);wrap.appendChild(ph);
      ph.addEventListener('click',()=>{
        const iframe=document.createElement('iframe');iframe.src=block.src;iframe.loading='lazy';
        iframe.setAttribute('sandbox','allow-scripts allow-same-origin');
        wrap.replaceChild(iframe,ph);
      });
      container.appendChild(wrap);
      if(block.caption){const cap=document.createElement('div');cap.className='note-embed-caption';cap.textContent=block.caption;container.appendChild(cap);}
    }else if(block.type==='demo'){
      const demo=DEMOS[block.id];if(!demo)return;
      const wrap=document.createElement('div');wrap.className='note-demo';
      const label=document.createElement('div');label.className='note-demo-label';label.textContent='Interactive';wrap.appendChild(label);
      const canvas=document.createElement('canvas');canvas.width=460;canvas.height=demo.height||140;wrap.appendChild(canvas);
      if(demo.hint){const hint=document.createElement('div');hint.className='note-demo-hint';hint.textContent=demo.hint;wrap.appendChild(hint);}
      container.appendChild(wrap);
      requestAnimationFrame(()=>{const cleanup=demo.init(canvas);if(cleanup)activeCleanups.push(cleanup);});
    }
  });
  // Bind glossary terms
  container.querySelectorAll('.term').forEach(el=>{
    el.addEventListener('click',(e)=>{
      e.stopPropagation();
      document.querySelectorAll('.popover.visible').forEach(p=>p.classList.remove('visible'));
      const key=el.dataset.term;const def=GLOSSARY[key];if(!def)return;
      let pop=document.querySelector('.popover[data-key="'+key+'"]');
      if(!pop){
        pop=document.createElement('div');pop.className='popover';pop.dataset.key=key;
        pop.innerHTML=`<div class="popover-title">${def.title}</div><div class="popover-desc">${def.desc}</div>`;
        document.body.appendChild(pop);
      }
      const termRect=el.getBoundingClientRect();
      const winRect=document.querySelector('.anotes-window').getBoundingClientRect();
      const popW=220;
      let left=termRect.left+termRect.width/2-popW/2;
      left=Math.max(winRect.left+8,Math.min(left,winRect.right-popW-8));
      pop.style.visibility='hidden';pop.style.display='block';pop.style.left=left+'px';pop.style.top='0px';
      const popH=pop.offsetHeight;pop.style.visibility='';pop.style.display='';
      let top=termRect.top-popH-8;
      if(top<winRect.top+8)top=termRect.bottom+8;
      pop.style.left=left+'px';pop.style.top=top+'px';
      requestAnimationFrame(()=>pop.classList.add('visible'));
    });
  });
}

document.addEventListener('click',()=>{
  document.querySelectorAll('.popover.visible').forEach(p=>p.classList.remove('visible'));
});

function openNote(idx){
  currentNote=idx;const n=NOTES[idx];
  document.getElementById('anotesReaderDate').textContent=n.date;
  document.getElementById('anotesReaderTitle').textContent=n.title;
  document.getElementById('anotesReaderTags').innerHTML=(n.tags||[]).map(t=>`<span class="reader-tag">${esc(t)}</span>`).join('');
  renderBody(n);
  document.getElementById('anotesReaderScroll').scrollTop=0;
  anotesSlider.classList.add('show-reader');
}
function closeNote(){
  anotesSlider.classList.remove('show-reader');
  activeCleanups.forEach(fn=>fn&&fn());activeCleanups=[];
  currentNote=null;
}
function shareOnX(){
  if(currentNote===null)return;
  window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(`"${NOTES[currentNote].title}"\n\n${SITE_URL}`)}`, '_blank');
}

document.getElementById('anotesReaderBack').addEventListener('click',closeNote);
document.getElementById('anotesFooterShare').addEventListener('click',shareOnX);
document.getElementById('anotesFooterCopy').addEventListener('click',()=>{
  const body=document.getElementById('anotesReaderBody');
  if(!body)return;
  navigator.clipboard.writeText(body.innerText);
  const btn=document.getElementById('anotesFooterCopy');
  btn.textContent='Copied!';setTimeout(()=>btn.textContent='Copy note',1500);
});

// Magic Mouse click sound
let _mouseClickBuf=null,_mouseClickRaw=null;
fetch('/magic-mouse-click.mp3')
  .then(r=>r.arrayBuffer())
  .then(ab=>{_mouseClickRaw=ab;})
  .catch(()=>{});
function _ensureClickBuf(){
  if(_mouseClickBuf||!_mouseClickRaw)return;
  const audio=window.__clockAudio;
  if(!audio)return;
  const ctx=audio.ensure();
  if(!ctx)return;
  ctx.decodeAudioData(_mouseClickRaw.slice(0)).then(buf=>{_mouseClickBuf=buf;_mouseClickRaw=null;}).catch(()=>{});
}
function noteClickSound(){
  const audio=window.__clockAudio;
  if(!audio||!audio.soundOn)return;
  _ensureClickBuf();
  if(!_mouseClickBuf)return;
  const ctx=audio.ensure();
  if(!ctx)return;
  const src=ctx.createBufferSource();
  src.buffer=_mouseClickBuf;
  const vol=ctx.createGain();
  vol.gain.value=0.18;
  src.connect(vol);vol.connect(ctx.destination);
  src.start();
}

renderList();

// Keyboard: Escape to close note
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&currentNote!==null){closeNote();}
});

// Listen for open-note events from clock popover
document.addEventListener('open-note',e=>{
  if(e.detail&&typeof e.detail.idx==='number')openNote(e.detail.idx);
});
