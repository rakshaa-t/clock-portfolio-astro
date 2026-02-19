export function esc(s){return s?s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'):'';}
export const prefersReducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
