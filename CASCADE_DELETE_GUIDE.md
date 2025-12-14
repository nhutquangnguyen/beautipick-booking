# Cascade Delete Behavior Guide

This document explains what happens when users are deleted from the system.

## Overview

When a user is deleted from `auth.users`, the system automatically handles cleanup of related data based on the delete rules configured in the database.

## Delete Behavior by User Type

### When a MERCHANT is deleted:

**Automatically DELETED (CASCADE):**
- ✅ Merchant profile
- ✅ All services
- ✅ All products
- ✅ All staff members
- ✅ All availability records
- ✅ All bookings (both as merchant)
- ✅ Subscription records
- ✅ Usage statistics
- ✅ Gallery images
- ✅ Favorites pointing to this merchant
- ✅ User type record

**Preserved:**
- ❌ Nothing is preserved (complete cleanup)

### When a CUSTOMER is deleted:

**Automatically DELETED (CASCADE):**
- ✅ Customer account profile
- ✅ Favorites list
- ✅ User type record

**Preserved (SET NULL):**
- ⚠️ Bookings - preserved for merchant's records, but `customer_id` is set to NULL
  - Merchant can still see booking history
  - Customer name, phone, email remain in booking record

### When an ADMIN is deleted:

**Automatically DELETED (CASCADE):**
- ✅ Admin record
- ✅ User type record

## Migration File

The cascade delete rules are defined in:
```
supabase/migrations/20251213100000_add_cascade_delete_for_users.sql
```

## Running the Migration

### Option 1: Via Supabase Dashboard (Recommended)
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Paste the contents of the migration file
4. Click "Run"

### Option 2: Via Supabase CLI
```bash
npx supabase db push
```

## Testing the Cascade Behavior

⚠️ **WARNING: Test in development environment first!**

### Test Merchant Delete:
```sql
-- Check current data
SELECT id, email FROM auth.users WHERE email = 'test-merchant@example.com';

-- This will delete the user AND all related merchant data
DELETE FROM auth.users WHERE email = 'test-merchant@example.com';

-- Verify cleanup
SELECT * FROM merchants WHERE id = '<user-id>';  -- Should return nothing
SELECT * FROM services WHERE merchant_id = '<user-id>';  -- Should return nothing
SELECT * FROM bookings WHERE merchant_id = '<user-id>';  -- Should return nothing
```

### Test Customer Delete:
```sql
-- Check current data
SELECT id, email FROM auth.users WHERE email = 'test-customer@example.com';

-- This will delete the user AND customer account, but preserve bookings
DELETE FROM auth.users WHERE email = 'test-customer@example.com';

-- Verify cleanup
SELECT * FROM customer_accounts WHERE id = '<user-id>';  -- Should return nothing
SELECT * FROM favorites WHERE customer_id = '<user-id>';  -- Should return nothing

-- Verify bookings are preserved
SELECT * FROM bookings WHERE customer_id IS NULL;  -- Should show orphaned bookings
```

## Important Notes

### 1. Booking History Preservation
We use `ON DELETE SET NULL` for `bookings.customer_id` because:
- Merchants need to keep booking history for accounting/records
- Customer info (name, phone, email) is denormalized in the booking record
- This allows merchants to see past bookings even if customer deletes their account

### 2. Data Retention Policy
If you need to implement a different retention policy:
- Change `ON DELETE CASCADE` to `ON DELETE SET NULL` to preserve records
- Change `ON DELETE SET NULL` to `ON DELETE CASCADE` for complete cleanup
- Add `ON DELETE RESTRICT` to prevent deletion if related records exist

### 3. Storage Cleanup
The migration only handles database records. For complete cleanup:
- Storage files (images, etc.) in Supabase Storage buckets
- Consider using Supabase Storage policies or Edge Functions for cleanup

## Example: Adding Custom Cleanup Logic

If you need custom cleanup logic (e.g., for storage), create a database trigger:

```sql
-- Example: Delete merchant's storage files when merchant is deleted
CREATE OR REPLACE FUNCTION cleanup_merchant_storage()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete from storage bucket
  PERFORM storage.delete_object('merchant-images', OLD.id || '/*');
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER merchant_delete_cleanup
BEFORE DELETE ON merchants
FOR EACH ROW
EXECUTE FUNCTION cleanup_merchant_storage();
```

## Rollback

If you need to revert the cascade behavior:

```sql
-- Remove CASCADE and use RESTRICT instead
ALTER TABLE merchants
DROP CONSTRAINT merchants_id_fkey;

ALTER TABLE merchants
ADD CONSTRAINT merchants_id_fkey
FOREIGN KEY (id) REFERENCES auth.users(id)
ON DELETE RESTRICT;
```

## Support

For questions or issues with cascade deletes:
1. Check Supabase logs in Dashboard → Logs
2. Test in development environment first
3. Review the migration file for specific table behavior
