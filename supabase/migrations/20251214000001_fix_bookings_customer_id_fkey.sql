-- Fix bookings.customer_id foreign key to point to customer_accounts instead of customers table
-- This allows linking bookings directly to customer accounts

-- Step 1: Drop the existing constraint
ALTER TABLE bookings
DROP CONSTRAINT IF EXISTS bookings_customer_id_fkey;

-- Step 2: Clean up invalid customer_id references
-- Set customer_id to NULL for any bookings that reference non-existent customer accounts
UPDATE bookings
SET customer_id = NULL
WHERE customer_id IS NOT NULL
  AND customer_id NOT IN (SELECT id FROM public.customer_accounts);

-- Step 3: Add the correct constraint pointing to customer_accounts
ALTER TABLE bookings
ADD CONSTRAINT bookings_customer_id_fkey
FOREIGN KEY (customer_id) REFERENCES public.customer_accounts(id)
ON DELETE SET NULL;

-- Step 4: Add comment explaining the constraint
COMMENT ON CONSTRAINT bookings_customer_id_fkey ON bookings IS
'SET NULL: When customer account is deleted, their bookings are preserved but customer_id is set to NULL';

-- Step 5: Report on the cleanup
DO $$
DECLARE
  unlinked_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO unlinked_count
  FROM bookings
  WHERE customer_id IS NULL;

  RAISE NOTICE '% bookings have no customer_id (either never linked or cleaned up)', unlinked_count;
END $$;
