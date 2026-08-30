/**
 * VAULT 147 — LENIS SMOOTH SCROLL INTEGRATION
 * Smooth inertial scrolling synced directly to GSAP's render ticker
 */

import { isReducedMotion, isTouchDevice } from './motion-core.js';

let lenisInstance = null;

export function initLenisScroll() {
  const progressBar = document.getElementById('scroll-progress-bar');

  // Track scroll progress for both Lenis and native fallback
  const updateProgress = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar && maxScroll > 0) {
      const progress = Math.min(Math.max((scrollY / maxScroll) * 100, 0), 100);
      progressBar.style.width = `${progress}%`;
    }
  };

  // If reduced motion is requested or device is pure touch, fallback to native scrolling
  if (isReducedMotion() || isTouchDevice() || typeof window.Lenis === 'undefined') {
    window.addEventListener('scroll', updateProgress, { passive: true });
    return null;
  }

  try {
    lenisInstance = new window.Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-inspired smooth deceleration curve
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      infinite: false
    });

    // Update ScrollTrigger on scroll
    if (window.ScrollTrigger) {
      lenisInstance.on('scroll', window.ScrollTrigger.update);
    }

    lenisInstance.on('scroll', updateProgress);

    // Sync with GSAP ticker for tear-free 60fps compositor timing
    if (window.gsap) {
      window.gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });
      window.gsap.ticker.lagSmoothing(0);
    }

    return lenisInstance;
  } catch (err) {
    console.warn('Lenis initialization fallback:', err);
    window.addEventListener('scroll', updateProgress, { passive: true });
    return null;
  }
}

export function getLenis() {
  return lenisInstance;
}
