# BeautiPick Directory Implementation Guide

## 🎯 Goal: B2B SaaS + Simple Directory

Transform BeautiPick from pure B2B SaaS to a hybrid model with public merchant directory.

---

## ✅ What We've Built So Far

### 1. Database Schema
**File**: `supabase/migrations/20251211000000_add_directory_features.sql`

**Tables Created**:
- `merchant_directory_settings` - Controls merchant visibility in directory
- `customer_favorites` - Customers can save favorite merchants
- `directory_analytics` - Track views, clicks, favorites

**Auto-features**:
- New merchants automatically get directory settings
- RLS policies for security
- Indexes for performance

### 2. Directory Homepage
**Files Created**:
- `src/app/(public)/layout.tsx` - Public layout with header/footer
- `src/app/(public)/page.tsx` - Directory homepage
- `src/components/directory/MerchantCard.tsx` - Merchant card component

**Features**:
- Beautiful hero section with search
- Featured merchants section
- All merchants grid
- City filters
- CTA for merchant signup

---

## 🚀 Next Steps to Complete

### **Phase 1: Core Functionality (Week 2-3)**

#### 1. Run Database Migration
```bash
# Push migration to Supabase
npx supabase db push

# Or manually run the SQL in Supabase Dashboard
# Navigate to: SQL Editor > New query > Paste migration SQL
```

#### 2. Create Search Page
**File**: `src/app/(public)/search/page.tsx`

```typescript
// Features needed:
- Search by name/service
- Filter by city/district
- Filter by tags
- Sort options (name, newest, favorites)
- Pagination
```

#### 3. Create Public Merchant Profile
**File**: `src/app/(public)/m/[slug]/page.tsx`

```typescript
// What to show:
- Merchant info (name, address, phone)
- Services list
- Products/gallery
- Operating hours
- CTA button to booking page
- "Favorite" button
```

#### 4. Add Merchant Dashboard Controls
**File**: `src/app/dashboard/settings/directory/page.tsx`

```typescript
// Allow merchants to:
- Toggle directory visibility (is_listed)
- Edit directory description
- Add tags (nails, spa, massage, etc.)
- Select highlight services
- View directory analytics (views, clicks)
```

---

### **Phase 2: Polish & Launch (Week 3-4)**

#### 5. SEO Optimization
Add to each page:
```typescript
// Example for merchant profile
export async function generateMetadata({ params }): Promise<Metadata> {
  const merchant = await getMerchantBySlug(params.slug);
  return {
    title: `${merchant.business_name} - BeautiPick`,
    description: merchant.directory_description || `Đặt lịch tại ${merchant.business_name}`,
    openGraph: {
      images: [merchant.logo_url],
    },
  };
}
```

#### 6. Analytics Tracking
Add view/click tracking:
```typescript
// In merchant profile page
useEffect(() => {
  trackDirectoryView(merchantId);
}, [merchantId]);
```

#### 7. Customer Favorites
Connect favorite button to API:
```typescript
// src/app/api/favorites/route.ts
export async function POST(request: Request) {
  const { merchant_id } = await request.json();
  // Insert into customer_favorites
}
```

---

### **Phase 3: Additional Features (Week 4-6)**

#### 8. Merchant Dashboard Analytics
Show merchants:
- Total directory views
- Total clicks to booking page
- Conversion rate
- Traffic sources

#### 9. Featured Listings (Monetization)
Add admin controls:
```typescript
// src/app/admin/featured-merchants/page.tsx
// Allow admins to:
- Feature a merchant (set featured_until)
- Set display_order
- View featured merchants list
```

#### 10. Email Notifications
Send weekly digest to merchants:
- "Your salon got 150 views this week"
- "3 new favorites"
- Encourage them to stay active

---

## 📁 File Structure Reference

```
beautipick-booking/
├── supabase/
│   └── migrations/
│       └── 20251211000000_add_directory_features.sql ✓
│
├── src/
│   ├── app/
│   │   ├── (public)/                    # Public pages
│   │   │   ├── layout.tsx              ✓
│   │   │   ├── page.tsx                ✓ (Directory homepage)
│   │   │   ├── search/
│   │   │   │   └── page.tsx            ⏳ TODO
│   │   │   └── m/
│   │   │       └── [slug]/
│   │   │           └── page.tsx        ⏳ TODO
│   │   │
│   │   ├── dashboard/
│   │   │   └── settings/
│   │   │       └── directory/
│   │   │           └── page.tsx        ⏳ TODO
│   │   │
│   │   └── api/
│   │       ├── favorites/
│   │       │   └── route.ts            ⏳ TODO
│   │       └── directory-analytics/
│   │           └── route.ts            ⏳ TODO
│   │
│   └── components/
│       └── directory/
│           ├── MerchantCard.tsx        ✓
│           ├── SearchFilters.tsx       ⏳ TODO
│           └── FeaturedSection.tsx     ⏳ TODO
```

---

## 🔧 Quick Start Commands

```bash
# 1. Run migration
npx supabase db push

# 2. Generate updated TypeScript types
npx supabase gen types typescript --project-id YOUR_PROJECT > src/types/database.types.ts

# 3. Start dev server
npm run dev

# 4. Test the directory
# Open: http://localhost:3000 (should show directory homepage)
```

---

## 🎨 Design Principles

1. **Keep it Simple**
   - No complex features in v1
   - Focus on discovery, not booking
   - Click through to merchant page to book

2. **Mobile-First**
   - Most users browse on mobile
   - Touch-friendly cards
   - Fast loading

3. **SEO-Optimized**
   - Static pages where possible
   - Proper meta tags
   - Semantic HTML
   - Alt texts on images

4. **Performance**
   - Use Next.js Image
   - Lazy load images
   - Cache merchant listings
   - Limit results (24 per page)

---

## 💰 Future Monetization (Post-Launch)

### Phase 4 (Month 3-6):
1. **Featured Listings**: ₫500k/month
2. **Premium Placement**: Top of search results
3. **Badge System**: "Verified", "Top Rated"
4. **Analytics Plus**: Advanced insights ₫100k/month
5. **Ad Units**: Banner ads for products/suppliers

### Phase 5 (Month 6-12):
1. **Transaction Fees**: 2% for free tier merchants
2. **Customer Premium**: ₫49k/month for deals
3. **Booking Credits**: Merchants buy credits
4. **API Access**: For third-party integrations

---

## 📊 Success Metrics

Track these KPIs:

**Directory Health**:
- Listed merchants: Target 100 in month 1
- Monthly visitors: Target 10k in month 3
- Click-through rate: Target 20%

**Merchant Value**:
- Merchants getting traffic from directory: Target 80%
- Average views per merchant: Target 100/month
- Conversion (view → booking): Target 5%

**Revenue**:
- MRR from subscriptions: Target ₫30M
- Featured listing revenue: Target ₫5M (month 6)

---

## ⚠️ Important Notes

### Don't Build (Yet):
- ❌ Reviews/ratings (needs moderation)
- ❌ In-app booking (complexity)
- ❌ Messaging system
- ❌ Mobile apps
- ❌ Payment processing
- ❌ Recommendation engine

### Do Build:
- ✅ Simple directory listing
- ✅ Basic search/filter
- ✅ Customer accounts (view history)
- ✅ Merchant controls (opt-in/out)
- ✅ Basic analytics
- ✅ SEO optimization

---

## 🚨 Gotchas to Avoid

1. **Don't Over-Engineer**
   - Start with static pages
   - Add features based on user feedback
   - Ship fast, iterate

2. **RLS Security**
   - Test policies thoroughly
   - Don't expose sensitive data
   - Merchants can only see their data

3. **Performance**
   - Limit query results
   - Use pagination
   - Cache aggressively
   - Optimize images

4. **Mobile Experience**
   - Test on real devices
   - Touch targets ≥ 44px
   - Fast loading

---

## 📞 Support & Questions

If you get stuck:
1. Check Supabase docs for RLS policies
2. Test queries in Supabase SQL Editor
3. Use Next.js docs for routing
4. Check browser console for errors

---

## 🎯 Launch Checklist

Before going live:

**Technical**:
- [ ] Migration successful
- [ ] No TypeScript errors
- [ ] All pages load correctly
- [ ] Mobile responsive
- [ ] SEO meta tags added
- [ ] Images optimized
- [ ] RLS policies tested

**Content**:
- [ ] At least 20 merchants listed
- [ ] Merchant logos uploaded
- [ ] Directory descriptions written
- [ ] Tags added

**Legal**:
- [ ] Terms of service updated
- [ ] Privacy policy updated
- [ ] Merchant agreement (directory terms)

**Marketing**:
- [ ] Social media posts ready
- [ ] Email to existing merchants
- [ ] Landing page updated

---

## Next Immediate Steps

1. **Today**: Run migration, verify it works
2. **This Week**: Build search page
3. **Next Week**: Build merchant profile pages
4. **Week 3**: Add merchant dashboard controls
5. **Week 4**: Polish, SEO, launch!

Good luck! 🚀
