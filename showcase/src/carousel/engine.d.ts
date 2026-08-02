import type { CarouselItem } from './config';

export type CarouselEngine = {
  closeFocus: () => void;
  replayEntry: () => void;
  refreshLayout: () => void;
  scrollToSourceId: (sourceId: string, immediate?: boolean) => void;
  setFilter: (filter: {
    sourceIds: string[];
    selectedSourceId?: string;
  }) => Promise<boolean>;
  setClearColor: (hex: number) => void;
  destroy: () => void;
};

export function createCarousel(
  mount: HTMLElement,
  callbacks?: {
    projects?: CarouselItem[];
    initialSourceId?: string;
    initialSourceIds?: string[];
    caseStudyOverlayElement?: HTMLElement | null;
    onActiveChange?: (sourceId: string) => void;
    onPanelSelect?: (sourceId: string) => void;
    onFocusChange?: (open: boolean) => void;
    onEntryDone?: (done: boolean) => void;
  },
): CarouselEngine;
