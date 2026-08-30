/**
 * VAULT 147 — ISOLATED BOOKING API & AVAILABILITY BOUNDARY
 * Decouples the UI layer from the data provider.
 * Ready for drop-in REST / GraphQL / Payment Gateway replacement without UI refactoring.
 */

import { TIME_SLOTS, PRICING_RULES, BOOKING_UNITS } from './data.js';

export const BookingAPI = {
  /**
   * Fetches deterministic slot availability for a given date and unit.
   * @param {string} dateStr - e.g. "2026-08-31"
   * @param {string} unitId - e.g. "snooker-01"
   * @returns {Promise<Array<{time: string, isAvailable: boolean}>>}
   */
  async getAvailability(dateStr, unitId) {
    // Simulated network latency (100ms) to ensure UI handles async states cleanly
    await new Promise(resolve => setTimeout(resolve, 80));

    // Deterministic simulation based on unit & date hash
    return TIME_SLOTS.map((slot, index) => {
      // Deterministically mark a few peak evening slots as occupied for realistic UI testing
      const isBooked = (unitId === 'snooker-01' && slot === '07:30 PM') ||
                       (unitId === 'ps5-01' && slot === '06:00 PM');
      return {
        time: slot,
        isAvailable: !isBooked
      };
    });
  },

  /**
   * Calculates the exact session price based on unit category, duration, and player count.
   * @param {Object} unit
   * @param {number} durationHours
   * @param {number} players
   * @returns {{ hourlyRate: number, duration: number, players: number, total: number }}
   */
  calculateSessionPrice(unit, durationHours = 1, players = 1) {
    let hourlyRate = unit.basePrice;

    if (unit.category === 'ps5') {
      const validPlayers = Math.min(Math.max(players, 1), 4);
      hourlyRate = PRICING_RULES.ps5[validPlayers] || 150;
    } else {
      hourlyRate = PRICING_RULES.snooker.baseRate;
    }

    const total = hourlyRate * durationHours;

    return {
      hourlyRate,
      duration: durationHours,
      players,
      total
    };
  },

  /**
   * Submits a booking request payload.
   * In production, this dispatches to POST /api/bookings and returns the verified session token.
   * @param {Object} payload
   * @returns {Promise<{ success: boolean, bookingId: string, payload: Object }>}
   */
  async createBookingSession(payload) {
    await new Promise(resolve => setTimeout(resolve, 150));

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `V147-${randomSuffix}`;

    return {
      success: true,
      bookingId,
      timestamp: new Date().toISOString(),
      payload
    };
  }
};
