/**
 * VAULT 147 — APPLICATION MASTER BOOTSTRAP
 * Integrates visual identity, motion engine, booking state, gallery & router
 */

import { initMotionCore } from './motion/motion-core.js';
import { initLenisScroll } from './motion/lenis-scroll.js';
import { initPrologue } from './motion/loader.js';
import { initCustomCursor } from './motion/cursor.js';
import { initMagneticButtons } from './motion/magnetic.js';
import { initScrollReveals } from './motion/reveals.js';
import { initScrollVelocity } from './motion/velocity.js';
import { initHoverDepth } from './motion/hover-depth.js';
import { bookingEngine } from './booking.js';
import { galleryEngine } from './gallery.js';
import { viewRouter } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Motion Core & Register GSAP Plugins
  initMotionCore();

  // 2. Initialize Lenis Smooth Inertial Scroll
  initLenisScroll();

  // 3. Initialize Precision Desktop Context Cursor
  initCustomCursor();

  // 4. Initialize Magnetic CTA Buttons
  initMagneticButtons();

  // 5. Initialize Interactive Booking Engine
  bookingEngine.init();

  // 6. Initialize Editorial Gallery & Lightbox
  galleryEngine.init();

  // 7. Initialize Navigation Router & Active Highlights
  viewRouter.init();

  // 8. Initialize Hover Parallax Depth
  initHoverDepth();

  // 9. Initialize Scroll Velocity Distortion
  initScrollVelocity();

  // 10. Run The Vault Prologue & Unveil Hero
  initPrologue(() => {
    initScrollReveals();
  });

  // Bind Quick Contact Form
  const contactForm = document.getElementById('quick-inquiry-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const feedback = document.getElementById('contact-form-feedback');
      if (feedback) {
        feedback.style.display = 'block';
        feedback.textContent = '[INQUIRY TRANSMITTED] We will connect via WhatsApp shortly.';
        contactForm.reset();
        setTimeout(() => {
          feedback.style.display = 'none';
        }, 5000);
      }
    });
  }
});
