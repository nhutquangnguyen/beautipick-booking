# Theme Try-On Feature

## Overview
The Theme Try-On feature allows Free tier users to preview premium themes with their actual merchant data without affecting their live booking page. The preview is accessible via a temporary URL that expires after 24 hours.

## How It Works

### For Users
1. **Free users** see locked premium themes in `/dashboard/themes`
2. Each locked theme has a **"Try it" button**
3. Clicking "Try it" generates a temporary preview link
4. The preview opens in a new tab with:
   - A purple banner indicating it's a preview
   - Their real merchant data (services, products, gallery, etc.)
   - The selected premium theme applied
   - An "Exit Preview" button to return to dashboard

### URL Structure
```
/try-on/[hash]/[slug]
```

- `hash`: A unique 32-character hex string (valid for 24 hours)
- `slug`: The merchant's page slug

### Example
```
/try-on/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6/sky-spa
```

## Database Migration Required

**IMPORTANT:** You need to run the migration to create the `theme_previews` table.

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the contents of `supabase/migrations/20251206073944_add_theme_previews_table.sql`
5. Paste into the SQL editor
6. Click **Run** or press `Ctrl+Enter`

### Option 2: Using Supabase CLI

If you have Supabase CLI set up and linked:

```bash
npx supabase db push
```

### Migration Details

The migration creates:
- `theme_previews` table with:
  - `id` (uuid, primary key)
  - `hash` (text, unique)
  - `merchant_id` (uuid, foreign key to merchants)
  - `theme_data` (jsonb)
  - `expires_at` (timestamptz)
  - `created_at`, `updated_at` (timestamptz)

- Indexes for performance:
  - `idx_theme_previews_hash`
  - `idx_theme_previews_merchant_id`
  - `idx_theme_previews_expires_at`

- Row Level Security (RLS) policies:
  - Users can create their own previews
  - Users can view their own previews
  - Public can view non-expired previews (for the try-on page)
  - Users can delete their own previews

- Cleanup function:
  - `delete_expired_theme_previews()` - Can be called manually or via cron

## API Endpoints

### POST /api/theme-preview
Creates a new theme preview.

**Request:**
```json
{
  "theme": {
    "themeId": "christmas-radiance",
    "layoutTemplate": "christmas",
    "primaryColor": "#8B5CF6",
    // ... other theme properties
  }
}
```

**Response:**
```json
{
  "hash": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "expiresAt": "2025-12-07T07:39:44.000Z"
}
```

### DELETE /api/theme-preview?hash=xxx
Deletes a preview (authenticated users only, can only delete their own).

## Components Modified

### 1. `/src/app/api/theme-preview/route.ts` (NEW)
- Handles creating and deleting theme previews
- Generates unique hash for each preview
- Sets 24-hour expiration

### 2. `/src/app/try-on/[hash]/[slug]/page.tsx` (NEW)
- Server component that renders the preview
- Validates hash and expiration
- Shows preview banner
- Renders booking page with preview theme

### 3. `/src/components/dashboard/design/layout-selector.tsx` (MODIFIED)
- Added `Eye` icon import
- Added `merchantId` and `merchantSlug` props
- Added `tryingOn` state to track loading
- Added `handleTryIt` function to create preview
- Added "Try it" button for locked themes (both layout level and color scheme level)
- Added "Select" button for unlocked color schemes

### 4. `/src/components/dashboard/design/design-form.tsx` (MODIFIED)
- Added `merchantSlug` state
- Added useEffect to fetch merchant slug
- Passed `merchantId` and `merchantSlug` to LayoutSelector

## Security Considerations

1. **RLS Policies**: Only authenticated users can create previews
2. **Expiration**: All previews expire after 24 hours
3. **Hash Validation**: Uses cryptographically secure random bytes
4. **Merchant Validation**: Verifies merchant slug matches the hash

## Cleanup

To manually clean up expired previews, run this SQL command in Supabase:

```sql
SELECT delete_expired_theme_previews();
```

You can also set up a cron job (requires pg_cron extension) to run this automatically:

```sql
SELECT cron.schedule(
  'delete-expired-previews',
  '0 2 * * *',  -- Daily at 2 AM
  $$SELECT delete_expired_theme_previews()$$
);
```

## Testing

1. Create a Free tier merchant account
2. Go to `/dashboard/themes`
3. You should see "Pro" badges on premium themes
4. Click "Try it" on any locked theme
5. A new tab should open with the preview
6. Verify:
   - Preview banner is visible at the top
   - Theme is applied correctly
   - Merchant data is displayed
   - "Exit Preview" button works

## Future Enhancements

- Email preview link to users
- Save favorite theme previews
- Share preview with team members
- Compare multiple themes side-by-side
- Track which themes are most previewed
