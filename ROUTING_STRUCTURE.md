# BeautiPick Routing Structure

## 📁 Current URL Structure

```
www.beautipick.com/
├── /                        → Customer directory homepage (B2C)
│                             - Browse salons
│                             - Featured merchants
│                             - Search bar
│
├── /search                  → Search & filter salons
│                             - City/district filters
│                             - Service type filters
│                             - Pagination
│
├── /m/[slug]                → Public merchant profile
│                             - Services & products
│                             - Gallery
│                             - Book button → merchant page
│
├── /business                → Merchant marketing landing (B2B)
│                             - Features & pricing
│                             - Sign up CTA
│                             - Testimonials
│
├── /signup                  → Merchant signup form
├── /login                   → Merchant login
│
├── /dashboard               → Merchant dashboard
│   ├── /bookings
│   ├── /services
│   ├── /products
│   ├── /settings
│   └── ...
│
├── /customer                → Customer dashboard
│                             - View booking history
│                             - Favorites
│
└── /admin                   → Admin panel
```

---

## 🎯 Audience Separation

### **B2C (Customers)**
- `/` - Homepage/directory
- `/search` - Find salons
- `/m/[slug]` - Merchant profile
- `/customer` - Account dashboard

### **B2B (Merchants)**
- `/business` - Marketing landing
- `/signup` - Registration
- `/dashboard` - Main product

### **Admin**
- `/admin` - Admin panel

---

## 🔄 Navigation Flow

### **Customer Journey**
```
1. Land on / (directory)
2. Browse or search → /search
3. Click merchant → /m/[slug]
4. Book → Redirected to merchant's booking page ([slug].beautipick.com)
5. After booking → Create account → /customer
```

### **Merchant Journey**
```
1. Hear about BeautiPick
2. Visit /business (learn about features)
3. Sign up → /signup
4. Onboarding → /dashboard/onboarding
5. Use product → /dashboard
6. Listed in directory automatically → /
```

---

## 🧩 Components Structure

### **Shared Public Components**
```
src/components/
├── PublicHeader.tsx        ← Used on /, /search, /m/[slug]
├── PublicFooter.tsx        ← Used on /, /search, /m/[slug]
└── directory/
    ├── MerchantCard.tsx   ← Reusable merchant card
    └── SearchFilters.tsx  ← TODO: Search page filters
```

### **Page Structure**
```
src/app/
├── page.tsx               ← Directory homepage
├── search/
│   └── page.tsx           ← TODO: Search results
├── m/
│   └── [slug]/
│       └── page.tsx       ← TODO: Merchant profile
├── business/
│   └── page.tsx           ← Merchant landing
├── dashboard/             ← Existing merchant app
└── customer/              ← Existing customer dashboard
```

---

## 🔮 Future: Subdomain Strategy

**When you scale:**
```
www.beautipick.com          → Customer directory (B2C)
business.beautipick.com     → Merchant marketing site
merchant.beautipick.com     → Merchant dashboard
admin.beautipick.com        → Admin panel

[slug].beautipick.com       → Individual merchant booking pages
```

**Benefits:**
- Clear separation
- Better SEO
- Professional branding
- Easier to scale teams

**When to migrate:**
- After 100+ merchants
- When you have dedicated team
- When raising funding

---

## ✅ What's Done

- ✅ Directory homepage at `/`
- ✅ Merchant landing at `/business`
- ✅ Public header/footer components
- ✅ Database schema for directory
- ✅ Merchant card component
- ✅ Cross-linking between pages

## ⏳ What's TODO

- ⏳ Search page at `/search`
- ⏳ Merchant profile at `/m/[slug]`
- ⏳ Merchant directory controls in dashboard
- ⏳ SEO optimization
- ⏳ Analytics tracking

---

## 🚀 Testing URLs

After running migration and starting dev server:

```bash
# Customer pages
http://localhost:3000/              # Directory
http://localhost:3000/search        # Search (TODO)
http://localhost:3000/m/salon-abc   # Profile (TODO)

# Merchant pages
http://localhost:3000/business      # Marketing
http://localhost:3000/signup        # Signup
http://localhost:3000/dashboard     # Dashboard

# Customer account
http://localhost:3000/customer      # Account
```

---

## 📊 SEO Benefits of This Structure

### **Root Domain (`/`)**
- Gets most SEO juice
- Perfect for customer acquisition
- Easy to share/remember

### **Business Page (`/business`)**
- Targets "booking software" keywords
- B2B SEO separate from B2C
- Can have different meta tags

### **Merchant Profiles (`/m/[slug]`)**
- Each salon gets own URL
- Great for local SEO
- Backlinks help main domain

**Example SEO titles:**
```
/                    → "Tìm Salon Làm Đẹp Tốt Nhất | BeautiPick"
/m/glamour-studio    → "Glamour Studio - Hà Nội | BeautiPick"
/business            → "Phần Mềm Đặt Lịch Cho Salon | BeautiPick"
```

---

## 🎨 Design Consistency

All public pages share:
- Same header (logo, navigation, CTA)
- Same footer (links, copyright)
- Same color scheme (purple/pink gradient)
- Same typography
- Mobile-responsive

Merchant dashboard:
- Different layout (sidebar)
- Different branding
- Focused on functionality

---

## 💡 Next Steps

1. **This Week**: Build search page
2. **Next Week**: Build merchant profile pages
3. **Week 3**: Add merchant controls
4. **Week 4**: Launch!

Good luck! 🚀
