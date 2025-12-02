# Admin System for Super Admins

## Overview

The admin system allows designated users to manage all registered merchants from a centralized dashboard. Super admins can view:

- Total merchants and activity status
- Order statistics for each merchant
- Customer counts
- Revenue tracking
- Gallery image counts
- Service and staff statistics
- Custom domain usage

## Setup

### 1. Run the Migration

Apply the admin system migration to add the `is_admin` flag and create the necessary views:

**Using Supabase Dashboard:**
1. Go to **SQL Editor**
2. Copy contents of `supabase/migrations/20251203_create_admin_system.sql`
3. Click **Run**

**Using Supabase CLI:**
```bash
supabase db push
```

### 2. Create an Admin User

After running the migration, promote a user to admin status:

```sql
-- Replace with your admin email
UPDATE merchants
SET is_admin = true
WHERE email = 'admin@example.com';
```

## Features

### Admin Dashboard (`/admin`)

The admin dashboard displays:

#### Summary Statistics
- **Total Merchants**: Number of registered businesses
- **Active Merchants**: Currently active accounts
- **Total Orders**: Aggregate orders across all merchants
- **Total Revenue**: Combined revenue from all merchants
- **Total Customers**: All customers across platform
- **Total Gallery Images**: Platform-wide image count

#### Merchant Table
Each merchant row shows:
- **Business name** and slug
- **Custom domain** (if configured)
- **Contact info** (email, phone)
- **Statistics badges**:
  - 📦 Total bookings/orders
  - 👥 Total customers
  - ✂️ Total services
  - 🖼️ Gallery image count
- **Revenue** generated
- **Account age** (created date)
- **Quick actions** (view page)

#### Search & Filter
- Search by business name, email, or slug
- Real-time filtering

## Access Control

### Who Can Access?
- Only users with `is_admin = true` can access `/admin`
- Non-admin users are redirected to their dashboard
- Unauthenticated users are redirected to login

### Security
- RLS policies ensure admins can view all merchant data
- Regular users can only see their own data
- Admin flag is database-controlled

## Navigation

Admin users will see a "Admin" menu item in their sidebar with a shield icon (🛡️). This link only appears if the user has admin privileges.

## Database Views

The migration creates an `admin_merchant_stats` view that aggregates:
- Booking counts
- Customer counts
- Service counts
- Staff counts
- Gallery image counts
- Total revenue
- Last booking date

This view is optimized for admin dashboard queries.

## Usage Example

### Making Yourself an Admin

```sql
-- Find your user ID (matches your merchants ID)
SELECT id, email FROM merchants WHERE email = 'your-email@example.com';

-- Promote to admin
UPDATE merchants SET is_admin = true WHERE id = 'your-user-id';
```

### Removing Admin Access

```sql
UPDATE merchants SET is_admin = false WHERE email = 'user@example.com';
```

### Viewing Admin Users

```sql
SELECT id, email, business_name, created_at
FROM merchants
WHERE is_admin = true;
```

## Screenshots

### Dashboard Overview
Shows aggregate platform statistics and quick metrics.

### Merchant List
Searchable table with detailed statistics for each merchant.

### Individual Merchant Stats
Color-coded badges for quick visual reference:
- Blue: Orders/Bookings
- Purple: Customers
- Green: Services
- Orange: Gallery Images

## Future Enhancements

Potential features for future releases:
- [ ] Merchant activity logs
- [ ] Export data to CSV
- [ ] Merchant suspension/activation
- [ ] Revenue analytics charts
- [ ] Storage usage tracking
- [ ] Email notifications to merchants
- [ ] Platform-wide announcements
- [ ] Merchant subscription management
