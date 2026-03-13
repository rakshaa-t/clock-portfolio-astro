// ═══ HAPTICS ═══
// Thin wrapper around web-haptics for mobile feedback.
// On desktop: no touch = no instance created (no-op).
// On iOS: library uses hidden checkbox click for haptics even without Vibration API.

import { WebHaptics } from 'web-haptics';

let instance=null;
const isMobile='ontouchstart' in window||navigator.maxTouchPoints>0;
const reducedMotion=window.matchMedia('(prefers-reduced-motion:reduce)').matches;

function get(){
  if(!isMobile||reducedMotion) return null;
  if(!instance) instance=new WebHaptics();
  return instance;
}

export function haptic(input){
  const h=get();
  if(h) h.trigger(input);
}

export function destroyHaptics(){
  if(instance){instance.destroy();instance=null;}
}
