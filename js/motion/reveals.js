/**
 * VAULT 147 — SCROLL REVEALS & STORYTELLING
 * Controlled GSAP ScrollTrigger reveals, clip-path mask expansions, and hero scroll exit
 */

import { isReducedMotion } from './motion-core.js';

export function initScrollReveals() {
  if (isReducedMotion() || typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') {
    return;
  }

  const { gsap, ScrollTrigger } = window;

  // 1. HERO VIDEO EXIT SCRUB
  const heroVideo = document.querySelector('.hero-video');
  const heroContent = document.querySelector('.hero-content');

  if (heroVideo && heroContent) {
    gsap.to(heroVideo, {
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      },
      scale: 1.08,
      y: '10%',
      opacity: 0.35,
      ease: 'none'
    });

    gsap.to(heroContent, {
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom 40%',
        scrub: true
      },
      y: -60,
      opacity: 0.1,
      ease: 'none'
    });
  }

  // 2. EXPERIENCE CARDS REVEAL (ENTER THE VAULT)
  const expCards = document.querySelectorAll('.experience-card');
  if (expCards.length > 0) {
    gsap.from(expCards, {
      scrollTrigger: {
        trigger: '.experience-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.18,
      ease: 'power3.out'
    });
  }

  // 3. RULES STEPPED TIMELINE
  const ruleCards = document.querySelectorAll('.rule-step-card');
  if (ruleCards.length > 0) {
    gsap.from(ruleCards, {
      scrollTrigger: {
        trigger: '.rules-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      y: 35,
      opacity: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power2.out'
    });
  }

  // 4. GENERAL SECTION HEADERS REVEAL
  const sectionHeadings = document.querySelectorAll('.section-title-large, .about-lead-copy');
  sectionHeadings.forEach((heading) => {
    gsap.from(heading, {
      scrollTrigger: {
        trigger: heading,
        start: 'top 88%',
        toggleActions: 'play none none none'
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  });
}
