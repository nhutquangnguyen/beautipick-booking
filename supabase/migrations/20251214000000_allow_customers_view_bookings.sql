-- Allow customers to view their own bookings
-- This policy allows authenticated customers to see bookings where customer_id matches their user ID

CREATE POLICY "Customers can view own bookings"
    ON public.bookings
    FOR SELECT
    TO authenticated
    USING (customer_id = auth.uid());

-- Grant SELECT permission to authenticated users (customers)
GRANT SELECT ON public.bookings TO authenticated;
