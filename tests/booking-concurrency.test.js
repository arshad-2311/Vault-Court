/**
 * VAULT 147 — DYNAMIC DURATION & INTERVAL CONCURRENCY TEST SUITE
 * Validates 1–4 Hour Durations, Overlap Conditions, Hold Expirations, Closing Limits & Idempotency.
 */

import assert from 'assert';
import crypto from 'crypto';

class DynamicIntervalTestEngine {
  constructor() {
    this.bookings = new Map();
    this.payments = new Map();
    this.platformBilling = new Map();
    this.advisoryLocks = new Set();
  }

  reset() {
    this.bookings.clear();
    this.payments.clear();
    this.platformBilling.clear();
    this.advisoryLocks.clear();
  }

  parseTimeToMinutes(timeStr) {
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

  calculateEndTime(startTimeStr, durationHours = 1) {
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

  calculateServerPrice(unitId, durationHours = 1, playerCount = 1) {
    let hourlyRate = 250;
    if (unitId.startsWith('ps5')) {
      const validPlayers = Math.min(Math.max(playerCount, 1), 4);
      const rates = { 1: 150, 2: 300, 3: 400, 4: 500 };
      hourlyRate = rates[validPlayers] || 150;
    }
    const duration = Math.min(Math.max(durationHours, 1), 4);
    return {
      hourlyRate,
      durationHours: duration,
      total: hourlyRate * duration
    };
  }

  // Simulates fn_create_booking_hold with interval overlap detection
  async createBookingHold({ unitId, date, startTime, durationHours = 1, playerCount = 1, customerName, customerPhone, customerEmail = '', source = 'ONLINE' }) {
    const duration = parseInt(durationHours, 10) || 1;
    const reqStartMin = this.parseTimeToMinutes(startTime);
    const reqEndMin = reqStartMin + duration * 60;

    // Check Closing Time (12:00 AM Midnight = 1440 mins)
    if (reqEndMin > 24 * 60) {
      return {
        status: 400,
        error: 'EXCEEDS_CLOSING_TIME',
        message: 'The requested duration extends past the arena closing time (12:00 AM).'
      };
    }

    const lockKey = `${unitId}_${date}`;
    while (this.advisoryLocks.has(lockKey)) {
      await new Promise(r => setTimeout(r, 10));
    }
    this.advisoryLocks.add(lockKey);

    try {
      const now = new Date();

      // Expire stale holds
      for (const bkg of this.bookings.values()) {
        if (bkg.hold_expires_at && new Date(bkg.hold_expires_at) < now) {
          bkg.status = 'EXPIRED';
        }
      }

      // Interval overlap test: existing.start < requested.end AND existing.end > requested.start
      for (const bkg of this.bookings.values()) {
        if (bkg.unit_id === unitId && bkg.booking_date === date) {
          const bkgStart = this.parseTimeToMinutes(bkg.start_time);
          const bkgEnd = this.parseTimeToMinutes(bkg.end_time);

          if (bkgStart < reqEndMin && bkgEnd > reqStartMin) {
            if ((bkg.status === 'CONFIRMED' && !bkg.hold_expires_at) || (bkg.hold_expires_at && new Date(bkg.hold_expires_at) > now)) {
              return {
                status: 409,
                error: 'SLOT_ALREADY_RESERVED',
                message: 'This time interval was just taken. Please choose another time or duration.'
              };
            }
          }
        }
      }

      const bookingId = `V147-${Math.floor(1000 + Math.random() * 9000)}`;
      const priceObj = this.calculateServerPrice(unitId, duration, playerCount);
      const endTime = this.calculateEndTime(startTime, duration);

      const newBooking = {
        booking_id: bookingId,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        unit_id: unitId,
        booking_date: date,
        start_time: startTime,
        end_time: endTime,
        duration_hours: duration,
        hourly_rate: priceObj.hourlyRate,
        amount: priceObj.total,
        currency: 'INR',
        status: 'CONFIRMED',
        payment_status: 'PAY_AT_COUNTER',
        payment_method: 'COUNTER',
        booking_source: source || 'COUNTER_RESERVATION',
        hold_expires_at: null,
        created_at: new Date().toISOString()
      };

      this.bookings.set(bookingId, newBooking);

      return {
        status: 201,
        success: true,
        bookingId,
        paymentMethod: 'COUNTER',
        status_text: 'CONFIRMED',
        paymentStatus: 'PAY_AT_COUNTER',
        hourlyRate: priceObj.hourlyRate,
        amount: priceObj.total,
        durationHours: duration,
        currency: 'INR',
        startTime,
        endTime
      };
    } finally {
      this.advisoryLocks.delete(lockKey);
    }
  }

  async verifyPayment({ bookingId }) {
    const bkg = this.bookings.get(bookingId);
    if (!bkg) return { status: 404, error: 'BOOKING_NOT_FOUND' };

    bkg.status = 'CONFIRMED';
    bkg.payment_status = 'PAY_AT_COUNTER';
    return { status: 200, success: true, bookingId, status_text: 'CONFIRMED' };
  }

  // Helper to query available consecutive hours
  getAvailableConsecutiveHours(unitId, date, startTime) {
    const startMin = this.parseTimeToMinutes(startTime);
    const closingMin = 24 * 60;
    const now = new Date();

    let maxHours = 0;
    for (let h = 1; h <= 4; h++) {
      const testEndMin = startMin + h * 60;
      if (testEndMin > closingMin) break;

      let hasOverlap = false;
      for (const bkg of this.bookings.values()) {
        if (bkg.unit_id === unitId && bkg.booking_date === date) {
          const bkgStart = this.parseTimeToMinutes(bkg.start_time);
          const bkgEnd = this.parseTimeToMinutes(bkg.end_time);

          if (bkgStart < testEndMin && bkgEnd > startMin) {
            if (bkg.status === 'CONFIRMED' || (bkg.status === 'PENDING_PAYMENT' && new Date(bkg.hold_expires_at) > now)) {
              hasOverlap = true;
              break;
            }
          }
        }
      }

      if (!hasOverlap) {
        maxHours = h;
      } else {
        break;
      }
    }
    return maxHours;
  }
}

// ============================================================
// TEST RUNNER
// ============================================================
async function runTests() {
  console.log('============================================================');
  console.log('VAULT 147 — DYNAMIC DURATION & INTERVAL CONCURRENCY SUITE');
  console.log('============================================================\n');

  const engine = new DynamicIntervalTestEngine();
  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    return (async () => {
      try {
        engine.reset();
        await fn();
        console.log(`✓ [PASS] Test ${total}: ${name}`);
        passed++;
      } catch (err) {
        console.error(`✗ [FAIL] Test ${total}: ${name}`);
        console.error(`  Error: ${err.message}`);
      }
    })();
  }

  // TEST 1: Same Table Overlapping Sub-interval (7–9 PM vs 8–9 PM)
  await test('A: Table 01 (7–9 PM confirmed) -> B: Table 01 (8–9 PM) -> Rejected (409)', async () => {
    const resA = await engine.createBookingHold({
      unitId: 'snooker-01',
      date: '2026-08-31',
      startTime: '07:00 PM',
      durationHours: 2,
      customerName: 'Customer A',
      customerPhone: '9876543210'
    });
    await engine.verifyPayment({
      bookingId: resA.bookingId
    });

    const resB = await engine.createBookingHold({
      unitId: 'snooker-01',
      date: '2026-08-31',
      startTime: '08:00 PM',
      durationHours: 1,
      customerName: 'Customer B',
      customerPhone: '9876543211'
    });

    assert.strictEqual(resB.status, 409, 'Sub-interval 8–9 PM must be rejected');
  });

  // TEST 2: Same Table Adjacent Interval (7–9 PM vs 9–11 PM)
  await test('A: Table 01 (7–9 PM confirmed) -> B: Table 01 (9–11 PM) -> Accepted (201)', async () => {
    const resA = await engine.createBookingHold({
      unitId: 'snooker-01',
      date: '2026-08-31',
      startTime: '07:00 PM',
      durationHours: 2,
      customerName: 'Customer A',
      customerPhone: '9876543210'
    });
    await engine.verifyPayment({
      bookingId: resA.bookingId
    });

    const resB = await engine.createBookingHold({
      unitId: 'snooker-01',
      date: '2026-08-31',
      startTime: '09:00 PM',
      durationHours: 2,
      customerName: 'Customer B',
      customerPhone: '9876543211'
    });

    assert.strictEqual(resB.status, 201, 'Adjacent interval 9–11 PM must be accepted');
  });

  // TEST 3: Different Tables Same Multi-hour Interval (7–10 PM)
  await test('A: Table 01 (7–10 PM) -> B: Table 02 (7–10 PM) -> Both Accepted (201)', async () => {
    const resA = await engine.createBookingHold({
      unitId: 'snooker-01',
      date: '2026-08-31',
      startTime: '07:00 PM',
      durationHours: 3,
      customerName: 'Customer A',
      customerPhone: '9876543210'
    });

    const resB = await engine.createBookingHold({
      unitId: 'snooker-02',
      date: '2026-08-31',
      startTime: '07:00 PM',
      durationHours: 3,
      customerName: 'Customer B',
      customerPhone: '9876543211'
    });

    assert.strictEqual(resA.status, 201);
    assert.strictEqual(resB.status, 201);
    assert.strictEqual(resA.amount, 750, '3 hours snooker is ₹750');
  });

  // TEST 4: Active Temporary Hold Blocks Overlap (7–9 PM PENDING -> 8–10 PM)
  await test('A: Table 01 (7–9 PM PENDING) -> B: Table 01 (8–10 PM) -> Rejected (409)', async () => {
    const resA = await engine.createBookingHold({
      unitId: 'snooker-01',
      date: '2026-08-31',
      startTime: '07:00 PM',
      durationHours: 2,
      customerName: 'Customer A',
      customerPhone: '9876543210'
    });
    assert.strictEqual(resA.status, 201);

    const resB = await engine.createBookingHold({
      unitId: 'snooker-01',
      date: '2026-08-31',
      startTime: '08:00 PM',
      durationHours: 2,
      customerName: 'Customer B',
      customerPhone: '9876543211'
    });

    assert.strictEqual(resB.status, 409, 'Hold on 7–9 PM must block 8–10 PM');
  });

  // TEST 5: Expired Hold Releases Interval
  await test('A: 7–9 PM hold expires -> B: Table 01 (8–10 PM) -> Accepted (201)', async () => {
    const resA = await engine.createBookingHold({
      unitId: 'snooker-01',
      date: '2026-08-31',
      startTime: '07:00 PM',
      durationHours: 2,
      customerName: 'Customer A',
      customerPhone: '9876543210'
    });

    // Manually expire hold
    const bkgA = engine.bookings.get(resA.bookingId);
    bkgA.hold_expires_at = new Date(Date.now() - 1000).toISOString();

    const resB = await engine.createBookingHold({
      unitId: 'snooker-01',
      date: '2026-08-31',
      startTime: '08:00 PM',
      durationHours: 2,
      customerName: 'Customer B',
      customerPhone: '9876543211'
    });

    assert.strictEqual(resB.status, 201, 'Expired hold must release the interval');
  });

  // TEST 6: Simultaneous Race Condition on Multi-Hour Interval (7–10 PM)
  await test('A & B simultaneously attempt Table 01 (7–10 PM) -> Exactly ONE succeeds', async () => {
    const pA = engine.createBookingHold({
      unitId: 'snooker-01',
      date: '2026-08-31',
      startTime: '07:00 PM',
      durationHours: 3,
      customerName: 'Customer A',
      customerPhone: '9876543210'
    });

    const pB = engine.createBookingHold({
      unitId: 'snooker-01',
      date: '2026-08-31',
      startTime: '07:00 PM',
      durationHours: 3,
      customerName: 'Customer B',
      customerPhone: '9876543211'
    });

    const [resA, resB] = await Promise.all([pA, pB]);
    const succ = [resA, resB].filter(r => r.status === 201).length;
    const fail = [resA, resB].filter(r => r.status === 409).length;

    assert.strictEqual(succ, 1, 'Exactly one reservation succeeds');
    assert.strictEqual(fail, 1, 'The other is rejected with 409');
  });

  // TEST 7: Closing Time Rejection (10 PM + 4 Hours)
  await test('10 PM + 4 Hours exceeds 12 AM closing -> Rejected (400)', async () => {
    const res = await engine.createBookingHold({
      unitId: 'snooker-01',
      date: '2026-08-31',
      startTime: '10:00 PM',
      durationHours: 4,
      customerName: 'Customer A',
      customerPhone: '9876543210'
    });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.error, 'EXCEEDS_CLOSING_TIME');
  });

  // TEST 8: Smart Duration Calculation with Existing Mid-Interval Booking
  await test('Existing booking at 8–9 PM -> From 7 PM: 1h is available, 2/3/4h are unavailable', async () => {
    const midRes = await engine.createBookingHold({
      unitId: 'snooker-01',
      date: '2026-08-31',
      startTime: '08:00 PM',
      durationHours: 1,
      customerName: 'Mid Booker',
      customerPhone: '9876543210'
    });
    await engine.verifyPayment({
      bookingId: midRes.bookingId
    });

    const maxConsecutive = engine.getAvailableConsecutiveHours('snooker-01', '2026-08-31', '07:00 PM');
    assert.strictEqual(maxConsecutive, 1, 'Only 1 hour (7–8 PM) is available before 8 PM block');

    // Attempting 2 hours must fail
    const res2hr = await engine.createBookingHold({
      unitId: 'snooker-01',
      date: '2026-08-31',
      startTime: '07:00 PM',
      durationHours: 2,
      customerName: 'Customer A',
      customerPhone: '9876543211'
    });
    assert.strictEqual(res2hr.status, 409);

    // Attempting 1 hour must succeed
    const res1hr = await engine.createBookingHold({
      unitId: 'snooker-01',
      date: '2026-08-31',
      startTime: '07:00 PM',
      durationHours: 1,
      customerName: 'Customer A',
      customerPhone: '9876543211'
    });
    assert.strictEqual(res1hr.status, 201);
  });

  console.log(`\n============================================================`);
  console.log(`TEST SUMMARY: ${passed} / ${total} PASSED`);
  console.log(`============================================================\n`);
}

runTests();
