# Pricing Tiers Implementation - Complete Guide

## 🎉 Implementation Summary

A complete pricing tier system has been implemented for BeautiPick with **Free** and **Pro** plans, without payment integration (admin-managed upgrades for now).

---

## 📊 Pricing Tiers

### Free Plan
- **Price**: $0 (never expires)
- **Limits**:
  - 100 services
  - 100 products
  - 20 gallery images
  - 10 Starter theme pack
  - 100MB storage
- **Features**: Basic starter themes only

### Pro Plan
- **Price**:
  - 200,000 VND/month (monthly billing)
  - 1,920,000 VND/year (annual billing, saves 480k VND)
- **Limits**:
  - Unlimited services
  - Unlimited products
  - 500 gallery images
  - All theme packs unlocked
  - 2.5GB storage
- **Features**:
  - `all_themes` - Access to all premium themes
  - `custom_domain` - Use your own domain
  - `remove_branding` - White-label solution

---

## 🗄️ Database Schema

### Created Tables

#### 1. `pricing_tiers`
Stores tier definitions (Free, Pro).

**Key Fields:**
- `tier_key`: 'free' | 'pro'
- `tier_name`, `tier_name_vi`: Display names (EN/VI)
- `price_monthly`, `price_annual`: Pricing in VND
- `max_services`, `max_products`, `max_gallery_images`, `max_themes`: Quota limits (-1 = unlimited)
- `features`: JSONB array of feature flags

#### 2. `merchant_subscriptions`
Tracks which tier each merchant is on.

**Key Fields:**
- `merchant_id`: FK to merchants (UNIQUE)
- `pricing_tier_id`: FK to pricing_tiers
- `status`: 'active' | 'expired' | 'cancelled'
- `subscription_started_at`: When subscription began
- `expires_at`: When Pro subscription expires (NULL for Free)
- `notes`: Admin notes

#### 3. `subscription_usage`
Caches current usage counts for fast quota checks.

**Key Fields:**
- `merchant_id`: FK to merchants (UNIQUE)
- `services_count`: Number of services created
- `products_count`: Number of products created
- `gallery_images_count`: Number of gallery images uploaded
- `storage_used_mb`: Storage used in MB

### Database Triggers

**Auto-update usage counts:**
- `increment_service_count()` / `decrement_service_count()` - On service insert/delete
- `increment_product_count()` / `decrement_product_count()` - On product insert/delete
- `increment_gallery_count()` / `decrement_gallery_count()` - On gallery insert/delete

**Auto-assign Free tier:**
- `auto_assign_free_tier()` - Runs after merchant insert, creates Free subscription + initializes usage

### Migrations Created

1. `20251206000001_create_pricing_tiers.sql`
2. `20251206000002_create_merchant_subscriptions.sql`
3. `20251206000003_create_subscription_usage.sql`
4. `20251206000004_seed_pricing_tiers.sql`
5. `20251206000005_auto_assign_free_tier.sql`

---

## 📁 File Structure

### Core Library (`src/lib/pricing/`)

#### `tiers.ts`
Helper functions for tier management:
- `getTierByKey(tierKey)` - Get tier by 'free' or 'pro'
- `getAllTiers()` - Get all active tiers
- `hasFeature(tier, feature)` - Check if tier has a feature
- `getTierLimits(tier)` - Get all limits for a tier
- `isUnlimited(limit)` - Check if limit is -1
- `formatLimit(limit)` - Format for display ("Unlimited" or number)
- `calculateExpirationDate(tierKey, billingCycle)` - Calculate when subscription expires

#### `subscriptions.ts`
Subscription management functions:
- `getCurrentSubscription(merchantId)` - Get current subscription with tier data
- `isSubscriptionActive(subscription)` - Check if subscription is active and not expired
- `createSubscription(merchantId, tierKey, billingCycle, notes)` - Create new subscription
- `upgradeSubscription(merchantId, newTierKey, billingCycle, notes)` - Upgrade to new tier
- `extendSubscription(merchantId, months, notes)` - Extend subscription (admin)
- `cancelSubscription(merchantId, notes)` - Cancel subscription
- `downgradeExpiredSubscriptions()` - Cron job to downgrade expired Pro to Free

#### `enforcement.ts`
Quota checking and enforcement:
- `getUsageStats(merchantId)` - Get current usage counts
- `canCreateService(merchantId)` - Check if can create service
- `canCreateProduct(merchantId)` - Check if can create product
- `canUploadImage(merchantId)` - Check if can upload gallery image
- `hasFeatureAccess(merchantId, feature)` - Check if has feature access
- `getQuotaInfo(merchantId)` - Get comprehensive quota info with percentages

### Server Actions (`src/app/actions/`)

#### `services.ts`
- `createService(formData)` - Create service with quota check
- `deleteService(serviceId)` - Delete service (auto-updates usage)

#### `products.ts`
- `createProduct(formData)` - Create product with quota check
- `deleteProduct(productId)` - Delete product (auto-updates usage)

#### `gallery.ts`
- `createGalleryImage(formData)` - Upload image with quota check
- `deleteGalleryImage(imageId)` - Delete image (auto-updates usage)

### API Routes (`src/app/api/subscriptions/`)

#### `GET /api/subscriptions/current`
Returns current subscription and quota info for authenticated merchant.

**Response:**
```json
{
  "subscription": {
    "id": "uuid",
    "status": "active",
    "tier": {
      "key": "pro",
      "name": "Pro",
      "nameVi": "Pro"
    },
    "startedAt": "2024-12-06T...",
    "expiresAt": "2025-01-06T...",
    "notes": null
  },
  "quota": {
    "services": { "used": 5, "limit": -1, "unlimited": true, "percentage": 0 },
    "products": { "used": 10, "limit": -1, "unlimited": true, "percentage": 0 },
    "gallery": { "used": 45, "limit": 500, "unlimited": false, "percentage": 9 }
  }
}
```

#### `POST /api/subscriptions/upgrade`
Admin-only endpoint to upgrade a merchant's subscription.

**Request Body:**
```json
{
  "merchantId": "uuid",
  "tierKey": "pro",
  "billingCycle": "monthly",
  "notes": "Promotional upgrade"
}
```

**Response:**
```json
{
  "success": true,
  "subscription": {
    "id": "uuid",
    "merchantId": "uuid",
    "tierKey": "pro",
    "status": "active",
    "startedAt": "2024-12-06T...",
    "expiresAt": "2025-01-06T...",
    "notes": "Promotional upgrade"
  }
}
```

### UI Components (`src/components/billing/`)

#### `usage-metrics.tsx`
Displays usage statistics with progress bars.

**Props:**
```typescript
interface UsageMetricsProps {
  quota: {
    services: { used: number; limit: number; unlimited: boolean; percentage: number };
    products: { used: number; limit: number; unlimited: boolean; percentage: number };
    gallery: { used: number; limit: number; unlimited: boolean; percentage: number };
  };
}
```

**Features:**
- Progress bars with color coding (green < 75%, yellow < 90%, red >= 90%)
- Shows "Unlimited" for Pro tier features
- Displays percentage for limited resources

#### `upgrade-prompt.tsx`
Modal shown when user hits a limit.

**Props:**
```typescript
interface UpgradePromptProps {
  feature: "services" | "products" | "gallery";
  onClose?: () => void;
}
```

**Features:**
- Shows limit reached message
- "Cancel" and "Upgrade to Pro" buttons
- Currently shows "Contact admin" alert (will integrate payment later)

### Dashboard Page (`src/app/dashboard/billing/`)

#### `page.tsx`
Main billing dashboard showing:
- Current plan (Free or Pro)
- Subscription status (Active/Expired)
- Expiration date (if Pro)
- Upgrade button (if Free)
- Usage metrics with progress bars

---

## 🌍 Translations

### Added to `messages/en.json` and `messages/vi.json`:

```json
"billing": {
  "title": "Subscription & Billing",
  "subtitle": "Manage your plan and usage",
  "currentPlan": "Current Plan",
  "status": "Status",
  "active": "Active",
  "expired": "Expired",
  "free": "Free Plan",
  "pro": "Pro Plan",
  "expiresOn": "Expires on",
  "neverExpires": "Never expires",
  "usage": "Usage",
  "usageStats": "Usage Statistics",
  "servicesUsed": "{used} of {limit} services",
  "productsUsed": "{used} of {limit} products",
  "galleryUsed": "{used} of {limit} images",
  "unlimited": "Unlimited",
  "limitReached": "Limit Reached",
  "upgradeNow": "Upgrade to Pro",
  "contactAdmin": "Contact admin to upgrade",
  "upgradeToPro": "Upgrade to Pro",
  "upgradePromptTitle": "Upgrade to unlock more",
  "upgradePromptMessage": "You've reached your {feature} limit...",
  "servicesLimit": "services",
  "productsLimit": "products",
  "galleryLimit": "gallery images",
  "features": "Features",
  "upgradeSuccess": "Successfully upgraded to Pro!",
  "upgradeError": "Failed to upgrade. Please try again."
}
```

---

## 🚀 How It Works

### 1. New User Signup Flow

```
User signs up (OAuth or email)
    ↓
Merchant record created in database
    ↓
Trigger: auto_assign_free_tier() fires
    ↓
Creates merchant_subscriptions record (Free tier, never expires)
    ↓
Creates subscription_usage record (all counts = 0)
    ↓
User redirected to dashboard with Free plan active
```

### 2. Quota Enforcement Flow

```
User tries to create a service
    ↓
Server action: createService() called
    ↓
Check: canCreateService(merchantId)
    ↓
Gets current subscription + usage
    ↓
If Free tier: Check if services_count < 100
If Pro tier: Always allowed (unlimited)
    ↓
If limit reached: Return error with limitReached flag
If allowed: Insert service into database
    ↓
Trigger: increment_service_count() fires
    ↓
Updates subscription_usage.services_count += 1
    ↓
Success response returned to client
```

### 3. Pro Upgrade Flow (Admin Manual)

```
Admin navigates to merchant management
    ↓
Admin calls: POST /api/subscriptions/upgrade
Body: { merchantId, tierKey: "pro", billingCycle: "monthly" }
    ↓
Server checks if user is admin
    ↓
Calls: upgradeSubscription(merchantId, "pro", "monthly")
    ↓
Calculates expires_at = NOW() + 1 month
    ↓
Updates merchant_subscriptions:
  - pricing_tier_id = Pro tier ID
  - expires_at = calculated date
  - status = "active"
    ↓
Merchant now has Pro access (unlimited services/products)
    ↓
Success response returned
```

### 4. Expiration Check (Cron Job)

```
Scheduled task runs daily (or on-demand)
    ↓
Calls: downgradeExpiredSubscriptions()
    ↓
Finds all subscriptions where:
  - status = "active"
  - expires_at < NOW()
  - expires_at IS NOT NULL
    ↓
For each expired subscription:
  - Set pricing_tier_id = Free tier ID
  - Set status = "expired"
  - Set expires_at = NULL
  - Add note: "Automatically downgraded..."
    ↓
Merchants now on Free tier (quota limits applied)
```

---

## 🔧 How to Use

### For Merchants:

1. **View Subscription**: Navigate to `/dashboard/billing`
2. **Check Usage**: See progress bars for services, products, gallery images
3. **Upgrade**: Click "Upgrade to Pro" → Contact admin message shown (payment integration pending)

### For Admins:

1. **Upgrade a Merchant**:
```bash
curl -X POST /api/subscriptions/upgrade \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "merchantId": "uuid-here",
    "tierKey": "pro",
    "billingCycle": "monthly",
    "notes": "Promotional upgrade for early adopter"
  }'
```

2. **Extend a Subscription**:
```typescript
import { extendSubscription } from "@/lib/pricing/subscriptions";

// Extend by 3 months
await extendSubscription(
  merchantId,
  3,
  "Extended as customer appreciation"
);
```

3. **Check Expired Subscriptions** (Manual run):
```typescript
import { downgradeExpiredSubscriptions } from "@/lib/pricing/subscriptions";

const downgradedCount = await downgradeExpiredSubscriptions();
console.log(`Downgraded ${downgradedCount} expired subscriptions`);
```

---

## 🔄 Migration Guide

### Apply Migrations

```bash
# Navigate to project root
cd /Users/product/Projects/ck_projects/beautipick-booking

# Apply migrations via Supabase CLI
supabase db push

# Or apply manually via Supabase Dashboard:
# 1. Go to SQL Editor
# 2. Run each migration file in order (20251206000001 → 20251206000005)
```

### Migrate Existing Merchants

If you have existing merchants, they need subscriptions:

```sql
-- This will auto-assign Free tier to all existing merchants without subscriptions
INSERT INTO merchant_subscriptions (merchant_id, pricing_tier_id, status, subscription_started_at, expires_at, notes)
SELECT
  m.id,
  (SELECT id FROM pricing_tiers WHERE tier_key = 'free' LIMIT 1),
  'active',
  NOW(),
  NULL,
  'Auto-assigned during migration'
FROM merchants m
WHERE NOT EXISTS (
  SELECT 1 FROM merchant_subscriptions WHERE merchant_id = m.id
);

-- Initialize usage for existing merchants
INSERT INTO subscription_usage (merchant_id, services_count, products_count, gallery_images_count, storage_used_mb)
SELECT
  m.id,
  COALESCE((SELECT COUNT(*) FROM services WHERE merchant_id = m.id), 0),
  COALESCE((SELECT COUNT(*) FROM products WHERE merchant_id = m.id), 0),
  COALESCE((SELECT COUNT(*) FROM gallery WHERE merchant_id = m.id), 0),
  0
FROM merchants m
WHERE NOT EXISTS (
  SELECT 1 FROM subscription_usage WHERE merchant_id = m.id
);
```

---

## 📝 TypeScript Types

All new types are defined in `src/types/database.ts`:

```typescript
import { Database } from "@/types/database";

type PricingTier = Database["public"]["Tables"]["pricing_tiers"]["Row"];
type MerchantSubscription = Database["public"]["Tables"]["merchant_subscriptions"]["Row"];
type SubscriptionUsage = Database["public"]["Tables"]["subscription_usage"]["Row"];
```

---

## 🎨 UI Integration

### Update Service Form Component

To use the new server actions with quota checks, update your components:

```typescript
// Before (direct Supabase insert)
const { error } = await supabase.from("services").insert({ ... });

// After (with quota check)
import { createService } from "@/app/actions/services";

const result = await createService({
  name: "Haircut",
  description: "Professional haircut",
  duration_minutes: 60,
  price: 50000,
  category: "Hair"
});

if (result.limitReached) {
  // Show upgrade prompt
  setShowUpgradePrompt(true);
} else if (result.error) {
  // Show error message
  setError(result.error);
} else {
  // Success
  router.refresh();
}
```

---

## 🔮 Future Enhancements

### Phase 2: Payment Integration (Stripe)

1. Install Stripe SDK
2. Create checkout session API
3. Handle webhooks for subscription events
4. Auto-upgrade on successful payment
5. Handle failed payments and retries

### Phase 3: Advanced Features

1. **Proration**: Handle mid-cycle upgrades/downgrades
2. **Invoicing**: Generate PDF invoices
3. **Usage-based billing**: Track API calls, storage, etc.
4. **Team plans**: Multi-user subscriptions
5. **Discounts/Coupons**: Promotional codes
6. **Trials**: Free trial periods for Pro tier

### Phase 4: Analytics

1. **MRR Dashboard**: Track monthly recurring revenue
2. **Churn Analysis**: Monitor cancellations
3. **Conversion Tracking**: Free → Pro conversion rate
4. **Usage Analytics**: Feature adoption by tier

---

## 🐛 Troubleshooting

### Issue: Usage counts are incorrect

**Solution**: Run reconciliation query
```sql
UPDATE subscription_usage su
SET
  services_count = (SELECT COUNT(*) FROM services WHERE merchant_id = su.merchant_id),
  products_count = (SELECT COUNT(*) FROM products WHERE merchant_id = su.merchant_id),
  gallery_images_count = (SELECT COUNT(*) FROM gallery WHERE merchant_id = su.merchant_id),
  updated_at = NOW();
```

### Issue: User can't create service despite being on Pro

**Checklist:**
1. Check subscription status: `SELECT * FROM merchant_subscriptions WHERE merchant_id = 'uuid'`
2. Check expiration: `expires_at` should be in the future or NULL
3. Check tier: `pricing_tier_id` should match Pro tier
4. Check RLS policies: User should be authenticated

### Issue: New merchants don't get Free tier

**Checklist:**
1. Check trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'assign_free_tier_on_merchant_create'`
2. Check function exists: `SELECT * FROM pg_proc WHERE proname = 'auto_assign_free_tier'`
3. Manually assign: Run migration script for existing merchants

---

## 📞 Support

For implementation questions or issues:
1. Check this documentation
2. Review database schema and RLS policies
3. Check server logs for errors
4. Verify migrations were applied correctly

---

**Last Updated**: December 6, 2024
**Version**: 1.0.0
**Status**: ✅ Complete - Ready for production
