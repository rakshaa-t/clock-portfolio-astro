// Showcase mosaic grid — filters, lazy video, hover states.

import { prefersReducedMotion } from './shared.js';
import { haptic } from './haptics.js';

function initShowcaseGrid() {
  const mosaic = document.getElementById('showcaseMosaic');
  const filters = document.getElementById('showcaseFilters');
  if (!mosaic) return;

  if (mosaic.dataset.showcaseInit === '1') return;
  mosaic.dataset.showcaseInit = '1';

  let activeFilter = 'all';

  if (filters) {
    filters.addEventListener('click', (e) => {
      const pill = e.target.closest('.mymind-pill');
      if (!pill) return;
      haptic(15);
      activeFilter = pill.dataset.filter;
      filters.querySelectorAll('.mymind-pill').forEach((p) =>
        p.classList.toggle('active', p.dataset.filter === activeFilter)
      );
      const isFiltered = activeFilter !== 'all';
      mosaic.querySelectorAll('.showcase-tile').forEach((tile) => {
        const cat = tile.dataset.category;
        const hidden = isFiltered && cat !== activeFilter;
        tile.classList.toggle('filter-hidden', hidden);
      });
    });
  }

  const canHover = window.matchMedia('(hover: hover)').matches;
  if (canHover) {
    mosaic.querySelectorAll('.showcase-tile').forEach((tile) => {
      tile.addEventListener('mouseenter', () => tile.classList.add('is-hovered'));
      tile.addEventListener('mouseleave', () => tile.classList.remove('is-hovered'));
      tile.addEventListener('focusin', () => tile.classList.add('is-hovered'));
      tile.addEventListener('focusout', () => tile.classList.remove('is-hovered'));
    });
  }

  const videos = mosaic.querySelectorAll('video');
  videos.forEach((v) => {
    if (prefersReducedMotion) v.pause();
    v.addEventListener('loadeddata', () => v.classList.add('loaded'), { once: true });
    v.addEventListener('playing', () => v.classList.add('loaded'), { once: true });
    setTimeout(() => v.classList.add('loaded'), 2000);
  });

  if (!prefersReducedMotion && videos.length) {
    const vidObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.play().catch(() => {});
          else e.target.pause();
        });
      },
      { threshold: 0.25 }
    );
    videos.forEach((v) => vidObs.observe(v));
    document.addEventListener(
      'astro:before-swap',
      () => {
        vidObs.disconnect();
      },
      { once: true }
    );
  }
}

window.__initShowcaseGrid = initShowcaseGrid;
document.addEventListener('astro:page-load', () => {
  if (document.getElementById('showcaseMosaic')) initShowcaseGrid();
});
