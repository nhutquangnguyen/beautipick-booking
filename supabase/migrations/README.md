# Database Migrations

## Customers Table Migration

This migration creates a dedicated `customers` table to store customer information separately from bookings.

### What This Migration Does:

1. **Creates `customers` table** with:
   - Basic info: email, name, phone
   - Metadata: notes, tags
   - Calculated fields: total_bookings, total_spent, last_booking_date
   - Timestamp fields: created_at, updated_at

2. **Adds `customer_id` field** to bookings table for linking

3. **Creates indexes** for better query performance

4. **Sets up Row Level Security (RLS)** policies

5. **Creates automated triggers** to:
   - Auto-update `updated_at` timestamp
   - Update customer stats when bookings change

6. **Migrates existing data** from bookings to customers table

7. **Links bookings** to their corresponding customers

### How to Run the Migration:

#### Option 1: Using Supabase CLI (Recommended)

```bash
# If you haven't installed Supabase CLI yet
npm install -g supabase

# Link to your Supabase project (first time only)
supabase link --project-ref YOUR_PROJECT_REF

# Run the migration
supabase db push
```

#### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `20251202_create_customers_table.sql`
5. Click **Run** (or press Ctrl/Cmd + Enter)

#### Option 3: Using psql

```bash
psql $DATABASE_URL -f supabase/migrations/20251202_create_customers_table.sql
```

### Verification:

After running the migration, verify it worked:

```sql
-- Check if customers table exists
SELECT COUNT(*) FROM customers;

-- Check if bookings are linked to customers
SELECT COUNT(*) FROM bookings WHERE customer_id IS NOT NULL;

-- View a sample customer
SELECT * FROM customers LIMIT 1;
```

### What Happens to Existing Data:

- All unique customers from the `bookings` table will be automatically extracted and created in the `customers` table
- The migration groups bookings by email (case-insensitive) to identify unique customers
- Customer stats (total bookings, total spent, last booking date) are calculated from existing bookings
- All bookings will be automatically linked to their corresponding customer records

### Rollback (if needed):

If you need to rollback this migration:

```sql
-- Drop the customers table
DROP TABLE IF EXISTS public.customers CASCADE;

-- Remove customer_id from bookings
ALTER TABLE public.bookings DROP COLUMN IF EXISTS customer_id;

-- Remove the functions
DROP FUNCTION IF EXISTS sync_customers_from_bookings();
DROP FUNCTION IF EXISTS update_customer_stats();
DROP FUNCTION IF EXISTS update_updated_at_column();
```

### Future Booking Flow:

After this migration, when new bookings are created, you should:

1. Check if a customer with that email exists
2. If not, create a new customer record
3. Link the booking to the customer via `customer_id`
4. The triggers will automatically update customer stats

Example code:

```typescript
// Create or get customer
const { data: existingCustomer } = await supabase
  .from('customers')
  .select('id')
  .eq('merchant_id', merchantId)
  .eq('email', email.toLowerCase())
  .single();

let customerId = existingCustomer?.id;

if (!customerId) {
  const { data: newCustomer } = await supabase
    .from('customers')
    .insert({
      merchant_id: merchantId,
      email: email.toLowerCase(),
      name: customerName,
      phone: customerPhone,
    })
    .select('id')
    .single();

  customerId = newCustomer?.id;
}

// Create booking with customer_id
await supabase.from('bookings').insert({
  merchant_id: merchantId,
  customer_id: customerId,
  customer_name: customerName,
  customer_email: email,
  customer_phone: customerPhone,
  // ... other booking fields
});
```

### Benefits:

- **Better Performance**: No need to aggregate data from bookings
- **Richer Data**: Store customer notes, tags, and preferences
- **Future-Ready**: Easy to add more customer features (birthday, loyalty points, etc.)
- **Cleaner Code**: Direct queries instead of aggregation logic
- **Automatic Updates**: Customer stats update automatically via triggers
