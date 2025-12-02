# Auto-Create Customers from Bookings

## Problem

When a booking is created, it wasn't automatically creating a customer record. This caused bookings to exist without corresponding customers in the customers table.

## Solution

This migration (`20251203_auto_create_customers.sql`) creates a trigger that automatically:

1. **Creates customers** when bookings are inserted (if they don't exist)
2. **Links bookings** to customers by phone number
3. **Updates existing bookings** to link them to customers
4. **Updates customer stats** (total bookings, total spent, last booking date)

## How to Run

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project → **SQL Editor**
2. Click **New Query**
3. Copy and paste the contents of `20251203_auto_create_customers.sql`
4. Click **Run**

### Option 2: Using Supabase CLI

```bash
supabase db push
```

## What This Migration Does

### 1. Creates Trigger Function
- `auto_create_customer_from_booking()` - Runs before each booking insert
- Checks if customer exists by phone number
- Creates customer if doesn't exist
- Links booking to customer

### 2. Syncs Existing Bookings
- Finds all bookings without `customer_id`
- Creates customers for them
- Updates all customer stats

### 3. Future Bookings
From now on, when a booking is created:
- Customer is automatically created (if needed)
- Booking is linked to customer
- Customer stats are automatically updated

## Verification

After running this migration:

```sql
-- Check that all bookings have customers
SELECT COUNT(*) as bookings_without_customer
FROM bookings
WHERE customer_id IS NULL
AND customer_phone IS NOT NULL;
-- Should return 0

-- Check customer was created
SELECT * FROM customers
WHERE phone = '0344270427';

-- Check booking is linked
SELECT b.id, b.customer_name, b.customer_phone, c.name, c.phone
FROM bookings b
LEFT JOIN customers c ON b.customer_id = c.id
WHERE b.customer_phone = '0344270427';
```

## How It Works

**Before:**
```
1. Create booking with phone number
2. Booking exists but no customer
3. Manually need to sync customers
```

**After:**
```
1. Create booking with phone number
   → Trigger automatically creates customer
   → Trigger links booking to customer
   → Trigger updates customer stats
2. Done! Customer exists and linked
```

## Benefits

- ✅ No manual syncing needed
- ✅ Customers automatically created from bookings
- ✅ Customer stats always up to date
- ✅ Bookings always linked to customers
- ✅ Works retroactively for existing bookings
