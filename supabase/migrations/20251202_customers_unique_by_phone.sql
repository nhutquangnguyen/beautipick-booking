-- Migration: Change customers unique constraint from email to phone
-- Customers should be unique by merchant_id + phone, not email

-- Step 1: Drop the old unique constraint
ALTER TABLE public.customers
DROP CONSTRAINT IF EXISTS customers_merchant_email_unique;

-- Step 2: Make phone NOT NULL since it's now the primary identifier
ALTER TABLE public.customers
ALTER COLUMN phone SET NOT NULL;

-- Step 3: Add new unique constraint on merchant_id + phone
ALTER TABLE public.customers
ADD CONSTRAINT customers_merchant_phone_unique UNIQUE (merchant_id, phone);

-- Step 4: Drop old indexes related to email uniqueness
DROP INDEX IF EXISTS idx_customers_email;
DROP INDEX IF EXISTS idx_customers_merchant_email;

-- Step 5: Create new indexes for phone
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_merchant_phone ON public.customers(merchant_id, phone);

-- Step 6: Update the sync function to use phone instead of email
CREATE OR REPLACE FUNCTION sync_customers_from_bookings()
RETURNS void AS $$
DECLARE
    booking_record RECORD;
    customer_record RECORD;
BEGIN
    -- Loop through all bookings grouped by phone
    FOR booking_record IN
        SELECT DISTINCT ON (merchant_id, customer_phone)
            merchant_id,
            customer_email,
            customer_name,
            customer_phone,
            created_at
        FROM bookings
        WHERE customer_phone IS NOT NULL AND customer_phone != ''
        ORDER BY merchant_id, customer_phone, created_at DESC
    LOOP
        -- Insert or update customer
        INSERT INTO customers (
            merchant_id,
            email,
            name,
            phone,
            created_at
        ) VALUES (
            booking_record.merchant_id,
            LOWER(booking_record.customer_email),
            booking_record.customer_name,
            booking_record.customer_phone,
            booking_record.created_at
        )
        ON CONFLICT (merchant_id, phone)
        DO UPDATE SET
            name = EXCLUDED.name,
            email = EXCLUDED.email;
    END LOOP;

    -- Update customer stats (total bookings, total spent, last booking date)
    UPDATE customers c
    SET
        total_bookings = COALESCE(b.booking_count, 0),
        total_spent = COALESCE(b.total_amount, 0),
        last_booking_date = b.last_booking
    FROM (
        SELECT
            merchant_id,
            customer_phone as phone,
            COUNT(*) as booking_count,
            SUM(total_price) as total_amount,
            MAX(created_at) as last_booking
        FROM bookings
        WHERE customer_phone IS NOT NULL AND customer_phone != ''
        GROUP BY merchant_id, customer_phone
    ) b
    WHERE c.merchant_id = b.merchant_id
    AND c.phone = b.phone;

    -- Link bookings to customers by phone
    UPDATE bookings b
    SET customer_id = c.id
    FROM customers c
    WHERE b.merchant_id = c.merchant_id
    AND b.customer_phone = c.phone
    AND b.customer_id IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Re-sync all customers with the new phone-based logic
-- First, clear existing customers to avoid conflicts
TRUNCATE TABLE public.customers CASCADE;

-- Then re-sync
SELECT sync_customers_from_bookings();
