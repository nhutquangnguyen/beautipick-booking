-- Fix RLS policy for bookings table to allow public booking creation via API
-- This allows anonymous users (customers) to create bookings

-- Drop existing restrictive INSERT policy for bookings
DROP POLICY IF EXISTS "Merchants can insert own bookings" ON public.bookings;

-- Create new policy that allows INSERT from anonymous users (public booking form)
-- OR when the user is authenticated and merchant_id matches auth.uid()
CREATE POLICY "Allow public booking creation or by merchants"
    ON public.bookings
    FOR INSERT
    WITH CHECK (
        -- Allow anonymous users to create bookings (for public booking form)
        auth.uid() IS NULL
        OR
        -- Allow merchants to create their own bookings
        merchant_id = auth.uid()
    );

-- Also update the UPDATE policy to allow anonymous updates if needed
DROP POLICY IF EXISTS "Merchants can update own bookings" ON public.bookings;

CREATE POLICY "Allow booking updates by merchants"
    ON public.bookings
    FOR UPDATE
    USING (
        -- Only allow merchants to update their own bookings
        merchant_id = auth.uid()
    )
    WITH CHECK (
        merchant_id = auth.uid()
    );
