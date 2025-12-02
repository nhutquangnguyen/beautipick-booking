-- Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    notes TEXT,
    tags TEXT[],
    total_bookings INTEGER DEFAULT 0 NOT NULL,
    total_spent NUMERIC(10, 2) DEFAULT 0 NOT NULL,
    last_booking_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true NOT NULL,
    CONSTRAINT customers_merchant_email_unique UNIQUE (merchant_id, email)
);

-- Add customer_id to bookings table
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_customers_merchant_id ON public.customers(merchant_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_merchant_email ON public.customers(merchant_id, email);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_customers_updated_at ON public.customers;
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Merchants can only see their own customers
CREATE POLICY "Merchants can view own customers"
    ON public.customers
    FOR SELECT
    USING (merchant_id = auth.uid());

-- Merchants can insert their own customers
CREATE POLICY "Merchants can insert own customers"
    ON public.customers
    FOR INSERT
    WITH CHECK (merchant_id = auth.uid());

-- Merchants can update their own customers
CREATE POLICY "Merchants can update own customers"
    ON public.customers
    FOR UPDATE
    USING (merchant_id = auth.uid())
    WITH CHECK (merchant_id = auth.uid());

-- Merchants can delete their own customers
CREATE POLICY "Merchants can delete own customers"
    ON public.customers
    FOR DELETE
    USING (merchant_id = auth.uid());

-- Function to sync customer data from bookings (for initial migration)
CREATE OR REPLACE FUNCTION sync_customers_from_bookings()
RETURNS void AS $$
DECLARE
    booking_record RECORD;
    customer_record RECORD;
BEGIN
    -- Loop through all bookings
    FOR booking_record IN
        SELECT DISTINCT ON (merchant_id, LOWER(customer_email))
            merchant_id,
            customer_email,
            customer_name,
            customer_phone,
            created_at
        FROM bookings
        ORDER BY merchant_id, LOWER(customer_email), created_at DESC
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
        ON CONFLICT (merchant_id, email)
        DO UPDATE SET
            name = EXCLUDED.name,
            phone = EXCLUDED.phone;
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
            LOWER(customer_email) as email,
            COUNT(*) as booking_count,
            SUM(total_price) as total_amount,
            MAX(created_at) as last_booking
        FROM bookings
        GROUP BY merchant_id, LOWER(customer_email)
    ) b
    WHERE c.merchant_id = b.merchant_id
    AND c.email = b.email;

    -- Link bookings to customers
    UPDATE bookings b
    SET customer_id = c.id
    FROM customers c
    WHERE b.merchant_id = c.merchant_id
    AND LOWER(b.customer_email) = c.email
    AND b.customer_id IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update customer stats after booking changes
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update customer stats based on their bookings
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE customers
        SET
            total_bookings = (
                SELECT COUNT(*)
                FROM bookings
                WHERE customer_id = NEW.customer_id
            ),
            total_spent = (
                SELECT COALESCE(SUM(total_price), 0)
                FROM bookings
                WHERE customer_id = NEW.customer_id
            ),
            last_booking_date = (
                SELECT MAX(created_at)
                FROM bookings
                WHERE customer_id = NEW.customer_id
            )
        WHERE id = NEW.customer_id;
    END IF;

    IF TG_OP = 'DELETE' THEN
        UPDATE customers
        SET
            total_bookings = (
                SELECT COUNT(*)
                FROM bookings
                WHERE customer_id = OLD.customer_id
            ),
            total_spent = (
                SELECT COALESCE(SUM(total_price), 0)
                FROM bookings
                WHERE customer_id = OLD.customer_id
            ),
            last_booking_date = (
                SELECT MAX(created_at)
                FROM bookings
                WHERE customer_id = OLD.customer_id
            )
        WHERE id = OLD.customer_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to update customer stats when bookings change
DROP TRIGGER IF EXISTS update_customer_stats_trigger ON public.bookings;
CREATE TRIGGER update_customer_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_stats();

-- Run the initial sync
SELECT sync_customers_from_bookings();
