/**
 * VAULT 147 — SCROLL VELOCITY PHYSICALITY
 * Micro-shear distortion on rapid scrolling that smoothly settles back
 */

import { isReducedMotion, isTouchDevice } from './motion-core.js';

export function initScrollVelocity() {
  if (isReducedMotion() || isTouchDevice() || typeof window.gsap === 'undefined') {
    return;
  }

  const targets = document.querySelectorAll('.hero-headline, .section-title-large');
  if (targets.length === 0) return;

  let lastScrollY = window.scrollY;
  let scrollVelocity = 0;
  let tickerRunning = false;

  const updateVelocity = () => {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    // Scale delta into subtle angle (max 0.6 degrees)
    scrollVelocity = Math.max(Math.min(delta * 0.04, 0.6), -0.6);

    if (Math.abs(scrollVelocity) > 0.02) {
      window.gsap.to(targets, {
        skewY: scrollVelocity,
        duration: 0.15,
        ease: 'power1.out',
        overwrite: 'auto'
      });
    } else {
      window.gsap.to(targets, {
        skewY: 0,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }

    if (Math.abs(delta) > 0.1) {
      requestAnimationFrame(updateVelocity);
    } else {
      tickerRunning = false;
      window.gsap.to(targets, { skewY: 0, duration: 0.3 });
    }
  };

  window.addEventListener('scroll', () => {
    if (!tickerRunning) {
      tickerRunning = true;
      requestAnimationFrame(updateVelocity);
    }
  }, { passive: true });
}
