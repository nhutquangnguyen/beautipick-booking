-- Verification script for customer_accounts setup
-- Run this in Supabase SQL Editor to check if everything is configured correctly

-- 1. Check if customer_accounts table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'customer_accounts'
) AS customer_accounts_exists;

-- 2. Check RLS policies on customer_accounts
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'customer_accounts';

-- 3. Check grants on customer_accounts
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'customer_accounts';

-- 4. Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'customer_accounts';

-- 5. Test query as authenticated user (should work)
-- SELECT * FROM customer_accounts WHERE id = auth.uid();

-- If customer_accounts table doesn't exist, create it:
-- Run the migration file: supabase/migrations/20250110000000_create_customer_accounts.sql
