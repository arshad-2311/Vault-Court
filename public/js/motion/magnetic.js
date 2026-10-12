/**
 * VAULT 147 — MAGNETIC INTERACTION SYSTEM
 * Subtle physics pull for primary CTAs and key interactive triggers (Desktop only)
 */

import { isReducedMotion, isTouchDevice } from './motion-core.js';

export function initMagneticButtons() {
  if (isReducedMotion() || isTouchDevice() || typeof window.gsap === 'undefined') {
    return;
  }

  const magneticElements = document.querySelectorAll('[data-magnetic]');

  magneticElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Restrained max displacement (max 8px) to keep interaction refined
      const deltaX = (e.clientX - centerX) * 0.28;
      const deltaY = (e.clientY - centerY) * 0.28;

      window.gsap.to(el, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    el.addEventListener('mouseleave', () => {
      window.gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.4)'
      });
    });
  });
}
