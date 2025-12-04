# 🎨 SHOWCASE GRID THEME - REDESIGN PLAN (Premium Pet Store Style)

## ✅ ĐÃ HOÀN THÀNH

### 1. **Hero Section** - Typography Độc Đáo
**File**: `src/components/booking/themes/showcasegrid/HeroSection.tsx`

**Thay đổi:**
- ✅ Chữ viết tay cursive cho description (Dancing Script font)
- ✅ BOLD UPPERCASE title (text-8xl, font-black)
- ✅ Logo ở giữa, dưới title
- ✅ CTA button lớn, center: "Khám Phá Ngay"
- ✅ Overlay nhẹ (from-transparent to-black/40)
- ✅ 3 ảnh slideshow lướt ngang mỗi 5s

### 2. **About Section** - Giới Thiệu
**File**: `src/components/booking/themes/showcasegrid/AboutSection.tsx` (MỚI)

**Nội dung:**
- ✅ Tiêu đề "Giới Thiệu" với blue underline
- ✅ Full description text
- ✅ Logo watermark opacity 30%

### 3. **Database & Upload**
- ✅ 3 cover images fields: `cover_image_1`, `cover_image_2`, `cover_image_3`
- ✅ Dashboard upload UI (blue box với 3 fields)
- ✅ URL conversion trong booking page

---

## 🚧 CẦN LÀM TIẾP

### 4. **Gallery Section** - Circular Images Style
**File**: `src/components/booking/themes/showcasegrid/GallerySection.tsx`

**Redesign cần:**
```tsx
// Thay grid masonry thành circular grid
<div className="grid grid-cols-2 md:grid-cols-3 gap-8">
  {gallery.slice(0, 6).map((image) => (
    <div className="flex flex-col items-center">
      {/* Circular Image */}
      <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[accentColor]">
        <img src={image.image_url} className="w-full h-full object-cover" />
      </div>
      {/* Title Below */}
      <h3 className="text-xl font-bold mt-4">{image.title}</h3>
      <p className="text-sm opacity-70">{image.description}</p>
    </div>
  ))}
</div>
```

**Style như**: Hình #2 bạn gửi - "Dành cho chó cưng", "Dành cho mèo cưng", "Dành cho chim"

---

### 5. **Services Section** - Product Card Style
**File**: `src/components/booking/themes/showcasegrid/WorkSection.tsx`

**Redesign cần:**
```tsx
// Grid cards thay vì alternating layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {services.map((service) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all">
      {/* Discount Badge */}
      {service.discount && (
        <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded text-sm font-bold">
          -{service.discount}%
        </div>
      )}

      {/* Service Image */}
      <img src={service.image_url} className="w-full aspect-square object-cover" />

      {/* Service Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold">{service.name}</h3>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-2xl font-bold text-orange-500">{formatPrice(service.price)}</span>
          {service.originalPrice && (
            <span className="text-sm line-through text-gray-400">{formatPrice(service.originalPrice)}</span>
          )}
        </div>
        <button className="w-full mt-4 bg-[accentColor] text-white py-2 rounded-lg font-bold hover:scale-105">
          Book Now
        </button>
      </div>
    </div>
  ))}
</div>
```

**Style như**: Hình #3 bạn gửi - Product cards với giá, discount badge, và button

---

### 6. **Products Section** (MỚI)
**File**: `src/components/booking/themes/showcasegrid/ProductsSection.tsx` (CHƯA TẠO)

**Cần tạo component mới:**
- Copy style từ Services section
- Hiển thị products từ `data.products`
- Có quantity selector
- Add to cart button

---

### 7. **Contact Section** (MỚI)
**File**: `src/components/booking/themes/showcasegrid/ContactSection.tsx` (CHƯA TẠO)

**Nội dung cần:**
```tsx
<section className="py-20 px-6 bg-gray-100">
  <div className="max-w-4xl mx-auto">
    <h2 className="text-4xl font-bold text-center mb-8">Liên Hệ</h2>
    <div className="grid md:grid-cols-2 gap-8">
      {/* Contact Info */}
      <div>
        <h3>Địa Chỉ</h3>
        <p>{merchant.address}</p>
        <p>{merchant.city}, {merchant.state}</p>

        <h3 className="mt-4">Điện Thoại</h3>
        <p>{merchant.phone}</p>

        <h3 className="mt-4">Email</h3>
        <p>{merchant.email}</p>

        {/* Social Links */}
        <div className="flex gap-4 mt-4">
          {socialLinks.map((link) => (
            <a href={link.url} className="text-[accentColor]">
              <Icon />
            </a>
          ))}
        </div>
      </div>

      {/* Google Maps */}
      <div>
        {merchant.google_maps_url && (
          <iframe src={merchant.google_maps_url} className="w-full h-full" />
        )}
      </div>
    </div>
  </div>
</section>
```

---

### 8. **Main Theme File** - Import Sections
**File**: `src/components/booking/themes/showcasegrid/index.tsx`

**Cần thêm imports:**
```tsx
import { ShowcaseGridAboutSection } from "./AboutSection";
import { ShowcaseGridProductsSection } from "./ProductsSection";
import { ShowcaseGridContactSection } from "./ContactSection";

// Trong return:
<ShowcaseGridHeroSection ... />
<ShowcaseGridAboutSection merchant={data.merchant} colors={showcaseColors} />
<ShowcaseGridGallerySection ... />
<ShowcaseGridWorkSection ... />
<ShowcaseGridProductsSection products={data.products} colors={showcaseColors} cart={cart} ... />
<ShowcaseGridContactSection merchant={data.merchant} socialLinks={data.socialLinks} colors={showcaseColors} />
```

---

## 📝 CHECKLIST HOÀN THÀNH

- [x] Hero - Typography đẹp
- [x] About Section
- [x] 3 Cover Images Upload
- [ ] Gallery - Circular Images
- [ ] Services - Product Card Style
- [ ] Products Section
- [ ] Contact Section
- [ ] Update main theme file

---

## 🎨 DESIGN REFERENCES

1. **Pet Love Store** (Hình #1, #2):
   - Chữ viết tay + BOLD UPPERCASE
   - Circular category images
   - White background, clean

2. **Product Cards** (Hình #3):
   - Discount badges (-25%)
   - Product image + name + price
   - Orange accent color
   - "Add to cart" buttons

3. **Color Palette**:
   - Primary: #1A1A1A (Deep Charcoal)
   - Secondary: #F0F0F0 (Light Gray)
   - Accent: #007AFF (Vibrant Blue)
   - Orange for discounts: #FF6B35

---

## 🚀 NEXT STEPS

Bạn muốn tôi:
1. ✅ Continue coding các sections còn lại?
2. ✅ Tạo Products Section component?
3. ✅ Tạo Contact Section component?
4. ✅ Update Gallery thành circular style?

**Hoặc bạn muốn test Hero mới trước?**
