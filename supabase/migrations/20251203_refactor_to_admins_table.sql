-- Migration: Refactor from merchant.is_admin to separate admins table
-- This provides cleaner separation between user roles and merchant data

-- Step 1: Create admins table
CREATE TABLE IF NOT EXISTS public.admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    notes TEXT
);

-- Step 2: Migrate existing is_admin=true merchants to admins table
INSERT INTO public.admins (user_id, created_at)
SELECT id, created_at
FROM public.merchants
WHERE is_admin = true
ON CONFLICT (user_id) DO NOTHING;

-- Step 3: Drop the view that depends on is_admin column (MUST BE BEFORE dropping column)
DROP VIEW IF EXISTS admin_merchant_stats;

-- Step 4: Drop the old RLS policy
DROP POLICY IF EXISTS "Admins can view all merchant stats" ON public.merchants;

-- Step 5: Drop the old index
DROP INDEX IF EXISTS idx_merchants_is_admin;

-- Step 6: Remove is_admin column from merchants
ALTER TABLE public.merchants
DROP COLUMN IF EXISTS is_admin;

-- Step 7: Create indexes for admins table
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON public.admins(user_id);

-- Step 8: Enable RLS on admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Step 9: Create RLS policies for admins table
-- Admins can view all admins
CREATE POLICY "Admins can view all admins"
    ON public.admins
    FOR SELECT
    USING (
        -- Allow if current user is an admin
        EXISTS (
            SELECT 1 FROM public.admins
            WHERE user_id = auth.uid()
        )
    );

-- Admins can insert new admins
CREATE POLICY "Admins can create admins"
    ON public.admins
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admins
            WHERE user_id = auth.uid()
        )
    );

-- Admins can delete other admins
CREATE POLICY "Admins can delete admins"
    ON public.admins
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.admins
            WHERE user_id = auth.uid()
        )
    );

-- Step 10: Recreate the merchant stats view WITHOUT is_admin column
CREATE OR REPLACE VIEW admin_merchant_stats AS
SELECT
    m.id,
    m.email,
    m.business_name,
    m.slug,
    m.phone,
    m.created_at,
    m.is_active,
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

-- Step 11: Create new RLS policy for merchants that checks admins table
CREATE POLICY "Admins can view all merchants"
    ON public.merchants
    FOR SELECT
    USING (
        -- Allow if current user is an admin (from admins table)
        EXISTS (
            SELECT 1 FROM public.admins
            WHERE user_id = auth.uid()
        )
        -- Or allow users to see their own merchant data
        OR id = auth.uid()
    );

-- Note: To make a user an admin, run:
-- INSERT INTO admins (user_id) VALUES ('user-uuid-here');
--
-- To check if current user is admin:
-- SELECT EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid());
