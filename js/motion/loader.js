/**
 * VAULT 147 — PROLOGUE SEQUENCE
 * Orchestrates the blackout -> 147 geometric emergence -> arena unveil
 */

import { isReducedMotion } from './motion-core.js';

export function initPrologue(onComplete) {
  const prologueEl = document.getElementById('vault-prologue');
  const heroVideo = document.getElementById('hero-bg-video');

  if (!prologueEl) {
    if (onComplete) onComplete();
    return;
  }

  // If reduced motion is requested, instantly bypass the loader
  if (isReducedMotion()) {
    prologueEl.classList.add('prologue-complete');
    if (heroVideo && heroVideo.paused) {
      heroVideo.play().catch(() => {});
    }
    if (onComplete) onComplete();
    return;
  }

  // Fast, cinematic 1.4s prologue
  setTimeout(() => {
    prologueEl.classList.add('prologue-complete');

    // Trigger hero video playback
    if (heroVideo) {
      heroVideo.play().catch((err) => {
        console.log('Video autoplay handled:', err);
      });
    }

    if (onComplete) {
      onComplete();
    }
  }, 1400);
}
