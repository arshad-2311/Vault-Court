-- ============================================================
-- VAULT 147 — SUPABASE CONCURRENCY & DYNAMIC INTERVAL FUNCTIONS
-- Migration 02: Interval Overlap Detection, Dynamic Duration & Holds
-- ============================================================

-- Function 1: Helper to convert Date + 12h Time string to Timestamptz (Asia/Kolkata)
CREATE OR REPLACE FUNCTION fn_parse_slot_timestamp(p_date DATE, p_time_str TEXT)
RETURNS TIMESTAMPTZ AS $$
DECLARE
    v_parts TEXT[];
    v_hour INT;
    v_minute INT;
    v_meridian TEXT;
    v_24hour INT;
    v_timestr TEXT;
BEGIN
    v_parts := regexp_matches(p_time_str, '^([0-9]{1,2}):([0-9]{2})\s*(AM|PM)$', 'i');
    IF v_parts IS NULL THEN
        RETURN (p_date::TEXT || ' 00:00:00+05:30')::TIMESTAMPTZ;
    END IF;

    v_hour := v_parts[1]::INT;
    v_minute := v_parts[2]::INT;
    v_meridian := upper(v_parts[3]);

    IF v_meridian = 'AM' THEN
        IF v_hour = 12 THEN v_24hour := 0;
        ELSE v_24hour := v_hour;
        END IF;
    ELSE
        IF v_hour = 12 THEN v_24hour := 12;
        ELSE v_24hour := v_hour + 12;
        END IF;
    END IF;

    v_timestr := p_date::TEXT || ' ' || lpad(v_24hour::TEXT, 2, '0') || ':' || lpad(v_minute::TEXT, 2, '0') || ':00+05:30';
    RETURN v_timestr::TIMESTAMPTZ;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function 2: Helper to format Timestamptz to 12h time string
CREATE OR REPLACE FUNCTION fn_format_slot_timestr(p_ts TIMESTAMPTZ)
RETURNS TEXT AS $$
DECLARE
    v_local_ts TIMESTAMP;
    v_hour INT;
    v_minute INT;
    v_meridian TEXT;
    v_12hour INT;
BEGIN
    v_local_ts := p_ts AT TIME ZONE 'Asia/Kolkata';
    v_hour := EXTRACT(HOUR FROM v_local_ts)::INT;
    v_minute := EXTRACT(MINUTE FROM v_local_ts)::INT;

    IF v_hour >= 12 THEN
        v_meridian := 'PM';
        IF v_hour = 12 THEN v_12hour := 12;
        ELSE v_12hour := v_hour - 12;
        END IF;
    ELSE
        v_meridian := 'AM';
        IF v_hour = 0 THEN v_12hour := 12;
        ELSE v_12hour := v_hour;
        END IF;
    END IF;

    RETURN lpad(v_12hour::TEXT, 2, '0') || ':' || lpad(v_minute::TEXT, 2, '0') || ' ' || v_meridian;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function 3: Cleanup Expired Holds
CREATE OR REPLACE FUNCTION fn_cleanup_expired_holds()
RETURNS INT AS $$
DECLARE
    v_count INT;
BEGIN
    UPDATE bookings
    SET status = 'EXPIRED',
        updated_at = NOW()
    WHERE status = 'PENDING_PAYMENT'
      AND hold_expires_at IS NOT NULL
      AND hold_expires_at < NOW();
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Function 4: Atomic Booking Hold Creation with Dynamic Duration & Interval Overlap Check
CREATE OR REPLACE FUNCTION fn_create_booking_hold(
    p_unit_id TEXT,
    p_date DATE,
    p_start_time TEXT,
    p_duration_hours INT,
    p_player_count INT,
    p_customer_name TEXT,
    p_customer_phone TEXT,
    p_customer_email TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL,
    p_source booking_source_enum DEFAULT 'ONLINE'
)
RETURNS TABLE (
    success BOOLEAN,
    booking_id TEXT,
    db_id UUID,
    hourly_rate INT,
    total_amount INT,
    currency TEXT,
    start_time TEXT,
    end_time TEXT,
    duration_hours INT,
    hold_expires_at TIMESTAMPTZ,
    error_message TEXT
) AS $$
DECLARE
    v_lock_key BIGINT;
    v_unit RECORD;
    v_start_ts TIMESTAMPTZ;
    v_end_ts TIMESTAMPTZ;
    v_closing_ts TIMESTAMPTZ;
    v_end_time TEXT;
    v_hourly_rate INT;
    v_total_amount INT;
    v_existing RECORD;
    v_new_booking_id TEXT;
    v_new_id UUID;
    v_expires_at TIMESTAMPTZ;
BEGIN
    -- 1. Validate Duration (1 to 4 Hours)
    IF p_duration_hours < 1 OR p_duration_hours > 4 THEN
        RETURN QUERY SELECT false, NULL::TEXT, NULL::UUID, 0, 0, 'INR', p_start_time, NULL::TEXT, p_duration_hours, NULL::TIMESTAMPTZ, 'INVALID_DURATION_RANGE';
        RETURN;
    END IF;

    -- 2. Parse Start & End Timestamps
    v_start_ts := fn_parse_slot_timestamp(p_date, p_start_time);
    v_end_ts := v_start_ts + (p_duration_hours || ' hours')::INTERVAL;
    v_end_time := fn_format_slot_timestr(v_end_ts);

    -- 3. Validate Operating Hours (10:00 AM to 12:00 AM Midnight)
    v_closing_ts := (p_date::TEXT || ' 24:00:00+05:30')::TIMESTAMPTZ;
    IF v_end_ts > v_closing_ts THEN
        RETURN QUERY SELECT false, NULL::TEXT, NULL::UUID, 0, 0, 'INR', p_start_time, v_end_time, p_duration_hours, NULL::TIMESTAMPTZ, 'EXCEEDS_CLOSING_TIME';
        RETURN;
    END IF;

    -- 4. Acquire Transaction-Scoped Advisory Lock on Unit + Date
    v_lock_key := ('x' || substr(md5(p_unit_id || '_' || p_date::TEXT), 1, 15))::BIT(64)::BIGINT;
    PERFORM pg_advisory_xact_lock(v_lock_key);

    -- 5. Cleanup expired holds
    PERFORM fn_cleanup_expired_holds();

    -- 6. Validate Unit exists and is active
    SELECT * INTO v_unit FROM booking_units WHERE id = p_unit_id AND active = true;
    IF v_unit IS NULL THEN
        RETURN QUERY SELECT false, NULL::TEXT, NULL::UUID, 0, 0, 'INR', p_start_time, v_end_time, p_duration_hours, NULL::TIMESTAMPTZ, 'INVALID_OR_INACTIVE_UNIT';
        RETURN;
    END IF;

    -- 7. Calculate Authoritative Server Price
    IF v_unit.game_id = 'ps5' THEN
        IF p_player_count = 1 THEN v_hourly_rate := 150;
        ELSIF p_player_count = 2 THEN v_hourly_rate := 300;
        ELSIF p_player_count = 3 THEN v_hourly_rate := 400;
        ELSE v_hourly_rate := 500;
        END IF;
    ELSE
        v_hourly_rate := 250; -- Snooker
    END IF;
    v_total_amount := v_hourly_rate * p_duration_hours;

    -- 8. Check Strict Interval Overlap Rule:
    -- existing.start_time < requested.end_time AND existing.end_time > requested.start_time
    SELECT id, booking_id, status, hold_expires_at INTO v_existing
    FROM bookings
    WHERE unit_id = p_unit_id
      AND booking_date = p_date
      AND (start_timestamp < v_end_ts AND end_timestamp > v_start_ts)
      AND (
          status = 'CONFIRMED'
          OR (status = 'PENDING_PAYMENT' AND (hold_expires_at IS NULL OR hold_expires_at > NOW()))
      )
    LIMIT 1;

    IF v_existing IS NOT NULL THEN
        RETURN QUERY SELECT false, NULL::TEXT, NULL::UUID, v_hourly_rate, v_total_amount, 'INR', p_start_time, v_end_time, p_duration_hours, NULL::TIMESTAMPTZ, 'SLOT_ALREADY_RESERVED';
        RETURN;
    END IF;

    -- 9. Insert Pending Hold Record
    v_new_booking_id := 'V147-' || lpad((floor(random() * 9000 + 1000))::TEXT, 4, '0');
    v_expires_at := NOW() + INTERVAL '10 minutes';

    INSERT INTO bookings (
        booking_id,
        customer_name,
        customer_phone,
        customer_email,
        unit_id,
        game_id,
        booking_date,
        start_time,
        end_time,
        duration_hours,
        start_timestamp,
        end_timestamp,
        player_count,
        hourly_rate,
        amount,
        currency,
        status,
        payment_status,
        booking_source,
        hold_expires_at,
        notes
    ) VALUES (
        v_new_booking_id,
        p_customer_name,
        p_customer_phone,
        p_customer_email,
        p_unit_id,
        v_unit.game_id,
        p_date,
        p_start_time,
        v_end_time,
        p_duration_hours,
        v_start_ts,
        v_end_ts,
        p_player_count,
        v_hourly_rate,
        v_total_amount,
        'INR',
        'PENDING_PAYMENT',
        'PENDING',
        p_source,
        v_expires_at,
        p_notes
    ) RETURNING id INTO v_new_id;

    RETURN QUERY SELECT true, v_new_booking_id, v_new_id, v_hourly_rate, v_total_amount, 'INR', p_start_time, v_end_time, p_duration_hours, v_expires_at, NULL::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Function 5: Confirm Booking & Record Payment
CREATE OR REPLACE FUNCTION fn_confirm_booking_payment(
    p_booking_id TEXT,
    p_razorpay_order_id TEXT,
    p_razorpay_payment_id TEXT,
    p_razorpay_signature TEXT,
    p_payment_method TEXT DEFAULT 'upi'
)
RETURNS TABLE (
    success BOOLEAN,
    booking_id TEXT,
    status booking_status_enum,
    payment_status payment_status_enum,
    error_message TEXT
) AS $$
DECLARE
    v_booking RECORD;
    v_billing_cycle TEXT;
BEGIN
    SELECT * INTO v_booking FROM bookings WHERE booking_id = p_booking_id FOR UPDATE;
    
    IF v_booking IS NULL THEN
        RETURN QUERY SELECT false, p_booking_id, NULL::booking_status_enum, NULL::payment_status_enum, 'BOOKING_NOT_FOUND';
        RETURN;
    END IF;

    IF v_booking.status = 'CONFIRMED' AND v_booking.razorpay_payment_id = p_razorpay_payment_id THEN
        RETURN QUERY SELECT true, p_booking_id, v_booking.status, v_booking.payment_status, NULL::TEXT;
        RETURN;
    END IF;

    UPDATE bookings
    SET status = 'CONFIRMED',
        payment_status = 'PAID',
        razorpay_order_id = p_razorpay_order_id,
        razorpay_payment_id = p_razorpay_payment_id,
        razorpay_signature = p_razorpay_signature,
        hold_expires_at = NULL,
        updated_at = NOW()
    WHERE id = v_booking.id;

    INSERT INTO payments (
        booking_id,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount,
        currency,
        status,
        method
    ) VALUES (
        v_booking.id,
        p_razorpay_order_id,
        p_razorpay_payment_id,
        p_razorpay_signature,
        v_booking.amount,
        v_booking.currency,
        'PAID',
        p_payment_method
    ) ON CONFLICT (razorpay_payment_id) DO NOTHING;

    IF v_booking.booking_source = 'ONLINE' THEN
        v_billing_cycle := to_char(NOW(), 'YYYY-MM');
        INSERT INTO platform_billing (
            booking_id,
            fee_amount,
            billing_cycle,
            status
        ) VALUES (
            v_booking.id,
            10,
            v_billing_cycle,
            'PENDING_INVOICE'
        ) ON CONFLICT (booking_id) DO NOTHING;
    END IF;

    RETURN QUERY SELECT true, p_booking_id, 'CONFIRMED'::booking_status_enum, 'PAID'::payment_status_enum, NULL::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Function 6: Query Unit Availability with Consecutive Duration Analysis
CREATE OR REPLACE FUNCTION fn_get_unit_availability(
    p_date DATE,
    p_unit_id TEXT
)
RETURNS TABLE (
    start_time TEXT,
    status TEXT,
    is_available BOOLEAN,
    max_consecutive_hours INT
) AS $$
DECLARE
    v_slots TEXT[] := ARRAY[
        '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM',
        '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
        '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM'
    ];
    v_slot TEXT;
    v_slot_status TEXT;
    v_start_ts TIMESTAMPTZ;
    v_1hr_end_ts TIMESTAMPTZ;
    v_closing_ts TIMESTAMPTZ;
    v_bkg RECORD;
    v_consecutive INT;
    v_test_ts TIMESTAMPTZ;
    v_test_end_ts TIMESTAMPTZ;
    v_h INT;
    v_overlap RECORD;
BEGIN
    PERFORM fn_cleanup_expired_holds();
    v_closing_ts := (p_date::TEXT || ' 24:00:00+05:30')::TIMESTAMPTZ;

    FOREACH v_slot IN ARRAY v_slots LOOP
        v_start_ts := fn_parse_slot_timestamp(p_date, v_slot);
        v_1hr_end_ts := v_start_ts + INTERVAL '1 hour';
        v_slot_status := 'AVAILABLE';

        SELECT * INTO v_bkg
        FROM bookings
        WHERE unit_id = p_unit_id
          AND booking_date = p_date
          AND (start_timestamp < v_1hr_end_ts AND end_timestamp > v_start_ts)
          AND (
              status = 'CONFIRMED'
              OR (status = 'PENDING_PAYMENT' AND (hold_expires_at IS NULL OR hold_expires_at > NOW()))
          )
        LIMIT 1;

        IF v_bkg IS NOT NULL THEN
            IF v_bkg.status = 'CONFIRMED' THEN
                v_slot_status := 'BOOKED';
            ELSIF v_bkg.status = 'PENDING_PAYMENT' THEN
                v_slot_status := 'HELD';
            END IF;
            v_consecutive := 0;
        ELSE
            -- Calculate maximum consecutive hours available (up to 4 hours or closing time)
            v_consecutive := 0;
            FOR v_h IN 1..4 LOOP
                v_test_ts := v_start_ts;
                v_test_end_ts := v_start_ts + (v_h || ' hours')::INTERVAL;

                IF v_test_end_ts <= v_closing_ts THEN
                    SELECT id INTO v_overlap
                    FROM bookings
                    WHERE unit_id = p_unit_id
                      AND booking_date = p_date
                      AND (start_timestamp < v_test_end_ts AND end_timestamp > v_test_ts)
                      AND (
                          status = 'CONFIRMED'
                          OR (status = 'PENDING_PAYMENT' AND (hold_expires_at IS NULL OR hold_expires_at > NOW()))
                      )
                    LIMIT 1;

                    IF v_overlap IS NULL THEN
                        v_consecutive := v_h;
                    ELSE
                        EXIT; -- Hit a block
                    END IF;
                ELSE
                    EXIT; -- Exceeded closing time
                END IF;
            END LOOP;
        END IF;

        RETURN QUERY SELECT 
            v_slot, 
            v_slot_status, 
            (v_slot_status = 'AVAILABLE'),
            v_consecutive;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
