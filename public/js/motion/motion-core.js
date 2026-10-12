/**
 * VAULT 147 — MOTION CORE & REGISTRY
 * Centralized motion tokens, GSAP/ScrollTrigger/Flip registration, reduced-motion guards
 */

export const MotionTokens = {
  duration: {
    micro: 0.25,
    ui: 0.45,
    cinematic: 0.95
  },
  ease: {
    fast: 'power2.out',
    smooth: 'power3.out',
    cinematic: 'power4.inOut',
    spring: 'back.out(1.7)'
  }
};

export function isReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isTouchDevice() {
  return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
}

export function initMotionCore() {
  if (typeof window.gsap !== 'undefined') {
    if (typeof window.ScrollTrigger !== 'undefined') {
      window.gsap.registerPlugin(window.ScrollTrigger);
    }
    if (typeof window.Flip !== 'undefined') {
      window.gsap.registerPlugin(window.Flip);
    }
    // Set default easing for predictable motion
    window.gsap.defaults({
      ease: MotionTokens.ease.smooth,
      duration: MotionTokens.duration.ui
    });
  }
}
