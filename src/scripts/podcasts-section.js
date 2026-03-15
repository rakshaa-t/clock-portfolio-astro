// ═══ PODCASTS SECTION ═══
// Cover grid with skeuomorphic play button slide-out on hover.
// Re-initializes on every page load (ViewTransitions compatible).

import PODCASTS from '../data/podcasts.json';
import { esc } from './shared.js';
import { haptic } from './haptics.js';

const PODS_INITIAL=6;

function initPodcasts(){
  const grid=document.getElementById('podcastGrid');
  const showMore=document.getElementById('podcastShowMore');
  if(!grid) return;

  grid.innerHTML=PODCASTS.map((pod,i)=>`
    <a href="${esc(pod.url)}" target="_blank" rel="noopener noreferrer" class="podcast-card${i>=PODS_INITIAL?' podcast-extra':''}" aria-label="${esc(pod.title)}">
      <div class="podcast-card-visual">
        <div class="podcast-card-wrap">
          <div class="podcast-cover">
            <img src="${esc(pod.cover)}" alt="${esc(pod.title)}" loading="lazy" draggable="false">
          </div>
          <div class="podcast-play-btn" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      </div>
      <div class="podcast-meta">
        <span class="podcast-title">${esc(pod.title.length>60?pod.title.slice(0,57)+'…':pod.title)}</span>
        <span class="podcast-channel">${esc(pod.channel)}${pod.guest?' · ft. '+esc(pod.guest):''}</span>
      </div>
    </a>
  `).join('');

  // Show more / less
  if(showMore){
    showMore.classList.toggle('hidden',PODCASTS.length<=PODS_INITIAL);
    let expanded=false;
    showMore.addEventListener('click',()=>{
      haptic('success');
      expanded=!expanded;
      grid.classList.toggle('expanded',expanded);
      showMore.textContent=expanded?'Show fewer media':'Show more media';
      showMore.setAttribute('aria-expanded',expanded);
    });
  }

  // Haptic on tap
  grid.addEventListener('click',(e)=>{
    const card=e.target.closest('.podcast-card');
    if(card) haptic('nudge');
  });
}

window.__initPodcasts=initPodcasts;
