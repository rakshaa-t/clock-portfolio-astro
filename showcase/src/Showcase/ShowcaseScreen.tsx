import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  SHOWCASE_PROJECTS,
  type ShowcaseMedia,
  type ShowcaseProject,
} from './showcaseProjects';
import { getShowcaseStageBackground } from './themeColor';
import {
  type DialFeature,
  type DialParams,
} from './indicatorDials';
import { LiquidGlassCarousel } from './LiquidGlassCarousel';
import './showcase.css';

function TileImage({ src, fallback }: { src: string; fallback: string }) {
  const [ready, setReady] = useState(false);

  return (
    <div
      className={`showcase-tile-blurup${ready ? ' is-loaded is-revealed' : ''}`}
      style={{ '--tile-fallback': fallback } as CSSProperties}
      aria-hidden="true"
    >
      <div
        className="showcase-tile-placeholder"
        style={{ '--tile-fallback': fallback } as CSSProperties}
      />
      <img
        src={src}
        alt=""
        decoding="async"
        onLoad={() => setReady(true)}
        ref={(img) => {
          if (img?.complete && img.naturalWidth > 0) setReady(true);
        }}
      />
    </div>
  );
}

function TileLoop({
  src,
  poster,
  fallback,
  active,
}: {
  src: string;
  poster: string;
  fallback: string;
  active: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.src = src;
    video.load();
  }, [src]);

  // Playback is the indicator: only the tile that should read as live moves.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active) {
      void video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [active]);

  return (
    <div
      className={`showcase-tile-blurup showcase-tile-loop is-loaded${
        ready && active ? ' is-revealed' : ''
      }`}
      style={{ '--tile-fallback': fallback } as CSSProperties}
      aria-hidden="true"
    >
      <img src={poster} alt="" decoding="async" className="showcase-tile-poster" />
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
        onCanPlay={() => setReady(true)}
      />
    </div>
  );
}

function TileArtwork({
  project,
  loopActive,
}: {
  project: ShowcaseProject;
  loopActive: boolean;
}) {
  const media = project.thumbnail;
  const fallback = project.theme.surface;

  if (media.type === 'image') {
    return <TileImage src={media.src} fallback={fallback} />;
  }

  if (media.type === 'loop') {
    return (
      <TileLoop
        src={media.src}
        poster={media.poster}
        fallback={fallback}
        active={loopActive}
      />
    );
  }

  return (
    <div
      className="showcase-tile-placeholder"
      style={
        {
          '--tile-fallback':
            media.type === 'color' ? media.color : project.theme.accent,
        } as CSSProperties
      }
      aria-hidden="true"
    />
  );
}

type ProjectTileProps = {
  project: ShowcaseProject;
  selected: boolean;
  feats: DialFeature[];
  variantLabel: string | null;
  motionTrigger: DialParams['motionTrigger'];
  onSelect: (project: ShowcaseProject) => void;
};

function ProjectTile({
  project,
  selected,
  feats,
  variantLabel,
  motionTrigger,
  onSelect,
}: ProjectTileProps) {
  const [hovered, setHovered] = useState(false);

  const motionGated = feats.includes('motion');
  const loopActive =
    !motionGated ||
    motionTrigger === 'always' ||
    selected ||
    (motionTrigger === 'hover' && hovered);

  return (
    <button
      type="button"
      className={`showcase-tile${selected ? ' is-selected' : ''}`}
      aria-pressed={selected}
      aria-label={`Show ${project.title}`}
      data-slug={project.slug}
      data-feats={feats.join(' ')}
      data-hover={hovered ? '' : undefined}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={() => onSelect(project)}
    >
      <span className="showcase-tile-plate" aria-hidden="true" />
      <span className="showcase-tile-scaler">
        <span className="showcase-tile-media">
          <TileArtwork project={project} loopActive={loopActive} />
        </span>
      </span>
      <span className="showcase-tile-mark" aria-hidden="true" />
      <span className="showcase-tile-name" aria-hidden="true">
        {project.title}
      </span>
      {variantLabel && (
        <span className="showcase-tile-variant" aria-hidden="true">
          {variantLabel}
        </span>
      )}
    </button>
  );
}

type ProjectStripProps = {
  selectedSlug: string;
  onSelect: (project: ShowcaseProject) => void;
  featsFor: (index: number) => DialFeature[];
  variantLabelFor: (index: number) => string | null;
  dials: DialParams;
  mode: 'compare' | 'tune';
};

function ProjectStrip({
  selectedSlug,
  onSelect,
  featsFor,
  variantLabelFor,
  dials,
  mode,
}: ProjectStripProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const directionRef = useRef(-1);
  const geometryRef = useRef<{
    maxScroll: number;
    viewportWidth: number;
    tiles: Array<{ element: HTMLElement; left: number; width: number }>;
  }>({ maxScroll: 0, viewportWidth: 0, tiles: [] });
  const hoverPausedRef = useRef(false);
  const tempPausedUntilRef = useRef(0);
  const resumeTimer = useRef<number | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startOffset: number;
    moved: boolean;
    captured: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);

  // The rAF loop reads live dial values without being torn down on every tweak.
  const motionRef = useRef({
    speed: dials.stripSpeed,
    falloff: dials.edgeFalloff,
  });
  useEffect(() => {
    motionRef.current = {
      speed: dials.stripSpeed,
      falloff: dials.edgeFalloff,
    };
  }, [dials.stripSpeed, dials.edgeFalloff]);

  const applyOffset = (next: number) => {
    const track = trackRef.current;
    if (!track) return;
    const { maxScroll } = geometryRef.current;
    offsetRef.current = Math.min(0, Math.max(-maxScroll, next));
    track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
  };

  const isAutoPaused = () =>
    hoverPausedRef.current ||
    Boolean(dragRef.current?.moved) ||
    Date.now() < tempPausedUntilRef.current;

  const pauseBriefly = (ms = 900) => {
    tempPausedUntilRef.current = Date.now() + ms;
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => {
      /* isAutoPaused reads the timestamp */
    }, ms + 16);
  };

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    let raf = 0;
    let lastFrame = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const refreshGeometry = () => {
      // Measurements are intentionally isolated to resize events. Reading
      // layout inside the animation frame was forcing a synchronous layout
      // for every thumbnail and made the shelf judder as it grew.
      const tiles = Array.from(
        track.querySelectorAll<HTMLElement>('.showcase-tile'),
      );
      geometryRef.current = {
        maxScroll: Math.max(0, track.scrollWidth - viewport.clientWidth),
        viewportWidth: viewport.clientWidth,
        tiles: tiles.map((element) => ({
          element,
          left: element.offsetLeft,
          width: element.offsetWidth,
        })),
      };
      applyOffset(offsetRef.current);
    };

    const applyEdgeScale = () => {
      const { tiles, viewportWidth } = geometryRef.current;
      const half = Math.max(viewportWidth / 2, 1);
      const minScale = motionRef.current.falloff;

      for (const { element, left, width } of tiles) {
        const cx = left + width / 2 + offsetRef.current;
        const t = Math.min(1, Math.abs(cx - viewportWidth / 2) / half);
        let scale = 1 - (1 - minScale) * t * t;
        if (element.getAttribute('aria-pressed') === 'true') {
          scale = Math.max(scale, 0.97);
        }
        const transform = `scale(${scale.toFixed(4)})`;
        if (element.style.transform !== transform) {
          element.style.transform = transform;
        }
      }
    };

    const getMotionBounds = () => {
      const { maxScroll, tiles, viewportWidth } = geometryRef.current;
      const active = tiles.find(
        ({ element }) => element.getAttribute('aria-pressed') === 'true',
      );
      if (!active) return { min: -maxScroll, max: 0 };

      // Keep the active work in the shelf instead of letting the autoplay
      // drift it completely out of frame. The first/last items naturally pin
      // at their respective ends; middle items retain a small, calm drift.
      const safeInset = Math.min(180, viewportWidth * 0.18);
      const tileCenter = active.left + active.width / 2;
      const min = Math.max(-maxScroll, safeInset - tileCenter);
      const max = Math.min(0, viewportWidth - safeInset - tileCenter);
      if (min <= max) return { min, max };

      const target = Math.min(
        0,
        Math.max(-maxScroll, viewportWidth / 2 - tileCenter),
      );
      return { min: target, max: target };
    };

    const tick = (time: number) => {
      raf = 0;
      const deltaSeconds = Math.min((time - lastFrame) / 1000, 0.05);
      lastFrame = time;

      if (!isAutoPaused()) {
        // Dial values retain their px/frame meaning at 60Hz, but are now
        // time-based, so a busy frame cannot create a visible jump.
        let next =
          offsetRef.current +
          directionRef.current * motionRef.current.speed * 60 * deltaSeconds;
        const { min, max } = getMotionBounds();

        if (min === max) {
          next = min;
        } else if (next <= min) {
          next = min;
          directionRef.current = 1;
        } else if (next >= max) {
          next = max;
          directionRef.current = -1;
        }
        applyOffset(next);
      }

      applyEdgeScale();
      if (!document.hidden) raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!raf && !document.hidden) {
        lastFrame = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else {
        start();
      }
    };

    refreshGeometry();
    applyOffset(0);
    applyEdgeScale();
    const observer = new ResizeObserver(refreshGeometry);
    observer.observe(viewport);
    observer.observe(track);
    document.addEventListener('visibilitychange', onVisibilityChange);
    if (!reduced) start();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    };
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const active = track.querySelector<HTMLElement>(
      `.showcase-tile[aria-pressed="true"]`,
    );
    if (!active) return;
    const tile = geometryRef.current.tiles.find(
      ({ element }) => element === active,
    );
    if (!tile) return;
    const delta =
      tile.left +
      tile.width / 2 +
      offsetRef.current -
      geometryRef.current.viewportWidth / 2;
    applyOffset(offsetRef.current - delta);
    if (!hoverPausedRef.current) pauseBriefly(1200);
  }, [selectedSlug]);

  // Strip height follows tile content + lift headroom.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const shell = track.closest<HTMLElement>('.showcase-shell');
    const tiles = Array.from(
      track.querySelectorAll<HTMLElement>('.showcase-tile'),
    );
    if (!shell || tiles.length === 0) return;

    const sync = () => {
      let tallest = 0;
      let scalerHeight = 0;
      for (const tile of tiles) {
        tallest = Math.max(tallest, tile.offsetHeight);
        scalerHeight = Math.max(
          scalerHeight,
          tile.querySelector<HTMLElement>('.showcase-tile-scaler')
            ?.offsetHeight ?? 0,
        );
      }
      const lift =
        Number(
          getComputedStyle(shell).getPropertyValue('--tile-selected-lift'),
        ) || 1;
      const glow =
        Number.parseFloat(
          getComputedStyle(shell).getPropertyValue('--tile-glow-blur'),
        ) || 0;
      const headroom =
        Math.ceil(scalerHeight * (lift - 1)) + Math.ceil(glow) + 32;
      shell.style.setProperty('--strip-h', `${Math.ceil(tallest + headroom)}px`);
    };

    sync();
    const observer = new ResizeObserver(sync);
    for (const tile of tiles) observer.observe(tile);
    return () => observer.disconnect();
  }, [dials]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();

    const selectedIndex = SHOWCASE_PROJECTS.findIndex(
      (project) => project.slug === selectedSlug,
    );
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = Math.min(
      SHOWCASE_PROJECTS.length - 1,
      Math.max(0, selectedIndex + direction),
    );
    onSelect(SHOWCASE_PROJECTS[nextIndex]);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startOffset: offsetRef.current,
      moved: false,
      captured: false,
    };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;

    if (!drag.moved && Math.abs(dx) > 6) {
      drag.moved = true;
      suppressClickRef.current = true;
      if (!drag.captured) {
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.captured = true;
      }
    }

    if (!drag.moved) return;
    applyOffset(drag.startOffset + dx);
  };

  const endPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const wasDragging = drag.moved;
    dragRef.current = null;
    if (drag.captured) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        /* already released */
      }
    }
    if (wasDragging) {
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
      if (!hoverPausedRef.current) pauseBriefly(1000);
    }
  };

  return (
    <div
      ref={viewportRef}
      className="showcase-strip"
      aria-label="Select a project"
      data-label-mode={dials.labelMode}
      data-mode={mode}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      onWheel={(event) => {
        if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
          event.preventDefault();
          applyOffset(offsetRef.current - event.deltaY);
        } else {
          applyOffset(offsetRef.current - event.deltaX);
        }
        if (!hoverPausedRef.current) pauseBriefly(900);
      }}
      onPointerEnter={() => {
        hoverPausedRef.current = true;
      }}
      onPointerLeave={() => {
        hoverPausedRef.current = false;
        if (!dragRef.current?.moved) pauseBriefly(600);
      }}
    >
      <div ref={trackRef} className="showcase-strip-track">
        {SHOWCASE_PROJECTS.map((project, index) => (
          <ProjectTile
            key={project.slug}
            project={project}
            selected={project.slug === selectedSlug}
            feats={featsFor(index)}
            variantLabel={variantLabelFor(index)}
            motionTrigger={dials.motionTrigger}
            onSelect={(next) => {
              if (suppressClickRef.current) {
                suppressClickRef.current = false;
                return;
              }
              onSelect(next);
            }}
          />
        ))}
      </div>
    </div>
  );
}

const DEFAULT_MEDIA_RATIO = 16 / 10;

function prefetchImage(src: string) {
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
}

function StageMedia({
  media,
  onRatio,
  priority = false,
}: {
  media: ShowcaseMedia;
  onRatio?: (ratio: number) => void;
  priority?: boolean;
}) {
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setReady(false);
  }, [media.src]);

  const reportRatio = (width: number, height: number) => {
    if (!onRatio || !width || !height) return;
    onRatio(width / height);
  };

  if (media.type === 'video' || media.type === 'loop') {
    return (
      <div className={`showcase-media-shell${ready ? ' is-ready' : ''}`}>
        <div className="showcase-media-skeleton" aria-hidden="true" />
        <video
          ref={videoRef}
          className="showcase-stage-media"
          src={media.src}
          muted
          loop
          playsInline
          preload="metadata"
          poster={media.type === 'loop' ? media.poster : undefined}
          onLoadedMetadata={(event) => {
            reportRatio(
              event.currentTarget.videoWidth,
              event.currentTarget.videoHeight,
            );
            void event.currentTarget.play().catch(() => {});
          }}
          onCanPlay={() => setReady(true)}
        />
      </div>
    );
  }

  return (
    <div className={`showcase-media-shell${ready ? ' is-ready' : ''}`}>
      <div className="showcase-media-skeleton" aria-hidden="true" />
      <img
        className="showcase-stage-media"
        src={media.src}
        alt={media.alt ?? ''}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={(event) => {
          reportRatio(
            event.currentTarget.naturalWidth,
            event.currentTarget.naturalHeight,
          );
          setReady(true);
        }}
      />
    </div>
  );
}

function LiveStage({
  project,
  url,
}: {
  project: ShowcaseProject;
  url: string;
}) {
  const [loaded, setLoaded] = useState(false);

  const embedUrl = useMemo(() => {
    try {
      // The standalone showcase runs on 5180 while live portfolio demos run
      // on 5173. Keep the origin in the iframe URL: routing HTML through the
      // showcase proxy makes root-relative module scripts resolve back to
      // 5180, recursively mounting ShowcaseScreen inside itself.
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
  }, [url]);

  useEffect(() => {
    setLoaded(false);
  }, [embedUrl]);

  return (
    <div className="showcase-live-frame">
      <div className={`showcase-frame-loader${loaded ? ' is-hidden' : ''}`}>
        <span />
      </div>
      <iframe
        src={embedUrl}
        title={`${project.title} live demo`}
        loading="lazy"
        allow="clipboard-read; clipboard-write; fullscreen"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

type ProjectPresentationProps = {
  project: ShowcaseProject;
  onRatio: (ratio: number) => void;
};

function ProjectPresentation({ project, onRatio }: ProjectPresentationProps) {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => setSlideIndex(0), [project.slug]);

  const presentation = project.presentation;

  useEffect(() => {
    if (presentation.type === 'live' || presentation.type === 'color') {
      onRatio(DEFAULT_MEDIA_RATIO);
    }
  }, [onRatio, presentation.type, project.slug]);

  useEffect(() => {
    if (presentation.type !== 'gallery') return;
    const next = presentation.media[slideIndex + 1];
    if (next?.type === 'image') prefetchImage(next.src);
  }, [presentation, slideIndex]);

  if (presentation.type === 'live') {
    return <LiveStage project={project} url={presentation.url} />;
  }

  if (presentation.type === 'video' || presentation.type === 'image') {
    return (
      <div className="showcase-static-stage">
        <StageMedia
          media={presentation.media}
          onRatio={onRatio}
          priority
        />
      </div>
    );
  }

  if (presentation.type === 'color') {
    return (
      <div
        className="showcase-color-stage"
        style={{ '--project-color': presentation.color } as CSSProperties}
      >
        <div className="showcase-color-orbit" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    );
  }

  const count = presentation.media.length;
  const activeMedia = presentation.media[slideIndex];
  const move = (direction: number) => {
    setSlideIndex((current) => (current + direction + count) % count);
  };

  return (
    <div className="showcase-gallery-stage">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          className="showcase-gallery-slide"
          key={`${project.slug}-${slideIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <StageMedia
            media={activeMedia}
            onRatio={onRatio}
            priority={slideIndex === 0}
          />
        </motion.div>
      </AnimatePresence>

      {count > 1 && (
        <>
          <div className="showcase-gallery-controls">
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Previous image"
            >
              <span aria-hidden="true">←</span>
            </button>
            <span aria-live="polite">
              {String(slideIndex + 1).padStart(2, '0')} /{' '}
              {String(count).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Next image"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
          <div className="showcase-gallery-dots" aria-label="Choose image">
            {presentation.media.map((media, index) => (
              <button
                type="button"
                key={`${media.src}-${index}`}
                className={index === slideIndex ? 'is-active' : ''}
                onClick={() => setSlideIndex(index)}
                aria-label={`Show image ${index + 1}`}
                aria-current={index === slideIndex ? 'true' : undefined}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function prefetchVideo(src: string) {
  const video = document.createElement('video');
  video.preload = 'auto';
  video.muted = true;
  video.src = src;
  video.load();
}

function MobileLoopMedia({
  src,
  poster,
  active,
}: {
  src: string;
  poster: string;
  active: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active) {
      video.src = src;
      video.load();
      void video.play().catch(() => {});
    } else {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
  }, [active, src]);

  return (
    <>
      <img src={poster} alt="" loading="lazy" decoding="async" aria-hidden={active} />
      <video ref={videoRef} muted loop playsInline preload="none" aria-hidden={!active} />
    </>
  );
}

function MobileProjectCard({
  project,
  selected,
  onSelect,
}: {
  project: ShowcaseProject;
  selected: boolean;
  onSelect: () => void;
}) {
  const thumbnail = project.thumbnail;

  return (
    <button
      type="button"
      className={`showcase-mobile-card${selected ? ' is-selected' : ''}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className="showcase-mobile-card__media">
        {thumbnail.type === 'image' ? (
          <img src={thumbnail.src} alt="" loading="lazy" decoding="async" />
        ) : thumbnail.type === 'loop' ? (
          <MobileLoopMedia
            src={thumbnail.src}
            poster={thumbnail.poster}
            active={selected}
          />
        ) : thumbnail.type === 'video' ? (
          <video src={thumbnail.src} muted playsInline preload="metadata" />
        ) : (
          <i style={{ background: thumbnail.color }} />
        )}
      </span>
      <span className="showcase-mobile-card__meta">
        <b>{project.title}</b>
        <small>{project.category}</small>
        <em>{project.year}</em>
      </span>
    </button>
  );
}

export function ShowcaseScreen() {
  const [selectedSlug, setSelectedSlug] = useState(
    SHOWCASE_PROJECTS[0].slug,
  );
  const selectedProject =
    SHOWCASE_PROJECTS.find((project) => project.slug === selectedSlug) ??
    SHOWCASE_PROJECTS[0];
  const selectedIndex = SHOWCASE_PROJECTS.findIndex(
    (project) => project.slug === selectedProject.slug,
  );
  const navigateProjects = (direction: number) => {
    const nextIndex =
      (selectedIndex + direction + SHOWCASE_PROJECTS.length) %
      SHOWCASE_PROJECTS.length;
    setSelectedSlug(SHOWCASE_PROJECTS[nextIndex].slug);
  };
  const [navOpen, setNavOpen] = useState(false);
  const navCloseTimer = useRef(0);

  useEffect(() => {
    return () => window.clearTimeout(navCloseTimer.current);
  }, []);

  useEffect(() => {
    document.title = `${selectedProject.title} — Selected work`;
  }, [selectedProject.title, selectedProject.slug]);

  // Warm the selected strip media and prefetch the next project's thumbnail.
  useEffect(() => {
    const thumb = selectedProject.thumbnail;
    const links: HTMLLinkElement[] = [];

    if (thumb.type === 'loop') {
      prefetchVideo(thumb.src);
      prefetchImage(thumb.poster);
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = thumb.src;
      document.head.appendChild(link);
      links.push(link);
    } else if (thumb.type === 'video') {
      prefetchVideo(thumb.src);
    } else if (thumb.type === 'image') {
      prefetchImage(thumb.src);
    }

    const index = SHOWCASE_PROJECTS.findIndex(
      (project) => project.slug === selectedSlug,
    );
    const next =
      SHOWCASE_PROJECTS[(index + 1) % SHOWCASE_PROJECTS.length]?.thumbnail;
    if (next?.type === 'image') prefetchImage(next.src);
    else if (next?.type === 'loop') prefetchImage(next.poster);

    return () => {
      for (const link of links) link.remove();
    };
  }, [selectedSlug, selectedProject.thumbnail]);

  const theme = selectedProject.theme;
  const stageBackground = getShowcaseStageBackground(theme.background);
  const style = {
    '--showcase-bg': stageBackground,
    '--showcase-strip': stageBackground,
    '--showcase-canvas': `color-mix(in srgb, ${stageBackground} 90%, ${theme.ink})`,
    '--showcase-mat': `color-mix(in srgb, ${stageBackground} 78%, ${theme.ink})`,
    '--showcase-surface': theme.surface,
    '--showcase-ink': theme.ink,
    '--showcase-muted': theme.muted,
    '--showcase-accent': theme.accent,
    '--showcase-glow': `color-mix(in srgb, ${theme.accent} 20%, transparent)`,
    '--showcase-line': `color-mix(in srgb, ${theme.ink} 10%, transparent)`,
  } as CSSProperties;

  return (
    <main className="showcase-shell" style={style}>
      <header className="showcase-gallery-intro">
        <p>Selected work / {selectedProject.year}</p>
        <div>
          <h1>{selectedProject.title}</h1>
          <p>{selectedProject.description}</p>
        </div>
        <span>{selectedProject.category}</span>
      </header>

      <nav className="showcase-topbar" aria-label="Project navigation">
        <LiquidGlassCarousel
          selectedSlug={selectedSlug}
          onSelect={(project) => setSelectedSlug(project.slug)}
        />
      </nav>

      <section className="showcase-mobile-stack" aria-label="Selected projects">
        {SHOWCASE_PROJECTS.map((project) => (
          <MobileProjectCard
            key={project.slug}
            project={project}
            selected={project.slug === selectedSlug}
            onSelect={() => setSelectedSlug(project.slug)}
          />
        ))}
      </section>

      <nav
        className={`showcase-project-nav${navOpen ? ' is-raised' : ''}`}
        aria-label="Browse projects"
        onPointerEnter={() => {
          window.clearTimeout(navCloseTimer.current);
          setNavOpen(true);
        }}
        onPointerLeave={() => {
          window.clearTimeout(navCloseTimer.current);
          navCloseTimer.current = window.setTimeout(() => {
            setNavOpen(false);
          }, 300);
        }}
      >
        <span className="showcase-project-nav__grip" aria-hidden="true" />
        <button
          type="button"
          onClick={() => navigateProjects(-1)}
          aria-label="Previous project"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 12H5M10 7l-5 5 5 5" />
          </svg>
        </button>
        <span aria-live="polite">
          <b>{String(selectedIndex + 1).padStart(2, '0')}</b>
          <i />
          {String(SHOWCASE_PROJECTS.length).padStart(2, '0')}
        </span>
        <button
          type="button"
          onClick={() => navigateProjects(1)}
          aria-label="Next project"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M14 7l5 5-5 5" />
          </svg>
        </button>
      </nav>
    </main>
  );
}
