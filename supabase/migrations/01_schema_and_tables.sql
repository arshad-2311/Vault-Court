-- ============================================================
-- VAULT 147 — SUPABASE PRODUCTION DATABASE SCHEMA
-- Migration 01: Enums, Tables, Dynamic Duration & Timestamp Ranges
-- ============================================================

CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 1. ENUMS
DO $$ BEGIN
    CREATE TYPE booking_status_enum AS ENUM (
        'PENDING_PAYMENT',
        'CONFIRMED',
        'CANCELLED',
        'EXPIRED',
        'REFUNDED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status_enum AS ENUM (
        'PENDING',
        'PAID',
        'FAILED',
        'REFUNDED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_source_enum AS ENUM (
        'ONLINE',
        'WALK_IN',
        'ADMIN'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. GAMES TABLE
CREATE TABLE IF NOT EXISTS games (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. BOOKING UNITS TABLE
CREATE TABLE IF NOT EXISTS booking_units (
    id TEXT PRIMARY KEY,
    game_id TEXT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    base_price_per_hour INTEGER NOT NULL DEFAULT 250,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. BOOKINGS TABLE (Dynamic Duration 1–4 Hours)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id TEXT NOT NULL UNIQUE, -- e.g. V147-8492
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    unit_id TEXT NOT NULL REFERENCES booking_units(id) ON DELETE RESTRICT,
    game_id TEXT NOT NULL REFERENCES games(id) ON DELETE RESTRICT,
    booking_date DATE NOT NULL,
    start_time TEXT NOT NULL,         -- e.g. '07:00 PM'
    end_time TEXT NOT NULL,           -- e.g. '09:00 PM' (start_time + duration)
    duration_hours INTEGER NOT NULL DEFAULT 1 CHECK (duration_hours >= 1 AND duration_hours <= 4),
    start_timestamp TIMESTAMPTZ NOT NULL,
    end_timestamp TIMESTAMPTZ NOT NULL,
    player_count INTEGER NOT NULL DEFAULT 1,
    hourly_rate INTEGER NOT NULL,
    amount INTEGER NOT NULL,          -- server-calculated in INR (hourly_rate * duration_hours)
    currency TEXT NOT NULL DEFAULT 'INR',
    status booking_status_enum NOT NULL DEFAULT 'PENDING_PAYMENT',
    payment_status payment_status_enum NOT NULL DEFAULT 'PENDING',
    booking_source booking_source_enum NOT NULL DEFAULT 'ONLINE',
    hold_expires_at TIMESTAMPTZ,      -- 10-minute hold window for payment
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. POSTGRESQL EXCLUSION CONSTRAINT FOR TIME INTERVALS
-- Prevents overlapping CONFIRMED bookings on the same unit at the database engine level
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS uq_unit_time_slot_exclude;
ALTER TABLE bookings ADD CONSTRAINT uq_unit_time_slot_exclude 
EXCLUDE USING gist (
    unit_id WITH =,
    tstzrange(start_timestamp, end_timestamp) WITH &&
) WHERE (status = 'CONFIRMED');

-- 6. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    razorpay_order_id TEXT NOT NULL,
    razorpay_payment_id TEXT NOT NULL UNIQUE,
    razorpay_signature TEXT NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    status payment_status_enum NOT NULL DEFAULT 'PAID',
    method TEXT DEFAULT 'upi',
    payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. PLATFORM BILLING / AUDIT LEDGER (₹10 Platform Fee per Confirmed Online Booking)
CREATE TABLE IF NOT EXISTS platform_billing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    fee_amount INTEGER NOT NULL DEFAULT 10,
    billing_cycle TEXT NOT NULL, -- e.g. '2026-08'
    status TEXT NOT NULL DEFAULT 'PENDING_INVOICE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. INDICES
CREATE INDEX IF NOT EXISTS idx_bookings_unit_date 
ON bookings (unit_id, booking_date);

CREATE INDEX IF NOT EXISTS idx_bookings_time_range 
ON bookings USING gist (tstzrange(start_timestamp, end_timestamp));

CREATE INDEX IF NOT EXISTS idx_bookings_status_hold 
ON bookings (status, hold_expires_at);

-- 9. INITIAL SEED DATA
INSERT INTO games (id, name, slug, description, active) VALUES
('snooker', 'Snooker & Billiards', 'snooker', 'Championship tournament tables', true),
('ps5', 'PlayStation 5 Console Arena', 'ps5', '4K HDR gaming stations & racing cockpit', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO booking_units (id, game_id, name, slug, description, image_url, base_price_per_hour, active) VALUES
('snooker-01', 'snooker', 'SNOOKER TABLE 01', 'snooker-table-01', 'Championship red cloth table with precision overhead drop lighting', 'assets/images/snooker-arena-3tables.jpg', 250, true),
('snooker-02', 'snooker', 'SNOOKER TABLE 02', 'snooker-table-02', 'Tournament-spec table with anti-glare cone lamps and weighted cues', 'assets/images/snooker-table-cues.jpg', 250, true),
('snooker-03', 'snooker', 'SNOOKER TABLE 03', 'snooker-table-03', 'Low-key isolated accent lighting designed for high-focus 1v1 match play', 'assets/images/snooker-solo-table.jpg', 250, true),
('ps5-01', 'ps5', 'PS5 COCKPIT STATION 01', 'ps5-cockpit-01', 'Logitech G-Series force-feedback racing wheel, pedals, and 4K HDR display', 'assets/images/ps5-racing-cockpit.jpg', 150, true),
('ps5-02', 'ps5', 'PS5 DUALSENSE ARENA 02', 'ps5-arena-02', 'EA FC 25, Mortal Kombat & top action titles with DualSense controllers', 'assets/images/ps5-eafc-station.jpg', 150, true),
('ps5-03', 'ps5', 'PS5 SQUAD LOUNGE 03', 'ps5-lounge-03', 'Plush red and black beanbag lounge setup engineered for squad sessions', 'assets/images/ps5-lounge-beanbags.jpg', 150, true)
ON CONFLICT (id) DO NOTHING;

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_billing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active games" ON games FOR SELECT USING (active = true);
CREATE POLICY "Public can view active booking units" ON booking_units FOR SELECT USING (active = true);
CREATE POLICY "Public can view own booking pass" ON bookings FOR SELECT USING (true);
