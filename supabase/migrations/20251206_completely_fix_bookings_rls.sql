-- Complete fix for bookings RLS to allow public booking creation
-- This drops ALL existing policies and recreates them properly

-- First, check if RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'bookings';

-- Drop ALL existing policies on bookings table
DROP POLICY IF EXISTS "Merchants can insert own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Merchants can update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Merchants can delete own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Merchants can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public booking creation or by merchants" ON public.bookings;
DROP POLICY IF EXISTS "Allow booking updates by merchants" ON public.bookings;

-- Enable RLS on bookings table (if not already enabled)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- CREATE NEW POLICIES

-- 1. Allow anyone (including anonymous) to INSERT bookings
CREATE POLICY "Public can create bookings"
    ON public.bookings
    FOR INSERT
    TO public
    WITH CHECK (true);

-- 2. Allow merchants to SELECT their own bookings
CREATE POLICY "Merchants can view own bookings"
    ON public.bookings
    FOR SELECT
    TO authenticated
    USING (merchant_id = auth.uid());

-- 3. Allow merchants to UPDATE their own bookings
CREATE POLICY "Merchants can update own bookings"
    ON public.bookings
    FOR UPDATE
    TO authenticated
    USING (merchant_id = auth.uid())
    WITH CHECK (merchant_id = auth.uid());

-- 4. Allow merchants to DELETE their own bookings
CREATE POLICY "Merchants can delete own bookings"
    ON public.bookings
    FOR DELETE
    TO authenticated
    USING (merchant_id = auth.uid());
