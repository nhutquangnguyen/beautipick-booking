# Quick Test Instructions

## Step 1: Find Your Merchant Slug

Your merchant booking page URL is: `http://localhost:3000/{your-slug}`

To find your slug:

1. **Login to dashboard:**
   - Go to: `http://localhost:3000/login`
   - Login with your credentials

2. **Check Business Info:**
   - Go to: Dashboard → Business Info
   - Look for "Slug" field (e.g., "my-salon", "beautyspa", etc.)

## Step 2: Select a Theme

1. **Go to Design Settings:**
   - Dashboard → Design (or Themes)

2. **Choose ONLY Luxury or Classic** (for now):
   - ✅ **Luxury** - Works (implemented)
   - ✅ **Classic** - Works (implemented)
   - ❌ Modern - Falls back to Classic (not implemented yet)
   - ❌ Minimal - Falls back to Classic (not implemented yet)
   - ❌ Portfolio - Falls back to Classic (not implemented yet)

3. **Save the theme**

## Step 3: View Your Booking Page

Visit: `http://localhost:3000/{your-slug}`

Examples:
- `http://localhost:3000/my-salon`
- `http://localhost:3000/beautyspa`
- `http://localhost:3000/glamour-studio`

## Troubleshooting

### Error: "Can't reach this page"

**Possible causes:**

1. **Merchant doesn't exist or is inactive**
   - Check that your merchant account `is_active = true` in database
   - Verify the slug is correct

2. **Wrong slug**
   - Check Dashboard → Business Info for the correct slug
   - Slug is case-sensitive and must match exactly

3. **Theme not supported**
   - If you selected Modern/Minimal/Portfolio, it will fallback to Classic theme
   - Try selecting Luxury or Classic explicitly

### How to Check Database

Open Supabase Dashboard and run:

```sql
-- Check your merchants
SELECT id, business_name, slug, is_active, theme FROM merchants;

-- Get your merchant's theme
SELECT theme FROM merchants WHERE slug = 'your-slug';
```

### How to Force a Theme

If you want to test a specific theme, update the database:

```sql
-- Set to Luxury theme
UPDATE merchants
SET theme = '{"themeId":"opulence","layoutTemplate":"luxury","primaryColor":"#D4AF37","secondaryColor":"#0A0A0A","accentColor":"#F7E7CE","backgroundColor":"#FAFAF9","textColor":"#0A0A0A","fontFamily":"Playfair Display","borderRadius":"none","buttonStyle":"outline","headerStyle":"overlay","contentOrder":["video","about","services","gallery","contact","social","products"],"showSectionTitles":true}'::jsonb
WHERE slug = 'your-slug';

-- Set to Classic theme
UPDATE merchants
SET theme = '{"themeId":"distinguished","layoutTemplate":"classic","primaryColor":"#B85450","secondaryColor":"#2C2C2C","accentColor":"#C19A6B","backgroundColor":"#F5F3F0","textColor":"#2C2C2C","fontFamily":"Crimson Text","borderRadius":"sm","buttonStyle":"solid","headerStyle":"stacked","contentOrder":["about","services","gallery","products","contact","social","video"],"showSectionTitles":true}'::jsonb
WHERE slug = 'your-slug';
```

## Check Dev Server Logs

Look at your terminal where dev server is running for any errors.

## Quick Test URLs

Assuming default merchant slug is "demo-salon":

- Luxury: `http://localhost:3000/demo-salon` (with luxury theme selected)
- Classic: `http://localhost:3000/demo-salon` (with classic theme selected)

---

**Next: Once you access the page, check the browser console (F12) for any errors.**
