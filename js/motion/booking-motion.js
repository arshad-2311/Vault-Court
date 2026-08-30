/**
 * VAULT 147 — BOOKING MOTION & FLIP CONTINUITY
 * Spatial transitions, numerical odometer ticker, and VIP pass reveal
 */

import { isReducedMotion } from './motion-core.js';

export function animatePriceChange(targetEl, fromVal, toVal) {
  if (!targetEl) return;

  if (isReducedMotion() || typeof window.gsap === 'undefined') {
    targetEl.textContent = `₹${toVal}`;
    return;
  }

  const obj = { val: fromVal };
  window.gsap.to(obj, {
    val: toVal,
    duration: 0.35,
    ease: 'power2.out',
    onUpdate: () => {
      targetEl.textContent = `₹${Math.round(obj.val)}`;
    }
  });
}

export function animateSessionPass(passEl) {
  if (!passEl || isReducedMotion() || typeof window.gsap === 'undefined') return;

  window.gsap.from(passEl, {
    scale: 0.92,
    y: 30,
    opacity: 0,
    duration: 0.6,
    ease: 'back.out(1.4)'
  });
}
