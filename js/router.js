/**
 * VAULT 147 — VIEW ROUTER & NAVIGATION COORDINATOR
 * Manages active routes, smooth view scrolling, mobile drawer states and active nav indicators
 */

import { getLenis } from './motion/lenis-scroll.js';

class ViewRouter {
  constructor() {
    this.currentRoute = 'home';
    this.validRoutes = ['home', 'about', 'booking', 'gallery', 'contact'];
  }

  init() {
    this.bindNavLinks();
    this.bindMobileDrawer();
    this.bindHeaderScroll();
    this.handleInitialRoute();

    window.addEventListener('hashchange', () => {
      this.handleHashChange();
    });
  }

  handleInitialRoute() {
    const hash = window.location.hash.replace('#', '');
    if (this.validRoutes.includes(hash)) {
      this.navigateTo(hash, false);
    } else {
      this.updateActiveNav('home');
    }
  }

  handleHashChange() {
    const hash = window.location.hash.replace('#', '');
    if (this.validRoutes.includes(hash)) {
      this.navigateTo(hash, true);
    }
  }

  navigateTo(routeId, smooth = true) {
    if (!this.validRoutes.includes(routeId)) return;

    this.currentRoute = routeId;
    this.updateActiveNav(routeId);
    this.closeMobileDrawer();

    const targetSection = document.getElementById(routeId);
    if (!targetSection) return;

    const lenis = getLenis();
    if (lenis && smooth) {
      lenis.scrollTo(targetSection, { offset: -60, duration: 1.2 });
    } else {
      targetSection.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    }
  }

  updateActiveNav(routeId) {
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach((link) => {
      const href = link.getAttribute('href') || '';
      const target = href.replace('#', '');
      link.classList.toggle('active', target === routeId);
    });
  }

  bindNavLinks() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        const targetId = href.replace('#', '');
        if (this.validRoutes.includes(targetId)) {
          e.preventDefault();
          history.pushState(null, '', `#${targetId}`);
          this.navigateTo(targetId, true);
        }
      });
    });
  }

  bindMobileDrawer() {
    const toggleBtn = document.getElementById('mobile-drawer-toggle');
    const drawer = document.getElementById('mobile-drawer');

    if (!toggleBtn || !drawer) return;

    toggleBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.contains('drawer-open');
      if (isOpen) {
        this.closeMobileDrawer();
      } else {
        drawer.classList.add('drawer-open');
        toggleBtn.classList.add('is-active');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  closeMobileDrawer() {
    const toggleBtn = document.getElementById('mobile-drawer-toggle');
    const drawer = document.getElementById('mobile-drawer');
    if (drawer && drawer.classList.contains('drawer-open')) {
      drawer.classList.remove('drawer-open');
      if (toggleBtn) toggleBtn.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  bindHeaderScroll() {
    const header = document.getElementById('site-header');
    if (!header) return;

    const onScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      header.classList.toggle('header-scrolled', scrollY > 50);

      // Dynamically highlight current visible section
      this.validRoutes.forEach((route) => {
        const el = document.getElementById(route);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            this.updateActiveNav(route);
          }
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
}

export const viewRouter = new ViewRouter();
