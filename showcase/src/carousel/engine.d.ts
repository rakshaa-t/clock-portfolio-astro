import type { CarouselItem } from './config';

export type CarouselEngine = {
  closeFocus: () => void;
  replayEntry: () => void;
  refreshLayout: () => void;
  scrollToSourceIndex: (srcIndex: number, immediate?: boolean) => void;
  setClearColor: (hex: number) => void;
  destroy: () => void;
};

export function createCarousel(
  mount: HTMLElement,
  callbacks?: {
    projects?: CarouselItem[];
    initialIndex?: number;
    caseStudyOverlayElement?: HTMLElement | null;
    onActiveChange?: (index: number) => void;
    onPanelSelect?: (index: number) => void;
    onFocusChange?: (open: boolean) => void;
    onEntryDone?: (done: boolean) => void;
  },
): CarouselEngine;
