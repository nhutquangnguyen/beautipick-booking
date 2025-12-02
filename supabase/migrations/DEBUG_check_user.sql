-- Debug: Check what's really happening

-- 1. Check if auth.uid() is working
SELECT
    auth.uid() as my_user_id,
    auth.email() as my_email;

-- 2. Check if there are ANY merchants at all (bypassing RLS)
SELECT COUNT(*) as total_merchants FROM merchants;

-- 3. Check if YOUR merchant exists (bypassing RLS)
-- Run this to see all merchants and find yours
SELECT
    id,
    email,
    business_name,
    created_at
FROM merchants
ORDER BY created_at DESC
LIMIT 10;

-- 4. Check admins table
SELECT
    user_id,
    created_at,
    (SELECT email FROM auth.users WHERE id = user_id) as email
FROM admins;
