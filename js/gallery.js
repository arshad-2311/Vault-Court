/**
 * VAULT 147 — EDITORIAL GALLERY & FULLSCREEN LIGHTBOX
 * Category filtering, keyboard/touch lightbox viewer with EXIF telemetry
 */

import { GALLERY_CATALOG } from './data.js';

class GalleryEngine {
  constructor() {
    this.activeFilter = 'all';
    this.currentIndex = 0;
    this.currentItems = [...GALLERY_CATALOG];
  }

  init() {
    this.bindFilterTabs();
    this.renderGalleryGrid();
    this.bindLightboxEvents();
  }

  bindFilterTabs() {
    const tabs = document.querySelectorAll('.gallery-filter-bar .filter-tab-btn');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');
        this.activeFilter = tab.getAttribute('data-filter') || 'all';
        this.renderGalleryGrid();
      });
    });
  }

  renderGalleryGrid() {
    const container = document.getElementById('gallery-masonry-grid');
    if (!container) return;

    this.currentItems = this.activeFilter === 'all'
      ? GALLERY_CATALOG
      : GALLERY_CATALOG.filter(item => item.category === this.activeFilter);

    container.innerHTML = this.currentItems.map((item, idx) => `
      <div class="gallery-item ${item.spanClass}" data-index="${idx}" data-cursor="view">
        <img src="${item.image}" alt="${item.title}" class="gallery-img-layer" loading="lazy" />
        <div class="gallery-item-overlay">
          <span class="gallery-tag">${item.categoryLabel}</span>
          <span class="gallery-caption">${item.title}</span>
        </div>
        <div class="gallery-view-hover-badge">[ VIEW ]</div>
      </div>
    `).join('');

    container.querySelectorAll('.gallery-item').forEach((item) => {
      item.addEventListener('click', () => {
        const index = parseInt(item.getAttribute('data-index'), 10) || 0;
        this.openLightbox(index);
      });
    });
  }

  openLightbox(index) {
    this.currentIndex = index;
    const modal = document.getElementById('gallery-lightbox');
    if (!modal) return;

    this.updateLightboxContent();
    modal.classList.add('lightbox-open');
    document.body.style.overflow = 'hidden';
  }

  updateLightboxContent() {
    const item = this.currentItems[this.currentIndex];
    if (!item) return;

    const imgEl = document.getElementById('lightbox-active-img');
    const indexEl = document.getElementById('lightbox-index-val');
    const titleEl = document.getElementById('lightbox-title-val');

    if (imgEl) {
      imgEl.src = item.image;
      imgEl.alt = item.title;
    }
    if (indexEl) {
      const currentFormatted = String(this.currentIndex + 1).padStart(2, '0');
      const totalFormatted = String(this.currentItems.length).padStart(2, '0');
      indexEl.textContent = `[${currentFormatted} / ${totalFormatted}] — ${item.categoryLabel}`;
    }
    if (titleEl) {
      titleEl.textContent = item.title;
    }
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.currentItems.length;
    this.updateLightboxContent();
  }

  prevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.currentItems.length) % this.currentItems.length;
    this.updateLightboxContent();
  }

  closeLightbox() {
    const modal = document.getElementById('gallery-lightbox');
    if (modal) {
      modal.classList.remove('lightbox-open');
      document.body.style.overflow = '';
    }
  }

  bindLightboxEvents() {
    const modal = document.getElementById('gallery-lightbox');
    if (!modal) return;

    const closeBtn = modal.querySelector('.lightbox-close-btn');
    const nextBtn = modal.querySelector('.lightbox-next');
    const prevBtn = modal.querySelector('.lightbox-prev');

    if (closeBtn) closeBtn.addEventListener('click', () => this.closeLightbox());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextImage());
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevImage());

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeLightbox();
      }
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('lightbox-open')) return;

      if (e.key === 'Escape') {
        this.closeLightbox();
      } else if (e.key === 'ArrowRight') {
        this.nextImage();
      } else if (e.key === 'ArrowLeft') {
        this.prevImage();
      }
    });

    // Touch Swipe for Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    modal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    modal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 45) {
        if (diff > 0) {
          this.nextImage(); // Swiped left -> next
        } else {
          this.prevImage(); // Swiped right -> prev
        }
      }
    }, { passive: true });
  }
}

export const galleryEngine = new GalleryEngine();
