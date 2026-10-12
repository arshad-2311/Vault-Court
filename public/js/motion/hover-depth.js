/**
 * VAULT 147 — 2.5D POINTER HOVER DEPTH
 * Subtle mouse-driven parallax displacement on desktop gallery cards
 */

import { isReducedMotion, isTouchDevice } from './motion-core.js';

export function initHoverDepth() {
  if (isReducedMotion() || isTouchDevice() || typeof window.gsap === 'undefined') {
    return;
  }

  const galleryItems = document.querySelectorAll('.gallery-item, .game-preview-card');

  galleryItems.forEach((card) => {
    const img = card.querySelector('img');
    if (!img) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      window.gsap.to(img, {
        x: x * 10,
        y: y * 10,
        duration: 0.4,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      window.gsap.to(img, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
      });
    });
  });
}
