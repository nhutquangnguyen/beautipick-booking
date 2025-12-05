-- Fix RLS policy for customers table to allow auto-creation from booking triggers
-- This allows the auto_create_customer_from_booking trigger to work properly

-- Drop existing restrictive INSERT policy
DROP POLICY IF EXISTS "Merchants can insert own customers" ON public.customers;

-- Create new policy that allows INSERT from triggers (when auth.uid() is NULL)
-- OR when the user is authenticated and merchant_id matches auth.uid()
CREATE POLICY "Allow customer creation from bookings or by merchants"
    ON public.customers
    FOR INSERT
    WITH CHECK (
        -- Allow triggers (no auth context) to create customers
        auth.uid() IS NULL
        OR
        -- Allow merchants to create their own customers
        merchant_id = auth.uid()
    );

-- Also need to allow triggers to UPDATE customers (for syncing customer data)
DROP POLICY IF EXISTS "Merchants can update own customers" ON public.customers;

CREATE POLICY "Allow customer updates from bookings or by merchants"
    ON public.customers
    FOR UPDATE
    USING (
        -- Allow triggers (no auth context) to update customers
        auth.uid() IS NULL
        OR
        -- Allow merchants to update their own customers
        merchant_id = auth.uid()
    )
    WITH CHECK (
        -- Ensure merchant_id doesn't change or matches auth.uid()
        auth.uid() IS NULL
        OR
        merchant_id = auth.uid()
    );
