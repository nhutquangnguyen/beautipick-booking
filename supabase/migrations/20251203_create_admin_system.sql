-- Migration: Create admin system for super admins
-- Adds ability to mark merchants as super admins

-- Step 1: Add is_admin column to merchants table
ALTER TABLE public.merchants
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false NOT NULL;

-- Step 2: Create index for admin queries
CREATE INDEX IF NOT EXISTS idx_merchants_is_admin ON public.merchants(is_admin) WHERE is_admin = true;

-- Step 3: Create a view for merchant statistics (for admin dashboard)
CREATE OR REPLACE VIEW admin_merchant_stats AS
SELECT
    m.id,
    m.email,
    m.business_name,
    m.slug,
    m.phone,
    m.created_at,
    m.is_active,
    m.is_admin,
    -- Count bookings
    (SELECT COUNT(*) FROM bookings WHERE merchant_id = m.id) as total_bookings,
    -- Count customers
    (SELECT COUNT(*) FROM customers WHERE merchant_id = m.id) as total_customers,
    -- Count services
    (SELECT COUNT(*) FROM services WHERE merchant_id = m.id) as total_services,
    -- Count staff
    (SELECT COUNT(*) FROM staff WHERE merchant_id = m.id) as total_staff,
    -- Count gallery images (from settings JSON)
    (
        SELECT COUNT(*)
        FROM jsonb_array_elements(
            COALESCE(m.settings->'gallery', '[]'::jsonb)
        )
    ) as total_gallery_images,
    -- Calculate total revenue
    (SELECT COALESCE(SUM(total_price), 0) FROM bookings WHERE merchant_id = m.id) as total_revenue,
    -- Last booking date
    (SELECT MAX(created_at) FROM bookings WHERE merchant_id = m.id) as last_booking_date
FROM merchants m
ORDER BY m.created_at DESC;

-- Step 4: Create RLS policy for admin view
-- Only admins can view merchant statistics
CREATE POLICY "Admins can view all merchant stats"
    ON merchants
    FOR SELECT
    USING (
        -- Allow if current user is an admin
        EXISTS (
            SELECT 1 FROM merchants
            WHERE id = auth.uid()
            AND is_admin = true
        )
        -- Or allow users to see their own data
        OR id = auth.uid()
    );

-- Note: To make a user an admin, run:
-- UPDATE merchants SET is_admin = true WHERE email = 'admin@example.com';
