-- Make email column nullable in customers table
ALTER TABLE customers ALTER COLUMN email DROP NOT NULL;

-- Make customer_email column nullable in bookings table
ALTER TABLE bookings ALTER COLUMN customer_email DROP NOT NULL;

-- Add comments to document these changes
COMMENT ON COLUMN customers.email IS 'Customer email address (optional)';
COMMENT ON COLUMN bookings.customer_email IS 'Customer email address (optional)';
