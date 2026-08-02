import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveVideoPlaybackPolicy } from './playbackPolicy.js';

const policy = (overrides = {}) =>
  resolveVideoPlaybackPolicy({
    speed: 0,
    motionPaused: false,
    hidden: false,
    active: true,
    preloadEligible: true,
    playEligible: true,
    ...overrides,
  });

test('velocity hysteresis pauses at 2,200px/s and resumes at 1,400px/s', () => {
  const stopped = policy({ speed: 2200 });
  assert.equal(stopped.motionPaused, true);
  assert.equal(stopped.shouldPlay, false);

  const betweenThresholds = policy({ speed: 1800, motionPaused: true });
  assert.equal(betweenThresholds.motionPaused, true);
  assert.equal(betweenThresholds.shouldPlay, false);

  const resumed = policy({ speed: 1400, motionPaused: true });
  assert.equal(resumed.motionPaused, false);
  assert.equal(resumed.shouldPlay, true);
});

test('fast scrolling keeps a renderable poster while pausing video playback', () => {
  const result = policy({ speed: 2600 });
  assert.equal(result.showPoster, true);
  assert.equal(result.shouldPlay, false);
  assert.equal(result.shouldPreload, true);
});

test('a settled eligible viewport video is requested to play', () => {
  const result = policy({ speed: 1200, motionPaused: true });
  assert.equal(result.showPoster, false);
  assert.equal(result.shouldPlay, true);
});

test('hidden or inactive sources are paused and excluded from media work', () => {
  for (const overrides of [{ hidden: true }, { active: false }]) {
    const result = policy(overrides);
    assert.equal(result.shouldPreload, false);
    assert.equal(result.shouldPlay, false);
    assert.equal(result.showPoster, true);
  }
});
