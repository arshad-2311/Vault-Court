/**
 * VAULT 147 — DESKTOP PRECISION CONTEXT CURSOR
 * 60fps GPU-accelerated tracking with contextual labels (VIEW, BOOK, SELECT)
 */

import { isReducedMotion, isTouchDevice } from './motion-core.js';

export function initCustomCursor() {
  if (isReducedMotion() || isTouchDevice()) {
    return;
  }

  const cursorDot = document.querySelector('.cursor-dot');
  const cursorFollower = document.querySelector('.cursor-follower');
  const cursorLabel = document.querySelector('.cursor-follower-label');

  if (!cursorDot || !cursorFollower || typeof window.gsap === 'undefined') {
    return;
  }

  // Use gsap.quickTo for instant 60fps tracking without layout thrashing
  const dotX = window.gsap.quickTo(cursorDot, 'x', { duration: 0.1, ease: 'power2.out' });
  const dotY = window.gsap.quickTo(cursorDot, 'y', { duration: 0.1, ease: 'power2.out' });
  const followerX = window.gsap.quickTo(cursorFollower, 'x', { duration: 0.25, ease: 'power2.out' });
  const followerY = window.gsap.quickTo(cursorFollower, 'y', { duration: 0.25, ease: 'power2.out' });

  window.addEventListener('mousemove', (e) => {
    document.body.classList.remove('cursor-hidden');
    dotX(e.clientX);
    dotY(e.clientY);
    followerX(e.clientX);
    followerY(e.clientY);
  });

  document.addEventListener('mouseleave', () => {
    document.body.classList.add('cursor-hidden');
  });

  // Delegate hover events for dynamic context tags
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('[data-cursor], a, button, .unit-card, .gallery-item, .date-pill-btn');
    if (!target) {
      document.body.classList.remove('cursor-hover', 'cursor-view', 'cursor-book', 'cursor-select');
      if (cursorLabel) cursorLabel.textContent = '';
      return;
    }

    const cursorType = target.getAttribute('data-cursor');
    document.body.classList.add('cursor-hover');

    if (cursorType === 'view') {
      document.body.classList.add('cursor-view');
      if (cursorLabel) cursorLabel.textContent = 'VIEW';
    } else if (cursorType === 'book') {
      document.body.classList.add('cursor-book');
      if (cursorLabel) cursorLabel.textContent = 'BOOK';
    } else if (cursorType === 'select') {
      document.body.classList.add('cursor-select');
      if (cursorLabel) cursorLabel.textContent = 'SELECT';
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('[data-cursor], a, button, .unit-card, .gallery-item, .date-pill-btn');
    if (target) {
      document.body.classList.remove('cursor-hover', 'cursor-view', 'cursor-book', 'cursor-select');
      if (cursorLabel) cursorLabel.textContent = '';
    }
  });
}
