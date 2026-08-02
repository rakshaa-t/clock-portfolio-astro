export function resolveVideoPlaybackPolicy({
  speed,
  motionPaused,
  hidden,
  active,
  preloadEligible,
  playEligible,
  stopSpeed = 2200,
  resumeSpeed = 1400,
}) {
  let nextMotionPaused = motionPaused;
  if (speed >= stopSpeed) nextMotionPaused = true;
  else if (speed <= resumeSpeed) nextMotionPaused = false;

  if (hidden || !active) {
    return {
      motionPaused: nextMotionPaused,
      shouldPreload: false,
      shouldPlay: false,
      showPoster: true,
    };
  }

  return {
    motionPaused: nextMotionPaused,
    shouldPreload: preloadEligible,
    shouldPlay: playEligible && !nextMotionPaused,
    showPoster: nextMotionPaused,
  };
}
