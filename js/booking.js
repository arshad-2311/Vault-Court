/**
 * VAULT 147 — BOOKING ENGINE CONTROLLER
 * Zero-Lag Modal Opening (0ms) · Dynamic Duration (1–4 Hours) · Counter Settlement & Resend Dispatch
 */

import { BOOKING_UNITS, VENUE_INFO } from './data.js';
import { BookingAPI, calculateEndTime } from './api-boundary.js';

export class BookingEngine {
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
    if (window.lenisInstance) {
      window.lenisInstance.stop();
    }

    // 2. Populate Header & Details
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

    // 3. Populate slots without blocking modal display
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
          ${!isPossible ? 'disabled title="Not enough consecutive availability"' : ''}
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
        <span style="color:var(--status-available);font-size:11px;">[SLOT RESERVABLE]</span>
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
      if (window.lenisInstance) {
        window.lenisInstance.start();
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
        statusPill.textContent = 'SESSION UNLOCKED · PAY AT VENUE COUNTER';
        statusPill.style.color = 'var(--crimson-bright)';
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
