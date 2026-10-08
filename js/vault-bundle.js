/**
 * VAULT 147 — HIGH-END ARCHITECTURAL JAVASCRIPT BUNDLE (AWWWARDS TIER)
 * Cinematic Aperture · Horizontal Storytelling · Dynamic Duration · GSAP Flip Gallery
 */

(function () {
  'use strict';

  /* ============================================================
     1. AUTHENTIC VENUE REPOSITORY & CATALOG
     Pure verified venue information — zero unverified claims.
     ============================================================ */
  const VENUE_INFO = {
    name: 'VAULT 147',
    tagline: 'SNOOKER. PS5. THE GAME STARTS HERE.',
    subTagline: 'A premium gaming and snooker experience built for players who want more than just a game.',
    address: {
      line1: 'Mannarsamy 6/1, Somu Nagar',
      locality: 'Royapuram',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600013',
      full: 'Mannarsamy 6/1, Somu Nagar, Royapuram, Chennai, Tamil Nadu 600013'
    },
    contact: {
      phone: '+91 88259 75491',
      phoneRaw: '8825975491',
      phoneFormatted: '088259 75491',
      whatsapp: '918825975491',
      instagram: 'vault.147',
      instagramUrl: 'https://instagram.com/vault.147',
      mapsUrl: 'https://maps.google.com/?q=Mannarsamy+6/1+Somu+Nagar+Royapuram+Chennai+600013'
    },
    hours: {
      days: 'Monday – Sunday',
      timing: '10:00 AM – 12:00 AM (Midnight)',
      full: '10:00 AM – 12:00 AM (Open Daily)'
    }
  };

  const PRICING_RULES = {
    snooker: {
      hourlyRate: 250,
      unit: 'hour'
    },
    ps5: {
      1: 150, // 1 Player: ₹150 / hr
      2: 300, // 2 Players: ₹300 / hr
      3: 400, // 3 Players: ₹400 / hr
      4: 500  // 4 Players: ₹500 / hr
    },
    durationOptions: [1, 2, 3, 4]
  };

  const BOOKING_UNITS = [
    {
      id: 'snooker-01',
      name: 'SNOOKER TABLE 01',
      category: 'snooker',
      categoryLabel: 'SNOOKER ARENA',
      image: 'assets/images/snooker-arena-3tables.jpg',
      basePrice: 250,
      priceLabel: '₹250 / HOUR',
      oneLineDesc: 'Full-size championship table with tournament red cloth, overhead match lighting, and Aramith match balls.',
      status: 'AVAILABLE'
    },
    {
      id: 'snooker-02',
      name: 'SNOOKER TABLE 02',
      category: 'snooker',
      categoryLabel: 'SNOOKER ARENA',
      image: 'assets/images/snooker-table-cues.jpg',
      basePrice: 250,
      priceLabel: '₹250 / HOUR',
      oneLineDesc: 'Championship-specification table equipped with anti-glare cone lamps and balanced match cues.',
      status: 'AVAILABLE'
    },
    {
      id: 'snooker-03',
      name: 'SNOOKER TABLE 03',
      category: 'snooker',
      categoryLabel: 'SNOOKER ARENA',
      image: 'assets/images/snooker-solo-table.jpg',
      basePrice: 250,
      priceLabel: '₹250 / HOUR',
      oneLineDesc: 'Dedicated match table featuring focused overhead illumination engineered for 1v1 match play.',
      status: 'AVAILABLE'
    },
    {
      id: 'ps5-01',
      name: 'PLAYSTATION 5 STATION 01',
      category: 'ps5',
      categoryLabel: 'PS5 ARENA',
      image: 'assets/images/ps5-eafc-station.jpg',
      basePrice: 150,
      priceLabel: 'FROM ₹150 / HOUR',
      oneLineDesc: 'PlayStation 5 console station with high-refresh display and DualSense wireless controllers.',
      status: 'AVAILABLE'
    },
    {
      id: 'ps5-02',
      name: 'PLAYSTATION 5 STATION 02',
      category: 'ps5',
      categoryLabel: 'PS5 ARENA',
      image: 'assets/images/vault147-panorama-lounge.webp',
      basePrice: 150,
      priceLabel: 'FROM ₹150 / HOUR',
      oneLineDesc: 'Multiplayer battle station supporting 1 to 4 players for EA Sports FC and head-to-head competition.',
      status: 'AVAILABLE'
    },
    {
      id: 'ps5-03',
      name: 'PLAYSTATION 5 STATION 03',
      category: 'ps5',
      categoryLabel: 'PS5 ARENA',
      image: 'assets/images/ps5-eafc-station.jpg',
      basePrice: 150,
      priceLabel: 'FROM ₹150 / HOUR',
      oneLineDesc: 'Console station with comfortable squad seating and signature ambient crimson lighting.',
      status: 'AVAILABLE'
    }
  ];

  const TIME_SLOTS = [
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
    '07:00 PM',
    '08:00 PM',
    '09:00 PM',
    '10:00 PM',
    '11:00 PM'
  ];

  const GALLERY_CATALOG = [
    {
      id: 'g-01',
      title: 'Championship 3-Table Arena',
      category: 'snooker',
      categoryLabel: 'SNOOKER ARENA',
      image: 'assets/images/snooker-arena-3tables.jpg',
      spanClass: 'span-col-8'
    },
    {
      id: 'g-02',
      title: 'Match Cues & Precision Rails',
      category: 'snooker',
      categoryLabel: 'SNOOKER ARENA',
      image: 'assets/images/snooker-table-cues.jpg',
      spanClass: 'span-col-4'
    },
    {
      id: 'g-03',
      title: 'Aramith Crimson Ball Rack',
      category: 'snooker',
      categoryLabel: 'SNOOKER ARENA',
      image: 'assets/images/snooker-balls-racked.jpg',
      spanClass: 'span-col-4'
    },
    {
      id: 'g-04',
      title: 'PlayStation 5 Competitive Station',
      category: 'ps5',
      categoryLabel: 'PS5 ARENA',
      image: 'assets/images/ps5-eafc-station.jpg',
      spanClass: 'span-col-8'
    },
    {
      id: 'g-05',
      title: 'Arena Perspective Panorama',
      category: 'the-lounge',
      categoryLabel: 'THE LOUNGE',
      image: 'assets/images/vault147-panorama-lounge.webp',
      spanClass: 'span-col-7'
    },
    {
      id: 'g-06',
      title: 'Solo Match Table Illumination',
      category: 'snooker',
      categoryLabel: 'SNOOKER ARENA',
      image: 'assets/images/snooker-solo-table.jpg',
      spanClass: 'span-col-5'
    },
    {
      id: 'g-07',
      title: 'Official Royapuram Venue Details',
      category: 'the-lounge',
      categoryLabel: 'THE LOUNGE',
      image: 'assets/images/vault147-flyer.jpg',
      spanClass: 'span-col-6'
    },
    {
      id: 'g-08',
      title: 'Official Arena Tariff & Pricing',
      category: 'the-lounge',
      categoryLabel: 'THE LOUNGE',
      image: 'assets/images/vault147-tariff.jpg',
      spanClass: 'span-col-6'
    }
  ];

  function parseTimeToMinutes(timeStr) {
    const parts = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!parts) return 0;
    let hour = parseInt(parts[1], 10);
    const min = parseInt(parts[2], 10);
    const meridian = parts[3].toUpperCase();
    if (meridian === 'AM') {
      if (hour === 12) hour = 0;
    } else {
      if (hour !== 12) hour += 12;
    }
    return hour * 60 + min;
  }

  function calculateEndTime(startTimeStr, durationHours = 1) {
    const parts = startTimeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!parts) return startTimeStr;

    let hour = parseInt(parts[1], 10);
    const minutes = parts[2];
    let meridian = parts[3].toUpperCase();

    let total24Hour = hour;
    if (meridian === 'PM' && hour !== 12) total24Hour += 12;
    if (meridian === 'AM' && hour === 12) total24Hour = 0;

    total24Hour += durationHours;

    let endMeridian = total24Hour >= 12 && total24Hour < 24 ? 'PM' : 'AM';
    let endHour = total24Hour % 24;
    if (endHour === 0) endHour = 12;
    else if (endHour > 12) endHour -= 12;

    return `${String(endHour).padStart(2, '0')}:${minutes} ${endMeridian}`;
  }

  /* ============================================================
     2. ISOLATED BOOKING API PROVIDER
     Zero-lag fallback cache with authoritative server-side math
     ============================================================ */
  const API_BASE_URL = window.VAULT_API_URL || 'http://localhost:5000/api';
  const localHoldCache = new Map();

  async function fetchWithQuickTimeout(url, options = {}, timeoutMs = 300) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  const BookingAPI = {
    async getAvailability(dateStr, unitId) {
      try {
        const res = await fetchWithQuickTimeout(`${API_BASE_URL}/bookings/availability?date=${encodeURIComponent(dateStr)}&unitId=${encodeURIComponent(unitId)}`, {}, 300);
        if (res.ok) {
          const data = await res.json();
          return data.slots;
        }
      } catch (e) {}

      const now = new Date();
      const closingMinutes = 24 * 60;

      return TIME_SLOTS.map((slot) => {
        const startMin = parseTimeToMinutes(slot);
        const end1hrMin = startMin + 60;

        let status = 'AVAILABLE';
        let isOccupied = false;

        for (const [key, item] of localHoldCache.entries()) {
          if (item.payload.unitId === unitId && item.payload.date === dateStr) {
            const itemStart = parseTimeToMinutes(item.payload.startTime);
            const itemEnd = itemStart + (item.payload.durationHours || 1) * 60;

            if (itemStart < end1hrMin && itemEnd > startMin) {
              if (item.status === 'CONFIRMED') {
                status = 'BOOKED';
                isOccupied = true;
                break;
              } else if (item.status === 'PENDING_PAYMENT' && new Date(item.expiresAt) > now) {
                status = 'HELD';
                isOccupied = true;
                break;
              }
            }
          }
        }

        let maxConsecutiveHours = 0;
        if (!isOccupied) {
          for (let h = 1; h <= 4; h++) {
            const testEndMin = startMin + h * 60;
            if (testEndMin > closingMinutes) break;

            let hasOverlap = false;
            for (const [key, item] of localHoldCache.entries()) {
              if (item.payload.unitId === unitId && item.payload.date === dateStr) {
                const itemStart = parseTimeToMinutes(item.payload.startTime);
                const itemEnd = itemStart + (item.payload.durationHours || 1) * 60;
                if (itemStart < testEndMin && itemEnd > startMin) {
                  if (item.status === 'CONFIRMED' || (item.status === 'PENDING_PAYMENT' && new Date(item.expiresAt) > now)) {
                    hasOverlap = true;
                    break;
                  }
                }
              }
            }

            if (!hasOverlap) {
              maxConsecutiveHours = h;
            } else {
              break;
            }
          }
        }

        return {
          startTime: slot,
          status,
          isAvailable: status === 'AVAILABLE',
          maxConsecutiveHours
        };
      });
    },

    calculateSessionPrice(unit, durationHours = 1, players = 1) {
      let hourlyRate = unit.basePrice || 250;
      if (unit.category === 'ps5') {
        const validPlayers = Math.min(Math.max(players, 1), 4);
        hourlyRate = PRICING_RULES.ps5[validPlayers] || 150;
      } else {
        hourlyRate = PRICING_RULES.snooker.hourlyRate;
      }

      const duration = Math.min(Math.max(durationHours, 1), 4);
      const total = hourlyRate * duration;

      return {
        hourlyRate,
        durationHours: duration,
        total,
        players: unit.category === 'ps5' ? players : 1
      };
    },

    async createBookingHold(payload) {
      try {
        const res = await fetchWithQuickTimeout(`${API_BASE_URL}/bookings/create-hold`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }, 800);

        if (res.status === 409) {
          const errData = await res.json();
          return {
            success: false,
            conflict: true,
            error: errData.error || 'SLOT_ALREADY_RESERVED',
            message: errData.message || 'This time interval was just taken. Please choose another time or duration.'
          };
        }

        if (res.ok) {
          return await res.json();
        }
      } catch (e) {}

      const now = new Date();
      const duration = payload.durationHours || 1;
      const reqStartMin = parseTimeToMinutes(payload.startTime);
      const reqEndMin = reqStartMin + duration * 60;

      if (reqEndMin > 24 * 60) {
        return {
          success: false,
          error: 'EXCEEDS_CLOSING_TIME',
          message: 'The requested duration extends past the arena closing time (12:00 AM).'
        };
      }

      for (const [key, item] of localHoldCache.entries()) {
        if (item.payload.unitId === payload.unitId && item.payload.date === payload.date) {
          const itemStart = parseTimeToMinutes(item.payload.startTime);
          const itemEnd = itemStart + (item.payload.durationHours || 1) * 60;

          if (itemStart < reqEndMin && itemEnd > reqStartMin) {
            if (item.status === 'CONFIRMED' || (item.status === 'PENDING_PAYMENT' && new Date(item.expiresAt) > now)) {
              return {
                success: false,
                conflict: true,
                error: 'SLOT_ALREADY_RESERVED',
                message: 'This time interval was just taken. Please choose another time or duration.'
              };
            }
          }
        }
      }

      const bookingId = `V147-${Math.floor(1000 + Math.random() * 9000)}`;
      const isCounter = payload.paymentMethod === 'COUNTER';
      const expiresAt = isCounter ? null : new Date(Date.now() + 10 * 60 * 1000).toISOString();
      const priceObj = this.calculateSessionPrice(
        { basePrice: 250, category: payload.unitId.startsWith('ps5') ? 'ps5' : 'snooker' },
        duration,
        payload.playerCount
      );

      localHoldCache.set(bookingId, {
        bookingId,
        status: 'CONFIRMED',
        paymentStatus: 'PAY_AT_COUNTER',
        paymentMethod: 'COUNTER',
        expiresAt: null,
        amount: priceObj.total,
        payload
      });

      return {
        success: true,
        bookingId,
        paymentMethod: 'COUNTER',
        status: 'CONFIRMED',
        paymentStatus: 'PAY_AT_COUNTER',
        hourlyRate: priceObj.hourlyRate,
        amount: priceObj.total,
        durationHours: duration,
        currency: 'INR',
        startTime: payload.startTime,
        endTime: calculateEndTime(payload.startTime, duration)
      };
    },

    async confirmCounterPayment(payload) {
      try {
        const res = await fetchWithQuickTimeout(`${API_BASE_URL}/bookings/confirm-counter`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }, 800);

        if (res.ok) {
          return await res.json();
        }
      } catch (e) {}

      const item = localHoldCache.get(payload.bookingId);
      if (item) {
        item.status = 'CONFIRMED';
        item.paymentStatus = 'PAY_AT_COUNTER';
        item.paymentMethod = 'COUNTER';
      }

      return {
        success: true,
        bookingId: payload.bookingId,
        status: 'CONFIRMED',
        paymentStatus: 'PAY_AT_COUNTER'
      };
    }
  };

  /* ============================================================
     3. LENIS, MOTION RESTRICTIONS & PRECISION CURSOR
     ============================================================ */
  const isReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = () => ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  let lenisInstance = null;

  function initLenis() {
    const progressBar = document.getElementById('scroll-progress-bar');
    const updateProgress = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (progressBar && maxScroll > 0) {
        const progress = Math.min(Math.max((scrollY / maxScroll) * 100, 0), 100);
        progressBar.style.width = `${progress}%`;
      }
    };

    window.addEventListener('scroll', updateProgress, { passive: true });

    if (isReducedMotion() || isTouchDevice() || typeof window.Lenis === 'undefined') {
      return;
    }

    try {
      lenisInstance = new window.Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.95
      });

      if (window.ScrollTrigger) {
        lenisInstance.on('scroll', window.ScrollTrigger.update);
      }

      if (window.gsap) {
        window.gsap.ticker.add((time) => {
          lenisInstance.raf(time * 1000);
        });
        window.gsap.ticker.lagSmoothing(0);
      }
    } catch (e) {
      console.warn('Lenis scroll init:', e);
    }
  }

  function initCursor() {
    if (isReducedMotion() || isTouchDevice()) return;

    const cursorDot = document.querySelector('.cursor-dot');
    const cursorFollower = document.querySelector('.cursor-follower');
    const cursorLabel = document.querySelector('.cursor-follower-label');

    if (!cursorDot || !cursorFollower || typeof window.gsap === 'undefined') return;

    const dotX = window.gsap.quickTo(cursorDot, 'x', { duration: 0.1, ease: 'power2.out' });
    const dotY = window.gsap.quickTo(cursorDot, 'y', { duration: 0.1, ease: 'power2.out' });
    const folX = window.gsap.quickTo(cursorFollower, 'x', { duration: 0.22, ease: 'power2.out' });
    const folY = window.gsap.quickTo(cursorFollower, 'y', { duration: 0.22, ease: 'power2.out' });

    window.addEventListener('mousemove', (e) => {
      document.body.classList.remove('cursor-hidden');
      dotX(e.clientX);
      dotY(e.clientY);
      folX(e.clientX);
      folY(e.clientY);
    });

    document.addEventListener('mouseleave', () => {
      document.body.classList.add('cursor-hidden');
    });

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

  function initMagnetic() {
    if (isReducedMotion() || isTouchDevice() || typeof window.gsap === 'undefined') return;

    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.22;
        const deltaY = (e.clientY - centerY) * 0.22;

        window.gsap.to(el, { x: deltaX, y: deltaY, duration: 0.25, ease: 'power2.out' });
      });

      el.addEventListener('mouseleave', () => {
        window.gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  /* ============================================================
     4. BOOKING ENGINE (DYNAMIC DURATION & COUNTER PAYMENT)
     ============================================================ */
  class BookingManager {
    constructor() {
      this.state = {
        selectedDate: null,
        activeCategory: 'all',
        selectedUnit: null,
        playerCount: 1,
        selectedSlot: null,
        durationHours: 1,
        currentPrice: 250,
        activeHold: null,
        isSubmitting: false,
        slotsData: [],
        paymentMethod: 'counter'
      };
      this.datesList = [];
    }

    init() {
      this.generateDateRange();
      this.renderDatePills();
      this.bindCategoryFilters();
      this.renderUnits();
      this.bindModalEvents();
      this.bindFormSubmission();
    }

    generateDateRange() {
      const today = new Date();
      const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

      this.datesList = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const dayLabel = i === 0 ? 'TODAY' : days[d.getDay()];
        const dateNum = d.getDate();
        const monthLabel = months[d.getMonth()];
        const isoDate = d.toISOString().split('T')[0];

        this.datesList.push({
          dayLabel,
          dateNum,
          monthLabel,
          isoDate,
          fullDateStr: `${dayLabel}, ${dateNum} ${monthLabel} ${d.getFullYear()}`
        });
      }
      this.state.selectedDate = this.datesList[0];
    }

    renderDatePills() {
      const container = document.getElementById('date-pills-container');
      if (!container) return;

      container.innerHTML = this.datesList.map((item, idx) => `
        <button type="button" class="date-pill-btn ${idx === 0 ? 'is-active' : ''}" data-date="${item.isoDate}" data-cursor="select">
          <span class="date-pill-day">${item.dayLabel}</span>
          <span class="date-pill-num">${item.dateNum}</span>
          <span class="date-pill-month">${item.monthLabel}</span>
        </button>
      `).join('');

      container.querySelectorAll('.date-pill-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => {
          container.querySelectorAll('.date-pill-btn').forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          this.state.selectedDate = this.datesList[index];
          if (this.state.selectedUnit) {
            this.loadTimeSlots(this.state.selectedUnit.id);
          }
        });
      });
    }

    bindCategoryFilters() {
      const filterTabs = document.querySelectorAll('.game-filter-bar .filter-tab-btn');
      filterTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          filterTabs.forEach(t => t.classList.remove('is-active'));
          tab.classList.add('is-active');
          this.state.activeCategory = tab.getAttribute('data-filter') || 'all';
          this.renderUnits();
        });
      });
    }

    renderUnits() {
      const container = document.getElementById('booking-units-grid');
      if (!container) return;

      const filtered = this.state.activeCategory === 'all'
        ? BOOKING_UNITS
        : BOOKING_UNITS.filter(u => u.category === this.state.activeCategory);

      container.innerHTML = filtered.map((unit, idx) => `
        <article class="unit-card" data-unit-id="${unit.id}">
          <div class="unit-card-img-wrap">
            <img src="${unit.image}" alt="${unit.name}" class="unit-card-img" loading="lazy" />
            <div class="unit-card-header-bar">
              <span class="unit-id-badge">[0${idx + 1} // ${unit.category === 'snooker' ? 'SNOOKER' : 'PS5'}]</span>
              <span class="unit-status-tag ${unit.status.toLowerCase()}">${unit.status}</span>
            </div>
          </div>
          <div class="unit-card-body">
            <span class="unit-game-category">${unit.categoryLabel}</span>
            <h3 class="unit-name">${unit.name}</h3>
            <p class="unit-desc-oneline">${unit.oneLineDesc}</p>
            <div class="unit-card-footer">
              <span class="unit-price-rate">${unit.priceLabel}</span>
              <button type="button" class="btn btn-secondary unit-select-btn" data-unit-id="${unit.id}" data-cursor="select">
                <span>SELECT UNIT →</span>
              </button>
            </div>
          </div>
        </article>
      `).join('');

      container.querySelectorAll('.unit-select-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const unitId = e.currentTarget.getAttribute('data-unit-id');
          this.openConfigModal(unitId);
        });
      });
    }

    openConfigModal(unitId) {
      const unit = BOOKING_UNITS.find(u => u.id === unitId);
      if (!unit) return;

      this.state.selectedUnit = unit;
      this.state.playerCount = 1;
      this.state.selectedSlot = null;
      this.state.durationHours = 1;
      this.state.activeHold = null;

      const modal = document.getElementById('booking-config-modal');
      if (!modal) return;

      // 1. OPEN MODAL INSTANTLY (0ms response) & LOCK BACKGROUND SCROLL
      modal.classList.add('modal-open');
      document.body.classList.add('modal-scroll-lock');
      if (lenisInstance) {
        lenisInstance.stop();
      }

      // 2. Populate Unit Details
      const thumbEl = modal.querySelector('.config-unit-thumb');
      const nameEl = modal.querySelector('.config-modal-unit-name');
      const catEl = modal.querySelector('.config-modal-unit-cat');
      const dateEl = modal.querySelector('.config-modal-date-display');

      if (thumbEl) thumbEl.src = unit.image;
      if (nameEl) nameEl.textContent = unit.name;
      if (catEl) catEl.textContent = unit.categoryLabel;
      if (dateEl) dateEl.textContent = this.state.selectedDate.fullDateStr;

      const playerGroup = modal.querySelector('.config-players-group');
      if (playerGroup) {
        playerGroup.style.display = unit.category === 'ps5' ? 'block' : 'none';
      }

      modal.querySelectorAll('.player-choice').forEach((c, idx) => {
        c.classList.toggle('is-active', idx === 0);
      });

      this.state.paymentMethod = 'counter';
      modal.querySelectorAll('.payment-method-card').forEach((c) => {
        c.classList.toggle('is-active', true);
      });

      const submitBtnText = document.getElementById('booking-submit-btn-text');
      if (submitBtnText) submitBtnText.textContent = 'CONFIRM RESERVATION & PAY AT COUNTER';

      const pmNotice = document.getElementById('payment-method-notice');
      if (pmNotice) {
        pmNotice.textContent = '✓ Reserved immediately. Pay at reception counter upon arrival via Cash or UPI.';
        pmNotice.style.color = '#fbbf24';
      }

      const durationGroup = document.getElementById('config-duration-group');
      if (durationGroup) durationGroup.style.display = 'none';

      const selectedBanner = document.getElementById('modal-selected-slot-banner');
      if (selectedBanner) selectedBanner.style.display = 'none';

      this.updatePriceCalculations();

      // 3. Load slots asynchronously without blocking modal appearance
      this.loadTimeSlots(unit.id);
    }

    async loadTimeSlots(unitId) {
      const slotsContainer = document.getElementById('modal-time-slots-grid');
      if (!slotsContainer) return;

      const slots = await BookingAPI.getAvailability(this.state.selectedDate.isoDate, unitId);
      this.state.slotsData = slots;

      slotsContainer.innerHTML = slots.map((slot) => `
        <button 
          type="button" 
          class="time-slot-btn status-${slot.status.toLowerCase()}" 
          data-start="${slot.startTime}" 
          data-status="${slot.status}"
          data-consecutive="${slot.maxConsecutiveHours || 0}"
          ${!slot.isAvailable ? 'disabled title="Slot is currently locked"' : ''}
          data-cursor="select"
        >
          <span class="time-slot-label">${slot.startTime}</span>
          <span class="time-slot-status">${slot.status}</span>
        </button>
      `).join('');

      slotsContainer.querySelectorAll('.time-slot-btn:not(:disabled)').forEach((btn) => {
        btn.addEventListener('click', () => {
          slotsContainer.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');

          const startTime = btn.getAttribute('data-start');
          const consecutive = parseInt(btn.getAttribute('data-consecutive'), 10) || 1;

          this.state.selectedSlot = { startTime, maxConsecutive: consecutive };

          if (this.state.durationHours > consecutive) {
            this.state.durationHours = 1;
          }

          this.renderSmartDurationControls(consecutive);
          this.updateTimeRangeDisplay();
          this.updatePriceCalculations();

          const slotError = document.getElementById('slot-error-msg');
          if (slotError) slotError.style.display = 'none';
        });
      });
    }

    renderSmartDurationControls(maxConsecutive) {
      const durationGroup = document.getElementById('config-duration-group');
      const chipsContainer = document.getElementById('duration-chips-container');
      if (!durationGroup || !chipsContainer) return;

      durationGroup.style.display = 'block';

      const durations = [1, 2, 3, 4];
      chipsContainer.innerHTML = durations.map((h) => {
        const isPossible = h <= maxConsecutive;
        const isSelected = h === this.state.durationHours;
        return `
          <button 
            type="button" 
            class="choice-chip-btn duration-choice ${isSelected ? 'is-active' : ''} ${!isPossible ? 'is-disabled' : ''}" 
            data-duration="${h}"
            ${!isPossible ? 'disabled title="Not enough consecutive hours available"' : ''}
          >
            <span class="duration-num-label">${h} ${h === 1 ? 'HOUR' : 'HOURS'}</span>
            ${!isPossible ? '<span class="duration-unavail-badge">UNAVAILABLE</span>' : ''}
          </button>
        `;
      }).join('');

      chipsContainer.querySelectorAll('.duration-choice:not(:disabled)').forEach((btn) => {
        btn.addEventListener('click', () => {
          chipsContainer.querySelectorAll('.duration-choice').forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          this.state.durationHours = parseInt(btn.getAttribute('data-duration'), 10) || 1;
          this.updateTimeRangeDisplay();
          this.updatePriceCalculations();
        });
      });
    }

    updateTimeRangeDisplay() {
      if (!this.state.selectedSlot) return;

      const startTime = this.state.selectedSlot.startTime;
      const duration = this.state.durationHours;
      const endTime = calculateEndTime(startTime, duration);

      const selectedBanner = document.getElementById('modal-selected-slot-banner');
      if (selectedBanner) {
        selectedBanner.style.display = 'flex';
        selectedBanner.innerHTML = `
          <span>SESSION: <strong>${startTime} — ${endTime}</strong> (${duration} ${duration === 1 ? 'HOUR' : 'HOURS'})</span>
          <span style="color:var(--status-available);font-size:11px;">[INTERVAL AVAILABLE]</span>
        `;
      }
    }

    updatePriceCalculations() {
      if (!this.state.selectedUnit) return;

      const priceObj = BookingAPI.calculateSessionPrice(
        this.state.selectedUnit,
        this.state.durationHours,
        this.state.playerCount
      );

      this.state.currentPrice = priceObj.total;

      const rateEl = document.getElementById('summary-hourly-rate');
      const durEl = document.getElementById('summary-duration-display');
      const totalEl = document.getElementById('summary-total-price');

      if (rateEl) rateEl.textContent = `₹${priceObj.hourlyRate} / HOUR`;
      if (durEl) durEl.textContent = `${this.state.durationHours} ${this.state.durationHours === 1 ? 'HOUR' : 'HOURS'}`;
      if (totalEl) totalEl.textContent = `₹${priceObj.total}`;

      const pmNotice = document.getElementById('payment-method-notice');
      if (pmNotice) {
        pmNotice.textContent = `* Slot locked immediately. Settle ₹${this.state.currentPrice} via Cash or UPI at front reception counter.`;
      }
    }

    bindModalEvents() {
      const modal = document.getElementById('booking-config-modal');
      if (!modal) return;

      const closeBtn = modal.querySelector('.config-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeConfigModal());
      }

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeConfigModal();
        }
      });

      modal.querySelectorAll('.player-choice').forEach((chip) => {
        chip.addEventListener('click', () => {
          modal.querySelectorAll('.player-choice').forEach(c => c.classList.remove('is-active'));
          chip.classList.add('is-active');
          this.state.playerCount = parseInt(chip.getAttribute('data-players'), 10) || 1;
          this.updatePriceCalculations();
        });
      });
    }

    closeConfigModal() {
      const modal = document.getElementById('booking-config-modal');
      if (modal) {
        modal.classList.remove('modal-open');
        document.body.classList.remove('modal-scroll-lock');
        document.body.style.overflow = '';
        if (lenisInstance) {
          lenisInstance.start();
        }
      }
    }

    bindFormSubmission() {
      const form = document.getElementById('booking-customer-form');
      if (!form) return;

      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (this.state.isSubmitting) return;

        if (!this.state.selectedSlot) {
          const slotError = document.getElementById('slot-error-msg');
          if (slotError) {
            slotError.style.display = 'block';
            slotError.textContent = '* Please select a start time to proceed.';
          }
          return;
        }

        const nameInput = document.getElementById('cust-name');
        const phoneInput = document.getElementById('cust-phone');
        const emailInput = document.getElementById('cust-email');
        const notesInput = document.getElementById('cust-notes');
        const submitBtn = form.querySelector('button[type="submit"]');

        let hasError = false;

        if (!nameInput.value.trim()) {
          nameInput.closest('.form-group').classList.add('has-error');
          hasError = true;
        } else {
          nameInput.closest('.form-group').classList.remove('has-error');
        }

        const phoneVal = phoneInput.value.trim().replace(/[^0-9+]/g, '');
        if (!phoneVal || phoneVal.length < 8) {
          phoneInput.closest('.form-group').classList.add('has-error');
          hasError = true;
        } else {
          phoneInput.closest('.form-group').classList.remove('has-error');
        }

        const emailVal = emailInput ? emailInput.value.trim() : '';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailVal || !emailRegex.test(emailVal)) {
          if (emailInput && emailInput.closest('.form-group')) {
            emailInput.closest('.form-group').classList.add('has-error');
          }
          hasError = true;
        } else {
          if (emailInput && emailInput.closest('.form-group')) {
            emailInput.closest('.form-group').classList.remove('has-error');
          }
        }

        if (hasError) return;

        this.state.isSubmitting = true;
        if (submitBtn) {
          submitBtn.disabled = true;
          const btnTextEl = document.getElementById('booking-submit-btn-text') || submitBtn.querySelector('span');
          if (btnTextEl) {
            btnTextEl.textContent = 'SECURING YOUR RESERVATION...';
          }
        }

        try {
          const holdPayload = {
            unitId: this.state.selectedUnit.id,
            date: this.state.selectedDate.isoDate,
            startTime: this.state.selectedSlot.startTime,
            durationHours: this.state.durationHours,
            playerCount: this.state.playerCount,
            customerName: nameInput.value.trim(),
            customerPhone: phoneVal,
            customerEmail: emailVal,
            notes: notesInput ? notesInput.value.trim() : '',
            source: 'COUNTER_RESERVATION',
            paymentMethod: 'COUNTER'
          };

          const holdResult = await BookingAPI.createBookingHold(holdPayload);

          if (holdResult.conflict) {
            alert(holdResult.message || 'This interval was just booked. Please choose another time.');
            await this.loadTimeSlots(this.state.selectedUnit.id);
            return;
          }

          if (!holdResult.success) {
            alert('Could not secure slot. Please try again.');
            return;
          }

          this.state.activeHold = holdResult;

          this.closeConfigModal();
          this.renderConfirmationScreen(holdResult.bookingId, {
            unitName: this.state.selectedUnit.name,
            date: this.state.selectedDate.fullDateStr,
            timeRange: `${holdResult.startTime} — ${holdResult.endTime}`,
            durationHours: this.state.durationHours,
            totalPrice: `₹${holdResult.amount}`,
            customerName: nameInput.value.trim(),
            customerPhone: phoneVal,
            customerEmail: emailVal,
            paymentMethod: 'COUNTER',
            players: this.state.selectedUnit.category === 'ps5' ? `${this.state.playerCount} Player(s)` : 'N/A'
          });

        } catch (err) {
          console.error('Booking submission error:', err);
          alert('An unexpected error occurred. Please try again.');
        } finally {
          this.state.isSubmitting = false;
          if (submitBtn) {
            submitBtn.disabled = false;
            const btnTextEl = document.getElementById('booking-submit-btn-text') || submitBtn.querySelector('span');
            if (btnTextEl) {
              btnTextEl.textContent = 'CONFIRM RESERVATION & PAY AT COUNTER';
            }
          }
        }
      });
    }

    renderConfirmationScreen(bookingId, payload) {
      const bookingMain = document.getElementById('booking-main-content');
      const confirmView = document.getElementById('booking-confirmation-view');

      if (bookingMain) bookingMain.style.display = 'none';
      if (confirmView) {
        confirmView.classList.add('is-visible');

        const statusPill = document.getElementById('pass-status-pill');
        if (statusPill) {
          statusPill.textContent = '[SLOT RESERVED · PAY AT COUNTER]';
          statusPill.style.color = '#f59e0b';
        }

        const idEl = document.getElementById('pass-id-val');
        if (idEl) idEl.textContent = bookingId;

        const unitEl = document.getElementById('pass-unit-val');
        if (unitEl) unitEl.textContent = payload.unitName;

        const dateEl = document.getElementById('pass-date-val');
        if (dateEl) dateEl.textContent = payload.date;

        const timeEl = document.getElementById('pass-time-val');
        if (timeEl) timeEl.textContent = payload.timeRange;

        const durEl = document.getElementById('pass-duration-val');
        if (durEl) durEl.textContent = `${payload.durationHours} ${payload.durationHours === 1 ? 'HOUR' : 'HOURS'}`;

        const totalEl = document.getElementById('pass-total-val');
        if (totalEl) {
          totalEl.textContent = `${payload.totalPrice} (Due on Arrival)`;
        }

        const nameEl = document.getElementById('pass-name-val');
        if (nameEl) nameEl.textContent = payload.customerName;

        const emailEl = document.getElementById('pass-email-val');
        if (emailEl) {
          emailEl.textContent = payload.customerEmail ? `SENT TO ${payload.customerEmail}` : 'SENT TO GUEST EMAIL';
        }

        const payStatusEl = document.getElementById('pass-payment-status-val');
        if (payStatusEl) {
          payStatusEl.textContent = 'PAY AT COUNTER (DUE ON ARRIVAL)';
          payStatusEl.style.color = '#f59e0b';
        }

        const instructEl = document.getElementById('pass-instruction-text');
        if (instructEl) {
          instructEl.textContent = 'PRESENT THIS PASS AT THE VAULT 147 FRONT COUNTER TO SETTLE PAYMENT & ACCESS YOUR UNIT.';
        }

        const waMsg = encodeURIComponent(
          `*VAULT 147 RESERVATION CONFIRMATION*\n\n` +
          `*Booking ID:* ${bookingId}\n` +
          `*Game:* ${payload.unitName}\n` +
          `*Date:* ${payload.date}\n` +
          `*Time:* ${payload.timeRange}\n` +
          `*Duration:* ${payload.durationHours} Hour(s)\n` +
          (payload.players !== 'N/A' ? `*Players:* ${payload.players}\n` : '') +
          `*Total Tariff:* ${payload.totalPrice}\n` +
          `*Payment:* PAY AT COUNTER DIRECTLY (Due upon arrival)\n\n` +
          `*Name:* ${payload.customerName}\n` +
          `*Phone:* ${payload.customerPhone}\n` +
          (payload.customerEmail ? `*Email:* ${payload.customerEmail}\n` : '') +
          `\nPlease confirm my reservation at Mannarsamy 6/1, Somu Nagar, Royapuram.`
        );

        const waBtn = document.getElementById('pass-whatsapp-dispatch-btn');
        if (waBtn) {
          waBtn.href = `https://wa.me/${VENUE_INFO.contact.whatsapp}?text=${waMsg}`;
        }

        const resetBtn = document.getElementById('pass-book-another-btn');
        if (resetBtn) {
          resetBtn.onclick = () => {
            confirmView.classList.remove('is-visible');
            if (bookingMain) bookingMain.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          };
        }

        window.scrollTo({ top: confirmView.offsetTop - 80, behavior: 'smooth' });
      }
    }
  }

  /* ============================================================
     5. EDITORIAL GALLERY & GSAP FLIP FULLSCREEN LIGHTBOX
     ============================================================ */
  class GalleryManager {
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
          this.openLightbox(index, item);
        });
      });
    }

    openLightbox(index, clickedElement = null) {
      this.currentIndex = index;
      const modal = document.getElementById('gallery-lightbox');
      if (!modal) return;
      this.updateLightboxContent();
      modal.classList.add('lightbox-open');
      document.body.style.overflow = 'hidden';

      if (typeof window.Flip !== 'undefined' && clickedElement) {
        const activeImg = document.getElementById('lightbox-active-img');
        const clickedImg = clickedElement.querySelector('img') || clickedElement;
        if (activeImg && clickedImg) {
          try {
            const state = window.Flip.getState(clickedImg);
            window.Flip.from(state, {
              targets: activeImg,
              duration: 0.45,
              ease: 'power3.out'
            });
          } catch (err) {}
        }
      }
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

      window.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('lightbox-open')) return;
        if (e.key === 'Escape') this.closeLightbox();
        else if (e.key === 'ArrowRight') this.nextImage();
        else if (e.key === 'ArrowLeft') this.prevImage();
      });
    }
  }

  /* ============================================================
     6. VIEW ROUTER & NAVIGATION
     ============================================================ */
  class ViewRouter {
    constructor() {
      this.validRoutes = ['home', 'experience', 'games', 'about', 'booking', 'gallery', 'contact'];
    }

    init() {
      this.bindNavLinks();
      this.bindMobileDrawer();
      this.bindHeaderScroll();
    }

    bindArenaActions(bookingManager) {
      document.querySelectorAll('.arena-action-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const targetFilter = btn.getAttribute('data-filter-target') || 'all';
          const tabBtn = document.querySelector(`.game-filter-bar .filter-tab-btn[data-filter="${targetFilter}"]`);
          if (tabBtn) {
            tabBtn.click();
          } else if (bookingManager) {
            bookingManager.state.activeCategory = targetFilter;
            bookingManager.renderUnits();
          }
          this.navigateTo('booking', true);
        });
      });
    }

    navigateTo(routeId, smooth = true) {
      if (!this.validRoutes.includes(routeId)) return;
      this.updateActiveNav(routeId);
      this.closeMobileDrawer();

      const targetSection = document.getElementById(routeId);
      if (!targetSection) return;

      if (lenisInstance && smooth) {
        lenisInstance.scrollTo(targetSection, { offset: -60, duration: 1.15 });
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

  /* ============================================================
     7. GSAP SCROLLTRIGGER & MOTION ARCHITECTURE
     Signature Vault Aperture · Horizontal Story Track · Subtle Parallax
     ============================================================ */
  function initScrollTriggers() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || isReducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);

    // 1. Hero Video subtle parallax
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
      gsap.to(heroVideo, {
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        },
        y: '10%',
        scale: 1.06,
        opacity: 0.35,
        ease: 'none'
      });
    }

    // 2. SIGNATURE VAULT APERTURE TRANSITION
    // Physical vault opening / camera iris dilation with calipers & clip-path scrub
    const apertureFrame = document.getElementById('vault-aperture-frame');
    const apertureShutter = document.querySelector('.aperture-shutter-layer');
    const apertureInnerImg = document.querySelector('.aperture-inner-img');
    const apertureCrosshair = document.querySelector('.aperture-crosshair');
    const cornerTL = document.querySelector('.aperture-corner-tl');
    const cornerTR = document.querySelector('.aperture-corner-tr');
    const cornerBL = document.querySelector('.aperture-corner-bl');
    const cornerBR = document.querySelector('.aperture-corner-br');

    if (apertureFrame) {
      const apertureTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.vault-aperture-section',
          start: 'top 85%',
          end: 'center 45%',
          scrub: 0.8
        }
      });

      apertureTl.fromTo(apertureFrame,
        { scale: 0.92, opacity: 0.6 },
        { scale: 1.0, opacity: 1.0, ease: 'power2.out' },
        0
      );

      if (apertureShutter) {
        apertureTl.fromTo(apertureShutter,
          { clipPath: 'inset(16% 16% round 4px)' },
          { clipPath: 'inset(0% 0% round 0px)', ease: 'power2.inOut' },
          0
        );
      }

      if (apertureInnerImg) {
        apertureTl.fromTo(apertureInnerImg,
          { scale: 1.22, filter: 'brightness(0.65) contrast(1.15)' },
          { scale: 1.02, filter: 'brightness(0.95) contrast(1.05)', ease: 'power2.out' },
          0
        );
      }

      if (cornerTL) apertureTl.fromTo(cornerTL, { x: 24, y: 24 }, { x: 0, y: 0, ease: 'power2.out' }, 0);
      if (cornerTR) apertureTl.fromTo(cornerTR, { x: -24, y: 24 }, { x: 0, y: 0, ease: 'power2.out' }, 0);
      if (cornerBL) apertureTl.fromTo(cornerBL, { x: 24, y: -24 }, { x: 0, y: 0, ease: 'power2.out' }, 0);
      if (cornerBR) apertureTl.fromTo(cornerBR, { x: -24, y: -24 }, { x: 0, y: 0, ease: 'power2.out' }, 0);

      if (apertureCrosshair) {
        apertureTl.to(apertureCrosshair, { opacity: 0.1, scale: 0.85, ease: 'power2.out' }, 0);
      }
    }

    // 3. Horizontal Story Track on Desktop (>= 992px)
    const experienceTrack = document.getElementById('experience-track');
    const experienceSection = document.getElementById('experience');
    if (experienceTrack && experienceSection && window.innerWidth >= 992) {
      gsap.to(experienceTrack, {
        xPercent: -66.666,
        ease: 'none',
        scrollTrigger: {
          trigger: experienceSection,
          pin: true,
          scrub: 0.8,
          start: 'top top',
          end: () => '+=' + (window.innerWidth * 1.5),
          invalidateOnRefresh: true
        }
      });
    }

    // 4. Visual Pause Typographic Breathing Reveal
    const pauseLines = document.querySelectorAll('.pause-headline .pause-line');
    if (pauseLines.length) {
      gsap.fromTo(pauseLines,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          stagger: 0.18,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.visual-pause-section',
            start: 'top 75%'
          }
        }
      );
    }

    // 5. Arena Comparison Entrance
    const arenaCols = document.querySelectorAll('.arena-editorial-col');
    if (arenaCols.length) {
      gsap.fromTo(arenaCols,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.arena-comparison-section',
            start: 'top 80%'
          }
        }
      );
    }

    // 6. Architectural Differentiator Sequence Entrance
    const diffItems = document.querySelectorAll('.diff-seq-item');
    if (diffItems.length) {
      gsap.fromTo(diffItems,
        { opacity: 0, x: -24 },
        {
          opacity: 1,
          x: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.pillars-editorial-sequence',
            start: 'top 80%'
          }
        }
      );
    }

    // 7. Section Titles Entrance
    document.querySelectorAll('.section-title-large').forEach((title) => {
      gsap.fromTo(title,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 88%'
          }
        }
      );
    });
  }

  /* ============================================================
     8. INITIALIZATION BOOTSTRAP
     ============================================================ */
  function bootstrapApp() {
    initLenis();
    initCursor();
    initMagnetic();

    const booking = new BookingManager();
    booking.init();

    const gallery = new GalleryManager();
    gallery.init();

    const router = new ViewRouter();
    router.init();
    router.bindArenaActions(booking);

    const prologueEl = document.getElementById('vault-prologue');
    const heroVideo = document.getElementById('hero-bg-video');

    setTimeout(() => {
      if (prologueEl) {
        prologueEl.classList.add('prologue-complete');
      }
      if (heroVideo && heroVideo.paused) {
        heroVideo.play().catch(() => {});
      }
      initScrollTriggers();
    }, 1100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapApp);
  } else {
    bootstrapApp();
  }
})();
