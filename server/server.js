/**
 * VAULT 147 — PRODUCTION COUNTER BOOKING SERVER
 * In-Person Counter Payments + Automated Resend Customer & Manager Notifications
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { sendBookingConfirmationEmails } from './mailer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// 1. Supabase Initialization
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

let supabase = null;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });
}

// --- TIME & INTERVAL HELPERS ---
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

function calculateServerPrice(unitId, durationHours = 1, playerCount = 1) {
  let hourlyRate = 250;
  if (unitId.startsWith('ps5')) {
    const validPlayers = Math.min(Math.max(playerCount, 1), 4);
    const ps5Rates = { 1: 150, 2: 300, 3: 400, 4: 500 };
    hourlyRate = ps5Rates[validPlayers] || 150;
  }
  const validDuration = Math.min(Math.max(durationHours, 1), 4);
  return {
    hourlyRate,
    durationHours: validDuration,
    total: hourlyRate * validDuration
  };
}

// In-Memory Transactional Fallback State
const inMemoryBookings = new Map();

// ============================================================
// API ENDPOINTS
// ============================================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    venue: 'VAULT 147',
    supabaseConnected: !!supabase,
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/bookings/availability
 * Returns 1-hour slot availability states and max consecutive available hours
 */
app.get('/api/bookings/availability', async (req, res) => {
  const { date, unitId } = req.query;

  if (!date || !unitId) {
    return res.status(400).json({ error: 'Missing date or unitId parameter' });
  }

  // 1. Try Supabase RPC
  if (supabase) {
    try {
      const { data, error } = await supabase.rpc('fn_get_unit_availability', {
        p_date: date,
        p_unit_id: unitId
      });

      if (!error && data) {
        return res.json({
          date,
          unitId,
          slots: data.map(s => ({
            startTime: s.start_time,
            status: s.status,
            isAvailable: s.is_available,
            maxConsecutiveHours: s.max_consecutive_hours
          }))
        });
      }
    } catch (e) {
      console.warn('[Supabase] Availability RPC fallback:', e.message);
    }
  }

  // 2. High-Fidelity Client Fallback Simulation
  const allSlots = [
    '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM',
    '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
    '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM'
  ];

  const now = new Date();
  const closingMinutes = 24 * 60; // 12:00 AM Midnight

  const slots = allSlots.map((slot) => {
    const startMin = parseTimeToMinutes(slot);
    const end1hrMin = startMin + 60;

    let isOccupied = false;
    let status = 'AVAILABLE';

    for (const bkg of inMemoryBookings.values()) {
      if (bkg.unit_id === unitId && bkg.booking_date === date) {
        const bkgStart = parseTimeToMinutes(bkg.start_time);
        const bkgEnd = parseTimeToMinutes(bkg.end_time);

        // Overlap rule: bkgStart < end1hrMin AND bkgEnd > startMin
        if (bkgStart < end1hrMin && bkgEnd > startMin) {
          if (bkg.status === 'CONFIRMED') {
            status = 'BOOKED';
            isOccupied = true;
            break;
          } else if (bkg.status === 'PENDING_PAYMENT' && new Date(bkg.hold_expires_at) > now) {
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
        for (const bkg of inMemoryBookings.values()) {
          if (bkg.unit_id === unitId && bkg.booking_date === date) {
            const bkgStart = parseTimeToMinutes(bkg.start_time);
            const bkgEnd = parseTimeToMinutes(bkg.end_time);
            if (bkgStart < testEndMin && bkgEnd > startMin) {
              if (bkg.status === 'CONFIRMED' || (bkg.status === 'PENDING_PAYMENT' && new Date(bkg.hold_expires_at) > now)) {
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

  res.json({ date, unitId, slots });
});

/**
 * POST /api/bookings/create-hold
 * Atomically validates interval overlap, calculates price, and creates confirmed Counter reservation
 */
app.post('/api/bookings/create-hold', async (req, res) => {
  const {
    unitId,
    date,
    startTime,
    durationHours = 1,
    playerCount = 1,
    customerName,
    customerPhone,
    customerEmail = '',
    notes = ''
  } = req.body;

  if (!unitId || !date || !startTime || !customerName || !customerPhone) {
    return res.status(400).json({ error: 'Missing required booking fields' });
  }

  const duration = parseInt(durationHours, 10) || 1;
  if (duration < 1 || duration > 4) {
    return res.status(400).json({ error: 'Duration must be between 1 and 4 hours' });
  }

  const priceObj = calculateServerPrice(unitId, duration, playerCount);
  const endTime = calculateEndTime(startTime, duration);

  // Validate Closing Time
  const startMin = parseTimeToMinutes(startTime);
  const endMin = startMin + duration * 60;
  if (endMin > 24 * 60) {
    return res.status(400).json({
      error: 'EXCEEDS_CLOSING_TIME',
      message: 'The requested duration extends past the arena closing time (12:00 AM).'
    });
  }

  // 1. Try Supabase RPC
  if (supabase) {
    try {
      const { data, error } = await supabase.rpc('fn_create_booking_hold', {
        p_unit_id: unitId,
        p_date: date,
        p_start_time: startTime,
        p_duration_hours: duration,
        p_player_count: playerCount,
        p_customer_name: customerName,
        p_customer_phone: customerPhone,
        p_customer_email: customerEmail,
        p_notes: notes,
        p_source: 'COUNTER_RESERVATION'
      });

      if (error) {
        if (error.message.includes('SLOT_ALREADY_RESERVED')) {
          return res.status(409).json({
            error: 'SLOT_ALREADY_RESERVED',
            message: 'This time interval was just taken. Please choose another time or duration.'
          });
        }
        throw error;
      }

      if (data && data[0] && data[0].success) {
        const holdRecord = data[0];

        await supabase.from('bookings').update({
          status: 'CONFIRMED',
          payment_status: 'PAY_AT_COUNTER',
          payment_method: 'COUNTER',
          hold_expires_at: null
        }).eq('booking_id', holdRecord.booking_id);

        sendBookingConfirmationEmails({
          bookingId: holdRecord.booking_id,
          customerName,
          customerPhone,
          customerEmail,
          unitId,
          date,
          startTime,
          endTime: holdRecord.end_time,
          durationHours: duration,
          playerCount,
          notes,
          amount: holdRecord.total_amount,
          paymentMethod: 'COUNTER',
          paymentStatus: 'PAY_AT_COUNTER'
        }).catch(err => console.error('[Resend Mailer Error]:', err));

        return res.status(201).json({
          success: true,
          bookingId: holdRecord.booking_id,
          paymentMethod: 'COUNTER',
          status: 'CONFIRMED',
          paymentStatus: 'PAY_AT_COUNTER',
          hourlyRate: holdRecord.hourly_rate,
          amount: holdRecord.total_amount,
          durationHours: duration,
          currency: 'INR',
          startTime,
          endTime: holdRecord.end_time
        });
      }
    } catch (e) {
      if (e.message && e.message.includes('SLOT_ALREADY_RESERVED')) {
        return res.status(409).json({
          error: 'SLOT_ALREADY_RESERVED',
          message: 'This time interval was just taken. Please choose another time or duration.'
        });
      }
      console.warn('[Supabase] Create hold fallback:', e.message);
    }
  }

  // 2. In-Memory Concurrency & Interval Overlap Check
  const now = new Date();

  // Expire stale holds if any
  for (const bkg of inMemoryBookings.values()) {
    if (bkg.status === 'PENDING_PAYMENT' && new Date(bkg.hold_expires_at) < now) {
      bkg.status = 'EXPIRED';
    }
  }

  // Interval overlap test: existing.start < requested.end AND existing.end > requested.start
  for (const bkg of inMemoryBookings.values()) {
    if (bkg.unit_id === unitId && bkg.booking_date === date) {
      const bkgStart = parseTimeToMinutes(bkg.start_time);
      const bkgEnd = parseTimeToMinutes(bkg.end_time);

      if (bkgStart < endMin && bkgEnd > startMin) {
        if (bkg.status === 'CONFIRMED' || (bkg.status === 'PENDING_PAYMENT' && new Date(bkg.hold_expires_at) > now)) {
          return res.status(409).json({
            error: 'SLOT_ALREADY_RESERVED',
            message: 'This time interval was just taken. Please choose another time or duration.'
          });
        }
      }
    }
  }

  const bookingId = `V147-${Math.floor(1000 + Math.random() * 9000)}`;

  inMemoryBookings.set(bookingId, {
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
    booking_source: 'COUNTER_RESERVATION',
    hold_expires_at: null,
    created_at: new Date().toISOString()
  });

  sendBookingConfirmationEmails({
    bookingId,
    customerName,
    customerPhone,
    customerEmail,
    unitId,
    date,
    startTime,
    endTime,
    durationHours: duration,
    playerCount,
    notes,
    amount: priceObj.total,
    paymentMethod: 'COUNTER',
    paymentStatus: 'PAY_AT_COUNTER'
  }).catch(err => console.error('[Resend Mailer Error]:', err));

  res.status(201).json({
    success: true,
    bookingId,
    paymentMethod: 'COUNTER',
    status: 'CONFIRMED',
    paymentStatus: 'PAY_AT_COUNTER',
    hourlyRate: priceObj.hourlyRate,
    amount: priceObj.total,
    durationHours: duration,
    currency: 'INR',
    startTime,
    endTime
  });
});

/**
 * POST /api/bookings/confirm-counter
 * Confirms a held booking for direct in-person payment at the arena counter
 */
app.post('/api/bookings/confirm-counter', async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({ error: 'Missing bookingId' });
  }

  if (supabase) {
    try {
      await supabase.from('bookings').update({
        status: 'CONFIRMED',
        payment_status: 'PAY_AT_COUNTER',
        payment_method: 'COUNTER',
        hold_expires_at: null
      }).eq('booking_id', bookingId);
    } catch (e) {
      console.warn('[Supabase] Confirm counter fallback:', e.message);
    }
  }

  const bkg = inMemoryBookings.get(bookingId);
  if (!bkg) {
    return res.status(404).json({ error: 'BOOKING_NOT_FOUND' });
  }

  bkg.status = 'CONFIRMED';
  bkg.payment_status = 'PAY_AT_COUNTER';
  bkg.payment_method = 'COUNTER';
  bkg.hold_expires_at = null;

  sendBookingConfirmationEmails({
    bookingId: bkg.booking_id,
    customerName: bkg.customer_name,
    customerPhone: bkg.customer_phone,
    customerEmail: bkg.customer_email,
    unitId: bkg.unit_id,
    date: bkg.booking_date,
    startTime: bkg.start_time,
    endTime: bkg.end_time,
    durationHours: bkg.duration_hours,
    playerCount: bkg.player_count,
    notes: bkg.notes,
    amount: bkg.amount,
    paymentMethod: 'COUNTER',
    paymentStatus: 'PAY_AT_COUNTER'
  }).catch(err => console.error('[Resend Mailer Error]:', err));

  res.json({
    success: true,
    bookingId,
    status: 'CONFIRMED',
    paymentStatus: 'PAY_AT_COUNTER'
  });
});

app.listen(PORT, () => {
  console.log(`[VAULT 147 Server] Running on http://localhost:${PORT}`);
});
