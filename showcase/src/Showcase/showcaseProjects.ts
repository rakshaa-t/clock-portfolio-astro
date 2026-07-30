export type ShowcaseMedia =
  | { type: 'image'; src: string; alt?: string }
  | { type: 'video'; src: string }
  | { type: 'loop'; src: string; poster: string; alt?: string };

export type ShowcaseTheme = {
  background: string;
  surface: string;
  ink: string;
  muted: string;
  accent: string;
};

export type ShowcaseProject = {
  slug: string;
  title: string;
  category: 'Live' | 'Client' | 'Experiment';
  year: string;
  tags: string[];
  description: string;
  thumbnail: ShowcaseMedia | { type: 'color'; color: string };
  presentation:
    | { type: 'live'; url: string }
    | { type: 'gallery'; media: ShowcaseMedia[] }
    | { type: 'video'; media: ShowcaseMedia }
    | { type: 'image'; media: ShowcaseMedia }
    | { type: 'color'; color: string; note: string };
  externalUrl?: string;
  theme: ShowcaseTheme;
};

const ASSET_BASE = 'https://raksha.design';
const asset = (path: string) => `${ASSET_BASE}${path}`;
const localAsset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
/** Local strip thumbs only — never remote for the nav. */
const thumb = (name: string, alt?: string, ext: 'jpg' | 'svg' = 'jpg'): ShowcaseMedia => ({
  type: 'image',
  src: localAsset(`/showcase-thumbs/${name}.${ext}`),
  alt,
});
/** Tiny local loop + poster for strip. @deprecated — use localLoop() */
const loopThumb = (name: string, alt?: string): ShowcaseMedia => ({
  type: 'loop',
  src: localAsset(`/showcase-thumbs/${name}-loop.mp4`),
  poster: localAsset(`/showcase-thumbs/${name}.jpg`),
  alt,
});
const image = (src: string, alt?: string): ShowcaseMedia => ({
  type: 'image',
  src: asset(src),
  alt,
});
const video = (src: string): ShowcaseMedia => ({
  type: 'video',
  src: asset(src),
});
const localVideo = (src: string): ShowcaseMedia => ({
  type: 'video',
  src: localAsset(src),
});
const localImage = (src: string, alt?: string): ShowcaseMedia => ({
  type: 'image',
  src: localAsset(src),
  alt,
});
/** Full-quality strip loop with a high-res poster frame. */
const localLoop = (
  videoSrc: string,
  posterSrc: string,
  alt?: string,
): ShowcaseMedia => ({
  type: 'loop',
  src: localAsset(videoSrc),
  poster: localAsset(posterSrc),
  alt,
});

export const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    slug: 'figma-org-structure',
    title: 'Org Structure',
    category: 'Experiment',
    year: '2026',
    tags: ['Figma Motion', 'Information design', 'Prototype'],
    description:
      'A looping organisational map, preserved from the supplied Figma frame as its exact rendered motion study.',
    thumbnail: {
      type: 'loop',
      src: localAsset('/showcase-thumbs/figma-org-structure.mp4'),
      poster: localAsset('/showcase-thumbs/figma-org-structure-poster.svg'),
      alt: 'Animated organisational structure diagram',
    },
    presentation: {
      type: 'video',
      media: localVideo('/showcase-thumbs/figma-org-structure.mp4'),
    },
    theme: {
      background: '#f3e9ce',
      surface: '#f3e9ce',
      ink: '#000000',
      muted: '#665e4e',
      accent: '#000000',
    },
  },
  {
    slug: 'prevue',
    title: 'Prevue',
    category: 'Live',
    year: '2026',
    tags: ['Developer tool', 'React', 'Interaction'],
    description:
      'Paste AI-generated code and preview it inside real device mockups with rubber-band resizing and morph transitions.',
    // Full-resolution capture — strip and stage share the same source.
    thumbnail: localLoop(
      '/showcase-media/prevue/hero.mp4',
      '/showcase-media/prevue/poster.png',
      'Prevue device preview',
    ),
    presentation: {
      type: 'video',
      media: localVideo('/showcase-media/prevue/hero.mp4'),
    },
    externalUrl: 'https://prevue.raksha.design',
    theme: {
      background: '#111216',
      surface: '#1b1d22',
      ink: '#f7f4ee',
      muted: '#aaa8a2',
      accent: '#d4ff58',
    },
  },
  {
    slug: 'mobile-motion-concept',
    title: 'Mobile Motion Concept',
    category: 'Experiment',
    year: '2026',
    tags: ['Mobile', 'Motion', 'Interaction'],
    description:
      'A mobile-screen motion study exploring pacing, hierarchy and tactile transitions in a compact interface.',
    thumbnail: localLoop(
      '/showcase-media/mobile-motion-concept/hero.mp4',
      '/showcase-media/mobile-motion-concept/poster.png',
      'Animated mobile interface concept',
    ),
    presentation: {
      type: 'video',
      media: localVideo('/showcase-media/mobile-motion-concept/hero.mp4'),
    },
    theme: {
      background: '#f3e9e1',
      surface: '#faf3ed',
      ink: '#2e2928',
      muted: '#716864',
      accent: '#d86ca7',
    },
  },
  {
    slug: 'shape-morph-tool',
    title: 'Shape Morph Tool',
    category: 'Experiment',
    year: '2026',
    tags: ['Generative motion', 'Tool design', 'Interaction'],
    description:
      'A concept tool that takes user-provided shapes, automatically morphs between them and generates the in-between motion.',
    thumbnail: localLoop(
      '/showcase-media/shape-morph-tool/hero.mp4',
      '/showcase-media/shape-morph-tool/poster.png',
      'Shape morphing tool concept',
    ),
    presentation: {
      type: 'video',
      media: localVideo('/showcase-media/shape-morph-tool/hero.mp4'),
    },
    theme: {
      background: '#eeece8',
      surface: '#f8f7f3',
      ink: '#373631',
      muted: '#6e6c65',
      accent: '#89ad5c',
    },
  },
  {
    slug: 'toggle-demo-physics',
    title: 'Toggle Physics',
    category: 'Experiment',
    year: '2026',
    tags: ['Interaction', 'Motion', 'Physics'],
    description:
      'A spring-driven toggle with tactile damping and overshoot tuned for deliberate on/off feedback.',
    thumbnail: localLoop(
      '/showcase-media/toggle-demo-physics/demo.mp4',
      '/showcase-media/toggle-demo-physics/poster.png',
      'Physics toggle interaction',
    ),
    presentation: {
      type: 'video',
      media: localVideo('/showcase-media/toggle-demo-physics/demo.mp4'),
    },
    theme: {
      background: '#12141a',
      surface: '#1a1d25',
      ink: '#f2f0eb',
      muted: '#9a9690',
      accent: '#6ea8ff',
    },
  },
  {
    slug: 'wavy-dropdown',
    title: 'Wavy Dropdown',
    category: 'Experiment',
    year: '2026',
    tags: ['Interaction', 'Menu', 'Motion'],
    description:
      'A dropdown panel with fluid edge motion and layered timing so open, settle and dismiss feel connected.',
    thumbnail: localLoop(
      '/showcase-media/wavy-dropdown/demo.mp4',
      '/showcase-media/wavy-dropdown/poster.png',
      'Wavy dropdown interaction',
    ),
    presentation: {
      type: 'video',
      media: localVideo('/showcase-media/wavy-dropdown/demo.mp4'),
    },
    theme: {
      background: '#141218',
      surface: '#1d1a22',
      ink: '#f4f1ea',
      muted: '#9b959f',
      accent: '#c4a0ff',
    },
  },
  {
    slug: 'studyloop',
    title: 'StudyLoop App',
    category: 'Client',
    year: '2026',
    tags: ['Mobile', 'EdTech', 'Product design'],
    description:
      'An iOS study companion shaped from research through flows, visual direction and focused daily rituals.',
    thumbnail: localImage(
      '/showcase-media/studyloop/overview.png',
      'StudyLoop phone screens',
    ),
    presentation: {
      type: 'gallery',
      media: [
        image('/projects/studyloop/today-summary.png', 'StudyLoop daily summary'),
        image('/projects/studyloop/session-timer.png', 'StudyLoop session timer'),
        image('/projects/studyloop/phone-spread.png', 'StudyLoop phone screens'),
        image('/projects/studyloop/screens-grid.png', 'StudyLoop interface system'),
      ],
    },
    externalUrl:
      'https://medium.com/@rakshatated98/case-study-4-ios-app-953304380192',
    theme: {
      background: '#dbe8a9',
      surface: '#f1f5d9',
      ink: '#1c2117',
      muted: '#596046',
      accent: '#6d8b15',
    },
  },
  {
    slug: 'dealdoc',
    title: 'DealDoc',
    category: 'Client',
    year: '2025',
    tags: ['SaaS', 'AI', 'Dashboard'],
    description:
      'A venture deal workspace for diligence, AI-assisted insights and complex investment workstreams.',
    thumbnail: localImage(
      '/showcase-media/dealdoc/overview.png',
      'DealDoc overview',
    ),
    presentation: {
      type: 'image',
      media: localImage(
        '/showcase-media/dealdoc/overview.png',
        'DealDoc venture workspace overview',
      ),
    },
    externalUrl:
      'https://contra.com/p/XXMgFmLU-uiux-design-for-deal-docs-investment-workspace?r=rakshadesign',
    theme: {
      background: '#dce6ed',
      surface: '#edf3f6',
      ink: '#18252e',
      muted: '#5f6f79',
      accent: '#537d98',
    },
  },
  {
    slug: 'tickle',
    title: 'Tickle',
    category: 'Client',
    year: '2025',
    tags: ['Mobile', 'MVP', 'Pet care'],
    description:
      'A playful pet-care MVP built around habit loops, expressive onboarding and affectionate daily interactions.',
    thumbnail: localImage(
      '/showcase-media/tickle/overview.png',
      'Tickle pet-care app',
    ),
    presentation: {
      type: 'image',
      media: localImage(
        '/showcase-media/tickle/overview.png',
        'Tickle pet-care app screens',
      ),
    },
    externalUrl:
      'https://medium.com/@rakshatated98/tickle-app-case-study-6a3e651b5418',
    theme: {
      background: '#e8e2f1',
      surface: '#f5f1f8',
      ink: '#2e2639',
      muted: '#756a82',
      accent: '#8875b5',
    },
  },
  {
    slug: 'magicpath-experiments',
    title: 'MagicPath Experiments',
    category: 'Experiment',
    year: '2024',
    tags: ['Animation', 'Prototype', 'UI'],
    description:
      'A collection of compact motion studies made while exploring expressive interface behaviours.',
    thumbnail: localLoop(
      '/showcase-media/magicpath-experiments/demo.mp4',
      '/showcase-media/magicpath-experiments/poster.png',
      'MagicPath experiments',
    ),
    presentation: {
      type: 'video',
      media: localVideo('/showcase-media/magicpath-experiments/demo.mp4'),
    },
    theme: {
      background: '#e7ddea',
      surface: '#f3ecf5',
      ink: '#342439',
      muted: '#7c687f',
      accent: '#945d9c',
    },
  },
  {
    slug: 'card-tilt',
    title: 'Card Tilt',
    category: 'Experiment',
    year: '2024',
    tags: ['Interaction', '3D', 'Motion'],
    description:
      'A pointer-driven perspective study that gives stacked cards convincing weight, depth and response.',
    thumbnail: localLoop(
      '/showcase-media/card-tilt/demo.mp4',
      '/showcase-media/card-tilt/poster.jpg',
      'Card tilt interaction',
    ),
    presentation: {
      type: 'video',
      media: localVideo('/showcase-media/card-tilt/demo.mp4'),
    },
    theme: {
      background: '#ded9ee',
      surface: '#eeebf7',
      ink: '#28223a',
      muted: '#706982',
      accent: '#7160aa',
    },
  },
  {
    slug: 'magicpath',
    title: 'Contextual AI Chats',
    category: 'Experiment',
    year: '2024',
    tags: ['AI', 'Learning', 'Interaction'],
    description:
      'An AI chat concept that explains ideas with visual context, interactive details and data views, so understanding does not depend on long-form reading alone.',
    thumbnail: localLoop(
      '/showcase-media/magicpath/demo.mp4',
      '/showcase-media/magicpath/poster.jpg',
      'Contextual AI chat concept',
    ),
    presentation: {
      type: 'video',
      media: localVideo('/showcase-media/magicpath/demo.mp4'),
    },
    theme: {
      background: '#eadfec',
      surface: '#f5eef6',
      ink: '#38283b',
      muted: '#806d82',
      accent: '#a069a7',
    },
  },
  {
    slug: 'skeuomorphic-buttons',
    title: 'Skeuomorphic Buttons',
    category: 'Experiment',
    year: '2024',
    tags: ['UI', 'Tactility', 'Visual design'],
    description:
      'An exploration of tactile affordances through material, directional light and satisfying press states.',
    thumbnail: thumb('skeuomorphic-buttons', 'Skeuomorphic button studies'),
    presentation: {
      type: 'image',
      media: image('/projects/skeu-buttons.jpg', 'Skeuomorphic button studies'),
    },
    theme: {
      background: '#e9e3f0',
      surface: '#f5f1f7',
      ink: '#30283a',
      muted: '#776c81',
      accent: '#8d7aa9',
    },
  },
  {
    slug: 'chain-landing',
    title: 'Chain Landing',
    category: 'Experiment',
    year: '2024',
    tags: ['Web3', 'Landing page', 'Concept'],
    description:
      'A visual direction study for a chain-infrastructure product with an editorial, high-contrast rhythm.',
    thumbnail: thumb('chain-landing', 'Chain landing page'),
    presentation: {
      type: 'image',
      media: image('/projects/chain-landing.jpg', 'Chain landing page'),
    },
    theme: {
      background: '#e5e0ee',
      surface: '#f2eff6',
      ink: '#2a2533',
      muted: '#736b7c',
      accent: '#796b9f',
    },
  },
  {
    slug: 'strava-redesign',
    title: 'Strava Concept',
    category: 'Experiment',
    year: '2024',
    tags: ['Mobile', 'Fitness', 'Social'],
    description:
      'A fitness-app redesign focused on activity storytelling, social loops and momentum.',
    thumbnail: localImage(
      '/showcase-media/strava-redesign/overview.jpg',
      'Strava concept redesign',
    ),
    presentation: {
      type: 'image',
      media: image('/projects/cycling-app.jpg', 'Strava concept redesign'),
    },
    theme: {
      background: '#dce8eb',
      surface: '#edf4f5',
      ink: '#1c2b2e',
      muted: '#617377',
      accent: '#4b8491',
    },
  },
  {
    slug: 'greex-defi',
    title: 'Greex DeFi',
    category: 'Client',
    year: '2024',
    tags: ['Fintech', 'Trading', 'Web3'],
    description:
      'A DeFi trading platform spanning order flow, identity verification and strategy tooling.',
    thumbnail: thumb('greex-defi', 'Greex DeFi trading platform'),
    presentation: {
      type: 'gallery',
      media: [
        image('/projects/greex/greex-trade.jpg', 'Greex trade interface'),
        image('/projects/greex/greex-order.jpg', 'Greex order flow'),
        image('/projects/greex/greex-kyc.jpg', 'Greex KYC flow'),
        image('/projects/greex/greex-strategy.jpg', 'Greex strategy builder'),
        image('/projects/greex/greex-parlays.jpg', 'Greex parlays'),
      ],
    },
    externalUrl:
      'https://medium.com/@rakshatated98/greex-case-study-a-defi-trading-platform-195d2bf52575',
    theme: {
      background: '#dce7ef',
      surface: '#eef4f7',
      ink: '#1c2931',
      muted: '#647680',
      accent: '#6187a0',
    },
  },
  {
    slug: 'indianoil-dashboard',
    title: 'IndianOil Dashboard',
    category: 'Client',
    year: '2024',
    tags: ['Enterprise', 'Dashboard', 'Operations'],
    description:
      'Enterprise work-permit management for contractors, compliance and safety-critical operations.',
    thumbnail: thumb('indianoil-dashboard', 'IndianOil permit dashboard'),
    presentation: {
      type: 'gallery',
      media: [
        image('/projects/indianoil/indianoil-dashboard-1.png', 'IndianOil dashboard'),
        image('/projects/indianoil/indianoil-dashboard-2.png', 'IndianOil permit management'),
        image('/projects/indianoil/indianoil-mobile.png', 'IndianOil mobile interface'),
      ],
    },
    theme: {
      background: '#e4e1ed',
      surface: '#f2eff6',
      ink: '#292638',
      muted: '#716d80',
      accent: '#6868a4',
    },
  },
  {
    slug: 'ova-app',
    title: 'Ova App',
    category: 'Client',
    year: '2024',
    tags: ['Health', '0–1', 'Mobile'],
    description:
      'A women’s-health app developed from zero to one across onboarding, product features and motion.',
    thumbnail: thumb('ova-app', 'Ova women’s-health app'),
    presentation: {
      type: 'gallery',
      media: [
        image('/projects/ova/ova-screens.jpg', 'Ova app screens'),
        image('/projects/ova/ova-pick.jpg', 'Ova app selection flow'),
        image('/projects/ova/ova-onboarding.jpg', 'Ova app onboarding'),
        image('/projects/ova/ova-features.jpg', 'Ova app features'),
      ],
    },
    externalUrl:
      'https://medium.com/@rakshatated98/ova-app-case-study-3a652f27fde8',
    theme: {
      background: '#dce1ec',
      surface: '#edf0f6',
      ink: '#222735',
      muted: '#6c7180',
      accent: '#586a9d',
    },
  },
];
