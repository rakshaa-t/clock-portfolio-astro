import { expect, test } from '@playwright/test';

const FILTERS = {
  All: [
    'figma-org-structure',
    'prevue',
    'mobile-motion-concept',
    'shape-morph-tool',
    'toggle-demo-physics',
    'wavy-dropdown',
    'studyloop',
    'dealdoc',
    'tickle',
    'magicpath-experiments',
    'card-tilt',
    'magicpath',
    'skeuomorphic-buttons',
    'chain-landing',
    'strava-redesign',
    'greex-defi',
    'indianoil-dashboard',
    'ova-app',
  ],
  Clients: [
    'studyloop',
    'dealdoc',
    'tickle',
    'greex-defi',
    'indianoil-dashboard',
    'ova-app',
  ],
  Experiments: [
    'figma-org-structure',
    'mobile-motion-concept',
    'shape-morph-tool',
    'toggle-demo-physics',
    'wavy-dropdown',
    'magicpath-experiments',
    'card-tilt',
    'magicpath',
    'skeuomorphic-buttons',
    'chain-landing',
    'strava-redesign',
  ],
  Live: ['prevue'],
  Mobile: [
    'mobile-motion-concept',
    'studyloop',
    'tickle',
    'strava-redesign',
    'ova-app',
  ],
};

const diagnostics = (page) =>
  page.evaluate(() => window.__showcaseCarouselDiagnostics());

async function chooseFilter(page, label) {
  await page.getByRole('tab', { name: label }).click();
  await expect
    .poll(async () => (await diagnostics(page)).activeSourceIds)
    .toEqual(FILTERS[label]);
}

test('filters retain the renderer and never expose a blank panel', async ({
  page,
}) => {
  await page.goto('./');
  await expect(page.locator('.liquid-glass-carousel canvas')).toHaveCount(1);
  await expect(page.locator('.tab-filter__underline')).toHaveCount(0);
  const { engineId } = await diagnostics(page);
  const fixedPalette = await page.locator('.showcase-shell').evaluate((shell) => {
    const styles = getComputedStyle(shell);
    return { background: styles.backgroundColor, color: styles.color };
  });

  for (const label of Object.keys(FILTERS)) {
    await chooseFilter(page, label);
    const state = await diagnostics(page);
    expect(state.engineId).toBe(engineId);
    expect(state.visiblePanels.every((panel) => panel.hasTexture)).toBe(true);
    await expect(page.locator('.showcase-shell')).toHaveCSS(
      'background-color',
      fixedPalette.background,
    );
    await expect(page.locator('.showcase-shell')).toHaveCSS(
      'color',
      fixedPalette.color,
    );
  }

  for (let cycle = 0; cycle < 20; cycle += 1) {
    for (const label of ['Clients', 'Experiments', 'Live', 'Mobile']) {
      await page.getByRole('tab', { name: label }).click();
    }
  }
  await chooseFilter(page, 'All');
  expect((await diagnostics(page)).engineId).toBe(engineId);
  await expect(page.locator('.liquid-glass-carousel canvas')).toHaveCount(1);
});

test('fast motion displays posters, then settled viewport video plays', async ({
  page,
}) => {
  await page.goto('./');
  await chooseFilter(page, 'Live');

  await page.locator('.liquid-glass-carousel canvas').hover();
  await page.mouse.wheel(0, 5000);
  await expect.poll(async () => {
    const source = (await diagnostics(page)).sources.find(
      (item) => item.id === 'prevue',
    );
    return source?.displayingPoster && !source?.playing;
  }).toBe(true);

  await expect.poll(async () => {
    const source = (await diagnostics(page)).sources.find(
      (item) => item.id === 'prevue',
    );
    return source?.playing && !source?.displayingPoster;
  }).toBe(true);

  const first = (await diagnostics(page)).sources.find(
    (item) => item.id === 'prevue',
  ).currentTime;
  await expect.poll(async () => {
    const source = (await diagnostics(page)).sources.find(
      (item) => item.id === 'prevue',
    );
    return source.currentTime > first;
  }).toBe(true);
});

test('mobile filtering does not create the desktop WebGL carousel', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('./');
  await page.getByRole('tab', { name: 'Clients' }).click();
  await expect(page.locator('.showcase-mobile-card')).toHaveCount(6);
  await expect(page.locator('.liquid-glass-carousel canvas')).toHaveCount(0);
});
