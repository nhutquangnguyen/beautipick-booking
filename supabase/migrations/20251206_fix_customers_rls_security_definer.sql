-- Alternative fix: Make the trigger function run with elevated privileges
-- This allows it to bypass RLS policies

-- Drop and recreate the auto_create_customer_from_booking function with SECURITY DEFINER
CREATE OR REPLACE FUNCTION auto_create_customer_from_booking()
RETURNS TRIGGER
SECURITY DEFINER -- This makes the function run with the privileges of the function owner
SET search_path = public
AS $$
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

-- Recreate the trigger (just to be safe)
DROP TRIGGER IF EXISTS auto_create_customer_trigger ON public.bookings;
CREATE TRIGGER auto_create_customer_trigger
    BEFORE INSERT ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION auto_create_customer_from_booking();
