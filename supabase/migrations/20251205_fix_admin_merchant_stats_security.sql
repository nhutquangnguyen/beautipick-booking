-- Migration: Fix admin_merchant_stats view security
-- Change from SECURITY DEFINER to SECURITY INVOKER
-- This ensures the view uses the permissions of the querying user, not the view creator

-- Drop the existing view
DROP VIEW IF EXISTS admin_merchant_stats;

-- Recreate the view with SECURITY INVOKER
CREATE OR REPLACE VIEW admin_merchant_stats
WITH (security_invoker = true)
AS
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

-- Grant access to authenticated users
GRANT SELECT ON admin_merchant_stats TO authenticated;

-- Add comment explaining the security model
COMMENT ON VIEW admin_merchant_stats IS
'Merchant statistics view with SECURITY INVOKER.
Access is controlled by RLS policies on the underlying merchants table.
Only admins (in admins table) and merchant owners can see their data.';
