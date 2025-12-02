-- Migration: Auto-create customers from bookings
-- This trigger will automatically create customer records when bookings are inserted

-- Function to auto-create or link customer when booking is created
CREATE OR REPLACE FUNCTION auto_create_customer_from_booking()
RETURNS TRIGGER AS $$
DECLARE
    v_customer_id UUID;
BEGIN
    -- Only process if booking has a phone number
    IF NEW.customer_phone IS NOT NULL AND NEW.customer_phone != '' THEN
        -- Try to find existing customer by phone
        SELECT id INTO v_customer_id
        FROM customers
        WHERE merchant_id = NEW.merchant_id
        AND phone = NEW.customer_phone
        LIMIT 1;

        -- If customer doesn't exist, create one
        IF v_customer_id IS NULL THEN
            INSERT INTO customers (
                merchant_id,
                email,
                name,
                phone,
                total_bookings,
                total_spent,
                last_booking_date
            ) VALUES (
                NEW.merchant_id,
                LOWER(NEW.customer_email),
                NEW.customer_name,
                NEW.customer_phone,
                0,  -- Will be updated by update_customer_stats trigger
                0,  -- Will be updated by update_customer_stats trigger
                NULL  -- Will be updated by update_customer_stats trigger
            )
            RETURNING id INTO v_customer_id;
        ELSE
            -- Update existing customer's email and name if changed
            UPDATE customers
            SET
                email = LOWER(NEW.customer_email),
                name = NEW.customer_name
            WHERE id = v_customer_id;
        END IF;

        -- Link the booking to the customer
        NEW.customer_id = v_customer_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger that runs BEFORE INSERT on bookings
DROP TRIGGER IF EXISTS auto_create_customer_trigger ON public.bookings;
CREATE TRIGGER auto_create_customer_trigger
    BEFORE INSERT ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION auto_create_customer_from_booking();

-- Now sync existing bookings that don't have customer_id
DO $$
DECLARE
    booking_rec RECORD;
    v_customer_id UUID;
BEGIN
    -- Loop through bookings without customer_id
    FOR booking_rec IN
        SELECT id, merchant_id, customer_email, customer_name, customer_phone
        FROM bookings
        WHERE customer_id IS NULL
        AND customer_phone IS NOT NULL
        AND customer_phone != ''
    LOOP
        -- Try to find existing customer
        SELECT id INTO v_customer_id
        FROM customers
        WHERE merchant_id = booking_rec.merchant_id
        AND phone = booking_rec.customer_phone
        LIMIT 1;

        -- If customer doesn't exist, create one
        IF v_customer_id IS NULL THEN
            INSERT INTO customers (
                merchant_id,
                email,
                name,
                phone
            ) VALUES (
                booking_rec.merchant_id,
                LOWER(booking_rec.customer_email),
                booking_rec.customer_name,
                booking_rec.customer_phone
            )
            RETURNING id INTO v_customer_id;
        END IF;

        -- Link booking to customer
        UPDATE bookings
        SET customer_id = v_customer_id
        WHERE id = booking_rec.id;
    END LOOP;
END $$;

-- Trigger the stats update for all customers
-- This will be done automatically by the existing update_customer_stats trigger
-- But we need to manually update stats for the customers we just created
UPDATE customers c
SET
    total_bookings = (
        SELECT COUNT(*)
        FROM bookings
        WHERE customer_id = c.id
    ),
    total_spent = (
        SELECT COALESCE(SUM(total_price), 0)
        FROM bookings
        WHERE customer_id = c.id
    ),
    last_booking_date = (
        SELECT MAX(created_at)
        FROM bookings
        WHERE customer_id = c.id
    )
WHERE id IN (
    SELECT DISTINCT customer_id
    FROM bookings
    WHERE customer_id IS NOT NULL
);
