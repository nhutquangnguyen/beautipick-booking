# Admin System Setup Guide

## Overview

The admin system uses a **separate `admins` table** to manage super admin users. This provides clean separation between user roles and merchant/business data.

## Architecture

- **admins table**: Stores user IDs of admin users
- **RLS policies**: Ensures only admins can access admin features
- **Helper functions**: Provides easy admin status checking

## Setup Instructions

### 1. Run the Migration

**Go to Supabase Dashboard:**
1. Navigate to **SQL Editor**
2. Click **New Query**
3. Copy and paste the contents of `supabase/migrations/20251203_refactor_to_admins_table.sql`
4. Click **Run**

This migration will:
- ✅ Create the `admins` table
- ✅ Migrate any existing `is_admin=true` merchants to the admins table
- ✅ Remove the `is_admin` column from merchants
- ✅ Set up proper RLS policies
- ✅ Update the merchant stats view

### 2. Make Yourself an Admin

After running the migration, promote your user to admin:

```sql
-- Replace with your actual user ID (same as your merchant ID)
INSERT INTO admins (user_id)
VALUES ('your-user-id-here')
ON CONFLICT (user_id) DO NOTHING;
```

**How to find your user ID:**
```sql
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
```

Or:
```sql
SELECT id, email FROM merchants WHERE email = 'your-email@example.com';
```

### 3. Access the Admin Dashboard

1. Refresh your browser
2. You should see an "Admin" menu item in the sidebar (with shield icon 🛡️)
3. Click it to access `/admin`

## Admin Features

The admin dashboard (`/admin`) shows:

### Platform Overview
- Total merchants (active/inactive)
- Total orders across all merchants
- Total revenue
- Total customers
- Gallery image usage

### Merchant Management
For each merchant, you can see:
- 📦 Total bookings/orders
- 👥 Total customers
- ✂️ Total services
- 👨‍💼 Total staff members
- 🖼️ Gallery image count
- 💰 Total revenue
- 🌐 Custom domain (if configured)
- 📅 Account age

### Search & Filter
- Real-time search by business name, email, or slug
- Click on any merchant link to view their public page

## Managing Admins

### Add a New Admin
```sql
INSERT INTO admins (user_id, created_by, notes)
VALUES (
  'new-admin-user-id',
  auth.uid(),  -- Your admin ID will be recorded as creator
  'Added for platform management'
);
```

### Remove Admin Access
```sql
DELETE FROM admins
WHERE user_id = 'user-id-to-remove';
```

### List All Admins
```sql
SELECT
  a.user_id,
  m.email,
  m.business_name,
  a.created_at,
  a.notes
FROM admins a
JOIN merchants m ON m.id = a.user_id
ORDER BY a.created_at DESC;
```

## Security

### Access Control
- Only users in the `admins` table can access `/admin`
- Non-admin users are redirected to their dashboard
- Unauthenticated users are redirected to login

### RLS Policies
The system uses Row Level Security:
- Admins can view all merchants
- Admins can view all other admins
- Regular users can only see their own data

## Code Architecture

### Server-Side (Admin Page)
```typescript
import { isAdmin } from "@/lib/admin";

// Check if user is admin
const userIsAdmin = await isAdmin(user.id);
if (!userIsAdmin) {
  redirect("/dashboard");
}
```

### Client-Side (Sidebar)
```typescript
// Check admin status in useEffect
useEffect(() => {
  const checkAdmin = async () => {
    const { data } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", merchant.id)
      .single();
    setIsAdmin(!!data);
  };
  checkAdmin();
}, [merchant.id]);
```

### Helper Functions
Located in `/src/lib/admin.ts`:
- `isAdmin(userId?)` - Server-side admin check
- `isAdminClient(supabase, userId?)` - Client-side admin check

## Files Modified

1. `/supabase/migrations/20251203_refactor_to_admins_table.sql` - Migration
2. `/src/types/database.ts` - Added admins table types, removed is_admin from merchants
3. `/src/lib/admin.ts` - Admin helper functions
4. `/src/app/admin/page.tsx` - Admin dashboard page
5. `/src/components/admin/admin-dashboard.tsx` - Admin UI
6. `/src/components/dashboard/sidebar.tsx` - Added admin link with dynamic check

## Troubleshooting

### Admin Link Not Showing
1. Verify you're in the admins table:
   ```sql
   SELECT * FROM admins WHERE user_id = 'your-user-id';
   ```
2. Clear browser cache and hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
3. Check browser console for errors

### Can't Access /admin
1. Make sure you're logged in
2. Verify you're an admin (query above)
3. Check that RLS policies are enabled:
   ```sql
   SELECT tablename, policyname FROM pg_policies WHERE tablename = 'admins';
   ```

### Migration Already Applied
If you already ran `20251203_create_admin_system.sql`, the refactor migration will:
- Automatically migrate your admin status
- Clean up the old is_admin column
- No data loss will occur

## Best Practices

1. **Limit Admin Access**: Only give admin rights to trusted users
2. **Use Notes**: Add notes when creating admins for audit trail
3. **Record Creator**: The `created_by` field tracks who added each admin
4. **Regular Audits**: Periodically review admin list

## Future Enhancements

Potential features:
- [ ] Admin activity logs
- [ ] Email notifications when admins are added/removed
- [ ] Admin roles (super admin, support admin, etc.)
- [ ] Merchant suspension/activation from admin panel
- [ ] Export merchant data to CSV
- [ ] Platform-wide analytics and charts
