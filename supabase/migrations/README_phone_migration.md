# Phone-Based Customer Migration

## ⚠️ IMPORTANT WARNING ⚠️

**This migration will DELETE ALL existing bookings and customers data!**

Use the file: `20251203_clear_and_migrate_phone.sql`

## What This Migration Does

Customers are now unique by **phone number** instead of email address. This migration:

1. **CLEARS all bookings and customers data** (fresh start)
2. Changes the unique constraint from `(merchant_id, email)` to `(merchant_id, phone)`
3. Makes `phone` a required field (NOT NULL)
4. Updates all indexes and sync functions
5. Sets up automatic customer creation from future bookings

## How to Run This Migration

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `20251203_clear_and_migrate_phone.sql`
5. Click **Run** (or press Ctrl/Cmd + Enter)

### Option 2: Using Supabase CLI

```bash
# If you haven't linked your project yet
supabase link --project-ref YOUR_PROJECT_REF

# Run the migration
supabase db push
```

### Option 3: Using psql

```bash
psql $DATABASE_URL -f supabase/migrations/20251203_clear_and_migrate_phone.sql
```

## What Changes

### Before (Email-Based)
- Customers unique by: `merchant_id + email`
- Phone was optional
- Filtering by email

### After (Phone-Based)
- Customers unique by: `merchant_id + phone`
- Phone is required (NOT NULL)
- Filtering by phone number

## Impact on Existing Data

⚠️ **CRITICAL**: This migration will **DELETE ALL DATA**:

- ❌ All bookings will be deleted
- ❌ All customers will be deleted
- ✅ Fresh start with phone-based system
- ✅ Future bookings will automatically create customers by phone number

## After Migration

Once migrated:

1. **Customer Filtering**: Clicking on a customer's order count will filter by their phone number
2. **Creating Customers**: Phone number is now required when creating customers
3. **Customer Display**: Customer cards show phone as the primary identifier

## Verification

After running the migration, verify it worked:

```sql
-- Check if customers table has new constraint
SELECT conname, contype
FROM pg_constraint
WHERE conrelid = 'customers'::regclass
AND conname = 'customers_merchant_phone_unique';

-- Check if phone is NOT NULL
SELECT column_name, is_nullable
FROM information_schema.columns
WHERE table_name = 'customers'
AND column_name = 'phone';

-- View sample customers
SELECT id, name, phone, email, total_bookings
FROM customers
LIMIT 5;
```

## Need to Rollback?

If you need to revert this migration:

```sql
-- Drop phone constraint
ALTER TABLE public.customers
DROP CONSTRAINT IF EXISTS customers_merchant_phone_unique;

-- Make phone nullable again
ALTER TABLE public.customers
ALTER COLUMN phone DROP NOT NULL;

-- Add back email constraint
ALTER TABLE public.customers
ADD CONSTRAINT customers_merchant_email_unique UNIQUE (merchant_id, email);

-- Recreate email indexes
CREATE INDEX idx_customers_email ON public.customers(email);
CREATE INDEX idx_customers_merchant_email ON public.customers(merchant_id, email);
```
