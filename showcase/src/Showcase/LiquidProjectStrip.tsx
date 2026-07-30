import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  SHOWCASE_PROJECTS,
  type ShowcaseProject,
} from './showcaseProjects';

const CARD_GAP = 4;
const DEFAULT_ASPECT = 1.42;

/** Pre-measured strip aspects — stops cards resizing one-by-one on first paint. */
const STRIP_ASPECT_SEEDS: Record<string, number> = {
  'figma-org-structure': 1.42,
  prevue: 1.706,
  'toggle-demo-physics': 1.333,
  'wavy-dropdown': 0.999,
  studyloop: 1.333,
  dealdoc: 1.501,
  tickle: 1.25,
  'magicpath-experiments': 1.655,
  'card-tilt': 1.592,
  magicpath: 1.592,
  'vercel-dashboard': 1.484,
  'skeuomorphic-buttons': 1,
  'chain-landing': 1.25,
  'strava-redesign': 0.8,
  'greex-defi': 1,
  'indianoil-dashboard': 1.501,
  'ova-app': 1.25,
};

/** Width of the convex roll-off at each side, in px. Fixed rather than fluid
 * because the displacement profile is generated against it. */
const EDGE_BAND = 120;

/** Peak inward sampling shift at the outer boundary, in px. */
const LENS_DEPTH = 38;

/**
 * Convex edge lens.
 *
 * The roll-off is a real optical compression rather than a shape drawn on top.
 * Inside each band the lane is resampled horizontally:
 *
 *   out(x) = in(x + A·(1 − x/B)²)      (left band; mirrored on the right)
 *
 * Reading from further inside pulls more content into the same space, which is
 * what the periphery of a convex surface does. The profile *and* its first
 * derivative both reach zero at the band's inner border, so the compression
 * meets the flat middle with no seam and no perceptible onset.
 *
 * The map is a single full-width image whose middle is neutral, but the middle
 * is not displaced by it: 8-bit 128 is 0.502, not exactly 0.5, so a "neutral"
 * displacement still smears every pixel by ~0.12px — which is precisely what
 * made an earlier full-surface version read as uniformly liquid. Instead the
 * middle is cut out of the source and merged back untouched, so those pixels
 * are bit-exact and native.
 *
 * The map never changes, so the distortion is identical whether the lane is
 * moving or at rest: nothing switches on or off mid-scroll.
 */
function buildLensMap(width: number) {
  const w = Math.max(2, Math.round(width));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = 2;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  const image = ctx.createImageData(w, 2);
  const band = Math.min(EDGE_BAND, Math.floor(w / 3));

  for (let x = 0; x < w; x += 1) {
    let signed = 0;
    if (x < band) {
      // Left: sample inward (positive), peaking at the outer boundary.
      const t = 1 - x / band;
      signed = t * t;
    } else if (x >= w - band) {
      // Right: sample inward is the other direction, so negative.
      const t = (x - (w - band)) / band;
      signed = -(t * t);
    }
    const r = Math.round(128 + 127 * signed);
    for (let y = 0; y < 2; y += 1) {
      const idx = (y * w + x) * 4;
      image.data[idx] = r;
      image.data[idx + 1] = 128;
      image.data[idx + 2] = 128;
      image.data[idx + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL('image/png');
}

/**
 * Layered feather. Each tier blurs the backdrop a little more than the one
 * below it and is masked to a slightly narrower slice of the band, so the
 * softness accumulates as a continuous ramp instead of reading as one blurred
 * shape with a boundary.
 */
const FEATHER_TIERS = [
  { blur: '0.5px', stop: '100%' },
  { blur: '1.5px', stop: '74%' },
  { blur: '3px', stop: '52%' },
  { blur: '6px', stop: '32%' },
  { blur: '10px', stop: '16%' },
];

const wrapOffset = (value: number, cycle: number) =>
  cycle > 0 ? -((((-value) % cycle) + cycle) % cycle) : value;

/**
 * Click-to-centre spring, held at critical damping (c = 2ω) so the lane
 * settles onto the tile without overshooting and ringing back.
 *
 * ω is chosen per move from the travel distance: a short hop stays snappy,
 * while a long one slows down enough that the cards remain readable on the way
 * past. Both ends land inside a ~330–530ms settle.
 */
const SPRING_FREQ_MAX = 26;
const SPRING_FREQ_MIN = 18;
const SPRING_FREQ_FALLOFF = 0.0057;

const springFreq = (distance: number) =>
  Math.max(
    SPRING_FREQ_MIN,
    Math.min(
      SPRING_FREQ_MAX,
      SPRING_FREQ_MAX - Math.abs(distance) * SPRING_FREQ_FALLOFF,
    ),
  );

/** Ceiling on momentum carried into the spring, and the share kept when that
 *  momentum runs against the move. */
const HANDOFF_MAX = 2600;
const HANDOFF_OPPOSED = 0.2;

/** Free-fling inertia decay, in e-folds per second. */
const FLING_DECAY = 6.5;

/** Fixed solver step. Decoupling integration from the frame interval makes the
 *  motion identical at any refresh rate and — unlike clamping dt — keeps it
 *  time-correct across a dropped frame rather than slipping into slow motion.
 *  The catch-up ceiling stops a long stall from unwinding in one burst. */
const SUBSTEP = 1 / 240;
const MAX_CATCHUP = 0.1;

const aspectCache = new Map<string, number>();

function initialAspect(project: ShowcaseProject) {
  return (
    aspectCache.get(project.slug) ??
    STRIP_ASPECT_SEEDS[project.slug] ??
    DEFAULT_ASPECT
  );
}

function liveEmbedUrl(url: string) {
  try {
    const demoOrigin =
      window.location.port === '5180'
        ? `${window.location.protocol}//${window.location.hostname}:5173`
        : window.location.origin;
    const parsed = new URL(url, demoOrigin);
    parsed.searchParams.set('embed', '1');
    return parsed.href;
  } catch {
    return url.includes('?') ? `${url}&embed=1` : `${url}?embed=1`;
  }
}

function CardMedia({
  project,
  selected,
  onAspect,
}: {
  project: ShowcaseProject;
  selected: boolean;
  onAspect: (ratio: number) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const thumbnail = project.thumbnail;
  const videoSrc =
    thumbnail.type === 'loop' || thumbnail.type === 'video'
      ? thumbnail.src
      : null;

  useEffect(() => {
    setPlaying(false);
  }, [videoSrc]);

  // Selected cards load immediately and keep retrying play while the strip
  // recenters. Others prefetch when near and play only while on screen.
  useEffect(() => {
    if (!videoSrc) return;

    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    let inView = false;

    const attachSource = () => {
      const resolved = new URL(videoSrc, window.location.href).href;
      if (video.src === resolved) return;
      video.src = videoSrc;
      video.load();
    };

    const play = () => {
      if (cancelled || !inView) return;
      attachSource();
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        void video.play().catch(() => {});
      }
    };

    const pause = () => {
      video.pause();
      if (!selected) {
        video.currentTime = 0;
        setPlaying(false);
      }
    };

    const onReady = () => play();
    const onPlaying = () => setPlaying(true);
    const onPause = () => {
      if (!video.seeking && video.paused && video.currentTime < 0.05) {
        setPlaying(false);
      }
    };

    video.addEventListener('canplay', onReady);
    video.addEventListener('loadeddata', onReady);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('pause', onPause);

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView =
          entry.isIntersecting &&
          (selected || entry.intersectionRatio >= 0.03);
        if (inView) play();
        else pause();
      },
      {
        rootMargin: selected ? '300px 900px' : '0px 600px',
        threshold: [0, 0.03, 0.1, 0.25],
      },
    );

    observer.observe(video);

    if (selected) attachSource();

    const isVisibleEnough = () => {
      const rect = video.getBoundingClientRect();
      const vp = video
        .closest('.liquid-project-strip__viewport')
        ?.getBoundingClientRect();
      if (!vp || rect.width <= 0) return false;
      const visibleW = Math.max(
        0,
        Math.min(rect.right, vp.right) - Math.max(rect.left, vp.left),
      );
      return visibleW / rect.width >= (selected ? 0.02 : 0.03);
    };

    const retries = [80, 350, 900, 1800, 3000].map((ms) =>
      window.setTimeout(() => {
        if (cancelled || !selected) return;
        if (isVisibleEnough()) {
          inView = true;
          play();
        }
      }, ms),
    );

    return () => {
      cancelled = true;
      retries.forEach((id) => window.clearTimeout(id));
      observer.disconnect();
      video.removeEventListener('canplay', onReady);
      video.removeEventListener('loadeddata', onReady);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('pause', onPause);
      video.pause();
    };
  }, [videoSrc, selected]);

  const report = (width: number, height: number) => {
    if (width > 0 && height > 0) {
      aspectCache.set(project.slug, width / height);
      onAspect(width / height);
    }
  };

  if (thumbnail.type === 'image') {
    return (
      <img
        className={ready ? 'is-ready' : ''}
        src={thumbnail.src}
        alt=""
        decoding="async"
        draggable={false}
        loading={selected ? 'eager' : 'lazy'}
        fetchPriority={selected ? 'high' : 'auto'}
        onLoad={(event) => {
          report(
            event.currentTarget.naturalWidth,
            event.currentTarget.naturalHeight,
          );
          setReady(true);
        }}
        ref={(img) => {
          if (img?.complete && img.naturalWidth > 0) setReady(true);
        }}
      />
    );
  }

  if (thumbnail.type === 'loop' || thumbnail.type === 'video') {
    const poster = thumbnail.type === 'loop' ? thumbnail.poster : undefined;

    return (
      <div
        className={`liquid-project-strip__media${playing ? ' is-playing' : ''}`}
      >
        {poster && (
          <img
            src={poster}
            alt=""
            className="liquid-project-strip__placeholder"
            decoding="async"
            draggable={false}
          />
        )}
        <div className="liquid-project-strip__media-shimmer" aria-hidden="true" />
        <video
          ref={videoRef}
          className="liquid-project-strip__video"
          muted
          loop
          playsInline
          autoPlay={selected}
          preload={selected ? 'auto' : 'none'}
          onLoadedMetadata={(event) => {
            report(
              event.currentTarget.videoWidth,
              event.currentTarget.videoHeight,
            );
            if (selected) void event.currentTarget.play().catch(() => {});
          }}
        />
      </div>
    );
  }

  return <i style={{ background: thumbnail.color }} />;
}

function StripCard({
  project,
  selected,
  focusable,
  aspect,
  onAspect,
  onSelect,
}: {
  project: ShowcaseProject;
  selected: boolean;
  focusable: boolean;
  aspect: number;
  onAspect: (slug: string, ratio: number) => void;
  onSelect: () => void;
}) {
  const live = project.presentation.type === 'live';
  const embed = useMemo(
    () =>
      live && selected
        ? liveEmbedUrl((project.presentation as { url: string }).url)
        : null,
    [live, selected, project.presentation],
  );

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      className={`liquid-project-strip__card${selected ? ' is-selected' : ''}`}
      role="button"
      tabIndex={focusable ? 0 : -1}
      aria-pressed={selected}
      aria-label={`Show ${project.title}`}
      data-slug={project.slug}
      style={{ aspectRatio: String(aspect) } as CSSProperties}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
    >
      <CardMedia
        project={project}
        selected={selected}
        onAspect={(ratio) => onAspect(project.slug, ratio)}
      />
      {embed && (
        <iframe
          src={embed}
          title={`${project.title} live demo`}
          loading="lazy"
          allow="clipboard-read; clipboard-write; fullscreen"
        />
      )}
      <span className="liquid-project-strip__card-title" aria-hidden="true">
        {project.title}
      </span>
    </div>
  );
}

export function LiquidProjectStrip({
  selectedSlug,
  onSelect,
  onScrollActivity,
}: {
  selectedSlug: string;
  onSelect: (project: ShowcaseProject) => void;
  onScrollActivity?: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lensId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [size, setSize] = useState({ width: 0, height: 0 });
  const lensMap = useMemo(
    () => (size.width > 0 && size.height > 0 ? buildLensMap(size.width) : ''),
    [size.width, size.height],
  );
  const bandWidth = Math.min(EDGE_BAND, Math.floor(size.width / 3) || EDGE_BAND);

  // One aspect ratio per project, shared by both copies in the loop. Held per
  // card it drifts: whichever copy resolves its media first resizes alone, the
  // track stops being periodic, and the wrap and the centring both go off.
  const [aspects, setAspects] = useState<Record<string, number>>(() => {
    const seed: Record<string, number> = {};
    for (const project of SHOWCASE_PROJECTS) {
      seed[project.slug] = initialAspect(project);
    }
    return seed;
  });

  const handleAspect = useCallback((slug: string, ratio: number) => {
    setAspects((current) =>
      Math.abs((current[slug] ?? 0) - ratio) < 0.001
        ? current
        : { ...current, [slug]: ratio },
    );
  }, []);

  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const targetOffsetRef = useRef<number | null>(null);
  const cycleRef = useRef(0);
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);
  const accumulatorRef = useRef(0);
  const springFreqRef = useRef(SPRING_FREQ_MAX);
  const selectedSlugRef = useRef(selectedSlug);
  const suppressClickRef = useRef(false);
  const dragRef = useRef<{
    pointerId: number;
    x: number;
    time: number;
    moved: boolean;
  } | null>(null);

  const startRef = useRef<(() => void) | null>(null);
  const layoutReadyRef = useRef(false);
  const [stripReady, setStripReady] = useState(false);

  const centerOnSelected = useCallback((slug: string, animate = true) => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track || cycleRef.current <= 0) return;
    const cards = track.querySelectorAll<HTMLElement>(
      `[data-slug="${slug}"]`,
    );
    if (cards.length === 0) return;
    const rootWidth = root.clientWidth;
    let best: number | null = null;
    for (const card of cards) {
      const base = rootWidth / 2 - (card.offsetLeft + card.offsetWidth / 2);
      for (const candidate of [
        base - cycleRef.current,
        base,
        base + cycleRef.current,
      ]) {
        if (
          best === null ||
          Math.abs(candidate - offsetRef.current) <
            Math.abs(best - offsetRef.current)
        ) {
          best = candidate;
        }
      }
    }
    if (best === null) return;

    if (!animate) {
      offsetRef.current = best;
      targetOffsetRef.current = null;
      velocityRef.current = 0;
      track.style.transform = `translate3d(${offsetRef.current.toFixed(2)}px, 0, 0)`;
      return;
    }

    const distance = best - offsetRef.current;
    const omega = springFreq(distance);
    springFreqRef.current = omega;
    let handoff = velocityRef.current;
    if (distance !== 0 && Math.sign(handoff) !== Math.sign(distance)) {
      handoff *= HANDOFF_OPPOSED;
    }
    const ceiling = Math.min(HANDOFF_MAX, omega * Math.abs(distance) * 0.9);
    velocityRef.current = Math.max(-ceiling, Math.min(ceiling, handoff));
    targetOffsetRef.current = best;
    startRef.current?.();
  }, []);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const root = rootRef.current;
    if (!track || !root) return;
    cycleRef.current = (track.scrollWidth + CARD_GAP) / 2;
    centerOnSelected(selectedSlugRef.current, false);
    layoutReadyRef.current = true;
    setStripReady(true);
  }, [centerOnSelected]);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const measure = () => {
      const oldCycle = cycleRef.current;
      cycleRef.current = (track.scrollWidth + CARD_GAP) / 2;
      const box = root.getBoundingClientRect();
      setSize((current) =>
        Math.abs(current.width - box.width) > 1 ||
        Math.abs(current.height - box.height) > 1
          ? { width: Math.round(box.width), height: Math.round(box.height) }
          : current,
      );
      // Preserve free-scroll position when card widths change or the viewport
      // resizes — only retarget while a selection spring is in flight.
      if (
        oldCycle > 0 &&
        cycleRef.current > 0 &&
        Math.abs(oldCycle - cycleRef.current) > 1
      ) {
        const ratio = cycleRef.current / oldCycle;
        offsetRef.current *= ratio;
        if (targetOffsetRef.current !== null) {
          targetOffsetRef.current *= ratio;
        }
      }
      offsetRef.current = wrapOffset(offsetRef.current, cycleRef.current);
      track.style.transform = `translate3d(${offsetRef.current.toFixed(2)}px, 0, 0)`;
      if (targetOffsetRef.current !== null) {
        centerOnSelected(selectedSlugRef.current, true);
      }
      start();
    };

    const step = (h: number, reduced: boolean) => {
      const target = targetOffsetRef.current;

      if (target !== null) {
        if (reduced) {
          offsetRef.current = target;
          targetOffsetRef.current = null;
          velocityRef.current = 0;
          return;
        }
        const omega = springFreqRef.current;
        velocityRef.current +=
          (omega * omega * (target - offsetRef.current) -
            2 * omega * velocityRef.current) *
          h;
        offsetRef.current += velocityRef.current * h;
        // Reads the post-update distance; the pre-update one holds the spring
        // alive an extra frame. The threshold sits at half a pixel because
        // critical damping has a long exponential tail — below this the motion
        // is invisible and only delays the settle.
        if (
          Math.abs(target - offsetRef.current) < 0.5 &&
          Math.abs(velocityRef.current) < 30
        ) {
          offsetRef.current = target;
          targetOffsetRef.current = null;
          velocityRef.current = 0;
        }
        return;
      }

      if (!reduced && Math.abs(velocityRef.current) > 0.2) {
        offsetRef.current += velocityRef.current * h;
        velocityRef.current *= Math.exp(-h * FLING_DECAY);
        return;
      }
      velocityRef.current = 0;
    };

    const tick = (now: number) => {
      rafRef.current = 0;
      const elapsed = (now - (lastTimeRef.current || now)) / 1000;
      lastTimeRef.current = now;
      const reduced = reducedQuery.matches;

      accumulatorRef.current = Math.min(
        accumulatorRef.current + elapsed,
        MAX_CATCHUP,
      );
      while (accumulatorRef.current >= SUBSTEP) {
        step(SUBSTEP, reduced);
        accumulatorRef.current -= SUBSTEP;
      }

      velocityRef.current = Math.max(-9000, Math.min(9000, velocityRef.current));

      // Wrap the offset and the spring target together, otherwise the wrap
      // yanks the offset a full cycle away from the target every frame and
      // the strip runs forever.
      const wrapped = wrapOffset(offsetRef.current, cycleRef.current);
      if (wrapped !== offsetRef.current && targetOffsetRef.current !== null) {
        targetOffsetRef.current += wrapped - offsetRef.current;
      }
      offsetRef.current = wrapped;
      track.style.transform = `translate3d(${offsetRef.current.toFixed(2)}px, 0, 0)`;

      const settled =
        targetOffsetRef.current === null &&
        Math.abs(velocityRef.current) <= 0.2;
      if (!settled && !document.hidden) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        lastTimeRef.current = 0;
        accumulatorRef.current = 0;
      }
    };

    const start = () => {
      if (!rafRef.current && !document.hidden) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    startRef.current = start;

    const observer = new ResizeObserver(measure);
    observer.observe(root);
    observer.observe(track);
    measure();

    const onVisibility = () => {
      if (!document.hidden) start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      startRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerOnSelected]);

  const prevSelectedSlugRef = useRef(selectedSlug);

  useEffect(() => {
    selectedSlugRef.current = selectedSlug;
    if (!layoutReadyRef.current) return;
    if (prevSelectedSlugRef.current === selectedSlug) return;
    prevSelectedSlugRef.current = selectedSlug;
    centerOnSelected(selectedSlug, true);
  }, [selectedSlug, centerOnSelected]);

  const onWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    targetOffsetRef.current = null;
    const delta =
      Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY;
    offsetRef.current -= delta;
    velocityRef.current = -delta * 14;
    startRef.current?.();
    onScrollActivity?.();
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    targetOffsetRef.current = null;
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      time: performance.now(),
      moved: false,
    };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const now = performance.now();
    const dx = event.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 3) {
      drag.moved = true;
      suppressClickRef.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (!drag.moved) return;
    offsetRef.current += dx;
    velocityRef.current = dx / Math.max((now - drag.time) / 1000, 0.008);
    drag.x = event.clientX;
    drag.time = now;
    startRef.current?.();
    onScrollActivity?.();
  };

  const endPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer capture can already be released by the browser.
    }
    startRef.current?.();
  };

  const selectByKeyboard = (direction: number) => {
    const current = SHOWCASE_PROJECTS.findIndex(
      (project) => project.slug === selectedSlug,
    );
    const next =
      (current + direction + SHOWCASE_PROJECTS.length) %
      SHOWCASE_PROJECTS.length;
    onSelect(SHOWCASE_PROJECTS[next]);
  };

  const selectedIndex = SHOWCASE_PROJECTS.findIndex(
    (project) => project.slug === selectedSlug,
  );

  return (
    <div
      ref={rootRef}
      className={`liquid-project-strip${stripReady ? ' is-layout-ready' : ''}`}
      role="region"
      aria-label="Project showcase"
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          selectByKeyboard(event.key === 'ArrowRight' ? 1 : -1);
        }
      }}
    >
      <div
        className="liquid-project-strip__viewport"
        style={
          lensMap ? ({ filter: `url(#${lensId})` } as CSSProperties) : undefined
        }
      >
        <div ref={trackRef} className="liquid-project-strip__track">
          {[0, 1].map((copy) =>
            SHOWCASE_PROJECTS.map((project) => (
              <StripCard
                key={`${copy}-${project.slug}`}
                project={project}
                selected={project.slug === selectedSlug}
                focusable={copy === 0}
                aspect={aspects[project.slug] ?? DEFAULT_ASPECT}
                onAspect={handleAspect}
                onSelect={() => {
                  if (suppressClickRef.current) return;
                  onSelect(project);
                }}
              />
            )),
          )}
        </div>
      </div>

      <svg className="liquid-project-strip__defs" aria-hidden="true">
        <defs>
          <filter
            id={lensId}
            x="0"
            y="0"
            width={Math.max(size.width, 1)}
            height={Math.max(size.height, 1)}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              href={lensMap}
              x="0"
              y="0"
              width={Math.max(size.width, 1)}
              height={Math.max(size.height, 1)}
              preserveAspectRatio="none"
              result="lensMap"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="lensMap"
              scale={LENS_DEPTH * 2}
              xChannelSelector="R"
              yChannelSelector="G"
              result="warped"
            />

            {/* Bands are the only region allowed to carry the warp; the middle
                is taken straight from the source so it stays bit-exact. */}
            <feFlood
              floodColor="#000"
              x="0"
              y="0"
              width={bandWidth}
              height={Math.max(size.height, 1)}
              result="bandLeft"
            />
            <feFlood
              floodColor="#000"
              x={Math.max(size.width - bandWidth, 0)}
              y="0"
              width={bandWidth}
              height={Math.max(size.height, 1)}
              result="bandRight"
            />
            <feMerge result="bands">
              <feMergeNode in="bandLeft" />
              <feMergeNode in="bandRight" />
            </feMerge>
            <feComposite
              in="warped"
              in2="bands"
              operator="in"
              result="edges"
            />
            <feComposite
              in="SourceGraphic"
              in2="bands"
              operator="out"
              result="middle"
            />
            <feMerge>
              <feMergeNode in="middle" />
              <feMergeNode in="edges" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {(['left', 'right'] as const).map((side) => (
        <div
          key={side}
          className={`liquid-project-strip__feather liquid-project-strip__feather--${side}`}
          aria-hidden="true"
        >
          {FEATHER_TIERS.map((tier) => (
            <span
              key={tier.blur}
              className="liquid-project-strip__feather-tier"
              style={
                {
                  '--tier-blur': tier.blur,
                  '--tier-stop': tier.stop,
                } as CSSProperties
              }
            />
          ))}
        </div>
      ))}

      <p className="liquid-project-strip__status" aria-live="polite">
        {selectedIndex + 1} of {SHOWCASE_PROJECTS.length}:{' '}
        {SHOWCASE_PROJECTS[selectedIndex]?.title}
      </p>
    </div>
  );
}
