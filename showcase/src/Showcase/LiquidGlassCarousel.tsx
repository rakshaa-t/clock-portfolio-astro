import {
  type CSSProperties,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createCarousel } from '../carousel/engine.js';
import {
  CONFIG,
  PROJECT_ASPECTS,
  type CarouselItem,
} from '../carousel/config';
import {
  type ShowcaseProject,
} from './showcaseProjects';
import {
  getShowcaseStageBackground,
  hexToNumber,
} from './themeColor';
import './liquid-glass-carousel.css';

function toCarouselItem(project: ShowcaseProject): CarouselItem {
  const thumb = project.thumbnail;
  const aspect = PROJECT_ASPECTS[project.slug] ?? null;
  const brand = project.title;
  const desc = project.category;
  const caseStudyUrl =
    project.category === 'Client' || project.slug === 'prevue'
      ? project.externalUrl
      : undefined;
  const caseStudyLabel =
    project.slug === 'prevue' ? 'View live website' : 'View case study';

  if (thumb.type === 'image') {
    return { src: thumb.src, aspect, brand, desc, caseStudyUrl, caseStudyLabel };
  }

  if (thumb.type === 'loop') {
    return {
      src: thumb.poster,
      video: thumb.src,
      aspect,
      brand,
      desc,
      caseStudyUrl,
      caseStudyLabel,
    };
  }

  if (thumb.type === 'video') {
    return {
      src: thumb.src,
      video: thumb.src,
      aspect,
      brand,
      desc,
      caseStudyUrl,
      caseStudyLabel,
    };
  }

  return {
    src: '',
    aspect: aspect ?? 1,
    brand,
    desc,
    caseStudyUrl,
    caseStudyLabel,
  };
}

export function LiquidGlassCarousel({
  selectedSlug,
  onSelect,
  onScrollActivity,
  projects: showcaseProjects,
}: {
  selectedSlug: string;
  onSelect: (project: ShowcaseProject) => void;
  onScrollActivity?: () => void;
  projects: ShowcaseProject[];
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const caseStudyOverlayRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<ReturnType<typeof createCarousel> | null>(null);
  const slugRef = useRef(selectedSlug);
  const fromCarouselRef = useRef(false);
  const onSelectRef = useRef(onSelect);
  const onScrollActivityRef = useRef(onScrollActivity);
  const projects = useMemo(
    () => showcaseProjects.map(toCarouselItem),
    [showcaseProjects],
  );
  const [isPhone, setIsPhone] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia('(max-width: 767px)').matches,
  );

  onSelectRef.current = onSelect;
  onScrollActivityRef.current = onScrollActivity;

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)');
    const update = () => setIsPhone(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (isPhone) return;

    const mount = mountRef.current;
    if (!mount) return;

    // The canvas is full-screen; keep the row in the lower showcase band.
    const fitPanel = () => {
      CONFIG.PANEL_H = Math.max(
        280,
        Math.round(mount.clientHeight * CONFIG.PANEL_HEIGHT_RATIO),
      );
    };
    fitPanel();

    slugRef.current = selectedSlug;
    fromCarouselRef.current = false;
    const initialIndex = Math.max(
      0,
      showcaseProjects.findIndex((project) => project.slug === selectedSlug),
    );

    const engine = createCarousel(mount, {
      projects,
      initialIndex,
      caseStudyOverlayElement: caseStudyOverlayRef.current,
      onActiveChange: (index: number) => {
        const project = showcaseProjects[index];
        if (project && project.slug !== slugRef.current) {
          fromCarouselRef.current = true;
          slugRef.current = project.slug;
          onSelectRef.current(project);
        }
        onScrollActivityRef.current?.();
      },
      onPanelSelect: (index: number) => {
        const project = showcaseProjects[index];
        if (project) {
          fromCarouselRef.current = true;
          slugRef.current = project.slug;
          onSelectRef.current(project);
        }
        onScrollActivityRef.current?.();
      },
    });
    engineRef.current = engine;

    const ro = new ResizeObserver(() => {
      fitPanel();
      engine.refreshLayout();
    });
    ro.observe(mount);

    return () => {
      ro.disconnect();
      engine.destroy();
      engineRef.current = null;
    };
  }, [isPhone, projects, showcaseProjects]);

  useEffect(() => {
    if (isPhone) return;

    if (slugRef.current === selectedSlug) return;
    if (fromCarouselRef.current) {
      fromCarouselRef.current = false;
      slugRef.current = selectedSlug;
      return;
    }
    slugRef.current = selectedSlug;
    const engine = engineRef.current;
    if (!engine) return;
    const index = showcaseProjects.findIndex(
      (project) => project.slug === selectedSlug,
    );
    if (index >= 0) engine.scrollToSourceIndex(index, false);
  }, [isPhone, selectedSlug, showcaseProjects]);

  useEffect(() => {
    if (isPhone) return;

    const mount = mountRef.current;
    const engine = engineRef.current;
    if (!mount || !engine) return;
    const project = showcaseProjects.find(
      (item) => item.slug === selectedSlug,
    );
    const clear = project
      ? hexToNumber(getShowcaseStageBackground(project.theme.background))
      : null;
    if (clear !== null) engine.setClearColor(clear);
  }, [isPhone, selectedSlug, showcaseProjects]);

  const selectedIndex = Math.max(
    0,
    showcaseProjects.findIndex((project) => project.slug === selectedSlug),
  );

  const selectIndex = (index: number) => {
    const wrapped =
      (index + showcaseProjects.length) % showcaseProjects.length;
    onSelectRef.current(showcaseProjects[wrapped]);
    onScrollActivityRef.current?.();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      selectIndex(selectedIndex - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      selectIndex(selectedIndex + 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      selectIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      selectIndex(showcaseProjects.length - 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectIndex(selectedIndex);
    }
  };

  if (isPhone) return null;

  return (
    <>
      <div
        ref={mountRef}
        className="liquid-glass-carousel"
        role="listbox"
        tabIndex={0}
        aria-label="Select a project"
        aria-activedescendant={`liquid-carousel-option-${selectedSlug}`}
        onKeyDown={handleKeyDown}
        style={
          {
            '--liquid-carousel-bg': getShowcaseStageBackground(
              showcaseProjects[selectedIndex].theme.background,
            ),
          } as CSSProperties
        }
      >
        <div className="liquid-glass-carousel__sr">
          {showcaseProjects.map((project) => (
            <div
              key={project.slug}
              id={`liquid-carousel-option-${project.slug}`}
              role="option"
              aria-selected={project.slug === selectedSlug}
            >
              {project.title}
            </div>
          ))}
        </div>
        <div
          ref={caseStudyOverlayRef}
          className="liquid-glass-carousel__case-study"
          aria-hidden="true"
        >
          <span>View case study</span>
        </div>
      </div>
    </>
  );
}
