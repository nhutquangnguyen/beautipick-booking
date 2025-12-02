-- Fix: Merchants RLS policy issue
-- Users can't access dashboard because the SELECT policy is broken

-- Drop all existing SELECT policies on merchants table
DROP POLICY IF EXISTS "Admins can view all merchants" ON public.merchants;
DROP POLICY IF EXISTS "Merchants can view own data" ON public.merchants;
DROP POLICY IF EXISTS "Users can view own merchant" ON public.merchants;
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON public.merchants;

-- Recreate the correct policy that allows:
-- 1. Admins to see all merchants
-- 2. Users to see their own merchant data
CREATE POLICY "Users can view own merchant and admins can view all"
    ON public.merchants
    FOR SELECT
    USING (
        -- Allow users to see their own merchant data
        id = auth.uid()
        -- OR allow if current user is an admin
        OR EXISTS (
            SELECT 1 FROM public.admins
            WHERE user_id = auth.uid()
        )
    );
