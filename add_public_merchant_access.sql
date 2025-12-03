-- Add RLS policy to allow public read access to active merchant pages
-- This allows anyone to view merchant booking pages without authentication

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow public read access to active merchant pages" ON merchants;

-- Create policy to allow reading active merchants for booking pages
-- This allows unauthenticated users to view merchant booking pages
CREATE POLICY "Allow public read access to active merchant pages"
ON merchants
FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Also allow public read access to related tables needed for booking pages

-- Services table
DROP POLICY IF EXISTS "Allow public read access to active services" ON services;
CREATE POLICY "Allow public read access to active services"
ON services
FOR SELECT
TO anon, authenticated
USING (
  is_active = true
  AND EXISTS (
    SELECT 1 FROM merchants
    WHERE merchants.id = services.merchant_id
    AND merchants.is_active = true
  )
);

-- Staff table
DROP POLICY IF EXISTS "Allow public read access to active staff" ON staff;
CREATE POLICY "Allow public read access to active staff"
ON staff
FOR SELECT
TO anon, authenticated
USING (
  is_active = true
  AND EXISTS (
    SELECT 1 FROM merchants
    WHERE merchants.id = staff.merchant_id
    AND merchants.is_active = true
  )
);

-- Availability table
DROP POLICY IF EXISTS "Allow public read access to availability" ON availability;
CREATE POLICY "Allow public read access to availability"
ON availability
FOR SELECT
TO anon, authenticated
USING (
  is_available = true
  AND EXISTS (
    SELECT 1 FROM merchants
    WHERE merchants.id = availability.merchant_id
    AND merchants.is_active = true
  )
);

-- Gallery table
DROP POLICY IF EXISTS "Allow public read access to gallery" ON gallery;
CREATE POLICY "Allow public read access to gallery"
ON gallery
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM merchants
    WHERE merchants.id = gallery.merchant_id
    AND merchants.is_active = true
  )
);

-- Products table
DROP POLICY IF EXISTS "Allow public read access to active products" ON products;
CREATE POLICY "Allow public read access to active products"
ON products
FOR SELECT
TO anon, authenticated
USING (
  is_active = true
  AND EXISTS (
    SELECT 1 FROM merchants
    WHERE merchants.id = products.merchant_id
    AND merchants.is_active = true
  )
);

-- Staff services junction table
DROP POLICY IF EXISTS "Allow public read access to staff_services" ON staff_services;
CREATE POLICY "Allow public read access to staff_services"
ON staff_services
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM staff
    JOIN merchants ON merchants.id = staff.merchant_id
    WHERE staff.id = staff_services.staff_id
    AND staff.is_active = true
    AND merchants.is_active = true
  )
);
