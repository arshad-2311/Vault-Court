/**
 * VAULT 147 — INTERACTIVE BOOKING ENGINE
 * State machine, date selector, unit filtering, configurator, dynamic pricing & VIP ticket pass
 */

import { BOOKING_UNITS, VENUE_INFO } from './data.js';
import { BookingAPI } from './api-boundary.js';
import { animatePriceChange, animateSessionPass } from './motion/booking-motion.js';

class BookingEngine {
  constructor() {
    this.state = {
      selectedDate: null,
      activeCategory: 'all',
      selectedUnit: null,
      durationHours: 1,
      playerCount: 1,
      selectedTimeSlot: null,
      currentTotal: 0,
      customer: {
        name: '',
        phone: '',
        email: '',
        notes: ''
      },
      confirmedSession: null
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
      <button class="date-pill-btn ${idx === 0 ? 'is-active' : ''}" data-date="${item.isoDate}" data-cursor="select">
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

        // If configurator is open, refresh slots for new date
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

    container.innerHTML = filtered.map((unit) => `
      <article class="unit-card" data-unit-id="${unit.id}">
        <div class="unit-card-img-wrap">
          <img src="${unit.image}" alt="${unit.name}" class="unit-card-img" loading="lazy" />
          <span class="unit-status-tag ${unit.status.toLowerCase()}">${unit.status}</span>
        </div>
        <div class="unit-card-body">
          <span class="unit-game-category">${unit.categoryLabel}</span>
          <h3 class="unit-name">${unit.name}</h3>
          <ul class="unit-specs-list">
            ${unit.specs.map(spec => `<li class="unit-specs-item">${spec}</li>`).join('')}
          </ul>
          <div class="unit-card-footer">
            <div class="unit-price-box">
              <span class="unit-price-rate">${unit.priceLabel}</span>
              <span class="unit-price-sub">OFFICIAL TARIFF</span>
            </div>
            <button class="btn btn-primary unit-select-btn" data-unit-id="${unit.id}" data-cursor="select">
              SELECT
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

  async openConfigModal(unitId) {
    const unit = BOOKING_UNITS.find(u => u.id === unitId);
    if (!unit) return;

    this.state.selectedUnit = unit;
    this.state.durationHours = 1;
    this.state.playerCount = 1;
    this.state.selectedTimeSlot = null;

    const modal = document.getElementById('booking-config-modal');
    if (!modal) return;

    // Populate Unit Banner
    const thumbEl = modal.querySelector('.config-unit-thumb');
    const nameEl = modal.querySelector('.config-modal-unit-name');
    const catEl = modal.querySelector('.config-modal-unit-cat');
    const dateEl = modal.querySelector('.config-modal-date-display');

    if (thumbEl) thumbEl.src = unit.image;
    if (nameEl) nameEl.textContent = unit.name;
    if (catEl) catEl.textContent = unit.categoryLabel;
    if (dateEl) dateEl.textContent = this.state.selectedDate.fullDateStr;

    // Toggle player count visibility (only relevant for PS5)
    const playerGroup = modal.querySelector('.config-players-group');
    if (playerGroup) {
      playerGroup.style.display = unit.category === 'ps5' ? 'block' : 'none';
    }

    // Reset chips
    modal.querySelectorAll('.duration-choice').forEach((c, idx) => {
      c.classList.toggle('is-active', idx === 0);
    });
    modal.querySelectorAll('.player-choice').forEach((c, idx) => {
      c.classList.toggle('is-active', idx === 0);
    });

    this.updatePriceCalculations(true);
    await this.loadTimeSlots(unit.id);

    modal.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  }

  async loadTimeSlots(unitId) {
    const slotsContainer = document.getElementById('modal-time-slots-grid');
    if (!slotsContainer) return;

    slotsContainer.innerHTML = '<div style="font-family:var(--font-mono);font-size:12px;color:var(--text-muted);padding:1rem;">Checking available slots...</div>';

    const slots = await BookingAPI.getAvailability(this.state.selectedDate.isoDate, unitId);

    slotsContainer.innerHTML = slots.map((slot) => `
      <button 
        type="button" 
        class="time-slot-btn" 
        data-slot="${slot.time}" 
        ${!slot.isAvailable ? 'disabled title="Slot Booked"' : ''}
        data-cursor="select"
      >
        ${slot.time}
      </button>
    `).join('');

    slotsContainer.querySelectorAll('.time-slot-btn:not(:disabled)').forEach((btn) => {
      btn.addEventListener('click', () => {
        slotsContainer.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        this.state.selectedTimeSlot = btn.getAttribute('data-slot');

        const slotError = document.getElementById('slot-error-msg');
        if (slotError) slotError.style.display = 'none';
      });
    });
  }

  updatePriceCalculations(isInitial = false) {
    if (!this.state.selectedUnit) return;

    const priceObj = BookingAPI.calculateSessionPrice(
      this.state.selectedUnit,
      this.state.durationHours,
      this.state.playerCount
    );

    const oldTotal = this.state.currentTotal;
    this.state.currentTotal = priceObj.total;

    const rateEl = document.getElementById('summary-hourly-rate');
    const durEl = document.getElementById('summary-duration-display');
    const totalEl = document.getElementById('summary-total-price');

    if (rateEl) rateEl.textContent = `₹${priceObj.hourlyRate} / HR`;
    if (durEl) durEl.textContent = `${this.state.durationHours} HOUR${this.state.durationHours > 1 ? 'S' : ''}`;

    if (totalEl) {
      if (isInitial) {
        totalEl.textContent = `₹${priceObj.total}`;
      } else {
        animatePriceChange(totalEl, oldTotal, priceObj.total);
      }
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

    // Duration chips
    modal.querySelectorAll('.duration-choice').forEach((chip) => {
      chip.addEventListener('click', () => {
        modal.querySelectorAll('.duration-choice').forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        this.state.durationHours = parseInt(chip.getAttribute('data-hours'), 10) || 1;
        this.updatePriceCalculations();
      });
    });

    // Player chips
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
      document.body.style.overflow = '';
    }
  }

  bindFormSubmission() {
    const form = document.getElementById('booking-customer-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validate Time Slot
      if (!this.state.selectedTimeSlot) {
        const slotError = document.getElementById('slot-error-msg');
        if (slotError) slotError.style.display = 'block';
        return;
      }

      // Validate Inputs
      const nameInput = document.getElementById('cust-name');
      const phoneInput = document.getElementById('cust-phone');
      const emailInput = document.getElementById('cust-email');
      const notesInput = document.getElementById('cust-notes');

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

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput.value.trim() && !emailRegex.test(emailInput.value.trim())) {
        emailInput.closest('.form-group').classList.add('has-error');
        hasError = true;
      } else {
        emailInput.closest('.form-group').classList.remove('has-error');
      }

      if (hasError) return;

      const payload = {
        unitId: this.state.selectedUnit.id,
        unitName: this.state.selectedUnit.name,
        category: this.state.selectedUnit.categoryLabel,
        date: this.state.selectedDate.fullDateStr,
        timeSlot: this.state.selectedTimeSlot,
        duration: `${this.state.durationHours} Hour${this.state.durationHours > 1 ? 's' : ''}`,
        players: this.state.selectedUnit.category === 'ps5' ? `${this.state.playerCount} Player(s)` : 'N/A',
        totalPrice: `₹${this.state.currentTotal}`,
        customerName: nameInput.value.trim(),
        customerPhone: phoneVal,
        customerEmail: emailInput.value.trim(),
        notes: notesInput ? notesInput.value.trim() : ''
      };

      const result = await BookingAPI.createBookingSession(payload);
      if (result.success) {
        this.closeConfigModal();
        this.renderConfirmationScreen(result.bookingId, payload);
      }
    });
  }

  renderConfirmationScreen(bookingId, payload) {
    const bookingMain = document.getElementById('booking-main-content');
    const confirmView = document.getElementById('booking-confirmation-view');

    if (bookingMain) bookingMain.style.display = 'none';
    if (confirmView) {
      confirmView.classList.add('is-visible');

      document.getElementById('pass-id-val').textContent = bookingId;
      document.getElementById('pass-unit-val').textContent = payload.unitName;
      document.getElementById('pass-date-val').textContent = payload.date;
      document.getElementById('pass-time-val').textContent = payload.timeSlot;
      document.getElementById('pass-duration-val').textContent = payload.duration;
      document.getElementById('pass-total-val').textContent = payload.totalPrice;
      document.getElementById('pass-name-val').textContent = payload.customerName;

      // Build WhatsApp Dispatch Link
      const waMsg = encodeURIComponent(
        `*VAULT 147 — SESSION CONFIRMATION REQUEST*\n\n` +
        `*Booking ID:* ${bookingId}\n` +
        `*Game & Unit:* ${payload.unitName}\n` +
        `*Date:* ${payload.date}\n` +
        `*Time:* ${payload.timeSlot}\n` +
        `*Duration:* ${payload.duration}\n` +
        (payload.players !== 'N/A' ? `*Players:* ${payload.players}\n` : '') +
        `*Estimated Total:* ${payload.totalPrice}\n\n` +
        `*Name:* ${payload.customerName}\n` +
        `*Phone:* ${payload.customerPhone}\n\n` +
        `Please confirm my table / station session.`
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

      animateSessionPass(confirmView.querySelector('.session-pass-card'));
      window.scrollTo({ top: confirmView.offsetTop - 80, behavior: 'smooth' });
    }
  }
}

export const bookingEngine = new BookingEngine();
